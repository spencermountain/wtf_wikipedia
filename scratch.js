const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const document = await wtf.fetch('Tiger', 'de');
//
//   document.sections().forEach(section => console.log(section.title() || 'Intro'));
// })();

let str = `hello up here
=== one ===
hello
<math>foo</math>
==two==
lkjsdf
==three==
<references>
</references>
`;

wtf(str).sections().forEach(section => console.log(section.title() || 'Intro'));
