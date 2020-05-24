var wtf = require('./lib')
var test = require('tape')

test('external-links', function (t) {
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
    [
      'see also',
      `{{See also|page1|page2|page3| ...
    |label 1 = label 1|label 2 = label2|label 3 = label3| ...
    |l1 = label1|l2 = label2|l3 = label3|selfref = yes|category = no}}`,
    ],
    ['unreferenced section', `{{Unreferenced section|date=November 2018}}`],
  ]
  arr.forEach((a) => {
    var doc = wtf(a[1])
    t.equal(doc.templates().length, 1, a[0] + ' count')
    var tmpl = doc.templates(0) || {}
    t.equal(tmpl.template, a[0], a[1] + ' name')
  })
  t.end()
})

test('wikipedia-templates', function (t) {
  var arr = [
    [`uss`, `{{USS|Constellation|1797}}`],
    [`italic title`, `{{italic title}}`],
    [`audio`, `{{Audio|en-us-Alabama.ogg|pronunciation of "Alabama"|help=no}}`],
    [`unreferenced`, `{{Unreferenced|date=November 2018}}`],
    [`chem`, `{{chem|H|2|O}}`],
    [
      `subject bar`,
      `{{Subject bar |book= Lemurs |portal1= Primates |portal2= Madagascar |commons= y |commons-search= Category:Lemuriformes |species= y |species-search= Lemuriformes }}`,
    ],
    [
      `gallery`,
      `{{Gallery
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
}}`,
    ],
    [
      `climate chart`,
      `{{climate chart
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
`,
    ],

    [`short description`, `{{Short description|Use of high concentrations of oxygen as medical treatment}}`],
    [`main`, `{{Main|Article1|l1=Custom label 1|Article2|l2=Custom label 2}}`],
    [
      `wide image`,
      `{{wide image|Helsinki z00.jpg|1800px||alt=Panorama of city with mixture of five to ten story buildings}}`,
    ],
    [`ipa`, `{{IPA|/[[character|ˈkærəktɚz]]/}}`],
    [`ipac`, `{{IPAc-ko|h|a|n|g|u|k}}`],
    [`coord`, `{{Coord|44.112|N|87.913|W|display=title}}`],
    [`gnis`, `{{GNIS | 871352 | Mount Washington }}`],
    [
      'sky',
      `{{Sky
    |00|42|44.30
    |+|41|16|10
    |2360000
  }}`,
    ],
    [
      `portal`,
      `{{Portal
     | Portal 1
     | Portal 2
     | Portal 3
     | left = cool
     | margin = fun
     | break = no
     | boxsize = yes
    }}`,
    ],
    // [``, ``],
  ]
  arr.forEach((a) => {
    var doc = wtf(a[1])
    t.equal(doc.templates().length, 1, a[0] + ' count')
    var tmpl = doc.templates(0) || {}
    t.equal(tmpl.template, a[0], a[0] + ' name')
  })
  t.end()
})

test('weather', function (t) {
  let str = `
  {{Weather box
  |metric first = Y
  |single line= Y
  |collapsed = Y
  |location= [[Calgary International Airport]], 1981–2010 normals, extremes 1881–present
  |Jan high C = -0.9
  |Feb high C =  0.7
  |Mar high C =  4.4
  |Apr high C = 11.2
  |May high C = 16.3
  |Jun high C = 19.8
  |Jul high C = 23.2
  |Aug high C = 22.8
  |Sep high C = 17.8
  |Oct high C = 11.7
  |Nov high C =  3.4
  |Dec high C = -0.8
  |source 1=[[Environment Canada]]<ref name="envcan"/>
  }}`
  var arr = wtf(str).templates(0).byMonth['high c']
  t.equal(arr.length, 12, 'got twelve months')
  t.equal(arr[1], 0.7, 'got february')

  str = `{{Weather box/concise_C
  | location=Marrakech, Morocco (1961-1990)
  | 18.4|19.9|22.3|23.7|27.5|31.3|36.8|36.5|32.5|27.5|22.2|18.7<!--highs-->
  | 5.9 |7.6 |9.4 |11.0|13.8|16.3|19.9|20.1|18.2|14.7|10.4|6.5 <!--lows-->
  }}`
  arr = wtf(str).templates(0).byMonth['high c']
  t.equal(arr.length, 12, 'got twelve months concise')
  t.equal(arr[1], 19.9, 'got february')
  t.end()
})

