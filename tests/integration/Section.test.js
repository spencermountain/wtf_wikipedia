import test from 'tape'
import wtf from '../lib/index.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))

//title
test('Tile - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(1)
  t.equal(sec.title(), 'Introduction', 'the title should equal "Introduction"')
  t.end()
})

test('Tile - get - with no title', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  t.equal(sec.title(), '', 'the title should equal ""')
  t.end()
})

//index
test('index - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(1)
  t.equal(sec.index(), 1, 'the index should equal "1"')
  t.end()
})

//indentation
test('indentation - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(1)
  t.equal(sec.indentation(), 0, 'the index should equal "0"')
  t.end()
})

test('indentation - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  t.equal(sec.indentation(), 1, 'the index should equal "1"')
  t.end()
})

//sentences
test('sentences - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)

  const expected = [109, 229, 118, 120, 95, 94, 192, 107, 138, 143, 165, 155, 39, 100, 197, 101]
  t.deepEqual(
    sec.sentences().map((s) => s.text().length),
    expected,
    'the index should equal the expected'
  )
  t.end()
})

test('sentences - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  t.equal(sec.sentence(1).text().length, 229, 'the index should equal the expected')
  t.end()
})

//paragraphs
test('paragraphs - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  const expected = [675, 1141, 299]
  t.deepEqual(
    sec.paragraphs().map((s) => s.text().length),
    expected,
    'the paragraphs should equal the expected'
  )
  t.end()
})

test('paragraphs - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  t.equal(sec.paragraph(1).text().length, 1141, 'the paragraphs should equal the expected')
  t.end()
})

//paragraph
test('paragraphs - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  t.equal(sec.paragraph().text().length, 675, 'the paragraphs should equal the expected')
  t.end()
})

test('paragraphs - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  t.equal(sec.paragraph(1).text().length, 1141, 'the paragraphs should equal the expected')
  t.end()
})

//links
test('links - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  const expected = [12, 10, 19, 34, 30, 25, 19, 25, 7, 21]
  t.deepEqual(
    sec.links().map((l) => l.href().length),
    expected,
    'the links should equal the expected'
  )
  t.end()
})

test('links - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  t.equal(sec.link(1).href().length, 10, 'the links should equal the expected')
  t.end()
})

test('links - get - string', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Chemical-biology.txt'), 'utf-8')
  let sec = wtf(str).section(3)
  t.equal(sec.links('protein sequences')[0].href().length, 19, 'the links should equal the expected')
  t.end()
})

//tables
test('tables - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', '2008-British-motorcycle-Grand-Prix.txt'), 'utf-8')
  let sec = wtf(str).section(1)
  const expected = [18]
  t.deepEqual(
    sec.tables().map((s) => s.keyValue().length),
    expected,
    'the tables should equal the expected'
  )
  t.end()
})

test('tables - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', '2008-British-motorcycle-Grand-Prix.txt'), 'utf-8')
  let sec = wtf(str).section(1)
  t.equal(sec.table(0).keyValue().length, 18, 'the tables should equal the expected')
  t.end()
})

//templates
test('templates - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  const expected = [148, 195, 54, 49, 176, 182, 399, 70, 97, 147, 78, 23]
  t.deepEqual(
    sec.templates().map((s) => JSON.stringify(s.json()).length),
    expected,
    'the templates should equal the expected'
  )
  t.end()
})

test('templates - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  t.equal(JSON.stringify(sec.template(1).json()).length, 195, 'the templates should equal the expected')
  t.end()
})

test('templates - get - string', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  t.equal(JSON.stringify(sec.templates('coord')[0].json()).length, 70, 'the templates should equal the expected')
  t.end()
})

//infoboxes
test('infoboxes - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  const expected = [26, 33]
  t.deepEqual(
    sec.infoboxes().map((s) => JSON.stringify(s).length),
    expected,
    'the infoboxes should equal the expected'
  )
  t.end()
})

test('infoboxes - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  t.equal(JSON.stringify(sec.infobox()).length, 26, 'the infoboxes should equal the expected')
  t.end()
})

//coordinates
test('coordinates - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  const expected = [70]
  t.deepEqual(
    sec.coordinates().map((s) => JSON.stringify(s).length),
    expected,
    'the coordinates should equal the expected'
  )
  t.end()
})

test('coordinates - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  t.equal(JSON.stringify(sec.coordinate()).length, 70, 'the coordinates should equal the expected')
  t.end()
})

//lists
test('lists - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section('See also')
  const expected = [22]
  t.deepEqual(
    sec.lists().map((s) => JSON.stringify(s.lines()).length),
    expected,
    'the lists should equal the expected'
  )
  t.end()
})

test('lists - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section('See also')
  t.equal(JSON.stringify(sec.list().lines()).length, 22, 'the lists should equal the expected')
  t.end()
})

//interwiki

//images
test('images - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section('Background')
  const expected = [124, 79, 89]
  t.deepEqual(
    sec.images().map((s) => s.url().length),
    expected,
    'the images should equal the expected'
  )
  t.end()
})

test('images - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section('Background')
  t.equal(sec.image().url().length, 124, 'the images should equal the expected')
  t.end()
})

test('images - get', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section(0)
  const expected = []
  t.deepEqual(
    sec.images().map((s) => s.url().length),
    expected,
    'the images should equal the expected'
  )
  t.end()
})

test('citations - get - number', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'United-Kingdom.txt'), 'utf-8')
  let sec = wtf(str).section()
  t.equal(sec.citation().title().length, 15, 'the citations should equal the expected')
  t.end()
})
//remove

//nextSibling

//next -- alias of nextSibling

//lastSibling

//last -- alias of lastSibling

//previousSibling -- alias of lastSibling

//previous -- alias of lastSibling

//children

//sections -- alias of lastSibling

//parent

//text

//json

//title

//title
