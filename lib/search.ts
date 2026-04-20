export function longestCommonSubstringLength(a: string, b: string): number {
  const left = normalizeSearchText(a);
  const right = normalizeSearchText(b);

  if (!left || !right) return 0;

  const previous = new Array(right.length + 1).fill(0);
  let best = 0;

  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = 0;
    for (let j = 1; j <= right.length; j += 1) {
      const aboveLeft = diagonal;
      diagonal = previous[j];

      if (left[i - 1] === right[j - 1]) {
        previous[j] = aboveLeft + 1;
        if (previous[j] > best) best = previous[j];
      } else {
        previous[j] = 0;
      }
    }
  }

  return best;
}

export function searchByName<T>(items: T[], query: string, getName: (item: T) => string): T[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return items;

  return items.filter(item =>
    longestCommonSubstringLength(getName(item), normalizedQuery) === normalizedQuery.length
  );
}

function normalizeSearchText(value: string): string {
  return value.toLocaleLowerCase().trim().replace(/\s+/g, " ");
}
