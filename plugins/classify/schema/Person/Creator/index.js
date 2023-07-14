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
  //
  categories: {
    mapping: ['Fellows of the Royal Society'],
    patterns: [/(engineers|inventors|artists|painters|sculpters|choreographers)/],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [
      'artist',
    ],
    patterns: [],
  },
  //
  sections: {
    mapping: [],
    patterns: [/filmography/, /bibliography/, /collaberators/, /early influences/, /discovery/],
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
