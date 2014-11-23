

//find all the pairs of '[[...[[..]]...]]' in the text
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


fs=require("fs")
var str = fs.readFileSync(__dirname+"/tests/toronto.txt", 'utf-8')
// str="Toronto is also host to a wide variety of organizations.\n"+
// "[[File:Lakeshore West GO Train Westbound.jpg|thumb|A [[GO Train]] along the [[Lakeshore West line]] at [[Sunnyside, Toronto|Sunnyside]] in Toronto.]]\n"+
// "[[File:International airport toronto pearson.jpg|thumb|[[Toronto Pearson International Airport]]]]"+
// "[[File:Gardiner Expressway Downtown Toronto.jpg|thumb|The [[Gardiner Expressway]] in downtown Toronto]]"+
// "Toronto's transport forms the hub of the road, rail and air networks in the [[Greater Toronto Area]] and much of southern [[Ontario]]. There are many forms of [[transport]] in the city of Toronto, including [[400-series highways|highway]]s and [[public transit in Toronto|public transit]]. Toronto also has an extensive [[Cycling in Toronto|network of bicycle lanes]] and multi-use trails and paths."

// str="[[File:hello[[Toronto]]]]"

// {{ templates
matches=recursive_matches( '{', '}', str)
matches.forEach(function(s){
  if(s.match(/\{\{(cite|infobox|sister|geographic|navboxes)[ \|:]/i)){
    // console.log(s)
    str=str.replace(s,'')
  }
})

// [[ templates
matches=recursive_matches( '[', ']', str)
matches.forEach(function(s){
  if(s.match(/\[\[(file|Category|image)/i)){
    // console.log(s)
    str=str.replace(s,'')
  }
})
console.log("======")

console.log(str)
