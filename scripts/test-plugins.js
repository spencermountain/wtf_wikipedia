import { readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'

let fail = false

// run each plugin's tests:
readdirSync('./plugins').forEach((dir) => {
  console.log(dir + ':')
  try {
    execSync(`tape "./plugins/${dir}/tests/*.test.js" | tap-dancer --color always`, { stdio: 'inherit' })
  } catch (e) {
    console.log(dir)
    fail = true
  }
})

// return proper exit-code:
process.exit(fail ? 1 : 0)
