const test = require('tape')
const wtf = require('./_lib')

test('first-sentence cleanup summary', t => {
  let arr = [
    [
      'Susan Allen (May 10, 1951 &amp;ndash; September 7, 2015) was an American harpist and singer',
      'an American harpist and singer'
    ],
    [
      `Nils Daniel Carl Bildt, born 15 July 1949 in Halmstad, Sweden, is a Swedish politician and diplomat who was Prime Minister of Sweden from 1991 to 1994.&lt;ref&gt;&lt...`,
      'a Swedish politician'
    ],
    [
      `'''Toronto''' ({{IPAc-en|t|ɵ|ˈ|r|ɒ|n|t|oʊ}}, {{IPAc-en|local|ˈ|t|r|ɒ|n|oʊ}}) is the [[List of the 100 largest municipalities in Canada by population|most populous city]] in [[Canada]] and the [[Provinces and territories of Canada|provincial]] [[capital city|capital]] of [[Ontario]]. `,
      'the most populous city in Canada'
    ],
    [
      `'''Andriy Mykolayovych Vasylytchuk''' ({{lang-uk|Андрій Миколайович Василитчук}}; {{lang-ru|Андрей Николаевич Василитчук}}; born 23 October 1965 in [[Lviv]]) is a retired [[Ukraine|Ukrainian]] professional [[Association football|football]]er.`,
      'a retired Ukrainian professional footballer'
    ]
  ]
  arr.forEach((a, i) => {
    let str = wtf(a[0]).summary()
    t.equal(a[1], str, 'extract-' + i)
  })
  t.end()
})
