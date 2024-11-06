import { parseDuration } from './parseDuration'

test('parseDuration', () => {
  const input = [
    {
      duration: 3,
      start: 9,
      expected: [[9, 12]],
    },
    {
      duration: 0.5,
      start: 9,
      expected: [[9, 9.5]],
    },
    {
      duration: 5,
      start: 9,
      expected: [
        [9, 12],
        [13, 15],
      ],
    },
    {
      duration: 3,
      start: 10,
      expected: [
        [10, 12],
        [13, 14],
      ],
    },
    {
      duration: 4,
      start: 10,
      expected: [
        [10, 12],
        [13, 15],
      ],
    },
    {
      duration: 4,
      start: 11,
      expected: [
        [11, 12],
        [13, 16],
      ],
    },
    {
      duration: 1,
      start: 12,
      expected: [[13, 14]],
    },
    {
      duration: 4,
      start: 13,
      expected: [[13, 17]],
    },
    {
      duration: 0.5,
      start: 17.5,
      expected: [[17.5, 18]],
    },
  ]

  for (const { duration, start, expected } of input) {
    const result = parseDuration(start, duration)
    expect(result).toEqual(expected)
  }
})
