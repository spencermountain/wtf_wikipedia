const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');


// var str = `{{convert|7|and|8|km}}`;
// var str = `{{convert|7|to|8|mi}}`;
// var str = `{{ill|Joke|fr|Blague|hu|Vicc|de|Witz}}`;
// var str = `hello {{small|2 February}}`;
// var str = `{{tiw|Hatnote}}`;
// var str = `{{date|June 8 2018|mdy}}`;
// var str = `{{l|cs|háček}}`;
// var str = `{{IPA|/ˈkærəktɚz/}}`;
// var str = `{{IPAc-ar|2|a|l|l|u|gh|a|t_|a|l|3|a|r|a|b|i|y|y|a}}`;
// var str = `{{dts|July 1, 1867}}`;
// var str = `{{dts|2024|Jun|12}}`;
// var str = `{{dts|-200}}`;
// var str = `{{dts|2020-10-15|format=dm}}`;
// var str = `{{dts|2000-03-82|abbr=on}}`;
// var str = ` {{tag|ref|content=haha}}`;
// var str = ` {{tag|div|content=haha}}`;
// var str = ` {{Monthyear}}`;
// var str = ` {{Time ago| Jan 6 2018|magnitude=weeks}}`;
// var str = `{{first word|Foo bar baz}} `;
// var str = `{{Trunc | Lorem ipsum dolor sit amet | 10 }}`; //Lorem ipsu
// var str = `{{str mid|Abcdefghijklmnopqrstuvwxyz|5|3}}`;
//var str = `{{plural|1.5|page}}`;
// var str = `{{Ordered list |entry1 |entry2| ... }}`;
// var str = `{{hlist|Winner|Runner-up|Third place|item_style=color:blue;|indent=2}}`;
// var str = `{{unbulleted list|first item|second item|third item|...}}`;
// var str = `{{block indent |1=The material to be indented here. May include markup, paragraph breaks, etc.}}`;
str = `hello there {{fun|foo=987234}} {{fun|foo=987234}} template`;
let doc = wtf(str);
console.log(doc.plaintext());
console.log(doc.templates('fun'));
// console.log(doc.infoboxes(0).data);
