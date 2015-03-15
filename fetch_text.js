var request=require("request")

var SITE_MATRIX_URL = "https://en.wikipedia.org/w/api.php?action=sitematrix&format=json";
var site_map = {};

function init_site_map() {
  if (Object.keys(site_map).length !== 0) {
    return;
  }
  var sitematrix_raw=require("./sitematrix");
  var sitematrix = sitematrix_raw.sitematrix;
  Object.keys(sitematrix).forEach(function(key){
    sitematrix[key].site.forEach(function(site){
      site_map[site.dbname] = site.url;
    });
  });
}

var fetch=function(page, lang_or_wikiid, cb){
  lang_or_wikiid = lang_or_wikiid || 'en';
  var url;
  if (lang_or_wikiid.length !== 2) {
    init_site_map();
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
// fetch("Radiohead", 'en', function(r){
//   console.log(JSON.stringify(r, null, 2));
// })
