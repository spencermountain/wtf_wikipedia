/*! wtf_wikipedia 
 by @spencermountain
 2015-07-24 MIT */
// wikipedia special terms lifted and augmented from parsoid parser april 2015
// (not even close to being complete)
var i18n={
  "files": [
    "файл",
    "fitxer",
    "soubor",
    "datei",
    "file",
    "archivo",
    "پرونده",
    "tiedosto",
    "mynd",
    "su'wret",
    "fichier",
    "bestand",
    "датотека",
    "dosya"
  ],
  "templates": [
    "шаблён",
    "plantilla",
    "šablona",
    "vorlage",
    "template",
    "الگو",
    "malline",
    "snið",
    "shablon",
    "modèle",
    "sjabloon",
    "шаблон",
    "şablon"
  ],
  "categories": [
    "катэгорыя",
    "categoria",
    "kategorie",
    "category",
    "categoría",
    "رده",
    "luokka",
    "flokkur",
    "kategoriya",
    "catégorie",
    "categorie",
    "категорија",
    "kategori",
    "kategoria",
    "تصنيف"
  ],
  "redirects": [
    "перанакіраваньне",
    "redirect",
    "přesměruj",
    "weiterleitung",
    "redirección",
    "redireccion",
    "تغییر_مسیر",
    "تغییرمسیر",
    "ohjaus",
    "uudelleenohjaus",
    "tilvísun",
    "aýdaw",
    "айдау",
    "redirection",
    "doorverwijzing",
    "преусмери",
    "преусмјери",
    "yönlendi̇rme",
    "yönlendi̇r",
    "重定向",
    "redirección",
    "redireccion",
    "重定向",
    "yönlendirm?e?",
    "تغییر_مسیر",
    "تغییرمسیر",
    "перанакіраваньне",
    "yönlendirme"
  ],
  "specials": [
    "спэцыяльныя",
    "especial",
    "speciální",
    "spezial",
    "special",
    "ویژه",
    "toiminnot",
    "kerfissíða",
    "arnawlı",
    "spécial",
    "speciaal",
    "посебно",
    "özel"
  ],
  "users": [
    "удзельнік",
    "usuari",
    "uživatel",
    "benutzer",
    "user",
    "usuario",
    "کاربر",
    "käyttäjä",
    "notandi",
    "paydalanıwshı",
    "utilisateur",
    "gebruiker",
    "корисник",
    "kullanıcı"
  ],
  "disambigs":[
      "disambig",//en
      "disambiguation",//en
      "dab",//en
      "disamb",//en
      "begriffsklärung",//de
      "ujednoznacznienie",//pl
      "doorverwijspagina",//nl
      "消歧义",//zh
      "desambiguación",//es
      "dubbelsinnig",//af
      "disambigua",//it
      "desambiguação",//pt
      "homonymie",//fr
      "неоднозначность",//ru
      "anlam ayrımı",//tr
  ],
  "infoboxes":[
      "infobox",
      "ficha",
      "канадский",
      "inligtingskas",
      "inligtingskas3",//af
      "لغة",
      "bilgi kutusu",//tr
      "yerleşim bilgi kutusu"
    ],
  "sources":[//blacklist these headings, as they're not plain-text
    "references",
    "see also",
    "external links",
    "further reading",
    "notes et références",
    "voir aussi",
    "liens externes"
  ]
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports=i18n
}

//split text into sentences, using regex
//@spencermountain MIT

