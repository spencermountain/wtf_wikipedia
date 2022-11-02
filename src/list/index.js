import List from './List.js'
import { fromText as parseSentence } from '../04-sentence/index.js'
import Sentence from '../04-sentence/Sentence.js'
import Image from '../image/Image.js'

const list_reg = /^[#*:;|]+/
const bullet_reg = /^\*+[^:,|]{4}/
const number_reg = /^ ?#[^:,|]{4}/
const has_word = /[\p{Letter}_0-9\]}]/iu


/**
 * does it start with a bullet point or something?
 * 
 * @param {string} line 
 * @returns if the provided line is part of a list
 */
function isList (line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line)
}

/**
 * make bullets/numbers into human-readable *'s
 * 
 * @param {string[]} list 
 * @returns {Sentence[]}
 */
function cleanList (list) {
  let number = 1
  list = list.filter((l) => l)
  for (let i = 0; i < list.length; i++) {
    let line = list[i]
    //add # numberings formatting
    if (line.match(number_reg)) {
      line = line.replace(/^ ?#*/, number + ') ')
      line = line + '\n'
      number += 1
    } else if (line.match(list_reg)) {
      number = 1
      line = line.replace(list_reg, '')
    }
    list[i] = parseSentence(line)
  }
  return list
}

/**
 * 
 * @private
 * @param {string[]} lines 
 * @param {number} i 
 * @returns 
 */
function grabList (lines, i) {
  let sub = []
  for (let o = i; o < lines.length; o++) {
    if (isList(lines[o])) {
      sub.push(lines[o])
    } else {
      break
    }
  }
  sub = sub.filter((a) => a && has_word.test(a))
  sub = cleanList(sub)
  return sub
}

/**
 * 
 * @param {object} paragraph 
 * @param {string} paragraph.wiki
 * @param {Sentence[]} paragraph.sentences
 * @param {List[]} paragraph.lists
 * @param {Image[]} paragraph.images
 */
function parseList (paragraph) {
  let wiki = paragraph.wiki
  let lines = wiki.split(/\n/g)
  let lists = []
  let theRest = []

  for (let i = 0; i < lines.length; i++) {
    if (isList(lines[i])) {
      let sub = grabList(lines, i)
      if (sub.length > 0) {
        lists.push(sub)
        i += sub.length - 1
      }
    } else {
      theRest.push(lines[i])
    }
  }

  paragraph.lists = lists.map((l) => new List(l, wiki))
  paragraph.wiki = theRest.join('\n')
}

export default parseList
