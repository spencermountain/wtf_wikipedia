# Bundled plugins

Plugins add methods to the library's classes (and sometimes to `wtf` itself).
Install pattern, identical for all of them:

```js
import wtf from 'wtf_wikipedia'
import classify from 'wtf-plugin-classify'
wtf.extend(classify)

let doc = await wtf.fetch('Toronto Raptors')
doc.classify() // { root: 'Organization', type: 'Organization/SportsTeam', score: 0.9, details: {...} }
```

All bundled plugins ship TypeScript declarations that augment the core types
automatically. They live in `./plugins/*` of this repo and are published as
`wtf-plugin-<name>`. Each plugin's README has more depth.

## classify

`doc.classify()` → `{ root: string | null, type: string | null, score: number, details }` —
guesses what the page is about (Person / Place / Organization / CreativeWork / …),
from its infobox, categories, templates, section names, title and description.
`type` is a path like `'Organization/SportsTeam'`; `score` is 0–1 confidence.
When nothing matches, `root` and `type` are `null` and `score` is 0.

## summary

- `doc.summary(options?)` → `string` — a short description of the topic
  (options: `{ article, template, sentence, category, max, min }`)
- `doc.article()` → `string` — the topic's article/pronoun: `'she'`, `'it'`, …
- `doc.tense()` → `'Past' | 'Present' | 'Future'`

## person

- `doc.birthDate()` / `doc.deathDate()` → `{ year?, month?, date? } | null` —
  **`month` is 0-based** (January = 0)
- `doc.birthPlace()` / `doc.deathPlace()` / `doc.nationality()` → `string | null`
- `doc.isAlive()` → `boolean`

## api

Document methods (all return promises):
`doc.getRedirects()`, `doc.getIncoming()`, `doc.getPageViews()`.

Statics on `wtf`:

```js
wtf.getRandomPage(options?)            // Promise<Document | null>   (alias wtf.random())
wtf.getRandomCategory(options?)        // Promise<string | null>
wtf.getCategoryPages(category, opts?)  // Promise<[{ pageid, ns, title }, ...]>  incl. sub-categories
wtf.getTemplatePages(template, opts?)  // pages transcluding a template
wtf.fetchList(titles, opts?)           // polite serial fetch of many pages → Promise<Document[]>
wtf.getIncoming(title, opts?)          // pages linking to a title
wtf.getRedirects(title, opts?)         // redirects pointing at a title
```

## image

- `doc.mainImage()` → `Image | null` — the representative image
- `img.commonsURL()` → `string` — the wikimedia-commons page for the file
- `img.exists()` → `Promise<boolean>` — does the file url resolve
- `img.license()` → `Promise<object | null>`

## html / markdown / latex

Add an output method of the same name to `Document, Section, Paragraph,
Sentence, Image, Infobox, Link, List, Reference, Table`:

```js
wtf.extend(htmlPlugin)
doc.html()                    // whole page
doc.section('History').html() // any part
```

`doc.markdown()` and `doc.latex()` follow the same shape (`(options?) → string`).

## wikitext

`(thing).makeWikitext()` on all ten classes **plus Template** — regenerates
wiki markup from the parsed document.

## i18n

No new methods — registers non-english aliases for common templates
(citations, coord, flags, …) so non-english pages parse better.
`wtf.extend(i18nPlugin)` and parse as usual.

## debug

Page-quality heuristics on Document, each returning a reason-string or `false`:
`hasBadTable()`, `hasNoText()`, `isLongStub()`, `hasIPAPunct()`, and
`isBad()` (any of the above).

## sports

Named exports, one plugin each: `import { mlb, nhl } from 'wtf-plugin-sports'`.
`wtf.mlbSeason(team, year)` / `wtf.nhlSeason(team, year)` fetch and parse a
team-season page; `doc.mlbSeason()` parses one you already have.

## wikis (sub-plugins)

`wtf-plugin-openstreetmap`, `wtf-plugin-wikinews`, `wtf-plugin-wikivoyage`,
`wtf-plugin-wiktionary` — template/infobox registrations for those projects.

## nsfw (separate repo)

[wtf-plugin-nsfw](https://github.com/spencermountain/wtf-plugin-nsfw) —
`doc.nsfw()` flags sexual/graphic/adult articles from categories, templates,
titles and wikipedia's bad-image list.
