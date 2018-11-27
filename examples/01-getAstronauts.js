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
  let list = s.tables(0).keyValue();

  //grab the second table
  s = doc.sections('Apollo astronauts who flew to the Moon without landing');
  let list2 = s.tables(0).keyValue();

  //combine them together
  list = list.concat(list2);

  //grab the columns we want
  console.log(list.map(o => o.col2));
})();
