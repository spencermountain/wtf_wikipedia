const wtf = require('./src/index');

let str = `{|class="wikitable sortable"
!Name and Surname!!Height
|-
|data-sort-value="Smith, John"|John Smith||1.85
|-
|data-sort-value="Ray, Ian"|Ian Ray||1.89
|-
|data-sort-value="Bianchi, Zachary"|Zachary Bianchi||1.72
|-
!Average:||1.82
|}`;
let doc = wtf(str);
console.log(doc.tables());

// str = `
// {{Quote
// |text=Quoted material.
// }}`;
