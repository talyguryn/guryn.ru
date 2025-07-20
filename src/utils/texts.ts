// for russian language
export function pluralize(
  count: number,
  forms: [string, string, string]
): string {
  const n = Math.abs(count);
  const n1 = n % 10;
  const n2 = n % 100;

  if (n1 === 1 && n2 !== 11) {
    return forms[0];
  } else if (n1 >= 2 && n1 <= 4 && (n2 < 10 || n2 >= 20)) {
    return forms[1];
  } else {
    return forms[2];
  }
}
