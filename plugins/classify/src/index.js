import byInfobox from './byInfobox/index.js'
import byCategory from './byCategory/index.js'
import byTemplate from './byTemplate/index.js'
import bySection from './bySection/index.js'
import byTitle from './byTitle/index.js'
import byDescription from './byDescription/index.js'
import skipPage from './_skip/index.js'
import score from './score.js'

function plugin (models) {
  //add a new method to main class
  models.Doc.prototype.classify = function () {
    let doc = this
    let res = {}

    //dont classify these
    if (skipPage(doc)) {
      return score(res)
    }

    //look for 'infobox person', etc
    res.infobox = byInfobox(doc)

    //look for '{{coord}}'
    res.template = byTemplate(doc)

    //look for '==early life=='
    res.section = bySection(doc)

    //look for 'foo (film)'
    res.title = byTitle(doc)

    //look for 'foo (film)'
    res.description = byDescription(doc)

    //look for 'Category: 1992 Births', etc
    res.category = byCategory(doc)
    return score(res)
  }
}
export default plugin
