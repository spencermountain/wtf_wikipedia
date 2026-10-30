// IOC and FIFA country codes that differ from ISO 3166-1 alpha-3 - https://en.wikipedia.org/wiki/List_of_IOC_country_codes
const aliases: Record<string, string> = {
  alg: 'dza', // Algeria
  ang: 'ago', // Angola
  ant: 'atg', // Antigua and Barbuda
  aru: 'abw', // Aruba
  bah: 'bhs', // Bahamas
  ban: 'bgd', // Bangladesh
  bar: 'brb', // Barbados
  ber: 'bmu', // Bermuda
  bhu: 'btn', // Bhutan
  bot: 'bwa', // Botswana
  bru: 'brn', // Brunei
  bul: 'bgr', // Bulgaria
  bur: 'bfa', // Burkina Faso
  cam: 'khm', // Cambodia
  cay: 'cym', // Cayman Islands
  cgo: 'cog', // Congo
  cha: 'tcd', // Chad
  chi: 'chl', // Chile
  crc: 'cri', // Costa Rica
  cro: 'hrv', // Croatia
  den: 'dnk', // Denmark
  esa: 'slv', // El Salvador
  fij: 'fji', // Fiji
  gam: 'gmb', // Gambia
  gbs: 'gnb', // Guinea-Bissau
  geq: 'gnq', // Equatorial Guinea
  ger: 'deu', // Germany
  gre: 'grc', // Greece
  gua: 'gtm', // Guatemala
  gui: 'gin', // Guinea
  hai: 'hti', // Haiti
  hon: 'hnd', // Honduras
  ina: 'idn', // Indonesia
  iri: 'irn', // Iran
  isv: 'vir', // US Virgin Islands
  ivb: 'vgb', // British Virgin Islands
  ksa: 'sau', // Saudi Arabia
  kuw: 'kwt', // Kuwait
  lat: 'lva', // Latvia
  lba: 'lby', // Libya
  les: 'lso', // Lesotho
  lib: 'lbn', // Lebanon
  mad: 'mdg', // Madagascar
  mas: 'mys', // Malaysia
  maw: 'mwi', // Malawi
  mgl: 'mng', // Mongolia
  mon: 'mco', // Monaco
  mri: 'mus', // Mauritius
  mtn: 'mrt', // Mauritania
  mya: 'mmr', // Myanmar
  ned: 'nld', // Netherlands
  nep: 'npl', // Nepal
  nca: 'nic', // Nicaragua
  ngr: 'nga', // Nigeria
  nig: 'ner', // Niger
  oma: 'omn', // Oman
  par: 'pry', // Paraguay
  phi: 'phl', // Philippines
  ple: 'pse', // Palestine
  por: 'prt', // Portugal
  pur: 'pri', // Puerto Rico
  rsa: 'zaf', // South Africa
  sam: 'wsm', // Samoa
  sey: 'syc', // Seychelles
  sin: 'sgp', // Singapore
  sle: 'sle', // Sierra Leone
  slo: 'svn', // Slovenia
  sol: 'slb', // Solomon Islands
  sri: 'lka', // Sri Lanka
  sud: 'sdn', // Sudan
  sui: 'che', // Switzerland
  tan: 'tza', // Tanzania
  tga: 'ton', // Tonga
  tog: 'tgo', // Togo
  tpe: 'twn', // Chinese Taipei
  tri: 'tto', // Trinidad and Tobago
  uae: 'are', // United Arab Emirates
  uru: 'ury', // Uruguay
  van: 'vut', // Vanuatu
  vie: 'vnm', // Vietnam
  vin: 'vct', // Saint Vincent and the Grenadines
  zam: 'zmb', // Zambia
  zim: 'zwe', // Zimbabwe
  sco: 'sct', // Scotland
  // countries that no longer exist, mapped to their successors' flags
  urs: 'rus', // Soviet Union
  tch: 'cze', // Czechoslovakia
  frg: 'deu', // West Germany
  gdr: 'deu', // East Germany
  yug: 'srb', // Yugoslavia
}
export default aliases
