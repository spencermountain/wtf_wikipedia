var path      = require('path')
var fs= require("fs")
var instaview= require("./index")
var data = fs.readFileSync(path.join(__dirname, "test/royal_cinema.txt"), 'utf-8')
console.log(instaview.convert(data))

