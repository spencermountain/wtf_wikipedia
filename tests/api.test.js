const test = require('tape')
const fs = require('fs')
const path = require('path')
const wtf = require('./lib')
const docs = require('./lib/api.json')

//read cached file
const readFile = function (file) {
  return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8')
}

const pages = [
  'al_Haytham',
  'Mozilla-Firefox',
  'anarchism',
  'toronto',
  'toronto_star',
  'royal_cinema',
  'jodie_emery',
  'Allen-R.-Morris',
  'United-Kingdom',
  'Irina-Saratovtseva',
]

test('Document-methods-do-not-throw', (t) => {
  pages.forEach((page) => {
    const doc = wtf(readFile(page))
    docs.Document.forEach((obj) => {
      const desc = obj.name + ' - ' + page
      doc[obj.name]()
      t.ok(true, desc)
    })
  })
  t.end()
})

test('Section-methods-do-not-throw', (t) => {
  pages.forEach((page) => {
    const doc = wtf(readFile(page))
    const sec = doc.sections(0)
    docs.Section.forEach((obj) => {
      const desc = obj.name + ' - ' + page
      sec[obj.name]()
      t.ok(true, desc)
    })
  })
  t.end()
})

test('Sentence-methods-do-not-throw', (t) => {
  pages.forEach((page) => {
    const doc = wtf(readFile(page))
    const sen = doc.sentences(0)
    docs.Sentence.forEach((obj) => {
      const desc = obj.name + ' - ' + page
      sen[obj.name]()
      t.ok(true, desc)
    })
  })
  t.end()
})

test('Reference-methods-do-not-throw', (t) => {
  pages.forEach((page) => {
    const doc = wtf(readFile(page))
    const sen = doc.references(0)
    docs.Reference.forEach((obj) => {
      const desc = obj.name + ' - ' + page
      sen[obj.name]()
      t.ok(true, desc)
    })
  })
  t.end()
})

test('Image-methods-do-not-throw', (t) => {
  pages.forEach((page) => {
    const doc = wtf(readFile(page))
    const sen = doc.images(0)
    docs.Image.forEach((obj) => {
      const desc = obj.name + ' - ' + page
      sen[obj.name]()
      t.ok(true, desc)
    })
  })
  t.end()
})

test('Infobox-methods-do-not-throw', (t) => {
  const mypages = [
    'al_Haytham',
    'Mozilla-Firefox',
    'toronto',
    'toronto_star',
    'royal_cinema',
    'jodie_emery',
    'Allen-R.-Morris',
    'Irina-Saratovtseva',
  ]
  mypages.forEach((page) => {
    const doc = wtf(readFile(page))
    const sen = doc.infoboxes(0)
    docs.Infobox.forEach((obj) => {
      const desc = obj.name + ' - ' + page
      sen[obj.name]()
      t.ok(true, desc)
    })
  })
  t.end()
})

test('List-methods-do-not-throw', (t) => {
  const mypages = ['al_Haytham', 'Mozilla-Firefox', 'toronto', 'toronto_star', 'jodie_emery', 'Allen-R.-Morris']
  mypages.forEach((page) => {
    const doc = wtf(readFile(page))
    const sen = doc.lists(0)
    docs.List.forEach((obj) => {
      const desc = obj.name + ' - ' + page
      sen[obj.name]()
      t.ok(true, desc)
    })
  })
  t.end()
})

test('Table-methods-do-not-throw', (t) => {
  const mypages = ['Mozilla-Firefox', 'toronto', 'Allen-R.-Morris', 'bluejays']
  mypages.forEach((page) => {
    const doc = wtf(readFile(page))
    const sen = doc.tables(0)
    docs.Table.forEach((obj) => {
      const desc = obj.name + ' - ' + page
      sen[obj.name]()
      t.ok(true, desc)
    })
  })
  t.end()
})
