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

export { rename, translate }
