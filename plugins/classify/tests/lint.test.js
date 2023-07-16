import test from 'tape'
import schema from '../schema/index.js'


test('schema-lint', function (t) {
  const validate = function (obj, isRoot) {
    if (!isRoot) {
      t.ok(obj.name || isRoot, `${obj.name} has name`)
      t.ok(obj.children, `${obj.name} has children`)
      t.ok(obj.categories, `${obj.name} has categories`)
      t.ok(obj.descriptions, `${obj.name} has descriptions`)
      t.ok(obj.infoboxes, `${obj.name} has infoboxes`)
      t.ok(obj.sections, `${obj.name} has sections`)
      t.ok(obj.templates, `${obj.name} has templates`)
      t.ok(obj.titles, `${obj.name} has titles`)
      // no spaces allowed in infoboxes
      obj.infoboxes.mapping.forEach(k => {
        if (k.match(/ /)) {
          t.ok(false, `${obj.name} has infobox '${k}'`)
        }
      })
      // no spaces allowed in templates
      obj.templates.mapping.forEach(k => {
        if (k.match(/_/)) {
          t.ok(false, `${obj.name} has templates '${k}'`)
        }
      })
      // categories use spaces
      obj.categories.mapping.forEach(k => {
        if (k.match(/_/)) {
          t.ok(false, `${obj.name} has category '${k}'`)
        }
        if (k.match(/[A-Z]/)) {
          t.ok(false, `${obj.name} uppercase category '${k}'`)
        }
      })
    }
    Object.keys(obj.children || {}).forEach(k => validate(obj.children[k]))
  }
  validate(schema, true)
  t.end()
})


test('no-dupe-templates', function (t) {
  let all = new Set()
  const validate = function (obj, isRoot) {
    if (!isRoot) {
      (obj.templates.mapping || []).forEach(k => {
        if (all.has(k)) {
          t.ok(false, `dupe template ${k}`)
        }
        all.add(k)
      })
    }
    Object.keys(obj.children || {}).forEach(k => validate(obj.children[k]))
  }
  validate(schema, true)
  t.end()
})

test('no-dupe-infoboxes', function (t) {
  let all = new Set()
  const validate = function (obj, isRoot) {
    if (!isRoot) {
      (obj.infoboxes.mapping || []).forEach(k => {
        if (all.has(k)) {
          t.ok(false, `dupe template ${k}`)
        }
        all.add(k)
      })
    }
    Object.keys(obj.children || {}).forEach(k => validate(obj.children[k]))
  }
  validate(schema, true)
  t.end()
})
