//const wtf= require('wtf_wikipedia')
const wtf = require('../src');
//get all birthplaces of the apollo astronauts

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
  'John Young (astronaut)',
  'Charles Duke',
  'Eugene Cernan',
  'Harrison Schmitt',
  'Frank Borman',
  'Jim Lovell',
  'Bill Anders',
  'Tom Stafford',
  'Michael Collins (astronaut)',
  'Dick Gordon',
  'Jack Swigert',
  'Fred Haise',
  'Stu Roosa',
  'Al Worden',
  'Ken Mattingly',
  'Ron Evans'
];

// Richard Gordon no infobox
// Thomas Stafford

const getInfobox = function(doc) {
  let obj = {};
  if (!doc.infobox(0)) {
    console.log(doc.title() + ' - no infobox');
  } else {
    obj = doc.infobox(0).keyValue();
  }
  return {
    name: doc.title() || obj.name,
    missions: obj.mission || '',
    born: obj.born || obj.birth_date,
    died: obj.died || obj.death_date,
  };
};

//send it off!
wtf.fetch(astronauts, options, (err, docs) => {
  let data = docs.map(getInfobox);
  console.log(JSON.stringify(data, null, 2));
});
