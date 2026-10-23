import test from 'tape'
import wtf from '../../lib/index.js'
import { WrapperArray, wrapMethods } from '../../../src/_lib/plural-wrapper.ts'

test('plural collections preserve item behavior and Array operations', (t) => {
  const doc = wtf(`{{Infobox person|name=[[Alice]]}}
Hello [[Bob]].<ref>[[Carol]]</ref>
[[File:Example.jpg|thumb|[[Dave]]]]
* [[Eve]]
{| class="wikitable"
! Name
|-
| [[Frank]]
|}
{{custom example|[[Grace]]}}`)
  const owners = [
    doc, ...doc.sections(), ...doc.paragraphs(), ...doc.sentences(),
    ...doc.images(), ...doc.lists(), ...doc.tables(), ...doc.infoboxes(),
    ...doc.references(), ...doc.templates(),
  ]
  owners.forEach((owner) => {
    const links = owner.links()
    t.ok(Array.isArray(links), 'links remain an array')
    t.deepEqual(links.json(), links.map((link) => link.json()), 'JSON matches individual links')
    t.deepEqual(links.json('xl'), links.map((link) => link.json('xl')), 'arguments are forwarded')
    t.deepEqual(links.page(), links.map((link) => link.page()), 'page methods are forwarded')
    t.equal(links.map((link) => link.page()).constructor, Array, 'map produces a plain array')
    t.equal(links.filter(() => true).constructor, Array, 'filter produces a plain array')
    t.equal(links.slice().constructor, Array, 'slice produces a plain array')
  })
  const blocks = doc.lists()[0].items()
  t.deepEqual(blocks.text(), ['Eve'], 'list items expose Block methods')
  t.deepEqual(blocks[0].links().page(), ['Eve'], 'Block links use Links')
  t.deepEqual(doc.tables()[0].headers().text(), ['Name'], 'headers expose Block methods')
  t.deepEqual(doc.tables()[0].cells().text(), ['Name', 'Frank'], 'cells expose Block methods')
  t.end()
})

test('empty collections and filtered templates', (t) => {
  const doc = wtf('')
  const methods = ['links', 'images', 'lists', 'sentences', 'infoboxes', 'references', 'citations', 'tables', 'templates']
  methods.forEach((name) => {
    t.deepEqual(doc[name]().json(), [], `${name} returns empty JSON`)
  })
  const templates = wtf('{{custom example|value}}')
  t.equal(templates.templates('custom example').json().length, 1, 'filtered templates keep collection methods')
  t.deepEqual(templates.templates('missing').json(), [], 'missing templates keep collection methods')
  t.end()
})

test('infobox access distinguishes one Block from many', (t) => {
  const box = wtf('{{Infobox person|name=[[Alice]]|First|Second}}').infobox()
  t.equal(box.get('name').text(), 'Alice', 'get returns one Block')
  t.equal(box.get('list').text(), 'First', 'get selects the first value of a multi-value field')
  t.equal(box.getFirst(['missing', 'list', 'name']).text(), 'First', 'getFirst follows key order')
  t.equal(box.get('missing'), undefined, 'missing field is undefined')
  t.equal(box.getFirst(['missing']), undefined, 'missing choices are undefined')
  t.deepEqual(box.getAll(['missing', 'list', 'name']).text(), ['First', 'Second', 'Alice'], 'getAll preserves every value in order')
  t.deepEqual(box.getAll(['missing']).json(), [], 'missing values are omitted')
  t.deepEqual(box.getAll([]).json(), [], 'empty choices return an empty collection')
  t.end()
})

test('custom collection and Array methods take precedence', (t) => {
  class Parent {
    inherited() { return 'inherited' }
  }
  class Item extends Parent {
    text() { return 'item' }
    map() { return 'item map' }
  }
  class Items extends WrapperArray {
    text() { return 'custom' }
  }
  wrapMethods(Items, Item)
  const items = Items.from([new Item()])
  t.equal(items.text(), 'custom', 'explicit collection method wins')
  t.deepEqual(items.inherited(), ['inherited'], 'inherited item methods are included')
  t.deepEqual(items.map(() => 'array map'), ['array map'], 'native Array method wins')
  t.end()
})
