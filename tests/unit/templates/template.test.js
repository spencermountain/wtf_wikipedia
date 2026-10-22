import test from 'tape'
import wtf from '../../lib/index.js'

test('glossary of professional wrestling', (t) => {
  const glossary = `{{term|1=A-show}}
  {{defn|1= A wrestling event where a company's biggest draws wrestle.<ref name=torch/>}}`
  const o = wtf(glossary).sections()[0].sentences()
  t.equal(o[0].data.text, 'A-show:', 'first glossary entry')
  t.equal(o[1].data.text, `A wrestling event where a company's biggest draws wrestle.`, 'second glossary entry')
  t.end()
})

test('boloZenden infobox', (t) => {
  const boloZenden = `{{Infobox football biography
    | youthyears1 = 1985–1987 |youthclubs1 = [[MVV]]
    | years1      = 1993–1998 |clubs1 = [[PSV Eindhoven|PSV]]                         |caps1 = 112 |goals1 = 32
    | nationalyears1 = 1997–2004 |nationalteam1 = [[Netherlands national football team|Netherlands]] |nationalcaps1 = 54 |nationalgoals1 = 7
  }}`
  const o = wtf(boloZenden).infobox().data
  t.equal(o.years1.text(), '1993–1998', 'club years')
  t.equal(o.clubs1.text(), 'PSV', 'club name')
  t.equal(o.youthyears1.text(), '1985–1987', 'youth years')
  t.equal(o.youthclubs1.text(), 'MVV', 'youth club')
  t.equal(o.nationalyears1.text(), '1997–2004', 'national years')
  t.equal(o.nationalteam1.text(), 'Netherlands', 'national team text')
  t.equal(o.nationalteam1.links()[0].page(), 'Netherlands national football team', 'national team target')
  t.equal(o.nationalteam1.links()[0].text(), 'Netherlands', 'national team label')
  t.equal(o.nationalcaps1.text(), '54', 'national caps')
  t.equal(o.nationalgoals1.text(), '7', 'national goals')
  t.end()
})

test('hurricane infobox', (t) => {
  const hurricane = `{{Infobox Hurricane
  | Name=Tropical Storm Edouard
  | Dissipated=September 6, 2002
  | Areas=[[Florida]]
  | Hurricane season=[[2002 Atlantic hurricane season]]
}}`
  const o = wtf(hurricane).infobox().data
  t.equal(o.name.text(), 'Tropical Storm Edouard', 'hurricane name')
  t.equal(o.dissipated.text(), 'September 6, 2002', 'dissipation date')
  t.equal(o['hurricane season'].text(), '2002 Atlantic hurricane season', 'hurricane season')
  t.equal(o.areas.links()[0].page(), 'Florida', 'affected area target')
  t.end()
})

test('bluejays table', (t) => {
  const bluejays = `
{| border="1" cellpadding="2" cellspacing="0" class="wikitable"
|-
! bgcolor="#DDDDFF" width="4%" | Number
! bgcolor="#D12DFF" width="4%" | Date
! bgcolor="#D12DFF" width="4%" | Team
|- align="center" bgcolor="ffbbbb"
| 1 || April 6 || @ [[Minnesota Twins|Twins]] || 6 - 1 || [[Brad Radke|Radke]] (1-0) || '''[[Pat Hentgen|Hentgen]]''' (0-1) || || 45,601 || 0-1
|- align="center" bgcolor="bbffbb"
| 2 || April 7 || @ [[Minnesota Twins|Twins]] || 9 - 3 || '''[[David Wells|Wells]]''' (1-0) || [[Mike Lincoln|Lincoln]] (0-1) || '''[[Roy Halladay|Halladay]]''' (1) || 9,220 || 1-1
|}
  `
  const arr = wtf(bluejays).tables()[0].data
  t.equal(arr.length, 2, 'table row count')
  t.equal(arr[0]['Number'].text(), '1', 'number')
  t.equal(arr[0]['Date'].text(), 'April 6', 'date')
  t.equal(arr[0]['Team'].text(), '@ Twins', 'team')
  t.equal(arr[1]['Number'].text(), '2', 'number2')
  t.equal(arr[1]['Date'].text(), 'April 7', 'date2')
  t.equal(arr[1]['col4'].text(), '9 - 3', 'col-3')
  t.end()
})

const alabama = `{{Infobox university
| president = [[Stuart R. Bell]]
| country = U.S.
| athletics = [[NCAA Division I]] – [[Southeastern Conference|SEC]]
}}`
test('Alabama infobox', (t) => {
  const infobox = wtf(alabama).infobox().data
  t.equal(infobox.athletics.text(), 'NCAA Division I – SEC', 'athletics =' + infobox.athletics.text)
  t.equal(infobox.country.text(), 'U.S.', 'country =' + infobox.country.text)
  t.equal(infobox.president.text(), 'Stuart R. Bell', 'president =' + infobox.president.text)
  t.end()
})

