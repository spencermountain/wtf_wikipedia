//const wtf= require('wtf_wikipedia')
const wtf = require('../src');
//fetch a list of all apollo astronauts
// page may have changed. made on Nov-2018

const options = {
  'Api-User-Agent': 'wtf_wikipedia example'
};

(async () => {
  //there's a good list here
  // https://en.wikipedia.org/wiki/List_of_Apollo_astronauts
  let doc = await wtf.fetch('List of Apollo astronauts', options);

  //grab the first table
  let s = doc.sections('Apollo astronauts who walked on the Moon');
  let list = s.tables(0).json();

  //grab the second table
  s = doc.sections('Apollo astronauts who flew to the Moon without landing');
  let list2 = s.tables(0).json();

  //combine them together
  list = list.concat(list2);

  //grab the data we want
  let data = list.map((row) => {
    let result = {
      name: '',
      mission: ''
    };
    if (row.name) {
      result.name = row.name.text;
      //get the actual wikipedia page..
      if (row.links) {
        result.name = row.links[0].page;
      }
    }
    //get their mission(s)
    if (row.mission) {
      result.mission = row.mission.text;
    }
    return result;
  });
  console.log(data);
})();
