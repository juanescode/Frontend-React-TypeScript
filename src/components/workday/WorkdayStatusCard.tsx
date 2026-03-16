type WorkdayStatusCardProps = {
  timer: string;
  isActive: boolean;
  startTime: string | null;
  apiBaseUrl: string;
};

export function WorkdayStatusCard({ timer, isActive, startTime, apiBaseUrl }: WorkdayStatusCardProps) {
  return (
    <aside className="rounded-3xl border border-indigo-100 bg-linear-to-br from-slate-900 to-indigo-900 p-8 text-white shadow-xl shadow-indigo-300/30">
      <p className="text-xs font-semibold tracking-[0.2em] text-indigo-200">JORNADA ACTUAL</p>
      <p className="mt-3 text-5xl font-black tabular-nums">{timer}</p>
      <p className="mt-2 text-sm text-indigo-100">{isActive ? "En curso" : "Sin actividad"}</p>

      <div className="mt-8 space-y-3 rounded-2xl bg-white/10 p-4">
        <p className="text-xs uppercase tracking-widest text-indigo-200">Inicio</p>
        <p className="break-all text-sm font-medium">{startTime ?? "--"}</p>
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 p-4">
        <p className="text-xs uppercase tracking-widest text-indigo-200">Backend API</p>
        <p className="mt-2 break-all text-sm">{apiBaseUrl}</p>
      </div>
    </aside>
  );
}
