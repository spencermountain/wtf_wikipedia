<div align="center">
  <a href="https://www.codacy.com/app/spencerkelly86/wtf_wikipedia">
    <img src="https://api.codacy.com/project/badge/grade/e84f69487c9348ba9cd8e31031a05a4f" />
  </a>
  <a href="https://npmjs.org/package/wtf_wikipedia">
    <img src="https://img.shields.io/npm/v/wtf_wikipedia.svg?style=flat-square" />
  </a>
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-green.svg?style=flat-square" />
  </a>
  <a href="https://www.codacy.com/app/spencerkelly86/wtf_wikipedia">
    <img src="https://api.codacy.com/project/badge/Coverage/e84f69487c9348ba9cd8e31031a05a4f" />
  </a>
  <div>wikipedia markup parser</div>
  <sub>
    by
    <a href="https://github.com/spencermountain">Spencer Kelly</a> and
    <a href="https://github.com/spencermountain/wtf_wikipedia/graphs/contributors">
      many contributors
    </a>
  </sub>
</div>
<p></p>

<div align="center">
**wtf_wikipedia** turns wikipedia's weird markup into **JSON**
<div>so getting data is easier.</div>

<h2 align="center">Don't be mad at me, be mad at them.</h2>

<div align="center">Parsing wikiscript is basically NP-Hard.</div>

  <sub>its <a href="https://en.wikipedia.org/wiki/Help:WikiHiero_syntax">really the worst</a>.  I'm really trying my best.</sub>
</div>

**wtf_wikipedia** handles vile recursive template shinanigans, [half-XML implimentations](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext), depreciated and obscure template variants, and illicit wiki-esque shorthands.

Making your own parser is never a good idea, `what could go rong?!`, but this library is a very detailed and deliberate creature. :four_leaf_clover:

```bash
npm install wtf_wikipedia
```
then:
````javascript
var wtf = require("wtf_wikipedia")

//hit the api
wtf.from_api("Toronto", "en", function(markup){
  var data = wtf.parse(markup);
  // {
  //   type: '',
  //   infoboxes: [{
  //     template: '',
  //     data: {}
  //   }],
  //   images: [],   // files + md5 urls
  //   sections: [{  //(each heading)
  //       title: '',
  //       images: '',
  //       lists: '',
  //       sentences: [{ //(each sentence)
  //         text: ''
  //         links: [{
  //           text: '',
  //           link: ''
  //         }]
  //       }]
  //    }],
  //   categories: [],
  //   interwiki: {},
  // }
  console.log(data.infoboxes[0].data.leader_name)
  // "John Tory"
})
````
yeah, the structure is a little verbose - but with a couple loops you should find everything you want.

**wtf_wikipedia** also offers a plaintext method, that returns only paragraphs of nice text, and no junk:
````javascript
wtf.from_api("Toronto Blue Jays", "en", function(markup){
  var text= wtf.plaintext(markup)
  // "The Toronto Blue Jays are a Canadian professional baseball team..."
})
````
<h2 align="center">
  <a href="https://rawgit.com/spencermountain/wtf_wikipedia/master/demo/index.html">Demo!</a>
</h2>
# What it does
* Detects and parses **redirects** and **disambiguation** pages
* Parse **infoboxes** into a formatted key-value object
* Handles recursive templates and links- like [[.. [[...]] ]]
* **Per-sentence** plaintext and link resolution
* Parse and format internal links
* Properly resolve {{CURRENTMONTH}} and {{CONVERT ..}} type templates
* Parse **images**, files, and **categories**
* Eliminate xml, latex, css, table-sorting, and 'Egyptian hierogliphics' cruft

