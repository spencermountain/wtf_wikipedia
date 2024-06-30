import test from 'tape'
import wtf from '../lib/index.js'

test('inline-no-data', function (t) {
  const arr = [
    [`plural`, `{{plural|1.5|page}}`],
    [`hlist`, `{{hlist|Winner|Runner-up|Third place|item_style=color:blue;}}`],
    [`lang`, `{{lang|fr|Je suis française.}}`],
    [`linum`, `{{linum|1|The first ordered list item}}`],
    [`lino`, `{{lino|1}}`],
    [`oldstyledate`, `{{OldStyleDate|2 February|1905|20 January}}`],
    [`reign`, `{{reign|27 BCE|14 CE}}`],
    [`circa`, `{{Circa|1350|cap=yes}}`],
    [`time`, `{{time|MST|dst=no}}`],
    [`date`, `{{date|2006-08-04|ISO}}`],
    [`date-none`, `{{date|4 August|none}}`],
    [`monthname`, `{{MONTHNAME|8}}`],
    [`dot`, `{{·}}`],
    // [`semicolon`, `{{;}}`],
    [`comma`, `{{,}}`],
    [`half`, `{{1/2}}`],
    [`fb`, `{{fb|Italy|1861}}`],
    [`fbicon`, `{{fbicon|GER|name=GER}}`],
    ['tag', `{{tag|math|attribs=chem}}`],
    ['plural', `{{plural|-1.5|page}}`],
    ['first word', `{{First word| Foo bar baz}}`],
    ['nobold', `{{nobold|text-string}}`],
    [`flag-name`, `{{flagicon|canada}}`],
    [`flag-iso-3`, `{{flagicon|BUL}}`],
    [`flag-faroe island`, `{{FRO}}`],
    ['decdeg', `{{decdeg|119.5666667|||W}}`],
    ['decdeg', '{{decdeg|deg=37|min=51|sec=00|hem=N}}'],
    [`rtl-lang`, `{{rtl-lang|tg-Arab|تاجیکی}}`],
    [`lbb`, ` {{Lbb|Severn}} `],
    [`yes`, ` {{Yes}} `],
    [`vanchor`, `{{vanchor|humpty|dumpty}}`],
    [`uc`, `{{uc:text tRAnSFORM}}`],
    [`uc`, `{{ucfirst:text tRAnSFORM}}`],
    [`lc`, `{{lc:text tRAnSFORM}}`],
    [`lc`, `{{lcfirst:text tRAnSFORM}}`],
    [`date`, `{{date|4 August 2006}}`],
    [`date`, `{{date|2006-08-04|DMY}}`],
    [`dts`, `{{dts|July 1, 1867}}`],
    [`percentage`, `{{Percentage | 1 | 3 | 0 }}`],
    [`percent done`, `{{Percent-done|done=13|total=33}}`],
    [
      `plainlist`,
      `{{Plainlist|
* Example 1
* Example 2
* Example 3
}}`,
    ],
    [`abbrlink`, `{{abbrlink|UK|United Kingdom}}`],
    [
      `h`,
      `{{H:title
 |spantitle
 |label
 |link=yes/no (defaults to "no")
 |dotted=yes/no (defaults to "yes")
}}`,
    ],
    [`finedetail`, `{{finedetail |plain text|Is actually very very plain text}}`],
    ['mono', `{{Mono|text to format here}}`],
    ['pre', `{{pre|text to format here}}`],
    ['mvar', `{{mvar|x}}`],
    ['strongbad', `{{strongbad|1=important text}}`],
    ['!bxt', `{{!bxt|inline typeface change}}`],
    //['7 hello', '{{Unité|7}} hello'],//This test fails since I added "unité: parseCurrency," in index.js
    ['nobr', '{{nobr}} nobr'],
  ]
  arr.forEach((a) => {
    const doc = wtf(a[1])
    const len = doc.templates().length
    t.equal(len, 0, a[0] + ': unexpected templates count')
    t.notEqual(doc.text(), '', a[0] + ': must not be empty')
    t.notEqual(doc.text(), a[1], a[0] + ': must change')
  })
  t.end()
})

