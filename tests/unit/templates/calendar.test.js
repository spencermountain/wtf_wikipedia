import test from 'tape'
import wtf from '../../lib/index.js'
import { mock } from 'node:test'

// Moved from the known-limitation case in templates-inline.test.js.
test('time template uses the current calendar month', (t) => {
  mock.timers.enable({ apis: ['Date'], now: new Date('2024-07-15T12:00:00Z') })
  t.teardown(() => mock.timers.reset())
  t.equal(wtf('{{time|MST|dst=no}}').text(), 'July 15, 2024', 'July is not June')
  t.end()
})

test('monthname converts numeric months', (t) => {
  const cases = [
    ['{{MONTHNAME|8}}', 'August'],
    ['{{MONTHNAME|1}}', 'January'],
    ['{{MONTHNAME|12}}', 'December'],
    ['{{MONTHNAME|02}}', 'February'],
    ['{{MONTHNAME|13}}', ''],
  ]
  cases.forEach(([input, expected]) => {
    t.equal(wtf(input).text(), expected, input)
  })
  t.end()
})

test('time template handles January', (t) => {
  mock.timers.enable({ apis: ['Date'], now: new Date('2024-01-15T12:00:00Z') })
  t.teardown(() => mock.timers.reset())
  t.equal(wtf('{{time|MST|dst=no}}').text(), 'January 15, 2024')
  t.end()
})
