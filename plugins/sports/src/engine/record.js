import { dashSplit } from '../_lib.js'

// '49–26–7' → {wins, losses, otLosses, games}
// a third number means overtime-losses in the modern nhl, ties before 2005
const parseRecord = function (str = '', opts = {}) {
  str = String(str)
  // 1981-style split seasons list several records - prefer the overall one
  const overall = str.match(/overall:? *(.+)/i)
  if (overall) {
    str = overall[1]
  }
  // take the first record-shaped run, so '1st half: 16–42' isn't read as 1–16
  const shaped = str.match(/\d+(?: *[–\-−] *\d+)+/)
  if (!shaped) {
    return null
  }
  const nums = shaped[0]
    .split(dashSplit)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => isNaN(n) === false)
  if (nums.length < 2) {
    return null
  }
  const rec = { wins: nums[0], losses: nums[1] }
  if (nums.length === 3) {
    if (opts.ties === true) {
      rec.ties = nums[2]
    } else {
      rec.otLosses = nums[2]
    }
  }
  if (nums.length === 4) {
    if (opts.otWins === true) {
      //the pwhl format: W–OTW–OTL–L, with wins counting both
      rec.wins = nums[0] + nums[1]
      rec.otWins = nums[1]
      rec.otLosses = nums[2]
      rec.losses = nums[3]
    } else {
      //the 1999-2005 nhl format: W–L–T–OTL
      rec.ties = nums[2]
      rec.otLosses = nums[3]
    }
  }
  rec.games = nums.reduce((a, b) => a + b, 0)
  rec.winPct = rec.games > 0 ? Number((rec.wins / rec.games).toFixed(3)) : 0
  return rec
}

// tally a record from the parsed games - soccer infoboxes rarely state one
const countRecord = function (games) {
  const rec = { wins: 0, losses: 0, ties: 0, games: games.length }
  games.forEach((g) => {
    if (g.outcome === 'win') {
      rec.wins += 1
    } else if (g.outcome === 'loss') {
      rec.losses += 1
    } else if (g.outcome === 'tie') {
      rec.ties += 1
    }
  })
  rec.winPct = rec.games > 0 ? Number((rec.wins / rec.games).toFixed(3)) : 0
  return rec
}

export default parseRecord
export { countRecord }
