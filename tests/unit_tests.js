"use strict";
var redirects = require("../src/parse/parse_redirects");
var parse_line = require("../src/parse/parse_line");
var parse_categories = require("../src/parse/parse_categories");
var cleanup_misc = require("../src/parse/cleanup_misc");
var parse_image = require("../src/parse/parse_image");
var kill_xml = require("../src/parse/kill_xml");

// describe("misc cleanup", function() {
//   let tests = [
//     ["hi [[as:Plancton]] there", "hi  there"],
//     ["hello <br/> world", "hello  world"],
//   ];
//   tests.forEach(function(t) {
//     it(t[0], function(done) {
//       let s = cleanup_misc(t[0]);
//       console.log(s);
//       s.redirect.should.equal(t[1]);
//       done();
//     });
//   });
// });

describe("redirects", function() {
  let tests = [
    ["#REDIRECT[[Tony Danza]]", "Tony Danza"],
    ["#REDIRECT [[Tony Danza]]", "Tony Danza"],
    ["#REDIRECT   [[Tony Danza]] ", "Tony Danza"],
    ["#redirect   [[Tony Danza]] ", "Tony Danza"],
    ["#redirect [[Tony Danza#funfun]] ", "Tony Danza"],
    ["#přesměruj [[Tony Danza#funfun]] ", "Tony Danza"],
    ["#تغییر_مسیر [[Farming]] ", "Farming"],
  ];
  tests.forEach(function(t) {
    it(t[0], function(done) {
      let o = redirects.parse_redirect(t[0]);
      o.redirect.should.equal(t[1]);
      done();
    });
  });
});

describe("parse_line_text", function() {
  let tests = [
    ["tony hawk", "tony hawk"],
    [" tony hawk ", "tony hawk"],
    ["it is [[tony hawk]] ", "it is tony hawk"],
    ["it is [[tony hawk|tony]] ", "it is tony"],
    ["it is [[tony danza|tony]] [[hawk]]", "it is tony hawk"],
    ["tony hawk [http://www.whistler.ca]", "tony hawk"],
    ["tony hawk in [http://www.whistler.ca whistler]", "tony hawk in whistler"],
    ["it is [[Tony Hawk|Tony]]s mother in [[Toronto]]s", "it is Tonys mother in Torontos"],
  ];
  tests.forEach(function(t) {
    it(t[0], function(done) {
      let o = parse_line(t[0]);
      o.text.should.be.equal(t[1]);
      done();
    });
  });
});

describe("parse_categories", function() {
  let tests = [
    ["[[Category:Tony Danza]]", ["Tony Danza"]],
    ["[[Category:Tony Danza]][[Category:Formal Wear]]", ["Tony Danza", "Formal Wear"]],
    [" [[Category:Tony Danza]]  [[Category:Formal Wear]] ", ["Tony Danza", "Formal Wear"]],
    [" [[Category:Tony Danza|metadata]]  [[category:Formal Wear]] ", ["Tony Danza", "Formal Wear"]],
    ["[[categoría:Tony Danza|metadata]]  ", ["Tony Danza"]],
  ];
  tests.forEach(function(t) {
    it(t[0], function(done) {
      let o = parse_categories(t[0]);
      o.should.deepEqual(t[1]);
      done();
    });
  });
});

describe("parse_image", function() {
  let tests = [
    ["[[File:Tony Danza]]", "File:Tony Danza"],
    ["[[Image:Tony Danza]]", "Image:Tony Danza"],
    ["[[Image:Tony Danza|left]]", "Image:Tony Danza"],
    ["[[Image:Edouard Recon (2002).jpg|right|thumb|200px|Tropical Storm Edouard seen by [[Hurricane Hunters]]]]", "Image:Edouard Recon (2002).jpg"],
  ];
  tests.forEach(function(t) {
    it(t[0], function(done) {
      let o = parse_image(t[0]);
      o.should.deepEqual(t[1]);
      done();
    });
  });
});


describe("xml", function() {
  let tests = [
    ["North America,<ref name=\"fhwa\"/> and one of", "North America, and one of"],
    ["North America,<br /> and one of", "North America, and one of"],
    ["hello <h2>world</h2>", "hello world"],
    [`hello<ref name="theroyal"/> world5, <ref name="">nono</ref> man`, "hello world5, man"],
    ["hello <ref>nono!</ref> world1.", "hello world1."],
    ["hello <ref name='hullo'>nono!</ref> world2.", "hello world2."],
    ["hello <ref name='hullo'/>world3.", "hello world3."],
    ["hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4.", "hello  world4."],
    ["hello<ref name=''/> world5", "hello world5"],
  ];
  tests.forEach(function(t) {
    it(t[0], function(done) {
      let s = kill_xml(t[0]);
      s.should.equal(t[1]);
      done();
    });
  });
});
