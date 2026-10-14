import test from 'tape'
import wtf from '../lib/index.js'
import { mock } from 'node:test'

// Moved from the known-limitation case in templates-inline.test.js.
test('time template uses the current calendar month', (t) => {
  mock.timers.enable({ apis: ['Date'], now: new Date('2024-07-15T12:00:00Z') })
  t.teardown(() => mock.timers.reset())
  t.equal(wtf('{{time|MST|dst=no}}').text(), 'July 15, 2024', 'July is not June')
  t.end()
})
