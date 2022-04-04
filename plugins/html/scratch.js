import wtf from '../../src/index.js'
import plg from './src/index.js'
wtf.extend(plg)

wtf.fetch('Radiohead').then((doc) => {
  let res = doc.sentences()[0].html()
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