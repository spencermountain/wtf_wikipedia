import wtf from './src/index.js'

let str = ``

str = `{[vec|...}}`
str = `{{font color|...}}`
str = `played for {{subst:nft|France}}`
str = `{{subst|Medicine}}`
str = `{{tls|x2|one|two}}`
str = `{{Background color|<color>|<text>}}`
str = `{{tq|Lorem ipsum '''dolor''' sit}}`
// str = `{{Rounddown|3.14159|3}}`
str = `{{Poem quote
|text=<!-- or: 1= -->The sun was shining on the sea,
Shining with all his might:
He did his very best to make
The billows smooth and bright--
And this was odd, because it was
The middle of the night.
|char=Tweedledum and Tweedledee
|sign=Lewis Carroll
|source=<!-- or 4= -->''Through the Looking-Glass''
|title=<!-- or: 3= -->"The Walrus and The Carpenter"
|style=<!-- standard CSS style goes here -->
}}`

// str = `{{SubSup|a|b|C}}`
// str = `For example, fact {{r|RefName|p=22}}`

// str = `before
// :indent
// after`

// str = `hello
// : first
// :: second
// world`

// console.log(wtf('This is an\n:before\nafter').text())

// str = `{{Φ}}`

// str = `{{Refplease|date=November 2023|reason=Your explanation here}} in [[Jolgeh-ye Musaabad Rural District]],`

let doc = wtf(str)
console.log(doc.text())

// console.log(doc.json().sections[0])
// const doc = await wtf.fetch('Philharmonie de Berlin', 'fr')
// console.log(doc.pageImage().json())
// console.log(doc.wikidata() + '|')

// console.log(doc.template().json())
// console.log(doc.text())
// console.log(doc.references().map((r) => r.json()))
// console.log(doc.templates().map((r) => r.json()))
