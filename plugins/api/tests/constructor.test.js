import test from 'tape'
import wtf from './_lib.js'

test('smoketests', function (t) {
  t.equal(typeof wtf.getRandomCategory, 'function', 'has randomCategory method')
  t.equal(typeof wtf.getCategoryPages, 'function', 'has getCategory method')
  t.equal(typeof wtf.getTemplatePages, 'function', 'has getTemplate method')
  t.end()
})
