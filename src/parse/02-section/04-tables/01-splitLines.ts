const splitLines = (wiki: string) => {
  return wiki
    .replace(/\r/g, '')
    // Scan each whitespace run once, including runs before table markers.
    .replace(/\n\s*/g, (space, offset, text) => {
      const next = text[offset + space.length]
      return next && !'|!{'.includes(next) ? ' ' + space.slice(1) : space
    }) //remove unecessary newlines
    .split(/\n/)
    .map((l) => l.trim())
}

export default splitLines
