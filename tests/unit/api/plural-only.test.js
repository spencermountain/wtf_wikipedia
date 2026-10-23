import test from 'tape'
import wtf from '../../lib/index.js'

test('models expose plural accessors with section, infobox and image selectors', (t) => {
  const singular = ['link', 'image', 'list', 'sentence', 'paragraph', 'section', 'infobox', 'template', 'reference', 'citation', 'table', 'coordinate']
  wtf.extend((models) => {
    const names = ['Doc', 'Section', 'Paragraph', 'Sentence', 'Image', 'Infobox', 'Link', 'List', 'Reference', 'Table', 'Template']
    names.forEach((name) => {
      singular.forEach((method) => {
        if (name === 'Doc' && (method === 'infobox' || method === 'section')) {
          t.equal(typeof models[name].prototype[method], 'function', `Document.${method} is retained`)
        } else if (name === 'Infobox' && method === 'image') {
          t.equal(typeof models[name].prototype[method], 'function', 'Infobox.image is retained')
        } else {
          t.notOk(method in models[name].prototype, `${name}.${method} is absent`)
        }
      })
    })
  })
  const doc = wtf('Hello [[Alice]].\n== History ==\nPast events.')
  t.equal(doc.links()[0].page(), 'Alice', 'first link remains accessible')
  t.equal(doc.section(' hIsToRy ').text(), 'Past events.', 'section title lookup ignores case and surrounding whitespace')
  t.equal(doc.section(1).title(), 'History', 'section selects by index')
  t.equal(doc.section().text(), 'Hello Alice.', 'section defaults to the introduction')
  t.equal(doc.section('Missing').text(), '', 'missing title returns an empty Section')
  t.equal(doc.section(99).text(), '', 'missing index returns an empty Section')
  t.equal(doc.templates('missing')[0], undefined, 'missing template is undefined')
  t.equal(doc.infoboxes()[0], undefined, 'missing infobox is undefined')
  t.equal(doc.infobox(), null, 'singular infobox preserves its missing result')
  const boxes = wtf('{{Infobox person|name=Small}}\n{{Infobox person|name=Large|occupation=Writer}}')
  t.equal(boxes.infobox().get('name').text(), 'Large', 'singular infobox preserves importance ordering')
  const box = wtf('{{Infobox person|image=First.jpg|image2=Second.jpg}}').infobox()
  t.equal(box.image().file(), 'File:First.jpg', 'singular image preserves preferred image ordering')
  t.equal(box.images().length, 2, 'plural images preserves all images')
  t.equal(boxes.infobox().image(), undefined, 'missing preferred image stays undefined')
  t.end()
})
