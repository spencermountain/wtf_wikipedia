const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Jurassic Park (film)');
//   console.log(doc.infoboxes(0).keyValue());
// })();

// let doc = readFile('jodie_emery');{{MPC|75482|(75482) 1999 XC173}}
// console.log(doc.markdown());

var str = `hello {{Election box begin |title=[[United Kingdom general election, 2005|General Election 2005]]: Strangford}}
 {{Election box candidate
   |party      = Labour
   |candidate  = Tony Blair
   |votes      = 9,999
   |percentage = 50.0
   |change     = +10.0
 }}
 {{Election box candidate
   |party      = Conservative
   |candidate  = Michael Howard
   |votes      = 9,999
   |percentage = 50.0
   |change     = +10.0
 }}
 {{Election box gain with party link
  |winner     = Conservative Party (UK)
  |loser      = Labour Party (UK)
  |swing      = +10.0
}}
 {{Election box end}}
 world`;

// str = `hello {{math|big=1|1 + 2 {{=}} 3}} world`;

let doc = wtf(str);
console.log(doc.text());
console.log(doc.templates(0));
