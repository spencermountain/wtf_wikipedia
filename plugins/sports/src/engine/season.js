import { getCell } from '../_lib.js'

// season-level values every league surfaces under the same key,
// whatever the sport's own infobox calls them

// the head coach - soccer and baseball call them a manager
const coachOf = function (season = {}) {
  return getCell(season, ['coach', 'coaches', 'manager', 'managers', 'head coach']) || ''
}

// the general manager - soccer clubs have chairmen and owners instead
const gmOf = function (season = {}) {
  return getCell(season, ['general_manager', 'general_managers', 'generalmanager', 'gm']) || ''
}

// the home ground, whether the sport calls it a stadium, arena or ballpark
const venueOf = function (season = {}) {
  return String(getCell(season, ['stadium', 'arena', 'ballpark']) || '')
    .replace(/ *\(capacity:.*?\)/i, '')
    .trim()
}

// '18th (relegated)', 'Conference: 2nd Overall: 4th' → a plain number
const placeOf = function (val) {
  if (typeof val === 'number') {
    return val
  }
  const str = String(val || '')
  const overall = str.match(/overall:? *(\d+)/i)
  if (overall) {
    return Number(overall[1])
  }
  const m = str.match(/(\d+)(?:st|nd|rd|th)/i)
  if (m) {
    return Number(m[1])
  }
  return val || null
}

// the dates of the first and last game played
const seasonDates = function (games = []) {
  const dates = games.map((g) => g.date).filter(Boolean)
  if (dates.length === 0) {
    return { start: null, end: null }
  }
  return { start: dates[0], end: dates[dates.length - 1] }
}

// average home attendance, from the per-game numbers or the infobox
const avgAttendance = function (games = [], season = {}) {
  const nums = games.filter((g) => g.home === true && typeof g.attendance === 'number').map((g) => g.attendance)
  if (nums.length > 0) {
    return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
  }
  const avg = String(getCell(season, ['average_attendance', 'attendance']) || '')
  return parseInt(avg.replace(/[, ]/g, ''), 10) || null
}

export { coachOf, gmOf, venueOf, placeOf, seasonDates, avgAttendance }
