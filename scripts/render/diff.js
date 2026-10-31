// word-level diffs between a wikipedia sentence and ours, for eyeballing
const words = (str) => str.split(' ').filter((w) => w)

// the sentence of ours that shares the most words with theirs
const closest = (sentence, ourSentences) => {
  const want = new Set(words(sentence.toLowerCase()))
  let best = null
  let bestScore = 0
  ourSentences.forEach((sen) => {
    const have = words(sen.toLowerCase())
    const common = have.filter((w) => want.has(w)).length
    const score = (2 * common) / (have.length + want.size)
    if (score > bestScore) {
      bestScore = score
      best = sen
    }
  })
  return { sentence: best, score: bestScore }
}

// word-level diff by longest common subsequence
// → [{ type: 'same' | 'del' | 'add', text }]
const wordDiff = (a, b) => {
  const x = words(a)
  const y = words(b)
  const n = x.length
  const m = y.length
  const table = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1))
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      table[i][j] = x[i] === y[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  const out = []
  const push = (type, text) => {
    const last = out[out.length - 1]
    if (last && last.type === type) {
      last.text += ' ' + text
    } else {
      out.push({ type, text })
    }
  }
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (x[i] === y[j]) {
      push('same', x[i])
      i += 1
      j += 1
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      push('del', x[i])
      i += 1
    } else {
      push('add', y[j])
      j += 1
    }
  }
  while (i < n) {
    push('del', x[i++])
  }
  while (j < m) {
    push('add', y[j++])
  }
  return out
}

// 'the [-37 feet-]{+37 ft+} wall' - with colour on a terminal
const renderDiff = (parts, color = false) => {
  const red = (t) => (color ? `\x1b[31m${t}\x1b[0m` : `[-${t}-]`)
  const green = (t) => (color ? `\x1b[32m${t}\x1b[0m` : `{+${t}+}`)
  const paint = { del: red, add: green, same: (t) => t }
  return parts.map((p) => paint[p.type](p.text)).join(' ')
}

// the words that differ, for sorting trivial from meaningful: 'feet→ft'
const changes = (parts) => {
  const out = []
  for (let i = 0; i < parts.length; i += 1) {
    if (parts[i].type === 'del' && parts[i + 1]?.type === 'add') {
      out.push(`${parts[i].text}→${parts[i + 1].text}`)
      i += 1
    } else if (parts[i].type === 'del') {
      out.push(`-${parts[i].text}`)
    } else if (parts[i].type === 'add') {
      out.push(`+${parts[i].text}`)
    }
  }
  return out
}

export { closest, wordDiff, renderDiff, changes }
