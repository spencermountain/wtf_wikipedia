const parse = require('../_parsers/parse')
// const strip = require('./_parsers/_strip');

//wiktionary... who knows. we should atleast try.
const templates = {
  //{{inflection of|avoir||3|p|pres|ind|lang=fr}}
  //https://en.wiktionary.org/wiki/Template:inflection_of
  inflection: (tmpl, list) => {
    let obj = parse(tmpl, ['lemma'])
    obj.tags = obj.list
    delete obj.list
    obj.type = 'form-of'
    list.push(obj)
    return obj.lemma || ''
  },

  //latin verbs
  'la-verb-form': (tmpl, list) => {
    let obj = parse(tmpl, ['word'])
    list.push(obj)
    return obj.word || ''
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
  rhymes: (tmpl, list) => {
    let obj = parse(tmpl, ['word'])
    list.push(obj)
    return 'Rhymes: -' + (obj.word || '')
  }
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
  'inflection',
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
  'vocative singular'
]
conjugations.forEach(name => {
  templates[name + ' of'] = (tmpl, list) => {
    let obj = parse(tmpl, ['lemma'])
    obj.tags = obj.list
    delete obj.list
    obj.type = 'form-of'
    list.push(obj)
    return obj.lemma || ''
  }
})
module.exports = templates
