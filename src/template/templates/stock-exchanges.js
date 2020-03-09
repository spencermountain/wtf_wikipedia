const parse = require('../_parsers/parse')

const codes = {
  adx: 'adx', //https://en.wikipedia.org/wiki/Template:Abu_Dhabi_Securities_Exchange
  aim: 'aim', //https://en.wikipedia.org/wiki/Template:Alternative_Investment_Market
  bvpasa: 'bvpasa', //https://en.wikipedia.org/wiki/Template:BVPASA
  asx: 'asx', //https://en.wikipedia.org/wiki/Template:Australian_Securities_Exchange
  athex: 'athex', //https://en.wikipedia.org/wiki/Template:Athens_Exchange
  bhse: 'bhse', //https://en.wikipedia.org/wiki/Template:Bahrain_Bourse
  bvb: 'bvb', //https://en.wikipedia.org/wiki/Template:Bucharest_Stock_Exchange
  bbv: 'bbv', //https://en.wikipedia.org/wiki/Template:BBV
  bsx: 'bsx', //https://en.wikipedia.org/wiki/Template:Bermuda_Stock_Exchange
  b3: 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  'bm&f': 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  'bm&f bovespa': 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  bwse: 'bwse', //https://en.wikipedia.org/wiki/Template:Botswana_Stock_Exchange
  'botswana stock exchange': 'botswana stock exchange', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  bse: 'bse', //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
  'bombay stock exchange': 'bombay stock exchange', //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
  bpse: 'bpse', //https://en.wikipedia.org/wiki/Template:Budapest_Stock_Exchange
  bcba: 'bcba', //https://en.wikipedia.org/wiki/Template:Buenos_Aires_Stock_Exchange
  'canadian securities exchange': 'canadian securities exchange', //https://en.wikipedia.org/wiki/Template:Canadian_Securities_Exchange
  bvc: 'bvc', //https://en.wikipedia.org/wiki/Template:Colombian_Securities_Exchange
  cse: 'cse', //https://en.wikipedia.org/wiki/Template:Chittagong_Stock_Exchange
  darse: 'darse', //https://en.wikipedia.org/wiki/Template:Dar_es_Salaam_Stock_Exchange
  dse: 'dse', //https://en.wikipedia.org/wiki/Template:Dhaka_Stock_Exchange
  dfm: 'dfm', //https://en.wikipedia.org/wiki/Template:Dubai_Financial_Market
  euronext: 'euronext', //https://en.wikipedia.org/wiki/Template:Euronext
  fwb: 'fwb', //https://en.wikipedia.org/wiki/Template:Frankfurt_Stock_Exchange
  fse: 'fse', //https://en.wikipedia.org/wiki/Template:Fukuoka_Stock_Exchange
  gse: 'gse', //https://en.wikipedia.org/wiki/Template:Ghana_Stock_Exchange
  gtsm: 'gtsm', //https://en.wikipedia.org/wiki/Template:Gre_Tai_Securities_Market
  sehk: 'sehk', //https://en.wikipedia.org/wiki/Template:Hong_Kong_Stock_Exchange
  idx: 'idx', //https://en.wikipedia.org/wiki/Template:Indonesia_Stock_Exchange
  nse: 'nse', //https://en.wikipedia.org/wiki/Template:National_Stock_Exchange_of_India
  ise: 'ise', //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
  isin: 'isin', //https://en.wikipedia.org/wiki/Template:ISIN
  bist: 'bist', //https://en.wikipedia.org/wiki/Template:Borsa_Istanbul
  bit: 'bit', //https://en.wikipedia.org/wiki/Template:Borsa_Italiana
  jasdaq: 'jasdaq', //https://en.wikipedia.org/wiki/Template:JASDAQ
  jse: 'jse', //https://en.wikipedia.org/wiki/Template:Johannesburg_Stock_Exchange
  kase: 'kase', //https://en.wikipedia.org/wiki/Template:Kazakhstan_Stock_Exchange
  krx: 'krx', //https://en.wikipedia.org/wiki/Template:Korea_Exchange
  bvl: 'bvl', //https://en.wikipedia.org/wiki/Template:Lima_Stock_Exchange
  lse: 'lse', //https://en.wikipedia.org/wiki/Template:London_Stock_Exchange
  luxse: 'luxse', //https://en.wikipedia.org/wiki/Template:Luxembourg_Stock_Exchange
  bmad: 'bmad', //https://en.wikipedia.org/wiki/Template:Bolsa_de_Madrid
  myx: 'myx', //https://en.wikipedia.org/wiki/Template:Bursa_Malaysia
  bmv: 'bmv', //https://en.wikipedia.org/wiki/Template:Mexican_Stock_Exchange
  mcx: 'mcx', //https://en.wikipedia.org/wiki/Template:Moscow_Exchange
  mutf: 'mutf', //https://en.wikipedia.org/wiki/Template:Mutual_fund
  nag: 'nag', //https://en.wikipedia.org/wiki/Template:Nagoya_Stock_Exchange
  kn: 'kn', //https://en.wikipedia.org/wiki/Template:Nairobi_Securities_Exchange
  'nasdaq dubai': 'nasdaq dubai', //https://en.wikipedia.org/wiki/Template:NASDAQ_Dubai
  nasdaq: 'nasdaq', //https://en.wikipedia.org/wiki/Template:NASDAQ
  neeq: 'neeq', //https://en.wikipedia.org/wiki/Template:NEEQ
  nepse: 'nepse', //https://en.wikipedia.org/wiki/Template:Nepal_Stock_Exchange
  nyse: 'nyse', //https://en.wikipedia.org/wiki/Template:New_York_Stock_Exchange
  nzx: 'nzx', //https://en.wikipedia.org/wiki/Template:New_Zealand_Exchange
  amex: 'amex', //https://en.wikipedia.org/wiki/Template:NYSE_American
  'nyse arca': 'nyse arca', //https://en.wikipedia.org/wiki/Template:NYSE_Arca
  omx: 'omx', //https://en.wikipedia.org/wiki/Template:OMX
  'omx baltic': 'omx baltic', //https://en.wikipedia.org/wiki/Template:OMX_Baltic
  ose: 'ose', //https://en.wikipedia.org/wiki/Template:Oslo_Stock_Exchange
  'otc pink': 'otc pink', //https://en.wikipedia.org/wiki/Template:OTC_Pink
  otcqb: 'otcqb', //https://en.wikipedia.org/wiki/Template:OTCQB
  otcqx: 'otcqx', //https://en.wikipedia.org/wiki/Template:OTCQX
  'philippine stock exchange': 'philippine stock exchange', //https://en.wikipedia.org/wiki/Template:Philippine_Stock_Exchange
  prse: 'prse', //https://en.wikipedia.org/wiki/Template:Prague_Stock_Exchange
  qe: 'qe', //https://en.wikipedia.org/wiki/Template:Qatar_Stock_Exchange
  bcs: 'bcs', //https://en.wikipedia.org/wiki/Template:Santiago_Stock_Exchange
  'saudi stock exchange': 'saudi stock exchange', //https://en.wikipedia.org/wiki/Template:Saudi_Stock_Exchange
  sgx: 'sgx', //https://en.wikipedia.org/wiki/Template:Singapore_Exchange
  sse: 'sse', //https://en.wikipedia.org/wiki/Template:Shanghai_Stock_Exchange
  szse: 'szse', //https://en.wikipedia.org/wiki/Template:Shenzhen_Stock_Exchange
  swx: 'swx', //https://en.wikipedia.org/wiki/Template:SIX_Swiss_Exchange
  set: 'set', //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand
  tase: 'tase', //https://en.wikipedia.org/wiki/Template:Tel_Aviv_Stock_Exchange
  tyo: 'tyo', //https://en.wikipedia.org/wiki/Template:Tokyo_Stock_Exchange
  tsx: 'tsx', //https://en.wikipedia.org/wiki/Template:Toronto_Stock_Exchange
  twse: 'twse', //https://en.wikipedia.org/wiki/Template:Taiwan_Stock_Exchange
  'tsx-v': 'tsx-v', //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
  tsxv: 'tsxv', //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
  nex: 'nex', //https://en.wikipedia.org/wiki/Template:TSXV_NEX
  ttse: 'ttse', //https://en.wikipedia.org/wiki/Template:Trinidad_and_Tobago_Stock_Exchange
  'pfts ukraine stock exchange': 'pfts ukraine stock exchange', //https://en.wikipedia.org/wiki/Template:PFTS_Ukraine_Stock_Exchange
  wse: 'wse', //https://en.wikipedia.org/wiki/Template:Warsaw_Stock_Exchange
  wbag: 'wbag', //https://en.wikipedia.org/wiki/Template:Wiener_B%C3%B6rse
  zse: 'zse', //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
  'zagreb stock exchange': 'zagreb stock exchange', //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
  'zimbabwe stock exchange': 'zimbabwe stock exchange' //https://en.wikipedia.org/wiki/Template:Zimbabwe_Stock_Exchange
}

const parseStockExchange = (tmpl, list) => {
  let o = parse(tmpl, ['ticketnumber', 'code'])
  list.push(o)
  let code = o.template || ''
  if (code === '') {
    code = o.code
  }
  code = (code || '').toLowerCase()
  let out = codes[code] || ''
  let str = out
  if (o.ticketnumber) {
    str = `${str}: ${o.ticketnumber}`
  }
  if (o.code && !codes[o.code.toLowerCase()]) {
    str += ' ' + o.code
  }
  return str
}

const currencies = {}
//the others fit the same pattern..
Object.keys(codes).forEach(k => {
  currencies[k] = parseStockExchange
})

module.exports = currencies
