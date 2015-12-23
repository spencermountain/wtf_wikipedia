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
describe("parse_infobox", function() {
  it("hurricane", function(done) {
    let o = parse_infobox(hurricane);
    o.Name.text.should.be.equal("Tropical Storm Edouard");
    o.Dissipated.text.should.be.equal("September 6, 2002");
    o["Hurricane season"].text.should.be.equal("2002 Atlantic hurricane season");
    o.Areas.links[0].page.should.be.equal("Florida");
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
describe("parse_disambig", function() {
  it("parkplace", function(done) {
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

describe("parse_table", function() {
  it("bluejays", function(done) {
    let arr = parse_table(bluejays);
    arr.length.should.be.equal(3);
    arr[0][0].should.be.equal("#");
    arr[1][0].should.be.equal("1");
    arr[1][1].should.be.equal("April 6");
    done();
  });
});
