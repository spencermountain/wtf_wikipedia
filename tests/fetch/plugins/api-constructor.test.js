import test from 'tape'
import wtf from '../../../plugins/api/tests/_lib.js'

const opts = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

test('randomCategory', async (t) => {
  t.plan(1)
  const cat = await wtf.getRandomCategory(opts)
  t.ok(cat, "got randomCategory: '" + cat + "'")
})

test('getCategory', async (t) => {
  t.plan(1)
  const docs = await wtf.getCategoryPages('Swiss female skeleton racers', opts)
  t.ok(docs.length > 0, `got ${docs.length} pages for category`)
})

test('getTemplate', async (t) => {
  t.plan(1)
  const list = await wtf.getTemplatePages('Template:Switzerland-badminton-bio-stub', opts)
  t.ok(list.length > 0, `got ${list.length} pages for template`)
})

test('wtf.fetchList', async (t) => {
  t.plan(3)
  const arr = ['Marina Gilardoni', 'Jessica Kilian', 'Tanja Morel']
  const docs = await wtf.fetchList(arr, opts)
  docs.forEach((doc) => {
    t.ok(doc.sentence().text(), `got ${doc.title()}`)
  })
})
