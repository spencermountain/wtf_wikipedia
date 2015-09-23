var helpers = require("../lib/helpers");
//grab an array of internal links in the text
var parse_links = function (str) {
  var links = [];
  var tmp = str.match(/\[\[(.{2,80}?)\]\](\w{0,10})/g); //regular links
  if(tmp) {
    tmp.forEach(function (s) {
      var link, txt;
      if(s.match(/\|/)) { //replacement link [[link|text]]
        s = s.replace(/\[\[(.{2,80}?)\]\](\w{0,10})/g, "$1$2"); //remove ['s and keep suffix
        link = s.replace(/(.{2,60})\|.{0,200}/, "$1"); //replaced links
        txt = s.replace(/.{2,60}?\|/, '');
          //handle funky case of [[toronto|]]
        if(!txt && link.match(/\|$/)) {
          link = link.replace(/\|$/, '');
          txt = link
        }
      } else { // standard link [[link]]
        link = s.replace(/\[\[(.{2,60}?)\]\](\w{0,10})/g, "$1"); //remove ['s
      }
      //kill off non-wikipedia namespaces
      if(link.match(/^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i)) {
        return
      }
      //kill off just anchor links [[#history]]
      if(link.match(/^#/i)) {
        return
      }
      //remove anchors from end [[toronto#history]]
      link = link.replace(/#[^ ]{1,100}/, '');
      link = helpers.capitalise(link);
      var obj = {
        page: link,
        src: txt
      };
      links.push(obj)
    })
  }
  links = links.filter(helpers.onlyUnique);
  if(links.length === 0) {
    return undefined
  }
  return links
};
module.exports = parse_links;
