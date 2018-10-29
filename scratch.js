const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   let doc = await wtf.fetch('Pete Townshend', 'en');
//   console.log(doc.infoboxes(0).images(0).thumb());
// })();

// let doc = readFile('jodie_emery');
// console.log(doc.infobox(0).images(0).thumb());

var str = `
{{Infobox person
| name             = Jodie Emery
| birt.h_date       = January 4, 1985<ref name="facebook"/>
| known_for        = [[cannabis (drug)|Cannabis]] legalisation
}}
hello world  {{lkjsdf|foo=28|hs.he=90}}.
{| class="wikitable"
|-
! Foo
! Foo.bar
|-
| row 1, cell 1
| row 1, cell 2
|-
| row 2, cell 1
| row 2, cell 2
|}
`;
let doc = wtf(str);
let json = doc.json({
  encode: true
});
console.log(json.sections[0].infoboxes[0]);
