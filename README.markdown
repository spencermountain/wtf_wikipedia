##Parsing Wikipedia markup is basically NP-Hard

its [really the worst](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax).   I'm trying my best.

**wtf_wikipedia** turns wikipedia article markup into a well-built JSON object, and handles many vile recursive template shinanigans and regular-expressionisms.

Making your own parser is never a good idea, but this library is a very detailed and deliberate creature. With it, you can gork through a wikipedia dump and maintain a reasonable expectation of respect.

```bash
npm install wtf_wikipedia
````
then:
````javascript
var wikipedia = require("wtf_wikipedia")
//fetch wikipedia markup from api..
wikipedia.from_api("Toronto", function(markup){
  var obj= wikipedia.parse(markup)
  console.log(obj)
  // {text:[...], data:{...}}
})
````
if you only want some nice plaintext, and no junk:
````javascript
var text= wikipedia.plaintext(markup)
// "Toronto is the most populous city in Canada and the provincial capital..."
````
if you're scripting this from the shell, install -g, and:
````shell
wikipedia_plaintext George Clooney
# George Timothy Clooney (born May 6, 1961) is an American actor ...
wikipedia Toronto Blue Jays
# {text:[...], data:{...}}
````


#What it does
* Detects and parses **redirects** and **disambiguation** pages
* Parse **infoboxes** into a formatted key-value object
* Handles recursive templates and links- like [[.. [[...]] ]]
* Per-sentence plaintext
* Parse and format internal links
* Properly resolve the {{CURRENTMONTH}} and {{CONVERT ..}} type templates
* Parse **images**, files, and **categories**
* Eliminate majority of xml, latex, css, and 'Egyptian hierogliphics' templating cruft



m ok, lets write our own parser what culd go rong

its a combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView) and [txtwiki](https://github.com/joaomsa/txtwiki.js)

#Methods
* **.parse(markup)** - turns wikipedia markup into a nice json object
* **.from_api(title, callback)** -  retrieves raw contents of a wikipedia article
* **.plaintext(markup)** -  returns only nice text of the article

#Output
Sample output for [Royal Cinema](https://en.wikipedia.org/wiki/Royal_Cinema)
````javascript
{
  "text": {
    "Intro": [
      {
        "text": "The Royal Cinema is an Art Moderne event venue and cinema in Toronto, Canada.",
        "links": [
          {
            "page": "Art Moderne"
          },
          {
            "page": "Movie theater",
            "src": "cinema"
          },
          {
            "page": "Toronto"
          },
          {
            "page": "Canada"
          }
        ]
      },
      ...
      {
        "text": "The Royal was featured in the 2013 film The F Word.",
        "links": [
          {
            "page": "The F Word (2013 film)",
            "src": "The F Word"
          }
        ]
      }
    ]
  },
  "data": {
    "categories": [
      "National Historic Sites in Ontario",
      "Cinemas and movie theatres in Toronto",
      "Streamline Moderne architecture in Canada",
      "Theatres completed in 1939"
    ],
    "images": [
      "Royal_Cinema.JPG"
    ],
    "infobox": {
      "former_name": {
        "text": "The Pylon, The Golden Princess"
      },
      "address": {
        "text": "608 College Street",
        "links": [
          {
            "page": "College Street (Toronto)",
            "src": "College Street"
          }
        ]
      },
      "location": {
        "text": "Toronto, Ontario",
        "links": [
          {
            "page": "Toronto"
          },
          {
            "page": "Ontario"
          }
        ]
      },
      "opened": {
        "text": 1939
      },
      ...
    }
  }
}
````

Sample Output for [Whistling]()
````javascript
{ type: 'page',
  text:
   { Intro: [ [Object], [Object], [Object], [Object] ],
     'Musical/melodic whistling':
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ],
     'Functional whistling': [ [Object], [Object], [Object], [Object], [Object], [Object] ],
     'Whistling as a form of communication':
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ],
     Sport: [ [Object], [Object], [Object], [Object], [Object] ],
     Superstition:
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ],
     ' Whistling competitions': [ [Object], [Object], [Object], [Object] ] },
  data:
   { categories: [ 'Oral communication', 'Vocal music', 'Vocal skills' ],
     images: [ 'Image:Duveneck Whistling Boy.jpg' ],
     infobox: {} } }
````

Don't be mad at me, be mad at them


If you're grepping a wikipedia dump, check out [wikipedia-to-mongo](https://github.com/spencermountain/wikipedia-to-mongodb)

MIT