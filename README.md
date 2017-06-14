## Parsing Wikipedia markup is basically NP-Hard

its [really the worst](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax).  I'm trying my best.

**wtf_wikipedia** turns wikipedia article markup into **JSON**.

It handles many vile recursive template shinanigans, [half-XML implimentations](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext), depreciated and obscure template variants, and illicit wiki-esque shorthands.

Making your own parser is never a good idea, but this library is a very detailed and deliberate creature. :four_leaf_clover:

```bash
npm install wtf_wikipedia
```
then:
````javascript
var wtf_wikipedia = require("wtf_wikipedia")

wtf_wikipedia.parse(someWikiScript)
// {sections:[...], infobox:{}, categories:[...], images:[] }

//fetch wikipedia markup from api..
wtf_wikipedia.from_api("Toronto", "en", function(markup){
  var obj= wtf_wikipedia.parse(markup)
  var mayor= obj.infobox.leader_name
  // "John Tory"
})
````
if you only want some nice plaintext, and no junk:
````javascript
var text= wtf_wikipedia.plaintext(markup)
// "Toronto is the most populous city in Canada and the provincial capital..."
````
## [Demo!](https://rawgit.com/spencermountain/wtf_wikipedia/master/demo/index.html#)

Wikimedia's [Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid) is the official wikiscript parser. It reliably turns wikiscript into HTML, but not valid XML. To use it for mining, you need a [wikiscript -> virtual DOM -> screen-scraping] flow, but getting structured data this way is a challenge.

This library is built to work well with [wikipedia-to-mongo](https://github.com/spencermountain/wikipedia-to-mongodb), letting you parse a wikipedia dump in nodejs easily.


[![npm version](https://badge.fury.io/js/wtf_wikipedia.svg)](http://badge.fury.io/js/wtf_wikipedia)

# What it does
* Detects and parses **redirects** and **disambiguation** pages
* Parse **infoboxes** into a formatted key-value object
* Handles recursive templates and links- like [[.. [[...]] ]]
* **Per-sentence** plaintext and link resolution
* Parse and format internal links
* Properly resolve {{CURRENTMONTH}} and {{CONVERT ..}} type templates
* Parse **images**, files, and **categories**
* Eliminate xml, latex, css, table-sorting, and 'Egyptian hierogliphics' cruft


m ok, lets write our own parser what culd go rong

its a combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView), [txtwiki](https://github.com/joaomsa/txtwiki.js), and uses the inter-language data from [Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid).

# Methods
## **.parse(markup)**
turns wikipedia markup into a nice json object

```javascript
wtf_wikipedia.parse(someWikiScript)
// {text:[...], infobox:{}, categories:[...], images:[] }
```

## **.from_api(title, lang_or_wikiid, callback)**
retrieves raw contents of a wikipedia article - or other mediawiki wiki identified by its [dbname](http://en.wikipedia.org/w/api.php?action=sitematrix&format=json)

to call non-english wikipedia apis, add it as the second paramater to from_api
```javascript
wtf_wikipedia.from_api("Toronto", "de", function(markup){
  var text= wtf_wikipedia.plaintext(markup)
  //Toronto ist mit 2,6 Millionen Einwohnern..
})
```

you may also pass the wikipedia page id as parameter instead of the page title:
```javascript
wtf_wikipedia.from_api(64646, "de", function(markup){
  //...
})
```
the from_api method follows redirects.
## **.plaintext(markup)**
returns only nice text of the article

if you're scripting this from the shell, install -g, and:
````shell
$ wikipedia_plaintext George Clooney
# George Timothy Clooney (born May 6, 1961) is an American actor ...

$ wikipedia Toronto Blue Jays
# {text:[...], infobox:{}, categories:[...], images:[] }

````
# Sample Output
Sample output for [Royal Cinema](https://en.wikipedia.org/wiki/Royal_Cinema)
````javascript
{
  type: 'page',
  sections: [
    {
      title: '',//(intro)
      depth: 1,
      sentences: [
        {
          text: 'The Royal Cinema is an Art Moderne event venue and cinema in Toronto, Canada.',
          links: [
            {
              page: 'Streamline Moderne', // (a href)
              text: 'Art Moderne'         // (link text)
            },
            {
              page: 'Toronto',
              text: 'Toronto'
            },
            {
              page: 'Canada',
              text: 'Canada'
            }
          ]
        },
        {
          text: 'It was built in 1939 and owned by Miss Ray Levinsky.'
        }
      ]
    },
    {
      title: 'History',
      depth: 1,
      sentences: [
        {
          text:
            'When it was built in 1939, it was called The Pylon, with an accompanying large sign at the front of the theatre.'
        }
      ]
    }
  ],
  categories: [
    'National Historic Sites in Ontario',
    'Cinemas and movie theatres in Toronto',
    'Streamline Moderne architecture in Canada',
    'Theatres completed in 1939'
  ],
  images: ['Royal_Cinema.JPG'],
  infobox: {
    former_name: {
      text: 'The Pylon, The Golden Princess'
    },
    address: {
      text: '608 College Street',
      links: [
        {
          page: 'College Street (Toronto)',
          src: 'College Street'
        }
      ]
    },
    opened: {
      text: 1939
    }
    // ...
  }
};
````

Sample Output for [Whistling](https://en.wikipedia.org/w/index.php?title=Whistling)
````javascript
{ type: 'page',
  sections:[
   { title:'Intro', depth:1, sentences: [ [Object], [Object], [Object], [Object] ]},
   { title:'Musical/melodic whistling', depth:1, sentences: [ [Object], [Object], [Object], [Object] ]},
   { title:'Functional whistling', depth:1, sentences: [ [Object], [Object], [Object], [Object] ]},
   { title:'Whistling as a form of communication', depth:2, sentences: [ [Object], [Object], [Object], [Object] ]},
   { title:'Sport', depth:2, sentences: [ [Object], [Object], [Object], [Object] ]},
   { title:'See Also', depth:1, list: [ [Object], [Object] ]},
  ],
  categories: [ 'Oral communication', 'Vocal music', 'Vocal skills' ],
  images: [ 'Image:Duveneck Whistling Boy.jpg' ],
  infobox: {} 
}
````

## Contributing
Never-ender projects like these need all-hands, and I'm a pretty friendly maintainer. (promise)

```bash
npm install
npm test
npm run build #to package-up client-side
```

Don't be mad at me, be mad at them

MIT
