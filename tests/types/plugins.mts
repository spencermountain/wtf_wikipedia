/* eslint-disable no-console */
// type-only test for the bundled plugins' declarations
import wtf from 'wtf_wikipedia'
import htmlPlugin from 'wtf-plugin-html'
import apiPlugin from 'wtf-plugin-api'
import personPlugin, { type PersonDate, type PersonNames, type Spouse, type PersonChildren } from 'wtf-plugin-person'
import { mlb, nhl, ahl, type MlbSeason, type NhlSeason, type AhlSeason } from 'wtf-plugin-sports'

wtf.extend(htmlPlugin)
wtf.extend(apiPlugin)
wtf.extend(personPlugin)
wtf.extend(mlb)
wtf.extend(nhl)
wtf.extend(ahl)

const doc = wtf('hello [[world]]')

// html augments Document and its parts
const h: string = doc.html()
const sh: string | undefined = doc.sections()[0]?.html()
const lh: string | undefined = doc.links()[0]?.html({ images: false })

// api augments Document, and adds statics onto wtf itself
doc.getPageViews().then((views) => console.log(views.length))
wtf.getRandomPage().then((d) => d && console.log(d.title))
wtf.fetchList(['a', 'b']).then((docs) => docs.forEach((d) => console.log(d.text())))
wtf.getCategoryPages('Physics').then((pages) => console.log(pages.length))

// person augments Document
const born: PersonDate | null = doc.birthDate()
const alive: boolean | null = doc.isAlive()
const place: string | null = doc.birthPlace()
const who: PersonNames | null = doc.names()
const jobs: string[] = doc.occupation()
const married: Spouse[] = doc.spouses()
const kids: PersonChildren | null = doc.children()
const years: number | null = doc.age()
console.log(who, jobs, married, kids, years)

// sports adds Document methods and wtf statics
const season: MlbSeason | null = doc.mlbSeason()
wtf.nhlSeason('canucks', 2010).then((res: NhlSeason | null) => console.log(res))
wtf.ahlSeason('Hershey Bears', 2023).then((res: AhlSeason | null) => console.log(res))

console.log(h, sh, lh, born, alive, place, season)
