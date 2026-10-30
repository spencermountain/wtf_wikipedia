import strip from '../../parse/templates/parse/toJSON/_strip.ts'
import pipeSplitter from '../../parse/templates/parse/toJSON/01-pipe-splitter.ts'
import { toText, toTextBritish, ymd } from '../text-and-data/dates/_format.ts'
import languages from '../../_data/languages.ts'

// MediaWiki parser functions - https://www.mediawiki.org/wiki/Help:Extension:ParserFunctions
// {{#if: test | then | else }} - the first ':' separates the function name from its first argument

// raw positional arguments, keeping '=' intact (a #switch key may contain one)
const rawArgs = (tmpl: string) => {
  tmpl = strip(tmpl).replace(/^[^:|]*:/, '')
  return pipeSplitter(tmpl)
}

// ---- #expr ----
// a small precedence-climbing evaluator for the #expr grammar
const fns1 = {
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  trunc: Math.trunc,
  ln: Math.log,
  exp: Math.exp,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  not: (n) => (n ? 0 : 1),
}
const consts = { pi: Math.PI, e: Math.E }
// lower number binds looser
const binary = {
  or: [1, (a, b) => (a || b ? 1 : 0)],
  and: [2, (a, b) => (a && b ? 1 : 0)],
  '=': [3, (a, b) => (a === b ? 1 : 0)],
  '!=': [3, (a, b) => (a !== b ? 1 : 0)],
  '<>': [3, (a, b) => (a !== b ? 1 : 0)],
  '<': [3, (a, b) => (a < b ? 1 : 0)],
  '>': [3, (a, b) => (a > b ? 1 : 0)],
  '<=': [3, (a, b) => (a <= b ? 1 : 0)],
  '>=': [3, (a, b) => (a >= b ? 1 : 0)],
  round: [4, (a, b) => Number(a.toFixed(Math.max(0, Math.min(b, 20))))],
  '+': [5, (a, b) => a + b],
  '-': [5, (a, b) => a - b],
  '*': [6, (a, b) => a * b],
  '/': [6, (a, b) => a / b],
  div: [6, (a, b) => a / b],
  mod: [6, (a, b) => a % b],
  fmod: [6, (a, b) => a % b],
  '^': [7, (a, b) => Math.pow(a, b)],
  e: [8, (a, b) => a * Math.pow(10, b)],
}
const tokenize = (str: string) => {
  let tokens = []
  let re = /\s*(\d+\.?\d*|\.\d+|[a-z]+|<>|!=|<=|>=|[-+*/^()=<>])/giy
  let m
  let pos = 0
  while (pos < str.length) {
    re.lastIndex = pos
    m = re.exec(str)
    if (!m) {
      if (/^\s*$/.test(str.slice(pos))) {
        break
      }
      throw new Error('bad token')
    }
    tokens.push(m[1].toLowerCase())
    pos = re.lastIndex
  }
  return tokens
}
const evaluate = (str: string) => {
  const tokens = tokenize(str)
  let i = 0
  const peek = () => tokens[i]
  const next = () => tokens[i++]
  // primary and expression are mutually recursive
  /* eslint-disable @typescript-eslint/no-use-before-define */
  function primary() {
    let tok = next()
    if (tok === undefined) {
      throw new Error('missing operand')
    }
    if (tok === '(') {
      let val = expression(0)
      if (next() !== ')') {
        throw new Error('unclosed parenthesis')
      }
      return val
    }
    if (tok === '-') {
      return -primary()
    }
    if (tok === '+') {
      return primary()
    }
    if (Object.hasOwn(fns1, tok)) {
      // unary functions bind tighter than every binary operator except 'e'
      return fns1[tok](expression(7))
    }
    if (Object.hasOwn(consts, tok) && peek() !== undefined && !Object.hasOwn(binary, peek()) && tok === 'e') {
      throw new Error('bad e')
    }
    if (Object.hasOwn(consts, tok)) {
      return consts[tok]
    }
    if (/^[0-9.]+$/.test(tok)) {
      return Number(tok)
    }
    throw new Error('unexpected ' + tok)
  }
  function expression(minPrec) {
    let left = primary()
    while (true) {
      let op = peek()
      if (op === undefined || !Object.hasOwn(binary, op) || binary[op][0] < minPrec) {
        break
      }
      next()
      let right = expression(binary[op][0] + 1)
      left = binary[op][1](left, right)
    }
    return left
  }
  /* eslint-enable @typescript-eslint/no-use-before-define */
  let val = expression(0)
  if (i < tokens.length) {
    throw new Error('trailing tokens')
  }
  return val
}
// '2.0000000000000004' → '2', keep 14 significant digits like php
const fmtNumber = (n: number) => {
  // mediawiki renders 'Division by zero' errors, which we drop
  if (!Number.isFinite(n)) {
    return null
  }
  n = Number(n.toPrecision(14))
  return String(n)
}
const expr = (str: string) => {
  try {
    return fmtNumber(evaluate(str))
  } catch {
    return null
  }
}

