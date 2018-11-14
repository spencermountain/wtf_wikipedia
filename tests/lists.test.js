'use strict';
var test = require('tape');
var wtf = require('./lib');

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
