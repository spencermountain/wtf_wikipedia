const wtf = require('./src/index')
// const wtf = require('./builds/wtf_wikipedia.min')
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// wtf.extend(models => {
//   // add a method to the Doc class
//   models.Doc.prototype.sayHi = function() {
//     console.log('hello ' + this.title())
//   }
// })

//raptors: 토론토_랩터스
//scotia: 스코샤_뱅크_아레나
//kawai: 카와이_레너드

wtf.fetch('카와이_레너드', 'ko', function(err, doc) {
  console.log(doc.images().map(i => i.json()))
  // console.log('---')
  // console.log(doc.plaintext())
})

// let doc = wtf(
//   `별 보충 선수로 숙고된 레너드는 [[2009년]] 국가에서 No. 8 [[스몰 포워드]]와 No. 48 선수로서 명단에 올라왔다.`
// )
// console.log(doc.links())
// console.log(doc.templates())
