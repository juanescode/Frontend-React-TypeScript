type WorkdayActionsProps = {
  canSubmit: boolean;
  onStart: () => Promise<void>;
  onEnd: () => Promise<void>;
  onStatus: () => Promise<void>;
};

export function WorkdayActions({ canSubmit, onStart, onEnd, onStatus }: WorkdayActionsProps) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <button
        onClick={onStart}
        disabled={!canSubmit}
        className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Iniciar jornada
      </button>
      <button
        onClick={onEnd}
        disabled={!canSubmit}
        className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Terminar jornada
      </button>
      <button
        onClick={onStatus}
        disabled={!canSubmit}
        className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Consultar estado
      </button>
    </div>
  );
}
