import test from 'tape'
import wtf from './_lib.js'
import fr from '../src/langs/fr/index.js'

// gated names register into core's byLang overlay — they only apply when the document's lang matches
test('i18n gated defs are pack data', (t) => {
  t.equal(fr.gated.monnaie.template, 'currency', 'monnaie → currency')
  t.equal(fr.gated.nb.template, 'currency', 'nb → currency')
  t.end()
})

test('i18n gated names only apply on their own wiki', (t) => {
  t.equal(wtf('{{monnaie|107.70|€}}').text(), '', 'fr template is still unknown on enwiki')
  t.equal(wtf('{{monnaie|107.70|€}}', { lang: 'fr' }).text(), '€107.70', 'fr template on frwiki')
  t.equal(wtf('{{monnaie|107.70|€}}', { lang: 'fr' }).templates()[0].json().kind, 'currency', 'gated def keeps the kind')
  t.equal(wtf('a {{cita requerida}} b', { lang: 'es' }).text(), 'a b', 'es citation needed')
  t.equal(wtf('a {{citazione necessaria}} b', { lang: 'it' }).text(), 'a b', 'it citation needed')
  t.end()
})

test('i18n french currency templates', (t) => {
  const fr2 = (str) => wtf(str, { lang: 'fr' }).text()
  t.equal(fr2('{{Unité|107.70|M€}}'), '107.70 M€', 'french unit 2 parameters')
  t.equal(fr2('{{Unité|107.70}}'), '107.70', 'french unit 1 parameter')
  t.equal(fr2('{{nombre|107.70 M€}}'), '107.70 M€', 'french nombre 1 parameter')
  t.equal(fr2('{{nombre|107.70|M€}}'), '107.70 M€', 'french nombre 2 parameters M€')
  t.equal(fr2('{{nombre|107.70|€}}'), '€107.70', 'french nombre 2 parameters €')
  t.equal(fr2('{{nombre|107.70|euro}}'), '€107.70', 'french nombre 2 parameters euro')
  t.equal(fr2('{{nb|107.70|€}}'), '€107.70', 'french nb 2 parameters')
  t.equal(fr2('{{iso4217|AUD}}'), 'AUD', 'iso4217 AUD')
  const doc = wtf('infront {{Monnaie|10000|écu}} behind', { lang: 'fr' })
  t.equal(doc.text(), 'infront 10000 écu behind', 'monnaie with an unknown code keeps its text')
  t.equal(doc.templates()[0].json().data.amount, '10000', 'monnaie amount')
  t.equal(doc.templates()[0].json().data.code, 'écu', 'monnaie code')
  t.end()
})
