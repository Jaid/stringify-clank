import type {Clankable} from '#src/lib/types/Clankable.d.ts'

const specialWords = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity', '-Infinity'])
const numberPattern = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[Ee][+-]?\d+)?$/
function needsQuoting(str: string): boolean {
  if (str === '') {
    return true
  }
  if (specialWords.has(str)) {
    return true
  }
  if (numberPattern.test(str)) {
    return true
  }
  if (/\s/.test(str)) {
    return true
  }
  if (str.startsWith('[') || str.startsWith('{') || str.endsWith(']') || str.endsWith('}')) {
    return true
  }
  return false
}
function quoteString(str: string): string {
  if (!str.includes("'")) {
    return `'${str}'`
  }
  const escaped = str
    .replaceAll('\\', '\\\\')
    .replaceAll('"', String.raw`\"`)
    .replaceAll('\t', String.raw`\t`)
    .replaceAll('\n', String.raw`\n`)
    .replaceAll('\r', String.raw`\r`)
  return `"${escaped}"`
}

export {needsQuoting, quoteString}

function stringifyClankInternal(data: Clankable, topLevel = true): string {
  if (data === null || data === undefined) {
    return String(data)
  }
  if (typeof data === 'boolean') {
    return data ? 'true' : 'false'
  }
  if (typeof data === 'number') {
    if (Number.isNaN(data)) {
      return 'NaN'
    }
    if (data === Infinity) {
      return 'Infinity'
    }
    if (data === -Infinity) {
      return '-Infinity'
    }
    return String(data)
  }
  if (typeof data === 'string') {
    if (needsQuoting(data)) {
      return quoteString(data)
    }
    return data
  }
  if (Array.isArray(data)) {
    const parts: Array<string> = []
    for (const item of data) {
      const serialized = stringifyClankInternal(item, false)
      if (parts.length > 0 && !serialized.startsWith('[') && !serialized.startsWith('{')) {
        parts.push(' ')
      }
      parts.push(serialized)
    }
    const items = parts.join('')
    const firstStartsWithBracket = items.length > 0 && (items.startsWith('[') || items.startsWith('{'))
    if (firstStartsWithBracket) {
      return `[${items}]`
    }
    return `[ ${items}]`
  }
  if (data instanceof Map) {
    const pairs: Array<string> = []
    for (const [key, value] of data) {
      const serializedKey = needsQuoting(key) ? quoteString(key) : key
      pairs.push(`${serializedKey} ${stringifyClankInternal(value, false)}`)
    }
    const content = pairs.join(' ')
    if (topLevel) {
      return content
    }
    return `{ ${content}}`
  }
  const keys = Object.keys(data)
  const pairs = keys.map(key => {
    const serializedKey = needsQuoting(key) ? quoteString(key) : key
    return `${serializedKey} ${stringifyClankInternal(data[key], false)}`
  })
  const content = pairs.join(' ')
  if (topLevel) {
    return content
  }
  return `{ ${content}}`
}
const stringifyClank = (data: Clankable) => stringifyClankInternal(data)

export const stringifyClankRuntimeSource = [
  `const specialWords = new Set(${JSON.stringify([...specialWords])})`,
  `const numberPattern = ${numberPattern}`,
  String(needsQuoting),
  String(quoteString),
  String(stringifyClankInternal),
  `const stringifyClank = ${String(stringifyClank)}`,
].join('\n')

export default stringifyClank
