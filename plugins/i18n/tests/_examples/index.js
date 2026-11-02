import fs from 'node:fs'

// cached non-english wikipedia pages, for example-article tests
const examples = {
  'Groot-Brittanje': './af/Groot-Brittanje.txt',
  'Mark-Behr': './af/Mark-Behr.txt',
  'Radiohead-Ar': './ar/Radiohead.txt',
  'Wimbledon-Championships-Ar': './ar/Wimbledon-Championships.txt',
  'Willow-Ar': './ar/Willow.txt',
  BBDO: './de/BBDO.txt',
  Bazooka: './de/Bazooka.txt',
  'HMS-Irresistible': './de/HMS-Irresistible.txt',
  Keilwelle: './de/Keilwelle.txt',
  'Liste-Der-Argentinischen-Botschafter-In-Chile': './de/Liste-Der-Argentinischen-Botschafter-In-Chile.txt',
  'Maurische-Netzwuhle': './de/Maurische-Netzwuhle.txt',
  'Mozilla-Firefox': './de/Mozilla-Firefox.txt',
  'Sara-C-Bisel': './de/Sara-C-Bisel.txt',
  'Wendy-Mogel': './de/Wendy-Mogel.txt',
  'Radiohead-Fr': './fr/Radiohead.txt',
  'Wimbledon-Championships-Fr': './fr/Wimbledon-Championships.txt',
  'Willow-Fr': './fr/Willow.txt',
  'Radiohead-It': './it/Radiohead.txt',
  'Wimbledon-Championships-It': './it/Wimbledon-Championships.txt',
  'Willow-It': './it/Willow.txt',
  'Radiohead-Ja': './ja/Radiohead.txt',
  'Wimbledon-Championships-Ja': './ja/Wimbledon-Championships.txt',
  'Willow-Ja': './ja/Willow.txt',
  Statoil: './nn/Statoil.txt',
  'Radiohead-Ru': './ru/Radiohead.txt',
  'Wimbledon-Championships-Ru': './ru/Wimbledon-Championships.txt',
  'Willow-Ru': './ru/Willow.txt',
  'Toronto-Sv': './sv/Toronto.txt',
  'The-Starry-Night-Sv': './sv/The-Starry-Night.txt',
  'Tennis-Sw': './sw/Tennis.txt',
  'Taarab-Sw': './sw/Taarab.txt',
  'Willow-Sw': './sw/Willow.txt',
  'Toronto-Vi': './vi/Toronto.txt',
  'The-Starry-Night-Vi': './vi/The-Starry-Night.txt',
  'Toronto-Zh': './zh/Toronto.txt',
  'Dogs-Playing-Poker-Zh': './zh/Dogs-Playing-Poker.txt',
}

const allPages = Object.keys(examples)

const readPage = (page) => {
  if (!Object.hasOwn(examples, page)) {
    throw new Error(`Unknown cached page: ${page}`)
  }
  return fs.readFileSync(new URL(examples[page], import.meta.url), 'utf8')
}

export { allPages, readPage }
