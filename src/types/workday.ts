export type Worker = {
  id: number;
  code: string;
  name: string;
};

export type Workday = {
  id: number;
  workerId: number;
  startTime: string | null;
  endTime: string | null;
  totalSeconds: number | null;
};

export type WorkdayStatus = {
  isActive: boolean;
  startTime: string | null;
  elapsedSeconds: number;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
};
