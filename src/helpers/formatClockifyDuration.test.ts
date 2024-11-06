import { formatClockifyDuration } from './formatClockifyDuration'

it('should return formatted duration', () => {
  const duration = 'PT1H30M'
  const formattedDuration = formatClockifyDuration(duration)
  expect(formattedDuration).toBe('1H30M')
})
