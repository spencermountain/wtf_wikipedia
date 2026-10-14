const dashSplit = /(–|-|−|&ndash;)/ //eslint-disable-line

const parseTeam = function (txt) {
  if (!txt) {
    return {}
  }
  const away = /^ *@ */.test(txt)
  return {
    name: txt.replace(/^ +@ +/, ''),
    home: !away
  }
}

const parseRecord = function (txt) {
  if (!txt) {
    return {}
  }
  const arr = txt.split(dashSplit)
  const obj = {
    wins: parseInt(arr[0], 10) || 0,
    losses: parseInt(arr[2], 10) || 0,
  }
  obj.games = obj.wins + obj.losses
  const plusMinus = obj.wins / obj.games
  obj.plusMinus = Number(plusMinus.toFixed(2))
  return obj
}

const parseScore = function (txt) {
  if (!txt) {
    return {}
  }
  txt = txt.replace(/^[wl] /i, '')
  const arr = txt.split(dashSplit)
  const obj = {
    winner: parseInt(arr[0], 10),
    loser: parseInt(arr[2], 10),
  }
  if (isNaN(obj.winner) || isNaN(obj.loser)) {
    return {}
  }
  return obj
}

const parseAttendance = function (txt = '') {
  //support [[Rogers Center]] (23,987)
  if (txt.indexOf('(') !== -1) {
    const m = txt.match(/\(([0-9 ,]+)\)/)
    if (m && m[1]) {
      txt = m[1]
    }
  }
  txt = txt.replace(/,/g, '')
  return parseInt(txt, 10) || null
}

const parsePitchers = function (row) {
  let win = row.Win || row.win || ''
  win = win.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1').trim()
  let loss = row.Loss || row.loss || ''
  loss = loss.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1').trim()
  let save = row.Save || row.save || ''
  save = save.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1').trim()
  if (dashSplit.test(save) === true) {
    save = null
  }
  return {
    win: win,
    loss: loss,
    save: save,
  }
}

const parseRow = function (row) {
  if (!row) {
    return null
  }
  const team = parseTeam(row.opponent || row.Opponent)
  const record = parseRecord(row.record || row.Record)
  const obj = {
    date: row.date || row.Date,
    team: team.name || team.Name,
    home: team.home || team.Home || false,
    pitchers: parsePitchers(row),
    result: parseScore(row.score || row.Score || row['box score'] || row['Box Score']),
    record: record,
    attendance: parseAttendance(row.attendance || row.Attendance || row['location (attendance)'] || row['Location (Attendance)'])
  }
  return obj
}
export default parseRow
