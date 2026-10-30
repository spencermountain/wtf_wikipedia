import makeResult from '../../templates/result.ts'
import defaults from '../../../_lib/defaults.ts'
import tableParser from '../05-tables/parse.ts'
import parseTemplates from '../../templates/index.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'
//sports game-logs are rows wrapped in start/end templates, not real tables:
//  old: https://en.wikipedia.org/wiki/Template:MLB_game_log_section
//  new: https://en.wikipedia.org/wiki/Template:Game_log_section_start

const openReg = /\{\{ *(?:mlb +)?game log (?:section|month)(?: start)?\s*[|}]/i
const closeReg = /\{\{ *(?:mlb +)?game log (?:section|month) end\s*\}\}/i

// index after the '}}' that closes the '{{' at `start`
const templateEnd = function (str, start) {
  let depth = 0
  for (let i = start; i < str.length - 1; i += 1) {
    if (str[i] === '{' && str[i + 1] === '{') {
      depth += 1
      i += 1
    } else if (str[i] === '}' && str[i + 1] === '}') {
      depth -= 1
      i += 1
      if (depth === 0) {
        return i + 1
      }
    }
  }
  return -1
}

// split template params on top-level pipes only
const splitParams = function (str) {
  const params = []
  let depth = 0
  let current = ''
  for (let i = 0; i < str.length; i += 1) {
    const c = str[i]
    if (c === '{' || c === '[') {
      depth += 1
    } else if (c === '}' || c === ']') {
      depth -= 1
    }
    if (c === '|' && depth === 0) {
      params.push(current)
      current = ''
    } else {
      current += c
    }
  }
  params.push(current)
  return params
}

// the old mlb templates declare extra columns with flags, not headings
const legacyHeadings = function (named) {
  const headings = ['#', 'date', 'opponent', 'score', 'win', 'loss', 'save', 'attendance', 'record']
  if (named.stadium === 'y') {
    headings.splice(7, 0, 'stadium') //save, stadium, attendance
  }
  if (named.time === 'y') {
    headings.splice(7, 0, 'time') //save, time, stadium, attendance
  }
  if (named.box === 'y') {
    headings.push('box') //record, box
  }
  return headings
}

// read named + positional params from the opening template
const parseOpener = function (inner) {
  const named: Record<string, string> = {}
  const positional: string[] = []
  splitParams(inner)
    .slice(1) //drop the template name
    .forEach((p) => {
      const m = p.match(/^ *([a-z][\w-]*) *=([\s\S]*)/i)
      if (m) {
        named[m[1].toLowerCase()] = m[2].trim()
      } else if (p.trim()) {
        positional.push(p.trim())
      }
    })
  return { named, positional }
}

// keep each row flat, plus win/loss styling + link targets when present
const simplifyRows = function (rows) {
  return rows.map((row) => {
    const out: Record<string, unknown> = {}
    let links: Record<string, string> | null = null
    Object.keys(row).forEach((k) => {
      out[k] = row[k].text || ''
      const cellLinks = row[k].links
      if (cellLinks && cellLinks[0] && cellLinks[0].page) {
        links = links || {}
        links[k] = cellLinks[0].page
      }
    })
    if (links) {
      out.rowLinks = links
    }
    if (row._attrs) {
      out.rowAttrs = row._attrs
    }
    return out
  })
}

const parseLog = function (wiki, section, opts) {
  const open = wiki.match(openReg)
  const inner = wiki.slice(open.index + 2, templateEnd(wiki, open.index) - 2)
  const { named, positional } = parseOpener(inner)
  // modern templates list their column headings as positional params
  const headings = positional.length > 1 ? positional : legacyHeadings(named)
  let rowText = wiki.slice(templateEnd(wiki, open.index)).replace(closeReg, '')
  // html-syntax runs after this stage, so drop inline formatting tags ourselves
  rowText = rowText.replace(/<\/?(?:span|small|big|sup|sub|center|[biu])[^>]*>/gi, '')
  // rows still hold inline templates, which single-pipe cell parsing would garble
  const parsed = parseTemplates(rowText, opts)
  section.templates.push(...parsed.templates)
  section.references.push(...parsed.references)
  rowText = parsed.remaining
  const table = '{|\n! ' + headings.join(' !! ') + '\n' + rowText + '\n|}'
  const rows = simplifyRows(tableParser(table, opts).rows || [])
  const data: { rows: object[]; title?: string } = { rows }
  if (named.title || named.month) {
    data.title = named.title || named.month
  }
  return data
}

const parseGameLogs = function (section: SectionData, opts: DocInfo = defaults) {
  let text = section.remaining
  let out = ''
  let open = text.match(openReg)
  while (open) {
    const close = text.match(closeReg)
    if (!close || close.index < open.index) {
      break //unclosed or stray end - leave the rest alone
    }
    const end = close.index + close[0].length
    const wiki = text.slice(open.index, end)
    section.templates.push(makeResult(wiki, 'game log section', parseLog(wiki, section, opts), '', opts))
    out += text.slice(0, open.index)
    text = text.slice(end)
    open = text.match(openReg)
  }
  section.remaining = out + text
  return section
}
export default parseGameLogs
