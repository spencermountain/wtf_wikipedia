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
| image            = Marc Emery and Jodie Emery.JPG
| alt              =
| caption          = Emery with husband Marc, Toronto Freedom Festival 2010
| birth_name       =
| birt.h_date       = January 4, 1985<ref name="facebook"/>
| birth_place      = [[Kamloops, BC]]<ref name="jodiemla"/>
| death_date       =
| death_place      =
| residence        = [[Vancouver]], [[British Columbia|BC]], Canada
| party            = [[Liberal Party of Canada]], <br>[[Green Party of British Columbia|B.C. Green Party]],<br>  [[British Columbia Marijuana Party|B.C. Marijuana Party]]
| nationality      = Canadian
| other_names      = Princess of Pot
| occupation       = Activist, Politician
| known_for        = [[cannabis (drug)|Cannabis]] legalisation
}}
'''Jodie Emery'''  (born January 4, 1985) is a  [[Canada|Canadian]] [[Cannabis (drug)|cannabis]] [[Legality of cannabis|activist]], and politician. She is the wife of activist [[Marc Emery]], and co-owner of [[Cannabis Culture (magazine)|Cannabis Culture magazine]], [[Pot TV]], and the retail store ''Cannabis Culture Headquarters''.
`;
let doc = wtf(str);
console.log(doc.json({
  encode: true
}).sections[0]);
