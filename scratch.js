const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   let doc = await wtf.fetch('New York City', 'en');
//   console.log(doc.infoboxes());
// })();

// let doc = readFile('jodie_emery');
// console.log(doc.markdown());
// console.log(doc.infobox(0).images(0).thumb());
//
var str = `#REDIRECT[[List of Evil Con Carne characters#Cod Commando]]

{{Redirect category shell|
{{R from fictional character|Evil Con Carne}}
{{R to section}}
}}

[[Category:Evil Con Carne character redirects to lists]]
[[Category:Fictional anthropomorphic characters]]
[[Category:Fictional secret agents and spies]]
[[Category:Fictional characters introduced in 2001]]`;
let doc = wtf(str);
console.log(doc.isRedirect());
console.log(doc.json());
