//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var parser=(function(){
    "use strict";
    if (typeof module !== 'undefined' && module.exports) {
      var sentence_parser= require("./sentence_parser")
    }

    //find all the pairs of '[[...[[..]]...]]' in the text
    //used to properly root out recursive template calls, [[.. [[...]] ]]
    function recursive_matches(opener, closer, text){
      var out=[]
      var last=[]
      var chars=text.split('')
      var open=0
      for(var i=0; i<chars.length; i++){
        // console.log(chars[i] + "  "+open)
        if(chars[i]==opener && chars[i+1] && chars[i+1]==opener){
          open+=1
        }
        if(open>=0){
          last.push(chars[i])
        }
        if(open<=0 && last.length>0){
          //first, fix botched parse
          var open_count=last.filter(function(s){return s==opener})
          var close_count=last.filter(function(s){return s==closer})
          if(open_count.length > close_count.length){
            last.push(closer)
          }
          out.push(last.join(''))
          last=[]
        }
        if(chars[i]==closer && chars[i+1] && chars[i+1]==closer){ //this introduces a bug for "...]]]]"
          open-=1
          if(open<0){
            open=0
          }
        }
      }
      return out
    }


    var helpers={
      capitalise:function(str){
        if(str && typeof str=="string"){
          return str.charAt(0).toUpperCase() + str.slice(1);
        }
      },
       onlyUnique:function(value, index, self) {
        return self.indexOf(value) === index;
      },
      trim_whitespace: function(str){
        if(str && typeof str=="string"){
          return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/  /, ' ');
        }
      }
    }

    //grab an array of internal links in the text
    function fetch_links(str){
      var links=[]
      var tmp=str.match(/\[\[(.{2,80}?)\]\](\w{0,10})/g)//regular links
      if(tmp){
          tmp.forEach(function(s){
              var link, txt;
              if(s.match(/\|/)){  //replacement link [[link|text]]
                s=s.replace(/\[\[(.{2,80}?)\]\](\w{0,10})/g,"$1$2") //remove ['s and keep suffix
                link=s.replace(/(.{2,60})\|.{0,200}/,"$1")//replaced links
                txt=s.replace(/.{2,60}?\|/,'')
                //handle funky case of [[toronto|]]
                if(!txt && link.match(/\|$/)){
                  link=link.replace(/\|$/,'')
                  txt=link
                }
              }else{ // standard link [[link]]
                link=s.replace(/\[\[(.{2,60}?)\]\](\w{0,10})/g,"$1") //remove ['s
              }
              //kill off non-wikipedia namespaces
              if(link.match(/^:?(category|image|file|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i)){
                  return
              }
              //kill off just anchor links [[#history]]
              if(link.match(/^#/i)){
                  return
              }
              //remove anchors from end [[toronto#history]]
              link=link.replace(/#[^ ]{1,100}/,'')
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
      var tmp=wiki.match(/\[\[:?category:(.{2,60}?)\]\](\w{0,10})/gi)//regular links
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
        var re= /\[\[:?Category:[^\[\]]{2,80}\]\]/g
        line=line.replace(re, "")

        // [[Common links]]
        line=line.replace(/\[\[:?([^|]{2,80}?)\]\](\w{0,5})/g, "$1$2")
        // [[Replaced|Links]]
        line=line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, "$2$3")
        // External links
        line=line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^ ]{4,1500}\]/g, "")
        return line
    }

    function parse_infobox(str){
        var obj={}
        // var str= str.match(/\{\{Infobox [\s\S]*?\}\}/i)
        if(str ){
          //this collapsible list stuff is just a headache
          str=str.replace(/\{\{Collapsible list[^\}]{10,1000}\}\}/g,'')
          str.replace(/\r/g,'').split(/\n/).forEach(function(l){
              if(l.match(/^\|/)){
                  var key= l.match(/^\| ?([^ ]{1,200}) /) || {}
                  key= helpers.trim_whitespace(key[1] || '')
                  var value= l.match(/=(.{1,500})$/) || []
                  value=helpers.trim_whitespace(value[1] || '')
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
      wiki=wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/ig,'')
      //signitures
      wiki=wiki.replace(/~~{1,3}/,'')
      //horizontal rule
      wiki=wiki.replace(/--{1,3}/,'')
      //space
      wiki=wiki.replace(/&nbsp;/g,' ')
      //kill off interwiki links
      wiki=wiki.replace(/\[\[([a-z][a-z]|simple|war|ceb|min):.{2,60}\]\]/i,'')
      //bold/italics
      wiki=wiki.replace(/''{0,3}([^']{0,200})''{0,3}/g,'$1')
      //give it the inglorious send-off it deserves..
      wiki=kill_xml(wiki)

      //references (yes we're regexing some xml. blow me)
      //nowiki..
      //score..
      //table..
      //div..
      wiki=wiki.replace(/< ?ref[a-z0-9=" ]{0,20}>[\s\S]{0,40}?<\/ ?ref ?>/g, " ")//<ref>...</ref>
      wiki=wiki.replace(/< ?ref [a-z0-9=" ]{2,20}\/>/g, " ")//<ref name="asd"/>
      //remove tables
      wiki= wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g,'')


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
        //random-ass html tags, for god-knows... <s>, <u>, <pre>, noinclude, ...
        line=line.replace(/<[a-z \/]{0,40}>/i)
        //some IPA pronounciations leave blank junk parenteses
        line=line.replace(/\([^a-z]{0,8}\)/,'')
        line=helpers.trim_whitespace(line)

        return line
    }

    function parse_redirect(wiki){
      return wiki.match(/#redirect \[\[(.{2,60}?)\]\]/i)[1]
    }

    //some xml elements are just junk, and demand full inglorious death by regular exp
    //other xml elements, like <em>, are plucked out afterwards
    function kill_xml(wiki){
      //luckily, refs can't be recursive..
      wiki=wiki.replace(/<ref>[\s\S]{0,500}?<\/ref>/gi,'')// <ref></ref>
      wiki=wiki.replace(/<ref [^>]{0,200}?\/>/gi,'')// <ref name=""/>
      wiki=wiki.replace(/<ref [^>]{0,200}?>[\s\S]{0,500}?<\/ref>/ig,'')// <ref name=""></ref>
      //other types of xml that we want to trash completely
      wiki=wiki.replace(/<(table|code|dl|hiero|math|score) ?[^>]{0,200}?>[\s\S]{0,500}<\/(table|code|dl|hiero|math|score)>/gi,'')// <table name=""><tr>hi</tr></table>
      return wiki
    }
    // console.log(kill_xml("hello <ref>nono!</ref> world1. hello <ref name='hullo'>nono!</ref> world2. hello <ref name='hullo'/>world3.  hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4. hello<ref name=''/> world5 <ref name=''>nono</ref>, man.}}"))
    // console.log(kill_xml("hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4"))
    // console.log(kill_xml('hello<ref name="theroyal"/> world <ref>nono</ref>, man}}'))
    // console.log(kill_xml('hello<ref name="theroyal"/> world5 <ref name="">nono</ref>, man}}'))


    var parser=function(wiki){
      var infobox=''
      var images=[]
      var categories=[];

      //detect if page is just redirect, and die
      if(wiki.match(/^#redirect \[\[.{2,60}?\]\]/i)){
        return {
          redirect:parse_redirect(wiki)
        }
      }

      //kill off th3 craziness
      wiki= preprocess(wiki)

      //reduce the scary recursive situations
      //remove {{template {{}} }} recursions
      var matches=recursive_matches( '{', '}', wiki)
      matches.forEach(function(s){
        if(s.match(/\{\{infobox /i) && !infobox){
          infobox= parse_infobox(s)
        }
        if(s.match(/\{\{(cite|infobox|sister|geographic|navboxes)[ \|:]/i)){
          wiki=wiki.replace(s,'')
        }
      })
      //second, remove [[file:...[[]] ]] recursions
      matches=recursive_matches( '[', ']', wiki)
      matches.forEach(function(s){
        if(s.match(/\[\[(file|image)/i)){
          images.push(s)
          wiki=wiki.replace(s,'')
        }
      })
      //now that the scary recursion issues are gone, we can trust simple regex methods

      //kill the rest of templates
      wiki=wiki.replace(/\{\{.*?\}\}/g,'')

      //get list of links, categories
      var cats=fetch_categories(wiki)
      var lines= wiki.replace(/\r/g,'').split(/\n/)

      //next, map each line into
      var output={}
      var section="Intro"
      lines.forEach(function(part){
        sentence_parser(part).forEach(function(line){
          if(!section){
              return
          }
          //ignore list
          if(line.match(/^[\*#:;\|]/)){
              return
          }
          //headings
          if(line.match(/^={1,5}[^=]{1,200}={1,5}$/)){
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
      })

      //add additional image from infobox, if applicable
      if(infobox['image']){
        images.push(infobox['image'])
      }

      return {
        text:output,
        data:{
          categories:cats,
          images:images
        },
        infobox:infobox
      }

    }

    if (typeof module !== 'undefined' && module.exports) {
      module.exports = parser;
    }

    return parser
})()


var plaintext=function(data){
  return Object.keys(data.text).map(function(k){
    return data.text[k].map(function(a){
      return a.text
    }).join(" ")
  })
}

function from_file(page){
  fs=require("fs")
  var str = fs.readFileSync(__dirname+"/tests/"+page+".txt", 'utf-8')
  var data=parser(str)
  // data=plaintext(data)
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
// from_file("Toronto")
// from_file("Royal_Cinema")
from_file("Jodie_Emery")

// wiki= "hello {{Col-1}} world"
// wiki="Toronto ({{IPAc-en|t|ɵ|ˈ|r|ɒ|n|t|oʊ}}, {{IPAc-en|local|ˈ|t|r|ɒ|n|oʊ}}) is the most populous city in Canada and the provincial capital of Ontario.",
// wiki=wiki.replace(/\{\{.*?\}\}/,'')
// console.log(wiki)


//  TODO:
//  [[St. Kitts]] sentence bug
//  parse [[image: ..]]  and make href
//  ./toronto undefined bug
//  format infobox results better