var wtf = require('./lib');
var test = require('tape');

test('start-end', function(t) {
  var str = `hello world
  {{NBA roster statistics start|team=Cleveland Cavaliers}}
  |-
  | style="text-align:left;"| {{sortname|Matthew|Dellavedova}} || 6 || 0 || 7.6 || .263 || .167 || .833 || 0.5 || 1.0 || 0.0 || 0.0 || 2.7
  |-
  | style="text-align:left;"| {{sortname|Channing|Frye}} || 4 || 0 || 8.3 || .000 || .000 || '''1.000''' || 0.8 || 0.0 || 0.0 || 0.5 || 0.5
  |-
  | style="text-align:left;"| {{sortname|Kyrie|Irving}} || 7 || 7 || 39.0 || .468 || '''.405''' || .939 || 3.9 || 3.9 || 2.1 || 0.7 || 27.1
  |-! style="background:#FDE910;"
  | style="text-align:left;"| {{sortname|LeBron|James}} || 7 || 7 || '''41.7''' || .494 || .371 || .721 || '''11.3''' || '''8.9''' || '''2.6''' || '''2.3''' || '''29.7'''
  |-
  | style="text-align:left;"| {{sortname|Richard|Jefferson}} || 7 || 2 || 24.0 || .516 || .167 || .636 || 5.3 || 0.4 || 1.3 || 0.1 || 5.7
  |-
  | style="text-align:left;"| {{sortname|Mo|Williams}} || 6 || 0 || 4.8 || .333 || .200 || .000 || 0.5 || 0.2 || 0.5 || 0.0 || 1.5
  {{s-end}}`;

  var doc = wtf(str);
  t.equal(doc.text(), 'hello world', 'text');
  t.equal(doc.templates().length, 1, 'got-template');
  t.end();
});
