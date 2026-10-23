const positions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// Compact registry declarations all resolve to the same handler result.
const parseShortcut = (handler, wiki, parse) => {
  if (typeof handler === 'number') {
    const data = parse(wiki, positions)
    return { data: null, replacement: data[String(handler)] || '' }
  }
  if (typeof handler === 'string') {
    return { data: null, replacement: handler }
  }
  if (Array.isArray(handler)) {
    return { data: parse(wiki, handler), replacement: '' }
  }
  if (handler && typeof handler === 'object') {
    const data = parse(wiki, handler.props)
    return { data, replacement: data[handler.out] || '' }
  }
  return { data: parse(wiki), replacement: '' }
}

export default parseShortcut
