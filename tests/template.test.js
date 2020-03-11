var wtf = require('./lib')
var test = require('tape')

test('glossary of professional wrestling', function(t) {
  var glossary = `{{term|1=A-show}}
  {{defn|1= A wrestling event where a company's biggest draws wrestle.<ref name=torch/>}}`
  var o = wtf(glossary)
    .sections()[0]
    .sentences()
  t.equal(o[0].data.text, 'A-show:')
  t.equal(o[1].data.text, `A wrestling event where a company's biggest draws wrestle.`)
  t.end()
})

test('boloZenden infobox', function(t) {
  var boloZenden = `{{Infobox football biography
    | name        = Boudewijn Zenden
    | image       = Zenden.jpg
    | image_size  = 260
    | caption     = Zenden in 2005, playing for Liverpool
    | fullname    = Boudewijn Zenden
    | birth_date  = {{Birth date and age|1976|08|15|df=yes}}
    | birth_place = [[Maastricht]], [[Netherlands]]
    | height      = {{convert|1.68|m|abbr=on}}<ref>http://www.soccerbase.com/players/player.sd?player_id=12662</ref>
    | position    = [[Midfielder]]
    | currentclub =
    | youthyears1 = 1985–1987 |youthclubs1 = [[MVV]]
    | youthyears2 = 1987–1993 |youthclubs2 = [[PSV Eindhoven|PSV]]
    | years1      = 1993–1998 |clubs1 = [[PSV Eindhoven|PSV]]                         |caps1 = 112 |goals1 = 32
    | years2      = 1998–2001 |clubs2 = [[FC Barcelona|Barcelona]]                    |caps2 = 64  |goals2 = 2
    | years3      = 2001–2004 |clubs3 = [[Chelsea F.C.|Chelsea]]                      |caps3 = 43  |goals3 = 4
    | years4      = 2003–2004 |clubs4 = → [[Middlesbrough F.C.|Middlesbrough]] (loan) |caps4 = 31  |goals4 = 4
    | years5      = 2004–2005 |clubs5 = [[Middlesbrough F.C.|Middlesbrough]]          |caps5 = 36  |goals5 = 5
    | years6      = 2005–2007 |clubs6 = [[Liverpool F.C.|Liverpool]]                  |caps6 = 23  |goals6 = 2
    | years7      = 2007–2009 |clubs7 = [[Olympique de Marseille|Marseille]]          |caps7 = 54  |goals7 = 6
    | years8      = 2009–2011 |clubs8 = [[Sunderland A.F.C|Sunderland]]               |caps8 = 47  |goals8 = 4
    | totalcaps   = 410 |totalgoals = 59
    | nationalyears1 = 1997–2004 |nationalteam1 = [[Netherlands national football team|Netherlands]] |nationalcaps1 = 54 |nationalgoals1 = 7
    | manageryears1  = 2012–2013 |managerclubs1 = [[Chelsea F.C.|Chelsea]] (assistant manager)
    | manageryears2  = 2013– |managerclubs2 = [[Jong PSV]] (assistant manager)
  }}`
  var o = wtf(boloZenden).infoboxes(0).data
  t.equal(o.years1.text(), '1993–1998')
  t.equal(o.clubs1.text(), 'PSV')
  t.equal(o.youthyears1.text(), '1985–1987')
  t.equal(o.youthclubs1.text(), 'MVV')
  t.equal(o.nationalyears1.text(), '1997–2004')
  t.equal(o.nationalteam1.text(), 'Netherlands')
  t.equal(o.nationalteam1.links(0).page(), 'Netherlands national football team')
  t.equal(o.nationalteam1.links(0).text(), 'Netherlands')
  t.equal(o.nationalcaps1.text(), '54')
  t.equal(o.nationalgoals1.text(), '7')
  t.end()
})

test('hurricane infobox', function(t) {
  var hurricane = `
{{Infobox Hurricane
  | Name=Tropical Storm Edouard
  | Type=Tropical storm
  | Year=2002
  | Basin=Atl
  | Image location=Tropical Storm Edouard 2002.jpg
  | Image name=Tropical Storm Edouard near peak intensity
  | Formed=September 1, 2002
  | Dissipated=September 6, 2002
  | 1-min winds=55
  | Pressure=1002
  | Damages=
  | Inflated=
  | Fatalities=None
  | Areas=[[Florida]]
  | Hurricane season=[[2002 Atlantic hurricane season]]
}}`
  var o = wtf(hurricane).infoboxes(0).data
  t.equal(o.name.text(), 'Tropical Storm Edouard')
  t.equal(o.dissipated.text(), 'September 6, 2002')
  t.equal(o['hurricane season'].text(), '2002 Atlantic hurricane season')
  t.equal(o.areas.links(0).page(), 'Florida')
  t.end()
})

