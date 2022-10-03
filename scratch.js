import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)
// let doc = await wtf.fetch('Toronto Raptors')
// let coach = doc.infobox().get('coach')
// coach.text() //'Nick Nurse'

// let str = `The '''Byzantine Empire''' {{IPAc-en|z|{|n}} also referred to as the Eastern Roman Empire`
// let doc = wtf(str)
// console.log(doc.sentences()[0].text())

let str = `
{{Infobox country
| common_name = United Kingdom
| linking_name = the United Kingdom<!--Note: "the" required here as this entry used to create wikilinks-->
| name = {{collapsible list
  | titlestyle = background:transparent;line-height:normal;font-size:84%;
  | title = {{resize|1.25em|United Kingdom of Great<br/> Britain and Northern Ireland}}
  | {{Infobox |subbox=yes |bodystyle=font-size:76%;font-weight:normal;
  <!--Anglo-->
   | rowclass1 = mergedrow |label1=[[Scots language|Scots]]: |data1={{lang|sco|''Unitit Kinrick o Great Breetain an Northren Ireland''}}
   | rowclass2 = mergedrow |label2=[[Ulster Scots dialects|Ulster Scots]]:|data2={{lang|sco|''Claught Kängrick o Docht Brätain an Norlin Airlann''}}
  <!--Brittonic-->
   | rowclass3 = mergedrow |label3=[[Welsh language|Welsh]]: |data3={{lang|cy|''Teyrnas Unedig Prydain Fawr a Gogledd Iwerddon''}}
   | rowclass4 = mergedrow |label4=[[Cornish language|Cornish]]: |data4={{lang|kw|''Rywvaneth Unys Breten Veur ha Kledhbarth Iwerdhon''}}
  <!--Goidelic-->
   | rowclass5 = mergedrow |label5=[[Scottish&nbsp;Gaelic]]: |data5={{lang|gd|''Rìoghachd Aonaichte Bhreatainn is Èireann a Tuath''}}
   | rowclass6 = mergedrow |label6=[[Irish language|Irish]]: |data6={{lang|ga|''Ríocht Aontaithe na Breataine Móire agus Thuaisceart Éireann''}}
  }}
  }}
| image_flag = Flag of the United Kingdom.svg
| alt_flag = A flag featuring both cross and saltire in red, white and blue
| image_coat = Royal Coat of Arms of the United Kingdom.svg
| symbol_width = 90px
}}`
let doc = wtf(str)
// console.log(doc.infoboxes()[0].json())
// console.log(doc.infoboxes().map(t => t.json()))
console.log(doc.templates().map(t => t.json()))

