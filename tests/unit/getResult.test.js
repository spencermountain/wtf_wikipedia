import getResult from '../../src/_fetch/getResult.js'
import test from 'tape'

test('parse a normal case', (t) => {
  const options = {
    "domain": "liquipedia.net",
    "path": "counterstrike/api.php",
    "follow_redirects": true,
    "Api-User-Agent": "wtf_wikipedia test script - <spencermountain@gmail.com>",
    "title": "Team_Liquid"
  }

  const response = {
    "warnings": {
      "main": {
        "*": "Unrecognized parameter: rvslots."
      }
    },
    "batchcomplete": "",
    "query": {
      "normalized": [
        {
          "from": "Team_Liquid",
          "to": "Team Liquid"
        }
      ],
      "pages": {
        "19571": {
          "pageid": 19571,
          "ns": 0,
          "title": "Team Liquid",
          "revisions": [
            {
              "contentformat": "text/x-wiki",
              "contentmodel": "wikitext",
              "*": "test"
            }
          ],
          "pageprops": {
            "displaytitle": "Team Liquid",
            "metaimage": "Team Liquid 2020.png",
            "metaimageurl": "https://liquipedia.net/commons/images/7/7e/Team_Liquid_2020.png",
          }
        }
      }
    }
  }

  const expected = [
    {
      wiki: "test",
      meta: {
        "domain": "liquipedia.net",
        "path": "counterstrike/api.php",
        "follow_redirects": true,
        "Api-User-Agent": "wtf_wikipedia test script - <spencermountain@gmail.com>",
        "title": "Team Liquid",
        pageID: 19571,
        namespace: 0,
        wikidata: undefined,
        description: undefined,
      }
    }
  ]

  const result = getResult(response, options)
  t.deepEqual(expected, result)
  t.end()
})

test('parse a normal case from wikimedia', (t) => {
  const options = {
    "lang": "it",
    "wiki": "wiktionary",
    "follow_redirects": true,
    "path": "api.php",
    "title": "casa"
  }

  const response = {
    "batchcomplete": "",
    "query": {
      "pages": {
        "742": {
          "pageid": 742,
          "ns": 0,
          "title": "casa",
          "revisions": [
            {
              "slots": {
                "main": {
                  "contentmodel": "wikitext",
                  "contentformat": "text/x-wiki",
                  "*": "Italian wiktionary"
                }
              }
            }
          ],
          "pageprops": {
            "page_image_free": "RybnoeDistrict_06-13_Konstantinovo_village_05.jpg"
          }
        }
      }
    }
  }

  const expected = [
    {
      wiki: 'Italian wiktionary',
      meta: {
        lang: 'it',
        wiki: 'wiktionary',
        follow_redirects: true,
        path: 'api.php',
        title: 'casa',
        pageID: 742,
        namespace: 0,
        domain: 'wiktionary.org',
        wikidata: undefined,
        description: undefined
      }
    }
  ]

  const result = getResult(response, options)
  t.deepEqual(expected, result)
  t.end()
})

test('parse a not found case', (t) => {
  const options = {
    "lang": "en",
    "wiki": "wikipedia",
    "follow_redirects": true,
    "path": "api.php",
    "Api-User-Agent": "wtf_wikipedia test script - <spencermountain@gmail.com>",
    "title": "165111651dfasfasdfsadfas"
  }

  const response = { "batchcomplete": "", "query": { "pages": { "-1": { "ns": 0, "title": "165111651dfasfasdfsadfas", "missing": "" } } } }

  const expected = [null]

  const result = getResult(response, options)
  t.deepEqual(expected, result)
  t.end()
})