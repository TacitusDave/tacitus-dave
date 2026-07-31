function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

export interface CaseConversions {
  camelCase: string;
  PascalCase: string;
  snake_case: string;
  "kebab-case": string;
  CONSTANT_CASE: string;
  "Title Case": string;
  lowercase: string;
  UPPERCASE: string;
}

export function convertCase(input: string): CaseConversions {
  const words = splitWords(input);
  const capitalize = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

  return {
    camelCase: words.map((w, i) => (i === 0 ? w : capitalize(w))).join(""),
    PascalCase: words.map(capitalize).join(""),
    snake_case: words.join("_"),
    "kebab-case": words.join("-"),
    CONSTANT_CASE: words.join("_").toUpperCase(),
    "Title Case": words.map(capitalize).join(" "),
    lowercase: words.join(" "),
    UPPERCASE: words.join(" ").toUpperCase(),
  };
}
