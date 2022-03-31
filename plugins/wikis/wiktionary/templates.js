const parse = require('../../../src/template/parse/toJSON').default
// const strip = require('./_parsers/_strip');

//wiktionary... who knows. we should atleast try.
const templates = {
  etyl: 1,
  mention: 1,
  link: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'page', 'display'])
    list.push(obj)
    if (obj.display) {
      return `[[${obj.page}|${obj.display}]]`
    }
    return `[[${obj.page}]]`
  },
  'la-ipa': 0,
  //{{inflection of|avoir||3|p|pres|ind|lang=fr}}
  //https://en.wiktionary.org/wiki/Template:inflection_of
  // inflection: (tmpl, list) => {
  //   let obj = parse(tmpl, ['lemma'])
  //   obj.tags = obj.list
  //   delete obj.list
  //   obj.type = 'form-of'
  //   list.push(obj)
  //   return obj.lemma || ''
  // },

  //latin verbs
  'la-verb-form': (tmpl, list) => {
    let obj = parse(tmpl, ['word'])
    list.push(obj)
    return obj.word || ''
  },
  hyphenation: (tmpl, list) => {
    let obj = parse(tmpl, ['lang'])
    list.push(obj)
    return obj.list.join('‧')
  },
  'feminine plural': (tmpl, list) => {
    let obj = parse(tmpl, ['word'])
    list.push(obj)
    return obj.word || ''
  },
  'male plural': (tmpl, list) => {
    let obj = parse(tmpl, ['word'])
    list.push(obj)
    return obj.word || ''
  },
  desc: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'word'])
    list.push(obj)
    return `→ ${obj.lang}: [[${obj.word}]]` //shouldn't use language code
  },
  rhymes: (tmpl, list) => {
    let obj = parse(tmpl, ['word'])
    list.push(obj)
    return 'Rhymes: -' + (obj.word || '')
  },
  t: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'word'])
    list.push(obj)
    return `[[${obj.lang}:${obj.word}]]`
  },
  label: (tmpl, list) => {
    let obj = parse(tmpl, ['lang'])
    list.push(obj)
    return `(${obj.list.join(', ')})`
  },
  sense: (tmpl, list) => {
    let obj = parse(tmpl, ['context'])
    list.push(obj)
    return `(${obj.context})`
  },
  suffix: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'root', 'suffix'])
    list.push(obj)
    return `[[${obj.root}]] +[[-${obj.suffix}|${obj.suffix}]]`
  },
  prefix: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'root', 'prefix'])
    list.push(obj)
    return `[[${obj.prefix}-|${obj.prefix}]] + [[${obj.root}]]`
  },
  compound: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'first', 'second'])
    list.push(obj)
    let arr = [obj.first, obj.second || '']
    arr = arr.concat(obj.list || [])
    arr = arr.map((str) => `[[${str}]]`)
    return arr.join(' + ')
  },
  ux: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'example', 'translation'])
    list.push(obj)
    let str = `${obj.example}`
    if (obj.translation) {
      str += `\n` + obj.translation
    }
    return str
  },
  bor: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'source-lang', 'term'])
    list.push(obj)
    return `${obj['source-lang']} [[${obj.term}]]`
  },
  w: (tmpl, list) => {
    let obj = parse(tmpl, ['page', 'label'])
    list.push(obj)
    let lang = obj.lang || 'en'
    if (obj.label) {
      return `[https://${lang}.wikipedia.org/wiki/${obj.page}|${obj.label}]`
    }
    return `[https://${lang}.wikipedia.org/wiki/${obj.page}]`
  },
  also: (tmpl, list) => {
    let obj = parse(tmpl, [])
    list.push(obj)
    let links = obj.list.map((str) => `[[${str}]]`)
    return `See also: ${links.join(', ')}\n`
  },
  wikipedia: ['article', 'link title'],
  // https://en.wiktionary.org/wiki/Template:inflection_of
  'inflection of': (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'lemma', 'display'])
    list.push(obj)
    let words = {
      1: 'first-person',
      impers: 'first-person',
      2: 'second-person',
      3: 'third-person',
      c: 'common',
      an: 'animate',
      f: 'feminine',
      m: 'masculine',
      n: 'neuter',
      d: 'dual',
      du: 'dual',
      p: 'plural',
      s: 'singular',
      sg: 'singular',
      pl: 'plural',
      perf: 'perfect',
      pres: 'present',
      spos: 'single-possession',
    }
    let terms = obj.list.filter((k) => words[k])
    terms = terms.map((str) => words[str])
    return `${terms.join(', ')} of [[${obj.lemma}]]`
  },
}

