// type-only test for the require() entrypoint (types/index.d.cts)
import wtf = require('wtf_wikipedia')

const doc: wtf.Document = wtf('hello [[world]]')
const secs: wtf.Section[] = doc.sections()
const sens: wtf.Sentence[] = doc.sentences()
const lj: wtf.LinkJson | undefined = doc.links()[0]?.json()
const opts: wtf.DocumentOptions = doc.options()
const v: string = wtf.version
console.log(secs, sens, lj, opts, v)

const plug: wtf.Plugin = (models: wtf.Models) => {
  console.log(models.Doc.prototype)
}
wtf.extend(plug)
wtf.fetch(['a', 'b']).then((docs) => console.log(docs.length))

// Namespace IDs from MediaWiki are numeric, including main namespace 0.
const numericNamespace: string | number | null = wtf('', { namespace: 0 }).namespace()
const aliasNamespace: string | number | null = wtf('', { ns: 0 }).ns(0)
console.log(numericNamespace, aliasNamespace)