const isNumeric = (str = '') => {
  str = str.trim()
  return /\d/.test(str) && /^[-+]?[\d.]+(e[-+]?\d+)?$/i.test(str) && str.split('.').length <= 2
}

const templates = {
  // {{#expr: 1 + 2 }} → 3
  '#expr': (tmpl) => {
    let [str = ''] = rawArgs(tmpl)
    return { data: null, replacement: expr(str) ?? '' }
  },
  // {{#if: test | then | else }}
  '#if': (tmpl) => {
    let [test = '', then = '', other = ''] = rawArgs(tmpl)
    return { data: null, replacement: test.trim() ? then : other }
  },
  // {{#ifeq: a | b | then | else }}
  '#ifeq': (tmpl) => {
    let [a = '', b = '', then = '', other = ''] = rawArgs(tmpl)
    let same = a.trim() === b.trim()
    if (isNumeric(a) && isNumeric(b)) {
      same = Number(a) === Number(b)
    }
    return { data: null, replacement: same ? then : other }
  },
  // {{#ifexpr: 1 > 0 | then | else }}
  '#ifexpr': (tmpl) => {
    let [test = '', then = '', other = ''] = rawArgs(tmpl)
    let val = test.trim() === '' ? 0 : Number(expr(test))
    if (Number.isNaN(val)) {
      return { data: null, replacement: '' }
    }
    return { data: null, replacement: val ? then : other }
  },
  // {{#iferror: {{#expr:1/0}} | error | ok }} - we can't see the error html, so test the expression
  '#iferror': (tmpl) => {
    let [test = '', error, ok] = rawArgs(tmpl)
    let isError = test.trim() === '' || /class="error"|<strong class="error|Expression error/i.test(test)
    if (isError) {
      return { data: null, replacement: error ?? '' }
    }
    return { data: null, replacement: ok ?? test }
  },
  // {{#switch: val | a = 1 | b | c = 2 | #default = 3 }}
  '#switch': (tmpl) => {
    let [val = '', ...cases] = rawArgs(tmpl)
    val = val.trim()
    let fallthrough = false
    let fallback = null
    for (let i = 0; i < cases.length; i += 1) {
      let c = cases[i]
      let eq = c.indexOf('=')
      if (eq === -1) {
        // a bare value: a lone last one is the default, otherwise it falls through
        if (i === cases.length - 1) {
          if (fallthrough) {
            return { data: null, replacement: c }
          }
          fallback = c
        } else if (c.trim() === val) {
          fallthrough = true
        }
        continue
      }
      let key = c.slice(0, eq).trim()
      let out = c.slice(eq + 1).trim()
      if (fallthrough || key === val || (isNumeric(key) && isNumeric(val) && Number(key) === Number(val))) {
        return { data: null, replacement: out }
      }
      if (key === '#default') {
        fallback = out
      }
    }
    return { data: null, replacement: fallback ?? '' }
  },
  // {{#language: fr }} → français (we return the native name, like mediawiki)
  '#language': (tmpl) => {
    let [code = ''] = rawArgs(tmpl)
    code = code.trim().toLowerCase()
    return { data: null, replacement: languages[code] || code }
  },
  // {{#titleparts: Talk:Foo/Bar/Baz | 1 | 2 }} → Bar
  '#titleparts': (tmpl) => {
    let [title = '', count = '', first = ''] = rawArgs(tmpl)
    let parts = title.trim().split('/')
    let n = parseInt(count, 10) || 0
    let start = parseInt(first, 10) || 1
    if (start < 0) {
      start = parts.length + start + 1
    }
    let arr = parts.slice(start - 1)
    if (n > 0) {
      arr = arr.slice(0, n)
    } else if (n < 0) {
      arr = arr.slice(0, n)
    }
    return { data: null, replacement: arr.join('/') }
  },
  // {{#time: j F Y | 2001-05-03 }} - a few common php date formats
  '#time': (tmpl) => {
    let [format = '', date = ''] = rawArgs(tmpl)
    format = format.trim()
    let m = date.trim().match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/)
    let d = m ? ymd([m[1], m[2], m[3] || '1']) : null
    if (!d) {
      let now = new Date()
      d = ymd([now.getFullYear(), now.getMonth() + 1, now.getDate()])
    }
    const pad = (n) => String(n).padStart(2, '0')
    const months = toText({ year: 2000, month: d.month, date: 1 }).replace(/ 1, 2000$/, '')
    const known = {
      'Y-m-d': `${d.year}-${pad(d.month)}-${pad(d.date)}`,
      'j F Y': toTextBritish(d),
      'F j, Y': toText(d),
      'd F Y': `${pad(d.date)} ${months} ${d.year}`,
      'F Y': `${months} ${d.year}`,
      Y: String(d.year),
      F: months,
      j: String(d.date),
      'd/m/Y': `${pad(d.date)}/${pad(d.month)}/${d.year}`,
      'm/d/Y': `${pad(d.month)}/${pad(d.date)}/${d.year}`,
    }
    if (Object.hasOwn(known, format)) {
      return { data: null, replacement: known[format] }
    }
    return { data: null, replacement: date.trim() }
  },
}
export default templates
