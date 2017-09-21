'use strict';
var test = require('tape');
var path = require('path');
var fs = require('fs');
const wtf = require('../src/index');

//read cached file
var fetch = function(file) {
  return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
};

test('bluejays table', t => {
  var bluejays = fetch('bluejays');
  let arr = wtf.parse(bluejays).sections[0].tables[0];
  t.equal(arr.length, 8, 'table-length-bluejays');
  t.equal(arr[0]['Level'].text, 'AAA', 'level-col');
  t.equal(arr[0]['Team'].text, 'Buffalo Bisons', 'team-col');
  t.equal(arr[0]['League'].text, 'International League', 'league-col');
  t.equal(arr[1]['Location'].text, 'Manchester, New Hampshire', 'location-col');
  t.end();
});

test('rnli stations', t => {
  var wiki = fetch('rnli_stations');
  let doc = wtf.parse(wiki);
  t.equal(doc.categories.length, 5, 'cat-length');

  let intro = doc.sections[0];
  t.equal(intro.title, '', 'intro-title');
  t.equal(intro.images.length > 0, true, 'intro-image-length');
  t.equal(intro.sentences.length > 0, true, 'intro-sentence-length');

  let key = doc.sections[1];
  t.equal(key.depth, 1, 'key-depth');
  t.equal(key.title, 'Key', 'key-title');
  t.equal(key.sentences.length, 0, 'key-no-sentences');
  t.equal(key.images, undefined, 'key-no-images');
  t.equal(key.templates, undefined, 'key-no-templates');
  t.equal(key.lists, undefined, 'key-no-lists');
  t.equal(key.tables, undefined, 'key-no-tables');

  let lifeboat = doc.sections[2];
  t.equal(lifeboat.depth, 2, 'lifeboat-depth');
  t.equal(lifeboat.templates.main[0], 'Royal National Lifeboat Institution lifeboats', 'lifeboat-main');
  t.equal(lifeboat.lists[0].length, 3, 'lifeboat-list');
  t.equal(lifeboat.sentences.length, 3, 'lifeboat-sentences');
  t.equal(lifeboat.images, undefined, 'lifeboat-no-images');
  t.equal(lifeboat.tables, undefined, 'lifeboat-no-tables');

  let east = doc.sections[6];
  t.equal(east.title, 'East Division', 'East Division');
  t.equal(east.images, undefined, 'East-no-images');
  t.equal(east.lists, undefined, 'East-no-lists');
  t.equal(east.sentences.length, 0, 'east-sentences');
  let table = east.tables[0];
  t.equal(table.length, 42, 'east table-rows');
  t.equal(table[0].Location.text, 'Hunstanton, Norfolk', 'east-table-data');
  t.equal(table[41]['Launch method'].text, 'Carriage', 'east-table-data-end');

  let south = doc.sections[7];
  let sTable = south.tables[0];
  t.equal(sTable.length, 35, 'south-table-rows');
  t.equal(sTable[0].Location.text, 'Mudeford, Dorset', 'south-table-data');
  t.end();
});

// https://en.wikipedia.org/wiki/Help:Table
test('simple table', t => {
  let simple = `{| class="wikitable"
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
|}`;
  var obj = wtf.parse(simple);
  var table = obj.sections[0].tables[0];
  t.equal(table.length, 2, '2 rows');
  t.equal(table[0]['Header 1'].text, 'row 1, cell 1', '1,1');
  t.equal(table[0]['Header 2'].text, 'row 1, cell 2', '1,2');
  t.equal(table[0]['Header 3'].text, 'row 1, cell 3', '1,3');
  t.equal(table[1]['Header 1'].text, 'row 2, cell 1', '2,1');
  t.equal(table[1]['Header 2'].text, 'row 2, cell 2', '2,2');
  t.equal(table[1]['Header 3'].text, 'row 2, cell 3', '2,3');
  t.end();
});

test('multiplication table', t => {
  let mult = `{| class="wikitable" style="text-align: center; width: 200px; height: 200px;"
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
|}`;
  var obj = wtf.parse(mult);
  var table = obj.sections[0].tables[0];
  t.equal(table[0]['1'].text, '1', '1x1');
  t.equal(table[1]['1'].text, '2', '1x2');
  t.equal(table[1]['2'].text, '4', '2x2');
  t.end();
});

test('inline-table-test', t => {
  let inline = `{| class="wikitable"
|+ style="text-align: left;" | Data reported for 2014–2015, by region<ref name="Garcia 2005" />
|-
! scope="col" | Year !! scope="col" | Africa !! scope="col" | Americas !! scope="col" | Asia & Pacific !! scope="col" | Europe
|-
! scope="row" | 2014
| 2,300 || 8,950 || ''9,325'' || 4,200
|-
! scope="row" | 2015
| 2,725 || ''9,200'' || 8,850 || 4,775
|}`;
  let obj = wtf.parse(inline);
  let table = obj.sections[0].tables[0];
  t.equal(table[0].Year.text, '2014', 'first year');
  t.equal(table[0].Africa.text, '2,300', 'africa first-row');
  t.equal(table[0].Americas.text, '8,950', 'america first-row');
  t.equal(table[1].Europe.text, '4,775', 'europe second-row');
  t.end();
});

test('floating-tables-test', t => {
  //we don't (and probably can't) fully support this rn
  let floating = `{| class="wikitable floatright"
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
|}`;
  let obj = wtf.parse(floating);
  t.equal(obj.sections[0].tables.length, 2, 'two tables');
  console.log(obj.sections[0].tables);
  let table = obj.sections[0].tables[0];
  console.log(table);
  t.equal(table[0]['col-0'].text, 'Col 1, row 1', '1,1');
  t.end();
});

test('wikisortable-tables-test', t => {
  //we don't (and probably can't) fully support this rn
  let sortable = `{| class="wikitable sortable"
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
|}`;
  let obj = wtf.parse(sortable);
  t.equal(obj.sections[0].tables.length, 1, 'one table');
  let table = obj.sections[0].tables[0];
  console.log(obj.sections[0]);
  t.equal(table[0]['Alphabetic'].text, 'd', '1,1');
  t.equal(table[0]['Numeric'].text, '20', '1,2');
  t.equal(table[0]['Date'].text, '2008-11-24', '1,3');
  t.equal(table[0]['Unsortable'].text, 'This', '1,4');
  t.equal(table[1]['Alphabetic'].text, 'b', '2,1');
  t.equal(table[2]['Alphabetic'].text, 'a', '3,1');
  t.equal(table[3]['Alphabetic'].text, 'c', '4,1');
  t.equal(table[4]['Alphabetic'].text, 'e', '5,1');
  t.end();
});
