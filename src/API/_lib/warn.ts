/* eslint-disable no-console */
// wikimedia communicates through terse http status-codes.
// pretty-print a console.warn() explaining each one in plain-english,
// colored for both terminals (ansi) and browser devtools (%c css).
// see https://www.mediawiki.org/wiki/Wikimedia_APIs/Rate_limits

const explain = {
  400: {
    title: 'bad request',
    why: `the api couldn't understand the request - usually a malformed title or parameter.`,
    fix: `double-check the page title and any fetch options.`,
  },
  403: {
    title: 'request blocked',
    why: `wikimedia requires a descriptive User-Agent header, and blocks empty or generic ones.`,
    fix: `identify yourself:  wtf.fetch(title, { 'Api-User-Agent': 'my-app/1.0 (me@example.com)' })`,
  },
  404: {
    title: 'api not found',
    why: `no api exists at this url - the domain or path may be wrong.`,
    fix: `check the 'domain' and 'path' options - many wikis use 'w/api.php'.`,
  },
  408: {
    title: 'request timeout',
    why: `the server gave-up waiting for this request.`,
    fix: `try again in a moment, or fetch fewer pages at once.`,
  },
  414: {
    title: 'url too long',
    why: `too many page-titles (or very-long ones) packed into one request.`,
    fix: `fetch fewer pages at a time.`,
  },
  429: {
    title: 'too many requests',
    why: `wikimedia wants you to slow down - anonymous clients get ~10 requests/minute.`,
    fix: `run requests one-at-a-time, add a delay between them, and set an Api-User-Agent with contact-info.`,
  },
  500: {
    title: 'wikimedia server error',
    why: `something went wrong on their end, not yours.`,
    fix: `wait a moment and retry.`,
  },
  502: {
    title: 'bad gateway',
    why: `a wikimedia proxy couldn't reach its api servers.`,
    fix: `wait a moment and retry.`,
  },
  503: {
    title: 'servers overloaded',
    why: `wikimedia's servers are temporarily overloaded, or down for maintenance.`,
    fix: `wait ~5 seconds and retry - back-off longer if it continues.`,
  },
  504: {
    title: 'gateway timeout',
    why: `the api servers took too-long to respond.`,
    fix: `wait a moment and retry.`,
  },
}

// a 200-ok response can still carry an error payload in its json
const apiErrors = {
  ratelimited: {
    title: 'rate-limited',
    why: `you've hit a wikimedia rate-limit.`,
    fix: `slow down - run requests one-at-a-time, with a delay between them.`,
  },
  maxlag: {
    title: 'servers lagged',
    why: `wikimedia's databases are busy, and are asking non-urgent clients to wait.`,
    fix: `wait ~5 seconds, then retry.`,
  },
}

// browser devtools style text with %c + css
const inBrowser = function () {
  return typeof globalThis.window !== 'undefined' && typeof globalThis.window.document !== 'undefined'
}

// respect NO_COLOR, and piped (non-tty) output in node
const wantsAnsi = function () {
  if (typeof process === 'undefined' || !process.stderr) {
    return false
  }
  if (process.env.NO_COLOR) {
    return false
  }
  return process.stderr.isTTY === true
}

// avoid spamming the same warning in a tight loop
let lastWarn = {}
const shouldWarn = function (key) {
  let now = Date.now()
  if (lastWarn[key] && now - lastWarn[key] < 5000) {
    return false
  }
  lastWarn[key] = now
  return true
}

const render = function (head, why, fix, url) {
  if (inBrowser()) {
    console.warn(
      `%c⚠ wtf_wikipedia  %c${head}\n%c  ${why}\n%c  → ${fix}%c${url ? '\n  ' + url : ''}`,
      'color:#999',
      'color:#e6a23c; font-weight:bold',
      'color:inherit',
      'color:#3a7bd5',
      'color:#999'
    )
    return
  }
  const y = '\x1b[33m' // yellow
  const b = '\x1b[1m' // bold
  const c = '\x1b[36m' // cyan
  const d = '\x1b[2m' // dim
  const r = '\x1b[0m' // reset
  if (wantsAnsi()) {
    console.warn(`${d}⚠ wtf_wikipedia${r}  ${b}${y}${head}${r}\n  ${why}\n  ${c}→ ${fix}${r}${url ? `\n  ${d}${url}${r}` : ''}`)
    return
  }
  // plain-text fallback
  console.warn(`⚠ wtf_wikipedia  ${head}\n  ${why}\n  → ${fix}${url ? '\n  ' + url : ''}`)
}

// a non-2xx http response
const warnHttp = function (status, url, retryAfter) {
  if (!shouldWarn(`http-${status}`)) {
    return
  }
  let info = explain[status] || {
    title: 'request failed',
    why: `the wikimedia api responded with an http-${status} error.`,
    fix: `wait a moment and retry.`,
  }
  let why = info.why
  if (retryAfter) {
    why += `  (retry-after: ${retryAfter}s)`
  }
  render(`${status} - ${info.title}`, why, info.fix, url)
}

// fetch() itself rejected - the request never got a response
const warnNetwork = function (url, e) {
  if (!shouldWarn('network')) {
    return
  }
  // a response arrived, but its body wasn't json - likely an html error-page
  if (e && e.name === 'SyntaxError') {
    render(`bad response - ${e.message}`, `the response wasn't valid json.`, `check the url, and the 'path' option.`, url)
    return
  }
  let head = 'network error'
  if (e && e.message) {
    head += ` - ${e.message}`
  }
  let why = `the request never reached wikimedia - no network, a dns failure, or a blocked cors request.`
  let fix = `check your connection - in a browser, check cors and the 'origin' option.`
  render(head, why, fix, url)
}

// an error payload inside a 200-ok json response
const warnApi = function (error, url) {
  let code = error.code || 'error'
  if (!shouldWarn(`api-${code}`)) {
    return
  }
  let info = apiErrors[code] || {
    title: code,
    why: error.info || `the api returned an '${code}' error.`,
    fix: `see https://www.mediawiki.org/wiki/API:Errors_and_warnings`,
  }
  render(`api ${info.title}`, info.why, info.fix, url)
}

// a library api that no longer exists
const warnDeprecated = function (head, why, fix) {
  if (!shouldWarn(`deprecated-${head}`)) {
    return
  }
  render(head, why, fix, '')
}

export { warnHttp, warnNetwork, warnApi, warnDeprecated }
