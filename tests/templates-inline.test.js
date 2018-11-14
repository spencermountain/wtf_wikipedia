'use strict';
var wtf = require('./lib');
var test = require('tape');

test('inline-no-data', function(t) {
  var arr = [
    [`plural`, `{{plural|1.5|page}}`],
    [`hlist`, `{{hlist|Winner|Runner-up|Third place|item_style=color:blue;}}`],
    [`lang`, `{{lang|fr|Je suis française.}}`],
    [`linum`, `{{linum|1|The first ordered list item}}`],
    [`lino`, `{{lino|1}}`],
    [`oldstyledate`, `{{OldStyleDate|2 February|1905|20 January}}`],
    [`reign`, `{{reign|27 BCE|14 CE}}`],
    [`circa`, `{{Circa|1350|cap=yes}}`],
    [`time`, `{{time|MST|dst=no}}`],
    [`date`, `{{date|2006-08-04|ISO}}`],
    [`date-none`, `{{date|4 August|none}}`],
    [`monthname`, `{{MONTHNAME|8}}`],
    [`dot`, `{{·}}`],
    [`semicolon`, `{{;}}`],
    [`comma`, `{{,}}`],
    [`half`, `{{1/2}}`],

    [`flag-name`, `{{flagicon|canada}}`],
    [`flag-iso-3`, `{{flagicon|BUL}}`],
    [`flag-faroe island`, `{{FRO}}`],

    [`rtl-lang`, `{{rtl-lang|tg-Arab|تاجیکی}}`],
    [`lbb`, ` {{Lbb|Severn}} `],
    [`vanchor`, `{{vanchor|humpty|dumpty}}`],
    [`plainlist`, `{{Plainlist|
* Example 1
* Example 2
* Example 3
}}`],
  // [``,``]
  ];
  arr.forEach((a) => {
    var doc = wtf(a[1]);
    var len = doc.templates().length;
    t.equal(len, 0, a[0] + ' count');
    t.notEqual(doc.text(), '', a[0] + ' text exists');
    t.notEqual(doc.text(), a[1], a[0] + ' text changed');
  });
  t.end();
});

test('list-templates', function(t) {
  var arr = [
    [`pagelist`, `{{Pagelist|X1|X2|X3|X4|X5}}`],
    [`collapsible list`, `{{Collapsible list
 | title = [[European Free Trade Association]] members
 | [[Iceland]]
 | [[Liechtenstein]]
 | [[Norway]]
 | [[Switzerland]]
}}`],
    [`catlist`, `{{Catlist|1989|1990|1991|1992|1993}}`],
    [`br`, `{{br separated entries|entry1|entry2| }}`],
    [`bulleted`, `{{bulleted list |one |two |three}}`],
    [`unbulleted`, `{{unbulleted list|first item|second item|third item|...}}`],
    [`comma`, `{{comma separated entries|entry1|entry2|entry3| }}`],
    [`ordered`, `{{Ordered list |entry1 |entry2| ... }}`],
    [`flatlist`, ` {{flatlist|
 * [[cat]]
 * [[dog]]
 * [[horse]]
 * [[cow]]
 * [[sheep]]
 * [[pig]]
 }}`],
    [`bare anchored list`, `{{bare anchored list
|First entry
|Second entry
|So on
...
|Last entry
}}`
    ]
  ];
  arr.forEach((a) => {
    var doc = wtf(a[1]);
    var len = doc.templates().length;
    t.equal(len, 0, a[0] + ' count');
    t.notEqual(doc.text(), '', a[0] + ' text exists');
    t.notEqual(doc.text(), a[1], a[0] + ' text changed');
  });
  t.end();
});

test('inline-with-data', function(t) {
  var arr = [
    [`cad`, `{{CAD|123.45|link=yes}}`],
    [`gbp`, `{{GBP|123.45}}`],
    [`acronym`, `{{acronym of|graphical user interface|lang=en}}`],
    [`la-verb-form`, `{{la-verb-form|amāre}}`],
    [`goal`, `{{goal|14||54|p|72||87}}`],
    [`isbn`, `{{ISBN|978-1-4133-0454-1}}`],
    [`based on`, `{{based on|"[[Super-Toys Last All Summer Long]]"|[[Brian Aldiss]]}}`],
    [`mpc`, `{{MPC|75482|(75482) 1999 XC173}}`]
  ];
  arr.forEach((a) => {
    var doc = wtf(a[1]);
    var len = doc.templates().length;
    t.equal(len, 1, a[0] + ' count');
    t.notEqual(doc.text(), '', a[0] + ' text exists');
    t.notEqual(doc.text(), a[1], a[0] + ' text changed');
  });
  t.end();
});

//this example has it all!
test('flags', function(t) {
  var str = `one {{flag|USA}}, two {{flag|DEU|empire}}, three {{flag|CAN|name=Canadian}}.`;
  var doc = wtf(str);
  t.equal(doc.links().length, 3, 'found 3 link');
  t.equal(doc.links(1).text, 'DEU', 'link text');
  t.equal(doc.links(1).page, 'Germany', 'link page');
  t.equal(doc.text(), 'one 🇺🇸 USA, two 🇩🇪 DEU, three 🇨🇦 CAN.', 'made emoji flags');
  t.end();
});

test('tricky-based-on', function(t) {
  var str = `{{Based on|''[[Jurassic Park (novel)|Jurassic Park]]''|Michael Crichton}}`;
  var doc = wtf(str);
  // t.equal(doc.links().length, 1, 'found link');
  // t.equal(doc.links(0).text, 'Jurassic Park', 'found link text');
  // t.equal(doc.text(), `''Jurassic Park'' by Michael Crichton`, 'parsed properly');
  t.equal(doc.templates().length, 1, 'found one template');
  t.equal(doc.templates(0).template, 'based on', 'found template name');
  t.end();
});
