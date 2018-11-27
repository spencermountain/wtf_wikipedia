//get all birthplaces of the apollo astronauts
//here, we're using es6 await/async, to simplify(?) the async stuff
const wtf = require('../src'); //const wtf= require('wtf_wikipedia')
const maxPages = 5;

const options = {
  'Api-User-Agent': 'wtf_wikipedia example'
};

let astronauts = [
  'Neil Armstrong',
  'Buzz Aldrin',
  'Pete Conrad',
  'Alan Bean',
  'Alan Shepard',
  'Edgar Mitchell',
  'David Scott',
  'James Irwin',
  'John Young',
  'Charles Duke',
  'Eugene Cernan',
  'Harrison Schmitt',
  'Frank Borman',
  'Jim Lovell',
  'Bill Anders',
  'Tom Stafford',
  'John Young',
  'Eugene Cernan',
  'Michael Collins',
  'Dick Gordon',
  'Jim Lovell',
  'Jack Swigert',
  'Fred Haise',
  'Stu Roosa',
  'Al Worden',
  'Ken Mattingly',
  'Ron Evans'
];

const getInfoboxData = function(doc) {
  if (doc.infobox(0)) {
    return doc.infobox(0).keyValue().birth_place;
  }
  return null;
};

let results = [];

const doit = async(list, cb) => {
  //only send 5 at-a-time
  let current = list.slice(0, maxPages);
  let docs = await wtf.fetch(current, options);

  //grab the data we want, for each page
  let data = docs.map((doc) => {
    return {
      title: doc.title(),
      birth_place: getInfoboxData(doc)
    };
  });
  results.push(data);

  //keep going!
  let remaining = list.slice(maxPages);
  if (remaining.length > 0) {
    doit(remaining, cb); //recursive
  } else {
    cb(results); //all done
  }
};

doit(astronauts, console.log);
