import test from 'tape'
import wtf from '../../lib/index.js'

// inline templates that used to be dropped from .text()
const check = (t, cases) => {
  cases.forEach(([input, want]) => {
    t.equal(wtf(input).text(), want, input)
  })
}

test('langx keeps the text, transliteration and literal translation', (t) => {
  check(t, [
    ['{{langx|fr|bonjour}}', 'bonjour'],
    ['Paris ({{langx|fr|Paris}}) is', 'Paris (Paris) is'],
    ['{{langx|ar|العربية|al-ʿarabiyya}}', 'العربية, al-ʿarabiyya'],
    ['{{langx|ar|العربية|translit=al-ʿarabiyya|lit=Arabic}}', "العربية, al-ʿarabiyya, lit. 'Arabic'"],
    ['{{langx|de|Hallo|lit=hello}}', "Hallo, lit. 'hello'"],
    ['{{langx|ja|日本|label=none}}', '日本'],
  ])
  const data = wtf('{{langx|ar|العربية|al-ʿarabiyya|lit=Arabic}}').templates()[0].json().data
  t.equal(data.lang, 'ar', 'langx lang code')
  t.equal(data.translit, 'al-ʿarabiyya', 'langx translit')
  t.equal(data.lit, 'Arabic', 'langx lit')
  t.end()
})

test('chinese and korean label templates', (t) => {
  check(t, [
    ['{{zh|c=北京|p=Běijīng}}', 'Chinese: 北京; pinyin: Běijīng'],
    ['{{zh|t=中國|s=中国|p=Zhōngguó}}', 'traditional Chinese: 中國; simplified Chinese: 中国; pinyin: Zhōngguó'],
    ['{{zh|s=中国|t=中國|first=s}}', 'simplified Chinese: 中国; traditional Chinese: 中國'],
    ['{{zh|c=中国|p=Zhōngguó|l=middle kingdom}}', "Chinese: 中国; pinyin: Zhōngguó; lit. 'middle kingdom'"],
    ['{{zh|labels=no|c=中国|p=Zhōngguó}}', '中国; Zhōngguó'],
    ['{{zh|p=Zhōngguó}}', 'pinyin: Zhōngguó'],
    ['{{Korean|hangul=서울|rr=Seoul}}', 'Korean: 서울; RR: Seoul'],
    ['{{Korean|hangul=서울|hanja=|rr=Seoul|labels=no}}', '서울; Seoul'],
    ['{{ko-hhrm|서울|hanja=|rr=Seoul}}', 'Korean: 서울; RR: Seoul'],
  ])
  t.end()
})

test('script and ruby wrappers', (t) => {
  check(t, [
    ['{{ruby|東京|とうきょう}}', '東京 (とうきょう)'],
    ['{{hanja|漢字}}', '漢字'],
    ['{{hangul|한글}}', '한글'],
    ['{{script|Arab|العربية}}', 'العربية'],
    ['{{script/Hebrew|שלום}}', 'שלום'],
    ['{{script/Arabic|العربية}}', 'العربية'],
    ['{{wikt-lang|fr|mot}}', 'mot'],
    ['{{linktext|東|京}}', '東京'],
    ['{{interlanguage link|Foo|de}}', 'Foo'],
    ['{{nihongo krt|Tokyo|東京|Tōkyō}}', 'Tokyo (東京, Tōkyō)'],
  ])
  t.end()
})

test('pronunciation guides stay out of the text, but are kept as data', (t) => {
  t.equal(wtf('Paris ({{respell|PARR|iss}}) is').text(), 'Paris is', 'respell omitted')
  const data = wtf('{{respell|PARR|iss}}').templates()[0].json().data
  t.equal(data.transcription, 'PARR-iss', 'respell transcription')
  t.end()
})

