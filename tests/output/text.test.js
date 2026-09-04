import test from 'tape'
import wtf from '../lib/index.js'

test('inline text', (t) => {
  const arr = [
    {
      from: `education of <nowiki>[the]</nowiki> students`,
      to: `education of [the] students`
    },
    {
      from: `in ({{Baseball year|1902}})`,
      to: `in (1902)`
    },
    //     {
    //       from: `650 students drawn from a
    // community that has one`,
    //       to: `650 students drawn from a community that has one`
    //     },
    //     {
    //       from: `{{fdate|8 March 2012|MDY}})`,
    //       to: ``
    //     },
    //     {
    //       from: `{{×|11.5|7.1}}`,
    //       to: ``
    //     },
    //     {
    //       from: `{{convert|190|lb|kg|abbr=on}}`,
    //       to: ``
    //     },
    {
      from: `before {{nowiki | TEXT }} after`,
      to: `before TEXT after`
    },
    {
      from: `before {{nowiki2 | TEXT }} after`,
      to: `before TEXT after`
    },
    {
      from: `before
{{#invoke:sports rbr table
|header=Round
|label1= Ground
}} after`,
      to: `before after`
    },
    {
      from: `{{div-col}}
* 2011: "Temple of Love"
* 2012: "Kannst du mich seh'n" (Remix)
{{div-col-end}}`,
      to: `
 * 2011: "Temple of Love"
 * 2012: "Kannst du mich seh'n" (Remix)`
    },
    // {
    //   from: ``,
    //   to: ``
    // },


  ]
  arr.forEach((o) => {
    const doc = wtf(o.from)
    t.equal(doc.text(), o.to, o.to)
  })
  t.end()
})


test('lists in text output', (t) => {
  const str = `
hello
* [http://www.abrahamlincolnassociation.org/ Abraham Lincoln Association]
* [http://www.lincolnbicentennial.org/ Abraham Lincoln Bicentennial Foundation]

`
  const doc = wtf(str)
  const want = `hello
 * Abraham Lincoln Association
 * Abraham Lincoln Bicentennial Foundation`
  t.equal(doc.text(), want, 'lists rendered in text output')
  t.end()
})

test('inline lang templates', (t) => {
  let str = `'''Gunaroš''' ({{lang-sr-cyr|Гунарош}}, [[Hungarian language|Hungarian]]: ''Gunaras'') is a village `
  let want = 'Gunaroš (Гунарош, Hungarian: Gunaras) is a village'
  const doc = wtf(str)
  t.equal(doc.text(), want, 'inline-lang')
  t.end()
})