test('election', function (t) {
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
   world`
  var doc = wtf(str)
  t.equal(doc.templates().length, 1, 'found one template')
  var tmpl = doc.templates(0) || {}
  t.equal(tmpl.template, 'election box', 'template name')
  t.equal(tmpl.candidates.length, 2, 'two candidates')
  t.end()
})

test('test-flexible-format', function (t) {
  var doc = wtf(`hello {{Hollywood Walk of Fame|Alan Alda}} world`)
  var tmpl = doc.templates(0) || {}
  t.equal(tmpl.template, 'hollywood walk of fame', 'template1')
  t.equal(tmpl.name, 'Alan Alda', 'name1')
  t.equal(doc.text(), 'hello world', 'text1')
  t.equal(doc.templates().length, 1, 'got-template1')

  //other format
  doc = wtf(`hello {{Hollywood Walk of Fame|name = Alan Alda}} world`)
  tmpl = doc.templates(0) || {}
  t.equal(tmpl.template, 'hollywood walk of fame', 'template2')
  t.equal(tmpl.name, 'Alan Alda', 'name2')
  t.equal(doc.text(), 'hello world', 'text2')
  t.equal(doc.templates().length, 1, 'got-template2')
  t.end()
})

test('covid-1', function (t) {
  let str = `
  {{Medical cases chart
    |numwidth=mw
    
    |disease=Green Flu
    |location=Savannah|location2=Georgia|location3=United States
    |outbreak=2009 Green Flu outbreak
    
    |recoveries=n
    
    |data=
    2009-04-13;;;42;;;42;firstright1=y
    2009-04-14;;;356;;;356;+748%
    2009-04-15;;;1503;;;1,503;+322%
    2009-04-16;57;;5915;;;5,915;+294%
    2009-04-17;2000;;9500;;;~9,500;+60.6%
    }}
  `
  let doc = wtf(str)
  let obj = doc.templates(0)
  t.equal(obj.location, 'Savannah', 'location')
  t.equal(obj.data.length, 5, '5 rows')
  t.equal(obj.data[0].date, '2009-04-13', 'row[0]')
  t.end()
})

test('playoff-brackets', function (t) {
  var str = `{{4TeamBracket
  | RD2         = Final

  | seed-width  =
  | team-width  = 120px
  | score-width = 110px

  | RD1-seed1   = A1
  | RD1-team1   = {{cr|AUS}}
  | RD1-score1  = 259/9 (50 overs)
  | RD1-seed2   = D1
  | RD1-team2   = '''{{cr|ENG}}'''
  | RD1-score2  = '''262/4 (46.3 overs)'''

  | RD1-seed3   = C1
  | RD1-team3   = {{cr|PAK}}
  | RD1-score3  = 131 (38.2 overs)
  | RD1-seed4   = B1
  | RD1-team4   = '''{{cr|WIN}}'''
  | RD1-score4  = '''132/3 (28.1 overs)'''

  | RD2-seed1   = D1
  | RD2-team1   = {{cr|ENG}}
  | RD2-score1  = 217 (49.4 overs)
  | RD2-seed2   = B1
  | RD2-team2   = '''{{cr|WIN}}'''
  | RD2-score2  = '''218/8 (48.5 overs)'''
  }}`
  let doc = wtf(str)
  let rounds = doc.templates(0).rounds
  t.equal(rounds.length, 2, 'two rounds')
  let final = rounds[1][0]
  t.equal(final[0].score, '217 (49.4 overs)', 'got score')
  t.end()
})