its a combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView), [txtwiki](https://github.com/joaomsa/txtwiki.js), and uses the inter-language data from [Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid).

#### But what about...
##### Parsoid:
Wikimedia's [Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid) is the official wikiscript parser. It reliably turns wikiscript into HTML, but not valid XML.

To use it for data-mining, you'll' need to:
```
parsoid(wikiscript) -> pretend DOM -> screen-scraping
```
but getting structured data this way (say, sentences or infobox data), is a complex + weird process still. This library has 'borrowed' a lot of stuff from the parsoid project❤️

##### XML datadumps:
This library is built to work well with [wikipedia-to-mongo](https://github.com/spencermountain/wikipedia-to-mongodb), letting you parse a whole wikipedia dump on a laptop in a couple minutes.


# Methods
## **.parse(markup)**
turns wikipedia markup into a nice json object

```javascript
var wiki='==In Popular Culture==\n*harry potter\'s wand\n* the simpsons fence'
wtf.parse(wiki)
// {type:'', sections:[...], infobox:{}, categories:[...], images:[] }
```

## **.from_api(title, lang_or_wikiid, callback)**
retrieves raw contents of a wikipedia article - or other mediawiki wiki identified by its [dbname](http://en.wikipedia.org/w/api.php?action=sitematrix&format=json)

to call non-english wikipedia apis, add it as the second paramater to from_api
```javascript
wtf.from_api("Toronto", "de", function(markup){
  var text= wtf.plaintext(markup)
  //Toronto ist mit 2,6 Millionen Einwohnern..
})
```

you may also pass the wikipedia page id as parameter instead of the page title:
```javascript
wtf.from_api(64646, "de", function(markup){
  //...
})
```
the from_api method follows redirects.
## **.plaintext(markup)**
returns only nice text of the article
```js
var wiki="[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.<ref>{{cite web|blah}}</ref>"
var text= wtf.plaintext(wiki)
//"Boston's baseball field has a 37ft wall."
```

## **CLI**
if you're scripting this from the shell, or another language, install with a `-g`, and then:
````shell
$ wikipedia_plaintext George Clooney
# George Timothy Clooney (born May 6, 1961) is an American actor ...

$ wikipedia Toronto Blue Jays
# {text:[...], infobox:{}, categories:[...], images:[] }

````
# Sample Output
Sample output for [Royal Cinema](https://en.wikipedia.org/wiki/Royal_Cinema)
````javascript
{ type: 'page',
  sections:[ { title: '', depth: 0, sentences: [Array] },
     { title: 'See also', depth: 1, sentences: [Array] },
     { title: 'References', depth: 1, sentences: []
   }],
  infoboxes: [ {
    template: 'venue',
    data:
     { name: { text: 'Royal Cinema' },
       'former names': { text: 'The Pylon The Golden Princess' },
       image: { text: 'The Royal Cinema.jpg' },
       image_size: { text: '200px' },
       caption: { text: 'The Royal Cinema in 2017.' },
       address: { text: '608 College Street', links: [Array] },
       location: { text: 'Toronto, Ontario', links: [Array] },
       opened: { text: 1939 },
       architect: { text: 'Benjamin Swartz' },
       website: { text: 'theroyal.to' },
       capacity: { text: 390 } }
    }],
  interwiki: {},
  categories:[ 'City of Toronto Heritage Properties',
     'Cinemas and movie theatres in Toronto',
     'Streamline Moderne architecture in Canada',
     'Theatres completed in 1939',
     '1939 establishments in Ontario'
   ],
  images:[{ url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/The_Royal_Cinema.jpg',
       file: 'File:The Royal Cinema.jpg',
       thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/The_Royal_Cinema.jpg/300px-The_Royal_Cinema.jpg' }
     ]
   }
````

Sample Output for [Whistling](https://en.wikipedia.org/w/index.php?title=Whistling)
````javascript
{ type: 'page',
  sections:
   [ { title: '', depth: 0, images: [Array], sentences: [Array] },
     { title: 'Techniques',
       depth: 1,
       images: [Array],
       sentences: [Array] },
     { title: 'Competitions', depth: 1, sentences: [Array] },
     { title: 'As communication', depth: 1, sentences: [Array] },
     { title: 'In music',
       depth: 1,
       images: [Array],
       sentences: [Array] },
     { title: 'By spectators', depth: 1, sentences: [Array] },
     { title: 'Superstitions', depth: 1, sentences: [Array] },
     { title: 'Children\'s television cartoon shows',
       depth: 1,
       lists: [Array],
       sentences: [] },
     { title: 'See also', depth: 1, lists: [Array], sentences: [] },
     { title: 'References', depth: 1, sentences: [] },
     { title: 'External links',
       depth: 1,
       lists: [Array],
       sentences: [] } ],
  infoboxes: [],
  interwiki: {},
  categories: [ 'Oral communication', 'Vocal music', 'Vocal skills' ],
  images: [Array]
}
````

## Contributing
Never-ender projects like these are only good with many-hands, and I try to be a friendly maintainer. (promise!)

```bash
npm install
npm test
npm run build #to package-up client-side
```

MIT
