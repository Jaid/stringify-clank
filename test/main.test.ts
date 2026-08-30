import {expect, test} from 'bun:test'

const {default: stringifyClank} = await import('#src/main.ts')

test('should run', () => {
  const result = stringifyClank()
  expect(result).toBe('stringify-clank') // TODO Test actual functionality
})
