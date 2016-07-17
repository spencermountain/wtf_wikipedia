'use strict';
var parse_table = require('../src/parse/parse_table');
var parse_disambig = require('../src/parse/parse_disambig');
var parse_infobox = require('../src/parse/parse_infobox');
var test = require('tape');

let boloZenden = `{{Infobox football biography
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
}}`;
test('boloZenden infobox', function(t) {
  let o = parse_infobox(boloZenden);
  t.equal(o.years1.text, '1993–1998');
  t.equal(o.clubs1.text, 'PSV');
  t.equal(o.youthyears1.text, '1985–1987');
  t.equal(o.youthclubs1.text, 'MVV');
  t.equal(o.nationalyears1.text, '1997–2004');
  t.equal(o.nationalteam1.text, 'Netherlands');
  t.equal(o.nationalteam1.links[0].page, 'Netherlands national football team');
  t.equal(o.nationalteam1.links[0].src, 'Netherlands');
  t.equal(o.nationalcaps1.text, 54);
  t.equal(o.nationalgoals1.text, 7);
  t.end();
});

let hurricane = `{{Infobox Hurricane
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
}}`;
test('hurricane infobox', function(t) {
  let o = parse_infobox(hurricane);
  t.equal(o.Name.text, 'Tropical Storm Edouard');
  t.equal(o.Dissipated.text, 'September 6, 2002');
  t.equal(o['Hurricane season'].text, '2002 Atlantic hurricane season');
  t.equal(o.Areas.links[0].page, 'Florida');
  t.end();
});

let park_place = `
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
`;
test('parkplace disambig', function(t) {
  let o = parse_disambig(park_place);
  t.equal(o.type, 'disambiguation');
  t.equal(o.pages.length, 4);
  t.equal(o.pages[0], 'Park Place (TV series)');
  t.end();
});


let bluejays = `
{| border="1" cellpadding="2" cellspacing="0" class="wikitable"
|-
! bgcolor="#DDDDFF" width="4%" | #
|- align="center" bgcolor="ffbbbb"
| 1 || April 6 || @ [[Minnesota Twins|Twins]] || 6 - 1 || [[Brad Radke|Radke]] (1-0) || '''[[Pat Hentgen|Hentgen]]''' (0-1) || || 45,601 || 0-1
|- align="center" bgcolor="bbffbb"
| 2 || April 7 || @ [[Minnesota Twins|Twins]] || 9 - 3 || '''[[David Wells|Wells]]''' (1-0) || [[Mike Lincoln|Lincoln]] (0-1) || '''[[Roy Halladay|Halladay]]''' (1) || 9,220 || 1-1
|}
`;
test('bluejays table', function(t) {
  let arr = parse_table(bluejays);
  t.equal(arr.length, 3);
  t.equal(arr[0][0], '#');
  t.equal(arr[1][0], '1');
  t.equal(arr[1][1], 'April 6');
  t.end();
});
