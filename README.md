# AQI Contribution Calculator

> **Calculate your contribution to AQI**
> A personal PM2.5 contribution calculator built with Next.js 14, Tailwind CSS, and TypeScript.

---

## What it does

1. **Pick your smoke sources** — 8 categories, 70+ brands grouped by manufacturer
2. **Choose specific brands** — with real tar/nicotine data and PM2.5 estimates per use
3. **Set daily intake** — quantity, days per week, indoors vs outdoors
4. **See your impact** — Personal Pollution Index (0–500), annual PM2.5 in grams, benchmark comparisons (cars, trucks, chimneys), 1/5/10/20-year projections
5. **Download a share card** — PNG card for social media
6. **Suggest missing brands** — form that POSTs to `/api/suggest`

---

## Stack

| Layer     | Tech                                    |
|-----------|-----------------------------------------|
| Framework | Next.js 14 (App Router)                 |
| Styling   | Tailwind CSS + custom CSS variables     |
| Language  | TypeScript (strict)                     |
| Animation | Tailwind keyframes + CSS transitions    |
| Export    | html2canvas (share card PNG download)   |
| Fonts     | Syne (display) + Inter (body) + DM Mono |

---

## Project structure

```
aqi-calc/
├── app/
│   ├── layout.tsx          — root layout + metadata
│   ├── page.tsx            — step orchestrator (landing → category → brand → quantity → results)
│   ├── globals.css         — CSS variables, fonts, base styles
│   └── api/
│       └── suggest/
│           └── route.ts    — POST /api/suggest (brand suggestion submission)
├── components/
│   ├── LandingScreen.tsx   — hero / entry screen
│   ├── StepBar.tsx         — progress indicator
│   ├── CategoryStep.tsx    — category selection cards (8 types)
│   ├── BrandStep.tsx       — company-grouped brand cards with PM2.5 bars
│   ├── QuantityStep.tsx    — qty stepper, days/week slider, indoor toggle
│   ├── ResultsScreen.tsx   — PPI gauge, stats, benchmarks, projections, lung callout
│   ├── ShareCard.tsx       — downloadable PNG share card
│   └── SuggestForm.tsx     — suggest a missing brand form
├── data/
│   └── catalog.ts          — full brand catalog (70+ brands), PPI bands, benchmarks, helpers
└── lib/
    └── calc.ts             — calculation engine (PM2.5 → annual grams → PPI score)
```

---

## Getting started

```bash
cd aqi-calc
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## PM2.5 algorithm

```
Cigarette/Bidi:
  PM2.5 (mg/stick) = tar_mg × 1.4 + nicotine_mg × 0.8 + paper_factor
  Sources: WHO TobLabNet, ICMR 2019

Hookah:
  PM2.5 (mg/session) = glycerin% × 3.2 + tobacco% × 4.5 + charcoal_factor
  Sources: Eissenberg et al. (2010), Shihadeh et al. (2012), CDC

Annual total:
  annual_g = (pm25_per_unit × qty × days_per_week/7 × indoor_multiplier × 365) / 1000
  indoor_multiplier = 3.5  (WHO; indoor PM2.5 concentration ~3–4× outdoor)

Personal Pollution Index (PPI):
  Logarithmic 0–500 scale mapping annual grams → score
  Mirrors AQI structure for familiarity
```

---

## Wiring up the suggestion API

Edit `app/api/suggest/route.ts`. Three options:

**Supabase:**
```ts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
await supabase.from("suggestions").insert(payload);
```

**Notion:**
```ts
const notion = new Client({ auth: process.env.NOTION_TOKEN });
await notion.pages.create({ parent: { database_id: DB_ID }, properties: { Name: { title: [{ text: { content: body.name } }] } } });
```

**Google Sheets (via googleapis):**
```ts
await sheets.spreadsheets.values.append({
  spreadsheetId: SHEET_ID,
  range: "Sheet1!A:F",
  valueInputOption: "RAW",
  requestBody: { values: [[body.name, body.category, body.description, body.tar, body.nicotine, new Date().toISOString()]] },
});
```

---

## Next features to build

- [ ] Year-on-year tracker (store results in localStorage, show trend chart)
- [ ] Passive smoke exposure screen (for people around the smoker)
- [ ] Per-brand health callouts (specific diseases linked to brand's tar level)
- [ ] City-level AQI comparison (your annual / city's population = % of city's AQI)
- [ ] Authentication + personal dashboard (Clerk / NextAuth)
- [ ] Admin panel to review/approve brand suggestions

---

## Disclaimer

All PM2.5 figures are estimates for educational awareness only.  
**We do not support or encourage smoking.**  
If you want to quit, please speak to a medical professional.
