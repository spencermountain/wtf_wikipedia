import withoutWiki from '../../lib/withoutWiki.js'
import test from 'tape'
import wtf from '../../../src/index.ts'

const cases = [
  {
    name: 'repeated text has distinct offsets',
    wiki: "same '''same''' same '''same'''",
    text: 'same same same same',
    bolds: [
      { text: 'same', start: 5, end: 9 },
      { text: 'same', start: 15, end: 19 },
    ],
    italics: [],
  },
  {
    name: 'earlier italics shift later bold offsets',
    wiki: "''early'' then '''late'''",
    text: 'early then late',
    bolds: [{ text: 'late', start: 11, end: 15 }],
    italics: [{ text: 'early', start: 0, end: 5 }],
  },
  {
    name: 'italics nested inside bold',
    wiki: "'''outer ''inner'' end'''",
    text: 'outer inner end',
    bolds: [{ text: 'outer inner end', start: 0, end: 15 }],
    italics: [{ text: 'inner', start: 6, end: 11 }],
  },
  {
    name: 'bold nested inside italics',
    wiki: "''outer '''inner''' end''",
    text: 'outer inner end',
    bolds: [{ text: 'inner', start: 6, end: 11 }],
    italics: [{ text: 'outer inner end', start: 0, end: 15 }],
  },
  {
    name: 'combined bold and italics',
    wiki: "a '''''both''''' b",
    text: 'a both b',
    bolds: [{ text: 'both', start: 2, end: 6 }],
    italics: [{ text: 'both', start: 2, end: 6 }],
  },
  {
    name: 'four apostrophes preserve literal quotes',
    wiki: "a ''''quoted'''' b",
    text: "a 'quoted' b",
    bolds: [{ text: "'quoted'", start: 2, end: 10 }],
    italics: [],
  },
  {
    name: 'offsets use JavaScript string indices',
    wiki: "😀 '''bold'''",
    text: '😀 bold',
    bolds: [{ text: 'bold', start: 3, end: 7 }],
    italics: [],
  },
  {
    name: 'plain text has no formatting spans',
    wiki: 'plain text',
    text: 'plain text',
    bolds: [],
    italics: [],
  },
]

cases.forEach(({ name, wiki, text, bolds, italics }) => {
  test(`formatting offsets: ${name}`, (t) => {
    const sentence = wtf(wiki).sentences()[0]
    t.equal(sentence.text(), text, 'plain text')
    t.deepEqual(withoutWiki(sentence.bolds()), bolds, 'bold spans')
    t.deepEqual(withoutWiki(sentence.italics()), italics, 'italic spans')
    t.deepEqual(withoutWiki(sentence.json().bolds), bolds.length ? bolds : undefined, 'JSON bold spans')
    t.deepEqual(withoutWiki(sentence.json().italics), italics.length ? italics : undefined, 'JSON italic spans')
    sentence
      .bolds()
      .concat(sentence.italics())
      .forEach((span) => {
        t.equal(text.slice(span.start, span.end), span.text, 'exclusive end matches slice')
      })
    t.end()
  })
})
