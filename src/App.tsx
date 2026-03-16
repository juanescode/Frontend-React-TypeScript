import { useMemo, useState } from "react";
import { env } from "./config/env";
import { workdayApi } from "./services/workday-api";
import { formatSeconds } from "./utils/time";

function App() {
  const [workerCode, setWorkerCode] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("Listo para iniciar jornada");

  const timer = useMemo(() => formatSeconds(elapsedSeconds), [elapsedSeconds]);

  const normalizedCode = workerCode.trim().toUpperCase();
  const canSubmit = normalizedCode.length >= 3 && !isLoading;

  const handleStart = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }

    try {
      setIsLoading(true);
      const data = await workdayApi.start({ workerCode: normalizedCode, workerName: workerName.trim() || undefined });
      setIsActive(true);
      setStartTime(data.workday.startTime);
      setElapsedSeconds(0);
      setFeedback(`Jornada iniciada para ${data.worker.name}`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No fue posible iniciar la jornada");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnd = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }

    try {
      setIsLoading(true);
      const data = await workdayApi.end({ workerCode: normalizedCode });
      setIsActive(false);
      setElapsedSeconds(data.workday.totalSeconds ?? 0);
      setFeedback(`Jornada finalizada. Total trabajado: ${formatSeconds(data.workday.totalSeconds ?? 0)}`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No fue posible finalizar la jornada");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatus = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }

    try {
      setIsLoading(true);
      const data = await workdayApi.status(normalizedCode);
      setIsActive(data.isActive);
      setElapsedSeconds(data.elapsedSeconds);
      setStartTime(data.startTime);
      setFeedback(data.isActive ? "Jornada activa encontrada" : "No hay jornada activa");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No fue posible consultar el estado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10">
      <section className="grid w-full gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/60 bg-white/75 p-8 shadow-xl shadow-slate-200/50 backdrop-blur">
          <p className="mb-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600">
            Control de jornadas
          </p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Registro de ingreso y egreso laboral</h1>
        
          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="workerCode">
                Código único del trabajador
              </label>
              <input
                id="workerCode"
                value={workerCode}
                onChange={(event) => setWorkerCode(event.target.value.toUpperCase())}
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
                onChange={(event) => setWorkerName(event.target.value)}
                placeholder="Juan Pérez"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:ring"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              onClick={handleStart}
              disabled={!canSubmit}
              className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Iniciar jornada
            </button>
            <button
              onClick={handleEnd}
              disabled={!canSubmit}
              className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Terminar jornada
            </button>
            <button
              onClick={handleStatus}
              disabled={!canSubmit}
              className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Consultar estado
            </button>
          </div>

          <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{feedback}</p>
        </div>

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
            <p className="mt-2 break-all text-sm">{env.apiBaseUrl}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
