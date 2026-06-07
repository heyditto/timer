/** Formats a millisecond duration as `MM:SS` (minutes can exceed 60). */
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.ceil(Math.max(0, milliseconds) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${pad(minutes)}:${pad(seconds)}`;
};
