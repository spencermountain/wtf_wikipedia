var test = require('tape')
var wtf = require('./lib')

test('imdb', t => {
  var str = `{{IMDb title | 0426883 | Alpha Dog }}`
  var doc = wtf(str)
  var obj = doc.templates(0)
  t.equal(obj.template, 'imdb title', 'imdb')
  t.equal(obj.id, '0426883', 'id1')
  t.equal(obj.title, 'Alpha Dog', 'title')

  str = `{{IMDb title | id= 0426883 | title= Alpha Dog }}`
  doc = wtf(str)
  obj = doc.templates(0)
  t.equal(obj.id, '0426883', 'id1')
  t.equal(obj.title, 'Alpha Dog', 'title')
  t.end()
})

test('taxon', t => {
  var str = `{{Taxon info|Felis|parent}}`
  var doc = wtf(str)
  var obj = doc.templates(0)
  t.equal(obj.taxon, 'Felis', 'taxon')
  t.end()
})

test('generic-list', t => {
  var str = `{{Portal bar|portal 1|portal 2}}`
  var doc = wtf(str)
  var obj = doc.templates(0)
  t.equal(obj.template, 'portal bar', 'name')
  t.equal(obj.list[0], 'portal 1', 'list1')
  t.equal(obj.list[1], 'portal 2', 'list2')
  t.equal(obj.list.length, 2, 'list-len')
  t.end()
})

test('redirect-list', t => {
  var str = `{{Redirect|City of Toronto|the municipal government|Municipal government of Toronto|the historical part of the city prior to the 1998 amalgamation|Old Toronto}}`
  var doc = wtf(str)
  var obj = doc.templates(0)
  t.equal(obj.template, 'redirect', 'name')
  t.equal(obj.redirect, 'City of Toronto', 'main')
  t.equal(obj.links[0].page, 'Municipal government of Toronto', 'list1')
  t.equal(obj.links[0].desc, 'the municipal government', 'desc1')
  t.equal(obj.links.length, 2, 'list-len')
  t.end()
})

test('templates-in-templates', t => {
  var str = `{{marriage|[[Mileva Marić]]<br>|1903|1919|end=div}}<br />{{nowrap|{{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}}<ref>{{cite book |editor-last=Heilbron |editor-first=John L. |title=The Oxford Companion to the History of Modern Science |url=https://books.google.com/books?id=abqjP-_KfzkC&pg=PA233 |date=2003 |publisher=Oxford University Press |isbn=978-0-19-974376-6 |page=233}}</ref>{{sfnp|Pais|1982|p=301}}}}`
  var ref = wtf(str)
    .citations(0)
    .json()
  t.equal(ref.template, 'citation', 'cite-book')
  t.equal(ref.url, 'https://books.google.com/books?id=abqjP-_KfzkC&pg=PA233', 'url')
  t.equal(ref.isbn, '978-0-19-974376-6', 'isbn')
  var templates = wtf(str).templates()
  t.equal(templates[0].template, 'marriage', 'marriage1')
  t.equal(templates[1].template, 'marriage', 'marriage2')
  t.equal(templates[1].spouse, 'Elsa Löwenthal', 'marriage-1-name')
  t.equal(templates[0].spouse, 'Mileva Marić', 'marriage2-name')
  t.equal(templates[2].template, 'sfnp', 'sfnp')
  t.end()
})

test('support-nowrap-in-infobox', t => {
  var str = `
  {{Infobox scientist
  | name        = Albert Einstein
  | image       = Einstein 1921 by F Schmutzer - restoration.jpg
  | spouse      = {{nowrap| {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}} }}
  | residence   = Germany, Italy, Switzerland, Austria (present-day Czech Republic), Belgium, United States
  | signature = Albert Einstein signature 1934.svg
  | chiffre = {{nobr|912 millions}}
  }}
  `
  var infobox = wtf(str).infoboxes(0)
  var data = infobox.json()
  t.equal(data.name.text, 'Albert Einstein', 'got infobox datad')
  t.equal(data.spouse.text, 'Elsa Löwenthal (m. 1919-1936)', 'got tricky marriage value')
  t.equal(data.chiffre.text, '912 millions', 'got infobox nobr')
  t.end()
})

test('inline-templates', t => {
  var str = `he married {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}} in Peterburough`
  var doc = wtf(str)
  t.equal(doc.text(), 'he married Elsa Löwenthal (m. 1919-1936) in Peterburough', 'inline marriage text')

  str = `he married {{marriage|Johnny-boy}} in Peterburough`
  doc = wtf(str)
  t.equal(doc.text(), 'he married Johnny-boy in Peterburough', 'marriage-text simple')
  t.end()
})

