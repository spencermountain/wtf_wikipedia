import defaultParse from '../../parse/templates/parse/toJSON/text.ts'

const superscript = (str = '') => {
  const sup = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', '+': '⁺', '−': '⁻' }
  return String(str).split('').map((c) => sup[c] || c).join('')
}
const subscript = (str = '') => {
  const sub = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', '-': '₋', '+': '₊' }
  return String(str).split('').map((c) => sub[c] || c).join('')
}

// https://en.wikipedia.org/wiki/Template:Roman - {{Roman|12}} → XII
const romanNumerals: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]
const roman = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['num'])
  let n = parseInt(obj.num, 10)
  if (!Number.isFinite(n) || n <= 0 || n >= 5000) {
    return { data: null, replacement: obj.num || '' }
  }
  let str = ''
  romanNumerals.forEach(([val, sym]) => {
    while (n >= val) {
      str += sym
      n -= val
    }
  })
  return { data: null, replacement: str }
}

// https://en.wikipedia.org/wiki/Template:Binary - {{binary|5}} → 101
const binary = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['num', 'digits'])
  let n = parseInt(obj.num, 10)
  if (!Number.isFinite(n) || n < 0) {
    return { data: null, replacement: obj.num || '' }
  }
  let str = n.toString(2)
  if (obj.digits) {
    str = str.padStart(Number(obj.digits) || 0, '0')
  }
  return { data: null, replacement: str }
}

// https://en.wikipedia.org/wiki/Template:Nts - a sortable number, {{nts|1234}} → 1,234
const nts = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['num'])
  let str = String(obj.num || '').replace(/,/g, '')
  if (!/^[-−+]?\d+(\.\d+)?$/.test(str)) {
    return { data: null, replacement: `${obj.prefix || ''}${obj.num || ''}${obj.suffix || ''}` }
  }
  let [int, dec] = str.replace('−', '-').split('.')
  int = Number(int).toLocaleString('en-US')
  let out = dec !== undefined ? `${int}.${dec}` : int
  return { data: null, replacement: `${obj.prefix || ''}${out}${obj.suffix || ''}` }
}

// https://en.wikipedia.org/wiki/Template:Percent - {{percent|10|100}} → 10%
const percent = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['num', 'denom', 'decimals'])
  let n = Number(obj.num) / Number(obj.denom)
  if (!Number.isFinite(n)) {
    return { data: null, replacement: '' }
  }
  n *= 100
  let dec = Number.isInteger(n) ? 0 : 1
  if (obj.decimals !== undefined) {
    dec = Number(obj.decimals)
  }
  return { data: null, replacement: `${n.toFixed(dec)}%` }
}

// scientific notation
// {{e|5}} → ×10⁵,  {{10^|5}} → 10⁵,  {{sci|1.5|5}} → 1.5×10⁵
const e = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['exp'])
  return { data: null, replacement: `×10${superscript(obj.exp || '')}` }
}
const tenPow = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['exp'])
  return { data: null, replacement: `10${superscript(obj.exp || '')}` }
}
const sci = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['mantissa', 'exp'])
  if (obj.exp === undefined) {
    return { data: null, replacement: obj.mantissa || '' }
  }
  return { data: null, replacement: `${obj.mantissa || ''}×10${superscript(obj.exp)}` }
}

// https://en.wikipedia.org/wiki/Template:Mabs - {{mabs|x}} → |x|
const mabs = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  return { data: null, replacement: `&#124;${obj.text || ''}&#124;` }
}

