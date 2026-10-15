import wtf from './src/index.ts'
import { readPage } from './tests/_examples/index.js'

// const str = readPage('Radiohead')
const str = `===Albums listed chronologically===

oka cool this [[works]]

*''[[The Techno Rose of Blighty]]'' (1991, Creation Records)
*''[[Out (In Essence)]]'' (1991, Circa/Virgin)
*''[[Six Wheels on My Wagon]]'' (1993, Circa)
*''[[The Peel Sessions (Fluke album)|The Peel Sessions]]'' (1994, Strange Fruit)
*''[[Oto (album)|Oto]]'' (1995, Circa)
*''[[Risotto (album)|Risotto]]'' (1997, Circa/Virgin/Astralwerks)
*''Xmas Demos'' (2000, Virgin)
*''[[Progressive History X]]'' (2001, Circa)
*''Progressive History XXX'' (2002, Circa)
*''[[Puppy (Fluke album)|Puppy]]'' (2003, One Little Indian)
*''The Second Bite'' (2026, Surface Records)
`
const doc = wtf(str)

console.log(doc.paragraphs().json())
// console.log(block.links())
