import test from 'tape'
import wtf from '../../lib/index.js'

const check = (t, cases) => {
  cases.forEach(([input, text, page]) => {
    const doc = wtf(input)
    t.equal(doc.text(), text, input + ' text')
    if (page !== undefined) {
      const links = doc.links().map((l) => l.json().page)
      t.equal(links[0], page, input + ' link')
    }
  })
}

test('national team shorthands', (t) => {
  check(t, [
    ['{{nft|USA}}', '🇺🇸 United States', 'United States national football team'],
    ['{{nft-rt|USA}}', 'United States 🇺🇸', 'United States national football team'],
    ['{{fbw|USA}}', '🇺🇸 United States', "United States women's national football team"],
    ['{{fbu|20|USA}}', '🇺🇸 United States U20', 'United States national under-20 football team'],
    ['{{fbwu|17|GER}}', '🇩🇪 Germany U17', "Germany women's national under-17 football team"],
    ['{{fb-rt|USA}}', 'United States 🇺🇸', 'United States national football team'],
    ['{{nfa|USA}}', '🇺🇸 United States', 'United States Football Association'],
    ['{{bk|USA}}', '🇺🇸 United States', 'United States national basketball team'],
    ['{{bkw|USA}}', '🇺🇸 United States', "United States women's national basketball team"],
    ['{{hb|DEN}}', '🇩🇰 Denmark', 'Denmark national handball team'],
    ['{{ih|CAN}}', '🇨🇦 Canada', "Canada men's national ice hockey team"],
    ['{{ihw|CAN}}', '🇨🇦 Canada', "Canada women's national ice hockey team"],
    ['{{ru|NZL}}', '🇳🇿 New Zealand', 'New Zealand national rugby union team'],
    ['{{rl|AUS}}', '🇦🇺 Australia', 'Australia national rugby league team'],
    ['{{crw|IND}}', '🇮🇳 India', "India women's national cricket team"],
    ['{{vb|BRA}}', '🇧🇷 Brazil', "Brazil men's national volleyball team"],
    ['{{fh|NED}}', '🇳🇱 Netherlands', "Netherlands men's national field hockey team"],
    ['{{wp|HUN}}', '🇭🇺 Hungary', "Hungary men's national water polo team"],
    ['{{bs|JPN}}', '🇯🇵 Japan', 'Japan national baseball team'],
    ['{{bk|XYZ}}', 'XYZ'],
  ])
  t.end()
})

test('ioc and fifa country codes', (t) => {
  check(t, [
    ['{{flagicon|NED}}', '🇳🇱'],
    ['{{flagicon|GER}}', '🇩🇪'],
    ['{{flagicon|SUI}}', '🇨🇭'],
    ['{{flagcountry|RSA}}', '🇿🇦 South Africa', 'South Africa'],
    ['{{flagcountry|CRO}}', '🇭🇷 Croatia', 'Croatia'],
    ['{{flagcountry|URS}}', '🇷🇺 Russia', 'Russia'],
    ['{{fb|NED}}', '🇳🇱 Netherlands', 'Netherlands national football team'],
    ['{{flag|SUI}}', '🇨🇭 SUI'],
  ])
  t.end()
})

test('olympic flag templates', (t) => {
  check(t, [
    ['{{flagIOC|USA|2016 Summer}}', '🇺🇸 United States', 'United States at the 2016 Summer Olympics'],
    ['{{flagIOC|USA}}', '🇺🇸 United States', 'United States'],
    ['{{flagIOC2|GER|2016 Summer}}', '🇩🇪 Germany', 'Germany at the 2016 Summer Olympics'],
    ['{{flagIOCteam|USA|2016 Summer}}', '🇺🇸 United States', 'United States at the 2016 Summer Olympics'],
    ['{{flagteam|USA|2016 Summer Olympics}}', '🇺🇸 United States', 'United States at the 2016 Summer Olympics'],
    ['{{flagIOCathlete|[[John Smith]]|USA|2016 Summer}}', '🇺🇸 John Smith (USA)', 'John Smith'],
    ['{{flagIOCmedalist|John Smith|NED|2016 Summer}}', '🇳🇱 John Smith (NED)', 'John Smith'],
    ['{{flagu|USA}}', '🇺🇸 United States'],
    ['{{noflag|Mixed team}}', 'Mixed team'],
  ])
  const links = wtf('{{flagIOCathlete|[[John Smith]]|USA|2016 Summer}}').links().map((l) => l.json().page)
  t.deepEqual(links, ['John Smith', 'United States at the 2016 Summer Olympics'], 'athlete and games are both linked')
  t.equal(wtf('{{flagu|USA}}').links().length, 0, 'flagu is unlinked')
  t.end()
})

test('post-season year links', (t) => {
  check(t, [
    ['{{wsy|2001}}', '2001', '2001 World Series'],
    ['{{alcsy|2001}}', '2001', '2001 American League Championship Series'],
    ['{{nlcsy|2001}}', '2001', '2001 National League Championship Series'],
  ])
  t.end()
})

test('table cell words', (t) => {
  check(t, [
    ['{{tbd}}', 'TBD'],
    ['{{bad}}', 'Bad'],
    ['{{always}} {{never}}', 'Always Never'],
    ['{{inactive}} {{withdrawn}}', 'Inactive Withdrawn'],
    ['{{in progress}} {{on hold}}', 'In progress On hold'],
    ['{{complete}} {{incomplete}}', 'Complete Incomplete'],
    ['{{table-yes}} {{table-no}}', 'Yes No'],
    ['{{nominated}} {{nom}}', 'Nominated Nominated'],
    ['{{postponed|Delayed}}', 'Delayed'],
  ])
  t.end()
})