test('inline-with-data', function (t) {
  const arr = [
    [`cad`, `{{CAD|123.45|link=yes}}`],
    [`gbp`, `{{GBP|123.45}}`],
    [`yel`, `{{yel|67}}`],
    [`winning percentage`, `{{Winning percentage|100|50|leading_zero=y}}`],
    [`death date and age`, `{{death date and age |1993|2|24 |1921|4|12 |df=yes}}`],
    [`sentoff`, `{{sent off|cards|min1|min2}}`],
    // [`acronym`, `{{acronym of|graphical user interface|lang=en}}`],
    // [`la-verb-form`, `{{la-verb-form|amāre}}`],
    // ['inflection', `{{inflection of|avoir||3|p|pres|ind|lang=fr}}`],
    [`goal`, `{{goal|14||54|p|72||87}}`],
    [`isbn`, `{{ISBN|978-1-4133-0454-1}}`],
    [`based on`, `{{based on|"[[Super-Toys Last All Summer Long]]"|[[Brian Aldiss]]}}`],
    [`mpc`, `{{MPC|75482|(75482) 1999 XC173}}`],
    [`chem2`, `{{chem2|CH3(CH2)5CH3}}`],
    [`bbl to t`, `{{bbl to t| 1 | 2 | 3 | 4 |API=|abbr=|lk=|adj=|per=|t_per=|mlt=}}`],
    [`death date`, `{{Death date | 1993 | 2 | 24 | df=yes }}`],
    [`birth based on age as of date`, `{{birth based on age as of date|50 |2017|12|18|mos=1}}`],
    [`birth-date and age`, `{{Birth-date and age|December 1941}}`],
    [`birth date and age2`, `{{birth date and age2 |1988|6|10 |1961|7|4 |df=y}}`],
    [`start-date`, `{{start-date|December 8, 1941 12:50PM Australia/Adelaide|tz=y}}`],
    [`birth date`, `{{Birth date|year=1993|month=2|day=24}}`],
    [`birthdeathage`, `{{BirthDeathAge| |1976| | |1990| |}}`],
    [`death year and age`, `{{Death year and age|2017|1967|12}} `],
    [`death date and age`, `{{death date and age |1993|2|24 |1921|4|12 |mf=yes}}`],
    [`death-date and age`, `{{Death-date and age| 30 May 1672 | 15 May 1623 | gregorian=9 June 1672 }}`],
    [`death date and given age`, `{{Death date and given age |1992|03|29 |30}}`],
    [`death year and age`, `{{Death year and age|2017|1967}} `],
    [`birth year and age`, `{{Birth year and age|1963|12}} `],
    [`winpct`, `{{winpct|1293|844|139}}`],
    [`mlbplayer`, `{{mlbplayer|93|Spencer Kelly}}`],
    ['samp', `{{samp|1=[A]bort, [R]etry, [F]ail?}}`],
    ['infront 10000 écu behind', 'infront {{Monnaie|10000|écu}} behind'],
  ]
  arr.forEach((a) => {
    const doc = wtf(a[1])
    const len = doc.templates().length
    t.equal(len, 1, a[0] + ': unexpected templates count')
    t.notEqual(doc.text(), '', a[0] + ': must not be empty')
    t.notEqual(doc.text(), a[1], a[0] + ': must change')
  })
  t.end()
})

