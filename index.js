//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var parser=(function(){
    "use strict";
    if (typeof module !== 'undefined' && module.exports) {
      var sentence_parser= require("./sentence_parser")
    }
    function recursive_replace(str,re){
      //http://blog.stevenlevithan.com/archives/reverse-recursive-pattern
        var output = [];
        var match, parts, last;
        while (match = re.exec(str)) {
            parts = match[0].split("\uFFFF");//a single unicode character
            if (parts.length < 2) {
                last = output.push(match[0]) - 1;
            } else {
                output[last] = parts[0] + output[last] + parts[1];
            }
            str = str.replace(re, "");
        }
        return str
    }
    // var str = "abc(d(e())f)(gh)ijk()";
    // var re = /\([^()]*\)/
    // var str="hello [[img|this is[[john]] he is nice]] world [[yes]]"
    // var re= /\[\[[^\[\]]*\]\]/
    // console.log(recursive_replace(str, re))
    var helpers={
      capitalise:function(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
       onlyUnique:function(value, index, self) {
        return self.indexOf(value) === index;
      },
      trim_whitespace: function(str){
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/  /, ' ');
      }
    }

    //grab an array of internal links in the text
    function fetch_links(str){
      var links=[]
      var tmp=str.match(/\[\[(.{2,60}?)\]\](\w*)/g)//regular links
      if(tmp){
          tmp.forEach(function(s){
              var link, txt;
              if(s.match(/\|/)){  //replacement link [[link|text]]
                s=s.replace(/\[\[(.{2,60}?)\]\](\w*)/g,"$1$2") //remove ['s and keep suffix
                link=s.replace(/(.{2,40})\|.*/,"$1")//replaced links
                txt=s.replace(/.{2,40}?\|/,'')
              }else{ // standard link [[link]]
                link=s.replace(/\[\[(.{2,40}?)\]\](\w*)/g,"$1") //remove ['s
              }
              //kill off non-wikipedia namespaces
              if(link.match(/^:?(category|image|file|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i)){
                  return
              }

              link=link.replace(/#[^ ]{1,100}/,'')//remove anchors
              link=helpers.capitalise(link)
              var arr=[link]
              if(txt){arr.push(txt)}
              links.push(arr)
          })
      }
      links=links.filter(helpers.onlyUnique)
      return links
    }
    // console.log(fetch_links("it is [[Tony Hawk|Tony]]s moher in [[Toronto]]s"))

    function fetch_categories(wiki){
      var cats=[]
      var tmp=wiki.match(/\[\[:?category:(.{2,60}?)\]\](\w*)/gi)//regular links
      if(tmp){
          tmp.forEach(function(c){
            c=c.replace(/^\[\[:?category:/i,'')
            c=c.replace(/\|?\]\]$/i,'')
            if(c && !c.match(/[\[\]]/)){
              cats.push(c)
            }
          })
        }
      return cats
    }

    //return only rendered text of wiki links
    function resolve_links(line){
        // categories, images, files
        var re= /\[\[:?Category:[^\[\]]{2,60}\]\]/g
        line=line.replace(re, "")

        // [[Common links]]
        line=line.replace(/\[\[:?([^|]{2,60}?)\]\](\w{0,5})/g, "$1$2")
        // [[Replaced|Links]]
        line=line.replace(/\[\[:?(.{2,60}?)\|([^\]]+?)\]\](\w{0,5})/g, "$2$3")
        // External links
        line=line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^ ]{4,1500}\]/g, "")
        // line=line.replace(/(^| )(https?|news|ftp|mailto|gopher|irc):(\/*)([^ $]*)/g, "$1")
        return line
    }

    function fetch_infobox(str){
        var obj={}
        var str= str.match(/\{\{Infobox [\s\S]*?\}\}/i)
        if(str && str[0]){
          str[0].replace(/\r/g,'').split(/\n/).forEach(function(l){
              if(l.match(/^\|/)){
                  var key= helpers.trim_whitespace(l.match(/^\| ?([^ ]*) /)[1])
                  var value= helpers.trim_whitespace(l.match(/=(.*)$/)[1])
                  if(key && value){
                    obj[key]=value
                }
              }
          })
        }
        return obj
    }

    function preprocess(wiki){
      //remove comments
      wiki= wiki.replace(/<!--[^>]{0,2000}-->/g,'')
      wiki=wiki.replace('__NOTOC__','')
      wiki=wiki.replace('__NOEDITSECTION__','')
      //kill off interwiki links
      wiki=wiki.replace(/\[\[([a-z][a-z]|simple):.{2,60}\]\]/i,'')
      //bold/italics
      wiki=wiki.replace(/''*([^']*)''*/g,'$1')
      //references (yes we're regexing some xml. blow me)
      //nowiki..
      //score..
      //table..
      wiki=wiki.replace(/< ?ref[a-z0-9=" ]{0,20}>[\s\S]{0,40}?<\/ ?ref ?>/g, " ")//<ref>...</ref>
      wiki=wiki.replace(/< ?ref [a-z0-9=" ]{2,20}\/>/g, " ")//<ref name="asd"/>
      //remove tables
      wiki= wiki.replace(/\{\|[\s\S]*?\|\}/g,'')

      return wiki
    }
    // console.log(preprocess("hi [[as:Plancton]] there"))

    function parse_line(line){
      return {
        text:postprocess(line),
        links:fetch_links(line)
      }
    }

    function postprocess(line){
        //fix links
        line= resolve_links(line)
        //oops, recursive image bug
        if(line.match(/^(thumb|right|left)\|/i)){
            return
        }
        //noinclude, random-ass xml tags, for god-knows...
        line=line.replace(/<[a-z \/]{0,40}>/i)
        //some IPA pronounciations leave blank junk parenteses
        line=line.replace(/\([^a-z]{0,8}\)/,'')
        line=helpers.trim_whitespace(line)

        return line
    }

    function parse_redirect(wiki){
      return wiki.match(/#redirect \[\[(.{2,60}?)\]\]/i)[1]
    }


    var parser=function(wiki){

      //detect if page is just redirect, and die
      if(wiki.match(/^#redirect \[\[.{2,60}?\]\]/i)){
        return {
          redirect:parse_redirect(wiki)
        }
      }

      //kill off th3 craziness
      wiki= preprocess(wiki)

      //get and parse an infobox
      var infobox=fetch_infobox(wiki)

      //remove all recursive template stuff
      var re= /\{\{[^\{\}]*\}\}/g
      wiki= recursive_replace(wiki, re)

      //NOT WORKING. FUCK
      // images & files can be recursive too (but not categories)
      // var re= /\[\[(File:|Image:)[^\[\]]*?\]\]/gi
      // wiki= recursive_replace(wiki, re)

      //get list of links, categories
      var cats=fetch_categories(wiki)
      var lines= wiki.replace(/\r/g,'').split(/\n/)

      //next, map each line into
      var output={}
      var section="Intro"
      lines.forEach(function(line){
        if(!section){
            return
        }
        //list
        if(line.match(/^[\*#:\|]/)){
            return
        }
        //headings
        if(line.match(/^={1,5}[^=]*={1,5}$/)){
            section=line.match(/^={1,5}([^=]{2,200}?)={1,5}$/)[1] || ''
            //ban some sections
            if(section.match(/^(references|see also|external links|further reading)$/i)){
                section=null
            }
            return
        }

        //still alive, add it to the section
        line=parse_line(line)
        if(line && line.text){
            if(!output[section]){
                output[section]=[]
            }
            output[section].push(line)
        }
      })
      // return output
      return {
        text:output,
        data:{
          categories:cats,
        },
        infobox:infobox
      }

    }

    if (typeof module !== 'undefined' && module.exports) {
      module.exports = parser;
    }

    return parser
})()



function from_file(page){
  fs=require("fs")
  var str = fs.readFileSync(__dirname+"/tests/royal_cinema.txt", 'utf-8')
  var data=parser(str).text['Intro']
  console.log(JSON.stringify(data, null, 2));
}
function from_api(page){
  var fetch=require("./fetch_text")
  fetch(page, function(str){
    console.log(parser(str).text['Intro'])
  })

}
function run_tests(){
  require("./tests/test")()
}
from_file("Toronto")
