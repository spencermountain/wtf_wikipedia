//split text into sentences, using regex
//@spencermountain MIT

var sentence_parser = function(text) {
  var i;

  // if this looks like a period within a wikipedia link, return false
  var unbalanced = function(str) {
    var open = str.match(/\[\[/) || [];
    var closed = str.match(/\]\]/) || [];
    if (open.length > closed.length) {
      return true
    }
    //make sure quotes are closed too
    var quotes = str.match(/"/g);
    if (quotes && (quotes.length % 2) !== 0 && str.length < 900) {
      return true
    }
    return false
  };

  // first, do a greedy split
  var tmp = text.split(/(\S.+?[.\?])(?=\s+|$|")/g);
  var sentences = [];
  var abbrevs = ["jr", "mr", "mrs", "ms", "dr", "prof", "sr", "sen", "corp", "calif", "rep", "gov", "atty", "supt", "det", "rev", "col", "gen", "lt", "cmdr", "adm", "capt", "sgt", "cpl", "maj", "dept", "univ", "assn", "bros", "inc", "ltd", "co", "corp", "arc", "al", "ave", "blvd", "cl", "ct", "cres", "exp", "rd", "st", "dist", "mt", "ft", "fy", "hwy", "la", "pd", "pl", "plz", "tce", "Ala", "Ariz", "Ark", "Cal", "Calif", "Col", "Colo", "Conn", "Del", "Fed", "Fla", "Ga", "Ida", "Id", "Ill", "Ind", "Ia", "Kan", "Kans", "Ken", "Ky", "La", "Me", "Md", "Mass", "Mich", "Minn", "Miss", "Mo", "Mont", "Neb", "Nebr", "Nev", "Mex", "Okla", "Ok", "Ore", "Penna", "Penn", "Pa", "Dak", "Tenn", "Tex", "Ut", "Vt", "Va", "Wash", "Wis", "Wisc", "Wy", "Wyo", "USAFA", "Alta", "Ont", "QuÔøΩ", "Sask", "Yuk", "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "sept", "vs", "etc", "esp", "llb", "md", "bl", "phd", "ma", "ba", "miss", "misses", "mister", "sir", "esq", "mstr", "lit", "fl", "ex", "eg", "sep", "sept", ".."];
  var abbrev = new RegExp("(^| )(" + abbrevs.join("|") + ")[.] ?$", "i");
  //loop through and evaluate greedy splits
  var l = tmp.length;
  for (i = 0; i < l; i++) {
    if (tmp[i]) {
      tmp[i] = tmp[i].replace(/^\s+|\s+$/g, "");
      //if this does not look like a good sentence, prepend to next one
      if (tmp[i + 1] !== undefined && tmp[i].match(abbrev) || tmp[i].match(/[ |\.][A-Z]\.?$/i) || unbalanced(tmp[i])) {
        tmp[i + 1] = tmp[i] + " " + tmp[i + 1];
      } else {
        sentences.push(tmp[i]);
        tmp[i] = "";
      }
    }
  }
  //post-process the text
  var clean = [];
  for (i = 0; i < sentences.length; i++) {
    //trim whitespace
    sentences[i] = sentences[i].replace(/^\s+|\s+$/g, "");
    sentences[i] = sentences[i].replace(/ {2}/g, " ");
    if (sentences[i]) {
      clean.push(sentences[i]);
    }
  }
  // if there's no proper sentence, just return [text]
  if (clean.length === 0) {
    return [text]
  }
  return clean;
};
module.exports = sentence_parser;
// console.log(sentence_parser('Tony is nice. He lives in Japan.').length === 2)
// console.log(sentence_parser('I like that Color').length === 1)
// console.log(sentence_parser("Soviet bonds to be sold in the U.S. market. Everyone wins.").length === 2)
// console.log(sentence_parser("Hi there Dr. Joe, the price is 4.59 for N.A.S.A. Ph.Ds. I hope that's fine, etc. and you can attend Feb. 8th. Bye").length === 3)
// console.log(sentence_parser("Mount Sinai Hospital, [[St. Michaels Hospital (Toronto)|St. Michaels Hospital]], North York").length === 1)
// console.log(sentence_parser("he said ... oh yeah. I did").length === 2)
// console.log(sentence_parser("32 C").length === 1)
// console.log(sentence_parser("32 C"))

//morgan freeman
// console.log(sentence_parser("a staged reenactment of [[Perry v. Brown]] world"))
