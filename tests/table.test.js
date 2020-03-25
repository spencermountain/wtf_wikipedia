var test = require('tape')
var wtf = require('./lib')
var readFile = require('./lib/_cachedPage')

test('bluejays table', t => {
  var arr = readFile('bluejays').tables(0).data
  t.equal(arr.length, 8, 'table-length-bluejays')
  t.equal(arr[0]['Level'].text(), 'AAA', 'level-col')
  t.equal(arr[0]['Team'].text(), 'Buffalo Bisons', 'team-col')
  t.equal(arr[0]['League'].text(), 'International League', 'league-col')
  t.equal(arr[1]['Location'].text(), 'Manchester, New Hampshire', 'location-col')
  t.end()
})

test('rnli stations', t => {
  var doc = readFile('rnli_stations')
  t.equal(doc.categories().length, 5, 'cat-length')

  var intro = doc.sections(0)
  t.equal(intro.title(), '', 'intro-title')
  t.equal(intro.images().length > 0, true, 'intro-image-length')
  t.equal(intro.sentences().length > 0, true, 'intro-sentence-length')

  var key = doc.sections(1)
  t.equal(key.depth, 0, 'key-depth')
  t.equal(key.title(), 'Key', 'key-title')
  t.equal(key.sentences().length, 0, 'key-no-sentences')
  t.deepEqual(key.images(), [], 'key-no-images')
  t.deepEqual(key.templates(), [], 'key-no-templates')
  t.deepEqual(key.lists(), [], 'key-no-lists')
  t.deepEqual(key.tables(), [], 'key-no-tables')

  var lifeboat = doc.sections(2)
  t.equal(lifeboat.depth, 1, 'lifeboat-depth')
  t.equal(lifeboat.templates(0).list[0], 'Royal National Lifeboat Institution lifeboats', 'lifeboat-main')
  t.equal(lifeboat.lists(0).json().length, 3, 'lifeboat-list')
  t.equal(lifeboat.sentences().length, 3, 'lifeboat-sentences')
  t.deepEqual(lifeboat.images(), [], 'lifeboat-no-images')
  t.deepEqual(lifeboat.tables(), [], 'lifeboat-no-tables')

  var east = doc.sections(6)
  t.equal(east.title(), 'East Division', 'East Division')
  t.deepEqual(east.images(), [], 'East-no-images')
  t.deepEqual(east.lists(), [], 'East-no-lists')
  t.equal(east.sentences().length, 0, 'east-sentences')
  var table = east.tables(0).data
  t.equal(table.length, 42, 'east table-rows')
  t.equal(table[0].Location.text(), 'Hunstanton, Norfolk', 'east-table-data')
  t.equal(table[41]['Launch method'].text(), 'Carriage', 'east-table-data-end')

  var south = doc.sections(7)
  var sTable = south.tables(0).data
  t.equal(sTable.length, 35, 'south-table-rows')
  t.equal(sTable[0].Location.text(), 'Mudeford, Dorset', 'south-table-data')
  t.end()
})

// https://en.wikipedia.org/wiki/Help:Table
test('simple table', t => {
  var simple = `{| class="wikitable"
|-
! Header 1
! Header 2
! Header 3
|-
| row 1, cell 1
| row 1, cell 2
| row 1, cell 3
|-
| row 2, cell 1
| row 2, cell 2
| row 2, cell 3
|}`
  var obj = wtf(simple)
  var table = obj.tables(0).data
  t.equal(table.length, 2, '2 rows')
  t.equal(table[0]['Header 1'].text(), 'row 1, cell 1', '1,1')
  t.equal(table[0]['Header 2'].text(), 'row 1, cell 2', '1,2')
  t.equal(table[0]['Header 3'].text(), 'row 1, cell 3', '1,3')
  t.equal(table[1]['Header 1'].text(), 'row 2, cell 1', '2,1')
  t.equal(table[1]['Header 2'].text(), 'row 2, cell 2', '2,2')
  t.equal(table[1]['Header 3'].text(), 'row 2, cell 3', '2,3')
  t.end()
})

test('multiplication table', t => {
  var mult = `{| class="wikitable" style="text-align: center; width: 200px; height: 200px;"
|+ Multiplication table
|-
! ×
! 1
! 2
! 3
|-
! 1
| 1 || 2 || 3
|-
! 2
| 2 || 4 || 6
|-
! 3
| 3 || 6 || 9
|-
! 4
| 4 || 8 || 12
|-
! 5
| 5 || 10 || 15
|}`
  var obj = wtf(mult)
  var table = obj.tables(0).data
  t.equal(table[0]['1'].text(), '1', '1x1')
  t.equal(table[1]['1'].text(), '2', '1x2')
  t.equal(table[1]['2'].text(), '4', '2x2')
  t.end()
})

