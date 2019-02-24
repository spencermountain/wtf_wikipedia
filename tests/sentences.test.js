'use strict';
var wtf = require('./lib');
var test = require('tape');

test('tough sentence punctuation', function(t) {
  var arr = [
    `he is credited as '''Mr. Lawrence''' and sometimes '''Doug Lawrence'''.`,
    `he is credited as '''[[Mr. Lawrence]]''' and sometimes '''[[Doug Lawrence]]'''.`,
    `he is credited as [[Mr. Lawrence]] and sometimes Doug Lawrence.`,
    `he is credited as [http://cool.com Mr. Lawrence] and sometimes Doug Lawrence.`,
    `he is credited as {{asdf}}Mr. Lawrence and sometimes Doug Lawrence.`,
    `he is credited as Mr.{{asdf}} Lawrence and sometimes Doug Lawrence.`,
  // `he is credited as ([[Mr. Lawrence]]) and sometimes Doug Lawrence.`,
  // `he is credited as (''[[Mr. Lawrence]]'') and sometimes Doug Lawrence.`,
  ];
  arr.forEach((str, i) => {
    var doc = wtf(str);
    t.equal(doc.sentences(0).text(), 'he is credited as Mr. Lawrence and sometimes Doug Lawrence.', 'tough-sentence #' + i);
  });
  t.end();
});

test('unicode sentences', function(t) {
  let str = `Соединённые Штаты Америки, штат Вайоминг, шестидесятые годы. Молодые парни Эннис Дел Мар и Джек Твист, выросшие на бедных ранчо в разных концах штата, знакомятся при устройстве на сезонную работу: их нанимают пасти овец на высокогорных летних пастбищах у Горбатой горы, вдали от обжитых мест. Однажды ночью после немалого количества выпитого виски, укрывшись от холода в одной палатке, они вступают в сексуальную связь. Так начинается их роман. `;
  let arr = wtf(str).sentences();
  t.equal(arr.length, 4, 'four cyrillic sentences');
  t.end();
});

test('unicode paragraphs', function(t) {
  let str = `Соединённые Штаты Америки, штат Вайоминг, шестидесятые годы.

  Так начинается их роман`;
  let arr = wtf(str).paragraphs();
  t.equal(arr.length, 2, 'two cyrillic paragraphs');
  t.end();
});
