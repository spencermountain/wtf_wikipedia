import test from 'tape'
import wtf from './_lib.js'

test('basic-markdown', (t) => {
  let md = wtf('he is [[Spencer Kelly|so cool]] and [http://cool.com fresh]').markdown()
  t.equal(
    md,
    'he is [so cool](./Spencer_Kelly) and [fresh](http://cool.com)',
    'internal, external links'
  )

  md = wtf(
    'hello [[Image:1930s Toronto KingStreetWnearYork.jpg|thumb|right|250px]] world'
  ).markdown()
  t.equal(
    md,
    `![1930s Toronto KingStreetWnearYork](https://wikipedia.org/wiki/Special:Redirect/file/1930s_Toronto_KingStreetWnearYork.jpg?width=300)
hello world`,
    'image'
  )

  md = wtf(`he is ''really good''`).markdown()
  t.equal(md, 'he is *really good*', 'multi-word italic')

  md = wtf(`he is '''really good'''`).markdown()
  t.equal(md, 'he is **really good**', 'multi-word bold')

  md = wtf(`he is ''''really good''''`).markdown()
  t.equal(md, "he is **'really good'**", 'four-ticks')

  md = wtf(`he is '''''really good'''''`).markdown()
  t.equal(md, 'he is ***really good***', 'bold+italics')
  t.end()
})

test('markdown-tricks', (t) => {
  let md = wtf('the is [[he]] nice').markdown()
  t.equal(md, 'the is [he](./he) nice', 'matches whole-word')

  md = wtf('the is [[he]]. nice').markdown()
  t.equal(md, 'the is [he](./he). nice', 'matches with-period')

  md = wtf("stim's is [[tim]]'s son").markdown()
  t.equal(md, "stim's is [tim](./tim)'s son", 'matches with apostrophe')

  md = wtf(`we put the '''e''' in team`).markdown()
  t.equal(md, 'we put the **e** in team', 'fmt supports smartReplace')

  t.end()
})

test('handles references', (t) => {
  const md = wtf(`
  <ref>{{cite web
    | last = fake
    | title = Fake reference title
    | url=http://example.com/fake/ref
    | accessdate = 2023-09-14 }}</ref>

  == References ==
  {{ref-list}}
  `).markdown({references: true})
  
  t.equal(md, "== References ==## References⌃ [Fake reference title](http://example.com/fake/ref)", "supports markdown")
  t.equal(md, md, "supports markdown");

  
  t.end()
})

