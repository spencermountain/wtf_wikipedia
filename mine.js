//turns wikimedia script into json
//@spencermountain
var parser=(function(){

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

    function fetch_links(str){
      var o={links:[], categories:[], images:[]}
      //fetch links
      var tmp=str.match(/\[\[(.*?)\]\](\w*)/g)//regular links
        if(tmp){
            tmp.forEach(function(s){
                s=s.replace(/\[\[(.*?)\]\](\w*)/g,"$1")
                s=s.replace(/(.*)\|.*/,"$1")//replaced links
                if(s.match(/^category:/i)){
                    o.categories.push(s)
                    return
                }
                if(s.match(/^image:/i)){
                    o.images.push(s)
                    return
                }
                if(s.match(/^image:/i)){
                    return
                }
                o.links.push(s)
            })
        }
        return o
    }

    function trim_whitespace(str){
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function reconcile_links(line){
        // categories, images, files
        line=line.replace(/\[\[\]\](\w*)/g, "$1$2")
        var re= /\[\[Category:[^\[\]]*\]\]/g
        line=line.replace(re, "")

        // [[Common links]]
        line=line.replace(/\[\[([^|]*?)\]\](\w*)/g, "$1$2")
        // [[Replaced|Links]]
        line=line.replace(/\[\[(.*?)\|([^\]]+?)\]\](\w*)/g, "$2$3")
        // External links
        line=line.replace(/\[(https?|news|ftp|mailto|gopher|irc):(\/*)([^\]]*?) (.*?)\]/g, "$4")
        line=line.replace(/\[http:\/\/(.*?)\]/g, "")
        line=line.replace(/\[(news|ftp|mailto|gopher|irc):(\/*)(.*?)\]/g, "")
        line=line.replace(/(^| )(https?|news|ftp|mailto|gopher|irc):(\/*)([^ $]*)/g, "$1")
        return line
    }

    function fetch_infobox(str){
        var obj={}
        var str= str.match(/\{\{Infobox [\s\S]*?\}\}/i)[0]
        str.replace(/\r/g,'').split(/\n/).forEach(function(l){
            if(l.match(/^\|/)){
                var key= trim_whitespace(l.match(/^\| ?([^ ]*) /)[1])
                var value= trim_whitespace(l.match(/=(.*)$/)[1])
                if(key && value){
                  obj[key]=value
              }
            }
        })
        return obj
    }

    function preprocess(wiki){
      //remove all recursive template stuff
      var re= /\{\{[^\{\}]*\}\}/g
      wiki= recursive_replace(wiki, re)

      // images & files can be recursive too (but not categories)
      // var re= /\[\[(File:|Image:)[^\[\]]*?\]\]/gi  //NOT WORKING. FUCK
      // wiki= recursive_replace(wiki, re)

      //remove tables
      wiki= wiki.replace(/\{\|[\s\S]*?\|\}/g,'')
      //remove comments
      wiki= wiki.replace(/<!--[^>]*-->/g,'')
      wiki=wiki.replace('__NOTOC__','')
      wiki=wiki.replace('__NOEDITSECTION__','')
      //bold/italics
      wiki=wiki.replace(/''*([^']*)''*/g,'$1')
      //references
      wiki=wiki.replace(/< ?ref[ >][\s\S]*?<\/ ?ref ?>/g, " ")
      wiki=wiki.replace(/< ?ref [\s\S]*?\/ ?>/g, " ")

      return wiki
    }

    var parser=function(wiki){

      //get and parse an infobox
      var infobox=fetch_infobox(wiki)
      //kill off th3 craziness
      wiki=preprocess(wiki)
      //get list of links, categories
      var data=fetch_links(wiki)
      var lines= wiki.replace(/\r/g,'').split(/\n/)

      var output={}
      var section="intro"
      lines.forEach(function(line){
        if(!section){
            return
        }
        //list
        if(line.match(/^[\*#:\|]/)){
            return
        }
        //headings
        if(line.match(/^=*[^=]*=/)){
            section=line.match(/^=*([^=]*?)=/)[1] || ''
            //ban some sections
            if(section.match(/^(references|see also|external links|further reading)$/i)){
                // section=null
            }
            return
        }
        //fix links
        line= reconcile_links(line)

        //oops, recursive image bug
        if(line.match(/^(thumb|right|left)\|/i)){
            console.log('---')
            return
        }

        line=trim_whitespace(line)

        //still alive, add it to the section
        if(line){
            if(!output[section]){
                output[section]=[]
            }
            output[section].push(line)
        }
      })
      // return output
      return {
        text:output,
        data:data,
        infobox:infobox
      }

    }

    if (typeof module !== 'undefined' && module.exports) {
    module.exports = parser;
    }


    return parser
})()




// str="Germany.<ref>\nhttps://www.christianaction.org/civicrm/contribute/transact?reset=1&id=22, Accessed September 3, 2011.</ref> fun"
// str="hello [[Image:Toronto Star Building.JPG|right|thumb|250px|[[One Yonge Street]] – Current head office, built in 1970]] world"
// str="hi {{Infobox person\n|name = Royal Cinema\n}} world"
// console.log(parser(str))