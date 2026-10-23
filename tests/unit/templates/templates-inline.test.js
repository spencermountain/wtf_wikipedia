import test from 'tape'
import wtf from '../../lib/index.js'

test('inline-no-data', (t) => {
  const arr = [
    ['plural', '{{plural|1.5|page}}', '1.5 pages'],
    ['hlist', '{{hlist|Winner|Runner-up|Third place|item_style=color:blue;}}', 'Winner · Runner-up · Third place'],
    ['lang', '{{lang|fr|Je suis française.}}', 'Je suis française.'],
    ['linum', '{{linum|1|The first ordered list item}}', '1. The first ordered list item'],
    ['lino', '{{lino|1}}', '1'],
    ['oldstyledate', '{{OldStyleDate|2 February|1905|20 January}}', '2 February 1905'],
    ['reign', '{{reign|27 BCE|14 CE}}', '(r. 27 BCE – 14 CE)'],
    ['circa', '{{Circa|1350|cap=yes}}', 'c. 1350'],
    ['date', '{{date|2006-08-04|ISO}}', '2006-08-04'],
    ['date-none', '{{date|4 August|none}}', '4 August'],
    ['dot', '{{·}}', '·'],
    ['comma', '{{,}}', ','],
    ['half', '{{1/2}}', '1⁄2'],
    ['fb', '{{fb|Italy|1861}}', '🇮🇹 italy'],
    ['fbicon', '{{fbicon|GER|name=GER}}', '🇩🇪'],
    ['tag', '{{tag|math|attribs=chem}}', '<math chem></math>'],
    ['plural', '{{plural|-1.5|page}}', '-1.5 pages'],
    ['first word', '{{First word| Foo bar baz}}', 'Foo'],
    ['nobold', '{{nobold|text-string}}', 'text-string'],
    ['flag-name', '{{flagicon|canada}}', '🇨🇦'],
    ['flag-iso-3', '{{flagicon|BUL}}', '🇧🇬'],
    ['flag-faroe island', '{{FRO}}', '🇫🇴'],
    ['rtl-lang', '{{rtl-lang|tg-Arab|تاجیکی}}', 'تاجیکی'],
    ['lbb', ' {{Lbb|Severn}} ', 'Severn'],
    ['yes', ' {{Yes}} ', 'Yes'],
    ['vanchor', '{{vanchor|humpty|dumpty}}', 'humpty'],
    ['uc', '{{uc:text tRAnSFORM}}', 'TEXT TRANSFORM'],
    ['uc', '{{ucfirst:text tRAnSFORM}}', 'Text tRAnSFORM'],
    ['lc', '{{lc:text tRAnSFORM}}', 'text transform'],
    ['lc', '{{lcfirst:text tRAnSFORM}}', 'text tRAnSFORM'],
    ['date', '{{date|4 August 2006}}', '4 August 2006'],
    ['date', '{{date|2006-08-04|DMY}}', '2006-08-04'],
    ['dts', '{{dts|July 1, 1867}}', 'July 1, 1867'],
    ['percentage', '{{Percentage | 1 | 3 | 0 }}', '33%'],
    ['percent done', '{{Percent-done|done=13|total=33}}', '13 (39%) done'],
    ['plainlist', '{{Plainlist|\n* Example 1\n* Example 2\n* Example 3\n}}', 'Example 1\n\nExample 2\n\nExample 3'],
    ['abbrlink', '{{abbrlink|UK|United Kingdom}}', 'UK'],
    [
      'h',
      '{{H:title\n |spantitle\n |label\n |link=yes/no (defaults to "no")\n |dotted=yes/no (defaults to "yes")\n}}',
      'label',
    ],
    ['finedetail', '{{finedetail |plain text|Is actually very very plain text}}', 'plain text'],
    ['mono', '{{Mono|text to format here}}', 'text to format here'],
    ['pre', '{{pre|text to format here}}', 'text to format here'],
    ['mvar', '{{mvar|x}}', 'x'],
    ['strongbad', '{{strongbad|1=important text}}', 'important text'],
    ['!bxt', '{{!bxt|inline typeface change}}', 'inline typeface change'],
    ['nobr', '{{nobr}} nobr', 'nobr'],
  ]
  arr.forEach(([name, input, text]) => {
    const doc = wtf(input)
    t.equal(doc.templates().length, 0, name + ': template count')
    t.equal(doc.text(), text, name + ': text')
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
    [`{{Parity|4|foo|bar}}`, 'foo'],
    [`{{Parity|9}}`, 'odd'],
    [`{{Parity|8}}`, 'even'],
    [`{{Percentage | 1111 | 10000}}`, '11%'],
    ['{{percent and number|3333|20000}}', '17% (3,333)'],
    ['{{percent and number|3333|20000|3}}', '16.665% (3,333)'],
    ['{{Rounddown|3.14159}}', '3'],
    ['{{Round|54.376}}', '54'],
    ['{{Hexadecimal|15|hex}}', 'F'],
    ['{{Hexadecimal|A B}}', 'A B'],
    ['{{hex2dec|0x7C0}}', '1984'],
    ['{{Octal|4632}}', '11030₈'],
    ['{{Decimal2Base|42|3}}', '1120'],
    ['{{Ifnumber|1|a number|not a number}}', 'a number'],
    ['{{music|bassclef}}', '𝄢'],
    ['{{color|red|Hello, world!}}', 'Hello, world!'],
    ['{{resize|80%|This text}}', 'This text'],
    ['{{resize|This text}}', 'This text'],
    ['{{font|text=Some text.|font=Comic Sans MS|size=20px|color=#7f5620}}', 'Some text.'],
    ['{{colored link|olive|Page name to link|Alternative text}}', 'Alternative text'],
    ['{{no redirect|page name|label}}', 'label'],
    ['{{no redirect|page name}}', 'page name'],
    ["{{tq|Lorem ipsum '''dolor''' sit}}", 'Lorem ipsum dolor sit'],
    ['{{nftu|21|Romania}}', 'Romania U21'],
    ['played for {{subst:nft|France}}', 'played for France'],
  ]
  arr.forEach((a) => {
    t.equal(wtf(a[0]).text(), a[1], a[0])
  })
  t.end()
})

test('flags', (t) => {
  const str = `one {{flag|USA}}, two {{flag|DEU|empire}}, three {{flag|CAN|name=Canadian}}.`
  const doc = wtf(str)
  t.equal(doc.links().length, 3, 'found 3 link')
  t.equal(doc.links()[1].text(), 'DEU', 'link text')
  t.equal(doc.links()[1].page(), 'Germany', 'link page')
  t.equal(doc.text(), 'one 🇺🇸 USA, two 🇩🇪 DEU, three 🇨🇦 CAN.', 'made emoji flags')
  t.end()
})

test('tricky-based-on', (t) => {
  const str = `{{Based on|''[[Jurassic Park (novel)|Jurassic Park]]''|Michael Crichton}}`
  const doc = wtf(str)
  t.equal(doc.templates().length, 1, 'found one template')
  t.equal(doc.text(), 'Jurassic Park by Michael Crichton', 'formatted title and author')
  const data = doc.templates()[0].json().data || {}
  t.equal(doc.templates()[0].json().kind, 'based on', 'template name')
  t.equal(data.title, 'Jurassic Park', 'title')
  t.equal(data.author, 'Michael Crichton', 'author')
  t.end()
})

test('start-date in infobox', (t) => {
  const str = `
{{Infobox officeholder
|term_start   = {{start date|2022|May|6}}
|term_end     = {{end date|2023|January|11}}
}}`
  const doc = wtf(str)
  const json = doc.infobox().json().data
  t.equal(json.term_start.text, 'May 6, 2022', 'term_start')
  t.equal(json.term_end.text, 'January 11, 2023', 'term_end')
  t.end()
})

test('Template-Link-Labels', (t) => {
  t.equal(wtf(`{{ill|Joke|fr|Blague|hu|Vicc|de|Witz}}`).text(), 'Joke', 'interlanguage link label')
  t.equal(wtf(`{{tiw|Hatnote}}`).text(), 'Hatnote', 'template link label')
  t.end()
})
