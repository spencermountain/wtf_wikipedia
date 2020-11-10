const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

const template = 'Template:Infobox medical condition (new)'

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   return pages.map((o) => o.title)
// }

// getAll(template).then((arr) => {
//   console.log(JSON.stringify(arr, null, 2))
// })

let str = `{{short description|Human disease}}
{{Infobox medical condition (new)
| name            = Bursitis
| synonyms        = 
| image           = Bursitis_Elbow_WC.JPG
| caption         = Example of [[olecranon bursitis]]
| pronounce       = 
| field           = [[Orthopedics]]
|| symptoms        = 
| complications   = 
| onset           = 
| duration        = 
| types           = 
| causes          = 
| risks           = 
| diagnosis       = 
| differential    = 
| prevention      = 
| treatment       = 
| medication      = 
| prognosis       = 
| frequency       = 
| deaths          = 
}}

{{Medical resources
  |  DiseasesDB = 31623
  |  ICD10 = {{ICD10|M|70||m|70}}–{{ICD10|M|71||m|70}}
  |  ICD9 = {{ICD9|727.3}}
  |  ICDO =
  |  OMIM =
  |  MedlinePlus = 000419
  |  eMedicineSubj = emerg
  |  eMedicineTopic = 74
  |  MeshID = D002062
  }}
'''Bursitis''' is the [[inflammation]] of one or `
let doc = wtf(str)
console.log(doc.infoboxes(`Infobox medical condition (new)`))
