import test from 'tape'
import wtf from './_lib.js'

test('markdown: headings and paragraphs', (t) => {
  const md = wtf('intro text.\n\n== History ==\nOld stuff.\n=== Early ===\nVery old.').markdown()
  t.equal(md, 'intro text.\n\n## History\nOld stuff.\n\n### Early\nVery old.', 'full output')
  t.ok(md.includes('## History\n'), '== → ##')
  t.ok(md.includes('### Early\n'), '=== → ###')
  t.notOk(wtf('intro.\n== History ==\nOld.').markdown({ headers: false }).includes('#'), 'headers:false')
  const paras = wtf('The cat sat down. The dog ran away.\n\nA second paragraph here.').markdown()
  t.equal(
    paras,
    'The cat sat down. The dog ran away.\n\nA second paragraph here.',
    'paragraphs separated by blank line'
  )
  t.equal(wtf('Some text here.').markdown({ sections: false }), '', 'sections:false')
  t.end()
})

test('markdown: links', (t) => {
  t.equal(wtf('[[Foo bar|baz]]').links()[0].markdown(), '[baz](./Foo_bar)', 'link.markdown()')
  t.equal(wtf('see [[Toronto]] now').markdown(), 'see [Toronto](./Toronto) now', 'plain link')
  t.equal(wtf('see [[Toronto#History|history]] now').markdown(), 'see [history](./Toronto#History) now', 'anchor')
  t.equal(
    wtf('see [https://example.com Example site] now').markdown(),
    'see [Example site](https://example.com) now',
    'external'
  )
  t.equal(wtf('the [[cats|cat]] is here').markdown(), 'the [cat](./Cats) is here', 'piped text')
  t.equal(wtf("a '''b''' [[c]]").markdown({ links: false, formatting: false }), 'a b c', 'links + formatting off')
  t.equal(wtf('see [[Toronto]] now').markdown({ links: false }), 'see Toronto now', 'links:false')
  t.end()
})

test('markdown: link edge cases', { todo: true }, (t) => {
  t.equal(
    wtf('see [[Mercury (planet)]] now').markdown(),
    'see [Mercury (planet)](./Mercury_(planet)) now',
    'title with parentheses is linked'
  )
  t.equal(wtf('the cat and the [[cat]]').markdown(), 'the cat and the [cat](./Cat)', 'second occurrence is the link')
  t.end()
})

test('markdown: formatting', (t) => {
  t.equal(wtf("an ''italic'' word").markdown(), 'an *italic* word', 'italic')
  t.equal(wtf("a '''bold''' word").markdown(), 'a **bold** word', 'bold')
  t.equal(wtf("a '''[[Paris]]''' trip").markdown(), 'a [**Paris**](./Paris) trip', 'bold link')
  t.equal(wtf("x ''y'' z").markdown({ formatting: false }), 'x y z', 'formatting:false')
  t.end()
})

test('markdown: escapes markdown characters in plain text', { todo: true }, (t) => {
  t.equal(wtf('the file_name_here variable').markdown(), 'the file\\_name\\_here variable', 'underscores escaped')
  t.equal(wtf('rated *five* stars').markdown(), 'rated \\*five\\* stars', 'asterisks escaped')
  t.end()
})

test('markdown: lists', (t) => {
  const md = wtf("intro\n* one [[A]]\n* two ''it''\n").markdown()
  t.ok(md.includes(' * one [A](./A)\n * two *it*'), 'bulleted items with inline markup')
  t.equal(wtf('intro\n* one\n* two\n').lists()[0].markdown(), ' * one\n * two', 'list.markdown()')
  t.notOk(wtf('intro\n* one\n').markdown({ lists: false }).includes('*'), 'lists:false')
  t.end()
})

test('markdown: content order', { todo: true }, (t) => {
  // lists (and tables/images) are emitted before the section's paragraphs, regardless of source order
  t.equal(wtf('intro text.\n* one\n* two\n').markdown(), 'intro text.\n * one\n * two', 'list stays after the intro')
  t.end()
})

