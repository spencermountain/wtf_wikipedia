import fs from 'node:fs'

const examples = {
  '2008-British-Motorcycle-Grand-Prix': 'pages/en/2008-British-Motorcycle-Grand-Prix.txt',
  'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft':
    'pages/en/AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft.txt',
  'Al-Haytham': 'pages/en/Al-Haytham.txt',
  'Alanine-Oxo-Acid-Transaminase': 'pages/en/Alanine-Oxo-Acid-Transaminase.txt',
  'Alexander-Y-Type': 'pages/en/Alexander-Y-Type.txt',
  'Allen-R-Morris': 'pages/en/Allen-R-Morris.txt',
  'Alsea-Company': 'pages/en/Alsea-Company.txt',
  'Altimont-Butler': 'pages/en/Altimont-Butler.txt',
  Anarchism: 'pages/en/Anarchism.txt',
  'Antique-Band': 'pages/en/Antique-Band.txt',
  'Anwar-Kamal-Khan': 'pages/en/Anwar-Kamal-Khan.txt',
  'Arts-Club-Of-Chicago': 'pages/en/Arts-Club-Of-Chicago.txt',
  BBDO: 'pages/de/BBDO.txt',
  Bazooka: 'pages/de/Bazooka.txt',
  'Blue-Jays': 'misc/tables/Blue-Jays.txt',
  Bodmin: 'pages/en/Bodmin.txt',
  'Bradley-Community-Lincoln-County-Wisconsin': 'pages/en/Bradley-Community-Lincoln-County-Wisconsin.txt',
  'British-Films': 'misc/lists/British-Films.txt',
  'Britt-Morgan': 'pages/en/Britt-Morgan.txt',
  'Canton-Of-Etaples': 'pages/en/Canton-Of-Etaples.txt',
  'Charlie-Milstead': 'pages/en/Charlie-Milstead.txt',
  'Chemical-Biology': 'pages/en/Chemical-Biology.txt',
  'Clint-Murchison-Sr': 'pages/en/Clint-Murchison-Sr.txt',
  'Damphu-Drum': 'pages/en/Damphu-Drum.txt',
  'Direct-Representation': 'pages/en/Direct-Representation.txt',
  'Dollar-Point-California': 'pages/en/Dollar-Point-California.txt',
  'Earthquakes-List': 'misc/lists/Earthquakes-List.txt',
  'Elizabeth-Gilbert': 'pages/en/Elizabeth-Gilbert.txt',
  'Ewelina-Setowska-Dryk': 'pages/en/Ewelina-Setowska-Dryk.txt',
  'Goryeo-Ware': 'pages/en/Goryeo-Ware.txt',
  'Gregory-Serper': 'pages/en/Gregory-Serper.txt',
  'Groot-Brittanje': 'pages/af/Groot-Brittanje.txt',
  'HMS-Irresistible': 'pages/de/HMS-Irresistible.txt',
  'Harry-McPherson': 'pages/en/Harry-McPherson.txt',
  'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales':
    'pages/en/History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales.txt',
  'Irina-Saratovtseva': 'pages/en/Irina-Saratovtseva.txt',
  'Jerry-Mumphrey': 'pages/en/Jerry-Mumphrey.txt',
  'Jodie-Emery': 'pages/en/Jodie-Emery.txt',
  'Julia-Kristeva': 'pages/en/Julia-Kristeva.txt',
  'K-Nicole-Mitchell': 'pages/en/K-Nicole-Mitchell.txt',
  Keilwelle: 'pages/de/Keilwelle.txt',
  'Liste-Der-Argentinischen-Botschafter-In-Chile': 'pages/de/Liste-Der-Argentinischen-Botschafter-In-Chile.txt',
  'Magnar-Saetre': 'pages/en/Magnar-Saetre.txt',
  'Mark-Behr': 'pages/af/Mark-Behr.txt',
  'Maurische-Netzwuhle': 'pages/de/Maurische-Netzwuhle.txt',
  'Mozilla-Firefox': 'pages/de/Mozilla-Firefox.txt',
  'Neil-McLean-Saxophonist': 'pages/en/Neil-McLean-Saxophonist.txt',
  RNDIS: 'pages/en/RNDIS.txt',
  'RNLI-Stations': 'pages/en/RNLI-Stations.txt',
  'Raith-Rovers': 'pages/en/Raith-Rovers.txt',
  Redirect: 'misc/redirects/Redirect.txt',
  'Remote-Application-Programming-Interface': 'pages/en/Remote-Application-Programming-Interface.txt',
  'Remote-Data-Objects': 'pages/en/Remote-Data-Objects.txt',
  'Remote-Data-Services': 'pages/en/Remote-Data-Services.txt',
  'Routing-And-Remote-Access-Service': 'pages/en/Routing-And-Remote-Access-Service.txt',
  'Royal-Cinema': 'pages/en/Royal-Cinema.txt',
  'Runtime-Callable-Wrapper': 'pages/en/Runtime-Callable-Wrapper.txt',
  'Sara-C-Bisel': 'pages/de/Sara-C-Bisel.txt',
  'Senate-Of-Pakistan': 'pages/en/Senate-Of-Pakistan.txt',
  Statoil: 'pages/nn/Statoil.txt',
  'Terrence-Murphy-American-Football': 'pages/en/Terrence-Murphy-American-Football.txt',
  'Teymanak-E-Olya': 'pages/en/Teymanak-E-Olya.txt',
  'The-Atlas-Newspaper': 'pages/en/The-Atlas-Newspaper.txt',
  'The-Field-Of-Waterloo': 'pages/en/The-Field-Of-Waterloo.txt',
  Toronto: 'pages/en/Toronto.txt',
  'Toronto-Star': 'pages/en/Toronto-Star.txt',
  'Tour-EP-Band-Of-Horses-EP': 'pages/en/Tour-EP-Band-Of-Horses-EP.txt',
  'United-Kingdom': 'pages/en/United-Kingdom.txt',
  'University-Of-Nevada-Reno-Arboretum': 'pages/en/University-Of-Nevada-Reno-Arboretum.txt',
  'Wendy-Mogel': 'pages/de/Wendy-Mogel.txt',
}

const allPages = Object.keys(examples)

const readPage = (page) => {
  if (!Object.hasOwn(examples, page)) {
    throw new Error(`Unknown cached page: ${page}`)
  }
  return fs.readFileSync(new URL(examples[page], import.meta.url), 'utf8')
}

export { allPages, readPage }
