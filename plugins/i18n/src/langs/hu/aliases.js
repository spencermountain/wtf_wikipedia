// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// hungarian template names → the core template they resolve to
const aliases = {
  'bővebben': 'main',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'coor d': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'fő': 'main',
  'főcikk': 'main',
  'főszócikk': 'main',
  'hivatkozás/könyv': 'cite book',
  'kategóriaszócikk': 'main',
  'katsz': 'main',
  'koord': 'coord',
  'közvagyonkat': 'commons cat',
  'portál': 'portal',
  'refs': 'reflist',
  'szám': 'formatnum',
  'zászló': 'flag',
  'zászló2': 'flag',
  'zászlóikon': 'flagicon',
  'életkor-élő-dátummal': 'birth date and age',
}

export default aliases
