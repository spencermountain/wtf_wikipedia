import test from 'tape'
import wtf from '../../../src/index.ts'

const links = '[[Target page|Label]] and [https://example.org source]'
const examples = [
  ['sentence / paragraph', `Text ${links}.`],
  ['section body', `Intro.\n\n== Heading ==\nText ${links}.`],
  ['section heading', `== ${links} ==\nBody.`],
  ['list items', `* ${links}\n* Another item`],
  ['table cell', `{|\n! Column\n|-\n| ${links}\n|}`],
  ['table header', `{|\n! ${links}\n|-\n| Value\n|}`],
  ['infobox field', `{{Infobox person|name=${links}}}`],
  ['inline reference', `Claim.<ref>${links}</ref>`],
  ['named reference', `Claim.<ref name="a">${links}</ref> Again.<ref name="a" />`],
  ['citation reference', `Claim.<ref>{{cite book|title=Book|publisher=${links}}}</ref>`],
  ['mixed reference', `Claim.<ref>{{cite book|title=Book}} See ${links}.</ref>`],
  ['template argument', `{{example|value=${links}}}`],
  ['rendered template', `{{small|${links}}}`],
  ['image caption', `[[File:Cool.jpg|thumb|${links}]]`],
  ['gallery caption', `<gallery>\nFile:Cool.jpg|${links}\n</gallery>`],
  ['infobox image caption', `{{Infobox person|image=Cool.jpg|caption=${links}}}`],
]

examples.forEach(([name, wiki]) => {
  test(`Document.links() includes links from ${name}`, (t) => {
    const found = wtf(wiki)
      .links()
      .map((link) => link.json())
    const foundInternal = found.some(
      (link) => link.type === 'internal' && link.page === 'Target page' && link.text === 'Label'
    )
    t.ok(foundInternal, `${name}: internal links  ${JSON.stringify(found)}`)

    const foundExternal = found.some(
      (link) => link.type === 'external' && link.site === 'https://example.org' && link.text === 'source'
    )
    t.ok(foundExternal, `${name}: external links ${JSON.stringify(found)}`)
    t.end()
  })
})
