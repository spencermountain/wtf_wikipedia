// a smoke-test for our typescipt typings
// to run:
// npm install -g typescript
// npm install -g ts-node
// npm install --no-save @types/tape @types/node
// npm run test:types

import * as test from 'tape'
import wtf from '../../'

test('typefile smoketest', (t: test.Test) => {
  t.ok(wtf, 'import works')
  const d = wtf('hello world')
  // wtf.fetch
  // wtf.random('en')
  // d.references()
  // d.links
  t.equal(d.text(), 'hello world', 'basic-smoketest')
  t.end()
})
