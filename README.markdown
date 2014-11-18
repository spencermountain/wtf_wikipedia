#Parsing Wikipedia script is basically NP-Hard

parsing wikimedia script is the wurst, this library is simply trying its best.

it turns a wikipedia article into a parsed JSON object, and handles the ad-hoc recursive templates shinanigans ad infinitum.

its a manic combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView) and [txtwiki](https://github.com/joaomsa/txtwiki.js)

m ok, lets write our own parser what culd go rong
#Output
Sample output of [Royal Cinema](https://en.wikipedia.org/wiki/Royal_Cinema)
````javascript
  {
    "text": {
      "intro": [
        "The Royal Cinema  is an Art Moderne event venue and cinema in Toronto, Canada. It was built in 1939 and owned by Miss Ray Levinsky. ",
        "When it was built in 1939, it was called The Pylon, with an accompanying large sign at the front of the theatre. It included a roller-skating rink at the rear of the theatre, and a dance hall on the second floor. ",
        "In the 1950s the theatre was purchased by Rocco Mastrangelo. ",
        "During the daytime it operates as a film and television post-production studio. ",
        "The Royal was featured in the 2013 film The F Word."
      ]
    },
    "data": {
      "links": [
        "Art Moderne",
        "movie theater",
        "Toronto",
        "Canada",
        "The F Word (2013 film)",
        "List of cinemas in Toronto"
      ],
      "categories": [
        "Category:National Historic Sites in Ontario",
        "Category:Cinemas and movie theatres in Toronto",
        "Category:Streamline Moderne architecture in Canada",
        "Category:Theatres completed in 1939"
      ],
      "images": []
    }
  }
````

Don't be mad at me, be mad at them

MIT