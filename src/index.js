//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var wtf_wikipedia = (function () {
  var sentence_parser = require("./lib/sentence_parser")
  var fetch = require("./lib/fetch_text")
  var i18n = require("./data/i18n")
  var languages = require("./data/languages")
  var helpers = require("./lib/helpers")
  var parse_table = require("./parse_table")
  var recursive_matches = require("./recursive_matches")
  var parse_line = require("./parse_line")
  var parse_categories = require("./parse_categories")
  var parse_disambig = require("./parse_disambig")
  var parse_infobox = require("./parse_infobox")
  var parse_image = require("./parse_image")
  var kill_xml = require("./kill_xml")
    //pulls target link out of redirect page
  var REDIRECT_REGEX = new RegExp("^ ?#(" + i18n.redirects.join('|') + ") ?\\[\\[(.{2,60}?)\\]\\]", "i")


  function parse_infobox_template(str) {
    var template = ''
    if(str) {
      var infobox_template_reg = new RegExp("\{\{(?:" + i18n.infoboxes.join("|") + ")\\s*(.*)", "i")
      var matches = str.match(infobox_template_reg)
      if(matches && matches.length > 1) {
        template = matches[1]
      }
    }
    return template
  }

  function preprocess(wiki) {
    //the dump requires us to unescape xml
    // unescape = [['>', '&gt;'],[ '<', '&lt;'],[ "'", '&apos;'],[ '"', '&quot;'],[ '&', '&amp;']]
    // unescape.forEach(function(a){wiki=wiki.replace(new RegExp(a[1],'g'), a[0])})

    //remove comments
    wiki = wiki.replace(/<!--[^>]{0,2000}-->/g, '')
    wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/ig, '')
      //signitures
    wiki = wiki.replace(/~~{1,3}/, '')
      //horizontal rule
    wiki = wiki.replace(/--{1,3}/, '')
      //space
    wiki = wiki.replace(/&nbsp;/g, ' ')
      //kill off interwiki links
    wiki = wiki.replace(/\[\[([a-z][a-z]|simple|war|ceb|min):.{2,60}\]\]/i, '')
      //bold and italics combined
    wiki = wiki.replace(/''{4}([^']{0,200})''{4}/g, '$1');
    //bold
    wiki = wiki.replace(/''{2}([^']{0,200})''{2}/g, '$1');
    //italic
    wiki = wiki.replace(/''([^']{0,200})''/g, '$1')
      //give it the inglorious send-off it deserves..
    wiki = kill_xml(wiki)

    return wiki
  }
  // console.log(preprocess("hi [[as:Plancton]] there"))
  // console.log(preprocess("hi [[as:Plancton]] there"))
  // console.log(preprocess('hello <br/> world'))
  // console.log(preprocess("hello <asd f> world </h2>"))


  //some xml elements are just junk, and demand full inglorious death by regular exp
  //other xml elements, like <em>, are plucked out afterwards

  // templates that need parsing and replacing for inline text
  //https://en.wikipedia.org/wiki/Category:Magic_word_templates
  var word_templates = function (wiki) {
      //we can be sneaky with this template, as it's often found inside other templates
      wiki = wiki.replace(/\{\{URL\|([^ ]{4,100}?)\}\}/gi, "$1")
        //this one needs to be handled manually
      wiki = wiki.replace(/\{\{convert\|([0-9]*?)\|([^\|]*).*?\}\}/gi, "$1 $2")
        //date-time templates
      var d = new Date()
      wiki = wiki.replace(/\{\{(CURRENT|LOCAL)DAY(2)?\}\}/gi, d.getDate())
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      wiki = wiki.replace(/\{\{(CURRENT|LOCAL)MONTH(NAME|ABBREV)?\}\}/gi, months[d.getMonth()])
      wiki = wiki.replace(/\{\{(CURRENT|LOCAL)YEAR\}\}/gi, d.getFullYear())
      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      wiki = wiki.replace(/\{\{(CURRENT|LOCAL)DAYNAME\}\}/gi, days[d.getDay()])
        //formatting templates
      wiki = wiki.replace(/\{\{(lc|uc|formatnum):(.*?)\}\}/gi, "$2")
      wiki = wiki.replace(/\{\{pull quote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, "$1")
      wiki = wiki.replace(/\{\{cquote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, "$1")
      if(wiki.match(/\{\{dts\|/)) {
        var date = (wiki.match(/\{\{dts\|(.*?)[\}\|]/) || [])[1] || ''
        date = new Date(date)
        if(date && date.getTime()) {
          wiki = wiki.replace(/\{\{dts\|.*?\}\}/gi, date.toDateString())
        } else {
          wiki = wiki.replace(/\{\{dts\|.*?\}\}/gi, ' ')
        }
      }
      //common templates in wiktionary
      wiki = wiki.replace(/\{\{term\|(.*?)\|.*?\}\}/gi, "'$1'")
      wiki = wiki.replace(/\{\{IPA\|(.*?)\|.*?\}\}/gi, "$1")
      wiki = wiki.replace(/\{\{sense\|(.*?)\|?.*?\}\}/gi, "($1)")
      wiki = wiki.replace(/\{\{t\+?\|...?\|(.*?)(\|.*)?\}\}/gi, "'$1'")
        //replace languages in 'etyl' tags
      if(wiki.match(/\{\{etyl\|/)) { //doesn't support multiple-ones per sentence..
        var lang = wiki.match(/\{\{etyl\|(.*?)\|.*?\}\}/i)[1] || ''
        lang = lang.toLowerCase()
        if(lang && languages[lang]) {
          wiki = wiki.replace(/\{\{etyl\|(.*?)\|.*?\}\}/gi, languages[lang].english_title)
        } else {
          wiki = wiki.replace(/\{\{etyl\|(.*?)\|.*?\}\}/gi, "($1)")
        }
      }
      return wiki
    }
    // console.log(word_templates("hello {{CURRENTDAY}} world"))
    // console.log(word_templates("hello {{CURRENTMONTH}} world"))
    // console.log(word_templates("hello {{CURRENTYEAR}} world"))
    // console.log(word_templates("hello {{LOCALDAYNAME}} world"))
    // console.log(word_templates("hello {{lc:88}} world"))
    // console.log(word_templates("hello {{pull quote|Life is like\n|author=[[asdf]]}} world"))
    // console.log(word_templates("hi {{etyl|la|-}} there"))
    // console.log(word_templates("{{etyl|la|-}} cognate with {{etyl|is|-}} {{term|hugga||to comfort|lang=is}},"))

  var main = function (wiki) {
    var infobox = {}
    var infobox_template = ''
    var images = []
    var tables = []
    var translations = {}
    wiki = wiki || ''
      //detect if page is just redirect, and return
    if(wiki.match(REDIRECT_REGEX)) {
      return {
        type: "redirect",
        redirect: (wiki.match(REDIRECT_REGEX) || [])[2]
      }
    }
    //detect if page is disambiguator page
    var template_reg = new RegExp("\\{\\{ ?(" + i18n.disambigs.join("|") + ")(\\|[a-z =]*?)? ?\\}\\}", "i")
    if(wiki.match(template_reg)) { //|| wiki.match(/^.{3,25} may refer to/i)|| wiki.match(/^.{3,25} ist der Name mehrerer /i)
      return parse_disambig(wiki)
    }
    //parse templates like {{currentday}}
    wiki = word_templates(wiki)

    //kill off th3 craziness
    wiki = preprocess(wiki)

    //find tables
    tables = wiki.match(/\{\|[\s\S]{1,8000}?\|\}/g, '') || []
    tables = tables.map(function (s) {
        return parse_table(s)
      })
      //remove tables
    wiki = wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g, '')

    //reduce the scary recursive situations
    //remove {{template {{}} }} recursions
    var matches = recursive_matches('{', '}', wiki)
    var infobox_reg = new RegExp("\{\{(" + i18n.infoboxes.join("|") + ")[: \n]", "ig")
    matches.forEach(function (s) {
        if(s.match(infobox_reg, "ig") && Object.keys(infobox).length === 0) {
          infobox = parse_infobox(s)
          infobox_template = parse_infobox_template(s)
        }
        if(s.match(/\{\{(Gallery|Taxobox|cite|infobox|Inligtingskas|sister|geographic|navboxes|listen|historical|citeweb|citenews|lien|clima|cita|Internetquelle|article|weather)[ \|:\n]/i)) {
          wiki = wiki.replace(s, '')
        }
      })
      //second, remove [[file:...[[]] ]] recursions
    matches = recursive_matches('[', ']', wiki)
    matches.forEach(function (s) {
        if(s.match(/\[\[(file|image|fichier|datei|plik)/i)) {
          images.push(parse_image(s))
          wiki = wiki.replace(s, '')
        }
      })
      //third, wiktionary-style interlanguage links
    matches.forEach(function (s) {
      if(s.match(/\[\[[a-z][a-z]\:.*/i)) {
        var lang = s.match(/\[\[([a-z][a-z]):/i)[1]
        if(lang && languages[lang]) {
          translations[lang] = s.match(/^\[\[([a-z][a-z]):(.*?)\]\]/i)[2]
        }
        wiki = wiki.replace(s, '')
      }
    })

    //now that the scary recursion issues are gone, we can trust simple regex methods

    //kill the rest of templates
    wiki = wiki.replace(/\{\{.*?\}\}/g, '')

    //get list of links, categories
    var cats = parse_categories(wiki)

    //next, map each line into a parsable sentence
    var output = {}
    var lines = wiki.replace(/\r/g, '').split(/\n/)
    var section = "Intro"
    var number = 1
    lines.forEach(function (part) {
      if(!section) {
        return
      }

      //add # numberings formatting
      if(part.match(/^ ?\#[^:,\|]{4}/i)) {
        part = part.replace(/^ ?#*/, number + ") ")
        part = part + "\n"
        number += 1
      } else {
        number = 1
      }
      //add bullet-points formatting
      if(part.match(/^\*+[^:,\|]{4}/)) {
        part = part + "\n"
      }

      //remove some nonsense wp lines
      //
      //ignore list
      if(part.match(/^[#\*:;\|]/)) {
        return
      }

      //ignore only-punctuation
      if(!part.match(/[a-z0-9]/i)) {
        return
      }
      //headings
      var ban_headings = new RegExp("^ ?(" + i18n.sources.join('|') + ") ?$", "i") //remove things like 'external links'
      if(part.match(/^={1,5}[^=]{1,200}={1,5}$/)) {
        section = part.match(/^={1,5}([^=]{2,200}?)={1,5}$/) || []
        section = section[1] || ''
        section = section.replace(/\./g, ' ') // this is necessary for mongo, i'm sorry
        section = helpers.trim_whitespace(section)
          //ban some sections
        if(section && section.match(ban_headings)) {
          section = undefined
        }
        return
      }
      //still alive, add it to the section
      sentence_parser(part).forEach(function (line) {
        line = parse_line(line)
        if(line && line.text) {
          if(!output[section]) {
            output[section] = []
          }
          output[section].push(line)
        }
      })
    })

    //add additional image from infobox, if applicable
    if(infobox['image'] && infobox['image'].text) {
      var img = infobox['image'].text || ''
      if(typeof img === "string" && !img.match(/^(image|file|fichier|Datei)/i)) {
        img = "File:" + img
      }
      images.push(img)
    }

    return {
      type: "page",
      text: output,
      categories: cats,
      images: images,
      infobox: infobox,
      infobox_template: infobox_template,
      tables: tables,
      translations: translations,
    }

  }

  var from_api = function (page_identifier, lang_or_wikiid, cb) {
    if(typeof lang_or_wikiid === "function") {
      cb = lang_or_wikiid
      lang_or_wikiid = "en"
    }
    cb = cb || function () {}
    lang_or_wikiid = lang_or_wikiid || "en"
    if(!fetch) { //no http method, on the client side
      return cb(null)
    }
    fetch(page_identifier, lang_or_wikiid, cb);
  };

  var plaintext = function (str) {
    var data = main(str) || {}
    data.text = data.text || {};
    return Object.keys(data.text).map(function (k) {
      return data.text[k].map(function (a) {
        return a.text
      }).join(" ")
    }).join("\n")
  }

  var methods = {
    from_api: from_api,
    parse: main,
    plaintext: plaintext,
  }

  if(typeof module !== 'undefined' && module.exports) {
    module.exports = methods
  }

  return methods
})()

//export it for client-side
if (typeof window!=="undefined") { //is this right?
  window.wtf_wikipedia = wtf_wikipedia;
}
module.exports = wtf_wikipedia;

// wtf_wikipedia.from_api("Whistler", function(s){console.log(wtf_wikipedia.parse(s))})//disambig
// wtf_wikipedia.from_api("Whistling", function(s){console.log(wtf_wikipedia.parse(s))})//disambig
// wtf_wikipedia.from_api("Toronto", function(s){console.log(wtf_wikipedia.parse(s).infobox.leader_name)})//disambig
// wtf_wikipedia.from_api("Athens", 'de', function(s){ console.log(wtf_wikipedia.parse(s)) })//disambig
// wtf_wikipedia.from_api("John Smith", 'en', function(s){ console.log(s);console.log(wtf_wikipedia.parse(s)) })//disambig
// wtf_wikipedia.from_api("Jodie Emery", 'en', function(str){   console.log(wtf_wikipedia.plaintext(str)) })//
// wtf_wikipedia.from_api("Toronto", 'tr', function(s){console.log(wtf_wikipedia.parse(s)) })//disambig

// function from_file(page){
//   fs=require("fs")
//   var str = fs.readFileSync(__dirname+"/tests/cache/"+page+".txt", 'utf-8')
//   console.log(wtf_wikipedia.plaintext(str))
//   // var data=wtf_wikipedia.parse(str)
//   // console.log(JSON.stringify(data, null, 2));
// }

// from_file("list")
// from_file("Toronto")
// from_file("Toronto_Star")
// from_file("Royal_Cinema")
// from_file("Jodie_Emery")
// from_file("Redirect")
// from_file("Africaans")
// from_file("Anarchism")

//  TODO:
//  [[St. Kitts]] sentence bug
//  parse [[image: ..]]  and make href
//  console.log(kill_xml("North America,<ref name=\"fhwa\"> and one of"))
// ... sentence
// "latd=43"

// wtf_wikipedia.from_api("List_of_British_films_of_2014", function (s) {
//   console.log(JSON.stringify(wtf_wikipedia.parse(s), null, 2))
//     // wtf_wikipedia.parse(s)
// })
