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

const nest = (depth) => {
  let wiki = 'center'
  for (let i = 0; i < depth; i += 1) {
    wiki = '{{nestingprobe|' + wiki + '}}'
  }
  return wiki
}

test('deeply nested templates resolve from inside out', (t) => {
  // MediaWiki's own expansion depth limit is 40 - we match it
  t.equal(wtf(nest(40)).text(), 'center', 'forty nested replacements resolve')
  t.end()
})

test('nesting past the depth cap is left as text, quickly', (t) => {
  const wiki = nest(2000)
  const start = Date.now()
  const text = wtf(wiki).text()
  const ms = Date.now() - start
  t.ok(text.includes('center'), 'inner text is kept')
  t.ok(text.includes('{{nestingprobe'), 'templates past the cap are not expanded')
  t.ok(ms < 2000, `pathological nesting parses in ${ms}ms`)
  t.end()
})
