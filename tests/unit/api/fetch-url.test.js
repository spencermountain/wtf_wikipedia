import test from 'tape'
import wtf from '../../lib/index.js'
import mockFetch from '../../lib/mockFetch.js'

const tests = [
  {
    options: {
      lang: 'en',
      wiki: 'wikipedia',
      follow_redirects: true,
      path: 'api.php',
      'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
      title: ['Marina Gilardoni', 'Jessica Kilian', 'Tanja Morel'],
    },
    url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions%7Cpageprops&rvprop=content%7Cids%7Ctimestamp&maxlag=5&rvslots=main&origin=*&format=json&redirects=true&titles=Marina_Gilardoni%7CJessica_Kilian%7CTanja_Morel',
  },
  {
    options: {
      lang: 'it',
      wiki: 'wiktionary',
      follow_redirects: true,
      path: 'api.php',
      title: 'casa',
    },
    url: 'https://it.wiktionary.org/w/api.php?action=query&prop=revisions%7Cpageprops&rvprop=content%7Cids%7Ctimestamp&maxlag=5&rvslots=main&origin=*&format=json&redirects=true&titles=casa',
  },
  {
    options: {
      lang: 'nl',
      wiki: 'wikipedia',
      follow_redirects: false,
      'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
      title: 5321546,
    },
    url: 'https://nl.wikipedia.org/w/api.php?action=query&prop=revisions%7Cpageprops&rvprop=content%7Cids%7Ctimestamp&maxlag=5&rvslots=main&origin=*&format=json&pageids=5321546',
  },
  {
    options: {
      lang: 'en',
      wiki: 'wikipedia',
      follow_redirects: true,
      'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
      title: [145422, 3120522],
    },
    url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions%7Cpageprops&rvprop=content%7Cids%7Ctimestamp&maxlag=5&rvslots=main&origin=*&format=json&redirects=true&pageids=145422%7C3120522',
  },
  {
    options: {
      domain: 'liquipedia.net',
      path: 'counterstrike/api.php',
      follow_redirects: true,
      'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
      title: 'Team_Liquid',
    },
    url: 'https://liquipedia.net/counterstrike/api.php?action=query&prop=revisions%7Cpageprops&rvprop=content%7Cids%7Ctimestamp&maxlag=5&rvslots=main&origin=*&format=json&redirects=true&titles=Team_Liquid',
  },
  {
    options: {
      domain: 'en.wikipedia.org',
      follow_redirects: true,
      'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
      title: [145422, 3120522],
    },
    url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions%7Cpageprops&rvprop=content%7Cids%7Ctimestamp&maxlag=5&rvslots=main&origin=*&format=json&redirects=true&pageids=145422%7C3120522',
  },
  {
    options: {},
    url: '',
  },
  {
    options: {
      domain: 'en.wikipedia.org',
      follow_redirects: true,
      'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    },
    url: '',
  },
]

tests.forEach(({ options, url }) => {
  test('fetch constructs the request URL: ' + (options.title || 'missing title'), async (t) => {
    await mockFetch({ query: { pages: {} } }, async (requests) => {
      if (!url) {
        let error
        try {
          await wtf.fetch(options.title, options)
        } catch (err) {
          error = err
        }
        t.ok(error instanceof Error, 'missing title rejects')
        t.equal(requests.length, 0, 'no request is sent')
      } else {
        await wtf.fetch(options.title, options)
        t.equal(requests[0].url, url, 'request URL')
      }
    })
    t.end()
  })
})
