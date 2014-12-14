var request=require("request")

var fetch=function(page, cb){
  var url='http://en.wikipedia.org/w/index.php?action=raw&title='+page
  request({
    uri: url,
  }, function(error, response, body) {
    if(error){
      console.log(error)
    }
    cb(body);
  });
}

if(typeof module !== 'undefined' && module.exports) {
  module.exports = fetch;
}
// fetch("Radiohead",function(r){
//   console.log(JSON.stringify(r, null, 2));
// })