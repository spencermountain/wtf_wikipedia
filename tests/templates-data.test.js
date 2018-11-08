'use strict';
var wtf = require('./lib');
var test = require('tape');

test('external-links', function(t) {
  var arr = [
    [`imdb title`, `{{IMDb title | id= 0426883 | title= Alpha Dog }}`],
    [`imdb name`, `{{IMDb name | 0000008 | Marlon Brando }}`],
    [`musicbrainz artist`, `{{MusicBrainz artist|mbid=31e7b30b-f960-408f-908b-c8e277308eab|name=Susumu Hirasawa}}`],
    [`youtube`, `{{YouTube|id=9bZkp7q19f0|title="Gangnam Style"}}`],
    [`twitter`, `{{Twitter | id= AcadiaU | name= Acadia University }}`],
    [`tumblr`, `{{Tumblr|nasa|NASA (official)}}`],
    [`pinterest`, ` {{Pinterest|janew|@janew}}`],
    [`espn nhl`, `{{ESPN NHL | id= 3024816 | name= Austin Czarnik }}`],
    [`fifa player`, `{{FIFA player | id= 284 | name= Brandi CHASTAIN }}`],
    [`ted speaker`, `{{TED speaker | j_j_abrams | J.J. Abrams }}`],
  // [``, ``],
  ];
  arr.forEach((a) => {
    var doc = wtf(a[1]);
    t.equal(doc.templates().length, 1, a[0] + ' count');
    var tmpl = doc.templates(0) || {};
    t.equal(tmpl.template, a[0], a[1] + ' name');
  });
  t.end();
});

test('wikipedia-templates', function(t) {
  var arr = [
    [`uss`, `{{USS|Constellation|1797}}`],
    [`audio`, `{{Audio|en-us-Alabama.ogg|pronunciation of "Alabama"|help=no}}`],
    [`subject bar`, `{{Subject bar |book= Lemurs |portal1= Primates |portal2= Madagascar |commons= y |commons-search= Category:Lemuriformes |species= y |species-search= Lemuriformes }}`],
    [`gallery`, `{{Gallery
|title=Cultural depictions of George Washington
|width=160 | height=170
|align=center
|footer=Example 1
|File:Federal Hall NYC 27.JPG
 |alt1=Statue facing a city building with Greek columns and huge U.S. flag
 |Statue of Washington outside [[Federal Hall]] in [[New York City]], looking on [[Wall Street]]
|File:Mount Rushmore2.jpg
 |alt2=Profile of stone face on mountainside, with 3 workers.
 |Construction of Washington portrait at [[Mount Rushmore]], c. 1932
}}`],
    [`climate chart`, `{{climate chart
| [[Amsterdam]]
|0.5|5.4|62.1
|0.2|6.0|43.4
|2.4|9.2|58.9
|4.0|12.4|41.0
|7.8|17.1|48.3
|10.4|19.2|67.5
|12.5|21.4|65.8
|12.3|21.8|61.4
|10.2|18.4|82.1
|7.0|14.1|85.1
|3.9|9.2|89.0
|1.9|6.2|74.9
|float=right
|clear=right
}}
`],

    [`short description`, `{{Short description|Use of high concentrations of oxygen as medical treatment}}`],
    [`main`, `{{Main|Article1|l1=Custom label 1|Article2|l2=Custom label 2}}`],
    [`wide image`, `{{wide image|Helsinki z00.jpg|1800px||alt=Panorama of city with mixture of five to ten story buildings}}`],
    [`ipa`, `{{IPA|/[[character|ˈkærəktɚz]]/}}`],
    [`ipa`, `{{IPAc-ko|h|a|n|g|u|k}}`],
    [`coord`, `{{Coord|44.112|N|87.913|W|display=title}}`],
  // [``, ``],
  ];
  arr.forEach((a) => {
    var doc = wtf(a[1]);
    t.equal(doc.templates().length, 1, a[0] + ' count');
    var tmpl = doc.templates(0) || {};
    t.equal(tmpl.template, a[0], a[0] + ' name');
  });
  t.end();
});
