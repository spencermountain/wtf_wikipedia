'use strict';
var wtf = require('./lib');
var test = require('tape');

test('data-templates', function(t) {
  var arr = [
    [`imdb title`, `{{IMDb title | id= 0426883 | title= Alpha Dog }}`],
    [`imdb name`, `{{IMDb name | 0000008 | Marlon Brando }}`],
    [`musicbrainz artist`, `{{MusicBrainz artist|mbid=31e7b30b-f960-408f-908b-c8e277308eab|name=Susumu Hirasawa}}`],
  // [``, ``],
  // [``, ``],
  // [``, ``],
  ];
  arr.forEach((a) => {
    var doc = wtf(a[1]);
    t.equal(doc.templates().length, 1, a[0] + ' count');
    let tmpl = doc.templates(0) || {};
    t.equal(tmpl.template, a[0], a[1] + ' name');
  });
  t.end();
});
