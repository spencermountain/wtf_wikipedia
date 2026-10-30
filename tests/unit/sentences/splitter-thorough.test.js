import test from 'tape'
import wtf from '../../lib/index.js'

const texts = (str) =>
  wtf(str)
    .sentences()
    .map((s) => s.text())

// [input, expected sentence texts]
const cases = [
  // basics
  ['One. Two.', ['One.', 'Two.']],
  ['Is it? Yes! Fine.', ['Is it?', 'Yes!', 'Fine.']],
  ['Really?! Yes.', ['Really?!', 'Yes.']],
  ['No terminal punctuation', ['No terminal punctuation']],
  // abbreviations
  ['Dr. Smith arrived. He sat down.', ['Dr. Smith arrived.', 'He sat down.']],
  ['Mr. and Mrs. Jones left early. They were tired.', ['Mr. and Mrs. Jones left early.', 'They were tired.']],
  ['He lived on St. James Street. It was quiet.', ['He lived on St. James Street.', 'It was quiet.']],
  [
    'Martin Luther King Jr. was born in Atlanta. He was a minister.',
    ['Martin Luther King Jr. was born in Atlanta.', 'He was a minister.'],
  ],
  ['She moved to the U.S. in 1990. She later returned.', ['She moved to the U.S. in 1990.', 'She later returned.']],
  ['Some fruits, e.g. apples, are red. Others are not.', ['Some fruits, e.g. apples, are red.', 'Others are not.']],
  ['One fruit, i.e. the apple, is red. Others are not.', ['One fruit, i.e. the apple, is red.', 'Others are not.']],
  [
    'He wore jersey No. 9 for the club. He retired in 2001.',
    ['He wore jersey No. 9 for the club.', 'He retired in 2001.'],
  ],
  ['The meeting was in Jan. 2004 in Ottawa. It was cold.', ['The meeting was in Jan. 2004 in Ottawa.', 'It was cold.']],
  [
    'It sold apples, pears, etc. at the market. Business was good.',
    ['It sold apples, pears, etc. at the market.', 'Business was good.'],
  ],
  ['Prof. Brown taught at the university. She retired.', ['Prof. Brown taught at the university.', 'She retired.']],
  [
    'The company is Acme Inc. based in Toronto. It makes anvils.',
    ['The company is Acme Inc. based in Toronto.', 'It makes anvils.'],
  ],
  [
    'It was ca. 1850 when the town was founded. It grew quickly.',
    ['It was ca. 1850 when the town was founded.', 'It grew quickly.'],
  ],
  // initials
  ['J. R. R. Tolkien wrote books. He lived in Oxford.', ['J. R. R. Tolkien wrote books.', 'He lived in Oxford.']],
  [
    'The poet T. S. Eliot was born in 1888. He died in 1965.',
    ['The poet T. S. Eliot was born in 1888.', 'He died in 1965.'],
  ],
  ['George W. Bush was president. He was from Texas.', ['George W. Bush was president.', 'He was from Texas.']],
  // numbers
  ['The value is 3.5 metres. It is long.', ['The value is 3.5 metres.', 'It is long.']],
  ['It cost $1,000.50 in total. That was a lot.', ['It cost $1,000.50 in total.', 'That was a lot.']],
  ['Version 2.0.1 was released. It fixed bugs.', ['Version 2.0.1 was released.', 'It fixed bugs.']],
  ['The score was 0.75 on average. It improved.', ['The score was 0.75 on average.', 'It improved.']],
  ['He finished in 1999. In 2000 he left.', ['He finished in 1999.', 'In 2000 he left.']],
  // ellipses
  ['He paused... then spoke. Everyone listened.', ['He paused... then spoke.', 'Everyone listened.']],
  ['And then… nothing. The end.', ['And then… nothing.', 'The end.']],
  // quotes and parentheses
  ['She said "Hello." Then she left.', ['She said "Hello."', 'Then she left.']],
  ['He asked "Why?" Nobody answered.', ['He asked "Why?"', 'Nobody answered.']],
  ['The town is old (founded in 1700). It is small.', ['The town is old (founded in 1700).', 'It is small.']],
  [
    'It is a tree (genus Salix, e.g. willows). It grows fast.',
    ['It is a tree (genus Salix, e.g. willows).', 'It grows fast.'],
  ],
  // links, templates, refs at boundaries
  ['He was born in [[Toronto]]. He moved to [[Montreal]].', ['He was born in Toronto.', 'He moved to Montreal.']],
  ['He lived in [[St. Louis, Missouri|St. Louis]]. He died there.', ['He lived in St. Louis.', 'He died there.']],
  [
    'It is a case, [[Roe v. Wade]], from 1973. It was famous.',
    ['It is a case, Roe v. Wade, from 1973.', 'It was famous.'],
  ],
  ['The town grew.<ref>{{cite web|title=Growth}}</ref> It is now a city.', ['The town grew.', 'It is now a city.']],
  ['The town grew.<ref name="a" /> It is now a city.', ['The town grew.', 'It is now a city.']],
  ["'''Bold''' starts here. ''Italic'' follows.", ['Bold starts here.', 'Italic follows.']],
  // urls and emails
  ['See [http://example.com/a.b.html the site] for more. It is useful.', ['See the site for more.', 'It is useful.']],
  ['Visit www.example.com for details. It is free.', ['Visit www.example.com for details.', 'It is free.']],
  ['Email info@example.com for help. They reply fast.', ['Email info@example.com for help.', 'They reply fast.']],
  // non-latin punctuation
  ['Это Москва. Это большой город.', ['Это Москва.', 'Это большой город.']],
  ['هذه مدينة. إنها كبيرة.', ['هذه مدينة.', 'إنها كبيرة.']],
  // newlines
  ['A sentence here.\nAnother sentence.', ['A sentence here.', 'Another sentence.']],
  ['A paragraph.\n\nAnother paragraph.', ['A paragraph.', 'Another paragraph.']],
  // lowercase continuation should not split
  ['The total was 5 vs. 3 in the end. Good.', ['The total was 5 vs. 3 in the end.', 'Good.']],
]

