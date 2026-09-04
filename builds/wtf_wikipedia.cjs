/*! wtf_wikipedia  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtf = factory());
})(this, (function () { 'use strict';

  const parseUrl = function(url) {
    let parsed = new URL(url);
    let title = parsed.pathname.replace(/^\/(wiki\/)?/, "");
    title = decodeURIComponent(title);
    return {
      domain: parsed.host,
      title
    };
  };

  function trim_whitespace(str) {
    if (str && typeof str === "string") {
      str = str.replace(/^\s+/, "");
      str = str.replace(/\s+$/, "");
      str = str.replace(/ {2,}/g, " ");
      str = str.replace(/\s, /g, ", ");
      return str;
    }
    return "";
  }
  function isArray(x) {
    return Object.prototype.toString.call(x) === "[object Array]";
  }
  function isObject(x) {
    return x && Object.prototype.toString.call(x) === "[object Object]";
  }

  const isInterWiki = /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/;
  const defaults$c = {
    action: "query",
    prop: "revisions|pageprops",
    // we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
    rvprop: "content|ids|timestamp",
    maxlag: 5,
    rvslots: "main",
    origin: "*",
    format: "json",
    redirects: "true"
  };
  const toQueryString = function(obj) {
    return Object.entries(obj).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
  };
  const cleanTitle = (page) => {
    return page.replace(/ /g, "_").trim();
  };
  const makeUrl = function(options, parameters = defaults$c) {
    let params = Object.assign({}, parameters);
    let apiPath = "";
    if (options.domain) {
      let path = isInterWiki.test(options.domain) ? "w/api.php" : options.path;
      apiPath = `https://${options.domain}/${path}?`;
    } else if (options.lang && options.wiki) {
      apiPath = `https://${options.lang}.${options.wiki}.org/w/api.php?`;
    } else {
      return "";
    }
    if (!options.follow_redirects) {
      delete params.redirects;
    }
    if (options.origin) {
      params.origin = options.origin;
    }
    let title = options.title;
    if (typeof title === "number") {
      params.pageids = title;
    } else if (typeof title === "string") {
      params.titles = cleanTitle(title);
    } else if (title !== void 0 && isArray(title) && typeof title[0] === "number") {
      params.pageids = title.filter((t) => t).join("|");
    } else if (title !== void 0 && isArray(title) === true && typeof title[0] === "string") {
      params.titles = title.filter((t) => t).map(cleanTitle).join("|");
    } else {
      return "";
    }
    return `${apiPath}${toQueryString(params)}`;
  };

  const getResult = function(data, options = {}) {
    var _a;
    if (!((_a = data == null ? void 0 : data.query) == null ? void 0 : _a.pages)) {
      return null;
    }
    let pages = Object.keys(data.query.pages);
    return pages.map((id) => {
      var _a2;
      let page = data.query.pages[id] || {};
      if (page.hasOwnProperty("missing") || page.hasOwnProperty("invalid")) {
        return null;
      }
      let rev = (_a2 = page.revisions) == null ? void 0 : _a2[0];
      if (!rev) {
        return null;
      }
      let text = rev["*"];
      if (!text && rev.slots) {
        text = rev.slots.main["*"];
      }
      let revisionID = rev.revid;
      let timestamp = rev.timestamp;
      page.pageprops = page.pageprops || {};
      let domain = options.domain;
      if (!domain && options.wiki) {
        domain = `${options.wiki}.org`;
      }
      let meta = Object.assign({}, options, {
        title: page.title,
        pageID: page.pageid,
        namespace: page.ns,
        domain,
        revisionID,
        timestamp,
        pageImage: page.pageprops["page_image_free"],
        wikidata: page.pageprops.wikibase_item,
        description: page.pageprops["wikibase-shortdesc"]
      });
      return { wiki: text, meta };
    });
  };

  const sectionMap = function(doc, fn, clue) {
    let arr = [];
    doc.sections().forEach((sec) => {
      let list = [];
      if (typeof clue === "string") {
        list = sec[fn](clue);
      } else {
        list = sec[fn]();
      }
      list.forEach((t) => {
        arr.push(t);
      });
    });
    if (typeof clue === "number") {
      if (arr[clue] === void 0) {
        return [];
      }
      return [arr[clue]];
    }
    return arr;
  };

  const setDefaults = function(options, defaults) {
    return Object.assign({}, defaults, options);
  };

  const sizes = {
    sm: {
      title: true,
      description: true,
      infoboxes: true,
      categories: true
    },
    md: {
      title: true,
      description: true,
      infoboxes: true,
      categories: true,
      coordinates: true,
      images: true,
      links: true,
      templates: true,
      text: true,
      references: true
    },
    lg: {
      title: true,
      description: true,
      infoboxes: true,
      categories: true,
      coordinates: true,
      images: true,
      links: true,
      templates: true,
      sections: true,
      text: true,
      references: true
    }
  };
  const defaults$b = {
    title: true,
    sections: true,
    pageID: true,
    categories: true,
    wikidata: true,
    description: true,
    revisionID: false,
    timestamp: false,
    pageImage: false,
    domain: false,
    language: false
  };
  const toJSON$2 = function(doc, options) {
    let isPreset = false;
    if (typeof options === "string") {
      options = sizes[options] || sizes.md;
      isPreset = true;
    } else {
      options = setDefaults(options, defaults$b);
    }
    let data = {};
    if (options.title) {
      data.title = doc.title();
    }
    if (doc.isRedirect() === true) {
      data.isRedirect = true;
      data.redirectTo = doc.redirectTo();
      data.sections = [];
    }
    if (doc.isStub() === true) {
      data.isStub = true;
    }
    if (doc.isDisambiguation() === true) {
      data.isDisambiguation = true;
    }
    if (options.pageID && doc.pageID()) {
      data.pageID = doc.pageID();
    }
    if (options.wikidata && doc.wikidata()) {
      data.wikidata = doc.wikidata();
    }
    if (options.revisionID && doc.revisionID()) {
      data.revisionID = doc.revisionID();
    }
    if (options.timestamp && doc.timestamp()) {
      data.timestamp = doc.timestamp();
    }
    if (options.description) {
      let desc = doc.description();
      if (!desc && isPreset && doc.sentence()) {
        desc = doc.sentence().text();
      }
      if (desc) {
        data.description = desc;
      }
    }
    if (options.categories) {
      data.categories = doc.categories();
    }
    if (options.sections) {
      data.sections = doc.sections().map((i) => i.json(options));
    }
    if (options.infoboxes) {
      data.infoboxes = doc.infoboxes().map((i) => i.json(options));
    }
    if (options.images) {
      data.images = doc.images().map((i) => i.json(options));
    }
    if (options.citations || options.references) {
      data.references = doc.references();
    }
    if (options.coordinates) {
      data.coordinates = doc.coordinates();
    }
    if (options.links) {
      data.links = doc.links().map((i) => i.json(options));
    }
    if (options.templates) {
      data.templates = doc.templates().map((i) => i.json(options));
    }
    if (options.plaintext || options.text) {
      let text = doc.text(options);
      if (options.text) {
        data.text = text;
      }
      if (options.plaintext) {
        data.plaintext = text;
      }
    }
    return data;
  };

  var _categories = [
    "category",
    //en
    "abdeeling",
    //	pdc
    "b\xF3lkur",
    //	fo
    "catag\xF3ir",
    //	ga
    "categori",
    //	cy
    "categoria",
    "categoria",
    //	co
    "categor\xEDa",
    //	es
    "categor\xEEa",
    //	lij
    "categor\xECa",
    //	pms
    "cat\xE9gorie",
    "categorie",
    "cat\xE8gorie",
    //	frp
    "category",
    "categuria",
    //	lmo
    "catigur\xECa",
    //	scn
    "class",
    //	kw
    "\u1EB9\u0300ka",
    //	yo
    "flocc",
    "flocc",
    //	ang
    "flokkur",
    "grup",
    //	tpi
    "jamii",
    //	sw
    "kaarangay",
    //	war
    "kateggor\xEDa",
    //	lad
    "kategooria",
    //	et
    "kategori",
    //	da
    "kategor\xEE",
    //	ku
    "kategoria",
    //	eu
    "kateg\xF3ria",
    //	hu
    "kategorie",
    //de
    "kategoriija",
    //	se
    "kategorija",
    //	sl
    "kategorio",
    //	eo
    "kategoriya",
    "kategori\xFDa",
    //	tk
    "kategoriye",
    //	diq
    "kategory",
    //	fy
    "kategorya",
    //	tl
    "kateqoriya",
    //	az
    "katiguriya",
    //	qu
    "klad",
    //	vo
    "luokka",
    "\xF1emohenda",
    //	gn
    "roinn",
    //-seòrsa	gd
    "ronney",
    //	gv
    "rummad",
    //	br
    "setensele",
    //	nso
    "sokajy",
    //	mg
    "sumut",
    // atassuseq	kl
    "th\u1EC3",
    // loại	vi
    "turkum",
    //	uz
    "\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0458\u0430",
    "\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F",
    //	ru
    "\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F",
    //	uk
    "\u043A\u0430\u0442\u044D\u0433\u043E\u0440\u044B\u044F",
    "\u0442\u04E9\u0440\u043A\u0435\u043C",
    //	tt
    "\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4",
    //	he
    "\u062A\u0635\u0646\u064A\u0641",
    "\u062A\u06C8\u0631",
    //	ug
    "\u0631\u062F\u0647",
    "\u0936\u094D\u0930\u0947\u0923\u0940",
    "\u0936\u094D\u0930\u0947\u0923\u0940",
    //	hi
    "\u09AC\u09BF\u09B7\u09AF\u09BC\u09B6\u09CD\u09B0\u09C7\u09A3\u09C0",
    //	bn
    "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48",
    //	th
    "\uBD84\uB958",
    //	ko
    "\uBD84\uB958",
    //ko
    "\u5206\u7C7B"
    //	za
    //--
  ];

  var disambig_templates = [
    "dab",
    //en
    "disamb",
    //en
    "disambig",
    //en
    "disambiguation",
    //en
    "a\xF0greining",
    "a\xF0greining",
    //is
    "aimai",
    //ja
    "airport disambiguation",
    "a\u0142ts\u02BC\xE1\u02BC\xE1ztiin",
    //nv
    "anlam ayr\u0131m\u0131",
    //gag
    "anlam ayr\u0131m\u0131",
    //tr
    "apartigilo",
    //eo
    "argipen",
    //eu
    "begriepskloorenge",
    //stq
    "begriffskl\xE4rung",
    //als
    "begriffskl\xE4rung",
    //de
    "begriffskl\xE4rung",
    //pdc
    "begriffsklearung",
    //bar
    "biology disambiguation",
    "bisongidila",
    //kg
    "bkl",
    //pfl
    "bokokani",
    //ln
    "caddayn",
    //so
    "call sign disambiguation",
    "caselaw disambiguation",
    "chinese title disambiguation",
    "clerheans",
    //kw
    "cudakirin",
    //ku
    "\u010Dvor",
    //bs
    "db",
    //vls
    "desambig",
    //nov
    "desambigaci\xF3n",
    //an
    "desambigua\xE7\xE3o",
    //pt
    "desambiguaci\xF3",
    //ca
    "desambiguaci\xF3n",
    //es
    "desambigu\xE1ncia",
    //ext
    "desambiguasion",
    //lad
    "desambiguassi\xF9",
    //lmo
    "desambigui",
    //lfn
    "dezambiguizare",
    //ro
    "dezanb\xECgua",
    "d\u0259qiql\u0259\u015Fdirm\u0259",
    "d\u0259qiql\u0259\u015Fdirm\u0259",
    //az
    "disamb-term",
    "disamb-terms",
    "disamb2",
    "disamb3",
    "disamb4",
    "disambigua",
    //it
    "disamb\xECgua",
    //sc
    "disambiguasi",
    "disambiguation cleanup",
    "disambiguation lead name",
    "disambiguation lead",
    "disambiguation name",
    "disambiguazion",
    "disambigue",
    "discretiva",
    "discretiva",
    //la
    "dishe\xF1velout",
    //br
    "disingkek",
    //min
    "dixanbigua",
    //vec
    "dixebra",
    //ast
    "di\u017Cambigwazzjoni",
    //mt
    "dmbox",
    "doorverwijspagina",
    //nl
    "dp",
    //nl
    "dubbelsinnig",
    "dubbelsinnig",
    //af
    "dudalipen",
    //rmy
    "dv",
    //nds_nl
    "egy\xE9rt",
    //hu
    "faaleaogaina",
    "fleiri t\xFDdningar",
    //fo
    "fleirtyding",
    //nn
    "flertydig",
    //da
    "f\xF6rgrening",
    //sv
    "genus disambiguation",
    "g\xEC-ngi\xEA",
    //cdo
    "giklaro",
    //ceb
    "gwahaniaethu",
    //cy
    "homonimo",
    //io
    "hom\xF3nimos",
    //gl
    "homonymie",
    //fr
    "hospital disambiguation",
    "hua\u02BB\u014Dlelo puana like",
    "hua\u02BB\u014Dlelo puana like",
    //haw
    "human name disambiguation cleanup",
    "human name disambiguation",
    "idirdheal\xFA",
    //ga
    "khu-pia\u030Dt",
    //zh_min_nan
    "kthjellim",
    //sq
    "kujekesa",
    //sn
    "letter-number combination disambiguation",
    "letter-numbercombdisambig",
    "maana",
    //sw
    "maneo bin",
    //diq
    "mathematical disambiguation",
    "mehrd\xFCdig begreep",
    //nds
    "menm non",
    //ht
    "military unit disambiguation",
    "muard\xFC\xFCdag artiikel",
    //frr
    "music disambiguation",
    "myesak\xE3r\xE3",
    "neibetsjuttings",
    //fy
    "noz\u012Bmju atdal\u012B\u0161ana",
    //lv
    "number disambiguation",
    "nuorodinis",
    //lt
    "nyahkekaburan",
    //ms
    "omonimeye",
    //wa
    "omonimi",
    "omonimia",
    //oc
    "opus number disambiguation",
    "page d\xE9 frouque",
    //nrm
    "paglilinaw",
    //tl
    "panangilawlawag",
    //ilo
    "pansayod",
    //war
    "pejy mitovy anarana",
    //mg
    "peker",
    //no
    "phonetics disambiguation",
    "place name disambiguation",
    "portal disambiguation",
    "razdvojba",
    //hr
    "razlo\u010Ditev",
    //sl
    "razvrstavanje",
    //sh
    "reddaghey",
    //gv
    "road disambiguation",
    "rozcestn\xEDk",
    //cs
    "rozli\u0161ovacia str\xE1nka",
    //sk
    "school disambiguation",
    "sclerir noziun",
    //rm
    "selvendyssivu",
    //olo
    "soilleireachadh",
    //gd
    "species latin name abbreviation disambiguation",
    "species latin name disambiguation",
    "station disambiguation",
    "suzmunski",
    //jbo
    "synagogue disambiguation",
    "t\xE4psustuslehek\xFClg",
    //et
    "t\xE4smennyssivu",
    //fi
    "taxonomic authority disambiguation",
    "taxonomy disambiguation",
    "telpl\xE4nov",
    //vo
    "template disambiguation",
    "tlahtolmelahuacatlaliztli",
    //nah
    "trang \u0111\u1ECBnh h\u01B0\u1EDBng",
    //vi
    "ujednoznacznienie",
    //pl
    "verdudeliking",
    //li
    "w\u011Bcejw\xF3znamowos\u0107",
    //dsb
    "wjacezmyslnos\u0107",
    //hsb
    "z",
    "zambigua\xE7on",
    //mwl
    "zeimeibu \u0161kir\u0161ona",
    //ltg
    "\u03B1\u03C0\u03BF\u03C3\u03B1\u03C6\u03AE\u03BD\u03B9\u03C3\u03B7",
    //el
    "\u0430\u0439\u0440\u044B\u049B",
    //kk
    "\u0430\u04B5\u0430\u043A\u044B\u0440\u0430\u0446\u04D9\u0430",
    //ab
    "\u0431\u0438\u0440 \u0430\u0430\u0439\u044B \u0458\u043E\u043A",
    "\u0432\u0438\u0448\u0435\u0437\u043D\u0430\u0447\u043D\u0430 \u043E\u0434\u0440\u0435\u0434\u043D\u0438\u0446\u0430",
    //sr
    "\u0438\u0431\u04B3\u043E\u043C\u0437\u0443\u0434\u043E\u04E3",
    //tg
    "\u043A\u0451\u0431 \u043C\u0430\u0433\u044A\u0430\u043D\u0430\u043B\u044B",
    //krc
    "\u043A\u04AF\u043F \u043C\u04D9\u0433\u044A\u043D\u04D9\u043B\u04D9\u0440",
    //tt
    "\u043A\u04AF\u043F \u043C\u04D9\u0493\u04D9\u043D\u04D9\u043B\u0435\u043B\u0435\u043A",
    //ba
    "\u043C\u0430\u0441\u0441\u0435\u0445\u043A \u043C\u0430\u04CF\u0430\u043D \u0445\u0438\u043B\u0430\u0440",
    "\u043C\u044A\u043D\u043E\u0433\u043E\u0441\u044A\u043C\uA651\u0441\u043B\u0438\u0465",
    //cu
    "\u043D\u0435\u0430\u0434\u043D\u0430\u0437\u043D\u0430\u0447\u043D\u0430\u0441\u0446\u044C",
    //be
    "\u043D\u0435\u0430\u0434\u043D\u0430\u0437\u043D\u0430\u0447\u043D\u0430\u0441\u044C\u0446\u044C",
    //be_x_old
    "\u043D\u0435\u043E\u0434\u043D\u043E\u0437\u043D\u0430\u0447\u043D\u043E\u0441\u0442\u044C",
    //ru
    "\u043E\u043B\u043E\u043D \u0443\u0434\u0445\u0430\u0442\u0430\u0439",
    //bxr
    "\u043F\u043E\u0458\u0430\u0441\u043D\u0443\u0432\u0430\u045A\u0435",
    //mk
    "\u043F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u0435",
    //bg
    "\u0441\u0430 \u0448\u0443\u043C\u0443\u0434 \u043C\u0430\u043D\u0430\u0432\u0430\u043B",
    //lez
    "\u0441\u0430\u043B\u0430\u0430 \u0443\u0442\u0433\u0430\u0442\u0430\u0439",
    //mn
    "\u0441\u0443\u043E\u043B\u0442\u0430\u043B\u0430\u0440",
    //sah
    "\u0442\u0435\u043A\u043C\u0430\u0430\u043D\u0438\u0441\u0438\u0437\u0434\u0438\u043A",
    //ky
    "\u0446\u043E \u043C\u0430\u0433\u0456\u043D\u0430 \u0433\u0443\u0440\u0435\u0431",
    //av
    "\u0447\u0435\u043F\u0435\u0440\u0443\u0448\u043A\u0430",
    //rue
    "\u0447\u043E\u043B\u0445\u0430\u043B\u043B\u0430",
    //ce
    "\u0448\u0443\u043A\u043E \u043E\u043D\u0447\u044B\u043A\u0442\u044B\u043C\u0430\u0448-\u0432\u043B\u0430\u043A",
    //mhr
    "\u10DB\u10E0\u10D0\u10D5\u10D0\u10DA\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D5\u10D0\u10DC\u10D8",
    //ka
    "\u0562\u0561\u0566\u0574\u056B\u0574\u0561\u057D\u057F\u0578\u0582\u0569\u056B\u0582\u0576",
    //hyw
    "\u0562\u0561\u0566\u0574\u056B\u0574\u0561\u057D\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    //hy
    "\u05D1\u05D0\u05D3\u05D9\u05D9\u05D8\u05DF",
    //yi
    "\u05E4\u05D9\u05E8\u05D5\u05E9\u05D5\u05E0\u05D9\u05DD",
    //he
    "\u0627\u0628\u0647\u0627\u0645\u200C\u0632\u062F\u0627\u06CC\u06CC",
    //fa
    "\u062A\u0648\u0636\u064A\u062D",
    //ar
    "\u062A\u0648\u0636\u064A\u062D",
    //arz
    "\u062F\u0642\u06CC\u0642\u0644\u0634\u062F\u06CC\u0631\u0645\u0647",
    //azb
    "\u0695\u0648\u0648\u0646\u06A9\u0631\u062F\u0646\u06D5\u0648\u06D5",
    //ckb
    "\u0633\u0644\u062C\u0647\u0627\u0626\u067E",
    //sd
    "\u0636\u062F \u0627\u0628\u06C1\u0627\u0645",
    //ur
    "\u06AF\u062C\u06AF\u062C\u06CC \u0628\u06CC\u0631\u06CC",
    //mzn
    "\u0646\u0627\u0645\u0628\u0647\u0645\u06D0\u062F\u0646\u0647",
    //ps
    "\u1218\u1295\u1273",
    //am
    "\u0905\u0938\u094D\u092A\u0937\u094D\u091F\u0924\u093E",
    //ne
    "\u092C\u0939\u0941\u0905\u0930\u094D\u0925\u0940",
    //bh
    "\u092C\u0939\u0941\u0935\u093F\u0915\u0932\u094D\u092A\u0940 \u0936\u092C\u094D\u0926",
    //hi
    "\u09A6\u09CD\u09AC\u09CD\u09AF\u09B0\u09CD\u09A5\u09A4\u09BE \u09A8\u09BF\u09B0\u09B8\u09A8",
    //bn
    "\u0A17\u0A41\u0A70\u0A1D\u0A32-\u0A16\u0A4B\u0A32\u0A4D\u0A39",
    //pa
    "\u0AB8\u0A82\u0AA6\u0ABF\u0A97\u0ACD\u0AA7 \u0AB6\u0AC0\u0AB0\u0ACD\u0AB7\u0A95",
    //gu
    "\u0BAA\u0B95\u0BCD\u0B95\u0BB5\u0BB4\u0BBF \u0BA8\u0BC6\u0BB1\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB2\u0BCD",
    //ta
    "\u0C05\u0C2F\u0C4B\u0C2E\u0C2F \u0C28\u0C3F\u0C35\u0C43\u0C24\u0C4D\u0C24\u0C3F",
    //te
    "\u0CA6\u0CCD\u0CB5\u0C82\u0CA6\u0CCD\u0CB5 \u0CA8\u0CBF\u0CB5\u0CBE\u0CB0\u0CA3\u0CC6",
    //kn
    "\u0D35\u0D3F\u0D35\u0D15\u0D4D\u0D37\u0D15\u0D7E",
    //ml
    "\u0DC0\u0D9A\u0DCA\u200D\u0DBB\u0DDD\u0DAD\u0DCA\u0DAD\u0DD2",
    //si
    "\u0E41\u0E01\u0E49\u0E04\u0E27\u0E32\u0E21\u0E01\u0E33\u0E01\u0E27\u0E21",
    //th
    "\u101E\u1036\u1010\u1030\u1000\u103C\u1031\u102C\u1004\u103A\u1038\u1000\u103D\u1032",
    //my
    "\u101E\u1035\u1004\u103A\u1019\u102D\u1030\u107C\u103A \u1010\u1030\u107C\u103A\u1088\u1011\u1085\u101D\u103A\u1015\u1085\u1075\u103A\u1087",
    "\u178E\u17C2\u1793\u17B6\u17C6",
    //km
    "\u17A2\u179F\u1784\u17D2\u179F\u17D0\u1799\u1780\u1798\u17D2\u1798",
    "\uB3D9\uC74C\uC774\uC758",
    //ko
    "\u6264\u6E05\u695A",
    //gan
    "\u641E\u6E05\u695A",
    //zh_yue
    "\u66D6\u6627\u3055\u56DE\u907F",
    //ja
    "\u6D88\u6B67\u4E49",
    //zh
    "\u91CB\u7FA9",
    //zh_classical
    "gestion dj'om\xF2nim",
    //pms
    "sut'ichana qillqa",
    //qu
    // 'z', //vep
    // 'သဵင်မိူၼ် တူၼ်ႈထႅဝ်ပႅၵ်ႇ', //shn
    `gestion dj'om\xF2nim`,
    `sut'ichana qillqa`
  ];

  var disambig_titles = [
    "disambiguation",
    //en
    "homonymie",
    //fr
    "\u062A\u0648\u0636\u064A\u062D",
    //ar
    "desambigua\xE7\xE3o",
    //pt
    "Begriffskl\xE4rung",
    //de
    "disambigua",
    //it
    "\u66D6\u6627\u3055\u56DE\u907F",
    //ja
    "\u6D88\u6B67\u7FA9",
    //zh
    "\u641E\u6E05\u695A",
    //zh-yue
    "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F",
    //ru
    "\u0627\u0628\u0647\u0627\u0645\u200C\u0632\u062F\u0627\u06CC\u06CC",
    //fa
    "\u062F \u0627\u0628\u06C1\u0627\u0645",
    //ur
    "\uB3D9\uC74C\uC774\uC758",
    //ko
    "dubbelsinnig",
    //af
    "\u0561\u0575\u056C \u056F\u056B\u0580\u0561\u057C\u0578\u0582\u0574\u0576\u0565\u0580",
    //hy
    "ujednoznacznienie"
    //pl
  ];

  var images = [
    "file",
    //en
    "image",
    //en
    "\u091A\u093F\u0924\u094D\u0930",
    //img
    "archivo",
    //es
    "att\u0113ls",
    //lv
    "berkas",
    //id
    "bestand",
    //nl
    "datei",
    //de
    "dosiero",
    //eo
    "dosya",
    //lad
    "f\xE1jl",
    //hu
    "fasciculus",
    //la
    "fichier",
    //fr
    "fil",
    //da
    "fitxategi",
    //eu
    "fitxer",
    //ca
    "gambar",
    //su
    "imagem",
    //pt
    "imej",
    //ms
    "immagine",
    //it
    "larawan",
    //tl
    "l\xEAer",
    //af
    "plik",
    //pl
    "restr",
    //br
    "slika",
    //bs
    "w\xEAne",
    //ku
    "wobraz",
    //dsb
    "\u0432\u044B\u044F\u0432\u0430",
    //be
    "\u043F\u043E\u0434\u0430\u0442\u043E\u0442\u0435\u043A\u0430",
    //mk
    "\u0441\u043B\u0438\u043A\u0430",
    //sr
    "\u0444\u0430\u0439\u043B",
    //ru
    "\u10E1\u10E3\u10E0\u10D0\u10D7\u10D8",
    //ka
    "\u057A\u0561\u057F\u056F\u0565\u0580",
    //hy
    "\u05E7\u05D5\u05D1\u05E5",
    //he
    "\u067E\u0631\u0648\u0646\u062F\u0647",
    //fa
    "\u062F\u0648\u062A\u0646\u0647",
    //ps
    "\u0645\u0644\u0641",
    //ar
    "\u0648\u06CE\u0646\u06D5",
    //ckb
    "\u091A\u093F\u0924\u094D\u0930",
    //hi
    "\u0E44\u0E1F\u0E25\u0E4C",
    //th
    "\uD30C\uC77C",
    //ko
    "\u30D5\u30A1\u30A4\u30EB"
    //ja
  ];

  var stubs = [
    "abo\xE7",
    "ahurhire",
    "aizmetnis",
    "amud",
    "avixo de spigaso",
    // 'begin',
    "beginnetje",
    "bibarilo",
    "borrador",
    "bu\xE1ng-n\xE0ng-h\xE2",
    "bun",
    "buntato",
    "c-supranu",
    "cahrot",
    "chala",
    "choutchette",
    "ciot",
    "csonk",
    "cung",
    "danvez pennad",
    "djermon",
    "\xE9bauche",
    "\xE9beuche",
    "eb\xF2ch",
    "\xE9d\xE9nt\u1EA1",
    "eginyn",
    "\u1EB9\u0300k\xFAnr\u1EB9\u0301r\u1EB9\u0301",
    "en progreso",
    "entamu",
    "esbo\xE7o",
    "esborrany",
    "esb\xF2s",
    "esbozo",
    "\u011Dermo",
    "gumud",
    "\u02BB\u014Dmuku",
    "junj",
    "klado",
    "maramara",
    "mayele",
    "mbegu",
    "mrva",
    "na mulno",
    "nadabeigts rakst\u012B\u0146s",
    "nalta",
    "narcce",
    "pah\xFDl",
    "pecietta",
    "ph\xED",
    "pondok",
    "por mejoral",
    "potu\u02BBi",
    "pungol",
    "qaralama",
    "rabisco",
    "rancangan",
    "rintisan",
    "saadjie",
    "saha",
    "sbozz",
    "sid",
    "s\xEDol",
    "\u015Fitil",
    "sjtumpke",
    "skizz",
    "skizze",
    "\u0161krbina",
    "s\u01A1 khai",
    "spire",
    "stipula",
    "stob",
    "stobbe",
    // 'stock',
    "stompje",
    "stub",
    "stubben",
    "stubbi",
    "stubbur",
    "stump",
    "stumpen",
    "stycce",
    "suli",
    "taslak",
    "taslaq",
    "tunas",
    "tur\xF3k",
    "tynk\xE4",
    // 'u začetku',
    "vangovango",
    "vernu\u015Fte",
    "v\xFDhonok",
    "xinnoo",
    "zarodk",
    "zirriborroa",
    "\u03B5\u03C0\u03AD\u03BA\u03C4\u03B1\u03C3\u03B7",
    "\u04D9\u0499\u0435\u0440\u043B\u04D9\u043C\u04D9",
    "\u0437\u0430\u0433\u043E\u0442\u043E\u0432\u043A\u0430",
    "\u043A\u0435\u0440\u0444",
    "\u043A\u0435\u0447\u0434\u0430\u0440",
    "\u043A\u043B\u0438\u0446\u0430",
    "\u043A\u044A\xE6\u0440\u0442\u0442",
    "\u043A\u044C\u0443\u0440\u0445\u044C",
    "\u043C\u04D9\u043A\u0430\u043B\u04D9 \u0442\u04E9\u043F\u0447\u0435\u0433\u0435",
    "\u043C\u044A\u043D\u0438\u0447\u0435",
    "\u043D\u0430\u043A\u0456\u0434",
    "\u043D\u0454\uA641\u0430\u0432\u0440\u044C\u0448\u0454\u043D\u044A \u0447\u043B\u0463\u043D\u044A",
    "\u043D\u0438\u043A\u0443\u043B\u0435\u0446",
    "\u043E\u043C\u043E\u043E\u043D",
    "\u0441\u0442\u044B\u0440\u0436\u0435\u043D\u044C",
    "\u0445\u0443\u0440\u0434",
    "\u0445\u04CF\u0430\u0434\u0443\u0440\u0443\u043D\u0436\u043E",
    "\u10D4\u10E1\u10D9\u10D8\u10D6\u10D8",
    "\u1218\u12CB\u1245\u122D",
    "\u1218\u12CB\u1255\u122D",
    "\u0905\u092A\u0942\u0930\u094D\u0923\u0932\u0947\u0916\u0903",
    "\u0906\u0927\u093E\u0930",
    "\u0920\u0941\u091F\u094B",
    "\u0927\u093E\u0915\u094D\u091F\u0947\u0902 \u092A\u093E\u0928",
    "\u0935\u093F\u0938\u094D\u0924\u093E\u0930",
    "\u0985\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3",
    "\u09AA\u09CB\u0996\u09BE\u09B2\u09BF",
    "\u0AB8\u0ACD\u0A9F\u0AAC",
    "\u0B05\u0B27\u0B3E\u0B17\u0B22\u0B3C\u0B3E",
    "\u0B95\u0BC1\u0BB1\u0BC1\u0B99\u0BCD\u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8",
    "\u0C2E\u0C4A\u0C32\u0C15",
    "\u0C8E\u0CB2\u0CCD\u0CAF",
    "\u0C9A\u0CC1\u0C9F\u0CC1\u0C95\u0CC1",
    "\u0D05\u0D2A\u0D42\u0D7C\u0D23\u0D4D\u0D23\u0D02",
    "\u0D85\u0D82\u0D9A\u0DD4\u0DBB\u0DBA",
    "\u0E42\u0E04\u0E23\u0E07",
    "\u0F46\u0F0B\u0F58\u0F72\u0F0B\u0F5A\u0F44\u0F0B\u0F56",
    "\u17A2\u178F\u17D2\u1790\u1794\u1791\u1781\u17D2\u179B\u17B8\u1798\u17B7\u1793\u1796\u17C1\u1789\u179B\u17C1\u1789",
    "\uD1A0\uB9C9\uAE00",
    "\u6954",
    "\u82BB\u6587"
  ];

  var infoboxes$1 = [
    "infobox",
    //en
    "amatl",
    "anfo",
    //mwl
    "anu\u0101mapa",
    //haw
    "bilgi kutusu",
    //tr
    "bilgi",
    //tr
    "bilgiquti",
    //uz
    "boaty fampahalalana",
    "boaty",
    //mg
    "boestkelaoui\xF1",
    //br
    "bosca",
    //ga
    "capsa",
    //la
    "diehtok\xE1ssa",
    //se
    "faktamall",
    //sv
    "ficha",
    //es
    "generalni",
    //hr
    "gwybodlen3",
    //cy
    "h\u1ED9p th\xF4ng tin",
    "info",
    //pt
    "infoboesse 2",
    "infobokis",
    //tpi
    "infoboks",
    //da
    "infobox deleted",
    "infobox generic",
    "infobox generiek",
    "infochascha",
    //rm
    "infoka\u0161\u0107ik",
    //dsb
    "infokast",
    //et
    "infokutija",
    //bs
    "infolentel\u0117",
    //lt
    "infookvir",
    "infopolje",
    //sl
    "informkesto",
    //eo
    "infoschede",
    "infoskreine",
    //ltg
    "infotaula",
    //eu
    "inligtingskas",
    "inligtingskas3",
    //af
    "inligtingskas4",
    //af
    "kishtey fys",
    "kotak info",
    "kotak",
    //su
    "m\u0259lumat qutusu",
    "simple box",
    "tertcita tanxe",
    "tertcita",
    //jbo
    "ti\xE4tuloov\xE1",
    "tietolaatikko",
    //fi
    "wd bosca sonra\xED",
    "yerle\u015Fim bilgi kutusu",
    "ynfoboks generyk",
    "ynfoboks",
    //fy
    "\u03C0\u03BB\u03B1\u03AF\u03C3\u03B9\u03BF \u03C0\u03BB\u03B7\u03C1\u03BF\u03C6\u03BF\u03C1\u03B9\u03CE\u03BD",
    "\u03C0\u03BB\u03B1\u03AF\u03C3\u03B9\u03BF",
    //el
    "\u0430\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430",
    //ab
    "\u0430\u04A5\u0430",
    //mhr
    "\u0438\u043D\u0444\u043E\u0431\u043E\u043A\u0441",
    //kk
    "\u0438\u043D\u0444\u043E\u043A\u0443\u0442\u0438\u0458\u0430",
    //sr
    "\u0438\u043D\u0444\u043E\u043A\u0443\u0442\u0438\u044F",
    //bg
    "\u0456\u043D\u0444\u043E\u0431\u043E\u043A\u0441",
    //rue
    "\u043A\u0430\u043D\u0430\u0434\u0441\u043A\u0438\u0439",
    "\u043A\u0430\u0440\u0442\u043A\u0430",
    //be
    "\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430",
    //ru
    "\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u04302",
    //mdf
    "\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u0440\u0443\u0441",
    //ba
    "\u043A\u0430\u0440\u0442\u0443\u0448",
    //koi
    "\u049B\u0443\u0442\u0442\u04E3",
    //tg
    "\u10D8\u10DC\u10E4\u10DD\u10D3\u10D0\u10E4\u10D0",
    //ka
    "\u057F\u0565\u0572\u0565\u056F\u0561\u0584\u0561\u0580\u057F",
    //hy
    "\u05EA\u05D1\u05E0\u05D9\u05EA",
    //he
    "\u0628\u0637\u0627\u0642\u0629",
    //ar
    "\u0684\u0627\u06BB\u062E\u0627\u0646\u0648",
    //sd
    "\u062E\u0627\u0646\u06C1",
    //ur
    "\u0644\u063A\u0629",
    "\u0645\u0639\u0644\u0648\u0657\u0645\u0627\u062A \u0688\u064E\u0628\u06C1\u0655",
    "\u091C\u094D\u091E\u093E\u0928\u0938\u0928\u094D\u0926\u0942\u0915",
    //hi
    "\u09A4\u09A5\u09CD\u09AF\u099B\u0995",
    //bn
    "\u0A1C\u0A3E\u0A23\u0A15\u0A3E\u0A30\u0A40\u0A21\u0A71\u0A2C\u0A3E",
    //pa
    "\u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C46",
    //te
    "\u0DAD\u0DDC\u0DBB\u0DAD\u0DD4\u0DBB\u0DD4\u0D9A\u0DDC\u0DA7\u0DD4\u0DC0",
    //si
    "\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
    //th
    "\u0E81\u0EC8\u0EAD\u0E87\u0E82\u0ECD\u0EC9\u0EA1\u0EB9\u0E99",
    "\u1794\u17D2\u179A\u17A2\u1794\u17CB\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793",
    //km
    "\uC815\uBCF4\uC0C1\uC790",
    //ko
    "\u660E\u7D30"
    //zh_yue
  ];

  var redirects = [
    "aanstuur",
    //af
    "aastiurey",
    "adkas",
    //br
    "ailgyfeirio",
    "alidirekto",
    "alih",
    //id
    "a\xFDdaw",
    "baw-ing",
    "beral\xEEkirin",
    //ku
    "birzuzendu",
    "\u0111\u1ED5i h\u01B0\u1EDBng \u0111\u1EBFn \u0111\xE2y",
    "doorverwijzing",
    //nl
    "header",
    "i\u0307stiqam\u0259tl\u0259ndirm\u0259",
    "lencong",
    //ms
    "ohjaa t\xE4nne",
    "ohjaus",
    "omdirigering",
    //no
    "p\u0101radres\u0101cija",
    "patrz",
    //pl
    "p\u0159esm\u011Brov\xE1n\xED",
    "p\u0159esm\u011Bruj",
    "preusmeritev",
    "preusmjerava",
    "preusmjerenje",
    "preusmjeri",
    //hr
    "przekierowanie",
    "redir",
    "redirecci\xF3",
    "redireccion",
    "redirecci\xF3n",
    //es
    "redirecionamento",
    //pt
    "redirect",
    //en
    "redirect3",
    "redirection",
    //fr
    "redirige aqu\xED",
    "redirige",
    "redirixe equ\xED",
    "rindirizz",
    "rinvia",
    //it
    "stivre deike",
    "suunamine",
    "tilv\xEDsun",
    "trimite",
    "uudelleenohjaus",
    "weiterleitung",
    //de
    "weiterleitungshinweis",
    "yo\u02BBnaltirish",
    "y\xF6nlendi\u0307r",
    "y\xF6nlendi\u0307rme",
    //tr
    "\u03B1\u03BD\u03B1\u03BA\u03B1\u03C4\u03B5\u03C5\u03B8\u03C5\u03BD\u03C3\u03B7",
    //el
    "\u0430\u0439\u0434\u0430\u0443",
    //kk
    "\u0431\u0430\u0433\u044B\u0442\u0442\u0430\u043C\u0430",
    "\u0431\u0443\u0441\u0441\u0438\u043D\u0430\u0431\u0438",
    "\u0434\u04CF\u0430\u0441\u0430\u0445\u044C\u0430\u0436\u043E\u0440\u0433",
    "\u043E\u0442 \u043F\u0440\u0435\u043D\u0430\u0441\u043E\u0447\u0432\u0430\u043D\u0435",
    "\u043F\u0435\u0440\u0430\u043D\u0430\u043A\u0456\u0440\u0430\u0432\u0430\u043D\u043D\u0435",
    "\u043F\u0435\u0440\u0430\u043D\u0430\u043A\u0456\u0440\u0430\u0432\u0430\u043D\u044C\u043D\u0435",
    "\u043F\u0435\u0440\u0430\u043D\u0430\u043A\u0456\u0440\u043E\u045E\u0432\u0430\u0435\u0446\u0446\u0430 \u0441\u044E\u0434\u044B",
    "\u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435",
    //ru
    "\u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F",
    //uk
    "\u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E",
    "\u043F\u0440\u0435\u043D\u0430\u0441\u043E\u0447\u0443\u0432\u0430\u045A\u0435",
    //mk
    "\u043F\u0440\u0435\u0443\u0441\u043C\u0435\u0440\u0430\u0432\u0430 ",
    "\u043F\u0440\u0435\u0443\u0441\u043C\u0435\u0440\u0438",
    //sr
    "\u043F\u0440\u0435\u0443\u0441\u043C\u0458\u0435\u0440\u0438",
    "\u0440\u0430\u0432\u043E\u043D\u0430\u043A\u0443\u043D\u04E3",
    "\u05D5\u05D5\u05D9\u05D9\u05D8\u05E2\u05E8\u05E4\u05D9\u05E8\u05DF",
    //yi
    "\u062A\u062D\u0648\u064A\u0644",
    //ar
    "\u062A\u063A\u06CC\u06CC\u0631_\u0645\u0633\u06CC\u0631",
    "\u062A\u063A\u06CC\u06CC\u0631\u0645\u0633\u06CC\u0631",
    //fa
    "\u0631\u062C\u0648\u0639 \u0645\u06A9\u0631\u0631",
    //ur
    "\u0631\u062C\u0648\u0639_\u0645\u06A9\u0631\u0631",
    //ur
    "\u0905\u0928\u0941\u092A\u094D\u0930\u0947\u0937\u093F\u0924",
    //hi
    "\u092A\u0941\u0928\u0930\u094D\u0928\u093F\u0930\u094D\u0926\u0947\u0936\u0928",
    //hi
    "\u09AA\u09C1\u09A8\u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6",
    //bn
    "\u09AA\u09C1\u09A8\u09B0\u09CD\u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6",
    "\u0DBA\u0DC5\u0DD2\u0DBA\u0DDC\u0DB8\u0DD4\u0DC0",
    "\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E17\u0E32\u0E07",
    "\u1794\u17D2\u178F\u17BC\u179A\u1791\u17B8\u178F\u17B6\u17C6\u1784\u1791\u17C5",
    //km
    "\uB2E4\uB978 \uB73B \uB118\uC5B4\uC634",
    "\u30EA\u30C0\u30A4\u30EC\u30AF\u30C8",
    //ja
    "\u8DF3\u8F49",
    "\u8EE2\u9001",
    //ja
    "\u91CD\u5B9A\u5411"
    //zh
  ];

  var references = [
    "references",
    "reference",
    "einzelnachweise",
    "referencias",
    "r\xE9f\xE9rences",
    "notes et r\xE9f\xE9rences",
    "\u811A\u6CE8",
    "referenser",
    "bronnen",
    "\u043F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F"
  ];

  let d = " disambiguation";
  const templates$d = [
    "dab",
    "dab",
    "disamb",
    "disambig",
    "geodis",
    "hndis",
    "setindex",
    "ship index",
    "split dab",
    "sport index",
    "wp disambig",
    "disambiguation cleanup",
    "airport" + d,
    "biology" + d,
    "call sign" + d,
    "caselaw" + d,
    "chinese title" + d,
    "genus" + d,
    "hospital" + d,
    "lake index",
    "letter" + d,
    "letter-number combination" + d,
    "mathematical" + d,
    "military unit" + d,
    "mountainindex",
    "number" + d,
    "phonetics" + d,
    "place name" + d,
    "portal" + d,
    "road" + d,
    "school" + d,
    "species latin name abbreviation" + d,
    "species latin name" + d,
    "station" + d,
    "synagogue" + d,
    "taxonomic authority" + d,
    "taxonomy" + d
  ].reduce((h, str) => {
    h[str] = true;
    return h;
  }, {});

  const mayAlsoReg = /. may (also )?refer to\b/i;
  const notDisambig = {
    about: true,
    for: true,
    "for multi": true,
    "other people": true,
    "other uses of": true,
    "distinguish": true
  };
  const inTitle = new RegExp(". \\((" + disambig_titles.join("|") + ")\\)$", "i");
  const i18n_templates = disambig_templates.reduce((h, str) => {
    h[str] = true;
    return h;
  }, {});
  const byText = function(s) {
    if (!s) {
      return false;
    }
    let txt = s.text();
    if (txt !== null && txt[0]) {
      if (mayAlsoReg.test(txt) === true) {
        return true;
      }
    }
    return false;
  };
  const isDisambig = function(doc) {
    let templates = doc.templates().map((tmpl) => tmpl.json());
    let found = templates.find((obj) => {
      return templates$d.hasOwnProperty(obj.template) || i18n_templates.hasOwnProperty(obj.template);
    });
    if (found) {
      return true;
    }
    let title = doc.title();
    if (title && inTitle.test(title) === true) {
      return true;
    }
    let notDisamb = templates.find((obj) => notDisambig.hasOwnProperty(obj.template));
    if (notDisamb) {
      return false;
    }
    if (byText(doc.sentence(0)) === true || byText(doc.sentence(1)) === true) {
      return true;
    }
    return false;
  };

  let allStubs = new Set(stubs);
  const isStub = function(doc) {
    let templates = doc.templates().map((tmpl) => tmpl.json());
    return templates.some((t) => {
      let name = t.template || "";
      if (allStubs.has(name)) {
        return true;
      }
      if (name === "stub" || name.endsWith("-stub")) {
        return true;
      }
      let words = name.split(/[- ]/);
      if (words.length > 1) {
        let word = words[words.length - 1];
        if (allStubs.has(word)) {
          return true;
        }
      }
      return false;
    });
  };

  const defaults$a = {
    caption: true,
    alt: true,
    links: true,
    thumb: true,
    url: true
  };
  const toJson$3 = function(img, options) {
    options = setDefaults(options, defaults$a);
    let json = {
      file: img.file()
    };
    if (options.thumb !== false) {
      json.thumb = img.thumbnail();
    }
    if (options.url !== false) {
      json.url = img.url();
    }
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

  const server = "wikipedia.org";
  const encodeTitle = function(file) {
    let title = file.replace(/^(image|file?):/i, "");
    title = title.charAt(0).toUpperCase() + title.substring(1);
    title = title.trim().replace(/ /g, "_");
    return title;
  };
  const makeSrc = function(file) {
    let title = encodeTitle(file);
    title = encodeURIComponent(title);
    return title;
  };
  class Image {
    constructor(data) {
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: data
      });
    }
    file() {
      let file = this.data.file || "";
      if (file) {
        const regFile = /^(image|file):/i;
        if (!regFile.test(file)) {
          file = `File:${file}`;
        }
        file = file.trim();
        file = file.charAt(0).toUpperCase() + file.substring(1);
        file = file.replace(/ /g, "_");
      }
      return file;
    }
    alt() {
      let str = this.data.alt || this.data.file || "";
      str = str.replace(/^(file|image):/i, "");
      str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, "");
      return str.replace(/_/g, " ");
    }
    caption() {
      if (this.data.caption) {
        return this.data.caption.text();
      }
      return "";
    }
    links() {
      if (this.data.caption) {
        return this.data.caption.links();
      }
      return [];
    }
    url() {
      let fileName = makeSrc(this.file());
      let domain = this.data.domain || server;
      let path = `wiki/Special:Redirect/file`;
      return `https://${domain}/${path}/${fileName}`;
    }
    src() {
      return this.url();
    }
    thumbnail(size) {
      size = size || 300;
      return this.url() + "?width=" + size;
    }
    thumb(size) {
      return this.thumbnail(size);
    }
    format() {
      let arr = this.file().split(".");
      if (arr[arr.length - 1]) {
        return arr[arr.length - 1].toLowerCase();
      }
      return null;
    }
    json(options) {
      options = options || {};
      return toJson$3(this, options);
    }
    text() {
      return "";
    }
    wikitext() {
      return this.data.wiki || "";
    }
  }

  var languages = {
    aa: "Afar",
    //Afar
    ab: "\u0410\u04A7\u0441\u0443\u0430",
    //Abkhazian
    af: "Afrikaans",
    //Afrikaans
    ak: "Akana",
    //Akan
    als: "Alemannisch",
    //Alemannic
    am: "\u12A0\u121B\u122D\u129B",
    //Amharic
    an: "Aragon\xE9s",
    //Aragonese
    ang: "Englisc",
    //Anglo-Saxon
    ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    //Arabic
    arc: "\u0723\u0718\u072A\u072C",
    //Aramaic
    as: "\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE",
    //Assamese
    ast: "Asturianu",
    //Asturian
    av: "\u0410\u0432\u0430\u0440",
    //Avar
    ay: "Aymar",
    //Aymara
    az: "Az\u0259rbaycanca",
    //Azerbaijani
    ba: "\u0411\u0430\u0448\u04A1\u043E\u0440\u0442",
    //Bashkir
    bar: "Boarisch",
    //Bavarian
    "bat-smg": "\u017Demait\u0117\u0161ka",
    //Samogitian
    bcl: "Bikol",
    //Bikol
    be: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F",
    //Belarusian
    "be-x-old": "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F (\u0442\u0430\u0440\u0430\u0448\u043A\u0435\u0432\u0456\u0446\u0430)",
    //Belarusian (Taraškievica)
    bg: "\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
    //Bulgarian
    bh: "\u092D\u094B\u091C\u092A\u0941\u0930\u0940",
    //Bihari
    bi: "Bislama",
    //Bislama
    bm: "Bamanankan",
    //Bambara
    bn: "\u09AC\u09BE\u0982\u09B2\u09BE",
    //Bengali
    bo: "\u0F56\u0F7C\u0F51\u0F0B\u0F61\u0F72\u0F42",
    //Tibetan
    bpy: "\u09AC\u09BF\u09B7\u09CD\u09A3\u09C1\u09AA\u09CD\u09B0\u09BF\u09AF\u09BC\u09BE \u09AE\u09A3\u09BF\u09AA\u09C1\u09B0\u09C0",
    //Bishnupriya Manipuri
    br: "Brezhoneg",
    //Breton
    bs: "Bosanski",
    //Bosnian
    bug: "\u1A05\u1A14",
    //Buginese
    bxr: "\u0411\u0443\u0440\u044F\u0430\u0434",
    //Buriat
    ca: "Catal\xE0",
    //Catalan
    cdo: "M\xECng-d\u0115\u0324ng-ng\u1E73\u0304",
    //Min Dong Chinese
    ce: "\u041D\u043E\u0445\u0447\u0438\u0439\u043D",
    //Chechen
    ceb: "Sinugboanong",
    //Cebuano
    ch: "Chamoru",
    //Chamorro
    cho: "Choctaw",
    //Choctaw
    chr: "\u13E3\u13B3\u13A9",
    //Cherokee
    chy: "Tsets\xEAhest\xE2hese",
    //Cheyenne
    co: "Corsu",
    //Corsican
    cr: "Nehiyaw",
    //Cree
    cs: "\u010Cesky",
    //Czech
    csb: "Kasz\xEBbsczi",
    //Kashubian
    cu: "\u0421\u043B\u043E\u0432\u0463\u043D\u044C\u0441\u043A\u044A",
    //Old Church Slavonic
    cv: "\u0427\u0103\u0432\u0430\u0448",
    //Chuvash
    cy: "Cymraeg",
    //Welsh
    da: "Dansk",
    //Danish
    de: "Deutsch",
    //German
    diq: "Zazaki",
    //Dimli
    dsb: "Dolnoserbski",
    //Lower Sorbian
    dv: "\u078B\u07A8\u0788\u07AC\u0780\u07A8\u0784\u07A6\u0790\u07B0",
    //Divehi
    dz: "\u0F47\u0F7C\u0F44\u0F0B\u0F41",
    //Dzongkha
    ee: "\u0190\u028B\u025B",
    //Ewe
    far: "\u0641\u0627\u0631\u0633\u06CC",
    //Farsi
    el: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC",
    //Greek
    en: "English",
    //English
    eo: "Esperanto",
    //Esperanto
    es: "Espa\xF1ol",
    //Spanish
    et: "Eesti",
    //Estonian
    eu: "Euskara",
    //Basque
    ext: "Estreme\xF1u",
    //Extremaduran
    ff: "Fulfulde",
    //Peul
    fi: "Suomi",
    //Finnish
    "fiu-vro": "V\xF5ro",
    //Võro
    fj: "Na",
    //Fijian
    fo: "F\xF8royskt",
    //Faroese
    fr: "Fran\xE7ais",
    //French
    frp: "Arpitan",
    //Arpitan
    fur: "Furlan",
    //Friulian
    fy: "Frysk",
    //West Frisian
    ga: "Gaeilge",
    //Irish
    gan: "\u8D1B\u8A9E",
    //Gan Chinese
    gd: "G\xE0idhlig",
    //Scottish Gaelic
    gil: "Taetae",
    //Gilbertese
    gl: "Galego",
    //Galician
    gn: "Ava\xF1e'\u1EBD",
    //Guarani
    got: "gutisk",
    //Gothic
    gu: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0",
    //Gujarati
    gv: "Gaelg",
    //Manx
    ha: "\u0647\u064E\u0648\u064F\u0633\u064E",
    //Hausa
    hak: "Hak-k\xE2-fa",
    //Hakka
    haw: "Hawai`i",
    //Hawaiian
    he: "\u05E2\u05D1\u05E8\u05D9\u05EA",
    //Hebrew
    hi: "\u0939\u093F\u0928\u094D\u0926\u0940",
    //Hindi
    ho: "Hiri Motu",
    //Hiri Motu
    hr: "Hrvatski",
    //Croatian
    ht: "Kr\xE8yol",
    //Haitian
    hu: "Magyar",
    //Hungarian
    hy: "\u0540\u0561\u0575\u0565\u0580\u0565\u0576",
    //Armenian
    hz: "Otsiherero",
    //Herero
    ia: "Interlingua",
    //Interlingua
    id: "Bahasa",
    //Indonesian
    ie: "Interlingue",
    //Interlingue
    ig: "Igbo",
    //Igbo
    ii: "\uA187\uA259",
    //Sichuan Yi
    ik: "I\xF1upiak",
    //Inupiak
    ilo: "Ilokano",
    //Ilokano
    io: "Ido",
    //Ido
    is: "\xCDslenska",
    //Icelandic
    it: "Italiano",
    //Italian
    iu: "\u1403\u14C4\u1483\u144E\u1450\u1466",
    //Inuktitut
    ja: "\u65E5\u672C\u8A9E",
    //Japanese
    jbo: "Lojban",
    //Lojban
    jv: "Basa",
    //Javanese
    ka: "\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8",
    //Georgian
    kg: "KiKongo",
    //Kongo
    ki: "G\u0129k\u0169y\u0169",
    //Kikuyu
    kj: "Kuanyama",
    //Kuanyama
    kk: "\u049A\u0430\u0437\u0430\u049B\u0448\u0430",
    //Kazakh
    kl: "Kalaallisut",
    //Greenlandic
    km: "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A",
    //Cambodian
    kn: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1",
    //Kannada
    khw: "\u06A9\u06BE\u0648\u0627\u0631",
    //Khowar
    ko: "\uD55C\uAD6D\uC5B4",
    //Korean
    kr: "Kanuri",
    //Kanuri
    ks: "\u0915\u0936\u094D\u092E\u0940\u0930\u0940",
    //Kashmiri
    ksh: "Ripoarisch",
    //Ripuarian
    ku: "Kurd\xEE",
    //Kurdish
    kv: "\u041A\u043E\u043C\u0438",
    //Komi
    kw: "Kernewek",
    //Cornish
    ky: "K\u0131rg\u0131zca",
    //Kirghiz
    la: "Latina",
    //Latin
    lad: "Dzhudezmo",
    //Ladino
    lan: "Leb",
    //Lango
    lb: "L\xEBtzebuergesch",
    //Luxembourgish
    lg: "Luganda",
    //Ganda
    li: "Limburgs",
    //Limburgian
    lij: "L\xEDguru",
    //Ligurian
    lmo: "Lumbaart",
    //Lombard
    ln: "Ling\xE1la",
    //Lingala
    lo: "\u0EA5\u0EB2\u0EA7",
    //Laotian
    lt: "Lietuvi\u0173",
    //Lithuanian
    lv: "Latvie\u0161u",
    //Latvian
    "map-bms": "Basa",
    //Banyumasan
    mg: "Malagasy",
    //Malagasy
    man: "\u5B98\u8A71",
    //Mandarin
    mh: "Kajin",
    //Marshallese
    mi: "M\u0101ori",
    //Maori
    min: "Minangkabau",
    //Minangkabau
    mk: "\u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438",
    //Macedonian
    ml: "\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02",
    //Malayalam
    mn: "\u041C\u043E\u043D\u0433\u043E\u043B",
    //Mongolian
    mo: "Moldoveneasc\u0103",
    //Moldovan
    mr: "\u092E\u0930\u093E\u0920\u0940",
    //Marathi
    ms: "Bahasa",
    //Malay
    mt: "bil-Malti",
    //Maltese
    mus: "Muskogee",
    //Creek
    my: "Myanmasa",
    //Burmese
    na: "Dorerin",
    //Nauruan
    nah: "Nahuatl",
    //Nahuatl
    nap: "Nnapulitano",
    //Neapolitan
    nd: "isiNdebele",
    //North Ndebele
    nds: "Plattd\xFC\xFCtsch",
    //Low German
    "nds-nl": "Nedersaksisch",
    //Dutch Low Saxon
    ne: "\u0928\u0947\u092A\u093E\u0932\u0940",
    //Nepali
    new: "\u0928\u0947\u092A\u093E\u0932\u092D\u093E\u0937\u093E",
    //Newar
    ng: "Oshiwambo",
    //Ndonga
    nl: "Nederlands",
    //Dutch
    nn: "Nynorsk",
    //Norwegian Nynorsk
    no: "Norsk",
    //Norwegian
    nr: "isiNdebele",
    //South Ndebele
    nso: "Sesotho sa Leboa",
    //Northern Sotho
    nrm: "Nouormand",
    //Norman
    nv: "Din\xE9",
    //Navajo
    ny: "Chi-Chewa",
    //Chichewa
    oc: "Occitan",
    //Occitan
    oj: "\u140A\u14C2\u1511\u14C8\u142F\u14A7\u140E\u14D0",
    //Ojibwa
    om: "Oromoo",
    //Oromo
    or: "\u0B13\u0B21\u0B3C\u0B3F\u0B06",
    //Oriya
    os: "\u0418\u0440\u043E\u043D\u0430\u0443",
    //Ossetian
    pa: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40",
    //Panjabi
    pag: "Pangasinan",
    //Pangasinan
    pam: "Kapampangan",
    //Kapampangan
    pap: "Papiamentu",
    //Papiamentu
    pdc: "Deitsch",
    //Pennsylvania German
    pi: "P\u0101li",
    //Pali
    pih: "Norfuk",
    //Norfolk
    pl: "Polski",
    //Polish
    pms: "Piemont\xE8is",
    //Piedmontese
    ps: "\u067E\u069A\u062A\u0648",
    //Pashto
    pt: "Portugu\xEAs",
    //Portuguese
    qu: "Runa",
    //Quechua
    rm: "Rumantsch",
    //Raeto-Romance
    rmy: "Romani",
    //Romani
    rn: "Kirundi",
    //Kirundi
    ro: "Rom\xE2n\u0103",
    //Romanian
    "roa-rup": "Arm\xE2neashti",
    //Aromanian
    ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    //Russian
    rw: "Kinyarwandi",
    //Rwandi
    sa: "\u0938\u0902\u0938\u094D\u0915\u0943\u0924\u092E\u094D",
    //Sanskrit
    sc: "Sardu",
    //Sardinian
    scn: "Sicilianu",
    //Sicilian
    sco: "Scots",
    //Scots
    sd: "\u0938\u093F\u0928\u0927\u093F",
    //Sindhi
    se: "Davvis\xE1megiella",
    //Northern Sami
    sg: "S\xE4ng\xF6",
    //Sango
    sh: "Srpskohrvatski",
    //Serbo-Croatian
    si: "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD",
    //Sinhalese
    simple: "Simple English",
    //Simple English
    sk: "Sloven\u010Dina",
    //Slovak
    sl: "Sloven\u0161\u010Dina",
    //Slovenian
    sm: "Gagana",
    //Samoan
    sn: "chiShona",
    //Shona
    so: "Soomaaliga",
    //Somalia
    sq: "Shqip",
    //Albanian
    sr: "\u0421\u0440\u043F\u0441\u043A\u0438",
    //Serbian
    ss: "SiSwati",
    //Swati
    st: "Sesotho",
    //Southern Sotho
    su: "Basa",
    //Sundanese
    sv: "Svenska",
    //Swedish
    sw: "Kiswahili",
    //Swahili
    ta: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD",
    //Tamil
    te: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",
    //Telugu
    tet: "Tetun",
    //Tetum
    tg: "\u0422\u043E\u04B7\u0438\u043A\u04E3",
    //Tajik
    th: "\u0E44\u0E17\u0E22",
    //Thai
    ti: "\u1275\u130D\u122D\u129B",
    //Tigrinya
    tk: "\u0422\u0443\u0440\u043A\u043C\u0435\u043D",
    //Turkmen
    tl: "Tagalog",
    //Tagalog
    tlh: "tlhIngan-Hol",
    //Klingon
    tn: "Setswana",
    //Tswana
    to: "Lea",
    //Tonga
    tpi: "Tok Pisin",
    //Tok Pisin
    tr: "T\xFCrk\xE7e",
    //Turkish
    ts: "Xitsonga",
    //Tsonga
    tt: "Tatar\xE7a",
    //Tatar
    tum: "chiTumbuka",
    //Tumbuka
    tw: "Twi",
    //Twi
    ty: "Reo",
    //Tahitian
    udm: "\u0423\u0434\u043C\u0443\u0440\u0442",
    //Udmurt
    ug: "Uy\u01A3urq\u0259",
    //Uyghur
    uk: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",
    //Ukrainian
    ur: "\u0627\u0631\u062F\u0648",
    //Urdu
    uz: "\u040E\u0437\u0431\u0435\u043A",
    //Uzbek
    ve: "Tshiven\u1E13a",
    //Venda
    vi: "Vi\u1EC7tnam",
    //Vietnamese
    vec: "V\xE8neto",
    //Venetian
    vls: "West-Vlams",
    //West Flemish
    vo: "Volap\xFCk",
    //Volapük
    wa: "Walon",
    //Walloon
    war: "Winaray",
    //Waray-Waray
    wo: "Wollof",
    //Wolof
    xal: "\u0425\u0430\u043B\u044C\u043C\u0433",
    //Kalmyk
    xh: "isiXhosa",
    //Xhosa
    yi: "\u05D9\u05D9\u05B4\u05D3\u05D9\u05E9",
    //Yiddish
    yo: "Yor\xF9b\xE1",
    //Yoruba
    za: "Cuengh",
    //Zhuang
    zh: "\u4E2D\u6587",
    //Chinese
    "zh-classical": "\u6587\u8A00",
    //Classical Chinese
    "zh-min-nan": "B\xE2n-l\xE2m-g\xFA",
    //Minnan
    "zh-yue": "\u7CB5\u8A9E",
    //Cantonese
    zu: "isiZulu"
    //Zulu
  };

  const wp = ".wikipedia.org/wiki/$1";
  const wm = ".wikimedia.org/wiki/$1";
  const w = "www.";
  var wikis = {
    acronym: w + "acronymfinder.com/$1.html",
    advisory: "advisory" + wm,
    advogato: w + "advogato.org/$1",
    aew: "wiki.arabeyes.org/$1",
    appropedia: w + "appropedia.org/$1",
    aquariumwiki: w + "theaquariumwiki.com/$1",
    arborwiki: "localwiki.org/ann-arbor/$1",
    arxiv: "arxiv.org/abs/$1",
    atmwiki: w + "otterstedt.de/wiki/index.php/$1",
    baden: w + "stadtwiki-baden-baden.de/wiki/$1/",
    battlestarwiki: "en.battlestarwiki.org/wiki/$1",
    bcnbio: "historiapolitica.bcn.cl/resenas_parlamentarias/wiki/$1",
    beacha: w + "beachapedia.org/$1",
    betawiki: "translatewiki.net/wiki/$1",
    bibcode: "adsabs.harvard.edu/abs/$1",
    bibliowiki: "wikilivres.org/wiki/$1",
    bluwiki: "bluwiki.com/go/$1",
    blw: "britainloves" + wp,
    botwiki: "botwiki.sno.cc/wiki/$1",
    boxrec: w + "boxrec.com/media/index.php?$1",
    brickwiki: w + "brickwiki.info/wiki/$1",
    bugzilla: "bugzilla.wikimedia.org/show_bug.cgi?id=$1",
    bulba: "bulbapedia.bulbagarden.net/wiki/$1",
    c: "commons" + wm,
    c2: "c2.com/cgi/wiki?$1",
    c2find: "c2.com/cgi/wiki?FindPage&value=$1",
    cache: w + "google.com/search?q=cache:$1",
    \u0109ej: "esperanto.blahus.cz/cxej/vikio/index.php/$1",
    cellwiki: "cell.wikia.com/wiki/$1",
    centralwikia: "community.wikia.com/wiki/$1",
    chej: "esperanto.blahus.cz/cxej/vikio/index.php/$1",
    choralwiki: w + "cpdl.org/wiki/index.php/$1",
    citizendium: "en.citizendium.org/wiki/$1",
    ckwiss: w + "ck-wissen.de/ckwiki/index.php?title=$1",
    comixpedia: w + "comixpedia.org/index.php?title=$1",
    commons: "commons" + wm,
    communityscheme: "community.schemewiki.org/?c=s&key=$1",
    communitywiki: "communitywiki.org/$1",
    comune: "rete.comuni-italiani.it/wiki/$1",
    creativecommons: "creativecommons.org/licenses/$1",
    creativecommonswiki: "wiki.creativecommons.org/$1",
    cxej: "esperanto.blahus.cz/cxej/vikio/index.php/$1",
    dcc: w + "dccwiki.com/$1",
    dcdatabase: "dc.wikia.com/$1",
    dcma: "christian-morgenstern.de/dcma/index.php?title=$1",
    debian: "wiki.debian.org/$1",
    delicious: w + "delicious.com/tag/$1",
    devmo: "developer.mozilla.org/en/docs/$1",
    dictionary: w + "dict.org/bin/Dict?Database=*&Form=Dict1&Strategy=*&Query=$1",
    dict: w + "dict.org/bin/Dict?Database=*&Form=Dict1&Strategy=*&Query=$1",
    disinfopedia: "sourcewatch.org/index.php/$1",
    distributedproofreaders: w + "pgdp.net/wiki/$1",
    distributedproofreadersca: w + "pgdpcanada.net/wiki/index.php/$1",
    dmoz: "curlie.org/$1",
    dmozs: "curlie.org/search?q=$1",
    doi: "doi.org/$1",
    donate: "donate" + wm,
    doom_wiki: "doom.wikia.com/wiki/$1",
    download: "releases.wikimedia.org/$1",
    dbdump: "dumps.wikimedia.org/$1/latest/",
    dpd: "lema.rae.es/dpd/?key=$1",
    drae: "dle.rae.es/?w=$1",
    dreamhost: "wiki.dreamhost.com/index.php/$1",
    drumcorpswiki: w + "drumcorpswiki.com/index.php/$1",
    dwjwiki: w + "suberic.net/cgi-bin/dwj/wiki.cgi?$1",
    e\u0109ei: w + "ikso.net/cgi-bin/wiki.pl?$1",
    ecoreality: w + "EcoReality.org/wiki/$1",
    ecxei: w + "ikso.net/cgi-bin/wiki.pl?$1",
    elibre: "enciclopedia.us.es/index.php/$1",
    emacswiki: w + "emacswiki.org/emacs?$1",
    encyc: "encyc.org/wiki/$1",
    energiewiki: w + "netzwerk-energieberater.de/wiki/index.php/$1",
    englyphwiki: "en.glyphwiki.org/wiki/$1",
    enkol: "enkol.pl/$1",
    eokulturcentro: "esperanto.toulouse.free.fr/nova/wikini/wakka.php?wiki=$1",
    esolang: "esolangs.org/wiki/$1",
    etherpad: "etherpad.wikimedia.org/$1",
    ethnologue: w + "ethnologue.com/language/$1",
    ethnologuefamily: w + "ethnologue.com/show_family.asp?subid=$1",
    evowiki: "wiki.cotch.net/index.php/$1",
    exotica: w + "exotica.org.uk/wiki/$1",
    fanimutationwiki: "wiki.animutationportal.com/index.php/$1",
    fedora: "fedoraproject.org/wiki/$1",
    finalfantasy: "finalfantasy.wikia.com/wiki/$1",
    finnix: w + "finnix.org/$1",
    flickruser: w + "flickr.com/people/$1",
    flickrphoto: w + "flickr.com/photo.gne?id=$1",
    floralwiki: w + "floralwiki.co.uk/wiki/$1",
    foldoc: "foldoc.org/$1",
    foundation: "foundation" + wm,
    foundationsite: "wikimediafoundation.org/$1",
    foxwiki: "fox.wikis.com/wc.dll?Wiki~$1",
    freebio: "freebiology.org/wiki/$1",
    freebsdman: w + "FreeBSD.org/cgi/man.cgi?apropos=1&query=$1",
    freeculturewiki: "wiki.freeculture.org/index.php/$1",
    freedomdefined: "freedomdefined.org/$1",
    freefeel: "freefeel.org/wiki/$1",
    freekiwiki: "wiki.freegeek.org/index.php/$1",
    // freenode: 'irc://irc.freenode.net/$1',
    freesoft: "directory.fsf.org/wiki/$1",
    ganfyd: "ganfyd.org/index.php?title=$1",
    gardenology: w + "gardenology.org/wiki/$1",
    gausswiki: "gauss.ffii.org/$1",
    gentoo: "wiki.gentoo.org/wiki/$1",
    genwiki: "wiki.genealogy.net/index.php/$1",
    gerrit: "gerrit.wikimedia.org/r/$1",
    git: "gerrit.wikimedia.org/g/$1",
    google: w + "google.com/search?q=$1",
    googledefine: w + "google.com/search?q=define:$1",
    googlegroups: "groups.google.com/groups?q=$1",
    guildwarswiki: "wiki.guildwars.com/wiki/$1",
    guildwiki: "guildwars.wikia.com/wiki/$1",
    guc: "tools.wmflabs.org/guc/?user=$1",
    gucprefix: "tools.wmflabs.org/guc/?isPrefixPattern=1&src=rc&user=$1",
    gutenberg: w + "gutenberg.org/etext/$1",
    gutenbergwiki: w + "gutenberg.org/wiki/$1",
    hackerspaces: "hackerspaces.org/wiki/$1",
    h2wiki: "halowiki.net/p/$1",
    hammondwiki: w + "dairiki.org/HammondWiki/index.php3?$1",
    hdl: "hdl.handle.net/$1",
    heraldik: "heraldik-wiki.de/wiki/$1",
    heroeswiki: "heroeswiki.com/$1",
    horizonlabs: "horizon.wikimedia.org/$1",
    hrwiki: w + "hrwiki.org/index.php/$1",
    hrfwiki: "fanstuff.hrwiki.org/index.php/$1",
    hupwiki: "wiki.hup.hu/index.php/$1",
    iarchive: "archive.org/details/$1",
    imdbname: w + "imdb.com/name/nm$1/",
    imdbtitle: w + "imdb.com/title/tt$1/",
    imdbcompany: w + "imdb.com/company/co$1/",
    imdbcharacter: w + "imdb.com/character/ch$1/",
    incubator: "incubator" + wm,
    infosecpedia: "infosecpedia.org/wiki/$1",
    infosphere: "theinfosphere.org/$1",
    // irc: 'irc://irc.freenode.net/$1',
    // ircs: 'ircs://irc.freenode.net/$1',
    // ircrc: 'irc://irc.wikimedia.org/$1',
    // rcirc: 'irc://irc.wikimedia.org/$1',
    "iso639-3": "iso639-3.sil.org/code/$1",
    issn: w + "worldcat.org/issn/$1",
    iuridictum: "iuridictum.pecina.cz/w/$1",
    jaglyphwiki: "glyphwiki.org/wiki/$1",
    jefo: "esperanto-jeunes.org/wiki/$1",
    jerseydatabase: "jerseydatabase.com/wiki.php?id=$1",
    jira: "jira.toolserver.org/browse/$1",
    jspwiki: w + "ecyrd.com/JSPWiki/Wiki.jsp?page=$1",
    jstor: w + "jstor.org/journals/$1",
    kamelo: "kamelopedia.mormo.org/index.php/$1",
    karlsruhe: "ka.stadtwiki.net/$1",
    kinowiki: "kino.skripov.com/index.php/$1",
    komicawiki: "wiki.komica.org/?$1",
    kontuwiki: "kontu.wiki/$1",
    wikitech: "wikitech" + wm,
    libreplanet: "libreplanet.org/wiki/$1",
    linguistlist: "linguistlist.org/forms/langs/LLDescription.cfm?code=$1",
    linuxwiki: w + "linuxwiki.de/$1",
    linuxwikide: w + "linuxwiki.de/$1",
    liswiki: "liswiki.org/wiki/$1",
    literateprograms: "en.literateprograms.org/$1",
    livepedia: w + "livepedia.gr/index.php?title=$1",
    localwiki: "localwiki.org/$1",
    lojban: "mw.lojban.org/papri/$1",
    lostpedia: "lostpedia.wikia.com/wiki/$1",
    lqwiki: "wiki.linuxquestions.org/wiki/$1",
    luxo: "tools.wmflabs.org/guc/?user=$1",
    mail: "lists.wikimedia.org/mailman/listinfo/$1",
    mailarchive: "lists.wikimedia.org/pipermail/$1",
    mariowiki: w + "mariowiki.com/$1",
    marveldatabase: w + "marveldatabase.com/wiki/index.php/$1",
    meatball: "meatballwiki.org/wiki/$1",
    mw: w + "mediawiki.org/wiki/$1",
    mediazilla: "bugzilla.wikimedia.org/$1",
    memoryalpha: "memory-alpha.fandom.com/wiki/$1",
    metawiki: "meta" + wm,
    metawikimedia: "meta" + wm,
    metawikipedia: "meta" + wm,
    mineralienatlas: w + "mineralienatlas.de/lexikon/index.php/$1",
    moinmoin: "moinmo.in/$1",
    monstropedia: w + "monstropedia.org/?title=$1",
    mosapedia: "mosapedia.de/wiki/index.php/$1",
    mozcom: "mozilla.wikia.com/wiki/$1",
    mozillawiki: "wiki.mozilla.org/$1",
    mozillazinekb: "kb.mozillazine.org/$1",
    musicbrainz: "musicbrainz.org/doc/$1",
    mediawikiwiki: w + "mediawiki.org/wiki/$1",
    mwod: w + "merriam-webster.com/dictionary/$1",
    mwot: w + "merriam-webster.com/thesaurus/$1",
    nkcells: w + "nkcells.info/index.php?title=$1",
    nara: "catalog.archives.gov/id/$1",
    nosmoke: "no-smok.net/nsmk/$1",
    nost: "nostalgia" + wp,
    nostalgia: "nostalgia" + wp,
    oeis: "oeis.org/$1",
    oldwikisource: "wikisource.org/wiki/$1",
    olpc: "wiki.laptop.org/go/$1",
    omegawiki: w + "omegawiki.org/Expression:$1",
    onelook: w + "onelook.com/?ls=b&w=$1",
    openlibrary: "openlibrary.org/$1",
    openstreetmap: "wiki.openstreetmap.org/wiki/$1",
    openwetware: "openwetware.org/wiki/$1",
    opera7wiki: "operawiki.info/$1",
    organicdesign: w + "organicdesign.co.nz/$1",
    orthodoxwiki: "orthodoxwiki.org/$1",
    osmwiki: "wiki.openstreetmap.org/wiki/$1",
    otrs: "ticket.wikimedia.org/otrs/index.pl?Action=AgentTicketZoom&TicketID=$1",
    otrswiki: "otrs-wiki" + wm,
    ourmedia: w + "socialtext.net/ourmedia/index.cgi?$1",
    outreach: "outreach" + wm,
    outreachwiki: "outreach" + wm,
    owasp: w + "owasp.org/index.php/$1",
    panawiki: "wiki.alairelibre.net/index.php?title=$1",
    patwiki: "gauss.ffii.org/$1",
    personaltelco: "personaltelco.net/wiki/$1",
    petscan: "petscan.wmflabs.org/?psid=$1",
    phab: "phabricator.wikimedia.org/$1",
    phabricator: "phabricator.wikimedia.org/$1",
    phwiki: w + "pocketheaven.com/ph/wiki/index.php?title=$1",
    phpwiki: "phpwiki.sourceforge.net/phpwiki/index.php?$1",
    planetmath: "planetmath.org/node/$1",
    pmeg: w + "bertilow.com/pmeg/$1",
    pmid: w + "ncbi.nlm.nih.gov/pubmed/$1?dopt=Abstract",
    pokewiki: "pokewiki.de/$1",
    pok\u00E9wiki: "pokewiki.de/$1",
    policy: "policy.wikimedia.org/$1",
    proofwiki: w + "proofwiki.org/wiki/$1",
    pyrev: w + "mediawiki.org/wiki/Special:Code/pywikipedia/$1",
    pythoninfo: "wiki.python.org/moin/$1",
    pythonwiki: w + "pythonwiki.de/$1",
    pywiki: "c2.com/cgi/wiki?$1",
    psycle: "psycle.sourceforge.net/wiki/$1",
    quality: "quality" + wm,
    quarry: "quarry.wmflabs.org/$1",
    regiowiki: "regiowiki.at/wiki/$1",
    rev: w + "mediawiki.org/wiki/Special:Code/MediaWiki/$1",
    revo: "purl.org/NET/voko/revo/art/$1.html",
    rfc: "tools.ietf.org/html/rfc$1",
    rheinneckar: "rhein-neckar-wiki.de/$1",
    robowiki: "robowiki.net/?$1",
    rodovid: "en.rodovid.org/wk/$1",
    reuterswiki: "glossary.reuters.com/index.php/$1",
    rowiki: "wiki.rennkuckuck.de/index.php/$1",
    rt: "rt.wikimedia.org/Ticket/Display.html?id=$1",
    // rtfm: 'ftp://rtfm.mit.edu/pub/faqs/$1',
    s23wiki: "s23.org/wiki/$1",
    scholar: "scholar.google.com/scholar?q=$1",
    schoolswp: "schools-" + wp,
    scores: "imslp.org/wiki/$1",
    scoutwiki: "en.scoutwiki.org/$1",
    scramble: w + "scramble.nl/wiki/index.php?title=$1",
    seapig: w + "seapig.org/$1",
    seattlewiki: "seattle.wikia.com/wiki/$1",
    slwiki: "wiki.secondlife.com/wiki/$1",
    "semantic-mw": w + "semantic-mediawiki.org/wiki/$1",
    senseislibrary: "senseis.xmp.net/?$1",
    sharemap: "sharemap.org/$1",
    silcode: w + "sil.org/iso639-3/documentation.asp?id=$1",
    slashdot: "slashdot.org/article.pl?sid=$1",
    sourceforge: "sourceforge.net/$1",
    spcom: "spcom" + wm,
    species: "species" + wm,
    squeak: "wiki.squeak.org/squeak/$1",
    stats: "stats.wikimedia.org/$1",
    stewardry: "tools.wmflabs.org/meta/stewardry/?wiki=$1",
    strategy: "strategy" + wm,
    strategywiki: "strategywiki.org/wiki/$1",
    sulutil: "meta.wikimedia.org/wiki/Special:CentralAuth/$1",
    swtrain: "train.spottingworld.com/$1",
    svn: "svn.wikimedia.org/viewvc/mediawiki/$1?view=log",
    swinbrain: "swinbrain.ict.swin.edu.au/wiki/$1",
    tabwiki: w + "tabwiki.com/index.php/$1",
    tclerswiki: "wiki.tcl.tk/$1",
    technorati: w + "technorati.com/search/$1",
    tenwiki: "ten" + wp,
    testwiki: "test" + wp,
    testwikidata: "test.wikidata.org/wiki/$1",
    test2wiki: "test2" + wp,
    tfwiki: "tfwiki.net/wiki/$1",
    thelemapedia: w + "thelemapedia.org/index.php/$1",
    theopedia: w + "theopedia.com/$1",
    thinkwiki: w + "thinkwiki.org/wiki/$1",
    ticket: "ticket.wikimedia.org/otrs/index.pl?Action=AgentTicketZoom&TicketNumber=$1",
    tmbw: "tmbw.net/wiki/$1",
    tmnet: w + "technomanifestos.net/?$1",
    tmwiki: w + "EasyTopicMaps.com/?page=$1",
    toolforge: "tools.wmflabs.org/$1",
    toollabs: "tools.wmflabs.org/$1",
    tools: "toolserver.org/$1",
    tswiki: w + "mediawiki.org/wiki/Toolserver:$1",
    translatewiki: "translatewiki.net/wiki/$1",
    tviv: "tviv.org/wiki/$1",
    tvtropes: w + "tvtropes.org/pmwiki/pmwiki.php/Main/$1",
    twiki: "twiki.org/cgi-bin/view/$1",
    tyvawiki: w + "tyvawiki.org/wiki/$1",
    umap: "umap.openstreetmap.fr/$1",
    uncyclopedia: "en.uncyclopedia.co/wiki/$1",
    unihan: w + "unicode.org/cgi-bin/GetUnihanData.pl?codepoint=$1",
    unreal: "wiki.beyondunreal.com/wiki/$1",
    urbandict: w + "urbandictionary.com/define.php?term=$1",
    usej: w + "tejo.org/usej/$1",
    usemod: w + "usemod.com/cgi-bin/wiki.pl?$1",
    usability: "usability" + wm,
    utrs: "utrs.wmflabs.org/appeal.php?id=$1",
    vikidia: "fr.vikidia.org/wiki/$1",
    vlos: "tusach.thuvienkhoahoc.com/wiki/$1",
    vkol: "kol.coldfront.net/thekolwiki/index.php/$1",
    voipinfo: w + "voip-info.org/wiki/view/$1",
    votewiki: "vote" + wm,
    werelate: w + "werelate.org/wiki/$1",
    wg: "wg-en" + wp,
    wikia: w + "wikia.com/wiki/w:c:$1",
    wikiasite: w + "wikia.com/wiki/w:c:$1",
    wikiapiary: "wikiapiary.com/wiki/$1",
    wikibooks: "en.wikibooks.org/wiki/$1",
    wikichristian: w + "wikichristian.org/index.php?title=$1",
    wikicities: w + "wikia.com/wiki/w:$1",
    wikicity: w + "wikia.com/wiki/w:c:$1",
    wikiconference: "wikiconference.org/wiki/$1",
    wikidata: w + "wikidata.org/wiki/$1",
    wikif1: w + "wikif1.org/$1",
    wikifur: "en.wikifur.com/wiki/$1",
    wikihow: w + "wikihow.com/$1",
    wikiindex: "wikiindex.org/$1",
    wikilemon: "wiki.illemonati.com/$1",
    wikilivres: "wikilivres.org/wiki/$1",
    wikilivresru: "wikilivres.ru/$1",
    "wikimac-de": "apfelwiki.de/wiki/Main/$1",
    wikimedia: "foundation" + wm,
    wikinews: "en.wikinews.org/wiki/$1",
    wikinfo: "wikinfo.org/w/index.php/$1",
    wikinvest: "meta.wikimedia.org/wiki/Interwiki_map/discontinued#Wikinvest",
    wikiotics: "wikiotics.org/$1",
    wikipapers: "wikipapers.referata.com/wiki/$1",
    wikipedia: "en" + wp,
    wikipediawikipedia: "en.wikipedia.org/wiki/Wikipedia:$1",
    wikiquote: "en.wikiquote.org/wiki/$1",
    wikisophia: "wikisophia.org/index.php?title=$1",
    wikisource: "en.wikisource.org/wiki/$1",
    wikispecies: "species" + wm,
    wikispot: "wikispot.org/?action=gotowikipage&v=$1",
    wikiskripta: w + "wikiskripta.eu/index.php/$1",
    labsconsole: "wikitech" + wm,
    wikiti: "wikiti.denglend.net/index.php?title=$1",
    wikiversity: "en.wikiversity.org/wiki/$1",
    wikivoyage: "en.wikivoyage.org/wiki/$1",
    betawikiversity: "beta.wikiversity.org/wiki/$1",
    wikiwikiweb: "c2.com/cgi/wiki?$1",
    wiktionary: "en.wiktionary.org/wiki/$1",
    wipipedia: "wipipedia.org/index.php/$1",
    wlug: w + "wlug.org.nz/$1",
    wmam: "am" + wm,
    wmar: w + "wikimedia.org.ar/wiki/$1",
    wmat: "mitglieder.wikimedia.at/$1",
    wmau: "wikimedia.org.au/wiki/$1",
    wmbd: "bd" + wm,
    wmbe: "be" + wm,
    wmbr: "br" + wm,
    wmca: "ca" + wm,
    wmch: w + "wikimedia.ch/$1",
    wmcl: w + "wikimediachile.cl/index.php?title=$1",
    wmcn: "cn" + wm,
    wmco: "co" + wm,
    wmcz: w + "wikimedia.cz/web/$1",
    wmdc: "wikimediadc.org/wiki/$1",
    securewikidc: "secure.wikidc.org/$1",
    wmde: "wikimedia.de/wiki/$1",
    wmdk: "dk" + wm,
    wmee: "ee" + wm,
    wmec: "ec" + wm,
    wmes: w + "wikimedia.es/wiki/$1",
    wmet: "ee" + wm,
    wmfdashboard: "outreachdashboard.wmflabs.org/$1",
    wmfi: "fi" + wm,
    wmfr: "wikimedia.fr/$1",
    wmge: "ge" + wm,
    wmhi: "hi" + wm,
    wmhk: "meta.wikimedia.org/wiki/Wikimedia_Hong_Kong",
    wmhu: "wikimedia.hu/wiki/$1",
    wmid: "id" + wm,
    wmil: w + "wikimedia.org.il/$1",
    wmin: "wiki.wikimedia.in/$1",
    wmit: "wiki.wikimedia.it/wiki/$1",
    wmke: "meta.wikimedia.org/wiki/Wikimedia_Kenya",
    wmmk: "mk" + wm,
    wmmx: "mx" + wm,
    wmnl: "nl" + wm,
    wmnyc: "nyc" + wm,
    wmno: "no" + wm,
    "wmpa-us": "pa-us" + wm,
    wmph: "meta.wikimedia.org/wiki/Wikimedia_Philippines",
    wmpl: "pl" + wm,
    wmpt: "pt" + wm,
    wmpunjabi: "punjabi" + wm,
    wmromd: "romd" + wm,
    wmrs: "rs" + wm,
    wmru: "ru" + wm,
    wmse: "se" + wm,
    wmsk: "wikimedia.sk/$1",
    wmtr: "tr" + wm,
    wmtw: "wikimedia.tw/wiki/index.php5/$1",
    wmua: "ua" + wm,
    wmuk: "wikimedia.org.uk/wiki/$1",
    wmve: "wikimedia.org.ve/wiki/$1",
    wmza: "wikimedia.org.za/wiki/$1",
    wm2005: "wikimania2005" + wm,
    wm2006: "wikimania2006" + wm,
    wm2007: "wikimania2007" + wm,
    wm2008: "wikimania2008" + wm,
    wm2009: "wikimania2009" + wm,
    wm2010: "wikimania2010" + wm,
    wm2011: "wikimania2011" + wm,
    wm2012: "wikimania2012" + wm,
    wm2013: "wikimania2013" + wm,
    wm2014: "wikimania2014" + wm,
    wm2015: "wikimania2015" + wm,
    wm2016: "wikimania2016" + wm,
    wm2017: "wikimania2017" + wm,
    wm2018: "wikimania2018" + wm,
    wmania: "wikimania" + wm,
    wikimania: "wikimania" + wm,
    wmteam: "wikimaniateam" + wm,
    wmf: "foundation" + wm,
    wmfblog: "blog.wikimedia.org/$1",
    wmdeblog: "blog.wikimedia.de/$1",
    wookieepedia: "starwars.wikia.com/wiki/$1",
    wowwiki: w + "wowwiki.com/$1",
    wqy: "wqy.sourceforge.net/cgi-bin/index.cgi?$1",
    wurmpedia: "wurmpedia.com/index.php/$1",
    viaf: "viaf.org/viaf/$1",
    zrhwiki: w + "zrhwiki.ch/wiki/$1",
    zum: "wiki.zum.de/$1",
    zwiki: w + "zwiki.org/$1",
    m: "meta" + wm,
    meta: "meta" + wm,
    sep11: "sep11" + wp,
    d: w + "wikidata.org/wiki/$1",
    minnan: "zh-min-nan" + wp,
    nb: "no" + wp,
    "zh-cfr": "zh-min-nan" + wp,
    "zh-cn": "zh" + wp,
    "zh-tw": "zh" + wp,
    nan: "zh-min-nan" + wp,
    vro: "fiu-vro" + wp,
    cmn: "zh" + wp,
    lzh: "zh-classical" + wp,
    rup: "roa-rup" + wp,
    gsw: "als" + wp,
    "be-tarask": "be-x-old" + wp,
    sgs: "bat-smg" + wp,
    egl: "eml" + wp,
    w: "en" + wp,
    wikt: "en.wiktionary.org/wiki/$1",
    q: "en.wikiquote.org/wiki/$1",
    b: "en.wikibooks.org/wiki/$1",
    n: "en.wikinews.org/wiki/$1",
    s: "en.wikisource.org/wiki/$1",
    chapter: "en" + wm,
    v: "en.wikiversity.org/wiki/$1",
    voy: "en.wikivoyage.org/wiki/$1"
  };

  Object.keys(languages).forEach((k) => {
    wikis[k] = k + ".wikipedia.org/wiki/$1";
  });
  const parseInterwiki = function(obj) {
    let str = obj.page || "";
    if (str.indexOf(":") !== -1) {
      let m = str.match(/^(.*):(.*)/);
      if (m === null) {
        return obj;
      }
      let site = m[1] || "";
      site = site.toLowerCase();
      if (site.indexOf(":") !== -1) {
        let [, wiki, lang] = site.match(/^:?(.*):(.*)/);
        if (wikis.hasOwnProperty(wiki) === false || languages.hasOwnProperty(lang) === false) {
          return obj;
        }
        obj.wiki = { wiki, lang };
      } else {
        if (wikis.hasOwnProperty(site) === false) {
          return obj;
        }
        obj.wiki = site;
      }
      obj.page = m[2];
    }
    return obj;
  };

  const ignore_links = /^(category|catégorie|kategorie|categoría|categoria|categorie|kategoria|تصنيف|image|file|fichier|datei|media):/i;
  const external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]| ]{4,1500})([| ].*?)?\]/g;
  const link_reg = /\[\[(.{0,1600}?)\]\]([a-z]+)?/gi;
  const external_links = function(links, str) {
    str.replace(external_link, function(raw, protocol, link, text) {
      text = text || "";
      links.push({
        type: "external",
        site: protocol + link,
        text: text.trim(),
        raw
      });
      return text;
    });
    return links;
  };
  const internal_links = function(links, str) {
    str.replace(link_reg, function(raw, s, suffix) {
      let txt = null;
      let link = s;
      if (s.match(/\|/)) {
        s = s.replace(/\[\[(.{2,1000}?)\]\](\w{0,10})/g, "$1$2");
        link = s.replace(/(.{2,1000})\|.{0,2000}/, "$1");
        txt = s.replace(/.{2,1000}?\|/, "");
        if (txt === null && link.match(/\|$/)) {
          link = link.replace(/\|$/, "");
          txt = link;
        }
      }
      if (link.match(ignore_links)) {
        return s;
      }
      let obj = {
        page: link,
        raw
      };
      obj.page = obj.page.replace(/#(.*)/, (a, b) => {
        obj.anchor = b;
        return "";
      });
      obj = parseInterwiki(obj);
      if (obj.wiki) {
        obj.type = "interwiki";
      }
      if (txt !== null && txt !== obj.page) {
        obj.text = txt;
      }
      if (suffix) {
        obj.text = obj.text || obj.page;
        obj.text += suffix.trim();
      }
      if (obj.page && /^[A-Z]/.test(obj.page) === false) {
        if (!obj.text) {
          obj.text = obj.page;
        }
      }
      if (obj.text && obj.text.startsWith(":")) {
        obj.text = obj.text.replace(/^:/, "");
      }
      links.push(obj);
      return s;
    });
    return links;
  };
  const parse_links = function(str) {
    let links = [];
    links = external_links(links, str);
    links = internal_links(links, str);
    if (links.length === 0) {
      return void 0;
    }
    return links;
  };

  const REDIRECT_REGEX = new RegExp("^[ \n	]*?#(" + redirects.join("|") + ") *?(\\[\\[.{2,180}?\\]\\])", "i");
  const isRedirect = function(wiki) {
    if (!wiki) {
      return false;
    }
    return REDIRECT_REGEX.test(wiki);
  };
  const parse = function(wiki) {
    let m = wiki.match(REDIRECT_REGEX);
    if (m && m[2]) {
      let links = parse_links(m[2]) || [];
      return links[0];
    }
    return {};
  };

  const ignore$1 = [
    "table",
    "code",
    "score",
    "data",
    "categorytree",
    "charinsert",
    "hiero",
    "imagemap",
    "inputbox",
    "references",
    "source",
    "syntaxhighlight",
    "timeline",
    "maplink"
  ];
  const openTag = `< ?(${ignore$1.join("|")}) ?[^>]{0,200}>`;
  const closeTag = `< ?/ ?(${ignore$1.join("|")}) ?>`;
  const anyChar = "\\s\\S";
  const noThanks = new RegExp(`${openTag}[${anyChar}]{1,40000}?${closeTag}`, "gi");
  const kill_xml = function(wiki) {
    wiki = wiki.replace(noThanks, " ");
    wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=%.\-#:;'" ]{2,100}\/? ?> ?/g, " ");
    wiki = wiki.replace(/ ?< ?(ref) [a-zA-Z0-9=" ]{2,100}\/ ?> ?/g, " ");
    wiki = wiki.replace(/<i>(.*?)<\/i>/g, `''$1''`);
    wiki = wiki.replace(/<b>(.*?)<\/b>/g, `'''$1'''`);
    wiki = wiki.replace(/<sub>(.*?)<\/sub>/g, `{{sub|$1}}`);
    wiki = wiki.replace(/<sup>(.*?)<\/sup>/g, `{{sup|$1}}`);
    wiki = wiki.replace(/<blockquote>(.*?)<\/blockquote>/g, `{{blockquote|text=$1}}`);
    wiki = wiki.replace(/ ?<[ /]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr|u)[ /]?> ?/g, " ");
    wiki = wiki.replace(/ ?<[ /]?(abbr|bdi|bdo|cite|del|dfn|em|ins|kbd|mark|q|s|small)[ /]?> ?/g, " ");
    wiki = wiki.replace(/ ?<[ /]?h[0-9][ /]?> ?/g, " ");
    wiki = wiki.replace(/ ?< ?br ?\/> ?/g, "\n");
    return wiki.trim();
  };

  function preProcess(wiki) {
    wiki = wiki.replace(/<!--[\s\S]{0,3000}?-->/g, "");
    wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, "");
    wiki = wiki.replace(/~{2,3}/g, "");
    wiki = wiki.replace(/\r/g, "");
    wiki = wiki.replace(/\u3002/g, ". ");
    wiki = wiki.replace(/----/g, "");
    wiki = wiki.replace(/\{\{\}\}/g, " \u2013 ");
    wiki = wiki.replace(/\{\{\\\}\}/g, " / ");
    wiki = wiki.replace(/&nbsp;/g, " ");
    wiki = wiki.replace(/&ndash;/g, "\u2013");
    wiki = wiki.replace(/&mdash;/g, "\u2014");
    wiki = wiki.replace(/&amp;/g, "&");
    wiki = wiki.replace(/&quot;/g, '"');
    wiki = wiki.replace(/&apos;/g, "'");
    wiki = wiki.replace(/&copy;/g, "\xA9");
    wiki = wiki.replace(/&reg;/g, "\xAE");
    wiki = wiki.replace(/&trade;/g, "\u2122");
    wiki = kill_xml(wiki);
    wiki = wiki.replace(/\([,;: ]+\)/g, "");
    wiki = wiki.replace(/\{\{(baseball|basketball) (primary|secondary) (style|color).*?\}\}/gi, "");
    return wiki;
  }

  const specialChar = /[\\.$]/;
  const encodeStr = function(str) {
    if (typeof str !== "string") {
      str = "";
    }
    str = str.replace(/\\/g, "\\\\");
    str = str.replace(/^\$/, "\\u0024");
    str = str.replace(/\./g, "\\u002e");
    return str;
  };
  const encodeObj = function(obj = {}) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      if (specialChar.test(keys[i]) === true) {
        let str = encodeStr(keys[i]);
        if (str !== keys[i]) {
          obj[str] = obj[keys[i]];
          delete obj[keys[i]];
        }
      }
    }
    return obj;
  };

  const defaults$9 = {
    headers: true,
    depth: true,
    paragraphs: true,
    images: true,
    tables: true,
    templates: true,
    infoboxes: true,
    lists: true,
    references: true
  };
  const toJSON$1 = function(section, options) {
    options = setDefaults(options, defaults$9);
    let data = {};
    if (options.headers === true) {
      data.title = section.title();
    }
    if (options.depth === true) {
      data.depth = section.depth();
    }
    if (options.paragraphs === true) {
      let paragraphs = section.paragraphs().map((p) => p.json(options));
      if (paragraphs.length > 0) {
        data.paragraphs = paragraphs;
      }
    }
    if (options.images === true) {
      let images = section.images().map((img) => img.json(options));
      if (images.length > 0) {
        data.images = images;
      }
    }
    if (options.tables === true) {
      let tables = section.tables().map((t) => t.json(options));
      if (tables.length > 0) {
        data.tables = tables;
      }
    }
    if (options.templates === true) {
      let templates = section.templates().map((tmpl) => tmpl.json());
      if (templates.length > 0) {
        data.templates = templates;
        if (options.encode === true) {
          data.templates.forEach((t) => encodeObj(t));
        }
      }
    }
    if (options.infoboxes === true) {
      let infoboxes = section.infoboxes().map((i) => i.json(options));
      if (infoboxes.length > 0) {
        data.infoboxes = infoboxes;
      }
    }
    if (options.lists === true) {
      let lists = section.lists().map((list) => list.json(options));
      if (lists.length > 0) {
        data.lists = lists;
      }
    }
    if (options.references === true || options.citations === true) {
      let references = section.references().map((ref) => ref.json(options));
      if (references.length > 0) {
        data.references = references;
      }
    }
    if (options.sentences === true) {
      data.sentences = section.sentences().map((s) => s.json(options));
    }
    return data;
  };

  const defaults$8 = {
    type: "internal"
  };
  class Link {
    constructor(data) {
      data = data || {};
      data = Object.assign({}, defaults$8, data);
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: data
      });
    }
    text(str) {
      if (str !== void 0) {
        this.data.text = str;
      }
      let txt = this.data.text || this.data.page || "";
      txt = txt.replace(/'{2,}/g, "");
      return txt;
    }
    json() {
      let obj = {};
      if (this.data.text !== void 0) {
        obj.text = this.data.text;
      }
      obj.type = this.type();
      if (obj.type === "internal") {
        obj.page = this.page();
      } else if (obj.type === "interwiki") {
        obj.wiki = this.wiki();
        obj.page = this.page();
      } else {
        obj.site = this.site();
      }
      let anchor = this.anchor();
      if (anchor) {
        obj.anchor = anchor;
      }
      return obj;
    }
    wikitext() {
      let txt = this.data.raw || "";
      return txt;
    }
    page(str) {
      if (str !== void 0) {
        this.data.page = str;
      }
      return this.data.page;
    }
    anchor(str) {
      if (str !== void 0) {
        this.data.anchor = str;
      }
      return this.data.anchor || "";
    }
    wiki(str) {
      if (str !== void 0) {
        this.data.wiki = str;
      }
      return this.data.wiki;
    }
    type(str) {
      if (str !== void 0) {
        this.data.type = str;
      }
      return this.data.type;
    }
    site(str) {
      if (str !== void 0) {
        this.data.site = str;
      }
      return this.data.site;
    }
    //create a url for any type of link
    href() {
      let type = this.type();
      if (type === "external") {
        return this.site();
      }
      let page = this.page();
      page = page.replace(/ /g, "_");
      page = encodeURIComponent(page);
      let url = "";
      if (type === "interwiki") {
        let wiki = this.wiki();
        url = "https://en.wikipedia.org/wiki/$1";
        if (wikis.hasOwnProperty(wiki)) {
          url = "http://" + wikis[this.wiki()];
        }
        url = url.replace(/\$1/g, page);
      } else {
        url = `./${this.page()}`;
      }
      if (this.anchor()) {
        url += "#" + this.anchor();
      }
      return url;
    }
  }

  const removeLinks = function(line) {
    line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+)\]\](\w{0,5})/g, "$1");
    return line;
  };
  const getLinks = function(data) {
    let wiki = data.text;
    let links = parse_links(wiki) || [];
    data.links = links.map((link) => {
      wiki = wiki.replace(link.raw, link.text || link.page || "");
      return new Link(link);
    });
    wiki = removeLinks(wiki);
    data.text = wiki;
  };

  const formatting = function(obj) {
    let bolds = [];
    let italics = [];
    let wiki = obj.text || "";
    wiki = wiki.replace(/'''''(.{0,2500}?)'''''/g, (a, b) => {
      bolds.push(b);
      italics.push(b);
      return b;
    });
    wiki = wiki.replace(/''''(.{0,2500}?)''''/g, (a, b) => {
      bolds.push(`'${b}'`);
      return `'${b}'`;
    });
    wiki = wiki.replace(/'''(.{0,2500}?)'''/g, (a, b) => {
      bolds.push(b);
      return b;
    });
    wiki = wiki.replace(/''(.{0,2500}?)''/g, (a, b) => {
      italics.push(b);
      return b;
    });
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

  const isNumber = /^-?[0-9,.]+$/;
  const defaults$7 = {
    text: true,
    links: true,
    formatting: true,
    numbers: true
  };
  const toJSON = function(s, options) {
    options = setDefaults(options, defaults$7);
    let data = {};
    let text = s.text();
    if (options.text === true) {
      data.text = text;
    }
    if (options.numbers === true && isNumber.test(text)) {
      let num = Number(text.replace(/,/g, ""));
      if (isNaN(num) === false) {
        data.number = num;
      }
    }
    if (options.links && s.links().length > 0) {
      data.links = s.links().map((l) => l.json());
    }
    if (options.formatting && s.data.fmt) {
      data.formatting = s.data.fmt;
    }
    return data;
  };

  class Sentence {
    constructor(data = {}) {
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: data
      });
    }
    links(n) {
      let arr = this.data.links || [];
      if (typeof n === "string") {
        n = n.charAt(0).toUpperCase() + n.substring(1);
        let link = arr.find((o) => o.page === n);
        return link === void 0 ? [] : [link];
      }
      return arr;
    }
    link(clue) {
      let arr = this.links(clue);
      if (typeof clue === "number") {
        return arr[clue] || null;
      }
      return arr[0] || null;
    }
    interwiki() {
      return this.links().filter((l) => l.type() === "interwiki");
    }
    bolds(clue) {
      if (this.data && this.data.fmt && this.data.fmt.bold) {
        return this.data.fmt.bold || [];
      }
      return [];
    }
    bold(clue) {
      let arr = this.bolds(clue);
      if (typeof clue === "number") {
        return arr[clue] || null;
      }
      return arr[0] || null;
    }
    italics(clue) {
      if (this.data && this.data.fmt && this.data.fmt.italic) {
        return this.data.fmt.italic || [];
      }
      return [];
    }
    italic(clue) {
      let arr = this.italics(clue);
      if (typeof clue === "number") {
        return arr[clue] || null;
      }
      return arr[0] || null;
    }
    text(str) {
      if (str !== void 0 && typeof str === "string") {
        this.data.text = str;
      }
      return this.data.text || "";
    }
    plaintext(str) {
      return this.text(str);
    }
    json(options) {
      return toJSON(this, options);
    }
    wikitext() {
      return this.data.wiki || "";
    }
    isEmpty() {
      return this.data.text === "";
    }
  }

  var literalAbbreviations = [
    "ad",
    "adj",
    "adm",
    "adv",
    "al",
    "alta",
    "approx",
    "apr",
    "apt",
    "arc",
    "ariz",
    "assn",
    "asst",
    "atty",
    "aug",
    "ave",
    "ba",
    "bc",
    "bl",
    "bldg",
    "blvd",
    "brig",
    "bros",
    "ca",
    "cal",
    "calif",
    "capt",
    "cca",
    "cg",
    "cl",
    "cm",
    "cmdr",
    "co",
    "col",
    "colo",
    "comdr",
    "conn",
    "corp",
    "cpl",
    "cres",
    "ct",
    "cyn",
    "dak",
    "dec",
    "def",
    "dept",
    "det",
    "dg",
    "dist",
    "dl",
    "dm",
    "dr",
    "ea",
    "eg",
    "eng",
    "esp",
    "esq",
    "est",
    "etc",
    "ex",
    "exp",
    "feb",
    "fem",
    "fig",
    "fl oz",
    "fl",
    "fla",
    "fm",
    "fr",
    "ft",
    "fy",
    "ga",
    "gal",
    "gb",
    "gen",
    "gov",
    "hg",
    "hon",
    "hr",
    "hrs",
    "hwy",
    "hz",
    "ia",
    "ida",
    "ie",
    "inc",
    "inf",
    "jan",
    "jd",
    "jr",
    "jul",
    "jun",
    "kan",
    "kans",
    "kb",
    "kg",
    "km",
    "kmph",
    "lat",
    "lb",
    "lit",
    "llb",
    "lm",
    "lng",
    "lt",
    "ltd",
    "lx",
    "ma",
    "maj",
    "mar",
    "masc",
    "mb",
    "md",
    "messrs",
    "mg",
    "mi",
    "min",
    "minn",
    "misc",
    "mister",
    "ml",
    "mlle",
    "mm",
    "mme",
    "mph",
    "mps",
    "mr",
    "mrs",
    "ms",
    "mstr",
    "mt",
    "neb",
    "nebr",
    "nee",
    "no",
    "nov",
    "oct",
    "okla",
    "ont",
    "op",
    "ord",
    "oz",
    "pa",
    "pd",
    "penn",
    "penna",
    "phd",
    "pl",
    "pp",
    "pref",
    "prob",
    "prof",
    "pron",
    "ps",
    "psa",
    "pseud",
    "pt",
    "pvt",
    "qt",
    "que",
    "rb",
    "rd",
    "rep",
    "reps",
    "res",
    "rev",
    "sask",
    "sec",
    "sen",
    "sens",
    "sep",
    "sept",
    "sfc",
    "sgt",
    "sir",
    "situ",
    "sq ft",
    "sq",
    "sr",
    "ss",
    "st",
    "ste",
    "supt",
    "surg",
    "tb",
    "tbl",
    "tbsp",
    "tce",
    "td",
    "tel",
    "temp",
    "tenn",
    "tex",
    "tsp",
    "univ",
    "usafa",
    "ut",
    "va",
    "vb",
    "ver",
    "vet",
    "vitro",
    "vivo",
    "vol",
    "vs",
    "vt",
    "wis",
    "wisc",
    "wr",
    "wy",
    "wyo",
    "yb",
    "\xB5g"
  ];

  const abbreviations = literalAbbreviations.concat("[^]][^]]");
  const abbrev_reg = new RegExp("(^| |')(" + abbreviations.join("|") + `)[.!?] ?$`, "i");
  const acronym_reg = /[ .'][A-Z].? *$/i;
  const elipses_reg = /\.{3,} +$/;
  const circa_reg = / c\.\s$/;
  const hasWord = /\p{Letter}/iu;
  const flatten = function(arr) {
    let all = [];
    arr.forEach(function(a) {
      all = all.concat(a);
    });
    return all;
  };
  const naiive_split = function(text) {
    let splits = text.split(/(\n+)/);
    splits = splits.filter((s) => s.match(/\S/));
    splits = splits.map(function(str) {
      return str.split(/(\S.+?[.!?]"?)(?=\s|$)/g);
    });
    return flatten(splits);
  };
  const isBalanced = function(str) {
    str = str || "";
    const open = str.split(/\[\[/) || [];
    const closed = str.split(/\]\]/) || [];
    if (open.length > closed.length) {
      return false;
    }
    const quotes = str.match(/"/g);
    if (quotes && quotes.length % 2 !== 0 && str.length < 900) {
      return false;
    }
    const parens = str.match(/[()]/g);
    if (parens && parens.length % 2 !== 0 && str.length < 900) {
      return false;
    }
    return true;
  };
  const sentence_parser = function(text) {
    let sentences = [];
    let chunks = [];
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return sentences;
    }
    let splits = naiive_split(text);
    for (let i = 0; i < splits.length; i++) {
      let s = splits[i];
      if (!s || s === "") {
        continue;
      }
      if (!s.match(/\S/)) {
        if (chunks[chunks.length - 1]) {
          chunks[chunks.length - 1] += s;
          continue;
        } else if (splits[i + 1]) {
          splits[i + 1] = s + splits[i + 1];
          continue;
        }
      }
      chunks.push(s);
    }
    const isSentence = function(hmm) {
      if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg) || hmm.match(circa_reg)) {
        return false;
      }
      if (hasWord.test(hmm) === false) {
        return false;
      }
      if (!isBalanced(hmm)) {
        return false;
      }
      return true;
    };
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i + 1] && !isSentence(chunks[i])) {
        if (!/^\s/.test(chunks[i + 1]) && !/\s$/.test(chunks[i])) {
          chunks[i + 1] = chunks[i] + " " + chunks[i + 1];
        } else {
          chunks[i + 1] = chunks[i] + chunks[i + 1];
        }
      } else if (chunks[i] && chunks[i].length > 0) {
        sentences.push(chunks[i]);
        chunks[i] = "";
      }
    }
    if (sentences.length === 0) {
      return [text];
    }
    return sentences;
  };

  function postprocess(line) {
    line = line.replace(/\([,;: ]*\)/g, "");
    line = line.replace(/\( *(; ?)+/g, "(");
    line = trim_whitespace(line);
    line = line.replace(/ +\.$/, ".");
    return line;
  }
  function fromText(str) {
    let obj = {
      wiki: str,
      text: str
    };
    getLinks(obj);
    obj.text = postprocess(obj.text);
    obj = formatting(obj);
    return new Sentence(obj);
  }
  const byParagraph = function(paragraph) {
    let sentences = sentence_parser(paragraph.wiki);
    sentences = sentences.map(fromText);
    if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ":") {
      sentences = sentences.slice(1);
    }
    paragraph.sentences = sentences;
  };

  const cleanup$1 = function(lines) {
    lines = lines.filter((line) => {
      return line && /^\|\+/.test(line) !== true;
    });
    if (/^\{\|/.test(lines[0]) === true) {
      lines.shift();
    }
    if (/^\|\}/.test(lines[lines.length - 1]) === true) {
      lines.pop();
    }
    if (/^\|-/.test(lines[0]) === true) {
      lines.shift();
    }
    return lines;
  };
  const findRows = function(lines) {
    let rows = [];
    let row = [];
    lines = cleanup$1(lines);
    for (let i = 0; i < lines.length; i += 1) {
      let line = lines[i];
      if (/^\|-/.test(line) === true) {
        if (row.length > 0) {
          rows.push(row);
          row = [];
        }
      } else {
        let startChar = line.charAt(0);
        if (startChar === "|" || startChar === "!") {
          line = line.substring(1);
        }
        line = line.split(/(?:\|\||!!)/);
        if (startChar === "!") {
          line[0] = startChar + line[0];
        }
        line.forEach((l) => {
          l = l.trim();
          row.push(l);
        });
      }
    }
    if (row.length > 0) {
      rows.push(row);
    }
    return rows;
  };

  const getRowSpan = /.*rowspan *= *["']?([0-9]+)["']?[ |]*/;
  const getColSpan = /.*colspan *= *["']?([0-9]+)["']?[ |]*/;
  const doColSpan = function(rows) {
    rows.forEach((row) => {
      row.forEach((str, c) => {
        let m = str.match(getColSpan);
        if (m !== null) {
          let num = parseInt(m[1], 10);
          row[c] = str.replace(getColSpan, "");
          for (let i = 1; i < num; i += 1) {
            row.splice(c + 1, 0, "");
          }
        }
      });
    });
    rows = rows.filter((r) => r.length > 0);
    return rows;
  };
  const doRowSpan = function(rows) {
    rows.forEach((row, r) => {
      row.forEach((str, c) => {
        let m = str.match(getRowSpan);
        if (m !== null) {
          let num = parseInt(m[1], 10);
          str = str.replace(getRowSpan, "");
          row[c] = str;
          for (let i = r + 1; i < r + num; i += 1) {
            if (!rows[i]) {
              break;
            }
            rows[i].splice(c, 0, str);
          }
        }
      });
    });
    return rows;
  };
  const handleSpans = function(rows) {
    rows = doColSpan(rows);
    rows = doRowSpan(rows);
    return rows;
  };

  const isHeading = /^!/;
  const headings$1 = {
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
  };
  const cleanText = function(str) {
    str = fromText(str).text();
    if (str.match(/\|/)) {
      str = str.replace(/.*?\| ?/, "");
    }
    str = str.replace(/style=['"].*?["']/, "");
    str = str.replace(/^!/, "");
    str = str.trim();
    return str;
  };
  const skipSpanRow = function(row) {
    row = row || [];
    let len = row.length;
    let hasTxt = row.filter((str) => str).length;
    if (len - hasTxt > 3) {
      return true;
    }
    return false;
  };
  const removeMidSpans = function(rows) {
    rows = rows.filter((row) => {
      if (row.length === 1 && row[0] && isHeading.test(row[0]) && /rowspan/i.test(row[0]) === false) {
        return false;
      }
      return true;
    });
    return rows;
  };
  const findHeaders = function(rows = []) {
    let headers = [];
    if (skipSpanRow(rows[0])) {
      rows.shift();
    }
    let first = rows[0];
    if (first && first[0] && first[1] && (/^!/.test(first[0]) || /^!/.test(first[1]))) {
      headers = first.map((h) => {
        h = h.replace(/^! */, "");
        h = cleanText(h);
        return h;
      });
      rows.shift();
    }
    first = rows[0];
    if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
      first.forEach((h, i) => {
        h = h.replace(/^! */, "");
        h = cleanText(h);
        if (Boolean(h) === true) {
          headers[i] = h;
        }
      });
      rows.shift();
    }
    return headers;
  };
  const parseRow = function(arr, headers) {
    let row = {};
    arr.forEach((str, i) => {
      let h = headers[i] || "col" + (i + 1);
      let s = fromText(str);
      s.text(cleanText(s.text()));
      row[h] = s;
    });
    return row;
  };
  const firstRowHeader = function(rows) {
    if (rows.length <= 3) {
      return [];
    }
    let headers = rows[0].slice(0);
    headers = headers.map((h) => {
      h = h.replace(/^! */, "");
      h = fromText(h).text();
      h = cleanText(h);
      h = h.toLowerCase();
      return h;
    });
    for (let i = 0; i < headers.length; i += 1) {
      if (headings$1.hasOwnProperty(headers[i])) {
        rows.shift();
        return headers;
      }
    }
    return [];
  };
  const parseTable = function(wiki) {
    let lines = wiki.replace(/\r/g, "").replace(/\n(\s*[^|!{\s])/g, " $1").split(/\n/).map((l) => l.trim());
    let rows = findRows(lines);
    rows = rows.filter((r) => r);
    if (rows.length === 0) {
      return [];
    }
    rows = removeMidSpans(rows);
    rows = handleSpans(rows);
    let headers = findHeaders(rows);
    if (!headers || headers.length <= 1) {
      headers = firstRowHeader(rows);
      let want = rows[rows.length - 1] || [];
      if (headers.length <= 1 && want.length > 2) {
        headers = firstRowHeader(rows.slice(1));
        if (headers.length > 0) {
          rows = rows.slice(2);
        }
      }
    }
    let table = rows.map((arr) => {
      return parseRow(arr, headers);
    });
    return table;
  };

  const toJson$2 = function(tables, options) {
    return tables.map((table) => {
      let row = {};
      Object.keys(table).forEach((k) => {
        row[k] = table[k].json();
      });
      if (options.encode === true) {
        row = encodeObj(row);
      }
      return row;
    });
  };

  const defaults$6 = {};
  const normalize$1 = function(key = "") {
    key = key.toLowerCase();
    key = key.replace(/[_-]/g, " ");
    key = key.replace(/\(.*?\)/, "");
    key = key.trim();
    return key;
  };
  class Table {
    constructor(data, wiki = "") {
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: data
      });
      Object.defineProperty(this, "_wiki", {
        enumerable: false,
        value: wiki
      });
    }
    links(n) {
      let links = [];
      this.data.forEach((r) => {
        Object.keys(r).forEach((k) => {
          links = links.concat(r[k].links());
        });
      });
      if (typeof n === "string") {
        n = n.charAt(0).toUpperCase() + n.substring(1);
        let link = links.find((o) => o.page() === n);
        return link === void 0 ? [] : [link];
      }
      return links;
    }
    get(keys) {
      let have = this.data[0] || {};
      let mapping = Object.keys(have).reduce((h, k) => {
        h[normalize$1(k)] = k;
        return h;
      }, {});
      if (typeof keys === "string") {
        let key = normalize$1(keys);
        key = mapping[key] || key;
        return this.data.map((row) => {
          return row[key] ? row[key].text() : null;
        });
      }
      keys = keys.map(normalize$1).map((k) => mapping[k] || k);
      return this.data.map((row) => {
        return keys.reduce((h, k) => {
          if (row[k]) {
            h[k] = row[k].text();
          } else {
            h[k] = "";
          }
          return h;
        }, {});
      });
    }
    keyValue(options) {
      let rows = this.json(options);
      rows.forEach((row) => {
        Object.keys(row).forEach((k) => {
          row[k] = row[k].text;
        });
      });
      return rows;
    }
    keyvalue(options) {
      return this.keyValue(options);
    }
    keyval(options) {
      return this.keyValue(options);
    }
    json(options) {
      options = setDefaults(options, defaults$6);
      return toJson$2(this.data, options);
    }
    text() {
      return "";
    }
    wikitext() {
      return this._wiki || "";
    }
  }

  const openReg = /^\s*\{\|/;
  const closeReg = /^\s*\|\}/;
  const findTables = function(section) {
    let list = [];
    let wiki = section._wiki;
    let lines = wiki.split("\n");
    let stack = [];
    for (let i = 0; i < lines.length; i += 1) {
      if (openReg.test(lines[i]) === true) {
        stack.push(lines[i]);
        continue;
      }
      if (closeReg.test(lines[i]) === true) {
        stack[stack.length - 1] += "\n" + lines[i];
        let table = stack.pop();
        list.push(table);
        continue;
      }
      if (stack.length > 0) {
        stack[stack.length - 1] += "\n" + lines[i];
      }
    }
    let tables = [];
    list.forEach((str) => {
      if (str) {
        wiki = wiki.replace(str + "\n", "");
        wiki = wiki.replace(str, "");
        let data = parseTable(str);
        if (data && data.length > 0) {
          tables.push(new Table(data, str));
        }
      }
    });
    if (tables.length > 0) {
      section._tables = tables;
    }
    section._wiki = wiki;
  };

  const defaults$5 = {
    sentences: true
  };
  const toJson$1 = function(p, options) {
    options = setDefaults(options, defaults$5);
    let data = {};
    if (options.sentences === true) {
      data.sentences = p.sentences().map((s) => s.json(options));
    }
    return data;
  };

  const defaults$4 = {
    sentences: true,
    lists: true,
    images: true
  };
  const getNth$1 = function(arr, clue) {
    if (typeof clue === "number") {
      return arr[clue] || null;
    }
    return arr[0] || null;
  };
  class Paragraph {
    constructor(data) {
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: data
      });
    }
    sentences(clue) {
      return this.data.sentences || [];
    }
    sentence(clue) {
      return getNth$1(this.sentences(clue), clue);
    }
    references(clue) {
      return this.data.references || [];
    }
    reference(clue) {
      return getNth$1(this.references(clue), clue);
    }
    citations(clue) {
      return this.references(clue);
    }
    citation(clue) {
      return getNth$1(this.citations(clue), clue);
    }
    lists(clue) {
      return this.data.lists || [];
    }
    list(clue) {
      return getNth$1(this.lists(clue), clue);
    }
    images(clue) {
      return this.data.images || [];
    }
    image(clue) {
      return getNth$1(this.images(clue), clue);
    }
    links(clue) {
      let arr = [];
      this.sentences().forEach((s) => {
        arr = arr.concat(s.links(clue));
      });
      if (typeof clue === "string") {
        clue = clue.charAt(0).toUpperCase() + clue.substring(1);
        let link = arr.find((o) => o.page() === clue);
        return link === void 0 ? [] : [link];
      }
      return arr || [];
    }
    link(clue) {
      return getNth$1(this.links(clue), clue);
    }
    interwiki() {
      let arr = [];
      this.sentences().forEach((s) => {
        arr = arr.concat(s.interwiki());
      });
      return arr || [];
    }
    text(options) {
      options = setDefaults(options, defaults$4);
      let str = this.sentences().map((s) => s.text(options)).join(" ");
      this.lists().forEach((list) => {
        str += "\n" + list.text();
      });
      return str;
    }
    json(options) {
      options = setDefaults(options, defaults$4);
      return toJson$1(this, options);
    }
    wikitext() {
      return this.data.wiki;
    }
  }

  const strip = function(tmpl) {
    tmpl = tmpl.replace(/^\{\{/, "");
    tmpl = tmpl.replace(/\}\}$/, "");
    return tmpl;
  };

  const fmtName = function(name) {
    name = (name || "").trim();
    name = name.toLowerCase();
    name = name.replace(/_/g, " ");
    return name;
  };

  const pipeSplitter = function(tmpl) {
    let arr = tmpl.split(/\n?\|/);
    arr.forEach((a, i) => {
      if (a === null) {
        return;
      }
      if (i + 1 < arr.length && (/\[\[[^\]]+$/.test(a) || /\{\{[^}]+$/.test(a) || a.split("{{").length !== a.split("}}").length || a.split("[[").length !== a.split("]]").length)) {
        arr[i + 1] = arr[i] + "|" + arr[i + 1];
        arr[i] = null;
      }
    });
    arr = arr.filter((a) => a !== null);
    arr = arr.map((a) => (a || "").trim());
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      if (arr[i] === "") {
        arr.pop();
      } else {
        break;
      }
    }
    return arr;
  };

  const hasKey = /^[\p{Letter}0-9._/\- '()\t]+=/iu;
  const reserved = {
    template: true,
    list: true,
    prototype: true
  };
  const parseKey = function(str) {
    let parts = str.split("=");
    let key = parts[0] || "";
    key = key.toLowerCase().trim();
    let val = parts.slice(1).join("=");
    if (reserved.hasOwnProperty(key)) {
      key = "_" + key;
    }
    return {
      key,
      val: val.trim()
    };
  };
  const keyMaker = function(arr, order) {
    let keyIndex = 0;
    return arr.reduce((h, str = "") => {
      str = str.trim();
      if (hasKey.test(str) === true) {
        let res = parseKey(str);
        if (res.key) {
          if (h[res.key] && !res.val) {
            return h;
          }
          h[res.key] = res.val;
          return h;
        }
      }
      if (order && order[keyIndex]) {
        let key = order[keyIndex];
        h[key] = str;
      } else {
        h.list = h.list || [];
        h.list.push(str);
      }
      keyIndex += 1;
      return h;
    }, {});
  };

  const whoCares = {
    classname: true,
    style: true,
    align: true,
    margin: true,
    left: true,
    break: true,
    boxsize: true,
    framestyle: true,
    item_style: true,
    collapsible: true,
    list_style_type: true,
    "list-style-type": true,
    colwidth: true
  };
  const cleanup = function(obj) {
    Object.keys(obj).forEach((k) => {
      if (whoCares[k.toLowerCase()] === true) {
        delete obj[k];
      }
      if (obj[k] === null || obj[k] === "") {
        delete obj[k];
      }
    });
    return obj;
  };

  const makeFormat = function(str, fmt) {
    let s = fromText(str);
    if (fmt === "json") {
      return s.json();
    } else if (fmt === "raw") {
      return s;
    }
    return s.text();
  };
  const parser = function(tmpl, order = [], fmt) {
    tmpl = strip(tmpl || "");
    let arr = pipeSplitter(tmpl);
    let name = arr.shift();
    let obj = keyMaker(arr, order);
    obj = cleanup(obj);
    if (obj["1"] && order[0] && obj.hasOwnProperty(order[0]) === false) {
      obj[order[0]] = obj["1"];
      delete obj["1"];
    }
    Object.keys(obj).forEach((k) => {
      if (k === "list") {
        obj[k] = obj[k].map((v) => makeFormat(v, fmt));
        return;
      }
      obj[k] = makeFormat(obj[k], fmt);
    });
    if (name) {
      obj.template = fmtName(name);
    }
    return obj;
  };

  const opener = "[";
  const closer = "]";
  function nested_find(text) {
    let out = [];
    let last = [];
    const chars = text.split("");
    let open = 0;
    for (let i = 0; i < chars.length; i++) {
      const c = text[i];
      if (c === opener) {
        open += 1;
      } else if (c === closer) {
        open -= 1;
        if (open < 0) {
          open = 0;
        }
      } else if (last.length === 0) {
        continue;
      }
      last.push(c);
      if (open === 0 && last.length > 0) {
        let open_count = 0;
        let close_count = 0;
        for (let j = 0; j < last.length; j++) {
          if (last[j] === opener) {
            open_count++;
          } else if (last[j] === closer) {
            close_count++;
          }
        }
        if (open_count > close_count) {
          last.push(closer);
        }
        out.push(last.join(""));
        last = [];
      }
    }
    return out;
  }

  const isFile = new RegExp("(" + images.join("|") + "):", "i");
  let fileNames = `(${images.join("|")})`;
  const file_reg = new RegExp(fileNames + ":(.+?)[\\||\\]]", "iu");
  const linkToFile = /^\[\[:/;
  const imgLayouts = {
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
    super: true
  };
  const oneImage = function(img, doc) {
    let m = img.match(file_reg);
    if (m === null || !m[2]) {
      return null;
    }
    if (linkToFile.test(img)) {
      return null;
    }
    let file = `${m[1]}:${m[2] || ""}`;
    if (file) {
      let obj = {
        file,
        lang: doc._lang,
        domain: doc._domain,
        wiki: img,
        pluginData: {}
      };
      img = img.replace(/^\[\[/, "");
      img = img.replace(/\]\]$/, "");
      let imgData = parser(img);
      let arr = imgData.list || [];
      if (imgData.alt) {
        obj.alt = imgData.alt;
      }
      arr = arr.filter((str) => imgLayouts.hasOwnProperty(str) === false);
      if (arr[arr.length - 1]) {
        obj.caption = fromText(arr[arr.length - 1]);
      }
      return new Image(obj);
    }
    return null;
  };
  const parseImages = function(paragraph, doc) {
    let wiki = paragraph.wiki;
    let matches = nested_find(wiki);
    matches.forEach(function(s) {
      if (isFile.test(s) === true) {
        paragraph.images = paragraph.images || [];
        let img = oneImage(s, doc);
        if (img) {
          paragraph.images.push(img);
          wiki = wiki.replace(s, "");
        }
      }
    });
    paragraph.wiki = wiki;
  };

  const defaults$3 = {};
  const toText$1 = (list, options) => {
    return list.map((s) => {
      let str = s.text(options);
      return " * " + str;
    }).join("\n");
  };
  class List {
    constructor(data, wiki = "") {
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: data
      });
      Object.defineProperty(this, "wiki", {
        enumerable: false,
        value: wiki
      });
    }
    lines() {
      return this.data;
    }
    links(clue) {
      let links = [];
      this.lines().forEach((s) => {
        links = links.concat(s.links());
      });
      if (typeof clue === "string") {
        clue = clue.charAt(0).toUpperCase() + clue.substring(1);
        let link = links.find((o) => o.page() === clue);
        return link === void 0 ? [] : [link];
      }
      return links;
    }
    json(options) {
      options = setDefaults(options, defaults$3);
      return this.lines().map((s) => s.json(options));
    }
    text() {
      return toText$1(this.data);
    }
    wikitext() {
      return this.wiki || "";
    }
  }

  const list_reg = /^[#*:;|]+/;
  const bullet_reg = /^\*+[^:,|]{4}/;
  const number_reg = /^ ?#[^:,|]{4}/;
  const isList = function(line) {
    return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line);
  };
  const cleanList = function(list) {
    let number = 1;
    list = list.filter((l) => l);
    for (let i = 0; i < list.length; i++) {
      let line = list[i];
      if (line.match(number_reg)) {
        line = line.replace(/^ ?#*/, number + ") ");
        line = line + "\n";
        number += 1;
      } else if (line.match(list_reg)) {
        number = 1;
        line = line.replace(list_reg, "");
      }
      list[i] = fromText(line);
    }
    return list;
  };
  const grabList = function(lines, i) {
    let sub = [];
    for (let o = i; o < lines.length; o++) {
      if (isList(lines[o])) {
        sub.push(lines[o]);
      } else {
        break;
      }
    }
    sub = cleanList(sub);
    return sub;
  };
  const parseList = function(paragraph) {
    let wiki = paragraph.wiki;
    let lines = wiki.split(/\n/g);
    let lists = [];
    let theRest = [];
    for (let i = 0; i < lines.length; i++) {
      if (isList(lines[i])) {
        let sub = grabList(lines, i);
        if (sub.length > 0) {
          i += sub.length - 1;
          sub = sub.filter((s) => s.data.text !== "");
          lists.push(sub);
        }
      } else {
        theRest.push(lines[i]);
      }
    }
    paragraph.lists = lists.map((l) => new List(l, wiki));
    paragraph.wiki = theRest.join("\n");
  };

  const twoNewLines = /\r?\n\r?\n/;
  const parseParagraphs = function(section, doc) {
    let wiki = section._wiki;
    let paragraphs = wiki.split(twoNewLines);
    paragraphs = paragraphs.filter((p) => p && p.trim().length > 0);
    paragraphs = paragraphs.map((str) => {
      let paragraph = {
        wiki: str,
        lists: [],
        sentences: [],
        images: []
      };
      parseList(paragraph);
      parseImages(paragraph, doc);
      byParagraph(paragraph);
      return new Paragraph(paragraph);
    });
    section._wiki = wiki;
    section._paragraphs = paragraphs;
  };

  const open = "{";
  const close = "}";
  const findFlat = function(wiki) {
    let depth = 0;
    let list = [];
    let carry = [];
    for (let i = wiki.indexOf(open); i !== -1 && i < wiki.length; depth > 0 ? i++ : i = wiki.indexOf(open, i + 1)) {
      let c = wiki[i];
      if (c === open) {
        depth += 1;
      }
      if (depth > 0) {
        if (c === close) {
          depth -= 1;
          if (depth === 0) {
            carry.push(c);
            let tmpl = carry.join("");
            carry = [];
            if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
              list.push(tmpl);
            }
            continue;
          }
        }
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

  const getName = function(tmpl) {
    let name = null;
    if (/^\{\{[^\n]+\|/.test(tmpl)) {
      name = (tmpl.match(/^\{\{(.+?)\|/) || [])[1];
    } else if (tmpl.indexOf("\n") !== -1) {
      name = (tmpl.match(/^\{\{(.+)\n/) || [])[1];
    } else {
      name = (tmpl.match(/^\{\{(.+?)\}\}$/) || [])[1];
    }
    if (name) {
      name = name.replace(/:.*/, "");
      name = fmtName(name);
    }
    return name || null;
  };

  const hasTemplate$1 = /\{\{/;
  const parseTemplate$1 = function(tmpl) {
    return {
      body: tmpl,
      name: getName(tmpl),
      children: []
    };
  };
  const doEach = function(obj) {
    let wiki = obj.body.substr(2);
    wiki = wiki.replace(/\}\}$/, "");
    obj.children = findFlat(wiki);
    obj.children = obj.children.map(parseTemplate$1);
    if (obj.children.length === 0) {
      return obj;
    }
    obj.children.forEach((ch) => {
      let inside = ch.body.substr(2);
      if (hasTemplate$1.test(inside)) {
        return doEach(ch);
      }
      return null;
    });
    return obj;
  };
  const findTemplates = function(wiki) {
    let list = findFlat(wiki);
    list = list.map(parseTemplate$1);
    list = list.map(doEach);
    return list;
  };

  const list = [
    //https://en.wikipedia.org/wiki/category:templates_with_no_visible_output
    "anchor",
    "defaultsort",
    "use list-defined references",
    "void",
    //https://en.wikipedia.org/wiki/Category:Protection_templates
    "pp",
    "pp-move-indef",
    "pp-semi-indef",
    "pp-vandalism",
    //out-of-scope still - https://en.wikipedia.org/wiki/Template:Tag
    "#tag",
    //https://en.wikipedia.org/wiki/Template:Navboxes
    // 'navboxes',
    // 'reflist',
    // 'ref-list',
    "div col",
    // 'authority control',
    //https://en.wikipedia.org/wiki/Template:End
    "pope list end",
    "shipwreck list end",
    "starbox end",
    "end box",
    "end",
    "s-end"
  ];
  const ignore = list.reduce((h, str) => {
    h[str] = true;
    return h;
  }, {});

  var infoboxes = {
    "gnf protein box": true,
    "automatic taxobox": true,
    "chembox ": true,
    editnotice: true,
    geobox: true,
    hybridbox: true,
    ichnobox: true,
    infraspeciesbox: true,
    mycomorphbox: true,
    oobox: true,
    "paraphyletic group": true,
    speciesbox: true,
    subspeciesbox: true,
    "starbox short": true,
    taxobox: true,
    nhlteamseason: true,
    "asian games bid": true,
    "canadian federal election results": true,
    "dc thomson comic strip": true,
    "daytona 24 races": true,
    edencharacter: true,
    "moldova national football team results": true,
    samurai: true,
    protein: true,
    "sheet authority": true,
    "order-of-approx": true,
    "bacterial labs": true,
    "medical resources": true,
    ordination: true,
    "hockey team coach": true,
    "hockey team gm": true,
    "pro hockey team": true,
    "hockey team player": true,
    "hockey team start": true,
    mlbbioret: true
  };

  const i18nReg = new RegExp("^(subst.)?(" + infoboxes$1.join("|") + ")(?=:| |\n|$)", "i");
  infoboxes$1.forEach((name) => {
    infoboxes[name] = true;
  });
  const startReg = /^infobox /i;
  const endReg = / infobox$/i;
  const yearIn = /^year in [A-Z]/i;
  const isInfobox = function(name) {
    if (infoboxes.hasOwnProperty(name) === true) {
      return true;
    }
    if (i18nReg.test(name)) {
      return true;
    }
    if (startReg.test(name) || endReg.test(name)) {
      return true;
    }
    if (yearIn.test(name)) {
      return true;
    }
    return false;
  };
  const fmtInfobox = function(obj = {}) {
    let m = obj.template.match(i18nReg);
    let type = obj.template;
    if (m && m[0]) {
      type = type.replace(m[0], "");
    }
    type = type.trim();
    let infobox = {
      template: "infobox",
      type,
      data: obj
    };
    delete infobox.data.template;
    delete infobox.data.list;
    return infobox;
  };

  let aliases = {
    imdb: "imdb name",
    "imdb episodes": "imdb episode",
    localday: "currentday",
    localdayname: "currentdayname",
    localyear: "currentyear",
    "birth date based on age at death": "birth based on age as of date",
    "bare anchored list": "anchored list",
    cvt: "convert",
    cricon: "flagicon",
    sfrac: "frac",
    sqrt: "radic",
    "unreferenced section": "unreferenced",
    redir: "redirect",
    sisterlinks: "sister project links",
    "main article": "main",
    by: "baseball year",
    aldsy: "alds year",
    nldsy: "nlds year",
    //not perfect..
    "str rep": "replace",
    ushr2: "ushr",
    stn: "station",
    metrod: "metro",
    fw: "ferry",
    rws: "stnlnk",
    sclass2: "sclass",
    under: "underline",
    brackets: "bracket",
    raise: "lower",
    "born-in": "born in",
    "c.": "circa",
    "r.": "reign",
    frac: "fraction",
    rdelim: "ldelim",
    abs: "pipe",
    "pp.": "p.",
    "iss.": "vol.",
    h2d: "hex2dec",
    wdl: "win draw lose"
  };
  let multi = {
    date: ["byline", "dateline"],
    //wikinews
    citation: ["cite", "source", "source-pr", "source-science"],
    "no spam": ["email", "@", "no spam blue"],
    "angle bracket": ["angbr", "infix", "angbr ipa"],
    "lrt station": ["lrt", "lrts"],
    "mrt station": ["mrt", "mrts"],
    flagcountry: ["cr", "cr-rt"],
    trunc: ["str left", "str crop"],
    percentage: ["pct", "percentage"],
    rnd: ["rndfrac", "rndnear"],
    abbr: ["tooltip", "abbrv", "define"],
    sfn: ["sfnref", "harvid", "harvnb"],
    "birth date and age": ["death date and age", "bda", "b-da"],
    currentmonth: ["localmonth", "currentmonthname", "currentmonthabbrev"],
    currency: ["monnaie", "unit\xE9", "nombre", "nb", "iso4217"],
    coord: ["coor", "coor title dms", "coor title dec", "coor dms", "coor dm", "coor dec"],
    "columns-list": ["cmn", "col-list", "columnslist", "collist"],
    nihongo: ["nihongo2", "nihongo3", "nihongo-s", "nihongo foot"],
    plainlist: ["flatlist", "plain list"],
    "winning percentage": ["winpct", "winperc"],
    "collapsible list": [
      "nblist",
      "nonbulleted list",
      "ubl",
      "ublist",
      "ubt",
      "unbullet",
      "unbulleted list",
      "unbulleted",
      "unbulletedlist",
      "vunblist"
    ],
    "election box begin": [
      "election box begin no change",
      "election box begin no party",
      "election box begin no party no change",
      "election box inline begin",
      "election box inline begin no change"
    ],
    "election box candidate": [
      "election box candidate for alliance",
      "election box candidate minor party",
      "election box candidate no party link no change",
      "election box candidate with party link",
      "election box candidate with party link coalition 1918",
      "election box candidate with party link no change",
      "election box inline candidate",
      "election box inline candidate no change",
      "election box inline candidate with party link",
      "election box inline candidate with party link no change",
      "election box inline incumbent"
    ],
    "4teambracket": [
      "2teambracket",
      "4team2elimbracket",
      "8teambracket",
      "16teambracket",
      "32teambracket",
      "4roundbracket-byes",
      "cwsbracket",
      "nhlbracket",
      "nhlbracket-reseed",
      "4teambracket-nhl",
      "4teambracket-ncaa",
      "4teambracket-mma",
      "4teambracket-mlb",
      "16teambracket-two-reseeds",
      "8teambracket-nhl",
      "8teambracket-mlb",
      "8teambracket-ncaa",
      "8teambracket-afc",
      "8teambracket-afl",
      "8teambracket-tennis3",
      "8teambracket-tennis5",
      "16teambracket-nhl",
      "16teambracket-nhl divisional",
      "16teambracket-nhl-reseed",
      "16teambracket-nba",
      "16teambracket-swtc",
      "16teambracket-afc",
      "16teambracket-tennis3",
      "16teambracket-tennis5"
    ],
    start: [
      "end",
      "birth",
      "death",
      "start date",
      "end date",
      "birth date",
      "birthdate",
      "death date",
      "start date and age",
      "end date and age",
      "dob"
    ],
    "start-date": [
      "end-date",
      "birth-date",
      "death-date",
      "birth-date and age",
      "birth-date and given age",
      "death-date and age",
      "death-date and given age"
    ],
    tl: [
      "lts",
      "t",
      "tfd links",
      "tiw",
      "tltt",
      "tetl",
      "tsetl",
      "ti",
      "tic",
      "tiw",
      "tlt",
      "ttl",
      "twlh",
      "tl2",
      "tlu",
      "demo",
      "xpd",
      "para",
      "elc",
      "xtag",
      "mli",
      "mlix",
      "url"
      //https://en.wikipedia.org/wiki/Template:URL
    ],
    // https://en.wikipedia.org/wiki/Template:Done/See_also
    done: [
      "resolved mark large",
      "implemented",
      "pimplemented",
      "resolved mark",
      "accepted",
      "agree",
      "approved",
      "checked2",
      "verified",
      "conditional yes",
      "confirmed",
      "confirmed-nc",
      "tallyho",
      "tick",
      "helped",
      "doneu|example",
      "edited2",
      "donetask",
      "unprod",
      "autp",
      "responded",
      "sure",
      "merge done",
      "marked",
      "pass",
      "aye",
      "yes check",
      "y&",
      "yeac",
      "yeag"
    ],
    xmark: [
      "expired",
      "deleted",
      "not done",
      "not done empty request",
      "not done unclear",
      "not done not likely",
      "stale-small",
      "smallrejected",
      "x mark",
      "nay",
      "no mark",
      "not done-t",
      "fail",
      "n&",
      "x mark-n",
      "xed box",
      "cancelled",
      "deleted-image",
      "already declined",
      "opblocked",
      "user-blocked",
      "notabug",
      "notfixed",
      "won't fix",
      "withdraw",
      "nojoy",
      "unrelated",
      "off-topic talk",
      "nayc",
      "nayg"
    ],
    checked: ["already done", "resolved1", "check mark-n", "checked box"],
    // https://en.wikipedia.org/wiki/Template:Ferry
    "station link": ["amtk", "cta", "bts", "mnrr", "mtams", "munis", "njts", "scax", "wmata", "rwsa"],
    "video game release": ["vgrelease", "video game release hlist", "vgrtbl", "vgrelease hlist", "vgrh"],
    aka: ["a.k.a.", "also known as"],
    "literal translation": ["lit", "literal", "literally"],
    "citation needed": [
      "are you sure?",
      "cb",
      "ciation needed",
      "cit",
      "cita requerida",
      "citaiton needed",
      "citation missing",
      "citation need",
      "citation requested",
      "citation required",
      "citation-needed",
      "citationeeded",
      "citationneeded",
      "citationrequired",
      "citazione necessaria",
      "cite missing",
      "cite needed",
      "cite source",
      "cite-needed",
      "citeneeded",
      "citesource",
      "citn",
      "cn needed",
      "cn",
      "ctn",
      "fact?",
      "fact",
      "facts",
      "fcitation needed",
      "me-fact",
      "need citation",
      "need sources",
      "need-ref",
      "needcitation",
      "needcite",
      "needs citation",
      "needs citations",
      "needs reference",
      "needs source",
      "needs-cite",
      "needsref",
      "no source given",
      "prov-statement",
      "prove it",
      "proveit",
      "ref needed",
      "ref-needed",
      "ref?",
      "reference necessary",
      "reference needed",
      "reference required",
      "refnec",
      "refneeded",
      "refplease",
      "request citation",
      "source needed",
      "source?",
      "sourceme",
      "uncited",
      "unreferenced inline",
      "unsourced-inline"
    ],
    "en dash": ["ndash", "nsndns"],
    "spaced en dash": ["spnd", "sndash", "spndash"],
    "spaced en dash space": ["snds", "spndsp", "sndashs", "spndashsp"],
    "zero width joiner em dash zero width non joiner": ["nsmdns", "nsmdashns", "nsemdashns", "mdashb"],
    color: ["colour", "colored text", "fgcolor"]
  };
  Object.keys(languages).forEach((lang) => {
    aliases["ipa-" + lang] = "ipa";
    aliases["ipac-" + lang] = "ipac";
  });
  Object.keys(multi).forEach((k) => {
    multi[k].forEach((str) => {
      aliases[str] = k;
    });
  });

  var hardcoded = {
    "\xB7": "\xB7",
    dot: "\xB7",
    middot: "\xB7",
    "\u2022": " \u2022 ",
    ",": ",",
    "=": "=",
    "1/2": "1\u20442",
    "1/3": "1\u20443",
    "2/3": "2\u20443",
    "1/4": "1\u20444",
    "3/4": "3\u20444",
    "\u2013": "\u2013",
    ndash: "\u2013",
    "en dash": "\u2013",
    "spaced ndash": " \u2013 ",
    "\u2014": "\u2014",
    mdash: "\u2014",
    spd: " \u2013 ",
    "em dash": "\u2014",
    "number sign": "#",
    "hash-tag": "#",
    ibeam: "I",
    "&": "&",
    ";": ";",
    ampersand: "&",
    dagger: "\u2020",
    "double-dagger": "\u2021",
    snds: " \u2013 ",
    snd: " \u2013 ",
    "^": " ",
    "!": "|",
    "'": `'`,
    "\\": " /",
    "`": "`",
    // bracket: '[',
    "[": "[",
    "*": "*",
    asterisk: "*",
    "long dash": "\u2014\u2014\u2014",
    clear: "\n\n",
    "h.": "\u1E25",
    profit: "\u25B2",
    // loss: '▼',
    // gain: '▲',
    ell: "\u2113",
    "1~": "~",
    "2~": "~~",
    "3~": "~~~",
    "4~": "~~~~",
    "5~": "~~~~~",
    // some emoji replacements
    goldmedal: "\u{1F947}",
    silvermedal: "\u{1F948}",
    bronzemedal: "\u{1F949}",
    done: "\u2705",
    xmark: "\u274C",
    checked: "\u2714\uFE0F",
    "thumbs up": "\u{1F44D}",
    "thumbs down": "\u{1F44E}",
    minusplus: "\u2213",
    plusminus: "\xB1",
    // 'hbeff début': '{|-\n',
    egiptekas: "{|-\n",
    langle: "\u27E8",
    rangle: "\u27E9",
    epsilon: "\u03B5",
    xi: "\u{1D709}",
    \u03A6: "\u03A6",
    phi: "\u{1D719}",
    varphi: "\u{1D711}",
    upsilon: "\u{1D710}",
    tau: "\u{1D70F}",
    varsigma: "\u{1D70D}",
    sigma: "\u{1D70E}",
    pi: "\u03C0",
    mu: "\u{1D707}",
    lambda: "\u{1D706}",
    kappa: "\u{1D718}",
    vartheta: "\u{1D717}",
    theta: "\u{1D703}",
    varepsilon: "\u{1D700}",
    gamma: "\u{1D6FE}",
    shy: "-",
    mdashb: "\u2014\u200C",
    "spaced en dash": " \u2013",
    "spaced en dash space": " \u2013 ",
    "zero width joiner em dash zero width non joiner": "\u2014\u200C",
    colon: ":",
    pipe: "|",
    "-?": "?",
    zwsp: " ",
    sp: " ",
    px2: " ",
    indent: "    ",
    nb5: "    ",
    ns: "    ",
    quad: "    ",
    spaces: "    ",
    in5: "     ",
    tombstone: "\u25FB",
    // increase: '▲',
    // decrease: '▼',
    "no.": "#",
    "thin space": " ",
    thinspace: " ",
    "very thin space": " ",
    "word joiner": " ",
    "figure space": " ",
    "zero width joiner": " ",
    "hair space": " ",
    "narrow no-break space": " ",
    "non breaking hyphen": "-",
    "!((": "[[",
    "))!": "]]",
    "(": "{",
    "((": "{{",
    "(((": "{{{",
    ")": "}",
    "))": "}}",
    ")))": "}}}",
    "(!": "{|",
    "!+": "|+",
    "!-": "|-",
    "!)": "|}",
    flat: "\u266D",
    sharp: "\u266F",
    lbf: "lbF",
    lbm: "lbm"
  };

  let templates$c = {
    p1: 0,
    p2: 1,
    p3: 2,
    resize: 1,
    //https://en.wikipedia.org/wiki/'Resize',
    lang: 1,
    "rtl-lang": 1,
    "line-height": 1,
    l: 2,
    h: 1,
    //https://en.wikipedia.org/wiki/'Hover_title',
    sort: 1,
    //https://en.wikipedia.org/wiki/'Sort',
    color: 1,
    "background color": 1
  };
  let zeros = [
    "defn",
    "lino",
    //https://en.wikipedia.org/wiki/'Linum',
    "finedetail",
    //https://en.wikipedia.org/wiki/'Finedetail',
    "nobold",
    "noitalic",
    "nocaps",
    "vanchor",
    //https://en.wikipedia.org/wiki/'Visible_anchor',
    "rnd",
    "date",
    //Explictly-set dates - https://en.wikipedia.org/wiki/'Date',
    "taste",
    "monthname",
    "baseball secondary style",
    "nowrap",
    "nobr",
    "big",
    "cquote",
    "pull quote",
    "smaller",
    "midsize",
    "larger",
    "big",
    "kbd",
    "bigger",
    "large",
    "mono",
    "strongbad",
    "stronggood",
    "huge",
    "xt",
    "xt2",
    "!xt",
    "xtn",
    "xtd",
    "dc",
    "dcr",
    "mxt",
    "!mxt",
    "mxtn",
    "mxtd",
    "bxt",
    "!bxt",
    "bxtn",
    "bxtd",
    "delink",
    //https://en.wikipedia.org/wiki/'Delink',
    "pre",
    "var",
    "mvar",
    "pre2",
    "code",
    "char",
    "angle bracket",
    "symb",
    "dabsearch",
    "key press",
    //needs work - https://en.m.wikipedia.org/wiki/'Key_press',
    // these should escape certain chars
    "nowiki",
    "nowiki2",
    "unstrip",
    "unstripnowiki",
    "plain text",
    "make code",
    "killmarkers",
    "longitem",
    "longlink",
    "strikethrough",
    "underline",
    "uuline",
    "not a typo",
    "text",
    "var serif",
    "double underline",
    "nee",
    "ne",
    "left",
    "right",
    "center",
    "centered",
    "justify",
    "smalldiv",
    "bold div",
    "monodiv",
    "italic div",
    "bigdiv",
    "strikethroughdiv",
    "strikethrough color",
    "pbpe",
    //pt
    "video game release/abbr",
    "nobel abbr",
    "gloss",
    "gcl",
    "overline",
    "underline",
    "overarc",
    "normal",
    "norm",
    "tmath",
    "vec",
    "subst",
    "highlight",
    "tq",
    "subst:nft",
    "subst:nwft",
    "subst:nfa"
  ];
  zeros.forEach((k) => {
    templates$c[k] = 0;
  });

  let templates$b = {};
  let arr = [
    // ships
    "mv",
    "m/v",
    "gts",
    "hsc",
    "ms",
    "m/s",
    "my",
    "m/y",
    "ps",
    "rms",
    "rv",
    "r/v",
    "sb",
    "ss",
    "s/s",
    "sv",
    "s/v",
    "sy",
    "s/y",
    "tss",
    "ans",
    "hmas",
    "hmbs",
    "bns",
    "hmcs",
    "ccgs",
    "arc",
    "hdms",
    "bae",
    "ens",
    "eml",
    "rfns",
    "fns",
    "hs",
    "sms",
    "smu",
    "gs",
    "icgv",
    "ins",
    "kri",
    "l\xE9",
    "jsub",
    "jds",
    "js",
    "hnlms",
    "hmnzs",
    "nns",
    "hnoms",
    "hmpngs",
    "bap",
    "rps",
    "brp",
    "orp",
    "nrp",
    "nms",
    "rss",
    "sas",
    "hmsas",
    "roks",
    "hswms",
    "htms",
    "tcg",
    "hms",
    "hmt",
    "rfaux",
    "usat",
    "uscgc",
    "usns",
    "usrc",
    "uss",
    "usav"
  ];
  arr.forEach((word) => {
    templates$b[word] = (tmpl) => {
      let { name, id } = parser(tmpl, ["name", "id"]);
      return id ? `[[${word.toUpperCase()} ${name} (${id})]]` : `[[${word.toUpperCase()} ${name}]]`;
    };
  });
  let links = ["no redirect", "tl-r", "template link no redirect", "redirect?", "subatomic particle", "auto link", "bl"];
  links.forEach((word) => {
    templates$b[word] = (tmpl) => {
      let data = parser(tmpl, ["page", "text"]);
      if (data.text && data.text !== data.page) {
        return `[[${data.page}|${data.text}]]`;
      }
      return `[[${data.page}]]`;
    };
  });

  const percentage = function(obj) {
    if (!obj.numerator && !obj.denominator) {
      return null;
    }
    let perc = Number(obj.numerator) / Number(obj.denominator);
    perc *= 100;
    Number(obj.decimals);
    return parseInt(String(perc), 10);
  };
  const toNumber = function(str = "") {
    if (typeof str === "number") {
      return str;
    }
    str = str.replace(/,/g, "");
    str = str.replace(/−/g, "-");
    let num = Number(str);
    if (isNaN(num)) {
      return str;
    }
    return num;
  };
  const getLang = function(name) {
    let lang = name.match(/ipac?-(.+)/);
    if (lang !== null) {
      return lang[1];
    }
    return null;
  };
  const titlecase = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  };
  const toOrdinal = function(i) {
    let j = i % 10;
    let k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  };
  const sisterProjects = {
    wikt: "wiktionary",
    commons: "commons",
    c: "commons",
    commonscat: "commonscat",
    n: "wikinews",
    q: "wikiquote",
    s: "wikisource",
    a: "wikiauthor",
    b: "wikibooks",
    voy: "wikivoyage",
    v: "wikiversity",
    d: "wikidata",
    species: "wikispecies",
    m: "meta",
    mw: "mediawiki"
  };

  var functions = {
    //https://en.wikipedia.org/wiki/Template:Ra
    ra: (tmpl) => {
      let obj = parser(tmpl, ["hours", "minutes", "seconds"]);
      return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(":");
    },
    //https://en.wikipedia.org/wiki/Template:Deg2HMS
    deg2hms: (tmpl) => {
      let obj = parser(tmpl, ["degrees"]);
      return (obj.degrees || "") + "\xB0";
    },
    hms2deg: (tmpl) => {
      let obj = parser(tmpl, ["hours", "minutes", "seconds"]);
      return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(":");
    },
    decdeg: (tmpl) => {
      let obj = parser(tmpl, ["deg", "min", "sec", "hem", "rnd"]);
      return (obj.deg || obj.degrees) + "\xB0";
    },
    //https://en.wikipedia.org/wiki/Template:Sortname
    sortname: (tmpl) => {
      let obj = parser(tmpl, ["first", "last", "target", "sort"]);
      let name = `${obj.first || ""} ${obj.last || ""}`;
      name = name.trim();
      if (obj.nolink) {
        return obj.target || name;
      }
      if (obj.dab) {
        name += ` (${obj.dab})`;
        if (obj.target) {
          obj.target += ` (${obj.dab})`;
        }
      }
      if (obj.target) {
        return `[[${obj.target}|${name}]]`;
      }
      return `[[${name}]]`;
    },
    // https://en.wikipedia.org/wiki/Template:First_word
    "first word": (tmpl) => {
      let obj = parser(tmpl, ["text"]);
      let str = obj.text || "";
      if (obj.sep) {
        return str.split(obj.sep)[0];
      }
      return str.split(" ")[0];
    },
    trunc: (tmpl) => {
      let obj = parser(tmpl, ["str", "len"]);
      return (obj.str || "").substr(0, obj.len);
    },
    "str mid": (tmpl) => {
      let obj = parser(tmpl, ["str", "start", "end"]) || {};
      let start = parseInt(obj.start, 10) - 1;
      let end = parseInt(obj.end, 10);
      return (obj.str || "").substr(start, end);
    },
    reign: (tmpl) => {
      let obj = parser(tmpl, ["start", "end"]);
      return `(r. ${obj.start} \u2013 ${obj.end})`;
    },
    // https://en.wikipedia.org/wiki/Template:Decade_link
    "decade link": (tmpl) => {
      let { year } = parser(tmpl, ["year"]);
      return `${year}|${year}s`;
    },
    // https://en.wikipedia.org/wiki/Template:Decade
    decade: (tmpl) => {
      let obj = parser(tmpl, ["year"]);
      let year = Number(obj.year);
      year = Math.floor(year / 10) * 10;
      return `${year}s`;
    },
    // https://en.wikipedia.org/wiki/Template:Century
    century: (tmpl) => {
      let obj = parser(tmpl, ["year"]);
      let year = parseInt(obj.year, 10);
      year = Math.floor(year / 100) + 1;
      return `${year}`;
    },
    //https://en.wikipedia.org/wiki/Template:Radic
    radic: (tmpl) => {
      let obj = parser(tmpl, ["after", "before"]);
      return `${obj.before || ""}\u221A${obj.after || ""}`;
    },
    "medical cases chart/row": (tmpl) => {
      return tmpl;
    },
    //https://en.wikipedia.org/wiki/Template:OldStyleDate
    oldstyledate: (tmpl) => {
      let obj = parser(tmpl, ["date", "year"]);
      return obj.year ? obj.date + " " + obj.year : obj.date;
    },
    //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
    braces: (tmpl) => {
      let obj = parser(tmpl, ["text"]);
      let attrs = "";
      if (obj.list) {
        attrs = "|" + obj.list.join("|");
      }
      return "{{" + (obj.text || "") + attrs + "}}";
    },
    hlist: (tmpl) => {
      let obj = parser(tmpl);
      obj.list = obj.list || [];
      return obj.list.join(" \xB7 ");
    },
    pagelist: (tmpl) => {
      let arr = parser(tmpl).list || [];
      return arr.join(", ");
    },
    // not perfect - https://en.m.wikipedia.org/wiki/Template:Interlinear
    interlinear: (tmpl) => {
      let arr = parser(tmpl).list || [];
      return arr.join("\n\n");
    },
    //actually rendering these links removes the text.
    //https://en.wikipedia.org/wiki/Template:Catlist
    catlist: (tmpl) => {
      let arr = parser(tmpl).list || [];
      return arr.join(", ");
    },
    //https://en.wikipedia.org/wiki/Template:Br_separated_entries
    "br separated entries": (tmpl) => {
      let arr = parser(tmpl).list || [];
      return arr.join("\n\n");
    },
    "comma separated entries": (tmpl) => {
      let arr = parser(tmpl).list || [];
      return arr.join(", ");
    },
    //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
    "anchored list": (tmpl) => {
      let arr = parser(tmpl).list || [];
      arr = arr.map((str, i) => `${i + 1}. ${str}`);
      return arr.join("\n\n");
    },
    "bulleted list": (tmpl) => {
      let arr = parser(tmpl).list || [];
      arr = arr.filter((f) => f);
      arr = arr.map((str) => "\u2022 " + str);
      return arr.join("\n\n");
    },
    //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
    plainlist: (tmpl) => {
      tmpl = strip(tmpl);
      let arr = tmpl.split("|").slice(1);
      arr = arr.join("|").split(/\n ?\* ?/);
      arr = arr.filter((s) => s);
      return arr.join("\n\n");
    },
    //https://en.wikipedia.org/wiki/Template:Term
    term: (tmpl) => {
      let obj = parser(tmpl, ["term"]);
      return `${obj.term}:`;
    },
    linum: (tmpl) => {
      let { num, text } = parser(tmpl, ["num", "text"]);
      return `${num}. ${text}`;
    },
    "block indent": (tmpl) => {
      let obj = parser(tmpl);
      if (obj["1"]) {
        return "\n" + obj["1"] + "\n";
      }
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:Lbs
    lbs: (tmpl) => {
      let obj = parser(tmpl, ["text"]);
      return `[[${obj.text} Lifeboat Station|${obj.text}]]`;
    },
    //Foo-class
    lbc: (tmpl) => {
      let obj = parser(tmpl, ["text"]);
      return `[[${obj.text}-class lifeboat|${obj.text}-class]]`;
    },
    lbb: (tmpl) => {
      let obj = parser(tmpl, ["text"]);
      return `[[${obj.text}-class lifeboat|${obj.text}]]`;
    },
    //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
    "#dateformat": (tmpl) => {
      tmpl = tmpl.replace(/:/, "|");
      let obj = parser(tmpl, ["date", "format"]);
      return obj.date;
    },
    //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
    lc: (tmpl) => {
      tmpl = tmpl.replace(/:/, "|");
      let obj = parser(tmpl, ["text"]);
      return (obj.text || "").toLowerCase();
    },
    //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
    uc: (tmpl) => {
      tmpl = tmpl.replace(/:/, "|");
      let obj = parser(tmpl, ["text"]);
      return (obj.text || "").toUpperCase();
    },
    lcfirst: (tmpl) => {
      tmpl = tmpl.replace(/:/, "|");
      let text = parser(tmpl, ["text"]).text;
      if (!text) {
        return "";
      }
      return text[0].toLowerCase() + text.substr(1);
    },
    ucfirst: (tmpl) => {
      tmpl = tmpl.replace(/:/, "|");
      let text = parser(tmpl, ["text"]).text;
      if (!text) {
        return "";
      }
      return text[0].toUpperCase() + text.substr(1);
    },
    padleft: (tmpl) => {
      tmpl = tmpl.replace(/:/, "|");
      let obj = parser(tmpl, ["text", "num"]);
      let text = obj.text || "";
      return text.padStart(obj.num, obj.str || "0");
    },
    padright: (tmpl) => {
      tmpl = tmpl.replace(/:/, "|");
      let obj = parser(tmpl, ["text", "num"]);
      let text = obj.text || "";
      return text.padEnd(obj.num, obj.str || "0");
    },
    //https://en.wikipedia.org/wiki/Template:Abbrlink
    abbrlink: (tmpl) => {
      let obj = parser(tmpl, ["abbr", "page"]);
      if (obj.page) {
        return `[[${obj.page}|${obj.abbr}]]`;
      }
      return `[[${obj.abbr}]]`;
    },
    // https://en.wikipedia.org/wiki/Template:Own
    own: (tmpl) => {
      let obj = parser(tmpl, ["author"]);
      let str = "Own work";
      if (obj.author) {
        str += " by " + obj.author;
      }
      return str;
    },
    //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
    formatnum: (tmpl) => {
      tmpl = tmpl.replace(/:/, "|");
      let obj = parser(tmpl, ["number"]);
      let str = obj.number || "";
      str = str.replace(/,/g, "");
      let num = Number(str);
      return num.toLocaleString() || "";
    },
    //https://en.wikipedia.org/wiki/Template:Frac
    fraction: (tmpl) => {
      let obj = parser(tmpl, ["a", "b", "c"]);
      if (obj.c) {
        return `${obj.a} ${obj.b}/${obj.c}`;
      }
      if (obj.b) {
        return `${obj.a}/${obj.b}`;
      }
      return `1/${obj.b}`;
    },
    //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
    convert: (tmpl) => {
      let obj = parser(tmpl, ["num", "two", "three", "four"]);
      if (obj.two === "-" || obj.two === "to" || obj.two === "and") {
        if (obj.four) {
          return `${obj.num} ${obj.two} ${obj.three} ${obj.four}`;
        }
        return `${obj.num} ${obj.two} ${obj.three}`;
      }
      return `${obj.num} ${obj.two}`;
    },
    // Large number of aliases - https://en.wikipedia.org/wiki/Template:Tl
    tl: (tmpl) => {
      let obj = parser(tmpl, ["first", "second"]);
      return obj.second || obj.first;
    },
    //this one's a little different
    won: (tmpl) => {
      let data = parser(tmpl, ["text"]);
      return data.place || data.text || titlecase(data.template);
    },
    //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
    tag: (tmpl) => {
      let obj = parser(tmpl, ["tag", "open"]);
      const ignore = {
        span: true,
        div: true,
        p: true
      };
      if (!obj.open || obj.open === "pair") {
        if (ignore[obj.tag]) {
          return obj.content || "";
        }
        return `<${obj.tag} ${obj.attribs || ""}>${obj.content || ""}</${obj.tag}>`;
      }
      return "";
    },
    //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
    plural: (tmpl) => {
      tmpl = tmpl.replace(/plural:/, "plural|");
      let obj = parser(tmpl, ["num", "word"]);
      let num = Number(obj.num);
      let word = obj.word;
      if (num !== 1) {
        if (/.y$/.test(word)) {
          word = word.replace(/y$/, "ies");
        } else {
          word += "s";
        }
      }
      return num + " " + word;
    },
    //https://en.wikipedia.org/wiki/Template:DEC
    dec: (tmpl) => {
      let obj = parser(tmpl, ["degrees", "minutes", "seconds"]);
      let str = (obj.degrees || 0) + "\xB0";
      if (obj.minutes) {
        str += obj.minutes + `\u2032`;
      }
      if (obj.seconds) {
        str += obj.seconds + "\u2033";
      }
      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Val
    val: (tmpl) => {
      let obj = parser(tmpl, ["number", "uncertainty"]);
      let num = obj.number;
      if (num && Number(num)) {
        num = Number(num).toLocaleString();
      }
      let str = num || "";
      if (obj.p) {
        str = obj.p + str;
      }
      if (obj.s) {
        str = obj.s + str;
      }
      if (obj.u || obj.ul || obj.upl) {
        str = str + " " + (obj.u || obj.ul || obj.upl);
      }
      return str;
    },
    //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
    percentage: (tmpl) => {
      let obj = parser(tmpl, ["numerator", "denominator", "decimals"]);
      let num = Number(obj.numerator) / Number(obj.denominator);
      num *= 100;
      if (isNaN(num)) {
        return "";
      }
      let dec = Number(obj.decimals) || 0;
      return `${num.toFixed(dec)}%`;
    },
    // this one is re-used by i18n
    small: (tmpl) => {
      let obj = parser(tmpl);
      if (obj.list && obj.list[0]) {
        return obj.list[0];
      }
      return "";
    },
    // {{Percent-done|done=N|total=N|digits=N}}
    "percent-done": (tmpl) => {
      let obj = parser(tmpl, ["done", "total", "digits"]);
      let num = percentage({
        numerator: obj.done,
        denominator: obj.total,
        decimals: obj.digits
      });
      if (num === null) {
        return "";
      }
      return `${obj.done} (${num}%) done`;
    },
    loop: (tmpl) => {
      let data = parser(tmpl, ["times", "text"]);
      let n = Number(data.times) || 0;
      let out = "";
      for (let i = 0; i < n; i += 1) {
        out += data.text || "";
      }
      return out;
    },
    "str len": (tmpl) => {
      let data = parser(tmpl, ["text"]);
      return String((data.text || "").trim().length);
    },
    digits: (tmpl) => {
      let data = parser(tmpl, ["text"]);
      return (data.text || "").replace(/[^0-9]/g, "");
    },
    resize: (tmpl) => {
      let { n, text } = parser(tmpl, ["n", "text"]);
      if (!text) {
        return n || "";
      }
      return text || "";
    },
    "last word": (tmpl) => {
      let data = parser(tmpl, ["text"]);
      let arr = (data.text || "").split(/ /g);
      return arr[arr.length - 1] || "";
    },
    replace: (tmpl) => {
      let data = parser(tmpl, ["text", "from", "to"]);
      if (!data.from || !data.to) {
        return data.text || "";
      }
      return (data.text || "").replace(data.from, data.to);
    },
    "title case": (tmpl) => {
      let data = parser(tmpl, ["text"]);
      let txt = data.text || "";
      return txt.split(/ /).map((w, i) => {
        if (i > 0 && w === "the" || w === "of") {
          return w;
        }
        return titlecase(w);
      }).join(" ");
    },
    "no spam": (tmpl) => {
      let data = parser(tmpl, ["account", "domain"]);
      return `${data.account || ""}@${data.domain}`;
    },
    "baseball year": (tmpl) => {
      let year = parser(tmpl, ["year"]).year || "";
      return `[[${year} in baseball|${year}]]`;
    },
    "mlb year": (tmpl) => {
      let year = parser(tmpl, ["year"]).year || "";
      return `[[${year} Major League Baseball season|${year}]]`;
    },
    "nlds year": (tmpl) => {
      let { year } = parser(tmpl, ["year"]);
      return `[[${year || ""} National League Division Series|${year}]]`;
    },
    "alds year": (tmpl) => {
      let { year } = parser(tmpl, ["year"]);
      return `[[${year || ""} American League Division Series|${year}]]`;
    },
    "nfl year": (tmpl) => {
      let { year, other } = parser(tmpl, ["year", "other"]);
      if (other && year) {
        return `[[${year} NFL season|${year}]]\u2013[[${other} NFL season|${other}]]`;
      }
      return `[[${year || ""} NFL season|${year}]]`;
    },
    "nfl playoff year": (tmpl) => {
      let { year } = parser(tmpl, ["year"]);
      year = Number(year);
      let after = year + 1;
      return `[[${year}\u2013${after} NFL playoffs|${year}]]`;
    },
    "nba year": (tmpl) => {
      let { year } = parser(tmpl, ["year"]);
      year = Number(year);
      let after = year + 1;
      return `[[${year}\u2013${after} NBA season|${year}\u2013${after}]]`;
    },
    "mhl year": (tmpl) => {
      let data = parser(tmpl, ["year"]);
      let year = Number(data.year);
      let after = year + 1;
      return `[[${year}\u2013${after} NHL season|${year}\u2013${after}]]`;
    },
    // some math
    min: (tmpl) => {
      let arr = parser(tmpl).list || [];
      let min = Number(arr[0]) || 0;
      arr.forEach((str) => {
        let n = Number(str);
        if (!isNaN(n) && n < min) {
          min = n;
        }
      });
      return String(min);
    },
    max: (tmpl) => {
      let arr = parser(tmpl).list || [];
      let max = Number(arr[0]) || 0;
      arr.forEach((str) => {
        let n = Number(str);
        if (!isNaN(n) && n > max) {
          max = n;
        }
      });
      return String(max);
    },
    // US-politics
    uspolabbr: (tmpl) => {
      let { party, state, house } = parser(tmpl, ["party", "state", "house", "link"]);
      if (!party || !state) {
        return "";
      }
      let out = `${party}\u2011${state}`;
      if (house) {
        out += ` ${toOrdinal(house)}`;
      }
      return out;
    },
    // https://en.wikipedia.org/wiki/Template:Ushr
    ushr: (tmpl) => {
      let { state, num, type } = parser(tmpl, ["state", "num", "type"]);
      let link = "";
      if (num === "AL") {
        link = `${state}'s at-large congressional district`;
      } else {
        num = toOrdinal(Number(num));
        return `${state}'s ${num} congressional district`;
      }
      if (type) {
        type = type.toLowerCase();
        num = num === "AL" ? "At-large" : num;
        if (type === "e") {
          return `[[${link}|${num}]]`;
        }
        if (type === "u") {
          return `[[${link}|${state}]]`;
        }
        if (type === "b" || type === "x") {
          return `[[${link}|${state} ${num}]]`;
        }
      }
      return `[[${link}]]`;
    },
    // transit station links
    metro: (tmpl) => {
      let { name, dab } = parser(tmpl, ["name", "dab"]);
      if (dab) {
        return `[[${name} station (${dab})|${name}]]`;
      }
      return `[[${name} station|${name}]]`;
    },
    station: (tmpl) => {
      let { name, dab } = parser(tmpl, ["name", "x", "dab"]);
      if (dab) {
        return `[[${name} station (${dab})|${name}]]`;
      }
      return `[[${name} station|${name}]]`;
    },
    bssrws: (tmpl) => {
      let { one, two } = parser(tmpl, ["one", "two"]);
      let name = one;
      if (two) {
        name += " " + two;
      }
      return `[[${name} railway station|${name}]]`;
    },
    stnlnk: (tmpl) => {
      let { name, dab } = parser(tmpl, ["name", "dab"]);
      if (dab) {
        return `[[${name} railway station (${dab})|${name}]]`;
      }
      return `[[${name} railway station|${name}]]`;
    },
    // https://en.wikipedia.org/wiki/Template:Station_link
    "station link": (tmpl) => {
      let { station, system } = parser(tmpl, ["system", "station"]);
      return station || system;
    },
    "line link": (tmpl) => {
      let { station, system } = parser(tmpl, ["system", "station"]);
      return station || system;
    },
    subway: (tmpl) => {
      let { name } = parser(tmpl, ["name"]);
      return `[[${name} subway station|${name}]]`;
    },
    "lrt station": (tmpl) => {
      let { name } = parser(tmpl, ["name"]);
      return `[[${name} LRT station|${name}]]`;
    },
    "mrt station": (tmpl) => {
      let { name } = parser(tmpl, ["name"]);
      return `[[${name} MRT station|${name}]]`;
    },
    rht: (tmpl) => {
      let { name } = parser(tmpl, ["name"]);
      return `[[${name} railway halt|${name}]]`;
    },
    ferry: (tmpl) => {
      let { name } = parser(tmpl, ["name"]);
      return `[[${name} ferry wharf|${name}]]`;
    },
    tram: (tmpl) => {
      let { name, dab } = parser(tmpl, ["name", "dab"]);
      if (dab) {
        return `[[${name} tram stop (${dab})|${name}]]`;
      }
      return `[[${name} tram stop|${name}]]`;
    },
    tstop: (tmpl) => {
      let { name, dab } = parser(tmpl, ["name", "dab"]);
      if (dab) {
        return `[[${name} ${dab} stop|${name}]]`;
      }
      return `[[${name} stop|${name}]]`;
    },
    // boats
    ship: (tmpl) => {
      let { prefix, name, id } = parser(tmpl, ["prefix", "name", "id"]);
      prefix = prefix || "";
      return id ? `[[${prefix.toUpperCase()} ${name}]]` : `[[${prefix.toUpperCase()} ${name}]]`;
    },
    sclass: (tmpl) => {
      let { cl, type } = parser(tmpl, ["cl", "type", "fmt"]);
      return `[[${cl}-class ${type} |''${cl}''-class]] [[${type}]]`;
    },
    "center block": (tmpl) => {
      let { text } = parser(tmpl, ["text"]);
      return text || "";
    },
    align: (tmpl) => {
      let { text } = parser(tmpl, ["dir", "text"]);
      return text || "";
    },
    font: (tmpl) => {
      let { text } = parser(tmpl, ["text"]);
      return text || "";
    },
    float: (tmpl) => {
      let { text, dir } = parser(tmpl, ["dir", "text"]);
      if (!text) {
        return dir || "";
      }
      return text;
    },
    lower: (tmpl) => {
      let { text, n } = parser(tmpl, ["n", "text"]);
      if (!text) {
        return n || "";
      }
      return text;
    },
    splitspan: (tmpl) => {
      let list = parser(tmpl).list || [];
      return (list[0] || "") + "\n" + (list[1] || "");
    },
    bracket: (tmpl) => {
      let { text } = parser(tmpl, ["text"]);
      if (text) {
        return `[${text}]`;
      }
      return "[";
    },
    // https://en.wikipedia.org/wiki/Template:In_title
    "in title": (tmpl) => {
      let { title, text } = parser(tmpl, ["title", "text"]);
      if (text) {
        return text;
      }
      if (title) {
        return `All pages with titles containing ${title}`;
      }
      return "";
    },
    "look from": (tmpl) => {
      let { title, text } = parser(tmpl, ["title", "text"]);
      if (text) {
        return text;
      }
      if (title) {
        return `All pages with titles beginning with ${title}`;
      }
      return "";
    },
    "literal translation": (tmpl) => {
      let arr = parser(tmpl).list || [];
      arr = arr.map((str) => `'${str}'`);
      return "lit. " + arr.join(" or ");
    },
    overset: (tmpl) => {
      let data = parser(tmpl, ["over", "base"]);
      return [data.over || "", data.base || ""].join(" ");
    },
    underset: (tmpl) => {
      let data = parser(tmpl, ["under", "base"]);
      return [data.base || "", data.under || ""].join(" ");
    },
    ceil: (tmpl) => {
      let data = parser(tmpl, ["txt"]);
      return `\u2308${data.txt}\u2309`;
    },
    floor: (tmpl) => {
      let data = parser(tmpl, ["txt"]);
      return `\u230A${data.txt}\u230B`;
    },
    "vol.": (tmpl) => {
      let data = parser(tmpl, ["n"]);
      return `vol. ${data.n}`;
    },
    rp: (tmpl) => {
      let data = parser(tmpl, ["page"]);
      if (data.pages) {
        return `pp${data.pages}`;
      }
      return `p. ${data.page || ""}`;
    },
    gaps: (tmpl) => {
      let data = parser(tmpl);
      return (data.list || []).join("  ");
    },
    bra: (tmpl) => {
      let data = parser(tmpl, ["a"]);
      return `\u27E8${data.a || ""}|`;
    },
    ket: (tmpl) => {
      let data = parser(tmpl, ["a"]);
      return `${data.a || ""}\u27E9`;
    },
    "angle bracket": (tmpl) => {
      let data = parser(tmpl, ["txt"]);
      return `\u27E8${data.txt || ""}\u27E9`;
    },
    "bra-ket": (tmpl) => {
      let data = parser(tmpl, ["a", "b"]);
      return `\u27E8${data.a || ""}|${data.b || ""}\u27E9`;
    },
    braket: (tmpl) => {
      let data = parser(tmpl, ["sym", "a", "b"]);
      if (data.sym === "bra") {
        return `\u27E8${data.a}|`;
      } else if (data.sym === "ket") {
        return `\u27E8|${data.a || ""}\u27E9`;
      } else {
        return `\u27E8${data.a || ""}|${data.b || ""}\u27E9`;
      }
    },
    pars: (tmpl) => {
      let data = parser(tmpl, ["text", "s"]);
      return `(${data.text || ""})`;
    },
    circumfix: (tmpl) => {
      let data = parser(tmpl, ["text"]);
      return `\u27E9${data.text || ""}\u27E8`;
    },
    fluc: (tmpl) => {
      let data = parser(tmpl, ["val", "type"]);
      let n = Number(data.val);
      if (data["custom label"]) {
        return data["custom label"];
      }
      if (n > 0) {
        return ` +${n}`;
      } else if (n < 0) {
        return ` ${n}`;
      } else if (n === 0) {
        return ` no change `;
      }
      return data.val || "";
    },
    "p.": (tmpl) => {
      let data = parser(tmpl, ["a", "b"]);
      if (data.b) {
        if (parseInt(data.b, 10)) {
          return `pp. ${data.a}\u2013${data.b}`;
        } else {
          return `pp. ${data.a}${data.b}`;
        }
      }
      return `p. ${data.a || ""}`;
    },
    subsup: (tmpl) => {
      let data = parser(tmpl, ["symbol", "subscript", "superscript"]);
      return `${data.symbol || ""} ${data.subscript || ""} ${data.superscript || ""}`;
    },
    su: (tmpl) => {
      let data = parser(tmpl, ["p", "b"]);
      return `${data.p || ""} ${data.b || ""}`;
    },
    precision: (tmpl) => {
      let data = parser(tmpl, ["num"]);
      let num = data.num || "";
      if (!num.match(/\./) && num.match(/0*$/) && num !== "0") {
        return num.match(/0*$/)[0].length * -1;
      }
      let dec = num.split(/\./)[1] || "";
      return dec.length;
    },
    intmath: (tmpl) => {
      let data = parser(tmpl, ["sign", "subscript", "superscript"]);
      const signs = {
        int: "\u222B",
        iint: "\u222C",
        iiint: "\u222D",
        oint: "\u222E",
        varointclockwise: "\u2232",
        ointctrclockwise: "\u2233",
        oiint: "\u222F",
        oiiint: "\u2230"
      };
      return `${signs[data.sign] || ""} ${data.superscript || ""} ${data.subscript || ""} `;
    },
    ldelim: (tmpl) => {
      let data = parser(tmpl, ["a", "b", "sub", "sup"]);
      let after = `${data.sub || ""}${data.sup || ""}`;
      if (data.a === "square") {
        return `[${data.b || ""}]${after}`;
      } else if (data.a === "round") {
        return `(${data.b || ""})${after}`;
      } else if (data.a === "vert") {
        return `|${data.b || ""}|${after}`;
      } else if (data.a === "doublevert") {
        return `||${data.b || ""}||${after}`;
      }
      return `${data.b || ""} ${after}`;
    },
    multiply: (tmpl) => {
      let data = parser(tmpl, ["a", "b"]);
      return Number(data.a) * Number(data.b);
    },
    sum: (tmpl) => {
      let data = parser(tmpl, ["a", "b"]);
      return Number(data.a) + Number(data.b);
    },
    round: (tmpl) => {
      let data = parser(tmpl, ["val", "decimals"]);
      let n = Number(data.val);
      return Math.round(n) || "";
    },
    rounddown: (tmpl) => {
      let data = parser(tmpl, ["val", "decimals"]);
      let n = Number(data.val);
      return Math.floor(n) || "";
    },
    roundup: (tmpl) => {
      let data = parser(tmpl, ["val", "decimals"]);
      let n = Number(data.val);
      return Math.ceil(n) || "";
    },
    parity: (tmpl) => {
      let data = parser(tmpl, ["val", "even", "odd"]);
      if (Number(data.val) % 2 === 0) {
        return data.even || "even";
      }
      return data.odd || "odd";
    },
    hexadecimal: (tmpl) => {
      let data = parser(tmpl, ["val"]);
      let n = Number(data.val);
      if (!n) {
        return data.val;
      }
      return n.toString(16).toUpperCase();
    },
    octal: (tmpl) => {
      let data = parser(tmpl, ["val"]);
      let n = Number(data.val);
      if (!n) {
        return data.val;
      }
      return n.toString(8).toUpperCase() + "\u2088";
    },
    decimal2base: (tmpl) => {
      let data = parser(tmpl, ["n", "radix"]);
      let n = Number(data.n);
      let radix = Number(data.radix);
      if (!n || !radix) {
        return data.n;
      }
      return n.toString(radix).toUpperCase();
    },
    hex2dec: (tmpl) => {
      let data = parser(tmpl, ["val"]);
      return parseInt(data.val, 16) || data.val;
    },
    ifnotempty: (tmpl) => {
      let data = parser(tmpl, ["cond", "a", "b"]);
      if (data.cond) {
        return data.a;
      }
      return data.b;
    },
    both: (tmpl) => {
      let data = parser(tmpl, ["a", "b"]);
      if (data.a && data.b) {
        return "1";
      }
      return "";
    },
    ifnumber: (tmpl) => {
      let data = parser(tmpl, ["n", "yes", "no"]);
      if (!isNaN(Number(data.n))) {
        return data.yes || "1";
      }
      return data.no || "";
    },
    "order of magnitude": (tmpl) => {
      let data = parser(tmpl, ["val"]);
      let num = parseInt(data.val, 10);
      if (num || num === 0) {
        return String(num).length - 1;
      }
      return "0";
    },
    "percent and number": (tmpl) => {
      let data = parser(tmpl, ["number", "total", "decimals"]);
      let n = Number(data.number) / Number(data.total);
      n *= 100;
      let dec = Number(data.decimals) || 0;
      return `${n.toFixed(dec)}% (${Number(data.number).toLocaleString()})`;
    },
    music: (tmpl) => {
      let data = parser(tmpl, ["glyph"]);
      let glyphs = {
        flat: "\u266D",
        b: "\u266D",
        sharp: "\u266F",
        "#": "\u266F",
        natural: "\u266E",
        n: "\u266E",
        doubleflat: "\u{1D12B}",
        bb: "\u{1D12B}",
        "##": "\u{1D12A}",
        doublesharp: "\u{1D12A}",
        quarternote: "\u2669",
        quarter: "\u2669",
        treble: "\u{1D11E}",
        trebleclef: "\u{1D11E}",
        bass: "\u{1D122}",
        bassclef: "\u{1D122}",
        altoclef: "\u{1D121}",
        alto: "\u{1D121}",
        tenor: "\u{1D121}",
        tenorclef: "\u{1D121}"
      };
      if (glyphs.hasOwnProperty(data.glyph)) {
        return glyphs[data.glyph];
      }
      return "";
    },
    simplenuclide: (tmpl) => {
      let data = parser(tmpl, ["name", "mass"]);
      return `[[${data.name}|${data.mass || ""}${data.name}]]`;
    },
    "font color": (tmpl) => {
      let data = parser(tmpl, ["fg", "bg", "text"]);
      if (data.bg && data.text) {
        return data.text;
      }
      return data.bg;
    },
    "colored link": (tmpl) => {
      let data = parser(tmpl, ["color", "title", "text"]);
      return `[[${data.title}|${data.text || data.title}]]`;
    },
    nftu: (tmpl) => {
      let data = parser(tmpl, ["age", "team"]);
      return `${data.team} U${data.age}`;
    },
    tls: (tmpl) => {
      let data = parser(tmpl, ["name", "one", "two"]);
      let out = `subst:${data.name}`;
      if (data.one) {
        out += "|" + data.one;
      }
      if (data.two) {
        out += "|" + data.two;
      }
      return `{{${out}}}`;
    }
  };

  let shorthands = [
    // {{HWV|251d}} - handel, bach
    ["bwv", "BWV"],
    ["hwv", "HWV"],
    ["d.", "D "],
    //Deutsch catalogue
    ["aka", "a.k.a. "],
    // date abbreviations
    ["cf.", "cf. "],
    ["fl.", "fl. "],
    ["circa", "c. "],
    ["born in", "b. "],
    ["died-in", "d. "],
    ["married-in", "m. "]
  ];
  let fns$1 = shorthands.reduce((h, a) => {
    let [name, out] = a;
    h[name] = (tmpl) => {
      let { first } = parser(tmpl, ["first"]);
      if (first || first === 0) {
        return out + (first || "");
      }
      return out;
    };
    return h;
  }, {});
  let justNames = [
    "they",
    "them",
    "their",
    "theirs",
    "themself",
    "they are",
    "they were",
    "they have",
    "they do",
    "he or she",
    "him or her",
    "his or her",
    "his or hers",
    "he/she",
    "him/her",
    "his/her"
  ];
  justNames.forEach((str) => {
    fns$1[str] = str;
  });

  let templates$a = {};
  let more = [
    "sr-latn-cyrl",
    //first parameter latin, second cyrillic
    "sr-cyrl-latn",
    //first parameter cyrillic, second latin
    "sr-latn",
    //one parameter latin
    "sr-cyrl",
    //one parameter cyrillic
    "sr-cyr",
    "sh-latn-cyrl",
    //for both Latin and Cyrillic in that order
    "sh-cyrl-latn",
    //for both Cyrillic and Latin in that order
    "sh-latn",
    //for Latin
    "sh-cyrl",
    //for Cyrillic
    "cel-1bd",
    "cel-x-proto",
    "en-emodeng",
    "de-at",
    "de-ch",
    "gem-x-proto",
    "gsw-fr",
    "nds-nl",
    "nl-be",
    "ku-arab",
    "ku-cyrl",
    "pt-br",
    "fra-frc",
    "fra-que",
    "roa-leo",
    "roa-nor",
    "ca-valencia",
    "ast-leo",
    "grc-gre",
    "grc-x-doric",
    "grc-x-proto",
    "grc-x-medieval",
    "cpg",
    "gmy",
    "grc",
    "grk-x-proto",
    "pnt",
    "mga",
    "owl",
    "pgl",
    "sga",
    "wlm",
    "xbm",
    "xcb",
    "xcg",
    "xpi",
    "aae",
    "aln",
    "sq-definite",
    "bs-cyrl",
    "hsb",
    "ltg",
    "orv",
    "prg",
    "rsk",
    "rue",
    "rus",
    "sgs",
    "sla",
    "szl",
    "wen",
    "aoa",
    "chn",
    "cri",
    "dlm",
    "egl",
    "fax",
    "frc",
    "frm",
    "fro",
    "fr-gallo",
    "oc-gascon",
    "gcf",
    "gcr",
    "ist",
    "la-x-medieval",
    "lij-mc",
    "lld",
    "lou",
    "mfe",
    "mol",
    "mwl",
    "mxi",
    "nrf",
    "osc",
    "osp",
    "pcd",
    "pln",
    "rcf",
    "rgn",
    "roa",
    "ruo",
    "rup",
    "ruq",
    "sdc",
    "sdn",
    "src",
    "sro",
    "xvo",
    "bzj",
    "cim",
    "dum",
    "enm",
    "frk",
    "frr",
    "frs",
    "gmh",
    "gml",
    "gmw",
    "goh",
    "gos",
    "gsw",
    "gyn",
    "icr",
    "jam",
    "kri",
    "lng",
    "nb",
    "non",
    "nrn",
    "odt",
    "ofs",
    "osx",
    "pey",
    "sli",
    "srm",
    "srn",
    "stq",
    "swg",
    "vmf",
    "wae",
    "wep",
    "wes",
    "zea",
    "hmd",
    "hoc",
    "kha",
    "mnw",
    "mtq",
    "vi-chunom",
    "vi-hantu",
    "mvi",
    "rys",
    "ryu",
    "yoi",
    "ace",
    "akl",
    "ami",
    "bew",
    "bik",
    "bjn",
    "bya",
    "cal",
    "cbk",
    "cjm",
    "coa",
    "cyo",
    "dev",
    "fil",
    "gad",
    "hil",
    "iba",
    "ibg",
    "ibl",
    "ilp",
    "itv",
    "ivv",
    "jax",
    "kne",
    "krj",
    "kxd",
    "ljp",
    "mad",
    "mak",
    "mdh",
    "mrv",
    "mrw",
    "ms-arab",
    "nia",
    "niu",
    "pau",
    "pwn",
    "rap",
    "rar",
    "sgd",
    "su-fonts",
    "szy",
    "tao",
    "tkl",
    "tsg",
    "tvl",
    "uli",
    "wls",
    "xsb",
    "yap",
    "yka",
    "ckt",
    "itl",
    "brh",
    "oty",
    "tcy",
    "abq",
    "ady",
    "ddo",
    "inh",
    "kbd",
    "lbe",
    "lez",
    "rut",
    "tab",
    "uby",
    "udi",
    "bai",
    "bin",
    "bsq",
    "dag",
    "dyu",
    "efi",
    "fan",
    "fmp",
    "fuc",
    "fuf",
    "gaa",
    "ibb",
    "kbp",
    "kcg",
    "kpo",
    "ktu",
    "lu",
    "lua",
    "lun",
    "mkw",
    "mos",
    "oaa",
    "sjo",
    "ude",
    "anm",
    "bft",
    "blk",
    "brx",
    "dng",
    "kjp",
    "kjz",
    "ksw",
    "lbj",
    "lus",
    "aae",
    "aaq",
    "abe",
    "abq",
    "aca",
    "ace",
    "acf",
    "acm",
    "acw",
    "ady",
    "ae",
    "aeb",
    "aec",
    "aer",
    "afb",
    "aht",
    "aii",
    "aij",
    "ain",
    "aiq",
    "akk",
    "akl",
    "akz",
    "ale",
    "aln",
    "alq",
    "alt",
    "ami",
    "anm",
    "aoa",
    "apj",
    "apm",
    "apw",
    "ayn",
    "arb",
    "arh",
    "ari",
    "arn",
    "arp",
    "arq",
    "ary",
    "arz",
    "asb",
    "ath",
    "ats",
    "awa",
    "axm",
    "azb",
    "azd",
    "azj",
    "bai",
    "bal",
    "ban",
    "bax",
    "bdz",
    "bea",
    "ber",
    "bew",
    "bft",
    "bgn",
    "bho",
    "bik",
    "bin",
    "bjn",
    "bla",
    "blc",
    "blk",
    "bqi",
    "brh",
    "brx",
    "bsk",
    "bsq",
    "bua",
    "bvb",
    "bya",
    "bzj",
    "cal",
    "cay",
    "cbk",
    "ccp",
    "chg",
    "chm",
    "chn",
    "chp",
    "cic",
    "cim",
    "ciw",
    "cjm",
    "cjs",
    "ckb",
    "ckt",
    "cku",
    "cld",
    "clm",
    "cmg",
    "cmn",
    "cms",
    "cnu",
    "coa",
    "coc",
    "coj",
    "com",
    "coo",
    "cop",
    "cpg",
    "crg",
    "crh",
    "cri",
    "crj",
    "crk",
    "crl",
    "crm",
    "cro",
    "csw",
    "csz",
    "ctg",
    "ctm",
    "cyo",
    "dag",
    "dak",
    "ddo",
    "deh",
    "del",
    "den",
    "dev",
    "din",
    "dlm",
    "dng",
    "dum",
    "dyu",
    "efi",
    "egl",
    "egy",
    "elx",
    "eml",
    "ems",
    "cmn",
    "och",
    "yue",
    "mjw",
    "mni",
    "my-name-mlcts",
    "nan",
    "nwc",
    "omp",
    "otb",
    "pwo",
    "sip",
    "xct",
    "xsr",
    "1ca",
    "alt",
    "az-arab",
    "azb",
    "azj",
    "chg",
    "cjs",
    "crh",
    "crh3",
    "kaa",
    "kjh",
    "krc",
    "kum",
    "nog",
    "ota",
    "otk",
    "sah",
    "slr",
    "sty",
    "tt-arab",
    "tt-cyrl",
    "tt-latn",
    "tyv",
    "uniturk",
    "chm",
    "est-sea",
    "fit",
    "fkv",
    "izh",
    "jmy",
    "koi",
    "krl",
    "liv",
    "mdf",
    "mhr",
    "mrj",
    "myv",
    "olo",
    "sia",
    "sjd",
    "sje",
    "sjk",
    "sjt",
    "sju",
    "sma",
    "smi",
    "smj",
    "smn",
    "sms",
    "vep",
    "vot",
    "vro",
    "yrk",
    "din",
    "luo",
    "srr",
    "sus",
    "swh",
    "umb",
    "yao"
  ];
  more.forEach((k) => {
    templates$a["lang-" + k] = 0;
  });
  Object.keys(languages).forEach((k) => {
    templates$a["lang-" + k] = 0;
  });

  var flags = [
    ["\u{1F1E6}\u{1F1E9}", "and", "andorra"],
    ["\u{1F1E6}\u{1F1EA}", "are", "united arab emirates"],
    ["\u{1F1E6}\u{1F1EB}", "afg", "afghanistan"],
    ["\u{1F1E6}\u{1F1EC}", "atg", "antigua and barbuda"],
    ["\u{1F1E6}\u{1F1EE}", "aia", "anguilla"],
    ["\u{1F1E6}\u{1F1F1}", "alb", "albania"],
    ["\u{1F1E6}\u{1F1F2}", "arm", "armenia"],
    ["\u{1F1E6}\u{1F1F4}", "ago", "angola"],
    ["\u{1F1E6}\u{1F1F6}", "ata", "antarctica"],
    ["\u{1F1E6}\u{1F1F7}", "arg", "argentina"],
    ["\u{1F1E6}\u{1F1F8}", "asm", "american samoa"],
    ["\u{1F1E6}\u{1F1F9}", "aut", "austria"],
    ["\u{1F1E6}\u{1F1FA}", "aus", "australia"],
    ["\u{1F1E6}\u{1F1FC}", "abw", "aruba"],
    ["\u{1F1E6}\u{1F1FD}", "ala", "\xE5land islands"],
    ["\u{1F1E6}\u{1F1FF}", "aze", "azerbaijan"],
    ["\u{1F1E7}\u{1F1E6}", "bih", "bosnia and herzegovina"],
    ["\u{1F1E7}\u{1F1E7}", "brb", "barbados"],
    ["\u{1F1E7}\u{1F1E9}", "bgd", "bangladesh"],
    ["\u{1F1E7}\u{1F1EA}", "bel", "belgium"],
    ["\u{1F1E7}\u{1F1EB}", "bfa", "burkina faso"],
    ["\u{1F1E7}\u{1F1EC}", "bgr", "bulgaria"],
    ["\u{1F1E7}\u{1F1EC}", "bul", "bulgaria"],
    //dupe
    ["\u{1F1E7}\u{1F1ED}", "bhr", "bahrain"],
    ["\u{1F1E7}\u{1F1EE}", "bdi", "burundi"],
    ["\u{1F1E7}\u{1F1EF}", "ben", "benin"],
    ["\u{1F1E7}\u{1F1F1}", "blm", "saint barth\xE9lemy"],
    ["\u{1F1E7}\u{1F1F2}", "bmu", "bermuda"],
    ["\u{1F1E7}\u{1F1F3}", "brn", "brunei darussalam"],
    ["\u{1F1E7}\u{1F1F4}", "bol", "bolivia"],
    ["\u{1F1E7}\u{1F1F6}", "bes", "bonaire, sint eustatius and saba"],
    ["\u{1F1E7}\u{1F1F7}", "bra", "brazil"],
    ["\u{1F1E7}\u{1F1F8}", "bhs", "bahamas"],
    ["\u{1F1E7}\u{1F1F9}", "btn", "bhutan"],
    ["\u{1F1E7}\u{1F1FB}", "bvt", "bouvet island"],
    ["\u{1F1E7}\u{1F1FC}", "bwa", "botswana"],
    ["\u{1F1E7}\u{1F1FE}", "blr", "belarus"],
    ["\u{1F1E7}\u{1F1FF}", "blz", "belize"],
    ["\u{1F1E8}\u{1F1E6}", "can", "canada"],
    ["\u{1F1E8}\u{1F1E8}", "cck", "cocos (keeling) islands"],
    ["\u{1F1E8}\u{1F1E9}", "cod", "congo"],
    ["\u{1F1E8}\u{1F1EB}", "caf", "central african republic"],
    ["\u{1F1E8}\u{1F1EC}", "cog", "congo"],
    ["\u{1F1E8}\u{1F1ED}", "che", "switzerland"],
    ["\u{1F1E8}\u{1F1EE}", "civ", "c\xF4te d'ivoire"],
    ["\u{1F1E8}\u{1F1F0}", "cok", "cook islands"],
    ["\u{1F1E8}\u{1F1F1}", "chl", "chile"],
    ["\u{1F1E8}\u{1F1F2}", "cmr", "cameroon"],
    ["\u{1F1E8}\u{1F1F3}", "chn", "china"],
    ["\u{1F1E8}\u{1F1F4}", "col", "colombia"],
    ["\u{1F1E8}\u{1F1F7}", "cri", "costa rica"],
    ["\u{1F1E8}\u{1F1FA}", "cub", "cuba"],
    ["\u{1F1E8}\u{1F1FB}", "cpv", "cape verde"],
    ["\u{1F1E8}\u{1F1FC}", "cuw", "cura\xE7ao"],
    ["\u{1F1E8}\u{1F1FD}", "cxr", "christmas island"],
    ["\u{1F1E8}\u{1F1FE}", "cyp", "cyprus"],
    ["\u{1F1E8}\u{1F1FF}", "cze", "czech republic"],
    ["\u{1F1E9}\u{1F1EA}", "deu", "germany"],
    ["\u{1F1E9}\u{1F1EA}", "ger", "germany"],
    //alias
    ["\u{1F1E9}\u{1F1EF}", "dji", "djibouti"],
    ["\u{1F1E9}\u{1F1F0}", "dnk", "denmark"],
    ["\u{1F1E9}\u{1F1F2}", "dma", "dominica"],
    ["\u{1F1E9}\u{1F1F4}", "dom", "dominican republic"],
    ["\u{1F1E9}\u{1F1FF}", "dza", "algeria"],
    ["\u{1F1EA}\u{1F1E8}", "ecu", "ecuador"],
    ["\u{1F1EA}\u{1F1EA}", "est", "estonia"],
    ["\u{1F1EA}\u{1F1EC}", "egy", "egypt"],
    ["\u{1F1EA}\u{1F1ED}", "esh", "western sahara"],
    ["\u{1F1EA}\u{1F1F7}", "eri", "eritrea"],
    ["\u{1F1EA}\u{1F1F8}", "esp", "spain"],
    ["\u{1F1EA}\u{1F1F9}", "eth", "ethiopia"],
    ["\u{1F1EB}\u{1F1EE}", "fin", "finland"],
    ["\u{1F1EB}\u{1F1EF}", "fji", "fiji"],
    ["\u{1F1EB}\u{1F1F0}", "flk", "falkland islands (malvinas)"],
    ["\u{1F1EB}\u{1F1F2}", "fsm", "micronesia"],
    ["\u{1F1EB}\u{1F1F4}", "fro", "faroe islands"],
    ["\u{1F1EB}\u{1F1F7}", "fra", "france"],
    ["\u{1F1EC}\u{1F1E6}", "gab", "gabon"],
    ["\u{1F1EC}\u{1F1E7}", "gbr", "united kingdom"],
    ["\u{1F1EC}\u{1F1E9}", "grd", "grenada"],
    //['🇬🇪', 'geo', 'georgia'],
    ["\u{1F1EC}\u{1F1EB}", "guf", "french guiana"],
    ["\u{1F1EC}\u{1F1EC}", "ggy", "guernsey"],
    ["\u{1F1EC}\u{1F1ED}", "gha", "ghana"],
    ["\u{1F1EC}\u{1F1EE}", "gib", "gibraltar"],
    ["\u{1F1EC}\u{1F1F1}", "grl", "greenland"],
    ["\u{1F1EC}\u{1F1F2}", "gmb", "gambia"],
    ["\u{1F1EC}\u{1F1F3}", "gin", "guinea"],
    ["\u{1F1EC}\u{1F1F5}", "glp", "guadeloupe"],
    ["\u{1F1EC}\u{1F1F6}", "gnq", "equatorial guinea"],
    ["\u{1F1EC}\u{1F1F7}", "grc", "greece"],
    ["\u{1F1EC}\u{1F1F8}", "sgs", "south georgia"],
    ["\u{1F1EC}\u{1F1F9}", "gtm", "guatemala"],
    ["\u{1F1EC}\u{1F1FA}", "gum", "guam"],
    ["\u{1F1EC}\u{1F1FC}", "gnb", "guinea-bissau"],
    ["\u{1F1EC}\u{1F1FE}", "guy", "guyana"],
    ["\u{1F1ED}\u{1F1F0}", "hkg", "hong kong"],
    ["\u{1F1ED}\u{1F1F2}", "hmd", "heard island and mcdonald islands"],
    ["\u{1F1ED}\u{1F1F3}", "hnd", "honduras"],
    ["\u{1F1ED}\u{1F1F7}", "hrv", "croatia"],
    ["\u{1F1ED}\u{1F1F9}", "hti", "haiti"],
    ["\u{1F1ED}\u{1F1FA}", "hun", "hungary"],
    ["\u{1F1EE}\u{1F1E9}", "idn", "indonesia"],
    ["\u{1F1EE}\u{1F1EA}", "irl", "ireland"],
    ["\u{1F1EE}\u{1F1F1}", "isr", "israel"],
    ["\u{1F1EE}\u{1F1F2}", "imn", "isle of man"],
    ["\u{1F1EE}\u{1F1F3}", "ind", "india"],
    ["\u{1F1EE}\u{1F1F4}", "iot", "british indian ocean territory"],
    ["\u{1F1EE}\u{1F1F6}", "irq", "iraq"],
    ["\u{1F1EE}\u{1F1F7}", "irn", "iran"],
    ["\u{1F1EE}\u{1F1F8}", "isl", "iceland"],
    ["\u{1F1EE}\u{1F1F9}", "ita", "italy"],
    ["\u{1F1EF}\u{1F1EA}", "jey", "jersey"],
    ["\u{1F1EF}\u{1F1F2}", "jam", "jamaica"],
    ["\u{1F1EF}\u{1F1F4}", "jor", "jordan"],
    ["\u{1F1EF}\u{1F1F5}", "jpn", "japan"],
    ["\u{1F1F0}\u{1F1EA}", "ken", "kenya"],
    ["\u{1F1F0}\u{1F1EC}", "kgz", "kyrgyzstan"],
    ["\u{1F1F0}\u{1F1ED}", "khm", "cambodia"],
    ["\u{1F1F0}\u{1F1EE}", "kir", "kiribati"],
    ["\u{1F1F0}\u{1F1F2}", "com", "comoros"],
    ["\u{1F1F0}\u{1F1F3}", "kna", "saint kitts and nevis"],
    ["\u{1F1F0}\u{1F1F5}", "prk", "north korea"],
    ["\u{1F1F0}\u{1F1F7}", "kor", "south korea"],
    ["\u{1F1F0}\u{1F1FC}", "kwt", "kuwait"],
    ["\u{1F1F0}\u{1F1FE}", "cym", "cayman islands"],
    ["\u{1F1F0}\u{1F1FF}", "kaz", "kazakhstan"],
    ["\u{1F1F1}\u{1F1E6}", "lao", "lao people's democratic republic"],
    ["\u{1F1F1}\u{1F1E7}", "lbn", "lebanon"],
    ["\u{1F1F1}\u{1F1E8}", "lca", "saint lucia"],
    ["\u{1F1F1}\u{1F1EE}", "lie", "liechtenstein"],
    ["\u{1F1F1}\u{1F1F0}", "lka", "sri lanka"],
    ["\u{1F1F1}\u{1F1F7}", "lbr", "liberia"],
    ["\u{1F1F1}\u{1F1F8}", "lso", "lesotho"],
    ["\u{1F1F1}\u{1F1F9}", "ltu", "lithuania"],
    ["\u{1F1F1}\u{1F1FA}", "lux", "luxembourg"],
    ["\u{1F1F1}\u{1F1FB}", "lva", "latvia"],
    ["\u{1F1F1}\u{1F1FE}", "lby", "libya"],
    ["\u{1F1F2}\u{1F1E6}", "mar", "morocco"],
    ["\u{1F1F2}\u{1F1E8}", "mco", "monaco"],
    ["\u{1F1F2}\u{1F1E9}", "mda", "moldova"],
    ["\u{1F1F2}\u{1F1EA}", "mne", "montenegro"],
    ["\u{1F1F2}\u{1F1EB}", "maf", "saint martin (french part)"],
    ["\u{1F1F2}\u{1F1EC}", "mdg", "madagascar"],
    ["\u{1F1F2}\u{1F1ED}", "mhl", "marshall islands"],
    ["\u{1F1F2}\u{1F1F0}", "mkd", "macedonia"],
    ["\u{1F1F2}\u{1F1F1}", "mli", "mali"],
    ["\u{1F1F2}\u{1F1F2}", "mmr", "myanmar"],
    ["\u{1F1F2}\u{1F1F3}", "mng", "mongolia"],
    ["\u{1F1F2}\u{1F1F4}", "mac", "macao"],
    ["\u{1F1F2}\u{1F1F5}", "mnp", "northern mariana islands"],
    ["\u{1F1F2}\u{1F1F6}", "mtq", "martinique"],
    ["\u{1F1F2}\u{1F1F7}", "mrt", "mauritania"],
    ["\u{1F1F2}\u{1F1F8}", "msr", "montserrat"],
    ["\u{1F1F2}\u{1F1F9}", "mlt", "malta"],
    ["\u{1F1F2}\u{1F1FA}", "mus", "mauritius"],
    ["\u{1F1F2}\u{1F1FB}", "mdv", "maldives"],
    ["\u{1F1F2}\u{1F1FC}", "mwi", "malawi"],
    ["\u{1F1F2}\u{1F1FD}", "mex", "mexico"],
    ["\u{1F1F2}\u{1F1FE}", "mys", "malaysia"],
    ["\u{1F1F2}\u{1F1FF}", "moz", "mozambique"],
    ["\u{1F1F3}\u{1F1E6}", "nam", "namibia"],
    ["\u{1F1F3}\u{1F1E8}", "ncl", "new caledonia"],
    ["\u{1F1F3}\u{1F1EA}", "ner", "niger"],
    ["\u{1F1F3}\u{1F1EB}", "nfk", "norfolk island"],
    ["\u{1F1F3}\u{1F1EC}", "nga", "nigeria"],
    ["\u{1F1F3}\u{1F1EE}", "nic", "nicaragua"],
    ["\u{1F1F3}\u{1F1F1}", "nld", "netherlands"],
    ["\u{1F1F3}\u{1F1F4}", "nor", "norway"],
    ["\u{1F1F3}\u{1F1F5}", "npl", "nepal"],
    ["\u{1F1F3}\u{1F1F7}", "nru", "nauru"],
    ["\u{1F1F3}\u{1F1FA}", "niu", "niue"],
    ["\u{1F1F3}\u{1F1FF}", "nzl", "new zealand"],
    ["\u{1F1F4}\u{1F1F2}", "omn", "oman"],
    ["\u{1F1F5}\u{1F1E6}", "pan", "panama"],
    ["\u{1F1F5}\u{1F1EA}", "per", "peru"],
    ["\u{1F1F5}\u{1F1EB}", "pyf", "french polynesia"],
    ["\u{1F1F5}\u{1F1EC}", "png", "papua new guinea"],
    ["\u{1F1F5}\u{1F1ED}", "phl", "philippines"],
    ["\u{1F1F5}\u{1F1F0}", "pak", "pakistan"],
    ["\u{1F1F5}\u{1F1F1}", "pol", "poland"],
    ["\u{1F1F5}\u{1F1F2}", "spm", "saint pierre and miquelon"],
    ["\u{1F1F5}\u{1F1F3}", "pcn", "pitcairn"],
    ["\u{1F1F5}\u{1F1F7}", "pri", "puerto rico"],
    ["\u{1F1F5}\u{1F1F8}", "pse", "palestinian territory"],
    ["\u{1F1F5}\u{1F1F9}", "prt", "portugal"],
    ["\u{1F1F5}\u{1F1FC}", "plw", "palau"],
    ["\u{1F1F5}\u{1F1FE}", "pry", "paraguay"],
    ["\u{1F1F6}\u{1F1E6}", "qat", "qatar"],
    ["\u{1F1F7}\u{1F1EA}", "reu", "r\xE9union"],
    ["\u{1F1F7}\u{1F1F4}", "rou", "romania"],
    ["\u{1F1F7}\u{1F1F8}", "srb", "serbia"],
    ["\u{1F1F7}\u{1F1FA}", "rus", "russia"],
    ["\u{1F1F7}\u{1F1FC}", "rwa", "rwanda"],
    ["\u{1F1F8}\u{1F1E6}", "sau", "saudi arabia"],
    ["\u{1F1F8}\u{1F1E7}", "slb", "solomon islands"],
    ["\u{1F1F8}\u{1F1E8}", "syc", "seychelles"],
    ["\u{1F1F8}\u{1F1E9}", "sdn", "sudan"],
    ["\u{1F1F8}\u{1F1EA}", "swe", "sweden"],
    ["\u{1F1F8}\u{1F1EC}", "sgp", "singapore"],
    ["\u{1F1F8}\u{1F1ED}", "shn", "saint helena, ascension and tristan da cunha"],
    ["\u{1F1F8}\u{1F1EE}", "svn", "slovenia"],
    ["\u{1F1F8}\u{1F1EF}", "sjm", "svalbard and jan mayen"],
    ["\u{1F1F8}\u{1F1F0}", "svk", "slovakia"],
    ["\u{1F1F8}\u{1F1F1}", "sle", "sierra leone"],
    ["\u{1F1F8}\u{1F1F2}", "smr", "san marino"],
    ["\u{1F1F8}\u{1F1F3}", "sen", "senegal"],
    ["\u{1F1F8}\u{1F1F4}", "som", "somalia"],
    ["\u{1F1F8}\u{1F1F7}", "sur", "suriname"],
    ["\u{1F1F8}\u{1F1F8}", "ssd", "south sudan"],
    ["\u{1F1F8}\u{1F1F9}", "stp", "sao tome and principe"],
    ["\u{1F1F8}\u{1F1FB}", "slv", "el salvador"],
    ["\u{1F1F8}\u{1F1FD}", "sxm", "sint maarten (dutch part)"],
    ["\u{1F1F8}\u{1F1FE}", "syr", "syrian arab republic"],
    ["\u{1F1F8}\u{1F1FF}", "swz", "swaziland"],
    ["\u{1F1F9}\u{1F1E8}", "tca", "turks and caicos islands"],
    ["\u{1F1F9}\u{1F1E9}", "tcd", "chad"],
    ["\u{1F1F9}\u{1F1EB}", "atf", "french southern territories"],
    ["\u{1F1F9}\u{1F1EC}", "tgo", "togo"],
    ["\u{1F1F9}\u{1F1ED}", "tha", "thailand"],
    ["\u{1F1F9}\u{1F1EF}", "tjk", "tajikistan"],
    ["\u{1F1F9}\u{1F1F0}", "tkl", "tokelau"],
    // ['🇹🇱', 'tls', 'timor-leste'],
    ["\u{1F1F9}\u{1F1F2}", "tkm", "turkmenistan"],
    ["\u{1F1F9}\u{1F1F3}", "tun", "tunisia"],
    ["\u{1F1F9}\u{1F1F4}", "ton", "tonga"],
    ["\u{1F1F9}\u{1F1F7}", "tur", "turkey"],
    ["\u{1F1F9}\u{1F1F9}", "tto", "trinidad and tobago"],
    ["\u{1F1F9}\u{1F1FB}", "tuv", "tuvalu"],
    ["\u{1F1F9}\u{1F1FC}", "twn", "taiwan"],
    ["\u{1F1F9}\u{1F1FF}", "tza", "tanzania"],
    ["\u{1F1FA}\u{1F1E6}", "ukr", "ukraine"],
    ["\u{1F1FA}\u{1F1EC}", "uga", "uganda"],
    ["\u{1F1FA}\u{1F1F2}", "umi", "united states minor outlying islands"],
    ["\u{1F1FA}\u{1F1F8}", "us", "united states"],
    //alias
    ["\u{1F1FA}\u{1F1F8}", "usa", "united states"],
    ["\u{1F1FA}\u{1F1FE}", "ury", "uruguay"],
    ["\u{1F1FA}\u{1F1FF}", "uzb", "uzbekistan"],
    ["\u{1F1FB}\u{1F1E6}", "vat", "vatican city"],
    ["\u{1F1FB}\u{1F1E8}", "vct", "saint vincent and the grenadines"],
    ["\u{1F1FB}\u{1F1EA}", "ven", "venezuela"],
    ["\u{1F1FB}\u{1F1EC}", "vgb", "virgin islands, british"],
    ["\u{1F1FB}\u{1F1EE}", "vir", "virgin islands, u.s."],
    ["\u{1F1FB}\u{1F1F3}", "vnm", "viet nam"],
    ["\u{1F1FB}\u{1F1FA}", "vut", "vanuatu"],
    ["\u{1F1FC}\u{1F1EB}", "wlf", "wallis and futuna"],
    ["\u{1F1FC}\u{1F1F8}", "wsm", "samoa"],
    ["\u{1F1FE}\u{1F1EA}", "yem", "yemen"],
    ["\u{1F1FE}\u{1F1F9}", "myt", "mayotte"],
    ["\u{1F1FF}\u{1F1E6}", "zaf", "south africa"],
    ["\u{1F1FF}\u{1F1F2}", "zmb", "zambia"],
    ["\u{1F1FF}\u{1F1FC} ", "zwe", "zimbabwe"],
    //others (later unicode versions)
    ["\u{1F1FA}\u{1F1F3}", "un", "united nations"],
    ["\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "eng", "england"],
    ["\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "sct", "scotland"],
    ["\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "wal", "wales"],
    ["\u{1F1EA}\u{1F1FA}", "eu", "european union"]
  ];

  const order = ["flag", "variant"];
  let templates$9 = {
    //https://en.wikipedia.org/wiki/Template:Flag
    // {{flag|USA}} →  USA
    flag: (tmpl) => {
      let obj = parser(tmpl, order);
      let name = obj.flag || "";
      obj.flag = (obj.flag || "").toLowerCase();
      let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || [];
      let flag = found[0] || "";
      return `${flag} [[${found[2]}|${name}]]`;
    },
    // {{flagcountry|USA}} →  United States
    flagcountry: (tmpl) => {
      let obj = parser(tmpl, order);
      obj.flag = (obj.flag || "").toLowerCase();
      let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || [];
      let flag = found[0] || "";
      return `${flag} [[${found[2]}]]`;
    },
    // (unlinked flag-country)
    flagcu: (tmpl) => {
      let obj = parser(tmpl, order);
      obj.flag = (obj.flag || "").toLowerCase();
      let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || [];
      let flag = found[0] || "";
      return `${flag} ${found[2]}`;
    },
    //https://en.wikipedia.org/wiki/Template:Flagicon
    // {{flagicon|USA}} → United States
    flagicon: (tmpl) => {
      let obj = parser(tmpl, order);
      obj.flag = (obj.flag || "").toLowerCase();
      let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]);
      if (!found) {
        return "";
      }
      return `[[${found[2]}|${found[0]}]]`;
    },
    //unlinked flagicon
    flagdeco: (tmpl) => {
      let obj = parser(tmpl, order);
      obj.flag = (obj.flag || "").toLowerCase();
      let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || [];
      return found[0] || "";
    },
    //same, but a soccer team
    fb: (tmpl) => {
      let obj = parser(tmpl, order);
      obj.flag = (obj.flag || "").toLowerCase();
      let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]);
      if (!found) {
        return "";
      }
      return `${found[0]} [[${found[2]} national football team|${found[2]}]]`;
    },
    fbicon: (tmpl) => {
      let obj = parser(tmpl, order);
      obj.flag = (obj.flag || "").toLowerCase();
      let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]);
      if (!found) {
        return "";
      }
      return ` [[${found[2]} national football team|${found[0]}]]`;
    },
    flagathlete: (tmpl) => {
      let obj = parser(tmpl, ["name", "flag", "variant"]);
      obj.flag = (obj.flag || "").toLowerCase();
      let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]);
      if (!found) {
        return `[[${obj.name || ""}]]`;
      }
      return `${found[0]} [[${obj.name || ""}]] (${found[1].toUpperCase()})`;
    }
  };
  flags.forEach((a) => {
    templates$9[a[1]] = () => {
      return a[0];
    };
  });

  let templates$8 = {};
  let cells = [
    "rh",
    "rh2",
    "yes",
    "no",
    "maybe",
    "eliminated",
    "lost",
    "safe",
    "active",
    "site active",
    "coming soon",
    "good",
    "won",
    "nom",
    "sho",
    "longlisted",
    "tba",
    "success",
    "operational",
    "failure",
    "partial",
    "regional",
    "maybecheck",
    "partial success",
    "partial failure",
    "okay",
    "yes-no",
    "some",
    "nonpartisan",
    "pending",
    "unofficial",
    "unofficial2",
    "usually",
    "rarely",
    "sometimes",
    "any",
    "varies",
    "black",
    "non-album single",
    "unreleased",
    "unknown",
    "perhaps",
    "depends",
    "included",
    "dropped",
    "terminated",
    "beta",
    "table-experimental",
    "free",
    "proprietary",
    "nonfree",
    "needs",
    "nightly",
    "release-candidate",
    "planned",
    "scheduled",
    "incorrect",
    "no result",
    "cmain",
    "calso starring",
    "crecurring",
    "cguest",
    "not yet",
    "optional"
  ];
  cells.forEach((str) => {
    templates$8[str] = (tmpl) => {
      let data = parser(tmpl, ["text"]);
      return data.text || titlecase(data.template);
    };
  });
  let moreCells = [
    ["active fire", "Active"],
    ["site active", "Active"],
    ["site inactive", "Inactive"],
    ["yes2", ""],
    ["no2", ""],
    ["ya", "\u2705"],
    ["na", "\u274C"],
    ["nom", "Nominated"],
    ["sho", "Shortlisted"],
    ["tba", "TBA"],
    ["maybecheck", "\u2714\uFE0F"],
    ["okay", "Neutral"],
    ["n/a", "N/A"],
    ["sdash", "\u2014"],
    ["dunno", "?"],
    ["draw", ""],
    ["cnone", ""],
    ["nocontest", ""]
  ];
  moreCells.forEach((a) => {
    templates$8[a[0]] = (tmpl) => {
      let data = parser(tmpl, ["text"]);
      return data.text || a[1];
    };
  });

  var textTmpl = Object.assign({}, hardcoded, templates$c, templates$b, functions, templates$a, fns$1, templates$9, templates$8);

  let templates$7 = {};
  let idName = [
    "goodreads author",
    "twitter",
    "facebook",
    "instagram",
    "tumblr",
    "pinterest",
    "espn nfl",
    "espn nhl",
    "espn fc",
    "hockeydb",
    "fifa player",
    "worldcat",
    "worldcat id",
    "nfl player",
    "ted speaker",
    "playmate"
  ];
  idName.forEach((name) => {
    templates$7[name] = ["id", "name"];
  });

  let templates$6 = {};
  let idTitle = [
    "imdb title",
    //https://en.wikipedia.org/wiki/Template:IMDb_title
    "imdb name",
    "imdb episode",
    "imdb event",
    "afi film",
    "allmovie title",
    "allgame",
    "tcmdb title",
    "discogs artist",
    "discogs label",
    "discogs release",
    "discogs master",
    "librivox author",
    "musicbrainz artist",
    "musicbrainz label",
    "musicbrainz recording",
    "musicbrainz release",
    "musicbrainz work",
    "youtube",
    "goodreads book",
    "dmoz"
    //https://en.wikipedia.org/wiki/Template:DMOZ
  ];
  idTitle.forEach((name) => {
    templates$6[name] = ["id", "title", "description", "section"];
  });

  let templates$5 = {};
  let dummies = ["citation needed"];
  dummies.forEach((name) => {
    templates$5[name] = (tmpl, list) => {
      list.push(parser(tmpl));
      return "";
    };
  });

  var fns = {
    // https://en.wikipedia.org/wiki/Template:IPA
    ipa: (tmpl, list) => {
      let obj = parser(tmpl, ["transcription", "lang", "audio"]);
      obj.lang = getLang(obj.template);
      obj.template = "ipa";
      list.push(obj);
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:IPAc-en
    ipac: (tmpl, list) => {
      let obj = parser(tmpl);
      obj.transcription = (obj.list || []).join(",");
      delete obj.list;
      obj.lang = getLang(obj.template);
      obj.template = "ipac";
      list.push(obj);
      return "";
    },
    quote: (tmpl, list) => {
      let obj = parser(tmpl, ["text", "author"]);
      list.push(obj);
      if (obj.text) {
        let str = `"${obj.text}"`;
        if (obj.author) {
          str += "\n\n";
          str += `    - ${obj.author}`;
        }
        return str + "\n";
      }
      return "";
    },
    //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
    "cite gnis": (tmpl, list) => {
      let obj = parser(tmpl, ["id", "name", "type"]);
      obj.type = "gnis";
      obj.template = "citation";
      list.push(obj);
      return "";
    },
    "spoken wikipedia": (tmpl, list) => {
      let obj = parser(tmpl, ["file", "date"]);
      obj.template = "audio";
      list.push(obj);
      return "";
    },
    //yellow card
    yel: (tmpl, list) => {
      let obj = parser(tmpl, ["min"]);
      list.push(obj);
      if (obj.min) {
        return `yellow: ${obj.min || ""}'`;
      }
      return "";
    },
    subon: (tmpl, list) => {
      let obj = parser(tmpl, ["min"]);
      list.push(obj);
      if (obj.min) {
        return `sub on: ${obj.min || ""}'`;
      }
      return "";
    },
    suboff: (tmpl, list) => {
      let obj = parser(tmpl, ["min"]);
      list.push(obj);
      if (obj.min) {
        return `sub off: ${obj.min || ""}'`;
      }
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:Sfn
    sfn: (tmpl, list, parser$1, alias) => {
      let obj = parser(tmpl, ["author", "year", "location"]);
      if (alias) {
        obj.name = obj.template;
        obj.teplate = alias;
      }
      list.push(obj);
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:Redirect
    redirect: (tmpl, list) => {
      let data = parser(tmpl, ["redirect"]);
      let lines = data.list || [];
      let links = [];
      for (let i = 0; i < lines.length; i += 2) {
        links.push({
          page: lines[i + 1],
          desc: lines[i]
        });
      }
      let obj = {
        template: "redirect",
        redirect: data.redirect,
        links
      };
      list.push(obj);
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:Sister_project_links
    "sister project links": (tmpl, list) => {
      let data = parser(tmpl);
      let links = {};
      Object.keys(sisterProjects).forEach((k) => {
        if (data.hasOwnProperty(k) === true) {
          links[sisterProjects[k]] = data[k];
        }
      });
      let obj = {
        template: "sister project links",
        links
      };
      list.push(obj);
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:Subject_bar
    "subject bar": (tmpl, list) => {
      let data = parser(tmpl);
      Object.keys(data).forEach((k) => {
        if (sisterProjects.hasOwnProperty(k)) {
          data[sisterProjects[k]] = data[k];
          delete data[k];
        }
      });
      let obj = {
        template: "subject bar",
        links: data
      };
      list.push(obj);
      return "";
    },
    //amazingly, this one does not obey any known patterns
    //https://en.wikipedia.org/wiki/Template:Gallery
    gallery: (tmpl, list) => {
      let obj = parser(tmpl);
      let images = (obj.list || []).filter((line) => /^ *File ?:/.test(line));
      images = images.map((file) => {
        let img = {
          file
        };
        return new Image(img).json();
      });
      obj = {
        template: "gallery",
        images
      };
      list.push(obj);
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:Sky
    sky: (tmpl, list) => {
      let obj = parser(tmpl, [
        "asc_hours",
        "asc_minutes",
        "asc_seconds",
        "dec_sign",
        "dec_degrees",
        "dec_minutes",
        "dec_seconds",
        "distance"
      ]);
      let template = {
        template: "sky",
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
      return "";
    },
    // Parse https://en.wikipedia.org/wiki/Template:Medical_cases_chart -- see
    // https://en.wikipedia.org/wiki/Module:Medical_cases_chart for the original
    // parsing code.
    "medical cases chart": (tmpl, list) => {
      let order = [
        "date",
        "deathsExpr",
        "recoveriesExpr",
        "casesExpr",
        "4thExpr",
        "5thExpr",
        "col1",
        "col1Change",
        "col2",
        "col2Change"
      ];
      let obj = parser(tmpl);
      obj.data = obj.data || "";
      let rows = obj.data.split("\n");
      let dataArray = rows.map((row) => {
        let parameters = row.split(";");
        let rowObject = {
          options: /* @__PURE__ */ new Map()
        };
        let positionalIndex = 0;
        for (let i = 0; i < parameters.length; i++) {
          let parameter = parameters[i].trim();
          if (parameter.match(/^[a-z_]/i)) {
            let [key, value] = parameter.split("=");
            if (value === void 0) {
              value = null;
            }
            rowObject.options.set(key, value);
          } else {
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
      return "";
    },
    graph: (tmpl, list) => {
      let data = parser(tmpl);
      if (data.x) {
        data.x = data.x.split(",").map((str) => str.trim());
      }
      if (data.y) {
        data.y = data.y.split(",").map((str) => str.trim());
      }
      let y = 1;
      while (data["y" + y]) {
        data["y" + y] = data["y" + y].split(",").map((str) => str.trim());
        y += 1;
      }
      list.push(data);
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:Historical_populations
    "historical populations": (tmpl, list) => {
      let data = parser(tmpl);
      data.list = data.list || [];
      let years = [];
      for (let i = 0; i < data.list.length; i += 2) {
        let num = data.list[i + 1];
        years.push({
          year: data.list[i],
          val: Number(num) || num
        });
      }
      data.data = years;
      delete data.list;
      list.push(data);
      return "";
    },
    // this one is a handful!
    //https://en.wikipedia.org/wiki/Template:Weather_box
    "weather box": (tmpl, list) => {
      const hasMonth = /^jan /i;
      const isYear = /^year /i;
      let obj = parser(tmpl);
      const monthList = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      let byMonth = {};
      let properties = Object.keys(obj).filter((k) => hasMonth.test(k));
      properties = properties.map((k) => k.replace(hasMonth, ""));
      properties.forEach((prop) => {
        byMonth[prop] = [];
        monthList.forEach((m) => {
          let key = `${m} ${prop}`;
          if (obj.hasOwnProperty(key)) {
            let num = toNumber(obj[key]);
            delete obj[key];
            byMonth[prop].push(num);
          }
        });
      });
      obj.byMonth = byMonth;
      let byYear = {};
      Object.keys(obj).forEach((k) => {
        if (isYear.test(k)) {
          let prop = k.replace(isYear, "");
          byYear[prop] = obj[k];
          delete obj[k];
        }
      });
      obj.byYear = byYear;
      list.push(obj);
      return "";
    },
    //The 36 parameters are: 12 monthly highs (C), 12 lows (total 24) plus an optional 12 monthly rain/precipitation
    //https://en.wikipedia.org/wiki/Template:Weather_box/concise_C
    "weather box/concise c": (tmpl, list) => {
      let obj = parser(tmpl);
      obj.list = (obj.list || []).map((s) => toNumber(s));
      obj.byMonth = {
        "high c": obj.list.slice(0, 12),
        "low c": obj.list.slice(12, 24),
        "rain mm": obj.list.slice(24, 36)
      };
      delete obj.list;
      obj.template = "weather box";
      list.push(obj);
      return "";
    },
    "weather box/concise f": (tmpl, list) => {
      let obj = parser(tmpl);
      obj.list = (obj.list || []).map((s) => toNumber(s));
      obj.byMonth = {
        "high f": obj.list.slice(0, 12),
        "low f": obj.list.slice(12, 24),
        "rain inch": obj.list.slice(24, 36)
      };
      delete obj.list;
      obj.template = "weather box";
      list.push(obj);
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:Climate_chart
    "climate chart": (tmpl, list) => {
      let lines = parser(tmpl).list || [];
      let title = lines[0];
      let source = lines[38];
      lines = lines.slice(1);
      lines = lines.map((str) => {
        if (str && str[0] === "\u2212") {
          str = str.replace(/−/, "-");
        }
        return str;
      });
      let months = [];
      for (let i = 0; i < 36; i += 3) {
        months.push({
          low: toNumber(lines[i]),
          high: toNumber(lines[i + 1]),
          precip: toNumber(lines[i + 2])
        });
      }
      let obj = {
        template: "climate chart",
        data: {
          title,
          source,
          months
        }
      };
      list.push(obj);
      return "";
    },
    //https://en.wikipedia.org/wiki/Template:MedalCount
    medalcount: (tmpl, list) => {
      let all = parser(tmpl).list || [];
      let lines = [];
      for (let i = 0; i < all.length; i += 4) {
        lines.push({
          name: all[i],
          "1st": Number(all[i + 1]),
          "2nd": Number(all[i + 2]),
          "3rd": Number(all[i + 3])
        });
      }
      let obj = {
        template: "medalcount",
        list: lines
      };
      list.push(obj);
      return "";
    },
    r: (tmpl, list) => {
      let obj = parser(tmpl, ["name"]);
      obj.template = "citation";
      list.push(obj);
      return "";
    }
  };

  let templates$4 = {
    //https://en.wikipedia.org/wiki/Category:External_link_templates
    "find a grave": ["id", "name", "work", "last", "first", "date", "accessdate"],
    congbio: ["id", "name", "date"],
    "hollywood walk of fame": ["name"],
    "wide image": ["file", "width", "caption"],
    audio: ["file", "text", "type"],
    rp: ["page"],
    "short description": ["description"],
    "coord missing": ["region"],
    unreferenced: ["date"],
    "taxon info": ["taxon", "item"],
    //https://en.wikipedia.org/wiki/Template:Taxon_info
    "portuguese name": ["first", "second", "suffix"],
    // https://en.wikipedia.org/wiki/Template:Portuguese_name
    geo: ["lat", "lon", "zoom"],
    //https://en.wikivoyage.org/wiki/Template:Geo
    hatnote: ["text"]
  };
  templates$4 = Object.assign(templates$4, templates$5, templates$7, templates$6, fns);
  var dataTmpl = templates$4;

  const mlbplayer = {
    props: ["number", "name", "il"],
    out: "name"
  };
  const syntaxhighlight = {
    props: [],
    out: "code"
  };
  const samp = {
    props: ["1"],
    out: "1"
  };
  const sub = {
    props: ["text"],
    out: "text"
  };
  const sup = {
    props: ["text"],
    out: "text"
  };
  const chem2 = {
    props: ["equation"],
    out: "equation"
  };
  const ill = {
    props: ["text", "lan1", "text1", "lan2", "text2"],
    out: "text"
  };
  const abbr = {
    props: ["abbr", "meaning", "ipa"],
    out: "abbr"
  };
  var shorthand = {
    mlbplayer,
    syntaxhighlight,
    samp,
    sub,
    sup,
    chem2,
    ill,
    abbr
  };

  let templates$3 = {
    // https://en.wikipedia.org/wiki/Template:Math
    math: (tmpl, list) => {
      let obj = parser(tmpl, ["formula"]);
      list.push(obj);
      return "\n\n" + (obj.formula || "") + "\n\n";
    },
    //svg labels - https://en.m.wikipedia.org/wiki/Template:Legend
    legend: (tmpl, list) => {
      let obj = parser(tmpl, ["color", "label"]);
      list.push(obj);
      return tmpl;
    },
    isbn: (tmpl, list) => {
      let obj = parser(tmpl, ["id", "id2", "id3"]);
      list.push(obj);
      return "ISBN " + (obj.id || "");
    },
    //https://en.wikipedia.org/wiki/Template:Based_on
    "based on": (tmpl, list) => {
      let obj = parser(tmpl, ["title", "author"]);
      list.push(obj);
      return `${obj.title} by ${obj.author || ""}`;
    },
    //barrels of oil https://en.wikipedia.org/wiki/Template:Bbl_to_t
    "bbl to t": (tmpl, list) => {
      let obj = parser(tmpl, ["barrels"]);
      list.push(obj);
      if (obj.barrels === "0") {
        return obj.barrels + " barrel";
      }
      return obj.barrels + " barrels";
    },
    //minor planet - https://en.wikipedia.org/wiki/Template:MPC
    mpc: (tmpl, list) => {
      let obj = parser(tmpl, ["number", "text"]);
      list.push(obj);
      return `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text || obj.number}]`;
    },
    pengoal: (_tmpl, list) => {
      list.push({
        template: "pengoal"
      });
      return "\u2705";
    },
    penmiss: (_tmpl, list) => {
      list.push({
        template: "penmiss"
      });
      return "\u274C";
    },
    // https://en.wikipedia.org/wiki/Template:Ordered_list
    "ordered list": (tmpl, list) => {
      let obj = parser(tmpl);
      list.push(obj);
      obj.list = obj.list || [];
      let lines = obj.list.map((str, i) => `${i + 1}. ${str}`);
      return lines.join("\n\n");
    },
    // https://en.wikipedia.org/wiki/Template:Title_year
    "title year": (tmpl, _list, _alias, _parse, doc) => {
      let obj = parser(tmpl, ["match", "nomatch", "page"]);
      let title = obj.page || doc.title();
      if (title) {
        let m = title.match(/\b[0-9]{4}\b/);
        if (m) {
          return m[0];
        }
      }
      return obj.nomatch || "";
    },
    // https://en.wikipedia.org/wiki/Template:Title_century
    "title century": (tmpl, _list, _alias, _parse, doc) => {
      let obj = parser(tmpl, ["match", "nomatch", "page"]);
      let title = obj.page || doc.title();
      if (title) {
        let m = title.match(/\b([0-9]+)(st|nd|rd|th)\b/);
        if (m) {
          return m[1] || "";
        }
      }
      return obj.nomatch || "";
    },
    // https://en.wikipedia.org/wiki/Template:Title_decade
    "title decade": (tmpl, _list, _alias, _parse, doc) => {
      let obj = parser(tmpl, ["match", "nomatch", "page"]);
      let title = obj.page || doc.title();
      if (title) {
        let m = title.match(/\b([0-9]+)s\b/);
        if (m) {
          return m[1] || "";
        }
      }
      return obj.nomatch || "";
    },
    //https://en.wikipedia.org/wiki/Template:Nihongo
    nihongo: (tmpl, list) => {
      let obj = parser(tmpl, ["english", "kanji", "romaji", "extra"]);
      list.push(obj);
      let str = obj.english || obj.romaji || "";
      if (obj.kanji) {
        str += ` (${obj.kanji})`;
      }
      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Marriage
    //this one creates a template, and an inline response
    marriage: (tmpl, list) => {
      let data = parser(tmpl, ["spouse", "from", "to", "end"]);
      list.push(data);
      let str = data.spouse || "";
      if (data.from) {
        if (data.to) {
          str += ` (m. ${data.from}-${data.to})`;
        } else {
          str += ` (m. ${data.from})`;
        }
      }
      return str;
    },
    //'red' card - {{sent off|cards|min1|min2}}
    "sent off": (tmpl, list) => {
      let obj = parser(tmpl, ["cards"]);
      let result = {
        template: "sent off",
        cards: obj.cards,
        minutes: obj.list || []
      };
      list.push(result);
      let mins = result.minutes.map((m) => m + "'").join(", ");
      return "sent off: " + mins;
    },
    transl: (tmpl, list) => {
      let obj = parser(tmpl, ["lang", "text", "text2"]);
      if (obj.text2) {
        obj.iso = obj.text;
        obj.text = obj.text2;
        delete obj.text2;
      }
      list.push(obj);
      return obj.text || "";
    },
    //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
    "collapsible list": (tmpl, list) => {
      let obj = parser(tmpl);
      list.push(obj);
      let str = "";
      if (obj.title) {
        str += `'''${obj.title}'''

`;
      }
      if (!obj.list) {
        obj.list = [];
        for (let i = 1; i < 10; i += 1) {
          if (obj[i]) {
            obj.list.push(obj[i]);
            delete obj[i];
          }
        }
      }
      obj.list = obj.list.filter((s) => s);
      str += "\n" + obj.list.join("\n\n") + "\n";
      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Columns-list
    "columns-list": (tmpl, list) => {
      let arr = parser(tmpl).list || [];
      let str = arr[0] || "";
      let lines = str.split(/\n/).filter((f) => f);
      lines = lines.map((s) => s.replace(/\*/, ""));
      list.push({
        template: "columns-list",
        list: lines
      });
      lines = lines.map((s) => "\u2022 " + s);
      return lines.join("\n\n");
    },
    //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
    height: (tmpl, list) => {
      let obj = parser(tmpl);
      list.push(obj);
      let result = [];
      let units = ["m", "cm", "ft", "in"];
      units.forEach((unit) => {
        if (obj.hasOwnProperty(unit) === true) {
          result.push(obj[unit] + unit);
        }
      });
      return result.join(" ");
    },
    //https://en.wikipedia.org/wiki/Template:Sic
    sic: (tmpl, list) => {
      let obj = parser(tmpl, ["one", "two", "three"]);
      let word = (obj.one || "") + (obj.two || "");
      if (obj.one === "?") {
        word = (obj.two || "") + (obj.three || "");
      }
      list.push({
        template: "sic",
        word
      });
      if (obj.nolink === "y") {
        return word;
      }
      return `${word} [sic]`;
    },
    //
    inrconvert: (tmpl, list) => {
      let o = parser(tmpl, ["rupee_value", "currency_formatting"]);
      list.push(o);
      const mults = {
        k: 1e3,
        m: 1e6,
        b: 1e9,
        t: 1e12,
        l: 1e5,
        c: 1e7,
        lc: 1e12
      };
      if (o.currency_formatting) {
        let multiplier = mults[o.currency_formatting] || 1;
        o.rupee_value = o.rupee_value * multiplier;
      }
      return `inr ${o.rupee_value || ""}`;
    },
    //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
    frac: (tmpl, list) => {
      let obj = parser(tmpl, ["a", "b", "c"]);
      let data = {
        template: "sfrac"
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
        return `${data.integer} ${data.numerator}\u2044${data.denominator}`;
      }
      return `${data.numerator}\u2044${data.denominator}`;
    },
    "winning percentage": (tmpl, list) => {
      let obj = parser(tmpl, ["wins", "losses", "ties"]);
      list.push(obj);
      let wins = Number(obj.wins);
      let losses = Number(obj.losses);
      let ties = Number(obj.ties) || 0;
      let games = wins + losses + ties;
      if (obj.ignore_ties === "y") {
        ties = 0;
      }
      if (ties) {
        wins += ties / 2;
      }
      let num = percentage({
        numerator: wins,
        denominator: games,
        decimals: 1
      });
      if (num === null) {
        return "";
      }
      return `.${num * 10}`;
    },
    winlosspct: (tmpl, list) => {
      let obj = parser(tmpl, ["wins", "losses"]);
      list.push(obj);
      let wins = Number(obj.wins);
      let losses = Number(obj.losses);
      let num = percentage({
        numerator: wins,
        denominator: wins + losses,
        decimals: 1
      });
      if (num === null) {
        return "";
      }
      let out = `.${num * 10}`;
      return `${wins || 0} || ${losses || 0} || ${out || "-"}`;
    },
    //https://en.wikipedia.org/wiki/Template:Video_game_release
    "video game release": (tmpl, list) => {
      let order = ["region", "date", "region2", "date2", "region3", "date3", "region4", "date4"];
      let obj = parser(tmpl, order);
      let template = {
        template: "video game release",
        releases: []
      };
      for (let i = 0; i < order.length; i += 2) {
        if (obj[order[i]]) {
          template.releases.push({
            region: obj[order[i]],
            date: obj[order[i + 1]]
          });
        }
      }
      list.push(template);
      let str = template.releases.map((o) => `${o.region}: ${o.date || ""}`).join("\n\n");
      return "\n" + str + "\n";
    },
    // https://en.m.wikipedia.org/wiki/Template:USS
    uss: (tmpl, list) => {
      let obj = parser(tmpl, ["name", "id"]);
      list.push(obj);
      if (obj.id) {
        return `[[USS ${obj.name} (${obj.id})|USS ''${obj.name}'' (${obj.id})]]`;
      }
      return `[[USS ${obj.name}|USS ''${obj.name}'']]`;
    },
    // https://en.wikipedia.org/wiki/Template:Blockquote
    blockquote: (tmpl, list) => {
      let props = ["text", "author", "title", "source", "character"];
      let obj = parser(tmpl, props);
      list.push(obj);
      let txt = obj.text;
      if (!txt) {
        obj.list = obj.list || [];
        txt = obj.list[0] || "";
      }
      let result = txt.replace(/"/g, "'");
      result = '"' + result + '"';
      return result;
    },
    // https://de.m.wikipedia.org/wiki/Vorlage:ReptileDatabase
    ReptileDatabase: (tmpl, list) => {
      let obj = parser(tmpl, ["taxon", "genus", "species", "abruf", "pure_url"]);
      list.push(obj);
      let str = "";
      if (obj.genus || obj.species) {
        str = `${obj.genus || ""} ${obj.species || ""} `;
      }
      return `${str}In: [[The Reptile Database]]`;
    },
    //https://en.m.wikipedia.org/wiki/Template:GEOnet3
    GEOnet3: (tmpl, list) => {
      let obj = parser(tmpl, ["ufi", "name"]);
      list.push(obj);
      return `GEOnet3 can be found at [[GEOnet Names Server]], at [http://geonames.nga.mil/namesgaz/ this link]`;
    },
    "poem quote": (tmpl, list) => {
      let obj = parser(tmpl, ["text", "char", "sign", "source", "title"]);
      list.push(obj);
      let out = obj.text || "";
      if (obj.char || obj.sign || obj.source || obj.title) {
        out += "\n\n \u2014";
        out += obj.char ? " " + obj.char : "";
        out += obj.sign ? " " + obj.sign : "";
        out += obj.source ? " " + obj.source : "";
        out += obj.title ? " " + obj.title : "";
      }
      return out;
    },
    tweet: (tmpl, list) => {
      let obj = parser(tmpl);
      list.push(obj);
      let out = obj.text || "";
      out += obj.date ? " " + obj.date : "";
      return out;
    }
  };

  const codes$1 = {
    "\xA3": "GB\xA3",
    // https://en.wikipedia.org/wiki/Template:GBP
    "\xA5": "\xA5",
    // https://en.wikipedia.org/wiki/Template:JPY
    "\u09F3": "\u09F3",
    // https://en.wikipedia.org/wiki/Template:BDT
    "\u20A9": "\u20A9",
    // https://en.wikipedia.org/wiki/Template:SK_won
    "\u20AC": "\u20AC",
    // https://en.wikipedia.org/wiki/Template:€
    "\u20B1": "\u20B1",
    // https://en.wikipedia.org/wiki/Template:Philippine_peso
    "\u20B9": "\u20B9",
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    "\u20BD": "\u20BD",
    // https://en.wikipedia.org/wiki/Template:RUB
    "cn\xA5": "CN\xA5",
    // https://en.wikipedia.org/wiki/Template:CNY
    "gb\xA3": "GB\xA3",
    // https://en.wikipedia.org/wiki/Template:GBP
    "india rs": "\u20B9",
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    "indian rupee symbol": "\u20B9",
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    "indian rupee": "\u20B9",
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    "indian rupees": "\u20B9",
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    "philippine peso": "\u20B1",
    // https://en.wikipedia.org/wiki/Template:Philippine_peso
    "russian ruble": "\u20BD",
    // https://en.wikipedia.org/wiki/Template:Russian_ruble
    "SK won": "\u20A9",
    // https://en.wikipedia.org/wiki/Template:SK_won
    "turkish lira": "TRY",
    //https://en.wikipedia.org/wiki/Template:Turkish_lira
    a$: "A$",
    // https://en.wikipedia.org/wiki/Template:AUD
    au$: "A$",
    //https://en.wikipedia.org/wiki/Template:AUD
    aud: "A$",
    //https://en.wikipedia.org/wiki/Template:AUD
    bdt: "BDT",
    //https://en.wikipedia.org/wiki/Template:BDT
    brl: "BRL",
    //https://en.wikipedia.org/wiki/Template:BRL
    ca$: "CA$",
    // https://en.wikipedia.org/wiki/Template:CAD
    cad: "CA$",
    // https://en.wikipedia.org/wiki/Template:CAD
    chf: "CHF",
    // https://en.wikipedia.org/wiki/Template:CHF
    cny: "CN\xA5",
    // https://en.wikipedia.org/wiki/Template:CNY
    czk: "czk",
    // https://en.wikipedia.org/wiki/Template:CZK
    dkk: "dkk",
    // https://en.wikipedia.org/wiki/Template:DKK
    dkk2: "dkk",
    // https://en.wikipedia.org/wiki/Template:DKK
    euro: "\u20AC",
    // https://en.wikipedia.org/wiki/Template:€
    gbp: "GB\xA3",
    // https://en.wikipedia.org/wiki/Template:GBP
    hk$: "HK$",
    // https://en.wikipedia.org/wiki/Template:HKD
    hkd: "HK$",
    // https://en.wikipedia.org/wiki/Template:HKD
    ils: "ILS",
    // https://en.wikipedia.org/wiki/Template:ILS
    inr: "\u20B9",
    // https://en.wikipedia.org/wiki/Template:Indian_Rupee
    jpy: "\xA5",
    // https://en.wikipedia.org/wiki/Template:JPY
    myr: "MYR",
    // https://en.wikipedia.org/wiki/Template:MYR
    nis: "ILS",
    // https://en.wikipedia.org/wiki/Template:ILS
    nok: "NOK",
    //https://en.wikipedia.org/wiki/Template:NOK
    nok2: "NOK",
    //https://en.wikipedia.org/wiki/Template:NOK
    nz$: "NZ$",
    //https://en.wikipedia.org/wiki/Template:NZD
    nzd: "NZ$",
    //https://en.wikipedia.org/wiki/Template:NZD
    peso: "peso",
    //https://en.wikipedia.org/wiki/Template:Peso
    pkr: "\u20A8",
    // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
    r$: "BRL",
    //https://en.wikipedia.org/wiki/Template:BRL
    rmb: "CN\xA5",
    // https://en.wikipedia.org/wiki/Template:CNY
    rub: "\u20BD",
    // https://en.wikipedia.org/wiki/Template:RUB
    ruble: "\u20BD",
    // https://en.wikipedia.org/wiki/Template:Ruble
    rupee: "\u20B9",
    // https://en.wikipedia.org/wiki/Template:Rupee
    s$: "sgd",
    // https://en.wikipedia.org/wiki/Template:SGD
    sek: "SEK",
    // https://en.wikipedia.org/wiki/Template:SEK
    sek2: "SEK",
    // https://en.wikipedia.org/wiki/Template:SEK
    sfr: "CHF",
    // https://en.wikipedia.org/wiki/Template:CHF
    sgd: "sgd",
    // https://en.wikipedia.org/wiki/Template:SGD
    shekel: "ILS",
    // https://en.wikipedia.org/wiki/Template:ILS
    sheqel: "ILS",
    // https://en.wikipedia.org/wiki/Template:ILS
    ttd: "TTD",
    //https://en.wikipedia.org/wiki/Template:TTD
    us$: "US$",
    // https://en.wikipedia.org/wiki/Template:US$
    usd: "US$",
    // https://en.wikipedia.org/wiki/Template:US$
    yen: "\xA5",
    // https://en.wikipedia.org/wiki/Template:JPY
    zar: "R"
    //https://en.wikipedia.org/wiki/Template:ZAR
  };
  const parseCurrency = (tmpl, list) => {
    let o = parser(tmpl, ["amount", "code"]);
    list.push(o);
    let code = o.template || "";
    if (code === "currency") {
      code = o.code;
      if (!code) {
        o.code = code = "usd";
      }
    } else if (code === "" || code === "monnaie" || code === "unit\xE9" || code === "nombre" || code === "nb") {
      code = o.code;
    }
    code = (code || "").toLowerCase();
    if (code === "us") {
      o.code = code = "usd";
    } else if (code === "uk") {
      o.code = code = "gbp";
    }
    let str = `${codes$1[code] || ""}${o.amount || ""}`;
    if (o.code && !codes$1[o.code.toLowerCase()]) {
      str += " " + o.code;
    }
    return str;
  };
  let templates$2 = {
    currency: parseCurrency
  };
  Object.keys(codes$1).forEach((k) => {
    templates$2[k] = parseCurrency;
  });

  const day = 1e3 * 60 * 60 * 24;
  const month = day * 30;
  const year = day * 365;
  const getEpoch = function(obj) {
    return (/* @__PURE__ */ new Date(`${obj.year}-${obj.month || 0}-${obj.date || 1}`)).getTime();
  };
  const delta = function(from, to) {
    from = getEpoch(from);
    to = getEpoch(to);
    let diff = to - from;
    let obj = {};
    let years = Math.floor(diff / year);
    if (years > 0) {
      obj.years = years;
      diff -= obj.years * year;
    }
    let monthCount = Math.floor(diff / month);
    if (monthCount > 0) {
      obj.months = monthCount;
      diff -= obj.months * month;
    }
    let days2 = Math.floor(diff / day);
    if (days2 > 0) {
      obj.days = days2;
    }
    return obj;
  };
  const timeSince = function(str) {
    let d = new Date(str);
    if (isNaN(d.getTime())) {
      return "";
    }
    let now = /* @__PURE__ */ new Date();
    let delt = now.getTime() - d.getTime();
    let predicate = "ago";
    if (delt < 0) {
      predicate = "from now";
      delt = Math.abs(delt);
    }
    let hours = delt / 1e3 / 60 / 60;
    let days2 = hours / 24;
    if (days2 < 365) {
      return Number(days2) + " days " + predicate;
    }
    let years = days2 / 365;
    return Number(years) + " years " + predicate;
  };
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const months$1 = [
    void 0,
    //1-based months.. :/
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const monthName = months$1.reduce((h, str, i) => {
    if (i === 0) {
      return h;
    }
    h[str.toLowerCase()] = i;
    h[str.substring(0, 3).toLowerCase()] = i;
    return h;
  }, {});
  const ymd = function(arr) {
    let obj = {};
    let units = ["year", "month", "date", "hour", "minute", "second"];
    for (let i = 0; i < units.length; i += 1) {
      if (!arr[i] && arr[i] !== 0) {
        continue;
      }
      let num = parseInt(arr[i], 10);
      if (isNaN(num) === false) {
        obj[units[i]] = num;
      } else if (units[i] === "month") {
        let m = arr[i].toLowerCase().trim();
        if (monthName.hasOwnProperty(m)) {
          let month = monthName[m];
          obj[units[i]] = month;
        }
      } else {
        delete obj[units[i]];
      }
    }
    let last = arr[arr.length - 1] || "";
    last = String(last);
    if (last.toLowerCase() === "z") {
      obj.tz = "UTC";
    } else if (/[+-][0-9]+:[0-9]/.test(last)) {
      obj.tz = arr[6];
    }
    return obj;
  };
  const pad = function(num) {
    if (num < 10) {
      return "0" + num;
    }
    return String(num);
  };
  const toText = function(date) {
    let str = String(date.year || "");
    if (date.month !== void 0 && months$1.hasOwnProperty(date.month) === true) {
      if (date.date === void 0) {
        str = `${months$1[date.month]} ${date.year}`;
      } else {
        str = `${months$1[date.month]} ${date.date}, ${date.year}`;
        if (date.hour !== void 0 && date.minute !== void 0) {
          let time = `${pad(date.hour)}:${pad(date.minute)}`;
          if (date.second !== void 0) {
            time = time + ":" + pad(date.second);
          }
          str = time + ", " + str;
        }
        if (date.tz) {
          str += ` (${date.tz})`;
        }
      }
    }
    return str;
  };
  const toTextBritish = function(date) {
    let str = String(date.year || "");
    if (date.month !== void 0 && months$1.hasOwnProperty(date.month) === true) {
      if (date.date === void 0) {
        str = `${months$1[date.month]} ${date.year}`;
      } else {
        str = `${date.date} ${months$1[date.month]} ${date.year}`;
        if (date.hour !== void 0 && date.minute !== void 0) {
          let time = `${pad(date.hour)}:${pad(date.minute)}`;
          if (date.second !== void 0) {
            time = time + ":" + pad(date.second);
          }
          str = time + ", " + str;
        }
        if (date.tz) {
          str += ` (${date.tz})`;
        }
      }
    }
    return str;
  };

  const template = function(date) {
    return {
      template: "date",
      data: date
    };
  };
  const getBoth = function(tmpl) {
    tmpl = strip(tmpl);
    let arr = tmpl.split("|");
    let from = ymd(arr.slice(1, 4));
    let to = arr.slice(4, 7);
    if (to.length === 0) {
      let d = /* @__PURE__ */ new Date();
      to = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    }
    to = ymd(to);
    return {
      from,
      to
    };
  };
  const parsers = {
    //generic {{date|year|month|date}} template
    date: (tmpl, list) => {
      let order = ["year", "month", "date", "hour", "minute", "second", "timezone"];
      let obj = parser(tmpl, order);
      let data = ymd([obj.year, obj.month, obj.date || obj.day]);
      obj.text = toText(data);
      if (obj.timezone) {
        if (obj.timezone === "Z") {
          obj.timezone = "UTC";
        }
        obj.text += ` (${obj.timezone})`;
      }
      if (obj.hour && obj.minute) {
        if (obj.second) {
          obj.text = `${obj.hour}:${obj.minute}:${obj.second}, ` + obj.text;
        } else {
          obj.text = `${obj.hour}:${obj.minute}, ` + obj.text;
        }
      }
      if (obj.text) {
        list.push(template(obj));
      }
      return obj.text;
    },
    //support parsing of 'February 10, 1992'
    natural_date: (tmpl, list) => {
      let obj = parser(tmpl, ["text"]);
      let str = obj.text || "";
      let date = {};
      if (/^[0-9]{4}$/.test(str)) {
        date.year = parseInt(str, 10);
      } else {
        let txt = str.replace(/[a-z]+\/[a-z]+/i, "");
        txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i, "");
        let d = new Date(txt);
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
    one_year: (tmpl, list) => {
      let obj = parser(tmpl, ["year"]);
      let year = Number(obj.year);
      list.push(
        template({
          year
        })
      );
      return String(year);
    },
    //assume 'y|m|d' | 'y|m|d' // {{BirthDeathAge|B|1976|6|6|1990|8|8}}
    two_dates: (tmpl, list) => {
      let order = ["b", "birth_year", "birth_month", "birth_date", "death_year", "death_month", "death_date"];
      let obj = parser(tmpl, order);
      if (obj.b && obj.b.toLowerCase() === "b") {
        let date2 = ymd([obj.birth_year, obj.birth_month, obj.birth_date]);
        list.push(template(date2));
        return toText(date2);
      }
      let date = ymd([obj.death_year, obj.death_month, obj.death_date]);
      list.push(template(date));
      return toText(date);
    },
    age: (tmpl) => {
      let d = getBoth(tmpl);
      let diff = delta(d.from, d.to);
      return diff.years || 0;
    },
    "diff-y": (tmpl) => {
      let d = getBoth(tmpl);
      let diff = delta(d.from, d.to);
      if (diff.years === 1) {
        return diff.years + " year";
      }
      return (diff.years || 0) + " years";
    },
    "diff-ym": (tmpl) => {
      let d = getBoth(tmpl);
      let diff = delta(d.from, d.to);
      let arr = [];
      if (diff.years === 1) {
        arr.push(diff.years + " year");
      } else if (diff.years && diff.years !== 0) {
        arr.push(diff.years + " years");
      }
      if (diff.months === 1) {
        arr.push("1 month");
      } else if (diff.months && diff.months !== 0) {
        arr.push(diff.months + " months");
      }
      return arr.join(", ");
    },
    "diff-ymd": (tmpl) => {
      let d = getBoth(tmpl);
      let diff = delta(d.from, d.to);
      let arr = [];
      if (diff.years === 1) {
        arr.push(diff.years + " year");
      } else if (diff.years && diff.years !== 0) {
        arr.push(diff.years + " years");
      }
      if (diff.months === 1) {
        arr.push("1 month");
      } else if (diff.months && diff.months !== 0) {
        arr.push(diff.months + " months");
      }
      if (diff.days === 1) {
        arr.push("1 day");
      } else if (diff.days && diff.days !== 0) {
        arr.push(diff.days + " days");
      }
      return arr.join(", ");
    },
    "diff-yd": (tmpl) => {
      let d = getBoth(tmpl);
      let diff = delta(d.from, d.to);
      let arr = [];
      if (diff.years === 1) {
        arr.push(diff.years + " year");
      } else if (diff.years && diff.years !== 0) {
        arr.push(diff.years + " years");
      }
      diff.days += (diff.months || 0) * 30;
      if (diff.days === 1) {
        arr.push("1 day");
      } else if (diff.days && diff.days !== 0) {
        arr.push(diff.days + " days");
      }
      return arr.join(", ");
    },
    "diff-d": (tmpl) => {
      let d = getBoth(tmpl);
      let diff = delta(d.from, d.to);
      let arr = [];
      diff.days += (diff.years || 0) * 365;
      diff.days += (diff.months || 0) * 30;
      if (diff.days === 1) {
        arr.push("1 day");
      } else if (diff.days && diff.days !== 0) {
        arr.push(diff.days + " days");
      }
      return arr.join(", ");
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var dates = {
    currentday: () => {
      let d = /* @__PURE__ */ new Date();
      return String(d.getDate());
    },
    currentdayname: () => {
      let d = /* @__PURE__ */ new Date();
      return days[d.getDay()];
    },
    currentmonth: () => {
      let d = /* @__PURE__ */ new Date();
      return months[d.getMonth()];
    },
    currentyear: () => {
      let d = /* @__PURE__ */ new Date();
      return String(d.getFullYear());
    },
    monthyear: () => {
      let d = /* @__PURE__ */ new Date();
      return months[d.getMonth()] + " " + d.getFullYear();
    },
    "monthyear-1": () => {
      let d = /* @__PURE__ */ new Date();
      d.setMonth(d.getMonth() - 1);
      return months[d.getMonth()] + " " + d.getFullYear();
    },
    "monthyear+1": () => {
      let d = /* @__PURE__ */ new Date();
      d.setMonth(d.getMonth() + 1);
      return months[d.getMonth()] + " " + d.getFullYear();
    },
    year: (tmpl) => {
      let date = parser(tmpl, ["date"]).date;
      let d = new Date(date);
      if (date && isNaN(d.getTime()) === false) {
        return String(d.getFullYear());
      }
      return "";
    },
    "time ago": (tmpl) => {
      let time = parser(tmpl, ["date", "fmt"]).date;
      return timeSince(time);
    },
    "birth date": (tmpl, list) => {
      let obj = parser(tmpl, ["year", "month", "date"]);
      list.push(obj);
      obj = ymd([obj.year, obj.month, obj.day]);
      return toText(obj);
    },
    //https://en.wikipedia.org/wiki/Template:Birth_date_and_age
    "birth date and age": (tmpl, list) => {
      let obj = parser(tmpl, ["year", "month", "day"]);
      if (obj.year && /[a-z]/i.test(obj.year)) {
        return parsers.natural_date(tmpl, list);
      }
      list.push(obj);
      obj = ymd([obj.year, obj.month, obj.day]);
      return toText(obj);
    },
    "birth year and age": (tmpl, list) => {
      let obj = parser(tmpl, ["birth_year", "birth_month"]);
      if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
        return parsers.natural_date(tmpl, list);
      }
      list.push(obj);
      let age = (/* @__PURE__ */ new Date()).getFullYear() - parseInt(obj.birth_year, 10);
      obj = ymd([obj.birth_year, obj.birth_month]);
      let str = toText(obj);
      if (age) {
        str += ` (age ${age})`;
      }
      return str;
    },
    "death year and age": (tmpl, list) => {
      let obj = parser(tmpl, ["death_year", "birth_year", "death_month"]);
      if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
        return parsers.natural_date(tmpl, list);
      }
      list.push(obj);
      obj = ymd([obj.death_year, obj.death_month]);
      return toText(obj);
    },
    //https://en.wikipedia.org/wiki/Template:Birth_date_and_age2
    "birth date and age2": (tmpl, list) => {
      let order = ["at_year", "at_month", "at_day", "birth_year", "birth_month", "birth_day"];
      let obj = parser(tmpl, order);
      list.push(obj);
      obj = ymd([obj.birth_year, obj.birth_month, obj.birth_day]);
      return toText(obj);
    },
    //https://en.wikipedia.org/wiki/Template:Birth_based_on_age_as_of_date
    "birth based on age as of date": (tmpl, list) => {
      let obj = parser(tmpl, ["age", "year", "month", "day"]);
      list.push(obj);
      let age = parseInt(obj.age, 10);
      let year = parseInt(obj.year, 10);
      let born = year - age;
      if (born && age) {
        return `${born} (age ${obj.age})`;
      }
      return `(age ${obj.age})`;
    },
    //https://en.wikipedia.org/wiki/Template:Death_date_and_given_age
    "death date and given age": (tmpl, list) => {
      let obj = parser(tmpl, ["year", "month", "day", "age"]);
      list.push(obj);
      obj = ymd([obj.year, obj.month, obj.day]);
      let str = toText(obj);
      if (obj.age) {
        str += ` (age ${obj.age})`;
      }
      return str;
    },
    //sortable dates -
    dts: (tmpl) => {
      tmpl = tmpl.replace(/\|format=[ymd]+/i, "");
      tmpl = tmpl.replace(/\|abbr=(on|off)/i, "");
      let obj = parser(tmpl, ["year", "month", "date", "bc"]);
      if (obj.date && obj.month && obj.year) {
        if (/[a-z]/.test(obj.month) === true) {
          return [obj.month, obj.date, obj.year].join(" ");
        }
        return [obj.year, obj.month, obj.date].join("-");
      }
      if (obj.month && obj.year) {
        return [obj.year, obj.month].join("-");
      }
      if (obj.year) {
        if (obj.year < 0) {
          obj.year = Math.abs(obj.year) + " BC";
        }
        return obj.year;
      }
      return "";
    },
    //we can't do timezones, so fake this one a little bit
    //https://en.wikipedia.org/wiki/Template:Time
    time: () => {
      let d = /* @__PURE__ */ new Date();
      let obj = ymd([d.getFullYear(), d.getMonth(), d.getDate()]);
      return toText(obj);
    },
    // https://en.wikipedia.org/wiki/Template:MILLENNIUM
    millennium: (tmpl) => {
      let obj = parser(tmpl, ["year"]);
      let year = parseInt(obj.year, 10);
      year = Math.floor(year / 1e3) + 1;
      if (obj.abbr && obj.abbr === "y") {
        if (year < 0) {
          return `${toOrdinal(Math.abs(year))} BC`;
        }
        return `${toOrdinal(year)}`;
      }
      return `${toOrdinal(year)} millennium`;
    },
    //date/age/time templates
    start: parsers.date,
    "start-date": parsers.natural_date,
    birthdeathage: parsers.two_dates,
    age: parsers.age,
    "age nts": parsers.age,
    "age in years": parsers["diff-y"],
    "age in years and months": parsers["diff-ym"],
    "age in years, months and days": parsers["diff-ymd"],
    "age in years and days": parsers["diff-yd"],
    "age in days": parsers["diff-d"],
    // 'birth date and age2': date,
    // 'age in years, months, weeks and days': true,
    // 'age as of date': true,
    // https://en.wikipedia.org/wiki/Template:As_of
    "as of": (tmpl) => {
      let obj = parser(tmpl, ["year", "month", "day"]);
      if (obj.alt) {
        return obj.alt;
      }
      let out = "As of ";
      if (obj.since) {
        out = "Since ";
      }
      if (obj.lc) {
        out = out.toLowerCase();
      }
      if (obj.bare) {
        out = "";
      }
      if (obj.pre) {
        out += obj.pre + " ";
      }
      let format = toTextBritish;
      if (obj.df == "US") {
        format = toText;
      }
      let dateObj = ymd([obj.year, obj.month, obj.day]);
      out += format(dateObj);
      if (obj.post) {
        out += obj.post;
      }
      return out;
    }
  };

  function parseDMS(arr) {
    let hemisphere = arr.pop();
    let degrees = Number(arr[0] || 0);
    let minutes = Number(arr[1] || 0);
    let seconds = Number(arr[2] || 0);
    if (typeof hemisphere !== "string" || isNaN(degrees)) {
      return null;
    }
    let sign = 1;
    if (/[SW]/i.test(hemisphere)) {
      sign = -1;
    }
    return sign * (degrees + minutes / 60 + seconds / 3600);
  }
  const round = function(num) {
    if (typeof num !== "number") {
      return num;
    }
    let places = 1e5;
    return Math.round(num * places) / places;
  };
  const negative = {
    s: true,
    w: true
  };
  const findLatLng = function(arr) {
    const types = arr.map((s) => typeof s).join("|");
    if (arr.length === 2 && types === "number|number") {
      return {
        lat: arr[0],
        lon: arr[1]
      };
    }
    if (arr.length === 4 && types === "number|string|number|string") {
      if (negative[arr[1].toLowerCase()]) {
        arr[0] *= -1;
      }
      if (arr[3].toLowerCase() === "w") {
        arr[2] *= -1;
      }
      return {
        lat: arr[0],
        lon: arr[2]
      };
    }
    if (arr.length === 6) {
      return {
        lat: parseDMS(arr.slice(0, 3)),
        lon: parseDMS(arr.slice(3))
      };
    }
    if (arr.length === 8) {
      return {
        lat: parseDMS(arr.slice(0, 4)),
        lon: parseDMS(arr.slice(4))
      };
    }
    return {};
  };
  const parseParams = function(obj) {
    obj.list = obj.list || [];
    obj.list = obj.list.map((str) => {
      let num = Number(str);
      if (!isNaN(num)) {
        return num;
      }
      let split = str.split(/:/);
      if (split.length > 1) {
        obj.props = obj.props || {};
        obj.props[split[0]] = split.slice(1).join(":");
        return null;
      }
      return str;
    });
    obj.list = obj.list.filter((s) => s !== null);
    return obj;
  };
  const parseCoor = function(tmpl) {
    let obj = parser(tmpl);
    obj = parseParams(obj);
    let tmp = findLatLng(obj.list);
    obj.lat = round(tmp.lat);
    obj.lon = round(tmp.lon);
    obj.template = "coord";
    delete obj.list;
    return obj;
  };

  const templates$1 = {
    coord: (tmpl, list) => {
      let obj = parseCoor(tmpl);
      list.push(obj);
      if (!obj.display || obj.display.indexOf("inline") !== -1) {
        return `${obj.lat || ""}\xB0N, ${obj.lon || ""}\xB0W`;
      }
      return "";
    }
  };

  const generic = function(tmpl, list, _parser, alias) {
    let obj = parser(tmpl);
    if (alias) {
      obj.name = obj.template;
      obj.template = alias;
    }
    list.push(obj);
    return "";
  };
  const misc = {
    persondata: generic,
    taxobox: generic,
    citation: generic,
    portal: generic,
    reflist: generic,
    "cite book": generic,
    "cite journal": generic,
    "cite web": generic,
    "commons cat": generic,
    "election box candidate": generic,
    "election box begin": generic,
    main: generic
  };

  const codes = {
    adx: "adx",
    //https://en.wikipedia.org/wiki/Template:Abu_Dhabi_Securities_Exchange
    aim: "aim",
    //https://en.wikipedia.org/wiki/Template:Alternative_Investment_Market
    amex: "amex",
    //https://en.wikipedia.org/wiki/Template:NYSE_American
    asx: "asx",
    //https://en.wikipedia.org/wiki/Template:Australian_Securities_Exchange
    athex: "athex",
    //https://en.wikipedia.org/wiki/Template:Athens_Exchange
    b3: "b3",
    //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa (redirects to B3 (stock exchange))
    "B3 (stock exchange)": "B3 (stock exchange)",
    //https://en.wikipedia.org/wiki/Template:B3_(stock_exchange)
    barbadosse: "barbadosse",
    //https://en.wikipedia.org/wiki/Template:Barbados_Stock_Exchange
    bbv: "bbv",
    //https://en.wikipedia.org/wiki/Template:La_Paz_Stock_Exchange
    bcba: "bcba",
    //https://en.wikipedia.org/wiki/Template:Buenos_Aires_Stock_Exchange
    bcs: "bcs",
    //https://en.wikipedia.org/wiki/Template:Santiago_Stock_Exchange
    bhse: "bhse",
    //https://en.wikipedia.org/wiki/Template:Bahrain_Bourse
    bist: "bist",
    //https://en.wikipedia.org/wiki/Template:Borsa_Istanbul
    bit: "bit",
    //https://en.wikipedia.org/wiki/Template:Borsa_Italiana
    "bm&f bovespa": "b3",
    //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
    "bm&f": "b3",
    //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
    bmad: "bmad",
    //https://en.wikipedia.org/wiki/Template:Bolsa_de_Madrid
    bmv: "bmv",
    //https://en.wikipedia.org/wiki/Template:Mexican_Stock_Exchange
    "bombay stock exchange": "bombay stock exchange",
    //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
    "botswana stock exchange": "botswana stock exchange",
    //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
    bpse: "bpse",
    //https://en.wikipedia.org/wiki/Template:Budapest_Stock_Exchange
    bse: "bse",
    //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
    bsx: "bsx",
    //https://en.wikipedia.org/wiki/Template:Bermuda_Stock_Exchange
    bvb: "bvb",
    //https://en.wikipedia.org/wiki/Template:Bucharest_Stock_Exchange
    bvc: "bvc",
    //https://en.wikipedia.org/wiki/Template:Colombian_Securities_Exchange
    bvl: "bvl",
    //https://en.wikipedia.org/wiki/Template:Lima_Stock_Exchange
    bvpasa: "bvpasa",
    //https://en.wikipedia.org/wiki/Template:BVPASA
    bwse: "bwse",
    //https://en.wikipedia.org/wiki/Template:Botswana_Stock_Exchange
    "canadian securities exchange": "canadian securities exchange",
    //https://en.wikipedia.org/wiki/Template:Canadian_Securities_Exchange
    cse: "cse",
    //https://en.wikipedia.org/wiki/Template:Chittagong_Stock_Exchange
    darse: "darse",
    //https://en.wikipedia.org/wiki/Template:Dar_es_Salaam_Stock_Exchange
    dfm: "dfm",
    //https://en.wikipedia.org/wiki/Template:Dubai_Financial_Market
    dse: "dse",
    //https://en.wikipedia.org/wiki/Template:Dhaka_Stock_Exchange
    euronext: "euronext",
    //https://en.wikipedia.org/wiki/Template:Euronext
    euronextparis: "euronextparis",
    //https://en.wikipedia.org/wiki/Template:EuronextParis
    fse: "fse",
    //https://en.wikipedia.org/wiki/Template:Fukuoka_Stock_Exchange
    fwb: "fwb",
    //https://en.wikipedia.org/wiki/Template:Frankfurt_Stock_Exchange
    gse: "gse",
    //https://en.wikipedia.org/wiki/Template:Ghana_Stock_Exchange
    gtsm: "gtsm",
    //https://en.wikipedia.org/wiki/Template:Gre_Tai_Securities_Market
    idx: "idx",
    //https://en.wikipedia.org/wiki/Template:Indonesia_Stock_Exchange
    ise: "ise",
    //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
    iseq: "iseq",
    //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
    isin: "isin",
    //https://en.wikipedia.org/wiki/Template:ISIN
    jasdaq: "jasdaq",
    //https://en.wikipedia.org/wiki/Template:JASDAQ
    jse: "jse",
    //https://en.wikipedia.org/wiki/Template:Johannesburg_Stock_Exchange
    kase: "kase",
    //https://en.wikipedia.org/wiki/Template:Kazakhstan_Stock_Exchange
    kn: "kn",
    //https://en.wikipedia.org/wiki/Template:Nairobi_Securities_Exchange
    krx: "krx",
    //https://en.wikipedia.org/wiki/Template:Korea_Exchange
    lse: "lse",
    //https://en.wikipedia.org/wiki/Template:London_Stock_Exchange
    luxse: "luxse",
    //https://en.wikipedia.org/wiki/Template:Luxembourg_Stock_Exchange
    "malta stock exchange": "malta stock exchange",
    //https://en.wikipedia.org/wiki/Template:Malta_Stock_Exchange
    mai: "mai",
    //https://en.wikipedia.org/wiki/Template:Market_for_Alternative_Investment
    mcx: "mcx",
    //https://en.wikipedia.org/wiki/Template:Moscow_Exchange
    mutf: "mutf",
    //https://en.wikipedia.org/wiki/Template:Mutual_fund
    myx: "myx",
    //https://en.wikipedia.org/wiki/Template:Bursa_Malaysia
    nag: "nag",
    //https://en.wikipedia.org/wiki/Template:Nagoya_Stock_Exchange
    "nasdaq dubai": "nasdaq dubai",
    //https://en.wikipedia.org/wiki/Template:NASDAQ_Dubai
    nasdaq: "nasdaq",
    //https://en.wikipedia.org/wiki/Template:NASDAQ
    neeq: "neeq",
    //https://en.wikipedia.org/wiki/Template:NEEQ
    nepse: "nepse",
    //https://en.wikipedia.org/wiki/Template:Nepal_Stock_Exchange
    nex: "nex",
    //https://en.wikipedia.org/wiki/Template:TSXV_NEX
    nse: "nse",
    //https://en.wikipedia.org/wiki/Template:National_Stock_Exchange_of_India
    newconnect: "newconnect",
    //https://en.wikipedia.org/wiki/Template:NewConnect
    "nyse arca": "nyse arca",
    //https://en.wikipedia.org/wiki/Template:NYSE_Arca
    nyse: "nyse",
    //https://en.wikipedia.org/wiki/Template:New_York_Stock_Exchange
    nzx: "nzx",
    //https://en.wikipedia.org/wiki/Template:New_Zealand_Exchange
    "omx baltic": "omx baltic",
    //https://en.wikipedia.org/wiki/Template:OMX_Baltic
    omx: "omx",
    //https://en.wikipedia.org/wiki/Template:OMX
    ose: "ose",
    //https://en.wikipedia.org/wiki/Template:Oslo_Stock_Exchange
    "otc expert": "otc expert",
    //https://en.wikipedia.org/wiki/Template:OTC_Expert
    "otc grey": "otc grey",
    //https://en.wikipedia.org/wiki/template:grey_market
    "otc pink": "otc pink",
    //https://en.wikipedia.org/wiki/Template:OTC_Pink
    otcqb: "otcqb",
    //https://en.wikipedia.org/wiki/Template:OTCQB
    otcqx: "otcqx",
    //https://en.wikipedia.org/wiki/Template:OTCQX
    "pfts ukraine stock exchange": "pfts ukraine stock exchange",
    //https://en.wikipedia.org/wiki/Template:PFTS_Ukraine_Stock_Exchange
    "philippine stock exchange": "philippine stock exchange",
    //https://en.wikipedia.org/wiki/Template:Philippine_Stock_Exchange
    prse: "prse",
    //https://en.wikipedia.org/wiki/Template:Prague_Stock_Exchange
    psx: "psx",
    //https://en.wikipedia.org/wiki/Template:Pakistan_Stock_Exchange
    karse: "karse",
    //https://en.wikipedia.org/w/index.php?title=Template:Karse&redirect=no (redirects to psx)
    qe: "qe",
    //https://en.wikipedia.org/wiki/Template:Qatar_Stock_Exchange
    "saudi stock exchange": "saudi stock exchange",
    //https://en.wikipedia.org/wiki/Template:Saudi_Stock_Exchange
    sehk: "sehk",
    //https://en.wikipedia.org/wiki/Template:Hong_Kong_Stock_Exchange
    "Stock Exchange of Thailand": "Stock Exchange of Thailand",
    //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand (alternative for SET)
    set: "set",
    //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand
    sgx: "sgx",
    //https://en.wikipedia.org/wiki/Template:Singapore_Exchange
    sse: "sse",
    //https://en.wikipedia.org/wiki/Template:Shanghai_Stock_Exchange
    swx: "swx",
    //https://en.wikipedia.org/wiki/Template:SIX_Swiss_Exchange
    szse: "szse",
    //https://en.wikipedia.org/wiki/Template:Shenzhen_Stock_Exchange
    tase: "tase",
    //https://en.wikipedia.org/wiki/Template:Tel_Aviv_Stock_Exchange
    "tsx-v": "tsx-v",
    //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
    tsx: "tsx",
    //https://en.wikipedia.org/wiki/Template:Toronto_Stock_Exchange
    tsxv: "tsxv",
    //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
    ttse: "ttse",
    //https://en.wikipedia.org/wiki/Template:Trinidad_and_Tobago_Stock_Exchange
    twse: "twse",
    //https://en.wikipedia.org/wiki/Template:Taiwan_Stock_Exchange
    tyo: "tyo",
    //https://en.wikipedia.org/wiki/Template:Tokyo_Stock_Exchange
    wbag: "wbag",
    //https://en.wikipedia.org/wiki/Template:Wiener_B%C3%B6rse
    wse: "wse",
    //https://en.wikipedia.org/wiki/Template:Warsaw_Stock_Exchange
    "zagreb stock exchange": "zagreb stock exchange",
    //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
    "zimbabwe stock exchange": "zimbabwe stock exchange",
    //https://en.wikipedia.org/wiki/Template:Zimbabwe_Stock_Exchange
    zse: "zse"
    //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
  };
  const parseStockExchange = (tmpl, list) => {
    let o = parser(tmpl, ["ticketnumber", "code"]);
    list.push(o);
    let code = o.template || "";
    if (code === "") {
      code = o.code;
    }
    code = (code || "").toLowerCase();
    let str = codes[code] || "";
    if (o.ticketnumber) {
      str = `${str}: ${o.ticketnumber}`;
    }
    if (o.code && !codes[o.code.toLowerCase()]) {
      str += " " + o.code;
    }
    return str;
  };
  const exchanges = {};
  Object.keys(codes).forEach((k) => {
    exchanges[k] = parseStockExchange;
  });

  const zeroPad = function(num) {
    num = String(num);
    if (num.length === 1) {
      num = "0" + num;
    }
    return num;
  };
  const parseTeam = function(obj, round, team) {
    if (obj[`rd${round}-team${zeroPad(team)}`]) {
      team = zeroPad(team);
    }
    let score = obj[`rd${round}-score${team}`];
    let num = Number(score);
    if (isNaN(num) === false) {
      score = num;
    }
    return {
      team: obj[`rd${round}-team${team}`],
      score,
      seed: obj[`rd${round}-seed${team}`]
    };
  };
  const playoffBracket = function(tmpl) {
    let rounds = [];
    let obj = parser(tmpl);
    for (let i = 1; i < 7; i += 1) {
      let round = [];
      for (let t = 1; t < 16; t += 2) {
        let key = `rd${i}-team`;
        if (obj[key + t] || obj[key + zeroPad(t)]) {
          let one = parseTeam(obj, i, t);
          let two = parseTeam(obj, i, t + 1);
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
      template: "playoffbracket",
      rounds
    };
  };

  let sports = {
    //playoff brackets
    "4teambracket": function(tmpl, list) {
      let obj = playoffBracket(tmpl);
      list.push(obj);
      return "";
    },
    "win draw lose": function(tmpl, list) {
      let obj = parser(tmpl);
      list.push(obj);
      let arr = obj.list || [];
      let draw = parseInt(arr[2]) || 0;
      let lose = parseInt(arr[3]) || 0;
      let win = parseInt(arr[1]) || 0;
      let total = win + draw + lose;
      let winPercentage = "";
      if (total > 0) {
        winPercentage = (win / total * 100).toFixed(1);
      }
      return "\n| " + arr.join("\n| ") + "\n| " + winPercentage + "%";
    },
    "win-loss record": function(tmpl, list) {
      let obj = parser(tmpl, ["w", "l", "t"]);
      list.push(obj);
      let str = `${obj.w}`;
      if (obj.t || obj.d) {
        str += `-${obj.t || obj.d}`;
      }
      str += `-${obj.l}`;
      return str;
    },
    player: (tmpl, list) => {
      let res = parser(tmpl, ["number", "country", "name", "dl"]);
      list.push(res);
      let str = `[[${res.name}]]`;
      if (res.country) {
        let country = (res.country || "").toLowerCase();
        let flag = flags.find((a) => country === a[1] || country === a[2]) || [];
        if (flag && flag[0]) {
          str = flag[0] + "  " + str;
        }
      }
      if (res.number) {
        str = res.number + " " + str;
      }
      return str;
    },
    //https://en.wikipedia.org/wiki/Template:Goal
    goal: (tmpl, list) => {
      let res = parser(tmpl);
      let obj = {
        template: "goal",
        data: []
      };
      let arr = res.list || [];
      for (let i = 0; i < arr.length; i += 2) {
        obj.data.push({
          min: arr[i],
          note: arr[i + 1] || ""
        });
      }
      list.push(obj);
      let summary = "\u26BD ";
      summary += obj.data.map((o) => {
        let note = o.note;
        if (note) {
          note = ` (${note})`;
        }
        return o.min + "'" + note;
      }).join(", ");
      return summary;
    },
    //a transcluded sports module - https://en.m.wikipedia.org/w/index.php?title=Special:WhatLinksHere/Module:Sports_table
    // https://en.wikipedia.org/wiki/Template:2020–21_NHL_North_Division_standings
    "sports table": (tmpl, list) => {
      let obj = parser(tmpl);
      let byTeam = {};
      let teams = Object.keys(obj).filter((k) => /^team[0-9]/.test(k)).map((k) => obj[k].toLowerCase());
      teams.forEach((team) => {
        byTeam[team] = {
          name: obj[`name_${team}`],
          win: Number(obj[`win_${team}`]) || 0,
          loss: Number(obj[`loss_${team}`]) || 0,
          tie: Number(obj[`tie_${team}`]) || 0,
          otloss: Number(obj[`otloss_${team}`]) || 0,
          goals_for: Number(obj[`gf_${team}`]) || 0,
          goals_against: Number(obj[`ga_${team}`]) || 0
        };
      });
      let res = {
        date: obj.update,
        header: obj.table_header,
        teams: byTeam
      };
      list.push(res);
    },
    // college baseketball rosters
    "cbb roster/header": function() {
      return `{| class="wikitable"
    |-
    ! POS
    ! #
    ! Name
    ! Height
    ! Weight
    ! Year
    ! Previous School
    ! Hometown
    |-
`;
    },
    "cbb roster/player": function(tmpl, list) {
      let data = parser(tmpl);
      list.push(data);
      return `|-
| ${data.pos || ""}
| ${data.num || ""}
| ${data.first || ""} ${data.last || ""}
| ${data.ft || ""}${data.in || ""}
| ${data.lbs || ""}
| ${data.class || ""}
| ${data.high_school || ""}
| ${data.home || ""}
`;
    },
    "cbb roster/footer": function() {
      return `
|}`;
    }
  };

  var bothTmpl = Object.assign(
    {},
    shorthand,
    templates$3,
    templates$2,
    dates,
    templates$1,
    misc,
    exchanges,
    playoffBracket,
    sports
  );

  let templates = Object.assign({}, textTmpl, dataTmpl, bothTmpl);
  Object.keys(aliases).forEach((k) => {
    if (templates[aliases[k]] === void 0) {
      console.error(`Missing template: '${aliases[k]}'`);
    }
    templates[k] = templates[aliases[k]];
  });

  const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const parseTemplate = function(tmpl, doc) {
    let name = tmpl.name;
    if (ignore.hasOwnProperty(name) === true) {
      return [""];
    }
    if (isInfobox(name) === true) {
      let obj = parser(tmpl.body, [], "raw");
      return ["", fmtInfobox(obj)];
    }
    if (/^cite [a-z]/.test(name) === true) {
      let obj = parser(tmpl.body);
      obj.type = obj.template;
      obj.template = "citation";
      return ["", obj];
    }
    if (templates.hasOwnProperty(name) === true) {
      if (typeof templates[name] === "number") {
        let obj = parser(tmpl.body, nums);
        let key = String(templates[name]);
        return [obj[key] || ""];
      }
      if (typeof templates[name] === "string") {
        return [templates[name]];
      }
      if (isArray(templates[name]) === true) {
        let obj = parser(tmpl.body, templates[name]);
        return ["", obj];
      }
      if (isObject(templates[name]) === true) {
        let obj = parser(tmpl.body, templates[name].props);
        return [obj[templates[name].out], obj];
      }
      if (typeof templates[name] === "function") {
        let arr = [];
        let txt = templates[name](tmpl.body, arr, parser, null, doc);
        return [txt, arr[0]];
      }
    }
    if (doc && doc._templateFallbackFn) {
      let arr = [];
      let txt = doc._templateFallbackFn(tmpl.body, arr, parser, null, doc);
      if (txt !== null) {
        return [txt, arr[0]];
      }
    }
    let json = parser(tmpl.body);
    if (Object.keys(json).length === 0) {
      json = null;
    }
    return ["", json];
  };

  const toJson = function(infobox, options) {
    let json = Object.keys(infobox.data).reduce((h, k) => {
      if (infobox.data[k]) {
        h[k] = infobox.data[k].json();
      }
      return h;
    }, {});
    if (options.encode === true) {
      json = encodeObj(json);
    }
    return json;
  };

  var latLngs = [
    ["latitude", "longitude"],
    //english
    ["lat", "lng"],
    ["breitengrad", "l\xE4ngengrad"],
    //german
    ["latitud", "longitud"],
    //spanish
    ["zem\u011Bpisn\xE1 \u0161\xED\u0159ka", "zem\u011Bpisn\xE1 d\xE9lka"],
    //czech
    ["\u0448\u0438\u0440", "\u0434\u043E\u043B\u0433"]
    //russian
  ];

  const normalize = (str = "") => {
    str = str.toLowerCase();
    str = str.replace(/[-_]/g, " ");
    return str.trim();
  };
  class Infobox {
    constructor(obj, wiki) {
      this._type = obj.type;
      this.domain = obj.domain;
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: obj.data
      });
      Object.defineProperty(this, "wiki", {
        enumerable: false,
        value: wiki
      });
    }
    type() {
      return this._type;
    }
    template() {
      return this.type();
    }
    links(n) {
      let arr = [];
      Object.keys(this.data).forEach((k) => {
        this.data[k].links().forEach((l) => arr.push(l));
      });
      if (typeof n === "string") {
        n = n.charAt(0).toUpperCase() + n.substring(1);
        let link = arr.find((o) => o.page() === n);
        return link === void 0 ? [] : [link];
      }
      return arr;
    }
    image() {
      let s = this.data.image || this.data.image2 || this.data.logo || this.data.image_skyline || this.data.image_flag;
      if (!s) {
        return null;
      }
      let obj = s.json();
      let file = obj.text;
      obj.file = file;
      obj.text = "";
      obj.caption = this.data.caption;
      obj.domain = this.domain;
      return new Image(obj);
    }
    images() {
      return this.image();
    }
    get(keys) {
      let allKeys = Object.keys(this.data);
      if (typeof keys === "string") {
        let key = normalize(keys);
        for (let i = 0; i < allKeys.length; i += 1) {
          let tmp = normalize(allKeys[i]);
          if (key === tmp) {
            return this.data[allKeys[i]];
          }
        }
        return new Sentence();
      }
      if (isArray(keys)) {
        keys = keys.map(normalize);
        return keys.map((k) => {
          for (let i = 0; i < allKeys.length; i += 1) {
            let tmp = normalize(allKeys[i]);
            if (k === tmp) {
              return this.data[allKeys[i]];
            }
          }
          return new Sentence();
        });
      }
      return new Sentence();
    }
    text() {
      return "";
    }
    json(options) {
      options = options || {};
      return toJson(this, options);
    }
    wikitext() {
      return this.wiki || "";
    }
    keyValue() {
      return Object.keys(this.data).reduce((h, k) => {
        if (this.data[k]) {
          h[k] = this.data[k].text();
        }
        return h;
      }, {});
    }
    coordinates() {
      var _a, _b, _c, _d;
      for (let i = 0; i < latLngs.length; i += 1) {
        let a = latLngs[i];
        let lat = (_b = (_a = this.get(a[0])) == null ? void 0 : _a.json()) == null ? void 0 : _b.number;
        let lon = (_d = (_c = this.get(a[1])) == null ? void 0 : _c.json()) == null ? void 0 : _d.number;
        if (lat && lon) {
          return { template: "infobox/lat-long", lat, lon };
        }
      }
      return null;
    }
  }

  class Reference {
    constructor(data, wiki) {
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: data
      });
      Object.defineProperty(this, "wiki", {
        enumerable: false,
        value: wiki
      });
    }
    title() {
      let data = this.data;
      return data.title || data.encyclopedia || data.author || "";
    }
    links() {
      return [];
    }
    text() {
      return "";
    }
    wikitext() {
      return this.wiki || "";
    }
    json(options = {}) {
      let json = this.data || {};
      if (options.encode === true) {
        json = Object.assign({}, json);
        json = encodeObj(json);
      }
      return json;
    }
  }

  class Template {
    constructor(data, text = "", wiki = "") {
      Object.defineProperty(this, "data", {
        enumerable: false,
        value: data
      });
      Object.defineProperty(this, "_text", {
        enumerable: false,
        value: text
      });
      Object.defineProperty(this, "wiki", {
        enumerable: false,
        value: wiki
      });
    }
    text() {
      let str = this._text || "";
      return fromText(str).text();
    }
    json() {
      return this.data || {};
    }
    wikitext() {
      return this.wiki || "";
    }
  }

  const isCitation = /^(cite |citation)/i;
  const referenceTypes = {
    citation: true,
    refn: true,
    harvnb: true,
    source: true
    //wikinews
  };
  const sortOut = function(list, domain) {
    let res = {
      infoboxes: [],
      templates: [],
      references: []
    };
    list.forEach((obj) => {
      let json = obj.json;
      let kind = json.template || json.type || json.name;
      if (referenceTypes[kind] === true || isCitation.test(kind) === true) {
        res.references.push(new Reference(json, obj.wiki));
        return;
      }
      if (json.template === "infobox" && json.subbox !== "yes") {
        json.domain = domain;
        json.data = json.data || {};
        res.infoboxes.push(new Infobox(json, obj.wiki));
        return;
      }
      res.templates.push(new Template(json, obj.text, obj.wiki));
    });
    return res;
  };

  const allTemplates = function(wiki, doc) {
    let list = [];
    let nested = findTemplates(wiki);
    const parseNested = function(obj, parent) {
      obj.parent = parent;
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach((ch) => parseNested(ch, obj));
      }
      let [text, json] = parseTemplate(obj, doc);
      obj.wiki = text;
      if (json) {
        list.push({
          name: obj.name,
          wiki: obj.body,
          nested: Boolean(obj.parent),
          text,
          json
        });
      }
      const removeIt = function(node, body, out) {
        if (node.parent) {
          node.parent.body = node.parent.body.replace(body, out);
          removeIt(node.parent, body, out);
        }
      };
      removeIt(obj, obj.body, obj.wiki);
      wiki = wiki.replace(obj.body, obj.wiki);
    };
    nested.forEach((node) => parseNested(node, null));
    nested.forEach((node) => {
      wiki = wiki.replace(node.body, node.wiki);
    });
    return { list, wiki };
  };
  const process = function(section, doc) {
    let { list, wiki } = allTemplates(section._wiki, doc);
    let domain = doc ? doc._domain : null;
    let { infoboxes, references, templates } = sortOut(list, domain);
    section._infoboxes = section._infoboxes || [];
    section._references = section._references || [];
    section._templates = section._templates || [];
    section._infoboxes = section._infoboxes.concat(infoboxes);
    section._references = section._references.concat(references);
    section._templates = section._templates.concat(templates);
    section._wiki = wiki;
  };

  const hasCitation = function(str) {
    return /^ *\{\{ *(cite|citation)/i.test(str) && /\}\} *$/.test(str) && /citation needed/i.test(str) === false;
  };
  const parseCitation = function(tmpl) {
    let obj = parser(tmpl);
    obj.type = obj.template.replace(/cite /, "");
    obj.template = "citation";
    return obj;
  };
  const parseInline = function(str) {
    let obj = fromText(str) || {};
    return {
      template: "citation",
      type: "inline",
      data: {},
      inline: obj
    };
  };
  const parseRefs = function(section) {
    let references = [];
    let wiki = section._wiki;
    wiki = wiki.replace(/ ?<ref>([\s\S]{0,4000}?)<\/ref> ?/gi, function(all, txt) {
      let found = false;
      let arr = findFlat(txt);
      arr.forEach((tmpl) => {
        if (hasCitation(tmpl)) {
          let obj = parseCitation(tmpl);
          if (obj) {
            references.push({ json: obj, wiki: all });
            found = true;
          }
          wiki = wiki.replace(tmpl, "");
        }
      });
      if (!found) {
        references.push({ json: parseInline(txt), wiki: all });
      }
      return " ";
    });
    wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, " ");
    wiki = wiki.replace(/ ?<ref [^>]{0,200}>([\s\S]{0,1800}?)<\/ref> ?/gi, function(all, txt) {
      let found = false;
      let arr = findFlat(txt);
      arr.forEach((tmpl) => {
        if (hasCitation(tmpl)) {
          let obj = parseCitation(tmpl);
          if (obj) {
            references.push({ json: obj, wiki: all });
            found = true;
          }
          wiki = wiki.replace(tmpl, "");
        }
      });
      if (!found) {
        references.push({ json: parseInline(txt), wiki: all });
      }
      return " ";
    });
    wiki = wiki.replace(/ ?<[ /]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ /]?> ?/g, " ");
    section._references = references.map((obj) => new Reference(obj.json, obj.wiki));
    section._wiki = wiki;
  };

  const parseGallery = function(catcher, doc, section) {
    catcher.text = catcher.text.replace(/<gallery([^>]*)>([\s\S]+)<\/gallery>/g, (_, _attrs, inside) => {
      let images = inside.split(/\n/g);
      images = images.filter((str) => str && str.trim() !== "");
      images = images.map((str) => {
        let arr = str.split(/\|/);
        let obj = {
          file: arr[0].trim(),
          lang: doc.lang(),
          domain: doc.domain()
        };
        let img = new Image(obj).json();
        let caption = arr.slice(1).join("|");
        if (caption !== "") {
          img.caption = fromText(caption);
        }
        return img;
      });
      if (images.length > 0) {
        catcher.templates.push({
          template: "gallery",
          images,
          pos: section.title
        });
      }
      return "";
    });
  };

  const parseElection = function(catcher, doc) {
    catcher.text = catcher.text.replace(/\{\{election box begin([\s\S]+?)\{\{election box end\}\}/gi, (tmpl) => {
      let data = {
        _wiki: tmpl,
        _templates: []
      };
      process(data, doc);
      let templates = data._templates.map((t) => t.json());
      let start = templates.find((t) => t.template === "election box") || {};
      let candidates = templates.filter((t) => t.template === "election box candidate");
      let summary = templates.find((t) => t.template === "election box gain" || t.template === "election box hold") || {};
      if (candidates.length > 0 || summary) {
        catcher.templates.push({
          template: "election box",
          title: start.title,
          candidates,
          summary: summary.data
        });
      }
      return "";
    });
  };

  const keys = {
    coach: ["team", "year", "g", "w", "l", "w-l%", "finish", "pg", "pw", "pl", "pw-l%"],
    player: ["year", "team", "gp", "gs", "mpg", "fg%", "3p%", "ft%", "rpg", "apg", "spg", "bpg", "ppg"],
    roster: ["player", "gp", "gs", "mpg", "fg%", "3fg%", "ft%", "rpg", "apg", "spg", "bpg", "ppg"]
  };
  const parseNBA = function(catcher) {
    catcher.text = catcher.text.replace(
      /\{\{nba (coach|player|roster) statistics start([\s\S]+?)\{\{s-end\}\}/gi,
      (tmpl, name) => {
        tmpl = tmpl.replace(/^\{\{.*?\}\}/, "");
        tmpl = tmpl.replace(/\{\{s-end\}\}/, "");
        name = name.toLowerCase().trim();
        let headers = "! " + keys[name].join(" !! ");
        let table = "{|\n" + headers + "\n" + tmpl + "\n|}";
        let rows = parseTable(table);
        rows = rows.map((row) => {
          Object.keys(row).forEach((k) => {
            row[k] = row[k].text();
          });
          return row;
        });
        catcher.templates.push({
          template: "NBA " + name + " statistics",
          data: rows
        });
        return "";
      }
    );
  };

  const whichHeadings = function(tmpl) {
    let headings = ["#", "date", "opponent", "score", "win", "loss", "save", "attendance", "record"];
    if (/\|stadium=y/i.test(tmpl) === true) {
      headings.splice(7, 0, "stadium");
    }
    if (/\|time=y/i.test(tmpl) === true) {
      headings.splice(7, 0, "time");
    }
    if (/\|box=y/i.test(tmpl) === true) {
      headings.push("box");
    }
    return headings;
  };
  const parseMlb = function(catcher) {
    catcher.text = catcher.text.replace(/\{\{mlb game log /gi, "{{game log ");
    catcher.text = catcher.text.replace(
      /\{\{game log (section|month)[\s\S]+?\{\{game log (section|month) end\}\}/gi,
      (tmpl) => {
        let headings = whichHeadings(tmpl);
        tmpl = tmpl.replace(/^\{\{.*?\}\}/, "");
        tmpl = tmpl.replace(/\{\{game log (section|month) end\}\}/i, "");
        let headers = "! " + headings.join(" !! ");
        let table = "{|\n" + headers + "\n" + tmpl + "\n|}";
        let rows = parseTable(table);
        rows = rows.map((row) => {
          Object.keys(row).forEach((k) => {
            row[k] = row[k].text();
          });
          return row;
        });
        catcher.templates.push({
          template: "mlb game log section",
          data: rows
        });
        return "";
      }
    );
  };

  let headings = ["res", "record", "opponent", "method", "event", "date", "round", "time", "location", "notes"];
  const parseMMA = function(catcher) {
    catcher.text = catcher.text.replace(/\{\{mma record start[\s\S]+?\{\{end\}\}/gi, (tmpl) => {
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, "");
      tmpl = tmpl.replace(/\{\{end\}\}/i, "");
      let headers = "! " + headings.join(" !! ");
      let table = "{|\n" + headers + "\n" + tmpl + "\n|}";
      let rows = parseTable(table);
      rows = rows.map((row) => {
        Object.keys(row).forEach((k) => {
          row[k] = row[k].text();
        });
        return row;
      });
      catcher.templates.push({
        template: "mma record start",
        data: rows
      });
      return "";
    });
  };

  const parseMath = function(catcher) {
    catcher.text = catcher.text.replace(/<math([^>]*)>([\s\S]*?)<\/math>/g, (_, attrs, inside) => {
      let formula = fromText(inside).text();
      catcher.templates.push({
        template: "math",
        formula,
        raw: inside
      });
      if (formula && formula.length < 12) {
        return formula;
      }
      return "";
    });
    catcher.text = catcher.text.replace(/<chem([^>]*)>([\s\S]*?)<\/chem>/g, (_, attrs, inside) => {
      catcher.templates.push({
        template: "chem",
        data: inside
      });
      return "";
    });
  };

  const xmlTemplates = function(section, doc) {
    const res = {
      templates: [],
      text: section._wiki
    };
    parseElection(res, doc);
    parseGallery(res, doc, section);
    parseMath(res);
    parseMlb(res);
    parseMMA(res);
    parseNBA(res);
    res.templates = res.templates.map((obj) => new Template(obj));
    return res;
  };

  const defaults$2 = {
    tables: true,
    references: true,
    paragraphs: true,
    templates: true,
    infoboxes: true
  };
  const getNth = function(arr, clue) {
    if (typeof clue === "number") {
      return arr[clue] || null;
    }
    return arr[0] || null;
  };
  class Section {
    constructor(data, doc) {
      let props = {
        doc,
        title: data.title || "",
        depth: data.depth,
        wiki: data.wiki || "",
        templates: [],
        tables: [],
        infoboxes: [],
        references: [],
        paragraphs: []
      };
      Object.keys(props).forEach((k) => {
        Object.defineProperty(this, "_" + k, {
          enumerable: false,
          writable: true,
          value: props[k]
        });
      });
      const startEndTemplates = xmlTemplates(this, doc);
      this._wiki = startEndTemplates.text;
      this._templates = this._templates.concat(startEndTemplates.templates);
      parseRefs(this);
      process(this, doc);
      findTables(this);
      parseParagraphs(this, doc);
    }
    title() {
      return this._title || "";
    }
    index() {
      if (!this._doc) {
        return null;
      }
      let index = this._doc.sections().indexOf(this);
      if (index === -1) {
        return null;
      }
      return index;
    }
    depth() {
      return this._depth;
    }
    indentation() {
      return this.depth();
    }
    sentences(clue) {
      return this.paragraphs().reduce((list, p) => {
        return list.concat(p.sentences());
      }, []);
    }
    paragraphs(clue) {
      return this._paragraphs || [];
    }
    links(clue) {
      let arr = [];
      this.infoboxes().forEach((templ) => {
        arr.push(templ.links());
      });
      this.sentences().forEach((s) => {
        arr.push(s.links());
      });
      this.tables().forEach((t) => {
        arr.push(t.links());
      });
      this.lists().forEach((list) => {
        arr.push(list.links());
      });
      arr = arr.reduce((acc, val) => acc.concat(val), []).filter((val) => val !== void 0);
      if (typeof clue === "string") {
        let link = arr.find((o) => o.page().toLowerCase() === clue.toLowerCase());
        return link === void 0 ? [] : [link];
      }
      return arr;
    }
    tables(clue) {
      return this._tables || [];
    }
    templates(clue) {
      let arr = this._templates || [];
      if (typeof clue === "string") {
        clue = clue.toLowerCase();
        return arr.filter((o) => o.data.template === clue || o.data.name === clue);
      }
      return arr;
    }
    infoboxes(clue) {
      let arr = this._infoboxes || [];
      if (typeof clue === "string") {
        clue = clue.replace(/^infobox /i, "");
        clue = clue.trim().toLowerCase();
        return arr.filter((info) => info._type === clue);
      }
      return arr;
    }
    coordinates(clue) {
      let arr = [...this.templates("coord"), ...this.templates("coor")];
      let list = arr.map((tmpl) => tmpl.json());
      let inf = this.infoboxes()[0];
      if (inf && inf.coordinates()) {
        list.push(inf.coordinates());
      }
      return list;
    }
    lists(clue) {
      let arr = [];
      this.paragraphs().forEach((p) => {
        arr = arr.concat(p.lists());
      });
      return arr;
    }
    interwiki() {
      let arr = [];
      this.paragraphs().forEach((p) => {
        arr = arr.concat(p.interwiki());
      });
      return arr;
    }
    images(clue) {
      let arr = [];
      this.paragraphs().forEach((p) => {
        arr = arr.concat(p.images());
      });
      return arr;
    }
    references(clue) {
      return this._references || [];
    }
    //transformations
    remove() {
      if (!this._doc) {
        return null;
      }
      let bads = {};
      bads[this.title()] = true;
      this.children().forEach((sec) => bads[sec.title()] = true);
      let sections = this._doc.sections();
      sections = sections.filter((sec) => bads.hasOwnProperty(sec.title()) !== true);
      this._doc._sections = sections;
      return this._doc;
    }
    //move-around sections like in jquery
    nextSibling() {
      if (!this._doc) {
        return null;
      }
      let sections = this._doc.sections();
      let index = this.index() || 0;
      for (let i = index + 1; i < sections.length; i++) {
        if (sections[i].depth() < this.depth()) {
          return null;
        }
        if (sections[i].depth() === this.depth()) {
          return sections[i];
        }
      }
      return null;
    }
    next() {
      return this.nextSibling();
    }
    lastSibling() {
      if (!this._doc) {
        return null;
      }
      let sections = this._doc.sections();
      let index = this.index() || 0;
      for (let i = index - 1; i >= 0; i--) {
        if (sections[i].depth() < this.depth()) {
          return null;
        }
        if (sections[i].depth() === this.depth()) {
          return sections[i];
        }
      }
      return null;
    }
    last() {
      return this.lastSibling();
    }
    previousSibling() {
      return this.lastSibling();
    }
    previous() {
      return this.lastSibling();
    }
    children(clue) {
      if (!this._doc) {
        return null;
      }
      let sections = this._doc.sections();
      let index = this.index() || 0;
      let children = [];
      if (sections[index + 1] && sections[index + 1].depth() > this.depth()) {
        for (let i = index + 1; i < sections.length; i += 1) {
          if (sections[i].depth() > this.depth()) {
            children.push(sections[i]);
          } else {
            break;
          }
        }
      }
      if (typeof clue === "string") {
        return children.find((s) => s.title().toLowerCase() === clue.toLowerCase());
      }
      return children;
    }
    sections(clue) {
      return this.children(clue);
    }
    parent() {
      if (!this._doc) {
        return null;
      }
      let sections = this._doc.sections();
      let index = this.index() || 0;
      for (let i = index; i >= 0; i -= 1) {
        if (sections[i] && sections[i].depth() < this.depth()) {
          return sections[i];
        }
      }
      return null;
    }
    //outputs
    text(options) {
      options = setDefaults(options, defaults$2);
      return this.paragraphs().map((p) => p.text(options)).join("\n\n");
    }
    wikitext() {
      return this._wiki;
    }
    json(options) {
      options = setDefaults(options, defaults$2);
      return toJSON$1(this, options);
    }
    citations(clue) {
      return this.references(clue);
    }
    // singular aliases
    sentence(clue) {
      return getNth(this.sentences(clue), clue);
    }
    paragraph(clue) {
      return getNth(this.paragraphs(clue), clue);
    }
    link(clue) {
      return getNth(this.links(clue), clue);
    }
    table(clue) {
      return getNth(this.tables(clue), clue);
    }
    template(clue) {
      return getNth(this.templates(clue), clue);
    }
    infobox(clue) {
      return getNth(this.infoboxes(clue), clue);
    }
    coordinate(clue) {
      return getNth(this.coordinates(clue), clue);
    }
    list(clue) {
      return getNth(this.lists(clue), clue);
    }
    image(clue) {
      return getNth(this.images(clue), clue);
    }
    reference(clue) {
      return getNth(this.references(clue), clue);
    }
    citation(clue) {
      return getNth(this.citations(clue), clue);
    }
  }

  const heading_reg = /^(={1,6})(.{1,200}?)={1,6}$/;
  const hasTemplate = /\{\{.+?\}\}/;
  const doInlineTemplates = function(wiki, doc) {
    let list = findTemplates(wiki);
    list.forEach((item) => {
      let [txt] = parseTemplate(item, doc);
      wiki = wiki.replace(item.body, txt);
    });
    return wiki;
  };
  const parseHeading = function(section, str, doc) {
    let m = str.match(heading_reg);
    if (!m) {
      section.title = "";
      section.depth = 0;
      return section;
    }
    let title = m[2] || "";
    title = fromText(title).text();
    if (hasTemplate.test(title)) {
      title = doInlineTemplates(title, doc);
    }
    let obj = { _wiki: title };
    parseRefs(obj);
    title = obj._wiki;
    title = trim_whitespace(title);
    let depth = 0;
    if (m[1]) {
      depth = m[1].length - 2;
    }
    section.title = title;
    section.depth = depth;
    return section;
  };

  const isReference = new RegExp("^(" + references.join("|") + "):?", "i");
  const section_reg = /(?:\n|^)(={2,6}.{1,200}?={2,6})/g;
  const removeReferenceSection = function(sections) {
    return sections.filter((s, i) => {
      if (isReference.test(s.title()) === true) {
        if (s.paragraphs().length > 0) {
          return true;
        }
        if (s.templates().length > 0) {
          return true;
        }
        if (sections[i + 1] && sections[i + 1].depth() > s.depth()) {
          sections[i + 1]._depth -= 1;
        }
        return false;
      }
      return true;
    });
  };
  const parseSections = function(doc) {
    let sections = [];
    let splits = doc._wiki.split(section_reg);
    for (let i = 0; i < splits.length; i += 2) {
      let heading = splits[i - 1] || "";
      let wiki = splits[i] || "";
      if (wiki === "" && heading === "") {
        continue;
      }
      let data = {
        title: "",
        depth: null,
        wiki
      };
      parseHeading(data, heading, doc);
      sections.push(new Section(data, doc));
    }
    return removeReferenceSection(sections);
  };

  const cat_reg = new RegExp("\\[\\[(" + _categories.join("|") + "):(.{2,178}?)]](w{0,10})", "gi");
  const cat_remove_reg = new RegExp("^\\[\\[:?(" + _categories.join("|") + "):", "gi");
  const parse_categories = function(wiki) {
    const categories = [];
    let tmp = wiki.match(cat_reg);
    if (tmp) {
      tmp.forEach(function(c) {
        c = c.replace(cat_remove_reg, "");
        c = c.replace(/\|?[ *]?\]\]$/, "");
        c = c.replace(/\|.*/, "");
        if (c && !c.match(/[[\]]/)) {
          categories.push(c.trim());
        }
      });
    }
    const newWiki = wiki.replace(cat_reg, "");
    return [categories, newWiki];
  };

  const defaults$1 = {
    tables: true,
    lists: true,
    paragraphs: true
  };
  class Document {
    constructor(wiki, options) {
      options = options || {};
      this._options = options;
      let userAgent = options.userAgent || options["User-Agent"] || options["Api-User-Agent"];
      userAgent = userAgent || "User of the wtf_wikipedia library";
      let props = {
        title: options.title || null,
        type: "page",
        userAgent,
        redirectTo: null,
        wiki: wiki || "",
        categories: [],
        sections: [],
        coordinates: [],
        templateFallbackFn: options.templateFallbackFn || null,
        revisionID: options.revisionID || null,
        timestamp: options.timestamp || null,
        description: options.description || null,
        wikidata: options.wikidata || null,
        pageImage: options.pageImage || null,
        pageID: options.pageID || options.id || null,
        namespace: options.namespace || options.ns || null,
        lang: options.lang || options.language || null,
        domain: options.domain || null
      };
      Object.keys(props).forEach((k) => {
        Object.defineProperty(this, "_" + k, {
          enumerable: false,
          writable: true,
          value: props[k]
        });
      });
      if (isRedirect(this._wiki) === true) {
        this._type = "redirect";
        this._redirectTo = parse(this._wiki);
        const [categories2, newWiki2] = parse_categories(this._wiki);
        this._categories = categories2;
        this._wiki = newWiki2;
        return;
      }
      this._wiki = preProcess(this._wiki);
      const [categories, newWiki] = parse_categories(this._wiki);
      this._categories = categories;
      this._wiki = newWiki;
      this._sections = parseSections(this);
    }
    // if no title is set, guess it from a bolded phrase in the first sentence
    title(str) {
      if (str !== void 0) {
        this._title = str;
        return str;
      }
      if (this._title) {
        return this._title;
      }
      let guess = null;
      let sen = this.sentences()[0];
      if (sen) {
        guess = sen.bold() || null;
      }
      return guess;
    }
    pageID(id) {
      if (id !== void 0) {
        this._pageID = id;
      }
      return this._pageID || null;
    }
    wikidata(id) {
      if (id !== void 0) {
        this._wikidata = id;
      }
      return this._wikidata || null;
    }
    domain(str) {
      if (str !== void 0) {
        this._domain = str;
      }
      return this._domain || null;
    }
    language(lang) {
      if (lang !== void 0) {
        this._lang = lang;
      }
      return this._lang || null;
    }
    // falls back to 'en' and 'wikipedia.org' when language or domain are missing
    url() {
      let title = this.title();
      if (!title) {
        return null;
      }
      let lang = this.language() || "en";
      let domain = this.domain() || "wikipedia.org";
      title = title.replace(/ /g, "_");
      title = encodeURIComponent(title);
      return `https://${lang}.${domain}/wiki/${title}`;
    }
    namespace(ns) {
      if (ns !== void 0) {
        this._namespace = ns;
      }
      return this._namespace || null;
    }
    isRedirect() {
      return this._type === "redirect";
    }
    isStub() {
      return isStub(this);
    }
    redirectTo() {
      return this._redirectTo;
    }
    isDisambiguation() {
      return isDisambig(this);
    }
    categories(clue) {
      let arr = this._categories || [];
      if (typeof clue === "number") {
        return [arr[clue]];
      }
      return arr;
    }
    sections(clue) {
      let arr = this._sections || [];
      arr.forEach((sec) => {
        sec._doc = this;
      });
      if (typeof clue === "string") {
        let str = clue.toLowerCase().trim();
        return arr.filter((s) => {
          return s.title().toLowerCase() === str;
        });
      } else if (typeof clue === "number") {
        return [arr[clue]];
      }
      return arr;
    }
    paragraphs(clue) {
      let arr = [];
      this.sections().forEach((s) => {
        arr = arr.concat(s.paragraphs());
      });
      if (typeof clue === "number") {
        return [arr[clue]];
      }
      return arr;
    }
    sentences(clue) {
      let arr = [];
      this.sections().forEach((sec) => {
        arr = arr.concat(sec.sentences());
      });
      if (typeof clue === "number") {
        return [arr[clue]];
      }
      return arr;
    }
    // searches the whole page, including infobox and gallery templates, for images
    images(clue) {
      let arr = sectionMap(this, "images", null);
      this.infoboxes().forEach((info) => {
        let img = info.image();
        if (img) {
          arr.unshift(img);
        }
      });
      this.templates().forEach((obj) => {
        if (obj.data.template === "gallery") {
          obj.data.images = obj.data.images || [];
          obj.data.images.forEach((img) => {
            if (!(img instanceof Image)) {
              img.language = this.language();
              img.domain = this.domain();
              img = new Image(img);
            }
            arr.push(img);
          });
        }
      });
      if (typeof clue === "number") {
        return [arr[clue]];
      }
      return arr;
    }
    links(clue) {
      return sectionMap(this, "links", clue);
    }
    interwiki(clue) {
      return sectionMap(this, "interwiki", clue);
    }
    lists(clue) {
      return sectionMap(this, "lists", clue);
    }
    tables(clue) {
      return sectionMap(this, "tables", clue);
    }
    templates(clue) {
      return sectionMap(this, "templates", clue);
    }
    references(clue) {
      return sectionMap(this, "references", clue);
    }
    citations(clue) {
      return this.references(clue);
    }
    coordinates(clue) {
      return sectionMap(this, "coordinates", clue);
    }
    infoboxes(clue) {
      let arr = sectionMap(this, "infoboxes", clue);
      arr = arr.sort((a, b) => {
        if (Object.keys(a.data).length > Object.keys(b.data).length) {
          return -1;
        }
        return 1;
      });
      return arr;
    }
    text(options) {
      options = setDefaults(options, defaults$1);
      if (this.isRedirect() === true) {
        return "";
      }
      let arr = this.sections().map((sec) => sec.text(options));
      return arr.join("\n\n");
    }
    json(options) {
      return toJSON$2(this, options);
    }
    wikitext() {
      return this._wiki || "";
    }
    debug() {
      console.log("\n");
      this.sections().forEach((sec) => {
        let indent = " - ";
        for (let i = 0; i < sec.depth(); i += 1) {
          indent = " -" + indent;
        }
        console.log(indent + (sec.title() || "(Intro)"));
      });
      return this;
    }
    revisionID(id) {
      if (id !== void 0) {
        this._revisionID = id;
      }
      return this._revisionID || null;
    }
    timestamp(str) {
      if (str !== void 0) {
        this._timestamp = str;
      }
      return this._timestamp || null;
    }
    description(str) {
      if (str !== void 0) {
        this._description = str;
      }
      return this._description || null;
    }
    pageImage(str) {
      if (str !== void 0) {
        this._pageImage = str;
      }
      let file = this._pageImage || null;
      return new Image({ file });
    }
    options() {
      return this._options;
    }
    // singular aliases
    category(clue) {
      return this.categories(clue)[0] || null;
    }
    section(clue) {
      return this.sections(clue)[0] || null;
    }
    paragraph(clue) {
      return this.paragraphs(clue)[0] || null;
    }
    sentence(clue) {
      return this.sentences(clue)[0] || null;
    }
    image(clue) {
      return this.images(clue)[0] || null;
    }
    link(clue) {
      return this.links(clue)[0] || null;
    }
    list(clue) {
      return this.lists(clue)[0] || null;
    }
    table(clue) {
      return this.tables(clue)[0] || null;
    }
    template(clue) {
      return this.templates(clue)[0] || null;
    }
    reference(clue) {
      return this.references(clue)[0] || null;
    }
    citation(clue) {
      return this.citations(clue)[0] || null;
    }
    coordinate(clue) {
      return this.coordinates(clue)[0] || null;
    }
    infobox(clue) {
      return this.infoboxes(clue)[0] || null;
    }
    // aliases
    lang(str) {
      return this.language(str);
    }
    ns(str) {
      return this.namespace(str);
    }
    plaintext(options) {
      return this.text(options);
    }
    isDisambig() {
      return this.isDisambiguation();
    }
    redirectsTo() {
      return this.redirectTo();
    }
    redirect() {
      return this.redirectTo();
    }
    redirects() {
      return this.redirectTo();
    }
  }

  const parseDoc = function(res, title) {
    var _a;
    const results = (res != null ? res : []).filter((o) => o != null).map((o) => new Document(o.wiki, o.meta));
    return isArray(title) ? results : (_a = results[0]) != null ? _a : null;
  };

  const makeHeaders = function(options) {
    let agent = options.userAgent || options["User-Agent"] || options["Api-User-Agent"] || "User of the wtf_wikipedia library";
    let origin;
    if (options.noOrigin) {
      origin = "";
    } else {
      origin = options.origin || options.Origin || "*";
    }
    return {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Api-User-Agent": agent,
        "User-Agent": agent,
        Origin: origin,
        "Accept-Encoding": "gzip"
      },
      redirect: "follow"
    };
  };

  const isUrl = /^https?:\/\//;
  const chunkSize = 50;
  const defaults = {
    lang: "en",
    wiki: "wikipedia",
    domain: void 0,
    follow_redirects: true,
    path: "api.php"
    //some 3rd party sites use a weird path
  };
  const getJson = function(url, headers) {
    return fetch(url, headers).then((res) => {
      if (res.ok !== true) {
        throw new Error(`HTTP ${res.status} error fetching: ${url}`);
      }
      return res.json();
    });
  };
  const fetchPage = function(title, options, callback) {
    if (typeof options === "string") {
      options = { lang: options };
    }
    if (title && typeof title.href === "string") {
      title = title.href;
    }
    options = { ...defaults, ...options };
    options.title = title;
    if (typeof title === "string" && isUrl.test(title)) {
      options = { ...options, ...parseUrl(title) };
    }
    const headers = makeHeaders(options);
    let groups = [options.title];
    if (isArray(options.title) && options.title.length > chunkSize) {
      groups = [];
      for (let i = 0; i < options.title.length; i += chunkSize) {
        groups.push(options.title.slice(i, i + chunkSize));
      }
    }
    const promise = Promise.resolve().then(
      () => Promise.all(
        groups.map((group) => {
          const url = makeUrl({ ...options, title: group });
          if (!url) {
            throw new Error(`Could not create a fetch-url from '${title}'`);
          }
          return getJson(url, headers).then((res) => {
            if (!res) {
              throw new Error(`No JSON Data Found For ${url}`);
            }
            return getResult(res, options) || [];
          });
        })
      )
    ).then((results) => {
      const found = [].concat(...results);
      return parseDoc(found, title);
    });
    if (typeof callback === "function") {
      return promise.then(
        (data) => callback(null, data),
        (e) => callback(e, null)
      );
    }
    return promise;
  };

  var version = "10.5.0";

  const request = function(url, opts) {
    return fetch(url, opts).then(function(res) {
      return res.json();
    }).catch((e) => {
      console.error("\n\n=-=- http response error =-=-=-");
      console.error(url);
      console.error(e);
      return {};
    });
  };

  const wtf = function(wiki, options) {
    return new Document(wiki, options);
  };
  const models = {
    Doc: Document,
    Section,
    Paragraph,
    Sentence,
    Image,
    Infobox,
    Link,
    List,
    Reference,
    Table,
    Template,
    http: request,
    wtf
  };
  wtf.fetch = function(title, options, cb) {
    return fetchPage(title, options, cb);
  };
  wtf.extend = function(fn) {
    fn(models, templates, infoboxes);
    return this;
  };
  wtf.plugin = wtf.extend;
  wtf.version = version;

  return wtf;

}));