test('inline-table-test', t => {
  var inline = `{| class="wikitable"
|+ style="text-align: left;" | Data reported for 2014–2015, by region<ref name="Garcia 2005" />
|-
! scope="col" | Year !! scope="col" | Africa !! scope="col" | Americas !! scope="col" | Asia & Pacific !! scope="col" | Europe
|-
! scope="row" | 2014
| 2,300 || 8,950 || ''9,325'' || 4,200
|-
! scope="row" | 2015
| 2,725 || ''9,200'' || 8,850 || 4,775
|}`
  var obj = wtf(inline)
  var table = obj.tables(0).data
  t.equal(table[0].Year.text(), '2014', 'first year')
  t.equal(table[0].Africa.text(), '2,300', 'africa first-row')
  t.equal(table[0].Americas.text(), '8,950', 'america first-row')
  t.equal(table[1].Europe.text(), '4,775', 'europe second-row')
  t.end()
})

test('floating-tables-test', t => {
  //we don't (and probably can't) fully support this rn
  var floating = `{| class="wikitable floatright"
| Col 1, row 1
| rowspan="2" | Col 2, row 1 (and 2)
| Col 3, row 1
|-
| Col 1, row 2
| Col 3, row 2
|}
{| class="wikitable floatleft"
| Col 1, row 1
| rowspan="2" | Col 2, row 1 (and 2)
| Col 3, row 1
|-
| Col 1, row 2
| Col 3, row 2
|}`
  var obj = wtf(floating)
  t.equal(obj.tables().length, 2, 'two tables')
  var table = obj.tables(0).data
  t.equal(table[0]['col1'].text(), 'Col 1, row 1', '1,1')
  t.end()
})

test('wikisortable-tables-test', t => {
  //we don't (and probably can't) fully support this rn
  var sortable = `{| class="wikitable sortable"
|+ Sortable table
|-
! scope="col" | Alphabetic
! scope="col" | Numeric
! scope="col" | Date
! scope="col" class="unsortable" | Unsortable
|-
| d || 20 || 2008-11-24 || This
|-
| b || 8 || 2004-03-01 || column
|-
| a || 6 || 1979-07-23 || cannot
|-
| c || 4 || 1492-12-08 || be
|-
| e || 0 || 1601-08-13 || sorted.
|}`
  var obj = wtf(sortable)
  t.equal(obj.tables().length, 1, 'one table')
  var table = obj.tables(0).data
  t.equal(table[0]['Alphabetic'].text(), 'd', '1,1')
  t.equal(table[0]['Numeric'].text(), '20', '1,2')
  t.equal(table[0]['Date'].text(), '2008-11-24', '1,3')
  t.equal(table[0]['Unsortable'].text(), 'This', '1,4')
  t.equal(table[1]['Alphabetic'].text(), 'b', '2,1')
  t.equal(table[2]['Alphabetic'].text(), 'a', '3,1')
  t.equal(table[3]['Alphabetic'].text(), 'c', '4,1')
  t.equal(table[4]['Alphabetic'].text(), 'e', '5,1')
  t.end()
})

test('messy-table-test', t => {
  var messy = ` {| class="wikitable"
     |[[File:Worms 01.jpg|199x95px]]
      |[[File:Worms Wappen 2005-05-27.jpg|199x95px]]
  |<!--col3-->[[File:Liberty-statue-with-manhattan.jpg|199x95px]]
  |<!--col4-->[[File:New-York-Jan2005.jpg|100x95px]]<!--smaller-->


    |-
  |<!--col1-->Nibelungen Bridge to Worms
  |Worms and its sister cities
  |Statue of Liberty
  |New York City
 |}`
  var obj = wtf(messy)
  var table = obj.tables(0).json()
  t.equal(table[1]['col1'].text, 'Nibelungen Bridge to Worms', 'col1 text')
  // var keyVal=obj.tables(0).keyValue()
  // t.equal()
  t.end()
})

test('embedded-table', t => {
  var str = ` {|
  | one
  | two
  | three
  |-
  {|
  | inside one
  | inside two
  | inside [[three]]
  |}
  |Statue of Liberty
  |New York City
  |[[Chicago]]
  |}
  `
  var tables = wtf(str).tables()
  t.equal(tables.length, 2, 'found both tables')
  t.equal(tables[0].links().length, 1, 'found one link')
  t.equal(tables[1].links().length, 1, 'found another link')
  t.end()
})

