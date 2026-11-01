// nhl + nba seasons span two years: '2024–25', with '1999–2000' at the century
const seasonSlug = function (year) {
  const next = year + 1
  let suffix = String(next % 100).padStart(2, '0')
  if (suffix === '00') {
    suffix = String(next)
  }
  return `${year}–${suffix}`
}

// '2024–25 Toronto Raptors season', as a page-title
const twoYearTitle = function (team, year) {
  return `${seasonSlug(year)} ${team} season`.replace(/ /g, '_')
}

// and back again → {year: 2024, team: 'Toronto Raptors'}
const parseTwoYearTitle = function (title = '') {
  const m = String(title).match(/^(\d{4})(?:[–-]\d{2,4})? (.+?) season$/)
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/)
  return { year: year ? Number(year[0]) : null, team: '' }
}

export { seasonSlug, twoYearTitle, parseTwoYearTitle }
