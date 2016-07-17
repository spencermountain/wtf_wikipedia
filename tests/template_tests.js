"use strict";
var parse_table = require("../src/parse/parse_table");
var parse_disambig = require("../src/parse/parse_disambig");
var parse_infobox = require("../src/parse/parse_infobox");
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


describe("parse_infobox", function () {
	it("hurricane", function (done) {
		let o = parse_infobox(hurricane);

		o.Name.text.should.be.equal("Tropical Storm Edouard");
		o.Dissipated.text.should.be.equal("September 6, 2002");
		o["Hurricane season"].text.should.be.equal("2002 Atlantic hurricane season");
		o.Areas.links[0].page.should.be.equal("Florida");
		done();
	});

	it("boloZenden", function (done) {

		let o = parse_infobox(boloZenden);

		o.years1.text.should.be.equal("1993–1998");
		o.clubs1.text.should.be.equal("PSV");


		o.youthyears1.text.should.be.equal("1985–1987");
		o.youthclubs1.text.should.be.equal("MVV");

		o.nationalyears1.text.should.be.equal("1997–2004");

		o.nationalteam1.text.should.be.equal("Netherlands");
		o.nationalteam1.links[0].page.should.be.equal("Netherlands national football team");
		o.nationalteam1.links[0].src.should.be.equal("Netherlands");
		o.nationalcaps1.text.should.be.equal(54);
		o.nationalgoals1.text.should.be.equal(7);



		done();
	});
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
describe("parse_disambig", function () {
	it("parkplace", function (done) {
		let o = parse_disambig(park_place);
		o.type.should.be.equal("disambiguation");
		o.pages.length.should.be.equal(4);
		o.pages[0].should.be.equal("Park Place (TV series)");
		done();
	});
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

describe("parse_table", function () {
	it("bluejays", function (done) {
		let arr = parse_table(bluejays);
		arr.length.should.be.equal(3);
		arr[0][0].should.be.equal("#");
		arr[1][0].should.be.equal("1");
		arr[1][1].should.be.equal("April 6");
		done();
	});
});