//https://en.wiktionary.org/wiki/Category:Form-of_templates
let conjugations = [
  'abbreviation',
  'abessive plural',
  'abessive singular',
  'accusative plural',
  'accusative singular',
  'accusative',
  'acronym',
  'active participle',
  'agent noun',
  'alternative case form',
  'alternative form',
  'alternative plural',
  'alternative reconstruction',
  'alternative spelling',
  'alternative typography',
  'aphetic form',
  'apocopic form',
  'archaic form',
  'archaic spelling',
  'aspirate mutation',
  'associative plural',
  'associative singular',
  'attributive form',
  'attributive form',
  'augmentative',
  'benefactive plural',
  'benefactive singular',
  'causative plural',
  'causative singular',
  'causative',
  'clipping',
  'combining form',
  'comitative plural',
  'comitative singular',
  'comparative plural',
  'comparative singular',
  'comparative',
  'contraction',
  'dated form',
  'dated spelling',
  'dative plural definite',
  'dative plural indefinite',
  'dative plural',
  'dative singular',
  'dative',
  'definite',
  'deliberate misspelling',
  'diminutive',
  'distributive plural',
  'distributive singular',
  'dual',
  'early form',
  'eclipsis',
  'elative',
  'ellipsis',
  'equative',
  'euphemistic form',
  'euphemistic spelling',
  'exclusive plural',
  'exclusive singular',
  'eye dialect',
  'feminine noun',
  'feminine plural past participle',
  'feminine plural',
  'feminine singular past participle',
  'feminine singular',
  'feminine',
  'form',
  'former name',
  'frequentative',
  'future participle',
  'genitive plural definite',
  'genitive plural indefinite',
  'genitive plural',
  'genitive singular definite',
  'genitive singular indefinite',
  'genitive singular',
  'genitive',
  'gerund',
  'h-prothesis',
  'hard mutation',
  'harmonic variant',
  'imperative',
  'imperfective form',
  'inflected form',
  // 'inflection',
  'informal form',
  'informal spelling',
  'initialism',
  'ja-form',
  'jyutping reading',
  'late form',
  'lenition',
  'masculine plural past participle',
  'masculine plural',
  'medieval spelling',
  'misconstruction',
  'misromanization',
  'misspelling',
  'mixed mutation',
  'monotonic form',
  'mutation',
  'nasal mutation',
  'negative',
  'neuter plural past participle',
  'neuter plural',
  'neuter singular past participle',
  'neuter singular',
  'nominalization',
  'nominative plural',
  'nominative singular',
  'nonstandard form',
  'nonstandard spelling',
  'oblique plural',
  'oblique singular',
  'obsolete form',
  'obsolete spelling',
  'obsolete typography',
  'official form',
  'participle',
  'passive participle',
  'passive',
  'past active participle',
  'past participle',
  'past passive participle',
  'past tense',
  'perfective form',
  'plural definite',
  'plural indefinite',
  'plural',
  'polytonic form',
  'present active participle',
  'present participle',
  'present tense',
  'pronunciation spelling',
  'rare form',
  'rare spelling',
  'reflexive',
  'second-person singular past',
  'short for',
  'singular definite',
  'singular',
  'singulative',
  'soft mutation',
  'spelling',
  'standard form',
  'standard spelling',
  'substantivisation',
  'superlative',
  'superseded spelling',
  'supine',
  'syncopic form',
  'synonym',
  'terminative plural',
  'terminative singular',
  'uncommon form',
  'uncommon spelling',
  'verbal noun',
  'vocative plural',
  'vocative singular',
]
conjugations.forEach((name) => {
  templates[name + ' of'] = (tmpl, list) => {
    let obj = parse(tmpl, ['lemma'])
    obj.tags = obj.list
    delete obj.list
    obj.type = 'form-of'
    list.push(obj)
    return obj.lemma || ''
  }
})

// aliases
templates.m = templates.mention
templates.inflection = templates['inflection of']
templates['m-self'] = templates.mention
templates.l = templates.link
templates.ll = templates.link
templates['l-self'] = templates.link
templates.s = templates.sense
templates.tt = templates.t
templates.lb = templates.label
templates.lbl = templates.label
templates['t+'] = templates.t
templates['tt+'] = templates.t

module.exports = templates
