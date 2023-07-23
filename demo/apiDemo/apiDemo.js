/**
 * @fileoverview wtf_wikipedia/demo/detailedDemo/detailedDemo.js
 * demonstrates a detailed example of the wtf_wikipedia API.
 */

wtf.Helper.init(main);  // calls main after doc loaded, breaks back button cache

// main entry point for the app
async function main() {
  let astronauts = [
    'Neil Armstrong',
    'Buzz Aldrin',
    'Pete Conrad',
    /*****
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
    'Thomas P. Stafford',
    'Michael Collins (astronaut)',
    'Richard F. Gordon Jr.',
    'Jack Swigert',
    'Fred Haise',
    'Stu Roosa',
    'Al Worden',
    'Ken Mattingly',
    'Ron Evans',
    *****/
  ];

  // fetching just one item
  let doc = await wtf.Helper.fetchNicely('Grace Hopper');
  console.log('doc', doc);


  // fetching a list of items
  // let docList = await wtf.Helper.fetchNicely(astronauts);

}
