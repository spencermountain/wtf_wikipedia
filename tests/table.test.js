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
  t.equal(arr.length, 8);
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
