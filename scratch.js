const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   return pages.map((o) => o.title)
// }

// getAll(template).then((arr) => {
//   console.log(JSON.stringify(arr, null, 2))
// })

let str = `{{redirect|Alhazen}}
{{bots|deny=Citation bot}}
{{Infobox scientist
| name = Hasan Ibn al-Haytham<br/>(Alhazen)
|image            =
|caption           =
| birth_date = {{nowrap |{{birth-date|0965|{{circa}} 965}}  {{smaller|(c. 354 [[Islamic calendar|AH]])<ref>{{Harvnb|Falco|2007}}.</ref>}} }}
| birth_place = [[Basra]], [[medieval Iraq|Iraq]]
| death_date = {{nowrap |{{death-date|1040|{{circa}} 1040}} {{smaller|(c. 430 AH)<ref>{{Harvnb|Rosenthal|1960–1961}}.</ref>}} }}
| death_place = [[Cairo]], [[Fatimid Caliphate|Egypt]]
| residence = {{hlist |[[Basra]] |[[Cairo]]}}
| fields = {{hlist |[[Optics]] |[[Astronomy]] |[[Mathematics]]}}
| workplaces =
|alma_mater =
|notable_students =
| influences = [[Aristotle]], [[Euclid]], [[Ptolemy]], [[Galen]], [[Banū Mūsā]], [[Thābit ibn Qurra]], [[Al-Kindi]], [[Ibn Sahl (mathematician)|Ibn Sahl]], [[Abū Sahl al-Qūhī]]
| influenced = [[Omar Khayyam]], [[Taqi ad-Din Muhammad ibn Ma'ruf]], [[Kamāl al-Dīn al-Fārisī]], [[Averroes]], [[Al-Khazini]], [[John Peckham]], [[Witelo]], [[Roger Bacon]],<ref>{{Cite book|url=https://books.google.co.in/books?id=mhLVHR5QAQkC&printsec=frontcover#v=onepage&q&f=false|title=Ptolemy's Theory of Visual Perception: An English Translation of the Optics|last=A. Mark Smith|publisher=American Philosophical Society|year=1996|isbn=|location=|pages=58}}</ref> [[Kepler]]
| known_for = ''[[Book of Optics]]'', ''[[Ibn al-Haytham#Doubts Concerning Ptolemy|Doubts Concerning Ptolemy]]'', [[Alhazen's problem]], [[Analysis]],<ref>{{Harvnb|O'Connor|Robertson|1999}}.</ref> [[Catoptrics]],<ref>{{Harvnb|El-Bizri|2010|p=11}}: "Ibn al-Haytham's groundbreaking studies in optics, including his research in catoptrics and dioptrics (respectively the sciences investigating the principles and instruments pertaining to the reflection and refraction of light), were principally gathered in his monumental opus: Kitåb al-manåóir (The Optics; De Aspectibus or Perspectivae; composed between 1028 CE and 1038 CE)."</ref> [[Horopter]], [[Moon illusion]], [[Experiment|experimental science]], [[scientific method]]ology,<ref>{{Harvnb|Rooney|2012|p=39}}: "As a rigorous experimental physicist, he is sometimes credited with inventing the scientific method."</ref> [[visual perception]], [[empirical theory of perception]], [[Comparative psychology|Animal psychology]]<ref>{{Harvnb|Baker|2012|p=449}}: "As shown earlier, Ibn al-Haytham was among the first scholars to experiment with animal psychology.</ref>
| footnotes =
}}

Born in [[Basra]], he spent most of his productive period in the [[Fatimid Caliphate|Fatimid]] capital of [[Cairo]] and earned his living authoring various treatises and tutoring members of the nobilities.<ref>According to [[Al-Qifti]]. {{Harvnb|O'Connor|Robertson|1999}}.</ref>
`
let doc = wtf(str)
console.log(doc.infobox(0))