test('three-layer-templates', t => {
  var str = `she married {{nowrap| {{nowrap| {{marriage|Johnny-boy}} }}}}`
  var doc = wtf(str)
  t.equal(doc.text(), 'she married Johnny-boy', '3-template inline')
  t.equal(doc.templates(0).template, 'marriage', '3-template result')
  t.end()
})

test('austria-hungary', t => {
  var str = `{{short description|Constitutional monarchic union from 1867 to October 1918}} {{For|modern relations|Austria{{ndash}}Hungary relations}} {{Use dmy dates|date=December 2014}} {{Infobox former country | native_name ={{native name|de|Österreichisch-Ungarische Monarchie}}<br>{{native name|hu|Osztrák-Magyar Monarchia}} | conventional_long_name = Austria-Hungary{{nobold|<sup>[[#Structure and name|↓]]</sup>}} | common_name= Austria{{ndash}}Hungary | continent=Europe | region = Central Europe | era= [[New Imperialism]]/[[World War I]] | status= | status_text= | year_start =1867 | year_end =1918 | date_start = 1 March | date_end = 11 November | p1 = Austrian Empire | flag_p1 = Flag of the Habsburg Monarchy.svg | s1 = Republic of German-Austria | s2 = Hungarian Democratic Republic | s3 = First Czechoslovak Republic | s4 = West Ukrainian People's Republic | s5 = Second Polish Republic | s6 = Kingdom of Romania | s7 = Kingdom of Serbs, Croats and Slovenes | s8 = Kingdom of Italy | flag_s1 = Flag of Austria.svg | flag_s2 = Flag of Hungary (1918-1919; 3-2 aspect ratio).svg | flag_s3 = Flag of the Czech Republic.svg | flag_s4 = Flag of the Ukranian State.svg | flag_s5 = Flag of Poland.svg | flag_s6 = Flag of Romania.svg | flag_s7 = Flag of Yugoslavia (1918–1943).svg | flag_s8 = Flag of Italy (1861-1946) crowned.svg | image_flag = Flag of Austria-Hungary (1869-1918).svg | flag_type = Civil Ensign | flag = List of Austrian flags | image_coat = Imperial Coat of Arms of the Empire of Austria.svg | symbol_type = Coat of arms | image_map = Austro-Hungarian Monarchy (1914).svg | image_map_caption = Austria-Hungary on the eve of [[World War I]] | national_motto = {{lang|la|Indivisibiliter ac Inseparabiliter}}<br>{{small|"Indivisibly and Inseparably"}} | national_anthem = {{lang|de|Gott erhalte Gott beschütze}}<br>{{small|"God shall save, God shall protect"}} | official_languages = [[Austrian German|German]], [[Hungarian language|Hungarian]]<ref>Fisher, Gilman. [https://books.google.com/?id=TLkUAAAAYAAJ&pg=PA47 ''The Essentials of Geography for School Year 1888–1889'', p.&nbsp;47]. New England Publishing Company (Boston), 1888. Retrieved 20 August 2014.</ref> | common_languages = <!--alphabetical order--> [[Czech language|Czech]], [[Croatian language|Croatian]], [[Italian language|Italian]], [[Polish language|Polish]], [[Romani language|Romani]], [[Romanian language|Romanian]], [[Rusyn language|Rusyn]], [[Serbian language|Serbian]], [[Slovak language|Slovak]], [[Slovene language|Slovene]], [[Ukrainian language|Ukrainian]], and [[Yiddish language|Yiddish]]{{refn|From the ''Encyclopædia Britannica'' (1878), although note that ''this'' "Romani" refers to the language of those described by the ''EB'' as "Gypsies"; the ''EB''{{'}}s "Romani or Wallachian" refers to what is today known as Romanian; Rosyn and Ukrainian correspond to dialects of what the ''EB'' refers to as "[[Ruthenian language|Ruthenian]]"; and Yiddish was the common language of the [[Austrian Jews]], although [[Hebrew language|Hebrew]] was also known by many.}} | religion = 76.6% [[Catholic]] (incl. 64–66% [[Latin Church|Latin]] & 10–12% [[Eastern Catholic|Eastern]])<br> 8.9% [[Protestantism|Protestant]] ([[Lutheranism|Lutheran]], [[Calvinism|Reformed]], [[Unitarianism|Unitarian]])<br> 8.7% [[Eastern Orthodox Church|Orthodox]]<br>4.4% [[Jewish]] <br> 1.3% [[Muslim]]<br>{{small|(1910 census<ref name="Vaterlandskunde 1911">Geographischer Atlas zur Vaterlandskunde, 1911, Tabelle 3.</ref>)}} | capital = [[Vienna]] (main)<ref name="wien-vienna"/> <br> [[Budapest]] | demonym = Austro-Hungarian | government_type = [[Dual monarchy|Dual]] [[Parliamentary system|parliamentary]] [[constitutional monarchy]] [[personal union]], under a [[liberal autocracy]] in Austria, and parliamentarism in Hungary | title_leader = [[Emperor of Austria|Emperor]]-[[King of Hungary|King]] | leader1 = [[Franz Joseph I of Austria|Franz Joseph I]] | year_leader1 = 1867–1916 | leader2 = [[Charles I of Austria|Charles I & IV]] | year_leader2 = 1916–1918 | representative1 = [[Count Friedrich Ferdinand von Beust|Friedrich von Beust]] (first) | representative2 = [[Heinrich Lammasch]] (last) | year_representative1 = 1867 | year_representative2 = 1918 | title_representative = [[Minister-President of Austria|Minister-President<br>of Austria]] | deputy1 = [[Gyula Andrássy]] (first) | deputy2 = [[János Hadik]] (last) | year_deputy1 = 1867–1871 | year_deputy2 = 1918 | title_deputy = [[List of Prime Ministers of Hungary|Prime Minister<br>of Hungary]] | legislature = 2 national legislatures: | type_house1 = [[Imperial Council (Austria)|Imperial Council]] | house1 = [[Herrenhaus (Austria)|Herrenhaus]]<br>[[Abgeordnetenhaus (Austria)|Abgeordnetenhaus]] | type_house2 = [[Diet of Hungary]] | house2 = [[House of Magnates of Hungary|House of Magnates]]<br>[[House of Representatives of Hungary|House of Representatives]] | stat_area1 = 676,615 | stat_area2 = 681,727 | stat_pop1 = 52,800,000 | stat_year1 = 1914 | stat_year2 = 1918 | event_start =[[Austro-Hungarian Compromise of 1867|1867 Compromise]] | event_end =[[Aftermath of World War I#Austria-Hungary|Dissolution]] | event_post = Treaties of [[Treaty of Saint-Germain-en-Laye (1919)|Saint-Germain-en-Laye]] and [[Treaty of Trianon|Trianon]] | date_post = 10 September 1919 and 4 June 1920 | event1 = [[Czechoslovakia|Czechoslovak]] indep. | date_event1 = 28 October 1918 | event2 = [[State of Slovenes, Croats and Serbs|State of SCS]] indep. | date_event2 = 29 October 1918 | event3 = [[Banat, Bačka and Baranja|Vojvodina]] lost to [[Kingdom of Serbia|Serbia]] | date_event3 = 25 November 1918 | currency = {{plainlist| * [[Austro-Hungarian gulden|Gulden]] (to 1892) * [[Austro-Hungarian krone|Krone]] (1892–1918)}} | iso3166code = omit | today = {{Collapsible list |titlestyle=font-weight:normal; background:transparent; text-align:left;|title=&nbsp;|{{flag|Austria}}|{{flag|Bosnia and Herzegovina}}|{{flag|China}}<ref>see [[Concessions in Tianjin#Austro-Hungarian concession (1901–1917)]]</ref>|{{flag|Croatia}}|{{flag|Czech Republic}}|{{flag|Hungary}}|{{flag|Italy}}|{{flag|Montenegro}}|{{flag|Poland}}|{{flag|Romania}}|{{flag|Serbia}}|{{flag|Slovakia}}|{{flag|Slovenia}}|{{flag|Ukraine}}}} }} '''Austria-Hungary''', often referred to as the '''Austro-Hungarian Empire''' or the '''Dual Monarchy'''`

  var doc = wtf(str)

  t.equal(
    doc.text(),
    'Austria-Hungary, often referred to as the Austro-Hungarian Empire or the Dual Monarchy',
    'got-plaintext'
  )
  t.equal(doc.templates('for')[0].list[1], 'Austria–Hungary relations', 'nested emdash')
  t.equal(doc.links('budapest')[0].page(), 'Budapest', 'got Budapest link')
  t.equal(
    doc.templates('short description')[0].description,
    'Constitutional monarchic union from 1867 to October 1918',
    'short-description'
  )
  t.end()
})
