export function formatDuration(duration: number) {
  if (duration < 60) return `${duration.toFixed(0)} secs`;

  const minutes = duration / 60;
  if (minutes < 60) return `${minutes.toFixed(0)} mins`;

  const hours = minutes / 60;
  return `${hours.toFixed(0)} hours`;
}
