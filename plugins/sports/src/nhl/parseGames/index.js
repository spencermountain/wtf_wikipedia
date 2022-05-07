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

const isFuture = function (games) {
  games.forEach((g) => {
    if (!g.attendance && !g.points) {
      if (!g.record.wins && !g.record.lossess && !g.record.ties) {
        g.inFuture = true
        g.win = null
      }
    }
  })
  return games
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

const parseGame = function (row, meta) {
  let attendance = row.attendance || row.Attendance || ''
  attendance = Number(attendance.replace(/,/, '')) || null
  let res = {
    game: Number(row['#'] || row.Game),
    date: parseDate(row, meta),
    opponent: row.Opponent,
    result: parseScore(row.score || row.Score),
    overtime: (row.ot || row.OT || '').toLowerCase() === 'ot',
    // goalie: row.decision,
    record: parseRecord(row.record || row.Record),
    attendance: attendance,
    points: Number(row.pts || row.points || row.Pts || row.Points) || 0,
  }
  res.location = row.Location
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
  let s = doc.sections('regular season') || doc.sections('schedule and results')
  if (!s) {
    return games
  }
  //do all subsections, too
  let tables = s.tables()
  s.children().forEach((c) => {
    tables = tables.concat(c.tables())
  })
  if (!tables[0]) {
    return games
  }
  tables.forEach((table) => {
    let rows = table.keyValue()
    rows.forEach((row) => {
      games.push(parseGame(row, meta))
    })
  })
  games = games.filter((g) => g && g.date)
  games = addWinner(games)
  games = isFuture(games)
  return games
}
export default parseGames
