import dayjs from 'dayjs'

export const areTwoDatesEqual = (d1: string | Date, d2: string | Date) => {
  return dayjs(d1).isSame(dayjs(d2), 'day')
}
