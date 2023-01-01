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


{{nihongo|'''Mikirō Sasaki'''|佐々木 幹郎|Sasaki Mikirō|October 20, 1947}} is a Japanese [[Poetry|poet]]


*[http://www.hydrodaten.admin.ch/en/2118.html#aktuelle_daten Waterlevels of Walensee] at Murg


{{div-col}}
* 2011: "Temple of Love" with Latexxx Teens
* 2012: "Kannst du mich seh'n" (Remix) for [[Staubkind]]
{{div-col-end}}

* {{look from|Big Trees}}
* {{in title|Big Tree}}
{{canned search|big-tree|big-trees}}

service between {{stn|Bellegarde}} and {{rws|Genève-Cornavin}}.


ferry {{MV|Senopati Nusantara}} sinks

{{Metro|Jamaica}} expands to [[Jamaica metro station|Jamaica]]
*/

// title='Limit of a sequence'
// title='Complex Wishart distribution'
// title='Asymmetric relation'
// title='John Beke'  //undefined?

// CBB schedule start  - gross template

str = `# The return of the government's control of [[Idlib]],
# Transfer the management of the [[Reyhanlı]],
# Opening a commercial corridor ,`

str = `around 650 students on roll drawn from a
community that has high levels of social deprivation`

str = `'''Gunaroš''' ({{lang-sr-cyr|Гунарош}}, [[Hungarian language|Hungarian]]: ''Gunaras'') is a village `

str = `{{CBB roster/Player|first=Demetrius|last=McReynolds|num=1|pos=G|ft=6|in=2|lbs=210|class=sr|rs=|home=[[Louisville, Kentucky]]}}`

str = `====Results by round====
{{#invoke:sports rbr table|table|legendpos=b
|header=Round
|label1= Ground
| res1=H/A/H/A/H/A/A/H/H/A/A/H/A/H/H/A/H/A/H/A/H/A/H/A/A/H/A/H/A/H/H/A/A/H/A/H/H/A/H/A/A/H/A/H/A/H
|label2= Result
| res2=D/D/W/D/W/W/L/D/D/W/W/W/D/W/L/W/W/W/D/W/D/L/W/D/W/L/W/D/W/L/L/W/W/W/D/L/W/W/D/D/W/L/D/W/W/W
|label3= Position
| res3=15/16/10/9/5/4/8/5/6/6/5/3/3/3/3/2/2/2/2/1/2/3/2/3/3/3/3/3/3/3/3/3/3/2/2/2/2/2/2/2/2/2/3/3/3/2
<!-- -->
|text_H=Home|text_A=Away
|color_W=green2|text_W=Win
|color_D=yellow2|text_D=Draw
|color_L=red2|text_L=Loss
|color_1=1st|color_2=2nd|color_3=3rd|color_23-=red1

|updated=7 May 2016
|source=see below 
|date=May 2016
}}`

str = ` ({{Baseball year|1902}})`
str = ' The ad cost $250,000 (${{Inflation|US|0.25|1971|r=1|fmt=c}} million today)'
str = `comprehensive education of <nowiki>[the]</nowiki> students`
str = `<nowiki>TEXT</nowiki>`

let doc = wtf(str)
console.log(doc.text())


// wtf.fetch(`Alice von Hildebrand`).then((doc) => {
//   console.log(doc.text())
// })