'use strict';
var test = require('tape');
var fs = require('fs');
var path = require('path');
var wtf = require('./lib');
var docs = require('../api');
//read cached file
var readFile = function(file) {
  return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
};

var pages = [
  'al_Haytham',
  'Senate_of_Pakistan',
  'Sara-C.-Bisel',
  'Mozilla-Firefox',
  'Teymanak-e-Olya',
  'The-Field-of-Waterloo',
  'RNDIS',
];

test('Document methods do not throw', t => {
  pages.forEach((page) => {
    var doc = wtf(readFile(page));
    docs.Document.forEach((obj) => {
      var desc = page + ' - ' + obj.name;
      console.log(desc);
      t.doesNotThrow(doc[obj.name](), desc);
    });
  });
  t.end();
});