test('markdown: images', (t) => {
  const md = wtf('[[File:Big_cat.jpg|thumb|A cat]] text').markdown()
  t.ok(
    md.startsWith('![Big cat](https://wikipedia.org/wiki/Special:Redirect/file/Big_cat.jpg?width=300)'),
    'image with alt from filename'
  )
  t.equal(wtf('[[File:Big_cat.jpg|thumb|A cat]] text').markdown({ images: false }), 'text', 'images:false')
  t.equal(
    wtf('[[Image:Dog.PNG]] x').images()[0].markdown().startsWith('![Dog]('),
    true,
    'Image: prefix and extension stripped'
  )
  t.end()
})

test('markdown: tables', (t) => {
  const md = wtf('{| class="wikitable"\n! Team !! Wins\n|-\n| [[Toronto Raptors|Raptors]] || 59\n|}').markdown()
  const lines = md.trim().split('\n')
  t.equal(lines.length, 3, 'header, divider, one row')
  t.ok(/^\|\s+Team\s+\|\s+Wins\s+\|$/.test(lines[0]), 'header row')
  t.ok(/^\|\s+---\s+\|\s+---\s+\|$/.test(lines[1]), 'divider row')
  t.ok(lines[2].includes('[Raptors](./Toronto_Raptors)') && lines[2].includes('59'), 'body row with link')
  t.equal(wtf('{|\n! a\n|-\n| b\n|}').markdown({ tables: false }), '', 'tables:false')
  t.end()
})

test('markdown: infobox', (t) => {
  const doc = wtf('{{Infobox person\n| name = Joe\n| birth_place = [[Paris]]\n| image = Joe.jpg\n}} text')
  const md = doc.markdown()
  t.ok(/\|\s+\*\*name\*\*\s+\|\s+Joe\s+\|/.test(md), 'name row')
  t.ok(md.includes('[Paris](./Paris)'), 'link in infobox value')
  t.notOk(md.includes('**image**'), 'image key skipped')
  t.ok(md.indexOf('**name**') < md.indexOf('text'), 'infobox first')
  t.equal(doc.markdown({ infoboxes: false }), 'text', 'infoboxes:false')
  t.end()
})

test('markdown: infobox table is separated from text', { todo: true }, (t) => {
  // without a blank line the following paragraph is parsed as another table row
  const md = wtf('{{Infobox person\n| name = Joe\n}} text').markdown()
  t.ok(/\|\n\ntext$/.test(md), 'blank line between infobox table and text')
  t.end()
})

test('markdown: references', (t) => {
  const doc = wtf('a one.<ref>{{cite web|url=https://a.com|title=A title}}</ref> b two.<ref>plain ref</ref>')
  t.notOk(doc.markdown().includes('References'), 'off by default')
  const md = doc.markdown({ references: true })
  t.ok(md.includes('## References'), 'references header')
  t.ok(md.includes('⌃ [A title](https://a.com)'), 'cite web')
  t.ok(md.includes('⌃ plain ref'), 'inline ref')
  t.equal(doc.references()[0].markdown(), '⌃ [A title](https://a.com)', 'reference.markdown()')
  t.end()
})

test('markdown: reference formatting', { todo: true }, (t) => {
  const md = wtf('a one.<ref>{{cite book|title=Book|author=Smith}}</ref>').markdown({ references: true })
  t.ok(md.includes('\n## References\n'), 'references header on its own line')
  t.ok(md.includes('⌃ Book Smith'), 'title and author separated')
  t.end()
})

test('markdown: redirects', (t) => {
  t.equal(
    wtf('#REDIRECT [[Toronto Maple Leafs#History|leafs]]').markdown(),
    '↳ [leafs](./Toronto_Maple_Leafs#History)',
    'soft redirect'
  )
  t.equal(wtf('#REDIRECT [[Toronto Maple Leafs]]').markdown().startsWith('↳ ['), true, 'plain redirect')
  t.end()
})

test('cjk sentences join without spaces', (t) => {
  const doc = wtf('東京は日本の首都です。人口が多いです。')
  t.ok(doc.markdown().includes('東京は日本の首都です。人口が多いです。'), 'no space between cjk sentences')
  t.ok(wtf('One. Two.').markdown().includes('One. Two.'), 'latin sentences keep a space')
  t.end()
})
