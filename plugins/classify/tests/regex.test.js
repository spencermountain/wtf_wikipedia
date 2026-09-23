import test from 'tape'
import Album from '../schema/Creation/CreativeWork/Album.js'
import Book from '../schema/Creation/CreativeWork/Book.js'
import Film from '../schema/Creation/CreativeWork/Film.js'
import Song from '../schema/Creation/CreativeWork/Song.js'
import byTitle from '../src/byTitle/index.js'

test('category years can occur anywhere before the category type', (t) => {
  for (const [schema, word] of [[Album, 'albums'], [Book, 'novels'], [Film, 'films'], [Song, 'songs']]) {
    const matches = (str) => schema.categories.patterns.some((re) => re.test(str))
    t.ok(matches(`early 1990 and 2000 ${word} released`), word)
    t.notOk(matches(`1990\n${word} released`), 'year and type must share a line')
    t.notOk(matches('1'.repeat(100000)), 'long digit run without a type')
  }
  t.deepEqual(byTitle({ title: () => 'Title (film)\ntrailer' }), [], 'a qualifier must end the title')
  t.deepEqual(byTitle({ title: () => 'Title ' + '('.repeat(100000) }), [], 'unclosed parentheses')
  t.end()
})