test('inline-output', (t) => {
  const arr = [
    [`{{nobold| [[#Structure and name|↓]] }}`, `↓`],
    [`[[Salt]]{{•}} [[Pepper]]`, `Salt • Pepper`],
    [`[[Salt]]{{ndash}}[[Pepper]]`, `Salt–Pepper`],
    ['[[Salt]]{{\\}}[[Black pepper|Pepper]]', `Salt / Pepper`],
    ['[[Salt]]{{snds}}[[Black pepper|Pepper]]{{snds}}[[Curry]]{{snds}}[[Saffron]]', `Salt – Pepper – Curry – Saffron`],
    ['[[Salt]]{{snd}}[[Saffron]]', `Salt – Saffron`],
    [`{{braces|Templatename|item1|item2}}`, `{{Templatename|item1|item2}}`],
    [`{{sic|Conc|encus}} can Change!`, `Concencus [sic] can Change!`],
    [`{{sic|Conc|encus|nolink=y}} can Change!`, `Concencus can Change!`],
    // [`{{math|''f''(''x'') {{=}} ''b''<sup>''x''</sup> {{=}} ''y''}}`, `f(x) = b x = y`], // fails on windows?
    [`{{sfrac|A|B|C}}`, `A B⁄C`],
    [`{{sqrt|2|4}}`, `4√2`],
    [`{{okay}}`, `Neutral`],
    [`{{sortname|Matthew|Dellavedova|nolink=1}}`, 'Matthew Dellavedova'],
    [`{{sortname|Matthew|Dellavedova|dab=singer}}`, 'Matthew Dellavedova (singer)'],
    [`{{player|27|DOM|[[Vladimir Guerrero]]|DL}}`, '27 🇩🇴 Vladimir Guerrero'],
    [`{{Val|11|22|ul=m/s|p=~}}`, '~11 m/s'],
    [`hello {{Coord|44.112|-87.913}} world`, 'hello 44.112°N, -87.913°W world'],
    [`hello {{Coord|44.112|-87.913|display=title}} world`, 'hello world'],
    [`{{Winning percentage|30|20|50}}`, `.550`],
    [`{{Winning percentage|30|20}}`, `.600`],
    [`{{Winning percentage|30|20|50|ignore_ties=y}}`, `.300`],
    [`asdf in {{Title year|match=1|nomatch=2008|page=}}`, 'asdf in 2008'],
    [`{{Title century|page=Category:21st century in Ballyporeen}}`, '21'],
    [`{{Title decade|page=Horticultural controversies in the 1790s in Xanadu}}`, '1790'],
    ['[[{{Decade link|1960}}]]', '1960s'],
    ['{{DECADE|1915}}', '1910s'],
    ['{{CENTURY|1998}}', '20'],
    ['{{CENTURY|2020}}', '21'],
    ['{{MILLENNIUM|1999}}', '2nd millennium'],
    ['{{MILLENNIUM|1|abbr=y}}', '1st'],
    ['{{Unstrip|Some text}}', 'Some text'],
    ['{{Title case|the quick brown fox jumped over the lazy dog}}', 'The Quick Brown Fox Jumped Over the Lazy Dog'],
    ['{{str len| {{loop|50|abcdefghij}} }}', '500'], //woo!
    ['{{digits|12px}}', '12'],
    // ['{{replace|foo_bar|_| }}', 'foo bar'],
    ['{{replace|foo_bar|_|-}}', 'foo-bar'],
    ['{{Last word|Select last word}}', 'word'],
    ['{{sortname|Tom|Jones}}', 'Tom Jones'],
    ['{{No spam|account|example.com}}', 'account@example.com'],
    ['{{Template:GoldMedal}}', ''],
    ['{{not done}}', '❌'],
    ['{{by|1998|color=purple}}', '1998'],
    ['{{YEAR|1999-12-12}}', '1999'],
    ['{{YEAR|1 January 1992}}', '1992'],
    ['{{NFL Year|1999|2000}}', '1999–2000'],
    ['{{NFL playoff year|1978}}', '1978'],
    ['{{NBA Year|1999}}', '1999–2000'],
    ['{{min|9|7|8}}', '7'],
    ['{{max|9|7|8}}', '9'],
    ['{{plural|2|page}}', '2 pages'],
    ['{{abbr|UK|United Kingdom|class=country-name|id=foobar}}', 'UK'],
    ['{{abbrlink|UK|United Kingdom}}', 'UK'],
    ['{{USpolabbr|R|NH|link=y}}', 'R‑NH'],
    ['{{USpolabbr|D|CA|47}}', 'D‑CA 47th'],
    ['{{ushr|New York|AL|X}}', 'New York At-large'],
    ['{{ushr|California|51}}', `California's 51st congressional district`],
    ['{{Metro|Jamaica}}', 'Jamaica'],
    ['{{Metro|Bloor–Yonge}}', 'Bloor–Yonge'],
    ['{{stnlnk|Bramley|Hampshire}}', 'Bramley'],
    ['{{metrod|Temple|Paris}}', 'Temple'],
    ['{{tstop|The Point|Luas}}', 'The Point'],
    ['{{Station link|MTR|University}}', 'University'],
    [
      'service between {{stn|Bellegarde}} and {{rws|Genève-Cornavin}}.',
      'service between Bellegarde and Genève-Cornavin.',
    ],
    ['(28 May 1932 &ndash; 23 May 1979)', '(28 May 1932 – 23 May 1979)'],
    ['{{dabsearch|Investment}}', 'Investment'],
    ['{{MV|Aurora|2000}}', 'MV Aurora (2000)'],
    ['{{ship|ARA|General Belgrano}}', 'ARA General Belgrano'],
    [`''The Telegraph''{{'}}s reviewer`, `The Telegraph's reviewer`],
    ['{{TCG|Gediz|F 495}}', 'TCG Gediz (F 495)'],
    ['{{sclass |Valiant |harbor tug }}', 'Valiant-class harbor tug'],
    ['{{sclass2 |Flower |corvette}}', 'Flower-class corvette'],
    [`{{Precision|1111.123456789}}`, '9'],
    [`{{Precision|1111.3}}`, '1'],
    [`{{Precision|0}}`, '0'],
    [`{{Precision|9900000}}`, '-5'],
    ['{{multiply|4|5}}', '20'],
    ['{{sum|1|0.5}}', '1.5'],
    ['{{Order of magnitude|1234}}', '3'],
    ['{{Order of magnitude|123.4}}', '2'],
    ['{{Order of magnitude|12.34}}', '1'],
    ['{{Order of magnitude|1.234}}', '0'],
    ['{{plural|2|page}}', '2 pages'],
    // ['{{Order of magnitude|.1234}} ', '-1'],
    [`{{Parity|4|foo|bar}}`, 'foo'],
    [`{{Parity|9}}`, 'odd'],
    [`{{Parity|8}}`, 'even'],
    [`{{Percentage | 1111 | 10000}}`, '11%'],
    // [`{{Percentage | 1111 | 10000 | 4 }}`, '11.11%'],
    ['{{percent and number|3333|20000}}', '17% (3,333)'],
    ['{{percent and number|3333|20000|3}}', '16.665% (3,333)'],
    ['{{Rounddown|3.14159}}', '3'],
    ['{{Round|54.376}}', '54'],
    // ['{{Round|54.376|2}}', '54.37'],
    // ['{{Rounddown|3.14159|3}}', '3.141'],
    // ['{{Rounddown|314159|-3}}', '314000'],
    ['{{Hexadecimal|15|hex}}', 'F'],
    ['{{Hexadecimal|A B}}', 'A B'],
    ['{{hex2dec|0x7C0}}', '1984'],
    // ['', ''],
  ]
  arr.forEach((a) => {
    t.equal(wtf(a[0]).text(), a[1], a[0])
  })
  t.end()
})

