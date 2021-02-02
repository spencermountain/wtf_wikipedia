const parse = require('../../toJSON')
const flags = require('../../../_data/flags')
const playoffBracket = require('./_lib')

let sports = {
  //playoff brackets
  '4teambracket': function (tmpl, list) {
    let obj = playoffBracket(tmpl)
    list.push(obj)
    return ''
  },

  player: (tmpl, list) => {
    let res = parse(tmpl, ['number', 'country', 'name', 'dl'])
    list.push(res)
    let str = `[[${res.name}]]`
    if (res.country) {
      let country = (res.country || '').toLowerCase()
      let flag = flags.find((a) => country === a[1] || country === a[2]) || []
      if (flag && flag[0]) {
        str = flag[0] + '  ' + str
      }
    }
    if (res.number) {
      str = res.number + ' ' + str
    }
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Goal
  goal: (tmpl, list) => {
    let res = parse(tmpl)
    let obj = {
      template: 'goal',
      data: [],
    }
    let arr = res.list || []
    for (let i = 0; i < arr.length; i += 2) {
      obj.data.push({
        min: arr[i],
        note: arr[i + 1] || '',
      })
    }
    list.push(obj)
    //generate a little text summary
    let summary = '⚽ '
    summary += obj.data
      .map((o) => {
        let note = o.note
        if (note) {
          note = ` (${note})`
        }
        return o.min + "'" + note
      })
      .join(', ')
    return summary
  },

  //'red' card - {{sent off|cards|min1|min2}}
  'sent off': (tmpl, list) => {
    let obj = parse(tmpl, ['cards'])
    let result = {
      template: 'sent off',
      cards: obj.cards,
      minutes: obj.list || [],
    }
    list.push(result)
    let mins = result.minutes.map((m) => m + "'").join(', ')
    return 'sent off: ' + mins
  },

  //a transcluded sports module - https://en.m.wikipedia.org/w/index.php?title=Special:WhatLinksHere/Module:Sports_table
  // https://en.wikipedia.org/wiki/Template:2020–21_NHL_North_Division_standings
  'sports table': (tmpl, list) => {
    let obj = parse(tmpl)
    let byTeam = {}
    let teams = Object.keys(obj)
      .filter((k) => /^team[0-9]/.test(k))
      .map((k) => obj[k].toLowerCase())
    teams.forEach((team) => {
      byTeam[team] = {
        name: obj[`name_${team}`],
        win: Number(obj[`win_${team}`]) || 0,
        loss: Number(obj[`loss_${team}`]) || 0,
        tie: Number(obj[`tie_${team}`]) || 0,
        otloss: Number(obj[`otloss_${team}`]) || 0,
        goals_for: Number(obj[`gf_${team}`]) || 0,
        goals_against: Number(obj[`ga_${team}`]) || 0,
      }
    })
    let res = {
      date: obj.update,
      header: obj.table_header,
      teams: byTeam,
    }
    list.push(res)
  },
}
module.exports = sports
