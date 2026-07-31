export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrlComponent(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error("That contains invalid percent-encoding.");
  }
}
