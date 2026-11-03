<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>

  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-nsfw">
    <img src="https://img.shields.io/npm/v/wtf-plugin-nsfw.svg?style=flat-square" />
  </a>

  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-nsfw/builds/wtf-plugin-nsfw.min.js">
    <img src="https://img.shields.io/bundlephobia/min/wtf-plugin-nsfw?style=flat-square" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-nsfw</code>
</div>

This is a plugin for [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia/) representing a courageous attempt to filter objectionable or adult content in wikipedia.

Wikipedia has [frequently rejected](https://en.wikipedia.org/wiki/Wikipedia:Rating_system) any explicit rating system, or content flagging, due to fears that it will be misused, or generate dispute.

As a result, there is a large amount of graphic imagery, pornography, detailed violence, drug use, and other nsfw content, without any clear-cut way to identify it. [1](https://en.wikipedia.org/wiki/Wikipedia_talk:No_disclaimers_in_articles)

This library tries to flag an article as `nsfw`, according to some structured information, and some opinionated (but sensible) rules.

It looks in a number of different places:

- categories (like **'[[Category:Machine Guns]]'**)
- templates (like **{{Sex positions}}**)
- page titles (like **star wars (Adult Film)**)
- pages with images from Wikipedia's [bad image list](https://en.wikipedia.org/wiki/MediaWiki:Bad_image_list)

As of `v1.0`, this library flags **~2%** of english wikipedia articles.

### Usage

```js
import wtf from 'wtf_wikipedia'
import nsfwPlugin from 'wtf-plugin-nsfw'
wtf.extend(nsfwPlugin)

let doc = await wtf.fetch('Toronto Raptors')
doc.nsfw()
// []     ← an empty array means nothing was flagged

doc = await wtf.fetch('One-night stand')
doc.nsfw()
// [
//   {
//     type: 'sexuality',
//     evidence: [
//       { source: 'template', name: 'human sexuality', data: { template: 'Human sexuality', ... } },
//       { source: 'category', name: 'casual sex' }
//     ]
//   }
// ]
```

Each warning's `type` may be one of **sexuality | drug-use | weapons | violence | profanity | obscenity** —
warnings are sorted most-evidence-first, and each `evidence` row says which `template`, `category`, `title` or `image` triggered it, with the full parsed `data` of matched templates and images, so you can decide which warning types to allow, or blur a single image instead of rejecting the page.

---

### Install

The package ships as an ES module, with a CommonJS build for `require()`:

```js
import wtf from 'wtf_wikipedia'
import nsfwPlugin from 'wtf-plugin-nsfw'
wtf.extend(nsfwPlugin)
```

natively on the web:

```html
<script src="https://unpkg.com/wtf_wikipedia"></script>
<script src="https://unpkg.com/wtf-plugin-nsfw"></script>
<script>
  const wtf = window.wtf
  const nsfwPlugin = window.wtfNsfw
  wtf.extend(nsfwPlugin)
</script>
```

In TypeScript:

```ts
import wtf from 'wtf_wikipedia'
import nsfwPlugin, { NsfwDocument, NsfwType } from 'wtf-plugin-nsfw'
wtf.extend(nsfwPlugin)

const doc = wtf(text) as NsfwDocument
const blocked: NsfwType[] = ['sexuality', 'obscenity']
const allow = !doc.nsfw().some((w) => blocked.includes(w.type))
```

### Notes:

In general, sexual content is flagged in a general way - without any judgement or consideration of morality or taste.
This could include content that most find harmless, like books with LGBT characters, or medical information about sexual body parts.

Explicit recreational drug information is flagged, along with some (often helpful) medical information.

Weapon content of all kinds is attempted to be flagged. This includes historical, and fictional weaponry.

Wars and military conflicts are kept, but an attempt is made to limit pages with grotesque violent acts. (particularly difficult)

This library is very limited right now, and is certainly not appropriate for any commercial or wide-spread usage.

You're free to use the information provided by this library however you wish. You may choose to establish your own rules.

This library is built for the english wikipedia, and other languages are not supported.

Even just reading the source code can be a bad time.

### Disclaimer

This script is not intended to be used as a sufficient content-filter for any content, in wikipedia or elsewhere.
Additional care needs to be taken, in addition to this script, to ensure content meets any content guidelines, or that it is safe for a general audiance.

The authors and contributors take no responsibility for the performance or accuracy of this script.

work-in-progress!

MIT
