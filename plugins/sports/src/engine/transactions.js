import { getCell, withChildren } from '../_lib.js'
import { fromTable } from './rows.js'

// a transactions / transfers block starts at one of these sections
const anchor = /^(player )?(transactions?|transfers?|roster (changes|moves)|free agency)$/i

// subsection titles name the kind of move - first match wins
const kinds = [
  [/^trades?$/i, 'trade'],
  [/^(signings?|free agency|re-?signed|additions?|arrivals?|new contracts?|contract (operations|extensions))$/i, 'signing'],
  [/^players? acquired$/i, 'signing'],
  [/^(departures?|subtractions?|released|players? lost)$/i, 'release'],
  [/^waivers?$/i, 'waiver'],
  [/^(transfers? |transferred )?in$/i, 'transfer in'],
  [/^(transfers? |transferred )?out$/i, 'transfer out'],
  [/^loan(s|ed)? ?in$/i, 'loan in'],
  [/^loan(s|ed)? ?out$/i, 'loan out'],
  [/^loans?$/i, 'loan'],
  [/^transfers?$/i, 'transfer'],
  [/draft/i, 'draft'],
]

const kindOf = function (title = '') {
  const t = title.trim()
  const found = kinds.find(([reg]) => reg.test(t))
  return found ? found[1] : null
}

// classify a prose row - 'placed X on the 15-day injured list' and friends
const verbs = [
  [/injured (list|reserve)|disabled list/i, 'injured list'],
  [/\btraded?\b|\bacquired\b/i, 'trade'],
  [/\bwaiv/i, 'waiver'],
  [/\breleased?\b/i, 'release'],
  [/\bclaimed\b/i, 'claim'],
  [/\bdraft(ed)?\b/i, 'draft'],
  [/\bloan(ed)?\b/i, 'loan'],
  [/re-?signed|\bsigned\b|new contract|extension/i, 'signing'],
  [/option(ed)?|recall(ed)?|outright(ed)?|designated .{0,40}for assignment|selected the contract|activated|called up/i, 'roster move'],
  [/\bretired?\b/i, 'retired'],
]

const classify = function (text = '') {
  const found = verbs.find(([reg]) => reg.test(text))
  return found ? found[1] : null
}

// flag icons render as emoji - strip them from table text
const deflag = function (str = '') {
  return String(str)
    .replace(/[^\p{L}\p{N} .,:;&'()/–-]/gu, '')
    .replace(/ {2,}/g, ' ')
    .trim()
}

const dateLike = /^\d{1,2} [a-z]+ \d{4}$|^[a-z]+\.? \d{1,2}(,? \d{4})?$/i
const noise = /^(date|ref|source|notes?)/i

// find the date cell, even in header-less col1/col2 tables
const findDate = function (cells) {
  const date = getCell(cells, ['date', 'date signed', 'date announced', 'moving date'])
  if (date) {
    return String(date).trim()
  }
  const key = Object.keys(cells).find((k) => dateLike.test(String(cells[k]).trim()))
  return key ? String(cells[key]).trim() : ''
}

// one table row → one transaction
const buildRow = function (row, kind) {
  const date = findDate(row.cells)
  const player = deflag(getCell(row.cells, ['player', 'personnel', 'name']))
  const text = Object.entries(row.cells)
    .filter(([k, v]) => v && noise.test(k.trim()) === false && String(v).trim() !== date)
    .map(([, v]) => deflag(v))
    .filter(Boolean)
    .join(' - ')
  if (!text) {
    return null
  }
  const res = { date, type: kind || classify(text), text }
  if (player) {
    res.player = player
  }
  return res
}

// one '* On March 30, placed...' bullet → one transaction
const buildBullet = function (line, kind) {
  let text = String(line).trim()
  let date = ''
  const m = text.match(/^On ([A-Z][a-z]+ \d{1,2}(?:, \d{4})?)[,:]? */)
  if (m) {
    date = m[1].replace(/,/g, '')
    text = text.slice(m[0].length)
  }
  if (!text) {
    return null
  }
  return { date, type: kind || classify(text), text }
}

const addYear = function (res, ctx) {
  if (res && res.date && ctx.dateYear) {
    res.date = ctx.dateYear(res.date, ctx.year)
  }
  return res
}

// every dated move under the page's transactions / transfers sections
const findTransactions = function (doc, ctx) {
  const out = []
  const seen = new Set()
  doc.sections().forEach((sec) => {
    if (seen.has(sec.index()) || anchor.test(sec.title().trim()) === false) {
      return
    }
    const stack = [] //nearest ancestor kind, by depth
    withChildren(doc, sec).forEach((s) => {
      seen.add(s.index())
      while (stack.length > 0 && stack[stack.length - 1].depth >= s.depth()) {
        stack.pop()
      }
      let kind = kindOf(s.title())
      for (let i = stack.length - 1; i >= 0 && kind === null; i -= 1) {
        kind = stack[i].kind
      }
      stack.push({ depth: s.depth(), kind })
      s.tables().forEach((t) => {
        let lastDate = '' //rowspan date cells only appear on their first row
        fromTable(t).forEach((row) => {
          const res = buildRow(row, kind)
          if (res) {
            res.date = res.date || lastDate
            lastDate = res.date
            out.push(addYear(res, ctx))
          }
        })
      })
      s.lists().forEach((l) => {
        const items = l.json().items || []
        items.forEach((item) => {
          const res = buildBullet(item.text, kind)
          if (res) {
            out.push(addYear(res, ctx))
          }
        })
      })
    })
  })
  return out
}

export default findTransactions
