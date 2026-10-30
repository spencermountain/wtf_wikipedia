// CJK scripts do not put spaces between sentences
const cjk = '\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Bopomofo}。、，！？：；「」『』（）'
const cjkEnd = new RegExp(`[${cjk}]$`, 'u')
const cjkStart = new RegExp(`^[${cjk}]`, 'u')

// join rendered sentences, deciding the separator from their plain text
const joinSentences = (sentences, render) =>
  sentences.reduce((str, s, i) => {
    const out = render(s)
    if (i === 0) {
      return out
    }
    if (cjkEnd.test(sentences[i - 1].text()) && cjkStart.test(s.text())) {
      return str + out
    }
    return str + ' ' + out
  }, '')

export default joinSentences
