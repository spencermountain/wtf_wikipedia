//split text into sentences, using regex
//@spencermountain MIT

//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2015 MIT
const literalAbbreviations = require('../_data/abbreviations')
const abbreviations = literalAbbreviations.concat('[^]][^]]')
const abbrev_reg = new RegExp("(^| |')(" + abbreviations.join('|') + `)[.!?] ?$`, 'i')
const acronym_reg = new RegExp("[ |.|'|[][A-Z].? *?$", 'i')
const elipses_reg = new RegExp('\\.\\.\\.* +?$')
const hasWord = new RegExp('[a-zа-яぁ-ゟ][a-zа-яぁ-ゟ゠-ヿ]', 'iu')
// 3040-309F : hiragana
// 30A0-30FF : katakana

//turn a nested array into one array
const flatten = function(arr) {
  let all = []
  arr.forEach(function(a) {
    all = all.concat(a)
  })
  return all
}

const naiive_split = function(text) {
  //first, split by newline
  let splits = text.split(/(\n+)/)
  splits = splits.filter(s => s.match(/\S/))
  //split by period, question-mark, and exclamation-mark
  splits = splits.map(function(str) {
    return str.split(/(\S.+?[.!?]"?)(?=\s+|$)/g) //\u3002
  })
  return flatten(splits)
}

// if this looks like a period within a wikipedia link, return false
const isBalanced = function(str) {
  str = str || ''
  const open = str.split(/\[\[/) || []
  const closed = str.split(/\]\]/) || []
  if (open.length > closed.length) {
    return false
  }
  //make sure quotes are closed too
  const quotes = str.match(/"/g)
  if (quotes && quotes.length % 2 !== 0 && str.length < 900) {
    return false
  }
  return true
}

const sentence_parser = function(text) {
  let sentences = []
  //first do a greedy-split..
  let chunks = []
  //ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return sentences
  }
  // This was the splitter regex updated to fix quoted punctuation marks.
  // let splits = text.split(/(\S.+?[.\?!])(?=\s+|$|")/g);
  // todo: look for side effects in this regex replacement:
  let splits = naiive_split(text)
  //filter-out the grap ones
  for (let i = 0; i < splits.length; i++) {
    let s = splits[i]
    if (!s || s === '') {
      continue
    }
    //this is meaningful whitespace
    if (!s.match(/\S/)) {
      //add it to the last one
      if (chunks[chunks.length - 1]) {
        chunks[chunks.length - 1] += s
        continue
      } else if (splits[i + 1]) {
        //add it to the next one
        splits[i + 1] = s + splits[i + 1]
        continue
      }
    }
    chunks.push(s)
  }

  //detection of non-sentence chunks
  const isSentence = function(hmm) {
    if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg)) {
      return false
    }
    //too short? - no consecutive letters
    if (hasWord.test(hmm) === false) {
      return false
    }
    if (!isBalanced(hmm)) {
      return false
    }
    return true
  }
  //loop through these chunks, and join the non-sentence chunks back together..
  for (let i = 0; i < chunks.length; i++) {
    //should this chunk be combined with the next one?
    if (chunks[i + 1] && !isSentence(chunks[i])) {
      chunks[i + 1] = chunks[i] + (chunks[i + 1] || '') //.replace(/ +/g, ' ');
    } else if (chunks[i] && chunks[i].length > 0) {
      //this chunk is a proper sentence..
      sentences.push(chunks[i])
      chunks[i] = ''
    }
  }
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text]
  }
  return sentences
}

module.exports = sentence_parser
// console.log(sentence_parser('Tony is nice. He lives in Japan.').length === 2);
