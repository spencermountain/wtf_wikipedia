const test = require('tape')
const setDefaults = require('../../../src/_lib/setDefaults')

test('should apply default', (t) => {
  const options = {}
  const defaults = { a: 1, b: 2 }

  t.deepEqual(
    setDefaults(options, defaults),
    { a: 1, b: 2 }
  )

  t.end()
})

test('should not overwrite options', (t) => {
  const options = { a: 2, b: 3 }
  const defaults = { a: 1, b: 2 }

  t.deepEqual(
    setDefaults(options, defaults),
    { a: 2, b: 3 }
  )

  t.end()
})

test('should mix options with defaults', (t) => {
  const options = { a: 2, b: 3 }
  const defaults = { b: 2, c: 3 }

  t.deepEqual(
    setDefaults(options, defaults),
    { a: 2, b: 3, c: 3 }
  )

  t.end()
})