// https://en.wikipedia.org/wiki/Template:Physconst - a few common constants (CODATA 2018)
const constants = {
  c: ['299792458', 'm/s'],
  g: ['6.67430×10⁻¹¹', 'm³⋅kg⁻¹⋅s⁻²'],
  h: ['6.62607015×10⁻³⁴', 'J⋅s'],
  hbar: ['1.054571817×10⁻³⁴', 'J⋅s'],
  e: ['1.602176634×10⁻¹⁹', 'C'],
  k: ['1.380649×10⁻²³', 'J/K'],
  na: ['6.02214076×10²³', 'mol⁻¹'],
  r: ['8.314462618', 'J⋅mol⁻¹⋅K⁻¹'],
  me: ['9.1093837015×10⁻³¹', 'kg'],
  mp: ['1.67262192369×10⁻²⁷', 'kg'],
  gn: ['9.80665', 'm/s²'],
  alpha: ['0.0072973525693', ''],
  eps0: ['8.8541878128×10⁻¹²', 'F/m'],
  mu0: ['1.25663706212×10⁻⁶', 'N/A²'],
  sigma: ['5.670374419×10⁻⁸', 'W⋅m⁻²⋅K⁻⁴'],
}
const physconst = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['name'])
  let found = constants[(obj.name || '').toLowerCase()]
  if (!found) {
    return { data: null, replacement: '' }
  }
  let [val, unit] = found
  if (obj.round !== undefined) {
    let n = Number(obj.round)
    let m = val.match(/^[0-9.]+/)
    if (m && Number.isInteger(n)) {
      val = Number(m[0]).toFixed(n) + val.slice(m[0].length)
    }
  }
  if (obj.unit === 'no' || !unit) {
    return { data: null, replacement: val }
  }
  return { data: null, replacement: `${val} ${unit}` }
}

// geologic time - https://en.wikipedia.org/wiki/Template:Ma
// {{mya|65}} → 65 million years ago, {{ma|65}} → 65 Ma
const ago = (word, abbr) => (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['num', 'num2'])
  let str = obj.num || ''
  if (obj.num2) {
    str += `–${obj.num2}`
  }
  if (!str) {
    return { data: null, replacement: '' }
  }
  if (obj.template === abbr.toLowerCase()) {
    return { data: null, replacement: `${str} ${abbr}` }
  }
  return { data: null, replacement: `${str} ${word} years ago` }
}

// https://en.wikipedia.org/wiki/Template:Chem - {{chem|H|2|O}} → H₂O
const chem = (tmpl, parse = defaultParse) => {
  let arr = parse(tmpl).list || []
  let str = arr
    .map((s, i) => {
      // charges like '2+' are superscripts; otherwise odd positions are subscripts
      if (/^[0-9]*[+\-−]$/.test(s)) {
        return superscript(s)
      }
      if (i % 2 === 1) {
        return subscript(s)
      }
      return s
    })
    .join('')
  return { data: { formula: str }, replacement: str }
}

// https://en.wikipedia.org/wiki/Template:Nuclide - {{nuclide|carbon|14}} → ¹⁴C
const elements = {
  hydrogen: 'H',
  helium: 'He',
  lithium: 'Li',
  beryllium: 'Be',
  boron: 'B',
  carbon: 'C',
  nitrogen: 'N',
  oxygen: 'O',
  fluorine: 'F',
  neon: 'Ne',
  sodium: 'Na',
  magnesium: 'Mg',
  aluminium: 'Al',
  aluminum: 'Al',
  silicon: 'Si',
  phosphorus: 'P',
  sulfur: 'S',
  sulphur: 'S',
  chlorine: 'Cl',
  argon: 'Ar',
  potassium: 'K',
  calcium: 'Ca',
  iron: 'Fe',
  cobalt: 'Co',
  nickel: 'Ni',
  copper: 'Cu',
  zinc: 'Zn',
  strontium: 'Sr',
  technetium: 'Tc',
  iodine: 'I',
  xenon: 'Xe',
  caesium: 'Cs',
  cesium: 'Cs',
  barium: 'Ba',
  lead: 'Pb',
  bismuth: 'Bi',
  polonium: 'Po',
  radon: 'Rn',
  radium: 'Ra',
  thorium: 'Th',
  uranium: 'U',
  neptunium: 'Np',
  plutonium: 'Pu',
  americium: 'Am',
  curium: 'Cm',
}
const nuclide = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['element', 'mass', 'extra'])
  let name = (obj.element || '').toLowerCase()
  let sym = elements[name] || obj.element || ''
  let mass = obj.mass ? superscript(obj.mass) : ''
  // {{nuclide|technetium|99|m}} is a metastable isomer
  if (/^m\d*$/.test(obj.extra || '')) {
    mass += obj.extra
  }
  let str = `${mass}${sym}`
  if (obj.charge) {
    str += superscript(obj.charge)
  }
  return { data: null, replacement: str }
}

