const test = require('tape')
const wtf = require('./_lib')

test('barrie', function (t) {
  let str = `'''[[Barrie]]''' is a city in Ontario, Canada.

'''Barrie''' may also refer to:

* [[Barrie (electoral district)]], Canadian federal electoral district
* [[Barrie (provincial electoral district)]], provincial electoral district
* [[Barrie—Simcoe—Bradford]], former Canadian electoral district
* [[Barrie School]], private school in Silver Spring, Maryland
* [[Barrie (company)]], fashion company owned by Chanel
* [[Little Barrie]], British band`

  let doc = wtf(str)
  let res = doc.disambiguation()
  t.equal(res.text, 'Barrie', 'text')
  t.equal(res.main, 'Barrie', 'main')
  t.equal(res.pages.length, 6, '6-pages')

  t.end()
})

test('barry', function (t) {
  let str = `'''Barry''' may refer to:
{{TOC right}}

==People and fictional characters==
* [[Barry (name)]], including lists of people with the given name, nickname or surname, as well as fictional characters with the given name
* [[Dancing Barry]], stage name of Barry Richards (born c. 1950), former dancer at National Basketball Association games

==Places==
===Canada===
*[[Barry Lake]], Quebec
*[[Barry Islands]], Nunavut

===United Kingdom===
* [[Barry, Angus]], Scotland, a village
** [[Barry Mill]], a watermill
* [[Barry, Vale of Glamorgan]], Wales, a town
** [[Barry Railway Company]]

===United States===
* [[Barry, Illinois]], a city
* [[Barry, Minnesota]], a city
* [[Barry, Texas]], a city
* [[Barry County, Michigan]]
* [[Barry County, Missouri]]
* [[Barry Township (disambiguation)]], in several states
* [[Fort Barry]], Marin County, California, a former US Army installation

===Elsewhere===
* [[Barry Island (Debenham Islands)]], Antarctica
* [[Barry, New South Wales]], Australia, a village
* [[Barry, Hautes-Pyrénées]], France, a commune

==Arts and entertainment==
* [[Barry (album)|''Barry'' (album)]], by Barry Manilow
* "Barry", a character from the Marillion album cover ''[[Anoraknophobia]]''
* [[Barry (1949 film)|''Barry'' (1949 film)]], a French film
* [[Barry (2016 film)|''Barry'' (2016 film)]], an American film
* [[Barry (TV series)|''Barry'' (TV series)]], an American tragicomedy series
* [[Barry Award (for crime novels)]]
* [[Melbourne International Comedy Festival Award]], formerly called the Barry Award

==Other uses==
* [[Barry (heraldry)]]
* [[Barry (dog)]] (1800–1814), a mountain rescue St. Bernard
* [[Barry (radio)]], an Australian radio station
* [[Barry (UK Parliament constituency)]]
* [[Barry University]], a private Catholic university in Miami Shores, Florida
* [[Tropical Storm Barry]]
* {{USS|Barry}}, four US destroyers
* [[1703 Barry]], a minor planet

==See also==
* [[De Barry family]]
* [[Dubarry (disambiguation)]]
* [[Barre (disambiguation)]]
* [[Barrie (disambiguation)]]
* [[Berry (disambiguation)]]
{{srt}}

{{Disambiguation|geo}}
`

  let doc = wtf(str)
  let res = doc.disambiguation()
  t.equal(res.text, 'Barry', 'text')
  t.equal(res.main, null, 'main')
  t.equal(res.pages.length, 32, '32-pages')

  t.end()
})
