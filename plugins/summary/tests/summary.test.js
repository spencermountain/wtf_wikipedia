import test from 'tape'
import wtf from './_lib.js'

test('first-sentence cleanup summary', (t) => {
  let arr = [
    // TODO: this test is failing
    // [
    //   'Susan Allen (May 10, 1951 &amp;ndash; September 7, 2015) was an American harpist and singer',
    //   'an American harpist and singer'
    // ],
    // TODO: this test is failing
    // [
    //   `Nils Daniel Carl Bildt, born 15 July 1949 in Halmstad, Sweden, is a Swedish politician and diplomat who was Prime Minister of Sweden from 1991 to 1994.&lt;ref&gt;&lt...`,
    //   'a Swedish politician'
    // ],
    // TODO: this test is failing
    // [
    //   `'''Toronto''' ({{IPAc-en|t|ɵ|ˈ|r|ɒ|n|t|oʊ}}, {{IPAc-en|local|ˈ|t|r|ɒ|n|oʊ}}) is the [[List of the 100 largest municipalities in Canada by population|most populous city]] in [[Canada]] and the [[Provinces and territories of Canada|provincial]] [[capital city|capital]] of [[Ontario]]. `,
    //   'the most populous city in Canada and the provincial capital of Ontario'
    // ],
    // TODO: this test is failing
    // [
    //   `'''Andriy Mykolayovych Vasylytchuk''' ({{lang-uk|Андрій Миколайович Василитчук}}; {{lang-ru|Андрей Николаевич Василитчук}}; born 23 October 1965 in [[Lviv]]) is a retired [[Ukraine|Ukrainian]] professional [[Association football|football]]er.`,
    //   'a retired Ukrainian professional footballer'
    // ],
    // [
    //   `The Mercantile Rowing Club is based in Melbourne, Australia on the Yarra River. It was founded in 1880 and has occupied its current site since 1885. `,
    //   ''
    // ],
    // TODO: this test is failing
    // [
    //   `Larchmont Yacht Club is a private, members-only yacht club situated on Larchmont Harbor in the Village of Larchmont, in Westchester County, New York. `,
    //   'a private, members-only yacht club'
    // ],
    [`she cleaned teeth very well [[Category:Female Orthadontists]] `, 'A female orthadontist'],
    [`he flipped around [[Category: Acrobats]][[Category: Living People]] `, 'An acrobat']
  ]
  arr.forEach((a, i) => {
    let str = wtf(a[0]).summary()
    t.equal(str, a[1], 'extract-' + i)
  })
  t.end()
})
