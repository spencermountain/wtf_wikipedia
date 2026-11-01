import test from 'tape'
import wtf from './_lib.js'

// localized parameter names should reach the english accessors
test('i18n localized cite params make real references', (t) => {
  const pairs = [
    ['{{lien web|titre=Bonjour|url=https://a.fr|auteur=Jean}}', 'Bonjour'], // fr
    ['{{cita web|título=Hola|url=https://a.es}}', 'Hola'], // es
    ['{{cytuj stronę|tytuł=Dzień dobry|url=https://a.pl}}', 'Dzień dobry'], // pl
    ['{{internetquelle|titel=Hallo|url=https://a.de|abruf=2024-01-01}}', 'Hallo'], // de
    ['{{ouvrage|titre=Le Livre|auteur=Jean Dupont}}', 'Le Livre'], // fr
  ]
  pairs.forEach(([str, want]) => {
    const refs = wtf(`x.<ref>${str}</ref>`).references()
    t.equal(refs.length, 1, `one reference: ${want}`)
    t.equal(refs[0].title(), want, `title: ${want}`)
  })
  t.end()
})

test('i18n localized cite params are renamed in data', (t) => {
  const doc = wtf('x.<ref>{{literatur|autor=Anna Schmidt|titel=Das Buch|jahr=2001|verlag=Springer}}</ref>')
  const ref = doc.references()[0]
  t.equal(ref.title(), 'Das Buch', 'german book title')
  const data = ref.json().data
  t.equal(data.author, 'Anna Schmidt', 'autor → author')
  t.equal(data.year, '2001', 'jahr → year')
  t.equal(data.publisher, 'Springer', 'verlag → publisher')
  t.end()
})

test('i18n an existing english param is never overwritten', (t) => {
  const ref = wtf('x.<ref>{{lien web|title=English|titre=French|url=https://a.fr}}</ref>').references()[0]
  t.equal(ref.title(), 'English', 'english param wins over its localized twin')
  t.end()
})
