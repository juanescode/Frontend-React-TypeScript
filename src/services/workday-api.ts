import { env } from "../config/env";
import type { Workday, WorkdayStatus, Worker } from "../types/workday";

type StartPayload = {
  workerCode: string;
  workerName?: string;
};

type EndPayload = {
  workerCode: string;
};

type WorkdayResponse = {
  worker: Worker;
  workday: Workday;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const json = (await response.json()) as { message: string; code?: string; data?: T };

  if (!response.ok) {
    const errorCode = json.code ? ` (${json.code})` : "";
    throw new Error(`${json.message}${errorCode}`);
  }

  return json.data as T;
};

export const workdayApi = {
  async start(payload: StartPayload): Promise<WorkdayResponse> {
    const response = await fetch(`${env.apiBaseUrl}/api/workdays/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<WorkdayResponse>(response);
  },

  async end(payload: EndPayload): Promise<WorkdayResponse> {
    const response = await fetch(`${env.apiBaseUrl}/api/workdays/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<WorkdayResponse>(response);
  },

  async status(workerCode: string): Promise<WorkdayStatus> {
    const response = await fetch(`${env.apiBaseUrl}/api/workdays/status/${workerCode}`);

    return parseResponse<WorkdayStatus>(response);
  },
};
