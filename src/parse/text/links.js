const helpers = require('../../lib/helpers');
const link_reg = /\[\[(.{2,80}?)\]\](\w{0,10})/g;
const ignore_links = /^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i;

//grab an array of internal links in the text
const parse_links = function(str) {
  let links = [];
  const all = str.match(link_reg) || []; //regular links
  all.forEach(function(s) {
    var link, txt;
    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,80}?)\]\](\w{0,10})/g, '$1$2'); //remove ['s and keep suffix
      link = s.replace(/(.{2,60})\|.{0,200}/, '$1'); //replaced links
      txt = s.replace(/.{2,60}?\|/, '');
      //handle funky case of [[toronto|]]
      if (!txt && link.match(/\|$/)) {
        link = link.replace(/\|$/, '');
        txt = link;
      }
    } else {
      // standard link [[link]]
      link = s.replace(/\[\[(.{2,60}?)\]\](\w{0,10})/g, '$1'); //remove ['s
    }
    //kill off non-wikipedia namespaces
    if (link.match(ignore_links)) {
      return;
    }
    //kill off just anchor links [[#history]]
    if (link.match(/^#/i)) {
      return;
    }
    //remove anchors from end [[toronto#history]]
    link = link.replace(/#[^ ]{1,100}/, '');
    link = helpers.capitalise(link);
    var obj = {
      page: link,
      src: txt
    };
    links.push(obj);
  });
  //remove duplicates
  links = links.filter(helpers.onlyUnique);
  if (links.length === 0) {
    return undefined;
  }
  return links;
};
module.exports = parse_links;
