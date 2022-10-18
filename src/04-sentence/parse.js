//split text into sentences, using regex
//@spencermountain MIT

//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2015 MIT
import literalAbbreviations from './_abbreviations.js'
const abbreviations = literalAbbreviations.concat('[^]][^]]')
const abbrev_reg = new RegExp("(^| |')(" + abbreviations.join('|') + `)[.!?] ?$`, 'i')
const acronym_reg = /[ .'][A-Z].? *$/i
const elipses_reg = /\.{3,} +$/
const circa_reg = / c\.\s$/
const hasWord = /\p{Letter}/iu

//turn a nested array into one array
function flatten (arr) {
  let all = []
  arr.forEach(function (a) {
    all = all.concat(a)
  })
  return all
}

function naiive_split (text) {
  //first, split by newline
  let splits = text.split(/(\n+)/)
  splits = splits.filter((s) => s.match(/\S/))
  //split by period, question-mark, and exclamation-mark
  splits = splits.map(function (str) {
    return str.split(/(\S.+?[.!?]"?)(?=\s|$)/g) //\u3002
  })
  return flatten(splits)
}

// if this looks like a period within a wikipedia link, return false
function isBalanced (str) {
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
  //make sure quotes are closed too
  const parens = str.match(/[()]/g)
  if (parens && parens.length % 2 !== 0 && str.length < 900) {
    return false
  }
  return true
}

function sentence_parser (text) {
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
  function isSentence (hmm) {
    if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg) || hmm.match(circa_reg)) {
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

export default sentence_parser
