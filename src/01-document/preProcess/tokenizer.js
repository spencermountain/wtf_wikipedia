/* Tokenizer replaces
  * Math Expression by Tokens of type
     ___MATH_INLINE_793249879_ID_5___
     ___MATH_BLOCK_793249879_ID_6___
    and pushes the mathe code in the JSON data
  * Citations
     replace <ref name="my citation" />
     by
     ___CITE_LABEL_my_citation___
*/
const parseGeneric = require('../../templates/parsers/generic');
const parsePipe = require('../../templates/misc')['cite gnis'];
const parseSentence = require('../../04-sentence').oneSentence;
const Reference = require('../../reference/Reference');


const tokenizeMath = function(wiki, data, options) {
  setTimeID(data);
  if (data.hasOwnProperty("mathexpr")) {
    console.log("data.mathexpr array exists");
  } else {
    data.mathexpr = [];
  };
  wiki = tokenizeMathBlock(wiki, data, options);
  wiki = tokenizeMathInline(wiki, data, options);
  return wiki
};

const tokenizeMathBlock = function(wikicode, data, options) {
  let timeid = data.timeid;
  console.log("parseMathBlock() Time ID="+data.timeid);
  if (wikicode) {
    // create the mathexpr array if
    //var vSearch = /(<math[^>]*?>)(.*?)(<\/math>)/gi;
    var vSearch = /\n[:]+[\s]*?<math[^>]*?>(.*?)<\/math>/gi;
    //var vSearch = /\n[:]+[\s]*?(<math>)(.*?)(<\/math>)/gi;
    // \n            # newline
    // [:]+          # one or more colons
    // [\s]*?        # (optional) tabs and white space
    // <math[^>]*?>  # opening <math> tag
    // (.*?)         # enclosed math expression
    //(<\/math>)     # closing </math> tag
    //
    // gi            # g global, i ignore caps
    var vResult;
    var vCount =0;
    var vLabel = "";
    console.log("wikicode defined");
    while (vResult = vSearch.exec(wikicode)) {
      vCount++;
      console.log("Math Expression "+vCount+": '" + vResult[1] + "' found");
      vLabel = "___MATH_BLOCK_"+data.timeid+"_ID_"+vCount+"___";
      var vFound = vResult[1];
      data.mathexpr.push({
        "type":"block",
        "label":vLabel,
        "math":vFound
      });
      wikicode = replaceString(wikicode,vResult[0],vLabel);
      //wikicode = replaceString(wikicode,vFound,vLabel);
    };
  };
  return wikicode
}


const tokenizeMathInline = function(wikicode, data, options) {
  console.log("parseMathBlock() Time ID="+data.timeid);
  if (wikicode) {
    //var vSearch = /(<math[^>]*?>)(.*?)(<\/math>)/gi;
    var vSearch = /<math[^>]*?>(.*?)<\/math>/gi;
    //var vSearch = /\n[:]+[\s]*?(<math>)(.*?)(<\/math>)/gi;
    // <math[^>]*?>  # opening <math> tag
    // (.*?)         # enclosed math expression
    //(<\/math>)     # closing </math> tag
    //
    // gi            # g global, i ignore caps
    var vResult;
    var vCount =0;
    var vLabel = "";
    console.log("wikicode defined");
    while (vResult = vSearch.exec(wikicode)) {
      vCount++;
      console.log("Math Expression "+vCount+": '" + vResult[1] + "' found");
      vLabel = "___MATH_INLINE_"+data.timeid+"_ID_"+vCount+"___";
      var vFound = vResult[1];
      data.mathexpr.push({
        "type":"inline",
        "label":vLabel,
        "math":vFound
      });
      wikicode = replaceString(wikicode,vResult[0],vLabel);
      //wikicode = replaceString(wikicode,vFound,vLabel);
    };
  };
  return wikicode
}


const setTimeID = function (data) {
  if (data.hasOwnProperty("timeid")) {
    console.log("data.timeid exists!");
  } else {
    console.log("data.timeid created!");
    var now = new Date();
    data.timeid = now.getTime();
  };
};


	const replaceString = function (pString,pSearch,pReplace) {
	  //----Debugging------------------------------------------
	  // console.log("js/wikiconvert.js - Call: replaceString(pString:String,pSearch:String,pReplace:String):String");
	  // alert("js/wikiconvert.js - Call: replaceString(pString:String,pSearch:String,pReplace:String):String");
	  //----Create Object/Instance of WikiConvert----
	  //    var vMyInstance = new WikiConvert();
	  //    vMyInstance.replaceString(pString,pSearch,pReplace);
	  //-------------------------------------------------------

	  	//alert("cstring.js - replaceString() "+pString);
	  	if (!pString) {
	  		alert("replaceString()-Call - pString not defined!");
	  	} else if (pString != '') {
				//alert("cstring.js - replaceString() "+pString);
				var vHelpString = '';
				var vN = pString.indexOf(pSearch);
				var vReturnString = '';
				while (vN >= 0) {
					if (vN > 0)
						vReturnString += pString.substring(0, vN);
						vReturnString += pReplace;
									if (vN + pSearch.length < pString.length) {
							pString = pString.substring(vN+pSearch.length, pString.length);
					} else {
							pString = ''
					};
					vN = pString.indexOf(pSearch);
				};
				return vReturnString + pString;
			};
	};
	//----End of Method replaceString Definition


