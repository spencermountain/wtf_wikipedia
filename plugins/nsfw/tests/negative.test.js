import test from 'tape'
import fs from 'node:fs'
import wtf from './_lib.js'

const read = (name) => fs.readFileSync(new URL(`./cache/${name}.txt`, import.meta.url), 'utf8')

test('negative test', function (t) {
  const arr = [
    '2008-British-motorcycle-Grand-Prix',
    'AACTA-Award-for-Outstanding-Achievement-in-Short-Film-Screen-Craft',
    'Alanine—oxo-acid-transaminase',
    'Alexander-Y-Type',
    'Allen-R.-Morris',
    'Alsea-(company)',
    'Altimont-Butler',
    'Antique-(band)',
    'Anwar_Kamal_Khan',
    'Arts_Club_of_Chicago',
    'africaans',
    'al_Haytham',
    'anarchism'
  ]
  arr.forEach((str) => {
    const doc = wtf(read(str))
    t.equal(doc.nsfw().length, 0, str)
  })
  t.end()
})
