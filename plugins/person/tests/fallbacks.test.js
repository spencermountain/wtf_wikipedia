import test from 'tape'
import wtf from './_lib.js'

test('nationality fallbacks', (t) => {
  let doc = wtf(`{{Infobox person|name=X|nationality=Mexican}}`)
  t.equal(doc.nationality(), 'Mexican', 'nationality field wins')
  doc = wtf(`{{Infobox person|name=X|citizenship=Canadian}}`)
  t.equal(doc.nationality(), 'Canadian', 'citizenship field')
  doc = wtf(`'''Billy Casper''' was an American professional golfer.`)
  t.equal(doc.nationality(), 'American', 'sentence demonym')
  doc = wtf(`'''Jonah Lomu''' was a New Zealand rugby union player.`)
  t.equal(doc.nationality(), 'New Zealand', 'two-word demonym')
  doc = wtf(`'''Nolan Ryan''' was a Major League Baseball pitcher.`)
  t.equal(doc.nationality(), null, 'league name is not a demonym')
  t.equal(wtf(`'''Sam Person''' sat down.`).nationality(), null, 'no signal → null')
  t.end()
})

test('birthPlace fallbacks', (t) => {
  let doc = wtf(`{{Infobox person|name=X|birth_place=[[Toronto]]}} born in Paris. [[Category:People from Geneva]]`)
  t.equal(doc.birthPlace(), 'Toronto', 'infobox wins')
  doc = wtf(`'''Elvis Presley''' was born in Tupelo, Mississippi, and raised in Memphis.`)
  t.equal(doc.birthPlace(), 'Tupelo, Mississippi', 'born in sentence')
  doc = wtf(`'''Billy Casper''' (born June 24, 1931, in San Diego, California) was a golfer.`)
  t.equal(doc.birthPlace(), 'San Diego, California', 'place after parenthetical date')
  doc = wtf(`hello [[Category:People from Geneva]]`)
  t.equal(doc.birthPlace(), 'Geneva', 'People from category')
  t.equal(wtf(`'''Sam Person''' sat down.`).birthPlace(), null, 'no signal → null')
  t.end()
})
