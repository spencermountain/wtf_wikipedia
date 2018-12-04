const got = require('got');
const ns = 10; //templates

let url = 'https://en.wikipedia.org/w/api.php?action=query&list=allpages&aplimit=500&apnamespace=' + ns + '&format=json';

const doit = function(from) {
  let myUrl = url + '&apfrom=' + encodeURIComponent(from);

  got(myUrl).then((res) => {
    let data = JSON.parse(res.body);
    let arr = data.query.allpages;
    arr.forEach((o) => {
      console.log(o.title);
    });

    let cursor = data.continue.apcontinue;
    if (cursor) {
      doit(cursor);
    }
  });

};

doit('');
