export function parseDuration(start: number, duration: number) {
  const START_RESTING_HOUR = 12;
  const END_RESTING_HOUR = 13;

  const firstTotalWorkingHour = START_RESTING_HOUR - start

  if (duration <= firstTotalWorkingHour || start >= END_RESTING_HOUR) {
    return [[start, start + duration]]
  }

  if (start >= START_RESTING_HOUR && start <= END_RESTING_HOUR) {
    return [[END_RESTING_HOUR, END_RESTING_HOUR + duration]]
  }

  return [[start, start + firstTotalWorkingHour], [END_RESTING_HOUR, END_RESTING_HOUR + (duration - firstTotalWorkingHour)]]
}
