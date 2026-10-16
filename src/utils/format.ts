/** Replace {key} tokens in a translated template. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
  key in vars ? String(vars[key]) : match
  );
}