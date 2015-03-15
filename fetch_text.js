var request= require("request")
var site_map= require("./site_map")

var fetch=function(page, lang_or_wikiid, cb){
  lang_or_wikiid = lang_or_wikiid || 'en';
  var url;
  if (site_map[lang_or_wikiid]) {
    url=site_map[lang_or_wikiid]+'/w/index.php?action=raw&title='+page;
  } else {
    url='http://'+lang_or_wikiid+'.wikipedia.org/w/index.php?action=raw&title='+page;
  }
  request({
    uri: url,
  }, function(error, response, body) {
    if(error){
      console.log(error);
    }
    cb(body);
  });
}

if(typeof module !== 'undefined' && module.exports) {
  module.exports = fetch;
}

// fetch("Radiohead", 'en', function(r){ // 'afwiki'
//   console.log(JSON.stringify(r, null, 2));
// })
