// lib/calc.ts

export interface Selection {
  brandId: string;
  categoryId: string;
  pm25_per_unit: number;
  qty: number;
  daysPerWeek: number;
  isIndoor: boolean;
  brandName: string;
  companyLabel: string;
  categoryLabel: string;
  variant: string;
}

export interface CalcResult {
  daily_pm25_mg: number;
  effective_daily_pm25_mg: number;
  annual_pm25_g: number;
  ppi_score: number;
  breakdown: {
    brandId: string;
    brandName: string;
    companyLabel: string;
    categoryLabel: string;
    daily_mg: number;
    annual_g: number;
    share_pct: number;
  }[];
}

const INDOOR_MULTIPLIER = 3.5;

function calcPPIInternal(g: number): number {
  if (g <= 0)  return 0;
  if (g < 1)   return Math.round(g * 10);
  if (g < 5)   return Math.round(10 + (g - 1) * 10);
  if (g < 20)  return Math.round(50 + (g - 5) * 3.33);
  if (g < 50)  return Math.round(100 + (g - 20) * 1.67);
  if (g < 100) return Math.round(150 + (g - 50));
  if (g < 200) return Math.round(200 + (g - 100));
  return Math.min(500, Math.round(300 + (g - 200) * 0.67));
}

export function calculate(selections: Selection[]): CalcResult {
  if (selections.length === 0) {
    return { daily_pm25_mg: 0, effective_daily_pm25_mg: 0, annual_pm25_g: 0, ppi_score: 0, breakdown: [] };
  }

  const rows = selections.map(s => {
    const eff_days     = s.daysPerWeek / 7;
    const daily_mg     = s.pm25_per_unit * s.qty * eff_days;
    const indoor_adj   = s.isIndoor ? INDOOR_MULTIPLIER : 1;
    const daily_mg_eff = daily_mg * indoor_adj;
    const annual_g     = (daily_mg_eff * 365) / 1000;
    return { ...s, daily_mg, daily_mg_eff, annual_g };
  });

  const total_daily  = rows.reduce((a, r) => a + r.daily_mg, 0);
  const total_eff    = rows.reduce((a, r) => a + r.daily_mg_eff, 0);
  const total_annual = rows.reduce((a, r) => a + r.annual_g, 0);

  return {
    daily_pm25_mg:           total_daily,
    effective_daily_pm25_mg: total_eff,
    annual_pm25_g:           total_annual,
    ppi_score:               calcPPIInternal(total_annual),
    breakdown: rows.map(r => ({
      brandId:       r.brandId,
      brandName:     r.brandName,
      companyLabel:  r.companyLabel,
      categoryLabel: r.categoryLabel,
      daily_mg:      r.daily_mg,
      annual_g:      r.annual_g,
      share_pct:     total_annual > 0 ? (r.annual_g / total_annual) * 100 : 0,
    })),
  };
}

export function projections(annual_g: number) {
  return [1, 5, 10, 20].map(y => ({ years: y, total_g: annual_g * y }));
}

export function benchmarkEquiv(annual_g_total: number, rate_mg_per_unit: number): number {
  return Math.round((annual_g_total * 1000) / rate_mg_per_unit);
}
