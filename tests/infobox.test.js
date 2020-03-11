var test = require('tape')
var wtf = require('./lib')

test('infobox', function(t) {
  var str = `
  {{Infobox settlement
  | name = New York City
  | official_name                   = City of New York
  | settlement_type                 = [[City]]
  | named_for                       = [[James II of England|James, Duke of York]]
  | coordinates                     = {{coord|40.7127|N|74.0059|W|region:US-NY|format=dms|display=inline,title}}
  }}

  The '''City of New York''', often called '''New York City'''
  `
  var arr = wtf(str).infoboxes()
  t.equal(arr.length, 1, 'have one infobox')
  t.end()
})

test('node.js-infobox-logo', function(t) {
  let str = `{{Infobox software
    | name = Node.js
    | logo = [[File:Node.js logo.svg|frameless]]
    | author = [[Ryan Dahl]]
    | developer = Various
    | released = {{Start date and age|2009|05|27}}<ref>{{cite web | url=https://github.com/joyent/node/tags?after=v0.0.4 | accessdate = 2 August 2014|title=node-v0.x-archive on GitHub}}</ref>
    | latest release version = 13.5.0
    | latest release date = {{Start date and age|2019|12|18}}<ref>{{cite web|url=https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V13.md|accessdate = 22 November 2019|title= Node.js 13 ChangeLog|via=[[GitHub]]}}</ref>
    | programming language = [[C (programming language)|C]], [[C++]], [[JavaScript]]
    | operating system = [[Linux]], [[macOS]], [[Microsoft Windows]], [[SmartOS]], [[FreeBSD]], [[OpenBSD]], [[IBM AIX]]<ref name="supportedOS">{{cite web|url=https://github.com/nodejs/node/blob/master/BUILDING.md|title=nodejs/node|website=GitHub}}</ref>
    | genre = [[Runtime system|Runtime environment]]
    | license = [[MIT license]]<ref>{{cite web|title=node/LICENSE at master|url=https://github.com/nodejs/node/blob/master/LICENSE|website=GitHub|publisher=Node.js Foundation|accessdate = 17 September 2018|date=17 September 2018}}</ref><ref>{{cite web|title=The MIT License|url=https://opensource.org/licenses/MIT|website=Open Source Initiative|accessdate = 17 September 2018|date=17 September 2018}}</ref>
    }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`logo`], 'Node.js logo.svg', 'found logo val')
  t.end()
})

test('french-infobox', function(t) {
  let str = `{{Infobox Société
  | couleur boîte             = 706D6E
  | titre blanc               = oui
  | nom                       = Microsoft Corporation
  | secteurs d'activités      = found1
  | siège (ville)             = city
  | société sœur              = sister
  | chiffre d'affaires        = found2
 }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`secteurs d'activités`], 'found1', 'found secteurs val')
  t.equal(obj[`chiffre d'affaires`], 'found2', 'found chiffre val')
  t.equal(obj[`siège (ville)`], 'city', 'found city val')
  t.equal(obj[`société sœur`], 'sister', 'found sister val')
  t.end()
})

test('nested-london-infobox', function(t) {
  let str = `{{Infobox country
  | common_name = United Kingdom
  | name = {{collapsible list
   | title = hello
   | {{Infobox
    | data1={{lang|foo}}
    | data2=bar
    }}
   }}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`common_name`], 'United Kingdom', 'found common_name val')
  t.equal(obj[`name`], 'hello', 'found name val')
  t.end()
})
