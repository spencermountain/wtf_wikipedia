const List = require('./List')
const parseSentence = require('../04-sentence/').fromText
const list_reg = /^[#\*:;\|]+/
const bullet_reg = /^\*+[^:,\|]{4}/
const number_reg = /^ ?\#[^:,\|]{4}/
const has_word = /[a-z_0-9\]\}]/i

//does it start with a bullet point or something?
const isList = function (line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line)
}

//make bullets/numbers into human-readable *'s
const cleanList = function (list) {
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

const grabList = function (lines, i) {
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

const parseList = function (paragraph) {
  let wiki = paragraph.wiki
  let lines = wiki.split(/\n/g)
  //lines = lines.filter(l => has_word.test(l));
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
  paragraph.lists = lists.map((l) => new List(l))
  paragraph.wiki = theRest.join('\n')
}
module.exports = parseList
