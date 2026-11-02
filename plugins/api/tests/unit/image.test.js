import { readPage } from '../../../../tests/_examples/index.js'
import test from 'tape'
import wtf from '../_lib.js'

test('image method smoketests', function (t) {
  const doc = wtf('[[File:Foo bar.jpg|thumb|some caption]]')
  t.equal(typeof doc.mainImage, 'function', 'has mainImage method')
  const img = doc.images()[0]
  t.equal(typeof img.commonsURL, 'function', 'has commonsURL method')
  t.equal(typeof img.exists, 'function', 'has exists method')
  t.equal(typeof img.license, 'function', 'has license method')
  t.end()
})

test('mainImage', function (t) {
  const arr = [
    ['Toronto', 'https://wikipedia.org/wiki/Special:Redirect/file/Montage_of_Toronto_7.jpg'],
    ['United-Kingdom', 'https://wikipedia.org/wiki/Special:Redirect/file/EU-United_Kingdom.svg'],
    ['Allen-R-Morris', 'https://wikipedia.org/wiki/Special:Redirect/file/AllenMorrisHeadShot.jpg'],
    ['Arts-Club-Of-Chicago', 'https://wikipedia.org/wiki/Special:Redirect/file/20070701_Arts_Club_of_Chicago.JPG'],
    ['Britt-Morgan', 'https://wikipedia.org/wiki/Special:Redirect/file/Britt_Morgan.jpg'],
  ]
  arr.forEach((a) => {
    const txt = readPage(a[0])
    const doc = wtf(txt)
    const img = doc.mainImage().src()
    t.equal(img, a[1], a[0])
  })
  t.equal(wtf('just some text').mainImage(), null, 'no image → null')
  t.end()
})

test('commonsURL', function (t) {
  const doc = wtf('[[File:RybnoeDistrict 06-13 Konstantinovo village 05.jpg|thumb|cap]]')
  const url = doc.images()[0].commonsURL()
  t.equal(
    url,
    'https://upload.wikimedia.org/wikipedia/commons/4/4e/RybnoeDistrict_06-13_Konstantinovo_village_05.jpg',
    'md5-hashed commons path'
  )
  t.end()
})

test('image license', async function (t) {
  const calls = []
  const http = async (url, headers) => {
    calls.push({ url, headers })
    return {
      query: {
        pages: {
          123: {
            imageinfo: [
              {
                extmetadata: {
                  LicenseShortName: { value: 'CC BY-SA 3.0' },
                  Artist: { value: 'Somebody' },
                  Credit: { value: 'Own work' },
                  AttributionRequired: { value: 'true' },
                },
              },
            ],
          },
        },
      },
    }
  }
  const oldFetch = globalThis.fetch
  globalThis.fetch = async (url, headers) => ({ ok: true, json: () => http(url, headers) })
  const doc = wtf('[[File:Foo bar.jpg|thumb|cap]]')
  const res = await doc.images()[0].license()
  t.deepEqual(
    res,
    { license: 'CC BY-SA 3.0', artist: 'Somebody', credit: 'Own work', attributionRequired: 'true' },
    'license fields parsed'
  )
  const url = new URL(calls[0].url)
  t.equal(url.host, 'commons.wikimedia.org', 'queries the commons api')
  t.equal(url.searchParams.get('prop'), 'imageinfo', 'imageinfo prop')
  t.equal(url.searchParams.get('iiprop'), 'extmetadata', 'extmetadata iiprop')
  t.equal(url.searchParams.get('titles'), 'File:Foo_bar.jpg', 'file title passed')

  const missing = async () => ({ query: { pages: { '-1': { missing: '' } } } })
  globalThis.fetch = async () => ({ ok: true, json: missing })
  t.equal(await doc.images()[0].license(), null, 'missing file → null')
  globalThis.fetch = oldFetch
  t.end()
})

test('image exists', async function (t) {
  const oldFetch = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url, opts) => {
    calls.push({ url, opts })
    return { status: 200 }
  }
  const doc = wtf('[[File:Foo bar.jpg|thumb|cap]]')
  const img = doc.images()[0]
  t.equal(await img.exists(), true, 'true on 200')
  t.equal(calls[0].opts.method, 'HEAD', 'HEAD request')
  t.equal(calls[0].url, img.url(), 'checks the image url')
  globalThis.fetch = async () => ({ status: 404 })
  t.equal(await img.exists(), false, 'false on 404')
  globalThis.fetch = async () => {
    throw new Error('network down')
  }
  t.equal(await img.exists(), null, 'null on network error')
  globalThis.fetch = oldFetch
  t.end()
})
