import test from 'tape'
import wtf from '../../lib/index.js'

test('Pronunciation-Templates-Omitted', (t) => {
  t.equal(wtf(`{{IPA|/ˈkærəktɚz/}}`).text(), '', 'IPA omitted')
  t.equal(wtf(`{{IPAc-ar|2|a|l|l|u|gh|a|t_|a|l|3|a|r|a|b|i|y|y|a}}`).text(), '', 'Arabic IPA omitted')
  t.end()
})

test('IPAc-en keys become IPA, as data', (t) => {
  const cases = [
    ["{{IPAc-en|ˈ|s|ʌ|m}}", '/ˈsʌm/'],
    ["{{IPAc-en|pron|ˈ|p|ær|ɪ|s}}", '/ˈpærɪs/'],
    ["{{IPAc-en|UK|ˈ|t|oh|m|ah|t|oh}}", '/ˈtoʊmɑːtoʊ/'],
    ["{{IPAc-en|audio=en-us-x.ogg|ˈ|m|æ|n|ch|ɛ|s|t|ər}}", '/ˈmæntʃɛstər/'],
    ["{{IPAc-en|ˌ|t|ær|ə|ˈ|k|s|ə|k|ᵿ|m}}", '/ˌtærəˈksəkᵿm/'],
    ["{{IPAc-en|dh|ə|_|k|ay|k}}", '/ðə keɪk/'],
  ]
  cases.forEach(([input, want]) => {
    const doc = wtf(input)
    t.equal(doc.text(), '', input + ' omitted from text')
    t.equal(doc.templates()[0].json().data.transcription, want, input)
  })
  t.equal(wtf('{{IPAc-ko|h|a|n|g|u|k}}').templates()[0].json().data.transcription, 'h,a,n,g,u,k', 'other languages are left as keys')
  t.end()
})
