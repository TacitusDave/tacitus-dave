import { mitreTactics, severityColor, hexToRgba, type Severity } from "@/lib/security-sim";

export interface TacticState {
  count: number;
  worstSeverity: Severity | null;
}

export function MitreMatrix({
  tacticStates,
}: {
  tacticStates: Record<string, TacticState>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {mitreTactics.map((tactic) => {
        const state = tacticStates[tactic.id] ?? { count: 0, worstSeverity: null };
        const active = state.count > 0 && state.worstSeverity !== null;

        return (
          <div
            key={tactic.id}
            className="rounded-md border border-border p-3 transition-colors duration-300"
            style={
              active
                ? {
                    borderColor: severityColor[state.worstSeverity as Severity],
                    backgroundColor: hexToRgba(severityColor[state.worstSeverity as Severity], 0.08),
                  }
                : undefined
            }
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
              {tactic.label}
            </p>
            <p className="mt-2 text-lg font-medium text-foreground">
              {state.count}
            </p>
          </div>
        );
      })}
    </div>
  );
}
