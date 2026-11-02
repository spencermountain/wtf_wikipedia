// the win/loss signal lives in row markup: {{Game-won}} templates or background colors
const classes = {
  won: 'win',
  otw: 'win',
  lost: 'loss',
  otl: 'otl',
  tied: 'tie',
  drawn: 'tie',
}

// green=win, red=loss, yellow=overtime-loss, grey=postponed
const colors = {
  bfb: 'win',
  cfc: 'win',
  dfd: 'win',
  bbffbb: 'win',
  ccffcc: 'win',
  ddffdd: 'win',
  afa: 'win',
  '9f9': 'win',
  d0ffe3: 'win', //mint, with the pink below on 90s-00s soccer pages
  fbb: 'loss',
  fcc: 'loss',
  fcf: 'loss', //pink, on ahl playoff logs
  ffccff: 'loss',
  fdd: 'loss',
  ffbbbb: 'loss',
  ffcccc: 'loss',
  ffdddd: 'loss',
  faa: 'loss',
  f99: 'loss',
  ffd0e3: 'loss',
  ffb: 'otl',
  ffc: 'otl',
  ffd: 'otl',
  ffe: 'otl',
  ffffbb: 'otl',
  ffffcc: 'otl',
  ffffdd: 'otl',
  fff1c1: 'otl',
  ffeeaa: 'otl',
  bbb: 'postponed',
  bbbbbb: 'postponed',
  ccc: 'postponed',
  cccccc: 'postponed',
  '039': 'win', //mlb 'clinched playoff spot'
  '090': 'win', //mlb 'clinched division'
}

const prefixes = { w: 'win', l: 'loss', t: 'tie', d: 'tie' }

const rawOutcome = function (attrs = '', scoreText = '') {
  const str = String(attrs).toLowerCase()
  const cl = str.match(/game-([a-z]+)/)
  if (cl && classes[cl[1]]) {
    return classes[cl[1]]
  }
  const bg = str.match(/(?:background(?:-color)? *: *|bgcolor *= *"?)#?([0-9a-f]{3,6})/)
  if (bg && colors[bg[1]]) {
    return colors[bg[1]]
  }
  if (/postponed|cancell?ed|suspended/i.test(scoreText)) {
    return 'postponed'
  }
  // 'W 31–7' / 'L 2–9' / 'D 2–2' score prefixes
  const pre = String(scoreText)
    .trim()
    .match(/^([WLTD])\b/i)
  if (pre) {
    return prefixes[pre[1].toLowerCase()]
  }
  return null
}

// soccer tables use the same yellow for a draw that hockey uses for an ot-loss,
// and some 90s pages shade draws a light grey that means nothing elsewhere
const outcomeOf = function (attrs = '', scoreText = '', draws = false) {
  const res = rawOutcome(attrs, scoreText)
  if (draws === true) {
    if (res === 'otl') {
      return 'tie'
    }
    if (res === null && /f3f3f3/i.test(String(attrs))) {
      return 'tie'
    }
  }
  return res
}
export default outcomeOf
