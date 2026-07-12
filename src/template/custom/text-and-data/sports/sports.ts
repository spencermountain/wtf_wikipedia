import parse from '../../../parse/toJSON/index.ts'
import flags from '../../../../_data/flags.ts'
import playoffBracket from './_lib.ts'

let sports = {
  //playoff brackets
  '4teambracket': function (tmpl, list) {
    let obj = playoffBracket(tmpl)
    list.push(obj)
    return ''
  },

  'win draw lose': function (tmpl, list) {
    let obj = parse(tmpl)
    list.push(obj)
    let arr = obj.list || []
    let draw = parseInt(arr[2]) || 0
    let lose = parseInt(arr[3]) || 0;
    let win = parseInt(arr[1]) || 0;
    let total = win + draw + lose;
    let winPercentage = ''
    if (total > 0) {
      winPercentage = ((win / total) * 100).toFixed(1);
    }
    return '\n| ' + arr.join('\n| ') + '\n| ' + winPercentage + '%'
  },

  'win-loss record': function (tmpl, list) {
    let obj = parse(tmpl, ['w', 'l', 't'])
    list.push(obj)
    let str = `${obj.w}`
    if (obj.t || obj.d) {
      str += `-${obj.t || obj.d}`
    }
    str += `-${obj.l}`
    return str
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

  // college baseketball rosters
  'cbb roster/header': function () {
    return `{| class="wikitable"
    |-
    ! POS
    ! #
    ! Name
    ! Height
    ! Weight
    ! Year
    ! Previous School
    ! Hometown
    |-\n`
  },
  'cbb roster/player': function (tmpl, list) {
    let data = parse(tmpl)
    list.push(data)
    // first=|last=|dab=|num=|pos=|ft=|in=|lbs=|class=|rs=|home=
    return `|-
| ${data.pos || ''}
| ${data.num || ''}
| ${data.first || ''} ${data.last || ''}
| ${data.ft || ''}${data.in || ''}
| ${data.lbs || ''}
| ${data.class || ''}
| ${data.high_school || ''}
| ${data.home || ''}
`
  },
  'cbb roster/footer': function () {
    return `\n|}`
  },
}
export default sports
