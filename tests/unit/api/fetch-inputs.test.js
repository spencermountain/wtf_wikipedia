import test from 'tape'
import wtf from '../../lib/index.js'
import mockFetch from '../../lib/mockFetch.js'

const tests = [
  {
    test: 'https://en.wikipedia.org/wiki/Ainmanes',
    domain: 'en.wikipedia.org',
    title: 'Ainmanes'
  },
  {
    test: 'https://nl.wikivoyage.org/wiki/Wandelroute_E9',
    domain: 'nl.wikivoyage.org',
    title: 'Wandelroute_E9'
  },
  {
    test: 'https://dota2.gamepedia.com/Abaddon',
    domain: 'dota2.gamepedia.com',
    title: 'Abaddon'
  },
  {
    test: 'https://bulbapedia.bulbagarden.net/wiki/Aegislash_(Pok%C3%A9mon)',
    domain: 'bulbapedia.bulbagarden.net',
    title: 'Aegislash_(Pokémon)'
  }
]

tests.forEach((testCase) => {
  test('fetch accepts page URLs: ' + testCase.title, async (t) => {
    await mockFetch({ query: { pages: {} } }, async (requests) => {
      await wtf.fetch(testCase.test)
      const url = new URL(requests[0].url)
      t.equal(url.hostname, testCase.domain)
      t.equal(url.searchParams.get('titles'), testCase.title)
    })
    t.end()
  })
})
