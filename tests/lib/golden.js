import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const goldenDir = path.join(dir, '../golden')

// compare `actual` (an object of named results) against tests/golden/<name>.json.
// regenerate the files with:  npm run goldens:update
// the diff of a golden file is the review - never edit them by hand.
const golden = function (t, name, actual) {
  actual = JSON.parse(JSON.stringify(actual)) // normalize: goldens hold what survives serialization
  const file = path.join(goldenDir, name + '.json')
  if (process.env.UPDATE_GOLDENS) {
    fs.writeFileSync(file, JSON.stringify(actual, null, 2) + '\n')
    t.ok(true, `updated golden: ${name}`)
    return
  }
  if (!fs.existsSync(file)) {
    t.fail(`missing golden file '${name}.json' - run \`npm run goldens:update\``)
    return
  }
  const expected = JSON.parse(fs.readFileSync(file, 'utf-8'))
  t.deepEqual(Object.keys(actual), Object.keys(expected), `${name}: same result-keys`)
  Object.keys(expected).forEach((key) => {
    t.deepEqual(actual[key], expected[key], `${name}: ${key}`)
  })
}
export default golden
