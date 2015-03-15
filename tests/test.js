var path = require('path')
var fs= require("fs")
var parser= require("../index").parse
var Tests = module.exports;

//read cached file
var fetch=function(file){
  return fs.readFileSync(path.join(__dirname, "cache", file+".txt"), 'utf-8')
}

Tests['royal_cinema'] = function(test) {
   var data=parser(fetch("royal_cinema"))
   test.ok( data.infobox.opened.text, "INFOBOX");
   test.ok( data.text.Intro.length, 5);
   test.ok( data.categories.length, 4);
   test.done();
};

Tests['toronto_star'] = function(test) {
   var data=parser(fetch("toronto_star"))
   test.ok( data.infobox.publisher.text, 'John D. Cruickshank');
   test.ok( data.text.History.length, 7);
   test.ok( data.categories.length, 6);
   test.done();
};

Tests['jodie_emery'] = function(test) {
  var data=parser(fetch("jodie_emery"))
  test.ok(data.infobox.nationality.text, 'Canadian')
  test.ok(data.text.Intro.length>=1)
  test.ok(data.text['Political career'].length>=5)
  test.ok(data.categories.length, 8)
  test.ok(data.images.length, 1)
  test.done();
};

Tests['redirect'] = function(test) {
  var data=parser(fetch("redirect"))
  test.ok(data.redirect, 'Toronto')
  test.done();
};
