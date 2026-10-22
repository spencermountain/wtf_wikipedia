import type { BlockData } from '../../types/index.ts'

const shift = (offset: number, start: number, length: number) => {
  return offset - Math.min(length, Math.max(0, offset - start))
}

// Keep earlier spans aligned as later passes remove nested markers.
const remove = (block: BlockData, start: number, length: number) => {
  block.bolds.concat(block.italics).forEach((span) => {
    span.start = shift(span.start, start, length)
    span.end = shift(span.end, start, length)
  })
}

const parse = (block: BlockData, pattern: RegExp, trim: number, groups: ('bolds' | 'italics')[]) => {
  let removed = 0
  block.text = block.text.replace(pattern, (match, _text, offset) => {
    const start = offset - removed
    const text = match.slice(trim, -trim)
    remove(block, start + match.length - trim, trim)
    remove(block, start, trim)
    groups.forEach((group) => {
      block[group].push({ text, start, end: start + text.length })
    })
    removed += trim * 2
    return text
  })
}

// Offsets use JavaScript string indices into the final plain text.
const parseFormatting = (block: BlockData) => {
  block.text = block.text || ''
  block.bolds = []
  block.italics = []
  parse(block, /'''''(.{0,2500}?)'''''/g, 5, ['bolds', 'italics'])
  // Four apostrophes retain a literal quote on each side.
  parse(block, /''''(.{0,2500}?)''''/g, 3, ['bolds'])
  parse(block, /'''(.{0,2500}?)'''/g, 3, ['bolds'])
  parse(block, /''(.{0,2500}?)''/g, 2, ['italics'])

  block.bolds.concat(block.italics).forEach((span) => {
    span.text = block.text.slice(span.start, span.end)
  })
  return block
}
export default parseFormatting
