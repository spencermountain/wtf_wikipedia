const wtf = require('./src/index');
const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// `The '''Lot''' ({{lang-oc|Olt}}) is a river in southern [[France]]`
// var str = `{{Time ago| Jan 21, 2001 3:45 PM}}`;
//doc.infoboxes('Venue')
// let doc = fromFile('al_Haytham', {
//   citations: false
// });
// console.log(doc.citations(0).data.url);
// console.log(doc.)
// var str = `Emery is a vegetarian, {{ cite web|foo =    bar| url=http://cool.com/?fun=cool/}}`;
// wtf(str).templates();

// var str = `
// {{cite journal |last=Viollet |first=Benoît |last2=Andreelli |first2=Fabrizio |last3=Jørgensen |first3=Sebastian B. |last4=Perrin |first4=Christophe |last5=Geloen |first5=Alain |last6=Flamez |first6=Daisy |last7=Mu |first7=James |last8=Lenzner |first8=Claudia |last9=Baud |first9=Olivier |last10=Bennoun |first10=Myriam |last11=Gomas |first11=Emmanuel |last12=Nicolas |first12=Gaël |last13=Wojtaszewski |first13=Jørgen F. P. |last14=Kahn1 |first14=Axel |last15=Carling |first15=David |last16=Schuit |first16=Frans C. |last17=Birnbaum |first17=Morris J. |last18=Richter |first18=Erik A. |last19=Burcelin |first19=Rémy |last20=Vaulont |first20=Sophie |display-authors=5 |date=January 2003 |title=The AMP-activated protein kinase α2 catalytic subunit controls whole-body insulin sensitivity |url=http://www.jci.org/articles/view/16567 |journal=The Journal of Clinical Investigation |volume=111 |issue=1 |pages=91–98 |doi=10.1172/JCI16567 |pmc=151837 |pmid=12511592 |access-date=2012-11-17}}`;
//
let str = `{{Infobox settlement
|year=1986 [[world]] {{cite gnis|1562127|Bradley}}
|fun=true
}}`;
// // str = `{{tracklist| title1=fun times}}`;
var arr = wtf(str).templates();
console.log(arr);
