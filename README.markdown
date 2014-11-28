##Parsing Wikipedia script is basically NP-Hard

its [really the worst](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax). I'm just trying my best.

it turns a wikipedia article into a parsed JSON object, and handles many ad-hoc recursive templates shinanigans ad infinitum.

its a shoulder-shrugging combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView) and [txtwiki](https://github.com/joaomsa/txtwiki.js)

m ok, lets write our own parser what culd go rong
```bash
npm install wtf_wikipedia
````

#What it does
* Handles recursive templates and links- like [[.. [[...]] ]]
* Return per-sentence plaintext
* Parse and format internal links
* Properly resolve {{CURRENTMONTH}} and {{CONVERT ..}} type templates
* Parse infoboxes into a pretty key-value obj
* Parse images, files, and categories
* Eliminate majority of xml, latex, css, and 'Egyptian hierogliphics'! cruft

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
        "text": "In the 1950s the theatre was purchased by Rocco Mastrangelo."
      },
      {
        "text": "In the 1990s, the theatre was renamed the Golden Princess."
      },
      {
        "text": "Since early 2007, Theatre D has owned and operated The Royal."
      },
      {
        "text": "During the daytime it operates as a film and television post-production studio."
      },
      {
        "text": "It hosts film festivals including the European Union Film Festival and Japanese Movie Week."
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
    ]
  },
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
````

Don't be mad at me, be mad at them

MIT