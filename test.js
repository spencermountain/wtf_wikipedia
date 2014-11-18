var path      = require('path')
var fs= require("fs")
var parser= require("./mine")
// var s='Miss Ray Levinsky.<ref name="theroyal">{{cite web|title=About - theroyal.to|url=http://www.theroyal.to/about/}}</ref> <p>When it was built in 1939,'
// console.log(instaview.convert(s))

var str = fs.readFileSync(path.join(__dirname, "test/royal_cinema.txt"), 'utf-8')
// var str = fs.readFileSync(path.join(__dirname, "test/toronto_star.txt"), 'utf-8')
data=parser(str)
console.log(JSON.stringify(data, null, 2));

