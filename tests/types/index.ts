// a smoke-test for our typescipt typings
// to run:
// npm install -g typescript
// npm install -g ts-node
// npm install --no-save @types/tape @types/node
// npm run test:types

import wtf from '../../builds/wtf_wikipedia'
// import wtf from '../../'

const assert = function(a: any, b: any) {
  if (a !== b) {
    throw a
  }
}

const d = wtf('hello world')
// wtf.fetch
// wtf.random('en')
// d.references()
// d.links
assert(d.text(), 'hello world')
