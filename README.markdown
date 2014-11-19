##Parsing Wikipedia script is basically NP-Hard

its the wurst. I'm just trying my best.

it turns a wikipedia article into a parsed JSON object, and handles the ad-hoc recursive templates shinanigans ad infinitum.

its a shoulder-shrugging combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView) and [txtwiki](https://github.com/joaomsa/txtwiki.js)

m ok, lets write our own parser what culd go rong
```bash
npm install wtf_wikipedia
````
#Output
Sample output of [Royal Cinema](https://en.wikipedia.org/wiki/Royal_Cinema)
````javascript
{
  "text": {
    "Intro": [
      "{{Infobox venue",
      "When it was built in 1939, it was called The Pylon, with an accompanying large sign at the front of the theatre. It included a roller-skating rink at the rear of the theatre, and a dance hall on the second floor.",
      "In the 1950s the theatre was purchased by Rocco Mastrangelo.",
      "During the daytime it operates as a film and television post-production studio.",
      "The Royal was featured in the 2013 film The F Word."
    ]
  },
  "data": {
    "links": [
      "College Street (Toronto)",
      "Toronto",
      "Ontario",
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
  },
  "infobox": {
    "name": "Royal Cinema",
    "former": "The Pylon, The Golden Princess",
    "image": "Royal_Cinema.JPG",
    "image_size": "250px",
    "caption": "The Royal Cinema in 2009",
    "address": "608 [[College Street (Toronto)|College Street]]",
    "location": "[[Toronto]], [[Ontario]]",
    "opened": "1939",
    "architect": "Benjamin Swartz",
    "website": "{{URL|theroyal.to}}"
  }
}
````

Don't be mad at me, be mad at them

MIT