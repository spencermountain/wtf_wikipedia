import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `  `
// missing
str = `{{updated|4 June 2021|}}`

// {{Updated|date|<ref>reference</ref>}}
// {{Soccerway | ID | NAME }}
// {{In lang|de}} → (in German)
// {{IndexFungorum|133136}}
//  ''The Telegraph''{{'}}s reviewer 

/*
{{OldStyleDate|2 February|1905|20 January}}  - Result: 2 February [O.S. 20 January] 1905

{{convert|190|lb|kg|abbr=on}}

{{lang-ru|Еле́на Ю́рьевна Гага́рина}}

{{convert|1391|mm|in}}  -> output 'millimeters'? 

(28 May 1932 &ndash; 23 May 1979)   -> '–'

 {{fdate|8 March 2012|MDY}}) 

  {{×|11.5|7.1}}

{{nihongo|'''Mikirō Sasaki'''|佐々木 幹郎|Sasaki Mikirō|October 20, 1947}} is a Japanese [[Poetry|poet]]


*[http://www.hydrodaten.admin.ch/en/2118.html#aktuelle_daten Waterlevels of Walensee] at Murg


{{div-col}}
* 2011: "Temple of Love" with Latexxx Teens
* 2012: "Kannst du mich seh'n" (Remix) for [[Staubkind]]
{{div-col-end}}


*/

// title='Limit of a sequence'
// title='Complex Wishart distribution'
// title='John Beke'  //undefined?

str = `# The return of the government's control of [[Idlib]],
# Transfer the management of the [[Reyhanlı]],
# Opening a commercial corridor ,`

str = `around 650 students on roll drawn from a
community that has high levels of social deprivation`

let doc = wtf(str)
console.log(doc.text())
