/* wtf_wikipedia 8.5.1 MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtf = factory());
}(this, (function () { 'use strict';

  var parseUrl = function parseUrl(url) {
    var parsed = new URL(url); //eslint-disable-line

    var title = parsed.pathname.replace(/^\/(wiki\/)?/, '');
    title = decodeURIComponent(title);
    return {
      domain: parsed.host,
      title: title
    };
  };

  var _00ParseUrl = parseUrl;

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var isInterWiki = /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/;
  var defaults = {
    action: 'query',
    prop: 'revisions|pageprops',
    //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
    rvprop: 'content',
    maxlag: 5,
    rvslots: 'main',
    origin: '*',
    format: 'json',
    redirects: 'true'
  };

  var toQueryString = function toQueryString(obj) {
    return Object.entries(obj).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
    }).join('&');
  };

  var isArray = function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  };

  var cleanTitle = function cleanTitle(page) {
    page = page.replace(/ /g, '_');
    page = page.trim(); // page = encodeURIComponent(page)

    return page;
  };

  var makeUrl = function makeUrl(options) {
    var params = Object.assign({}, defaults); // default url

    var url = "https://".concat(options.lang, ".").concat(options.wiki, ".org/w/api.php?"); // from a 3rd party wiki

    options.domain = options.domain || options.wikiUrl; //support old syntax

    if (options.domain) {
      var path = options.path; //wikimedia api uses ./w/api path. no others do

      if (isInterWiki.test(options.domain)) {
        path = 'w/api.php';
      }

      url = "https://".concat(options.domain, "/").concat(path, "?");
    }

    if (!options.follow_redirects) {
      delete params.redirects;
    } // support numerical ids


    var page = options.title;

    if (typeof page === 'number') {
      params.pageids = page; //single pageId
    } else if (isArray(page) && typeof page[0] === 'number') {
      params.pageids = page.join('|'); //pageid array
    } else if (isArray(page) === true) {
      //support array
      params.titles = page.map(cleanTitle).join('|');
    } else {
      // single page
      params.titles = cleanTitle(page);
    } // make it!


    url += toQueryString(params);
    return url;
  };

  var _01MakeUrl = makeUrl;

  //this data-format from mediawiki api is nutso
  var getResult = function getResult(data, options) {
    options = options || {};
    var pages = Object.keys(data.query.pages);
    var docs = pages.map(function (id) {
      var page = data.query.pages[id] || {};

      if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
        return null;
      }

      var text = page.revisions[0]['*']; // console.log(page.revisions[0])
      //us the 'generator' result format, for the random() method

      if (!text && page.revisions[0].slots) {
        text = page.revisions[0].slots.main['*'];
      }

      page.pageprops = page.pageprops || {};
      var domain = options.domain;

      if (!domain && options.wiki) {
        domain = "".concat(options.wiki, ".org");
      }

      var meta = Object.assign({}, options, {
        title: page.title,
        pageID: page.pageid,
        namespace: page.ns,
        domain: domain,
        wikidata: page.pageprops.wikibase_item,
        description: page.pageprops['wikibase-shortdesc']
      });

      try {
        return {
          wiki: text,
          meta: meta
        };
      } catch (e) {
        console.error(e);
        throw e;
      }
    });
    return docs;
  };

  var _02GetResult = getResult;

  //helper for looping around all sections of a document
  var sectionMap = function sectionMap(doc, fn, clue) {
    var arr = [];
    doc.sections().forEach(function (sec) {
      var list = [];

      if (typeof clue === 'string') {
        list = sec[fn](clue);
      } else {
        list = sec[fn]();
      }

      list.forEach(function (t) {
        arr.push(t);
      });
    });

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  };

  var _sectionMap = sectionMap;

  //
  var setDefaults = function setDefaults(options, defaults) {
    return Object.assign({}, defaults, options);
  };

  var setDefaults_1 = setDefaults;

  var defaults$1 = {
    title: true,
    sections: true,
    pageID: true,
    categories: true
  }; //an opinionated output of the most-wanted data

  var toJSON = function toJSON(doc, options) {
    options = setDefaults_1(options, defaults$1);
    var data = {};

    if (options.title) {
      data.title = doc.title();
    }

    if (options.pageID) {
      data.pageID = doc.pageID();
    }

    if (options.categories) {
      data.categories = doc.categories();
    }

    if (options.sections) {
      data.sections = doc.sections().map(function (i) {
        return i.json(options);
      });
    }

    if (doc.isRedirect() === true) {
      data.isRedirect = true;
      data.redirectTo = doc.data.redirectTo;
      data.sections = [];
    } //these are default-off


    if (options.coordinates) {
      data.coordinates = doc.coordinates();
    }

    if (options.infoboxes) {
      data.infoboxes = doc.infoboxes().map(function (i) {
        return i.json(options);
      });
    }

    if (options.images) {
      data.images = doc.images().map(function (i) {
        return i.json(options);
      });
    }

    if (options.plaintext) {
      data.plaintext = doc.text(options);
    }

    if (options.citations || options.references) {
      data.references = doc.references();
    }

    return data;
  };

  var toJson = toJSON;

  var disambig = ['dab', //en
  'disamb', //en
  'disambig', //en
  'disambiguation', //en
  'aðgreining', //is
  'aimai', //ja
  'ałtsʼáʼáztiin', //nv
  'anlam ayrımı', //gag
  'anlam ayrımı', //tr
  'apartigilo', //eo
  'argipen', //eu
  'begriepskloorenge', //stq
  'begriffsklärung', //als
  'begriffsklärung', //de
  'begriffsklärung', //pdc
  'begriffsklearung', //bar
  'bisongidila', //kg
  'bkl', //pfl
  'bokokani', //ln
  'caddayn', //so
  'clerheans', //kw
  'cudakirin', //ku
  'čvor', //bs
  'db', //vls
  'desambig', //nov
  'desambigación', //an
  'desambiguação', //pt
  'desambiguació', //ca
  'desambiguación', //es
  'desambiguáncia', //ext
  'desambiguasion', //lad
  'desambiguassiù', //lmo
  'desambigui', //lfn
  'dezambiguizare', //ro
  'dəqiqləşdirmə', //az
  'disambigua', //it
  'disambigua', //lij
  'disambigua', //nap
  'disambìgua', //sc
  'disambigua', //scn
  'disambiguasi', //id
  'disambiguasi', //su
  'discretiva', //la
  'disheñvelout', //br
  'disingkek', //min
  'dixanbigua', //vec
  'dixebra', //ast
  'diżambigwazzjoni', //mt
  'doorverwijspagina', //nl
  'dp', //nl
  'dp', //zea
  'dubbelsinnig', //af
  'dudalipen', //rmy
  'dv', //nds_nl
  'egyért', //hu
  'fleiri týdningar', //fo
  'fleirtyding', //nn
  'flertydig', //da
  'förgrening', //sv
  'gì-ngiê', //cdo
  'giklaro', //ceb
  'gwahaniaethu', //cy
  'homonimo', //io
  'homónimos', //gl
  'homonymie', //fr
  'huaʻōlelo puana like', //haw
  'idirdhealú', //ga
  'khu-pia̍t', //zh_min_nan
  'kthjellim', //sq
  'kujekesa', //sn
  'maana', //sw
  'maneo bin', //diq
  'mehrdüdig begreep', //nds
  'menm non', //ht
  'muardüüdag artiikel', //frr
  'neibetsjuttings', //fy
  'nozīmju atdalīšana', //lv
  'nuorodinis', //lt
  'nyahkekaburan', //ms
  'omonimeye', //wa
  'omonimia', //oc
  'page dé frouque', //nrm
  'paglilinaw', //tl
  'panangilawlawag', //ilo
  'pansayod', //war
  'pejy mitovy anarana', //mg
  'peker', //no
  'razdvojba', //hr
  'razločitev', //sl
  'razvrstavanje', //sh
  'reddaghey', //gv
  'rozcestník', //cs
  'rozlišovacia stránka', //sk
  'sclerir noziun', //rm
  'selvendyssivu', //olo
  'soilleireachadh', //gd
  'suzmunski', //jbo
  'täpsustuslehekülg', //et
  'täsmennyssivu', //fi
  'telplänov', //vo
  'tlahtolmelahuacatlaliztli', //nah
  'trang định hướng', //vi
  'ujednoznacznienie', //pl
  'verdudeliking', //li
  'wěcejwóznamowosć', //dsb
  'wjacezmyslnosć', //hsb
  'zambiguaçon', //mwl
  'zeimeibu škiršona', //ltg
  'αποσαφήνιση', //el
  'айрық', //kk
  'аҵакырацәа', //ab
  'вишезначна одредница', //sr
  'ибҳомзудоӣ', //tg
  'кёб магъаналы', //krc
  'күп мәгънәләр', //tt
  'күп мәғәнәлелек', //ba
  'мъногосъмꙑслиѥ', //cu
  'неадназначнасць', //be
  'неадназначнасьць', //be_x_old
  'неоднозначность', //ru
  'олон удхатай', //bxr
  'појаснување', //mk
  'пояснение', //bg
  'са шумуд манавал', //lez
  'салаа утгатай', //mn
  'суолталар', //sah
  'текмаанисиздик', //ky
  'цо магіна гуреб', //av
  'чеперушка', //rue
  'чолхалла', //ce
  'шуко ончыктымаш-влак', //mhr
  'მრავალმნიშვნელოვანი', //ka
  'բազմիմաստութիւն', //hyw
  'բազմիմաստություն', //hy
  'באדייטן', //yi
  'פירושונים', //he
  'ابهام‌زدایی', //fa
  'توضيح', //ar
  'توضيح', //arz
  'دقیقلشدیرمه', //azb
  'ڕوونکردنەوە', //ckb
  'سلجهائپ', //sd
  'ضد ابہام', //ur
  'گجگجی بیری', //mzn
  'نامبهمېدنه', //ps
  'መንታ', //am
  'अस्पष्टता', //ne
  'बहुअर्थी', //bh
  'बहुविकल्पी शब्द', //hi
  'দ্ব্যর্থতা নিরসন', //bn
  'ਗੁੰਝਲ-ਖੋਲ੍ਹ', //pa
  'સંદિગ્ધ શીર્ષક', //gu
  'பக்கவழி நெறிப்படுத்தல்', //ta
  'అయోమయ నివృత్తి', //te
  'ದ್ವಂದ್ವ ನಿವಾರಣೆ', //kn
  'വിവക്ഷകൾ', //ml
  'වක්‍රෝත්ති', //si
  'แก้ความกำกวม', //th
  'သံတူကြောင်းကွဲ', //my
  'ណែនាំ', //km
  '동음이의', //ko
  '扤清楚', //gan
  '搞清楚', //zh_yue
  '曖昧さ回避', //ja
  '消歧义', //zh
  '釋義', //zh_classical
  "gestion dj'omònim", //pms
  "sut'ichana qillqa" //qu
  // 'z', //vep
  // 'သဵင်မိူၼ် တူၼ်ႈထႅဝ်ပႅၵ်ႇ', //shn
  ];

  var i18n = disambig.reduce(function (h, str) {
    h[str] = true;
    return h;
  }, {}); //special disambig-templates en-wikipedia uses

  var d = ' disambiguation';
  var english = ['dab', 'dab', 'disamb', 'disambig', 'geodis', 'hndis', 'setindex', 'ship index', 'split dab', 'sport index', 'wp disambig', 'disambiguation cleanup', 'airport' + d, 'biology' + d, 'call sign' + d, 'caselaw' + d, 'chinese title' + d, 'genus' + d, 'hospital' + d, 'lake index', 'letter' + d, 'letter-number combination' + d, 'mathematical' + d, 'military unit' + d, 'mountainindex', 'number' + d, 'phonetics' + d, 'place name' + d, 'portal' + d, 'road' + d, 'school' + d, 'species latin name abbreviation' + d, 'species latin name' + d, 'station' + d, 'synagogue' + d, 'taxonomic authority' + d, 'taxonomy' + d].reduce(function (h, str) {
    h[str] = true;
    return h;
  }, {});

  var isDisambig = function isDisambig(doc) {
    var templates = doc.templates();
    var found = templates.find(function (obj) {
      return english.hasOwnProperty(obj.template) || i18n.hasOwnProperty(obj.template);
    });

    if (found) {
      return true;
    } // try 'may refer to' on first line for en-wiki?


    if (doc.sentences(0)) {
      var firstLine = doc.sentences(0).text();

      if (firstLine !== null && firstLine[0]) {
        if (/. may refer to ./i.test(firstLine) === true) {
          return true;
        }
      }
    }

    return false;
  };

  var disambig$1 = isDisambig;

  var defaults$2 = {
    caption: true,
    alt: true,
    links: true,
    thumb: true,
    url: true
  }; //

  var toJson$1 = function toJson(img, options) {
    options = setDefaults_1(options, defaults$2);
    var json = {
      file: img.file()
    };

    if (options.thumb !== false) {
      json.thumb = img.thumbnail();
    }

    if (options.url !== false) {
      json.url = img.url();
    } //add captions


    if (options.caption !== false && img.data.caption) {
      json.caption = img.caption();

      if (options.links !== false && img.data.caption.links()) {
        json.links = img.links();
      }
    }

    if (options.alt !== false && img.data.alt) {
      json.alt = img.alt();
    }

    return json;
  };

  var toJson_1 = toJson$1;

  var server = 'wikipedia.org';

  var encodeTitle = function encodeTitle(file) {
    var title = file.replace(/^(image|file?)\:/i, ''); //titlecase it

    title = title.charAt(0).toUpperCase() + title.substring(1); //spaces to underscores

    title = title.trim().replace(/ /g, '_');
    return title;
  }; //the wikimedia image url is a little silly:


  var makeSrc = function makeSrc(file) {
    var title = encodeTitle(file);
    title = encodeURIComponent(title);
    return title;
  }; //the class for our image generation functions


  var Image = function Image(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods = {
    file: function file() {
      return this.data.file || '';
    },
    alt: function alt() {
      var str = this.data.alt || this.data.file || '';
      str = str.replace(/^(file|image):/i, '');
      str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
      return str.replace(/_/g, ' ');
    },
    caption: function caption() {
      if (this.data.caption) {
        return this.data.caption.text();
      }

      return '';
    },
    links: function links() {
      if (this.data.caption) {
        return this.data.caption.links();
      }

      return [];
    },
    url: function url() {
      // let lang = 'en' //this.language() || 'en' //hmm: get actual language?
      var fileName = makeSrc(this.file());
      var domain = this.data.domain || server;
      var path = "wiki/Special:Redirect/file";
      return "https://".concat(domain, "/").concat(path, "/").concat(fileName);
    },
    thumbnail: function thumbnail(size) {
      size = size || 300;
      return this.url() + '?width=' + size;
    },
    format: function format() {
      var arr = this.file().split('.');

      if (arr[arr.length - 1]) {
        return arr[arr.length - 1].toLowerCase();
      }

      return null;
    },
    json: function json(options) {
      options = options || {};
      return toJson_1(this, options);
    },
    text: function text() {
      return '';
    }
  };
  Object.keys(methods).forEach(function (k) {
    Image.prototype[k] = methods[k];
  });
  Image.prototype.src = Image.prototype.url;
  Image.prototype.thumb = Image.prototype.thumbnail;
  var Image_1 = Image;

  var defaults$3 = {
    tables: true,
    lists: true,
    paragraphs: true
  }; //

  var Document = function Document(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$1 = {
    title: function title(str) {
      //use like a setter
      if (str !== undefined) {
        this.data.title = str;
        return str;
      } //if we have it already


      if (this.data.title) {
        return this.data.title;
      } //guess the title of this page from first sentence bolding


      var guess = null;
      var sen = this.sentences(0);

      if (sen) {
        guess = sen.bolds(0);
      }

      return guess;
    },
    pageID: function pageID(id) {
      if (id !== undefined) {
        this.data.pageID = id;
      }

      return this.data.pageID;
    },
    wikidata: function wikidata(id) {
      if (id !== undefined) {
        this.data.wikidata = id;
      }

      return this.data.wikidata;
    },
    domain: function domain(str) {
      if (str !== undefined) {
        this.data.domain = str;
      }

      return this.data.domain;
    },
    language: function language(lang) {
      if (lang !== undefined) {
        this.data.lang = lang;
      }

      return this.data.lang;
    },
    url: function url() {
      var title = this.title();

      if (!title) {
        return null;
      }

      var lang = this.language() || 'en';
      var domain = this.domain() || 'wikipedia.org'; // replace blank to underscore

      title = title.replace(/ /g, '_');
      title = encodeURIComponent(title);
      return "https://".concat(lang, ".").concat(domain, "/wiki/").concat(title);
    },
    namespace: function namespace(ns) {
      if (ns !== undefined) {
        this.data.namespace = ns;
      }

      return this.data.namespace;
    },
    isRedirect: function isRedirect() {
      return this.data.type === 'redirect';
    },
    redirectTo: function redirectTo() {
      return this.data.redirectTo;
    },
    isDisambiguation: function isDisambiguation() {
      return disambig$1(this);
    },
    categories: function categories(clue) {
      if (typeof clue === 'number') {
        return this.data.categories[clue];
      }

      return this.data.categories || [];
    },
    sections: function sections(clue) {
      var _this = this;

      var arr = this.data.sections || [];
      arr.forEach(function (sec) {
        return sec.doc = _this;
      }); //grab a specific section, by its title

      if (typeof clue === 'string') {
        var str = clue.toLowerCase().trim();
        return arr.find(function (s) {
          return s.title().toLowerCase() === str;
        });
      }

      if (typeof clue === 'number') {
        return arr[clue];
      }

      return arr;
    },
    paragraphs: function paragraphs(n) {
      var arr = [];
      this.data.sections.forEach(function (s) {
        arr = arr.concat(s.paragraphs());
      });

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr;
    },
    paragraph: function paragraph(n) {
      var arr = this.paragraphs() || [];

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr[0];
    },
    sentences: function sentences(n) {
      var arr = [];
      this.sections().forEach(function (sec) {
        arr = arr.concat(sec.sentences());
      });

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr;
    },
    sentence: function sentence() {
      return this.sentences(0);
    },
    images: function images(clue) {
      var _this2 = this;

      var arr = _sectionMap(this, 'images', null); //grab image from infobox, first

      this.infoboxes().forEach(function (info) {
        var img = info.image();

        if (img) {
          arr.unshift(img); //put it at the top
        }
      }); //look for 'gallery' templates, too

      this.templates().forEach(function (obj) {
        if (obj.template === 'gallery') {
          obj.images = obj.images || [];
          obj.images.forEach(function (img) {
            if (img instanceof Image_1 === false) {
              img.language = _this2.language();
              img.domain = _this2.domain();
              img = new Image_1(img);
            }

            arr.push(img);
          });
        }
      });

      if (typeof clue === 'number') {
        return arr[clue];
      }

      return arr;
    },
    image: function image() {
      return this.images(0);
    },
    links: function links(clue) {
      return _sectionMap(this, 'links', clue);
    },
    interwiki: function interwiki(clue) {
      return _sectionMap(this, 'interwiki', clue);
    },
    lists: function lists(clue) {
      return _sectionMap(this, 'lists', clue);
    },
    tables: function tables(clue) {
      return _sectionMap(this, 'tables', clue);
    },
    templates: function templates(clue) {
      return _sectionMap(this, 'templates', clue);
    },
    references: function references(clue) {
      return _sectionMap(this, 'references', clue);
    },
    coordinates: function coordinates(clue) {
      return _sectionMap(this, 'coordinates', clue);
    },
    infoboxes: function infoboxes(clue) {
      var arr = _sectionMap(this, 'infoboxes'); //sort them by biggest-first

      arr = arr.sort(function (a, b) {
        if (Object.keys(a.data).length > Object.keys(b.data).length) {
          return -1;
        }

        return 1;
      });

      if (typeof clue === 'number') {
        return arr[clue];
      }

      return arr;
    },
    text: function text(options) {
      options = setDefaults_1(options, defaults$3); //nah, skip these.

      if (this.isRedirect() === true) {
        return '';
      }

      var arr = this.sections().map(function (sec) {
        return sec.text(options);
      });
      return arr.join('\n\n');
    },
    json: function json(options) {
      options = setDefaults_1(options, defaults$3);
      return toJson(this, options);
    },
    debug: function debug() {
      console.log('\n');
      this.sections().forEach(function (sec) {
        var indent = ' - ';

        for (var i = 0; i < sec.depth; i += 1) {
          indent = ' -' + indent;
        }

        console.log(indent + (sec.title() || '(Intro)'));
      });
      return this;
    }
  };

  var isArray$1 = function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }; //add singular-methods, too


  var plurals = ['sections', 'infoboxes', 'sentences', 'citations', 'references', 'coordinates', 'tables', 'lists', 'links', 'images', 'templates', 'categories'];
  plurals.forEach(function (fn) {
    var sing = fn.replace(/ies$/, 'y');
    sing = sing.replace(/oxes$/, 'ox');
    sing = sing.replace(/s$/, '');

    methods$1[sing] = function (n) {
      n = n || 0;
      var res = this[fn](n);

      if (isArray$1(res)) {
        return res[0];
      }

      return res;
    };
  });
  Object.keys(methods$1).forEach(function (k) {
    Document.prototype[k] = methods$1[k];
  }); //alias these ones

  Document.prototype.lang = Document.prototype.language;
  Document.prototype.ns = Document.prototype.namespace;
  Document.prototype.plaintext = Document.prototype.text;
  Document.prototype.isDisambig = Document.prototype.isDisambiguation;
  Document.prototype.citations = Document.prototype.references;
  Document.prototype.redirectsTo = Document.prototype.redirectTo;
  Document.prototype.redirect = Document.prototype.redirectTo;
  Document.prototype.redirects = Document.prototype.redirectTo;
  var Document_1 = Document;

  var categories = ['category', //en
  'abdeeling', //	pdc
  'bólkur', //	fo
  'catagóir', //	ga
  'categori', //	cy
  'categoria', 'categoria', //	co
  'categoría', //	es
  'categorîa', //	lij
  'categorìa', //	pms
  'catégorie', 'categorie', 'catègorie', //	frp
  'category', 'categuria', //	lmo
  'catigurìa', //	scn
  'class', //	kw
  'ẹ̀ka', //	yo
  'flocc', 'flocc', //	ang
  'flokkur', 'grup', //	tpi
  'jamii', //	sw
  'kaarangay', //	war
  'kateggoría', //	lad
  'kategooria', //	et
  'kategori', //	da
  'kategorî', //	ku
  'kategoria', //	eu
  'kategória', //	hu
  'kategorie', //de
  'kategoriija', //	se
  'kategorija', //	sl
  'kategorio', //	eo
  'kategoriya', 'kategoriýa', //	tk
  'kategoriye', //	diq
  'kategory', //	fy
  'kategorya', //	tl
  'kateqoriya', //	az
  'katiguriya', //	qu
  'klad', //	vo
  'luokka', 'ñemohenda', //	gn
  'roinn', //-seòrsa	gd
  'ronney', //	gv
  'rummad', //	br
  'setensele', //	nso
  'sokajy', //	mg
  'sumut', // atassuseq	kl
  'thể', // loại	vi
  'turkum', //	uz
  'категорија', 'категория', //	ru
  'категорія', //	uk
  'катэгорыя', 'төркем', //	tt
  'קטגוריה', //	he
  'تصنيف', 'تۈر', //	ug
  'رده', 'श्रेणी', 'श्रेणी', //	hi
  'বিষয়শ্রেণী', //	bn
  'หมวดหมู่', //	th
  '분류', //	ko
  '분류', //ko
  '分类' //	za
  //--
  ];

  var images = ['file', //en
  'image', //en
  'चित्र', //img
  'archivo', //es
  'attēls', //lv
  'berkas', //id
  'bestand', //nl
  'datei', //de
  'dosiero', //eo
  'dosya', //lad
  'fájl', //hu
  'fasciculus', //la
  'fichier', //fr
  'fil', //da
  'fitxategi', //eu
  'fitxer', //ca
  'gambar', //su
  'imagem', //pt
  'imej', //ms
  'immagine', //it
  'larawan', //tl
  'lêer', //af
  'plik', //pl
  'restr', //br
  'slika', //bs
  'wêne', //ku
  'wobraz', //dsb
  'выява', //be
  'податотека', //mk
  'слика', //sr
  'файл', //ru
  'სურათი', //ka
  'պատկեր', //hy
  'קובץ', //he
  'پرونده', //fa
  'دوتنه', //ps
  'ملف', //ar
  'وێنە', //ckb
  'चित्र', //hi
  'ไฟล์', //th
  '파일', //ko
  'ファイル' //ja
  ];

  var infoboxes = ['infobox', //en
  'anfo', //mwl
  'anuāmapa', //haw
  'bilgi kutusu', //tr
  'bilgi', //tr
  'bilgiquti', //uz
  'boaty', //mg
  'boestkelaouiñ', //br
  'bosca', //ga
  'capsa', //la
  'diehtokássa', //se
  'faktamall', //sv
  'ficha', //es
  'generalni', //hr
  'gwybodlen3', //cy
  'info', //pt
  'infobokis', //tpi
  'infoboks', //da
  'infochascha', //rm
  'infokašćik', //dsb
  'infokast', //et
  'infokutija', //bs
  'infolentelė', //lt
  'infopolje', //sl
  'informkesto', //eo
  'infoskreine', //ltg
  'infotaula', //eu
  'inligtingskas', 'inligtingskas3', //af
  'inligtingskas4', //af
  'kishtey', //gv
  'kotak', //su
  'tertcita', //jbo
  'tietolaatikko', //fi
  'yerleşim bilgi kutusu', 'ynfoboks', //fy
  'πλαίσιο', //el
  'акарточка', //ab
  'аҥа', //mhr
  'инфобокс', //kk
  'инфокутија', //sr
  'инфокутия', //bg
  'інфобокс', //rue
  'канадский', 'картка', //be
  'карточка', //ru
  'карточка2', //mdf
  'карточкарус', //ba
  'картуш', //koi
  'қуттӣ', //tg
  'ინფოდაფა', //ka
  'տեղեկաքարտ', //hy
  'אינפאקעסטל', //yi
  'תבנית', //he
  'بطاقة', //ar
  'ڄاڻخانو', //sd
  'خانہ', //ur
  'لغة', 'ज्ञानसन्दूक', //hi
  'তথ্যছক', //bn
  'ਜਾਣਕਾਰੀਡੱਬਾ', //pa
  'సమాచారపెట్టె', //te
  'තොරතුරුකොටුව', //si
  'กล่องข้อมูล', //th
  'ប្រអប់ព័ត៌មាន', //km
  '정보상자', //ko
  '明細' //zh_yue
  ];

  var redirects = ['adkas', //br
  'aýdaw', 'doorverwijzing', 'ohjaus', 'patrz', //pl
  'přesměruj', 'redirección', 'redireccion', 'redirección', //es
  'redirecionamento', //pt
  'redirect', //en
  'redirection', 'redirection', //fr
  'rinvia', //it
  'tilvísun', 'uudelleenohjaus', 'weiterleitung', 'weiterleitung', //de
  'yönlendi̇r', 'yönlendirme', 'yönlendi̇rme', //tr
  'ανακατευθυνση', //el
  'айдау', 'перанакіраваньне', 'перенаправлення', //uk
  'пренасочување', //mk
  'преусмери', 'преусмјери', 'تغییر_مسیر', 'تغییرمسیر', 'تغییرمسیر', //fa
  'เปลี่ยนทาง', //th
  'ប្តូរទីតាំងទៅ', //km
  '転送', //ja
  '重定向'];

  var references = ['references', 'reference', 'einzelnachweise', 'referencias', 'références', 'notes et références', '脚注', 'referenser', 'bronnen', 'примечания'];

  // and then manually on March 2020

  var i18n$1 = {
    categories: categories,
    disambig: disambig,
    images: images,
    infoboxes: infoboxes,
    redirects: redirects,
    references: references // specials: [
    //   'спэцыяльныя',
    //   'especial',
    //   'speciální',
    //   'spezial',
    //   'special',
    //   'ویژه',
    //   'toiminnot',
    //   'kerfissíða',
    //   'arnawlı',
    //   'spécial',
    //   'speciaal',
    //   'посебно',
    //   'özel',
    //   '特別'
    // ],
    // users: [
    //   'удзельнік',
    //   'usuari',
    //   'uživatel',
    //   'benutzer',
    //   'user',
    //   'usuario',
    //   'کاربر',
    //   'käyttäjä',
    //   'notandi',
    //   'paydalanıwshı',
    //   'utilisateur',
    //   'gebruiker',
    //   'корисник',
    //   'kullanıcı',
    //   '利用者'
    // ],
    // sources: [
    //   //blacklist these headings, as they're not plain-text
    //   'references',
    //   'see also',
    //   'external links',
    //   'further reading',
    //   'notes et références',
    //   'voir aussi',
    //   'liens externes',
    //   '参考文献', //references (ja)
    //   '脚注', //citations (ja)
    //   '関連項目', //see also (ja)
    //   '外部リンク' //external links (ja)
    // ]

  };

  var languages = {
    aa: 'Afar',
    //Afar
    ab: 'Аҧсуа',
    //Abkhazian
    af: 'Afrikaans',
    //Afrikaans
    ak: 'Akana',
    //Akan
    als: 'Alemannisch',
    //Alemannic
    am: 'አማርኛ',
    //Amharic
    an: 'Aragonés',
    //Aragonese
    ang: 'Englisc',
    //Anglo-Saxon
    ar: 'العربية',
    //Arabic
    arc: 'ܣܘܪܬ',
    //Aramaic
    as: 'অসমীয়া',
    //Assamese
    ast: 'Asturianu',
    //Asturian
    av: 'Авар',
    //Avar
    ay: 'Aymar',
    //Aymara
    az: 'Azərbaycanca',
    //Azerbaijani
    ba: 'Башҡорт',
    //Bashkir
    bar: 'Boarisch',
    //Bavarian
    'bat-smg': 'Žemaitėška',
    //Samogitian
    bcl: 'Bikol',
    //Bikol
    be: 'Беларуская',
    //Belarusian
    'be-x-old': 'ltr',
    //Belarusian
    bg: 'Български',
    //Bulgarian
    bh: 'भोजपुरी',
    //Bihari
    bi: 'Bislama',
    //Bislama
    bm: 'Bamanankan',
    //Bambara
    bn: 'বাংলা',
    //Bengali
    bo: 'བོད་ཡིག',
    //Tibetan
    bpy: 'ltr',
    //Bishnupriya
    br: 'Brezhoneg',
    //Breton
    bs: 'Bosanski',
    //Bosnian
    bug: 'ᨅᨔ',
    //Buginese
    bxr: 'ltr',
    //Buriat
    ca: 'Català',
    //Catalan
    cdo: 'Chinese',
    //Min
    ce: 'Нохчийн',
    //Chechen
    ceb: 'Sinugboanong',
    //Cebuano
    ch: 'Chamoru',
    //Chamorro
    cho: 'Choctaw',
    //Choctaw
    chr: 'ᏣᎳᎩ',
    //Cherokee
    chy: 'Tsetsêhestâhese',
    //Cheyenne
    co: 'Corsu',
    //Corsican
    cr: 'Nehiyaw',
    //Cree
    cs: 'Česky',
    //Czech
    csb: 'Kaszëbsczi',
    //Kashubian
    cu: 'Slavonic',
    //Old
    cv: 'Чăваш',
    //Chuvash
    cy: 'Cymraeg',
    //Welsh
    da: 'Dansk',
    //Danish
    de: 'Deutsch',
    //German
    diq: 'Zazaki',
    //Dimli
    dsb: 'ltr',
    //Lower
    dv: 'ދިވެހިބަސް',
    //Divehi
    dz: 'ཇོང་ཁ',
    //Dzongkha
    ee: 'Ɛʋɛ',
    //Ewe
    far: 'فارسی',
    //Farsi
    el: 'Ελληνικά',
    //Greek
    en: 'English',
    //English
    eo: 'Esperanto',
    //Esperanto
    es: 'Español',
    //Spanish
    et: 'Eesti',
    //Estonian
    eu: 'Euskara',
    //Basque
    ext: 'Estremeñu',
    //Extremaduran
    ff: 'Fulfulde',
    //Peul
    fi: 'Suomi',
    //Finnish
    'fiu-vro': 'Võro',
    //Võro
    fj: 'Na',
    //Fijian
    fo: 'Føroyskt',
    //Faroese
    fr: 'Français',
    //French
    frp: 'Arpitan',
    //Arpitan
    fur: 'Furlan',
    //Friulian
    fy: 'ltr',
    //West
    ga: 'Gaeilge',
    //Irish
    gan: 'ltr',
    //Gan
    gd: 'ltr',
    //Scottish
    gil: 'Taetae',
    //Gilbertese
    gl: 'Galego',
    //Galician
    gn: "Avañe'ẽ",
    //Guarani
    got: 'gutisk',
    //Gothic
    gu: 'ગુજરાતી',
    //Gujarati
    gv: 'Gaelg',
    //Manx
    ha: 'هَوُسَ',
    //Hausa
    hak: 'ltr',
    //Hakka
    haw: 'Hawai`i',
    //Hawaiian
    he: 'עברית',
    //Hebrew
    hi: 'हिन्दी',
    //Hindi
    ho: 'ltr',
    //Hiri
    hr: 'Hrvatski',
    //Croatian
    ht: 'Krèyol',
    //Haitian
    hu: 'Magyar',
    //Hungarian
    hy: 'Հայերեն',
    //Armenian
    hz: 'Otsiherero',
    //Herero
    ia: 'Interlingua',
    //Interlingua
    id: 'Bahasa',
    //Indonesian
    ie: 'Interlingue',
    //Interlingue
    ig: 'Igbo',
    //Igbo
    ii: 'ltr',
    //Sichuan
    ik: 'Iñupiak',
    //Inupiak
    ilo: 'Ilokano',
    //Ilokano
    io: 'Ido',
    //Ido
    is: 'Íslenska',
    //Icelandic
    it: 'Italiano',
    //Italian
    iu: 'ᐃᓄᒃᑎᑐᑦ',
    //Inuktitut
    ja: '日本語',
    //Japanese
    jbo: 'Lojban',
    //Lojban
    jv: 'Basa',
    //Javanese
    ka: 'ქართული',
    //Georgian
    kg: 'KiKongo',
    //Kongo
    ki: 'Gĩkũyũ',
    //Kikuyu
    kj: 'Kuanyama',
    //Kuanyama
    kk: 'Қазақша',
    //Kazakh
    kl: 'Kalaallisut',
    //Greenlandic
    km: 'ភាសាខ្មែរ',
    //Cambodian
    kn: 'ಕನ್ನಡ',
    //Kannada
    khw: 'کھوار',
    //Khowar
    ko: '한국어',
    //Korean
    kr: 'Kanuri',
    //Kanuri
    ks: 'कश्मीरी',
    //Kashmiri
    ksh: 'Ripoarisch',
    //Ripuarian
    ku: 'Kurdî',
    //Kurdish
    kv: 'Коми',
    //Komi
    kw: 'Kernewek',
    //Cornish
    ky: 'Kırgızca',
    //Kirghiz
    la: 'Latina',
    //Latin
    lad: 'Dzhudezmo',
    //Ladino
    lan: 'Leb',
    //Lango
    lb: 'Lëtzebuergesch',
    //Luxembourgish
    lg: 'Luganda',
    //Ganda
    li: 'Limburgs',
    //Limburgian
    lij: 'Líguru',
    //Ligurian
    lmo: 'Lumbaart',
    //Lombard
    ln: 'Lingála',
    //Lingala
    lo: 'ລາວ',
    //Laotian
    lt: 'Lietuvių',
    //Lithuanian
    lv: 'Latviešu',
    //Latvian
    'map-bms': 'Basa',
    //Banyumasan
    mg: 'Malagasy',
    //Malagasy
    man: '官話',
    //Mandarin
    mh: 'Kajin',
    //Marshallese
    mi: 'Māori',
    //Maori
    min: 'Minangkabau',
    //Minangkabau
    mk: 'Македонски',
    //Macedonian
    ml: 'മലയാളം',
    //Malayalam
    mn: 'Монгол',
    //Mongolian
    mo: 'Moldovenească',
    //Moldovan
    mr: 'मराठी',
    //Marathi
    ms: 'Bahasa',
    //Malay
    mt: 'bil-Malti',
    //Maltese
    mus: 'Muskogee',
    //Creek
    my: 'Myanmasa',
    //Burmese
    na: 'Dorerin',
    //Nauruan
    nah: 'Nahuatl',
    //Nahuatl
    nap: 'Nnapulitano',
    //Neapolitan
    nd: 'ltr',
    //North
    nds: 'Plattdüütsch',
    //Low German
    'nds-nl': 'Saxon',
    //Dutch
    ne: 'नेपाली',
    //Nepali
    "new": 'नेपालभाषा',
    //Newar
    ng: 'Oshiwambo',
    //Ndonga
    nl: 'Nederlands',
    //Dutch
    nn: 'ltr',
    //Norwegian
    no: 'Norsk',
    //Norwegian
    nr: 'ltr',
    //South
    nso: 'ltr',
    //Northern
    nrm: 'Nouormand',
    //Norman
    nv: 'Diné',
    //Navajo
    ny: 'Chi-Chewa',
    //Chichewa
    oc: 'Occitan',
    //Occitan
    oj: 'ᐊᓂᔑᓈᐯᒧᐎᓐ',
    //Ojibwa
    om: 'Oromoo',
    //Oromo
    or: 'ଓଡ଼ିଆ',
    //Oriya
    os: 'Иронау',
    //Ossetian
    pa: 'ਪੰਜਾਬੀ',
    //Panjabi
    pag: 'Pangasinan',
    //Pangasinan
    pam: 'Kapampangan',
    //Kapampangan
    pap: 'Papiamentu',
    //Papiamentu
    pdc: 'ltr',
    //Pennsylvania
    pi: 'Pāli',
    //Pali
    pih: 'Norfuk',
    //Norfolk
    pl: 'Polski',
    //Polish
    pms: 'Piemontèis',
    //Piedmontese
    ps: 'پښتو',
    //Pashto
    pt: 'Português',
    //Portuguese
    qu: 'Runa',
    //Quechua
    rm: 'ltr',
    //Raeto
    rmy: 'Romani',
    //Romani
    rn: 'Kirundi',
    //Kirundi
    ro: 'Română',
    //Romanian
    'roa-rup': 'Armâneashti',
    //Aromanian
    ru: 'Русский',
    //Russian
    rw: 'Kinyarwandi',
    //Rwandi
    sa: 'संस्कृतम्',
    //Sanskrit
    sc: 'Sardu',
    //Sardinian
    scn: 'Sicilianu',
    //Sicilian
    sco: 'Scots',
    //Scots
    sd: 'सिनधि',
    //Sindhi
    se: 'ltr',
    //Northern
    sg: 'Sängö',
    //Sango
    sh: 'Srpskohrvatski',
    //Serbo-Croatian
    si: 'සිංහල',
    //Sinhalese
    simple: 'ltr',
    //Simple
    sk: 'Slovenčina',
    //Slovak
    sl: 'Slovenščina',
    //Slovenian
    sm: 'Gagana',
    //Samoan
    sn: 'chiShona',
    //Shona
    so: 'Soomaaliga',
    //Somalia
    sq: 'Shqip',
    //Albanian
    sr: 'Српски',
    //Serbian
    ss: 'SiSwati',
    //Swati
    st: 'ltr',
    //Southern
    su: 'Basa',
    //Sundanese
    sv: 'Svenska',
    //Swedish
    sw: 'Kiswahili',
    //Swahili
    ta: 'தமிழ்',
    //Tamil
    te: 'తెలుగు',
    //Telugu
    tet: 'Tetun',
    //Tetum
    tg: 'Тоҷикӣ',
    //Tajik
    th: 'ไทย',
    //Thai
    ti: 'ትግርኛ',
    //Tigrinya
    tk: 'Туркмен',
    //Turkmen
    tl: 'Tagalog',
    //Tagalog
    tlh: 'tlhIngan-Hol',
    //Klingon
    tn: 'Setswana',
    //Tswana
    to: 'Lea',
    //Tonga
    tpi: 'ltr',
    //Tok
    tr: 'Türkçe',
    //Turkish
    ts: 'Xitsonga',
    //Tsonga
    tt: 'Tatarça',
    //Tatar
    tum: 'chiTumbuka',
    //Tumbuka
    tw: 'Twi',
    //Twi
    ty: 'Reo',
    //Tahitian
    udm: 'Удмурт',
    //Udmurt
    ug: 'Uyƣurqə',
    //Uyghur
    uk: 'Українська',
    //Ukrainian
    ur: 'اردو',
    //Urdu
    uz: 'Ўзбек',
    //Uzbek
    ve: 'Tshivenḓa',
    //Venda
    vi: 'Việtnam',
    //Vietnamese
    vec: 'Vèneto',
    //Venetian
    vls: 'ltr',
    //West
    vo: 'Volapük',
    //Volapük
    wa: 'Walon',
    //Walloon
    war: 'Winaray',
    //Waray-Waray
    wo: 'Wollof',
    //Wolof
    xal: 'Хальмг',
    //Kalmyk
    xh: 'isiXhosa',
    //Xhosa
    yi: 'ייִדיש',
    //Yiddish
    yo: 'Yorùbá',
    //Yoruba
    za: 'Cuengh',
    //Zhuang
    zh: '中文',
    //Chinese
    'zh-classical': 'ltr',
    //Classical
    'zh-min-nan': 'Bân-lâm-gú',
    //Minnan
    'zh-yue': '粵語',
    //Cantonese
    zu: 'isiZulu' //Zulu

  };

  var wp = '.wikipedia.org/wiki/$1';
  var wm = '.wikimedia.org/wiki/$1';
  var w = 'www.';
  var interwiki = {
    acronym: w + 'acronymfinder.com/$1.html',
    advisory: 'advisory' + wm,
    advogato: w + 'advogato.org/$1',
    aew: 'wiki.arabeyes.org/$1',
    appropedia: w + 'appropedia.org/$1',
    aquariumwiki: w + 'theaquariumwiki.com/$1',
    arborwiki: 'localwiki.org/ann-arbor/$1',
    arxiv: 'arxiv.org/abs/$1',
    atmwiki: w + 'otterstedt.de/wiki/index.php/$1',
    baden: w + 'stadtwiki-baden-baden.de/wiki/$1/',
    battlestarwiki: 'en.battlestarwiki.org/wiki/$1',
    bcnbio: 'historiapolitica.bcn.cl/resenas_parlamentarias/wiki/$1',
    beacha: w + 'beachapedia.org/$1',
    betawiki: 'translatewiki.net/wiki/$1',
    bibcode: 'adsabs.harvard.edu/abs/$1',
    bibliowiki: 'wikilivres.org/wiki/$1',
    bluwiki: 'bluwiki.com/go/$1',
    blw: 'britainloves' + wp,
    botwiki: 'botwiki.sno.cc/wiki/$1',
    boxrec: w + 'boxrec.com/media/index.php?$1',
    brickwiki: w + 'brickwiki.info/wiki/$1',
    bugzilla: 'bugzilla.wikimedia.org/show_bug.cgi?id=$1',
    bulba: 'bulbapedia.bulbagarden.net/wiki/$1',
    c: 'commons' + wm,
    c2: 'c2.com/cgi/wiki?$1',
    c2find: 'c2.com/cgi/wiki?FindPage&value=$1',
    cache: w + 'google.com/search?q=cache:$1',
    ĉej: 'esperanto.blahus.cz/cxej/vikio/index.php/$1',
    cellwiki: 'cell.wikia.com/wiki/$1',
    centralwikia: 'community.wikia.com/wiki/$1',
    chej: 'esperanto.blahus.cz/cxej/vikio/index.php/$1',
    choralwiki: w + 'cpdl.org/wiki/index.php/$1',
    citizendium: 'en.citizendium.org/wiki/$1',
    ckwiss: w + 'ck-wissen.de/ckwiki/index.php?title=$1',
    comixpedia: w + 'comixpedia.org/index.php?title=$1',
    commons: 'commons' + wm,
    communityscheme: 'community.schemewiki.org/?c=s&key=$1',
    communitywiki: 'communitywiki.org/$1',
    comune: 'rete.comuni-italiani.it/wiki/$1',
    creativecommons: 'creativecommons.org/licenses/$1',
    creativecommonswiki: 'wiki.creativecommons.org/$1',
    cxej: 'esperanto.blahus.cz/cxej/vikio/index.php/$1',
    dcc: w + 'dccwiki.com/$1',
    dcdatabase: 'dc.wikia.com/$1',
    dcma: 'christian-morgenstern.de/dcma/index.php?title=$1',
    debian: 'wiki.debian.org/$1',
    delicious: w + 'delicious.com/tag/$1',
    devmo: 'developer.mozilla.org/en/docs/$1',
    dictionary: w + 'dict.org/bin/Dict?Database=*&Form=Dict1&Strategy=*&Query=$1',
    dict: w + 'dict.org/bin/Dict?Database=*&Form=Dict1&Strategy=*&Query=$1',
    disinfopedia: 'sourcewatch.org/index.php/$1',
    distributedproofreaders: w + 'pgdp.net/wiki/$1',
    distributedproofreadersca: w + 'pgdpcanada.net/wiki/index.php/$1',
    dmoz: 'curlie.org/$1',
    dmozs: 'curlie.org/search?q=$1',
    doi: 'doi.org/$1',
    donate: 'donate' + wm,
    doom_wiki: 'doom.wikia.com/wiki/$1',
    download: 'releases.wikimedia.org/$1',
    dbdump: 'dumps.wikimedia.org/$1/latest/',
    dpd: 'lema.rae.es/dpd/?key=$1',
    drae: 'dle.rae.es/?w=$1',
    dreamhost: 'wiki.dreamhost.com/index.php/$1',
    drumcorpswiki: w + 'drumcorpswiki.com/index.php/$1',
    dwjwiki: w + 'suberic.net/cgi-bin/dwj/wiki.cgi?$1',
    eĉei: w + 'ikso.net/cgi-bin/wiki.pl?$1',
    ecoreality: w + 'EcoReality.org/wiki/$1',
    ecxei: w + 'ikso.net/cgi-bin/wiki.pl?$1',
    elibre: 'enciclopedia.us.es/index.php/$1',
    emacswiki: w + 'emacswiki.org/emacs?$1',
    encyc: 'encyc.org/wiki/$1',
    energiewiki: w + 'netzwerk-energieberater.de/wiki/index.php/$1',
    englyphwiki: 'en.glyphwiki.org/wiki/$1',
    enkol: 'enkol.pl/$1',
    eokulturcentro: 'esperanto.toulouse.free.fr/nova/wikini/wakka.php?wiki=$1',
    esolang: 'esolangs.org/wiki/$1',
    etherpad: 'etherpad.wikimedia.org/$1',
    ethnologue: w + 'ethnologue.com/language/$1',
    ethnologuefamily: w + 'ethnologue.com/show_family.asp?subid=$1',
    evowiki: 'wiki.cotch.net/index.php/$1',
    exotica: w + 'exotica.org.uk/wiki/$1',
    fanimutationwiki: 'wiki.animutationportal.com/index.php/$1',
    fedora: 'fedoraproject.org/wiki/$1',
    finalfantasy: 'finalfantasy.wikia.com/wiki/$1',
    finnix: w + 'finnix.org/$1',
    flickruser: w + 'flickr.com/people/$1',
    flickrphoto: w + 'flickr.com/photo.gne?id=$1',
    floralwiki: w + 'floralwiki.co.uk/wiki/$1',
    foldoc: 'foldoc.org/$1',
    foundation: 'foundation' + wm,
    foundationsite: 'wikimediafoundation.org/$1',
    foxwiki: 'fox.wikis.com/wc.dll?Wiki~$1',
    freebio: 'freebiology.org/wiki/$1',
    freebsdman: w + 'FreeBSD.org/cgi/man.cgi?apropos=1&query=$1',
    freeculturewiki: 'wiki.freeculture.org/index.php/$1',
    freedomdefined: 'freedomdefined.org/$1',
    freefeel: 'freefeel.org/wiki/$1',
    freekiwiki: 'wiki.freegeek.org/index.php/$1',
    // freenode: 'irc://irc.freenode.net/$1',
    freesoft: 'directory.fsf.org/wiki/$1',
    ganfyd: 'ganfyd.org/index.php?title=$1',
    gardenology: w + 'gardenology.org/wiki/$1',
    gausswiki: 'gauss.ffii.org/$1',
    gentoo: 'wiki.gentoo.org/wiki/$1',
    genwiki: 'wiki.genealogy.net/index.php/$1',
    gerrit: 'gerrit.wikimedia.org/r/$1',
    git: 'gerrit.wikimedia.org/g/$1',
    google: w + 'google.com/search?q=$1',
    googledefine: w + 'google.com/search?q=define:$1',
    googlegroups: 'groups.google.com/groups?q=$1',
    guildwarswiki: 'wiki.guildwars.com/wiki/$1',
    guildwiki: 'guildwars.wikia.com/wiki/$1',
    guc: 'tools.wmflabs.org/guc/?user=$1',
    gucprefix: 'tools.wmflabs.org/guc/?isPrefixPattern=1&src=rc&user=$1',
    gutenberg: w + 'gutenberg.org/etext/$1',
    gutenbergwiki: w + 'gutenberg.org/wiki/$1',
    hackerspaces: 'hackerspaces.org/wiki/$1',
    h2wiki: 'halowiki.net/p/$1',
    hammondwiki: w + 'dairiki.org/HammondWiki/index.php3?$1',
    hdl: 'hdl.handle.net/$1',
    heraldik: 'heraldik-wiki.de/wiki/$1',
    heroeswiki: 'heroeswiki.com/$1',
    horizonlabs: 'horizon.wikimedia.org/$1',
    hrwiki: w + 'hrwiki.org/index.php/$1',
    hrfwiki: 'fanstuff.hrwiki.org/index.php/$1',
    hupwiki: 'wiki.hup.hu/index.php/$1',
    iarchive: 'archive.org/details/$1',
    imdbname: w + 'imdb.com/name/nm$1/',
    imdbtitle: w + 'imdb.com/title/tt$1/',
    imdbcompany: w + 'imdb.com/company/co$1/',
    imdbcharacter: w + 'imdb.com/character/ch$1/',
    incubator: 'incubator' + wm,
    infosecpedia: 'infosecpedia.org/wiki/$1',
    infosphere: 'theinfosphere.org/$1',
    // irc: 'irc://irc.freenode.net/$1',
    // ircs: 'ircs://irc.freenode.net/$1',
    // ircrc: 'irc://irc.wikimedia.org/$1',
    // rcirc: 'irc://irc.wikimedia.org/$1',
    'iso639-3': 'iso639-3.sil.org/code/$1',
    issn: w + 'worldcat.org/issn/$1',
    iuridictum: 'iuridictum.pecina.cz/w/$1',
    jaglyphwiki: 'glyphwiki.org/wiki/$1',
    jefo: 'esperanto-jeunes.org/wiki/$1',
    jerseydatabase: 'jerseydatabase.com/wiki.php?id=$1',
    jira: 'jira.toolserver.org/browse/$1',
    jspwiki: w + 'ecyrd.com/JSPWiki/Wiki.jsp?page=$1',
    jstor: w + 'jstor.org/journals/$1',
    kamelo: 'kamelopedia.mormo.org/index.php/$1',
    karlsruhe: 'ka.stadtwiki.net/$1',
    kinowiki: 'kino.skripov.com/index.php/$1',
    komicawiki: 'wiki.komica.org/?$1',
    kontuwiki: 'kontu.wiki/$1',
    wikitech: 'wikitech' + wm,
    libreplanet: 'libreplanet.org/wiki/$1',
    linguistlist: 'linguistlist.org/forms/langs/LLDescription.cfm?code=$1',
    linuxwiki: w + 'linuxwiki.de/$1',
    linuxwikide: w + 'linuxwiki.de/$1',
    liswiki: 'liswiki.org/wiki/$1',
    literateprograms: 'en.literateprograms.org/$1',
    livepedia: w + 'livepedia.gr/index.php?title=$1',
    localwiki: 'localwiki.org/$1',
    lojban: 'mw.lojban.org/papri/$1',
    lostpedia: 'lostpedia.wikia.com/wiki/$1',
    lqwiki: 'wiki.linuxquestions.org/wiki/$1',
    luxo: 'tools.wmflabs.org/guc/?user=$1',
    mail: 'lists.wikimedia.org/mailman/listinfo/$1',
    mailarchive: 'lists.wikimedia.org/pipermail/$1',
    mariowiki: w + 'mariowiki.com/$1',
    marveldatabase: w + 'marveldatabase.com/wiki/index.php/$1',
    meatball: 'meatballwiki.org/wiki/$1',
    mw: w + 'mediawiki.org/wiki/$1',
    mediazilla: 'bugzilla.wikimedia.org/$1',
    memoryalpha: 'memory-alpha.fandom.com/wiki/$1',
    metawiki: 'meta' + wm,
    metawikimedia: 'meta' + wm,
    metawikipedia: 'meta' + wm,
    mineralienatlas: w + 'mineralienatlas.de/lexikon/index.php/$1',
    moinmoin: 'moinmo.in/$1',
    monstropedia: w + 'monstropedia.org/?title=$1',
    mosapedia: 'mosapedia.de/wiki/index.php/$1',
    mozcom: 'mozilla.wikia.com/wiki/$1',
    mozillawiki: 'wiki.mozilla.org/$1',
    mozillazinekb: 'kb.mozillazine.org/$1',
    musicbrainz: 'musicbrainz.org/doc/$1',
    mediawikiwiki: w + 'mediawiki.org/wiki/$1',
    mwod: w + 'merriam-webster.com/dictionary/$1',
    mwot: w + 'merriam-webster.com/thesaurus/$1',
    nkcells: w + 'nkcells.info/index.php?title=$1',
    nara: 'catalog.archives.gov/id/$1',
    nosmoke: 'no-smok.net/nsmk/$1',
    nost: 'nostalgia.' + wp,
    nostalgia: 'nostalgia.' + wp,
    oeis: 'oeis.org/$1',
    oldwikisource: 'wikisource.org/wiki/$1',
    olpc: 'wiki.laptop.org/go/$1',
    omegawiki: w + 'omegawiki.org/Expression:$1',
    onelook: w + 'onelook.com/?ls=b&w=$1',
    openlibrary: 'openlibrary.org/$1',
    openstreetmap: 'wiki.openstreetmap.org/wiki/$1',
    openwetware: 'openwetware.org/wiki/$1',
    opera7wiki: 'operawiki.info/$1',
    organicdesign: w + 'organicdesign.co.nz/$1',
    orthodoxwiki: 'orthodoxwiki.org/$1',
    osmwiki: 'wiki.openstreetmap.org/wiki/$1',
    otrs: 'ticket.wikimedia.org/otrs/index.pl?Action=AgentTicketZoom&TicketID=$1',
    otrswiki: 'otrs-wiki' + wm,
    ourmedia: w + 'socialtext.net/ourmedia/index.cgi?$1',
    outreach: 'outreach' + wm,
    outreachwiki: 'outreach' + wm,
    owasp: w + 'owasp.org/index.php/$1',
    panawiki: 'wiki.alairelibre.net/index.php?title=$1',
    patwiki: 'gauss.ffii.org/$1',
    personaltelco: 'personaltelco.net/wiki/$1',
    petscan: 'petscan.wmflabs.org/?psid=$1',
    phab: 'phabricator.wikimedia.org/$1',
    phabricator: 'phabricator.wikimedia.org/$1',
    phwiki: w + 'pocketheaven.com/ph/wiki/index.php?title=$1',
    phpwiki: 'phpwiki.sourceforge.net/phpwiki/index.php?$1',
    planetmath: 'planetmath.org/node/$1',
    pmeg: w + 'bertilow.com/pmeg/$1',
    pmid: w + 'ncbi.nlm.nih.gov/pubmed/$1?dopt=Abstract',
    pokewiki: 'pokewiki.de/$1',
    pokéwiki: 'pokewiki.de/$1',
    policy: 'policy.wikimedia.org/$1',
    proofwiki: w + 'proofwiki.org/wiki/$1',
    pyrev: w + 'mediawiki.org/wiki/Special:Code/pywikipedia/$1',
    pythoninfo: 'wiki.python.org/moin/$1',
    pythonwiki: w + 'pythonwiki.de/$1',
    pywiki: 'c2.com/cgi/wiki?$1',
    psycle: 'psycle.sourceforge.net/wiki/$1',
    quality: 'quality' + wm,
    quarry: 'quarry.wmflabs.org/$1',
    regiowiki: 'regiowiki.at/wiki/$1',
    rev: w + 'mediawiki.org/wiki/Special:Code/MediaWiki/$1',
    revo: 'purl.org/NET/voko/revo/art/$1.html',
    rfc: 'tools.ietf.org/html/rfc$1',
    rheinneckar: 'rhein-neckar-wiki.de/$1',
    robowiki: 'robowiki.net/?$1',
    rodovid: 'en.rodovid.org/wk/$1',
    reuterswiki: 'glossary.reuters.com/index.php/$1',
    rowiki: 'wiki.rennkuckuck.de/index.php/$1',
    rt: 'rt.wikimedia.org/Ticket/Display.html?id=$1',
    // rtfm: 'ftp://rtfm.mit.edu/pub/faqs/$1',
    s23wiki: 's23.org/wiki/$1',
    scholar: 'scholar.google.com/scholar?q=$1',
    schoolswp: 'schools-' + wp,
    scores: 'imslp.org/wiki/$1',
    scoutwiki: 'en.scoutwiki.org/$1',
    scramble: w + 'scramble.nl/wiki/index.php?title=$1',
    seapig: w + 'seapig.org/$1',
    seattlewiki: 'seattle.wikia.com/wiki/$1',
    slwiki: 'wiki.secondlife.com/wiki/$1',
    'semantic-mw': w + 'semantic-mediawiki.org/wiki/$1',
    senseislibrary: 'senseis.xmp.net/?$1',
    sharemap: 'sharemap.org/$1',
    silcode: w + 'sil.org/iso639-3/documentation.asp?id=$1',
    slashdot: 'slashdot.org/article.pl?sid=$1',
    sourceforge: 'sourceforge.net/$1',
    spcom: 'spcom' + wm,
    species: 'species' + wm,
    squeak: 'wiki.squeak.org/squeak/$1',
    stats: 'stats.wikimedia.org/$1',
    stewardry: 'tools.wmflabs.org/meta/stewardry/?wiki=$1',
    strategy: 'strategy' + wm,
    strategywiki: 'strategywiki.org/wiki/$1',
    sulutil: 'meta.wikimedia.org/wiki/Special:CentralAuth/$1',
    swtrain: 'train.spottingworld.com/$1',
    svn: 'svn.wikimedia.org/viewvc/mediawiki/$1?view=log',
    swinbrain: 'swinbrain.ict.swin.edu.au/wiki/$1',
    tabwiki: w + 'tabwiki.com/index.php/$1',
    tclerswiki: 'wiki.tcl.tk/$1',
    technorati: w + 'technorati.com/search/$1',
    tenwiki: 'ten.' + wp,
    testwiki: 'test.' + wp,
    testwikidata: 'test.wikidata.org/wiki/$1',
    test2wiki: 'test2.' + wp,
    tfwiki: 'tfwiki.net/wiki/$1',
    thelemapedia: w + 'thelemapedia.org/index.php/$1',
    theopedia: w + 'theopedia.com/$1',
    thinkwiki: w + 'thinkwiki.org/wiki/$1',
    ticket: 'ticket.wikimedia.org/otrs/index.pl?Action=AgentTicketZoom&TicketNumber=$1',
    tmbw: 'tmbw.net/wiki/$1',
    tmnet: w + 'technomanifestos.net/?$1',
    tmwiki: w + 'EasyTopicMaps.com/?page=$1',
    toolforge: 'tools.wmflabs.org/$1',
    toollabs: 'tools.wmflabs.org/$1',
    tools: 'toolserver.org/$1',
    tswiki: w + 'mediawiki.org/wiki/Toolserver:$1',
    translatewiki: 'translatewiki.net/wiki/$1',
    tviv: 'tviv.org/wiki/$1',
    tvtropes: w + 'tvtropes.org/pmwiki/pmwiki.php/Main/$1',
    twiki: 'twiki.org/cgi-bin/view/$1',
    tyvawiki: w + 'tyvawiki.org/wiki/$1',
    umap: 'umap.openstreetmap.fr/$1',
    uncyclopedia: 'en.uncyclopedia.co/wiki/$1',
    unihan: w + 'unicode.org/cgi-bin/GetUnihanData.pl?codepoint=$1',
    unreal: 'wiki.beyondunreal.com/wiki/$1',
    urbandict: w + 'urbandictionary.com/define.php?term=$1',
    usej: w + 'tejo.org/usej/$1',
    usemod: w + 'usemod.com/cgi-bin/wiki.pl?$1',
    usability: 'usability' + wm,
    utrs: 'utrs.wmflabs.org/appeal.php?id=$1',
    vikidia: 'fr.vikidia.org/wiki/$1',
    vlos: 'tusach.thuvienkhoahoc.com/wiki/$1',
    vkol: 'kol.coldfront.net/thekolwiki/index.php/$1',
    voipinfo: w + 'voip-info.org/wiki/view/$1',
    votewiki: 'vote' + wm,
    werelate: w + 'werelate.org/wiki/$1',
    wg: 'wg-en.' + wp,
    wikia: w + 'wikia.com/wiki/w:c:$1',
    wikiasite: w + 'wikia.com/wiki/w:c:$1',
    wikiapiary: 'wikiapiary.com/wiki/$1',
    wikibooks: 'en.wikibooks.org/wiki/$1',
    wikichristian: w + 'wikichristian.org/index.php?title=$1',
    wikicities: w + 'wikia.com/wiki/w:$1',
    wikicity: w + 'wikia.com/wiki/w:c:$1',
    wikiconference: 'wikiconference.org/wiki/$1',
    wikidata: w + 'wikidata.org/wiki/$1',
    wikif1: w + 'wikif1.org/$1',
    wikifur: 'en.wikifur.com/wiki/$1',
    wikihow: w + 'wikihow.com/$1',
    wikiindex: 'wikiindex.org/$1',
    wikilemon: 'wiki.illemonati.com/$1',
    wikilivres: 'wikilivres.org/wiki/$1',
    wikilivresru: 'wikilivres.ru/$1',
    'wikimac-de': 'apfelwiki.de/wiki/Main/$1',
    wikimedia: 'foundation' + wm,
    wikinews: 'en.wikinews.org/wiki/$1',
    wikinfo: 'wikinfo.org/w/index.php/$1',
    wikinvest: 'meta.wikimedia.org/wiki/Interwiki_map/discontinued#Wikinvest',
    wikiotics: 'wikiotics.org/$1',
    wikipapers: 'wikipapers.referata.com/wiki/$1',
    wikipedia: 'en.' + wp,
    wikipediawikipedia: 'en.wikipedia.org/wiki/Wikipedia:$1',
    wikiquote: 'en.wikiquote.org/wiki/$1',
    wikisophia: 'wikisophia.org/index.php?title=$1',
    wikisource: 'en.wikisource.org/wiki/$1',
    wikispecies: 'species' + wm,
    wikispot: 'wikispot.org/?action=gotowikipage&v=$1',
    wikiskripta: w + 'wikiskripta.eu/index.php/$1',
    labsconsole: 'wikitech' + wm,
    wikiti: 'wikiti.denglend.net/index.php?title=$1',
    wikiversity: 'en.wikiversity.org/wiki/$1',
    wikivoyage: 'en.wikivoyage.org/wiki/$1',
    betawikiversity: 'beta.wikiversity.org/wiki/$1',
    wikiwikiweb: 'c2.com/cgi/wiki?$1',
    wiktionary: 'en.wiktionary.org/wiki/$1',
    wipipedia: 'wipipedia.org/index.php/$1',
    wlug: w + 'wlug.org.nz/$1',
    wmam: 'am' + wm,
    wmar: w + 'wikimedia.org.ar/wiki/$1',
    wmat: 'mitglieder.wikimedia.at/$1',
    wmau: 'wikimedia.org.au/wiki/$1',
    wmbd: 'bd' + wm,
    wmbe: 'be' + wm,
    wmbr: 'br' + wm,
    wmca: 'ca' + wm,
    wmch: w + 'wikimedia.ch/$1',
    wmcl: w + 'wikimediachile.cl/index.php?title=$1',
    wmcn: 'cn' + wm,
    wmco: 'co' + wm,
    wmcz: w + 'wikimedia.cz/web/$1',
    wmdc: 'wikimediadc.org/wiki/$1',
    securewikidc: 'secure.wikidc.org/$1',
    wmde: 'wikimedia.de/wiki/$1',
    wmdk: 'dk' + wm,
    wmee: 'ee' + wm,
    wmec: 'ec' + wm,
    wmes: w + 'wikimedia.es/wiki/$1',
    wmet: 'ee' + wm,
    wmfdashboard: 'outreachdashboard.wmflabs.org/$1',
    wmfi: 'fi' + wm,
    wmfr: 'wikimedia.fr/$1',
    wmge: 'ge' + wm,
    wmhi: 'hi' + wm,
    wmhk: 'meta.wikimedia.org/wiki/Wikimedia_Hong_Kong',
    wmhu: 'wikimedia.hu/wiki/$1',
    wmid: 'id' + wm,
    wmil: w + 'wikimedia.org.il/$1',
    wmin: 'wiki.wikimedia.in/$1',
    wmit: 'wiki.wikimedia.it/wiki/$1',
    wmke: 'meta.wikimedia.org/wiki/Wikimedia_Kenya',
    wmmk: 'mk' + wm,
    wmmx: 'mx' + wm,
    wmnl: 'nl' + wm,
    wmnyc: 'nyc' + wm,
    wmno: 'no' + wm,
    'wmpa-us': 'pa-us' + wm,
    wmph: 'meta.wikimedia.org/wiki/Wikimedia_Philippines',
    wmpl: 'pl' + wm,
    wmpt: 'pt' + wm,
    wmpunjabi: 'punjabi' + wm,
    wmromd: 'romd' + wm,
    wmrs: 'rs' + wm,
    wmru: 'ru' + wm,
    wmse: 'se' + wm,
    wmsk: 'wikimedia.sk/$1',
    wmtr: 'tr' + wm,
    wmtw: 'wikimedia.tw/wiki/index.php5/$1',
    wmua: 'ua' + wm,
    wmuk: 'wikimedia.org.uk/wiki/$1',
    wmve: 'wikimedia.org.ve/wiki/$1',
    wmza: 'wikimedia.org.za/wiki/$1',
    wm2005: 'wikimania2005' + wm,
    wm2006: 'wikimania2006' + wm,
    wm2007: 'wikimania2007' + wm,
    wm2008: 'wikimania2008' + wm,
    wm2009: 'wikimania2009' + wm,
    wm2010: 'wikimania2010' + wm,
    wm2011: 'wikimania2011' + wm,
    wm2012: 'wikimania2012' + wm,
    wm2013: 'wikimania2013' + wm,
    wm2014: 'wikimania2014' + wm,
    wm2015: 'wikimania2015' + wm,
    wm2016: 'wikimania2016' + wm,
    wm2017: 'wikimania2017' + wm,
    wm2018: 'wikimania2018' + wm,
    wmania: 'wikimania' + wm,
    wikimania: 'wikimania' + wm,
    wmteam: 'wikimaniateam' + wm,
    wmf: 'foundation' + wm,
    wmfblog: 'blog.wikimedia.org/$1',
    wmdeblog: 'blog.wikimedia.de/$1',
    wookieepedia: 'starwars.wikia.com/wiki/$1',
    wowwiki: w + 'wowwiki.com/$1',
    wqy: 'wqy.sourceforge.net/cgi-bin/index.cgi?$1',
    wurmpedia: 'wurmpedia.com/index.php/$1',
    viaf: 'viaf.org/viaf/$1',
    zrhwiki: w + 'zrhwiki.ch/wiki/$1',
    zum: 'wiki.zum.de/$1',
    zwiki: w + 'zwiki.org/$1',
    m: 'meta' + wm,
    meta: 'meta' + wm,
    sep11: 'sep11.' + wp,
    d: w + 'wikidata.org/wiki/$1',
    minnan: 'zh-min-nan.' + wp,
    nb: 'no.' + wp,
    'zh-cfr': 'zh-min-nan.' + wp,
    'zh-cn': 'zh.' + wp,
    'zh-tw': 'zh.' + wp,
    nan: 'zh-min-nan.' + wp,
    vro: 'fiu-vro.' + wp,
    cmn: 'zh.' + wp,
    lzh: 'zh-classical.' + wp,
    rup: 'roa-rup.' + wp,
    gsw: 'als.' + wp,
    'be-tarask': 'be-x-old.' + wp,
    sgs: 'bat-smg.' + wp,
    egl: 'eml.' + wp,
    w: 'en.' + wp,
    wikt: 'en.wiktionary.org/wiki/$1',
    q: 'en.wikiquote.org/wiki/$1',
    b: 'en.wikibooks.org/wiki/$1',
    n: 'en.wikinews.org/wiki/$1',
    s: 'en.wikisource.org/wiki/$1',
    chapter: 'en' + wm,
    v: 'en.wikiversity.org/wiki/$1',
    voy: 'en.wikivoyage.org/wiki/$1'
  };

  //so we have to whitelist allowable interwiki links
  //add language prefixes too..

  Object.keys(languages).forEach(function (k) {
    interwiki[k] = k + '.wikipedia.org/wiki/$1';
  }); //this is predictably very complicated.
  // https://meta.wikimedia.org/wiki/Help:Interwiki_linking

  var parseInterwiki = function parseInterwiki(obj) {
    var str = obj.page || '';

    if (str.indexOf(':') !== -1) {
      var m = str.match(/^(.*):(.*)/);

      if (m === null) {
        return obj;
      }

      var site = m[1] || '';
      site = site.toLowerCase();

      if (site.indexOf(':') !== -1) {
        var _site$match = site.match(/^:?(.*):(.*)/),
            _site$match2 = _slicedToArray(_site$match, 3),
            wiki = _site$match2[1],
            lang = _site$match2[2]; //only allow interwikis to these specific places


        if (interwiki.hasOwnProperty(wiki) && languages.hasOwnProperty(lang) === false) {
          return obj;
        }

        obj.wiki = {
          wiki: wiki,
          lang: lang
        };
      } else {
        if (interwiki.hasOwnProperty(site) === false) {
          return obj;
        }

        obj.wiki = site;
      }

      obj.page = m[2];
    }

    return obj;
  };

  var interwiki$1 = parseInterwiki;

  var ignore_links = /^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media):/i;
  var external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]\| ]{4,1500})([\| ].*?)?\]/g;
  var link_reg = /\[\[(.{0,160}?)\]\]([a-z]+)?/gi; //allow dangling suffixes - "[[flanders]]s"

  var external_links = function external_links(links, str) {
    str.replace(external_link, function (raw, protocol, link, text) {
      text = text || '';
      links.push({
        type: 'external',
        site: protocol + link,
        text: text.trim(),
        raw: raw
      });
      return text;
    });
    return links;
  };

  var internal_links = function internal_links(links, str) {
    //regular links
    str.replace(link_reg, function (raw, s, suffix) {
      var txt = null; //make a copy of original

      var link = s;

      if (s.match(/\|/)) {
        //replacement link [[link|text]]
        s = s.replace(/\[\[(.{2,100}?)\]\](\w{0,10})/g, '$1$2'); //remove ['s and keep suffix

        link = s.replace(/(.{2,100})\|.{0,200}/, '$1'); //replaced links

        txt = s.replace(/.{2,100}?\|/, ''); //handle funky case of [[toronto|]]

        if (txt === null && link.match(/\|$/)) {
          link = link.replace(/\|$/, '');
          txt = link;
        }
      } //kill off non-wikipedia namespaces


      if (link.match(ignore_links)) {
        return s;
      } //kill off just these just-anchor links [[#history]]
      // if (link.match(/^#/i)) {
      //   console.log(s)
      //   return s
      // }
      //remove anchors from end [[toronto#history]]


      var obj = {
        page: link,
        raw: raw
      };
      obj.page = obj.page.replace(/#(.*)/, function (a, b) {
        obj.anchor = b;
        return '';
      }); //grab any fr:Paris parts

      obj = interwiki$1(obj);

      if (obj.wiki) {
        obj.type = 'interwiki';
      }

      if (txt !== null && txt !== obj.page) {
        obj.text = txt;
      } //finally, support [[link]]'s apostrophe


      if (suffix) {
        obj.text = obj.text || obj.page;
        obj.text += suffix.trim();
      } //titlecase it, if necessary


      if (obj.page && /^[A-Z]/.test(obj.page) === false) {
        if (!obj.text) {
          obj.text = obj.page;
        }

        obj.page = obj.page;
      }

      links.push(obj);
      return s;
    });
    return links;
  }; //grab an array of internal links in the text


  var parse_links = function parse_links(str) {
    var links = []; //first, parse external links

    links = external_links(links, str); //internal links

    links = internal_links(links, str);

    if (links.length === 0) {
      return undefined;
    }

    return links;
  };

  var parse = parse_links;

  var REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + i18n$1.redirects.join('|') + ') *?(\\[\\[.{2,180}?\\]\\])', 'i');

  var isRedirect = function isRedirect(wiki) {
    //too long to be a redirect?
    if (!wiki || wiki.length > 500) {
      return false;
    }

    return REDIRECT_REGEX.test(wiki);
  };

  var parse$1 = function parse$1(wiki) {
    var m = wiki.match(REDIRECT_REGEX);

    if (m && m[2]) {
      var links = parse(m[2]) || [];
      return links[0];
    }

    return {};
  };

  var redirects$1 = {
    isRedirect: isRedirect,
    parse: parse$1
  };

  //okay, i know you're not supposed to regex html, but...
  //https://en.wikipedia.org/wiki/Help:HTML_in_wikitext
  //these are things we throw-away
  //these will mess-up if they're nested, but they're not usually.
  var ignore = ['table', 'code', 'score', 'data', 'categorytree', 'charinsert', 'hiero', 'imagemap', 'inputbox', 'nowiki', 'poem', 'references', 'source', 'syntaxhighlight', 'timeline'];
  var openTag = "< ?(".concat(ignore.join('|'), ") ?[^>]{0,200}?>");
  var closeTag = "< ?/ ?(".concat(ignore.join('|'), ") ?>");
  var anyChar = '\\s\\S'; //including newline

  var noThanks = new RegExp("".concat(openTag, "[").concat(anyChar, "]+?").concat(closeTag), 'ig');

  var kill_xml = function kill_xml(wiki) {
    //(<ref> tags are parsed in Section class) - luckily, refs can't be recursive.
    //types of html/xml that we want to trash completely.
    wiki = wiki.replace(noThanks, ' '); //some xml-like fragments we can also kill

    wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=%\.#:;'" ]{2,100}\/? ?> ?/g, ' '); //<ref name="asd">
    //only kill ref tags if they are selfclosing

    wiki = wiki.replace(/ ?< ?(ref) [a-zA-Z0-9=" ]{2,100}\/ ?> ?/g, ' '); //<ref name="asd"/>
    // convert these html tags to known formatting

    wiki = wiki.replace(/<i>(.*?)<\/i>/g, "''$1''");
    wiki = wiki.replace(/<b>(.*?)<\/b>/g, "'''$1'''"); // these are better-handled with templates

    wiki = wiki.replace(/<sub>(.*?)<\/sub>/g, "{{sub|$1}}");
    wiki = wiki.replace(/<sup>(.*?)<\/sup>/g, "{{sup|$1}}"); //some formatting xml, we'll keep their insides though

    wiki = wiki.replace(/ ?<[ \/]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr)[ \/]?> ?/g, ' '); //<sub>, </sub>

    wiki = wiki.replace(/ ?<[ \/]?(abbr|bdi|bdo|blockquote|cite|del|dfn|em|ins|kbd|mark|q|s|small)[ \/]?> ?/g, ' '); //<abbr>, </abbr>

    wiki = wiki.replace(/ ?<[ \/]?h[0-9][ \/]?> ?/g, ' '); //<h2>, </h2>

    wiki = wiki.replace(/ ?< ?br ?\/> ?/g, '\n'); //<br />

    return wiki.trim();
  };

  var kill_xml_1 = kill_xml;

  function preProcess(doc) {
    var wiki = doc.wiki; //remove comments

    wiki = wiki.replace(/<!--[\s\S]{0,2000}?-->/g, '');
    wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, ''); //signitures

    wiki = wiki.replace(/~~{1,3}/g, ''); //windows newlines

    wiki = wiki.replace(/\r/g, ''); //japanese periods - '。'

    wiki = wiki.replace(/\u3002/g, '. '); //horizontal rule

    wiki = wiki.replace(/----/g, ''); //formatting for templates-in-templates...

    wiki = wiki.replace(/\{\{\}\}/g, ' – ');
    wiki = wiki.replace(/\{\{\\\}\}/g, ' / '); //space

    wiki = wiki.replace(/&nbsp;/g, ' '); //give it the inglorious send-off it deserves..

    wiki = kill_xml_1(wiki); //({{template}},{{template}}) leaves empty parentheses

    wiki = wiki.replace(/\([,;: ]+?\)/g, ''); //these templates just screw things up, too

    wiki = wiki.replace(/{{(baseball|basketball) (primary|secondary) (style|color).*?\}\}/i, '');
    doc.wiki = wiki;
  }

  var preProcess_1 = preProcess;

  // dumpster-dive throws everything into mongodb  - github.com/spencermountain/dumpster-dive
  // mongo has some opinions about what characters are allowed as keys and ids.
  //https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name/30254815#30254815
  var specialChar = /[\\\.$]/;

  var encodeStr = function encodeStr(str) {
    if (typeof str !== 'string') {
      str = '';
    }

    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/^\$/, "\\u0024");
    str = str.replace(/\./g, "\\u002e");
    return str;
  };

  var encodeObj = function encodeObj() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i += 1) {
      if (specialChar.test(keys[i]) === true) {
        var str = encodeStr(keys[i]);

        if (str !== keys[i]) {
          obj[str] = obj[keys[i]];
          delete obj[keys[i]];
        }
      }
    }

    return obj;
  };

  var encode = {
    encodeObj: encodeObj
  };

  var defaults$4 = {
    headers: true,
    depth: true,
    paragraphs: true,
    images: true,
    tables: true,
    templates: true,
    infoboxes: true,
    lists: true,
    references: true
  }; //

  var toJSON$1 = function toJSON(section, options) {
    options = setDefaults_1(options, defaults$4);
    var data = {};

    if (options.headers === true) {
      data.title = section.title();
    }

    if (options.depth === true) {
      data.depth = section.depth;
    } //these return objects


    if (options.paragraphs === true) {
      var paragraphs = section.paragraphs().map(function (p) {
        return p.json(options);
      });

      if (paragraphs.length > 0) {
        data.paragraphs = paragraphs;
      }
    } //image json data


    if (options.images === true) {
      var images = section.images().map(function (img) {
        return img.json(options);
      });

      if (images.length > 0) {
        data.images = images;
      }
    } //table json data


    if (options.tables === true) {
      var tables = section.tables().map(function (t) {
        return t.json(options);
      });

      if (tables.length > 0) {
        data.tables = tables;
      }
    } //template json data


    if (options.templates === true) {
      var templates = section.templates();

      if (templates.length > 0) {
        data.templates = templates; //encode them, for mongodb

        if (options.encode === true) {
          data.templates.forEach(function (t) {
            return encode.encodeObj(t);
          });
        }
      }
    } //infobox json data


    if (options.infoboxes === true) {
      var infoboxes = section.infoboxes().map(function (i) {
        return i.json(options);
      });

      if (infoboxes.length > 0) {
        data.infoboxes = infoboxes;
      }
    } //list json data


    if (options.lists === true) {
      var lists = section.lists().map(function (list) {
        return list.json(options);
      });

      if (lists.length > 0) {
        data.lists = lists;
      }
    } //list references - default true


    if (options.references === true || options.citations === true) {
      var references = section.references().map(function (ref) {
        return ref.json(options);
      });

      if (references.length > 0) {
        data.references = references;
      }
    } //default off


    if (options.sentences === true) {
      data.sentences = section.sentences().map(function (s) {
        return s.json(options);
      });
    }

    return data;
  };

  var toJson$2 = toJSON$1;

  var defaults$5 = {
    tables: true,
    references: true,
    paragraphs: true,
    templates: true,
    infoboxes: true
  }; //the stuff between headings - 'History' section for example

  var Section = function Section(data) {
    this.depth = data.depth;
    this.doc = null;
    this._title = data.title || '';
    Object.defineProperty(this, 'doc', {
      enumerable: false,
      value: null
    });
    data.templates = data.templates || [];
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$2 = {
    title: function title() {
      return this._title || '';
    },
    index: function index() {
      if (!this.doc) {
        return null;
      }

      var index = this.doc.sections().indexOf(this);

      if (index === -1) {
        return null;
      }

      return index;
    },
    indentation: function indentation() {
      return this.depth;
    },
    sentences: function sentences(n) {
      var arr = this.paragraphs().reduce(function (list, p) {
        return list.concat(p.sentences());
      }, []);

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr || [];
    },
    paragraphs: function paragraphs(n) {
      var arr = this.data.paragraphs || [];

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr || [];
    },
    paragraph: function paragraph(n) {
      var arr = this.data.paragraphs || [];

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr[0];
    },
    links: function links(n) {
      var arr = [];
      this.infoboxes().forEach(function (templ) {
        templ.links(n).forEach(function (link) {
          return arr.push(link);
        });
      });
      this.sentences().forEach(function (s) {
        s.links(n).forEach(function (link) {
          return arr.push(link);
        });
      });
      this.tables().forEach(function (t) {
        t.links(n).forEach(function (link) {
          return arr.push(link);
        });
      });
      this.lists().forEach(function (list) {
        list.links(n).forEach(function (link) {
          return arr.push(link);
        });
      });

      if (typeof n === 'number') {
        return arr[n];
      } else if (typeof n === 'string') {
        //grab a link like .links('Fortnight')
        n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

        var link = arr.find(function (o) {
          return o.page() === n;
        });
        return link === undefined ? [] : [link];
      }

      return arr;
    },
    tables: function tables(clue) {
      var arr = this.data.tables || [];

      if (typeof clue === 'number') {
        return arr[clue];
      }

      return arr;
    },
    templates: function templates(clue) {
      var arr = this.data.templates || [];
      arr = arr.map(function (t) {
        return t.json();
      });

      if (typeof clue === 'number') {
        return arr[clue];
      }

      if (typeof clue === 'string') {
        clue = clue.toLowerCase();
        return arr.filter(function (o) {
          return o.template === clue || o.name === clue;
        });
      }

      return arr;
    },
    infoboxes: function infoboxes(clue) {
      var arr = this.data.infoboxes || [];

      if (typeof clue === 'number') {
        return arr[clue];
      }

      return arr;
    },
    coordinates: function coordinates(clue) {
      var arr = [].concat(this.templates('coord'), this.templates('coor'));

      if (typeof clue === 'number') {
        if (!arr[clue]) {
          return [];
        }

        return arr[clue];
      }

      return arr;
    },
    lists: function lists(clue) {
      var arr = [];
      this.paragraphs().forEach(function (p) {
        arr = arr.concat(p.lists());
      });

      if (typeof clue === 'number') {
        return arr[clue];
      }

      return arr;
    },
    interwiki: function interwiki(num) {
      var arr = [];
      this.paragraphs().forEach(function (p) {
        arr = arr.concat(p.interwiki());
      });

      if (typeof num === 'number') {
        return arr[num];
      }

      return arr || [];
    },
    images: function images(clue) {
      var arr = [];
      this.paragraphs().forEach(function (p) {
        arr = arr.concat(p.images());
      });

      if (typeof clue === 'number') {
        return arr[clue];
      }

      return arr || [];
    },
    references: function references(clue) {
      var arr = this.data.references || [];

      if (typeof clue === 'number') {
        return arr[clue];
      }

      return arr;
    },
    //transformations
    remove: function remove() {
      if (!this.doc) {
        return null;
      }

      var bads = {};
      bads[this.title()] = true; //remove children too

      this.children().forEach(function (sec) {
        return bads[sec.title()] = true;
      });
      var arr = this.doc.data.sections;
      arr = arr.filter(function (sec) {
        return bads.hasOwnProperty(sec.title()) !== true;
      });
      this.doc.data.sections = arr;
      return this.doc;
    },
    //move-around sections like in jquery
    nextSibling: function nextSibling() {
      if (!this.doc) {
        return null;
      }

      var sections = this.doc.sections();
      var index = this.index();

      for (var i = index + 1; i < sections.length; i += 1) {
        if (sections[i].depth < this.depth) {
          return null;
        }

        if (sections[i].depth === this.depth) {
          return sections[i];
        }
      }

      return null;
    },
    lastSibling: function lastSibling() {
      if (!this.doc) {
        return null;
      }

      var sections = this.doc.sections();
      var index = this.index();
      return sections[index - 1] || null;
    },
    children: function children(n) {
      if (!this.doc) {
        return null;
      }

      var sections = this.doc.sections();
      var index = this.index();
      var children = []; //(immediately preceding sections with higher depth)

      if (sections[index + 1] && sections[index + 1].depth > this.depth) {
        for (var i = index + 1; i < sections.length; i += 1) {
          if (sections[i].depth > this.depth) {
            children.push(sections[i]);
          } else {
            break;
          }
        }
      }

      if (typeof n === 'string') {
        n = n.toLowerCase();
        return children.find(function (s) {
          return s.title().toLowerCase() === n;
        });
      }

      if (typeof n === 'number') {
        return children[n];
      }

      return children;
    },
    parent: function parent() {
      if (!this.doc) {
        return null;
      }

      var sections = this.doc.sections();
      var index = this.index();

      for (var i = index; i >= 0; i -= 1) {
        if (sections[i] && sections[i].depth < this.depth) {
          return sections[i];
        }
      }

      return null;
    },
    text: function text(options) {
      options = setDefaults_1(options, defaults$5);
      var pList = this.paragraphs();
      pList = pList.map(function (p) {
        return p.text(options);
      });
      return pList.join('\n\n');
    },
    json: function json(options) {
      options = setDefaults_1(options, defaults$5);
      return toJson$2(this, options);
    }
  }; //aliases

  methods$2.next = methods$2.nextSibling;
  methods$2.last = methods$2.lastSibling;
  methods$2.previousSibling = methods$2.lastSibling;
  methods$2.previous = methods$2.lastSibling;
  methods$2.citations = methods$2.references;
  methods$2.sections = methods$2.children;
  Object.keys(methods$2).forEach(function (k) {
    Section.prototype[k] = methods$2[k];
  });
  var Section_1 = Section;

  var helpers = {
    capitalise: function capitalise(str) {
      if (str && typeof str === 'string') {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      return '';
    },
    trim_whitespace: function trim_whitespace(str) {
      if (str && typeof str === 'string') {
        str = str.replace(/^\s\s*/, '');
        str = str.replace(/\s\s*$/, '');
        str = str.replace(/ {2}/, ' ');
        str = str.replace(/\s, /, ', ');
        return str;
      }

      return '';
    }
  };

  var defaults$6 = {
    type: 'internal'
  };

  var Link = function Link(data) {
    data = data || {};
    data = Object.assign({}, defaults$6, data); // console.log(data)

    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$3 = {
    text: function text(str) {
      if (str !== undefined) {
        this.data.text = str;
      }

      return this.data.text;
    },
    json: function json() {
      var obj = {
        text: this.text(),
        type: this.type()
      };

      if (obj.type === 'internal') {
        obj.page = this.page();
      } else if (obj.type === 'interwiki') {
        obj.wiki = this.wiki();
      } else {
        obj.site = this.site();
      }

      var anchor = this.anchor();

      if (anchor) {
        obj.anchor = anchor;
      }

      return obj;
    },
    page: function page(str) {
      if (str !== undefined) {
        this.data.page = str;
      }

      return this.data.page;
    },
    anchor: function anchor(str) {
      if (str !== undefined) {
        this.data.anchor = str;
      }

      return this.data.anchor || '';
    },
    wiki: function wiki(str) {
      if (str !== undefined) {
        this.data.wiki = str;
      }

      return this.data.wiki;
    },
    type: function type(str) {
      if (str !== undefined) {
        this.data.type = str;
      }

      return this.data.type;
    },
    site: function site(str) {
      if (str !== undefined) {
        this.data.site = str;
      }

      return this.data.site;
    },
    // create a url for any type of link
    href: function href() {
      var type = this.type();

      if (type === 'external') {
        return this.site();
      }

      var page = this.page();
      page = page.replace(/ /g, '_');
      page = encodeURIComponent(page);
      var url = '';

      if (type === 'interwiki') {
        var wiki = this.wiki();
        url = 'https://en.wikipedia.org/wiki/$1';

        if (interwiki.hasOwnProperty(wiki)) {
          url = 'http://' + interwiki[this.wiki()];
        }

        url = url.replace(/\$1/g, page);
      } else {
        //internal link
        url = "./".concat(this.page());
      } // add anchor on the end


      if (this.anchor()) {
        url += '#' + this.anchor();
      }

      return url;
    }
  };
  Object.keys(methods$3).forEach(function (k) {
    Link.prototype[k] = methods$3[k];
  });
  var Link_1 = Link;

  // const cat_reg = new RegExp('\\[\\[:?(' + i18n.categories.join('|') + '):[^\\]\\]]{2,80}\\]\\]', 'gi')
  //return only rendered text of wiki links

  var removeLinks = function removeLinks(line) {
    // [[File:with|Size]]
    line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$1');
    return line;
  };

  var getLinks = function getLinks(data) {
    var wiki = data.text;
    var links = parse(wiki) || [];
    data.links = links.map(function (link) {
      wiki = wiki.replace(link.raw, link.text || link.page || '');
      delete link.raw;
      return new Link_1(link);
    });
    wiki = removeLinks(wiki);
    data.text = wiki;
  };

  var link = getLinks;

  //handle the bold/italics
  var formatting = function formatting(obj) {
    var bolds = [];
    var italics = [];
    var wiki = obj.text || ''; //bold and italics combined 5 's

    wiki = wiki.replace(/'''''(.{0,200}?)'''''/g, function (a, b) {
      bolds.push(b);
      italics.push(b);
      return b;
    }); //''''four'''' → bold with quotes

    wiki = wiki.replace(/''''(.{0,200}?)''''/g, function (a, b) {
      bolds.push("'".concat(b, "'"));
      return "'".concat(b, "'");
    }); //'''bold'''

    wiki = wiki.replace(/'''(.{0,200}?)'''/g, function (a, b) {
      bolds.push(b);
      return b;
    }); //''italic''

    wiki = wiki.replace(/''(.{0,200}?)''/g, function (a, b) {
      italics.push(b);
      return b;
    }); //pack it all up..

    obj.text = wiki;

    if (bolds.length > 0) {
      obj.fmt = obj.fmt || {};
      obj.fmt.bold = bolds;
    }

    if (italics.length > 0) {
      obj.fmt = obj.fmt || {};
      obj.fmt.italic = italics;
    }

    return obj;
  };

  var formatting_1 = formatting;

  var isNumber = /^[0-9,.]+$/;
  var defaults$7 = {
    text: true,
    links: true,
    formatting: true,
    numbers: true
  };

  var toJSON$2 = function toJSON(s, options) {
    options = setDefaults_1(options, defaults$7);
    var data = {};
    var text = s.text();

    if (options.text === true) {
      data.text = text;
    } //add number field


    if (options.numbers === true && isNumber.test(text)) {
      var num = Number(text.replace(/,/g, ''));

      if (isNaN(num) === false) {
        data.number = num;
      }
    }

    if (options.links && s.links().length > 0) {
      data.links = s.links().map(function (l) {
        return l.json();
      });
    }

    if (options.formatting && s.data.fmt) {
      data.formatting = s.data.fmt;
    }

    return data;
  };

  var toJson$3 = toJSON$2;

  var Sentence = function Sentence(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$4 = {
    links: function links(n) {
      var arr = this.data.links || [];

      if (typeof n === 'number') {
        return arr[n];
      } else if (typeof n === 'string') {
        //grab a link like .links('Fortnight')
        n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

        var link = arr.find(function (o) {
          return o.page === n;
        });
        return link === undefined ? [] : [link];
      }

      return arr;
    },
    interwiki: function interwiki(n) {
      var arr = this.links().filter(function (l) {
        return l.wiki !== undefined;
      });

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr;
    },
    bolds: function bolds(n) {
      var arr = [];

      if (this.data && this.data.fmt && this.data.fmt.bold) {
        arr = this.data.fmt.bold || [];
      }

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr;
    },
    italics: function italics(n) {
      var arr = [];

      if (this.data && this.data.fmt && this.data.fmt.italic) {
        arr = this.data.fmt.italic || [];
      }

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr;
    },
    dates: function dates(n) {
      var arr = [];

      if (typeof n === 'number') {
        return arr[n];
      }

      return arr;
    },
    text: function text(str) {
      if (str !== undefined && typeof str === 'string') {
        //set the text?
        this.data.text = str;
      }

      return this.data.text || '';
    },
    json: function json(options) {
      return toJson$3(this, options);
    }
  };
  Object.keys(methods$4).forEach(function (k) {
    Sentence.prototype[k] = methods$4[k];
  });
  Sentence.prototype.italic = Sentence.prototype.italics;
  Sentence.prototype.bold = Sentence.prototype.bolds;
  Sentence.prototype.plaintext = Sentence.prototype.text;
  var Sentence_1 = Sentence;

  //these are used for the sentence-splitter
  var _abbreviations = ['ad', 'adj', 'adm', 'adv', 'al', 'alta', 'approx', 'apr', 'apt', 'arc', 'ariz', 'assn', 'asst', 'atty', 'aug', 'ave', 'ba', 'bc', 'bl', 'bldg', 'blvd', 'brig', 'bros', 'ca', 'cal', 'calif', 'capt', 'cca', 'cg', 'cl', 'cm', 'cmdr', 'co', 'col', 'colo', 'comdr', 'conn', 'corp', 'cpl', 'cres', 'ct', 'cyn', 'dak', 'dec', 'def', 'dept', 'det', 'dg', 'dist', 'dl', 'dm', 'dr', 'ea', 'eg', 'eng', 'esp', 'esq', 'est', 'etc', 'ex', 'exp', 'feb', 'fem', 'fig', 'fl oz', 'fl', 'fla', 'fm', 'fr', 'ft', 'fy', 'ga', 'gal', 'gb', 'gen', 'gov', 'hg', 'hon', 'hr', 'hrs', 'hwy', 'hz', 'ia', 'ida', 'ie', 'inc', 'inf', 'jan', 'jd', 'jr', 'jul', 'jun', 'kan', 'kans', 'kb', 'kg', 'km', 'kmph', 'lat', 'lb', 'lit', 'llb', 'lm', 'lng', 'lt', 'ltd', 'lx', 'ma', 'maj', 'mar', 'masc', 'mb', 'md', 'messrs', 'mg', 'mi', 'min', 'minn', 'misc', 'mister', 'ml', 'mlle', 'mm', 'mme', 'mph', 'mps', 'mr', 'mrs', 'ms', 'mstr', 'mt', 'neb', 'nebr', 'nee', 'no', 'nov', 'oct', 'okla', 'ont', 'op', 'ord', 'oz', 'pa', 'pd', 'penn', 'penna', 'phd', 'pl', 'pp', 'pref', 'prob', 'prof', 'pron', 'ps', 'psa', 'pseud', 'pt', 'pvt', 'qt', 'que', 'rb', 'rd', 'rep', 'reps', 'res', 'rev', 'sask', 'sec', 'sen', 'sens', 'sep', 'sept', 'sfc', 'sgt', 'sir', 'situ', 'sq ft', 'sq', 'sr', 'ss', 'st', 'supt', 'surg', 'tb', 'tbl', 'tbsp', 'tce', 'td', 'tel', 'temp', 'tenn', 'tex', 'tsp', 'univ', 'usafa', 'ut', 'va', 'vb', 'ver', 'vet', 'vitro', 'vivo', 'vol', 'vs', 'vt', 'wis', 'wisc', 'wr', 'wy', 'wyo', 'yb', 'µg'];

  //@spencermountain MIT
  //(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
  // Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
  // @spencermountain 2015 MIT

  var abbreviations = _abbreviations.concat('[^]][^]]');
  var abbrev_reg = new RegExp("(^| |')(" + abbreviations.join('|') + ")[.!?] ?$", 'i');
  var acronym_reg = new RegExp("[ |.|'|[][A-Z].? *?$", 'i');
  var elipses_reg = new RegExp('\\.\\.\\.* +?$');
  var circa_reg = / c\. $/;
  var hasWord = new RegExp('[a-zа-яぁ-ゟ][a-zа-яぁ-ゟ゠-ヿ]', 'iu'); //turn a nested array into one array

  var flatten = function flatten(arr) {
    var all = [];
    arr.forEach(function (a) {
      all = all.concat(a);
    });
    return all;
  };

  var naiive_split = function naiive_split(text) {
    //first, split by newline
    var splits = text.split(/(\n+)/);
    splits = splits.filter(function (s) {
      return s.match(/\S/);
    }); //split by period, question-mark, and exclamation-mark

    splits = splits.map(function (str) {
      return str.split(/(\S.+?[.!?]"?)(?=\s+|$)/g); //\u3002
    });
    return flatten(splits);
  }; // if this looks like a period within a wikipedia link, return false


  var isBalanced = function isBalanced(str) {
    str = str || '';
    var open = str.split(/\[\[/) || [];
    var closed = str.split(/\]\]/) || [];

    if (open.length > closed.length) {
      return false;
    } //make sure quotes are closed too


    var quotes = str.match(/"/g);

    if (quotes && quotes.length % 2 !== 0 && str.length < 900) {
      return false;
    }

    return true;
  };

  var sentence_parser = function sentence_parser(text) {
    var sentences = []; //first do a greedy-split..

    var chunks = []; //ensure it 'smells like' a sentence

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return sentences;
    } // This was the splitter regex updated to fix quoted punctuation marks.
    // let splits = text.split(/(\S.+?[.\?!])(?=\s+|$|")/g);
    // todo: look for side effects in this regex replacement:


    var splits = naiive_split(text); //filter-out the grap ones

    for (var i = 0; i < splits.length; i++) {
      var s = splits[i];

      if (!s || s === '') {
        continue;
      } //this is meaningful whitespace


      if (!s.match(/\S/)) {
        //add it to the last one
        if (chunks[chunks.length - 1]) {
          chunks[chunks.length - 1] += s;
          continue;
        } else if (splits[i + 1]) {
          //add it to the next one
          splits[i + 1] = s + splits[i + 1];
          continue;
        }
      }

      chunks.push(s);
    } //detection of non-sentence chunks


    var isSentence = function isSentence(hmm) {
      if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg) || hmm.match(circa_reg)) {
        return false;
      } //too short? - no consecutive letters


      if (hasWord.test(hmm) === false) {
        return false;
      }

      if (!isBalanced(hmm)) {
        return false;
      }

      return true;
    }; //loop through these chunks, and join the non-sentence chunks back together..


    for (var _i = 0; _i < chunks.length; _i++) {
      //should this chunk be combined with the next one?
      if (chunks[_i + 1] && !isSentence(chunks[_i])) {
        chunks[_i + 1] = chunks[_i] + (chunks[_i + 1] || ''); //.replace(/ +/g, ' ');
      } else if (chunks[_i] && chunks[_i].length > 0) {
        //this chunk is a proper sentence..
        sentences.push(chunks[_i]);
        chunks[_i] = '';
      }
    } //if we never got a sentence, return the given text


    if (sentences.length === 0) {
      return [text];
    }

    return sentences;
  };

  var parse$2 = sentence_parser;

  function postprocess(line) {
    //remove empty parentheses (sometimes caused by removing templates)
    line = line.replace(/\([,;: ]*\)/g, ''); //these semi-colons in parentheses are particularly troublesome

    line = line.replace(/\( *(; ?)+/g, '('); //dangling punctuation

    line = helpers.trim_whitespace(line);
    line = line.replace(/ +\.$/, '.');
    return line;
  } // returns one sentence object


  function fromText(str) {
    var obj = {
      text: str
    }; //pull-out the [[links]]

    link(obj);
    obj.text = postprocess(obj.text); //pull-out the bolds and ''italics''

    obj = formatting_1(obj); //pull-out things like {{start date|...}}

    return new Sentence_1(obj);
  } //used for consistency with other class-definitions


  var byParagraph = function byParagraph(paragraph) {
    // array of texts
    var sentences = parse$2(paragraph.wiki); // sentence objects

    sentences = sentences.map(fromText); //remove :indented first line, as it is often a disambiguation

    if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
      sentences = sentences.slice(1);
    }

    paragraph.sentences = sentences;
  };

  var _04Sentence = {
    fromText: fromText,
    byParagraph: byParagraph
  };

  //remove the top/bottom off the template
  var strip = function strip(tmpl) {
    tmpl = tmpl.replace(/^\{\{/, '');
    tmpl = tmpl.replace(/\}\}$/, '');
    return tmpl;
  };

  var _strip = strip;

  //normalize template names
  var fmtName = function fmtName(name) {
    name = (name || '').trim();
    name = name.toLowerCase();
    name = name.replace(/_/g, ' ');
    return name;
  };

  var _fmtName = fmtName;

  //turn {{name|one|two|three}} into [name, one, two, three]
  var pipeSplitter = function pipeSplitter(tmpl) {
    //start with a naiive '|' split
    var arr = tmpl.split(/\n?\|/); //we've split by '|', which is pretty lame
    //look for broken-up links and fix them :/

    arr.forEach(function (a, i) {
      if (a === null) {
        return;
      } //has '[[' but no ']]'
      //has equal number of openning and closing tags. handle nested case '[[[[' ']]'


      if (/\[\[[^\]]+$/.test(a) || /\{\{[^\}]+$/.test(a) || a.split('{{').length !== a.split('}}').length || a.split('[[').length !== a.split(']]').length) {
        arr[i + 1] = arr[i] + '|' + arr[i + 1];
        arr[i] = null;
      }
    }); //cleanup any mistakes we've made

    arr = arr.filter(function (a) {
      return a !== null;
    });
    arr = arr.map(function (a) {
      return (a || '').trim();
    }); //remove empty fields, only at the end:

    for (var i = arr.length - 1; i >= 0; i -= 1) {
      if (arr[i] === '') {
        arr.pop();
      }

      break;
    }

    return arr;
  };

  var _01PipeSplitter = pipeSplitter;

  // every value in {{tmpl|a|b|c}} needs a name
  // here we come up with names for them
  var hasKey = /^[ '-\)\x2D\.0-9_a-z\xC0-\xFF\u0153\u017F\u1E9E\u212A\u212B]+=/i; //templates with these properties are asking for trouble

  var reserved = {
    template: true,
    list: true,
    prototype: true
  }; //turn 'key=val' into {key:key, val:val}

  var parseKey = function parseKey(str) {
    var parts = str.split('=');
    var key = parts[0] || '';
    key = key.toLowerCase().trim();
    var val = parts.slice(1).join('='); //don't let it be called 'template'..

    if (reserved.hasOwnProperty(key)) {
      key = '_' + key;
    }

    return {
      key: key,
      val: val.trim()
    };
  }; //turn [a, b=v, c] into {'1':a, b:v, '2':c}


  var keyMaker = function keyMaker(arr, order) {
    var o = 0;
    return arr.reduce(function (h, str) {
      str = (str || '').trim(); //support named keys - 'foo=bar'

      if (hasKey.test(str) === true) {
        var res = parseKey(str);

        if (res.key) {
          h[res.key] = res.val;
          return h;
        }
      } //try a key from given 'order' names


      if (order && order[o]) {
        var key = order[o]; //here goes!

        h[key] = str;
      } else {
        h.list = h.list || [];
        h.list.push(str);
      }

      o += 1;
      return h;
    }, {});
  };

  var _02KeyMaker = keyMaker;

  var whoCares = {
    classname: true,
    style: true,
    align: true,
    margin: true,
    left: true,
    "break": true,
    boxsize: true,
    framestyle: true,
    item_style: true,
    collapsible: true,
    list_style_type: true,
    'list-style-type': true,
    colwidth: true
  }; //remove wiki-cruft & some styling info from templates

  var cleanup = function cleanup(obj) {
    Object.keys(obj).forEach(function (k) {
      if (whoCares[k.toLowerCase()] === true) {
        delete obj[k];
      } //remove empty values, too


      if (obj[k] === null || obj[k] === '') {
        delete obj[k];
      }
    });
    return obj;
  };

  var _03Cleanup = cleanup;

  var parseSentence = _04Sentence.fromText; // most templates just want plaintext...

  var makeFormat = function makeFormat(str, fmt) {
    var s = parseSentence(str); //support various output formats

    if (fmt === 'json') {
      return s.json();
    } else if (fmt === 'raw') {
      return s;
    } //default to flat text


    return s.text();
  }; //


  var parser = function parser(tmpl, order, fmt) {
    order = order || []; //renomove {{}}'s

    tmpl = _strip(tmpl || '');
    var arr = _01PipeSplitter(tmpl); //get template name

    var name = arr.shift(); //name each value

    var obj = _02KeyMaker(arr, order); //remove wiki-junk

    obj = _03Cleanup(obj); //is this a infobox/reference?
    // let known = isKnown(obj);
    //using '|1=content' is an escaping-thing..

    if (obj['1'] && order[0] && obj.hasOwnProperty(order[0]) === false) {
      //move it over..
      obj[order[0]] = obj['1'];
      delete obj['1'];
    }

    Object.keys(obj).forEach(function (k) {
      if (k === 'list') {
        obj[k] = obj[k].map(function (v) {
          return makeFormat(v, fmt);
        });
        return;
      }

      obj[k] = makeFormat(obj[k], fmt);
    }); //add the template name

    if (name) {
      obj.template = _fmtName(name);
    }

    return obj;
  };

  var parse$3 = parser;

  var Reference = function Reference(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$5 = {
    title: function title() {
      var data = this.data;
      return data.title || data.encyclopedia || data.author || '';
    },
    links: function links(n) {
      var arr = [];

      if (typeof n === 'number') {
        return arr[n];
      } //grab a specific link..


      if (typeof n === 'number') {
        return arr[n];
      } else if (typeof n === 'string') {
        //grab a link like .links('Fortnight')
        n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

        var link = arr.find(function (o) {
          return o.page() === n;
        });
        return link === undefined ? [] : [link];
      }

      return arr || [];
    },
    text: function text() {
      return ''; //nah, skip these.
    },
    json: function json() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var json = this.data || {}; //encode them, for mongodb

      if (options.encode === true) {
        json = Object.assign({}, json);
        json = encode.encodeObj(json);
      }

      return json;
    }
  };
  Object.keys(methods$5).forEach(function (k) {
    Reference.prototype[k] = methods$5[k];
  });
  var Reference_1 = Reference;

  var parseSentence$1 = _04Sentence.fromText; //structured Cite templates - <ref>{{Cite..</ref>

  var hasCitation = function hasCitation(str) {
    return /^ *?\{\{ *?(cite|citation)/i.test(str) && /\}\} *?$/.test(str) && /citation needed/i.test(str) === false;
  };

  var parseCitation = function parseCitation(tmpl) {
    var obj = parse$3(tmpl);
    obj.type = obj.template.replace(/cite /, '');
    obj.template = 'citation';
    return obj;
  }; //handle unstructured ones - <ref>some text</ref>


  var parseInline = function parseInline(str) {
    var obj = parseSentence$1(str) || {};
    return {
      template: 'citation',
      type: 'inline',
      data: {},
      inline: obj
    };
  }; // parse <ref></ref> xml tags


  var parseRefs = function parseRefs(section) {
    var references = [];
    var wiki = section.wiki;
    wiki = wiki.replace(/ ?<ref>([\s\S]{0,1800}?)<\/ref> ?/gi, function (a, tmpl) {
      if (hasCitation(tmpl)) {
        var obj = parseCitation(tmpl);

        if (obj) {
          references.push(obj);
        }

        wiki = wiki.replace(tmpl, '');
      } else {
        references.push(parseInline(tmpl));
      }

      return ' ';
    }); // <ref name=""/>

    wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' '); // <ref name=""></ref>

    wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1800}?)<\/ref> ?/gi, function (a, tmpl) {
      if (hasCitation(tmpl)) {
        var obj = parseCitation(tmpl);

        if (obj) {
          references.push(obj);
        }

        wiki = wiki.replace(tmpl, '');
      } else {
        references.push(parseInline(tmpl));
      }

      return ' ';
    }); //now that we're done with xml, do a generic + dangerous xml-tag removal

    wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ \/]?> ?/g, ' '); //<samp name="asd">

    section.references = references.map(function (r) {
      return new Reference_1(r);
    });
    section.wiki = wiki;
  };

  var reference = parseRefs;

  var parseSentence$2 = _04Sentence.fromText;
  var heading_reg = /^(={1,5})(.{1,200}?)={1,5}$/; //interpret depth, title of headings like '==See also=='

  var parseHeading = function parseHeading(section, str) {
    var m = str.match(heading_reg);

    if (!m) {
      section.title = '';
      section.depth = 0;
      return section;
    }

    var title = m[2] || '';
    title = parseSentence$2(title).text(); //amazingly, you can see inline {{templates}} in this text, too
    //... let's not think about that now.

    title = title.replace(/\{\{.+?\}\}/, ''); //same for references (i know..)

    var obj = {
      wiki: title
    };
    reference(obj);
    title = obj.wiki; //trim leading/trailing whitespace

    title = helpers.trim_whitespace(title);
    var depth = 0;

    if (m[1]) {
      depth = m[1].length - 2;
    }

    section.title = title;
    section.depth = depth;
    return section;
  };

  var heading = parseHeading;

  //remove top-bottoms
  var cleanup$1 = function cleanup(lines) {
    lines = lines.filter(function (line) {
      //a '|+' row is a 'table caption', remove it.
      return line && /^\|\+/.test(line) !== true;
    });

    if (/^{\|/.test(lines[0]) === true) {
      lines.shift();
    }

    if (/^\|}/.test(lines[lines.length - 1]) === true) {
      lines.pop();
    }

    if (/^\|-/.test(lines[0]) === true) {
      lines.shift();
    }

    return lines;
  }; //turn newline seperated into '|-' seperated


  var findRows = function findRows(lines) {
    var rows = [];
    var row = [];
    lines = cleanup$1(lines);

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i]; //'|-' is a row-seperator

      if (/^\|-/.test(line) === true) {
        //okay, we're done the row
        if (row.length > 0) {
          rows.push(row);
          row = [];
        }
      } else {
        //look for '||' inline row-splitter
        line = line.split(/(?:\|\||!!)/); //support newline -> '||'

        if (!line[0] && line[1]) {
          line.shift();
        }

        line.forEach(function (l) {
          l = l.replace(/^\| */, '');
          l = l.trim();
          row.push(l);
        });
      }
    } //finish the last one


    if (row.length > 0) {
      rows.push(row);
    }

    return rows;
  };

  var _findRows = findRows;

  var getRowSpan = /.*rowspan *?= *?["']?([0-9]+)["']?[ \|]*/;
  var getColSpan = /.*colspan *?= *?["']?([0-9]+)["']?[ \|]*/; //colspans stretch ←left/right→

  var doColSpan = function doColSpan(rows) {
    rows.forEach(function (row) {
      row.forEach(function (str, c) {
        var m = str.match(getColSpan);

        if (m !== null) {
          var num = parseInt(m[1], 10); //...maybe if num is so big, and centered, remove it?
          // if (num > 3) {
          //   rows[r] = []
          //   return
          // }
          //splice-in n empty columns right here

          row[c] = str.replace(getColSpan, '');

          for (var i = 1; i < num; i += 1) {
            row.splice(c + 1, 0, '');
          }
        }
      });
    });
    rows = rows.filter(function (r) {
      return r.length > 0;
    });
    return rows;
  }; //colspans stretch up/down


  var doRowSpan = function doRowSpan(rows) {
    rows.forEach(function (row, r) {
      row.forEach(function (str, c) {
        var m = str.match(getRowSpan);

        if (m !== null) {
          var num = parseInt(m[1], 10); //copy this cell down n rows

          str = str.replace(getRowSpan, '');
          row[c] = str;

          for (var i = r + 1; i < r + num; i += 1) {
            if (!rows[i]) {
              break;
            }

            rows[i].splice(c, 0, str);
          }
        }
      });
    });
    return rows;
  }; //


  var handleSpans = function handleSpans(rows) {
    rows = doColSpan(rows);
    rows = doRowSpan(rows);
    return rows;
  };

  var _spans = handleSpans;

  var parseSentence$3 = _04Sentence.fromText;
  var isHeading = /^!/; //common ones

  var headings = {
    name: true,
    age: true,
    born: true,
    date: true,
    year: true,
    city: true,
    country: true,
    population: true,
    count: true,
    number: true
  }; //additional table-cruft to remove before parseLine method

  var cleanText = function cleanText(str) {
    str = parseSentence$3(str).text(); //anything before a single-pipe is styling, so remove it

    if (str.match(/\|/)) {
      str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
    }

    str = str.replace(/style=['"].*?["']/, ''); //'!' is used as a highlighed-column

    str = str.replace(/^!/, '');
    str = str.trim();
    return str;
  };

  var skipSpanRow = function skipSpanRow(row) {
    row = row || [];
    var len = row.length;
    var hasTxt = row.filter(function (str) {
      return str;
    }).length; //does it have 3 empty spaces?

    if (len - hasTxt > 3) {
      return true;
    }

    return false;
  }; //remove non-header span rows


  var removeMidSpans = function removeMidSpans(rows) {
    rows = rows.filter(function (row) {
      if (row.length === 1 && row[0] && isHeading.test(row[0]) && /rowspan/i.test(row[0]) === false) {
        return false;
      }

      return true;
    });
    return rows;
  }; //'!' starts a header-row


  var findHeaders = function findHeaders() {
    var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var headers = []; // is the first-row just a ton of colspan?

    if (skipSpanRow(rows[0])) {
      rows.shift();
    }

    var first = rows[0];

    if (first && first[0] && first[1] && (/^!/.test(first[0]) || /^!/.test(first[1]))) {
      headers = first.map(function (h) {
        h = h.replace(/^\! */, '');
        h = cleanText(h);
        return h;
      });
      rows.shift();
    } //try the second row, too (overwrite first-row, if it exists)


    first = rows[0];

    if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
      first.forEach(function (h, i) {
        h = h.replace(/^\! */, '');
        h = cleanText(h);

        if (Boolean(h) === true) {
          headers[i] = h;
        }
      });
      rows.shift();
    }

    return headers;
  }; //turn headers, array into an object


  var parseRow = function parseRow(arr, headers) {
    var row = {};
    arr.forEach(function (str, i) {
      var h = headers[i] || 'col' + (i + 1);
      var s = parseSentence$3(str);
      s.text(cleanText(s.text()));
      row[h] = s;
    });
    return row;
  }; //should we use the first row as a the headers?


  var firstRowHeader = function firstRowHeader(rows) {
    if (rows.length <= 3) {
      return [];
    }

    var headers = rows[0].slice(0);
    headers = headers.map(function (h) {
      h = h.replace(/^\! */, '');
      h = parseSentence$3(h).text();
      h = cleanText(h);
      h = h.toLowerCase();
      return h;
    });

    for (var i = 0; i < headers.length; i += 1) {
      if (headings.hasOwnProperty(headers[i])) {
        rows.shift();
        return headers;
      }
    }

    return [];
  }; //turn a {|...table string into an array of arrays


  var parseTable = function parseTable(wiki) {
    var lines = wiki.replace(/\r/g, '').replace(/\n(\s*[^|!{\s])/g, ' $1') //remove unecessary newlines
    .split(/\n/).map(function (l) {
      return l.trim();
    });
    var rows = _findRows(lines);
    rows = rows.filter(function (r) {
      return r;
    });

    if (rows.length === 0) {
      return [];
    } //remove non-header span rows


    rows = removeMidSpans(rows); //support colspan, rowspan...

    rows = _spans(rows); //grab the header rows

    var headers = findHeaders(rows);

    if (!headers || headers.length <= 1) {
      headers = firstRowHeader(rows);
      var want = rows[rows.length - 1] || []; //try the second row

      if (headers.length <= 1 && want.length > 2) {
        headers = firstRowHeader(rows.slice(1));

        if (headers.length > 0) {
          rows = rows.slice(2); //remove them
        }
      }
    } //index each column by it's header


    var table = rows.map(function (arr) {
      return parseRow(arr, headers);
    });
    return table;
  };

  var parse$4 = parseTable;

  var toJson$4 = function toJson(tables, options) {
    return tables.map(function (table) {
      var row = {};
      Object.keys(table).forEach(function (k) {
        row[k] = table[k].json(); //(they're sentence objects)
      }); //encode them, for mongodb

      if (options.encode === true) {
        row = encode.encodeObj(row);
      }

      return row;
    });
  };

  var toJson_1$1 = toJson$4;

  var defaults$8 = {};

  var Table = function Table(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$6 = {
    links: function links(n) {
      var links = [];
      this.data.forEach(function (r) {
        Object.keys(r).forEach(function (k) {
          links = links.concat(r[k].links());
        });
      }); //grab a specific link..

      if (typeof n === 'number') {
        return links[n];
      } else if (typeof n === 'string') {
        //grab a link like .links('Fortnight')
        n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

        var link = links.find(function (o) {
          return o.page() === n;
        });
        return link === undefined ? [] : [link];
      }

      return links;
    },
    keyValue: function keyValue(options) {
      var rows = this.json(options);
      rows.forEach(function (row) {
        Object.keys(row).forEach(function (k) {
          row[k] = row[k].text;
        });
      });
      return rows;
    },
    json: function json(options) {
      options = setDefaults_1(options, defaults$8);
      return toJson_1$1(this.data, options);
    },
    text: function text() {
      return '';
    }
  };
  methods$6.keyvalue = methods$6.keyValue;
  methods$6.keyval = methods$6.keyValue;
  Object.keys(methods$6).forEach(function (k) {
    Table.prototype[k] = methods$6[k];
  });
  var Table_1 = Table;

  var openReg = /^\s*{\|/;
  var closeReg = /^\s*\|}/; //tables can be recursive, so looky-here.

  var findTables = function findTables(section) {
    var list = [];
    var wiki = section.wiki;
    var lines = wiki.split('\n');
    var stack = [];

    for (var i = 0; i < lines.length; i += 1) {
      //start a table
      if (openReg.test(lines[i]) === true) {
        stack.push(lines[i]);
        continue;
      } //close a table


      if (closeReg.test(lines[i]) === true) {
        stack[stack.length - 1] += '\n' + lines[i];

        var _table = stack.pop();

        list.push(_table);
        continue;
      } //keep-going on one


      if (stack.length > 0) {
        stack[stack.length - 1] += '\n' + lines[i];
      }
    } //work-em together for a Table class


    var tables = [];
    list.forEach(function (str) {
      if (str) {
        //also reremove a newline at the end of the table (awkward)
        wiki = wiki.replace(str + '\n', '');
        wiki = wiki.replace(str, '');
        var data = parse$4(str);

        if (data && data.length > 0) {
          tables.push(new Table_1(data));
        }
      }
    });

    if (tables.length > 0) {
      section.tables = tables;
    }

    section.wiki = wiki;
  };

  var table = findTables;

  var defaults$9 = {
    sentences: true
  };

  var toJson$5 = function toJson(p, options) {
    options = setDefaults_1(options, defaults$9);
    var data = {};

    if (options.sentences === true) {
      data.sentences = p.sentences().map(function (s) {
        return s.json(options);
      });
    }

    return data;
  };

  var toJson_1$2 = toJson$5;

  var defaults$a = {
    sentences: true,
    lists: true,
    images: true
  };

  var Paragraph = function Paragraph(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$7 = {
    sentences: function sentences(num) {
      if (typeof num === 'number') {
        return this.data.sentences[num];
      }

      return this.data.sentences || [];
    },
    references: function references(num) {
      if (typeof num === 'number') {
        return this.data.references[num];
      }

      return this.data.references;
    },
    lists: function lists(num) {
      if (typeof num === 'number') {
        return this.data.lists[num];
      }

      return this.data.lists;
    },
    images: function images(num) {
      if (typeof num === 'number') {
        return this.data.images[num];
      }

      return this.data.images || [];
    },
    links: function links(n) {
      var arr = [];
      this.sentences().forEach(function (s) {
        arr = arr.concat(s.links(n));
      });

      if (typeof n === 'number') {
        return arr[n];
      } else if (typeof n === 'string') {
        //grab a specific link like .links('Fortnight')
        n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

        var link = arr.find(function (o) {
          return o.page() === n;
        });
        return link === undefined ? [] : [link];
      }

      return arr || [];
    },
    interwiki: function interwiki(num) {
      var arr = [];
      this.sentences().forEach(function (s) {
        arr = arr.concat(s.interwiki());
      });

      if (typeof num === 'number') {
        return arr[num];
      }

      return arr || [];
    },
    text: function text(options) {
      options = setDefaults_1(options, defaults$a);
      var str = this.sentences().map(function (s) {
        return s.text(options);
      }).join(' ');
      this.lists().forEach(function (list) {
        str += '\n' + list.text();
      });
      return str;
    },
    json: function json(options) {
      options = setDefaults_1(options, defaults$a);
      return toJson_1$2(this, options);
    }
  };
  methods$7.citations = methods$7.references;
  Object.keys(methods$7).forEach(function (k) {
    Paragraph.prototype[k] = methods$7[k];
  });
  var Paragraph_1 = Paragraph;

  //find all the pairs of '[[...[[..]]...]]' in the text
  //used to properly root out recursive template calls, [[.. [[...]] ]]
  //basically just adds open tags, and subtracts closing tags
  var opener = '[';
  var closer = ']';

  function nested_find(text) {
    var out = [];
    var last = [];
    var chars = text.split('');
    var open = 0;

    for (var i = 0; i < chars.length; i++) {
      var c = text[i]; //increment open tag

      if (c === opener) {
        open += 1;
      } //decrement close tag
      else if (c === closer) {
          open -= 1;

          if (open < 0) {
            open = 0;
          }
        } else if (last.length === 0) {
          // If we're not inside of a pair of delimiters, we can discard the current letter.
          // The return of this function is only used to extract images.
          continue;
        }

      last.push(c);

      if (open === 0 && last.length > 0) {
        //first, fix botched parse
        var open_count = 0;
        var close_count = 0;

        for (var j = 0; j < last.length; j++) {
          if (last[j] === opener) {
            open_count++;
          } else if (last[j] === closer) {
            close_count++;
          }
        } //is it botched?


        if (open_count > close_count) {
          last.push(closer);
        } //looks good, keep it


        out.push(last.join(''));
        last = [];
      }
    }

    return out;
  }

  var nested_find_1 = nested_find;

  var parseSentence$4 = _04Sentence.fromText; //regexes:

  var isFile = new RegExp('(' + i18n$1.images.join('|') + '):', 'i');
  var fileNames = "(".concat(i18n$1.images.join('|'), ")");
  var file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'iu'); //style directives for Wikipedia:Extended_image_syntax

  var imgLayouts = {
    thumb: true,
    thumbnail: true,
    border: true,
    right: true,
    left: true,
    center: true,
    top: true,
    bottom: true,
    none: true,
    upright: true,
    baseline: true,
    middle: true,
    sub: true,
    "super": true
  }; //images are usually [[image:my_pic.jpg]]

  var oneImage = function oneImage(img, doc) {
    var m = img.match(file_reg);

    if (m === null || !m[2]) {
      return null;
    }

    var file = "".concat(m[1], ":").concat(m[2] || '');
    file = file.trim(); //titlecase it

    var title = file.charAt(0).toUpperCase() + file.substring(1); //spaces to underscores

    title = title.replace(/ /g, '_');

    if (title) {
      var obj = {
        file: file,
        lang: doc.lang,
        domain: doc.domain
      }; //try to grab other metadata, too

      img = img.replace(/^\[\[/, '');
      img = img.replace(/\]\]$/, ''); //https://en.wikipedia.org/wiki/Wikipedia:Extended_image_syntax
      // - [[File:Name|Type|Border|Location|Alignment|Size|link=Link|alt=Alt|lang=Langtag|Caption]]

      var imgData = parse$3(img);
      var arr = imgData.list || []; //parse-out alt text, if explicitly given

      if (imgData.alt) {
        obj.alt = imgData.alt;
      } //remove 'thumb' and things


      arr = arr.filter(function (str) {
        return imgLayouts.hasOwnProperty(str) === false;
      });

      if (arr[arr.length - 1]) {
        obj.caption = parseSentence$4(arr[arr.length - 1]);
      }

      return new Image_1(obj);
    }

    return null;
  };

  var parseImages = function parseImages(paragraph, doc) {
    var wiki = paragraph.wiki; //parse+remove scary '[[ [[]] ]]' stuff

    var matches = nested_find_1(wiki);
    matches.forEach(function (s) {
      if (isFile.test(s) === true) {
        paragraph.images = paragraph.images || [];
        var img = oneImage(s, doc);

        if (img) {
          paragraph.images.push(img);
        }

        wiki = wiki.replace(s, '');
      }
    });
    paragraph.wiki = wiki;
  };

  var image = parseImages;

  var defaults$b = {};

  var toText = function toText(list, options) {
    return list.map(function (s) {
      var str = s.text(options);
      return ' * ' + str;
    }).join('\n');
  };

  var List = function List(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$8 = {
    lines: function lines() {
      return this.data;
    },
    links: function links(n) {
      var links = [];
      this.lines().forEach(function (s) {
        links = links.concat(s.links());
      });

      if (typeof n === 'number') {
        return links[n];
      } else if (typeof n === 'string') {
        //grab a link like .links('Fortnight')
        n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

        var link = links.find(function (o) {
          return o.page() === n;
        });
        return link === undefined ? [] : [link];
      }

      return links;
    },
    json: function json(options) {
      options = setDefaults_1(options, defaults$b);
      return this.lines().map(function (s) {
        return s.json(options);
      });
    },
    text: function text() {
      return toText(this.data);
    }
  };
  Object.keys(methods$8).forEach(function (k) {
    List.prototype[k] = methods$8[k];
  });
  var List_1 = List;

  var parseSentence$5 = _04Sentence.fromText;
  var list_reg = /^[#\*:;\|]+/;
  var bullet_reg = /^\*+[^:,\|]{4}/;
  var number_reg = /^ ?\#[^:,\|]{4}/;
  var has_word = /[a-z_0-9\]\}]/i; // does it start with a bullet point or something?

  var isList = function isList(line) {
    return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line);
  }; //make bullets/numbers into human-readable *'s


  var cleanList = function cleanList(list) {
    var number = 1;
    list = list.filter(function (l) {
      return l;
    });

    for (var i = 0; i < list.length; i++) {
      var line = list[i]; //add # numberings formatting

      if (line.match(number_reg)) {
        line = line.replace(/^ ?#*/, number + ') ');
        line = line + '\n';
        number += 1;
      } else if (line.match(list_reg)) {
        number = 1;
        line = line.replace(list_reg, '');
      }

      list[i] = parseSentence$5(line);
    }

    return list;
  };

  var grabList = function grabList(lines, i) {
    var sub = [];

    for (var o = i; o < lines.length; o++) {
      if (isList(lines[o])) {
        sub.push(lines[o]);
      } else {
        break;
      }
    }

    sub = sub.filter(function (a) {
      return a && has_word.test(a);
    });
    sub = cleanList(sub);
    return sub;
  };

  var parseList = function parseList(paragraph) {
    var wiki = paragraph.wiki;
    var lines = wiki.split(/\n/g); // lines = lines.filter(l => has_word.test(l));

    var lists = [];
    var theRest = [];

    for (var i = 0; i < lines.length; i++) {
      if (isList(lines[i])) {
        var sub = grabList(lines, i);

        if (sub.length > 0) {
          lists.push(sub);
          i += sub.length - 1;
        }
      } else {
        theRest.push(lines[i]);
      }
    }

    paragraph.lists = lists.map(function (l) {
      return new List_1(l);
    });
    paragraph.wiki = theRest.join('\n');
  };

  var list = parseList;

  var parseSentences = _04Sentence.byParagraph;
  var twoNewLines = /\r?\n\r?\n/;
  var parse$5 = {
    image: image,
    list: list
  };

  var parseParagraphs = function parseParagraphs(section, doc) {
    var wiki = section.wiki;
    var paragraphs = wiki.split(twoNewLines); //don't create empty paragraphs

    paragraphs = paragraphs.filter(function (p) {
      return p && p.trim().length > 0;
    });
    paragraphs = paragraphs.map(function (str) {
      var paragraph = {
        wiki: str,
        lists: [],
        sentences: [],
        images: []
      }; //parse the lists

      parse$5.list(paragraph); // parse images

      parse$5.image(paragraph, doc); //parse the sentences

      parseSentences(paragraph);
      return new Paragraph_1(paragraph);
    });
    section.wiki = wiki;
    section.paragraphs = paragraphs;
  };

  var _03Paragraph = parseParagraphs;

  var toJson$6 = function toJson(infobox, options) {
    var json = Object.keys(infobox.data).reduce(function (h, k) {
      if (infobox.data[k]) {
        h[k] = infobox.data[k].json();
      }

      return h;
    }, {}); //support mongo-encoding keys

    if (options.encode === true) {
      json = encode.encodeObj(json);
    }

    return json;
  };

  var toJson_1$3 = toJson$6;

  var normalize = function normalize(str) {
    str = str.toLowerCase();
    str = str.replace(/[-_]/g, ' ');
    return str.trim();
  }; //a formal key-value data table about a topic


  var Infobox = function Infobox(obj) {
    this._type = obj.type;
    this.domain = obj.domain;
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: obj.data
    });
  };

  var methods$9 = {
    type: function type() {
      return this._type;
    },
    links: function links(n) {
      var _this = this;

      var arr = [];
      Object.keys(this.data).forEach(function (k) {
        _this.data[k].links().forEach(function (l) {
          return arr.push(l);
        });
      });

      if (typeof n === 'number') {
        return arr[n];
      } else if (typeof n === 'string') {
        //grab a link like .links('Fortnight')
        n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

        var link = arr.find(function (o) {
          return o.page() === n;
        });
        return link === undefined ? [] : [link];
      }

      return arr;
    },
    image: function image() {
      var s = this.get('image') || this.get('image2') || this.get('logo');

      if (!s) {
        return null;
      }

      var obj = s.json();
      obj.file = obj.text;
      obj.text = '';
      obj.domain = this.domain; // add domain information for image

      return new Image_1(obj);
    },
    get: function get() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      key = normalize(key);
      var keys = Object.keys(this.data);

      for (var i = 0; i < keys.length; i += 1) {
        var tmp = normalize(keys[i]);

        if (key === tmp) {
          return this.data[keys[i]];
        }
      }

      return null;
    },
    text: function text() {
      return '';
    },
    json: function json(options) {
      options = options || {};
      return toJson_1$3(this, options);
    },
    keyValue: function keyValue() {
      var _this2 = this;

      return Object.keys(this.data).reduce(function (h, k) {
        if (_this2.data[k]) {
          h[k] = _this2.data[k].text();
        }

        return h;
      }, {});
    }
  }; //aliases

  Object.keys(methods$9).forEach(function (k) {
    Infobox.prototype[k] = methods$9[k];
  });
  Infobox.prototype.data = Infobox.prototype.keyValue;
  Infobox.prototype.template = Infobox.prototype.type;
  Infobox.prototype.images = Infobox.prototype.image;
  var Infobox_1 = Infobox;

  var open = '{';
  var close = '}'; //grab all first-level recursions of '{{...}}'

  var findFlat = function findFlat(wiki) {
    var depth = 0;
    var list = [];
    var carry = [];

    for (var i = wiki.indexOf(open); i !== -1 && i < wiki.length; depth > 0 ? i++ : i = wiki.indexOf(open, i + 1)) {
      var c = wiki[i]; //open it

      if (c === open) {
        depth += 1;
      } //close it


      if (depth > 0) {
        if (c === close) {
          depth -= 1;

          if (depth === 0) {
            carry.push(c);
            var tmpl = carry.join('');
            carry = []; //last check

            if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
              list.push(tmpl);
            }

            continue;
          }
        } //require two '{{' to open it


        if (depth === 1 && c !== open && c !== close) {
          depth = 0;
          carry = [];
          continue;
        }

        carry.push(c);
      }
    }

    return list;
  };

  var flat = findFlat;

  //templates are usually '{{name|stuff}}'

  var getName = function getName(tmpl) {
    var name = null; //{{name|foo}}

    if (/^\{\{[^\n]+\|/.test(tmpl)) {
      name = (tmpl.match(/^\{\{(.+?)\|/) || [])[1];
    } else if (tmpl.indexOf('\n') !== -1) {
      // {{name \n...
      name = (tmpl.match(/^\{\{(.+?)\n/) || [])[1];
    } else {
      //{{name here}}
      name = (tmpl.match(/^\{\{(.+?)\}\}$/) || [])[1];
    }

    if (name) {
      name = name.replace(/:.*/, '');
      name = _fmtName(name);
    }

    return name || null;
  };

  var _getName = getName;

  var hasTemplate = /\{\{/;

  var parseTemplate = function parseTemplate(tmpl) {
    // this is some unexplained Lua thing
    tmpl = tmpl.replace(/#invoke:/, '');
    return {
      body: tmpl,
      name: _getName(tmpl),
      children: []
    };
  };

  var doEach = function doEach(obj) {
    // peel-off top-level
    var wiki = obj.body.substr(2);
    wiki = wiki.replace(/\}\}$/, ''); // get our child templates

    obj.children = flat(wiki);
    obj.children = obj.children.map(parseTemplate);

    if (obj.children.length === 0) {
      return obj;
    } // recurse through children


    obj.children.forEach(function (ch) {
      var inside = ch.body.substr(2);

      if (hasTemplate.test(inside)) {
        return doEach(ch); //keep going
      }

      return null;
    });
    return obj;
  }; // return a nested structure of all templates


  var findTemplates = function findTemplates(wiki) {
    var list = flat(wiki);
    list = list.map(parseTemplate);
    list = list.map(doEach);
    return list;
  };

  var find = findTemplates;

  //we explicitly ignore these, because they sometimes have resolve some data
  var list$1 = [//https://en.wikipedia.org/wiki/category:templates_with_no_visible_output
  'anchor', 'defaultsort', 'use list-defined references', 'void', //https://en.wikipedia.org/wiki/Category:Protection_templates
  'pp', 'pp-move-indef', 'pp-semi-indef', 'pp-vandalism', //https://en.wikipedia.org/wiki/Template:R
  'r', //out-of-scope still - https://en.wikipedia.org/wiki/Template:Tag
  '#tag', //https://en.wikipedia.org/wiki/Template:Navboxes
  // 'navboxes',
  // 'reflist',
  // 'ref-list',
  'div col', // 'authority control',
  //https://en.wikipedia.org/wiki/Template:Citation_needed
  // 'better source',
  // 'citation needed',
  // 'clarify',
  // 'cite quote',
  // 'dead link',
  // 'by whom',
  // 'dubious',
  // 'when',
  // 'who',
  // 'quantify',
  // 'refimprove',
  // 'weasel inline',
  //https://en.wikipedia.org/wiki/Template:End
  'pope list end', 'shipwreck list end', 'starbox end', 'end box', 'end', 's-end'];
  var ignore$1 = list$1.reduce(function (h, str) {
    h[str] = true;
    return h;
  }, {});
  var _ignore = ignore$1;

  var i18nReg = new RegExp('^(subst.)?(' + i18n$1.infoboxes.join('|') + ')[: \n]', 'i'); //some looser ones

  var startReg = /^infobox /i;
  var endReg = / infobox$/i;
  var yearIn = /$Year in [A-Z]/i; //some known ones from
  // https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
  // and https://en.wikipedia.org/wiki/Category:Infobox_templates

  var known = {
    'gnf protein box': true,
    'automatic taxobox': true,
    'chembox ': true,
    editnotice: true,
    geobox: true,
    hybridbox: true,
    ichnobox: true,
    infraspeciesbox: true,
    mycomorphbox: true,
    oobox: true,
    'paraphyletic group': true,
    speciesbox: true,
    subspeciesbox: true,
    'starbox short': true,
    taxobox: true,
    nhlteamseason: true,
    'asian games bid': true,
    'canadian federal election results': true,
    'dc thomson comic strip': true,
    'daytona 24 races': true,
    edencharacter: true,
    'moldova national football team results': true,
    samurai: true,
    protein: true,
    'sheet authority': true,
    'order-of-approx': true,
    'bacterial labs': true,
    'medical resources': true,
    ordination: true,
    'hockey team coach': true,
    'hockey team gm': true,
    'pro hockey team': true,
    'hockey team player': true,
    'hockey team start': true,
    mlbbioret: true
  }; //

  var isInfobox = function isInfobox(name) {
    // known
    if (known.hasOwnProperty(name) === true) {
      return true;
    }

    if (i18nReg.test(name)) {
      return true;
    }

    if (startReg.test(name) || endReg.test(name)) {
      return true;
    } //these are also infoboxes: 'Year in Belarus'


    if (yearIn.test(name)) {
      return true;
    }

    return false;
  }; //turns template data into good inforbox data


  var fmtInfobox = function fmtInfobox() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var m = obj.template.match(i18nReg);
    var type = obj.template;

    if (m && m[0]) {
      type = type.replace(m[0], '');
    }

    type = type.trim();
    var infobox = {
      template: 'infobox',
      type: type,
      data: obj
    };
    delete infobox.data.template; // already have this.

    delete infobox.data.list; //just in case!

    return infobox;
  };

  var _infobox = {
    isInfobox: isInfobox,
    format: fmtInfobox
  };

  var _months = [undefined, //1-based months.. :/
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var monthName = _months.reduce(function (h, str, i) {
    if (i === 0) {
      return h;
    }

    h[str.toLowerCase()] = i;
    return h;
  }, {}); //parse year|month|date numbers

  var ymd = function ymd(arr) {
    var obj = {};
    var units = ['year', 'month', 'date', 'hour', 'minute', 'second']; //parse each unit in sequence..

    for (var i = 0; i < units.length; i += 1) {
      //skip it
      if (!arr[i] && arr[1] !== 0) {
        continue;
      }

      var num = parseInt(arr[i], 10);

      if (isNaN(num) === false) {
        obj[units[i]] = num; //we good.
      } else if (units[i] === 'month' && monthName.hasOwnProperty(arr[i])) {
        //try for month-name, like 'january
        var month = monthName[arr[i]];
        obj[units[i]] = month;
      } else {
        //we dead. so skip this unit
        delete obj[units[i]];
      }
    } //try for timezone,too ftw


    var last = arr[arr.length - 1] || '';
    last = String(last);

    if (last.toLowerCase() === 'z') {
      obj.tz = 'UTC';
    } else if (/[+-][0-9]+:[0-9]/.test(last)) {
      obj.tz = arr[6];
    }

    return obj;
  }; //zero-pad a number


  var pad = function pad(num) {
    if (num < 10) {
      return '0' + num;
    }

    return String(num);
  };

  var toText$1 = function toText(date) {
    //eg '1995'
    var str = String(date.year || '');

    if (date.month !== undefined && _months.hasOwnProperty(date.month) === true) {
      if (date.date === undefined) {
        //January 1995
        str = "".concat(_months[date.month], " ").concat(date.year);
      } else {
        //January 5, 1995
        str = "".concat(_months[date.month], " ").concat(date.date, ", ").concat(date.year); //add times, if available

        if (date.hour !== undefined && date.minute !== undefined) {
          var time = "".concat(pad(date.hour), ":").concat(pad(date.minute));

          if (date.second !== undefined) {
            time = time + ':' + pad(date.second);
          }

          str = time + ', ' + str; //add timezone, if there, at the end in brackets
        }

        if (date.tz) {
          str += " (".concat(date.tz, ")");
        }
      }
    }

    return str;
  };

  var _format = {
    toText: toText$1,
    ymd: ymd
  }; // console.log(toText(ymd([2018, 3, 28])));

  var misc = {
    reign: function reign(tmpl) {
      var order = ['start', 'end'];
      var obj = parse$3(tmpl, order);
      return "(r. ".concat(obj.start, " \u2013 ").concat(obj.end, ")");
    },
    circa: function circa(tmpl) {
      var obj = parse$3(tmpl, ['year']);
      return "c.\u2009".concat(obj.year);
    },
    //we can't do timezones, so fake this one a little bit
    //https://en.wikipedia.org/wiki/Template:Time
    time: function time() {
      var d = new Date();
      var obj = _format.ymd([d.getFullYear(), d.getMonth(), d.getDate()]);
      return _format.toText(obj);
    },
    monthname: 0,
    //https://en.wikipedia.org/wiki/Template:OldStyleDate
    oldstyledate: function oldstyledate(tmpl) {
      var order = ['date', 'year'];
      var obj = parse$3(tmpl, order);
      var str = obj.date;

      if (obj.year) {
        str += ' ' + obj.year;
      }

      return str;
    }
  };
  var misc_1 = misc;

  //this is allowed to be rough
  var day = 1000 * 60 * 60 * 24;
  var month = day * 30;
  var year = day * 365;

  var getEpoch = function getEpoch(obj) {
    return new Date("".concat(obj.year, "-").concat(obj.month || 0, "-").concat(obj.date || 1)).getTime();
  }; //very rough!


  var delta = function delta(from, to) {
    from = getEpoch(from);
    to = getEpoch(to);
    var diff = to - from;
    var obj = {}; //get years

    var years = Math.floor(diff / year, 10);

    if (years > 0) {
      obj.years = years;
      diff -= obj.years * year;
    } //get months


    var months = Math.floor(diff / month, 10);

    if (months > 0) {
      obj.months = months;
      diff -= obj.months * month;
    } //get days


    var days = Math.floor(diff / day, 10);

    if (days > 0) {
      obj.days = days; // diff -= (obj.days * day);
    }

    return obj;
  };

  var _delta = delta;

  var ymd$1 = _format.ymd;
  var toText$2 = _format.toText; //wrap it up as a template

  var template = function template(date) {
    return {
      template: 'date',
      data: date
    };
  };

  var getBoth = function getBoth(tmpl) {
    tmpl = _strip(tmpl);
    var arr = tmpl.split('|');
    var from = ymd$1(arr.slice(1, 4));
    var to = arr.slice(4, 7); //assume now, if 'to' is empty

    if (to.length === 0) {
      var d = new Date();
      to = [d.getFullYear(), d.getMonth(), d.getDate()];
    }

    to = ymd$1(to);
    return {
      from: from,
      to: to
    };
  };

  var parsers = {
    //generic {{date|year|month|date}} template
    date: function date(tmpl, list) {
      var order = ['year', 'month', 'date', 'hour', 'minute', 'second', 'timezone'];
      var obj = parse$3(tmpl, order);
      var data = ymd$1([obj.year, obj.month, obj.date || obj.day]);
      obj.text = toText$2(data); //make the replacement string

      if (obj.timezone) {
        if (obj.timezone === 'Z') {
          obj.timezone = 'UTC';
        }

        obj.text += " (".concat(obj.timezone, ")");
      }

      if (obj.hour && obj.minute) {
        if (obj.second) {
          obj.text = "".concat(obj.hour, ":").concat(obj.minute, ":").concat(obj.second, ", ") + obj.text;
        } else {
          obj.text = "".concat(obj.hour, ":").concat(obj.minute, ", ") + obj.text;
        }
      }

      if (obj.text) {
        list.push(template(obj));
      }

      return obj.text;
    },
    //support parsing of 'February 10, 1992'
    natural_date: function natural_date(tmpl, list) {
      var order = ['text'];
      var obj = parse$3(tmpl, order);
      var str = obj.text || ''; // - just a year

      var date = {};

      if (/^[0-9]{4}$/.test(str)) {
        date.year = parseInt(str, 10);
      } else {
        //parse the date, using the js date object (for now?)
        var txt = str.replace(/[a-z]+\/[a-z]+/i, '');
        txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i, '');
        var d = new Date(txt);

        if (isNaN(d.getTime()) === false) {
          date.year = d.getFullYear();
          date.month = d.getMonth() + 1;
          date.date = d.getDate();
        }
      }

      list.push(template(date));
      return str.trim();
    },
    //just grab the first value, and assume it's a year
    one_year: function one_year(tmpl, list) {
      var order = ['year'];
      var obj = parse$3(tmpl, order);
      var year = Number(obj.year);
      list.push(template({
        year: year
      }));
      return String(year);
    },
    //assume 'y|m|d' | 'y|m|d' // {{BirthDeathAge|B|1976|6|6|1990|8|8}}
    two_dates: function two_dates(tmpl, list) {
      var order = ['b', 'birth_year', 'birth_month', 'birth_date', 'death_year', 'death_month', 'death_date'];
      var obj = parse$3(tmpl, order); //'b' means show birth-date, otherwise show death-date

      if (obj.b && obj.b.toLowerCase() === 'b') {
        var _date = ymd$1([obj.birth_year, obj.birth_month, obj.birth_date]);

        list.push(template(_date));
        return toText$2(_date);
      }

      var date = ymd$1([obj.death_year, obj.death_month, obj.death_date]);
      list.push(template(date));
      return toText$2(date);
    },
    age: function age(tmpl) {
      var d = getBoth(tmpl);
      var diff = _delta(d.from, d.to);
      return diff.years || 0;
    },
    'diff-y': function diffY(tmpl) {
      var d = getBoth(tmpl);
      var diff = _delta(d.from, d.to);

      if (diff.years === 1) {
        return diff.years + ' year';
      }

      return (diff.years || 0) + ' years';
    },
    'diff-ym': function diffYm(tmpl) {
      var d = getBoth(tmpl);
      var diff = _delta(d.from, d.to);
      var arr = [];

      if (diff.years === 1) {
        arr.push(diff.years + ' year');
      } else if (diff.years && diff.years !== 0) {
        arr.push(diff.years + ' years');
      }

      if (diff.months === 1) {
        arr.push('1 month');
      } else if (diff.months && diff.months !== 0) {
        arr.push(diff.months + ' months');
      }

      return arr.join(', ');
    },
    'diff-ymd': function diffYmd(tmpl) {
      var d = getBoth(tmpl);
      var diff = _delta(d.from, d.to);
      var arr = [];

      if (diff.years === 1) {
        arr.push(diff.years + ' year');
      } else if (diff.years && diff.years !== 0) {
        arr.push(diff.years + ' years');
      }

      if (diff.months === 1) {
        arr.push('1 month');
      } else if (diff.months && diff.months !== 0) {
        arr.push(diff.months + ' months');
      }

      if (diff.days === 1) {
        arr.push('1 day');
      } else if (diff.days && diff.days !== 0) {
        arr.push(diff.days + ' days');
      }

      return arr.join(', ');
    },
    'diff-yd': function diffYd(tmpl) {
      var d = getBoth(tmpl);
      var diff = _delta(d.from, d.to);
      var arr = [];

      if (diff.years === 1) {
        arr.push(diff.years + ' year');
      } else if (diff.years && diff.years !== 0) {
        arr.push(diff.years + ' years');
      } //ergh...


      diff.days += (diff.months || 0) * 30;

      if (diff.days === 1) {
        arr.push('1 day');
      } else if (diff.days && diff.days !== 0) {
        arr.push(diff.days + ' days');
      }

      return arr.join(', ');
    },
    'diff-d': function diffD(tmpl) {
      var d = getBoth(tmpl);
      var diff = _delta(d.from, d.to);
      var arr = []; //ergh...

      diff.days += (diff.years || 0) * 365;
      diff.days += (diff.months || 0) * 30;

      if (diff.days === 1) {
        arr.push('1 day');
      } else if (diff.days && diff.days !== 0) {
        arr.push(diff.days + ' days');
      }

      return arr.join(', ');
    }
  };
  var parsers_1 = parsers;

  //not all too fancy - used in {{timesince}}
  var timeSince = function timeSince(str) {
    var d = new Date(str);

    if (isNaN(d.getTime())) {
      return '';
    }

    var now = new Date();
    var delta = now.getTime() - d.getTime();
    var predicate = 'ago';

    if (delta < 0) {
      predicate = 'from now';
      delta = Math.abs(delta);
    } //figure out units


    var hours = delta / 1000 / 60 / 60;
    var days = hours / 24;

    if (days < 365) {
      return parseInt(days, 10) + ' days ' + predicate;
    }

    var years = days / 365;
    return parseInt(years, 10) + ' years ' + predicate;
  };

  var _timeSince = timeSince;

  var date = parsers_1.date;
  var natural_date = parsers_1.natural_date;
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; //date- templates we support

  var dateTmpl = Object.assign({}, misc_1, {
    currentday: function currentday() {
      var d = new Date();
      return String(d.getDate());
    },
    currentdayname: function currentdayname() {
      var d = new Date();
      return days[d.getDay()];
    },
    currentmonth: function currentmonth() {
      var d = new Date();
      return months[d.getMonth()];
    },
    currentyear: function currentyear() {
      var d = new Date();
      return String(d.getFullYear());
    },
    monthyear: function monthyear() {
      var d = new Date();
      return months[d.getMonth()] + ' ' + d.getFullYear();
    },
    'monthyear-1': function monthyear1() {
      var d = new Date();
      d.setMonth(d.getMonth() - 1);
      return months[d.getMonth()] + ' ' + d.getFullYear();
    },
    'monthyear+1': function monthyear1() {
      var d = new Date();
      d.setMonth(d.getMonth() + 1);
      return months[d.getMonth()] + ' ' + d.getFullYear();
    },
    //Explictly-set dates - https://en.wikipedia.org/wiki/Template:Date
    date: 0,
    'time ago': function timeAgo(tmpl) {
      var order = ['date', 'fmt'];
      var time = parse$3(tmpl, order).date;
      return _timeSince(time);
    },
    //https://en.wikipedia.org/wiki/Template:Birth_date_and_age
    'birth date and age': function birthDateAndAge(tmpl, list) {
      var order = ['year', 'month', 'day'];
      var obj = parse$3(tmpl, order); //support 'one property' version

      if (obj.year && /[a-z]/i.test(obj.year)) {
        return natural_date(tmpl, list);
      }

      list.push(obj);
      obj = _format.ymd([obj.year, obj.month, obj.day]);
      return _format.toText(obj);
    },
    'birth year and age': function birthYearAndAge(tmpl, list) {
      var order = ['birth_year', 'birth_month'];
      var obj = parse$3(tmpl, order); //support 'one property' version

      if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
        return natural_date(tmpl, list);
      }

      list.push(obj);
      var age = new Date().getFullYear() - parseInt(obj.birth_year, 10);
      obj = _format.ymd([obj.birth_year, obj.birth_month]);
      var str = _format.toText(obj);

      if (age) {
        str += " (age ".concat(age, ")");
      }

      return str;
    },
    'death year and age': function deathYearAndAge(tmpl, list) {
      var order = ['death_year', 'birth_year', 'death_month'];
      var obj = parse$3(tmpl, order); //support 'one property' version

      if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
        return natural_date(tmpl, list);
      }

      list.push(obj);
      obj = _format.ymd([obj.death_year, obj.death_month]);
      return _format.toText(obj);
    },
    //https://en.wikipedia.org/wiki/Template:Birth_date_and_age2
    'birth date and age2': function birthDateAndAge2(tmpl, list) {
      var order = ['at_year', 'at_month', 'at_day', 'birth_year', 'birth_month', 'birth_day'];
      var obj = parse$3(tmpl, order);
      list.push(obj);
      obj = _format.ymd([obj.birth_year, obj.birth_month, obj.birth_day]);
      return _format.toText(obj);
    },
    //https://en.wikipedia.org/wiki/Template:Birth_based_on_age_as_of_date
    'birth based on age as of date': function birthBasedOnAgeAsOfDate(tmpl, list) {
      var order = ['age', 'year', 'month', 'day'];
      var obj = parse$3(tmpl, order);
      list.push(obj);
      var age = parseInt(obj.age, 10);
      var year = parseInt(obj.year, 10);
      var born = year - age;

      if (born && age) {
        return "".concat(born, " (age ").concat(obj.age, ")");
      }

      return "(age ".concat(obj.age, ")");
    },
    //https://en.wikipedia.org/wiki/Template:Death_date_and_given_age
    'death date and given age': function deathDateAndGivenAge(tmpl, list) {
      var order = ['year', 'month', 'day', 'age'];
      var obj = parse$3(tmpl, order);
      list.push(obj);
      obj = _format.ymd([obj.year, obj.month, obj.day]);
      var str = _format.toText(obj);

      if (obj.age) {
        str += " (age ".concat(obj.age, ")");
      }

      return str;
    },
    //sortable dates -
    dts: function dts(tmpl) {
      //remove formatting stuff, ewww
      tmpl = tmpl.replace(/\|format=[ymd]+/i, '');
      tmpl = tmpl.replace(/\|abbr=(on|off)/i, '');
      var order = ['year', 'month', 'date', 'bc'];
      var obj = parse$3(tmpl, order);

      if (obj.date && obj.month && obj.year) {
        //render 'june 5 2018'
        if (/[a-z]/.test(obj.month) === true) {
          return [obj.month, obj.date, obj.year].join(' ');
        }

        return [obj.year, obj.month, obj.date].join('-');
      }

      if (obj.month && obj.year) {
        return [obj.year, obj.month].join('-');
      }

      if (obj.year) {
        if (obj.year < 0) {
          obj.year = Math.abs(obj.year) + ' BC';
        }

        return obj.year;
      }

      return '';
    },
    //date/age/time templates
    start: date,
    end: date,
    birth: date,
    death: date,
    'start date': date,
    'end date': date,
    'birth date': date,
    'death date': date,
    'start date and age': date,
    'end date and age': date,
    //this is insane (hyphen ones are different)
    'start-date': natural_date,
    'end-date': natural_date,
    'birth-date': natural_date,
    'death-date': natural_date,
    'birth-date and age': natural_date,
    'birth-date and given age': natural_date,
    'death-date and age': natural_date,
    'death-date and given age': natural_date,
    birthdeathage: parsers_1.two_dates,
    dob: date,
    // 'birth date and age2': date,
    age: parsers_1.age,
    'age nts': parsers_1.age,
    'age in years': parsers_1['diff-y'],
    'age in years and months': parsers_1['diff-ym'],
    'age in years, months and days': parsers_1['diff-ymd'],
    'age in years and days': parsers_1['diff-yd'],
    'age in days': parsers_1['diff-d'] // 'age in years, months, weeks and days': true,
    // 'age as of date': true,

  }); //aliases

  dateTmpl.localday = dateTmpl.currentday;
  dateTmpl.localdayname = dateTmpl.currentdayname;
  dateTmpl.localmonth = dateTmpl.currentmonth;
  dateTmpl.localyear = dateTmpl.currentyear;
  dateTmpl.currentmonthname = dateTmpl.currentmonth;
  dateTmpl.currentmonthabbrev = dateTmpl.currentmonth;
  dateTmpl['death date and age'] = dateTmpl['birth date and age'];
  dateTmpl.bda = dateTmpl['birth date and age'];
  dateTmpl['birth date based on age at death'] = dateTmpl['birth based on age as of date'];
  var dates = dateTmpl;

  var templates = {
    //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
    tag: function tag(tmpl) {
      var obj = parse$3(tmpl, ['tag', 'open']);
      var ignore = {
        span: true,
        div: true,
        p: true
      }; //pair, empty, close, single

      if (!obj.open || obj.open === 'pair') {
        //just skip generating spans and things..
        if (ignore[obj.tag]) {
          return obj.content || '';
        }

        return "<".concat(obj.tag, " ").concat(obj.attribs || '', ">").concat(obj.content || '', "</").concat(obj.tag, ">");
      }

      return '';
    },
    //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
    plural: function plural(tmpl) {
      tmpl = tmpl.replace(/plural:/, 'plural|');
      var order = ['num', 'word'];
      var obj = parse$3(tmpl, order);
      var num = Number(obj.num);
      var word = obj.word;

      if (num !== 1) {
        if (/.y$/.test(word)) {
          word = word.replace(/y$/, 'ies');
        } else {
          word += 's';
        }
      }

      return num + ' ' + word;
    },
    // https://en.wikipedia.org/wiki/Template:First_word
    'first word': function firstWord(tmpl) {
      var obj = parse$3(tmpl, ['text']);
      var str = obj.text;

      if (obj.sep) {
        return str.split(obj.sep)[0];
      }

      return str.split(' ')[0];
    },
    trunc: function trunc(tmpl) {
      var order = ['str', 'len'];
      var obj = parse$3(tmpl, order);
      return obj.str.substr(0, obj.len);
    },
    'str mid': function strMid(tmpl) {
      var order = ['str', 'start', 'end'];
      var obj = parse$3(tmpl, order);
      var start = parseInt(obj.start, 10) - 1;
      var end = parseInt(obj.end, 10);
      return obj.str.substr(start, end);
    },
    //grab the first, second or third pipe
    p1: 0,
    p2: 1,
    p3: 2,
    //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
    braces: function braces(tmpl) {
      var obj = parse$3(tmpl, ['text']);
      var attrs = '';

      if (obj.list) {
        attrs = '|' + obj.list.join('|');
      }

      return '{{' + (obj.text || '') + attrs + '}}';
    },
    nobold: 0,
    noitalic: 0,
    nocaps: 0,
    syntaxhighlight: function syntaxhighlight(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return obj.code || '';
    },
    samp: function samp(tmpl, list) {
      var obj = parse$3(tmpl, ['1']);
      list.push(obj);
      return obj['1'] || '';
    },
    //https://en.wikipedia.org/wiki/Template:Visible_anchor
    vanchor: 0,
    //https://en.wikipedia.org/wiki/Template:Resize
    resize: 1,
    //https://en.wikipedia.org/wiki/Template:Ra
    ra: function ra(tmpl) {
      var obj = parse$3(tmpl, ['hours', 'minutes', 'seconds']);
      return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':');
    },
    //https://en.wikipedia.org/wiki/Template:Deg2HMS
    deg2hms: function deg2hms(tmpl) {
      //this template should do the conversion
      var obj = parse$3(tmpl, ['degrees']);
      return (obj.degrees || '') + '°';
    },
    hms2deg: function hms2deg(tmpl) {
      //this template should do the conversion too
      var obj = parse$3(tmpl, ['hours', 'minutes', 'seconds']);
      return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':');
    },
    decdeg: function decdeg(tmpl) {
      //this template should do the conversion too
      var obj = parse$3(tmpl, ['deg', 'min', 'sec', 'hem', 'rnd']);
      return (obj.deg || obj.degrees) + '°';
    },
    rnd: 0,
    //https://en.wikipedia.org/wiki/Template:DEC
    dec: function dec(tmpl) {
      var obj = parse$3(tmpl, ['degrees', 'minutes', 'seconds']);
      var str = (obj.degrees || 0) + '°';

      if (obj.minutes) {
        str += obj.minutes + "\u2032";
      }

      if (obj.seconds) {
        str += obj.seconds + '″';
      }

      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Val
    val: function val(tmpl) {
      var obj = parse$3(tmpl, ['number', 'uncertainty']);
      var num = obj.number;

      if (num && Number(num)) {
        num = Number(num).toLocaleString();
      }

      var str = num || ''; //prefix/suffix

      if (obj.p) {
        str = obj.p + str;
      }

      if (obj.s) {
        str = obj.s + str;
      } //add units, too


      if (obj.u || obj.ul || obj.upl) {
        str = str + ' ' + (obj.u || obj.ul || obj.upl);
      }

      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Sub
    sub: function sub(tmpl, list) {
      var obj = parse$3(tmpl, ['text']);
      list.push(obj);
      return obj.text || '';
    },
    //https://en.wikipedia.org/wiki/Template:Sup
    sup: function sup(tmpl, list) {
      var obj = parse$3(tmpl, ['text']);
      list.push(obj);
      return obj.text || '';
    }
  }; //aliases

  templates['rndfrac'] = templates.rnd;
  templates['rndnear'] = templates.rnd;
  templates['unité'] = templates.val; //templates that we simply grab their insides as plaintext

  var inline = ['nowrap', 'nobr', 'big', 'cquote', 'pull quote', 'small', 'smaller', 'midsize', 'larger', 'big', 'kbd', 'bigger', 'large', 'mono', 'strongbad', 'stronggood', 'huge', 'xt', 'xt2', '!xt', 'xtn', 'xtd', 'dc', 'dcr', 'mxt', '!mxt', 'mxtn', 'mxtd', 'bxt', '!bxt', 'bxtn', 'bxtd', 'delink', //https://en.wikipedia.org/wiki/Template:Delink
  //half-supported
  'pre', 'var', 'mvar', 'pre2', 'code'];
  inline.forEach(function (k) {
    templates[k] = function (tmpl) {
      return parse$3(tmpl, ['text']).text || '';
    };
  });
  var format = templates;

  var tmpls = {
    //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
    plainlist: function plainlist(tmpl) {
      tmpl = _strip(tmpl); //remove the title

      var arr = tmpl.split('|');
      arr = arr.slice(1);
      tmpl = arr.join('|'); //split on newline

      arr = tmpl.split(/\n ?\* ?/);
      arr = arr.filter(function (s) {
        return s;
      });
      return arr.join('\n\n');
    },
    //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
    'collapsible list': function collapsibleList(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      var str = '';

      if (obj.title) {
        str += "'''".concat(obj.title, "'''") + '\n\n';
      }

      if (!obj.list) {
        obj.list = [];

        for (var i = 1; i < 10; i += 1) {
          if (obj[i]) {
            obj.list.push(obj[i]);
            delete obj[i];
          }
        }
      }

      obj.list = obj.list.filter(function (s) {
        return s;
      });
      str += obj.list.join('\n\n');
      return str;
    },
    // https://en.wikipedia.org/wiki/Template:Ordered_list
    'ordered list': function orderedList(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      obj.list = obj.list || [];
      var lines = obj.list.map(function (str, i) {
        return "".concat(i + 1, ". ").concat(str);
      });
      return lines.join('\n\n');
    },
    hlist: function hlist(tmpl) {
      var obj = parse$3(tmpl);
      obj.list = obj.list || [];
      return obj.list.join(' · ');
    },
    pagelist: function pagelist(tmpl) {
      var arr = parse$3(tmpl).list || [];
      return arr.join(', ');
    },
    //actually rendering these links removes the text.
    //https://en.wikipedia.org/wiki/Template:Catlist
    catlist: function catlist(tmpl) {
      var arr = parse$3(tmpl).list || [];
      return arr.join(', ');
    },
    //https://en.wikipedia.org/wiki/Template:Br_separated_entries
    'br separated entries': function brSeparatedEntries(tmpl) {
      var arr = parse$3(tmpl).list || [];
      return arr.join('\n\n');
    },
    'comma separated entries': function commaSeparatedEntries(tmpl) {
      var arr = parse$3(tmpl).list || [];
      return arr.join(', ');
    },
    //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
    'anchored list': function anchoredList(tmpl) {
      var arr = parse$3(tmpl).list || [];
      arr = arr.map(function (str, i) {
        return "".concat(i + 1, ". ").concat(str);
      });
      return arr.join('\n\n');
    },
    'bulleted list': function bulletedList(tmpl) {
      var arr = parse$3(tmpl).list || [];
      arr = arr.filter(function (f) {
        return f;
      });
      arr = arr.map(function (str) {
        return '• ' + str;
      });
      return arr.join('\n\n');
    },
    //https://en.wikipedia.org/wiki/Template:Columns-list
    'columns-list': function columnsList(tmpl, list) {
      var arr = parse$3(tmpl).list || [];
      var str = arr[0] || '';
      var lines = str.split(/\n/);
      lines = lines.filter(function (f) {
        return f;
      });
      lines = lines.map(function (s) {
        return s.replace(/\*/, '');
      });
      list.push({
        template: 'columns-list',
        list: lines
      });
      lines = lines.map(function (s) {
        return '• ' + s;
      });
      return lines.join('\n\n');
    } // 'pagelist':(tmpl)=>{},

  }; //aliases

  tmpls.flatlist = tmpls.plainlist;
  tmpls.ublist = tmpls.plainlist;
  tmpls['unbulleted list'] = tmpls['collapsible list'];
  tmpls['ubl'] = tmpls['collapsible list'];
  tmpls['bare anchored list'] = tmpls['anchored list'];
  tmpls['plain list'] = tmpls['plainlist'];
  tmpls.cmn = tmpls['columns-list'];
  tmpls.collist = tmpls['columns-list'];
  tmpls['col-list'] = tmpls['columns-list'];
  tmpls.columnslist = tmpls['columns-list'];
  var lists = tmpls;

  var inline$1 = {
    //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
    convert: function convert(tmpl) {
      var order = ['num', 'two', 'three', 'four'];
      var obj = parse$3(tmpl, order); //todo: support plural units

      if (obj.two === '-' || obj.two === 'to' || obj.two === 'and') {
        if (obj.four) {
          return "".concat(obj.num, " ").concat(obj.two, " ").concat(obj.three, " ").concat(obj.four);
        }

        return "".concat(obj.num, " ").concat(obj.two, " ").concat(obj.three);
      }

      return "".concat(obj.num, " ").concat(obj.two);
    },
    //https://en.wikipedia.org/wiki/Template:Term
    term: function term(tmpl) {
      var obj = parse$3(tmpl, ['term']);
      return "".concat(obj.term, ":");
    },
    defn: 0,
    //https://en.wikipedia.org/wiki/Template:Linum
    lino: 0,
    linum: function linum(tmpl) {
      var obj = parse$3(tmpl, ['num', 'text']);
      return "".concat(obj.num, ". ").concat(obj.text);
    },
    //https://en.wikipedia.org/wiki/Template:Interlanguage_link
    ill: function ill(tmpl) {
      var order = ['text', 'lan1', 'text1', 'lan2', 'text2'];
      var obj = parse$3(tmpl, order);
      return obj.text;
    },
    //https://en.wikipedia.org/wiki/Template:Frac
    frac: function frac(tmpl) {
      var order = ['a', 'b', 'c'];
      var obj = parse$3(tmpl, order);

      if (obj.c) {
        return "".concat(obj.a, " ").concat(obj.b, "/").concat(obj.c);
      }

      if (obj.b) {
        return "".concat(obj.a, "/").concat(obj.b);
      }

      return "1/".concat(obj.b);
    },
    //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
    height: function height(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      var result = [];
      var units = ['m', 'cm', 'ft', 'in']; //order matters

      units.forEach(function (unit) {
        if (obj.hasOwnProperty(unit) === true) {
          result.push(obj[unit] + unit);
        }
      });
      return result.join(' ');
    },
    'block indent': function blockIndent(tmpl) {
      var obj = parse$3(tmpl);

      if (obj['1']) {
        return '\n' + obj['1'] + '\n';
      }

      return '';
    },
    quote: function quote(tmpl, list) {
      var order = ['text', 'author'];
      var obj = parse$3(tmpl, order);
      list.push(obj); //create plaintext version

      if (obj.text) {
        var str = "\"".concat(obj.text, "\"");

        if (obj.author) {
          str += '\n\n';
          str += "    - ".concat(obj.author);
        }

        return str + '\n';
      }

      return '';
    },
    //https://en.wikipedia.org/wiki/Template:Lbs
    lbs: function lbs(tmpl) {
      var obj = parse$3(tmpl, ['text']);
      return "[[".concat(obj.text, " Lifeboat Station|").concat(obj.text, "]]");
    },
    //Foo-class
    lbc: function lbc(tmpl) {
      var obj = parse$3(tmpl, ['text']);
      return "[[".concat(obj.text, "-class lifeboat|").concat(obj.text, "-class]]");
    },
    lbb: function lbb(tmpl) {
      var obj = parse$3(tmpl, ['text']);
      return "[[".concat(obj.text, "-class lifeboat|").concat(obj.text, "]]");
    },
    // https://en.wikipedia.org/wiki/Template:Own
    own: function own(tmpl) {
      var obj = parse$3(tmpl, ['author']);
      var str = 'Own work';

      if (obj.author) {
        str += ' by ' + obj.author;
      }

      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Sic
    sic: function sic(tmpl, list) {
      var obj = parse$3(tmpl, ['one', 'two', 'three']);
      var word = (obj.one || '') + (obj.two || ''); //support '[sic?]'

      if (obj.one === '?') {
        word = (obj.two || '') + (obj.three || '');
      }

      list.push({
        template: 'sic',
        word: word
      });

      if (obj.nolink === 'y') {
        return word;
      }

      return "".concat(word, " [sic]");
    },
    //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
    formatnum: function formatnum(tmpl) {
      tmpl = tmpl.replace(/:/, '|');
      var obj = parse$3(tmpl, ['number']);
      var str = obj.number || '';
      str = str.replace(/,/g, '');
      var num = Number(str);
      return num.toLocaleString() || '';
    },
    //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
    '#dateformat': function dateformat(tmpl) {
      tmpl = tmpl.replace(/:/, '|');
      var obj = parse$3(tmpl, ['date', 'format']);
      return obj.date;
    },
    //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
    lc: function lc(tmpl) {
      tmpl = tmpl.replace(/:/, '|');
      var obj = parse$3(tmpl, ['text']);
      return (obj.text || '').toLowerCase();
    },
    lcfirst: function lcfirst(tmpl) {
      tmpl = tmpl.replace(/:/, '|');
      var obj = parse$3(tmpl, ['text']);
      var text = obj.text;

      if (!text) {
        return '';
      }

      return text[0].toLowerCase() + text.substr(1);
    },
    //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
    uc: function uc(tmpl) {
      tmpl = tmpl.replace(/:/, '|');
      var obj = parse$3(tmpl, ['text']);
      return (obj.text || '').toUpperCase();
    },
    ucfirst: function ucfirst(tmpl) {
      tmpl = tmpl.replace(/:/, '|');
      var obj = parse$3(tmpl, ['text']);
      var text = obj.text;

      if (!text) {
        return '';
      }

      return text[0].toUpperCase() + text.substr(1);
    },
    padleft: function padleft(tmpl) {
      tmpl = tmpl.replace(/:/, '|');
      var obj = parse$3(tmpl, ['text', 'num']);
      var text = obj.text || '';
      return text.padStart(obj.num, obj.str || '0');
    },
    padright: function padright(tmpl) {
      tmpl = tmpl.replace(/:/, '|');
      var obj = parse$3(tmpl, ['text', 'num']);
      var text = obj.text || '';
      return text.padEnd(obj.num, obj.str || '0');
    },
    //abbreviation/meaning
    //https://en.wikipedia.org/wiki/Template:Abbr
    abbr: function abbr(tmpl) {
      var obj = parse$3(tmpl, ['abbr', 'meaning', 'ipa']);
      return obj.abbr;
    },
    //https://en.wikipedia.org/wiki/Template:Abbrlink
    abbrlink: function abbrlink(tmpl) {
      var obj = parse$3(tmpl, ['abbr', 'page']);

      if (obj.page) {
        return "[[".concat(obj.page, "|").concat(obj.abbr, "]]");
      }

      return "[[".concat(obj.abbr, "]]");
    },
    //https://en.wikipedia.org/wiki/Template:Hover_title
    //technically 'h:title'
    h: 1,
    //https://en.wikipedia.org/wiki/Template:Finedetail
    finedetail: 0,
    //https://en.wikipedia.org/wiki/Template:Sort
    sort: 1
  }; //aliases

  inline$1['str left'] = inline$1.trunc;
  inline$1['str crop'] = inline$1.trunc;
  inline$1['tooltip'] = inline$1.abbr;
  inline$1['abbrv'] = inline$1.abbr;
  inline$1['define'] = inline$1.abbr;
  inline$1['cvt'] = inline$1.convert;
  var misc$1 = inline$1;

  var formatting$1 = Object.assign({}, format, lists, misc$1);

  //converts DMS (decimal-minute-second) geo format to lat/lng format.
  //major thank you to https://github.com/gmaclennan/parse-dms
  //and https://github.com/WSDOT-GIS/dms-js 👏
  //accepts an array of descending Degree, Minute, Second values, with a hemisphere at the end
  //must have N/S/E/W as last thing
  function parseDms(arr) {
    var hemisphere = arr.pop();
    var degrees = Number(arr[0] || 0);
    var minutes = Number(arr[1] || 0);
    var seconds = Number(arr[2] || 0);

    if (typeof hemisphere !== 'string' || isNaN(degrees)) {
      return null;
    }

    var sign = 1;

    if (/[SW]/i.test(hemisphere)) {
      sign = -1;
    }

    var decDeg = sign * (degrees + minutes / 60 + seconds / 3600);
    return decDeg;
  }

  var dmsFormat = parseDms; // console.log(parseDms([57, 18, 22, 'N']));

  var round = function round(num) {
    if (typeof num !== 'number') {
      return num;
    }

    var places = 100000;
    return Math.round(num * places) / places;
  }; //these hemispheres mean negative decimals


  var negative = {
    s: true,
    w: true
  };

  var findLatLng = function findLatLng(arr) {
    var types = arr.map(function (s) {
      return _typeof(s);
    }).join('|'); //support {{lat|lng}}

    if (arr.length === 2 && types === 'number|number') {
      return {
        lat: arr[0],
        lon: arr[1]
      };
    } //support {{dd|N/S|dd|E/W}}


    if (arr.length === 4 && types === 'number|string|number|string') {
      if (negative[arr[1].toLowerCase()]) {
        arr[0] *= -1;
      }

      if (arr[3].toLowerCase() === 'w') {
        arr[2] *= -1;
      }

      return {
        lat: arr[0],
        lon: arr[2]
      };
    } //support {{dd|mm|N/S|dd|mm|E/W}}


    if (arr.length === 6) {
      return {
        lat: dmsFormat(arr.slice(0, 3)),
        lon: dmsFormat(arr.slice(3))
      };
    } //support {{dd|mm|ss|N/S|dd|mm|ss|E/W}}


    if (arr.length === 8) {
      return {
        lat: dmsFormat(arr.slice(0, 4)),
        lon: dmsFormat(arr.slice(4))
      };
    }

    return {};
  };

  var parseParams = function parseParams(obj) {
    obj.list = obj.list || [];
    obj.list = obj.list.map(function (str) {
      var num = Number(str);

      if (!isNaN(num)) {
        return num;
      } //these are weird


      var split = str.split(/:/);

      if (split.length > 1) {
        obj.props = obj.props || {};
        obj.props[split[0]] = split.slice(1).join(':');
        return null;
      }

      return str;
    });
    obj.list = obj.list.filter(function (s) {
      return s !== null;
    });
    return obj;
  };

  var parseCoor = function parseCoor(tmpl) {
    var obj = parse$3(tmpl);
    obj = parseParams(obj);
    var tmp = findLatLng(obj.list);
    obj.lat = round(tmp.lat);
    obj.lon = round(tmp.lon);
    obj.template = 'coord';
    delete obj.list;
    return obj;
  };

  var coor = parseCoor; // {{Coor title dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}

  var templates$1 = {
    coord: function coord(tmpl, list) {
      var obj = coor(tmpl);
      list.push(obj); //display inline, by default

      if (!obj.display || obj.display.indexOf('inline') !== -1) {
        return "".concat(obj.lat || '', "\xB0N, ").concat(obj.lon || '', "\xB0W");
      }

      return '';
    },
    //https://en.wikivoyage.org/wiki/Template:Geo
    geo: ['lat', 'lon', 'zoom']
  }; // {{coord|latitude|longitude|coordinate parameters|template parameters}}
  // {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
  // {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
  // {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

  templates$1['coor'] = templates$1.coord; // these are from the nl wiki

  templates$1['coor title dms'] = templates$1.coord;
  templates$1['coor title dec'] = templates$1.coord;
  templates$1['coor dms'] = templates$1.coord;
  templates$1['coor dm'] = templates$1.coord;
  templates$1['coor dec'] = templates$1.coord;
  var geo = templates$1;

  var templates$2 = {
    /* mostly wiktionary*/
    etyl: 1,
    mention: 1,
    link: 1,
    'la-verb-form': 0,
    'la-ipa': 0,
    //https://en.wikipedia.org/wiki/Template:Sortname
    sortname: function sortname(tmpl) {
      var order = ['first', 'last', 'target', 'sort'];
      var obj = parse$3(tmpl, order);
      var name = "".concat(obj.first || '', " ").concat(obj.last || '');
      name = name.trim();

      if (obj.nolink) {
        return obj.target || name;
      }

      if (obj.dab) {
        name += " (".concat(obj.dab, ")");

        if (obj.target) {
          obj.target += " (".concat(obj.dab, ")");
        }
      }

      if (obj.target) {
        return "[[".concat(obj.target, "|").concat(name, "]]");
      }

      return "[[".concat(name, "]]");
    }
  }; //these are insane
  // https://en.wikipedia.org/wiki/Template:Tl

  var links = ['lts', 't', 'tfd links', 'tiw', 'tltt', 'tetl', 'tsetl', 'ti', 'tic', 'tiw', 'tlt', 'ttl', 'twlh', 'tl2', 'tlu', 'demo', 'hatnote', 'xpd', 'para', 'elc', 'xtag', 'mli', 'mlix', '#invoke', 'url' //https://en.wikipedia.org/wiki/Template:URL
  ]; //keyValues

  links.forEach(function (k) {
    templates$2[k] = function (tmpl) {
      var order = ['first', 'second'];
      var obj = parse$3(tmpl, order);
      return obj.second || obj.first;
    };
  }); //aliases

  templates$2.m = templates$2.mention;
  templates$2['m-self'] = templates$2.mention;
  templates$2.l = templates$2.link;
  templates$2.ll = templates$2.link;
  templates$2['l-self'] = templates$2.link;
  var links_1 = templates$2;

  var sisterProjects = {
    wikt: 'wiktionary',
    commons: 'commons',
    c: 'commons',
    commonscat: 'commonscat',
    n: 'wikinews',
    q: 'wikiquote',
    s: 'wikisource',
    a: 'wikiauthor',
    b: 'wikibooks',
    voy: 'wikivoyage',
    v: 'wikiversity',
    d: 'wikidata',
    species: 'wikispecies',
    m: 'meta',
    mw: 'mediawiki'
  };
  var parsers$1 = {
    // https://en.wikipedia.org/wiki/Template:About
    about: function about(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return '';
    },
    // https://en.wikipedia.org/wiki/Template:Main
    main: function main(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return '';
    },
    // https://en.wikipedia.org/wiki/Template:Main_list
    'main list': function mainList(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return '';
    },
    // https://en.wikipedia.org/wiki/Template:See
    see: function see(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return '';
    },
    // https://en.wikipedia.org/wiki/Template:For
    "for": function _for(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return '';
    },
    // https://en.wikipedia.org/wiki/Template:Further
    further: function further(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return '';
    },
    // same as "further" (but this name is still in use)
    'further information': function furtherInformation(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return '';
    },
    // https://en.wikipedia.org/wiki/Template:Listen
    listen: function listen(tmpl, list) {
      var obj = parse$3(tmpl);
      list.push(obj);
      return '';
    },
    'wide image': ['file', 'width', 'caption'],
    //https://en.wikipedia.org/wiki/Template:Redirect
    redirect: function redirect(tmpl, list) {
      var data = parse$3(tmpl, ['redirect']);
      var lines = data.list || [];
      var links = [];

      for (var i = 0; i < lines.length; i += 2) {
        links.push({
          page: lines[i + 1],
          desc: lines[i]
        });
      }

      var obj = {
        template: 'redirect',
        redirect: data.redirect,
        links: links
      };
      list.push(obj);
      return '';
    },
    //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
    'cite gnis': function citeGnis(tmpl, list) {
      var order = ['id', 'name', 'type'];
      var obj = parse$3(tmpl, order);
      obj.type = 'gnis';
      obj.template = 'citation';
      list.push(obj);
      return '';
    },
    //https://en.wikipedia.org/wiki/Template:Sfn
    sfn: function sfn(tmpl, list, alias) {
      var order = ['author', 'year', 'location'];
      var obj = parse$3(tmpl, order);

      if (alias) {
        obj.name = obj.template;
        obj.teplate = alias;
      }

      list.push(obj);
      return '';
    },
    audio: ['file', 'text', 'type'],
    rp: ['page'],
    'spoken wikipedia': function spokenWikipedia(tmpl, list) {
      var order = ['file', 'date'];
      var obj = parse$3(tmpl, order);
      obj.template = 'audio';
      list.push(obj);
      return '';
    },
    //https://en.wikipedia.org/wiki/Template:Sister_project_links
    'sister project links': function sisterProjectLinks(tmpl, list) {
      var data = parse$3(tmpl); //rename 'wd' to 'wikidata'

      var links = {};
      Object.keys(sisterProjects).forEach(function (k) {
        if (data.hasOwnProperty(k) === true) {
          links[sisterProjects[k]] = data[k]; //.text();
        }
      });
      var obj = {
        template: 'sister project links',
        links: links
      };
      list.push(obj);
      return '';
    },
    //https://en.wikipedia.org/wiki/Template:Subject_bar
    'subject bar': function subjectBar(tmpl, list) {
      var data = parse$3(tmpl);
      Object.keys(data).forEach(function (k) {
        //rename 'voy' to 'wikivoyage'
        if (sisterProjects.hasOwnProperty(k)) {
          data[sisterProjects[k]] = data[k];
          delete data[k];
        }
      });
      var obj = {
        template: 'subject bar',
        links: data
      };
      list.push(obj);
      return '';
    },
    'short description': ['description'],
    'coord missing': ['region'],
    //amazingly, this one does not obey any known patterns
    //https://en.wikipedia.org/wiki/Template:Gallery
    gallery: function gallery(tmpl, list) {
      var obj = parse$3(tmpl);
      var images = (obj.list || []).filter(function (line) {
        return /^ *File ?:/.test(line);
      });
      images = images.map(function (file) {
        var img = {
          file: file
        }; // TODO: add lang and domain information

        return new Image_1(img).json();
      });
      obj = {
        template: 'gallery',
        images: images
      };
      list.push(obj);
      return '';
    },
    //https://en.wikipedia.org/wiki/Template:See_also
    'see also': function seeAlso(tmpl, list) {
      var data = parse$3(tmpl);
      list.push(data);
      return '';
    },
    unreferenced: ['date']
  }; //aliases

  parsers$1['cite'] = parsers$1.citation;
  parsers$1['sfnref'] = parsers$1.sfn;
  parsers$1['harvid'] = parsers$1.sfn;
  parsers$1['harvnb'] = parsers$1.sfn;
  parsers$1['unreferenced section'] = parsers$1.unreferenced;
  parsers$1['redir'] = parsers$1.redirect;
  parsers$1['sisterlinks'] = parsers$1['sister project links'];
  parsers$1['main article'] = parsers$1['main'];
  var page = parsers$1;

  var titlecase = function titlecase(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }; //https://en.wikipedia.org/wiki/Template:Yes


  var templates$3 = {};
  var cells = ['rh', 'rh2', 'yes', 'no', 'maybe', 'eliminated', 'lost', 'safe', 'active', 'site active', 'coming soon', 'good', 'won', 'nom', 'sho', 'longlisted', 'tba', 'success', 'operational', 'failure', 'partial', 'regional', 'maybecheck', 'partial success', 'partial failure', 'okay', 'yes-no', 'some', 'nonpartisan', 'pending', 'unofficial', 'unofficial2', 'usually', 'rarely', 'sometimes', 'any', 'varies', 'black', 'non-album single', 'unreleased', 'unknown', 'perhaps', 'depends', 'included', 'dropped', 'terminated', 'beta', 'table-experimental', 'free', 'proprietary', 'nonfree', 'needs', 'nightly', 'release-candidate', 'planned', 'scheduled', 'incorrect', 'no result', 'cmain', 'calso starring', 'crecurring', 'cguest', 'not yet', 'optional'];
  cells.forEach(function (str) {
    templates$3[str] = function (tmpl) {
      var data = parse$3(tmpl, ['text']);
      return data.text || titlecase(data.template);
    };
  }); //these ones have a text result

  var moreCells = [['active fire', 'Active'], ['site active', 'Active'], ['site inactive', 'Inactive'], ['yes2', ''], ['no2', ''], ['ya', '✅'], ['na', '❌'], ['nom', 'Nominated'], ['sho', 'Shortlisted'], ['tba', 'TBA'], ['maybecheck', '✔️'], ['okay', 'Neutral'], ['n/a', 'N/A'], ['sdash', '—'], ['dunno', '?'], ['draw', ''], ['cnone', ''], ['nocontest', '']];
  moreCells.forEach(function (a) {
    templates$3[a[0]] = function (tmpl) {
      var data = parse$3(tmpl, ['text']);
      return data.text || a[1];
    };
  }); //this one's a little different

  templates$3.won = function (tmpl) {
    var data = parse$3(tmpl, ['text']);
    return data.place || data.text || titlecase(data.template);
  };

  var tableCell = templates$3;

  var wikipedia = Object.assign({}, links_1, page, tableCell);

  var zeroPad = function zeroPad(num) {
    num = String(num);

    if (num.length === 1) {
      num = '0' + num;
    }

    return num;
  };

  var parseTeam = function parseTeam(obj, round, team) {
    if (obj["rd".concat(round, "-team").concat(zeroPad(team))]) {
      team = zeroPad(team);
    }

    var score = obj["rd".concat(round, "-score").concat(team)];
    var num = Number(score);

    if (isNaN(num) === false) {
      score = num;
    }

    return {
      team: obj["rd".concat(round, "-team").concat(team)],
      score: score,
      seed: obj["rd".concat(round, "-seed").concat(team)]
    };
  }; //these are weird.


  var playoffBracket = function playoffBracket(tmpl) {
    var rounds = [];
    var obj = parse$3(tmpl); //try some rounds

    for (var i = 1; i < 7; i += 1) {
      var round = [];

      for (var t = 1; t < 16; t += 2) {
        var key = "rd".concat(i, "-team");

        if (obj[key + t] || obj[key + zeroPad(t)]) {
          var one = parseTeam(obj, i, t);
          var two = parseTeam(obj, i, t + 1);
          round.push([one, two]);
        } else {
          break;
        }
      }

      if (round.length > 0) {
        rounds.push(round);
      }
    }

    return {
      template: 'playoffbracket',
      rounds: rounds
    };
  };

  var all = {
    //playoff brackets
    '4teambracket': function teambracket(tmpl, list) {
      var obj = playoffBracket(tmpl);
      list.push(obj);
      return '';
    }
  }; //a bunch of aliases for these ones:
  // https://en.wikipedia.org/wiki/Category:Tournament_bracket_templates

  var brackets = ['2teambracket', '4team2elimbracket', '8teambracket', '16teambracket', '32teambracket', '4roundbracket-byes', 'cwsbracket', 'nhlbracket', 'nhlbracket-reseed', '4teambracket-nhl', '4teambracket-ncaa', '4teambracket-mma', '4teambracket-mlb', '16teambracket-two-reseeds', '8teambracket-nhl', '8teambracket-mlb', '8teambracket-ncaa', '8teambracket-afc', '8teambracket-afl', '8teambracket-tennis3', '8teambracket-tennis5', '16teambracket-nhl', '16teambracket-nhl divisional', '16teambracket-nhl-reseed', '16teambracket-nba', '16teambracket-swtc', '16teambracket-afc', '16teambracket-tennis3', '16teambracket-tennis5'];
  brackets.forEach(function (key) {
    all[key] = all['4teambracket'];
  });
  var brackets_1 = all;

  var codes = {
    '£': 'GB£',
    // https://en.wikipedia.org/wiki/Template:GBP
    '¥': '¥',
    // https://en.wikipedia.org/wiki/Template:JPY
    '৳': '৳',
    // https://en.wikipedia.org/wiki/Template:BDT
    '₩': '₩',
    // https://en.wikipedia.org/wiki/Template:SK_won
    '€': '€',
    // https://en.wikipedia.org/wiki/Template:€
    '₱': '₱',
    // https://en.wikipedia.org/wiki/Template:Philippine_peso
    '₹': '₹',
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    '₽': '₽',
    // https://en.wikipedia.org/wiki/Template:RUB
    'cn¥': 'CN¥',
    // https://en.wikipedia.org/wiki/Template:CNY
    'gb£': 'GB£',
    // https://en.wikipedia.org/wiki/Template:GBP
    'india rs': '₹',
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    'indian rupee symbol': '₹',
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    'indian rupee': '₹',
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    'indian rupees': '₹',
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    'philippine peso': '₱',
    // https://en.wikipedia.org/wiki/Template:Philippine_peso
    'russian ruble': '₽',
    // https://en.wikipedia.org/wiki/Template:Russian_ruble
    'SK won': '₩',
    // https://en.wikipedia.org/wiki/Template:SK_won
    'turkish lira': 'TRY',
    //https://en.wikipedia.org/wiki/Template:Turkish_lira
    a$: 'A$',
    // https://en.wikipedia.org/wiki/Template:AUD
    au$: 'A$',
    //https://en.wikipedia.org/wiki/Template:AUD
    aud: 'A$',
    //https://en.wikipedia.org/wiki/Template:AUD
    bdt: 'BDT',
    //https://en.wikipedia.org/wiki/Template:BDT
    brl: 'BRL',
    //https://en.wikipedia.org/wiki/Template:BRL
    ca$: 'CA$',
    // https://en.wikipedia.org/wiki/Template:CAD
    cad: 'CA$',
    // https://en.wikipedia.org/wiki/Template:CAD
    chf: 'CHF',
    // https://en.wikipedia.org/wiki/Template:CHF
    cny: 'CN¥',
    // https://en.wikipedia.org/wiki/Template:CNY
    czk: 'czk',
    // https://en.wikipedia.org/wiki/Template:CZK
    dkk: 'dkk',
    // https://en.wikipedia.org/wiki/Template:DKK
    dkk2: 'dkk',
    // https://en.wikipedia.org/wiki/Template:DKK
    euro: '€',
    // https://en.wikipedia.org/wiki/Template:€
    gbp: 'GB£',
    // https://en.wikipedia.org/wiki/Template:GBP
    hk$: 'HK$',
    // https://en.wikipedia.org/wiki/Template:HKD
    hkd: 'HK$',
    // https://en.wikipedia.org/wiki/Template:HKD
    ils: 'ILS',
    // https://en.wikipedia.org/wiki/Template:ILS
    inr: '₹',
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    jpy: '¥',
    // https://en.wikipedia.org/wiki/Template:JPY
    myr: 'MYR',
    // https://en.wikipedia.org/wiki/Template:MYR
    nis: 'ILS',
    // https://en.wikipedia.org/wiki/Template:ILS
    nok: 'NOK',
    //https://en.wikipedia.org/wiki/Template:NOK
    nok2: 'NOK',
    //https://en.wikipedia.org/wiki/Template:NOK
    nz$: 'NZ$',
    //https://en.wikipedia.org/wiki/Template:NZD
    nzd: 'NZ$',
    //https://en.wikipedia.org/wiki/Template:NZD
    peso: 'peso',
    //https://en.wikipedia.org/wiki/Template:Peso
    pkr: '₨',
    // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
    r$: 'BRL',
    //https://en.wikipedia.org/wiki/Template:BRL
    rmb: 'CN¥',
    // https://en.wikipedia.org/wiki/Template:CNY
    rub: '₽',
    // https://en.wikipedia.org/wiki/Template:RUB
    ruble: '₽',
    // https://en.wikipedia.org/wiki/Template:Ruble
    rupee: '₹',
    // https://en.wikipedia.org/wiki/Template:Rupee
    s$: 'sgd',
    // https://en.wikipedia.org/wiki/Template:SGD
    sek: 'SEK',
    // https://en.wikipedia.org/wiki/Template:SEK
    sek2: 'SEK',
    // https://en.wikipedia.org/wiki/Template:SEK
    sfr: 'CHF',
    // https://en.wikipedia.org/wiki/Template:CHF
    sgd: 'sgd',
    // https://en.wikipedia.org/wiki/Template:SGD
    shekel: 'ILS',
    // https://en.wikipedia.org/wiki/Template:ILS
    sheqel: 'ILS',
    // https://en.wikipedia.org/wiki/Template:ILS
    ttd: 'TTD',
    //https://en.wikipedia.org/wiki/Template:TTD
    us$: 'US$',
    // https://en.wikipedia.org/wiki/Template:US$
    usd: 'US$',
    // https://en.wikipedia.org/wiki/Template:US$
    yen: '¥',
    // https://en.wikipedia.org/wiki/Template:JPY
    zar: 'R' //https://en.wikipedia.org/wiki/Template:ZAR

  };

  var parseCurrency = function parseCurrency(tmpl, list) {
    var o = parse$3(tmpl, ['amount', 'code']);
    list.push(o);
    var code = o.template || '';

    if (code === 'currency') {
      code = o.code;

      if (!code) {
        o.code = code = 'usd'; //Special case when currency template has no code argument
      }
    } else if (code === '' || code === 'monnaie' || code === 'unité' || code === 'nombre' || code === 'nb') {
      code = o.code;
    }

    code = (code || '').toLowerCase();

    switch (code) {
      case 'us':
        o.code = code = 'usd';
        break;

      case 'uk':
        o.code = code = 'gbp';
        break;
    }

    var out = codes[code] || '';
    var str = "".concat(out).concat(o.amount || ''); //support unknown currencies after the number - like '5 BTC'

    if (o.code && !codes[o.code.toLowerCase()]) {
      str += ' ' + o.code;
    }

    return str;
  };

  var inrConvert = function inrConvert(tmpl, list) {
    var o = parse$3(tmpl, ['rupee_value', 'currency_formatting']);
    list.push(o);
    var formatting = o.currency_formatting;

    if (formatting) {
      var multiplier = 1;

      switch (formatting) {
        case 'k':
          multiplier = 1000;
          break;

        case 'm':
          multiplier = 1000000;
          break;

        case 'b':
          multiplier = 1000000000;
          break;

        case 't':
          multiplier = 1000000000000;
          break;

        case 'l':
          multiplier = 100000;
          break;

        case 'c':
          multiplier = 10000000;
          break;

        case 'lc':
          multiplier = 1000000000000;
          break;
      }

      o.rupee_value = o.rupee_value * multiplier;
    }

    var str = "inr ".concat(o.rupee_value || '');
    return str;
  };

  var currencies = {
    //this one is generic https://en.wikipedia.org/wiki/Template:Currency
    currency: parseCurrency,
    monnaie: parseCurrency,
    unité: parseCurrency,
    nombre: parseCurrency,
    nb: parseCurrency,
    iso4217: parseCurrency,
    inrconvert: inrConvert
  }; //the others fit the same pattern..

  Object.keys(codes).forEach(function (k) {
    currencies[k] = parseCurrency;
  });
  var currency = currencies;

  var templates$4 = {
    //https://en.wikipedia.org/wiki/Template:Election_box
    'election box begin': function electionBoxBegin(tmpl, list) {
      var data = parse$3(tmpl);
      list.push(data);
      return '';
    },
    'election box candidate': function electionBoxCandidate(tmpl, list) {
      var data = parse$3(tmpl);
      list.push(data);
      return '';
    },
    'election box hold with party link': function electionBoxHoldWithPartyLink(tmpl, list) {
      var data = parse$3(tmpl);
      list.push(data);
      return '';
    },
    'election box gain with party link': function electionBoxGainWithPartyLink(tmpl, list) {
      var data = parse$3(tmpl);
      list.push(data);
      return '';
    }
  }; //aliases

  templates$4['election box begin no change'] = templates$4['election box begin'];
  templates$4['election box begin no party'] = templates$4['election box begin'];
  templates$4['election box begin no party no change'] = templates$4['election box begin'];
  templates$4['election box inline begin'] = templates$4['election box begin'];
  templates$4['election box inline begin no change'] = templates$4['election box begin'];
  templates$4['election box candidate for alliance'] = templates$4['election box candidate'];
  templates$4['election box candidate minor party'] = templates$4['election box candidate'];
  templates$4['election box candidate no party link no change'] = templates$4['election box candidate'];
  templates$4['election box candidate with party link'] = templates$4['election box candidate'];
  templates$4['election box candidate with party link coalition 1918'] = templates$4['election box candidate'];
  templates$4['election box candidate with party link no change'] = templates$4['election box candidate'];
  templates$4['election box inline candidate'] = templates$4['election box candidate'];
  templates$4['election box inline candidate no change'] = templates$4['election box candidate'];
  templates$4['election box inline candidate with party link'] = templates$4['election box candidate'];
  templates$4['election box inline candidate with party link no change'] = templates$4['election box candidate'];
  templates$4['election box inline incumbent'] = templates$4['election box candidate'];
  var elections = templates$4;

  var flags = [['🇦🇩', 'and', 'andorra'], ['🇦🇪', 'are', 'united arab emirates'], ['🇦🇫', 'afg', 'afghanistan'], ['🇦🇬', 'atg', 'antigua and barbuda'], ['🇦🇮', 'aia', 'anguilla'], ['🇦🇱', 'alb', 'albania'], ['🇦🇲', 'arm', 'armenia'], ['🇦🇴', 'ago', 'angola'], ['🇦🇶', 'ata', 'antarctica'], ['🇦🇷', 'arg', 'argentina'], ['🇦🇸', 'asm', 'american samoa'], ['🇦🇹', 'aut', 'austria'], ['🇦🇺', 'aus', 'australia'], ['🇦🇼', 'abw', 'aruba'], ['🇦🇽', 'ala', 'åland islands'], ['🇦🇿', 'aze', 'azerbaijan'], ['🇧🇦', 'bih', 'bosnia and herzegovina'], ['🇧🇧', 'brb', 'barbados'], ['🇧🇩', 'bgd', 'bangladesh'], ['🇧🇪', 'bel', 'belgium'], ['🇧🇫', 'bfa', 'burkina faso'], ['🇧🇬', 'bgr', 'bulgaria'], ['🇧🇬', 'bul', //dupe
  'bulgaria'], ['🇧🇭', 'bhr', 'bahrain'], ['🇧🇮', 'bdi', 'burundi'], ['🇧🇯', 'ben', 'benin'], ['🇧🇱', 'blm', 'saint barthélemy'], ['🇧🇲', 'bmu', 'bermuda'], ['🇧🇳', 'brn', 'brunei darussalam'], ['🇧🇴', 'bol', 'bolivia'], ['🇧🇶', 'bes', 'bonaire, sint eustatius and saba'], ['🇧🇷', 'bra', 'brazil'], ['🇧🇸', 'bhs', 'bahamas'], ['🇧🇹', 'btn', 'bhutan'], ['🇧🇻', 'bvt', 'bouvet island'], ['🇧🇼', 'bwa', 'botswana'], ['🇧🇾', 'blr', 'belarus'], ['🇧🇿', 'blz', 'belize'], ['🇨🇦', 'can', 'canada'], ['🇨🇨', 'cck', 'cocos (keeling) islands'], ['🇨🇩', 'cod', 'congo'], ['🇨🇫', 'caf', 'central african republic'], ['🇨🇬', 'cog', 'congo'], ['🇨🇭', 'che', 'switzerland'], ['🇨🇮', 'civ', "côte d'ivoire"], ['🇨🇰', 'cok', 'cook islands'], ['🇨🇱', 'chl', 'chile'], ['🇨🇲', 'cmr', 'cameroon'], ['🇨🇳', 'chn', 'china'], ['🇨🇴', 'col', 'colombia'], ['🇨🇷', 'cri', 'costa rica'], ['🇨🇺', 'cub', 'cuba'], ['🇨🇻', 'cpv', 'cape verde'], ['🇨🇼', 'cuw', 'curaçao'], ['🇨🇽', 'cxr', 'christmas island'], ['🇨🇾', 'cyp', 'cyprus'], ['🇨🇿', 'cze', 'czech republic'], ['🇩🇪', 'deu', 'germany'], ['🇩🇪', 'ger', //alias
  'germany'], ['🇩🇯', 'dji', 'djibouti'], ['🇩🇰', 'dnk', 'denmark'], ['🇩🇲', 'dma', 'dominica'], ['🇩🇴', 'dom', 'dominican republic'], ['🇩🇿', 'dza', 'algeria'], ['🇪🇨', 'ecu', 'ecuador'], ['🇪🇪', 'est', 'estonia'], ['🇪🇬', 'egy', 'egypt'], ['🇪🇭', 'esh', 'western sahara'], ['🇪🇷', 'eri', 'eritrea'], ['🇪🇸', 'esp', 'spain'], ['🇪🇹', 'eth', 'ethiopia'], ['🇫🇮', 'fin', 'finland'], ['🇫🇯', 'fji', 'fiji'], ['🇫🇰', 'flk', 'falkland islands (malvinas)'], ['🇫🇲', 'fsm', 'micronesia'], ['🇫🇴', 'fro', 'faroe islands'], ['🇫🇷', 'fra', 'france'], ['🇬🇦', 'gab', 'gabon'], ['🇬🇧', 'gbr', 'united kingdom'], ['🇬🇩', 'grd', 'grenada'], // ['🇬🇪', 'geo', 'georgia'],
  ['🇬🇫', 'guf', 'french guiana'], ['🇬🇬', 'ggy', 'guernsey'], ['🇬🇭', 'gha', 'ghana'], ['🇬🇮', 'gib', 'gibraltar'], ['🇬🇱', 'grl', 'greenland'], ['🇬🇲', 'gmb', 'gambia'], ['🇬🇳', 'gin', 'guinea'], ['🇬🇵', 'glp', 'guadeloupe'], ['🇬🇶', 'gnq', 'equatorial guinea'], ['🇬🇷', 'grc', 'greece'], ['🇬🇸', 'sgs', 'south georgia'], ['🇬🇹', 'gtm', 'guatemala'], ['🇬🇺', 'gum', 'guam'], ['🇬🇼', 'gnb', 'guinea-bissau'], ['🇬🇾', 'guy', 'guyana'], ['🇭🇰', 'hkg', 'hong kong'], ['🇭🇲', 'hmd', 'heard island and mcdonald islands'], ['🇭🇳', 'hnd', 'honduras'], ['🇭🇷', 'hrv', 'croatia'], ['🇭🇹', 'hti', 'haiti'], ['🇭🇺', 'hun', 'hungary'], ['🇮🇩', 'idn', 'indonesia'], ['🇮🇪', 'irl', 'ireland'], ['🇮🇱', 'isr', 'israel'], ['🇮🇲', 'imn', 'isle of man'], ['🇮🇳', 'ind', 'india'], ['🇮🇴', 'iot', 'british indian ocean territory'], ['🇮🇶', 'irq', 'iraq'], ['🇮🇷', 'irn', 'iran'], ['🇮🇸', 'isl', 'iceland'], ['🇮🇹', 'ita', 'italy'], ['🇯🇪', 'jey', 'jersey'], ['🇯🇲', 'jam', 'jamaica'], ['🇯🇴', 'jor', 'jordan'], ['🇯🇵', 'jpn', 'japan'], ['🇰🇪', 'ken', 'kenya'], ['🇰🇬', 'kgz', 'kyrgyzstan'], ['🇰🇭', 'khm', 'cambodia'], ['🇰🇮', 'kir', 'kiribati'], ['🇰🇲', 'com', 'comoros'], ['🇰🇳', 'kna', 'saint kitts and nevis'], ['🇰🇵', 'prk', 'north korea'], ['🇰🇷', 'kor', 'south korea'], ['🇰🇼', 'kwt', 'kuwait'], ['🇰🇾', 'cym', 'cayman islands'], ['🇰🇿', 'kaz', 'kazakhstan'], ['🇱🇦', 'lao', "lao people's democratic republic"], ['🇱🇧', 'lbn', 'lebanon'], ['🇱🇨', 'lca', 'saint lucia'], ['🇱🇮', 'lie', 'liechtenstein'], ['🇱🇰', 'lka', 'sri lanka'], ['🇱🇷', 'lbr', 'liberia'], ['🇱🇸', 'lso', 'lesotho'], ['🇱🇹', 'ltu', 'lithuania'], ['🇱🇺', 'lux', 'luxembourg'], ['🇱🇻', 'lva', 'latvia'], ['🇱🇾', 'lby', 'libya'], ['🇲🇦', 'mar', 'morocco'], ['🇲🇨', 'mco', 'monaco'], ['🇲🇩', 'mda', 'moldova'], ['🇲🇪', 'mne', 'montenegro'], ['🇲🇫', 'maf', 'saint martin (french part)'], ['🇲🇬', 'mdg', 'madagascar'], ['🇲🇭', 'mhl', 'marshall islands'], ['🇲🇰', 'mkd', 'macedonia'], ['🇲🇱', 'mli', 'mali'], ['🇲🇲', 'mmr', 'myanmar'], ['🇲🇳', 'mng', 'mongolia'], ['🇲🇴', 'mac', 'macao'], ['🇲🇵', 'mnp', 'northern mariana islands'], ['🇲🇶', 'mtq', 'martinique'], ['🇲🇷', 'mrt', 'mauritania'], ['🇲🇸', 'msr', 'montserrat'], ['🇲🇹', 'mlt', 'malta'], ['🇲🇺', 'mus', 'mauritius'], ['🇲🇻', 'mdv', 'maldives'], ['🇲🇼', 'mwi', 'malawi'], ['🇲🇽', 'mex', 'mexico'], ['🇲🇾', 'mys', 'malaysia'], ['🇲🇿', 'moz', 'mozambique'], ['🇳🇦', 'nam', 'namibia'], ['🇳🇨', 'ncl', 'new caledonia'], ['🇳🇪', 'ner', 'niger'], ['🇳🇫', 'nfk', 'norfolk island'], ['🇳🇬', 'nga', 'nigeria'], ['🇳🇮', 'nic', 'nicaragua'], ['🇳🇱', 'nld', 'netherlands'], ['🇳🇴', 'nor', 'norway'], ['🇳🇵', 'npl', 'nepal'], ['🇳🇷', 'nru', 'nauru'], ['🇳🇺', 'niu', 'niue'], ['🇳🇿', 'nzl', 'new zealand'], ['🇴🇲', 'omn', 'oman'], ['🇵🇦', 'pan', 'panama'], ['🇵🇪', 'per', 'peru'], ['🇵🇫', 'pyf', 'french polynesia'], ['🇵🇬', 'png', 'papua new guinea'], ['🇵🇭', 'phl', 'philippines'], ['🇵🇰', 'pak', 'pakistan'], ['🇵🇱', 'pol', 'poland'], ['🇵🇲', 'spm', 'saint pierre and miquelon'], ['🇵🇳', 'pcn', 'pitcairn'], ['🇵🇷', 'pri', 'puerto rico'], ['🇵🇸', 'pse', 'palestinian territory'], ['🇵🇹', 'prt', 'portugal'], ['🇵🇼', 'plw', 'palau'], ['🇵🇾', 'pry', 'paraguay'], ['🇶🇦', 'qat', 'qatar'], ['🇷🇪', 'reu', 'réunion'], ['🇷🇴', 'rou', 'romania'], ['🇷🇸', 'srb', 'serbia'], ['🇷🇺', 'rus', 'russia'], ['🇷🇼', 'rwa', 'rwanda'], ['🇸🇦', 'sau', 'saudi arabia'], ['🇸🇧', 'slb', 'solomon islands'], ['🇸🇨', 'syc', 'seychelles'], ['🇸🇩', 'sdn', 'sudan'], ['🇸🇪', 'swe', 'sweden'], ['🇸🇬', 'sgp', 'singapore'], ['🇸🇭', 'shn', 'saint helena, ascension and tristan da cunha'], ['🇸🇮', 'svn', 'slovenia'], ['🇸🇯', 'sjm', 'svalbard and jan mayen'], ['🇸🇰', 'svk', 'slovakia'], ['🇸🇱', 'sle', 'sierra leone'], ['🇸🇲', 'smr', 'san marino'], ['🇸🇳', 'sen', 'senegal'], ['🇸🇴', 'som', 'somalia'], ['🇸🇷', 'sur', 'suriname'], ['🇸🇸', 'ssd', 'south sudan'], ['🇸🇹', 'stp', 'sao tome and principe'], ['🇸🇻', 'slv', 'el salvador'], ['🇸🇽', 'sxm', 'sint maarten (dutch part)'], ['🇸🇾', 'syr', 'syrian arab republic'], ['🇸🇿', 'swz', 'swaziland'], ['🇹🇨', 'tca', 'turks and caicos islands'], ['🇹🇩', 'tcd', 'chad'], ['🇹🇫', 'atf', 'french southern territories'], ['🇹🇬', 'tgo', 'togo'], ['🇹🇭', 'tha', 'thailand'], ['🇹🇯', 'tjk', 'tajikistan'], ['🇹🇰', 'tkl', 'tokelau'], ['🇹🇱', 'tls', 'timor-leste'], ['🇹🇲', 'tkm', 'turkmenistan'], ['🇹🇳', 'tun', 'tunisia'], ['🇹🇴', 'ton', 'tonga'], ['🇹🇷', 'tur', 'turkey'], ['🇹🇹', 'tto', 'trinidad and tobago'], ['🇹🇻', 'tuv', 'tuvalu'], ['🇹🇼', 'twn', 'taiwan'], ['🇹🇿', 'tza', 'tanzania'], ['🇺🇦', 'ukr', 'ukraine'], ['🇺🇬', 'uga', 'uganda'], ['🇺🇲', 'umi', 'united states minor outlying islands'], ['🇺🇸', 'usa', 'united states'], ['🇺🇸', 'us', //alias
  'united states'], ['🇺🇾', 'ury', 'uruguay'], ['🇺🇿', 'uzb', 'uzbekistan'], ['🇻🇦', 'vat', 'vatican city'], ['🇻🇨', 'vct', 'saint vincent and the grenadines'], ['🇻🇪', 'ven', 'venezuela'], ['🇻🇬', 'vgb', 'virgin islands, british'], ['🇻🇮', 'vir', 'virgin islands, u.s.'], ['🇻🇳', 'vnm', 'viet nam'], ['🇻🇺', 'vut', 'vanuatu'], ['', 'win', 'west indies'], ['🇼🇫', 'wlf', 'wallis and futuna'], ['🇼🇸', 'wsm', 'samoa'], ['🇾🇪', 'yem', 'yemen'], ['🇾🇹', 'myt', 'mayotte'], ['🇿🇦', 'zaf', 'south africa'], ['🇿🇲', 'zmb', 'zambia'], ['🇿🇼 ', 'zwe', 'zimbabwe'], //others (later unicode versions)
  ['🇺🇳', 'un', 'united nations'], ['🏴󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿', 'eng', 'england'], ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sct', 'scotland'], ['🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'wal', 'wales'], ['🇪🇺', 'eu', 'european union']];

  var templates$5 = {
    //https://en.wikipedia.org/wiki/Template:Flag
    // {{flag|USA}} →  USA
    flag: function flag(tmpl) {
      var order = ['flag', 'variant'];
      var obj = parse$3(tmpl, order);
      var name = obj.flag || '';
      obj.flag = (obj.flag || '').toLowerCase();
      var found = flags.find(function (a) {
        return obj.flag === a[1] || obj.flag === a[2];
      }) || [];
      var flag = found[0] || '';
      return "".concat(flag, " [[").concat(found[2], "|").concat(name, "]]");
    },
    // {{flagcountry|USA}} →  United States
    flagcountry: function flagcountry(tmpl) {
      var order = ['flag', 'variant'];
      var obj = parse$3(tmpl, order);
      obj.flag = (obj.flag || '').toLowerCase();
      var found = flags.find(function (a) {
        return obj.flag === a[1] || obj.flag === a[2];
      }) || [];
      var flag = found[0] || '';
      return "".concat(flag, " [[").concat(found[2], "]]");
    },
    // (unlinked flag-country)
    flagcu: function flagcu(tmpl) {
      var order = ['flag', 'variant'];
      var obj = parse$3(tmpl, order);
      obj.flag = (obj.flag || '').toLowerCase();
      var found = flags.find(function (a) {
        return obj.flag === a[1] || obj.flag === a[2];
      }) || [];
      var flag = found[0] || '';
      return "".concat(flag, " ").concat(found[2]);
    },
    //https://en.wikipedia.org/wiki/Template:Flagicon
    // {{flagicon|USA}} → United States
    flagicon: function flagicon(tmpl) {
      var order = ['flag', 'variant'];
      var obj = parse$3(tmpl, order);
      obj.flag = (obj.flag || '').toLowerCase();
      var found = flags.find(function (a) {
        return obj.flag === a[1] || obj.flag === a[2];
      });

      if (!found) {
        return '';
      }

      return "[[".concat(found[2], "|").concat(found[0], "]]");
    },
    //unlinked flagicon
    flagdeco: function flagdeco(tmpl) {
      var order = ['flag', 'variant'];
      var obj = parse$3(tmpl, order);
      obj.flag = (obj.flag || '').toLowerCase();
      var found = flags.find(function (a) {
        return obj.flag === a[1] || obj.flag === a[2];
      }) || [];
      return found[0] || '';
    },
    //same, but a soccer team
    fb: function fb(tmpl) {
      var order = ['flag', 'variant'];
      var obj = parse$3(tmpl, order);
      obj.flag = (obj.flag || '').toLowerCase();
      var found = flags.find(function (a) {
        return obj.flag === a[1] || obj.flag === a[2];
      });

      if (!found) {
        return '';
      }

      return "".concat(found[0], " [[").concat(found[2], " national football team|").concat(found[2], "]]");
    },
    fbicon: function fbicon(tmpl) {
      var order = ['flag', 'variant'];
      var obj = parse$3(tmpl, order);
      obj.flag = (obj.flag || '').toLowerCase();
      var found = flags.find(function (a) {
        return obj.flag === a[1] || obj.flag === a[2];
      });

      if (!found) {
        return '';
      }

      return " [[".concat(found[2], " national football team|").concat(found[0], "]]");
    },
    flagathlete: function flagathlete(tmpl) {
      var order = ['name', 'flag', 'variant'];
      var obj = parse$3(tmpl, order);
      obj.flag = (obj.flag || '').toLowerCase();
      var found = flags.find(function (a) {
        return obj.flag === a[1] || obj.flag === a[2];
      });

      if (!found) {
        return "[[".concat(obj.name || '', "]]");
      }

      return "".concat(found[0], " [[").concat(obj.name || '', "]] (").concat(found[1].toUpperCase(), ")");
    }
  }; //support {{can}}

  flags.forEach(function (a) {
    templates$5[a[1]] = function () {
      return a[0];
    };
  }); //cricket

  templates$5['cr'] = templates$5.flagcountry;
  templates$5['cr-rt'] = templates$5.flagcountry;
  templates$5['cricon'] = templates$5.flagicon;
  var flags_1 = templates$5;

  var getLang = function getLang(name) {
    //grab the language from the template name - 'ipa-de'
    var lang = name.match(/ipac?-(.+)/);

    if (lang !== null) {
      if (languages.hasOwnProperty(lang[1]) === true) {
        return languages[lang[1]].english_title;
      }

      return lang[1];
    }

    return null;
  }; // pronounciation info


  var templates$6 = {
    // https://en.wikipedia.org/wiki/Template:IPA
    ipa: function ipa(tmpl, list) {
      var obj = parse$3(tmpl, ['transcription', 'lang', 'audio']);
      obj.lang = getLang(obj.template);
      obj.template = 'ipa';
      list.push(obj);
      return '';
    },
    //https://en.wikipedia.org/wiki/Template:IPAc-en
    ipac: function ipac(tmpl, list) {
      var obj = parse$3(tmpl);
      obj.transcription = (obj.list || []).join(',');
      delete obj.list;
      obj.lang = getLang(obj.template);
      obj.template = 'ipac';
      list.push(obj);
      return '';
    },
    transl: function transl(tmpl, list) {
      var obj = parse$3(tmpl, ['lang', 'text', 'text2']); // support 3-param

      if (obj.text2) {
        obj.iso = obj.text;
        obj.text = obj.text2;
        delete obj.text2;
      }

      list.push(obj);
      return obj.text || '';
    }
  }; // - other languages -
  // Polish, {{IPAc-pl}}	{{IPAc-pl|'|sz|cz|e|ć|i|n}} → [ˈʂt͡ʂɛt͡ɕin]
  // Portuguese, {{IPAc-pt}}	{{IPAc-pt|p|o|<|r|t|u|'|g|a|l|lang=pt}} and {{IPAc-pt|b|r|a|'|s|i|l|lang=br}} → [puɾtuˈɣaɫ] and [bɾaˈsiw]

  Object.keys(languages).forEach(function (lang) {
    templates$6['ipa-' + lang] = templates$6.ipa;
    templates$6['ipac-' + lang] = templates$6.ipac;
  });
  var ipa = templates$6;

  var templates$7 = {
    lang: 1,
    //this one has a million variants
    'lang-de': 0,
    'rtl-lang': 1,
    //german keyboard letterscn
    taste: 0,
    //https://en.wikipedia.org/wiki/Template:Nihongo
    nihongo: function nihongo(tmpl, list) {
      var obj = parse$3(tmpl, ['english', 'kanji', 'romaji', 'extra']);
      list.push(obj);
      var str = obj.english || obj.romaji || '';

      if (obj.kanji) {
        str += " (".concat(obj.kanji, ")");
      }

      return str;
    }
  }; //https://en.wikipedia.org/wiki/Category:Lang-x_templates

  Object.keys(languages).forEach(function (k) {
    templates$7['lang-' + k] = templates$7['lang-de'];
  });
  templates$7['nihongo2'] = templates$7.nihongo;
  templates$7['nihongo3'] = templates$7.nihongo;
  templates$7['nihongo-s'] = templates$7.nihongo;
  templates$7['nihongo foot'] = templates$7.nihongo;
  var languages_1 = templates$7;

  //simply num/denom * 100

  var _percentage = function percentage(obj) {
    if (!obj.numerator && !obj.denominator) {
      return null;
    }

    var perc = Number(obj.numerator) / Number(obj.denominator);
    perc *= 100;
    var dec = Number(obj.decimals);

    if (isNaN(dec)) {
      dec = 1;
    }

    perc = perc.toFixed(dec);
    return Number(perc);
  };

  var templates$8 = {
    // https://en.wikipedia.org/wiki/Template:Math
    math: function math(tmpl, list) {
      var obj = parse$3(tmpl, ['formula']);
      list.push(obj);
      return '\n\n' + (obj.formula || '') + '\n\n';
    },
    //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
    frac: function frac(tmpl, list) {
      var order = ['a', 'b', 'c'];
      var obj = parse$3(tmpl, order);
      var data = {
        template: 'sfrac'
      };

      if (obj.c) {
        data.integer = obj.a;
        data.numerator = obj.b;
        data.denominator = obj.c;
      } else if (obj.b) {
        data.numerator = obj.a;
        data.denominator = obj.b;
      } else {
        data.numerator = 1;
        data.denominator = obj.a;
      }

      list.push(data);

      if (data.integer) {
        return "".concat(data.integer, " ").concat(data.numerator, "\u2044").concat(data.denominator);
      }

      return "".concat(data.numerator, "\u2044").concat(data.denominator);
    },
    //https://en.wikipedia.org/wiki/Template:Radic
    radic: function radic(tmpl) {
      var order = ['after', 'before'];
      var obj = parse$3(tmpl, order);
      return "".concat(obj.before || '', "\u221A").concat(obj.after || '');
    },
    //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
    percentage: function percentage(tmpl) {
      var obj = parse$3(tmpl, ['numerator', 'denominator', 'decimals']);

      var num = _percentage(obj);

      if (num === null) {
        return '';
      }

      return num + '%';
    },
    // {{Percent-done|done=N|total=N|digits=N}}
    'percent-done': function percentDone(tmpl) {
      var obj = parse$3(tmpl, ['done', 'total', 'digits']);

      var num = _percentage({
        numerator: obj.done,
        denominator: obj.total,
        decimals: obj.digits
      });

      if (num === null) {
        return '';
      }

      return "".concat(obj.done, " (").concat(num, "%) done");
    },
    'winning percentage': function winningPercentage(tmpl, list) {
      var obj = parse$3(tmpl, ['wins', 'losses', 'ties']);
      list.push(obj);
      var wins = Number(obj.wins);
      var losses = Number(obj.losses);
      var ties = Number(obj.ties) || 0;
      var games = wins + losses + ties;

      if (obj.ignore_ties === 'y') {
        ties = 0;
      }

      if (ties) {
        wins += ties / 2;
      }

      var num = _percentage({
        numerator: wins,
        denominator: games,
        decimals: 1
      });

      if (num === null) {
        return '';
      }

      return ".".concat(num * 10);
    },
    winlosspct: function winlosspct(tmpl, list) {
      var obj = parse$3(tmpl, ['wins', 'losses']);
      list.push(obj);
      var wins = Number(obj.wins);
      var losses = Number(obj.losses);

      var num = _percentage({
        numerator: wins,
        denominator: wins + losses,
        decimals: 1
      });

      if (num === null) {
        return '';
      }

      num = ".".concat(num * 10);
      return "".concat(wins || 0, " || ").concat(losses || 0, " || ").concat(num || '-');
    }
  }; //aliases

  templates$8['sfrac'] = templates$8.frac;
  templates$8['sqrt'] = templates$8.radic;
  templates$8['pct'] = templates$8.percentage;
  templates$8['percent'] = templates$8.percentage;
  templates$8['winpct'] = templates$8['winning percentage'];
  templates$8['winperc'] = templates$8['winning percentage'];
  var math = templates$8;

  var generic = function generic(tmpl, list, alias) {
    var obj = parse$3(tmpl);

    if (alias) {
      obj.name = obj.template;
      obj.template = alias;
    }

    list.push(obj);
    return '';
  };

  var misc$2 = {
    //i18n templates
    persondata: generic,
    taxobox: generic,
    citation: generic,
    portal: generic,
    reflist: generic,
    'cite book': generic,
    'cite journal': generic,
    'cite web': generic,
    'commons cat': generic,
    // https://en.wikipedia.org/wiki/Template:Portuguese_name
    'portuguese name': ['first', 'second', 'suffix'],
    uss: ['ship', 'id'],
    isbn: function isbn(tmpl, list) {
      var order = ['id', 'id2', 'id3'];
      var obj = parse$3(tmpl, order);
      list.push(obj);
      return 'ISBN: ' + (obj.id || '');
    },
    //https://en.wikipedia.org/wiki/Template:Marriage
    //this one creates a template, and an inline response
    marriage: function marriage(tmpl, list) {
      var data = parse$3(tmpl, ['spouse', 'from', 'to', 'end']);
      list.push(data);
      var str = "".concat(data.spouse || '');

      if (data.from) {
        if (data.to) {
          str += " (m. ".concat(data.from, "-").concat(data.to, ")");
        } else {
          str += " (m. ".concat(data.from, ")");
        }
      }

      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Based_on
    'based on': function basedOn(tmpl, list) {
      var obj = parse$3(tmpl, ['title', 'author']);
      list.push(obj);
      return "".concat(obj.title, " by ").concat(obj.author || '');
    },
    //https://en.wikipedia.org/wiki/Template:Video_game_release
    'video game release': function videoGameRelease(tmpl, list) {
      var order = ['region', 'date', 'region2', 'date2', 'region3', 'date3', 'region4', 'date4'];
      var obj = parse$3(tmpl, order);
      var template = {
        template: 'video game release',
        releases: []
      };

      for (var i = 0; i < order.length; i += 2) {
        if (obj[order[i]]) {
          template.releases.push({
            region: obj[order[i]],
            date: obj[order[i + 1]]
          });
        }
      }

      list.push(template);
      var str = template.releases.map(function (o) {
        return "".concat(o.region, ": ").concat(o.date || '');
      }).join('\n\n');
      return '\n' + str + '\n';
    },
    //barrels of oil https://en.wikipedia.org/wiki/Template:Bbl_to_t
    'bbl to t': function bblToT(tmpl, list) {
      var obj = parse$3(tmpl, ['barrels']);
      list.push(obj);

      if (obj.barrels === '0') {
        return obj.barrels + ' barrel';
      }

      return obj.barrels + ' barrels';
    },
    //https://en.wikipedia.org/wiki/Template:Historical_populations
    'historical populations': function historicalPopulations(tmpl, list) {
      var data = parse$3(tmpl);
      data.list = data.list || [];
      var years = [];

      for (var i = 0; i < data.list.length; i += 2) {
        var num = data.list[i + 1];
        years.push({
          year: data.list[i],
          val: Number(num) || num
        });
      }

      data.data = years;
      delete data.list;
      list.push(data);
      return '';
    }
  };
  var misc_1$1 = misc$2;

  // okay, these just hurts my feelings
  // https://www.mediawiki.org/wiki/Help:Magic_words#Other
  var punctuation = [// https://en.wikipedia.org/wiki/Template:%C2%B7
  ['·', '·'], ['·', '·'], ['dot', '·'], ['middot', '·'], ['•', ' • '], //yup, oxford comma template
  [',', ','], ['1/2', '1⁄2'], ['1/3', '1⁄3'], ['2/3', '2⁄3'], ['1/4', '1⁄4'], ['3/4', '3⁄4'], ['–', '–'], ['ndash', '–'], ['en dash', '–'], ['spaced ndash', ' – '], ['—', '—'], ['mdash', '—'], ['em dash', '—'], ['number sign', '#'], ['ibeam', 'I'], ['&', '&'], [';', ';'], ['ampersand', '&'], ['snds', ' – '], ['snd', ' – '], // these '{{^}}' things are nuts, and used as some ilicit spacing thing.
  ['^', ' '], ['!', '|'], ['\\', ' /'], ['`', '`'], ['=', '='], ['bracket', '['], ['[', '['], ['*', '*'], ['asterisk', '*'], ['long dash', '———'], ['clear', '\n\n'], ['h.', 'ḥ']];
  var templates$9 = {};
  punctuation.forEach(function (a) {
    templates$9[a[0]] = a[1];
  });
  var punctuation_1 = templates$9;

  var templates$a = {
    //https://en.wikipedia.org/wiki/Template:Taxon_info
    'taxon info': ['taxon', 'item'],
    //minor planet - https://en.wikipedia.org/wiki/Template:MPC
    mpc: function mpc(tmpl, list) {
      var obj = parse$3(tmpl, ['number', 'text']);
      list.push(obj);
      return "[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ".concat(obj.text || obj.number, "]");
    },
    //https://en.wikipedia.org/wiki/Template:Chem2
    chem2: function chem2(tmpl, list) {
      var obj = parse$3(tmpl, ['equation']);
      list.push(obj);
      return obj.equation;
    },
    //https://en.wikipedia.org/wiki/Template:Sky
    sky: function sky(tmpl, list) {
      var obj = parse$3(tmpl, ['asc_hours', 'asc_minutes', 'asc_seconds', 'dec_sign', 'dec_degrees', 'dec_minutes', 'dec_seconds', 'distance']);
      var template = {
        template: 'sky',
        ascension: {
          hours: obj.asc_hours,
          minutes: obj.asc_minutes,
          seconds: obj.asc_seconds
        },
        declination: {
          sign: obj.dec_sign,
          degrees: obj.dec_degrees,
          minutes: obj.dec_minutes,
          seconds: obj.dec_seconds
        },
        distance: obj.distance
      };
      list.push(template);
      return '';
    },
    // Parse https://en.wikipedia.org/wiki/Template:Medical_cases_chart -- see
    // https://en.wikipedia.org/wiki/Module:Medical_cases_chart for the original
    // parsing code.
    'medical cases chart': function medicalCasesChart(tmpl, list) {
      var order = ['date', 'deathsExpr', 'recoveriesExpr', 'casesExpr', '4thExpr', '5thExpr', 'col1', 'col1Change', 'col2', 'col2Change'];
      var obj = parse$3(tmpl);
      obj.data = obj.data || '';
      var rows = obj.data.split('\n'); // Mimic row parsing in _buildBars in the Lua source, from the following
      // line on:
      //
      //     for parameter in mw.text.gsplit(line, ';') do

      var dataArray = rows.map(function (row) {
        var parameters = row.split(';');
        var rowObject = {
          options: new Map()
        };
        var positionalIndex = 0;

        for (var i = 0; i < parameters.length; i++) {
          var parameter = parameters[i].trim();

          if (parameter.match(/^[a-zA-Z_]/)) {
            // Named argument
            var _parameter$split = parameter.split('='),
                _parameter$split2 = _slicedToArray(_parameter$split, 2),
                key = _parameter$split2[0],
                value = _parameter$split2[1]; // At this point, the Lua code evaluates alttot1 and alttot2 values as
            // #expr expressions, but we just pass them through. See also:
            // https://www.mediawiki.org/wiki/Help:Extension:ParserFunctions##expr


            if (value === undefined) {
              value = null;
            }

            rowObject.options.set(key, value);
          } else {
            // Positional argument
            // Here again, the Lua code evaluates arguments at index 1 through 5
            // as #expr expressions, but we just pass them through.
            if (positionalIndex < order.length) {
              rowObject[order[positionalIndex]] = parameter;
            }

            positionalIndex++;
          }
        }

        for (; positionalIndex < order.length; positionalIndex++) {
          rowObject[order[positionalIndex]] = null;
        }

        return rowObject;
      });
      obj.data = dataArray;
      list.push(obj);
      return '';
    },
    'medical cases chart/row': function medicalCasesChartRow(tmpl) {
      // Deprecated template; we keep it.
      return tmpl;
    }
  };
  var science = templates$a;

  var sports = {
    player: function player(tmpl, list) {
      var res = parse$3(tmpl, ['number', 'country', 'name', 'dl']);
      list.push(res);
      var str = "[[".concat(res.name, "]]");

      if (res.country) {
        var country = (res.country || '').toLowerCase();
        var flag = flags.find(function (a) {
          return country === a[1] || country === a[2];
        }) || [];

        if (flag && flag[0]) {
          str = flag[0] + '  ' + str;
        }
      }

      if (res.number) {
        str = res.number + ' ' + str;
      }

      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Goal
    goal: function goal(tmpl, list) {
      var res = parse$3(tmpl);
      var obj = {
        template: 'goal',
        data: []
      };
      var arr = res.list || [];

      for (var i = 0; i < arr.length; i += 2) {
        obj.data.push({
          min: arr[i],
          note: arr[i + 1] || ''
        });
      }

      list.push(obj); //generate a little text summary

      var summary = '⚽ ';
      summary += obj.data.map(function (o) {
        var note = o.note;

        if (note) {
          note = " (".concat(note, ")");
        }

        return o.min + "'" + note;
      }).join(', ');
      return summary;
    },
    //yellow card
    yel: function yel(tmpl, list) {
      var obj = parse$3(tmpl, ['min']);
      list.push(obj);

      if (obj.min) {
        return "yellow: ".concat(obj.min || '', "'"); //no yellow-card emoji
      }

      return '';
    },
    subon: function subon(tmpl, list) {
      var obj = parse$3(tmpl, ['min']);
      list.push(obj);

      if (obj.min) {
        return "sub on: ".concat(obj.min || '', "'"); //no yellow-card emoji
      }

      return '';
    },
    suboff: function suboff(tmpl, list) {
      var obj = parse$3(tmpl, ['min']);
      list.push(obj);

      if (obj.min) {
        return "sub off: ".concat(obj.min || '', "'"); //no yellow-card emoji
      }

      return '';
    },
    pengoal: function pengoal(tmpl, list) {
      list.push({
        template: 'pengoal'
      });
      return '✅';
    },
    penmiss: function penmiss(tmpl, list) {
      list.push({
        template: 'penmiss'
      });
      return '❌';
    },
    //'red' card - {{sent off|cards|min1|min2}}
    'sent off': function sentOff(tmpl, list) {
      var obj = parse$3(tmpl, ['cards']);
      var result = {
        template: 'sent off',
        cards: obj.cards,
        minutes: obj.list || []
      };
      list.push(result);
      var mins = result.minutes.map(function (m) {
        return m + "'";
      }).join(', ');
      return 'sent off: ' + mins;
    }
  };
  var soccer = sports;

  var misc$3 = {
    'baseball secondary style': 0,
    mlbplayer: function mlbplayer(tmpl, list) {
      var obj = parse$3(tmpl, ['number', 'name', 'dl']);
      list.push(obj);
      return obj.name;
    }
  };
  var sports$1 = Object.assign({}, misc$3, brackets_1, soccer);

  var codes$1 = {
    adx: 'adx',
    //https://en.wikipedia.org/wiki/Template:Abu_Dhabi_Securities_Exchange
    aim: 'aim',
    //https://en.wikipedia.org/wiki/Template:Alternative_Investment_Market
    bvpasa: 'bvpasa',
    //https://en.wikipedia.org/wiki/Template:BVPASA
    asx: 'asx',
    //https://en.wikipedia.org/wiki/Template:Australian_Securities_Exchange
    athex: 'athex',
    //https://en.wikipedia.org/wiki/Template:Athens_Exchange
    bhse: 'bhse',
    //https://en.wikipedia.org/wiki/Template:Bahrain_Bourse
    bvb: 'bvb',
    //https://en.wikipedia.org/wiki/Template:Bucharest_Stock_Exchange
    bbv: 'bbv',
    //https://en.wikipedia.org/wiki/Template:BBV
    bsx: 'bsx',
    //https://en.wikipedia.org/wiki/Template:Bermuda_Stock_Exchange
    b3: 'b3',
    //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
    'bm&f': 'b3',
    //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
    'bm&f bovespa': 'b3',
    //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
    bwse: 'bwse',
    //https://en.wikipedia.org/wiki/Template:Botswana_Stock_Exchange
    'botswana stock exchange': 'botswana stock exchange',
    //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
    bse: 'bse',
    //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
    'bombay stock exchange': 'bombay stock exchange',
    //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
    bpse: 'bpse',
    //https://en.wikipedia.org/wiki/Template:Budapest_Stock_Exchange
    bcba: 'bcba',
    //https://en.wikipedia.org/wiki/Template:Buenos_Aires_Stock_Exchange
    'canadian securities exchange': 'canadian securities exchange',
    //https://en.wikipedia.org/wiki/Template:Canadian_Securities_Exchange
    bvc: 'bvc',
    //https://en.wikipedia.org/wiki/Template:Colombian_Securities_Exchange
    cse: 'cse',
    //https://en.wikipedia.org/wiki/Template:Chittagong_Stock_Exchange
    darse: 'darse',
    //https://en.wikipedia.org/wiki/Template:Dar_es_Salaam_Stock_Exchange
    dse: 'dse',
    //https://en.wikipedia.org/wiki/Template:Dhaka_Stock_Exchange
    dfm: 'dfm',
    //https://en.wikipedia.org/wiki/Template:Dubai_Financial_Market
    euronext: 'euronext',
    //https://en.wikipedia.org/wiki/Template:Euronext
    fwb: 'fwb',
    //https://en.wikipedia.org/wiki/Template:Frankfurt_Stock_Exchange
    fse: 'fse',
    //https://en.wikipedia.org/wiki/Template:Fukuoka_Stock_Exchange
    gse: 'gse',
    //https://en.wikipedia.org/wiki/Template:Ghana_Stock_Exchange
    gtsm: 'gtsm',
    //https://en.wikipedia.org/wiki/Template:Gre_Tai_Securities_Market
    sehk: 'sehk',
    //https://en.wikipedia.org/wiki/Template:Hong_Kong_Stock_Exchange
    idx: 'idx',
    //https://en.wikipedia.org/wiki/Template:Indonesia_Stock_Exchange
    nse: 'nse',
    //https://en.wikipedia.org/wiki/Template:National_Stock_Exchange_of_India
    ise: 'ise',
    //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
    isin: 'isin',
    //https://en.wikipedia.org/wiki/Template:ISIN
    bist: 'bist',
    //https://en.wikipedia.org/wiki/Template:Borsa_Istanbul
    bit: 'bit',
    //https://en.wikipedia.org/wiki/Template:Borsa_Italiana
    jasdaq: 'jasdaq',
    //https://en.wikipedia.org/wiki/Template:JASDAQ
    jse: 'jse',
    //https://en.wikipedia.org/wiki/Template:Johannesburg_Stock_Exchange
    kase: 'kase',
    //https://en.wikipedia.org/wiki/Template:Kazakhstan_Stock_Exchange
    krx: 'krx',
    //https://en.wikipedia.org/wiki/Template:Korea_Exchange
    bvl: 'bvl',
    //https://en.wikipedia.org/wiki/Template:Lima_Stock_Exchange
    lse: 'lse',
    //https://en.wikipedia.org/wiki/Template:London_Stock_Exchange
    luxse: 'luxse',
    //https://en.wikipedia.org/wiki/Template:Luxembourg_Stock_Exchange
    bmad: 'bmad',
    //https://en.wikipedia.org/wiki/Template:Bolsa_de_Madrid
    myx: 'myx',
    //https://en.wikipedia.org/wiki/Template:Bursa_Malaysia
    bmv: 'bmv',
    //https://en.wikipedia.org/wiki/Template:Mexican_Stock_Exchange
    mcx: 'mcx',
    //https://en.wikipedia.org/wiki/Template:Moscow_Exchange
    mutf: 'mutf',
    //https://en.wikipedia.org/wiki/Template:Mutual_fund
    nag: 'nag',
    //https://en.wikipedia.org/wiki/Template:Nagoya_Stock_Exchange
    kn: 'kn',
    //https://en.wikipedia.org/wiki/Template:Nairobi_Securities_Exchange
    'nasdaq dubai': 'nasdaq dubai',
    //https://en.wikipedia.org/wiki/Template:NASDAQ_Dubai
    nasdaq: 'nasdaq',
    //https://en.wikipedia.org/wiki/Template:NASDAQ
    neeq: 'neeq',
    //https://en.wikipedia.org/wiki/Template:NEEQ
    nepse: 'nepse',
    //https://en.wikipedia.org/wiki/Template:Nepal_Stock_Exchange
    nyse: 'nyse',
    //https://en.wikipedia.org/wiki/Template:New_York_Stock_Exchange
    nzx: 'nzx',
    //https://en.wikipedia.org/wiki/Template:New_Zealand_Exchange
    amex: 'amex',
    //https://en.wikipedia.org/wiki/Template:NYSE_American
    'nyse arca': 'nyse arca',
    //https://en.wikipedia.org/wiki/Template:NYSE_Arca
    omx: 'omx',
    //https://en.wikipedia.org/wiki/Template:OMX
    'omx baltic': 'omx baltic',
    //https://en.wikipedia.org/wiki/Template:OMX_Baltic
    ose: 'ose',
    //https://en.wikipedia.org/wiki/Template:Oslo_Stock_Exchange
    'otc pink': 'otc pink',
    //https://en.wikipedia.org/wiki/Template:OTC_Pink
    otcqb: 'otcqb',
    //https://en.wikipedia.org/wiki/Template:OTCQB
    otcqx: 'otcqx',
    //https://en.wikipedia.org/wiki/Template:OTCQX
    'philippine stock exchange': 'philippine stock exchange',
    //https://en.wikipedia.org/wiki/Template:Philippine_Stock_Exchange
    prse: 'prse',
    //https://en.wikipedia.org/wiki/Template:Prague_Stock_Exchange
    qe: 'qe',
    //https://en.wikipedia.org/wiki/Template:Qatar_Stock_Exchange
    bcs: 'bcs',
    //https://en.wikipedia.org/wiki/Template:Santiago_Stock_Exchange
    'saudi stock exchange': 'saudi stock exchange',
    //https://en.wikipedia.org/wiki/Template:Saudi_Stock_Exchange
    sgx: 'sgx',
    //https://en.wikipedia.org/wiki/Template:Singapore_Exchange
    sse: 'sse',
    //https://en.wikipedia.org/wiki/Template:Shanghai_Stock_Exchange
    szse: 'szse',
    //https://en.wikipedia.org/wiki/Template:Shenzhen_Stock_Exchange
    swx: 'swx',
    //https://en.wikipedia.org/wiki/Template:SIX_Swiss_Exchange
    set: 'set',
    //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand
    tase: 'tase',
    //https://en.wikipedia.org/wiki/Template:Tel_Aviv_Stock_Exchange
    tyo: 'tyo',
    //https://en.wikipedia.org/wiki/Template:Tokyo_Stock_Exchange
    tsx: 'tsx',
    //https://en.wikipedia.org/wiki/Template:Toronto_Stock_Exchange
    twse: 'twse',
    //https://en.wikipedia.org/wiki/Template:Taiwan_Stock_Exchange
    'tsx-v': 'tsx-v',
    //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
    tsxv: 'tsxv',
    //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
    nex: 'nex',
    //https://en.wikipedia.org/wiki/Template:TSXV_NEX
    ttse: 'ttse',
    //https://en.wikipedia.org/wiki/Template:Trinidad_and_Tobago_Stock_Exchange
    'pfts ukraine stock exchange': 'pfts ukraine stock exchange',
    //https://en.wikipedia.org/wiki/Template:PFTS_Ukraine_Stock_Exchange
    wse: 'wse',
    //https://en.wikipedia.org/wiki/Template:Warsaw_Stock_Exchange
    wbag: 'wbag',
    //https://en.wikipedia.org/wiki/Template:Wiener_B%C3%B6rse
    zse: 'zse',
    //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
    'zagreb stock exchange': 'zagreb stock exchange',
    //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
    'zimbabwe stock exchange': 'zimbabwe stock exchange' //https://en.wikipedia.org/wiki/Template:Zimbabwe_Stock_Exchange

  };

  var parseStockExchange = function parseStockExchange(tmpl, list) {
    var o = parse$3(tmpl, ['ticketnumber', 'code']);
    list.push(o);
    var code = o.template || '';

    if (code === '') {
      code = o.code;
    }

    code = (code || '').toLowerCase();
    var out = codes$1[code] || '';
    var str = out;

    if (o.ticketnumber) {
      str = "".concat(str, ": ").concat(o.ticketnumber);
    }

    if (o.code && !codes$1[o.code.toLowerCase()]) {
      str += ' ' + o.code;
    }

    return str;
  };

  var currencies$1 = {}; //the others fit the same pattern..

  Object.keys(codes$1).forEach(function (k) {
    currencies$1[k] = parseStockExchange;
  });
  var stockExchanges = currencies$1;

  var hasMonth = /^jan /i;
  var isYear = /^year /i;
  var monthList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  var toNumber = function toNumber(str) {
    str = str.replace(/,/g, '');
    str = str.replace(/−/g, '-');
    var num = Number(str);

    if (isNaN(num)) {
      return str;
    }

    return num;
  };

  var templates$b = {
    // this one is a handful!
    //https://en.wikipedia.org/wiki/Template:Weather_box
    'weather box': function weatherBox(tmpl, list) {
      var obj = parse$3(tmpl); //collect all month-based data

      var byMonth = {};
      var properties = Object.keys(obj).filter(function (k) {
        return hasMonth.test(k);
      });
      properties = properties.map(function (k) {
        return k.replace(hasMonth, '');
      });
      properties.forEach(function (prop) {
        byMonth[prop] = [];
        monthList.forEach(function (m) {
          var key = "".concat(m, " ").concat(prop);

          if (obj.hasOwnProperty(key)) {
            var num = toNumber(obj[key]);
            delete obj[key];
            byMonth[prop].push(num);
          }
        });
      }); //add these to original

      obj.byMonth = byMonth; //collect year-based data

      var byYear = {};
      Object.keys(obj).forEach(function (k) {
        if (isYear.test(k)) {
          var prop = k.replace(isYear, '');
          byYear[prop] = obj[k];
          delete obj[k];
        }
      });
      obj.byYear = byYear;
      list.push(obj);
      return '';
    },
    //The 36 parameters are: 12 monthly highs (C), 12 lows (total 24) plus an optional 12 monthly rain/precipitation
    //https://en.wikipedia.org/wiki/Template:Weather_box/concise_C
    'weather box/concise c': function weatherBoxConciseC(tmpl, list) {
      var obj = parse$3(tmpl);
      obj.list = obj.list.map(function (s) {
        return toNumber(s);
      });
      obj.byMonth = {
        'high c': obj.list.slice(0, 12),
        'low c': obj.list.slice(12, 24),
        'rain mm': obj.list.slice(24, 36)
      };
      delete obj.list;
      obj.template = 'weather box';
      list.push(obj);
      return '';
    },
    'weather box/concise f': function weatherBoxConciseF(tmpl, list) {
      var obj = parse$3(tmpl);
      obj.list = obj.list.map(function (s) {
        return toNumber(s);
      });
      obj.byMonth = {
        'high f': obj.list.slice(0, 12),
        'low f': obj.list.slice(12, 24),
        'rain inch': obj.list.slice(24, 36)
      };
      delete obj.list;
      obj.template = 'weather box';
      list.push(obj);
      return '';
    },
    //https://en.wikipedia.org/wiki/Template:Climate_chart
    'climate chart': function climateChart(tmpl, list) {
      var lines = parse$3(tmpl).list || [];
      var title = lines[0];
      var source = lines[38];
      lines = lines.slice(1); //amazingly, they use '−' symbol here instead of negatives...

      lines = lines.map(function (str) {
        if (str && str[0] === '−') {
          str = str.replace(/−/, '-');
        }

        return str;
      });
      var months = []; //groups of three, for 12 months

      for (var i = 0; i < 36; i += 3) {
        months.push({
          low: toNumber(lines[i]),
          high: toNumber(lines[i + 1]),
          precip: toNumber(lines[i + 2])
        });
      }

      var obj = {
        template: 'climate chart',
        data: {
          title: title,
          source: source,
          months: months
        }
      };
      list.push(obj);
      return '';
    }
  };
  var weather = templates$b;

  //this format seems to be a pattern for these
  var generic$1 = ['id', 'title', 'description', 'section'];
  var idName = ['id', 'name']; //https://en.wikipedia.org/wiki/Category:External_link_templates

  var externals = {
    //https://en.wikipedia.org/wiki/Template:IMDb_title
    'imdb title': generic$1,
    'imdb name': generic$1,
    'imdb episode': generic$1,
    'imdb event': generic$1,
    'afi film': generic$1,
    'allmovie title': generic$1,
    allgame: generic$1,
    'tcmdb title': generic$1,
    'discogs artist': generic$1,
    'discogs label': generic$1,
    'discogs release': generic$1,
    'discogs master': generic$1,
    'librivox author': generic$1,
    'musicbrainz artist': generic$1,
    'musicbrainz label': generic$1,
    'musicbrainz recording': generic$1,
    'musicbrainz release': generic$1,
    'musicbrainz work': generic$1,
    youtube: generic$1,
    'goodreads author': idName,
    'goodreads book': generic$1,
    twitter: idName,
    facebook: idName,
    instagram: idName,
    tumblr: idName,
    pinterest: idName,
    'espn nfl': idName,
    'espn nhl': idName,
    'espn fc': idName,
    hockeydb: idName,
    'fifa player': idName,
    worldcat: idName,
    'worldcat id': idName,
    'nfl player': idName,
    'ted speaker': idName,
    playmate: idName,
    //https://en.wikipedia.org/wiki/Template:DMOZ
    dmoz: generic$1,
    'find a grave': ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'],
    congbio: ['id', 'name', 'date'],
    'hollywood walk of fame': ['name']
  }; //alias

  externals.imdb = externals['imdb name'];
  externals['imdb episodess'] = externals['imdb episode'];
  var websites = externals;

  //wiktionary... who knows. we should atleast try.

  var templates$c = {
    //{{inflection of|avoir||3|p|pres|ind|lang=fr}}
    //https://en.wiktionary.org/wiki/Template:inflection_of
    inflection: function inflection(tmpl, list) {
      var obj = parse$3(tmpl, ['lemma']);
      obj.tags = obj.list;
      delete obj.list;
      obj.type = 'form-of';
      list.push(obj);
      return obj.lemma || '';
    },
    //latin verbs
    'la-verb-form': function laVerbForm(tmpl, list) {
      var obj = parse$3(tmpl, ['word']);
      list.push(obj);
      return obj.word || '';
    },
    'feminine plural': function femininePlural(tmpl, list) {
      var obj = parse$3(tmpl, ['word']);
      list.push(obj);
      return obj.word || '';
    },
    'male plural': function malePlural(tmpl, list) {
      var obj = parse$3(tmpl, ['word']);
      list.push(obj);
      return obj.word || '';
    },
    rhymes: function rhymes(tmpl, list) {
      var obj = parse$3(tmpl, ['word']);
      list.push(obj);
      return 'Rhymes: -' + (obj.word || '');
    }
  }; //https://en.wiktionary.org/wiki/Category:Form-of_templates

  var conjugations = ['abbreviation', 'abessive plural', 'abessive singular', 'accusative plural', 'accusative singular', 'accusative', 'acronym', 'active participle', 'agent noun', 'alternative case form', 'alternative form', 'alternative plural', 'alternative reconstruction', 'alternative spelling', 'alternative typography', 'aphetic form', 'apocopic form', 'archaic form', 'archaic spelling', 'aspirate mutation', 'associative plural', 'associative singular', 'attributive form', 'attributive form', 'augmentative', 'benefactive plural', 'benefactive singular', 'causative plural', 'causative singular', 'causative', 'clipping', 'combining form', 'comitative plural', 'comitative singular', 'comparative plural', 'comparative singular', 'comparative', 'contraction', 'dated form', 'dated spelling', 'dative plural definite', 'dative plural indefinite', 'dative plural', 'dative singular', 'dative', 'definite', 'deliberate misspelling', 'diminutive', 'distributive plural', 'distributive singular', 'dual', 'early form', 'eclipsis', 'elative', 'ellipsis', 'equative', 'euphemistic form', 'euphemistic spelling', 'exclusive plural', 'exclusive singular', 'eye dialect', 'feminine noun', 'feminine plural past participle', 'feminine plural', 'feminine singular past participle', 'feminine singular', 'feminine', 'form', 'former name', 'frequentative', 'future participle', 'genitive plural definite', 'genitive plural indefinite', 'genitive plural', 'genitive singular definite', 'genitive singular indefinite', 'genitive singular', 'genitive', 'gerund', 'h-prothesis', 'hard mutation', 'harmonic variant', 'imperative', 'imperfective form', 'inflected form', 'inflection', 'informal form', 'informal spelling', 'initialism', 'ja-form', 'jyutping reading', 'late form', 'lenition', 'masculine plural past participle', 'masculine plural', 'medieval spelling', 'misconstruction', 'misromanization', 'misspelling', 'mixed mutation', 'monotonic form', 'mutation', 'nasal mutation', 'negative', 'neuter plural past participle', 'neuter plural', 'neuter singular past participle', 'neuter singular', 'nominalization', 'nominative plural', 'nominative singular', 'nonstandard form', 'nonstandard spelling', 'oblique plural', 'oblique singular', 'obsolete form', 'obsolete spelling', 'obsolete typography', 'official form', 'participle', 'passive participle', 'passive', 'past active participle', 'past participle', 'past passive participle', 'past tense', 'perfective form', 'plural definite', 'plural indefinite', 'plural', 'polytonic form', 'present active participle', 'present participle', 'present tense', 'pronunciation spelling', 'rare form', 'rare spelling', 'reflexive', 'second-person singular past', 'short for', 'singular definite', 'singular', 'singulative', 'soft mutation', 'spelling', 'standard form', 'standard spelling', 'substantivisation', 'superlative', 'superseded spelling', 'supine', 'syncopic form', 'synonym', 'terminative plural', 'terminative singular', 'uncommon form', 'uncommon spelling', 'verbal noun', 'vocative plural', 'vocative singular'];
  conjugations.forEach(function (name) {
    templates$c[name + ' of'] = function (tmpl, list) {
      var obj = parse$3(tmpl, ['lemma']);
      obj.tags = obj.list;
      delete obj.list;
      obj.type = 'form-of';
      list.push(obj);
      return obj.lemma || '';
    };
  });
  var wiktionary = templates$c;

  var templates$d = {
    // https://en.wikivoyage.org/wiki/Template:Do
    listing: function listing(tmpl, list) {
      var obj = parse$3(tmpl, []);
      list.push(obj); // flatten it all into one line of text

      var name = obj.name;

      if (obj.url) {
        name = "[".concat(obj.url, " ").concat(obj.name, "]");
      }

      var phone = '';

      if (obj.phone) {
        phone = "[tel:".concat(obj.phone, "]");
      }

      var updated = '';

      if (obj.lastedit) {
        updated = "(updated ".concat(obj.lastedit, ")");
      }

      var out = "".concat(name, " ").concat(obj.address || '', " ").concat(obj.directions || '', " ").concat(phone, " ").concat(obj.hours || '', " ").concat(obj.content, " ").concat(obj.price, " ").concat(updated);
      return out;
    }
  }; // are these sorta the same?

  templates$d.see = templates$d.listing;
  templates$d["do"] = templates$d.listing;
  templates$d.buy = templates$d.listing;
  templates$d.eat = templates$d.listing;
  templates$d.drink = templates$d.listing;
  templates$d.sleep = templates$d.listing;
  templates$d.go = templates$d.listing;
  var wikivoyage = templates$d;

  var templates$e = Object.assign({}, dates, formatting$1, geo, wikipedia, brackets_1, currency, elections, flags_1, ipa, languages_1, math, misc_1$1, punctuation_1, science, soccer, sports$1, stockExchanges, weather, websites, wiktionary, wikivoyage);

  var generic$2 = parse$3;
  var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];

  var isArray$2 = function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }; //this gets all the {{template}} strings and decides how to parse them


  var parseTemplate$1 = function parseTemplate(tmpl, list) {
    var name = tmpl.name;

    if (_ignore.hasOwnProperty(name) === true) {
      return '';
    } // {{infobox settlement...}}


    if (_infobox.isInfobox(name) === true) {
      var obj = parse$3(tmpl.body, list, 'raw');
      var infobox = _infobox.format(obj);
      list.push(infobox);
      return '';
    } // //cite book, cite arxiv...


    if (/^cite [a-z]/.test(name) === true) {
      var _obj = parse$3(tmpl.body, list);

      _obj.type = _obj.template;
      _obj.template = 'citation';
      list.push(_obj);
      return '';
    } // known template


    if (templates$e.hasOwnProperty(name) === true) {
      // handle number-syntax
      if (typeof templates$e[name] === 'number') {
        var _obj2 = generic$2(tmpl.body, nums);

        var key = String(templates$e[name]);
        return _obj2[key] || '';
      } // handle string-syntax


      if (typeof templates$e[name] === 'string') {
        return templates$e[name];
      } // handle array sytax


      if (isArray$2(templates$e[name]) === true) {
        var _obj3 = generic$2(tmpl.body, templates$e[name]);

        list.push(_obj3);
        return '';
      } // handle function syntax


      if (typeof templates$e[name] === 'function') {
        return templates$e[name](tmpl.body, list);
      }
    } // unknown template, try to parse it


    var parsed = parse$3(tmpl.body);

    if (list && Object.keys(parsed).length > 0) {
      list.push(parsed);
    } // ..then remove it


    return '';
  };

  var parse_1 = parseTemplate$1;

  var Template = function Template(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  };

  var methods$a = {
    text: function text() {
      return '';
    },
    json: function json() {
      return this.data;
    }
  };
  Object.keys(methods$a).forEach(function (k) {
    Template.prototype[k] = methods$a[k];
  });
  var Template_1 = Template;

  var isCitation = new RegExp('^(cite |citation)', 'i');
  var references$1 = {
    citation: true,
    refn: true,
    harvnb: true
  };

  var isReference = function isReference(obj) {
    return references$1[obj.template] === true || isCitation.test(obj.template) === true;
  };

  var isObject = function isObject(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  };

  var isInfobox$1 = function isInfobox(obj) {
    return obj.template === 'infobox' && obj.data && isObject(obj.data);
  }; //reduce the scary recursive situations


  var allTemplates = function allTemplates(section, doc) {
    var wiki = section.wiki; // nested data-structure of templates

    var list = find(wiki);
    var keep = []; // recursive template-parser

    var parseThem = function parseThem(obj, parent) {
      obj.parent = parent; // do tail-first recurion

      if (obj.children && obj.children.length > 0) {
        obj.children.forEach(function (ch) {
          return parseThem(ch, obj);
        });
      }

      obj.out = parse_1(obj, keep); // remove the text from every parent

      var removeIt = function removeIt(node, body, out) {
        if (node.parent) {
          node.parent.body = node.parent.body.replace(body, out);
          removeIt(node.parent, body, out);
        }
      };

      removeIt(obj, obj.body, obj.out);
      wiki = wiki.replace(obj.body, obj.out);
    }; //kick it off


    list.forEach(function (node) {
      return parseThem(node, null);
    }); // sort-out the templates we decide to keep

    section.infoboxes = section.infoboxes || [];
    section.references = section.references || [];
    section.templates = section.templates || [];
    section.templates = section.templates.concat(keep); // remove references and infoboxes from our list

    section.templates = section.templates.filter(function (obj) {
      if (isReference(obj) === true) {
        section.references.push(new Reference_1(obj));
        return false;
      }

      if (isInfobox$1(obj) === true) {
        obj.domain = doc.domain; //

        section.infoboxes.push(new Infobox_1(obj));
        return false;
      }

      return true;
    });
    section.templates = section.templates.map(function (obj) {
      return new Template_1(obj);
    }); // remove the templates from our wiki text

    list.forEach(function (node) {
      wiki = wiki.replace(node.body, node.out);
    });
    section.wiki = wiki;
  };

  var template$1 = allTemplates;

  var parseSentence$6 = _04Sentence.fromText; //okay, <gallery> is a xml-tag, with newline-seperated data, somehow pivoted by '|'...
  //all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
  // - not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...

  var parseGallery = function parseGallery(section, doc) {
    var wiki = section.wiki;
    wiki = wiki.replace(/<gallery([^>]*?)>([\s\S]+?)<\/gallery>/g, function (_, attrs, inside) {
      var images = inside.split(/\n/g);
      images = images.filter(function (str) {
        return str && str.trim() !== '';
      }); //parse the line, which has an image and sometimes a caption

      images = images.map(function (str) {
        var arr = str.split(/\|/);
        var obj = {
          file: arr[0].trim(),
          lang: doc.language,
          domain: doc.domain
        };
        var img = new Image_1(obj).json();
        var caption = arr.slice(1).join('|');

        if (caption !== '') {
          img.caption = parseSentence$6(caption);
        }

        return img;
      }); //add it to our templates list

      if (images.length > 0) {
        section.templates.push({
          template: 'gallery',
          images: images,
          pos: section.title
        });
      }

      return '';
    });
    section.wiki = wiki;
  };

  var gallery = parseGallery;

  //https://en.wikipedia.org/wiki/Template:Election_box

  var parseElection = function parseElection(section) {
    var wiki = section.wiki;
    wiki = wiki.replace(/\{\{election box begin([\s\S]+?)\{\{election box end\}\}/gi, function (tmpl) {
      var data = {
        wiki: tmpl,
        templates: []
      }; //put it through our full template parser..

      template$1(data); //okay, pull it apart into something sensible..

      var templates = data.templates.map(function (t) {
        return t.json();
      });
      var start = templates.find(function (t) {
        return t.template === 'election box';
      }) || {};
      var candidates = templates.filter(function (t) {
        return t.template === 'election box candidate';
      });
      var summary = templates.find(function (t) {
        return t.template === 'election box gain' || t.template === 'election box hold';
      }) || {};

      if (candidates.length > 0 || summary) {
        section.templates.push({
          template: 'election box',
          title: start.title,
          candidates: candidates,
          summary: summary.data
        });
      } //remove it all


      return '';
    });
    section.wiki = wiki;
  };

  var election = parseElection;

  var keys = {
    coach: ['team', 'year', 'g', 'w', 'l', 'w-l%', 'finish', 'pg', 'pw', 'pl', 'pw-l%'],
    player: ['year', 'team', 'gp', 'gs', 'mpg', 'fg%', '3p%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg'],
    roster: ['player', 'gp', 'gs', 'mpg', 'fg%', '3fg%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg']
  }; //https://en.wikipedia.org/wiki/Template:NBA_player_statistics_start

  var parseNBA = function parseNBA(section) {
    var wiki = section.wiki;
    wiki = wiki.replace(/\{\{nba (coach|player|roster) statistics start([\s\S]+?)\{\{s-end\}\}/gi, function (tmpl, name) {
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
      tmpl = tmpl.replace(/\{\{s-end\}\}/, '');
      name = name.toLowerCase().trim();
      var headers = '! ' + keys[name].join(' !! ');
      var table = '{|\n' + headers + '\n' + tmpl + '\n|}';
      var rows = parse$4(table);
      rows = rows.map(function (row) {
        Object.keys(row).forEach(function (k) {
          row[k] = row[k].text();
        });
        return row;
      });
      section.templates.push({
        template: 'NBA ' + name + ' statistics',
        data: rows
      });
      return '';
    });
    section.wiki = wiki;
  };

  var nba = parseNBA;

  //this is pretty nuts

  var whichHeadings = function whichHeadings(tmpl) {
    var headings = ['#', 'date', 'opponent', 'score', 'win', 'loss', 'save', 'attendance', 'record'];

    if (/\|stadium=y/i.test(tmpl) === true) {
      headings.splice(7, 0, 'stadium'); //save, stadium, attendance
    }

    if (/\|time=y/i.test(tmpl) === true) {
      headings.splice(7, 0, 'time'); //save, time, stadium, attendance
    }

    if (/\|box=y/i.test(tmpl) === true) {
      headings.push('box'); //record, box
    }

    return headings;
  };

  var parseMlb = function parseMlb(section) {
    var wiki = section.wiki;
    wiki = wiki.replace(/\{\{mlb game log (section|month)[\s\S]+?\{\{mlb game log (section|month) end\}\}/gi, function (tmpl) {
      var headings = whichHeadings(tmpl);
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
      tmpl = tmpl.replace(/\{\{mlb game log (section|month) end\}\}/i, '');
      var headers = '! ' + headings.join(' !! ');
      var table = '{|\n' + headers + '\n' + tmpl + '\n|}';
      var rows = parse$4(table);
      rows = rows.map(function (row) {
        Object.keys(row).forEach(function (k) {
          row[k] = row[k].text();
        });
        return row;
      });
      section.templates.push({
        template: 'mlb game log section',
        data: rows
      });
      return '';
    });
    section.wiki = wiki;
  };

  var mlb = parseMlb;

  var headings$1 = ['res', 'record', 'opponent', 'method', 'event', 'date', 'round', 'time', 'location', 'notes']; //https://en.wikipedia.org/wiki/Template:MMA_record_start

  var parseMMA = function parseMMA(section) {
    var wiki = section.wiki;
    wiki = wiki.replace(/\{\{mma record start[\s\S]+?\{\{end\}\}/gi, function (tmpl) {
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
      tmpl = tmpl.replace(/\{\{end\}\}/i, '');
      var headers = '! ' + headings$1.join(' !! ');
      var table = '{|\n' + headers + '\n' + tmpl + '\n|}';
      var rows = parse$4(table);
      rows = rows.map(function (row) {
        Object.keys(row).forEach(function (k) {
          row[k] = row[k].text();
        });
        return row;
      });
      section.templates.push({
        template: 'mma record start',
        data: rows
      });
      return '';
    });
    section.wiki = wiki;
  };

  var mma = parseMMA;

  var parseSentence$7 = _04Sentence.fromText; //xml <math>y=mx+b</math> support
  //https://en.wikipedia.org/wiki/Help:Displaying_a_formula

  var parseMath = function parseMath(section) {
    var wiki = section.wiki;
    wiki = wiki.replace(/<math([^>]*?)>([\s\S]+?)<\/math>/g, function (_, attrs, inside) {
      //clean it up a little?
      var formula = parseSentence$7(inside).text();
      section.templates.push({
        template: 'math',
        formula: formula,
        raw: inside
      }); //should we atleast try to render it in plaintext? :/

      if (formula && formula.length < 12) {
        return formula;
      }

      return '';
    }); //try chemistry version too

    wiki = wiki.replace(/<chem([^>]*?)>([\s\S]+?)<\/chem>/g, function (_, attrs, inside) {
      section.templates.push({
        template: 'chem',
        data: inside
      });
      return '';
    });
    section.wiki = wiki;
  };

  var math$1 = parseMath;

  // ... others are {{start}}...{{end}}
  // -> these are those ones.

  var xmlTemplates = function xmlTemplates(section, doc) {
    election(section);
    gallery(section, doc);
    math$1(section);
    mlb(section);
    mma(section);
    nba(section);
  };

  var startToEnd = xmlTemplates;

  var isReference$1 = new RegExp('^(' + i18n$1.references.join('|') + '):?', 'i');
  var section_reg = /(?:\n|^)(={2,5}.{1,200}?={2,5})/g; //interpret ==heading== lines

  var parse$6 = {
    heading: heading,
    table: table,
    paragraphs: _03Paragraph,
    templates: template$1,
    references: reference,
    startEndTemplates: startToEnd
  };

  var oneSection = function oneSection(section, doc) {
    parse$6.startEndTemplates(section, doc); //parse-out the <ref></ref> tags

    parse$6.references(section); //parse-out all {{templates}}

    parse$6.templates(section, doc); // //parse the tables

    parse$6.table(section); //now parse all double-newlines

    parse$6.paragraphs(section, doc);
    section = new Section_1(section);
    return section;
  };

  var removeReferenceSection = function removeReferenceSection(sections) {
    return sections.filter(function (s, i) {
      if (isReference$1.test(s.title()) === true) {
        if (s.paragraphs().length > 0) {
          return true;
        } //does it have some wacky templates?


        if (s.templates().length > 0) {
          return true;
        } //what it has children? awkward


        if (sections[i + 1] && sections[i + 1].depth > s.depth) {
          sections[i + 1].depth -= 1; //move it up a level?...
        }

        return false;
      }

      return true;
    });
  };

  var parseSections = function parseSections(doc) {
    var sections = [];
    var split = doc.wiki.split(section_reg);

    for (var i = 0; i < split.length; i += 2) {
      var heading = split[i - 1] || '';
      var wiki = split[i] || '';

      if (wiki === '' && heading === '') {
        //usually an empty 'intro' section
        continue;
      }

      var section = {
        title: '',
        depth: null,
        wiki: wiki,
        templates: [],
        tables: [],
        infoboxes: [],
        references: []
      }; //figure-out title/depth

      parse$6.heading(section, heading); //parse it up

      var s = oneSection(section, doc);
      sections.push(s);
    } //remove empty references section


    doc.sections = removeReferenceSection(sections);
  };

  var _02Section = parseSections;

  var cat_reg = new RegExp('\\[\\[:?(' + i18n$1.categories.join('|') + '):(.{2,178}?)]](w{0,10})', 'ig');
  var cat_remove_reg = new RegExp('^\\[\\[:?(' + i18n$1.categories.join('|') + '):', 'ig');

  var parse_categories = function parse_categories(doc) {
    var wiki = doc.wiki;
    var tmp = wiki.match(cat_reg); //regular links

    if (tmp) {
      tmp.forEach(function (c) {
        c = c.replace(cat_remove_reg, '');
        c = c.replace(/\|?[ \*]?\]\]$/i, ''); //parse fancy onces..

        c = c.replace(/\|.*/, ''); //everything after the '|' is metadata

        if (c && !c.match(/[\[\]]/)) {
          doc.categories.push(c.trim());
        }
      });
    }

    wiki = wiki.replace(cat_reg, '');
    doc.wiki = wiki;
  };

  var categories$1 = parse_categories;

  var parse$7 = {
    section: _02Section,
    categories: categories$1
  }; //convert wikiscript markup lang to json

  var main = function main(wiki, options) {
    options = options || {};
    var data = Object.assign(options, {
      title: options.title || null,
      pageID: options.pageID || options.id || null,
      namespace: options.namespace || options.ns || null,
      type: 'page',
      wiki: wiki || '',
      categories: [],
      sections: [],
      coordinates: []
    }); //detect if page is just redirect, and return it

    if (redirects$1.isRedirect(wiki) === true) {
      data.type = 'redirect';
      data.redirectTo = redirects$1.parse(wiki);
      parse$7.categories(data);
      return new Document_1(data);
    } //give ourselves a little head-start


    preProcess_1(data); //pull-out [[category:whatevers]]

    parse$7.categories(data); //parse all the headings, and their texts/sentences

    parse$7.section(data); //all together now

    return new Document_1(data);
  };

  var _01Document = main;

  var parseDoc = function parseDoc(res) {
    res = res.filter(function (o) {
      return o;
    });
    var docs = res.map(function (o) {
      return _01Document(o.wiki, o.meta);
    });

    if (docs.length === 0) {
      return null;
    }

    if (docs.length === 1) {
      return docs[0];
    }

    return docs;
  };

  var _03ParseDoc = parseDoc;

  // use the native client-side fetch function
  var request = function request(url, opts) {
    //eslint-disable-next-line
    return fetch(url, opts).then(function (res) {
      return res.json();
    });
  };

  var client = request;

  var makeHeaders = function makeHeaders(options) {
    var agent = options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'User of the wtf_wikipedia library';
    var origin;

    if (options.noOrigin) {
      origin = '';
    } else {
      origin = options.origin || options.Origin || '*';
    }

    var opts = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Api-User-Agent': agent,
        'User-Agent': agent,
        Origin: origin
      },
      redirect: 'follow'
    };
    return opts;
  };

  var _headers = makeHeaders;

  var isUrl = /^https?:\/\//;
  var defaults$c = {
    lang: 'en',
    wiki: 'wikipedia',
    domain: null,
    follow_redirects: true,
    path: 'api.php' //some 3rd party sites use a weird path

  };

  var fetch$1 = function fetch(title, options, c) {
    var callback = null;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (typeof c === 'function') {
      callback = c;
      c = {};
    } //support lang 2nd param


    if (typeof options === 'string') {
      c = c || {};
      options = Object.assign({}, {
        lang: options
      }, c);
    }

    options = options || {};
    options = Object.assign({}, defaults$c, options);
    options.title = title; // parse url input

    if (isUrl.test(title)) {
      options = Object.assign(options, _00ParseUrl(title));
    }

    var url = _01MakeUrl(options);
    var headers = _headers(options);
    return client(url, headers).then(function (res) {
      try {
        var data = _02GetResult(res, options);
        data = _03ParseDoc(data);

        if (callback) {
          callback(null, data);
        }

        return data;
      } catch (e) {
        throw e;
      }
    })["catch"](function (e) {
      console.error(e);

      if (callback) {
        callback(e, null);
      }

      return null;
    });
  };

  var _fetch = fetch$1;

  var defaults$d = {
    lang: 'en',
    wiki: 'wikipedia',
    domain: null,
    path: 'w/api.php' //some 3rd party sites use a weird path

  };

  var isObject$1 = function isObject(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  };

  var fetchRandom = function fetchRandom(lang, options) {
    options = options || {};
    options = Object.assign({}, defaults$d, options); //support lang 2nd param

    if (typeof lang === 'string') {
      options.lang = lang;
    } else if (isObject$1(lang)) {
      options = Object.assign(options, lang);
    }

    var url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += "format=json&action=query&generator=random&grnnamespace=0&prop=revisions|pageprops&rvprop=content&grnlimit=1&rvslots=main&origin=*";
    var headers = _headers(options);
    return client(url, headers).then(function (res) {
      try {
        var data = _02GetResult(res);
        return _03ParseDoc(data);
      } catch (e) {
        throw e;
      }
    })["catch"](function (e) {
      console.error(e);
      return null;
    });
  };

  var random = fetchRandom;

  var defaults$e = {
    lang: 'en',
    wiki: 'wikipedia',
    domain: null,
    path: 'w/api.php' //some 3rd party sites use a weird path

  };

  var normalizeCategory = function normalizeCategory() {
    var cat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (/^Category/i.test(cat) === false) {
      cat = 'Category:' + cat;
    }

    cat = cat.replace(/ /g, '_');
    return cat;
  };

  var isObject$2 = function isObject(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  };

  var getResult$1 = function getResult(body) {
    var list = body.query.categorymembers || [];
    var res = {
      pages: [],
      categories: []
    };
    list.forEach(function (p) {
      if (p.ns === 14) {
        delete p.ns;
        res.categories.push(p);
      } else {
        delete p.ns;
        res.pages.push(p);
      }
    });
    return res;
  };

  var makeUrl$1 = function makeUrl(category, options, cm) {
    category = normalizeCategory(category);
    category = encodeURIComponent(category);
    var url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += "action=query&list=categorymembers&cmtitle=".concat(category, "&cmlimit=500&format=json&origin=*&redirects=true&cmtype=page|subcat");

    if (cm) {
      url += '&cmcontinue=' + cm;
    }

    return url;
  };

  var fetchCategory = function fetchCategory(category, lang, options) {
    options = options || {};
    options = Object.assign({}, defaults$e, options); //support lang 2nd param

    if (typeof lang === 'string') {
      options.lang = lang;
    } else if (isObject$2(lang)) {
      options = Object.assign(options, lang);
    }

    var res = {
      pages: [],
      categories: []
    }; // wrap a promise around potentially-many requests

    return new Promise(function (resolve, reject) {
      var doit = function doit(cm) {
        var url = makeUrl$1(category, options, cm);
        var headers = _headers(options);
        return client(url, headers).then(function (body) {
          res = getResult$1(body);

          if (body["continue"] && body["continue"].cmcontinue) {
            doit(body["continue"].cmcontinue);
          } else {
            resolve(res);
          }
        })["catch"](function (e) {
          console.error(e);
          reject(e);
        });
      };

      doit(null);
    });
  };

  var category = fetchCategory;

  var _version = '8.5.1';

  var wtf = function wtf(wiki, options) {
    return _01Document(wiki, options);
  }; // export classes for plugin development


  var models = {
    Doc: Document_1,
    Section: Section_1,
    Paragraph: Paragraph_1,
    Sentence: Sentence_1,
    Image: Image_1,
    Infobox: Infobox_1,
    Link: Link_1,
    List: List_1,
    Reference: Reference_1,
    Table: Table_1,
    Template: Template_1,
    http: client,
    wtf: wtf
  };

  wtf.fetch = function (title, lang, options, cb) {
    return _fetch(title, lang, options);
  };

  wtf.random = function (lang, options, cb) {
    return random(lang, options);
  };

  wtf.category = function (cat, lang, options, cb) {
    return category(cat, lang, options);
  };

  wtf.extend = function (fn) {
    fn(models, templates$e, this);
    return this;
  };

  wtf.version = _version;
  var src = wtf;

  return src;

})));
