import Actor from './Actor.js'
import Musician from './Musician.js'
import Author from './Author.js'
import Director from './Director.js'

export default {
  name: 'Creator',
  //
  children: {
    Actor,
    Musician,
    Author,
    Director,
  },
  properties: {
  },
  //
  categories: {
    mapping: [],
    patterns: [],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [],
    patterns: [],
  },
  //
  sections: {
    mapping: [],
    patterns: [/filmography/, /bibliography/, /collaberators/, /early influences/],
  },
  //
  templates: {
    mapping: [],
    patterns: [],
  },
  //
  titles: {
    mapping: [],
    patterns: [],
  },
}
