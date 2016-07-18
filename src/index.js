//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var wtf_wikipedia = (function() {
  var sentence_parser = require('./lib/sentence_parser');
  var fetch = require('./lib/fetch_text');
  var make_image = require('./lib/make_image');
  var i18n = require('./data/i18n');
  var helpers = require('./lib/helpers');
  var languages = require('./data/languages');
  //parsers
  var redirects = require('./parse/parse_redirects');
  var parse_table = require('./parse/parse_table');
  var parse_line = require('./parse/parse_line');
  var parse_categories = require('./parse/parse_categories');
  var parse_disambig = require('./parse/parse_disambig');
  var parse_infobox = require('./parse/parse_infobox');
  var parse_infobox_template = require('./parse/parse_infobox_template');
  var parse_image = require('./parse/parse_image');
  var recursive_matches = require('./recursive_matches');
  var preprocess = require('./parse/cleanup_misc');
  var word_templates = require('./word_templates');

  //some xml elements are just junk, and demand full inglorious death by regular exp
  //other xml elements, like <em>, are plucked out afterwards
  var main = function(wiki) {
    var infobox = {};
    var infobox_template = '';
    var images = [];
    var tables;
    var translations = {};
    wiki = wiki || '';
    //detect if page is just redirect, and return
    if (redirects.is_redirect(wiki)) {
      return redirects.parse_redirect(wiki);
    }
    //detect if page is disambiguator page
    var template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z =]*?)? ?\\}\\}', 'i');
    if (wiki.match(template_reg)) { //|| wiki.match(/^.{3,25} may refer to/i)|| wiki.match(/^.{3,25} ist der Name mehrerer /i)
      return parse_disambig(wiki);
    }
    //parse templates like {{currentday}}
    wiki = word_templates(wiki);
    //kill off th3 craziness
    wiki = preprocess(wiki);
    //find tables
    tables = wiki.match(/\{\|[\s\S]{1,8000}?\|\}/g, '') || [];
    tables = tables.map(function(s) {
      return parse_table(s);
    });
    //remove tables
    wiki = wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g, '');

    //reduce the scary recursive situations
    //remove {{template {{}} }} recursions
    var matches = recursive_matches('{', '}', wiki);
    var infobox_reg = new RegExp('\{\{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
    matches.forEach(function(s) {
      if (s.match(infobox_reg, 'ig') && Object.keys(infobox).length === 0) {
        infobox = parse_infobox(s);
        infobox_template = parse_infobox_template(s);
      }
      if (s.match(infobox_reg)) {
        wiki = wiki.replace(s, '');
      }
      //if it's not a known template, but it's recursive, remove it
      //(because it will be misread later-on)
      if (s.match(/^\{\{/)) {
        wiki = wiki.replace(s, '');
      }
    });

    //second, remove [[file:...[[]] ]] recursions
    matches = recursive_matches('[', ']', wiki);
    matches.forEach(function(s) {
      if (s.match(new RegExp('\\[\\[(' + i18n.images.concat(i18n.files).join('|') + ')', 'i'))) {
        images.push(parse_image(s));
        wiki = wiki.replace(s, '');
      }
    });
    //third, wiktionary-style interlanguage links
    matches.forEach(function(s) {
      if (s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i) !== null) {
        var lang = s.match(/\[\[([a-z][a-z]):/i)[1];
        if (lang && languages[lang]) {
          translations[lang] = s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i)[2];
        }
        wiki = wiki.replace(s, '');
      }
    });

    //now that the scary recursion issues are gone, we can trust simple regex methods

    //kill the rest of templates
    wiki = wiki.replace(/\{\{.*?\}\}/g, '');

    //get list of links, categories
    var cats = parse_categories(wiki);
    //next, map each line into a parsable sentence
    var output = {};
    var lines = wiki.replace(/\r/g, '').split(/\n/);
    var section = 'Intro';
    var number = 1;
    lines.forEach(function(part) {
      if (!section) {
        return;
      }
      //add # numberings formatting
      if (part.match(/^ ?\#[^:,\|]{4}/i)) {
        part = part.replace(/^ ?#*/, number + ') ');
        part = part + '\n';
        number += 1;
      } else {
        number = 1;
      }
      //add bullet-points formatting
      if (part.match(/^\*+[^:,\|]{4}/)) {
        part = part + '\n';
      }
      //remove some nonsense wp lines

      //ignore list
      if (part.match(/^[#\*:;\|]/)) {
        return;
      }
      //ignore only-punctuation
      if (!part.match(/[a-z0-9]/i)) {
        return;
      }
      //headings
      var ban_headings = new RegExp('^ ?(' + i18n.sources.join('|') + ') ?$', 'i'); //remove things like 'external links'
      if (part.match(/^={1,5}[^=]{1,200}={1,5}$/)) {
        section = part.match(/^={1,5}([^=]{2,200}?)={1,5}$/) || [];
        section = section[1] || '';
        section = section.replace(/\./g, ' '); // this is necessary for mongo, i'm sorry
        section = helpers.trim_whitespace(section);
        //ban some sections
        if (section && section.match(ban_headings)) {
          section = undefined;
        }
        return;
      }
      //still alive, add it to the section
      sentence_parser(part).forEach(function(line) {
        line = parse_line(line);
        if (line && line.text) {
          if (!output[section]) {
            output[section] = [];
          }
          output[section].push(line);
        }
      });
    });
    //add additional image from infobox, if applicable
    if (infobox['image'] && infobox['image'].text) {
      var img = infobox['image'].text || '';
      if (typeof img === 'string' && !img.match(new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i'))) {
        img = 'File:' + img;
      }
      images.push(img);
    }
    //add url, etc to image
    images = images.map(make_image);
    return {
      type: 'page',
      text: output,
      categories: cats,
      images: images,
      infobox: infobox,
      infobox_template: infobox_template,
      tables: tables,
      translations: translations
    };

  };

  var from_api = function(page_identifier, lang_or_wikiid, cb) {
    if (typeof lang_or_wikiid === 'function') {
      cb = lang_or_wikiid;
      lang_or_wikiid = 'en';
    }
    cb = cb || function() {};
    lang_or_wikiid = lang_or_wikiid || 'en';
    if (!fetch) { //no http method, on the client side
      return cb(null);
    }
    return fetch(page_identifier, lang_or_wikiid, cb);
  };

  var plaintext = function(str) {
    var data = main(str) || {};
    data.text = data.text || {};
    return Object.keys(data.text).map(function(k) {
      return data.text[k].map(function(a) {
        return a.text;
      }).join(' ');
    }).join('\n');
  };

  var methods = {
    from_api: from_api,
    parse: main,
    plaintext: plaintext
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = methods;
  }

  return methods;
})();

module.exports = wtf_wikipedia;
