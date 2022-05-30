<div align="center">
  <div><b>wtf-plugin-disambig</b></div>
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-disambig">
    <img src="https://img.shields.io/npm/v/wtf-plugin-disambig.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-disambig/builds/wtf-plugin-disambig.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-disambig/master/builds/wtf-plugin-disambig.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-disambig</code>
</div>

a plugin for parsing [disambiguation pages](https://en.wikipedia.org/wiki/Wikipedia:Disambiguation) in wikipedia.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-disambig'))

wtf.fetch('Raptor').then((doc) => {
  let res = doc.disambig()
  /*
{
  text: 'Raptor',
  main: null,
  pages: [
    {
      link: 'Raptor (bird)',
      desc: 'or bird of prey, a bird that primarily hunts and feeds on vertebrates',
      section: 'Animals'
    },
    {
      link: 'Raptor (film)',
      desc: 'a 2001 film',
      section: 'Film and television'
    },
  ...
  ]
}
*/
```


```html
<script src="https://unpkg.com/wtf_wikipedia"></script>
<script src="https://unpkg.com/wtf-plugin-disambig"></script>
<script defer>
  wtf.plugin(window.wtfDisambig)
  wtf.fetch('spencer').then((doc) => {
    let res = doc.disambig()
    console.log(res)
  })
  /*{
    text: 'Spencer',
    main: null,
    pages: [
      { link: 'Spencer, Missouri', desc: '', section: 'United States' },
      { link: 'Spencer (film)',  desc: 'a 2021 drama film about Princess Diana',  section: 'Other uses'   }
    ]
  }*/
</script>
```

MIT
