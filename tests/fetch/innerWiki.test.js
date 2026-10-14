import test from 'tape'
import wtf from '../lib/index.js'

test('fetch-innerWiki-wikibooks', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://en.wikibooks.org/wiki/JavaScript', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wikimedia', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://meta.wikimedia.org/wiki/Parser_testing', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wikinews', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://en.wikinews.org/wiki/Donald_Trump_elected_US_president', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wikipedia', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://en.wikipedia.org/wiki/Ethereum', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wikiquote', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://en.wikiquote.org/wiki/Chadwick_Boseman', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wikisource', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://en.wikisource.org/wiki/Proclamation_of_the_Irish_Republic', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wikispecies', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://species.wikimedia.org/wiki/Michotamia_aurata', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wikiversity', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://en.wikiversity.org/wiki/Introduction_to_Swedish', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wikivoyage', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://en.wikivoyage.org/wiki/Marvel_Cinematic_Universe_tourism', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-wiktionary', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://en.wiktionary.org/wiki/masterly', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})

test('fetch-innerWiki-meta', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('https://meta.wikimedia.org/wiki/Steward_requests/Bot_status', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'alternate wiki returned document')
})
