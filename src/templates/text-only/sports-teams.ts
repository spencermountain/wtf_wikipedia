import defaultParse from '../../parse/templates/parse/toJSON/text.ts'
import { findFlag, titleCase } from './flags.ts'

// National-team shorthands - https://en.wikipedia.org/wiki/Category:Sports_country_templates
// {{fb|USA}} → 🇺🇸 United States (linking to the national football team)
interface Team {
  team: string // 'national football team'
  under?: boolean // {{fbu|20|USA}} - an age-group team
  rt?: boolean // the flag goes after the name
  nolink?: boolean
}
const teams: Record<string, Team> = {
  nft: { team: 'national football team' },
  'nft-rt': { team: 'national football team', rt: true },
  fbw: { team: "women's national football team" },
  'fb-rt': { team: 'national football team', rt: true },
  'fbw-rt': { team: "women's national football team", rt: true },
  fbu: { team: 'national under-{age} football team', under: true },
  fbwu: { team: "women's national under-{age} football team", under: true },
  nfa: { team: 'Football Association', nolink: false },
  bk: { team: 'national basketball team' },
  bkw: { team: "women's national basketball team" },
  'bk-rt': { team: 'national basketball team', rt: true },
  hb: { team: 'national handball team' },
  hbw: { team: "women's national handball team" },
  ih: { team: "men's national ice hockey team" },
  ihw: { team: "women's national ice hockey team" },
  'ih-rt': { team: "men's national ice hockey team", rt: true },
  ru: { team: 'national rugby union team' },
  ruw: { team: "women's national rugby union team" },
  'ru-rt': { team: 'national rugby union team', rt: true },
  rl: { team: 'national rugby league team' },
  rlw: { team: "women's national rugby league team" },
  crw: { team: "women's national cricket team" },
  vb: { team: "men's national volleyball team" },
  vbw: { team: "women's national volleyball team" },
  fh: { team: "men's national field hockey team" },
  fhw: { team: "women's national field hockey team" },
  wp: { team: "men's national water polo team" },
  wpw: { team: "women's national water polo team" },
  bs: { team: 'national baseball team' },
  sb: { team: 'national softball team' },
  bsw: { team: "women's national baseball team" },
  fs: { team: 'national futsal team' },
  bh: { team: 'national beach handball team' },
  bv: { team: 'national beach volleyball team' },
  bsk: { team: 'national beach soccer team' },
}

const makeTeam = (name: string, info: Team) => {
  return (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, info.under ? ['age', 'flag', 'variant'] : ['flag', 'variant'])
    let found = findFlag(obj.flag)
    if (!found) {
      return { data: null, replacement: obj.flag || '' }
    }
    let country = titleCase(found[2])
    let label = obj.name || country
    let team = info.team.replace('{age}', obj.age || '')
    if (info.under) {
      label += ` U${obj.age || ''}`
    }
    let link = `[[${country} ${team}|${label}]]`
    if (info.rt) {
      return { data: null, replacement: `${link} ${found[0]}` }
    }
    return { data: null, replacement: `${found[0]} ${link}` }
  }
}

let templates: Record<string, any> = {}
Object.keys(teams).forEach((name) => {
  templates[name] = makeTeam(name, teams[name])
})

// --- Olympic flag templates - https://en.wikipedia.org/wiki/Template:FlagIOC ---
// {{flagIOC|USA|2016 Summer}} → 🇺🇸 United States (linking to 'United States at the 2016 Summer Olympics')
const games = (obj) => {
  let str = (obj.games || '').trim()
  if (!str) {
    return ''
  }
  return / Olympics$/i.test(str) ? str : `${str} Olympics`
}
const flagIOC = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['flag', 'games'])
  let found = findFlag(obj.flag)
  if (!found) {
    return { data: null, replacement: obj.flag || '' }
  }
  let country = titleCase(found[2])
  let at = games(obj)
  let link = at ? `[[${country} at the ${at}|${country}]]` : `[[${country}]]`
  return { data: null, replacement: `${found[0]} ${link}` }
}
// {{flagIOCathlete|[[John Smith]]|USA|2016 Summer}} → 🇺🇸 John Smith (USA)
const flagIOCathlete = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['name', 'flag', 'games'])
  let found = findFlag(obj.flag)
  // the athlete is linked, like {{flagathlete}}
  let name = obj.name ? `[[${obj.name}]]` : ''
  if (!found) {
    return { data: null, replacement: name }
  }
  let code = (obj.flag || '').toUpperCase()
  let at = games(obj)
  let country = titleCase(found[2])
  let link = at ? `[[${country} at the ${at}|${code}]]` : code
  return { data: null, replacement: `${found[0]} ${name} (${link})` }
}
// {{flagu|USA}} → 🇺🇸 United States, unlinked
const flagu = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['flag', 'variant'])
  let found = findFlag(obj.flag)
  if (!found) {
    return { data: null, replacement: obj.flag || '' }
  }
  return { data: null, replacement: `${found[0]} ${titleCase(found[2])}` }
}
// {{noflag|Mixed team}} → Mixed team
const noflag = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['name'])
  return { data: null, replacement: obj.name || '' }
}

Object.assign(templates, {
  flagioc: flagIOC,
  flagioc2: flagIOC,
  flagiocteam: flagIOC,
  flagiocathlete: flagIOCathlete,
  flagiocmedalist: flagIOCathlete,
  flagteam: flagIOC,
  flagu,
  noflag,
})

// --- post-season year links, like {{alds year}} ---
const seasonLink = (series: string) => (tmpl, parse = defaultParse) => {
  let { year } = parse(tmpl, ['year'])
  return { data: null, replacement: year ? `[[${year} ${series}|${year}]]` : '' }
}
Object.assign(templates, {
  wsy: seasonLink('World Series'),
  alcsy: seasonLink('American League Championship Series'),
  nlcsy: seasonLink('National League Championship Series'),
  sby: seasonLink('Super Bowl'),
})

export default templates