test('names and post-nominals', (t) => {
  check(t, [
    ['{{née|Smith}}', 'née Smith'],
    ['{{nee|Smith}}', 'née Smith'],
    ['{{né|Smith}}', 'né Smith'],
    ['Jane Doe ({{née}} Smith)', 'Jane Doe (née Smith)'],
    ['{{post-nominals|country=GBR|OBE|FRS}}', 'OBE FRS'],
    ['{{postnominals|country=GBR|OBE}}', 'OBE'],
    ['{{post-nominals|country=GBR|post=KBE, FRS}}', 'KBE FRS'],
    ['{{post-nominals|country=GBR|size=100%|CBE|sep=,}}', 'CBE'],
  ])
  t.end()
})

test('formatting wrappers keep their text', (t) => {
  check(t, [
    ['a {{em|b}} c {{strong|d}} e', 'a b c d e'],
    ['{{sc|Small caps}}', 'Small caps'],
    ['{{smallcaps|Small caps}}', 'Small caps'],
    ['{{s|struck}} {{strike|struck}} {{del|gone}}', 'struck struck gone'],
    ['{{u|under}} {{ul|under}} {{tiny|small}}', 'under under small'],
    ['{{serif|text}} {{sans-serif|text}}', 'text text'],
    ['{{avoid wrap|a b c}} {{wrap|d e}} {{nobreak|f g}}', 'a b c d e f g'],
    ['{{nowraplinks|[[Foo]] [[Bar]]}}', 'Foo Bar'],
    ['{{bgcolor|red|x}} {{fontcolor|red|y}} {{fontcolor|red|blue|z}}', 'x y z'],
    ['{{keypress|Ctrl|C}} {{button|OK}} {{keyboard|x}}', 'Ctrl+C OK x'],
    ['{{hover title|tooltip|shown}}', 'shown'],
    ['{{allcaps|loud}} {{caps|Loud}}', 'LOUD LOUD'],
    ['{{sentence case|abc DEF}}', 'Abc def'],
    ['{{trim|  x  }}', 'x'],
    ['{{no wiki|x}} {{strip|y}}', 'x y'],
    ['{{tqq|text}} {{tq2|text}} {{poem|text}}', 'text text text'],
    ['{{tlx|cite web|url}}', 'cite web'],
  ])
  t.end()
})

test('spans around article prose keep the prose', (t) => {
  check(t, [
    ['text {{citation needed span|disputed text|date=May 2020}} more', 'text disputed text more'],
    ['text {{cns|disputed text|date=May 2020}} more', 'text disputed text more'],
    ['text {{cn span|disputed text}} more', 'text disputed text more'],
    ['{{clarify span|text|date=May}}', 'text'],
    ['{{dubious span|text}}', 'text'],
    ['{{typo|hte}} {{not typo|hte}} {{proper name|hte}} {{as written|hte}}', 'hte hte hte hte'],
    ['{{visible anchor|x}}', 'x'],
  ])
  t.end()
})

test('harvard inline citations', (t) => {
  check(t, [
    ['See {{harvtxt|Smith|2001}}.', 'See Smith (2001).'],
    ['See {{harv|Smith|2001}}.', 'See (Smith 2001).'],
    ['{{harv|Smith|Jones|2001|p=12}}', '(Smith & Jones 2001, p. 12)'],
    ['{{harv|Smith|Jones|Lee|2001|pp=12–14}}', '(Smith, Jones & Lee 2001, pp. 12–14)'],
    ['{{harvtxt|Smith|Jones|Lee|Wu|2001}}', 'Smith et al. (2001)'],
    ['{{harvtxt|Smith|2001|p=5}}', 'Smith (2001, p. 5)'],
    ['{{harvp|Smith|2001}}', '(Smith 2001)'],
    ['{{harvcol|Smith|2001}}', '(Smith 2001)'],
    ['{{harvcoltxt|Smith|2001a}}', 'Smith (2001a)'],
    ['{{harvard citation text|Smith|2001}}', 'Smith (2001)'],
    ['{{harvard citation no brackets|Smith|2001}}', 'Smith 2001'],
  ])
  t.end()
})

