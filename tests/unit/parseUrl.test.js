import test from 'tape'
import parseUrl from '../../src/_fetch/parseUrl.js'

const tests = [
  {
    test: 'https://en.wikipedia.org/wiki/Ainmanes',
    domain: 'en.wikipedia.org',
    title: 'Ainmanes',
  },
  {
    test: 'https://nl.wikivoyage.org/wiki/Wandelroute_E9',
    domain: 'nl.wikivoyage.org',
    title: 'Wandelroute_E9',
  },
  {
    test: 'https://dota2.gamepedia.com/Abaddon',
    domain: 'dota2.gamepedia.com',
    title: 'Abaddon',
  },
  {
    test: 'https://bulbapedia.bulbagarden.net/wiki/Aegislash_(Pok%C3%A9mon)',
    domain: 'bulbapedia.bulbagarden.net',
    title: 'Aegislash_(Pokémon)',
  },
]

tests.forEach((testCase) => {
  test('parse the urls ' + testCase.title, (t) => {
    const result = parseUrl(testCase.test)
    t.equal(result.domain, testCase.domain)
    t.equal(result.title, testCase.title)
    t.end()
  })
})
