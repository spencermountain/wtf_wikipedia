import test from 'tape'
import wtf from '../../lib/index.js'

let str = `
    {{Infobox musical artist
    | name         = Boney James
    | image        = Boney James 2013.jpg
    | caption      = Boney James in 2013
    | birth_name   = James Oppenheim
    | birth_date   = {{Birth date and age|1961|9|1}}  
    | birth_place  = [[Lowell, Massachusetts]], U.S.
    | genre        = Jazz, contemporary jazz, R&B
    | occupation   = Musician
    | instrument   = Saxophone
    | years_active = 1970s–present
    | label        = [[Concord Records|Concord]]
    | website      = {{URL|boneyjames.com}}
    }}
`

// type
test('type - should return the type of infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  t.equal(infobox.type(), 'musical artist', 'type is album')
  t.end()
})

// links

test('links - should return the links in the infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  let links = infobox.links()

  t.deepEqual(
    links.map((link => link.wikitext())),
    [
      '[[Lowell, Massachusetts]]',
      '[[Concord Records|Concord]]',
    ],
    'links length is 2',
  )
  t.end()
})

// image
test('image - should return the images in the infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  let image = infobox.image()
  t.equal(
    image.file(),
    'File:Boney_James_2013.jpg',
    'images length is 1',
  )
  t.end()
})

// get
test('get - should return the value of a key', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  t.equal(infobox.get('name').text(), 'Boney James', 'name is Boney James')
  t.equal(infobox.get('birth_date').text(), 'September 1, 1961', 'birth_date is {{Birth date and age|1961|9|1}}')
  t.end()
})

test('get - should return the data when given an array of keys', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  let data = infobox.get(['name', 'birth_date'])
  t.deepEqual([data[0].text(), data[1].text()],  ['Boney James', 'September 1, 1961'], 'name is Boney James')
  t.end()
})

// text
test('text - should return the text of the infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  // its always empty
  t.equal(infobox.text(), '', 'text is \'\'')
  t.end()
})

// json
test('json - should return the json of the infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  t.deepEqual(
    infobox.json(),
    {
      name: { text: 'Boney James' },
      image: { text: 'Boney James 2013.jpg' },
      caption: { text: 'Boney James in 2013' },
      birth_name: { text: 'James Oppenheim' },
      birth_date: { text: 'September 1, 1961' },
      birth_place: {
        text: 'Lowell, Massachusetts, U.S.',
        links: [
          {
            text: undefined,
            type: 'internal',
            page: 'Lowell, Massachusetts',
          },
        ],
      },
      genre: { text: 'Jazz, contemporary jazz, R&B' },
      occupation: { text: 'Musician' },
      instrument: { text: 'Saxophone' },
      years_active: { text: '1970s–present' },
      label: {
        text: 'Concord',
        links: [
          {
            text: 'Concord',
            type: 'internal',
            page: 'Concord Records',
          },
        ],
      },
      website: { text: 'boneyjames.com' },
    },
    'json is correct',
  )
  t.end()
})

// wikitext
test('wikitext - should return the wikitext of the infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]

  let wikitext = `{{Infobox musical artist
    | name         = Boney James
    | image        = Boney James 2013.jpg
    | caption      = Boney James in 2013
    | birth_name   = James Oppenheim
    | birth_date   = September 1, 1961  
    | birth_place  = [[Lowell, Massachusetts]], U.S.
    | genre        = Jazz, contemporary jazz, R&B
    | occupation   = Musician
    | instrument   = Saxophone
    | years_active = 1970s–present
    | label        = [[Concord Records|Concord]]
    | website      = boneyjames.com
    }}`

  t.equal(infobox.wikitext(), wikitext, 'wikitext is correct')
  t.end()
})

// keyValue
test('keyValue - should return the key value of the infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  t.deepEqual(
    infobox.keyValue(),
    {
      name: 'Boney James',
      image: 'Boney James 2013.jpg',
      caption: 'Boney James in 2013',
      birth_name: 'James Oppenheim',
      birth_date: 'September 1, 1961',
      birth_place: 'Lowell, Massachusetts, U.S.',
      genre: 'Jazz, contemporary jazz, R&B',
      occupation: 'Musician',
      instrument: 'Saxophone',
      years_active: '1970s–present',
      label: 'Concord',
      website: 'boneyjames.com',
    },
    'keyValue is correct',
  )
  t.end()
})

// aliases
// data
test('data - should return the key value of the infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  t.deepEqual(
    infobox.data(),
    {
      name: 'Boney James',
      image: 'Boney James 2013.jpg',
      caption: 'Boney James in 2013',
      birth_name: 'James Oppenheim',
      birth_date: 'September 1, 1961',
      birth_place: 'Lowell, Massachusetts, U.S.',
      genre: 'Jazz, contemporary jazz, R&B',
      occupation: 'Musician',
      instrument: 'Saxophone',
      years_active: '1970s–present',
      label: 'Concord',
      website: 'boneyjames.com',
    },
    'data is correct',
  )
  t.end()
})

// template
test('template - should return the templates of infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  t.equal(infobox.template(), 'musical artist', 'template is album')
  t.end()
})

// images
test('images - should return the images in the infobox', (t) => {
  let doc = wtf(str)
  let infobox = doc.infoboxes(0)[0]
  let image = infobox.images()
  t.equal(
    image.file(),
    'File:Boney_James_2013.jpg',
    'images length is 1',
  )
  t.end()
})