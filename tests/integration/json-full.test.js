const wtf = require('../lib')
const fs = require('fs')
const path = require('path')
const test = require('tape')

test('plurals / singular - all should exist', (t) => {
  let str = fs.readFileSync(path.join(__dirname, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  let singels = {
    section: [
      {
        clue: undefined,
        json: true,
        expected: {
          title: '',
          depth: 0,
          paragraphs: [
            {
              sentences: [
                {
                  text:
                    'Arts Club of Chicago is a private club located in the Near North Side community area of Chicago in Cook County, Illinois, United States, a block east of the Magnificent Mile, that exhibits international contemporary art.',
                  links: [
                    {
                      text: 'Near North Side',
                      type: 'internal',
                      page: 'Near North Side, Chicago',
                    },
                    {
                      text: 'community area',
                      type: 'internal',
                      page: 'Community areas of Chicago',
                    },
                    { type: 'internal', page: 'Chicago' },
                    {
                      type: 'internal',
                      page: 'Cook County, Illinois',
                    },
                    { type: 'internal', page: 'Magnificent Mile' },
                    {
                      text: 'contemporary art',
                      type: 'internal',
                      page: 'contemporary art',
                    },
                  ],
                  formatting: { bold: ['Arts Club of Chicago'] },
                },
                {
                  text:
                    "It was founded in 1916, inspired by the success of the Art Institute of Chicago's handling of the Armory Show.",
                  links: [
                    { type: 'internal', page: 'Art Institute of Chicago' },
                    {
                      type: 'internal',
                      page: 'Armory Show',
                    },
                  ],
                },
                {
                  text:
                    'Its founding was viewed as a statement that art had become an important component of civilized urban life.',
                },
                {
                  text: 'The Arts Club is said to have been pro-Modernist from its founding.',
                  links: [{ text: 'Modernist', type: 'internal', page: 'Modernism' }],
                },
                {
                  text:
                    'The Club strove to break new ground with its shows, rather than collect the works of established artists as the Art Institute does.',
                },
              ],
            },
            {
              sentences: [
                {
                  text: "The club presented Pablo Picasso's first United States showing.",
                  links: [{ type: 'internal', page: 'Pablo Picasso' }],
                },
                {
                  text:
                    'In addition, the 1951 exhibition by Jean Dubuffet and his "Anticultural Positions" lecture at the Arts Club were tremendous influences on what would become the mid-1960s Imagist movement.',
                  links: [
                    { type: 'internal', page: 'Jean Dubuffet' },
                    { type: 'internal', page: 'Imagist' },
                  ],
                },
                {
                  text:
                    'Another important presentation in the history of the Arts Club was the Fernand Léger showing of Le Ballet Mecanique.',
                  links: [{ type: 'internal', page: 'Fernand Léger' }],
                  formatting: { italic: ['Le Ballet Mecanique'] },
                },
              ],
            },
            {
              sentences: [
                {
                  text:
                    "The Club's move in 1997 to its current location at 201 E. Ontario Street was not without controversy because the club demolished its former interior space designed by Ludwig Mies van der Rohe and moved only the central staircase to the new gallery space.",
                  links: [{ type: 'internal', page: 'Ludwig Mies van der Rohe' }],
                },
                { text: 'However, the new space is 19000 sqft, which is 7000 sqft larger than the old space.' },
              ],
            },
          ],
          templates: [
            {
              date: 'August 2016',
              template: 'use mdy dates',
            },
            { template: 'good article' },
            {
              display: 'inline',
              template: 'coord',
              lat: 41.89327,
              lon: -87.62251,
            },
          ],
          infoboxes: [
            {
              name: { text: 'Arts Club of Chicago' },
              pushpin_map: { text: 'United States Chicago Near North Side' },
              coordinates: { text: '41.89327°N, -87.62251°W' },
              map_caption: {
                text: "Location within Chicago's Near North Side community area",
                links: [
                  {
                    text: 'Near North Side',
                    type: 'internal',
                    page: 'Near North Side, Chicago',
                  },
                  { text: 'community area', type: 'internal', page: 'Community areas of Chicago' },
                ],
              },
              image: { text: '20070701 Arts Club of Chicago.JPG' },
              established: { text: '1916 (current location since April 4, 1997)' },
              location: {
                text: '201 E. Ontario Street, Chicago, Illinois 60611 United States 🇺🇸',
                links: [
                  { type: 'internal', page: 'Chicago' },
                  {
                    type: 'internal',
                    page: 'Illinois',
                  },
                  { text: '🇺🇸', type: 'internal', page: 'united states' },
                ],
              },
              website: {
                text: 'www.artsclubchicago.org',
                links: [
                  {
                    text: 'www.artsclubchicago.org',
                    type: 'external',
                    site: 'http://www.artsclubchicago.org',
                  },
                ],
              },
            },
          ],
          references: [
            {
              url: 'http://www.encyclopedia.chicagohistory.org/pages/70.html',
              author: 'Kruty, Paul',
              title: 'Armory Show of 1913',
              accessdate: 'June 27, 2007',
              year: '2005',
              publisher: 'Chicago Historical Society',
              work: 'The Electronic Encyclopedia of Chicago',
              template: 'citation',
              type: 'web',
            },
            {
              url: 'http://www.encyclopedia.chicagohistory.org/pages/72.html',
              author: 'Warren, Lynne',
              title: 'Art',
              accessdate: 'June 27, 2007',
              year: '2005',
              publisher: 'Chicago Historical Society',
              work: 'The Electronic Encyclopedia of Chicago',
              template: 'citation',
              type: 'web',
            },
            {
              url: 'http://www.encyclopedia.chicagohistory.org/pages/83.html',
              author: 'Roeder George H., Jr.',
              title: 'Artists, Education and Culture of',
              accessdate: 'June 27, 2007',
              year: '2005',
              publisher: 'Chicago Historical Society',
              work: 'The Electronic Encyclopedia of Chicago',
              template: 'citation',
              type: 'web',
            },
            {
              url:
                'http://www.aiachicago.org/special_features/1996_Design_Awards/Unbuilt/Awards/Winners/unbuilt_171.html',
              'archive-url':
                'https://web.archive.org/web/20011124011911/http://www.aiachicago.org/special_features/1996_Design_Awards/Unbuilt/Awards/Winners/unbuilt_171.html',
              'dead-url': 'yes',
              'archive-date': 'November 24, 2001',
              title: 'Honor : The Arts Club of Chicago',
              accessdate: 'June 28, 2007',
              publisher: 'American Institute of Architects Chicago',
              template: 'citation',
              type: 'web',
            },
            {
              url: 'http://www.artn.com/Building.pdf',
              title: 'The Arts Club of Chicago Building Fact Sheet',
              accessdate: 'June 29, 2007',
              publisher: 'www.artn.com',
              format: 'PDF',
              archiveurl: 'https://web.archive.org/web/20060615211113/http://www.artn.com/Building.pdf',
              archivedate: 'June 15, 2006',
              template: 'citation',
              type: 'web',
            },
          ],
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          title: 'Mission and purpose',
          depth: 0,
          paragraphs: [
            {
              sentences: [
                {
                  text:
                    'The inaugural mission of the club was "to encourage higher standards of art, maintain galleries for that purpose, and to promote the mutual acquaintance of art lovers and art workers."',
                },
                {
                  text:
                    'This mission arose from the contemporary Chicago active art scene, which had 30 commercial art galleries showing traditional art and an internationally recognized museum.',
                  links: [{ text: 'art galleries', type: 'internal', page: 'art gallery' }],
                },
                {
                  text: 'Additionally, the local mass media gave equitable coverage to the visual arts.',
                  links: [
                    { text: 'mass media', type: 'internal', page: 'mass media' },
                    {
                      text: 'visual arts',
                      type: 'internal',
                      page: 'visual art',
                    },
                  ],
                },
                {
                  text: 'The art scene also had enough clubs and organizations for musicians, writers and artists.',
                  links: [{ text: 'artists', type: 'internal', page: 'artist' }],
                },
                {
                  text: 'Unfortunately, the lively art scene did not adequately represent the avant-garde art.',
                  links: [{ text: 'avant-garde', type: 'internal', page: 'avant-garde' }],
                },
                {
                  text:
                    'The local galleries emphasized American, English and the occasional French work, emphasizing prints and drawings.',
                },
                {
                  text:
                    'This necessitated trips to New York City, London or Paris for Chicagoans who wanted to buy art.',
                },
              ],
            },
            {
              sentences: [
                { text: 'The club does not generally show traveling exhibitions curated by others.' },
                { text: 'Instead, it curates its own exhibits, often with very original works.' },
                { text: 'This places emphasis on cutting edge and avant-garde art.' },
              ],
            },
          ],
          references: [{ template: 'citation', type: 'inline', data: {}, inline: {} }],
        },
      },
    ],
    infobox: [
      {
        clue: undefined,
        json: true,
        expected: {
          name: { text: 'Arts Club of Chicago' },
          pushpin_map: { text: 'United States Chicago Near North Side' },
          coordinates: { text: '41.89327°N, -87.62251°W' },
          map_caption: {
            text: "Location within Chicago's Near North Side community area",
            links: [
              {
                text: 'Near North Side',
                type: 'internal',
                page: 'Near North Side, Chicago',
              },
              { text: 'community area', type: 'internal', page: 'Community areas of Chicago' },
            ],
          },
          image: { text: '20070701 Arts Club of Chicago.JPG' },
          established: { text: '1916 (current location since April 4, 1997)' },
          location: {
            text: '201 E. Ontario Street, Chicago, Illinois 60611 United States 🇺🇸',
            links: [
              { text: undefined, type: 'internal', page: 'Chicago' },
              {
                text: undefined,
                type: 'internal',
                page: 'Illinois',
              },
              { text: '🇺🇸', type: 'internal', page: 'united states' },
            ],
          },
          website: {
            text: 'www.artsclubchicago.org',
            links: [{ text: 'www.artsclubchicago.org', type: 'external', site: 'http://www.artsclubchicago.org' }],
          },
        },
      },
      {
        clue: 0,
        json: true,
        expected: {
          name: { text: 'Arts Club of Chicago' },
          pushpin_map: { text: 'United States Chicago Near North Side' },
          coordinates: { text: '41.89327°N, -87.62251°W' },
          map_caption: {
            text: "Location within Chicago's Near North Side community area",
            links: [
              {
                text: 'Near North Side',
                type: 'internal',
                page: 'Near North Side, Chicago',
              },
              { text: 'community area', type: 'internal', page: 'Community areas of Chicago' },
            ],
          },
          image: { text: '20070701 Arts Club of Chicago.JPG' },
          established: { text: '1916 (current location since April 4, 1997)' },
          location: {
            text: '201 E. Ontario Street, Chicago, Illinois 60611 United States 🇺🇸',
            links: [
              { text: undefined, type: 'internal', page: 'Chicago' },
              {
                text: undefined,
                type: 'internal',
                page: 'Illinois',
              },
              { text: '🇺🇸', type: 'internal', page: 'united states' },
            ],
          },
          website: {
            text: 'www.artsclubchicago.org',
            links: [{ text: 'www.artsclubchicago.org', type: 'external', site: 'http://www.artsclubchicago.org' }],
          },
        },
      },
    ],
    sentence: [
      {
        clue: undefined,
        json: true,
        expected: {
          text:
            'Arts Club of Chicago is a private club located in the Near North Side community area of Chicago in Cook County, Illinois, United States, a block east of the Magnificent Mile, that exhibits international contemporary art.',
          links: [
            {
              text: 'Near North Side',
              type: 'internal',
              page: 'Near North Side, Chicago',
            },
            { text: 'community area', type: 'internal', page: 'Community areas of Chicago' },
            {
              text: undefined,
              type: 'internal',
              page: 'Chicago',
            },
            { text: undefined, type: 'internal', page: 'Cook County, Illinois' },
            {
              text: undefined,
              type: 'internal',
              page: 'Magnificent Mile',
            },
            { text: 'contemporary art', type: 'internal', page: 'contemporary art' },
          ],
          formatting: { bold: ['Arts Club of Chicago'] },
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          text:
            "It was founded in 1916, inspired by the success of the Art Institute of Chicago's handling of the Armory Show.",
          links: [
            { type: 'internal', page: 'Art Institute of Chicago' },
            {
              type: 'internal',
              page: 'Armory Show',
            },
          ],
        },
      },
    ],
    citation: [
      {
        clue: undefined,
        json: true,
        expected: {
          url: 'http://www.encyclopedia.chicagohistory.org/pages/70.html',
          author: 'Kruty, Paul',
          title: 'Armory Show of 1913',
          accessdate: 'June 27, 2007',
          year: '2005',
          publisher: 'Chicago Historical Society',
          work: 'The Electronic Encyclopedia of Chicago',
          template: 'citation',
          type: 'web',
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          url: 'http://www.encyclopedia.chicagohistory.org/pages/72.html',
          author: 'Warren, Lynne',
          title: 'Art',
          accessdate: 'June 27, 2007',
          year: '2005',
          publisher: 'Chicago Historical Society',
          work: 'The Electronic Encyclopedia of Chicago',
          template: 'citation',
          type: 'web',
        },
      },
    ],
    reference: [
      {
        clue: undefined,
        json: true,
        expected: {
          url: 'http://www.encyclopedia.chicagohistory.org/pages/70.html',
          author: 'Kruty, Paul',
          title: 'Armory Show of 1913',
          accessdate: 'June 27, 2007',
          year: '2005',
          publisher: 'Chicago Historical Society',
          work: 'The Electronic Encyclopedia of Chicago',
          template: 'citation',
          type: 'web',
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          url: 'http://www.encyclopedia.chicagohistory.org/pages/72.html',
          author: 'Warren, Lynne',
          title: 'Art',
          accessdate: 'June 27, 2007',
          year: '2005',
          publisher: 'Chicago Historical Society',
          work: 'The Electronic Encyclopedia of Chicago',
          template: 'citation',
          type: 'web',
        },
      },
    ],
    coordinate: [
      {
        clue: undefined,
        expected: { display: 'inline', template: 'coord', lat: 41.89327, lon: -87.62251 },
      },
      {
        clue: 1,
        expected: null,
      },
    ],
    table: [
      {
        clue: undefined,
        json: true,
        expected: [
          {
            Name: {
              text: 'Fine Arts Building',
              links: [{ text: 'Fine Arts Building', type: 'internal', page: 'Fine Arts Building (Chicago)' }],
            },
            'Street Address': {
              text: '401 S. Michigan Avenue',
              links: [{ text: 'Michigan Avenue', type: 'internal', page: 'Michigan Avenue (Chicago)' }],
            },
            Years: { text: '1916-18' },
            'Architect/Interior Designer': { text: 'Arthur Heun/Rue Winterbotham Carpenter' },
          },
          {
            Name: { text: '' },
            'Street Address': { text: '610 S. Michigan Avenue' },
            Years: { text: '1918-24' },
            'Architect/Interior Designer': { text: 'Arthur Heun/Rue Winterbotham Carpenter' },
          },
          {
            Name: {
              text: 'Wrigley Building (north tower)',
              links: [{ text: undefined, type: 'internal', page: 'Wrigley Building' }],
            },
            'Street Address': { text: '410 N. Michigan Avenue' },
            Years: { text: '1924-36' },
            'Architect/Interior Designer': { text: 'Arthur Heun/Rue Winterbotham Carpenter' },
          },
          {
            Name: {
              text: 'Wrigley Building (south tower)',
              links: [{ text: undefined, type: 'internal', page: 'Wrigley Building' }],
            },
            'Street Address': { text: '410 N. Michigan Avenue' },
            Years: { text: '1936-47' },
            'Architect/Interior Designer': { text: 'Arthur Heun/Elizabeth "Bobsy" Goodspeed Chapman' },
          },
          {
            Name: { text: '' },
            'Street Address': { text: '109 E. Ontario Street' },
            Years: { text: '1951-95' },
            'Architect/Interior Designer': {
              text: 'Ludwig Mies van der Rohe',
              links: [{ text: undefined, type: 'internal', page: 'Ludwig Mies van der Rohe' }],
            },
          },
          {
            Name: { text: '' },
            'Street Address': { text: '222 W. Superior Street' },
            Years: { text: '1995-97' },
            'Architect/Interior Designer': { text: '' },
          },
          {
            Name: { text: '' },
            'Street Address': { text: '201 E. Ontario Street' },
            Years: { text: '1997-' },
            'Architect/Interior Designer': { text: 'Vinci/Hamp Architects, Inc.' },
          },
        ],
      },
      {
        clue: 1,
        json: true,
        expected: [
          {
            Name: { text: 'Mrs. Robert McGann' },
            Years: { text: '1916-18' },
          },
          {
            Name: { text: 'Rue Winterbotham Carpenter' },
            Years: { text: '1918-31' },
          },
          {
            Name: { text: 'Elizabeth "Bobsy" Goodspeed' },
            Years: { text: '1932-40' },
          },
          {
            Name: { text: 'Mrs. William B. Hale' },
            Years: { text: '1940', number: 1940 },
          },
          {
            Name: { text: 'Rue Winterbotham Shaw' },
            Years: { text: '1940-79' },
          },
          {
            Name: { text: 'Mrs. Roger Barnett' },
            Years: { text: '1979', number: 1979 },
          },
          {
            Name: { text: 'James Phinney Baxter IV' },
            Years: { text: '1979-81' },
          },
          {
            Name: { text: 'Stanley M. Freehling' },
            Years: { text: '1981–2005' },
          },
          { Name: { text: 'Marilynn B. Alsdorf' }, Years: { text: '2006–2011' } },
          {
            Name: { text: 'Sophia Shaw' },
            Years: { text: '2011–2013' },
          },
          { Name: { text: 'Helyn Goldenberg' }, Years: { text: '2013–present' } },
        ],
      },
    ],
    list: [
      {
        clue: undefined,
        json: true,
        expected: [
          {
            text:
              'Red Petals, plate steel, steel wire, sheet aluminum, soft-iron bolts, and aluminum paint, 1942, by Alexander Calder',
            formatting: { italic: ['Red Petals'] },
          },
          {
            text:
              'Main Staircase for The Arts Club of Chicago, steel, travertine marble, 1948-1951, by Ludwig Mies van der Rohe',
            formatting: { italic: ['Main Staircase for The Arts Club of Chicago'] },
          },
          {
            text: 'Untitled, charcoal on ivory laid paper, 1922, by Henri Matisse',
            links: [{ text: 'charcoal', type: 'internal', page: 'charcoal' }],
            formatting: { italic: ['Untitled'] },
          },
          {
            text:
              'Personage and Birds in Front of the Sun (Personnage et oiseaux devant le soleil), ink and gouache on paper, 1942, by Joan Miró',
            formatting: {
              italic: ['Personage and Birds in Front of the Sun (Personnage et oiseaux devant le soleil)'],
            },
          },
          {
            text:
              'This Thing is Made to Perpetuate My Memory (Cette Chose est faite pour perpetuer mon souvenir), ink, gouache or watercolor, and silver and bronze paint on board, 1915, by Francis Picabia',
            formatting: {
              italic: [
                'This Thing is Made to Perpetuate My Memory (Cette Chose est faite pour perpetuer mon souvenir)',
              ],
            },
          },
          {
            text:
              'Head of a Woman (Tete de femme), red and black chalk with chalk wash on tan laid paper, laid down on lightweight Japanese paper, 1922, by Pablo Picasso',
            formatting: { italic: ['Head of a Woman (Tete de femme)'] },
          },
        ],
      },
      {
        clue: 1,
        json: true,
        expected: [
          {
            text:
              'Fitzgerald, Michael C. (1984). Making Modernism: Picasso and the Creation of the Market for Twentieth Century Art. Farrar Straus & Giroux. ISBN: 0-37410-611-8.',
            formatting: {
              italic: ['Making Modernism: Picasso and the Creation of the Market for Twentieth Century Art'],
            },
          },
          {
            text:
              'Shaw, Sophia (ed.) (1997). The Arts Club of Chicago: The Collection 1916-1996. The Arts Club of Chicago. ISBN: 0-96434-403-3.',
            links: [
              {
                text: 'The Arts Club of Chicago: The Collection 1916-1996',
                type: 'external',
                site:
                  'https://web.archive.org/web/20060918054331/http://www.press.uchicago.edu/cgi-bin/hfs.cgi/00/13456.ctl',
              },
            ],
            formatting: { italic: ['The Arts Club of Chicago: The Collection 1916-1996'] },
          },
          {
            text: 'Wells, James M. (1992). The Arts Club of Chicago: Seventy-Fifth Anniversary.',
            formatting: { italic: ['The Arts Club of Chicago: Seventy-Fifth Anniversary'] },
          },
        ],
      },
    ],
    link: [
      {
        clue: undefined,
        json: true,
        expected: {
          text: 'Near North Side',
          type: 'internal',
          page: 'Near North Side, Chicago',
        },
      },
      {
        clue: 1,
        json: true,
        expected: { text: 'community area', type: 'internal', page: 'Community areas of Chicago' },
      },
    ],
    image: [
      {
        clue: undefined,
        json: true,
        expected: {
          file: '20070701 Arts Club of Chicago.JPG',
          thumb: 'https://wikipedia.org/wiki/Special:Redirect/file/20070701_Arts_Club_of_Chicago.JPG?width=300',
          url: 'https://wikipedia.org/wiki/Special:Redirect/file/20070701_Arts_Club_of_Chicago.JPG',
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          file: 'File:20070711 Mies van der Rohe Staircase.JPG',
          thumb: 'https://wikipedia.org/wiki/Special:Redirect/file/20070711_Mies_van_der_Rohe_Staircase.JPG?width=300',
          url: 'https://wikipedia.org/wiki/Special:Redirect/file/20070711_Mies_van_der_Rohe_Staircase.JPG',
          caption: 'Mies van der Rohe staircase and Alexander Calder mobile',
          links: [],
        },
      },
    ],
    template: [
      { clue: undefined, json: true, expected: { date: 'August 2016', template: 'use mdy dates' } },
      { clue: 1, json: true, expected: { template: 'good article' } },
    ],
    category: [
      { clue: undefined, expected: '1916 establishments in Illinois' },
      { clue: 1, expected: 'Museums in Chicago' },
    ],
  }
  Object.keys(singels).forEach((fn) => {
    singels[fn].forEach((testCase) => {
      const result = testCase.json ? doc[fn](testCase.clue).json() : doc[fn](testCase.clue)
      t.deepEqual(
        JSON.stringify(result),
        JSON.stringify(testCase.expected),
        'expect doc.' + fn + '(' + testCase.clue + ') to equal ' + testCase.expected
      )
    })
  })
  t.end()
})