test('parkplace disambig', function(t) {
  var park_place = `
'''Park Place''' may refer to:
{{TOC right}}

== Media ==
* [[Park Place (TV series)|Park Place]], a 1981 CBS sitcom

== Places ==

=== Canada ===
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
* [[Park Place Mall]], Lethbridge, Alberta
{{disambiguation}}
  `
  var o = wtf(park_place)
  t.equal(o.isDisambiguation(), true, 'is-disambiguation')
  t.equal(o.links().length, 4, 'links')
  t.equal(o.links(0).page(), 'Park Place (TV series)', 'first-link')
  t.end()
})

test('bluejays table', function(t) {
  var bluejays = `
{| border="1" cellpadding="2" cellspacing="0" class="wikitable"
|-
! bgcolor="#DDDDFF" width="4%" | Number
! bgcolor="#D12DFF" width="4%" | Date
! bgcolor="#D12DFF" width="4%" | Team
|- align="center" bgcolor="ffbbbb"
| 1 || April 6 || @ [[Minnesota Twins|Twins]] || 6 - 1 || [[Brad Radke|Radke]] (1-0) || '''[[Pat Hentgen|Hentgen]]''' (0-1) || || 45,601 || 0-1
|- align="center" bgcolor="bbffbb"
| 2 || April 7 || @ [[Minnesota Twins|Twins]] || 9 - 3 || '''[[David Wells|Wells]]''' (1-0) || [[Mike Lincoln|Lincoln]] (0-1) || '''[[Roy Halladay|Halladay]]''' (1) || 9,220 || 1-1
|}
  `
  var arr = wtf(bluejays).tables(0).data
  t.equal(arr.length, 2)
  t.equal(arr[0]['Number'].text(), '1', 'number')
  t.equal(arr[0]['Date'].text(), 'April 6', 'date')
  t.equal(arr[0]['Team'].text(), '@ Twins', 'team')
  t.equal(arr[1]['Number'].text(), '2', 'number2')
  t.equal(arr[1]['Date'].text(), 'April 7', 'date2')
  t.equal(arr[1]['col4'].text(), '9 - 3', 'col-3')
  t.end()
})

var alabama = `
{{Infobox university
| name = The University of Alabama
| image_name = BamaSeal.png
| image_size = 150px
| established = 1831
| type = [[Flagship university|Flagship]]<br />[[State university system|Public university]]<br />[[Sea-grant]]<br />[[Space-grant]]
| endowment = $667,980,131<ref name="ReferenceA">http://colleges.usnews.rankingsandreviews.com/best-colleges/university-of-alabama-1051</ref><ref name="colleges.usnews.rankingsandreviews.com">{{cite web|url=http://colleges.usnews.rankingsandreviews.com/best-colleges/university-of-alabama-1051 |title=University of Alabama|work=rankingsandreviews.com}}</ref>
| president = [[Stuart R. Bell]]
| faculty = 1,175
| students = 37,098 (Fall 2015)<ref name=CommonDataSet>{{cite web|url=http://oira.ua.edu/d/content/reports/common-data-set|title=Common Data Set - OIRA|work=ua.edu}}</ref>
| postgrad = 5,140 (Fall 2015)<ref name=CommonDataSet/>
| undergrad = 31,958 (Fall 2015)<ref name=CommonDataSet/>
| city = [[Tuscaloosa, Alabama|Tuscaloosa]]
| state = [[Alabama]]
| country = U.S.
| campus = Urban (small city);<br/>{{convert|1970|acre}}
| coor = {{coord|33.209438|N|87.541493|W|source:dewiki_region:US-AL_type:landmark|display=inline,title}}
| athletics = [[NCAA Division I]] – [[Southeastern Conference|SEC]]
|free_label = Sports Motto
| free = [[Roll Tide]]
| colors = Crimson & White<ref>{{cite web|url=http://visualid.ua.edu/download/UA-BrandingStandards-Aug172015.pdf|title=The University of Alabama Branding Standards 2015–2016 |work=ua.edu}}</ref><br />{{color box|#9E1B32}}&nbsp;{{color box|#FFFFFF}}
| nickname = [[Alabama Crimson Tide]]
| mascot = [[Big Al (mascot)|Big Al]]
| affiliations = {{unbulleted list|[[University of Alabama System]]|[[Oak Ridge Associated Universities|ORAU]]|[[Universities Research Association|URA]]|[[Association of Public and Land-Grant Universities|APLU]]}}
| website = {{url|www.ua.edu}}
| logo = [[File:University of Alabama (logo).png|250px]]
}}
`
test('Alabama infobox', function(t) {
  var infobox = wtf(alabama).infoboxes(0).data
  t.equal(infobox.athletics.text(), 'NCAA Division I – SEC', 'athletics =' + infobox.athletics.text)
  t.equal(infobox.country.text(), 'U.S.', 'country =' + infobox.country.text)
  t.equal(infobox.president.text(), 'Stuart R. Bell', 'president =' + infobox.president.text)
  // t.equal(infobox.campus.text, 'Urban (small city); 1970 acre', 'campus = ' + infobox.campus.text);
  t.end()
})

