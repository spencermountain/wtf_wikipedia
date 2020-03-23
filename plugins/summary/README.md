<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-summary">
    <img src="https://img.shields.io/npm/v/wtf-plugin-summary.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-summary/builds/wtf-plugin-summary.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-html/master/builds/wtf-plugin-summary.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-summary</code>
</div>

Tries to generate a small fragment of text (or 'clause') that describes a wikipedia article in english.

The process:

- look for a [{{short description}](https://en.wikipedia.org/wiki/Template:Short_description)` template
- grab and process the first-sentence of a wikipedia article
- build a template from `wtf-plugin-classify`

Most-often it will find something of a reasonable length in the first-sentence.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-summary'))
;(async () => {
  await wtf.fetch('Toronto Raptors').summary()
  // 'a Canadian professional basketball team'
  await wtf.fetch('Toronto Raptors').article()
  // 'they'
  await wtf.fetch('Toronto Raptors').tense()
  // 'present'
})()
```

The idea is that every output is a short, uncomplicated 'is-a' text, and can be treated grammatically like:

```js
let copula = doc.tense() === 'past' ? 'was' : 'is'
return `${doc.title()} ${copula} ${doc.summary()}.`
// 'Wayne Gretzky is a Canadian ice hockey player.'
```

this plugin uses [compromise](http://compromise.cool) for working with plaintext.

### Options

```js
let opts = {
  article: false //remove leading 'a', 'the', etc
}
await wtf.fetch('Toronto Raptors').summary(opts)
// 'Canadian professional basketball team'
```

work-in-progress

MIT
