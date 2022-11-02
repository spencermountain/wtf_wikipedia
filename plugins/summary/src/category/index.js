import chooseCat from './01-choose.js'
import change from './02-change.js'

function byCategory (doc, options) {
  let cat = chooseCat(doc)
  if (!cat) {
    return ''
  }
  return change(cat, options)
}
export default byCategory
