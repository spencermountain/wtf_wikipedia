import parse from '../../parse/toJSON/index.js'

// dummy templates that get parsed properly already,
// but present here for for aliases + template coverage tests
let templates = {}
let dummies = ['citation needed']
dummies.forEach((name) => {
  // just parse it and do nothing
  templates[name] = (tmpl, list) => {
    list.push(parse(tmpl))
    return ''
  }
})
export default templates
