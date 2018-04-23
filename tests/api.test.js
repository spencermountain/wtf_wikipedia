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

test('Document-methods-do-not-throw', t => {
  pages.forEach((page) => {
    var doc = wtf(readFile(page));
    docs.Document.forEach((obj) => {
      var desc = obj.name + ' - ' + page;
      doc[obj.name]();
      t.ok(true, desc);
    });
  });
  t.end();
});

test('Section-methods-do-not-throw', t => {
  pages.forEach((page) => {
    var doc = wtf(readFile(page));
    var sec = doc.sections(0);
    docs.Section.forEach((obj) => {
      var desc = obj.name + ' - ' + page;
      sec[obj.name]();
      t.ok(true, desc);
    });
  });
  t.end();
});

test('Sentence-methods-do-not-throw', t => {
  pages.forEach((page) => {
    var doc = wtf(readFile(page));
    var sen = doc.sentences(0);
    docs.Sentence.forEach((obj) => {
      var desc = obj.name + ' - ' + page;
      sen[obj.name]();
      t.ok(true, desc);
    });
  });
  t.end();
});
