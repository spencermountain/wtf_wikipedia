const helpers = require('../../lib/helpers');
const link_reg = /\[\[(.{2,80}?)\]\](\w{0,10})/g;
const ignore_links = /^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i;
const external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]\| ]{4,1500})([\| ].*?)?\]/g;

const external_links = function(links, str) {
  str.replace(external_link, function(all, protocol, link) {
    let text = '';
    let m = link.match(/\[([^\| ]+)/);
    if (m && m[1]) {
      text = m[1];
    }
    links.push({
      type: 'external',
      site: protocol + link,
      text: text
    });
    return text;
  });
  return links;
};

const internal_links = function(links, str) {
  //regular links
  str.replace(link_reg, function(_, s) {
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
      return s;
    }
    //kill off just anchor links [[#history]]
    if (link.match(/^#/i)) {
      return s;
    }
    //remove anchors from end [[toronto#history]]
    link = link.replace(/#[^ ]{1,100}/, '');
    var obj = {
      page: helpers.capitalise(link),
      text: txt || link
    };
    links.push(obj);
    return s;
  });
  return links;
};

//grab an array of internal links in the text
const parse_links = function(str) {
  let links = [];
  //first, parse external links
  links = external_links(links, str);
  //internal links
  links = internal_links(links, str);

  if (links.length === 0) {
    return undefined;
  }
  return links;
};
module.exports = parse_links;
