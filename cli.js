#!/usr/bin/env node
import wtf from './src/index.js'
let args = process.argv.slice(2)

const modes = {
  '--json': 'json',
  '--plaintext': 'plaintext',
}
let mode = 'json'
args = args.filter((arg) => {
  if (modes.hasOwnProperty(arg) === true) {
    mode = modes[arg]
    return false
  }
  return true
})

let title = args.join(' ')
if (!title) {
  throw new Error('Usage: wtf_wikipedia Toronto Blue Jays --plaintext')
}

wtf.fetch(title, 'en', function (err, doc) {
  if (err) {
    console.error(err)
  }
  if (mode === 'json') {
    console.log(JSON.stringify(doc[mode](), null, 0))
  } else {
    console.log(doc[mode]())
  }
})