test('Radiohead infobox', (t) => {
  const radiohead = `{{Infobox musical artist
| genre = {{flatlist|
* [[Art rock]]
* [[alternative rock]]<!--genres sourced on talk page; do not add without consulting talk page with sourced information-->
* [[electronica]]
* [[experimental rock]]
}}
| associated_acts = {{flatlist|
* [[Atoms for Peace (band)|Atoms for Peace]]
* [[7 Worlds Collide]]
}}
| current_members =
* [[Thom Yorke]]
* [[Jonny Greenwood]]
* [[Colin Greenwood]]
* [[Ed O'Brien]]
* [[Philip Selway]]
}} `
  const infobox = wtf(radiohead).infobox().data
  t.equal(infobox.current_members.text().match(/Greenwood/g).length, 2, 'current members')
  t.equal(infobox.genre.text(), 'Art rock\n\nalternative rock\n\nelectronica\n\nexperimental rock', 'genre')
  t.equal(infobox.associated_acts.text(), 'Atoms for Peace\n\n7 Worlds Collide', 'associated-acts')
  t.end()
})

test('templates() list ordering', (t) => {
  const str = `
{{Main|Royal National Lifeboat Institution lifeboats}}
The types of boats provided at each station and the launching methods vary depending on local needs.<ref>{{Cite web|title=cool dude}}</ref>
==History==
{{wide_image|heyyyyy.png}}
{{tracklist| title1=fun times}}
{{infobox person
|cool = nope
}}
hello there
`
  const doc = wtf(str)
  t.equal(doc.templates().length, 3, 'got several templates')
  t.equal(doc.infoboxes().length, 1, 'got one infobox')
  t.equal(doc.citations().length, 1, 'got citation template')
  t.equal(doc.templates('main').length, 1, 'got main template')
  t.equal(doc.templates('tracklist').length, 1, 'got tracklist template')
  t.end()
})

test('templates in infobox', (t) => {
  const str = `{{Infobox museum
  |coordinates = {{coord|41.893269|-87.622511|display=inline}}
  |image=           20070701 Arts Club of Chicago.JPG
  |website= [http://www.artsclubchicago.org www.artsclubchicago.org]
  }}
  '''Arts Club of Chicago''' is a private club located in the [[Near North Side, Chicago|Near North Side]] `
  const doc = wtf(str)
  t.equal(doc.templates().length, 1, 'got one template')
  t.equal(doc.infoboxes().length, 1, 'got one infobox')
  t.equal(doc.images().length, 1, 'got one image')
  t.equal(doc.images().length, 1, 'got one image')
  t.equal(doc.links().length, 2, 'got two links')
  t.equal(doc.templates('coord').length, 1, 'got coord template')
  t.end()
})

test('microsoft currency parsing', (t) => {
  const microsoft = `{{Infobox company
| revenue = {{Increase}} {{US$|89.95&nbsp;billion|link=yes}}<ref name="xbrlus_1">{{cite web|title=Annual report}}</ref>
| operating_income = {{Increase}} {{US$|22.27&nbsp;billion}}<ref name="xbrlus_1" />
| net_income = {{Increase}} {{US$|21.20&nbsp;billion}}<ref name="xbrlus_1" />
}}`
  const infobox = wtf(microsoft).infobox().data
  t.equal(infobox.revenue.text(), 'US$89.95\xa0billion', 'revenue =' + infobox.revenue.text)
  t.equal(infobox.operating_income.text(), 'US$22.27\xa0billion', 'operating_income =' + infobox.operating_income.text)
  t.equal(infobox.net_income.text(), 'US$21.20\xa0billion', 'net_income =' + infobox.net_income.text)
  t.end()
})

test('climate template', (t) => {
  const str = `{{climate chart
| Toronto
| −6.7 | -0.7 | 62
| −5.6 |  0.4 | 55
| −1.9 |  4.7 | 54
|  4.1 | 11.5 | 68
|  9.9 | 18.4 | 82
| 14.9 | 23.9 | 71
| 18.0 | 26.6 | 64
| 17.4 | 25.5 | 81
| 13.4 | 21.0 | 85
|  7.4 | 14.0 | 64
|  2.3 |  7.5 | 84
| −3.1 |  2.1 | 61
|float=right
|source= Environment Canada }}`
  const data = wtf(str).template().json().data
  t.equal(data.months[0].low, -6.7, 'jan low')
  t.equal(data.months[1].precip, 55, 'feb precip')
  t.end()
})
test('german ones', (t) => {
  const str = 'Buchstaben {{Taste|Q}}, {{Taste|W}}, {{Taste|E}}, {{Taste|R}}, {{Taste|T}} und {{Taste|Z}}'
  t.equal(wtf(str).text(), 'Buchstaben Q, W, E, R, T und Z', 'letters')
  t.end()
})

test('Template-Text-And-Wikitext', (t) => {
  const doc = wtf(`* {{USS|Barry}}, four US destroyers`)
  const tmpl = doc.template()
  t.equal(tmpl.wikitext(), '{{USS|Barry}}', 'tmpl wikitext')
  t.equal(tmpl.text(), `USS Barry`, 'tmpl text')
  t.end()
})
