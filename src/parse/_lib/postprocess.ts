import { trim_whitespace } from '../../_lib/helpers.ts'

function postprocess(line) {
  //remove empty parentheses (sometimes caused by removing templates)
  line = line.replace(/\([,;: ]*\)/g, '')
  //these semi-colons in parentheses are particularly troublesome
  line = line.replace(/\( *(; ?)+/g, '(')
  //dangling punctuation
  line = trim_whitespace(line)
  line = line.replace(/ \.$/, '.')

  // Most text has no entities at all; skip the decoding passes entirely.
  if (!line.includes('&')) {
    return line
  }
  // handle HTML entities
  line = line.replace(/&nbsp;/g, '\xa0')
  line = line.replace(/&ndash;/g, '–')
  line = line.replace(/&mdash;/g, '—')
  line = line.replace(/&amp;/g, '&')
  line = line.replace(/&quot;/g, '"')
  line = line.replace(/&apos;/g, "'")
  line = line.replace(/&copy;/g, '©')
  line = line.replace(/&reg;/g, '®')
  line = line.replace(/&trade;/g, '™')
  line = line.replace(/&lt;/g, '<')
  line = line.replace(/&gt;/g, '>')

  // numeric (decimal/hex) entities
  line = line.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
  line = line.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))

  return line
}

export default postprocess
