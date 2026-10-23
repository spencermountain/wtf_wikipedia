import test from 'tape'
import wtf from '../../lib/index.js'

wtf.extend((_models, templates) => {
  templates.nestingprobe = (wiki, list, parse) => parse(wiki).list?.[0] || ''
})

test('adjacent templates render independently', (t) => {
  t.equal(wtf('{{nestingprobe|left}}{{nestingprobe|right}}').text(), 'leftright', 'adjacent replacements retain their order')
  t.end()
})

test('malformed template delimiters preserve surrounding text', (t) => {
  t.ok(wtf('before {{unfinished|value after').text().includes('after'), 'unclosed template does not swallow the remaining text')
  t.ok(wtf('before }} after').text().includes('after'), 'unmatched closing braces preserve the suffix')
  t.ok(wtf('before {{unfinished|{{nestingprobe|inner}} after').text().includes('after'), 'complete child inside an unfinished parent preserves the suffix')
  t.equal(wtf('{{nestingprobe|valid}} after {{unfinished').text().startsWith('valid after'), true, 'unfinished sibling does not prevent a complete template rendering')
  t.end()
})

test('deeply nested templates resolve from inside out', (t) => {
  let wiki = 'center'
  for (let i = 0; i < 100; i += 1) {
    wiki = '{{nestingprobe|' + wiki + '}}'
  }
  t.equal(wtf(wiki).text(), 'center', 'one hundred nested replacements resolve')
  t.end()
})