test('Radiohead infobox', function(t) {
  var radiohead = `{{Infobox musical artist
| name = Radiohead
| image = Radiohead.jpg
| caption = Radiohead in 2006; from left to right: [[Thom Yorke]], [[Jonny Greenwood]], [[Colin Greenwood]], [[Ed O'Brien]] and [[Phil Selway]]
| image_size = 270
| landscape = Yes
| background = group_or_band
| origin = [[Abingdon-on-Thames|Abingdon, Oxfordshire]], England
| genre = {{flatlist|
* [[Art rock]]
* [[alternative rock]]<!--genres sourced on talk page; do not add without consulting talk page with sourced information-->
* [[electronica]]
* [[experimental rock]]
}}
| years_active = 1985–present
| associated_acts = {{flatlist|
* [[Atoms for Peace (band)|Atoms for Peace]]
* [[7 Worlds Collide]]
}}
| label = {{flatlist|
* [[XL Recordings|XL]]
* [[Ticker Tape Ltd.]]
* [[Hostess Entertainment|Hostess]]
* [[TBD Records|TBD]]
* [[Parlophone]]
* [[Capitol Records|Capitol]]
}}
| website = {{URL|radiohead.com}}
| current_members =
* [[Thom Yorke]]
* [[Jonny Greenwood]]
* [[Colin Greenwood]]
* [[Ed O'Brien]]
* [[Philip Selway]]
}} `
  var infobox = wtf(radiohead).infoboxes(0).data
  t.equal(infobox.current_members.text().match(/Greenwood/g).length, 2, 'current members')
  t.equal(infobox.genre.text(), 'Art rock\n\nalternative rock\n\nelectronica\n\nexperimental rock', 'genre')
  t.equal(infobox.associated_acts.text(), 'Atoms for Peace\n\n7 Worlds Collide', 'associated-acts')
  t.end()
})

test('templates() list ordering', function(t) {
  var str = `
{{Main|Royal National Lifeboat Institution lifeboats}}
The types of boats provided at each station and the launching methods vary depending on local needs.<ref>{{Cite web|title=cool dude}}</ref>
==History==
{{wide_image|heyyyyy.png}}
{{tracklist| title1=fun times}}
{{infobox person
|cool = nope
}}
hello there
`
  var doc = wtf(str)
  t.equal(doc.templates().length, 3, 'got several templates')
  t.equal(doc.infoboxes().length, 1, 'got one infobox')
  t.equal(doc.citations().length, 1, 'got citation template')
  t.equal(doc.templates('main').length, 1, 'got main template')
  t.equal(doc.templates('tracklist').length, 1, 'got tracklist template')
  t.end()
})

test('templates in infobox', function(t) {
  var str = `{{Infobox museum
  |coordinates = {{coord|41.893269|-87.622511|display=inline}}
  |image=           20070701 Arts Club of Chicago.JPG
  |website= [http://www.artsclubchicago.org www.artsclubchicago.org]
  }}
  '''Arts Club of Chicago''' is a private club located in the [[Near North Side, Chicago|Near North Side]] `
  var doc = wtf(str)
  t.equal(doc.templates().length, 1, 'got one template')
  t.equal(doc.infoboxes().length, 1, 'got one infobox')
  t.equal(doc.images().length, 1, 'got one image')
  t.equal(doc.images().length, 1, 'got one image')
  t.equal(doc.links().length, 2, 'got two links')
  t.equal(doc.templates('coord').length, 1, 'got coord template')
  t.end()
})

