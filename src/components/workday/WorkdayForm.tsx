type WorkdayFormProps = {
  workerCode: string;
  workerName: string;
  onWorkerCodeChange: (value: string) => void;
  onWorkerNameChange: (value: string) => void;
};

export function WorkdayForm({ workerCode, workerName, onWorkerCodeChange, onWorkerNameChange }: WorkdayFormProps) {
  return (
    <div className="mt-8 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="workerCode">
          Código único del trabajador
        </label>
        <input
          id="workerCode"
          value={workerCode}
          onChange={(event) => onWorkerCodeChange(event.target.value.toUpperCase())}
          placeholder="EMP-001"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:ring"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="workerName">
          Nombre (opcional al iniciar)
        </label>
        <input
          id="workerName"
          value={workerName}
          onChange={(event) => onWorkerNameChange(event.target.value)}
          placeholder="Juan Pérez"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:ring"
        />
      </div>
    </div>
  );
}
