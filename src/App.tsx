import { useMemo, useState } from "react";
import { env } from "./config/env";
import { WorkdayActions } from "./components/workday/WorkdayActions";
import { WorkdayForm } from "./components/workday/WorkdayForm";
import { WorkdayStatusCard } from "./components/workday/WorkdayStatusCard";
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

          <WorkdayForm
            workerCode={workerCode}
            workerName={workerName}
            onWorkerCodeChange={setWorkerCode}
            onWorkerNameChange={setWorkerName}
          />

          <WorkdayActions canSubmit={canSubmit} onStart={handleStart} onEnd={handleEnd} onStatus={handleStatus} />

          <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{feedback}</p>
        </div>

        <WorkdayStatusCard timer={timer} isActive={isActive} startTime={startTime} apiBaseUrl={env.apiBaseUrl} />
      </section>
    </main>
  );
}

export default App;
