const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`Abraham Lincoln`, 'en');
//   // doc.html();
// })();



let str = `{{Infobox person
| name        = David Koresh
| image       = David koresh.jpg{{!}}border
| image_size  =
| caption     = Koresh in 1987
}}`;
console.log(wtf(str).images());