test('embedded-table-2', t => {
  var str = ` {| class="oopsie"
  | first row
  |-
  | Secod row
  {|
  |-
  | embed 1
  |-
  | embed 2
  |}
  |-
  | Berlin!
  |-
  |}

  Actual first sentence is here`
  var doc = wtf(str)
  t.equal(doc.tables().length, 2, 'found both tables')
  var text = doc.sentences(0).text()
  t.equal('Actual first sentence is here', text, 'got proper first sentence')
  t.end()
})

test('sortable table', t => {
  var str = `{|class="wikitable sortable"
  !Name and Surname!!Height
  |-
  |data-sort-value="Smith, John"|John Smith||1.85
  |-
  |data-sort-value="Ray, Ian"|Ian Ray||1.89
  |-
  |data-sort-value="Bianchi, Zachary"|Zachary Bianchi||1.72
  |-
  !Average:||1.82
  |}`
  var doc = wtf(str)
  var row = doc.tables(0).data[0]
  t.equal(row.Height.text(), '1.85', 'got height')
  t.equal(row['Name and Surname'].text(), 'John Smith', 'got name')
  t.end()
})

test('missing-row test', t => {
  var str = `{|class="wikitable"
  |-
  ! style="background:#ddf; width:0;"| #
  ! style="background:#ddf; width:11%;"| Date
  ! style="background:#ddf; width:14%;"| Opponent
  ! style="background:#ddf; width:9%;"| Score
  ! style="background:#ddf; width:18%;"| Win
  ! style="background:#ddf; width:18%;"| Loss
  ! style="background:#ddf; width:16%;"| Save
  ! style="background:#ddf; width:0;"| Attendance
  ! style="background:#ddf; width:0;"| Record
  |-align="center" bgcolor="bbffbb"
  | 2 || April 2 || @ [[2014 New York Mets season|Mets]] || 5–1 || '''[[Gio González|González]]''' (1–0) || [[Bartolo Colón|Colón]] (0–1) || || 29,146 || 2–0
  |-align="center" bgcolor="bbffbb"
  | 3 || April 3 || @ [[2014 New York Mets season|Mets]] || 8–2 || '''[[Tanner Roark|Roark]]''' (1–0) || [[Zack Wheeler|Wheeler]] (0–1) || || 20,561 || 3–0
  |-align="center" bgcolor="ffbbbb"
  | 4 || April 4 || [[2014 Atlanta Braves season|Braves]] || 2–1 || [[Luis Avilán|Avilán]] (1–0) || '''[[Tyler Clippard|Clippard]]''' (0–1) || [[Craig Kimbrel|Kimbrel]] (3) || 42,834 || 3–1
  |-align="center" bgcolor="ffbbbb"
  | 5 || April 5 || [[2014 Atlanta Braves season|Braves]] || 6–2 || [[Julio Teherán|Teherán]] (1–1) || '''[[Stephen Strasburg|Strasburg]]''' (0–1) || || 37,841 || 3–2
  |-align="center" bgcolor="bbffbb"
  |}
  Actual first sentence  is here`
  var row = wtf(str).tables(0).data[0]
  t.equal(row.Save.text(), '', 'got empty property')
  t.equal(row.Record.text(), '2–0', 'got last property')
  t.end()
})

test('table newline removal', t => {
  var str = `hello this is the top
{| class="wikitable" style="font-size: 95%;"
| 1
| [[Daugpiļs]]
|-
| 2
| [[Jākubmīsts]]
|-
| 3
| [[Rēzne]]
|}
`
  var doc = wtf(str)
  t.equal(doc.text(), 'hello this is the top', 'text on top')
  t.end()
})

test('table rowspan', t => {
  var str = `{| class="wikitable"
| rowspan="2"| one
| two
| three
|-
| two B
| three B
|}`
  var doc = wtf(str)
  var table = doc.tables(0).keyValue()
  t.equal(table[0].col1, 'one', 'has init')
  t.equal(table[1].col1, 'one', 'has copy')
  t.equal(table[0].col2, 'two', 'has later')
  t.equal(table[0].col3, 'three', 'has later')
  t.equal(table[1].col2, 'two B', 'has later 1')
  t.equal(table[1].col3, 'three B', 'has later 2')
  t.end()
})

test('table colspan', t => {
  var str = `{| class="wikitable"
| colspan="2" style="text-align:center;"| one/two
| three
|-
| one B
| two B
| three B
|}`
  var doc = wtf(str)
  var table = doc.tables(0).keyValue()
  t.equal(table[0].col1, 'one/two', 'has init')
  t.equal(table[0].col2, '', 'has empty span')
  t.equal(table[0].col3, 'three', 'has after span')

  t.equal(table[1].col1, 'one B', 'has one b')
  t.equal(table[1].col2, 'two B', 'has two B')
  t.equal(table[1].col3, 'three B', 'has three C')
  t.end()
})

