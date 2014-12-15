//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var wtf_wikipedia=(function(){
    "use strict";
    if (typeof module !== 'undefined' && module.exports) {
      var sentence_parser= require("./sentence_parser")
      var fetch=require("./fetch_text")
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
          str=str.replace(/^\s\s*/, '')
          str=str.replace(/\s\s*$/, '')
          str=str.replace(/  /, ' ')
          str=str.replace(/\s, /,', ')
          return str
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
              if(link.match(/^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i)){
                  return
              }
              //kill off just anchor links [[#history]]
              if(link.match(/^#/i)){
                  return
              }
              //remove anchors from end [[toronto#history]]
              link=link.replace(/#[^ ]{1,100}/,'')
              link=helpers.capitalise(link)
              var obj={
                page:link,
                src: txt
              }
              links.push(obj)
          })
      }
      links=links.filter(helpers.onlyUnique)
      if(links.length==0){
        return undefined
      }
      return links
    }
    // console.log(fetch_links("it is [[Tony Hawk|Tony]]s moher in [[Toronto]]s"))

    function fetch_categories(wiki){
      var cats=[]
      var tmp=wiki.match(/\[\[:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف):(.{2,60}?)\]\](\w{0,10})/gi)//regular links
      if(tmp){
          tmp.forEach(function(c){
            c=c.replace(/^\[\[:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف):/i,'')
            c=c.replace(/\|?[ \*]?\]\]$/i,'')
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
        var re= /\[\[:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف):[^\]\]]{2,80}\]\]/gi
        line=line.replace(re, "")

        // [[Common links]]
        line=line.replace(/\[\[:?([^|]{2,80}?)\]\](\w{0,5})/g, "$1$2")
        // [[Replaced|Links]]
        line=line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, "$2$3")
        // External links
        line=line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g, "$2")
        return line
    }
     // console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))



    function parse_image(img){
      img= img.match(/(file|image):.*?[\|\]]/i) || ['']
      img=img[0].replace(/\|$/,'')
      return img
    }

    function parse_infobox(str){
        var obj={}
        // var str= str.match(/\{\{Infobox [\s\S]*?\}\}/i)
        if(str ){
          //this collapsible list stuff is just a headache
          str=str.replace(/\{\{Collapsible list[^\}]{10,1000}\}\}/g,'')
          str.replace(/\r/g,'').split(/\n/).forEach(function(l){
              if(l.match(/^\|/)){
                  var key= l.match(/^\| ?(.{1,200}?)[ =]/) || []
                  key= helpers.trim_whitespace(key[1] || '')
                  var value= l.match(/=(.{1,500})$/) || []
                  value=helpers.trim_whitespace(value[1] || '')
                  //this is necessary for mongodb, im sorry
                  if(key && key.match(/[\.]/)){
                    key=null
                  }
                  if(key && value && !value.match(/^[\|<]/) && !value.match(/=/)){
                    obj[key]=parse_line(value)
                    //turn number strings into integers
                    if(obj[key].text && obj[key].text.match(/^[0-9,]*$/)){
                      obj[key].text= obj[key].text.replace(/,/g)
                      obj[key].text= parseInt(obj[key].text)
                    }
                }
              }
          })
        }
        return obj
    }

    function preprocess(wiki){
      //the dump requires us to unescape xml
      // unescape = [['>', '&gt;'],[ '<', '&lt;'],[ "'", '&apos;'],[ '"', '&quot;'],[ '&', '&amp;']]
      // unescape.forEach(function(a){wiki=wiki.replace(new RegExp(a[1],'g'), a[0])})

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

      //remove tables
      wiki= wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g,'')


      return wiki
    }
    // console.log(preprocess("hi [[as:Plancton]] there"))
    // console.log(preprocess("hi [[as:Plancton]] there"))
      // console.log(preprocess('hello <br/> world'))
      // console.log(preprocess("hello <asd f> world </h2>"))


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
        //some IPA pronounciations leave blank junk parenteses
        line=line.replace(/\([^a-z]{0,8}\)/,'')
        line=helpers.trim_whitespace(line)

        return line
    }

    function parse_redirect(wiki){
      return wiki.match(/#(redirect|weiterleitung|redirecci[oó]n) \[\[(.{2,60}?)\]\]/i)[2]
    }

    //some xml elements are just junk, and demand full inglorious death by regular exp
    //other xml elements, like <em>, are plucked out afterwards
    function kill_xml(wiki){
      //https://en.wikipedia.org/wiki/Help:HTML_in_wikitext
      //luckily, refs can't be recursive..
      wiki=wiki.replace(/<ref>[\s\S]{0,500}?<\/ref>/gi,' ')// <ref></ref>
      wiki=wiki.replace(/<ref [^>]{0,200}?\/>/gi,' ')// <ref name=""/>
      wiki=wiki.replace(/<ref [^>]{0,200}?>[\s\S]{0,500}?<\/ref>/ig,' ')// <ref name=""></ref>
      //other types of xml that we want to trash completely
      wiki=wiki.replace(/< ?(table|code|dl|hiero|math|score|data|gallery) ?[^>]{0,200}?>[\s\S]{0,700}< ?\/ ?(table|code|dl|hiero|math|score|data|gallery) ?>/gi,' ')// <table name=""><tr>hi</tr></table>

      //some xml-like fragments we can also kill
      //
      wiki=wiki.replace(/< ?(ref|span|div|table|data) [a-z0-9=" ]{2,20}\/ ?>/g, " ")//<ref name="asd"/>
      //some formatting xml, we'll keep their insides though
      wiki=wiki.replace(/<[ \/]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr)[ \/]?>/g, " ")//<sub>, </sub>
      wiki=wiki.replace(/<[ \/]?(abbr|bdi|bdo|blockquote|cite|del|dfn|em|i|ins|kbd|mark|q|s)[ \/]?>/g, " ")//<abbr>, </abbr>
      wiki=wiki.replace(/<[ \/]?h[0-9][ \/]?>/g, " ")//<h2>, </h2>
      //a more generic + dangerous xml-tag removal
      wiki=wiki.replace(/<[ \/]?[a-z0-9]{1,8}[ \/]?>/g, " ")//<samp>

      return wiki
    }
    // console.log(kill_xml("hello <ref>nono!</ref> world1. hello <ref name='hullo'>nono!</ref> world2. hello <ref name='hullo'/>world3.  hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4. hello<ref name=''/> world5 <ref name=''>nono</ref>, man.}}"))
    // console.log(kill_xml("hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4"))
    // console.log(kill_xml('hello<ref name="theroyal"/> world <ref>nono</ref>, man}}'))
    // console.log(kill_xml('hello<ref name="theroyal"/> world5 <ref name="">nono</ref>, man'))
    // console.log(kill_xml("hello <asd f> world </h2>"))
    // console.log(kill_xml("North America,<ref name=\"fhwa\"> and one of"))

    // templates that need parsing and replacing for inline text
    //https://en.wikipedia.org/wiki/Category:Magic_word_templates
    var word_templates= function(wiki){
      //we can be sneaky with this template, as it's often found inside other templates
      wiki=wiki.replace(/\{\{URL\|([^ ]{4,100}?)\}\}/gi, "$1")
      //this one needs to be handled manually
      wiki=wiki.replace(/\{\{convert\|([0-9]*?)\|([^\|]*).*?\}\}/gi, "$1 $2")
      //date-time templates
      var d= new Date()
      wiki=wiki.replace(/\{\{(CURRENT|LOCAL)DAY(2)?\}\}/gi, d.getDate())
      var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      wiki=wiki.replace(/\{\{(CURRENT|LOCAL)MONTH(NAME|ABBREV)?\}\}/gi, months[d.getMonth()])
      wiki=wiki.replace(/\{\{(CURRENT|LOCAL)YEAR\}\}/gi, d.getFullYear())
      var days= [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      wiki=wiki.replace(/\{\{(CURRENT|LOCAL)DAYNAME\}\}/gi, days[d.getDay()])
      //formatting templates
      wiki=wiki.replace(/\{\{(lc|uc|formatnum):(.*?)\}\}/gi, "$2")
      wiki=wiki.replace(/\{\{pull quote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, "$1")
      wiki=wiki.replace(/\{\{cquote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, "$1")

      return wiki
    }
    // console.log(word_templates("hello {{CURRENTDAY}} world"))
    // console.log(word_templates("hello {{CURRENTMONTH}} world"))
    // console.log(word_templates("hello {{CURRENTYEAR}} world"))
    // console.log(word_templates("hello {{LOCALDAYNAME}} world"))
    // console.log(word_templates("hello {{lc:88}} world"))
    // console.log(word_templates("hello {{pull quote|Life is like\n|author=[[asdf]]}} world"))

    //return a list of probable pages for this disambig page
    var parse_disambig=function(wiki){
      var pages=[]
      var lines= wiki.replace(/\r/g,'').split(/\n/)
      lines.forEach(function(str){
        //if there's an early link in the list
        if(str.match(/^\*.{0,40}\[\[.*\]\]/)){
          var links=fetch_links(str)
          if(links && links[0] && links[0].page){
            pages.push(links[0].page)
          }
        }
      })
      return {
        type:"disambiguation",
        pages:pages
      }
    }


    var main=function(wiki){
      var infobox={}
      var images=[]
      var categories=[];
      wiki=wiki||''
      //detect if page is just redirect, and die
      if(wiki.match(/^#(redirect|weiterleitung|redirecci[oó]n) \[\[.{2,60}?\]\]/i)){
        return {
          type:"redirect",
          redirect:parse_redirect(wiki)
        }
      }
      //detect if page is disambiguator page
      if(wiki.match(/\{\{ ?(disambig|disambiguation|dab|disamb)(\|[a-z =]*?)? ?\}\}/i) || wiki.match(/^.{3,25} may refer to/i)){
        return parse_disambig(wiki)
      }
      //parse templates like {{currentday}}
      wiki= word_templates(wiki)

      //kill off th3 craziness
      wiki= preprocess(wiki)

      //reduce the scary recursive situations
      //remove {{template {{}} }} recursions
      var matches=recursive_matches( '{', '}', wiki)
      matches.forEach(function(s){
        if(s.match(/\{\{(infobox|ficha|Канадский|Inligtingskas|لغة) /i) && Object.keys(infobox).length==0){
          infobox= parse_infobox(s)
        }
        if(s.match(/\{\{(cite|infobox|Inligtingskas|sister|geographic|navboxes|listen|historical|citeweb|citenews|lien|clima|cita|Internetquelle|article|weather)[ \|:\n]/i)){
          wiki=wiki.replace(s,'')
        }
      })
      //second, remove [[file:...[[]] ]] recursions
      matches=recursive_matches( '[', ']', wiki)
      matches.forEach(function(s){
        if(s.match(/\[\[(file|image|fichier|datei|plik)/i)){
          images.push(parse_image(s))
          wiki=wiki.replace(s,'')
        }
      })
      //now that the scary recursion issues are gone, we can trust simple regex methods

      //kill the rest of templates
      wiki=wiki.replace(/\{\{.*?\}\}/g,'')

      //get list of links, categories
      var cats=fetch_categories(wiki)

      //next, map each line into a parsable sentence
      var output={}
      var lines= wiki.replace(/\r/g,'').split(/\n/)
      var section="Intro"
      lines.forEach(function(part){
        if(!section){
            return
        }
        //remove some nonsense wp lines
        //
        //ignore list
        if(part.match(/^[\*#:;\|]/)){
            return
        }
        //ignore only-punctuation
        if(!part.match(/[a-z0-9]/i)){
            return
        }
        //headings
        if(part.match(/^={1,5}[^=]{1,200}={1,5}$/)){
            section=part.match(/^={1,5}([^=]{2,200}?)={1,5}$/) || []
            section= section[1]||''
            section=section.replace(/\./g, ' ') // this is necessary for mongo, i'm sorry
            section=helpers.trim_whitespace(section)
            //ban some sections
            if(section && section.match(/^(references|see also|external links|further reading|Notes et références|Voir aussi|Liens externes)$/i)){
                section=undefined
            }
            return
        }
        //still alive, add it to the section
        sentence_parser(part).forEach(function(line){
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
      if(infobox['image'] && infobox['image'].text){
        var img=infobox['image'].text || ''
        if(!img.match(/^(image|file|fichier|Datei)/i)){
          img="File:"+img
        }
        images.push(img)
      }

      return {
        type:"page",
        text:output,
        categories:cats,
        images:images,
        infobox:infobox
      }

    }

    var from_api=function(page, cb){
      cb= cb || console.log
      if(!fetch){//no http method, on the client side
        return cb(null)
      }
      fetch(page, cb)
    }

    var plaintext=function(str){
      var data= main(str)
      return Object.keys(data.text).map(function(k){
        return data.text[k].map(function(a){
          return a.text
        }).join(" ")
      }).join("\n")
    }


    var methods={
        from_api:from_api,
        parse:main,
        plaintext:plaintext,
      }

    if (typeof module !== 'undefined' && module.exports) {
      module.exports = methods
    }

    return methods
})()


// wtf_wikipedia.from_api("Whistler", function(s){console.log(wtf_wikipedia.parse(s))})//disambig
// wtf_wikipedia.from_api("Whistling", function(s){console.log(wtf_wikipedia.parse(s))})//disambig
// wtf_wikipedia.from_api("Toronto", function(s){console.log(wtf_wikipedia.parse(s).data.infobox.leader_name)})//disambig
// wtf_wikipedia.from_api("Athens", function(s){  console.log(wtf_wikipedia.parse(s)) })//disambig

// function from_file(page){
//   fs=require("fs")
//   var str = fs.readFileSync(__dirname+"/tests/"+page+".txt", 'utf-8')
//   // console.log(wtf_wikipedia.plaintext(str))
//   var data=wtf_wikipedia.parse(str)
//   console.log(JSON.stringify(data, null, 2));
// }

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
