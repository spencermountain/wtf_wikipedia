

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
    if(chars[i]==closer && chars[i+1] && chars[i+1]==closer){
      open-=1
    }
    if(open>0){
      last.push(chars[i])
    }
    if(open<=0 && last.length>0){
      last.push(closer+closer)
      out.push(last.join(''))
      last=[]
    }
  }
  return out
}


fs=require("fs")
var str = fs.readFileSync(__dirname+"/tests/toronto.txt", 'utf-8')

//some {{templates are recursive
infobox=""
matches=recursive_matches( '{', '}', str)
matches.forEach(function(s){
  if(s.match(/\{\{infobox /i)){
    infobox=s
  }
  str=str.replace(s,'')
})

//[[ templates are recursive
matches=recursive_matches( '[', ']', str)
matches.forEach(function(s){
  if(s.match(/\[\[(file|Category):/i)){
    str=str.replace(s,'')
  }
})

// console.log(str)
