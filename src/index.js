//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var wtf_wikipedia = (function() {
  var sentence_parser = require("./lib/sentence_parser");
  var fetch = require("./lib/fetch_text");
  var i18n = require("./data/i18n");
  var helpers = require("./lib/helpers");
  var languages = require("./data/languages");
  //parsers
  var parse_table = require("./parse/parse_table");
  var parse_line = require("./parse/parse_line");
  var parse_categories = require("./parse/parse_categories");
  var parse_disambig = require("./parse/parse_disambig");
  var parse_infobox = require("./parse/parse_infobox");
  var parse_infobox_template = require("./parse/parse_infobox_template");
  var parse_image = require("./parse/parse_image");
  var recursive_matches = require("./recursive_matches");
  var kill_xml = require("./kill_xml");
  var word_templates = require("./word_templates");
  //pulls target link out of redirect page
  var REDIRECT_REGEX = new RegExp("^ ?#(" + i18n.redirects.join("|") + ") ?\\[\\[(.{2,60}?)\\]\\]", "i");

  function preprocess(wiki) {
    //the dump requires us to unescape xml
    //remove comments
    wiki = wiki.replace(/<!--[^>]{0,2000}-->/g, "");
    wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/ig, "");
    //signitures
    wiki = wiki.replace(/~~{1,3}/, "");
    //horizontal rule
    wiki = wiki.replace(/--{1,3}/, "");
    //space
    wiki = wiki.replace(/&nbsp;/g, " ");
    //kill off interwiki links
    wiki = wiki.replace(/\[\[([a-z][a-z]|simple|war|ceb|min):.{2,60}\]\]/i, "");
    //bold and italics combined
    wiki = wiki.replace(/''{4}([^']{0,200})''{4}/g, "$1");
    //bold
    wiki = wiki.replace(/''{2}([^']{0,200})''{2}/g, "$1");
    //italic
    wiki = wiki.replace(/''([^']{0,200})''/g, "$1");
    //give it the inglorious send-off it deserves..
    wiki = kill_xml(wiki);

    return wiki;
  }
  // console.log(preprocess("hi [[as:Plancton]] there"))
  // console.log(preprocess("hi [[as:Plancton]] there"))
  // console.log(preprocess('hello <br/> world'))
  // console.log(preprocess("hello <asd f> world </h2>"))


  //some xml elements are just junk, and demand full inglorious death by regular exp
  //other xml elements, like <em>, are plucked out afterwards
  var main = function(wiki) {
    var infobox = {};
    var infobox_template = "";
    var images = [];
    var tables;
    var translations = {};
    wiki = wiki || "";
    //detect if page is just redirect, and return
    if (wiki.match(REDIRECT_REGEX)) {
      return {
        type: "redirect",
        redirect: (wiki.match(REDIRECT_REGEX) || [])[2]
      };
    }
    //detect if page is disambiguator page
    var template_reg = new RegExp("\\{\\{ ?(" + i18n.disambigs.join("|") + ")(\\|[a-z =]*?)? ?\\}\\}", "i");
    if (wiki.match(template_reg)) { //|| wiki.match(/^.{3,25} may refer to/i)|| wiki.match(/^.{3,25} ist der Name mehrerer /i)
      return parse_disambig(wiki);
    }
    //parse templates like {{currentday}}
    wiki = word_templates(wiki);
    //kill off th3 craziness
    wiki = preprocess(wiki);

    //find tables
    tables = wiki.match(/\{\|[\s\S]{1,8000}?\|\}/g, "") || [];
    tables = tables.map(function(s) {
      return parse_table(s);
    });
    //remove tables
    wiki = wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g, "");

    //reduce the scary recursive situations
    //remove {{template {{}} }} recursions
    var matches = recursive_matches("{", "}", wiki);
    var infobox_reg = new RegExp("\{\{(" + i18n.infoboxes.join("|") + ")[: \n]", "ig");
    matches.forEach(function(s) {
      if (s.match(infobox_reg, "ig") && Object.keys(infobox).length === 0) {
        infobox = parse_infobox(s);
        infobox_template = parse_infobox_template(s);
      }
      if (s.match(infobox_reg)) {
        wiki = wiki.replace(s, "");
      }
    });

    //second, remove [[file:...[[]] ]] recursions
    matches = recursive_matches("[", "]", wiki);
    matches.forEach(function(s) {
      if (s.match(new RegExp("\\[\\[(" + i18n.images.concat(i18n.files).join("|") + ")", "i"))) {
        images.push(parse_image(s));
        wiki = wiki.replace(s, "");
      }
    });
    //third, wiktionary-style interlanguage links
    matches.forEach(function(s) {
      if (s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i) != null) {
        var lang = s.match(/\[\[([a-z][a-z]):/i)[1];
        if (lang && languages[lang]) {
          translations[lang] = s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i)[2];
        }
        wiki = wiki.replace(s, "");
      }
    });

    //now that the scary recursion issues are gone, we can trust simple regex methods

    //kill the rest of templates
    wiki = wiki.replace(/\{\{.*?\}\}/g, "");

    //get list of links, categories
    var cats = parse_categories(wiki);
    //next, map each line into a parsable sentence
    var output = {};
    var lines = wiki.replace(/\r/g, "").split(/\n/);
    var section = "Intro";
    var number = 1;
    lines.forEach(function(part) {
      if (!section) {
        return;
      }
      //add # numberings formatting
      if (part.match(/^ ?\#[^:,\|]{4}/i)) {
        part = part.replace(/^ ?#*/, number + ") ");
        part = part + "\n";
        number += 1;
      } else {
        number = 1;
      }
      //add bullet-points formatting
      if (part.match(/^\*+[^:,\|]{4}/)) {
        part = part + "\n";
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
      var ban_headings = new RegExp("^ ?(" + i18n.sources.join("|") + ") ?$", "i"); //remove things like 'external links'
      if (part.match(/^={1,5}[^=]{1,200}={1,5}$/)) {
        section = part.match(/^={1,5}([^=]{2,200}?)={1,5}$/) || [];
        section = section[1] || "";
        section = section.replace(/\./g, " "); // this is necessary for mongo, i'm sorry
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
    if (infobox["image"] && infobox["image"].text) {
      var img = infobox["image"].text || "";
      if (typeof img === "string" && !img.match(new RegExp("^(" + i18n.images.concat(i18n.files).join("|") + ")", "i"))) {
        img = "File:" + img;
      }
      images.push(img);
    }

    return {
      type: "page",
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
    if (typeof lang_or_wikiid === "function") {
      cb = lang_or_wikiid;
      lang_or_wikiid = "en";
    }
    cb = cb || function() {};
    lang_or_wikiid = lang_or_wikiid || "en";
    if (!fetch) { //no http method, on the client side
      return cb(null);
    }
    fetch(page_identifier, lang_or_wikiid, cb);
  };

  var plaintext = function(str) {
    var data = main(str) || {};
    data.text = data.text || {};
    return Object.keys(data.text).map(function(k) {
      return data.text[k].map(function(a) {
        return a.text;
      }).join(" ");
    }).join("\n");
  };

  var methods = {
    from_api: from_api,
    parse: main,
    plaintext: plaintext
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = methods;
  }

  return methods;
})();

//export it for client-side
if (typeof window !== "undefined") { //is this right?
  window.wtf_wikipedia = wtf_wikipedia;
}
module.exports = wtf_wikipedia;

// wtf_wikipedia.from_api("Whistler", function(s){console.log(wtf_wikipedia.parse(s))})//disambig
// wtf_wikipedia.from_api("Toronto", 'tr', function(s){console.log(wtf_wikipedia.parse(s)) })
// wtf_wikipedia.from_api("Tomb_Raider_(2013_video_game)", 'en', function(s) {
//   console.log(wtf_wikipedia.parse(s).infobox)
// })

// wtf_wikipedia.from_api("Paris", function(page) {
//   var parsed = wtf_wikipedia.parse(page); // causes the crash
//   console.log(parsed);
// });

// var s = "Each year, however, there are a few days where the temperature rises above 32 C. Some years have even witnessed long periods of harsh summer weather, such as the [[2003 European heat wave for weeks, surged up to 40 °C}} on some days and seldom cooled down at night.{{sfn"



// function from_file(page){
//   var str = require("fs").readFileSync(__dirname+"/tests/cache/"+page+".txt", 'utf-8')
//   console.log(wtf_wikipedia.plaintext(str))
//   console.log(JSON.stringify(wtf_wikipedia.parse(str), null, 2));
// }

// from_file("list")
// from_file("Toronto")
// from_file("Toronto_Star")
// from_file("Royal_Cinema")
// from_file("Jodie_Emery")
// from_file("Redirect")
// from_file("Africaans")
// from_file("Anarchism")

// wtf_wikipedia.from_api("List_of_British_films_of_2014", function (s) {
//   console.log(JSON.stringify(wtf_wikipedia.parse(s), null, 2))
// })
// wtf_wikipedia.from_api("El deseo (telenovela)", "es", function (s) {
//   console.log(JSON.stringify(wtf_wikipedia.parse(s), null, 2))
// })
