export const formatSeconds = (seconds: number): string => {
  const total = Math.max(0, seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remaining = total % 60;

  const pad = (value: number): string => value.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(remaining)}`;
};
