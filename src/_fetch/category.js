const site_map = require('../_data/site_map');
const request = require('./_request');
const getParams = require('./_params');

const normalizeCategory = function( cat = '' ) {
  if (/^Category/i.test(cat) === false) {
    cat = 'Category:' + cat;
  }
  cat = cat.replace(/ /g, '_');
  return cat;
};

const makeUrl = function(cat, lang) {
  cat = encodeURIComponent(cat);
  let url = `https://${lang}.wikipedia.org/w/api.php`;
  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }
  url += `?action=query&list=categorymembers&cmtitle=${cat}&cmlimit=500&format=json&origin=*&redirects=true&cmtype=page|subcat`;
  return url;
};


const addResult = function(body, out) {
  if (body.query && body.query.categorymembers) {
    let list = body.query.categorymembers;
    list.forEach((p) => {
      if (p.ns === 14) {
        out.categories.push(p);
      } else {
        out.pages.push(p);
      }
    });
    return out;
  }
  return out;
};



const getCategories = function(cat, a, b, c) {
  let {lang, options, callback} = getParams(a, b, c);
  //cleanup cat name
  cat = normalizeCategory(cat);
  let url = makeUrl(cat, lang, options);
  let safety = 0;

  let output = {
    category: cat,
    pages: [],
    categories: []
  };

  const doit = function( cntd = '' , cb) {
    let myUrl = url + '&cmcontinue=' + cntd;
    let p = request(myUrl, options);
    p.then((body) => {
      output = addResult(body, output);
      //should we do another?
      if (body.continue && body.continue.cmcontinue && body.continue.cmcontinue !== cntd && safety < 25) {
        safety += 1;
        doit(body.continue.cmcontinue, cb);
      } else {
        cb(null, output);
      }
    });
  };

  return new Promise(function(resolve, reject) {
    doit('', (err) => {
      if (typeof callback === 'function') {
        callback(err, output);
      }
      if (err) {
        reject(err);
      }
      resolve(output);
    });
  });


// return new Promise(function(resolve, reject) {
//   let p = request(url, options);
//   p.then((res) => {
//     return postProcess(res, options);
//   }).then((result) => {
//   }).catch(reject);
// });
};

module.exports = getCategories;
