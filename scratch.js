const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

(async () => {
  var doc = await wtf.fetch('Aardwolf');
  console.log(doc.json());
// var doc = await wtf.random();
// let list = await wtf.category('National Basketball Association teams');
// let list = await wtf.category(856891);
})();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// let str = `{{MLB game log section|month=April|style=|hide=y}}
// |- style="background-color:#ffbbbb"
// | 1 || April 2 || @ [[Kansas City Royals|Royals]] || 7 – 1 || [[Gil Meche|Meche]] (1-0)|| '''[[Curt Schilling|Schilling]]''' (0-1) || || 41,257 || 0-1
// |- style="background-color:#bbffbb"
// | 2 || April 4 || @ [[Kansas City Royals|Royals]] || 7 – 1 || '''[[Josh Beckett|Beckett]]''' (1-0) || [[Odalis Pérez|Pérez]] (0 – 1) || || 22,348 || 1-1
// |- style="background-color:#bbffbb"
// | 3 || April 5 || @ [[Kansas City Royals|Royals]] || 4 – 1 || '''[[Daisuke Matsuzaka|Matsuzaka]]''' (1-0) || [[Zack Greinke|Greinke]] (0-1) || '''[[Jonathan Papelbon|Papelbon]]''' (1) || 23,170 || 2-1
// |- style="background-color:#ffbbbb"
// | 4 || April 6 || @ [[Texas Rangers (baseball)|Rangers]] || 2 – 0 || [[Rob Tejeda|Tejeda]] (1-0) || '''[[Tim Wakefield|Wakefield]]''' (0-1) || [[Akinori Otsuka|Otsuka]] (1) || 51,548 || 2-2
// |- style="background-color:#ffbbbb"
// | 5 || April 7 || @ [[Texas Rangers (baseball)|Rangers]] || 8 – 2 || [[Kevin Millwood|Millwood]] (1-0) || '''[[Julián Tavárez|Tavárez]]''' (0-1) || ||40,865 || 2-3
// |- style="background-color:#bbffbb"
// {{MLB game log section end}}`;
//
// console.log(wtf(str).text());
// console.log(wtf(str).templates());
// console.log(wtf(str).tables(0).keyValue());
