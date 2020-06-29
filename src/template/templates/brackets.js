const parse = require('../_parsers/parse')

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

let all = {
  //playoff brackets
  '4teambracket': function (tmpl, list) {
    let obj = playoffBracket(tmpl)
    list.push(obj)
    return ''
  },
}

//a bunch of aliases for these ones:
// https://en.wikipedia.org/wiki/Category:Tournament_bracket_templates
const brackets = [
  '2teambracket',
  '4team2elimbracket',
  '8teambracket',
  '16teambracket',
  '32teambracket',
  '4roundbracket-byes',
  'cwsbracket',
  'nhlbracket',
  'nhlbracket-reseed',
  '4teambracket-nhl',
  '4teambracket-ncaa',
  '4teambracket-mma',
  '4teambracket-mlb',
  '16teambracket-two-reseeds',

  '8teambracket-nhl',
  '8teambracket-mlb',
  '8teambracket-ncaa',
  '8teambracket-afc',
  '8teambracket-afl',
  '8teambracket-tennis3',
  '8teambracket-tennis5',

  '16teambracket-nhl',
  '16teambracket-nhl divisional',
  '16teambracket-nhl-reseed',
  '16teambracket-nba',
  '16teambracket-swtc',
  '16teambracket-afc',
  '16teambracket-tennis3',
  '16teambracket-tennis5',
]
brackets.forEach((key) => {
  all[key] = all['4teambracket']
})

module.exports = all
