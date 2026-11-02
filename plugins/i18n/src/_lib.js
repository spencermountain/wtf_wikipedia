// shared helpers for the language packs

// move localized parameter names onto the english ones core reads; existing english keys win
const rename = (obj, map) => {
  Object.keys(map).forEach((from) => {
    if (obj[from] !== undefined && obj[map[from]] === undefined) {
      obj[map[from]] = obj[from]
      delete obj[from]
    }
  })
  return obj
}

// a core-style parser that renames localized params, then hands off to an existing core parser:
//   'lien web': translate('cite web', { titre: 'title', auteur: 'author' })
const translate = (key, map) => {
  const fn = (tmpl, parse, opts, templates) => {
    const localized = (t, order, format) => {
      const obj = parse(t, order, format)
      if (format === 'raw' || format === 'json' || format === 'block') {
        return obj
      }
      return rename(obj, map)
    }
    return templates[key](tmpl, localized, opts)
  }
  fn.kind = /^cite /.test(key) ? 'citation' : key
  fn.template = key
  fn.map = map // 04-diff.js reads this to compare against live TemplateData
  return fn
}

// expand a core-style shorthand definition into a parser fn (mirrors core src/templates/_shortcuts.ts):
//   'гео': ['lat', 'lon', 'zoom']   → parse positional params into named data
//   'имя': 1                        → the text of that pipe
//   'флаг': '🏴'                     → static replacement text
//   'возраст': { props: [...], out: 'age' } → parse props, output one of them
const positions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const fromShortcut = (def) => {
  return (tmpl, parse) => {
    if (typeof def === 'number') {
      const data = parse(tmpl, positions)
      return { data: null, replacement: data[String(def)] || '' }
    }
    if (typeof def === 'string') {
      return { data: null, replacement: def }
    }
    if (Array.isArray(def)) {
      return { data: parse(tmpl, def), replacement: '' }
    }
    if (def && typeof def === 'object') {
      const data = parse(tmpl, def.props)
      return { data, replacement: data[def.out] || '' }
    }
    return { data: parse(tmpl), replacement: '' }
  }
}

export { rename, translate, fromShortcut }
