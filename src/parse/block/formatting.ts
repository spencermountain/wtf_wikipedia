import type { BlockData } from '../../types/index.ts'

const shift = (offset: number, start: number, length: number) => {
  return offset - Math.min(length, Math.max(0, offset - start))
}

// Keep earlier spans aligned as later passes remove nested markers.
const remove = (block: BlockData, start: number, length: number) => {
  if (block.bolds) {
    block.bolds.forEach((span) => {
      span.start = shift(span.start, start, length)
      span.end = shift(span.end, start, length)
    })
  }
  if (block.italics) {
    block.italics.forEach((span) => {
      span.start = shift(span.start, start, length)
      span.end = shift(span.end, start, length)
    })
  }
}

const parse = (block: BlockData, source, pattern: RegExp, trim: number, groups: ('bolds' | 'italics')[]) => {
  let removed = 0
  const sources = []
  // Mask consumed markers without shifting original source offsets.
  source.text = source.text.replace(pattern, (match, _text, offset) => {
    sources.push(block.wiki.slice(offset, offset + match.length))
    return ' '.repeat(trim) + match.slice(trim, -trim) + ' '.repeat(trim)
  })
  let index = 0
  block.text = block.text.replace(pattern, (match, _text, offset) => {
    const wiki = sources[index] || ''
    index += 1
    const start = offset - removed
    const text = match.slice(trim, -trim)
    remove(block, start + match.length - trim, trim)
    remove(block, start, trim)
    groups.forEach((group) => {
      block[group] = block[group] || []
      block[group].push({ text, wiki, start, end: start + text.length })
    })
    removed += trim * 2
    return text
  })
}

// Offsets use JavaScript string indices into the final plain text.
const parseFormatting = (block: BlockData) => {
  block.text = block.text || ''
  if (!block.text.includes("''")) {
    return block
  }
  const source = { text: block.wiki || '' }
  // Link labels are already flattened; their internal quotes are not formatting.
  block.links?.forEach((link) => {
    source.text = source.text.replace(link.wiki, ' '.repeat(link.wiki.length))
  })
  // block.bolds = []
  // block.italics = []
  parse(block, source, /'''''(.{0,2500}?)'''''/g, 5, ['bolds', 'italics'])
  // Four apostrophes retain a literal quote on each side.
  parse(block, source, /''''(.{0,2500}?)''''/g, 3, ['bolds'])
  parse(block, source, /'''(.{0,2500}?)'''/g, 3, ['bolds'])
  parse(block, source, /''(.{0,2500}?)''/g, 2, ['italics'])

  // update text for each span
  if (block.bolds) {
    block.bolds.forEach((span) => {
      span.text = block.text.slice(span.start, span.end)
    })
  }
  if (block.italics) {
    block.italics.forEach((span) => {
      span.text = block.text.slice(span.start, span.end)
    })
  }
  return block
}
export default parseFormatting
