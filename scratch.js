const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Jurassic Park (film)');
//   console.log(doc.infoboxes(0).keyValue());
// })();

// let doc = readFile('jodie_emery');
// console.log(doc.markdown());

var str = `
'''Kimberly Denise Jones''' (born July 11, 1974 or 1975),<ref>Sources differ, as described by {{cite web|url=http://www.vh1.com/music/tuner/2012-07-11/how-old-is-lil-kim-exactly/|title=How Old Is Lil' Kim, Exactly?|first=Bené|last=Viera|publisher=VH1|date=July 11, 2012|accessdate=February 14, 2014}} Those giving 1974 include:
*{{cite book|url=https://books.google.com/books?id=G5vUbBuk-Q0C&pg=PA383|title=The Billboard Book of Top 40 Hits, 9th Edition|first=Joel|last=Whitburn|page=383|publisher=Billboard Books|year=2010|isbn=978-0-8230-8554-5|accessdate=February 14, 2014}}
*{{cite web|url=http://www.fuse.tv/artists/lil-kim|title=Lil' Kim|publisher=Fuse|accessdate=February 14, 2014}}
*{{cite web|url=http://www.bop.gov/inmateloc/|title=Federal Bureau of Prisons|quote=Inmate #56198-054|accessdate=February 20, 2015}}
*{{cite book|url=https://books.google.com/books?id=bXy2wTEsbCsC&pg=PA441|title=Icons of Hip Hop: An Encyclopedia of the Movement, Music, and Culture, Volume 2|year=2007|last=Hess|first=Mickey|publisher=Greenwood Press|isbn=978-0-313-33904-2|page=441}}

Those giving 1975 include:
*{{cite book|title=Rolling Stone Encyclopedia of Rock & Roll|date=2001|page=566|isbn=978-0-7432-0120-9|publisher=Touchstone|author=Editors of Rolling Stone}}
*{{cite book|url=https://books.google.com/books?id=X7ZYsnTPIhwC&pg=PA208|title=Encyclopedia of African American Actresses in Film and Television|date=2009|page=208|last=McCann|first=Bob|publisher=McFarland & Company, Inc|isbn=978-0-7864-3790-0}}
*{{cite book|url=https://books.google.com/books?id=RkPqzlhF3QkC&pg=PA207|title=This Day in Music: An Every Day Record of Musical Feats and Facts|date=2014|page=207|publisher=Omnibus Press|isbn=978-1-78323-126-3|last=Cossar|first=Neil}}

Those giving 1976 include:
*[https://www.youtube.com/watch?v=ytDIsYWQTnY Lil' Kim - VH1 - Driven]</ref> known professionally by her [[stage name]] '''Lil' Kim''', is an American [[Rapping|rapper]], songwriter, record producer, model, and actress. She was born and raised in [[Brooklyn]], [[New York (state)|New York]], living much of her adolescent life on the streets after being expelled from home. In her teens, Jones would [[freestyle rap]], heavily influenced by fellow female hip-hop artists like [[MC Lyte]] and [[The Lady of Rage]]. In 1994, she was discovered by fellow rapper [[The Notorious B.I.G.]], who invited her to join his rap group [[Junior M.A.F.I.A.]]; their debut album as a group, ''[[Conspiracy (Junior M.A.F.I.A. album)|Conspiracy]]'', generated two top 20 singles in the United States and was certified [[Gold certification|gold]] by the [[Recording Industry Association of America|Recording Industry Association of America (RIAA)]].`;

// str = `hello {{math|big=1|1 + 2 {{=}} 3}} world`;

let doc = wtf(str);
console.log(doc.text());
// console.log(doc.templates(0));
// console.log(doc.links(0));
