import parse from '../../parse/toJSON/index.js'

let shorthands = [
  // {{HWV|251d}} - handel, bach
  ['bwv', 'BWV'],
  ['hwv', 'HWV'],
  ['d.', 'D '], //Deutsch catalogue
  ['aka', 'a.k.a. '],

  // date abbreviations
  ['cf.', 'cf. '],
  ['fl.', 'fl. '],
  ['circa', 'c. '],
  ['born in', 'b. '],
  ['died-in', 'd. '],
  ['married-in', 'm. '],
]
// create a function for each one
let fns = shorthands.reduce((h, a) => {
  let [name, out] = a
  h[name] = (tmpl) => {
    let { first } = parse(tmpl, ['first'])
    if (first || first === 0) {
      return out + (first || '')
    }
    return out
  }
  return h
}, {})

// return only the name of the template
let justNames = [
  'they',
  'them',
  'their',
  'theirs',
  'themself',
  'they are',
  'they were',
  'they have',
  'they do',
  'he or she',
  'him or her',
  'his or her',
  'his or hers',
  'he/she',
  'him/her',
  'his/her',
]
justNames.forEach((str) => {
  fns[str] = str
})

export default fns