test('microsoft currency parsing', function(t) {
  var microsoft = `
{{Infobox company
| name = Microsoft Corporation
| logo = Microsoft logo and wordmark.svg
| logo_alt = A square divided into four sub-squares, colored red, green, yellow and blue (clockwise), with the company name appearing to its right.
| image = Microsoft building 17 front door.jpg
| image_caption = Building 17 on the [[Microsoft Redmond campus]] in [[Redmond, Washington]]
| type = [[Public company|Public]]
| traded_as = {{Unbulleted list|{{NASDAQ|MSFT}}|[[NASDAQ-100|NASDAQ-100 component]]|[[Dow Jones Industrial Average|DJIA component]]|[[S&P 100|S&P 100 component]]|[[S&P 500|S&P 500 component]]}}
| ISIN = US5949181045
| industry = {{Unbulleted list|[[Computer software]]|[[Computer hardware]]|[[Consumer electronics]]|[[Social networking service]]|[[Cloud computing]]|[[Video game industry|Video games]]|[[Internet]]|[[Corporate venture capital]]}}
| founded = {{Start date and age|1975|04|04}} in [[Albuquerque, New Mexico|Albuquerque]], [[New Mexico]], U.S.
| founders = {{Plainlist|
* [[Bill Gates]]
* [[Paul Allen]]
}}
| hq_location = [[Microsoft Redmond campus]]
| hq_location_city = [[Redmond, Washington|Redmond]], [[Washington (state)|Washington]]
| hq_location_country = [[United States|U.S.]]
| area_served = Worldwide
| key_people = {{Plainlist|
* [[John W. Thompson]] ([[Chairman]])
* [[Brad Smith (American lawyer)|Brad Smith]] ([[President (corporate title)|President]] and [[Chief legal officer|CLO]])
* [[Satya Nadella]] ([[Chief executive officer|CEO]])
* [[Bill Gates]] ([[Technical advisor]])
}}
| products = {{Flatlist|
* [[Microsoft Windows|Windows]]
* [[Microsoft Office|Office]]
* [[Microsoft Servers|Servers]]
* [[Skype]]
* [[Microsoft Visual Studio|Visual Studio]]
* [[Microsoft Dynamics|Dynamics]]
* [[Xbox]]
* [[Microsoft Surface|Surface]]
* [[Microsoft Mobile|Mobile]]
* [[List of Microsoft software|more...]]
}}
| services = {{Flatlist|
* [[Microsoft Azure|Azure]]
* [[Bing (search engine)|Bing]]
* [[LinkedIn]]
* [[Microsoft Developer Network|MSDN]]
* [[Office 365]]
* [[OneDrive]]
* [[Outlook.com]]
* [[Microsoft TechNet|TechNet]]
* [[Microsoft Wallet|Wallet]]
* [[Windows Store]]
* [[Windows Update]]
* [[Xbox Live]]
}}
| revenue = {{Increase}} {{US$|89.95&nbsp;billion|link=yes}}<ref name="xbrlus_1">{{cite web |date=July 21, 2016 |url=https://www.microsoft.com/en-us/Investor/earnings/FY-2017-Q4/press-release-webcast |title=Microsoft Form 10-K, Fiscal Year Ended June 30, 2017 |publisher=[[U.S. Securities and Exchange Commission]] |accessdate=June 18, 2017 |website=https://sec.gov}}</ref>
| revenue_year = 2017
| operating_income = {{Increase}} {{US$|22.27&nbsp;billion}}<ref name="xbrlus_1" />
| income_year = 2017
| net_income = {{Increase}} {{US$|21.20&nbsp;billion}}<ref name="xbrlus_1" />
| net_income_year = 2017
| assets = {{Increase}} {{US$|241.08&nbsp;billion}}<ref name="xbrlus_1" />
| assets_year = 2017
| equity = {{Increase}} {{US$|72.39&nbsp;billion}}<ref name="xbrlus_1" />
| equity_year = 2017
| num_employees = 124,000<ref name="xbrlus_1" />
| num_employees_year = 2016
| subsid = [[List of mergers and acquisitions by Microsoft|List of Microsoft subsidiaries]]
| website = {{URL|https://microsoft.com}}
}}
  `
  var infobox = wtf(microsoft).infoboxes(0).data
  t.equal(infobox.revenue.text(), 'US$89.95 billion', 'revenue =' + infobox.revenue.text)
  t.equal(infobox.operating_income.text(), 'US$22.27 billion', 'operating_income =' + infobox.operating_income.text)
  t.equal(infobox.net_income.text(), 'US$21.20 billion', 'net_income =' + infobox.net_income.text)
  t.end()
})

test('climate template', function(t) {
  var str = `{{climate chart
| Toronto
| −6.7 | -0.7 | 62
| −5.6 |  0.4 | 55
| −1.9 |  4.7 | 54
|  4.1 | 11.5 | 68
|  9.9 | 18.4 | 82
| 14.9 | 23.9 | 71
| 18.0 | 26.6 | 64
| 17.4 | 25.5 | 81
| 13.4 | 21.0 | 85
|  7.4 | 14.0 | 64
|  2.3 |  7.5 | 84
| −3.1 |  2.1 | 61
|float=right
|source= Environment Canada }}`
  var data = wtf(str).templates(0).data
  t.equal(data.months[0].low, -6.7, 'jan low')
  t.equal(data.months[1].precip, 55, 'feb precip')
  t.end()
})
test('german ones', function(t) {
  var str = 'Buchstaben {{Taste|Q}}, {{Taste|W}}, {{Taste|E}}, {{Taste|R}}, {{Taste|T}} und {{Taste|Z}}'
  t.equal(wtf(str).text(), 'Buchstaben Q, W, E, R, T und Z', 'letters')
  t.end()
})
