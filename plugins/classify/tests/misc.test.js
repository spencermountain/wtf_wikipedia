import { readPage } from '../../../tests/_examples/index.js'
import test from 'tape'
import wtf from './_lib.js'

test('classify-test', function (t) {
  const arr = [
    ['2008-British-Motorcycle-Grand-Prix', 'Event'],
    ['Allen-R-Morris', 'Person'],
    ['Toronto-Star', 'Organization'],
    ['Alsea-Company', 'Organization/Company'],
    // ['Antique-Band', 'Organization/MusicalGroup'],
    ['Raith-Rovers', 'Organization/SportsTeam'],
    ['Terrence-Murphy-American-Football', 'Person/Athlete/AmericanFootballPlayer'],
    ['Altimont-Butler', 'Person/Athlete/FootballPlayer'],
    ['University-Of-Nevada-Reno-Arboretum', 'Place'],
    ['Bradley-Community-Lincoln-County-Wisconsin', 'Place'],
    ['Clint-Murchison-Sr', 'Person'],
    ['Charlie-Milstead', 'Person/Athlete/AmericanFootballPlayer'],
    ['Gregory-Serper', 'Person'],
    ['United-Kingdom', 'Place/Jurisdiction'],
    ['Teymanak-E-Olya', 'Place'],
    ['Toronto', 'Place/Jurisdiction/City'],
    ['Royal-Cinema', 'Place'],
    ['Canton-Of-Etaples', 'Place/Jurisdiction'],
    // ['Arts-Club-Of-Chicago', 'Place'],
    ['Al-Haytham', 'Person/Creator'],
    ['The-Field-Of-Waterloo', 'Creation/CreativeWork/Book'],
    ['Liste-Der-Argentinischen-Botschafter-In-Chile', null],
  ]
  arr.forEach((a) => {
    const txt = readPage(a[0])
    const doc = wtf(txt)
    const res = doc.classify()
    t.equal(res.type, a[1], a[0])
  })
  t.end()
})
