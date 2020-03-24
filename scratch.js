var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

/*
 * interwiki links
 * disambiguation templates
// {{Place name disambiguation}}
// {{Airport disambiguation}}

 */

// wtf.fetch('Toronto').then(doc => {
//   let html = doc.html()
//   console.log(html)
// })

// let str = `CoolToday Park is a ballpark in North Port, Florida, located in the southern portion of Sarasota County, 35 miles south of Sarasota, Florida.`
// console.log(wtf(str).summary())

let str = `
{| class="wikitable mw-collapsible" style="float:left; text-align:center; font-size:86%" width="100%"
! rowspan="2" | Date
! colspan="26" | Canton
! colspan="2" | Confirmed cases
! colspan="2" | Deaths
! rowspan="2" | Source(s)
|-
!{{Flagicon|Aargau}}<br>[[Canton of Aargau|AG]]
!{{Flagicon|Appenzell Innerrhoden}}<br>[[Canton of Appenzell Innerrhoden|AI]]
!{{Flagicon|Appenzell Ausserrhoden}}<br>[[Canton of Appenzell Ausserrhoden|AR]]
!{{Flagicon|Bern}}<br>[[Canton of Bern|BE]]
!{{Flagicon|Basel-Landschaft}}<br>[[Canton of Basel-Landschaft|BL]]
!{{Flagicon|Basel-Stadt}}<br>[[Canton of Basel-Stadt|BS]]
!{{Flagicon|Fribourg}}<br>[[Canton of Fribourg|FR]]
!{{Flagicon|Geneva}}<br>[[Canton of Geneva|GE]]
!{{Flagicon|Glarus}}<br>[[Canton of Glarus|GL]]
!{{Flagicon|Grisons}}<br>[[Canton of Grisons|GR]]
!{{Flagicon|Jura}}<br>[[Canton of Jura|JU]]
!{{Flagicon|Lucerne}}<br>[[Canton of Lucerne|LU]]
!{{Flagicon|Neuchâtel}}<br>[[Canton of Neuchâtel|NE]]
!{{Flagicon|Nidwalden}}<br>[[Canton of Nidwalden|NW]]
!{{Flagicon|Obwalden}}<br>[[Canton of Obwalden|OW]]
!{{Flagicon|St. Gallen}}<br>[[Canton of St. Gallen|SG]]
!{{Flagicon|Schaffhausen}}<br>[[Canton of Schaffhausen|SH]]
!{{Flagicon|Solothurn}}<br>[[Canton of Solothurn|SO]]
!{{Flagicon|Schwyz}}<br>[[Canton of Schwyz|SZ]]
!{{Flagicon|Thurgau}}<br>[[Canton of Thurgau|TG]]
!{{Flagicon|Ticino}}<br>want
!{{Flagicon|Uri}}<br>[[Canton of Uri|UR]]
!{{Flagicon|Vaud}}<br>[[Canton of Vaud|VD]]
!{{Flagicon|Valais}}<br>[[Canton of Valais|VS]]
!{{Flagicon|Zug}}<br>[[Canton of Zug|ZG]]
!{{Flagicon|Zürich}}<br>[[Canton of Zürich|ZH]]
!New
!Total
!New
!Total
|-
|2020-02-25
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|1
|
|
|
|
|
|1
|1
|
|
|<ref name="20200225.01">{{cite web|url=https://www.swissinfo.ch/eng/covid-19_switzerland-confirms-first-coronavirus-case/45579278|title=Switzerland confirms first coronavirus case|date=25 February 2020|website=SWI swissinfo.ch|language=en-EN|accessdate=5 March 2020}}</ref><ref name="20200225.02">{{cite web|url=https://www.tagblatt.ch/news-service/inland-schweiz/tessin-meldet-ersten-bestaetigten-fall-von-corona-virus-in-der-schweiz-ld.1198115|title=Tessin meldet ersten bestätigten Fall von Corona-Virus in der Schweiz|last=|first=|date=25 February 2020|website=tagblatt.ch|language=de-DE|accessdate=5 March 2020}}</ref>
|-
|2020-02-26
|
|
|
|
|
|
|
|1
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
|
| 1
| 2
|
|
|<ref name="20200226.01">{{cite web|url=https://www.ge.ch/document/premier-cas-covid-19-diagnostique-canton-geneve|title=Premier cas COVID-19 diagnostiqué dans le canton de Genève|date=27 February 2020|website=République et canton de Genève - ge.ch|language=fr-FR|accessdate=5 March 2020}}</ref>
|-
|2020-02-27
|1
|
|
|
|
|1
|
|
|
|2
|
|
|
|
|
|
|
|
|
|
|
|
|1
|
|
|1
|6
|8
|
|
|<ref name="20200227.01">{{cite web|url=https://www.gr.ch/DE/Medien/Mitteilungen/MMStaka/2020/Seiten/2020022704.aspx|title=Coronavirus: Kanton ergreift präventive Massnahmen gegen Weiterverbreitung|date=27 February 2020|website=Kanton Graubünden - gr.ch|language=de-DE|accessdate=5 March 2020}}</ref><ref name="20200227.02">{{cite web|url=https://www.ag.ch/de/aktuelles/medienportal/medienmitteilung/medienmitteilungen/mediendetails_138706.jsp|title=Fall von Coronavirus-SARS-CoV-2-Infektion im Kanton Aargau bestätigt|date=27 February 2020|website=Kanton Aargau - ag.ch|language=de-DE|accessdate=5 March 2020}}</ref><ref name="20200227.03">{{cite web|url=https://www.zh.ch/internet/de/aktuell/news/medienmitteilungen/2020/coronavirus-erster-fall-im-kanton-zuerich.html|title=Coronavirus: Erster Fall im Kanton Zürich|date=27 February 2020|website=Kanton Zürich - zh.ch|language=de-DE|accessdate=5 March 2020}}</ref><ref name="20200227.04">{{cite web|url=https://www.vd.ch/toutes-les-actualites/hotline-et-informations-sur-le-coronavirus/actualites/news/12509i-coronavirus-premier-cas-detecte-dans-le-canton-de-vaud/|title=Coronavirus : premier cas détecté dans le canton de Vaud|date=27 February 2020|website=État de Vaud - vd.ch|language=fr-FR|accessdate=5 March 2020}}</ref><ref name="20200227.05">{{cite web|url=https://www.coronavirus.bs.ch/nm/2020-coronavirus-erster-positiver-fall-in-basel-stadt-zweiter-positiv-getesteter-ausserkantonaler-fall-gd.html|title=Coronavirus: Erster positiver Fall in Basel-Stadt, zweiter positiv getesteter ausserkantonaler Fall|date=27 February 2020|website=Kanton Basel-Stadt - bs.ch|language=de-DE|accessdate=5 March 2020}}</ref>
|-
|}`

str = `{| class="navbox plainrowheaders wikitable" style="width:100%"
! A
! B
! C
! D
|-
!style="{{Gridiron primary style|AFC}};" colspan="8"|[[American Football Conference|<span style="{{Gridiron secondary color|AFC}};">American Football Conference</span>]]
|-
!style=background:white rowspan="4"|[[AFC East|East]]
|'''[[Buffalo Bills]]'''
|[[Orchard Park (town), New York|Orchard Park, New York]]
|-
|'''[[Miami Dolphins]]'''
|[[Miami Gardens, Florida]]
|[[Hard Rock Stadium]]
|-
|}`
let doc = wtf(str)
console.log(doc.table().json())
