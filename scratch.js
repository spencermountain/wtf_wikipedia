import Block from './src/Block/Block.js'
import wtf from './src/index.ts'

// Ordinary templates are expanded; reference tags stay until Block parses them.
const block = new Block(
  `Visit '''[[New York City|New York]]'''.<ref name="guide">{{cite book|title=City Guide|author=Jane Smith}}</ref>
Then visit [[New York (state)|New York]] &amp; ''[[Boston]]''.<ref>A second source. With its own sentences.</ref>
Return to New York.<ref name="guide"/>`
)

// console.log(block.text())
// console.dir(block.json(), { depth: null })
// // Sentence blocks retain links and formatting, but no citations.
// console.dir(
//   block.sentences().map((sentence) => sentence.json()),
//   { depth: null }
// )
// console.log('Original block citations:', block.citations().length)

const doc = wtf('')
console.log(doc.sections())
