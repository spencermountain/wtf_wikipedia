##Parsing Wikipedia markup is basically NP-Hard

its [really the worst](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax).   I'm just trying my best.

'''wtf_wikipedia''' turns a wikipedia article into a well-built JSON object, and handles many ad-hoc recursive template shinanigans ad infinitum.

```bash
npm install wtf_wikipedia
````
````javascript
var wikipedia = require("wtf_wikipedia")
wikipedia.from_api("Toronto", function(markup){
  var obj= wikipedia.parse(markup)
  console.log(obj)
    /*{text:
       { Intro:
          [ [Object],
            [Object],
            ...
         'Before 1800':
          [ [Object],
            ...
      data:
       { categories:
          [ 'Former colonial capitals in Canada',
            'Populated places established in 1793',
             ...
         images:
          [ 'File:Toronto 1894large.jpg',
            'File:Old Union Station Toronto.jpg',
             ...
         infobox: {
            official_name: [Object],
            nickname: [Object],
            motto: [Object],
            ...
        }
     }
    */
})
````
if you only want some nice plaintext, and no junk:
````javascript
var text= wikipedia.plaintext(markup)
````
if you're scripting this with something else, install -g, and:
````shell
wikipedia_plaintext Toronto Blue Jays
# "Toronto is the most populous city in Canada and the provincial capital..."
wikipedia Toronto Blue Jays
# {huge json}
````


Rolling your own parser is always a bad idea, but this library is the least-bad.
If you're grepping a wikipedia dump, check out [wikipedia-to-mongo](https://github.com/spencermountain/wikipedia-to-mongodb)

#What it does
* Detects and parses redirects and disambig pages
* Parse infoboxes into a pretty key-value obj
* Handles recursive templates and links- like [[.. [[...]] ]]
* Per-sentence plaintext
* Parse and format internal links
* Properly resolve the {{CURRENTMONTH}} and {{CONVERT ..}} type templates
* Parse images, files, and categories
* Eliminate majority of xml, latex, css, and 'Egyptian hierogliphics'! cruft


its a combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView) and [txtwiki](https://github.com/joaomsa/txtwiki.js)

m ok, lets write our own parser what culd go rong

#Methods
* .parse(markup)
  turns wikipedia markup into a nice json object
* .from_api(title, callback)
  retrieves raw contents of a wikipedia article
* .plaintext(markup)
  returns only nice text of the article

#Output
Sample output of [Royal Cinema](https://en.wikipedia.org/wiki/Royal_Cinema)
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
      {
        "text": "It was built in 1939 and owned by Miss Ray Levinsky."
      },
      {
        "text": "When it was built in 1939, it was called The Pylon, with an accompanying large sign at the front of the theatre."
      },
      {
        "text": "It included a roller-skating rink at the rear of the theatre, and a dance hall on the second floor."
      },
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
      {
        "text": "Royal_Cinema.JPG"
      }
    ],
    "infobox": {
      "name": {
        "text": "Royal Cinema"
      },
      "former": {
        "text": "The Pylon, The Golden Princess"
      },
      "image": {
        "text": "Royal_Cinema.JPG"
      },
      "image_size": {
        "text": "250px"
      },
      "caption": {
        "text": "The Royal Cinema in 2009"
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
      "architect": {
        "text": "Benjamin Swartz"
      },
      "website": {
        "text": "theroyal.to"
      },
      "capacity": {
        "text": 390
      }
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

MIT