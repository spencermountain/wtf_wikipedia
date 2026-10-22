import fs from 'node:fs'
import test from 'tape'
import wtf from '../../lib/index.js'

const readInfobox = (name) => {
  return fs.readFileSync(new URL(`../../_examples/misc/infoboxes/${name}.txt`, import.meta.url), 'utf8')
}

test('full fixture: boloZenden infobox', (t) => {
  const boloZenden = readInfobox('boloZenden')
  const o = wtf(boloZenden).infobox().data
  t.equal(o.years1.text, '1993–1998', 'club years')
  t.equal(o.clubs1.text, 'PSV', 'club name')
  t.equal(o.youthyears1.text, '1985–1987', 'youth years')
  t.equal(o.youthclubs1.text, 'MVV', 'youth club')
  t.equal(o.nationalyears1.text, '1997–2004', 'national years')
  t.equal(o.nationalteam1.text, 'Netherlands', 'national team text')
  t.equal(o.nationalteam1.links()[0].page, 'Netherlands national football team', 'national team target')
  t.equal(o.nationalteam1.links()[0].text, 'Netherlands', 'national team label')
  t.equal(o.nationalcaps1.text, '54', 'national caps')
  t.equal(o.nationalgoals1.text, '7', 'national goals')
  t.end()
})

test('full fixture: hurricane infobox', (t) => {
  const hurricane = readInfobox('hurricane')
  const o = wtf(hurricane).infobox().data
  t.equal(o.name.text, 'Tropical Storm Edouard', 'hurricane name')
  t.equal(o.dissipated.text, 'September 6, 2002', 'dissipation date')
  t.equal(o['hurricane season'].text, '2002 Atlantic hurricane season', 'hurricane season')
  t.equal(o.areas.links()[0].page, 'Florida', 'affected area target')
  t.end()
})

test('full fixture: Radiohead infobox', (t) => {
  const radiohead = readInfobox('radiohead')
  const infobox = wtf(radiohead).infobox().data
  t.equal(infobox.current_members.text.match(/Greenwood/g).length, 2, 'current members')
  t.equal(infobox.genre.text, 'Art rock\n\nalternative rock\n\nelectronica\n\nexperimental rock', 'genre')
  t.equal(infobox.associated_acts.text, 'Atoms for Peace\n\n7 Worlds Collide', 'associated-acts')
  t.end()
})

test('full fixture: microsoft currency parsing', (t) => {
  const microsoft = readInfobox('microsoft')
  const infobox = wtf(microsoft).infobox().data
  t.equal(infobox.revenue.text, 'US$89.95\xa0billion', 'revenue =' + infobox.revenue.text)
  t.equal(infobox.operating_income.text, 'US$22.27\xa0billion', 'operating_income =' + infobox.operating_income.text)
  t.equal(infobox.net_income.text, 'US$21.20\xa0billion', 'net_income =' + infobox.net_income.text)
  t.end()
})

test('full fixture: Alabama infobox', (t) => {
  const alabama = readInfobox('alabama')
  const infobox = wtf(alabama).infobox().data
  t.equal(infobox.athletics.text, 'NCAA Division I – SEC', 'athletics =' + infobox.athletics.text)
  t.equal(infobox.country.text, 'U.S.', 'country =' + infobox.country.text)
  t.equal(infobox.president.text, 'Stuart R. Bell', 'president =' + infobox.president.text)
  t.end()
})
