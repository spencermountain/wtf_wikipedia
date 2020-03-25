/* wtf-plugin-summary 0.0.1  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('compromise')) :
  typeof define === 'function' && define.amd ? define(['compromise'], factory) :
  (global = global || self, global.wtf = factory(global.compromise));
}(this, (function (compromise) { 'use strict';

  compromise = compromise && Object.prototype.hasOwnProperty.call(compromise, 'default') ? compromise['default'] : compromise;

  var isObject = function isObject(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  };

  var fromTemplate = function fromTemplate(doc) {
    var tmpl = doc.template('short description');

    if (tmpl && isObject(tmpl) && tmpl.description) {
      return tmpl.description;
    }

    return null;
  };

  var fromTemplate_1 = fromTemplate;

  //use commas, etc
  var byClause = function byClause(s, options) {
    var clauses = s.clauses(); // remove any clause with 'is/was'

    clauses.ifNo('#Copula'); // try just removing the last clause

    if (clauses.length > 1 && clauses.text().length > options.max) {
      clauses.pop();
    }

    return clauses.join();
  }; // truncate a list of descriptions


  var popList = function popList(s) {
    if (s.has('#Noun and (a|an|the)')) {
      s = s.remove('and .*');
    }

    return s;
  };

  var byTemplate = function byTemplate(s, options) {
    s.remove('born in .*');
    s.remove('(first|initially|originally)? (located|founded|started|based|formed) in .*');
    s.remove('born #Date+ in? #Place+?');
    s.remove('(which|who|that) (is|was) .*');
    s.remove('^the name of');
    s.remove('(located|situated|sited|found|discovered) (in|on) .*');
    var txt = s.text();
    var almostMax = options.max * 0.75;

    if (txt.length > almostMax) {
      // in california
      s.remove('in #Place+');
    }

    return s;
  };

  var byWord = function byWord(s, options) {
    var txt = s.text();
    var almostMax = options.max * 0.8;

    if (txt.length > almostMax) {
      s.remove('#Demonym'); //'american'

      s.remove('(retired|former|professional|amateur)');
    }

    return s;
  };

  var popArticle = function popArticle(doc) {
    doc.remove('^(a|an|the)');
    return doc;
  };

  var noSuperlative = function noSuperlative(s, options) {
    var txt = s.text();
    var almostMax = options.max * 0.7;

    if (txt.length > almostMax) {
      s.remove('^one of (the|many|several|#Value)+');
      s.remove('^(a|an|the) #Ordinal? #Superlative');
      s.remove('^(a|an|the) #Ordinal? most #Adjective');
    }

    return s;
  };

  var methods = {
    byClause: byClause,
    popList: popList,
    byTemplate: byTemplate,
    byWord: byWord,
    popArticle: popArticle,
    noSuperlative: noSuperlative
  };

  // remove the first part of the sentence
  var removeTitle = function removeTitle(s, sentence, title) {
    s.remove('^.+ #Copula+'); //remove bolds (longest-first)

    var bolds = sentence.bolds().sort(function (a, b) {
      if (a.length > b.length) {
        return -1;
      }

      return 1;
    });
    bolds.forEach(function (b) {
      s = s.not(b);
    });
    s = s.not('^#Noun+ #Copula');
    s = s.not("^".concat(title));
    return s;
  };

  var noName = removeTitle;

  compromise.extend(function (Doc) {
    Doc.prototype.pop = function () {
      this.list.pop();
      return this;
    };
  });
  var defaults = {
    max: 90,
    min: 8
  }; //check text is appropriate length

  var isGood = function isGood(text, options) {
    if (text && text.length > options.min && text.length < options.max) {
      return true;
    }

    return false;
  }; //


  var extract = function extract(doc, options) {
    options = options || {};
    options = Object.assign({}, defaults, options);
    var sentence = doc.sentences(0);

    if (!sentence) {
      return '';
    }

    var s = compromise(sentence.text());
    var title = doc.title() || ''; //remove 'born-in' stuff

    s.parentheses().remove(); //remove 'Toronto' from beginning

    s = noName(s, sentence, title); //by comma-section

    s = methods.byClause(s, options); //remove end period

    s.post(''); // truncate a list

    s = methods.popList(s, options); // remove known sub-phrases

    s = methods.byTemplate(s, options); // remove needless words

    s = methods.byWord(s, options); // remove 'the largest'

    s = methods.noSuperlative(s, options); //remove article

    if (options.article === false) {
      s = methods.popArticle(s);
    } //spit-out the text


    var text = s.trim().text();

    if (isGood(text, options) === true) {
      return text;
    }

    return '';
  };

  var fromText = extract;

  var defaults$1 = {
    article: true
  };

  var seemsGood = function seemsGood(txt) {
    return txt && txt.length > 5 && txt.length < 55;
  };

  var plugin = function plugin(models) {
    // add a new method to main class
    models.Doc.prototype.summary = function (options) {
      var doc = this;
      options = options || {};
      options = Object.assign({}, defaults$1, options); // generate from {{short description}} template

      var txt = fromTemplate_1(doc);

      if (seemsGood(txt)) {
        return txt.trim();
      } // generate from first-sentence


      return fromText(doc, options);
    }; // should we use 'it', 'he', 'they'...


    models.Doc.prototype.article = function () {
      var txt = ''; // prefer the 2nd sentence

      if (this.sentences(1)) {
        txt = this.sentences(1).text();
      } else {
        txt = this.sentences(0).text();
      }

      var doc = compromise(txt);
      var found = doc.match('(#Pronoun|#Article)').eq(0).text().toLowerCase();
      return found || 'it';
    }; // was event in past? is person dead?


    models.Doc.prototype.tense = function () {
      var txt = this.sentence().text();
      var doc = compromise(txt);
      var copula = doc.match('#Copula+').first();

      if (copula.has('was')) {
        return 'Past';
      }

      var vb = doc.verbs(0);

      if (vb.has('#PastTense')) {
        return 'Past';
      }

      if (doc.has('will #Adverb? be') || doc.has('(a|an) (upcoming|planned)')) {
        return 'Future';
      }

      return 'Present';
    };
  };

  var src = plugin;

  return src;

})));
//# sourceMappingURL=wtf-plugin-summary.js.map