test('sentence splitter - thorough', (t) => {
  cases.forEach(([str, want]) => {
    t.deepEqual(texts(str), want, JSON.stringify(str))
  })
  t.end()
})

// known parser bugs
const fixed = [
  // a parenthesised sentence stands on its own
  [
    'The town is old. (It was founded in 1700.) It is small.',
    ['The town is old.', '(It was founded in 1700.)', 'It is small.'],
  ],
  // 。 is kept in sentence text
  ['東京は日本の首都です。人口が多いです。', ['東京は日本の首都です。', '人口が多いです。']],
  // full-width ？ and ！ end sentences
  ['你好吗？我很好！', ['你好吗？', '我很好！']],
  // a single newline is not a paragraph break in wikitext
  ['First line\nsecond part of it.', ['First line second part of it.']],
  // closing quotes and italics after the period belong to the sentence
  ["He said ''go.'' Then he left.", ['He said go.', 'Then he left.']],
]

test('sentence splitter - fixed bugs', (t) => {
  fixed.forEach(([str, want]) => {
    t.deepEqual(texts(str), want, JSON.stringify(str))
  })
  t.end()
})

test('sentence count and accessors', (t) => {
  const doc = wtf('One. Two. Three.')
  t.equal(doc.sentences().length, 3, 'three sentences')
  t.equal(doc.sentences()[2].text(), 'Three.', 'third sentence by index')
  t.equal(doc.sentences()[5], undefined, 'out-of-range index is undefined')
  t.equal(wtf('').sentences().length, 0, 'empty doc has no sentences')
  t.equal(wtf('   \n\n  ').sentences().length, 0, 'whitespace doc has no sentences')
  t.end()
})
