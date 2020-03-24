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

  var _01FromTemplate = fromTemplate;

  var defaults = {
    max: 90,
    min: 8
  };

  var removeTitle = function removeTitle(s, sentence, title) {
    //remove bolds (longest-first)
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
  }; //use commas, etc


  var byClause = function byClause(s) {
    var orig = s.clone();
    var clauses = s.clauses();

    for (var i = 0; i < clauses.length; i += 1) {
      var c = clauses.eq(i);

      if (c.has('#Copula')) {
        var result = clauses.slice(i, clauses.length);
        result = result.not('^#Copula');
        return result;
      }
    }

    return orig;
  }; // truncate a list of descriptions


  var popList = function popList(s, options) {
    var txt = s.text();
    var almostMax = options.max * 0.75;

    if (txt.length > almostMax && s.has('and')) {
      s = s.remove('and .*');
    }

    return s;
  }; //check text is appropriate length


  var isGood = function isGood(text, options) {
    if (text && text.length > options.min && text.length < options.max) {
      return true;
    }

    return false;
  };

  var popArticle = function popArticle(doc) {
    doc.remove('^(a|an|the)');
    return doc;
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

    s = removeTitle(s, sentence, title); //by comma-section

    s = byClause(s); //remove end period

    s.post(''); // truncate a list

    s = popList(s, options); //remove article

    if (options.article === false) {
      s = popArticle(s);
    } //spit-out the text


    var text = s.trim().out('text');

    if (isGood(text, options) === true) {
      return text;
    }

    return '';
  };

  var _02FromText = extract;

  var defaults$1 = {
    article: true
  };

  var seemsGood = function seemsGood(txt) {
    return txt && txt.length > 5 && txt.length < 55;
  };

  var postProcess = function postProcess(txt) {
    txt = txt.trim();
    return txt;
  };

  var plugin = function plugin(models) {
    // add a new method to main class
    models.Doc.prototype.summary = function (options) {
      var doc = this;
      options = options || {};
      options = Object.assign({}, defaults$1, options); // generate from {{short description}} template

      var txt = _01FromTemplate(doc);

      if (seemsGood(txt)) {
        return postProcess(txt);
      } // generate from first-sentence


      txt = _02FromText(doc, options);

      if (seemsGood(txt)) {
        return postProcess(txt);
      }

      return '';
    }; // should we use 'it', 'he', 'they'...


    models.Doc.prototype.article = function (options) {
      return null;
    }; // was event in past? is person dead?


    models.Doc.prototype.tense = function (options) {
      return null;
    };
  };

  var src = plugin;

  return src;

})));
//# sourceMappingURL=wtf-plugin-summary.js.map