//structured Cite templates - <ref>{{Cite..</ref>
const hasCitation = function(str) {
  return /^ *?\{\{ *?(cite|citation)/i.test(str) && /\}\} *?$/.test(str) && /citation needed/i.test(str) === false;
};

//might as well parse it, since we're here.
const parseCitation = function(tmpl) {
  let obj = parseGeneric(tmpl);
  if (obj) {
    return obj;
  }
  //support {{cite gnis|98734}} format
  return parsePipe(tmpl);
};

//handle unstructured ones - <ref>some text</ref>
const parseInline = function(str) {
  let obj = parseSentence(str) || {};
  return {
    template: 'citation',
    type: 'inline',
    data: {},
    inline: obj
  };
};

// parse <ref></ref> xml tags
const tokenizeCitation = function(wiki, data) {
  wiki = tokenizeRefs(wiki, data);
  return wiki
}

const name2label = function (pname) {
  //replace blank and non characters or digits by underscore "_"
  var vLabel = str.replace(/[^A-Za-z0-9]/g,"_");
  vLabel = vLabel.replace(/[_]+/g,"_");
  vLabel = vLabel.replace(/^_/g,"");
  vLabel = vLabel.replace(/_$/g,"");
  if (vLabel == "") {
    vLabel = null;
  };
  return vLabel
}

const getCiteLabel = function (data,pid) {
  //replace blank and non characters or digits by underscore "_"
  return "___CITE_"+data.timeid+"_"+pid+"___";
}

const storeReference = function (wiki,data,references,tmpl,pLabel) {
  if (hasCitation(tmpl)) {
    let obj = parseCitation(tmpl);
    if (obj) {
      obj.label = pLabel;
      references.push(obj);
    };
    wiki = wiki.replace(tmpl, '');
  } else {
    let obj = parseInline(tmpl);
    obj.label = pLabel;
    references.push(obj);
  };
  return wiki;
}

const tokenizeRefs = function(wiki, data, options) {
  let references = [];
  // (1) References without a citaion label
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,1000}?)<\/ref> ?/gi, function(a, tmpl){
    // getCiteLabel(data,pid) returns  ___CITE_8234987294_5___
    let vLabel = getCiteLabel(data,references.length);
    wiki = storeReference(wiki,data,references,tmpl,vLabel);
    return vLabel;
  });
  // (2) Cite a reference by a label WITHOUT reference
  // replace <ref name="my book label"/> by "___CITE_7238234792_my_book_label___"
  wiki = wiki.replace(/ ?<ref[\s]+name=["']([^"'])["'][^>]{0,200}?\/> ?/gi,function(a, tmpl) {
    let vLabel = getCiteLabel(data,name2label(tmpl));
    return vLabel;
  });
  // (3) Reference with citation label that is used multiple time in a document by (2)
  wiki = wiki.replace(/ ?<ref [\s]+name=["']([^"'])["'][^>]{0,200}?>([\s\S]{0,1000}?)<\/ref> ?/gi, function(a, name, tmpl) {
    /* difference between name, label and cite label
       (3a) name='my book name#2012'
       (3b) label='my_book_name_2012'
       (3c) cite_label='___CITE_7238234792_my_book_label_2012___' is the unique marker in the text
     the citation label is a marker in the text with a unique time stamp and defined syntax
     which is very unlikely to have a text element in an article.
    */
    // Convert e.g. name='my book name#2012' to 'my_book_name_2012'
    var vLabel = name2label(name);
    if (vLabel) {
      console.log("tokenizeRefs() created cite label='"+vLabel+"' from name='"+name+"'");
      vLabel = getCiteLabel(data,vLabel);
    } else {
      // convert a standard label with the reference length of the array as unique ID generator
      vLabel = getCiteLabel(data,references.length);
    };
    wiki = storeReference(wiki,data,references,tmpl,vLabel);
    return vLabel;
  });
  data.refs4token = references;
  //data.references = references.map(r => new Reference(r));
  //now that we're done with xml, do a generic
  return wiki;
}

const parseRefs = function(wiki, data) {
  let references = [];
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,1000}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl);
      if (obj) {
        references.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      references.push(parseInline(tmpl));
    }
    return ' ';
  });
  // <ref name=""/>
  wiki = wiki.replace(/ ?<ref[\s]+name=["']([^"'])["'][^>]{0,200}?\/> ?/gi, ' ');
  // <ref name=""></ref>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1000}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl);
      if (obj) {
        references.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      references.push(parseInline(tmpl));
    }
    return ' ';
  });
  //now that we're done with xml, do a generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ \/]?> ?/g, ' '); //<samp name="asd">
  data.references = references.map(r => new Reference(r));
  return wiki;
};

let Tokenizer = {
  "math": tokenizeMath,
  "citation": tokenizeCitation
};
module.exports = Tokenizer;
