var path      = require('path')
var fs= require("fs")
var parser= require("../index").parse

var tests=[
  {
    file:"royal_cinema",
    assert:function(data){
      // console.log(data)
      console.assert(data.infobox.opened.text==1939, "INFOBOX")
      console.assert(data.text.Intro.length>=5, "intro length")
      console.assert(data.categories.length==4, "categories length")
    }
  },
  {
    file:"toronto_star",
    assert:function(data){
      console.assert(data.infobox.publisher.text=='John D. Cruickshank')
      console.assert(data.text.Intro.length>=1)
      console.assert(data.text.History.length>=7)
      console.assert(data.categories.length==6)
      // console.assert(data.images.length==3)
    }
  },
  {
    file:"jodie_emery",
    assert:function(data){
      console.assert(data.infobox.nationality.text=='Canadian')
      console.assert(data.text.Intro.length>=1)
      console.assert(data.text['Political career'].length>=5)
      console.assert(data.categories.length==8)
      console.assert(data.images.length==1)
    }
  },
  {
    file:"redirect",
    assert:function(data){
      console.assert(data.redirect=='Toronto')
    }
  },
]

var do_test=function(obj){
  var str = fs.readFileSync(path.join(__dirname, obj.file+".txt"), 'utf-8')
  var data=parser(str)
  obj.assert(data)
  console.log("=="+obj.file+"==      passed!")
}


// var str = fs.readFileSync(path.join(__dirname, "test/toronto_star.txt"), 'utf-8')
// var data=parser(str)
// console.log(JSON.stringify(data, null, 2));
function test(){
  tests.forEach(do_test)
}
test()

if (typeof module !== 'undefined' && module.exports) {
  module.exports = test;
}