var path = require('path');
var fs = require("fs");
var parser = require("../src/index").parse;
var Tests = module.exports;

//read cached file
var fetch = function (file) {
  return fs.readFileSync(path.join(__dirname, "cache", file + ".txt"), 'utf-8');
};

Tests['royal_cinema'] = function (test) {
  var data = parser(fetch("royal_cinema"));
  test.equal(data.infobox.opened.text, '1939');
  test.equal(data.infobox_template, 'venue');
  test.equal(data.text.Intro.length, 10);
  test.equal(data.categories.length, 4);
  test.done();
};

Tests['toronto_star'] = function (test) {
  var data = parser(fetch("toronto_star"))
  test.equal(data.infobox.publisher.text, 'John D. Cruickshank');
  test.equal(data.infobox_template, 'newspaper');
  test.equal(data.text.History.length, 21);
  test.equal(data.categories.length, 6);
  test.done();
};

Tests['jodie_emery'] = function (test) {
  var data = parser(fetch("jodie_emery"));
  test.equal(data.infobox.nationality.text, 'Canadian');
  test.equal(data.infobox_template, 'person');
  test.ok(data.text.Intro.length >= 1);
  test.ok(data.text['Political career'].length >= 5);
  test.equal(data.categories.length, 8);
  test.equal(data.images.length, 1);
  test.done();
};

Tests['redirect'] = function (test) {
  var data = parser(fetch("redirect"));
  test.equal(data.type, 'redirect');
  test.equal(data.redirect, 'Toronto');
  test.ok(data.infobox == null);
  test.ok(data.infobox_template == null);
  test.done();
};

Tests['nn/statoil'] = function (test) {
  var data = parser(fetch("nn/statoil"))
  test.equal(data.infobox.namn.text, 'Statoil ASA')
  test.equal(data.infobox_template, 'verksemd')
  test.ok(data.text.Intro.length >= 1)
  test.equal(data.categories.length, 4)
  test.equal(data.images.length, 1)
  test.equal(data.images[0], 'Fil:Statoil-Estonia.jpg')
  test.done();
};
