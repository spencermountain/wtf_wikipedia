import Block from './src/Block/Block.js'

// The section has already expanded templates and extracted references.
const block = new Block(
  "Visit '''[[New York City|New York]]'''. Then visit [[New York (state)|New York]] &amp; ''[[Boston]]''."
)

console.log(block.text())
console.dir(block.json(), { depth: null })
