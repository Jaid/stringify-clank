import {expect, test} from 'bun:test'

import stringifyClank from '../src/main.ts'

test('serializes compact object and array examples', () => {
  expect(stringifyClank({
    age: 5,
    name: 'Clank',
  })).toBe('age 5 name Clank')
  expect(stringifyClank({
    pets: ['Rex', 'Whiskers'],
  })).toBe('pets [ Rex Whiskers]')
  expect(stringifyClank({
    pets: [
      {
        name: 'Rex',
        species: 'dog',
      },
      {
        name: 'Whiskers',
        species: 'cat',
      },
    ],
  })).toBe('pets [{ name Rex species dog}{ name Whiskers species cat}]')
})
test('quotes ambiguous strings', () => {
  expect(stringifyClank({id: '123'})).toBe("id '123'")
  expect(stringifyClank({empty: ''})).toBe("empty ''")
  expect(stringifyClank({value: '[not an array'})).toBe("value '[not an array'")
  expect(stringifyClank({value: '{not an object'})).toBe("value '{not an object'")
  expect(stringifyClank({value: "it's a nice $day"})).toBe('value "it\'s a nice $day"')
})
test('serializes top-level primitives and empty containers', () => {
  expect(stringifyClank(123)).toBe('123')
  expect(stringifyClank(true)).toBe('true')
  expect(stringifyClank('Hello World')).toBe("'Hello World'")
  expect(stringifyClank({})).toBe('')
  expect(stringifyClank(new Map)).toBe('')
})