test('section links and cross references', (t) => {
  check(t, [
    ['{{section link|Foo|Bar}}', 'Foo § Bar'],
    ['{{slink|Foo|Bar}}', 'Foo § Bar'],
    ['{{slink|Foo|Bar|Baz}}', 'Foo § Bar and § Baz'],
    ['{{section link||Bar}}', '§ Bar'],
    ['{{section link|Foo|Bar|nopage=y}}', '§ Bar'],
    ['{{crossreference|see Foo}}', '(see Foo)'],
    ['{{crossref|see Foo}} {{xref|see Foo}}', '(see Foo) (see Foo)'],
    ['{{xref|(see Foo)}}', '(see Foo)'],
    ['{{cross reference|printworthy=see Foo}}', '(see Foo)'],
  ])
  const links = wtf('{{slink|Foo|Bar}}').links().map((l) => l.page())
  t.deepEqual(links, ['Foo'], 'section link links to the page')
  t.end()
})

test('quote-mark templates', (t) => {
  check(t, [
    ['{{"|quoted}}', '"quoted"'],
    ["Bob{{'s}} car", "Bob's car"],
    ["x{{'\"}}", 'x\'"'],
    ['{{"\'}}y', '"\'y'],
    ['{{-"}}', '"'],
  ])
  t.end()
})

test('numbers and lists', (t) => {
  check(t, [
    ['{{ordinal|3}} {{nth|21}} {{ordinal|112}}', '3rd 21st 112th'],
    ['{{spell|3}} {{spell|21}} {{spell|342}} {{numtext|1000}}', 'three twenty-one three hundred forty-two one thousand'],
    ['{{cslist|a|b|c}}', 'a, b, c'],
    ['The 10{{nbsp}}km race', 'The 10 km race'],
    ['a{{nbsp|3}}b', 'a b'],
    ['{{bull}}', '•'],
  ])
  t.end()
})

test('symbol templates', (t) => {
  check(t, [
    ['5 {{times}} 3', '5 × 3'],
    ['20{{deg}} and 20{{degree}}', '20° and 20°'],
    ["5{{prime}} and 5{{dprime}}", '5′ and 5″'],
    ['{{minus}}5 and {{−}}5', '−5 and −5'],
    ['{{±}}1 and {{pm}}1', '±1 and ±1'],
    ['{{divide}} {{div}}', '÷ ÷'],
    ['{{approx}} {{≈}}', '≈ ≈'],
    ['{{infinity}} {{infin}}', '∞ ∞'],
    ['{{rarr}} {{larr}} {{harr}} {{uarr}} {{darr}}', '→ ← ↔ ↑ ↓'],
    ['{{rightarrow}} {{leftarrow}} {{→}} {{←}}', '→ ← → ←'],
    ['{{arrow|right}} {{arrow|left}} {{arrow|up}}', '→ ← ↑'],
    ['{{checkmark}}', '✓'],
    ['{{hyphen}} {{endash}} {{emdash}}', '- – —'],
    ['non{{nbhyph}}breaking', 'non‑breaking'],
  ])
  t.end()
})

test('in lang, years, buttons, boxes, category links', (t) => {
  check(t, [
    ['{{in lang|fr}}', '(in French)'],
    ['{{in lang|en|el}}', '(in English and Greek)'],
    ['{{In lang|ru|de|fr}}', '(in Russian, German and French)'],
    ['{{in lang|zh-Hans}}', '(in Simplified Chinese)'],
    ['{{in lang|xx}}', '(in xx)'],
    ['{{clickable button|Jump to list}}', 'Jump to list'],
    ['{{Clickable button 2|Jump|link=Foo}}', 'Jump'],
    ['{{box|inline=yes|1=pattern}}', 'pattern'],
    ['{{box|type=transparent|{{music|quarter}}}}', '♩'],
    ['{{cl|Classical music awards}}', 'Category:Classical music awards'],
    ['{{cl|Foo|Foos}}', 'Foos'],
  ])
  const year = new Date().getFullYear()
  t.equal(wtf('{{LASTYEAR}}').text(), String(year - 1), 'lastyear')
  t.equal(wtf('{{NEXTYEAR}}').text(), String(year + 1), 'nextyear')
  t.equal(wtf('{{cl|Foo}}').links()[0].json().page, 'Category:Foo', 'cl links to the category')
  t.end()
})
