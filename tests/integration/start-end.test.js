const wtf = require('../lib')
const test = require('tape')

test('nba-start-end', function (t) {
  const str = `hello world
  {{NBA roster statistics start|team=Cleveland Cavaliers}}
  |-
  | style="text-align:left;"| {{sortname|Matthew|Dellavedova}} || 6 || 0 || 7.6 || .263 || .167 || .833 || 0.5 || 1.0 || 0.0 || 0.0 || 2.7
  |-
  | style="text-align:left;"| {{sortname|Channing|Frye}} || 4 || 0 || 8.3 || .000 || .000 || '''1.000''' || 0.8 || 0.0 || 0.0 || 0.5 || 0.5
  |-
  | style="text-align:left;"| {{sortname|Kyrie|Irving}} || 7 || 7 || 39.0 || .468 || '''.405''' || .939 || 3.9 || 3.9 || 2.1 || 0.7 || 27.1
  |-! style="background:#FDE910;"
  | style="text-align:left;"| {{sortname|LeBron|James}} || 7 || 7 || '''41.7''' || .494 || .371 || .721 || '''11.3''' || '''8.9''' || '''2.6''' || '''2.3''' || '''29.7'''
  |-
  | style="text-align:left;"| {{sortname|Richard|Jefferson}} || 7 || 2 || 24.0 || .516 || .167 || .636 || 5.3 || 0.4 || 1.3 || 0.1 || 5.7
  |-
  | style="text-align:left;"| {{sortname|Mo|Williams}} || 6 || 0 || 4.8 || .333 || .200 || .000 || 0.5 || 0.2 || 0.5 || 0.0 || 1.5
  {{s-end}}`

  const doc = wtf(str)
  t.equal(doc.text(), 'hello world', 'nba-text')
  t.equal(doc.templates().length, 1, 'got-template')
  t.end()
})

test('mlb-start-end', function (t) {
  const str = `hello world
  {{MLB game log section|month=April|style=|hide=y}}
  |- style="background-color:#ffbbbb"
  | 1 || April 2 || @ [[Kansas City Royals|Royals]] || 7 – 1 || [[Gil Meche|Meche]] (1-0)|| '''[[Curt Schilling|Schilling]]''' (0-1) || || 41,257 || 0-1
  |- style="background-color:#bbffbb"
  | 2 || April 4 || @ [[Kansas City Royals|Royals]] || 7 – 1 || '''[[Josh Beckett|Beckett]]''' (1-0) || [[Odalis Pérez|Pérez]] (0 – 1) || || 22,348 || 1-1
  |- style="background-color:#bbffbb"
  | 3 || April 5 || @ [[Kansas City Royals|Royals]] || 4 – 1 || '''[[Daisuke Matsuzaka|Matsuzaka]]''' (1-0) || [[Zack Greinke|Greinke]] (0-1) || '''[[Jonathan Papelbon|Papelbon]]''' (1) || 23,170 || 2-1
  |- style="background-color:#ffbbbb"
  | 4 || April 6 || @ [[Texas Rangers (baseball)|Rangers]] || 2 – 0 || [[Rob Tejeda|Tejeda]] (1-0) || '''[[Tim Wakefield|Wakefield]]''' (0-1) || [[Akinori Otsuka|Otsuka]] (1) || 51,548 || 2-2
  |- style="background-color:#ffbbbb"
  | 5 || April 7 || @ [[Texas Rangers (baseball)|Rangers]] || 8 – 2 || [[Kevin Millwood|Millwood]] (1-0) || '''[[Julián Tavárez|Tavárez]]''' (0-1) || ||40,865 || 2-3
  |- style="background-color:#bbffbb"
  {{MLB game log section end}}`
  const doc = wtf(str)
  t.equal(doc.text(), 'hello world', 'text')
  t.equal(doc.templates().length, 1, 'got-template')
  t.end()
})

test('mlb-start-end-fancy', function (t) {
  const str = `hello world
  {{MLB game log section|style={{Baseball secondary style|New York Yankees}}|stadium=y}}
  |- bgcolor=#fbb
  | [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_05/gid_2018_10_05_nyamlb_bosmlb_1/boxscore_col.html 1] || October 5 || @ [[2018 Boston Red Sox season|Red Sox]] || 4−5 || [[Chris Sale|Sale]] (1–0) || '''[[J.A. Happ|Happ]]''' (0–1) || [[Craig Kimbrel|Kimbrel]] (1) || [[Fenway Park]] || 39,059 || 0–1
  |- bgcolor=#bfb
  | [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_06/gid_2018_10_06_nyamlb_bosmlb_1/boxscore_col.html 2] || October 6 || @ [[2018 Boston Red Sox season|Red Sox]] || 6−2 || '''[[Masahiro Tanaka|Tanaka]]''' (1–0) || [[David Price (baseball)|Price]] (0–1) || — || [[Fenway Park]] || 39,151 || 1−1
  {{MLB game log section end}}`
  const doc = wtf(str)
  t.equal(doc.text(), 'hello world', 'text')
  t.equal(doc.templates().length, 1, 'got-template')
  let rows = doc.template().data
  t.equal(rows.length, 2, 'got-both rows')
  t.equal(rows[0].stadium, 'Fenway Park', 'got stadium')
  t.equal(rows[0].attendance, '39,059', 'got attendance')
  t.equal(rows[1].stadium, 'Fenway Park', 'got stadium2')
  t.equal(rows[1].attendance, '39,151', 'got attendance2')
  t.end()
})

test('mma-start-end', function (t) {
  const str = `hello world
  {{MMA record start}}
  |-
  |{{no2}}Loss
  |align=center|4–6
  |Wayne Cole
  |Submission (armbar)
  |SJW 3 - Slammin Jammin Weekend 3
  |{{dts|2009|May|09}}
  |align=center|1
  |align=center|0:36
  |
  |
  |-
  |{{no2}}Loss
  |align=center|4–5
  |[[Ryan Jimmo]]
  |TKO (punches)
  |PFP: Wanted
  |{{dts|2008|November|29}}
  |align=center|1
  |align=center|2:24
  |[[Dartmouth, Nova Scotia]], Canada
  |
  |-
  |{{no2}}Loss
  |align=center|4–4
  |[[Hector Ramirez (fighter)|Hector Ramirez]]
  |Decision (unanimous)
  |SuperFights MMA - Night of Combat 2
  |{{dts|2008|October|11}}
  |align=center|3
  |align=center|5:00
  |Las Vegas, Nevada, USA
  |
{{end}}`

  const doc = wtf(str)
  t.equal(doc.text(), 'hello world', 'text')
  t.equal(doc.templates().length, 1, 'got-template')
  t.end()
})
