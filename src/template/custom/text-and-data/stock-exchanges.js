import parse from '../../parse/toJSON/index.js'

const codes = {
  adx: 'adx', //https://en.wikipedia.org/wiki/Template:Abu_Dhabi_Securities_Exchange
  aim: 'aim', //https://en.wikipedia.org/wiki/Template:Alternative_Investment_Market
  amex: 'amex', //https://en.wikipedia.org/wiki/Template:NYSE_American
  asx: 'asx', //https://en.wikipedia.org/wiki/Template:Australian_Securities_Exchange
  athex: 'athex', //https://en.wikipedia.org/wiki/Template:Athens_Exchange
  b3: 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa (redirects to B3 (stock exchange))
  'B3 (stock exchange)': 'B3 (stock exchange)', //https://en.wikipedia.org/wiki/Template:B3_(stock_exchange)
  barbadosse: 'barbadosse', //https://en.wikipedia.org/wiki/Template:Barbados_Stock_Exchange
  bbv: 'bbv', //https://en.wikipedia.org/wiki/Template:La_Paz_Stock_Exchange
  bcba: 'bcba', //https://en.wikipedia.org/wiki/Template:Buenos_Aires_Stock_Exchange
  bcs: 'bcs', //https://en.wikipedia.org/wiki/Template:Santiago_Stock_Exchange
  bhse: 'bhse', //https://en.wikipedia.org/wiki/Template:Bahrain_Bourse
  bist: 'bist', //https://en.wikipedia.org/wiki/Template:Borsa_Istanbul
  bit: 'bit', //https://en.wikipedia.org/wiki/Template:Borsa_Italiana
  'bm&f bovespa': 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  'bm&f': 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  bmad: 'bmad', //https://en.wikipedia.org/wiki/Template:Bolsa_de_Madrid
  bmv: 'bmv', //https://en.wikipedia.org/wiki/Template:Mexican_Stock_Exchange
  'bombay stock exchange': 'bombay stock exchange', //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
  'botswana stock exchange': 'botswana stock exchange', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  bpse: 'bpse', //https://en.wikipedia.org/wiki/Template:Budapest_Stock_Exchange
  bse: 'bse', //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
  bsx: 'bsx', //https://en.wikipedia.org/wiki/Template:Bermuda_Stock_Exchange
  bvb: 'bvb', //https://en.wikipedia.org/wiki/Template:Bucharest_Stock_Exchange
  bvc: 'bvc', //https://en.wikipedia.org/wiki/Template:Colombian_Securities_Exchange
  bvl: 'bvl', //https://en.wikipedia.org/wiki/Template:Lima_Stock_Exchange
  bvpasa: 'bvpasa', //https://en.wikipedia.org/wiki/Template:BVPASA
  bwse: 'bwse', //https://en.wikipedia.org/wiki/Template:Botswana_Stock_Exchange
  'canadian securities exchange': 'canadian securities exchange', //https://en.wikipedia.org/wiki/Template:Canadian_Securities_Exchange
  cse: 'cse', //https://en.wikipedia.org/wiki/Template:Chittagong_Stock_Exchange
  darse: 'darse', //https://en.wikipedia.org/wiki/Template:Dar_es_Salaam_Stock_Exchange
  dfm: 'dfm', //https://en.wikipedia.org/wiki/Template:Dubai_Financial_Market
  dse: 'dse', //https://en.wikipedia.org/wiki/Template:Dhaka_Stock_Exchange
  euronext: 'euronext', //https://en.wikipedia.org/wiki/Template:Euronext
  euronextparis: 'euronextparis', //https://en.wikipedia.org/wiki/Template:EuronextParis
  fse: 'fse', //https://en.wikipedia.org/wiki/Template:Fukuoka_Stock_Exchange
  fwb: 'fwb', //https://en.wikipedia.org/wiki/Template:Frankfurt_Stock_Exchange
  gse: 'gse', //https://en.wikipedia.org/wiki/Template:Ghana_Stock_Exchange
  gtsm: 'gtsm', //https://en.wikipedia.org/wiki/Template:Gre_Tai_Securities_Market
  idx: 'idx', //https://en.wikipedia.org/wiki/Template:Indonesia_Stock_Exchange
  ise: 'ise', //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
  iseq: 'iseq', //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
  isin: 'isin', //https://en.wikipedia.org/wiki/Template:ISIN
  jasdaq: 'jasdaq', //https://en.wikipedia.org/wiki/Template:JASDAQ
  jse: 'jse', //https://en.wikipedia.org/wiki/Template:Johannesburg_Stock_Exchange
  kase: 'kase', //https://en.wikipedia.org/wiki/Template:Kazakhstan_Stock_Exchange
  kn: 'kn', //https://en.wikipedia.org/wiki/Template:Nairobi_Securities_Exchange
  krx: 'krx', //https://en.wikipedia.org/wiki/Template:Korea_Exchange
  lse: 'lse', //https://en.wikipedia.org/wiki/Template:London_Stock_Exchange
  luxse: 'luxse', //https://en.wikipedia.org/wiki/Template:Luxembourg_Stock_Exchange
  'malta stock exchange': 'malta stock exchange', //https://en.wikipedia.org/wiki/Template:Malta_Stock_Exchange
  mai: 'mai', //https://en.wikipedia.org/wiki/Template:Market_for_Alternative_Investment
  mcx: 'mcx', //https://en.wikipedia.org/wiki/Template:Moscow_Exchange
  mutf: 'mutf', //https://en.wikipedia.org/wiki/Template:Mutual_fund
  myx: 'myx', //https://en.wikipedia.org/wiki/Template:Bursa_Malaysia
  nag: 'nag', //https://en.wikipedia.org/wiki/Template:Nagoya_Stock_Exchange
  'nasdaq dubai': 'nasdaq dubai', //https://en.wikipedia.org/wiki/Template:NASDAQ_Dubai
  nasdaq: 'nasdaq', //https://en.wikipedia.org/wiki/Template:NASDAQ
  neeq: 'neeq', //https://en.wikipedia.org/wiki/Template:NEEQ
  nepse: 'nepse', //https://en.wikipedia.org/wiki/Template:Nepal_Stock_Exchange
  nex: 'nex', //https://en.wikipedia.org/wiki/Template:TSXV_NEX
  nse: 'nse', //https://en.wikipedia.org/wiki/Template:National_Stock_Exchange_of_India
  newconnect: 'newconnect', //https://en.wikipedia.org/wiki/Template:NewConnect
  'nyse arca': 'nyse arca', //https://en.wikipedia.org/wiki/Template:NYSE_Arca
  nyse: 'nyse', //https://en.wikipedia.org/wiki/Template:New_York_Stock_Exchange
  nzx: 'nzx', //https://en.wikipedia.org/wiki/Template:New_Zealand_Exchange
  'omx baltic': 'omx baltic', //https://en.wikipedia.org/wiki/Template:OMX_Baltic
  omx: 'omx', //https://en.wikipedia.org/wiki/Template:OMX
  ose: 'ose', //https://en.wikipedia.org/wiki/Template:Oslo_Stock_Exchange
  'otc expert': 'otc expert', //https://en.wikipedia.org/wiki/Template:OTC_Expert
  'otc grey': 'otc grey', //https://en.wikipedia.org/wiki/template:grey_market
  'otc pink': 'otc pink', //https://en.wikipedia.org/wiki/Template:OTC_Pink
  otcqb: 'otcqb', //https://en.wikipedia.org/wiki/Template:OTCQB
  otcqx: 'otcqx', //https://en.wikipedia.org/wiki/Template:OTCQX
  'pfts ukraine stock exchange': 'pfts ukraine stock exchange', //https://en.wikipedia.org/wiki/Template:PFTS_Ukraine_Stock_Exchange
  'philippine stock exchange': 'philippine stock exchange', //https://en.wikipedia.org/wiki/Template:Philippine_Stock_Exchange
  prse: 'prse', //https://en.wikipedia.org/wiki/Template:Prague_Stock_Exchange
  psx: 'psx', //https://en.wikipedia.org/wiki/Template:Pakistan_Stock_Exchange
  karse: 'karse', //https://en.wikipedia.org/w/index.php?title=Template:Karse&redirect=no (redirects to psx)
  qe: 'qe', //https://en.wikipedia.org/wiki/Template:Qatar_Stock_Exchange
  'saudi stock exchange': 'saudi stock exchange', //https://en.wikipedia.org/wiki/Template:Saudi_Stock_Exchange
  sehk: 'sehk', //https://en.wikipedia.org/wiki/Template:Hong_Kong_Stock_Exchange
  'Stock Exchange of Thailand': 'Stock Exchange of Thailand', //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand (alternative for SET)
  set: 'set', //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand
  sgx: 'sgx', //https://en.wikipedia.org/wiki/Template:Singapore_Exchange
  sse: 'sse', //https://en.wikipedia.org/wiki/Template:Shanghai_Stock_Exchange
  swx: 'swx', //https://en.wikipedia.org/wiki/Template:SIX_Swiss_Exchange
  szse: 'szse', //https://en.wikipedia.org/wiki/Template:Shenzhen_Stock_Exchange
  tase: 'tase', //https://en.wikipedia.org/wiki/Template:Tel_Aviv_Stock_Exchange
  'tsx-v': 'tsx-v', //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
  tsx: 'tsx', //https://en.wikipedia.org/wiki/Template:Toronto_Stock_Exchange
  tsxv: 'tsxv', //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
  ttse: 'ttse', //https://en.wikipedia.org/wiki/Template:Trinidad_and_Tobago_Stock_Exchange
  twse: 'twse', //https://en.wikipedia.org/wiki/Template:Taiwan_Stock_Exchange
  tyo: 'tyo', //https://en.wikipedia.org/wiki/Template:Tokyo_Stock_Exchange
  wbag: 'wbag', //https://en.wikipedia.org/wiki/Template:Wiener_B%C3%B6rse
  wse: 'wse', //https://en.wikipedia.org/wiki/Template:Warsaw_Stock_Exchange
  'zagreb stock exchange': 'zagreb stock exchange', //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
  'zimbabwe stock exchange': 'zimbabwe stock exchange', //https://en.wikipedia.org/wiki/Template:Zimbabwe_Stock_Exchange
  zse: 'zse', //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
}

const parseStockExchange = (tmpl, list) => {
  let o = parse(tmpl, ['ticketnumber', 'code'])
  list.push(o)
  let code = o.template || ''
  if (code === '') {
    code = o.code
  }
  code = (code || '').toLowerCase()
  let str = codes[code] || ''
  if (o.ticketnumber) {
    str = `${str}: ${o.ticketnumber}`
  }
  if (o.code && !codes[o.code.toLowerCase()]) {
    str += ' ' + o.code
  }
  return str
}

const exchanges = {}
//the others fit the same pattern..
Object.keys(codes).forEach((k) => {
  exchanges[k] = parseStockExchange
})

export default exchanges
