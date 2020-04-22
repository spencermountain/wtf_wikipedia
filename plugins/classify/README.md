<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-classify">
    <img src="https://img.shields.io/npm/v/wtf-plugin-classify.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-classify/builds/wtf-plugin-classify.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-html/master/builds/wtf-plugin-classify.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-classify</code>
</div>

This plugin uses a (large) number of heuristics to classify a wikipedia article into a basic **Person/Place/Thing** scheme.

<div align="center">
  <h2><a href="https://observablehq.com/@spencermountain/wtf-plugin-classify">Demo</a></h2>
</div>

Things it looks at:

- infoboxes (like **{{Infobox Person ...}}**)
- categories (like **'[[Category:Canadian Saxophone Players]]'**)
- templates (like **{{Liechtenstein-sport-bio-stub}}**)
- sections (like **'==Early life=='**)
- titles (like **'John Smith (poet)'**)

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-classify'))

wtf.fetch('Toronto Raptors').then((doc) => {
  let res = doc.classify()
  //{
  //  category: 'Organization/SportsTeam',
  //  confidence: 0.9,
  //  detail: {...}
  //}
})
```

### Justification:

Traversing wikipedia's categories to find say, all the **People** or **Places** is a [notoriously](https://humane.computer/review-the-science-of-managing-our-digital-stuff/) broken strategy:
![image](https://user-images.githubusercontent.com/399657/77183042-1f44ba00-6aa4-11ea-9a9e-502d825a6ea4.png)
or worse:
![image](https://user-images.githubusercontent.com/399657/77183081-2cfa3f80-6aa4-11ea-9e6a-1e5bcf2e70b6.png)

Infoboxes like `{{Infobox person}}` are a really clear signal, but get muddled quickly with things like `{{Infobox architect}}`.

This library tries to do this sort of work, to determine if a page is about Person, a Place, or an Organization in broad terms.

### Types:

```yaml
Person:
  Athlete: true
  Artist: true
  Politician: true
  Actor: true
  Academic: true
  ReligiousFigure: true
Place:
  Country: true
  City: true
  Structure: true
  BodyOfWater: true
  SpaceLocation: true
Organization:
  Company: true
  SportsTeam: true
  MusicalGroup: true
  PoliticalParty: true
CreativeWork:
  Film: true
  TVShow: true
  Book: true
  Play: true
  Album: true
  VideoGame: true
Event:
  Election: true
  Disaster: true
  SportsEvent: true
  MilitaryConflict: true
  SpaceMission: true
Product: true
Organism: true
MedicalCondition: true
Concept: true
FictionalCharacter: true
```

as of March 2020, it can classify ~65% of english wikipedia articles:

```
    null: 37.71%
    People: 18.86%
    Place: 14.01%
    Organization: 8.27%
    CreativeWork: 5.38%
    Event: 4.57%
    Thing: 5.75%
```

### i18n

it is trained on the english wikipedia, but may also provide reasonable results in other languages.

it may help if you first require [wtf-plugin-i18n](../i18n), which maps many templates to their english forms.

work-in-progress.

MIT
