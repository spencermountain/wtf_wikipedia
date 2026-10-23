import test from 'tape'
import wtf from '../../lib/index.js'
import { WrapperArray, wrapMethods, refreshWrappers } from '../../../src/_lib/plural-wrapper.ts'

test('plugins refresh existing and empty collections', (t) => {
  const links = wtf('[[Alice]]').links()
  const empty = wtf('').links()
  let Link
  const result = wtf.extend((models) => {
    Link = models.Link
    Link.prototype.collectionExample = function (prefix) {
      return prefix + this.page()
    }
  })
  t.equal(result, wtf, 'extend remains chainable')
  t.deepEqual(links.collectionExample('Hi '), ['Hi Alice'], 'existing collections gain the method and forward arguments')
  t.deepEqual(empty.collectionExample('Hi '), [], 'existing empty collections gain the method')
  t.deepEqual(wtf('[[Bob]]').links().collectionExample('Hi '), ['Hi Bob'], 'new collections gain the method')

  const forwarder = links.collectionExample
  wtf.plugin((models) => {
    models.Link.prototype.collectionExample = function () {
      return this.page().toUpperCase()
    }
    models.Link.prototype.anotherCollectionExample = function () {
      return this.page().length
    }
  })
  t.equal(links.collectionExample, forwarder, 'refresh keeps existing forwarders')
  t.deepEqual(links.collectionExample(), ['ALICE'], 'forwarders use replaced item methods')
  t.deepEqual(links.anotherCollectionExample(), [5], 'plugin alias refreshes newly added methods')

  delete Link.prototype.collectionExample
  delete Link.prototype.anotherCollectionExample
  delete links.constructor.prototype.collectionExample
  delete links.constructor.prototype.anotherCollectionExample
  t.end()
})

test('refresh preserves custom collection and native Array methods', (t) => {
  class Parent {}
  class Item extends Parent {}
  class Items extends WrapperArray {
    label() { return 'custom' }
  }
  wrapMethods(Items, Item)
  const items = Items.from([new Item()])
  Parent.prototype.inheritedExample = () => 'parent'
  Item.prototype.label = () => 'item'
  Item.prototype.map = () => 'item map'
  refreshWrappers()
  refreshWrappers()
  t.deepEqual(items.inheritedExample(), ['parent'], 'new inherited methods are discovered')
  t.equal(items.label(), 'custom', 'custom method takes precedence')
  t.deepEqual(items.map(() => 'mapped'), ['mapped'], 'native map takes precedence')
  t.end()
})
