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
    ['afi film', `{{AFI film | 64729 | Quantum of Solace }}`],
    ['allgame', `{{AllGame |326 |The Legend of Zelda: A Link to the Past}}`],
    [`taxon info`, `{{Taxon info|Corallinaceae/stem-group|link_target}}`],
    [`book bar`, `{{Book bar|Lemurs|Mesozoic mammals of Madagascar|Subfossil lemurs}}`],
    ['see also', `{{See also|page1|page2|page3| ...
    |label 1 = label 1|label 2 = label2|label 3 = label3| ...
    |l1 = label1|l2 = label2|l3 = label3|selfref = yes|category = no}}`],
    ['unreferenced section', `{{Unreferenced section|date=November 2018}}`]
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
    [`italic title`, `{{italic title}}`],
    [`audio`, `{{Audio|en-us-Alabama.ogg|pronunciation of "Alabama"|help=no}}`],
    [`unreferenced`, `{{Unreferenced|date=November 2018}}`],
    [`chem`, `{{chem|H|2|O}}`],
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
    [`ipac`, `{{IPAc-ko|h|a|n|g|u|k}}`],
    [`coor`, `{{Coord|44.112|N|87.913|W|display=title}}`],
    [`gnis`, `{{GNIS | 871352 | Mount Washington }}`],
    ['sky', `{{Sky
    |00|42|44.30
    |+|41|16|10
    |2360000
  }}`],
    [`portal`, `{{Portal
     | Portal 1
     | Portal 2
     | Portal 3
     | left = cool
     | margin = fun
     | break = no
     | boxsize = yes
    }}`],
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


test('election', function(t) {
  var str = `hello {{Election box begin |title=[[United Kingdom general election, 2005|General Election 2005]]: Strangford}}
   {{Election box candidate
     |party      = Labour
     |candidate  = Tony Blair
     |votes      = 9,999
     |percentage = 50.0
     |change     = +10.0
   }}
   {{Election box candidate
     |party      = Conservative
     |candidate  = Michael Howard
     |votes      = 9,999
     |percentage = 50.0
     |change     = +10.0
   }}
   {{Election box gain with party link
    |winner     = Conservative Party (UK)
    |loser      = Labour Party (UK)
    |swing      = +10.0
  }}
   {{Election box end}}
   world`;
  var doc = wtf(str);
  t.equal(doc.templates().length, 1, 'found one template');
  var tmpl = doc.templates(0) || {};
  t.equal(tmpl.template, 'election box', 'template name');
  t.equal(tmpl.candidates.length, 2, 'two candidates');
  t.end();
});

test('test-flexible-format', function(t) {
  var doc = wtf(`hello {{Hollywood Walk of Fame|Alan Alda}} world`);
  var tmpl = doc.templates(0) || {};
  t.equal(tmpl.template, 'hollywood walk of fame', 'template1');
  t.equal(tmpl.name, 'Alan Alda', 'name1');
  t.equal(doc.text(), 'hello world', 'text1');
  t.equal(doc.templates().length, 1, 'got-template1');

  //other format
  doc = wtf(`hello {{Hollywood Walk of Fame|name = Alan Alda}} world`);
  tmpl = doc.templates(0) || {};
  t.equal(tmpl.template, 'hollywood walk of fame', 'template2');
  t.equal(tmpl.name, 'Alan Alda', 'name2');
  t.equal(doc.text(), 'hello world', 'text2');
  t.equal(doc.templates().length, 1, 'got-template2');
  t.end();
});
