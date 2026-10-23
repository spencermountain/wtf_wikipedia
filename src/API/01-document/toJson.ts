// The default document output includes metadata and parsed sections.
const toJSON = (doc) => {
  let data: any = { wiki: doc.wikitext() }

  data.title = doc.title

  // present only if true
  if (doc.isRedirect() === true) {
    data.isRedirect = true
    data.redirectTo = doc.redirectTo()
    data.sections = []
  }
  if (doc.isStub() === true) {
    data.isStub = true
  }
  if (doc.isDisambiguation() === true) {
    data.isDisambiguation = true
  }

  // metadata
  if (doc.pageID) {
    data.pageID = doc.pageID
  }
  if (doc.wikidata) {
    data.wikidata = doc.wikidata
  }
  let desc = doc.description
  if (desc) {
    data.description = desc
  }

  // page sections
  data.categories = doc.categories()
  data.categoryDetails = doc.categoryDetails()
  data.sections = doc.sections().map((i) => i.json())

  return data
}
export default toJSON
