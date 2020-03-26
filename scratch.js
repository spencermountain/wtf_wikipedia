var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/i18n/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

// wtf.fetch('Airbus A320 family').then(doc => {
// console.log(doc.json())
// let html = doc.html()
// console.log(html)
// })

// wtf.fetchCategory('Larchmont, New York').then(res => {
//   res.docs.forEach(doc => {
//     console.log(doc.title())
//     console.log(doc.summary())
//     console.log('\n\n')
//   })
// })
// let str =
//   'Larchmont Yacht Club is a private, members-only yacht club situated on Larchmont Harbor in the Village of Larchmont, in Westchester County, New York. '
// console.log(wtf(str).summary())

// let file = 'United-Kingdom'
// let txt = require('fs')
//   .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
//   .toString()
// let doc = wtf(txt)
// let res = doc.classify()
// console.log(res)
let str = `{|{{Infobox aircraft begin
  | name = A320 family <br />A318/A319/A320/A321
  | image = File:Jetstar Airbus A320 in flight (6768081241) crop.jpg<!-- Flight images are preferred for aircraft. Discuss on talk page first before changing, thanks! -->
  | caption = A Jetstar Airways A320 in flight. The A320 is a low wing airliner with twin underwing turbofans
  }}{{Infobox aircraft type
  | type = [[Single-aisle]] [[jet airliner]]
  | national origin = Multi-national{{efn|Final assembly in France (Toulouse,) Germany (Hamburg), China (Tianjin,) and the United States (Mobile, Alabama)}} <!-- Use the main nation (e.g. UK), not constituent country (England); don't use "EU". List collaborative programs of only 2 or 3 nations; for more than 3, use "Multi-national" per [[Template:Infobox aircraft type]] and [[WP:Air/PC]] guidelines. -->
  | manufacturer = [[Airbus]]
  | first flight = 22 February 1987
  | introduced = 18 April 1988 with [[Air France]]<ref name=Flight3sep1988>{{cite magazine|author1=David Learmount|title=A320 in service: an ordinary aeroplane|journal=Flight International|date=3 September 1988|volume=134|issue=4129|pages=132, 133|url=http://www.flightglobal.com/pdfarchive/view/1988/1988%20-%202445.html|publisher=Reed Business Publishing|issn=0015-3710|access-date=18 November 2014|archive-url=https://web.archive.org/web/20141129043316/http://www.flightglobal.com/pdfarchive/view/1988/1988%20-%202445.html|archive-date=29 November 2014|url-status = live}}</ref>
  | produced = 1986–present
  | retired = 
  | status = In service
  | primary user = [[American Airlines]]{{efn|name=aamerger|At 30 September 2017, Airbus still list American Airlines and US Airways as separate operators. Following a merger<ref name="USA Today">{{cite news |title=US Airways' final flight closes curtain on another major airline |url=https://www.usatoday.com/story/travel/flights/todayinthesky/2015/10/15/us-airways-final-flight-american-merger/73922874/ |work=USA Today |date=16 October 2015 |accessdate=22 October 2015 |archive-url=https://web.archive.org/web/20151021143507/http://www.usatoday.com/story/travel/flights/todayinthesky/2015/10/15/us-airways-final-flight-american-merger/73922874/ |archive-date=21 October 2015 |url-status = live}}</ref> of the airlines in October 2015, the American Airlines total used here is combined for both carriers}} <!--Limit one (1) primary user. Top four (4) users listed in 'primary user' and 'more users' fields based on number of their fleets. -->
  | more users = {{Plainlist|<!--Limit is three (3) in "more users" field!-->
  * [[EasyJet]]{{efn|EasyJet is divided in [[EasyJet]] Ltd (166 A320s), [[EasyJet Europe]] (137 A320s) and [[EasyJet Switzerland]] (30 A320s)}}
  * [[China Eastern Airlines]]
  * [[China Southern Airlines]]
  }}
  | number built = 9,313 {{as of|2020|02|29|lc=y}}<ref name="Airbus_Orders"/><!-- please see discussion about number built before changing this -->
  | program cost = £2 billion ($2.8 billion, 1984{{Snd}} Flight International estimate)<ref>{{cite news |url= https://www.flightglobal.com/news/articles/opinion-a320-has-repaid-faith-of-airbus-and-gover-447206/ |title= A320 has repaid faith of Airbus{{Snd}} and governments |date= 29 March 2018 |work= Flightglobal }}</ref>(£{{inflation|GBP|2|1984}} billion today) or 5.486 Bn [[French franc|FRF]] (1988)<ref>{{cite journal |author= Pierre Muller (Fondation nationale des sciences politiques / Centre des recherches administratives) |journal= Politique et Management Public |year= 1989 |url= http://www.persee.fr/web/revues/home/prescript/article/pomap_0758-1726_1989_num_7_1_2877 |title= La transformation des modes d'action de l'État à travers l'histoire du programme Airbus |page= 268 |language= fr}}</ref>
  | unit cost = {{plainlist|
  * 2018 prices:<ref name="2018 prices">{{cite web|title=AIRBUS AIRCRAFT 2018 AVERAGE LIST PRICES* (USD millions)|url=http://www.airbus.com/content/dam/corporate-topics/publications/backgrounders/Airbus-Commercial-Aircraft-list-prices-2018.pdf|website=airbus.com|publisher=Airbus|accessdate=15 January 2018|archive-url=https://web.archive.org/web/20180115185203/http://www.airbus.com/content/dam/corporate-topics/publications/backgrounders/Airbus-Commercial-Aircraft-list-prices-2018.pdf|archive-date=15 January 2018|url-status = live}}</ref>
  * A318: US$77.4 million
  * A319: US$92.3 million
  * A320: US$101.0 million
  * A321: US$118.3 million
  }}
  | variants with their own articles = {{Unbulleted list
   | [[Airbus A318]]
   | [[Airbus A319]]
   | [[Airbus A321]]
  }}
  | developed into = [[Airbus A320neo family]]
  }}
  |}`
let doc = wtf(str)
console.log(doc.table())