test('flags', function (t) {
  const str = `one {{flag|USA}}, two {{flag|DEU|empire}}, three {{flag|CAN|name=Canadian}}.`
  const doc = wtf(str)
  t.equal(doc.links().length, 3, 'found 3 link')
  t.equal(doc.link(1).text(), 'DEU', 'link text')
  t.equal(doc.link(1).page(), 'germany', 'link page')
  t.equal(doc.text(), 'one 🇺🇸 USA, two 🇩🇪 DEU, three 🇨🇦 CAN.', 'made emoji flags')
  t.end()
})

//this example has it all!
test('tricky-based-on', function (t) {
  const str = `{{Based on|''[[Jurassic Park (novel)|Jurassic Park]]''|Michael Crichton}}`
  const doc = wtf(str)
  // t.equal(doc.links().length, 1, 'found link');
  // t.equal(doc.links(0).text, 'Jurassic Park', 'found link text');
  // t.equal(doc.text(), `''Jurassic Park'' by Michael Crichton`, 'parsed properly');
  t.equal(doc.templates().length, 1, 'found one template')
  t.equal(doc.template(0).json().template, 'based on', 'found template name')
  t.end()
})

test('start-date in infobox', function (t) {
  let str = ` 
{{Infobox officeholder
|term_start   = {{start date|2022|May|6}}
|term_end     = {{end date|2023|January|11}}
}}`
  let doc = wtf(str)
  let json = doc.infobox().json()
  t.equal(json.term_start.text, 'May 6, 2022', 'term_start')
  t.equal(json.term_end.text, 'January 11, 2023', 'term_end')
  t.end()
})
