import fs from 'node:fs'

// cached non-english wikipedia pages, for example-article tests
const examples = {
  'Groot-Brittanje': 'pages/af/Groot-Brittanje.txt',
  'Mark-Behr': 'pages/af/Mark-Behr.txt',
  'Radiohead-Ar': 'pages/ar/Radiohead.txt',
  'Wimbledon-Championships-Ar': 'pages/ar/Wimbledon-Championships.txt',
  'Willow-Ar': 'pages/ar/Willow.txt',
  BBDO: 'pages/de/BBDO.txt',
  Bazooka: 'pages/de/Bazooka.txt',
  'HMS-Irresistible': 'pages/de/HMS-Irresistible.txt',
  Keilwelle: 'pages/de/Keilwelle.txt',
  'Liste-Der-Argentinischen-Botschafter-In-Chile': 'pages/de/Liste-Der-Argentinischen-Botschafter-In-Chile.txt',
  'Maurische-Netzwuhle': 'pages/de/Maurische-Netzwuhle.txt',
  'Mozilla-Firefox': 'pages/de/Mozilla-Firefox.txt',
  'Sara-C-Bisel': 'pages/de/Sara-C-Bisel.txt',
  'Wendy-Mogel': 'pages/de/Wendy-Mogel.txt',
  'Radiohead-Fr': 'pages/fr/Radiohead.txt',
  'Wimbledon-Championships-Fr': 'pages/fr/Wimbledon-Championships.txt',
  'Willow-Fr': 'pages/fr/Willow.txt',
  'Radiohead-It': 'pages/it/Radiohead.txt',
  'Wimbledon-Championships-It': 'pages/it/Wimbledon-Championships.txt',
  'Willow-It': 'pages/it/Willow.txt',
  'Radiohead-Ja': 'pages/ja/Radiohead.txt',
  'Wimbledon-Championships-Ja': 'pages/ja/Wimbledon-Championships.txt',
  'Willow-Ja': 'pages/ja/Willow.txt',
  Statoil: 'pages/nn/Statoil.txt',
  'Radiohead-Ru': 'pages/ru/Radiohead.txt',
  'Wimbledon-Championships-Ru': 'pages/ru/Wimbledon-Championships.txt',
  'Willow-Ru': 'pages/ru/Willow.txt',
  'Toronto-Sv': 'pages/sv/Toronto.txt',
  'The-Starry-Night-Sv': 'pages/sv/The-Starry-Night.txt',
  'Tennis-Sw': 'pages/sw/Tennis.txt',
  'Taarab-Sw': 'pages/sw/Taarab.txt',
  'Willow-Sw': 'pages/sw/Willow.txt',
  'Toronto-Vi': 'pages/vi/Toronto.txt',
  'The-Starry-Night-Vi': 'pages/vi/The-Starry-Night.txt',
  'Toronto-Zh': 'pages/zh/Toronto.txt',
  'Dogs-Playing-Poker-Zh': 'pages/zh/Dogs-Playing-Poker.txt',
}

const allPages = Object.keys(examples)

const readPage = (page) => {
  if (!Object.hasOwn(examples, page)) {
    throw new Error(`Unknown cached page: ${page}`)
  }
  return fs.readFileSync(new URL(examples[page], import.meta.url), 'utf8')
}

export { allPages, readPage }
