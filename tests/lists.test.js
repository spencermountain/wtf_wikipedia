var test = require('tape')
var wtf = require('./lib')

test('list-templates', function(t) {
  var arr = [
    [`pagelist`, `{{Pagelist|X1|X2|X3|X4|X5}}`],
    [`catlist`, `{{Catlist|1989|1990|1991|1992|1993}}`],
    [`br`, `{{br separated entries|entry1|entry2| }}`],
    [`bulleted`, `{{bulleted list |one |two |three}}`],
    [`comma`, `{{comma separated entries|entry1|entry2|entry3| }}`],
    [
      `flatlist`,
      ` {{flatlist|
 * [[cat]]
 * [[dog]]
 * [[horse]]
 * [[cow]]
 * [[sheep]]
 * [[pig]]
 }}`
    ],
    [
      `bare anchored list`,
      `{{bare anchored list
|First entry
|Second entry
|So on
...
|Last entry
}}`
    ]
  ]
  arr.forEach(a => {
    var doc = wtf(a[1])
    var len = doc.templates().length
    t.equal(len, 0, a[0] + ' count')
    t.notEqual(doc.text(), '', a[0] + ' text exists')
    t.notEqual(doc.text(), a[1], a[0] + ' text changed')
  })
  t.end()
})

test('collapsible list', function(t) {
  var str = `{{Collapsible list
   | title = [[European Free Trade Association]] members
   | [[Iceland]]
   | [[Liechtenstein]]
   | [[Norway]]
   | [[Switzerland]]
  }}`
  var doc = wtf(str)
  var tmpl = doc.templates(0) || {}
  t.equal(tmpl.title, 'European Free Trade Association members', 'got title 1')
  t.equal(tmpl.list.length, 4, 'got list')
  t.equal(tmpl.list[1], 'Liechtenstein', 'got list member')
  t.equal(
    doc.text(),
    'European Free Trade Association members\n\nIceland\n\nLiechtenstein\n\nNorway\n\nSwitzerland',
    'text 3'
  )

  str = `{{Collapsible list
    |framestyle=border:none; padding:0; <!--Hides borders and improves row spacing-->
    |title=List of MPs
    |1=[[Dean Allison]] |2=[[Chris Charlton]] |3=[[David Christopherson]] |4=[[Wayne Marston]] |5=[[David Sweet]]
   }}`
  doc = wtf(str)
  tmpl = doc.templates(0) || {}
  t.equal(tmpl.title, 'List of MPs', 'got title 2')
  t.equal(tmpl.list.length, 5, 'got list2')
  t.equal(tmpl.list[1], 'Chris Charlton', 'got list member2')
  t.equal(
    doc.text(),
    'List of MPs\n\nDean Allison\n\nChris Charlton\n\nDavid Christopherson\n\nWayne Marston\n\nDavid Sweet',
    'text 2'
  )
  t.end()
})

test('unbulleted list', function(t) {
  var str = `{{unbulleted list|first item|second item|third item|}}`
  var doc = wtf(str)
  var tmpl = doc.templates(0) || {}
  t.equal(tmpl.title, undefined, 'got title 3')
  t.equal(tmpl.list.length, 3, 'got list3')
  t.equal(tmpl.list[1], 'second item', 'got list member3')
  t.equal(doc.text(), 'first item\n\nsecond item\n\nthird item', 'text 3')
  t.end()
})

test('ordered list', function(t) {
  var str = `{{Ordered list|first item|second item|third item|}}`
  var doc = wtf(str)
  var tmpl = doc.templates(0) || {}
  t.equal(tmpl.title, undefined, 'got title 4')
  t.equal(tmpl.list.length, 3, 'got list4')
  t.equal(tmpl.list[1], 'second item', 'got list member4')
  t.equal(doc.text(), '1. first item\n\n2. second item\n\n3. third item', 'text 4')
  t.end()
})
