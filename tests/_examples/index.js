import fs from 'node:fs'

const examples = {
  Radiohead: 'pages/Radiohead.txt',
  'Wimbledon-Championships': 'pages/Wimbledon-Championships.txt',
  Willow: 'pages/Willow.txt',
  '2008-British-Motorcycle-Grand-Prix': 'pages/2008-British-Motorcycle-Grand-Prix.txt',
  'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft':
    'pages/AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft.txt',
  'Al-Haytham': 'pages/Al-Haytham.txt',
  'Alanine-Oxo-Acid-Transaminase': 'pages/Alanine-Oxo-Acid-Transaminase.txt',
  'Alexander-Y-Type': 'pages/Alexander-Y-Type.txt',
  'Allen-R-Morris': 'pages/Allen-R-Morris.txt',
  'Alsea-Company': 'pages/Alsea-Company.txt',
  'Altimont-Butler': 'pages/Altimont-Butler.txt',
  Anarchism: 'pages/Anarchism.txt',
  'Antique-Band': 'pages/Antique-Band.txt',
  'Anwar-Kamal-Khan': 'pages/Anwar-Kamal-Khan.txt',
  'Arts-Club-Of-Chicago': 'pages/Arts-Club-Of-Chicago.txt',
  'Blue-Jays': 'misc/tables/Blue-Jays.txt',
  Barry: 'misc/disambigs/Barry.txt',
  Bodmin: 'pages/Bodmin.txt',
  'Bradley-Community-Lincoln-County-Wisconsin': 'pages/Bradley-Community-Lincoln-County-Wisconsin.txt',
  'British-Films': 'misc/lists/British-Films.txt',
  'Britt-Morgan': 'pages/Britt-Morgan.txt',
  'Canton-Of-Etaples': 'pages/Canton-Of-Etaples.txt',
  'Charlie-Milstead': 'pages/Charlie-Milstead.txt',
  'Chemical-Biology': 'pages/Chemical-Biology.txt',
  'Clint-Murchison-Sr': 'pages/Clint-Murchison-Sr.txt',
  'Damphu-Drum': 'pages/Damphu-Drum.txt',
  'Direct-Representation': 'pages/Direct-Representation.txt',
  'Dollar-Point-California': 'pages/Dollar-Point-California.txt',
  'Earthquakes-List': 'misc/lists/Earthquakes-List.txt',
  'Elizabeth-Gilbert': 'pages/Elizabeth-Gilbert.txt',
  'Ewelina-Setowska-Dryk': 'pages/Ewelina-Setowska-Dryk.txt',
  'Goryeo-Ware': 'pages/Goryeo-Ware.txt',
  'Gregory-Serper': 'pages/Gregory-Serper.txt',
  'Harry-McPherson': 'pages/Harry-McPherson.txt',
  'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales':
    'pages/History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales.txt',
  'Irina-Saratovtseva': 'pages/Irina-Saratovtseva.txt',
  'Jerry-Mumphrey': 'pages/Jerry-Mumphrey.txt',
  'Jodie-Emery': 'pages/Jodie-Emery.txt',
  'Julia-Kristeva': 'pages/Julia-Kristeva.txt',
  'K-Nicole-Mitchell': 'pages/K-Nicole-Mitchell.txt',
  'Magnar-Saetre': 'pages/Magnar-Saetre.txt',
  'Neil-McLean-Saxophonist': 'pages/Neil-McLean-Saxophonist.txt',
  RNDIS: 'pages/RNDIS.txt',
  'RNLI-Stations': 'pages/RNLI-Stations.txt',
  'Raith-Rovers': 'pages/Raith-Rovers.txt',
  Redirect: 'misc/redirects/Redirect.txt',
  'Remote-Application-Programming-Interface': 'pages/Remote-Application-Programming-Interface.txt',
  'Remote-Data-Objects': 'pages/Remote-Data-Objects.txt',
  'Remote-Data-Services': 'pages/Remote-Data-Services.txt',
  'Routing-And-Remote-Access-Service': 'pages/Routing-And-Remote-Access-Service.txt',
  'Royal-Cinema': 'pages/Royal-Cinema.txt',
  'Runtime-Callable-Wrapper': 'pages/Runtime-Callable-Wrapper.txt',
  'Senate-Of-Pakistan': 'pages/Senate-Of-Pakistan.txt',
  'Terrence-Murphy-American-Football': 'pages/Terrence-Murphy-American-Football.txt',
  'Teymanak-E-Olya': 'pages/Teymanak-E-Olya.txt',
  'The-Atlas-Newspaper': 'pages/The-Atlas-Newspaper.txt',
  'The-Field-Of-Waterloo': 'pages/The-Field-Of-Waterloo.txt',
  Toronto: 'pages/Toronto.txt',
  'Toronto-Star': 'pages/Toronto-Star.txt',
  'Tour-EP-Band-Of-Horses-EP': 'pages/Tour-EP-Band-Of-Horses-EP.txt',
  'United-Kingdom': 'pages/United-Kingdom.txt',
  'University-Of-Nevada-Reno-Arboretum': 'pages/University-Of-Nevada-Reno-Arboretum.txt',
}

const allPages = Object.keys(examples)

const readPage = (page) => {
  if (!Object.hasOwn(examples, page)) {
    throw new Error(`Unknown cached page: ${page}`)
  }
  return fs.readFileSync(new URL(examples[page], import.meta.url), 'utf8')
}

export { allPages, readPage }
