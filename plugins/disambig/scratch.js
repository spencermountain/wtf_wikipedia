/* eslint-disable no-console */

import wtf from '../../src/index.js'
import plg from './src/index.js'
wtf.extend(plg)

wtf.fetch('spencer').then((doc) => {
  let res = doc.disambig()
  console.log(res)
})
/*
{
  text: 'Spencer',
  main: null,
  pages: [
    { link: 'Spencer, Missouri', desc: '', section: 'United States' },
    { link: 'Spencer (film)',  desc: 'a 2021 drama film about Princess Diana',  section: 'Other uses'   }
  ]
}
*/