const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('2009–10 Miami Heat season');
//   // var doc = await wtf.random();
//   console.log(doc.json());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

//
let str = `
{| class="navbox plainrowheaders wikitable" style="width:100%"
!style=background:white scope="col"|Division
!style=background:white scope="col"|Club
!style=background:white scope="col"|City
!style=background:white scope="col"|[[List of current National Football League stadiums|Stadium]]<ref name="NFL stadiums go from boom to swoon in span of a decade">{{cite web|url=http://www.nfl.com/news/story/09000d5d82a5c85c/article/nfl-stadiums-go-from-boom-to-swoon-in-span-of-a-decade|title=NFL stadiums go from boom to swoon in span of a decade|last=Breer|first=Albert|date=July 6, 2012|publisher=NFL|accessdate=February 1, 2013}}</ref>
|-
!style=background:white rowspan="4"|[[AFC East|East]]
|'''[[Buffalo Bills]]'''
|[[Orchard Park (town), New York|Orchard Park, New York]]
|[[New Era Field]]
|align=center|71,608
|{{Coord|42.774|-78.787|type:landmark|name=Buffalo Bills}}
|{{dts|1960}} ([[American Football League|AFL]]), {{dts|1970}} (NFL)
|[[Sean McDermott]]
|-
|}`;
let doc = wtf(str);
console.log(wtf(str).tables(0).keyValue());
// console.log(wtf(str).templates());
