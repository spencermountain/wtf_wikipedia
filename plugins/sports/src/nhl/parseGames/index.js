import addWinner from './win-loss.js'
const dashSplit = /([–\-−]|&ndash;)/
import parseRecord from './_record.js'

const parseScore = function (score = '') {
  let arr = score.split(dashSplit)
  if (!arr[0] && !arr[2]) {
    return {}
  }
  return {
    win: Number(arr[0]),
    loss: Number(arr[2]),
  }
}



const parseDate = function (row, title) {
  let year = title.year
  let date = row.date || row.Date
  if (!date) {
    return ''
  }
  //the next year, add one to the year
  if (/^(jan|feb|mar|apr)/i.test(date)) {
    date += ' ' + (year + 1)
  } else {
    date += ' ' + year
  }
  return date
}

const doSection = function (section) {
  let tables = section.tables()
  //do all subsection, too
  section.children().forEach(s => {
    tables = tables.concat(s.tables())
  })
  //try to find a game log template
  if (tables.length === 0) {
    let templates = section.templates('game log section') || section.templates('game log month')
    let out = []
    templates.forEach((m) => {
      out = out.concat(m.data.data)
    })
    return out
  } else {
    let out = []
    tables = tables.forEach((t) => {
      out = out.concat(t.keyValue())
    })
    return out
  }
}

const parseGame = function (row, meta) {
  let attendance = row.attendance || row.Attendance || ''
  attendance = Number(attendance.replace(/,/, '')) || null
  let res = {
    game: Number(row['#'] || row.Game),
    date: parseDate(row, meta),
    opponent: row.Opponent || row.opponent,
    result: parseScore(row.score || row.Score),
    overtime: (row.ot || row.OT || '').toLowerCase() === 'ot',
    // goalie: row.decision,
    record: parseRecord(row.record || row.Record),
    attendance: attendance,
    points: Number(row.pts || row.points || row.Pts || row.Points) || 0,
  }
  res.location = row.Location || row.location
  res.home = row.home || row.Home
  res.visitor = row.visitor || row.Visitor
  if (!res.opponent) {
    res.opponent = meta.team.includes(res.home) ? res.visitors : res.home
  }
  res.opponent = res.opponent || ''
  res.opponent = res.opponent.replace(/@ /, '')
  res.opponent = res.opponent.trim()
  return res
}

//
const parseGames = function (doc, meta) {
  let games = []
  let s = doc.section('schedule and results') || doc.section('schedule') || doc.section('regular season')
  if (!s) {
    return games
  }
  // support nested headers
  let nested = s.children('regular season')
  if (nested) {
    s = nested
  }
  //do all subsections, too
  let rows = doSection(s)
  rows.forEach((row) => {
    games.push(parseGame(row, meta))
  })
  games = games.filter((g) => g && g.date)
  games = addWinner(games)
  // games = isFuture(games)
  return games
}
export default parseGames
