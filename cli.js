#!/usr/bin/env node
import wtf from './builds/wtf_wikipedia.mjs'
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
    // eslint-disable-next-line no-console
    console.error(err.message || err)
    process.exit(1)
  }
  if (!doc) {
    // eslint-disable-next-line no-console
    console.error(`Could not find a wikipedia page for '${title}'`)
    process.exit(1)
  }
  if (mode === 'json') {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(doc[mode](), null, 0))
  } else {
    // eslint-disable-next-line no-console
    console.log(doc[mode]())
  }
})
