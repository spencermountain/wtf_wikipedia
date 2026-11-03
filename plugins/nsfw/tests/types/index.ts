/* eslint-disable no-console */
import wtf from 'wtf_wikipedia'
import nsfwPlugin, { NsfwDocument, NsfwWarning, NsfwEvidence, NsfwType } from 'wtf-plugin-nsfw'

wtf.extend(nsfwPlugin)

// wtf_wikipedia doesn't export its Document class by name yet, so cast for now
const doc = wtf('[[Category:Brothels]]') as NsfwDocument
const warnings: NsfwWarning[] = doc.nsfw()

// an empty array means nothing was flagged
const safe: boolean = warnings.length === 0

// callers decide which warning types they allow
const blocked: NsfwType[] = ['sexuality', 'obscenity']
const allow: boolean = !warnings.some((w) => blocked.includes(w.type))

// evidence rows carry the matched name, source and raw data
const evidence: NsfwEvidence[] = warnings.flatMap((w) => w.evidence)
const names: string[] = evidence.map((e) => e.name)
const datas: (object | undefined)[] = evidence.map((e) => e.data)
console.log(safe, allow, names, datas)

// the plain Document api is still there
const text: string = doc.text()
console.log(text)

// fetched docs get the method too
wtf.fetch('One-night stand').then((d) => {
  if (d && !Array.isArray(d)) {
    console.log((d as NsfwDocument).nsfw().length)
  }
})
