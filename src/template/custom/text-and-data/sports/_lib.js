import parse from '../../../parse/toJSON/index.js'

const zeroPad = function (num) {
  num = String(num)
  if (num.length === 1) {
    num = '0' + num
  }
  return num
}

const parseTeam = function (obj, round, team) {
  if (obj[`rd${round}-team${zeroPad(team)}`]) {
    team = zeroPad(team)
  }
  let score = obj[`rd${round}-score${team}`]
  let num = Number(score)
  if (isNaN(num) === false) {
    score = num
  }
  return {
    team: obj[`rd${round}-team${team}`],
    score: score,
    seed: obj[`rd${round}-seed${team}`],
  }
}

// https://en.wikipedia.org/wiki/Category:Tournament_bracket_templates
//these are weird.
const playoffBracket = function (tmpl) {
  let rounds = []
  let obj = parse(tmpl)
  //try some rounds
  for (let i = 1; i < 7; i += 1) {
    let round = []
    for (let t = 1; t < 16; t += 2) {
      let key = `rd${i}-team`
      if (obj[key + t] || obj[key + zeroPad(t)]) {
        let one = parseTeam(obj, i, t)
        let two = parseTeam(obj, i, t + 1)
        round.push([one, two])
      } else {
        break
      }
    }
    if (round.length > 0) {
      rounds.push(round)
    }
  }
  return {
    template: 'playoffbracket',
    rounds: rounds,
  }
}

export default playoffBracket
