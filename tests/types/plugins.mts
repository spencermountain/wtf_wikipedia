// type-only test for the bundled plugins' declarations
import wtf from 'wtf_wikipedia'
import htmlPlugin from 'wtf-plugin-html'
import apiPlugin from 'wtf-plugin-api'
import { mlb, nhl } from 'wtf-plugin-sports'

wtf.extend(htmlPlugin)
wtf.extend(apiPlugin)
wtf.extend(mlb)
wtf.extend(nhl)

const doc = wtf('hello [[world]]')

// html augments Document and its parts
const h: string = doc.html()
const sh: string | undefined = doc.sections()[0]?.html()
const lh: string | undefined = doc.links()[0]?.html({ images: false })

// api augments Document, and adds statics onto wtf itself
doc.getPageViews().then((views) => console.log(views.length))
wtf.getRandomPage().then((d) => d && console.log(d.title()))
wtf.fetchList(['a', 'b']).then((docs) => docs.forEach((d) => console.log(d.title())))
wtf.getCategoryPages('Physics').then((pages) => console.log(pages.length))

// sports adds a Document method and wtf statics
const season: Record<string, unknown> | null = doc.mlbSeason()
wtf.nhlSeason('canucks', 2010).then((res) => console.log(res))

console.log(h, sh, lh, season)
