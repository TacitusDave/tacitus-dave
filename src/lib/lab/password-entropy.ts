export interface EntropyResult {
  bits: number;
  poolSize: number;
  label: string;
  color: string;
}

export function analyzePassword(password: string): EntropyResult {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

  const bits = password.length === 0 || poolSize === 0 ? 0 : password.length * Math.log2(poolSize);

  let label: string;
  let color: string;
  if (bits === 0) {
    label = "Empty";
    color = "#898781";
  } else if (bits < 28) {
    label = "Very weak";
    color = "#d03b3b";
  } else if (bits < 36) {
    label = "Weak";
    color = "#ec835a";
  } else if (bits < 60) {
    label = "Reasonable";
    color = "#fab219";
  } else if (bits < 128) {
    label = "Strong";
    color = "#0ca30c";
  } else {
    label = "Very strong";
    color = "#0ca30c";
  }

  return { bits, poolSize, label, color };
}

export interface GeneratorOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
}

const CHAR_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

/** Cryptographically random, not Math.random — safe to actually use as a password. */
export function generatePassword(options: GeneratorOptions): string {
  const pool = (
    (options.lowercase ? CHAR_SETS.lowercase : "") +
    (options.uppercase ? CHAR_SETS.uppercase : "") +
    (options.digits ? CHAR_SETS.digits : "") +
    (options.symbols ? CHAR_SETS.symbols : "")
  );
  if (!pool) return "";

  const randomValues = crypto.getRandomValues(new Uint32Array(options.length));
  let password = "";
  for (let i = 0; i < options.length; i++) {
    password += pool[randomValues[i] % pool.length];
  }
  return password;
}
