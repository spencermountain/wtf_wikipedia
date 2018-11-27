//const wtf= require('wtf_wikipedia')
const wtf = require('../src');
//get all birthplaces of the apollo astronauts
//here, we're using es6 await/async, to simplify(?) the async stuff

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
    let obj = doc.infobox(0).keyValue();
    return {
      name: doc.title() || obj.name,
      mission: obj.mission || '',
      born: obj.born || obj.birth_date,
      died: obj.died || obj.death_date,
    };
  }
  return null;
};

let results = [];

//our recursive-function to fetch 5 pages at-a-time
const getFive = async(list, cb) => {
  //send the first 5 pages
  let fivePages = list.slice(0, maxPages);
  let docs = await wtf.fetch(fivePages, options);

  //grab the data we want, for each page
  let data = docs.map((doc) => getInfoboxData(doc));
  results = results.concat(data);

  //keep going!
  let remaining = list.slice(maxPages);
  if (remaining.length > 0) {
    getFive(remaining, cb); //recursive
  } else {
    cb(results); //all done
  }
};

getFive(astronauts, console.log);
