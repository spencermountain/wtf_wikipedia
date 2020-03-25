const test = require('tape')
const wtf = require('./_lib')

test('tense', t => {
  let str = `CoolToday Park was a ballpark in North Port, Florida, located in the southern portion of Sarasota County, 35 miles south of Sarasota, Florida.`
  t.equal(wtf(str).tense(), 'Past', 'was a')

  str = `CoolToday Park is a planned ballpark in North Port, Florida.`
  t.equal(wtf(str).tense(), 'Future', 'is a planned')

  str = `CoolToday Park will be a planned ballpark in North Port, Florida.`
  t.equal(wtf(str).tense(), 'Future', 'will be')
  t.end()
})

test('article', t => {
  let str = `CoolToday Park was a ballpark. He is 6 feet tall.`
  t.equal(wtf(str).article(), 'he', 'he')

  str = `CoolToday Park was a ballpark.`
  t.equal(wtf(str).article(), 'it', 'it-default')

  str = `CoolToday Park was a ballpark. It is 6 feet tall.`
  t.equal(wtf(str).article(), 'it', 'it-2nd-sentence')

  str = `CoolToday Park was a ballpark and it is 6 feet tall.`
  t.equal(wtf(str).article(), 'it', 'it-1st-sentence')
  t.end()
})
