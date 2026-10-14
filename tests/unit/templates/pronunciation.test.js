import test from 'tape'
import wtf from '../../lib/index.js'

test('Pronunciation-Templates-Omitted', (t) => {
  t.equal(wtf(`{{IPA|/ˈkærəktɚz/}}`).plaintext(), '', 'IPA omitted')
  t.equal(wtf(`{{IPAc-ar|2|a|l|l|u|gh|a|t_|a|l|3|a|r|a|b|i|y|y|a}}`).plaintext(), '', 'Arabic IPA omitted')
  t.end()
})