//use first row as the table header
test('first-row as header', t => {
  var simple = `{| class="wikitable"
|-
| Name
| Country
| Rank
|-
| spencer || canada || captain
|-
| john || germany || captain
|-
| april || sweden || seargent
|-
| may || sweden || caption
|}`
  var obj = wtf(simple)
  var table = obj.tables(0).json()
  t.equal(table.length, 4, '4 rows')
  t.equal(table[0]['name'].text, 'spencer', 'got name 1')
  t.equal(table[0]['country'].text, 'canada', 'got country 1')
  t.equal(table[0]['rank'].text, 'captain', 'got rank 1')
  t.equal(table[2]['rank'].text, 'seargent', 'got rank 3')
  t.end()
})

//two-row header composite
test('two-rows as header', t => {
  var str = `{| class="wikitable"
  |-
  ! A
  ! B
  ! C
  ! D
  |-
  !
  !
  !
  ! D2
  ! E2
  |-
  | a || b || c || d || e
  |}`
  var table = wtf(str)
    .tables(0)
    .keyValue()
  t.equal(table.length, 1, '1 row')
  t.equal(table[0].A, 'a', 'got col 1')
  t.equal(table[0].D2, 'd', 'got col d2')
  t.equal(table[0].E2, 'e', 'got col e2')
  t.end()
})

//two-row header with spans
test('two-header-rows-with-spans', t => {
  var str = `{| class="wikitable"
  |-
  ! A
  ! B
  ! rowspan="2" | C
  ! colspan="3" | D
  |-
  !
  !
  ! D2
  ! E2
  |-
  | a || b || c || d || e
  |}`
  var table = wtf(str)
    .tables(0)
    .keyValue()
  t.equal(table.length, 1, '1 row')
  t.equal(table[0].A, 'a', 'got col 1')
  t.equal(table[0].C, 'c', 'got col c')
  t.equal(table[0].D2, 'd', 'got col d2')
  t.equal(table[0].E2, 'e', 'got col e2')
  t.end()
})

//nfl football table
test('junky-table', t => {
  var str = `{| class="navbox plainrowheaders wikitable" style="width:100%"
! A
! B
! C
! D
|-
!style="{{Gridiron primary style|AFC}};" colspan="8"|[[American Football Conference|<span style="{{Gridiron secondary color|AFC}};">American Football Conference</span>]]
|-
!style=background:white rowspan="4"|[[AFC East|East]]
|'''[[Buffalo Bills]]'''
|[[Orchard Park (town), New York|Orchard Park, New York]]
|-
|'''[[Miami Dolphins]]'''
|[[Miami Gardens, Florida]]
|[[Hard Rock Stadium]]
|-
|}`
  var table = wtf(str)
    .tables(0)
    .keyValue()
  t.equal(table.length, 2, '2 row2')
  t.equal(table[0].A, 'East', 'got col a1')
  t.equal(table[0].C, 'Orchard Park, New York', 'got col c1')
  t.equal(table[1].A, 'East', 'got col a2')
  t.equal(table[1].D, 'Hard Rock Stadium', 'got col c2')
  t.end()
})

test('table double bar', t => {
  var str = `{| class="wikitable"
|-
! h1
! h2
! h3
|-
| a
| aa
| aaa
|-
| b || bb || bbb
|-
| c
|| cc
|| ccc
|}`
  var doc = wtf(str)
  var data = doc.tables(0).keyValue()
  t.equal(data[0].h1, 'a', 'h1')
  t.equal(data[0].h2, 'aa', 'h2')
  t.equal(data[0].h3, 'aaa', 'h3')
  t.equal(data[1].h1, 'b', 'h1')
  t.equal(data[1].h2, 'bb', 'h2')
  t.equal(data[1].h3, 'bbb', 'h3')
  t.equal(data[2].h1, 'c', 'h1')
  t.equal(data[2].h2, 'cc', 'h2')
  t.equal(data[2].h3, 'ccc', 'h3')
  t.end()
})

//testing https://github.com/spencermountain/wtf_wikipedia/issues/332
test('table newline', t => {
  var str = `{| class="wikitable"
|-
! h1
! h2
! h3
|-
| a
| b1<br />b2
| c
|-
| a
| b1
b2
| c
|}`
  var doc = wtf(str)
  var data = doc.tables(0).keyValue()
  t.equal(data[0].h1, 'a', 'h1')
  t.equal(data[0].h2, 'b1 b2', 'h2')
  t.equal(data[0].h3, 'c', 'h3')
  t.equal(data[0].h1, 'a', 'h1')
  t.equal(data[0].h2, 'b1 b2', 'h2')
  t.equal(data[0].h3, 'c', 'h3')
  t.end()
})
