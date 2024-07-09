import { ClockifyTimeEntry } from "@/types";

export function getDurationClockifyFromTimeEntry(timeEntry: ClockifyTimeEntry) {
  const start = new Date(timeEntry.timeInterval.start);
  const end = new Date(timeEntry.timeInterval.end);
  const duration = end.getTime() - start.getTime();
  return duration;
}
