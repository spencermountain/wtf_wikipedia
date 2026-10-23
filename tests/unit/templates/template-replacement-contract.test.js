import test from 'tape'
import wtf from '../../lib/index.js'

wtf.extend((models, templates) => {
  templates.contractecho = (wiki, list, parse) => parse(wiki).list?.[0] || ''
  templates.contractliteral = () => '$& $$ $` $\''
})

test('template replacement strings are literal', (t) => {
  t.equal(wtf('before {{contractliteral}} after').text(), "before $& $$ $` $' after", 'dollar patterns are not interpreted as replacement tokens')
  t.end()
})

test('nested replacements propagate through every ancestor', (t) => {
  t.equal(wtf('before {{contractecho|A {{contractecho|B {{contractecho|C}} D}} E}} after').text(), 'before A B C D E after', 'three levels preserve surrounding content')
  t.equal(wtf('{{contractecho|{{contractecho|same}} / {{contractecho|same}}}}').text(), 'same / same', 'identical siblings are both replaced')
  t.equal(wtf('{{contractecho|{{contractecho|left}} / {{contractecho|right}}}}').text(), 'left / right', 'different siblings update the same parent')
  t.equal(wtf('{{contractecho|{{contractecho|}}tail}}').text(), 'tail', 'empty child replacement preserves the parent suffix')
  t.equal(wtf('{{contractecho|{{contractliteral}}}}').text(), "$& $$ $` $'", 'literal replacement survives propagation to a parent')
  t.end()
})
