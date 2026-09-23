import test from 'tape'
import parseSentences from '../../../src/04-sentence/parse.ts'
import pipeSplitter from '../../../src/template/parse/toJSON/01-pipe-splitter.ts'
import handleSpans from '../../../src/table/parse/_spans.ts'
import { trim_whitespace } from '../../../src/_lib/helpers.ts'

test('sentence boundaries survive punctuation and line terminators', (t) => {
  t.deepEqual(parseSentences('One sentence. Another sentence!'), ['One sentence. ', 'Another sentence!'])
  t.deepEqual(parseSentences('x.\rNext sentence.\u2028Last one?'), ['x.\r', 'Next sentence.\u2028', 'Last one?'])
  t.deepEqual(parseSentences('... Wait for it. "Done now!"'), ['... Wait for it. ', '"Done now!"'])
  const long = 'word '.repeat(20000)
  t.deepEqual(parseSentences(long), [long], 'long text without punctuation stays intact')
  t.equal(trim_whitespace(' '.repeat(100000) + 'word\t\n'), 'word', 'long whitespace run is trimmed')
  t.end()
})

test('nested template arguments and table spans retain their boundaries', (t) => {
  t.deepEqual(pipeSplitter('name|[[outer|inner]]|{{nested|x}}|end'), ['name', '[[outer|inner]]', '{{nested|x}}', 'end'])
  t.deepEqual(handleSpans([['prefix colspan="2" | value', 'next']]), [['value', '', 'next']])
  const long = '['.repeat(100000)
  t.deepEqual(pipeSplitter('name|' + long + '|value'), ['name', long + '|value'], 'unclosed delimiters keep their pipe')
  t.end()
})
