const dashSplit = /(–|-|−|&ndash;)/ // eslint-disable-line

function parseTeam (txt) {
  if (!txt) {
    return {}
  }
  let away = /^ *@ */.test(txt)
  return {
    name: txt.replace(/^ +@ +/, ''),
    home: !away
  }
}

function parseRecord (txt) {
  if (!txt) {
    return {}
  }
  let arr = txt.split(dashSplit)
  let obj = {
    wins: parseInt(arr[0], 10) || 0,
    losses: parseInt(arr[2], 10) || 0,
  }
  obj.games = obj.wins + obj.losses
  let plusMinus = obj.wins / obj.games
  obj.plusMinus = Number(plusMinus.toFixed(2))
  return obj
}

function parseScore (txt) {
  if (!txt) {
    return {}
  }
  txt = txt.replace(/^[wl] /i, '')
  let arr = txt.split(dashSplit)
  let obj = {
    winner: parseInt(arr[0], 10),
    loser: parseInt(arr[2], 10),
  }
  if (isNaN(obj.winner) || isNaN(obj.loser)) {
    return {}
  }
  return obj
}

function parseAttendance (txt = '') {
  //support [[Rogers Center]] (23,987)
  if (txt.indexOf('(') !== -1) {
    let m = txt.match(/\(([0-9 ,]+)\)/)
    if (m && m[1]) {
      txt = m[1]
    }
  }
  txt = txt.replace(/,/g, '')
  return parseInt(txt, 10) || null
}

function parsePitchers (row) {
  let win = row.Win || row.win || ''
  win = win.replace(/\(.*?\)/, '').trim()
  let loss = row.Loss || row.loss || ''
  loss = loss.replace(/\(.*?\)/, '').trim()
  let save = row.Save || row.save || ''
  save = save.replace(/\(.*?\)/, '').trim()
  if (dashSplit.test(save) === true) {
    save = null
  }
  return {
    win: win,
    loss: loss,
    save: save,
  }
}

function parseRow (row) {
  if (!row) {
    return null
  }
  let team = parseTeam(row.opponent || row.Opponent)
  let record = parseRecord(row.record || row.Record)
  let obj = {
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
