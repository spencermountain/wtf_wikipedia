'use strict';
var test = require('tape');
var redirects = require('../src/parse/parse_redirects');
var parse_line = require('../src/parse/parse_line');
var parse_categories = require('../src/parse/parse_categories');
var cleanup_misc = require('../src/parse/cleanup_misc');
var parse_image = require('../src/parse/parse_image');
var kill_xml = require('../src/parse/kill_xml');

test('misc cleanup', (t) => {
  [
    ['hi [[as:Plancton]] there', 'hi  there'],
    ['hello <br/> world', 'hello world']
  ].forEach((a) => {
    let s = cleanup_misc(a[0]);
    t.equal(s, a[1]);
  });
  t.end();
});


test('redirects', t => {
  [
    ['#REDIRECT[[Tony Danza]]', 'Tony Danza'],
    ['#REDIRECT [[Tony Danza]]', 'Tony Danza'],
    ['#REDIRECT   [[Tony Danza]] ', 'Tony Danza'],
    ['#redirect   [[Tony Danza]] ', 'Tony Danza'],
    ['#redirect [[Tony Danza#funfun]] ', 'Tony Danza'],
    ['#přesměruj [[Tony Danza#funfun]] ', 'Tony Danza'],
    ['#تغییر_مسیر [[Farming]] ', 'Farming']
  ].forEach((a) => {
    let o = redirects.parse_redirect(a[0]);
    var msg = '\'' + a[0] + '\' -> \'' + o.redirect + '\'';
    t.equal(o.redirect, a[1], msg);
  });
  t.end();
});

test('parse_line_text', (t) => {
  [
    ['tony hawk', 'tony hawk'],
    [' tony hawk ', 'tony hawk'],
    ['it is [[tony hawk]] ', 'it is tony hawk'],
    ['it is [[tony hawk|tony]] ', 'it is tony'],
    ['it is [[tony danza|tony]] [[hawk]]', 'it is tony hawk'],
    ['tony hawk [http://www.whistler.ca]', 'tony hawk'],
    ['tony hawk in [http://www.whistler.ca whistler]', 'tony hawk in whistler'],
    ['it is [[Tony Hawk|Tony]]s mother in [[Toronto]]s', 'it is Tonys mother in Torontos']
  ].forEach((a) => {
    let o = parse_line(a[0]);
    var msg = '\'' + a[0] + '\' -> \'' + o.text + '\'';
    t.equal(o.text, a[1], msg);
  });
  t.end();
});

test('parse_categories', (t) => {
  [
    ['[[Category:Tony Danza]]', ['Tony Danza']],
    ['[[Category:Tony Danza]][[Category:Formal Wear]]', ['Tony Danza', 'Formal Wear']],
    [' [[Category:Tony Danza]]  [[Category:Formal Wear]] ', ['Tony Danza', 'Formal Wear']],
    [' [[Category:Tony Danza|metadata]]  [[category:Formal Wear]] ', ['Tony Danza', 'Formal Wear']],
    ['[[categoría:Tony Danza|metadata]]  ', ['Tony Danza']]
  ].forEach((a) => {
    let o = parse_categories(a[0]);
    t.deepEqual(o, a[1]);
  });
  t.end();
});

test('parse_image', (t) => {
  [
    ['[[File:Tony Danza]]', 'File:Tony Danza'],
    ['[[Image:Tony Danza]]', 'Image:Tony Danza'],
    ['[[Image:Tony Danza|left]]', 'Image:Tony Danza'],
    ['[[Image:Edouard Recon (2002).jpg|right|thumb|200px|Tropical Storm Edouard seen by [[Hurricane Hunters]]]]', 'Image:Edouard Recon (2002).jpg']
  ].forEach((a) => {
    let o = parse_image(a[0]);
    t.deepEqual(o, a[1]);
  });
  t.end();
});


test('xml', (t) => {
  [
    ['North America,<ref name="fhwa"/> and one of', 'North America, and one of'],
    ['North America,<br /> and one of', 'North America, and one of'],
    ['hello <h2>world</h2>', 'hello world'],
    [`hello<ref name="theroyal"/> world5, <ref name="">nono</ref> man`, 'hello world5, man'],
    ['hello <ref>nono!</ref> world1.', 'hello world1.'],
    ['hello <ref name=\'hullo\'>nono!</ref> world2.', 'hello world2.'],
    ['hello <ref name=\'hullo\'/>world3.', 'hello world3.'],
    ['hello <table name=\'\'><tr><td>hi<ref>nono!</ref></td></tr></table>world4.', 'hello  world4.'],
    ['hello<ref name=\'\'/> world5', 'hello world5']
  ].forEach((a) => {
    let s = kill_xml(a[0]);
    t.equal(s, a[1]);
  });
  t.end();
});
