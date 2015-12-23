"use strict";
var redirects = require("../src/parse/parse_redirects");
// var parse_table = require("./parse/parse_table");
var parse_line = require("../src/parse/parse_line");
var parse_categories = require("../src/parse/parse_categories");
// var parse_disambig = require("./parse/parse_disambig");
var parse_infobox = require("../src/parse/parse_infobox");
// var parse_infobox_template = require("./parse/parse_infobox_template");
var parse_image = require("../src/parse/parse_image");
//
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

let hurricane = `{{Infobox Hurricane
| Name=Tropical Storm Edouard
| Type=Tropical storm
| Year=2002
| Basin=Atl
| Image location=Tropical Storm Edouard 2002.jpg
| Image name=Tropical Storm Edouard near peak intensity
| Formed=September 1, 2002
| Dissipated=September 6, 2002
| 1-min winds=55
| Pressure=1002
| Damages=
| Inflated=
| Fatalities=None
| Areas=[[Florida]]
| Hurricane season=[[2002 Atlantic hurricane season]]
}}`;
describe("parse_infobox", function() {
  it("hurricane", function(done) {
    let o = parse_infobox(hurricane);
    o.Name.text.should.be.equal("Tropical Storm Edouard");
    o.Dissipated.text.should.be.equal("September 6, 2002");
    o["Hurricane season"].text.should.be.equal("2002 Atlantic hurricane season");
    o.Areas.links[0].page.should.be.equal("Florida");
    done();
  });
});
