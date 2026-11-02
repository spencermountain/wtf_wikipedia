import { readdirSync } from 'node:fs'
import test from 'tape'
import wtf from './_lib.js'

// union every pack's names, grouped by the core template they resolve to
const loadFamilies = async () => {
  const dir = new URL('../src/langs/', import.meta.url)
  const langs = readdirSync(dir).filter((f) => f !== 'all' && f.startsWith('.') === false)
  const byFam = {}
  const infoboxes = new Set()
  const add = (fam, name) => {
    byFam[fam] = byFam[fam] || new Set()
    byFam[fam].add(name)
  }
  for (const lang of langs) {
    const { default: data } = await import(new URL(`${lang}/index.js`, dir))
    Object.keys(data.aliases).forEach((name) => add(data.aliases[name], name))
    Object.keys(data.templates).forEach((name) => {
      if (data.templates[name] && data.templates[name].template) {
        add(data.templates[name].template, name)
      }
    })
    data.infoboxes.forEach((name) => infoboxes.add(name))
  }
  return { byFam, infoboxes: [...infoboxes] }
}

// args to exercise each family with; english param names parse identically through any alias
const args = {
  'birth date and age': '1950|3|4',
  citation: 'title=Some Title|url=https://a.com',
  'cite book': 'title=Some Book|author=Smith',
  'cite journal': 'title=Some Paper|journal=Nature',
  'cite web': 'title=Some Page|url=https://a.com',
  'commons cat': 'Toronto',
  coord: '43|39|N|79|23|W',
  flag: 'Canada',
  flagicon: 'Canada',
  formatnum: '1234567',
  ipa: 'tɒˈrɒntoʊ',
  isbn: '978-3-16-148410-0',
  main: 'History of Toronto',
  nihongo: 'Tokyo|東京|Tōkyō',
  portal: 'Canada',
  reflist: '',
  sfn: 'Smith|2001|p=4',
  small: 'tiny text',
  persondata: 'NAME=Smith, John',
  start: '1993|02|24',
}

const signature = (name, tmplArgs) => {
  const doc = wtf(`Hello. {{${name}${tmplArgs ? '|' + tmplArgs : ''}}} World.`)
  return {
    text: doc.text(),
    references: doc.references().length,
    templates: doc.templates().map((tmpl) => tmpl.json().kind || null),
    coordinates: doc.coordinates().length,
  }
}

test('i18n every alias parses like its english template', async (t) => {
  const { byFam } = await loadFamilies()
  Object.keys(args).forEach((english) => {
    const want = signature(english, args[english])
    const aliases = [...(byFam[english] || [])].sort()
    t.ok(aliases.length > 0, `${english}: has aliases`)
    aliases.forEach((alias) => {
      const got = signature(alias, args[english])
      t.deepEqual(
        { ...got, templates: got.templates.length },
        { ...want, templates: want.templates.length },
        `{{${alias}}} ≈ {{${english}}}`
      )
    })
  })
  t.end()
})

test('i18n alias metadata', (t) => {
  const tmpl = wtf('{{personendaten|NAME=Smith}}').templates()[0].json()
  t.equal(tmpl.kind, 'persondata', 'kind is the english template')
  t.equal(tmpl.template, 'personendaten', 'template keeps the localized name')
  t.equal(wtf('{{hauptartikel|Berlin}}').templates()[0].json().kind, 'main', 'main alias kind')
  t.equal(
    wtf('{{Cita libru |url=cool.com |title= citation template }}').references().length,
    1,
    'cite book alias → reference'
  )
  t.equal(wtf('hello world {{علم|EU}}').text(), 'hello world 🇪🇺 EU', 'arabic flag alias')
  t.equal(
    wtf('{{JAPONAIS|Tokyo|東京|Tōkyō}} is big.').text(),
    wtf('{{nihongo|Tokyo|東京|Tōkyō}} is big.').text(),
    'nihongo alias, case-insensitive'
  )
  t.equal(
    wtf('{{нихонго|Tokyo|東京}} is big.').text(),
    wtf('{{nihongo|Tokyo|東京}} is big.').text(),
    'russian nihongo alias'
  )
  t.end()
})

test('i18n aliases: taxobox aliases are infoboxes', async (t) => {
  const { infoboxes } = await loadFamilies()
  t.ok(infoboxes.length > 0, 'has taxobox aliases')
  infoboxes.forEach((alias) => {
    const doc = wtf(`{{${alias}|regnum=Animalia|name=Cat}} x`)
    t.equal(doc.infoboxes().length, 1, `{{${alias}}} → infobox`)
  })
  t.end()
})

test('i18n aliases do not clobber core templates', (t) => {
  t.equal(wtf('a {{lbf}} b').text(), 'a lbF b', '{{lbf}} still renders its unit')
  t.end()
})

test('i18n citation aliases inside <ref> tags', async (t) => {
  const { byFam } = await loadFamilies()
  ;[...byFam['cite web'], ...byFam['cite book']].forEach((alias) => {
    const ref = wtf(`x.<ref>{{${alias}|url=https://a.com|title=Pagina}}</ref>`).references()[0]
    t.equal(ref?.title(), 'Pagina', `<ref>{{${alias}}}</ref> keeps its title`)
  })
  t.end()
})
