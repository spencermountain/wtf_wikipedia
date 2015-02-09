var request=require("request")

var fetch=function(page, lang, cb){
  var lang= lang || 'en'
  var url='http://'+lang+'.wikipedia.org/w/index.php?action=raw&title='+page
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
// fetch("Radiohead", 'en', function(r){
//   console.log(JSON.stringify(r, null, 2));
// })