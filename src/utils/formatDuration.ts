export function formatDuration(ms: number) {
  const milliseconsInSecond = 1000
  const secondsInMinute = 60
  const minutesInHour = 60

  let seconds = Math.floor(ms / milliseconsInSecond)
  let minutes = Math.floor(seconds / secondsInMinute)
  const hours = Math.floor(minutes / minutesInHour)

  seconds = seconds % secondsInMinute
  minutes = minutes % minutesInHour

  const hoursFormatted = hours.toString().padStart(2, '0')
  const minutesFormatted = minutes.toString().padStart(2, '0')
  const secondsFormatted = seconds.toString().padStart(2, '0')

  return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`
}