// https://en.wikipedia.org/wiki/Template:SubatomicParticle - the common ones
const particles = {
  electron: 'e⁻',
  positron: 'e⁺',
  proton: 'p⁺',
  antiproton: 'p̄',
  neutron: 'n⁰',
  antineutron: 'n̄',
  photon: 'γ',
  'electron neutrino': 'νₑ',
  neutrino: 'ν',
  muon: 'μ⁻',
  antimuon: 'μ⁺',
  tau: 'τ⁻',
  'alpha particle': 'α',
  alpha: 'α',
  'beta particle': 'β',
  'beta-': 'β⁻',
  'beta+': 'β⁺',
  gluon: 'g',
  'higgs boson': 'H⁰',
  'w boson+': 'W⁺',
  'w boson-': 'W⁻',
  'z boson': 'Z⁰',
  'pion+': 'π⁺',
  'pion-': 'π⁻',
  pion0: 'π⁰',
  'kaon+': 'K⁺',
  kaon0: 'K⁰',
  'up quark': 'u',
  'down quark': 'd',
  'strange quark': 's',
  'charm quark': 'c',
  'top quark': 't',
  'bottom quark': 'b',
  deuteron: 'd',
  triton: 't',
}
const subatomicParticle = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['name'])
  let name = (obj.name || '').toLowerCase()
  return { data: null, replacement: particles[name] || obj.name || '' }
}

// string functions - https://en.wikipedia.org/wiki/Category:String_manipulation_templates
const strRight = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text', 'n'])
  let n = parseInt(obj.n, 10) || 0
  let text = obj.text || ''
  return { data: null, replacement: n > 0 ? text.slice(-n) : '' }
}
// {{str index|hello|2}} → e  (1-indexed)
const strIndex = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text', 'n'])
  let n = parseInt(obj.n, 10) || 0
  return { data: null, replacement: (obj.text || '').charAt(n - 1) }
}
// {{str find|hello|l}} → 3  (1-indexed, -1 when absent)
const strFind = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text', 'search'])
  if (!obj.search) {
    return { data: null, replacement: '1' }
  }
  return { data: null, replacement: String((obj.text || '').indexOf(obj.search) + 1 || -1) }
}
const strEndswith = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text', 'search', 'yes', 'no'])
  let ok = (obj.text || '').endsWith(obj.search || '')
  return { data: null, replacement: ok ? (obj.yes ?? 'yes') : (obj.no ?? '') }
}
const strStartswith = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text', 'search', 'yes', 'no'])
  let ok = (obj.text || '').startsWith(obj.search || '')
  return { data: null, replacement: ok ? (obj.yes ?? 'yes') : (obj.no ?? '') }
}
// {{str number|a1b2}} → 12
const strNumber = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  return { data: null, replacement: (obj.text || '').replace(/[^0-9.]/g, '') }
}
const removeFirstWord = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  let arr = (obj.text || '').trim().split(/\s+/)
  return { data: null, replacement: arr.slice(1).join(' ') }
}

export default {
  roman,
  binary,
  nts,
  percent,
  e,
  '10^': tenPow,
  sci,
  mabs,
  physconst,
  mya: ago('million', 'Ma'),
  ma: ago('million', 'Ma'),
  bya: ago('billion', 'Ga'),
  ga: ago('billion', 'Ga'),
  kya: ago('thousand', 'ka'),
  ka: ago('thousand', 'ka'),
  chem,
  nuclide,
  subatomicparticle: subatomicParticle,
  'str right': strRight,
  'str index': strIndex,
  'str find': strFind,
  'str endswith': strEndswith,
  'str startswith': strStartswith,
  'str number': strNumber,
  'remove first word': removeFirstWord,
}
