export type DiffLineType = "equal" | "added" | "removed";

export interface DiffLine {
  type: DiffLineType;
  text: string;
}

/** O(n·m) time and space — fine for a browser tool, but guard against pathologically large inputs. */
export const MAX_DIFF_LINES = 2000;

export function diffLines(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const n = linesA.length;
  const m = linesB.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = linesA[i] === linesB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) {
      result.push({ type: "equal", text: linesA[i] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", text: linesA[i] });
      i += 1;
    } else {
      result.push({ type: "added", text: linesB[j] });
      j += 1;
    }
  }
  while (i < n) {
    result.push({ type: "removed", text: linesA[i] });
    i += 1;
  }
  while (j < m) {
    result.push({ type: "added", text: linesB[j] });
    j += 1;
  }

  return result;
}
