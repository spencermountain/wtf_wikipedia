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
  fbb: 'loss',
  fcc: 'loss',
  fdd: 'loss',
  ffbbbb: 'loss',
  ffcccc: 'loss',
  ffdddd: 'loss',
  faa: 'loss',
  f99: 'loss',
  ffb: 'otl',
  ffc: 'otl',
  ffe: 'otl',
  ffffbb: 'otl',
  ffffcc: 'otl',
  fff1c1: 'otl',
  ffeeaa: 'otl',
  bbb: 'postponed',
  bbbbbb: 'postponed',
  ccc: 'postponed',
  cccccc: 'postponed',
  '039': 'win', //mlb 'clinched playoff spot'
  '090': 'win', //mlb 'clinched division'
}

const prefixes = { w: 'win', l: 'loss', t: 'tie' }

const outcomeOf = function (attrs = '', scoreText = '') {
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
  // 'W 31–7' / 'L 2–9' score prefixes
  const pre = String(scoreText)
    .trim()
    .match(/^([WLT])\b/i)
  if (pre) {
    return prefixes[pre[1].toLowerCase()]
  }
  return null
}
export default outcomeOf
