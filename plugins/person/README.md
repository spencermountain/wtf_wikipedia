<div align="center">
  <div><b>wtf-plugin-person</b></div>
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-person">
    <img src="https://img.shields.io/npm/v/wtf-plugin-person.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-person/builds/wtf-plugin-person.min.js">
    <img src="https://img.shields.io/bundlephobia/min/wtf-plugin-person" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-person</code>
</div>

A plugin that finds biographical information for people - names, dates, places, occupation, and family - in its various places in a wikipedia article.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-person'))
;(async () => {
  let doc = await wtf.fetch('David Phillips (entrepreneur)')
  doc.birthDate()
  // {year: 1964}
})()
```

```html
<script src="https://unpkg.com/wtf_wikipedia"></script>
<script src="https://unpkg.com/wtf-plugin-person"></script>
<script defer>
  wtf.plugin(window.wtfPerson)
  wtf.fetch('Elvis Presley').then((doc) => {
    console.log(doc.deathPlace())
    // Memphis, Tennessee, U.S.
  })
</script>
```



<div align="center">
  <h2><a href="https://observablehq.com/@spencermountain/wtf-plugin-person">Demo</a></h2>
</div>

## Notes:

- This library assumes that every article you give it is about a person. You may want to use it in conjunction with [wtf-plugin-classify](https://github.com/spencermountain/wtf_wikipedia/tree/master/plugins/classify)
to ensure that a page is first about a person, and not a place, or musical group:

```js
wtf.fetch('Billy Elliot').then((doc) => {
  let res = doc.classify() // 'CreativeWork/Play'
  if (res.root === 'Person') {
    console.log(doc.birthPlace())
  }
})
```


- For inaccurate dates, if the date is a range, finds the average rounded down; otherwise finds the minimum.
  
### `.birthDate()`

returns `year`, `month` and `date` properties (also `originalDate` if the date is inaccurate), or a null response.
`month` is 0-indexed (January is `0`), following the spacetime convention. When only the year is known, `month` and `date` are omitted.

- looks at various person-infoboxes, like `Infobox officeholder` or `Infobox ice hockey player`
- looks at first-sentence parentheses, like `'Wayne Douglas Gretzky CC (/ˈɡrɛtski/; born January 26, 1961) is a ...'`
- looks at category information, like `'Category:1933 births'`

### `.birthPlace()`

returns a plain-text string, like `'San Diego, California'`, or null

- looks at various person infoboxes
- looks for `'born in ...'` in the first sentence
- looks at category information, like `'Category:People from Geneva'`

### `.isAlive()`

returns `true`, `false`, or `null` for unknown result.

- looks for a `.deathDate()` or `.deathPlace()` result
- looks at category information, like `Category:Dead people`
- looks at template information, like `{{WikiProject Biography|living=yes }}`

### `.deathDate()`

same as `.birthDate()`

### `.deathPlace()`

same as `.birthPlace()`

### `.nationality()`

returns a plain-text string, like `'American'`, or null

- looks at the infobox `nationality` or `citizenship` fields
- falls back to the first-sentence demonym - `'was an American professional golfer'` → `'American'`

### `.names()`

returns `{ name, birthName, aliases }`, or null

- `name` - the infobox name, the first bold text of the first sentence, or the page title
- `birthName` - infobox `birth_name`, `fullname`, or `real_name` fields
- `aliases` - nicknames, stage names and other names, as an array

### `.occupation()`

returns an array of strings, like `['actor', 'director']`

- looks at the infobox `occupation` or `profession` fields
- falls back to the first sentence - `'was an American professional golfer'` → `['professional golfer']`

### `.spouses()`

returns an array of `{ name, from, to, end }` objects

- parses `{{marriage|Jane Doe|1990|2001|end=div.}}` templates into structured data
- falls back to the infobox `spouse` or `partner` field text

### `.children()`

returns `{ count, names }`, or null - the infobox field is a count, a list of names, or both, like `'11, including [[Bob]]'`

### `.age()`

returns the current age of a living person, or null for the dead

MIT