var sentence_parser = function (text) {
  var i;

  // if this looks like a period within a wikipedia link, return false
  var unbalanced = function (str) {
    var open = str.match(/\[\[/) || []
    var closed = str.match(/\]\]/) || []
    if(open.length > closed.length) {
      return true
    }
    //make sure quotes are closed too
    var quotes = str.match(/"/g)
    if(quotes && (quotes.length % 2) !== 0 && str.length < 900) {
      return true
    }
    return false
  }

  // first, do a greedy split
  var tmp = text.split(/(\S.+?[.\?])(?=\s+|$|")/g);
  var sentences = [];
  var abbrevs = ["jr", "mr", "mrs", "ms", "dr", "prof", "sr", "sen", "corp", "calif", "rep", "gov", "atty", "supt", "det", "rev", "col", "gen", "lt", "cmdr", "adm", "capt", "sgt", "cpl", "maj", "dept", "univ", "assn", "bros", "inc", "ltd", "co", "corp", "arc", "al", "ave", "blvd", "cl", "ct", "cres", "exp", "rd", "st", "dist", "mt", "ft", "fy", "hwy", "la", "pd", "pl", "plz", "tce", "Ala", "Ariz", "Ark", "Cal", "Calif", "Col", "Colo", "Conn", "Del", "Fed", "Fla", "Ga", "Ida", "Id", "Ill", "Ind", "Ia", "Kan", "Kans", "Ken", "Ky", "La", "Me", "Md", "Mass", "Mich", "Minn", "Miss", "Mo", "Mont", "Neb", "Nebr", "Nev", "Mex", "Okla", "Ok", "Ore", "Penna", "Penn", "Pa", "Dak", "Tenn", "Tex", "Ut", "Vt", "Va", "Wash", "Wis", "Wisc", "Wy", "Wyo", "USAFA", "Alta", "Ont", "QuÔøΩ", "Sask", "Yuk", "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "sept", "vs", "etc", "esp", "llb", "md", "bl", "phd", "ma", "ba", "miss", "misses", "mister", "sir", "esq", "mstr", "lit", "fl", "ex", "eg", "sep", "sept", ".."];
  var abbrev = new RegExp("(^| )(" + abbrevs.join("|") + ")[.] ?$", "i");
  //loop through and evaluate greedy splits
  for(i = 0; i < tmp.length; i++) {
    if(tmp[i]) {
      tmp[i] = tmp[i].replace(/^\s+|\s+$/g, "");
      //if this does not look like a good sentence, prepend to next one
      if(tmp[i].match(abbrev) || tmp[i].match(/[ |\.][A-Z]\.?$/i) || unbalanced(tmp[i])) {
        tmp[parseInt(i, 10) + 1] = tmp[i] + " " + tmp[parseInt(i, 10) + 1];
      } else {
        sentences.push(tmp[i]);
        tmp[i] = "";
      }
    }
  }
  //post-process the text
  var clean = [];
  for(i = 0; i < sentences.length; i++) {
    //trim whitespace
    sentences[i] = sentences[i].replace(/^\s+|\s+$/g, "");
    sentences[i] = sentences[i].replace(/ {2}/g, " ");
    if(sentences[i]) {
      clean.push(sentences[i]);
    }
  }
  // if there's no proper sentence, just return [text]
  if(clean.length === 0) {
    return [text]
  }
  return clean;
}
if(typeof module !== "undefined" && module.exports) {
  module.exports = sentence_parser;
}
console.log(sentence_parser('Tony is nice. He lives in Japan.').length === 2)
console.log(sentence_parser('I like that Color').length === 1)
console.log(sentence_parser("Soviet bonds to be sold in the U.S. market. Everyone wins.").length === 2)
console.log(sentence_parser("Hi there Dr. Joe, the price is 4.59 for N.A.S.A. Ph.Ds. I hope that's fine, etc. and you can attend Feb. 8th. Bye").length === 3)
console.log(sentence_parser("Mount Sinai Hospital, [[St. Michaels Hospital (Toronto)|St. Michaels Hospital]], North York").length === 1)
console.log(sentence_parser("he said ... oh yeah. I did").length === 2)

//morgan freeman
// console.log(sentence_parser("a staged reenactment of [[Perry v. Brown]] world"))
// console.log(sentence_parser("This language allowed people (e.g. shepherds) to communicate"))

//from https://en.wikipedia.org/w/api.php?action=sitematrix&format=json
var site_map={
  "aawiki": "http://aa.wikipedia.org",
  "aawiktionary": "http://aa.wiktionary.org",
  "aawikibooks": "http://aa.wikibooks.org",
  "abwiki": "http://ab.wikipedia.org",
  "abwiktionary": "http://ab.wiktionary.org",
  "acewiki": "http://ace.wikipedia.org",
  "afwiki": "http://af.wikipedia.org",
  "afwiktionary": "http://af.wiktionary.org",
  "afwikibooks": "http://af.wikibooks.org",
  "afwikiquote": "http://af.wikiquote.org",
  "akwiki": "http://ak.wikipedia.org",
  "akwiktionary": "http://ak.wiktionary.org",
  "akwikibooks": "http://ak.wikibooks.org",
  "alswiki": "http://als.wikipedia.org",
  "alswiktionary": "http://als.wiktionary.org",
  "alswikibooks": "http://als.wikibooks.org",
  "alswikiquote": "http://als.wikiquote.org",
  "amwiki": "http://am.wikipedia.org",
  "amwiktionary": "http://am.wiktionary.org",
  "amwikiquote": "http://am.wikiquote.org",
  "anwiki": "http://an.wikipedia.org",
  "anwiktionary": "http://an.wiktionary.org",
  "angwiki": "http://ang.wikipedia.org",
  "angwiktionary": "http://ang.wiktionary.org",
  "angwikibooks": "http://ang.wikibooks.org",
  "angwikiquote": "http://ang.wikiquote.org",
  "angwikisource": "http://ang.wikisource.org",
  "arwiki": "http://ar.wikipedia.org",
  "arwiktionary": "http://ar.wiktionary.org",
  "arwikibooks": "http://ar.wikibooks.org",
  "arwikinews": "http://ar.wikinews.org",
  "arwikiquote": "http://ar.wikiquote.org",
  "arwikisource": "http://ar.wikisource.org",
  "arwikiversity": "http://ar.wikiversity.org",
  "arcwiki": "http://arc.wikipedia.org",
  "arzwiki": "http://arz.wikipedia.org",
  "aswiki": "http://as.wikipedia.org",
  "aswiktionary": "http://as.wiktionary.org",
  "aswikibooks": "http://as.wikibooks.org",
  "aswikisource": "http://as.wikisource.org",
  "astwiki": "http://ast.wikipedia.org",
  "astwiktionary": "http://ast.wiktionary.org",
  "astwikibooks": "http://ast.wikibooks.org",
  "astwikiquote": "http://ast.wikiquote.org",
  "avwiki": "http://av.wikipedia.org",
  "avwiktionary": "http://av.wiktionary.org",
  "aywiki": "http://ay.wikipedia.org",
  "aywiktionary": "http://ay.wiktionary.org",
  "aywikibooks": "http://ay.wikibooks.org",
  "azwiki": "http://az.wikipedia.org",
  "azwiktionary": "http://az.wiktionary.org",
  "azwikibooks": "http://az.wikibooks.org",
  "azwikiquote": "http://az.wikiquote.org",
  "azwikisource": "http://az.wikisource.org",
  "bawiki": "http://ba.wikipedia.org",
  "bawikibooks": "http://ba.wikibooks.org",
  "barwiki": "http://bar.wikipedia.org",
  "bat_smgwiki": "http://bat-smg.wikipedia.org",
  "bclwiki": "http://bcl.wikipedia.org",
  "bewiki": "http://be.wikipedia.org",
  "bewiktionary": "http://be.wiktionary.org",
  "bewikibooks": "http://be.wikibooks.org",
  "bewikiquote": "http://be.wikiquote.org",
  "bewikisource": "http://be.wikisource.org",
  "be_x_oldwiki": "http://be-x-old.wikipedia.org",
  "bgwiki": "http://bg.wikipedia.org",
  "bgwiktionary": "http://bg.wiktionary.org",
  "bgwikibooks": "http://bg.wikibooks.org",
  "bgwikinews": "http://bg.wikinews.org",
  "bgwikiquote": "http://bg.wikiquote.org",
  "bgwikisource": "http://bg.wikisource.org",
  "bhwiki": "http://bh.wikipedia.org",
  "bhwiktionary": "http://bh.wiktionary.org",
  "biwiki": "http://bi.wikipedia.org",
  "biwiktionary": "http://bi.wiktionary.org",
  "biwikibooks": "http://bi.wikibooks.org",
  "bjnwiki": "http://bjn.wikipedia.org",
  "bmwiki": "http://bm.wikipedia.org",
  "bmwiktionary": "http://bm.wiktionary.org",
  "bmwikibooks": "http://bm.wikibooks.org",
  "bmwikiquote": "http://bm.wikiquote.org",
  "bnwiki": "http://bn.wikipedia.org",
  "bnwiktionary": "http://bn.wiktionary.org",
  "bnwikibooks": "http://bn.wikibooks.org",
  "bnwikisource": "http://bn.wikisource.org",
  "bowiki": "http://bo.wikipedia.org",
  "bowiktionary": "http://bo.wiktionary.org",
  "bowikibooks": "http://bo.wikibooks.org",
  "bpywiki": "http://bpy.wikipedia.org",
  "brwiki": "http://br.wikipedia.org",
  "brwiktionary": "http://br.wiktionary.org",
  "brwikiquote": "http://br.wikiquote.org",
  "brwikisource": "http://br.wikisource.org",
  "bswiki": "http://bs.wikipedia.org",
  "bswiktionary": "http://bs.wiktionary.org",
  "bswikibooks": "http://bs.wikibooks.org",
  "bswikinews": "http://bs.wikinews.org",
  "bswikiquote": "http://bs.wikiquote.org",
  "bswikisource": "http://bs.wikisource.org",
  "bugwiki": "http://bug.wikipedia.org",
  "bxrwiki": "http://bxr.wikipedia.org",
  "cawiki": "http://ca.wikipedia.org",
  "cawiktionary": "http://ca.wiktionary.org",
  "cawikibooks": "http://ca.wikibooks.org",
  "cawikinews": "http://ca.wikinews.org",
  "cawikiquote": "http://ca.wikiquote.org",
  "cawikisource": "http://ca.wikisource.org",
  "cbk_zamwiki": "http://cbk-zam.wikipedia.org",
  "cdowiki": "http://cdo.wikipedia.org",
  "cewiki": "http://ce.wikipedia.org",
  "cebwiki": "http://ceb.wikipedia.org",
  "chwiki": "http://ch.wikipedia.org",
  "chwiktionary": "http://ch.wiktionary.org",
  "chwikibooks": "http://ch.wikibooks.org",
  "chowiki": "http://cho.wikipedia.org",
  "chrwiki": "http://chr.wikipedia.org",
  "chrwiktionary": "http://chr.wiktionary.org",
  "chywiki": "http://chy.wikipedia.org",
  "ckbwiki": "http://ckb.wikipedia.org",
  "cowiki": "http://co.wikipedia.org",
  "cowiktionary": "http://co.wiktionary.org",
  "cowikibooks": "http://co.wikibooks.org",
  "cowikiquote": "http://co.wikiquote.org",
  "crwiki": "http://cr.wikipedia.org",
  "crwiktionary": "http://cr.wiktionary.org",
  "crwikiquote": "http://cr.wikiquote.org",
  "crhwiki": "http://crh.wikipedia.org",
  "cswiki": "http://cs.wikipedia.org",
  "cswiktionary": "http://cs.wiktionary.org",
  "cswikibooks": "http://cs.wikibooks.org",
  "cswikinews": "http://cs.wikinews.org",
  "cswikiquote": "http://cs.wikiquote.org",
  "cswikisource": "http://cs.wikisource.org",
  "cswikiversity": "http://cs.wikiversity.org",
  "csbwiki": "http://csb.wikipedia.org",
  "csbwiktionary": "http://csb.wiktionary.org",
  "cuwiki": "http://cu.wikipedia.org",
  "cvwiki": "http://cv.wikipedia.org",
  "cvwikibooks": "http://cv.wikibooks.org",
  "cywiki": "http://cy.wikipedia.org",
  "cywiktionary": "http://cy.wiktionary.org",
  "cywikibooks": "http://cy.wikibooks.org",
  "cywikiquote": "http://cy.wikiquote.org",
  "cywikisource": "http://cy.wikisource.org",
  "dawiki": "http://da.wikipedia.org",
  "dawiktionary": "http://da.wiktionary.org",
  "dawikibooks": "http://da.wikibooks.org",
  "dawikiquote": "http://da.wikiquote.org",
  "dawikisource": "http://da.wikisource.org",
  "dewiki": "http://de.wikipedia.org",
  "dewiktionary": "http://de.wiktionary.org",
  "dewikibooks": "http://de.wikibooks.org",
  "dewikinews": "http://de.wikinews.org",
  "dewikiquote": "http://de.wikiquote.org",
  "dewikisource": "http://de.wikisource.org",
  "dewikiversity": "http://de.wikiversity.org",
  "dewikivoyage": "http://de.wikivoyage.org",
  "diqwiki": "http://diq.wikipedia.org",
  "dsbwiki": "http://dsb.wikipedia.org",
  "dvwiki": "http://dv.wikipedia.org",
  "dvwiktionary": "http://dv.wiktionary.org",
  "dzwiki": "http://dz.wikipedia.org",
  "dzwiktionary": "http://dz.wiktionary.org",
  "eewiki": "http://ee.wikipedia.org",
  "elwiki": "http://el.wikipedia.org",
  "elwiktionary": "http://el.wiktionary.org",
  "elwikibooks": "http://el.wikibooks.org",
  "elwikinews": "http://el.wikinews.org",
  "elwikiquote": "http://el.wikiquote.org",
  "elwikisource": "http://el.wikisource.org",
  "elwikiversity": "http://el.wikiversity.org",
  "elwikivoyage": "http://el.wikivoyage.org",
  "emlwiki": "http://eml.wikipedia.org",
  "enwiki": "http://en.wikipedia.org",
  "enwiktionary": "http://en.wiktionary.org",
  "enwikibooks": "http://en.wikibooks.org",
  "enwikinews": "http://en.wikinews.org",
  "enwikiquote": "http://en.wikiquote.org",
  "enwikisource": "http://en.wikisource.org",
  "enwikiversity": "http://en.wikiversity.org",
  "enwikivoyage": "http://en.wikivoyage.org",
  "eowiki": "http://eo.wikipedia.org",
  "eowiktionary": "http://eo.wiktionary.org",
  "eowikibooks": "http://eo.wikibooks.org",
  "eowikinews": "http://eo.wikinews.org",
  "eowikiquote": "http://eo.wikiquote.org",
  "eowikisource": "http://eo.wikisource.org",
  "eswiki": "http://es.wikipedia.org",
  "eswiktionary": "http://es.wiktionary.org",
  "eswikibooks": "http://es.wikibooks.org",
  "eswikinews": "http://es.wikinews.org",
  "eswikiquote": "http://es.wikiquote.org",
  "eswikisource": "http://es.wikisource.org",
  "eswikiversity": "http://es.wikiversity.org",
  "eswikivoyage": "http://es.wikivoyage.org",
  "etwiki": "http://et.wikipedia.org",
  "etwiktionary": "http://et.wiktionary.org",
  "etwikibooks": "http://et.wikibooks.org",
  "etwikiquote": "http://et.wikiquote.org",
  "etwikisource": "http://et.wikisource.org",
  "euwiki": "http://eu.wikipedia.org",
  "euwiktionary": "http://eu.wiktionary.org",
  "euwikibooks": "http://eu.wikibooks.org",
  "euwikiquote": "http://eu.wikiquote.org",
  "extwiki": "http://ext.wikipedia.org",
  "fawiki": "http://fa.wikipedia.org",
  "fawiktionary": "http://fa.wiktionary.org",
  "fawikibooks": "http://fa.wikibooks.org",
  "fawikinews": "http://fa.wikinews.org",
  "fawikiquote": "http://fa.wikiquote.org",
  "fawikisource": "http://fa.wikisource.org",
  "fawikivoyage": "http://fa.wikivoyage.org",
  "ffwiki": "http://ff.wikipedia.org",
  "fiwiki": "http://fi.wikipedia.org",
  "fiwiktionary": "http://fi.wiktionary.org",
  "fiwikibooks": "http://fi.wikibooks.org",
  "fiwikinews": "http://fi.wikinews.org",
  "fiwikiquote": "http://fi.wikiquote.org",
  "fiwikisource": "http://fi.wikisource.org",
  "fiwikiversity": "http://fi.wikiversity.org",
  "fiu_vrowiki": "http://fiu-vro.wikipedia.org",
  "fjwiki": "http://fj.wikipedia.org",
  "fjwiktionary": "http://fj.wiktionary.org",
  "fowiki": "http://fo.wikipedia.org",
  "fowiktionary": "http://fo.wiktionary.org",
  "fowikisource": "http://fo.wikisource.org",
  "frwiki": "http://fr.wikipedia.org",
  "frwiktionary": "http://fr.wiktionary.org",
  "frwikibooks": "http://fr.wikibooks.org",
  "frwikinews": "http://fr.wikinews.org",
  "frwikiquote": "http://fr.wikiquote.org",
  "frwikisource": "http://fr.wikisource.org",
  "frwikiversity": "http://fr.wikiversity.org",
  "frwikivoyage": "http://fr.wikivoyage.org",
  "frpwiki": "http://frp.wikipedia.org",
  "frrwiki": "http://frr.wikipedia.org",
  "furwiki": "http://fur.wikipedia.org",
  "fywiki": "http://fy.wikipedia.org",
  "fywiktionary": "http://fy.wiktionary.org",
  "fywikibooks": "http://fy.wikibooks.org",
  "gawiki": "http://ga.wikipedia.org",
  "gawiktionary": "http://ga.wiktionary.org",
  "gawikibooks": "http://ga.wikibooks.org",
  "gawikiquote": "http://ga.wikiquote.org",
  "gagwiki": "http://gag.wikipedia.org",
  "ganwiki": "http://gan.wikipedia.org",
  "gdwiki": "http://gd.wikipedia.org",
  "gdwiktionary": "http://gd.wiktionary.org",
  "glwiki": "http://gl.wikipedia.org",
  "glwiktionary": "http://gl.wiktionary.org",
  "glwikibooks": "http://gl.wikibooks.org",
  "glwikiquote": "http://gl.wikiquote.org",
  "glwikisource": "http://gl.wikisource.org",
  "glkwiki": "http://glk.wikipedia.org",
  "gnwiki": "http://gn.wikipedia.org",
  "gnwiktionary": "http://gn.wiktionary.org",
  "gnwikibooks": "http://gn.wikibooks.org",
  "gotwiki": "http://got.wikipedia.org",
  "gotwikibooks": "http://got.wikibooks.org",
  "guwiki": "http://gu.wikipedia.org",
  "guwiktionary": "http://gu.wiktionary.org",
  "guwikibooks": "http://gu.wikibooks.org",
  "guwikiquote": "http://gu.wikiquote.org",
  "guwikisource": "http://gu.wikisource.org",
  "gvwiki": "http://gv.wikipedia.org",
  "gvwiktionary": "http://gv.wiktionary.org",
  "hawiki": "http://ha.wikipedia.org",
  "hawiktionary": "http://ha.wiktionary.org",
  "hakwiki": "http://hak.wikipedia.org",
  "hawwiki": "http://haw.wikipedia.org",
  "hewiki": "http://he.wikipedia.org",
  "hewiktionary": "http://he.wiktionary.org",
  "hewikibooks": "http://he.wikibooks.org",
  "hewikinews": "http://he.wikinews.org",
  "hewikiquote": "http://he.wikiquote.org",
  "hewikisource": "http://he.wikisource.org",
  "hewikivoyage": "http://he.wikivoyage.org",
  "hiwiki": "http://hi.wikipedia.org",
  "hiwiktionary": "http://hi.wiktionary.org",
  "hiwikibooks": "http://hi.wikibooks.org",
  "hiwikiquote": "http://hi.wikiquote.org",
  "hifwiki": "http://hif.wikipedia.org",
  "howiki": "http://ho.wikipedia.org",
  "hrwiki": "http://hr.wikipedia.org",
  "hrwiktionary": "http://hr.wiktionary.org",
  "hrwikibooks": "http://hr.wikibooks.org",
  "hrwikiquote": "http://hr.wikiquote.org",
  "hrwikisource": "http://hr.wikisource.org",
  "hsbwiki": "http://hsb.wikipedia.org",
  "hsbwiktionary": "http://hsb.wiktionary.org",
  "htwiki": "http://ht.wikipedia.org",
  "htwikisource": "http://ht.wikisource.org",
  "huwiki": "http://hu.wikipedia.org",
  "huwiktionary": "http://hu.wiktionary.org",
  "huwikibooks": "http://hu.wikibooks.org",
  "huwikinews": "http://hu.wikinews.org",
  "huwikiquote": "http://hu.wikiquote.org",
  "huwikisource": "http://hu.wikisource.org",
  "hywiki": "http://hy.wikipedia.org",
  "hywiktionary": "http://hy.wiktionary.org",
  "hywikibooks": "http://hy.wikibooks.org",
  "hywikiquote": "http://hy.wikiquote.org",
  "hywikisource": "http://hy.wikisource.org",
  "hzwiki": "http://hz.wikipedia.org",
  "iawiki": "http://ia.wikipedia.org",
  "iawiktionary": "http://ia.wiktionary.org",
  "iawikibooks": "http://ia.wikibooks.org",
  "idwiki": "http://id.wikipedia.org",
  "idwiktionary": "http://id.wiktionary.org",
  "idwikibooks": "http://id.wikibooks.org",
  "idwikiquote": "http://id.wikiquote.org",
  "idwikisource": "http://id.wikisource.org",
  "iewiki": "http://ie.wikipedia.org",
  "iewiktionary": "http://ie.wiktionary.org",
  "iewikibooks": "http://ie.wikibooks.org",
  "igwiki": "http://ig.wikipedia.org",
  "iiwiki": "http://ii.wikipedia.org",
  "ikwiki": "http://ik.wikipedia.org",
  "ikwiktionary": "http://ik.wiktionary.org",
  "ilowiki": "http://ilo.wikipedia.org",
  "iowiki": "http://io.wikipedia.org",
  "iowiktionary": "http://io.wiktionary.org",
  "iswiki": "http://is.wikipedia.org",
  "iswiktionary": "http://is.wiktionary.org",
  "iswikibooks": "http://is.wikibooks.org",
  "iswikiquote": "http://is.wikiquote.org",
  "iswikisource": "http://is.wikisource.org",
  "itwiki": "http://it.wikipedia.org",
  "itwiktionary": "http://it.wiktionary.org",
  "itwikibooks": "http://it.wikibooks.org",
  "itwikinews": "http://it.wikinews.org",
  "itwikiquote": "http://it.wikiquote.org",
  "itwikisource": "http://it.wikisource.org",
  "itwikiversity": "http://it.wikiversity.org",
  "itwikivoyage": "http://it.wikivoyage.org",
  "iuwiki": "http://iu.wikipedia.org",
  "iuwiktionary": "http://iu.wiktionary.org",
  "jawiki": "http://ja.wikipedia.org",
  "jawiktionary": "http://ja.wiktionary.org",
  "jawikibooks": "http://ja.wikibooks.org",
  "jawikinews": "http://ja.wikinews.org",
  "jawikiquote": "http://ja.wikiquote.org",
  "jawikisource": "http://ja.wikisource.org",
  "jawikiversity": "http://ja.wikiversity.org",
  "jbowiki": "http://jbo.wikipedia.org",
  "jbowiktionary": "http://jbo.wiktionary.org",
  "jvwiki": "http://jv.wikipedia.org",
  "jvwiktionary": "http://jv.wiktionary.org",
  "kawiki": "http://ka.wikipedia.org",
  "kawiktionary": "http://ka.wiktionary.org",
  "kawikibooks": "http://ka.wikibooks.org",
  "kawikiquote": "http://ka.wikiquote.org",
  "kaawiki": "http://kaa.wikipedia.org",
  "kabwiki": "http://kab.wikipedia.org",
  "kbdwiki": "http://kbd.wikipedia.org",
  "kgwiki": "http://kg.wikipedia.org",
  "kiwiki": "http://ki.wikipedia.org",
  "kjwiki": "http://kj.wikipedia.org",
  "kkwiki": "http://kk.wikipedia.org",
  "kkwiktionary": "http://kk.wiktionary.org",
  "kkwikibooks": "http://kk.wikibooks.org",
  "kkwikiquote": "http://kk.wikiquote.org",
  "klwiki": "http://kl.wikipedia.org",
  "klwiktionary": "http://kl.wiktionary.org",
  "kmwiki": "http://km.wikipedia.org",
  "kmwiktionary": "http://km.wiktionary.org",
  "kmwikibooks": "http://km.wikibooks.org",
  "knwiki": "http://kn.wikipedia.org",
  "knwiktionary": "http://kn.wiktionary.org",
  "knwikibooks": "http://kn.wikibooks.org",
  "knwikiquote": "http://kn.wikiquote.org",
  "knwikisource": "http://kn.wikisource.org",
  "kowiki": "http://ko.wikipedia.org",
  "kowiktionary": "http://ko.wiktionary.org",
  "kowikibooks": "http://ko.wikibooks.org",
  "kowikinews": "http://ko.wikinews.org",
  "kowikiquote": "http://ko.wikiquote.org",
  "kowikisource": "http://ko.wikisource.org",
  "kowikiversity": "http://ko.wikiversity.org",
  "koiwiki": "http://koi.wikipedia.org",
  "krwiki": "http://kr.wikipedia.org",
  "krwikiquote": "http://kr.wikiquote.org",
  "krcwiki": "http://krc.wikipedia.org",
  "kswiki": "http://ks.wikipedia.org",
  "kswiktionary": "http://ks.wiktionary.org",
  "kswikibooks": "http://ks.wikibooks.org",
  "kswikiquote": "http://ks.wikiquote.org",
  "kshwiki": "http://ksh.wikipedia.org",
  "kuwiki": "http://ku.wikipedia.org",
  "kuwiktionary": "http://ku.wiktionary.org",
  "kuwikibooks": "http://ku.wikibooks.org",
  "kuwikiquote": "http://ku.wikiquote.org",
  "kvwiki": "http://kv.wikipedia.org",
  "kwwiki": "http://kw.wikipedia.org",
  "kwwiktionary": "http://kw.wiktionary.org",
  "kwwikiquote": "http://kw.wikiquote.org",
  "kywiki": "http://ky.wikipedia.org",
  "kywiktionary": "http://ky.wiktionary.org",
  "kywikibooks": "http://ky.wikibooks.org",
  "kywikiquote": "http://ky.wikiquote.org",
  "lawiki": "http://la.wikipedia.org",
  "lawiktionary": "http://la.wiktionary.org",
  "lawikibooks": "http://la.wikibooks.org",
  "lawikiquote": "http://la.wikiquote.org",
  "lawikisource": "http://la.wikisource.org",
  "ladwiki": "http://lad.wikipedia.org",
  "lbwiki": "http://lb.wikipedia.org",
  "lbwiktionary": "http://lb.wiktionary.org",
  "lbwikibooks": "http://lb.wikibooks.org",
  "lbwikiquote": "http://lb.wikiquote.org",
  "lbewiki": "http://lbe.wikipedia.org",
  "lezwiki": "http://lez.wikipedia.org",
  "lgwiki": "http://lg.wikipedia.org",
  "liwiki": "http://li.wikipedia.org",
  "liwiktionary": "http://li.wiktionary.org",
  "liwikibooks": "http://li.wikibooks.org",
  "liwikiquote": "http://li.wikiquote.org",
  "liwikisource": "http://li.wikisource.org",
  "lijwiki": "http://lij.wikipedia.org",
  "lmowiki": "http://lmo.wikipedia.org",
  "lnwiki": "http://ln.wikipedia.org",
  "lnwiktionary": "http://ln.wiktionary.org",
  "lnwikibooks": "http://ln.wikibooks.org",
  "lowiki": "http://lo.wikipedia.org",
  "lowiktionary": "http://lo.wiktionary.org",
  "ltwiki": "http://lt.wikipedia.org",
  "ltwiktionary": "http://lt.wiktionary.org",
  "ltwikibooks": "http://lt.wikibooks.org",
  "ltwikiquote": "http://lt.wikiquote.org",
  "ltwikisource": "http://lt.wikisource.org",
  "ltgwiki": "http://ltg.wikipedia.org",
  "lvwiki": "http://lv.wikipedia.org",
  "lvwiktionary": "http://lv.wiktionary.org",
  "lvwikibooks": "http://lv.wikibooks.org",
  "maiwiki": "http://mai.wikipedia.org",
  "map_bmswiki": "http://map-bms.wikipedia.org",
  "mdfwiki": "http://mdf.wikipedia.org",
  "mgwiki": "http://mg.wikipedia.org",
  "mgwiktionary": "http://mg.wiktionary.org",
  "mgwikibooks": "http://mg.wikibooks.org",
  "mhwiki": "http://mh.wikipedia.org",
  "mhwiktionary": "http://mh.wiktionary.org",
  "mhrwiki": "http://mhr.wikipedia.org",
  "miwiki": "http://mi.wikipedia.org",
  "miwiktionary": "http://mi.wiktionary.org",
  "miwikibooks": "http://mi.wikibooks.org",
  "minwiki": "http://min.wikipedia.org",
  "mkwiki": "http://mk.wikipedia.org",
  "mkwiktionary": "http://mk.wiktionary.org",
  "mkwikibooks": "http://mk.wikibooks.org",
  "mkwikisource": "http://mk.wikisource.org",
  "mlwiki": "http://ml.wikipedia.org",
  "mlwiktionary": "http://ml.wiktionary.org",
  "mlwikibooks": "http://ml.wikibooks.org",
  "mlwikiquote": "http://ml.wikiquote.org",
  "mlwikisource": "http://ml.wikisource.org",
  "mnwiki": "http://mn.wikipedia.org",
  "mnwiktionary": "http://mn.wiktionary.org",
  "mnwikibooks": "http://mn.wikibooks.org",
  "mowiki": "http://mo.wikipedia.org",
  "mowiktionary": "http://mo.wiktionary.org",
  "mrwiki": "http://mr.wikipedia.org",
  "mrwiktionary": "http://mr.wiktionary.org",
  "mrwikibooks": "http://mr.wikibooks.org",
  "mrwikiquote": "http://mr.wikiquote.org",
  "mrwikisource": "http://mr.wikisource.org",
  "mrjwiki": "http://mrj.wikipedia.org",
  "mswiki": "http://ms.wikipedia.org",
  "mswiktionary": "http://ms.wiktionary.org",
  "mswikibooks": "http://ms.wikibooks.org",
  "mtwiki": "http://mt.wikipedia.org",
  "mtwiktionary": "http://mt.wiktionary.org",
  "muswiki": "http://mus.wikipedia.org",
  "mwlwiki": "http://mwl.wikipedia.org",
  "mywiki": "http://my.wikipedia.org",
  "mywiktionary": "http://my.wiktionary.org",
  "mywikibooks": "http://my.wikibooks.org",
  "myvwiki": "http://myv.wikipedia.org",
  "mznwiki": "http://mzn.wikipedia.org",
  "nawiki": "http://na.wikipedia.org",
  "nawiktionary": "http://na.wiktionary.org",
  "nawikibooks": "http://na.wikibooks.org",
  "nawikiquote": "http://na.wikiquote.org",
  "nahwiki": "http://nah.wikipedia.org",
  "nahwiktionary": "http://nah.wiktionary.org",
  "nahwikibooks": "http://nah.wikibooks.org",
  "napwiki": "http://nap.wikipedia.org",
  "ndswiki": "http://nds.wikipedia.org",
  "ndswiktionary": "http://nds.wiktionary.org",
  "ndswikibooks": "http://nds.wikibooks.org",
  "ndswikiquote": "http://nds.wikiquote.org",
  "nds_nlwiki": "http://nds-nl.wikipedia.org",
  "newiki": "http://ne.wikipedia.org",
  "newiktionary": "http://ne.wiktionary.org",
  "newikibooks": "http://ne.wikibooks.org",
  "newwiki": "http://new.wikipedia.org",
  "ngwiki": "http://ng.wikipedia.org",
  "nlwiki": "http://nl.wikipedia.org",
  "nlwiktionary": "http://nl.wiktionary.org",
  "nlwikibooks": "http://nl.wikibooks.org",
  "nlwikinews": "http://nl.wikinews.org",
  "nlwikiquote": "http://nl.wikiquote.org",
  "nlwikisource": "http://nl.wikisource.org",
  "nlwikivoyage": "http://nl.wikivoyage.org",
  "nnwiki": "http://nn.wikipedia.org",
  "nnwiktionary": "http://nn.wiktionary.org",
  "nnwikiquote": "http://nn.wikiquote.org",
  "nowiki": "http://no.wikipedia.org",
  "nowiktionary": "http://no.wiktionary.org",
  "nowikibooks": "http://no.wikibooks.org",
  "nowikinews": "http://no.wikinews.org",
  "nowikiquote": "http://no.wikiquote.org",
  "nowikisource": "http://no.wikisource.org",
  "novwiki": "http://nov.wikipedia.org",
  "nrmwiki": "http://nrm.wikipedia.org",
  "nsowiki": "http://nso.wikipedia.org",
  "nvwiki": "http://nv.wikipedia.org",
  "nywiki": "http://ny.wikipedia.org",
  "ocwiki": "http://oc.wikipedia.org",
  "ocwiktionary": "http://oc.wiktionary.org",
  "ocwikibooks": "http://oc.wikibooks.org",
  "omwiki": "http://om.wikipedia.org",
  "omwiktionary": "http://om.wiktionary.org",
  "orwiki": "http://or.wikipedia.org",
  "orwiktionary": "http://or.wiktionary.org",
  "orwikisource": "http://or.wikisource.org",
  "oswiki": "http://os.wikipedia.org",
  "pawiki": "http://pa.wikipedia.org",
  "pawiktionary": "http://pa.wiktionary.org",
  "pawikibooks": "http://pa.wikibooks.org",
  "pagwiki": "http://pag.wikipedia.org",
  "pamwiki": "http://pam.wikipedia.org",
  "papwiki": "http://pap.wikipedia.org",
  "pcdwiki": "http://pcd.wikipedia.org",
  "pdcwiki": "http://pdc.wikipedia.org",
  "pflwiki": "http://pfl.wikipedia.org",
  "piwiki": "http://pi.wikipedia.org",
  "piwiktionary": "http://pi.wiktionary.org",
  "pihwiki": "http://pih.wikipedia.org",
  "plwiki": "http://pl.wikipedia.org",
  "plwiktionary": "http://pl.wiktionary.org",
  "plwikibooks": "http://pl.wikibooks.org",
  "plwikinews": "http://pl.wikinews.org",
  "plwikiquote": "http://pl.wikiquote.org",
  "plwikisource": "http://pl.wikisource.org",
  "plwikivoyage": "http://pl.wikivoyage.org",
  "pmswiki": "http://pms.wikipedia.org",
  "pnbwiki": "http://pnb.wikipedia.org",
  "pnbwiktionary": "http://pnb.wiktionary.org",
  "pntwiki": "http://pnt.wikipedia.org",
  "pswiki": "http://ps.wikipedia.org",
  "pswiktionary": "http://ps.wiktionary.org",
  "pswikibooks": "http://ps.wikibooks.org",
  "ptwiki": "http://pt.wikipedia.org",
  "ptwiktionary": "http://pt.wiktionary.org",
  "ptwikibooks": "http://pt.wikibooks.org",
  "ptwikinews": "http://pt.wikinews.org",
  "ptwikiquote": "http://pt.wikiquote.org",
  "ptwikisource": "http://pt.wikisource.org",
  "ptwikiversity": "http://pt.wikiversity.org",
  "ptwikivoyage": "http://pt.wikivoyage.org",
  "quwiki": "http://qu.wikipedia.org",
  "quwiktionary": "http://qu.wiktionary.org",
  "quwikibooks": "http://qu.wikibooks.org",
  "quwikiquote": "http://qu.wikiquote.org",
  "rmwiki": "http://rm.wikipedia.org",
  "rmwiktionary": "http://rm.wiktionary.org",
  "rmwikibooks": "http://rm.wikibooks.org",
  "rmywiki": "http://rmy.wikipedia.org",
  "rnwiki": "http://rn.wikipedia.org",
  "rnwiktionary": "http://rn.wiktionary.org",
  "rowiki": "http://ro.wikipedia.org",
  "rowiktionary": "http://ro.wiktionary.org",
  "rowikibooks": "http://ro.wikibooks.org",
  "rowikinews": "http://ro.wikinews.org",
  "rowikiquote": "http://ro.wikiquote.org",
  "rowikisource": "http://ro.wikisource.org",
  "rowikivoyage": "http://ro.wikivoyage.org",
  "roa_rupwiki": "http://roa-rup.wikipedia.org",
  "roa_rupwiktionary": "http://roa-rup.wiktionary.org",
  "roa_tarawiki": "http://roa-tara.wikipedia.org",
  "ruwiki": "https://ru.wikipedia.org",
  "ruwiktionary": "https://ru.wiktionary.org",
  "ruwikibooks": "https://ru.wikibooks.org",
  "ruwikinews": "https://ru.wikinews.org",
  "ruwikiquote": "https://ru.wikiquote.org",
  "ruwikisource": "https://ru.wikisource.org",
  "ruwikiversity": "https://ru.wikiversity.org",
  "ruwikivoyage": "https://ru.wikivoyage.org",
  "ruewiki": "http://rue.wikipedia.org",
  "rwwiki": "http://rw.wikipedia.org",
  "rwwiktionary": "http://rw.wiktionary.org",
  "sawiki": "http://sa.wikipedia.org",
  "sawiktionary": "http://sa.wiktionary.org",
  "sawikibooks": "http://sa.wikibooks.org",
  "sawikiquote": "http://sa.wikiquote.org",
  "sawikisource": "http://sa.wikisource.org",
  "sahwiki": "http://sah.wikipedia.org",
  "sahwikisource": "http://sah.wikisource.org",
  "scwiki": "http://sc.wikipedia.org",
  "scwiktionary": "http://sc.wiktionary.org",
  "scnwiki": "http://scn.wikipedia.org",
  "scnwiktionary": "http://scn.wiktionary.org",
  "scowiki": "http://sco.wikipedia.org",
  "sdwiki": "http://sd.wikipedia.org",
  "sdwiktionary": "http://sd.wiktionary.org",
  "sdwikinews": "http://sd.wikinews.org",
  "sewiki": "http://se.wikipedia.org",
  "sewikibooks": "http://se.wikibooks.org",
  "sgwiki": "http://sg.wikipedia.org",
  "sgwiktionary": "http://sg.wiktionary.org",
  "shwiki": "http://sh.wikipedia.org",
  "shwiktionary": "http://sh.wiktionary.org",
  "siwiki": "http://si.wikipedia.org",
  "siwiktionary": "http://si.wiktionary.org",
  "siwikibooks": "http://si.wikibooks.org",
  "simplewiki": "http://simple.wikipedia.org",
  "simplewiktionary": "http://simple.wiktionary.org",
  "simplewikibooks": "http://simple.wikibooks.org",
  "simplewikiquote": "http://simple.wikiquote.org",
  "skwiki": "http://sk.wikipedia.org",
  "skwiktionary": "http://sk.wiktionary.org",
  "skwikibooks": "http://sk.wikibooks.org",
  "skwikiquote": "http://sk.wikiquote.org",
  "skwikisource": "http://sk.wikisource.org",
  "slwiki": "http://sl.wikipedia.org",
  "slwiktionary": "http://sl.wiktionary.org",
  "slwikibooks": "http://sl.wikibooks.org",
  "slwikiquote": "http://sl.wikiquote.org",
  "slwikisource": "http://sl.wikisource.org",
  "slwikiversity": "http://sl.wikiversity.org",
  "smwiki": "http://sm.wikipedia.org",
  "smwiktionary": "http://sm.wiktionary.org",
  "snwiki": "http://sn.wikipedia.org",
  "snwiktionary": "http://sn.wiktionary.org",
  "sowiki": "http://so.wikipedia.org",
  "sowiktionary": "http://so.wiktionary.org",
  "sqwiki": "http://sq.wikipedia.org",
  "sqwiktionary": "http://sq.wiktionary.org",
  "sqwikibooks": "http://sq.wikibooks.org",
  "sqwikinews": "http://sq.wikinews.org",
  "sqwikiquote": "http://sq.wikiquote.org",
  "srwiki": "http://sr.wikipedia.org",
  "srwiktionary": "http://sr.wiktionary.org",
  "srwikibooks": "http://sr.wikibooks.org",
  "srwikinews": "http://sr.wikinews.org",
  "srwikiquote": "http://sr.wikiquote.org",
  "srwikisource": "http://sr.wikisource.org",
  "srnwiki": "http://srn.wikipedia.org",
  "sswiki": "http://ss.wikipedia.org",
  "sswiktionary": "http://ss.wiktionary.org",
  "stwiki": "http://st.wikipedia.org",
  "stwiktionary": "http://st.wiktionary.org",
  "stqwiki": "http://stq.wikipedia.org",
  "suwiki": "http://su.wikipedia.org",
  "suwiktionary": "http://su.wiktionary.org",
  "suwikibooks": "http://su.wikibooks.org",
  "suwikiquote": "http://su.wikiquote.org",
  "svwiki": "http://sv.wikipedia.org",
  "svwiktionary": "http://sv.wiktionary.org",
  "svwikibooks": "http://sv.wikibooks.org",
  "svwikinews": "http://sv.wikinews.org",
  "svwikiquote": "http://sv.wikiquote.org",
  "svwikisource": "http://sv.wikisource.org",
  "svwikiversity": "http://sv.wikiversity.org",
  "svwikivoyage": "http://sv.wikivoyage.org",
  "swwiki": "http://sw.wikipedia.org",
  "swwiktionary": "http://sw.wiktionary.org",
  "swwikibooks": "http://sw.wikibooks.org",
  "szlwiki": "http://szl.wikipedia.org",
  "tawiki": "http://ta.wikipedia.org",
  "tawiktionary": "http://ta.wiktionary.org",
  "tawikibooks": "http://ta.wikibooks.org",
  "tawikinews": "http://ta.wikinews.org",
  "tawikiquote": "http://ta.wikiquote.org",
  "tawikisource": "http://ta.wikisource.org",
  "tewiki": "http://te.wikipedia.org",
  "tewiktionary": "http://te.wiktionary.org",
  "tewikibooks": "http://te.wikibooks.org",
  "tewikiquote": "http://te.wikiquote.org",
  "tewikisource": "http://te.wikisource.org",
  "tetwiki": "http://tet.wikipedia.org",
  "tgwiki": "http://tg.wikipedia.org",
  "tgwiktionary": "http://tg.wiktionary.org",
  "tgwikibooks": "http://tg.wikibooks.org",
  "thwiki": "http://th.wikipedia.org",
  "thwiktionary": "http://th.wiktionary.org",
  "thwikibooks": "http://th.wikibooks.org",
  "thwikinews": "http://th.wikinews.org",
  "thwikiquote": "http://th.wikiquote.org",
  "thwikisource": "http://th.wikisource.org",
  "tiwiki": "http://ti.wikipedia.org",
  "tiwiktionary": "http://ti.wiktionary.org",
  "tkwiki": "http://tk.wikipedia.org",
  "tkwiktionary": "http://tk.wiktionary.org",
  "tkwikibooks": "http://tk.wikibooks.org",
  "tkwikiquote": "http://tk.wikiquote.org",
  "tlwiki": "http://tl.wikipedia.org",
  "tlwiktionary": "http://tl.wiktionary.org",
  "tlwikibooks": "http://tl.wikibooks.org",
  "tnwiki": "http://tn.wikipedia.org",
  "tnwiktionary": "http://tn.wiktionary.org",
  "towiki": "http://to.wikipedia.org",
  "towiktionary": "http://to.wiktionary.org",
  "tpiwiki": "http://tpi.wikipedia.org",
  "tpiwiktionary": "http://tpi.wiktionary.org",
  "trwiki": "http://tr.wikipedia.org",
  "trwiktionary": "http://tr.wiktionary.org",
  "trwikibooks": "http://tr.wikibooks.org",
  "trwikinews": "http://tr.wikinews.org",
  "trwikiquote": "http://tr.wikiquote.org",
  "trwikisource": "http://tr.wikisource.org",
  "tswiki": "http://ts.wikipedia.org",
  "tswiktionary": "http://ts.wiktionary.org",
  "ttwiki": "http://tt.wikipedia.org",
  "ttwiktionary": "http://tt.wiktionary.org",
  "ttwikibooks": "http://tt.wikibooks.org",
  "ttwikiquote": "http://tt.wikiquote.org",
  "tumwiki": "http://tum.wikipedia.org",
  "twwiki": "http://tw.wikipedia.org",
  "twwiktionary": "http://tw.wiktionary.org",
  "tywiki": "http://ty.wikipedia.org",
  "tyvwiki": "http://tyv.wikipedia.org",
  "udmwiki": "http://udm.wikipedia.org",
  "ugwiki": "http://ug.wikipedia.org",
  "ugwiktionary": "http://ug.wiktionary.org",
  "ugwikibooks": "http://ug.wikibooks.org",
  "ugwikiquote": "http://ug.wikiquote.org",
  "ukwiki": "http://uk.wikipedia.org",
  "ukwiktionary": "http://uk.wiktionary.org",
  "ukwikibooks": "http://uk.wikibooks.org",
  "ukwikinews": "http://uk.wikinews.org",
  "ukwikiquote": "http://uk.wikiquote.org",
  "ukwikisource": "http://uk.wikisource.org",
  "ukwikivoyage": "http://uk.wikivoyage.org",
  "urwiki": "http://ur.wikipedia.org",
  "urwiktionary": "http://ur.wiktionary.org",
  "urwikibooks": "http://ur.wikibooks.org",
  "urwikiquote": "http://ur.wikiquote.org",
  "uzwiki": "https://uz.wikipedia.org",
  "uzwiktionary": "http://uz.wiktionary.org",
  "uzwikibooks": "http://uz.wikibooks.org",
  "uzwikiquote": "http://uz.wikiquote.org",
  "vewiki": "http://ve.wikipedia.org",
  "vecwiki": "http://vec.wikipedia.org",
  "vecwiktionary": "http://vec.wiktionary.org",
  "vecwikisource": "http://vec.wikisource.org",
  "vepwiki": "http://vep.wikipedia.org",
  "viwiki": "http://vi.wikipedia.org",
  "viwiktionary": "http://vi.wiktionary.org",
  "viwikibooks": "http://vi.wikibooks.org",
  "viwikiquote": "http://vi.wikiquote.org",
  "viwikisource": "http://vi.wikisource.org",
  "viwikivoyage": "http://vi.wikivoyage.org",
  "vlswiki": "http://vls.wikipedia.org",
  "vowiki": "http://vo.wikipedia.org",
  "vowiktionary": "http://vo.wiktionary.org",
  "vowikibooks": "http://vo.wikibooks.org",
  "vowikiquote": "http://vo.wikiquote.org",
  "wawiki": "http://wa.wikipedia.org",
  "wawiktionary": "http://wa.wiktionary.org",
  "wawikibooks": "http://wa.wikibooks.org",
  "warwiki": "http://war.wikipedia.org",
  "wowiki": "http://wo.wikipedia.org",
  "wowiktionary": "http://wo.wiktionary.org",
  "wowikiquote": "http://wo.wikiquote.org",
  "wuuwiki": "http://wuu.wikipedia.org",
  "xalwiki": "http://xal.wikipedia.org",
  "xhwiki": "http://xh.wikipedia.org",
  "xhwiktionary": "http://xh.wiktionary.org",
  "xhwikibooks": "http://xh.wikibooks.org",
  "xmfwiki": "http://xmf.wikipedia.org",
  "yiwiki": "http://yi.wikipedia.org",
  "yiwiktionary": "http://yi.wiktionary.org",
  "yiwikisource": "http://yi.wikisource.org",
  "yowiki": "http://yo.wikipedia.org",
  "yowiktionary": "http://yo.wiktionary.org",
  "yowikibooks": "http://yo.wikibooks.org",
  "zawiki": "http://za.wikipedia.org",
  "zawiktionary": "http://za.wiktionary.org",
  "zawikibooks": "http://za.wikibooks.org",
  "zawikiquote": "http://za.wikiquote.org",
  "zeawiki": "http://zea.wikipedia.org",
  "zhwiki": "http://zh.wikipedia.org",
  "zhwiktionary": "http://zh.wiktionary.org",
  "zhwikibooks": "http://zh.wikibooks.org",
  "zhwikinews": "http://zh.wikinews.org",
  "zhwikiquote": "http://zh.wikiquote.org",
  "zhwikisource": "http://zh.wikisource.org",
  "zhwikivoyage": "http://zh.wikivoyage.org",
  "zh_classicalwiki": "http://zh-classical.wikipedia.org",
  "zh_min_nanwiki": "http://zh-min-nan.wikipedia.org",
  "zh_min_nanwiktionary": "http://zh-min-nan.wiktionary.org",
  "zh_min_nanwikibooks": "http://zh-min-nan.wikibooks.org",
  "zh_min_nanwikiquote": "http://zh-min-nan.wikiquote.org",
  "zh_min_nanwikisource": "http://zh-min-nan.wikisource.org",
  "zh_yuewiki": "http://zh-yue.wikipedia.org",
  "zuwiki": "http://zu.wikipedia.org",
  "zuwiktionary": "http://zu.wiktionary.org",
  "zuwikibooks": "http://zu.wikibooks.org"
}
if(typeof module !== 'undefined' && module.exports) {
  module.exports = site_map;
}

//grab the content of any article, off the api
if (typeof module !== 'undefined' && module.exports) {
  var request=require('request');
  var site_map= require("./site_map")
}

var fetch=function(page_identifier, lang_or_wikiid, cb){
  lang_or_wikiid = lang_or_wikiid || 'en';

  var identifier_type  = 'title';
  if(page_identifier.match(/^[0-9]*$/) && page_identifier.length>3){
    identifier_type='curid'
  }
  var url;
  if (site_map[lang_or_wikiid]) {
    url=site_map[lang_or_wikiid]+'/w/index.php?action=raw&'+identifier_type+'='+page_identifier;
  } else {
    url='http://'+lang_or_wikiid+'.wikipedia.org/w/index.php?action=raw&'+identifier_type+'='+page_identifier;
  }
  request({
    uri: url,
  }, function(error, response, body) {
    cb(body);
  });
};

if(typeof module !== 'undefined' && module.exports) {
  module.exports = fetch;
}

// fetch("Radiohead", 'en', function(r){ // 'afwiki'
//   console.log(JSON.stringify(r, null, 2));
// })

//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var wtf_wikipedia = (function () {
  if(typeof module !== 'undefined' && module.exports) {
    sentence_parser = require("./lib/sentence_parser")
    fetch = require("./lib/fetch_text")
    i18n = require("./i18n")
    languages = require("./languages")
  }
  //pulls target link out of redirect page
  var REDIRECT_REGEX = new RegExp("^ ?#(" + i18n.redirects.join('|') + ") ?\\[\\[(.{2,60}?)\\]\\]", "i")

  //find all the pairs of '[[...[[..]]...]]' in the text
  //used to properly root out recursive template calls, [[.. [[...]] ]]
  function recursive_matches(opener, closer, text) {
    var out = []
    var last = []
    var chars = text.split('')
    var open = 0
    for(var i = 0; i < chars.length; i++) {
      if(chars[i] === opener && chars[i + 1] && chars[i + 1] === opener) {
        open += 1
      }
      if(open >= 0) {
        last.push(chars[i])
      }
      if(open <= 0 && last.length > 0) {
        //first, fix botched parse
        var open_count = last.filter(function (s) {
          return s === opener
        });
        var close_count = last.filter(function (s) {
          return s === closer
        });
        if(open_count.length > close_count.length) {
          last.push(closer)
        }
        out.push(last.join(''))
        last = []
      }
      if(chars[i] === closer && chars[i + 1] && chars[i + 1] === closer) { //this introduces a bug for "...]]]]"
        open -= 1
        if(open < 0) {
          open = 0
        }
      }
    }
    return out
  }

  var helpers = {
    capitalise: function (str) {
      if(str && typeof str === "string") {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    },
    onlyUnique: function (value, index, self) {
      return self.indexOf(value) === index;
    },
    trim_whitespace: function (str) {
      if(str && typeof str === "string") {
        str = str.replace(/^\s\s*/, '')
        str = str.replace(/\s\s*$/, '')
        str = str.replace(/ {2}/, ' ')
        str = str.replace(/\s, /, ', ')
        return str
      }
    }
  }

  //grab an array of internal links in the text
  function fetch_links(str) {
    var links = []
    var tmp = str.match(/\[\[(.{2,80}?)\]\](\w{0,10})/g) //regular links
    if(tmp) {
      tmp.forEach(function (s) {
        var link, txt;
        if(s.match(/\|/)) { //replacement link [[link|text]]
          s = s.replace(/\[\[(.{2,80}?)\]\](\w{0,10})/g, "$1$2") //remove ['s and keep suffix
          link = s.replace(/(.{2,60})\|.{0,200}/, "$1") //replaced links
          txt = s.replace(/.{2,60}?\|/, '')
            //handle funky case of [[toronto|]]
          if(!txt && link.match(/\|$/)) {
            link = link.replace(/\|$/, '')
            txt = link
          }
        } else { // standard link [[link]]
          link = s.replace(/\[\[(.{2,60}?)\]\](\w{0,10})/g, "$1") //remove ['s
        }
        //kill off non-wikipedia namespaces
        if(link.match(/^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i)) {
          return
        }
        //kill off just anchor links [[#history]]
        if(link.match(/^#/i)) {
          return
        }
        //remove anchors from end [[toronto#history]]
        link = link.replace(/#[^ ]{1,100}/, '')
        link = helpers.capitalise(link)
        var obj = {
          page: link,
          src: txt
        }
        links.push(obj)
      })
    }
    links = links.filter(helpers.onlyUnique)
    if(links.length === 0) {
      return undefined
    }
    return links
  }
  // console.log(fetch_links("it is [[Tony Hawk|Tony]]s moher in [[Toronto]]s"))

  function fetch_categories(wiki) {
    var cats = []
    var reg = new RegExp("\\[\\[:?(" + i18n.categories.join("|") + "):(.{2,60}?)\]\](\w{0,10})", "ig")
    var tmp = wiki.match(reg) //regular links
    if(tmp) {
      var reg2 = new RegExp("^\\[\\[:?(" + i18n.categories.join("|") + "):", "ig")
      tmp.forEach(function (c) {
        c = c.replace(reg2, '')
        c = c.replace(/\|?[ \*]?\]\]$/i, '') //parse fancy onces..
        c = c.replace(/\|.*/, '') //everything after the '|' is metadata
        if(c && !c.match(/[\[\]]/)) {
          cats.push(c)
        }
      })
    }
    return cats
  }

  //return only rendered text of wiki links
  function resolve_links(line) {
    // categories, images, files
    var re = /\[\[:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف):[^\]\]]{2,80}\]\]/gi
    line = line.replace(re, "")

    // [[Common links]]
    line = line.replace(/\[\[:?([^|]{2,80}?)\]\](\w{0,5})/g, "$1$2")
      // [[Replaced|Links]]
    line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, "$2$3")
      // External links
    line = line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g, "$2")
    return line
  }
  // console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))

  function parse_image(img) {
    img = img.match(/(file|image):.*?[\|\]]/i) || ['']
    img = img[0].replace(/\|$/, '')
    return img
  }

  function parse_infobox(str) {
    var obj = {}
      // var str= str.match(/\{\{Infobox [\s\S]*?\}\}/i)
    if(str) {
      //this collapsible list stuff is just a headache
      str = str.replace(/\{\{Collapsible list[^\}]{10,1000}\}\}/g, '')
      str.replace(/\r/g, '').split(/\n/).forEach(function (l) {
        if(l.match(/^\|/)) {
          var key = l.match(/^\| ?(.{1,200}?)[ =]/) || []
          key = helpers.trim_whitespace(key[1] || '')
          var value = l.match(/=(.{1,500})$/) || []
          value = helpers.trim_whitespace(value[1] || '')
            //this is necessary for mongodb, im sorry
          if(key && key.match(/[\.]/)) {
            key = null
          }
          if(key && value && !value.match(/^[\|<]/) && !value.match(/=/)) {
            obj[key] = parse_line(value)
              //turn number strings into integers
            if(obj[key].text && obj[key].text.match(/^[0-9,]*$/)) {
              obj[key].text = obj[key].text.replace(/,/g)
              obj[key].text = parseInt(obj[key].text)
            }
          }
        }
      })
    }
    return obj
  }
  var kill_xml = function (wiki) {
      //https://en.wikipedia.org/wiki/Help:HTML_in_wikitext
      //luckily, refs can't be recursive..
      wiki = wiki.replace(/<ref>[\s\S]{0,500}?<\/ref>/gi, ' ') // <ref></ref>
      wiki = wiki.replace(/<ref [^>]{0,200}?\/>/gi, ' ') // <ref name=""/>
      wiki = wiki.replace(/<ref [^>]{0,200}?>[\s\S]{0,500}?<\/ref>/ig, ' ') // <ref name=""></ref>
        //other types of xml that we want to trash completely

      wiki = wiki.replace(/< ?(table|code|score|data|categorytree|charinsert|gallery|hiero|imagemap|inputbox|math|nowiki|poem|references|source|syntaxhighlight|timeline) ?[^>]{0,200}?>[\s\S]{0,700}< ?\/ ?(table|code|score|data|categorytree|charinsert|gallery|hiero|imagemap|inputbox|math|nowiki|poem|references|source|syntaxhighlight|timeline) ?>/gi, ' ') // <table name=""><tr>hi</tr></table>

      //some xml-like fragments we can also kill
      //
      wiki = wiki.replace(/< ?(ref|span|div|table|data) [a-z0-9=" ]{2,20}\/ ?>/g, " ") //<ref name="asd"/>
        //some formatting xml, we'll keep their insides though
      wiki = wiki.replace(/<[ \/]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr)[ \/]?>/g, " ") //<sub>, </sub>
      wiki = wiki.replace(/<[ \/]?(abbr|bdi|bdo|blockquote|cite|del|dfn|em|i|ins|kbd|mark|q|s)[ \/]?>/g, " ") //<abbr>, </abbr>
      wiki = wiki.replace(/<[ \/]?h[0-9][ \/]?>/g, " ") //<h2>, </h2>
        //a more generic + dangerous xml-tag removal
      wiki = wiki.replace(/<[ \/]?[a-z0-9]{1,8}[ \/]?>/g, " ") //<samp>

      return wiki
    }
    // console.log(kill_xml("hello <ref>nono!</ref> world1. hello <ref name='hullo'>nono!</ref> world2. hello <ref name='hullo'/>world3.  hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4. hello<ref name=''/> world5 <ref name=''>nono</ref>, man.}}"))
    // console.log(kill_xml("hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4"))
    // console.log(kill_xml('hello<ref name="theroyal"/> world <ref>nono</ref>, man}}'))
    // console.log(kill_xml('hello<ref name="theroyal"/> world5 <ref name="">nono</ref>, man'))
    // console.log(kill_xml("hello <asd f> world </h2>"))
    // console.log(kill_xml("North America,<ref name=\"fhwa\"> and one of"))
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

  function parse_line(line) {
    return {
      text: postprocess(line),
      links: fetch_links(line)
    }
  }

  function postprocess(line) {

    //fix links
    line = resolve_links(line)
      //oops, recursive image bug
    if(line.match(/^(thumb|right|left)\|/i)) {
      return null
    }
    //some IPA pronounciations leave blank junk parenteses
    line = line.replace(/\([^a-z]{0,8}\)/, '')
    line = helpers.trim_whitespace(line)

    // put new lines back in
    // line=line+"\n";

    return line
  }

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

  //return a list of probable pages for this disambig page
  var parse_disambig = function (wiki) {
    var pages = []
    var lines = wiki.replace(/\r/g, '').split(/\n/)
    lines.forEach(function (str) {
      //if there's an early link in the list
      if(str.match(/^\*.{0,40}\[\[.*\]\]/)) {
        var links = fetch_links(str)
        if(links && links[0] && links[0].page) {
          pages.push(links[0].page)
        }
      }
    })
    return {
      type: "disambiguation",
      pages: pages
    }
  }

  //turn a {|...table string into an array of arrays
  var parse_table = function (wiki) {
    var table = []
    var lines = wiki.replace(/\r/g, '').split(/\n/)
    lines.forEach(function (str) {
      //die
      if(str.match(/^\|\}/)) {
        return
      }
      //make new row
      if(str.match(/^\|-/)) {
        table.push([])
        return
      }
      //this is some kind of comment
      if(str.match(/^\|\+/)) {
        return
      }
      //juicy line
      if(str.match(/^[\!\|]/)) {
        //make a new row
        if(!table[table.length - 1]) {
          table[table.length - 1] = []
        }
        var want = (str.match(/\|(.*)/) || [])[1] || ''
        want = helpers.trim_whitespace(want) || ''
          //handle the || shorthand..
        if(want.match(/[!\|]{2}/)) {
          want.split(/[!\|]{2}/g).forEach(function (s) {
            s = helpers.trim_whitespace(s)
            table[table.length - 1].push(s)
          })
        } else {
          table[table.length - 1].push(want)
        }
      }
    })
    return table
  }

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
    var cats = fetch_categories(wiki)

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
    cb = cb || console.log
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
