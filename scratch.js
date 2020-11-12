const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   return pages.map((o) => o.title)
// }

// getAll(template).then((arr) => {
//   console.log(JSON.stringify(arr, null, 2))
// })

let str = `
'''Ibn al-Haytham''' ([[Latinization of names|latinized]] '''Alhazen'''<ref>also ''Alhacen'', ''Avennathan'', ''Avenetan'' (etc.); the identity of "Alhazen" with Ibn al-Haytham al-Basri "was identified towards the end of the 19th century". ({{harvnb|Vernet|1996|p=788}})</ref> full name ''{{transl|ar|ALA|Abū ʿAlī al-Ḥasan ibn al-Ḥasan ibn al-Haytham}}'' {{lang|ar|أبو علي، الحسن بن الحسن بن الهيثم}}; {{c.|lk=no|965|1040}}) was a [[Mathematics in medieval Islam|mathematician]], [[Astronomy in the medieval Islamic world|astronomer]], and [[Physics in the medieval Islamic world|physicist]] of the [[Islamic Golden Age]].<ref name="Vernet 1996 788">For the description of his main fields, see e.g.  {{harvnb|Vernet|1996|p=788}}  ("He is one of the principal Arab mathematicians and, without any doubt, the best physicist.") {{Harvnb|Sabra|2008}}, {{Harvnb|Kalin|Ayduz|Dagli|2009|p=}} ("Ibn al-Ḥaytam was an eminent eleventh-century Arab optician, geometer, arithmetician, algebraist, astronomer, and engineer."), {{Harvnb|Dallal|1999|p=}} ("Ibn al-Haytham (d.&nbsp;1039), known in the West as Alhazan, was a leading Arab mathematician, astronomer, and physicist. His optical compendium, Kitab al-Manazir, is the greatest medieval work on optics.")</ref>  He made significant contributions to the principles of [[optics]] and [[visual perception]] in particular, his most influential work being his ''[[Book of Optics|Kitāb al-Manāẓir]]'' (كتاب المناظر, "Book of Optics"), written during 1011&ndash;1021, survived in the Latin edition.<ref>{{Harvnb|Selin|2008|p=}}: "The three most recognizable Islamic contributors to meteorology were: the Alexandrian mathematician/ astronomer Ibn al-Haytham (Alhazen 965-1039), the Arab-speaking Persian physician Ibn Sina (Avicenna 980-1037), and the Spanish Moorish physician/jurist Ibn Rushd (Averroes; 1126-1198)." He has been dubbed the "father of modern optics" by the [[UNESCO]]. {{Cite journal|last=|first=|date=1976|title=Impact of Science on Society|url=https://books.google.co.uk/books?id=4YE3AAAAMAAJ&q=%22Father+of+Modern+Optics%22&dq=%22Father+of+Modern+Optics%22&hl=en&sa=X&ei=RuhgVJCUIcHksATBo4CoDA|journal=UNESCO|volume= 26-27|pages=page-140|via=}}.
{{Cite web|url=http://www.light2015.org/Home/ScienceStories/1000-Years-of-Arabic-Optics.html|title=International Year of Light - Ibn Al-Haytham and the Legacy of Arabic Optics|website=www.light2015.org|language=en|access-date=2017-10-09}}.
{{Cite web|url=http://en.unesco.org/news/international-year-light-ibn-al-haytham-pioneer-modern-optics-celebrated-unesco|title=International Year of Light: Ibn al Haytham, pioneer of modern optics celebrated at UNESCO|website=UNESCO|language=en|access-date=2017-10-09}}. Specifically,  he was the first to explain that vision occurs when light bounces on an object and then is directed to one's eyes. {{cite book|ref=harv|last=Adamson|first=Peter|title=Philosophy in the Islamic World: A History of Philosophy Without Any Gaps|url=https://books.google.com/books?id=KEpRDAAAQBAJ|date=7 July 2016|publisher=Oxford University Press|isbn=978-0-19-957749-1|p=77}}</ref> He was also an early proponent of the concept that a hypothesis must be proved by experiments based on confirmable procedures or mathematical evidence, as such anticipating the [[scientific method]].<ref>{{Harvnb|Ackerman|1991}}.</ref><ref>[[Nomanul Haq|Haq, Syed]] (2009). "Science in Islam". Oxford Dictionary of the Middle Ages. {{ISSN|1703-7603}}. Retrieved 2014-10-22.</ref><ref>[[G. J. Toomer]]. [https://www.jstor.org/stable/228328?pg=464 Review on JSTOR, Toomer's 1964 review of Matthias Schramm (1963) ''Ibn Al-Haythams Weg Zur Physik''] Toomer p.464: "Schramm sums up [Ibn Al-Haytham's] achievement in the development of scientific method."
{{cite web|url=http://www.light2015.org/Home/ScienceStories/1000-Years-of-Arabic-Optics.html|title=International Year of Light - Ibn Al-Haytham and the Legacy of Arabic Optics|publisher=}}
{{Cite news|url=http://news.bbc.co.uk/2/hi/science/nature/7810846.stm|work=BBC News|title=The 'first true scientist'|author=Al-Khalili, Jim|date=4 January 2009|accessdate=24 September 2013}}
{{Cite journal|last=Gorini|first=Rosanna|title=Al-Haytham the man of experience. First steps in the science of vision|url=http://www.ishim.net/ishimj/4/10.pdf|journal=Journal of the International Society for the History of Islamic Medicine|volume=2|issue=4|pages=53–55|date=October 2003|format=PDF|accessdate=2008-09-25|ref=harv}}</ref>

Born in [[Basra]], he spent most of his productive period in the [[Fatimid Caliphate|Fatimid]] capital of [[Cairo]] and earned his living authoring various treatises and tutoring members of the nobilities.<ref>According to [[Al-Qifti]]. {{Harvnb|O'Connor|Robertson|1999}}.</ref>
`
// let doc = wtf(str)
// console.log(doc.infobox(0))

let doc = wtf(str)
// console.log(doc.sentence().bolds())
console.log(doc.title())
