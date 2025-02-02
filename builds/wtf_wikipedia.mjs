/*! wtf_wikipedia  MIT */
import unfetch from 'isomorphic-unfetch';

/**
 * Parses out the domain and title from a url
 *
 * @private
 * @param {string} url The url that will be parsed
 * @returns {{domain: string, title: string}} The domain and title of a url
 */
const parseUrl = function (url) {
  let parsed = new URL(url); //eslint-disable-line
  let title = parsed.pathname.replace(/^\/(wiki\/)?/, '');
  title = decodeURIComponent(title);
  return {
    domain: parsed.host,
    title: title,
  }
};

/**
 * capitalizes the input
 * hello -> Hello
 * hello there -> Hello there
 *
 * @private
 * @param {string} [str] the string that will be capitalized
 * @returns {string} the capitalized string
 */

/**
 * trim whitespaces of the ends normalize 2 spaces into one and removes whitespaces before commas
 *
 * @private
 * @param {string} [str] the string that will be processed
 * @returns {string} the processed string
 */
function trim_whitespace(str) {
  if (str && typeof str === 'string') {
    str = str.replace(/^\s+/, '');
    str = str.replace(/\s+$/, '');
    str = str.replace(/ {2}/, ' ');
    str = str.replace(/\s, /, ', ');
    return str
  }
  return ''
}

/**
 * determines if an variable is an array or not
 *
 * @private
 * @param {*} x the variable that needs to be checked
 * @returns {boolean} whether the variable is an array
 */
function isArray(x) {
  return Object.prototype.toString.call(x) === '[object Array]'
}

/**
 *  determines if an variable is an object or not
 *
 * @private
 * @param {*} x the variable that needs to be checked
 * @returns {boolean} whether the variable is an object
 */
function isObject(x) {
  return x && Object.prototype.toString.call(x) === '[object Object]'
}

const isInterWiki =
  /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/;

const defaults$c = {
  action: 'query',
  prop: 'revisions|pageprops', // we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  rvprop: 'content|ids|timestamp',
  maxlag: 5,
  rvslots: 'main',
  origin: '*',
  format: 'json',
  redirects: 'true',
};

/**
 * turns a object into a query string
 *
 * @private
 * @param {Object<string, string | number | boolean>} obj
 * @returns {string} QueryString
 */
const toQueryString = function (obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
};

/**
 * cleans and prepares the tile by replacing the spaces with underscores (_) and trimming the white spaces of the ends
 *
 * @private
 * @param {string} page the title that needs cleaning
 * @returns {string} the cleaned title
 */
const cleanTitle = (page) => {
  return page.replace(/ /g, '_').trim()
};

/**
 * generates the url for fetching the pages
 *
 * @private
 * @param {import('.').fetchDefaults} options
 * @param {Object} [parameters]
 * @returns {string} the url that can be used to make the fetch
 */
const makeUrl = function (options, parameters = defaults$c) {
  let params = Object.assign({}, parameters);

  //default url
  let apiPath = '';

  //add support for third party apis
  if (options.domain) {
    //wikimedia is the only api that uses `/w/api` as its path. other wikis use other paths
    let path = isInterWiki.test(options.domain) ? 'w/api.php' : options.path;
    apiPath = `https://${options.domain}/${path}?`;
  } else if (options.lang && options.wiki) {
    apiPath = `https://${options.lang}.${options.wiki}.org/w/api.php?`;
  } else {
    return ''
  }

  if (!options.follow_redirects) {
    delete params.redirects;
  }

  // the origin header and url parameters need to be the same
  // if one is provided we should change both the header and the parameter
  if (options.origin) {
    params.origin = options.origin;
  }

  //support numerical ids
  let title = options.title;
  if (typeof title === 'number') {
    //single pageId
    params.pageids = title;
  } else if (typeof title === 'string') {
    //single page title
    params.titles = cleanTitle(title);
  } else if (title !== undefined && isArray(title) && typeof title[0] === 'number') {
    //pageid array
    params.pageids = title.filter((t) => t).join('|');
  } else if (title !== undefined && isArray(title) === true && typeof title[0] === 'string') {
    //title array
    params.titles = title
      .filter((t) => t)
      .map(cleanTitle)
      .join('|');
  } else {
    return ''
  }

  //make it!
  return `${apiPath}${toQueryString(params)}`
};

/**
 * parses the media wiki api response to something we can use
 *
 * the data-format from mediawiki api is nutso
 *
 * @private
 * @param {object} data
 * @param {object} [options]
 * @returns {*} result
 */
const getResult = function (data, options = {}) {
  // handle nothing found or no data passed
  if (!data?.query?.pages || !data?.query || !data) {
    return null
  }

  //get all the pagesIds from the result
  let pages = Object.keys(data.query.pages);

  // map over the pageIds to parse out all the information
  return pages.map((id) => {
    // get the page by pageID

    let page = data.query.pages[id] || {};

    // if the page is missing or not found than return null
    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null
    }

    // get the text from the object
    let text = page.revisions[0]['*'];
    // if the text is not found in the regular place than it is at the other place
    if (!text && page.revisions[0].slots) {
      text = page.revisions[0].slots.main['*'];
    }
    let revisionID = page.revisions[0].revid;
    let timestamp = page.revisions[0].timestamp;

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
      pageImage: page.pageprops['page_image_free'],
      wikidata: page.pageprops.wikibase_item,
      description: page.pageprops['wikibase-shortdesc'],
    });

    return { wiki: text, meta: meta }
  })
};

/**
 * helper for looping around all sections of a document
 *
 * @private
 * @param {object} doc the document with the sections
 * @param {string} fn the function name of the function that will be called
 * @param {string | number} [clue] the clue that will be used with the function
 * @returns {Array|*} the array of item at the index of the clue
 */
const sectionMap = function (doc, fn, clue) {
  let arr = [];
  doc.sections().forEach((sec) => {
    let list = [];
    if (typeof clue === 'string') {
      list = sec[fn](clue);
    } else {
      list = sec[fn]();
    }
    list.forEach((t) => {
      arr.push(t);
    });
  });
  if (typeof clue === 'number') {
    if (arr[clue] === undefined) {
      return []
    }
    return [arr[clue]]
  }
  return arr
};

/**
 * applies the the key values of defaults to options
 *
 * @private
 * @param {object} options the user options
 * @param {object} defaults the defaults
 * @returns {object} the user options with the defaults applied
 */
const setDefaults = function (options, defaults) {
  return Object.assign({}, defaults, options)
};

/**
 * @typedef DocumentToJsonOptions
 * @property {boolean | undefined} title
 * @property {boolean | undefined} pageID
 * @property {boolean | undefined} categories
 * @property {boolean | undefined} sections
 * @property {boolean | undefined} coordinates
 * @property {boolean | undefined} infoboxes
 * @property {boolean | undefined} images
 * @property {boolean | undefined} plaintext
 * @property {boolean | undefined} citations
 * @property {boolean | undefined} references
 */
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
  language: false,
};

/**
 * @typedef documentToJsonReturn
 * @property {string | undefined} title
 * @property {number | null | undefined} pageID
 * @property {string[] | undefined} categories
 * @property {object[] | undefined} sections
 * @property {boolean | undefined} isRedirect
 * @property {object | undefined} redirectTo
 * @property {object[] | undefined} coordinates
 * @property {object[] | undefined} infoboxes
 * @property {object[] | undefined} images
 * @property {string | undefined} plaintext
 * @property {object[] | undefined} references
 */

/**
 * an opinionated output of the most-wanted data
 *
 * @private
 * @param {object} doc
 * @param {DocumentToJsonOptions} options
 * @returns {documentToJsonReturn}
 */
const toJSON$2 = function (doc, options) {
  options = setDefaults(options, defaults$b);

  /**
   * @type {documentToJsonReturn}
   */
  let data = {};

  if (options.title) {
    data.title = doc.title();
  }

  // present only if true
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

  // metadata
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
  if (options.description && doc.description()) {
    data.description = doc.description();
  }

  // page sections
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

  if (options.plaintext) {
    data.plaintext = doc.text(options);
  }

  return data
};

var _categories = [
  'category', //en

  'abdeeling', //	pdc
  'bólkur', //	fo
  'catagóir', //	ga
  'categori', //	cy
  'categoria',
  'categoria', //	co
  'categoría', //	es
  'categorîa', //	lij
  'categorìa', //	pms
  'catégorie',
  'categorie',
  'catègorie', //	frp
  'category',
  'categuria', //	lmo
  'catigurìa', //	scn
  'class', //	kw
  'ẹ̀ka', //	yo
  'flocc',
  'flocc', //	ang
  'flokkur',
  'grup', //	tpi
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
  'kategoriya',
  'kategoriýa', //	tk
  'kategoriye', //	diq
  'kategory', //	fy
  'kategorya', //	tl
  'kateqoriya', //	az
  'katiguriya', //	qu
  'klad', //	vo
  'luokka',
  'ñemohenda', //	gn
  'roinn', //-seòrsa	gd
  'ronney', //	gv
  'rummad', //	br
  'setensele', //	nso
  'sokajy', //	mg
  'sumut', // atassuseq	kl
  'thể', // loại	vi
  'turkum', //	uz
  'категорија',
  'категория', //	ru
  'категорія', //	uk
  'катэгорыя',
  'төркем', //	tt
  'קטגוריה', //	he
  'تصنيف',
  'تۈر', //	ug
  'رده',
  'श्रेणी',
  'श्रेणी', //	hi
  'বিষয়শ্রেণী', //	bn
  'หมวดหมู่', //	th
  '분류', //	ko
  '분류', //ko
  '分类', //	za
  //--
];

var disambig_templates = [
  'dab', //en
  'disamb', //en
  'disambig', //en
  'disambiguation', //en

  'aðgreining',
  'aðgreining', //is
  'aimai', //ja
  'airport disambiguation',
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
  'biology disambiguation',
  'bisongidila', //kg
  'bkl', //pfl
  'bokokani', //ln
  'caddayn', //so
  'call sign disambiguation',
  'caselaw disambiguation',
  'chinese title disambiguation',
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
  'dezanbìgua',
  'dəqiqləşdirmə',
  'dəqiqləşdirmə', //az
  'disamb-term',
  'disamb-terms',
  'disamb2',
  'disamb3',
  'disamb4',
  'disambigua', //it
  'disambìgua', //sc
  'disambiguasi',
  'disambiguation cleanup',
  'disambiguation lead name',
  'disambiguation lead',
  'disambiguation name',
  'disambiguazion',
  'disambigue',
  'discretiva',
  'discretiva', //la
  'disheñvelout', //br
  'disingkek', //min
  'dixanbigua', //vec
  'dixebra', //ast
  'diżambigwazzjoni', //mt
  'dmbox',
  'doorverwijspagina', //nl
  'dp', //nl
  'dubbelsinnig',
  'dubbelsinnig', //af
  'dudalipen', //rmy
  'dv', //nds_nl
  'egyért', //hu
  'faaleaogaina',
  'fleiri týdningar', //fo
  'fleirtyding', //nn
  'flertydig', //da
  'förgrening', //sv
  'genus disambiguation',
  'gì-ngiê', //cdo
  'giklaro', //ceb
  'gwahaniaethu', //cy
  'homonimo', //io
  'homónimos', //gl
  'homonymie', //fr
  'hospital disambiguation',
  'huaʻōlelo puana like',
  'huaʻōlelo puana like', //haw
  'human name disambiguation cleanup',
  'human name disambiguation',
  'idirdhealú', //ga
  'khu-pia̍t', //zh_min_nan
  'kthjellim', //sq
  'kujekesa', //sn
  'letter-number combination disambiguation',
  'letter-numbercombdisambig',
  'maana', //sw
  'maneo bin', //diq
  'mathematical disambiguation',
  'mehrdüdig begreep', //nds
  'menm non', //ht
  'military unit disambiguation',
  'muardüüdag artiikel', //frr
  'music disambiguation',
  'myesakãrã',
  'neibetsjuttings', //fy
  'nozīmju atdalīšana', //lv
  'number disambiguation',
  'nuorodinis', //lt
  'nyahkekaburan', //ms
  'omonimeye', //wa
  'omonimi',
  'omonimia', //oc
  'opus number disambiguation',
  'page dé frouque', //nrm
  'paglilinaw', //tl
  'panangilawlawag', //ilo
  'pansayod', //war
  'pejy mitovy anarana', //mg
  'peker', //no
  'phonetics disambiguation',
  'place name disambiguation',
  'portal disambiguation',
  'razdvojba', //hr
  'razločitev', //sl
  'razvrstavanje', //sh
  'reddaghey', //gv
  'road disambiguation',
  'rozcestník', //cs
  'rozlišovacia stránka', //sk
  'school disambiguation',
  'sclerir noziun', //rm
  'selvendyssivu', //olo
  'soilleireachadh', //gd
  'species latin name abbreviation disambiguation',
  'species latin name disambiguation',
  'station disambiguation',
  'suzmunski', //jbo
  'synagogue disambiguation',
  'täpsustuslehekülg', //et
  'täsmennyssivu', //fi
  'taxonomic authority disambiguation',
  'taxonomy disambiguation',
  'telplänov', //vo
  'template disambiguation',
  'tlahtolmelahuacatlaliztli', //nah
  'trang định hướng', //vi
  'ujednoznacznienie', //pl
  'verdudeliking', //li
  'wěcejwóznamowosć', //dsb
  'wjacezmyslnosć', //hsb
  'z',
  'zambiguaçon', //mwl
  'zeimeibu škiršona', //ltg
  'αποσαφήνιση', //el
  'айрық', //kk
  'аҵакырацәа', //ab
  'бир аайы јок',
  'вишезначна одредница', //sr
  'ибҳомзудоӣ', //tg
  'кёб магъаналы', //krc
  'күп мәгънәләр', //tt
  'күп мәғәнәлелек', //ba
  'массехк маӏан хилар',
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
  'သဵင်မိူၼ် တူၼ်ႈထႅဝ်ပႅၵ်ႇ',
  'ណែនាំ', //km
  'អសង្ស័យកម្ម',
  '동음이의', //ko
  '扤清楚', //gan
  '搞清楚', //zh_yue
  '曖昧さ回避', //ja
  '消歧义', //zh
  '釋義', //zh_classical
  "gestion dj'omònim", //pms
  "sut'ichana qillqa", //qu
  // 'z', //vep
  // 'သဵင်မိူၼ် တူၼ်ႈထႅဝ်ပႅၵ်ႇ', //shn
  `gestion dj'omònim`,
  `sut'ichana qillqa`,
];

// used in titles to denote disambiguation pages
// see 'Football_(disambiguation)'
var disambig_titles = [
  'disambiguation', //en
  'homonymie', //fr
  'توضيح', //ar
  'desambiguação', //pt
  'Begriffsklärung', //de
  'disambigua', //it
  '曖昧さ回避', //ja
  '消歧義', //zh
  '搞清楚', //zh-yue
  'значения', //ru
  'ابهام‌زدایی', //fa
  'د ابہام', //ur
  '동음이의', //ko
  'dubbelsinnig', //af
  'այլ կիրառումներ', //hy
  'ujednoznacznienie', //pl
];

var images = [
  'file', //en
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
  'ファイル', //ja
];

// https://en.m.wikipedia.org/wiki/Template:Stub#/languages
var stubs = [
  'aboç',
  'ahurhire',
  'aizmetnis',
  'amud',
  'avixo de spigaso',
  // 'begin',
  'beginnetje',
  'bibarilo',
  'borrador',
  'buáng-nàng-hâ',
  'bun',
  'buntato',
  'c-supranu',
  'cahrot',
  'chala',
  'choutchette',
  'ciot',
  'csonk',
  'cung',
  'danvez pennad',
  'djermon',
  'ébauche',
  'ébeuche',
  'ebòch',
  'édéntạ',
  'eginyn',
  'ẹ̀kúnrẹ́rẹ́',
  'en progreso',
  'entamu',
  'esboço',
  'esborrany',
  'esbòs',
  'esbozo',
  'ĝermo',
  'gumud',
  'ʻōmuku',
  'junj',
  'klado',
  'maramara',
  'mayele',
  'mbegu',
  'mrva',
  'na mulno',
  'nadabeigts rakstīņs',
  'nalta',
  'narcce',
  'pahýl',
  'pecietta',
  'phí',
  'pondok',
  'por mejoral',
  'potuʻi',
  'pungol',
  'qaralama',
  'rabisco',
  'rancangan',
  'rintisan',
  'saadjie',
  'saha',
  'sbozz',
  'sid',
  'síol',
  'şitil',
  'sjtumpke',
  'skizz',
  'skizze',
  'škrbina',
  'sơ khai',
  'spire',
  'stipula',
  'stob',
  'stobbe',
  // 'stock',
  'stompje',
  'stub',
  'stubben',
  'stubbi',
  'stubbur',
  'stump',
  'stumpen',
  'stycce',
  'suli',
  'taslak',
  'taslaq',
  'tunas',
  'turók',
  'tynkä',
  // 'u začetku',
  'vangovango',
  'vernuşte',
  'výhonok',
  'xinnoo',
  'zarodk',
  'zirriborroa',
  'επέκταση',
  'әҙерләмә',
  'заготовка',
  'керф',
  'кечдар',
  'клица',
  'къæртт',
  'кьурхь',
  'мәкалә төпчеге',
  'мъниче',
  'накід',
  'нєꙁаврьшєнъ члѣнъ',
  'никулец',
  'омоон',
  'стыржень',
  'хурд',
  'хӏадурунжо',
  'ესკიზი',
  'መዋቅር',
  'መዋቕር',
  'अपूर्णलेखः',
  'आधार',
  'ठुटो',
  'धाक्टें पान',
  'विस्तार',
  'অসম্পূর্ণ',
  'পোখালি',
  'સ્ટબ',
  'ଅଧାଗଢ଼ା',
  'குறுங்கட்டுரை',
  'మొలక',
  'ಎಲ್ಯ',
  'ಚುಟುಕು',
  'അപൂർണ്ണം',
  'අංකුරය',
  'โครง',
  'ཆ་མི་ཚང་བ',
  'អត្ថបទខ្លីមិនពេញលេញ',
  '토막글',
  '楔',
  '芻文',
];

var infoboxes$1 = [
  'infobox', //en

  'amatl',
  'anfo', //mwl
  'anuāmapa', //haw
  'bilgi kutusu', //tr
  'bilgi', //tr
  'bilgiquti', //uz
  'boaty fampahalalana',
  'boaty', //mg
  'boestkelaouiñ', //br
  'bosca', //ga
  'capsa', //la
  'diehtokássa', //se
  'faktamall', //sv
  'ficha', //es
  'generalni', //hr
  'gwybodlen3', //cy
  'hộp thông tin',
  'info', //pt
  'infoboesse 2',
  'infobokis', //tpi
  'infoboks', //da
  'infobox deleted',
  'infobox generic',
  'infobox generiek',
  'infochascha', //rm
  'infokašćik', //dsb
  'infokast', //et
  'infokutija', //bs
  'infolentelė', //lt
  'infookvir',
  'infopolje', //sl
  'informkesto', //eo
  'infoschede',
  'infoskreine', //ltg
  'infotaula', //eu
  'inligtingskas',
  'inligtingskas3', //af
  'inligtingskas4', //af
  'kishtey fys',
  'kotak info',
  'kotak', //su
  'məlumat qutusu',
  'simple box',
  'tertcita tanxe',
  'tertcita', //jbo
  'tiätuloová',
  'tietolaatikko', //fi
  'wd bosca sonraí',
  'yerleşim bilgi kutusu',
  'ynfoboks generyk',
  'ynfoboks', //fy
  'πλαίσιο πληροφοριών',
  'πλαίσιο', //el
  'акарточка', //ab
  'аҥа', //mhr
  'инфобокс', //kk
  'инфокутија', //sr
  'инфокутия', //bg
  'інфобокс', //rue
  'канадский',
  'картка', //be
  'карточка', //ru
  'карточка2', //mdf
  'карточкарус', //ba
  'картуш', //koi
  'қуттӣ', //tg
  'ინფოდაფა', //ka
  'տեղեկաքարտ', //hy
  'תבנית', //he
  'بطاقة', //ar
  'ڄاڻخانو', //sd
  'خانہ', //ur
  'لغة',
  'معلوٗمات ڈَبہٕ',
  'ज्ञानसन्दूक', //hi
  'তথ্যছক', //bn
  'ਜਾਣਕਾਰੀਡੱਬਾ', //pa
  'సమాచారపెట్టె', //te
  'තොරතුරුකොටුව', //si
  'กล่องข้อมูล', //th
  'ກ່ອງຂໍ້ມູນ',
  'ប្រអប់ព័ត៌មាន', //km
  '정보상자', //ko
  '明細', //zh_yue
];

var redirects = [
  'aanstuur', //af
  'aastiurey',
  'adkas', //br
  'ailgyfeirio',
  'alidirekto',
  'alih', //id
  'aýdaw',
  'baw-ing',
  'beralîkirin', //ku
  'birzuzendu',
  'đổi hướng đến đây',
  'doorverwijzing', //nl
  'header',
  'i̇stiqamətləndirmə',
  'lencong', //ms
  'ohjaa tänne',
  'ohjaus',
  'omdirigering', //no
  'pāradresācija',
  'patrz', //pl
  'přesměrování',
  'přesměruj',
  'preusmeritev',
  'preusmjerava',
  'preusmjerenje',
  'preusmjeri', //hr
  'przekierowanie',
  'redir',
  'redirecció',
  'redireccion',
  'redirección', //es
  'redirecionamento', //pt
  'redirect', //en
  'redirect3',
  'redirection', //fr
  'redirige aquí',
  'redirige',
  'redirixe equí',
  'rindirizz',
  'rinvia', //it
  'stivre deike',
  'suunamine',
  'tilvísun',
  'trimite',
  'uudelleenohjaus',
  'weiterleitung', //de
  'weiterleitungshinweis',
  'yoʻnaltirish',
  'yönlendi̇r',
  'yönlendi̇rme', //tr
  'ανακατευθυνση', //el
  'айдау', //kk
  'багыттама',
  'буссинаби',
  'дӏасахьажорг',
  'от пренасочване',
  'перанакіраванне',
  'перанакіраваньне',
  'перанакіроўваецца сюды',
  'перенаправление', //ru
  'перенаправлення', //uk
  'перенаправлено',
  'пренасочување', //mk
  'преусмерава ',
  'преусмери', //sr
  'преусмјери',
  'равонакунӣ',
  'ווייטערפירן', //yi
  'تحويل', //ar
  'تغییر_مسیر',
  'تغییرمسیر', //fa
  'رجوع مکرر', //ur
  'رجوع_مکرر', //ur
  'अनुप्रेषित', //hi
  'पुनर्निर्देशन', //hi
  'পুননির্দেশ', //bn
  'পুনর্নির্দেশ',
  'යළියොමුව',
  'เปลี่ยนทาง',
  'ប្តូរទីតាំងទៅ', //km
  '다른 뜻 넘어옴',
  'リダイレクト', //ja
  '跳轉',
  '転送', //ja
  '重定向', //zh
];

var references = [
  'references',
  'reference',
  'einzelnachweise',
  'referencias',
  'références',
  'notes et références',
  '脚注',
  'referenser',
  'bronnen',
  'примечания',
];

//alt disambig-templates en-wikipedia uses
let d = ' disambiguation';
const templates$d = [
  'dab',
  'dab',
  'disamb',
  'disambig',
  'geodis',
  'hndis',
  'setindex',
  'ship index',
  'split dab',
  'sport index',
  'wp disambig',
  'disambiguation cleanup',
  'airport' + d,
  'biology' + d,
  'call sign' + d,
  'caselaw' + d,
  'chinese title' + d,
  'genus' + d,
  'hospital' + d,
  'lake index',
  'letter' + d,
  'letter-number combination' + d,
  'mathematical' + d,
  'military unit' + d,
  'mountainindex',
  'number' + d,
  'phonetics' + d,
  'place name' + d,
  'portal' + d,
  'road' + d,
  'school' + d,
  'species latin name abbreviation' + d,
  'species latin name' + d,
  'station' + d,
  'synagogue' + d,
  'taxonomic authority' + d,
  'taxonomy' + d,
].reduce((h, str) => {
  h[str] = true;
  return h
}, {});

const mayAlsoReg = /. may (also )?refer to\b/i;

// templates that signal page is not a disambiguation
const notDisambig = {
  about: true,
  for: true,
  'for multi': true,
  'other people': true,
  'other uses of': true,
  'distinguish': true
};

const inTitle = new RegExp('. \\((' + disambig_titles.join('|') + ')\\)$', 'i');
const i18n_templates = disambig_templates.reduce((h, str) => {
  h[str] = true;
  return h
}, {});

// look for '... may refer to'
const byText = function (s) {
  if (!s) {
    return false
  }
  let txt = s.text();
  if (txt !== null && txt[0]) {
    if (mayAlsoReg.test(txt) === true) {
      return true
    }
  }
  return false
};

/**
 * Parses the wikitext to find out if this page is a disambiguation
 *
 * @private
 * @param {object} doc the document that is examined
 * @returns {boolean} an indication if the document is a disambiguation page
 */
const isDisambig = function (doc) {
  // check for a {{disambig}} template
  let templates = doc.templates().map((tmpl) => tmpl.json());
  let found = templates.find((obj) => {
    return templates$d.hasOwnProperty(obj.template) || i18n_templates.hasOwnProperty(obj.template)
  });
  if (found) {
    return true
  }
  // check for (disambiguation) in title
  let title = doc.title();
  if (title && inTitle.test(title) === true) {
    return true
  }
  // does it have a non-disambig template?
  let notDisamb = templates.find((obj) => notDisambig.hasOwnProperty(obj.template));
  if (notDisamb) {
    return false
  }
  //try 'may refer to' on first line for en-wiki?
  if (byText(doc.sentence(0)) === true || byText(doc.sentence(1)) === true) {
    return true
  }
  return false
};

let allStubs = new Set(stubs);

const isStub = function (doc) {
  // check for a {{disambig}} template
  let templates = doc.templates().map((tmpl) => tmpl.json());

  return templates.some((t) => {
    let name = t.template || '';
    // try i18n templates like 'stubo'
    if (allStubs.has(name)) {
      return true
    }
    // english forms
    if (name === 'stub' || name.endsWith('-stub')) {
      return true
    }
    // look for i18n in last-word, like {{foo-stubo}}
    let words = name.split(/[- ]/);
    if (words.length > 1) {
      let word = words[words.length - 1];
      if (allStubs.has(word)) {
        return true
      }
    }
    return false
  })
};

const defaults$a = {
  caption: true,
  alt: true,
  links: true,
  thumb: true,
  url: true,
};
//
const toJson$3 = function (img, options) {
  options = setDefaults(options, defaults$a);
  let json = {
    file: img.file(),
  };
  if (options.thumb !== false) {
    json.thumb = img.thumbnail();
  }
  if (options.url !== false) {
    json.url = img.url();
  }
  //add captions
  if (options.caption !== false && img.data.caption) {
    json.caption = img.caption();
    if (options.links !== false && img.data.caption.links()) {
      json.links = img.links();
    }
  }
  if (options.alt !== false && img.data.alt) {
    json.alt = img.alt();
  }
  return json
};

const server = 'wikipedia.org';

const encodeTitle = function (file) {
  let title = file.replace(/^(image|file?):/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.trim().replace(/ /g, '_');
  return title
};

//the wikimedia image url is a little silly:
const makeSrc = function (file) {
  let title = encodeTitle(file);
  title = encodeURIComponent(title);
  return title
};

//the class for our image generation functions
const Image = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  });
};

const methods$8 = {
  file() {
    let file = this.data.file || '';
    if (file) {
      const regFile = /^(image|file):/i;
      if (!regFile.test(file)) {// if there's no 'File:', add it
        file = `File:${file}`;
      }
      file = file.trim();
      //titlecase it
      file = file.charAt(0).toUpperCase() + file.substring(1);
      //spaces to underscores
      file = file.replace(/ /g, '_');
    }
    return file
  },
  alt() {
    let str = this.data.alt || this.data.file || '';
    str = str.replace(/^(file|image):/i, '');
    str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
    return str.replace(/_/g, ' ')
  },
  caption() {
    if (this.data.caption) {
      return this.data.caption.text()
    }
    return ''
  },
  links() {
    if (this.data.caption) {
      return this.data.caption.links()
    }
    return []
  },
  url() {
    // let lang = 'en' //this.language() || 'en' //hmm: get actual language?
    let fileName = makeSrc(this.file());
    let domain = this.data.domain || server;
    let path = `wiki/Special:Redirect/file`;
    return `https://${domain}/${path}/${fileName}`
  },
  thumbnail(size) {
    size = size || 300;
    return this.url() + '?width=' + size
  },
  format() {
    let arr = this.file().split('.');
    if (arr[arr.length - 1]) {
      return arr[arr.length - 1].toLowerCase()
    }
    return null
  },
  json: function (options) {
    options = options || {};
    return toJson$3(this, options)
  },
  text: function () {
    return ''
  },
  wikitext: function () {
    return this.data.wiki || ''
  },
};

Object.keys(methods$8).forEach((k) => {
  Image.prototype[k] = methods$8[k];
});

Image.prototype.src = Image.prototype.url;
Image.prototype.thumb = Image.prototype.thumbnail;

var languages = {
  aa: 'Afar', //Afar
  ab: 'Аҧсуа', //Abkhazian
  af: 'Afrikaans', //Afrikaans
  ak: 'Akana', //Akan
  als: 'Alemannisch', //Alemannic
  am: 'አማርኛ', //Amharic
  an: 'Aragonés', //Aragonese
  ang: 'Englisc', //Anglo-Saxon
  ar: 'العربية', //Arabic
  arc: 'ܣܘܪܬ', //Aramaic
  as: 'অসমীয়া', //Assamese
  ast: 'Asturianu', //Asturian
  av: 'Авар', //Avar
  ay: 'Aymar', //Aymara
  az: 'Azərbaycanca', //Azerbaijani
  ba: 'Башҡорт', //Bashkir
  bar: 'Boarisch', //Bavarian
  'bat-smg': 'Žemaitėška', //Samogitian
  bcl: 'Bikol', //Bikol
  be: 'Беларуская', //Belarusian
  'be-x-old': 'ltr', //Belarusian
  bg: 'Български', //Bulgarian
  bh: 'भोजपुरी', //Bihari
  bi: 'Bislama', //Bislama
  bm: 'Bamanankan', //Bambara
  bn: 'বাংলা', //Bengali
  bo: 'བོད་ཡིག', //Tibetan
  bpy: 'ltr', //Bishnupriya
  br: 'Brezhoneg', //Breton
  bs: 'Bosanski', //Bosnian
  bug: 'ᨅᨔ', //Buginese
  bxr: 'ltr', //Buriat
  ca: 'Català', //Catalan
  cdo: 'Chinese', //Min
  ce: 'Нохчийн', //Chechen
  ceb: 'Sinugboanong', //Cebuano
  ch: 'Chamoru', //Chamorro
  cho: 'Choctaw', //Choctaw
  chr: 'ᏣᎳᎩ', //Cherokee
  chy: 'Tsetsêhestâhese', //Cheyenne
  co: 'Corsu', //Corsican
  cr: 'Nehiyaw', //Cree
  cs: 'Česky', //Czech
  csb: 'Kaszëbsczi', //Kashubian
  cu: 'Slavonic', //Old
  cv: 'Чăваш', //Chuvash
  cy: 'Cymraeg', //Welsh
  da: 'Dansk', //Danish
  de: 'Deutsch', //German
  diq: 'Zazaki', //Dimli
  dsb: 'ltr', //Lower
  dv: 'ދިވެހިބަސް', //Divehi
  dz: 'ཇོང་ཁ', //Dzongkha
  ee: 'Ɛʋɛ', //Ewe
  far: 'فارسی', //Farsi
  el: 'Ελληνικά', //Greek
  en: 'English', //English
  eo: 'Esperanto', //Esperanto
  es: 'Español', //Spanish
  et: 'Eesti', //Estonian
  eu: 'Euskara', //Basque
  ext: 'Estremeñu', //Extremaduran
  ff: 'Fulfulde', //Peul
  fi: 'Suomi', //Finnish
  'fiu-vro': 'Võro', //Võro
  fj: 'Na', //Fijian
  fo: 'Føroyskt', //Faroese
  fr: 'Français', //French
  frp: 'Arpitan', //Arpitan
  fur: 'Furlan', //Friulian
  fy: 'ltr', //West
  ga: 'Gaeilge', //Irish
  gan: 'ltr', //Gan
  gd: 'ltr', //Scottish
  gil: 'Taetae', //Gilbertese
  gl: 'Galego', //Galician
  gn: "Avañe'ẽ", //Guarani
  got: 'gutisk', //Gothic
  gu: 'ગુજરાતી', //Gujarati
  gv: 'Gaelg', //Manx
  ha: 'هَوُسَ', //Hausa
  hak: 'ltr', //Hakka
  haw: 'Hawai`i', //Hawaiian
  he: 'עברית', //Hebrew
  hi: 'हिन्दी', //Hindi
  ho: 'ltr', //Hiri
  hr: 'Hrvatski', //Croatian
  ht: 'Krèyol', //Haitian
  hu: 'Magyar', //Hungarian
  hy: 'Հայերեն', //Armenian
  hz: 'Otsiherero', //Herero
  ia: 'Interlingua', //Interlingua
  id: 'Bahasa', //Indonesian
  ie: 'Interlingue', //Interlingue
  ig: 'Igbo', //Igbo
  ii: 'ltr', //Sichuan
  ik: 'Iñupiak', //Inupiak
  ilo: 'Ilokano', //Ilokano
  io: 'Ido', //Ido
  is: 'Íslenska', //Icelandic
  it: 'Italiano', //Italian
  iu: 'ᐃᓄᒃᑎᑐᑦ', //Inuktitut
  ja: '日本語', //Japanese
  jbo: 'Lojban', //Lojban
  jv: 'Basa', //Javanese
  ka: 'ქართული', //Georgian
  kg: 'KiKongo', //Kongo
  ki: 'Gĩkũyũ', //Kikuyu
  kj: 'Kuanyama', //Kuanyama
  kk: 'Қазақша', //Kazakh
  kl: 'Kalaallisut', //Greenlandic
  km: 'ភាសាខ្មែរ', //Cambodian
  kn: 'ಕನ್ನಡ', //Kannada
  khw: 'کھوار', //Khowar
  ko: '한국어', //Korean
  kr: 'Kanuri', //Kanuri
  ks: 'कश्मीरी', //Kashmiri
  ksh: 'Ripoarisch', //Ripuarian
  ku: 'Kurdî', //Kurdish
  kv: 'Коми', //Komi
  kw: 'Kernewek', //Cornish
  ky: 'Kırgızca', //Kirghiz
  la: 'Latina', //Latin
  lad: 'Dzhudezmo', //Ladino
  lan: 'Leb', //Lango
  lb: 'Lëtzebuergesch', //Luxembourgish
  lg: 'Luganda', //Ganda
  li: 'Limburgs', //Limburgian
  lij: 'Líguru', //Ligurian
  lmo: 'Lumbaart', //Lombard
  ln: 'Lingála', //Lingala
  lo: 'ລາວ', //Laotian
  lt: 'Lietuvių', //Lithuanian
  lv: 'Latviešu', //Latvian
  'map-bms': 'Basa', //Banyumasan
  mg: 'Malagasy', //Malagasy
  man: '官話', //Mandarin
  mh: 'Kajin', //Marshallese
  mi: 'Māori', //Maori
  min: 'Minangkabau', //Minangkabau
  mk: 'Македонски', //Macedonian
  ml: 'മലയാളം', //Malayalam
  mn: 'Монгол', //Mongolian
  mo: 'Moldovenească', //Moldovan
  mr: 'मराठी', //Marathi
  ms: 'Bahasa', //Malay
  mt: 'bil-Malti', //Maltese
  mus: 'Muskogee', //Creek
  my: 'Myanmasa', //Burmese
  na: 'Dorerin', //Nauruan
  nah: 'Nahuatl', //Nahuatl
  nap: 'Nnapulitano', //Neapolitan
  nd: 'ltr', //North
  nds: 'Plattdüütsch', //Low German
  'nds-nl': 'Saxon', //Dutch
  ne: 'नेपाली', //Nepali
  new: 'नेपालभाषा', //Newar
  ng: 'Oshiwambo', //Ndonga
  nl: 'Nederlands', //Dutch
  nn: 'ltr', //Norwegian
  no: 'Norsk', //Norwegian
  nr: 'ltr', //South
  nso: 'ltr', //Northern
  nrm: 'Nouormand', //Norman
  nv: 'Diné', //Navajo
  ny: 'Chi-Chewa', //Chichewa
  oc: 'Occitan', //Occitan
  oj: 'ᐊᓂᔑᓈᐯᒧᐎᓐ', //Ojibwa
  om: 'Oromoo', //Oromo
  or: 'ଓଡ଼ିଆ', //Oriya
  os: 'Иронау', //Ossetian
  pa: 'ਪੰਜਾਬੀ', //Panjabi
  pag: 'Pangasinan', //Pangasinan
  pam: 'Kapampangan', //Kapampangan
  pap: 'Papiamentu', //Papiamentu
  pdc: 'ltr', //Pennsylvania
  pi: 'Pāli', //Pali
  pih: 'Norfuk', //Norfolk
  pl: 'Polski', //Polish
  pms: 'Piemontèis', //Piedmontese
  ps: 'پښتو', //Pashto
  pt: 'Português', //Portuguese
  qu: 'Runa', //Quechua
  rm: 'ltr', //Raeto
  rmy: 'Romani', //Romani
  rn: 'Kirundi', //Kirundi
  ro: 'Română', //Romanian
  'roa-rup': 'Armâneashti', //Aromanian
  ru: 'Русский', //Russian
  rw: 'Kinyarwandi', //Rwandi
  sa: 'संस्कृतम्', //Sanskrit
  sc: 'Sardu', //Sardinian
  scn: 'Sicilianu', //Sicilian
  sco: 'Scots', //Scots
  sd: 'सिनधि', //Sindhi
  se: 'ltr', //Northern
  sg: 'Sängö', //Sango
  sh: 'Srpskohrvatski', //Serbo-Croatian
  si: 'සිංහල', //Sinhalese
  simple: 'ltr', //Simple
  sk: 'Slovenčina', //Slovak
  sl: 'Slovenščina', //Slovenian
  sm: 'Gagana', //Samoan
  sn: 'chiShona', //Shona
  so: 'Soomaaliga', //Somalia
  sq: 'Shqip', //Albanian
  sr: 'Српски', //Serbian
  ss: 'SiSwati', //Swati
  st: 'ltr', //Southern
  su: 'Basa', //Sundanese
  sv: 'Svenska', //Swedish
  sw: 'Kiswahili', //Swahili
  ta: 'தமிழ்', //Tamil
  te: 'తెలుగు', //Telugu
  tet: 'Tetun', //Tetum
  tg: 'Тоҷикӣ', //Tajik
  th: 'ไทย', //Thai
  ti: 'ትግርኛ', //Tigrinya
  tk: 'Туркмен', //Turkmen
  tl: 'Tagalog', //Tagalog
  tlh: 'tlhIngan-Hol', //Klingon
  tn: 'Setswana', //Tswana
  to: 'Lea', //Tonga
  tpi: 'ltr', //Tok
  tr: 'Türkçe', //Turkish
  ts: 'Xitsonga', //Tsonga
  tt: 'Tatarça', //Tatar
  tum: 'chiTumbuka', //Tumbuka
  tw: 'Twi', //Twi
  ty: 'Reo', //Tahitian
  udm: 'Удмурт', //Udmurt
  ug: 'Uyƣurqə', //Uyghur
  uk: 'Українська', //Ukrainian
  ur: 'اردو', //Urdu
  uz: 'Ўзбек', //Uzbek
  ve: 'Tshivenḓa', //Venda
  vi: 'Việtnam', //Vietnamese
  vec: 'Vèneto', //Venetian
  vls: 'ltr', //West
  vo: 'Volapük', //Volapük
  wa: 'Walon', //Walloon
  war: 'Winaray', //Waray-Waray
  wo: 'Wollof', //Wolof
  xal: 'Хальмг', //Kalmyk
  xh: 'isiXhosa', //Xhosa
  yi: 'ייִדיש', //Yiddish
  yo: 'Yorùbá', //Yoruba
  za: 'Cuengh', //Zhuang
  zh: '中文', //Chinese
  'zh-classical': 'ltr', //Classical
  'zh-min-nan': 'Bân-lâm-gú', //Minnan
  'zh-yue': '粵語', //Cantonese
  zu: 'isiZulu', //Zulu
};

const wp = '.wikipedia.org/wiki/$1';
const wm = '.wikimedia.org/wiki/$1';
const w = 'www.';

var wikis = {
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
  nost: 'nostalgia' + wp,
  nostalgia: 'nostalgia' + wp,
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
  tenwiki: 'ten' + wp,
  testwiki: 'test' + wp,
  testwikidata: 'test.wikidata.org/wiki/$1',
  test2wiki: 'test2' + wp,
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
  wg: 'wg-en' + wp,
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
  wikipedia: 'en' + wp,
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
  sep11: 'sep11' + wp,
  d: w + 'wikidata.org/wiki/$1',
  minnan: 'zh-min-nan' + wp,
  nb: 'no' + wp,
  'zh-cfr': 'zh-min-nan' + wp,
  'zh-cn': 'zh' + wp,
  'zh-tw': 'zh' + wp,
  nan: 'zh-min-nan' + wp,
  vro: 'fiu-vro' + wp,
  cmn: 'zh' + wp,
  lzh: 'zh-classical' + wp,
  rup: 'roa-rup' + wp,
  gsw: 'als' + wp,
  'be-tarask': 'be-x-old' + wp,
  sgs: 'bat-smg' + wp,
  egl: 'eml' + wp,
  w: 'en' + wp,
  wikt: 'en.wiktionary.org/wiki/$1',
  q: 'en.wikiquote.org/wiki/$1',
  b: 'en.wikibooks.org/wiki/$1',
  n: 'en.wikinews.org/wiki/$1',
  s: 'en.wikisource.org/wiki/$1',
  chapter: 'en' + wm,
  v: 'en.wikiversity.org/wiki/$1',
  voy: 'en.wikivoyage.org/wiki/$1',
};

//add language prefixes too..
Object.keys(languages).forEach((k) => {
  wikis[k] = k + '.wikipedia.org/wiki/$1';
});

//this is predictably very complicated.
// https://meta.wikimedia.org/wiki/Help:Interwiki_linking
const parseInterwiki = function (obj) {
  let str = obj.page || '';
  if (str.indexOf(':') !== -1) {
    let m = str.match(/^(.*):(.*)/);
    if (m === null) {
      return obj
    }
    let site = m[1] || '';
    site = site.toLowerCase();
    // double colon - [[m:Help:Help]] 
    if (site.indexOf(':') !== -1) {
      let [, wiki, lang] = site.match(/^:?(.*):(.*)/);
      //only allow interwikis to these specific places
      if (wikis.hasOwnProperty(wiki) === false || languages.hasOwnProperty(lang) === false) {
        return obj
      }
      obj.wiki = { wiki: wiki, lang: lang };
    } else {
      // [[fr:cool]]
      if (wikis.hasOwnProperty(site) === false) {
        return obj
      }
      obj.wiki = site;
    }
    obj.page = m[2];
  }
  return obj
};

const ignore_links =
  /^(category|catégorie|kategorie|categoría|categoria|categorie|kategoria|تصنيف|image|file|fichier|datei|media):/i;
const external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]| ]{4,1500})([| ].*?)?\]/g;
const link_reg = /\[\[(.{0,1600}?)\]\]([a-z]+)?/gi; //allow dangling suffixes - "[[flanders]]s"

const external_links = function (links, str) {
  str.replace(external_link, function (raw, protocol, link, text) {
    text = text || '';
    links.push({
      type: 'external',
      site: protocol + link,
      text: text.trim(),
      raw: raw,
    });
    return text
  });
  return links
};

const internal_links = function (links, str) {
  //regular links
  str.replace(link_reg, function (raw, s, suffix) {
    let txt = null;
    //make a copy of original
    let link = s;
    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,1000}?)\]\](\w{0,10})/g, '$1$2'); //remove ['s and keep suffix
      link = s.replace(/(.{2,1000})\|.{0,2000}/, '$1'); //replaced links
      txt = s.replace(/.{2,1000}?\|/, '');
      //handle funky case of [[toronto|]]
      if (txt === null && link.match(/\|$/)) {
        link = link.replace(/\|$/, '');
        txt = link;
      }
    }
    //kill off non-wikipedia namespaces
    if (link.match(ignore_links)) {
      return s
    }
    //kill off just these just-anchor links [[#history]]
    // if (link.match(/^#/i)) {
    //   return s
    // }
    //remove anchors from end [[toronto#history]]
    let obj = {
      page: link,
      raw: raw,
    };
    obj.page = obj.page.replace(/#(.*)/, (a, b) => {
      obj.anchor = b;
      return ''
    });
    //grab any fr:Paris parts
    obj = parseInterwiki(obj);
    if (obj.wiki) {
      obj.type = 'interwiki';
    }
    if (txt !== null && txt !== obj.page) {
      obj.text = txt;
    }
    //finally, support [[link]]'s apostrophe
    if (suffix) {
      obj.text = obj.text || obj.page;
      obj.text += suffix.trim();
    }
    //titlecase it, if necessary
    if (obj.page && /^[A-Z]/.test(obj.page) === false) {
      if (!obj.text) {
        obj.text = obj.page;
      }
      obj.page = obj.page;
    }
    // support [[:Category:Foo]] syntax
    if (obj.text && obj.text.startsWith(':')) {
      obj.text = obj.text.replace(/^:/, '');
    }
    links.push(obj);
    return s
  });
  return links
};

//grab an array of internal links in the text
const parse_links = function (str) {
  let links = [];
  //first, parse external links
  links = external_links(links, str);
  //internal links
  links = internal_links(links, str);
  if (links.length === 0) {
    return undefined
  }
  return links
};

//pulls target link out of redirect page
const REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + redirects.join('|') + ') *?(\\[\\[.{2,180}?\\]\\])', 'i');

const isRedirect = function (wiki) {
  //too long to be a redirect?
  if (!wiki) {
    return false
  }
  return REDIRECT_REGEX.test(wiki)
};

const parse = function (wiki) {
  let m = wiki.match(REDIRECT_REGEX);
  if (m && m[2]) {
    let links = parse_links(m[2]) || [];
    return links[0]
  }
  return {}
};

//okay, i know you're not supposed to regex html, but...
//https://en.wikipedia.org/wiki/Help:HTML_in_wikitext

//these are things we throw-away
//these will mess-up if they're nested, but they're not usually.
const ignore$1 = [
  'table',
  'code',
  'score',
  'data',
  'categorytree',
  'charinsert',
  'hiero',
  'imagemap',
  'inputbox',
  'references',
  'source',
  'syntaxhighlight',
  'timeline',
  'maplink',
];
const openTag = `< ?(${ignore$1.join('|')}) ?[^>]{0,200}?>`;
const closeTag = `< ?/ ?(${ignore$1.join('|')}) ?>`;
const anyChar = '\\s\\S'; //including newline
const noThanks = new RegExp(`${openTag}[${anyChar}]+?${closeTag}`, 'gi');

const kill_xml = function (wiki) {
  //(<ref> tags are parsed in Section class) - luckily, refs can't be recursive.
  //types of html/xml that we want to trash completely.
  wiki = wiki.replace(noThanks, ' ');
  //some xml-like fragments we can also kill
  wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=%.\-#:;'" ]{2,100}\/? ?> ?/g, ' '); //<ref name="asd">
  //only kill ref tags if they are selfclosing
  wiki = wiki.replace(/ ?< ?(ref) [a-zA-Z0-9=" ]{2,100}\/ ?> ?/g, ' '); //<ref name="asd"/>

  // convert these html tags to known formatting
  wiki = wiki.replace(/<i>(.*?)<\/i>/g, `''$1''`);
  wiki = wiki.replace(/<b>(.*?)<\/b>/g, `'''$1'''`);

  // these are better-handled with templates
  wiki = wiki.replace(/<sub>(.*?)<\/sub>/g, `{{sub|$1}}`);
  wiki = wiki.replace(/<sup>(.*?)<\/sup>/g, `{{sup|$1}}`);
  wiki = wiki.replace(/<blockquote>(.*?)<\/blockquote>/g, `{{blockquote|text=$1}}`);

  //some formatting xml, we'll keep their insides though
  wiki = wiki.replace(/ ?<[ /]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr|u)[ /]?> ?/g, ' '); //<sub>, </sub>
  wiki = wiki.replace(/ ?<[ /]?(abbr|bdi|bdo|cite|del|dfn|em|ins|kbd|mark|q|s|small)[ /]?> ?/g, ' '); //<abbr>, </abbr>
  wiki = wiki.replace(/ ?<[ /]?h[0-9][ /]?> ?/g, ' '); //<h2>, </h2>
  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, '\n'); //<br />
  return wiki.trim()
};

/**
 * removes unnecessary strings from the wikitext
 * it is mostly-formatting stuff can be cleaned-up first, to make life easier
 *
 * @private
 * @param {string} wiki the wikitext that needs processing
 * @returns {string} the processed text
 */
function preProcess(wiki) {
  //remove comments
  wiki = wiki.replace(/<!--[\s\S]{0,3000}?-->/g, '');
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, '');
  //signitures
  wiki = wiki.replace(/~{2,3}/g, '');
  //windows newlines
  wiki = wiki.replace(/\r/g, '');
  //japanese periods - '。'
  wiki = wiki.replace(/\u3002/g, '. ');
  //horizontal rule
  wiki = wiki.replace(/----/g, '');
  //formatting for templates-in-templates...
  wiki = wiki.replace(/\{\{\}\}/g, ' – ');
  wiki = wiki.replace(/\{\{\\\}\}/g, ' / ');
  // some html escaping
  wiki = wiki.replace(/&nbsp;/g, ' ');
  wiki = wiki.replace(/&ndash;/g, '–');

  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki);
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\([,;: ]+\)/g, '');
  //these templates just screw things up, too
  wiki = wiki.replace(/\{\{(baseball|basketball) (primary|secondary) (style|color).*?\}\}/i, '');

  return wiki
}

//dumpster-dive throws everything into mongodb  - github.com/spencermountain/dumpster-dive
//mongo has some opinions about what characters are allowed as keys and ids.
//https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name/30254815#30254815
const specialChar = /[\\.$]/;

/**
 * this function encodes a string to make it mongodb compatible.
 * https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name/30254815#30254815
 *
 * @param {string} str
 * @returns {string} the encoded string
 */
const encodeStr = function (str) {
  if (typeof str !== 'string') {
    str = '';
  }
  str = str.replace(/\\/g, '\\\\');
  str = str.replace(/^\$/, '\\u0024');
  str = str.replace(/\./g, '\\u002e');
  return str
};

const encodeObj = function (obj = {}) {
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
  return obj
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
  references: true,
};

/**
 *
 * @param {object} section
 * @param {object} options
 * @returns {object}
 */
const toJSON$1 = function (section, options) {
  options = setDefaults(options, defaults$9);
  /**
   * @type {object}
   */
  let data = {};

  if (options.headers === true) {
    data.title = section.title();
  }

  if (options.depth === true) {
    data.depth = section.depth();
  }

  //these return objects
  if (options.paragraphs === true) {
    let paragraphs = section.paragraphs().map((p) => p.json(options));
    if (paragraphs.length > 0) {
      data.paragraphs = paragraphs;
    }
  }

  //image json data
  if (options.images === true) {
    let images = section.images().map((img) => img.json(options));
    if (images.length > 0) {
      data.images = images;
    }
  }

  //table json data
  if (options.tables === true) {
    let tables = section.tables().map((t) => t.json(options));
    if (tables.length > 0) {
      data.tables = tables;
    }
  }

  //template json data
  if (options.templates === true) {
    let templates = section.templates().map((tmpl) => tmpl.json());
    if (templates.length > 0) {
      data.templates = templates;
      //encode them, for mongodb
      if (options.encode === true) {
        data.templates.forEach((t) => encodeObj(t));
      }
    }
  }
  //infobox json data
  if (options.infoboxes === true) {
    let infoboxes = section.infoboxes().map((i) => i.json(options));
    if (infoboxes.length > 0) {
      data.infoboxes = infoboxes;
    }
  }
  //list json data
  if (options.lists === true) {
    let lists = section.lists().map((list) => list.json(options));
    if (lists.length > 0) {
      data.lists = lists;
    }
  }
  //list references - default true
  if (options.references === true || options.citations === true) {
    let references = section.references().map((ref) => ref.json(options));
    if (references.length > 0) {
      data.references = references;
    }
  }
  //default off
  if (options.sentences === true) {
    data.sentences = section.sentences().map((s) => s.json(options));
  }
  return data
};

const defaults$8 = {
  type: 'internal',
};
const Link = function (data) {
  data = data || {};
  data = Object.assign({}, defaults$8, data);
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  });
};
const methods$7 = {
  text: function (str) {
    if (str !== undefined) {
      this.data.text = str;
    }
    let txt = this.data.text || this.data.page || '';
    // remove bold/italics
    txt = txt.replace(/'{2,}/g, '');
    return txt
  },
  json: function () {
    let obj = {
      text: this.data.text,
      type: this.type(),
    };
    if (obj.type === 'internal') {
      obj.page = this.page();
    } else if (obj.type === 'interwiki') {
      obj.wiki = this.wiki();
      obj.page = this.page();
    } else {
      obj.site = this.site();
    }
    let anchor = this.anchor();
    if (anchor) {
      obj.anchor = anchor;
    }
    return obj
  },
  wikitext: function () {
    let txt = this.data.raw || '';
    return txt
  },
  page: function (str) {
    if (str !== undefined) {
      this.data.page = str;
    }
    return this.data.page
  },
  anchor: function (str) {
    if (str !== undefined) {
      this.data.anchor = str;
    }
    return this.data.anchor || ''
  },
  wiki: function (str) {
    if (str !== undefined) {
      this.data.wiki = str;
    }
    return this.data.wiki
  },
  type: function (str) {
    if (str !== undefined) {
      this.data.type = str;
    }
    return this.data.type
  },
  site: function (str) {
    if (str !== undefined) {
      this.data.site = str;
    }
    return this.data.site
  },
  //create a url for any type of link
  href: function () {
    let type = this.type();
    if (type === 'external') {
      return this.site()
    }
    let page = this.page();
    page = page.replace(/ /g, '_');
    page = encodeURIComponent(page);
    let url = '';

    if (type === 'interwiki') {
      let wiki = this.wiki();
      url = 'https://en.wikipedia.org/wiki/$1';
      if (wikis.hasOwnProperty(wiki)) {
        url = 'http://' + wikis[this.wiki()];
      }
      url = url.replace(/\$1/g, page);
    } else {
      //internal link
      url = `./${this.page()}`;
    }
    //add anchor on the end
    if (this.anchor()) {
      url += '#' + this.anchor();
    }
    return url
  },
};
Object.keys(methods$7).forEach((k) => {
  Link.prototype[k] = methods$7[k];
});

//return only rendered text of wiki links
const removeLinks = function (line) {
  // [[File:with|Size]]
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+)\]\](\w{0,5})/g, '$1');
  return line
};

const getLinks = function (data) {
  let wiki = data.text;
  let links = parse_links(wiki) || [];
  data.links = links.map((link) => {
    wiki = wiki.replace(link.raw, link.text || link.page || '');
    // delete link.raw
    return new Link(link)
  });
  wiki = removeLinks(wiki);
  data.text = wiki;
};

//handle the bold/italics
const formatting = function (obj) {
  let bolds = [];
  let italics = [];
  let wiki = obj.text || '';
  //bold and italics combined 5 's
  wiki = wiki.replace(/'''''(.{0,2500}?)'''''/g, (a, b) => {
    bolds.push(b);
    italics.push(b);
    return b
  });
  //''''four'''' → bold with quotes
  wiki = wiki.replace(/''''(.{0,2500}?)''''/g, (a, b) => {
    bolds.push(`'${b}'`);
    return `'${b}'`
  });
  //'''bold'''
  wiki = wiki.replace(/'''(.{0,2500}?)'''/g, (a, b) => {
    bolds.push(b);
    return b
  });
  //''italic''
  wiki = wiki.replace(/''(.{0,2500}?)''/g, (a, b) => {
    italics.push(b);
    return b
  });

  //pack it all up..
  obj.text = wiki;
  if (bolds.length > 0) {
    obj.fmt = obj.fmt || {};
    obj.fmt.bold = bolds;
  }
  if (italics.length > 0) {
    obj.fmt = obj.fmt || {};
    obj.fmt.italic = italics;
  }
  return obj
};

const isNumber = /^[0-9,.]+$/;

const defaults$7 = {
  text: true,
  links: true,
  formatting: true,
  numbers: true,
};

/**
 * @private
 * */
const toJSON = function (s, options) {
  options = setDefaults(options, defaults$7);
  let data = {};
  let text = s.text();
  if (options.text === true) {
    data.text = text;
  }
  //add number field
  if (options.numbers === true && isNumber.test(text)) {
    let num = Number(text.replace(/,/g, ''));
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
  return data
};

//where we store the formatting, link, date information
const Sentence = function (data = {}) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  });
};

const methods$6 = {
  links: function (n) {
    let arr = this.data.links || [];
    if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find((o) => o.page === n);
      return link === undefined ? [] : [link]
    }
    return arr
  },
  interwiki: function () {
    return this.links().filter((l) => l.wiki !== undefined)
  },
  bolds: function () {
    if (this.data && this.data.fmt && this.data.fmt.bold) {
      return this.data.fmt.bold || []
    }
    return []
  },
  italics: function () {
    if (this.data && this.data.fmt && this.data.fmt.italic) {
      return this.data.fmt.italic || []
    }
    return []
  },
  text: function (str) {
    if (str !== undefined && typeof str === 'string') {
      //set the text?
      this.data.text = str;
    }
    return this.data.text || ''
  },
  json: function (options) {
    return toJSON(this, options)
  },
  wikitext: function () {
    return this.data.wiki || ''
  },
  isEmpty: function () {
    return this.data.text === ''
  },
};

Object.keys(methods$6).forEach((k) => {
  Sentence.prototype[k] = methods$6[k];
});

// aliases
const singular$3 = {
  links: 'link',
  bolds: 'bold',
  italics: 'italic',
};
Object.keys(singular$3).forEach((k) => {
  let sing = singular$3[k];
  Sentence.prototype[sing] = function (clue) {
    let arr = this[k](clue);
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  };
});

Sentence.prototype.plaintext = Sentence.prototype.text;

//these are used for the sentence-splitter
var literalAbbreviations = [
  'ad',
  'adj',
  'adm',
  'adv',
  'al',
  'alta',
  'approx',
  'apr',
  'apt',
  'arc',
  'ariz',
  'assn',
  'asst',
  'atty',
  'aug',
  'ave',
  'ba',
  'bc',
  'bl',
  'bldg',
  'blvd',
  'brig',
  'bros',
  'ca',
  'cal',
  'calif',
  'capt',
  'cca',
  'cg',
  'cl',
  'cm',
  'cmdr',
  'co',
  'col',
  'colo',
  'comdr',
  'conn',
  'corp',
  'cpl',
  'cres',
  'ct',
  'cyn',
  'dak',
  'dec',
  'def',
  'dept',
  'det',
  'dg',
  'dist',
  'dl',
  'dm',
  'dr',
  'ea',
  'eg',
  'eng',
  'esp',
  'esq',
  'est',
  'etc',
  'ex',
  'exp',
  'feb',
  'fem',
  'fig',
  'fl oz',
  'fl',
  'fla',
  'fm',
  'fr',
  'ft',
  'fy',
  'ga',
  'gal',
  'gb',
  'gen',
  'gov',
  'hg',
  'hon',
  'hr',
  'hrs',
  'hwy',
  'hz',
  'ia',
  'ida',
  'ie',
  'inc',
  'inf',
  'jan',
  'jd',
  'jr',
  'jul',
  'jun',
  'kan',
  'kans',
  'kb',
  'kg',
  'km',
  'kmph',
  'lat',
  'lb',
  'lit',
  'llb',
  'lm',
  'lng',
  'lt',
  'ltd',
  'lx',
  'ma',
  'maj',
  'mar',
  'masc',
  'mb',
  'md',
  'messrs',
  'mg',
  'mi',
  'min',
  'minn',
  'misc',
  'mister',
  'ml',
  'mlle',
  'mm',
  'mme',
  'mph',
  'mps',
  'mr',
  'mrs',
  'ms',
  'mstr',
  'mt',
  'neb',
  'nebr',
  'nee',
  'no',
  'nov',
  'oct',
  'okla',
  'ont',
  'op',
  'ord',
  'oz',
  'pa',
  'pd',
  'penn',
  'penna',
  'phd',
  'pl',
  'pp',
  'pref',
  'prob',
  'prof',
  'pron',
  'ps',
  'psa',
  'pseud',
  'pt',
  'pvt',
  'qt',
  'que',
  'rb',
  'rd',
  'rep',
  'reps',
  'res',
  'rev',
  'sask',
  'sec',
  'sen',
  'sens',
  'sep',
  'sept',
  'sfc',
  'sgt',
  'sir',
  'situ',
  'sq ft',
  'sq',
  'sr',
  'ss',
  'st',
  'ste',
  'supt',
  'surg',
  'tb',
  'tbl',
  'tbsp',
  'tce',
  'td',
  'tel',
  'temp',
  'tenn',
  'tex',
  'tsp',
  'univ',
  'usafa',
  'ut',
  'va',
  'vb',
  'ver',
  'vet',
  'vitro',
  'vivo',
  'vol',
  'vs',
  'vt',
  'wis',
  'wisc',
  'wr',
  'wy',
  'wyo',
  'yb',
  'µg',
];

//split text into sentences, using regex
//@spencermountain MIT

const abbreviations = literalAbbreviations.concat('[^]][^]]');
const abbrev_reg = new RegExp("(^| |')(" + abbreviations.join('|') + `)[.!?] ?$`, 'i');
const acronym_reg = /[ .'][A-Z].? *$/i;
const elipses_reg = /\.{3,} +$/;
const circa_reg = / c\.\s$/;
const hasWord = /\p{Letter}/iu;

//turn a nested array into one array
const flatten = function (arr) {
  let all = [];
  arr.forEach(function (a) {
    all = all.concat(a);
  });
  return all
};

const naiive_split = function (text) {
  //first, split by newline
  let splits = text.split(/(\n+)/);
  splits = splits.filter((s) => s.match(/\S/));
  //split by period, question-mark, and exclamation-mark
  splits = splits.map(function (str) {
    return str.split(/(\S.+?[.!?]"?)(?=\s|$)/g) //\u3002
  });
  return flatten(splits)
};

// if this looks like a period within a wikipedia link, return false
const isBalanced = function (str) {
  str = str || '';
  const open = str.split(/\[\[/) || [];
  const closed = str.split(/\]\]/) || [];
  if (open.length > closed.length) {
    return false
  }
  //make sure quotes are closed too
  const quotes = str.match(/"/g);
  if (quotes && quotes.length % 2 !== 0 && str.length < 900) {
    return false
  }
  //make sure quotes are closed too
  const parens = str.match(/[()]/g);
  if (parens && parens.length % 2 !== 0 && str.length < 900) {
    return false
  }
  return true
};

const sentence_parser = function (text) {
  let sentences = [];
  //first do a greedy-split..
  let chunks = [];
  //ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return sentences
  }
  // This was the splitter regex updated to fix quoted punctuation marks.
  // let splits = text.split(/(\S.+?[.\?!])(?=\s+|$|")/g);
  // todo: look for side effects in this regex replacement:
  let splits = naiive_split(text);
  //filter-out the grap ones
  for (let i = 0; i < splits.length; i++) {
    let s = splits[i];
    if (!s || s === '') {
      continue
    }
    //this is meaningful whitespace
    if (!s.match(/\S/)) {
      //add it to the last one
      if (chunks[chunks.length - 1]) {
        chunks[chunks.length - 1] += s;
        continue
      } else if (splits[i + 1]) {
        //add it to the next one
        splits[i + 1] = s + splits[i + 1];
        continue
      }
    }
    chunks.push(s);
  }

  //detection of non-sentence chunks
  const isSentence = function (hmm) {
    if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg) || hmm.match(circa_reg)) {
      return false
    }
    //too short? - no consecutive letters
    if (hasWord.test(hmm) === false) {
      return false
    }
    if (!isBalanced(hmm)) {
      return false
    }
    return true
  };
  //loop through these chunks, and join the non-sentence chunks back together..
  for (let i = 0; i < chunks.length; i++) {
    //should this chunk be combined with the next one?
    if (chunks[i + 1] && !isSentence(chunks[i])) {
      // need a space to connect these?
      if (!/^\s/.test(chunks[i + 1]) && !/\s$/.test(chunks[i])) {
        chunks[i + 1] = chunks[i] + ' ' + chunks[i + 1];
      } else {
        chunks[i + 1] = chunks[i] + chunks[i + 1];
      }
    } else if (chunks[i] && chunks[i].length > 0) {
      //this chunk is a proper sentence..
      sentences.push(chunks[i]);
      chunks[i] = '';
    }
  }
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text]
  }
  return sentences
};

/**
 * This function removes some final characters from the sentence
 *
 * @private
 * @param {string} line the wiki text for processing
 * @returns {string} the processed string
 */
function postprocess(line) {
  //remove empty parentheses (sometimes caused by removing templates)
  line = line.replace(/\([,;: ]*\)/g, '');
  //these semi-colons in parentheses are particularly troublesome
  line = line.replace(/\( *(; ?)+/g, '(');
  //dangling punctuation
  line = trim_whitespace(line);
  line = line.replace(/ +\.$/, '.');
  return line
}

/**
 * returns one sentence object
 *
 * @param {string} str create a object from a sentence
 * @returns {Sentence} the Sentence created from the text
 */
function fromText(str) {
  let obj = {
    wiki: str,
    text: str,
  };
  //pull-out the [[links]]
  getLinks(obj);
  obj.text = postprocess(obj.text);
  //pull-out the bolds and ''italics''
  obj = formatting(obj);
  //pull-out things like {{start date|...}}
  return new Sentence(obj)
}

//used for consistency with other class-definitions
const byParagraph = function (paragraph) {
  //array of texts
  let sentences = sentence_parser(paragraph.wiki);
  //sentence objects
  sentences = sentences.map(fromText);
  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
    sentences = sentences.slice(1);
  }
  paragraph.sentences = sentences;
};

//remove top-bottoms
const cleanup$1 = function (lines) {
  lines = lines.filter((line) => {
    //a '|+' row is a 'table caption', remove it.
    return line && /^\|\+/.test(line) !== true
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
  return lines
};

//turn newline seperated into '|-' seperated
const findRows = function (lines) {
  let rows = [];
  let row = [];
  lines = cleanup$1(lines);
  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    //'|-' is a row-seperator
    if (/^\|-/.test(line) === true) {
      //okay, we're done the row
      if (row.length > 0) {
        rows.push(row);
        row = [];
      }
    } else {
      // remove leading | or ! for the ||/!! splitting
      let startChar = line.charAt(0);
      if (startChar === '|' || startChar === '!') {
        line = line.substring(1);
      }
      //look for '||' inline row-splitter
      line = line.split(/(?:\|\||!!)/); //eslint-disable-line
      // add leading ! back, because we later read it in header parsing functions
      if (startChar === '!') {
        line[0] = startChar + line[0];
      }
      line.forEach((l) => {
        l = l.trim();
        row.push(l);
      });
    }
  }
  //finish the last one
  if (row.length > 0) {
    rows.push(row);
  }
  return rows
};

const getRowSpan = /.*rowspan *= *["']?([0-9]+)["']?[ |]*/;
const getColSpan = /.*colspan *= *["']?([0-9]+)["']?[ |]*/;

//colspans stretch ←left/right→
const doColSpan = function (rows) {
  rows.forEach((row) => {
    row.forEach((str, c) => {
      let m = str.match(getColSpan);
      if (m !== null) {
        let num = parseInt(m[1], 10);

        //...maybe if num is so big, and centered, remove it?
        // if (num > 3) {
        //   rows[r] = []
        //   return
        // }
        //splice-in n empty columns right here
        row[c] = str.replace(getColSpan, '');
        for (let i = 1; i < num; i += 1) {
          row.splice(c + 1, 0, '');
        }
      }
    });
  });
  rows = rows.filter((r) => r.length > 0);
  return rows
};

//colspans stretch up/down
const doRowSpan = function (rows) {
  rows.forEach((row, r) => {
    row.forEach((str, c) => {
      let m = str.match(getRowSpan);
      if (m !== null) {
        let num = parseInt(m[1], 10);
        //copy this cell down n rows
        str = str.replace(getRowSpan, '');
        row[c] = str;
        for (let i = r + 1; i < r + num; i += 1) {
          if (!rows[i]) {
            break
          }
          rows[i].splice(c, 0, str);
        }
      }
    });
  });
  return rows
};

//
const handleSpans = function (rows) {
  rows = doColSpan(rows);
  rows = doRowSpan(rows);
  return rows
};

const isHeading = /^!/;

//common ones
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
  number: true,
};

//additional table-cruft to remove before parseLine method
const cleanText = function (str) {
  str = fromText(str).text();
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/.*?\| ?/, ''); //class="unsortable"|title
  }
  str = str.replace(/style=['"].*?["']/, '');
  //'!' is used as a highlighed-column
  str = str.replace(/^!/, '');
  // str = str.replace(/\(.*?\)/, '')
  str = str.trim();
  // str = str.toLowerCase()
  return str
};

const skipSpanRow = function (row) {
  row = row || [];
  let len = row.length;
  let hasTxt = row.filter((str) => str).length;
  //does it have 3 empty spaces?
  if (len - hasTxt > 3) {
    return true
  }
  return false
};

//remove non-header span rows
const removeMidSpans = function (rows) {
  rows = rows.filter((row) => {
    if (row.length === 1 && row[0] && isHeading.test(row[0]) && /rowspan/i.test(row[0]) === false) {
      return false
    }
    return true
  });
  return rows
};

//'!' starts a header-row
const findHeaders = function (rows = []) {
  let headers = [];

  // is the first-row just a ton of colspan?
  if (skipSpanRow(rows[0])) {
    rows.shift();
  }

  let first = rows[0];
  if (first && first[0] && first[1] && (/^!/.test(first[0]) || /^!/.test(first[1]))) {
    headers = first.map((h) => {
      h = h.replace(/^! */, '');
      h = cleanText(h);
      return h
    });
    rows.shift();
  }
  //try the second row, too (overwrite first-row, if it exists)
  first = rows[0];
  if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
    first.forEach((h, i) => {
      h = h.replace(/^! */, '');
      h = cleanText(h);
      if (Boolean(h) === true) {
        headers[i] = h;
      }
    });
    rows.shift();
  }
  return headers
};

//turn headers, array into an object
const parseRow = function (arr, headers) {
  let row = {};
  arr.forEach((str, i) => {
    let h = headers[i] || 'col' + (i + 1);
    let s = fromText(str);
    s.text(cleanText(s.text()));
    row[h] = s;
  });
  return row
};

//should we use the first row as a the headers?
const firstRowHeader = function (rows) {
  if (rows.length <= 3) {
    return []
  }
  let headers = rows[0].slice(0);
  headers = headers.map((h) => {
    h = h.replace(/^! */, '');
    h = fromText(h).text();
    h = cleanText(h);
    h = h.toLowerCase();
    return h
  });
  for (let i = 0; i < headers.length; i += 1) {
    if (headings$1.hasOwnProperty(headers[i])) {
      rows.shift();
      return headers
    }
  }
  return []
};

//turn a {|...table string into an array of arrays
const parseTable = function (wiki) {
  let lines = wiki
    .replace(/\r/g, '')
    .replace(/\n(\s*[^|!{\s])/g, ' $1') //remove unecessary newlines
    .split(/\n/)
    .map((l) => l.trim());
  let rows = findRows(lines);
  rows = rows.filter((r) => r);
  if (rows.length === 0) {
    return []
  }

  //remove non-header span rows
  rows = removeMidSpans(rows);
  //support colspan, rowspan...
  rows = handleSpans(rows);
  //grab the header rows
  let headers = findHeaders(rows);
  if (!headers || headers.length <= 1) {
    headers = firstRowHeader(rows);
    let want = rows[rows.length - 1] || [];
    //try the second row
    if (headers.length <= 1 && want.length > 2) {
      headers = firstRowHeader(rows.slice(1));
      if (headers.length > 0) {
        rows = rows.slice(2); //remove them
      }
    }
  }
  //index each column by it's header
  let table = rows.map((arr) => {
    return parseRow(arr, headers)
  });
  return table
};

//
const toJson$2 = function (tables, options) {
  return tables.map((table) => {
    let row = {};
    Object.keys(table).forEach((k) => {
      row[k] = table[k].json(); //(they're sentence objects)
    });
    //encode them, for mongodb
    if (options.encode === true) {
      row = encodeObj(row);
    }
    return row
  })
};

const defaults$6 = {};

const normalize$1 = function (key = '') {
  key = key.toLowerCase();
  key = key.replace(/[_-]/g, ' ');
  key = key.replace(/\(.*?\)/, '');
  key = key.trim();
  return key
};

const Table = function (data, wiki = '') {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  });
  Object.defineProperty(this, '_wiki', {
    enumerable: false,
    value: wiki,
  });
};

const methods$5 = {
  links(n) {
    let links = [];
    this.data.forEach((r) => {
      Object.keys(r).forEach((k) => {
        links = links.concat(r[k].links());
      });
    });
    if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = links.find((o) => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return links
  },
  get(keys) {
    // normalize mappings
    let have = this.data[0] || {};
    let mapping = Object.keys(have).reduce((h, k) => {
      h[normalize$1(k)] = k;
      return h
    }, {});
    // string gets a flat-list
    if (typeof keys === 'string') {
      let key = normalize$1(keys);
      key = mapping[key] || key;
      return this.data.map((row) => {
        return row[key] ? row[key].text() : null
      })
    }
    // array gets obj-list
    keys = keys.map(normalize$1).map((k) => mapping[k] || k);
    return this.data.map((row) => {
      return keys.reduce((h, k) => {
        if (row[k]) {
          h[k] = row[k].text();
        } else {
          h[k] = '';
        }
        return h
      }, {})
    })
  },
  keyValue(options) {
    let rows = this.json(options);
    rows.forEach((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text;
      });
    });
    return rows
  },
  json(options) {
    options = setDefaults(options, defaults$6);
    return toJson$2(this.data, options)
  },

  text() {
    return ''
  },

  wikitext() {
    return this._wiki || ''
  },
};
methods$5.keyvalue = methods$5.keyValue;
methods$5.keyval = methods$5.keyValue;

Object.keys(methods$5).forEach((k) => {
  Table.prototype[k] = methods$5[k];
});

//const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70k chars.
const openReg = /^\s*\{\|/;
const closeReg = /^\s*\|\}/;

//tables can be recursive, so looky-here.
const findTables = function (section) {
  let list = [];
  let wiki = section._wiki;
  let lines = wiki.split('\n');
  let stack = [];
  for (let i = 0; i < lines.length; i += 1) {
    //start a table
    if (openReg.test(lines[i]) === true) {
      stack.push(lines[i]);
      continue
    }
    //close a table
    if (closeReg.test(lines[i]) === true) {
      stack[stack.length - 1] += '\n' + lines[i];
      let table = stack.pop();
      list.push(table);
      continue
    }
    //keep-going on one
    if (stack.length > 0) {
      stack[stack.length - 1] += '\n' + lines[i];
    }
  }
  //work-em together for a Table class
  let tables = [];
  list.forEach((str) => {
    if (str) {
      //also re-remove a newline at the end of the table (awkward)
      wiki = wiki.replace(str + '\n', '');
      wiki = wiki.replace(str, '');
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
  sentences: true,
};

const toJson$1 = function (p, options) {
  options = setDefaults(options, defaults$5);
  let data = {};
  if (options.sentences === true) {
    data.sentences = p.sentences().map((s) => s.json(options));
  }
  return data
};

const defaults$4 = {
  sentences: true,
  lists: true,
  images: true,
};

const Paragraph = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  });
};

const methods$4 = {
  sentences: function () {
    return this.data.sentences || []
  },
  references: function () {
    return this.data.references
  },
  lists: function () {
    return this.data.lists
  },
  images() {
    return this.data.images || []
  },
  links: function (clue) {
    let arr = [];
    this.sentences().forEach((s) => {
      arr = arr.concat(s.links(clue));
    });
    if (typeof clue === 'string') {
      //grab a specific link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1); //titlecase it
      let link = arr.find((o) => o.page() === clue);
      return link === undefined ? [] : [link]
    }
    return arr || []
  },
  interwiki() {
    let arr = [];
    this.sentences().forEach((s) => {
      arr = arr.concat(s.interwiki());
    });
    return arr || []
  },
  text: function (options) {
    options = setDefaults(options, defaults$4);
    let str = this.sentences()
      .map((s) => s.text(options))
      .join(' ');
    this.lists().forEach((list) => {
      str += '\n' + list.text();
    });
    return str
  },
  json: function (options) {
    options = setDefaults(options, defaults$4);
    return toJson$1(this, options)
  },
  wikitext: function () {
    return this.data.wiki
  },
};
methods$4.citations = methods$4.references;
Object.keys(methods$4).forEach((k) => {
  Paragraph.prototype[k] = methods$4[k];
});

// aliases
const singular$2 = {
  sentences: 'sentence',
  references: 'reference',
  citations: 'citation',
  lists: 'list',
  images: 'image',
  links: 'link',
};
Object.keys(singular$2).forEach((k) => {
  let sing = singular$2[k];
  Paragraph.prototype[sing] = function (clue) {
    let arr = this[k](clue);
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  };
});

/**
 * removes the top and bottom off the template
 * so it removes tje '{{' and '}}'
 *
 * @private
 * @param {string} tmpl the string to be striped
 * @returns {string} the striped string
 */
const strip = function (tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl
};

//normalize template names
const fmtName = function (name) {
  name = (name || '').trim();
  name = name.toLowerCase();
  name = name.replace(/_/g, ' ');
  return name
};

/**
 * turn {{name|one|two|three}} into [name, one, two, three]
 *
 * @private
 * @param {string} tmpl the template text
 * @returns {string[]} a array containing all the split parameters
 */
const pipeSplitter = function (tmpl) {
  //start with a naive '|' split
  let arr = tmpl.split(/\n?\|/);
  //we've split by '|', which is pretty lame
  //look for broken-up links and fix them :/
  arr.forEach((a, i) => {
    if (a === null) {
      return
    }
    //has '[[' but no ']]'
    //has equal number of opening and closing tags. handle nested case '[[[[' ']]'
    if (
      /\[\[[^\]]+$/.test(a) ||
      /\{\{[^}]+$/.test(a) ||
      a.split('{{').length !== a.split('}}').length ||
      a.split('[[').length !== a.split(']]').length
    ) {
      arr[i + 1] = arr[i] + '|' + arr[i + 1];
      arr[i] = null;
    }
  });
  //cleanup any mistakes we've made
  arr = arr.filter((a) => a !== null);
  arr = arr.map((a) => (a || '').trim());

  //remove empty fields, only at the end:
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (arr[i] === '') {
      arr.pop();
    }
    break
  }
  return arr
};

//every value in {{tmpl|a|b|c}} needs a name
//here we come up with names for them
const hasKey = /^[\p{Letter}0-9._/\- '()\t]+=/iu;

//templates with these properties are asking for trouble
const reserved = {
  template: true,
  list: true,
  prototype: true,
};

/**
 * @typedef parseKeyReturn
 * @property {string} val
 * @property {string} key
 */

/**
 * turn 'key=val' into {key:key, val:val}
 *
 * @param {string} str the string that will be parsed
 * @returns {parseKeyReturn} the spit string
 */
const parseKey = function (str) {
  let parts = str.split('=');
  let key = parts[0] || '';
  key = key.toLowerCase().trim();
  let val = parts.slice(1).join('=');
  //don't let it be called 'template'..
  if (reserved.hasOwnProperty(key)) {
    key = '_' + key;
  }
  return {
    key: key,
    val: val.trim(),
  }
};

/**
 * turn [a, b=v, c] into {'1':a, b:v, '2':c}
 *
 * @private
 * @param {string[]} arr the array of parameters
 * @param {string[]} [order] the order in which the parameters are returned
 * @returns {object} and object with the names as the keys and the values as the values
 */
const keyMaker = function (arr, order) {
  let keyIndex = 0;
  return arr.reduce((h, str = '') => {
    str = str.trim();

    //support named keys - 'foo=bar'
    if (hasKey.test(str) === true) {
      let res = parseKey(str);
      if (res.key) {
        // don't overwrite if empty
        if (h[res.key] && !res.val) {
          return h
        }
        h[res.key] = res.val;
        return h
      }
    }

    //if the current index is present in the order array then we have a name for the key
    if (order && order[keyIndex]) {
      let key = order[keyIndex];
      h[key] = str;
    } else {
      h.list = h.list || [];
      h.list.push(str);
    }

    keyIndex += 1;
    return h
  }, {})
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
  'list-style-type': true,
  colwidth: true,
};

//remove wiki-cruft & some styling info from templates
const cleanup = function (obj) {
  Object.keys(obj).forEach((k) => {
    if (whoCares[k.toLowerCase()] === true) {
      delete obj[k];
    }
    //remove empty values, too
    if (obj[k] === null || obj[k] === '') {
      delete obj[k];
    }
  });
  return obj
};

//remove the top/bottom off the template

/**
 * most templates just want plaintext...
 *
 * @private
 * @param {str} str
 * @param {'json' | 'raw'} [fmt]
 * @returns {string} text
 */
const makeFormat = function (str, fmt) {
  let s = fromText(str);
  //support various output formats
  if (fmt === 'json') {
    return s.json()
  } else if (fmt === 'raw') {
    return s
  }
  //default to flat text
  return s.text()
};

/**
 * parses the parameters of a template to a usable format
 *
 * @private
 * @param {string} tmpl the template text
 * @param {string[]} [order] the order in which the parameters are returned
 * @param {'json' | 'raw'} [fmt] whether you wan to parse the text of the template the raw object or just the text
 * @returns {object} the parameters of the template in a usable format
 */
const parser = function (tmpl, order = [], fmt) {
  //remove {{}}'s and split based on pipes
  tmpl = strip(tmpl || '');
  let arr = pipeSplitter(tmpl);
  //get template name
  let name = arr.shift();

  //name each value
  let obj = keyMaker(arr, order);

  //remove wiki-junk
  obj = cleanup(obj);

  //is this a infobox/reference?
  //let known = isKnown(obj);

  //using '|1=content' is an escaping-thing..
  if (obj['1'] && order[0] && obj.hasOwnProperty(order[0]) === false) {
    //move it over..
    obj[order[0]] = obj['1'];
    delete obj['1'];
  }

  Object.keys(obj).forEach((k) => {
    if (k === 'list') {
      obj[k] = obj[k].map((v) => makeFormat(v, fmt));
      return
    }
    obj[k] = makeFormat(obj[k], fmt);
  });

  //add the template name
  if (name) {
    obj.template = fmtName(name);
  }
  return obj
};

const opener = '[';
const closer = ']';

/**
 *
 * find all the pairs of '[[...[[..]]...]]' in the text
 * used to properly root out recursive template calls, [[.. [[...]] ]]
 * basically just adds open tags, and subtracts closing tags
 *
 * @private
 * @param {string} text the text in which is searched in
 * @returns {string[]} all the links in the text
 */
function nested_find(text) {
  let out = [];
  let last = [];
  const chars = text.split('');
  let open = 0;
  for (let i = 0; i < chars.length; i++) {
    const c = text[i];
    //increment open tag
    if (c === opener) {
      open += 1;
    }
    //decrement close tag
    else if (c === closer) {
      open -= 1;
      if (open < 0) {
        open = 0;
      }
    } else if (last.length === 0) {
      //If we're not inside of a pair of delimiters, we can discard the current letter.
      //The return of this function is only used to extract images.
      continue
    }

    last.push(c);
    if (open === 0 && last.length > 0) {
      //first, fix botched parse
      let open_count = 0;
      let close_count = 0;
      for (let j = 0; j < last.length; j++) {
        if (last[j] === opener) {
          open_count++;
        } else if (last[j] === closer) {
          close_count++;
        }
      }
      //is it botched?
      if (open_count > close_count) {
        last.push(closer);
      }
      //looks good, keep it
      out.push(last.join(''));
      last = [];
    }
  }
  return out
}

//regexes:
const isFile = new RegExp('(' + images.join('|') + '):', 'i');
let fileNames = `(${images.join('|')})`;
const file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'iu');
const linkToFile = /^\[\[:/;

//style directives for Wikipedia:Extended_image_syntax
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
  super: true,
};

//images are usually [[image:my_pic.jpg]]
const oneImage = function (img, doc) {
  let m = img.match(file_reg);
  if (m === null || !m[2]) {
    return null
  }
  if (linkToFile.test(img)) {
    return null
  }
  let file = `${m[1]}:${m[2] || ''}`;
  if (file) {
    let obj = {
      file: file,
      lang: doc._lang,
      domain: doc._domain,
      wiki: img,
      pluginData: {}
    };
    //try to grab other metadata, too
    img = img.replace(/^\[\[/, '');
    img = img.replace(/\]\]$/, '');

    //https://en.wikipedia.org/wiki/Wikipedia:Extended_image_syntax
    //- [[File:Name|Type|Border|Location|Alignment|Size|link=Link|alt=Alt|lang=Langtag|Caption]]
    let imgData = parser(img);
    let arr = imgData.list || [];
    //parse-out alt text, if explicitly given
    if (imgData.alt) {
      obj.alt = imgData.alt;
    }
    //remove 'thumb' and things
    arr = arr.filter((str) => imgLayouts.hasOwnProperty(str) === false);
    if (arr[arr.length - 1]) {
      obj.caption = fromText(arr[arr.length - 1]);
    }
    return new Image(obj)
  }
  return null
};

const parseImages = function (paragraph, doc) {
  let wiki = paragraph.wiki;
  //parse+remove scary '[[ [[]] ]]' stuff
  let matches = nested_find(wiki);
  matches.forEach(function (s) {
    if (isFile.test(s) === true) {
      paragraph.images = paragraph.images || [];
      let img = oneImage(s, doc);
      if (img) {
        paragraph.images.push(img);
        wiki = wiki.replace(s, '');
      }
    }
  });
  paragraph.wiki = wiki;
};

const defaults$3 = {};

const toText$1 = (list, options) => {
  return list
    .map((s) => {
      let str = s.text(options);
      return ' * ' + str
    })
    .join('\n')
};

const List = function (data, wiki = '') {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  });
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki,
  });
};

const methods$3 = {
  lines() {
    return this.data
  },
  links(clue) {
    let links = [];
    this.lines().forEach((s) => {
      links = links.concat(s.links());
    });
    if (typeof clue === 'string') {
      //grab a link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1); //titlecase it
      let link = links.find((o) => o.page() === clue);
      return link === undefined ? [] : [link]
    }
    return links
  },
  json(options) {
    options = setDefaults(options, defaults$3);
    return this.lines().map((s) => s.json(options))
  },
  text() {
    return toText$1(this.data)
  },
  wikitext() {
    return this.wiki || ''
  },
};

Object.keys(methods$3).forEach((k) => {
  List.prototype[k] = methods$3[k];
});

const list_reg = /^[#*:;|]+/;
const bullet_reg = /^\*+[^:,|]{4}/;
const number_reg = /^ ?#[^:,|]{4}/;
const has_word = /[\p{Letter}_0-9\]}]/iu;

// does it start with a bullet point or something?
const isList = function (line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line)
};

//make bullets/numbers into human-readable *'s
const cleanList = function (list) {
  let number = 1;
  list = list.filter((l) => l);
  for (let i = 0; i < list.length; i++) {
    let line = list[i];
    //add # numberings formatting
    if (line.match(number_reg)) {
      line = line.replace(/^ ?#*/, number + ') ');
      line = line + '\n';
      number += 1;
    } else if (line.match(list_reg)) {
      number = 1;
      line = line.replace(list_reg, '');
    }
    list[i] = fromText(line);
  }
  return list
};

const grabList = function (lines, i) {
  let sub = [];
  for (let o = i; o < lines.length; o++) {
    if (isList(lines[o])) {
      sub.push(lines[o]);
    } else {
      break
    }
  }
  sub = sub.filter((a) => a && has_word.test(a));
  sub = cleanList(sub);
  return sub
};

const parseList = function (paragraph) {
  let wiki = paragraph.wiki;
  let lines = wiki.split(/\n/g);
  let lists = [];
  let theRest = [];
  for (let i = 0; i < lines.length; i++) {
    if (isList(lines[i])) {
      let sub = grabList(lines, i);
      if (sub.length > 0) {
        lists.push(sub);
        i += sub.length - 1;
      }
    } else {
      theRest.push(lines[i]);
    }
  }
  paragraph.lists = lists.map((l) => new List(l, wiki));
  paragraph.wiki = theRest.join('\n');
};

const twoNewLines = /\r?\n\r?\n/;

const parseParagraphs = function (section, doc) {
  let wiki = section._wiki;
  let paragraphs = wiki.split(twoNewLines);
  //don't create empty paragraphs
  paragraphs = paragraphs.filter((p) => p && p.trim().length > 0);
  paragraphs = paragraphs.map((str) => {
    let paragraph = {
      wiki: str,
      lists: [],
      sentences: [],
      images: [],
    };
    //parse the lists
    parseList(paragraph);
    //parse images
    parseImages(paragraph, doc);
    //parse the sentences
    byParagraph(paragraph);
    return new Paragraph(paragraph)
  });
  section._wiki = wiki;
  section._paragraphs = paragraphs;
};

const open = '{';
const close = '}';

//grab all first-level recursions of '{{...}}'
const findFlat = function (wiki) {
  let depth = 0;
  let list = [];
  let carry = [];
  for (let i = wiki.indexOf(open); i !== -1 && i < wiki.length; depth > 0 ? i++ : (i = wiki.indexOf(open, i + 1))) {
    let c = wiki[i];
    //open it
    if (c === open) {
      depth += 1;
    }
    //close it
    if (depth > 0) {
      if (c === close) {
        depth -= 1;
        if (depth === 0) {
          carry.push(c);
          let tmpl = carry.join('');
          carry = [];
          //last check
          if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
            list.push(tmpl);
          }
          continue
        }
      }
      //require two '{{' to open it
      if (depth === 1 && c !== open && c !== close) {
        depth = 0;
        carry = [];
        continue
      }
      carry.push(c);
    }
  }
  return list
};

//get the name of the template
//templates are usually '{{name|stuff}}'
const getName = function (tmpl) {
  let name = null;
  //{{name|foo}}
  if (/^\{\{[^\n]+\|/.test(tmpl)) {
    name = (tmpl.match(/^\{\{(.+?)\|/) || [])[1];
  } else if (tmpl.indexOf('\n') !== -1) {
    // {{name \n...
    name = (tmpl.match(/^\{\{(.+)\n/) || [])[1];
  } else {
    //{{name here}}
    name = (tmpl.match(/^\{\{(.+?)\}\}$/) || [])[1];
  }
  if (name) {
    name = name.replace(/:.*/, '');
    name = fmtName(name);
  }
  return name || null
};

const hasTemplate$1 = /\{\{/;

const parseTemplate$1 = function (tmpl) {
  // this is some unexplained Lua thing
  return {
    body: tmpl,
    name: getName(tmpl),
    children: [],
  }
};

const doEach = function (obj) {
  // peel-off top-level
  let wiki = obj.body.substr(2);
  wiki = wiki.replace(/\}\}$/, '');

  // get our child templates
  obj.children = findFlat(wiki);
  obj.children = obj.children.map(parseTemplate$1);

  if (obj.children.length === 0) {
    return obj
  }
  // recurse through children
  obj.children.forEach((ch) => {
    let inside = ch.body.substr(2);
    if (hasTemplate$1.test(inside)) {
      return doEach(ch) //keep going
    }
    return null
  });
  return obj
};

// return a nested structure of all templates
const findTemplates = function (wiki) {
  let list = findFlat(wiki);
  list = list.map(parseTemplate$1);
  list = list.map(doEach);
  return list
};

//we explicitly ignore these, because they sometimes have resolve some data
const list = [
  //https://en.wikipedia.org/wiki/category:templates_with_no_visible_output
  'anchor',
  'defaultsort',
  'use list-defined references',
  'void',
  //https://en.wikipedia.org/wiki/Category:Protection_templates
  'pp',
  'pp-move-indef',
  'pp-semi-indef',
  'pp-vandalism',
  //out-of-scope still - https://en.wikipedia.org/wiki/Template:Tag
  '#tag',
  //https://en.wikipedia.org/wiki/Template:Navboxes
  // 'navboxes',
  // 'reflist',
  // 'ref-list',
  'div col',
  // 'authority control',
  //https://en.wikipedia.org/wiki/Template:End
  'pope list end',
  'shipwreck list end',
  'starbox end',
  'end box',
  'end',
  's-end',
];
const ignore = list.reduce((h, str) => {
  h[str] = true;
  return h
}, {});

var infoboxes = {
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
  mlbbioret: true,
};

const i18nReg = new RegExp('^(subst.)?(' + infoboxes$1.join('|') + ')(?=:| |\n|$)', 'i');
infoboxes$1.forEach(name => {
  infoboxes[name] = true;
});

//some looser ones
const startReg = /^infobox /i;
const endReg = / infobox$/i;
const yearIn = /^year in [A-Z]/i;

//some known ones from
//https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
//and https://en.wikipedia.org/wiki/Category:Infobox_templates
const isInfobox = function (name) {
  //known
  if (infoboxes.hasOwnProperty(name) === true) {
    return true
  }
  if (i18nReg.test(name)) {
    return true
  }
  if (startReg.test(name) || endReg.test(name)) {
    return true
  }
  //these are also infoboxes: 'Year in Belarus'
  if (yearIn.test(name)) {
    return true
  }
  return false
};

//turns template data into good infobox data
const fmtInfobox = function (obj = {}) {
  let m = obj.template.match(i18nReg);
  let type = obj.template;
  if (m && m[0]) {
    type = type.replace(m[0], '');
  }
  type = type.trim();
  let infobox = {
    template: 'infobox',
    type: type,
    data: obj,
  };
  delete infobox.data.template; //already have this.
  delete infobox.data.list; //just in case!
  return infobox
};

//aliases
let aliases = {
  imdb: 'imdb name',
  'imdb episodes': 'imdb episode',
  localday: 'currentday',
  localdayname: 'currentdayname',
  localyear: 'currentyear',
  'birth date based on age at death': 'birth based on age as of date',
  'bare anchored list': 'anchored list',
  cvt: 'convert',
  cricon: 'flagicon',
  sfrac: 'frac',
  sqrt: 'radic',
  'unreferenced section': 'unreferenced',
  redir: 'redirect',
  sisterlinks: 'sister project links',
  'main article': 'main',
  by: 'baseball year',
  aldsy: 'alds year',
  nldsy: 'nlds year',
  //not perfect..
  'str rep': 'replace',
  ushr2: 'ushr',
  stn: 'station',
  metrod: 'metro',
  fw: 'ferry',
  rws: 'stnlnk',
  sclass2: 'sclass',
  under: 'underline',
  brackets: 'bracket',
  raise: 'lower',
  'born-in': 'born in',
  'c.': 'circa',
  'r.': 'reign',
  frac: 'fraction',
  rdelim: 'ldelim',
  abs: 'pipe',
  'pp.': 'p.',
  'iss.': 'vol.',
  h2d: 'hex2dec',
};

//multiple aliases
let multi = {
  date: ['byline', 'dateline'], //wikinews
  citation: ['cite', 'source', 'source-pr', 'source-science'],

  'no spam': ['email', '@', 'no spam blue'],
  'angle bracket': ['angbr', 'infix', 'angbr ipa'],

  'lrt station': ['lrt', 'lrts'],
  'mrt station': ['mrt', 'mrts'],

  flagcountry: ['cr', 'cr-rt'],

  trunc: ['str left', 'str crop'],

  percentage: ['pct', 'percentage'],

  rnd: ['rndfrac', 'rndnear'],

  abbr: ['tooltip', 'abbrv', 'define'],

  sfn: ['sfnref', 'harvid', 'harvnb'],

  'birth date and age': ['death date and age', 'bda', 'b-da'],

  currentmonth: ['localmonth', 'currentmonthname', 'currentmonthabbrev'],

  currency: ['monnaie', 'unité', 'nombre', 'nb', 'iso4217'],

  coord: ['coor', 'coor title dms', 'coor title dec', 'coor dms', 'coor dm', 'coor dec'],

  'columns-list': ['cmn', 'col-list', 'columnslist', 'collist'],

  nihongo: ['nihongo2', 'nihongo3', 'nihongo-s', 'nihongo foot'],

  plainlist: ['flatlist', 'plain list'],

  'winning percentage': ['winpct', 'winperc'],

  'collapsible list': [
    'nblist',
    'nonbulleted list',
    'ubl',
    'ublist',
    'ubt',
    'unbullet',
    'unbulleted list',
    'unbulleted',
    'unbulletedlist',
    'vunblist',
  ],

  'election box begin': [
    'election box begin no change',
    'election box begin no party',
    'election box begin no party no change',
    'election box inline begin',
    'election box inline begin no change',
  ],

  'election box candidate': [
    'election box candidate for alliance',
    'election box candidate minor party',
    'election box candidate no party link no change',
    'election box candidate with party link',
    'election box candidate with party link coalition 1918',
    'election box candidate with party link no change',
    'election box inline candidate',
    'election box inline candidate no change',
    'election box inline candidate with party link',
    'election box inline candidate with party link no change',
    'election box inline incumbent',
  ],

  '4teambracket': [
    '2teambracket',
    '4team2elimbracket',
    '8teambracket',
    '16teambracket',
    '32teambracket',
    '4roundbracket-byes',
    'cwsbracket',
    'nhlbracket',
    'nhlbracket-reseed',
    '4teambracket-nhl',
    '4teambracket-ncaa',
    '4teambracket-mma',
    '4teambracket-mlb',
    '16teambracket-two-reseeds',
    '8teambracket-nhl',
    '8teambracket-mlb',
    '8teambracket-ncaa',
    '8teambracket-afc',
    '8teambracket-afl',
    '8teambracket-tennis3',
    '8teambracket-tennis5',
    '16teambracket-nhl',
    '16teambracket-nhl divisional',
    '16teambracket-nhl-reseed',
    '16teambracket-nba',
    '16teambracket-swtc',
    '16teambracket-afc',
    '16teambracket-tennis3',
    '16teambracket-tennis5',
  ],

  start: [
    'end',
    'birth',
    'death',
    'start date',
    'end date',
    'birth date',
    'birthdate',
    'death date',
    'start date and age',
    'end date and age',
    'dob',
  ],

  'start-date': [
    'end-date',
    'birth-date',
    'death-date',
    'birth-date and age',
    'birth-date and given age',
    'death-date and age',
    'death-date and given age',
  ],

  tl: [
    'lts',
    't',
    'tfd links',
    'tiw',
    'tltt',
    'tetl',
    'tsetl',
    'ti',
    'tic',
    'tiw',
    'tlt',
    'ttl',
    'twlh',
    'tl2',
    'tlu',
    'demo',
    'xpd',
    'para',
    'elc',
    'xtag',
    'mli',
    'mlix',
    'url', //https://en.wikipedia.org/wiki/Template:URL
  ],

  // https://en.wikipedia.org/wiki/Template:Done/See_also
  done: [
    'resolved mark large',
    'implemented',
    'pimplemented',
    'resolved mark',
    'accepted',
    'agree',
    'approved',
    'checked2',
    'verified',
    'conditional yes',
    'confirmed',
    'confirmed-nc',
    'tallyho',
    'tick',
    'helped',
    'doneu|example',
    'edited2',
    'donetask',
    'unprod',
    'autp',
    'responded',
    'sure',
    'merge done',
    'marked',
    'pass',
    'aye',
    'yes check',
    'y&',
    'yeac',
    'yeag',
  ],
  xmark: [
    'expired',
    'deleted',
    'not done',
    'not done empty request',
    'not done unclear',
    'not done not likely',
    'stale-small',
    'smallrejected',
    'x mark',
    'nay',
    'no mark',
    'not done-t',
    'fail',
    'n&',
    'x mark-n',
    'xed box',
    'cancelled',
    'deleted-image',
    'already declined',
    'opblocked',
    'user-blocked',
    'notabug',
    'notfixed',
    "won't fix",
    'withdraw',
    'nojoy',
    'unrelated',
    'off-topic talk',
    'nayc',
    'nayg',
  ],
  checked: ['already done', 'resolved1', 'check mark-n', 'checked box'],
  // https://en.wikipedia.org/wiki/Template:Ferry
  'station link': ['amtk', 'cta', 'bts', 'mnrr', 'mtams', 'munis', 'njts', 'scax', 'wmata', 'rwsa'],
  'video game release': ['vgrelease', 'video game release hlist', 'vgrtbl', 'vgrelease hlist', 'vgrh'],
  aka: ['a.k.a.', 'also known as'],
  'literal translation': ['lit', 'literal', 'literally'],
  'citation needed': [
    'are you sure?',
    'cb',
    'ciation needed',
    'cit',
    'cita requerida',
    'citaiton needed',
    'citation missing',
    'citation need',
    'citation requested',
    'citation required',
    'citation-needed',
    'citationeeded',
    'citationneeded',
    'citationrequired',
    'citazione necessaria',
    'cite missing',
    'cite needed',
    'cite source',
    'cite-needed',
    'citeneeded',
    'citesource',
    'citn',
    'cn needed',
    'cn',
    'ctn',
    'fact?',
    'fact',
    'facts',
    'fcitation needed',
    'me-fact',
    'need citation',
    'need sources',
    'need-ref',
    'needcitation',
    'needcite',
    'needs citation',
    'needs citations',
    'needs reference',
    'needs source',
    'needs-cite',
    'needsref',
    'no source given',
    'prov-statement',
    'prove it',
    'proveit',
    'ref needed',
    'ref-needed',
    'ref?',
    'reference necessary',
    'reference needed',
    'reference required',
    'refnec',
    'refneeded',
    'refplease',
    'request citation',
    'source needed',
    'source?',
    'sourceme',
    'uncited',
    'unreferenced inline',
    'unsourced-inline',
  ],

  'en dash': ['ndash', 'nsndns'],
  'spaced en dash': ['spnd', 'sndash', 'spndash'],
  'spaced en dash space': ['snds', 'spndsp', 'sndashs', 'spndashsp'],
  'zero width joiner em dash zero width non joiner': ['nsmdns', 'nsmdashns', 'nsemdashns', 'mdashb'],
  color: ['colour', 'colored text', 'fgcolor'],
};

// - other languages -
// Polish, {{IPAc-pl}}	{{IPAc-pl|'|sz|cz|e|ć|i|n}} → [ˈʂt͡ʂɛt͡ɕin]
// Portuguese, {{IPAc-pt}}	{{IPAc-pt|p|o|<|r|t|u|'|g|a|l|lang=pt}} and {{IPAc-pt|b|r|a|'|s|i|l|lang=br}} → [puɾtuˈɣaɫ] and [bɾaˈsiw]
Object.keys(languages).forEach((lang) => {
  aliases['ipa-' + lang] = 'ipa';
  aliases['ipac-' + lang] = 'ipac';
});

// add each alias in
Object.keys(multi).forEach((k) => {
  multi[k].forEach((str) => {
    aliases[str] = k;
  });
});

var hardcoded = {
  '·': '·',
  dot: '·',
  middot: '·',
  '•': ' • ',
  ',': ',',
  '=': '=',
  '1/2': '1⁄2',
  '1/3': '1⁄3',
  '2/3': '2⁄3',
  '1/4': '1⁄4',
  '3/4': '3⁄4',
  '–': '–',
  ndash: '–',
  'en dash': '–',
  'spaced ndash': ' – ',
  '—': '—',
  mdash: '—',
  spd: ' – ',
  'em dash': '—',
  'number sign': '#',
  'hash-tag': '#',
  ibeam: 'I',
  '&': '&',
  ';': ';',
  ampersand: '&',
  dagger: '†',
  'double-dagger': '‡',
  snds: ' – ',
  snd: ' – ',
  '^': ' ',
  '!': '|',
  "'": `'`,
  '\\': ' /',
  '`': '`',
  // bracket: '[',
  '[': '[',
  '*': '*',
  asterisk: '*',
  'long dash': '———',
  clear: '\n\n',
  'h.': 'ḥ',
  profit: '▲',
  // loss: '▼',
  // gain: '▲',
  ell: 'ℓ',
  '1~': '~',
  '2~': '~~',
  '3~': '~~~',
  '4~': '~~~~',
  '5~': '~~~~~',
  // some emoji replacements
  goldmedal: '🥇',
  silvermedal: '🥈',
  bronzemedal: '🥉',
  done: '✅',
  xmark: '❌',
  checked: '✔️',
  'thumbs up': '👍',
  'thumbs down': '👎',
  minusplus: '∓',
  plusminus: '±',

  // 'hbeff début': '{|-\n',
  egiptekas: '{|-\n',
  langle: '⟨',
  rangle: '⟩',
  epsilon: 'ε',
  xi: '𝜉',
  Φ: 'Φ',
  phi: '𝜙',
  varphi: '𝜑',
  upsilon: '𝜐',
  tau: '𝜏',
  varsigma: '𝜍',
  sigma: '𝜎',
  pi: 'π',
  mu: '𝜇',
  lambda: '𝜆',
  kappa: '𝜘',
  vartheta: '𝜗',
  theta: '𝜃',
  varepsilon: '𝜀',
  gamma: '𝛾',
  shy: '-',
  mdashb: '—‌',
  'spaced en dash': ' –',
  'spaced en dash space': ' – ',
  'zero width joiner em dash zero width non joiner': '—‌',
  colon: ':',
  pipe: '|',
  '-?': '?',
  zwsp: ' ',
  sp: ' ',
  px2: ' ',
  indent: '    ',
  nb5: '    ',
  ns: '    ',
  quad: '    ',
  spaces: '    ',
  in5: '     ',
  tombstone: '◻',
  // increase: '▲',
  // decrease: '▼',
  'no.': '#',
  'thin space': ' ',
  thinspace: ' ',
  'very thin space': ' ',
  'word joiner': ' ',
  'figure space': ' ',
  'zero width joiner': ' ',
  'hair space': ' ',
  'narrow no-break space': ' ',
  'non breaking hyphen': '-',
  '!((': '[[',
  '))!': ']]',
  '(': '{',
  '((': '{{',
  '(((': '{{{',
  ')': '}',
  '))': '}}',
  ')))': '}}}',
  '(!': '{|',
  '!+': '|+',
  '!-': '|-',
  '!)': '|}',
  flat: '♭',
  sharp: '♯',
  lbf: 'lbF',
  lbm: 'lbm',
};

//grab the first, second or third pipe..
let templates$c = {
  p1: 0,
  p2: 1,
  p3: 2,
  resize: 1, //https://en.wikipedia.org/wiki/'Resize',
  lang: 1,
  'rtl-lang': 1,
  'line-height': 1,
  l: 2,
  h: 1, //https://en.wikipedia.org/wiki/'Hover_title',
  sort: 1, //https://en.wikipedia.org/wiki/'Sort',
  color: 1,
  'background color': 1,
};

//templates that we simply grab their insides as plaintext
let zeros = [
  'defn',
  'lino', //https://en.wikipedia.org/wiki/'Linum',
  'finedetail', //https://en.wikipedia.org/wiki/'Finedetail',
  'nobold',
  'noitalic',
  'nocaps',
  'vanchor', //https://en.wikipedia.org/wiki/'Visible_anchor',
  'rnd',
  'date', //Explictly-set dates - https://en.wikipedia.org/wiki/'Date',
  'taste',
  'monthname',
  'baseball secondary style',
  'nowrap',
  'nobr',
  'big',
  'cquote',
  'pull quote',
  'smaller',
  'midsize',
  'larger',
  'big',
  'kbd',
  'bigger',
  'large',
  'mono',
  'strongbad',
  'stronggood',
  'huge',
  'xt',
  'xt2',
  '!xt',
  'xtn',
  'xtd',
  'dc',
  'dcr',
  'mxt',
  '!mxt',
  'mxtn',
  'mxtd',
  'bxt',
  '!bxt',
  'bxtn',
  'bxtd',
  'delink', //https://en.wikipedia.org/wiki/'Delink',
  'pre',
  'var',
  'mvar',
  'pre2',
  'code',
  'char',
  'angle bracket',
  'symb',
  'dabsearch',
  'key press', //needs work - https://en.m.wikipedia.org/wiki/'Key_press',
  // these should escape certain chars
  'nowiki',
  'nowiki2',
  'unstrip',
  'unstripnowiki',
  'plain text',
  'make code',
  'killmarkers',
  'longitem',
  'longlink',
  'strikethrough',
  'underline',
  'uuline',
  'not a typo',
  'text',
  'var serif',
  'double underline',
  'nee',
  'ne',
  'left',
  'right',
  'center',
  'centered',
  'justify',
  'smalldiv',
  'bold div',
  'monodiv',
  'italic div',
  'bigdiv',
  'strikethroughdiv',
  'strikethrough color',
  'pbpe', //pt
  'video game release/abbr',
  'nobel abbr',
  'gloss',
  'gcl',
  'overline',
  'underline',
  'overarc',
  'normal',
  'norm',
  'tmath',
  'vec',
  'subst',
  'highlight',
  'tq',
  'subst:nft',
  'subst:nwft',
  'subst:nfa',
];
zeros.forEach((k) => {
  templates$c[k] = 0;
});

let templates$b = {};
// these templates all have a predictable pattern
// {{HSC|Ship Name|ID}} -> [[HSC Name (id)]]
let arr = [
  // ships
  'mv',
  'm/v',
  'gts',
  'hsc',
  'ms',
  'm/s',
  'my',
  'm/y',
  'ps',
  'rms',
  'rv',
  'r/v',
  'sb',
  'ss',
  's/s',
  'sv',
  's/v',
  'sy',
  's/y',
  'tss',
  'ans',
  'hmas',
  'hmbs',
  'bns',
  'hmcs',
  'ccgs',
  'arc',
  'hdms',
  'bae',
  'ens',
  'eml',
  'rfns',
  'fns',
  'hs',
  'sms',
  'smu',
  'gs',
  'icgv',
  'ins',
  'kri',
  'lé',
  'jsub',
  'jds',
  'js',
  'hnlms',
  'hmnzs',
  'nns',
  'hnoms',
  'hmpngs',
  'bap',
  'rps',
  'brp',
  'orp',
  'nrp',
  'nms',
  'rss',
  'sas',
  'hmsas',
  'roks',
  'hswms',
  'htms',
  'tcg',
  'hms',
  'hmt',
  'rfaux',
  'usat',
  'uscgc',
  'usns',
  'usrc',
  'uss',
  'usav',
];

arr.forEach((word) => {
  templates$b[word] = (tmpl) => {
    let { name, id } = parser(tmpl, ['name', 'id']);
    return id ? `[[${word.toUpperCase()} ${name} (${id})]]` : `[[${word.toUpperCase()} ${name}]]`
  };
});

let links = ['no redirect', 'tl-r', 'template link no redirect', 'redirect?', 'subatomic particle', 'auto link', 'bl'];
links.forEach((word) => {
  templates$b[word] = (tmpl) => {
    let data = parser(tmpl, ['page', 'text']);
    if (data.text && data.text !== data.page) {
      return `[[${data.page}|${data.text}]]`
    }
    return `[[${data.page}]]`
  };
});

//simply num/denom * 100
const percentage = function (obj) {
  if (!obj.numerator && !obj.denominator) {
    return null
  }
  let perc = Number(obj.numerator) / Number(obj.denominator);
  perc *= 100;
  Number(obj.decimals);
  return parseInt(perc, 10)
};

const toNumber = function (str = '') {
  if (typeof str === 'number') {
    return str
  }
  str = str.replace(/,/g, '');
  str = str.replace(/−/g, '-');
  let num = Number(str);
  if (isNaN(num)) {
    return str
  }
  return num
};

const getLang = function (name) {
  //grab the language from the template name - 'ipa-de'
  let lang = name.match(/ipac?-(.+)/);
  if (lang !== null) {
    if (languages.hasOwnProperty(lang[1]) === true) {
      return languages[lang[1]].english_title
    }
    return lang[1]
  }
  return null
};

const titlecase = (str) => {
  return str.charAt(0).toUpperCase() + str.substring(1)
};

const toOrdinal = function (i) {
  let j = i % 10;
  let k = i % 100;
  if (j === 1 && k !== 11) {
    return i + 'st'
  }
  if (j === 2 && k !== 12) {
    return i + 'nd'
  }
  if (j === 3 && k !== 13) {
    return i + 'rd'
  }
  return i + 'th'
};

const sisterProjects = {
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
  mw: 'mediawiki',
};

var functions = {
  //https://en.wikipedia.org/wiki/Template:Ra
  ra: (tmpl) => {
    let obj = parser(tmpl, ['hours', 'minutes', 'seconds']);
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },

  //https://en.wikipedia.org/wiki/Template:Deg2HMS
  deg2hms: (tmpl) => {
    //this template should do the conversion
    let obj = parser(tmpl, ['degrees']);
    return (obj.degrees || '') + '°'
  },

  hms2deg: (tmpl) => {
    //this template should do the conversion too
    let obj = parser(tmpl, ['hours', 'minutes', 'seconds']);
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },

  decdeg: (tmpl) => {
    //this template should do the conversion too
    let obj = parser(tmpl, ['deg', 'min', 'sec', 'hem', 'rnd']);
    return (obj.deg || obj.degrees) + '°'
  },
  //https://en.wikipedia.org/wiki/Template:Sortname
  sortname: (tmpl) => {
    let obj = parser(tmpl, ['first', 'last', 'target', 'sort']);
    let name = `${obj.first || ''} ${obj.last || ''}`;
    name = name.trim();
    if (obj.nolink) {
      return obj.target || name
    }
    if (obj.dab) {
      name += ` (${obj.dab})`;
      if (obj.target) {
        obj.target += ` (${obj.dab})`;
      }
    }
    if (obj.target) {
      return `[[${obj.target}|${name}]]`
    }
    return `[[${name}]]`
  },

  // https://en.wikipedia.org/wiki/Template:First_word
  'first word': (tmpl) => {
    let obj = parser(tmpl, ['text']);
    let str = obj.text || '';
    if (obj.sep) {
      return str.split(obj.sep)[0]
    }
    return str.split(' ')[0]
  },

  trunc: (tmpl) => {
    let obj = parser(tmpl, ['str', 'len']);
    return (obj.str || '').substr(0, obj.len)
  },

  'str mid': (tmpl) => {
    let obj = parser(tmpl, ['str', 'start', 'end']) || {};
    let start = parseInt(obj.start, 10) - 1;
    let end = parseInt(obj.end, 10);
    return (obj.str || '').substr(start, end)
  },

  reign: (tmpl) => {
    let obj = parser(tmpl, ['start', 'end']);
    return `(r. ${obj.start} – ${obj.end})`
  },

  // https://en.wikipedia.org/wiki/Template:Decade_link
  'decade link': (tmpl) => {
    let { year } = parser(tmpl, ['year']);
    return `${year}|${year}s`
  },

  // https://en.wikipedia.org/wiki/Template:Decade
  decade: (tmpl) => {
    let obj = parser(tmpl, ['year']);
    let year = Number(obj.year);
    year = Math.floor(year / 10) * 10; // round to decade
    return `${year}s`
  },

  // https://en.wikipedia.org/wiki/Template:Century
  century: (tmpl) => {
    let obj = parser(tmpl, ['year']);
    let year = parseInt(obj.year, 10);
    year = Math.floor(year / 100) + 1;
    return `${year}`
  },

  //https://en.wikipedia.org/wiki/Template:Radic
  radic: (tmpl) => {
    let obj = parser(tmpl, ['after', 'before']);
    return `${obj.before || ''}√${obj.after || ''}`
  },

  'medical cases chart/row': (tmpl) => {
    // Deprecated template; we keep it.
    return tmpl
  },

  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: (tmpl) => {
    let obj = parser(tmpl, ['date', 'year']);
    return obj.year ? obj.date + ' ' + obj.year : obj.date
  },

  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: (tmpl) => {
    let obj = parser(tmpl, ['text']);
    let attrs = '';
    if (obj.list) {
      attrs = '|' + obj.list.join('|');
    }
    return '{{' + (obj.text || '') + attrs + '}}'
  },

  hlist: (tmpl) => {
    let obj = parser(tmpl);
    obj.list = obj.list || [];
    return obj.list.join(' · ')
  },

  pagelist: (tmpl) => {
    let arr = parser(tmpl).list || [];
    return arr.join(', ')
  },

  // not perfect - https://en.m.wikipedia.org/wiki/Template:Interlinear
  interlinear: (tmpl) => {
    let arr = parser(tmpl).list || [];
    return arr.join('\n\n')
  },

  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  catlist: (tmpl) => {
    let arr = parser(tmpl).list || [];
    return arr.join(', ')
  },

  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  'br separated entries': (tmpl) => {
    let arr = parser(tmpl).list || [];
    return arr.join('\n\n')
  },

  'comma separated entries': (tmpl) => {
    let arr = parser(tmpl).list || [];
    return arr.join(', ')
  },

  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  'anchored list': (tmpl) => {
    let arr = parser(tmpl).list || [];
    arr = arr.map((str, i) => `${i + 1}. ${str}`);
    return arr.join('\n\n')
  },

  'bulleted list': (tmpl) => {
    let arr = parser(tmpl).list || [];
    arr = arr.filter((f) => f);
    arr = arr.map((str) => '• ' + str);
    return arr.join('\n\n')
  },

  //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: (tmpl) => {
    tmpl = strip(tmpl);
    let arr = tmpl.split('|').slice(1); //remove the title
    arr = arr.join('|').split(/\n ?\* ?/); //split on newline
    arr = arr.filter((s) => s);
    return arr.join('\n\n')
  },

  //https://en.wikipedia.org/wiki/Template:Term
  term: (tmpl) => {
    let obj = parser(tmpl, ['term']);
    return `${obj.term}:`
  },

  linum: (tmpl) => {
    let { num, text } = parser(tmpl, ['num', 'text']);
    return `${num}. ${text}`
  },

  'block indent': (tmpl) => {
    let obj = parser(tmpl);
    if (obj['1']) {
      return '\n' + obj['1'] + '\n'
    }
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: (tmpl) => {
    let obj = parser(tmpl, ['text']);
    return `[[${obj.text} Lifeboat Station|${obj.text}]]`
  },

  //Foo-class
  lbc: (tmpl) => {
    let obj = parser(tmpl, ['text']);
    return `[[${obj.text}-class lifeboat|${obj.text}-class]]`
  },

  lbb: (tmpl) => {
    let obj = parser(tmpl, ['text']);
    return `[[${obj.text}-class lifeboat|${obj.text}]]`
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  '#dateformat': (tmpl) => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parser(tmpl, ['date', 'format']);
    return obj.date
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  lc: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parser(tmpl, ['text']);
    return (obj.text || '').toLowerCase()
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  uc: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parser(tmpl, ['text']);
    return (obj.text || '').toUpperCase()
  },

  lcfirst: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|');
    let text = parser(tmpl, ['text']).text;
    if (!text) {
      return ''
    }
    return text[0].toLowerCase() + text.substr(1)
  },

  ucfirst: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|');
    let text = parser(tmpl, ['text']).text;
    if (!text) {
      return ''
    }
    return text[0].toUpperCase() + text.substr(1)
  },

  padleft: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parser(tmpl, ['text', 'num']);
    let text = obj.text || '';
    return text.padStart(obj.num, obj.str || '0')
  },

  padright: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parser(tmpl, ['text', 'num']);
    let text = obj.text || '';
    return text.padEnd(obj.num, obj.str || '0')
  },

  //https://en.wikipedia.org/wiki/Template:Abbrlink
  abbrlink: (tmpl) => {
    let obj = parser(tmpl, ['abbr', 'page']);
    if (obj.page) {
      return `[[${obj.page}|${obj.abbr}]]`
    }
    return `[[${obj.abbr}]]`
  },

  // https://en.wikipedia.org/wiki/Template:Own
  own: (tmpl) => {
    let obj = parser(tmpl, ['author']);
    let str = 'Own work';
    if (obj.author) {
      str += ' by ' + obj.author;
    }
    return str
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  formatnum: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parser(tmpl, ['number']);
    let str = obj.number || '';
    str = str.replace(/,/g, '');
    let num = Number(str);
    return num.toLocaleString() || ''
  },

  //https://en.wikipedia.org/wiki/Template:Frac
  fraction: (tmpl) => {
    let obj = parser(tmpl, ['a', 'b', 'c']);
    if (obj.c) {
      return `${obj.a} ${obj.b}/${obj.c}`
    }
    if (obj.b) {
      return `${obj.a}/${obj.b}`
    }
    return `1/${obj.b}`
  },

  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: (tmpl) => {
    let obj = parser(tmpl, ['num', 'two', 'three', 'four']);
    //todo: support plural units
    if (obj.two === '-' || obj.two === 'to' || obj.two === 'and') {
      if (obj.four) {
        return `${obj.num} ${obj.two} ${obj.three} ${obj.four}`
      }
      return `${obj.num} ${obj.two} ${obj.three}`
    }
    return `${obj.num} ${obj.two}`
  },

  // Large number of aliases - https://en.wikipedia.org/wiki/Template:Tl
  tl: (tmpl) => {
    let obj = parser(tmpl, ['first', 'second']);
    return obj.second || obj.first
  },

  //this one's a little different
  won: (tmpl) => {
    let data = parser(tmpl, ['text']);
    return data.place || data.text || titlecase(data.template)
  },

  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: (tmpl) => {
    let obj = parser(tmpl, ['tag', 'open']);
    const ignore = {
      span: true,
      div: true,
      p: true,
    };
    //pair, empty, close, single
    if (!obj.open || obj.open === 'pair') {
      //just skip generating spans and things..
      if (ignore[obj.tag]) {
        return obj.content || ''
      }
      return `<${obj.tag} ${obj.attribs || ''}>${obj.content || ''}</${obj.tag}>`
    }
    return ''
  },

  //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
  plural: (tmpl) => {
    tmpl = tmpl.replace(/plural:/, 'plural|');
    let obj = parser(tmpl, ['num', 'word']);
    let num = Number(obj.num);
    let word = obj.word;
    if (num !== 1) {
      if (/.y$/.test(word)) {
        word = word.replace(/y$/, 'ies');
      } else {
        word += 's';
      }
    }
    return num + ' ' + word
  },

  //https://en.wikipedia.org/wiki/Template:DEC
  dec: (tmpl) => {
    let obj = parser(tmpl, ['degrees', 'minutes', 'seconds']);
    let str = (obj.degrees || 0) + '°';
    if (obj.minutes) {
      str += obj.minutes + `′`;
    }
    if (obj.seconds) {
      str += obj.seconds + '″';
    }
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Val
  val: (tmpl) => {
    let obj = parser(tmpl, ['number', 'uncertainty']);
    let num = obj.number;
    if (num && Number(num)) {
      num = Number(num).toLocaleString();
    }
    let str = num || '';
    //prefix/suffix
    if (obj.p) {
      str = obj.p + str;
    }
    if (obj.s) {
      str = obj.s + str;
    }
    //add units, too
    if (obj.u || obj.ul || obj.upl) {
      str = str + ' ' + (obj.u || obj.ul || obj.upl);
    }
    return str
  },

  //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
  percentage: (tmpl) => {
    let obj = parser(tmpl, ['numerator', 'denominator', 'decimals']);
    let num = Number(obj.numerator) / Number(obj.denominator);
    num *= 100;
    if (num === null) {
      return ''
    }
    let dec = Number(obj.decimals) || 0;
    return `${num.toFixed(dec)}%`
  },
  // this one is re-used by i18n
  small: (tmpl) => {
    let obj = parser(tmpl);
    if (obj.list && obj.list[0]) {
      return obj.list[0]
    }
    return ''
  },

  // {{Percent-done|done=N|total=N|digits=N}}
  'percent-done': (tmpl) => {
    let obj = parser(tmpl, ['done', 'total', 'digits']);
    let num = percentage({
      numerator: obj.done,
      denominator: obj.total,
      decimals: obj.digits,
    });
    if (num === null) {
      return ''
    }
    return `${obj.done} (${num}%) done`
  },

  loop: (tmpl) => {
    let data = parser(tmpl, ['times', 'text']);
    let n = Number(data.times) || 0;
    let out = '';
    for (let i = 0; i < n; i += 1) {
      out += data.text || '';
    }
    return out
  },
  'str len': (tmpl) => {
    let data = parser(tmpl, ['text']);
    return String((data.text || '').trim().length)
  },
  digits: (tmpl) => {
    let data = parser(tmpl, ['text']);
    return (data.text || '').replace(/[^0-9]/g, '')
  },
  resize: (tmpl) => {
    let { n, text } = parser(tmpl, ['n', 'text']);
    if (!text) {
      return n || ''
    }
    return text || ''
  },
  'last word': (tmpl) => {
    let data = parser(tmpl, ['text']);
    let arr = (data.text || '').split(/ /g);
    return arr[arr.length - 1] || ''
  },
  replace: (tmpl) => {
    let data = parser(tmpl, ['text', 'from', 'to']);
    if (!data.from || !data.to) {
      return data.text || ''
    }
    return (data.text || '').replace(data.from, data.to)
  },
  'title case': (tmpl) => {
    let data = parser(tmpl, ['text']);
    let txt = data.text || '';
    return txt
      .split(/ /)
      .map((w, i) => {
        if ((i > 0 && w === 'the') || w === 'of') {
          return w
        }
        return titlecase(w)
      })
      .join(' ')
  },
  'no spam': (tmpl) => {
    let data = parser(tmpl, ['account', 'domain']);
    return `${data.account || ''}@${data.domain}`
  },
  'baseball year': (tmpl) => {
    let year = parser(tmpl, ['year']).year || '';
    return `[[${year} in baseball|${year}]]`
  },
  'mlb year': (tmpl) => {
    let year = parser(tmpl, ['year']).year || '';
    return `[[${year} Major League Baseball season|${year}]]`
  },
  'nlds year': (tmpl) => {
    let { year } = parser(tmpl, ['year']);
    return `[[${year || ''} National League Division Series|${year}]]`
  },
  'alds year': (tmpl) => {
    let { year } = parser(tmpl, ['year']);
    return `[[${year || ''} American League Division Series|${year}]]`
  },
  'nfl year': (tmpl) => {
    let { year, other } = parser(tmpl, ['year', 'other']);
    if (other && year) {
      return `[[${year} NFL season|${year}]]–[[${other} NFL season|${other}]]`
    }
    return `[[${year || ''} NFL season|${year}]]`
  },
  'nfl playoff year': (tmpl) => {
    let { year } = parser(tmpl, ['year']);
    year = Number(year);
    let after = year + 1;
    return `[[${year}–${after} NFL playoffs|${year}]]`
  },
  'nba year': (tmpl) => {
    let { year } = parser(tmpl, ['year']);
    year = Number(year);
    let after = year + 1;
    return `[[${year}–${after} NBA season|${year}–${after}]]`
  },
  'mhl year': (tmpl) => {
    let data = parser(tmpl, ['year']);
    let year = Number(data.year);
    let after = year + 1;
    return `[[${year}–${after} NHL season|${year}–${after}]]`
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
    return String(min)
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
    return String(max)
  },
  // US-politics
  uspolabbr: (tmpl) => {
    let { party, state, house } = parser(tmpl, ['party', 'state', 'house', 'link']);
    if (!party || !state) {
      return ''
    }
    let out = `${party}‑${state}`;
    if (house) {
      out += ` ${toOrdinal(house)}`;
    }
    return out
  },
  // https://en.wikipedia.org/wiki/Template:Ushr
  ushr: (tmpl) => {
    let { state, num, type } = parser(tmpl, ['state', 'num', 'type']);
    let link = '';
    if (num === 'AL') {
      link = `${state}'s at-large congressional district`;
    } else {
      num = toOrdinal(Number(num));
      return `${state}'s ${num} congressional district`
    }
    if (type) {
      type = type.toLowerCase();
      num = num === 'AL' ? 'At-large' : num;
      // there are many of these
      if (type === 'e') {
        return `[[${link}|${num}]]`
      }
      if (type === 'u') {
        return `[[${link}|${state}]]`
      }
      if (type === 'b' || type === 'x') {
        return `[[${link}|${state} ${num}]]`
      }
    }
    return `[[${link}]]`
  },

  // transit station links
  metro: (tmpl) => {
    let { name, dab } = parser(tmpl, ['name', 'dab']);
    if (dab) {
      return `[[${name} station (${dab})|${name}]]`
    }
    return `[[${name} station|${name}]]`
  },
  station: (tmpl) => {
    let { name, dab } = parser(tmpl, ['name', 'x', 'dab']);
    if (dab) {
      return `[[${name} station (${dab})|${name}]]`
    }
    return `[[${name} station|${name}]]`
  },
  bssrws: (tmpl) => {
    let { one, two } = parser(tmpl, ['one', 'two']);
    let name = one;
    if (two) {
      name += ' ' + two;
    }
    return `[[${name} railway station|${name}]]`
  },
  stnlnk: (tmpl) => {
    let { name, dab } = parser(tmpl, ['name', 'dab']);
    if (dab) {
      return `[[${name} railway station (${dab})|${name}]]`
    }
    return `[[${name} railway station|${name}]]`
  },
  // https://en.wikipedia.org/wiki/Template:Station_link
  'station link': (tmpl) => {
    let { station, system } = parser(tmpl, ['system', 'station']); //incomplete
    return station || system
  },
  'line link': (tmpl) => {
    let { station, system } = parser(tmpl, ['system', 'station']); //incomplete
    return station || system
  },
  subway: (tmpl) => {
    let { name } = parser(tmpl, ['name']);
    return `[[${name} subway station|${name}]]`
  },
  'lrt station': (tmpl) => {
    let { name } = parser(tmpl, ['name']);
    return `[[${name} LRT station|${name}]]`
  },
  'mrt station': (tmpl) => {
    let { name } = parser(tmpl, ['name']);
    return `[[${name} MRT station|${name}]]`
  },
  rht: (tmpl) => {
    let { name } = parser(tmpl, ['name']);
    return `[[${name} railway halt|${name}]]`
  },
  ferry: (tmpl) => {
    let { name } = parser(tmpl, ['name']);
    return `[[${name} ferry wharf|${name}]]`
  },
  tram: (tmpl) => {
    let { name, dab } = parser(tmpl, ['name', 'dab']);
    if (dab) {
      return `[[${name} tram stop (${dab})|${name}]]`
    }
    return `[[${name} tram stop|${name}]]`
  },
  tstop: (tmpl) => {
    let { name, dab } = parser(tmpl, ['name', 'dab']);
    if (dab) {
      return `[[${name} ${dab} stop|${name}]]`
    }
    return `[[${name} stop|${name}]]`
  },
  // boats
  ship: (tmpl) => {
    let { prefix, name, id } = parser(tmpl, ['prefix', 'name', 'id']);
    prefix = prefix || '';
    return id ? `[[${prefix.toUpperCase()} ${name}]]` : `[[${prefix.toUpperCase()} ${name}]]`
  },
  sclass: (tmpl) => {
    let { cl, type } = parser(tmpl, ['cl', 'type', 'fmt']);
    return `[[${cl}-class ${type} |''${cl}''-class]] [[${type}]]`
  },
  'center block': (tmpl) => {
    let { text } = parser(tmpl, ['text']);
    return text || ''
  },
  align: (tmpl) => {
    let { text } = parser(tmpl, ['dir', 'text']);
    return text || ''
  },
  font: (tmpl) => {
    let { text } = parser(tmpl, ['text']);
    return text || ''
  },
  float: (tmpl) => {
    let { text, dir } = parser(tmpl, ['dir', 'text']);
    if (!text) {
      return dir
    }
    return text || ''
  },
  lower: (tmpl) => {
    let { text, n } = parser(tmpl, ['n', 'text']);
    if (!text) {
      return n
    }
    return text || ''
  },
  splitspan: (tmpl) => {
    let list = parser(tmpl).list || [];
    return (list[0] || '') + '\n' + (list[1] || '')
  },
  bracket: (tmpl) => {
    let { text } = parser(tmpl, ['text']);
    if (text) {
      return `[${text}]`
    }
    return '['
  },

  // https://en.wikipedia.org/wiki/Template:In_title
  'in title': (tmpl) => {
    let { title, text } = parser(tmpl, ['title', 'text']);
    if (text) {
      return text
    }
    if (title) {
      return `All pages with titles containing ${title}` //[[Special: ..]]
    }
    return ''
  },
  'look from': (tmpl) => {
    let { title, text } = parser(tmpl, ['title', 'text']);
    if (text) {
      return text
    }
    if (title) {
      return `All pages with titles beginning with ${title}` //[[Special: ..]]
    }
    return ''
  },

  'literal translation': (tmpl) => {
    let arr = parser(tmpl).list || [];
    arr = arr.map((str) => `'${str}'`);
    return 'lit. ' + arr.join(' or ')
  },
  overset: (tmpl) => {
    let data = parser(tmpl, ['over', 'base']);
    return [data.over || '', data.base || ''].join(' ')
  },
  underset: (tmpl) => {
    let data = parser(tmpl, ['under', 'base']);
    return [data.base || '', data.under || ''].join(' ')
  },
  ceil: (tmpl) => {
    let data = parser(tmpl, ['txt']);
    return `⌈${data.txt}⌉`
  },
  floor: (tmpl) => {
    let data = parser(tmpl, ['txt']);
    return `⌊${data.txt}⌋`
  },
  'vol.': (tmpl) => {
    let data = parser(tmpl, ['n']);
    return `vol. ${data.n}`
  },
  rp: (tmpl) => {
    let data = parser(tmpl, ['page']);
    if (data.pages) {
      return `pp${data.pages}`
    }
    return `p. ${data.page || ''}`
  },
  gaps: (tmpl) => {
    let data = parser(tmpl);
    return data.list.join('  ')
  },
  bra: (tmpl) => {
    let data = parser(tmpl, ['a']);
    return `⟨${data.a || ''}|`
  },
  ket: (tmpl) => {
    let data = parser(tmpl, ['a']);
    return `${data.a || ''}⟩`
  },
  'angle bracket': (tmpl) => {
    let data = parser(tmpl, ['txt']);
    return `⟨${data.txt || ''}⟩`
  },
  'bra-ket': (tmpl) => {
    let data = parser(tmpl, ['a', 'b']);
    return `⟨${data.a || ''}|${data.b || ''}⟩`
  },
  braket: (tmpl) => {
    let data = parser(tmpl, ['sym', 'a', 'b']);
    if (data.sym === 'bra') {
      return `⟨${data.a}|`
    } else if (data.sym === 'ket') {
      return `⟨|${data.a || ''}⟩`
    } else {
      return `⟨${data.a || ''}|${data.b || ''}⟩`
    }
  },
  pars: (tmpl) => {
    let data = parser(tmpl, ['text', 's']);
    return `(${data.text || ''})`
  },
  circumfix: (tmpl) => {
    let data = parser(tmpl, ['text']);
    return `⟩${data.text || ''}⟨`
  },
  fluc: (tmpl) => {
    let data = parser(tmpl, ['val', 'type']);
    let n = Number(data.val);
    if (data['custom label']) {
      return data['custom label']
    }
    if (n > 0) {
      return ` +${n}` //▲
    } else if (n < 0) {
      return ` ${n}` //▼
    } else if (n === 0) {
      return ` no change `
    }
    return data.val || ''
  },

  'p.': (tmpl) => {
    let data = parser(tmpl, ['a', 'b']);
    if (data.b) {
      if (parseInt(data.b, 10)) {
        return `pp. ${data.a}–${data.b}` //page-range
      } else {
        return `pp. ${data.a}${data.b}`
      }
    }
    return `p. ${data.a || ''}`
  },
  subsup: (tmpl) => {
    let data = parser(tmpl, ['symbol', 'subscript', 'superscript']);
    return `${data.symbol || ''} ${data.subscript || ''} ${data.superscript || ''}`
  },
  su: (tmpl) => {
    let data = parser(tmpl, ['p', 'b']);
    return `${data.p || ''} ${data.b || ''}`
  },
  precision: (tmpl) => {
    let data = parser(tmpl, ['num']);
    let num = data.num || '';
    if (!num.match(/\./) && num.match(/0*$/) && num !== '0') {
      return num.match(/0*$/)[0].length * -1
    }
    let dec = num.split(/\./)[1] || '';
    return dec.length
  },
  intmath: (tmpl) => {
    let data = parser(tmpl, ['sign', 'subscript', 'superscript']);
    const signs = {
      int: '∫',
      iint: '∬',
      iiint: '∭',
      oint: '∮',
      varointclockwise: '∲',
      ointctrclockwise: '∳',
      oiint: '∯',
      oiiint: '∰',
    };
    return `${signs[data.sign] || ''} ${data.superscript || ''} ${data.subscript || ''} `
  },
  ldelim: (tmpl) => {
    let data = parser(tmpl, ['a', 'b', 'sub', 'sup']);
    let after = `${data.sub || ''}${data.sup || ''}`;
    if (data.a === 'square') {
      return `[${data.b || ''}]${after}`
    } else if (data.a === 'round') {
      return `(${data.b || ''})${after}`
    } else if (data.a === 'vert') {
      return `|${data.b || ''}|${after}`
    } else if (data.a === 'doublevert') {
      return `||${data.b || ''}||${after}`
    }
    return `${data.b || ''} ${after}`
  },
  multiply: (tmpl) => {
    let data = parser(tmpl, ['a', 'b']);
    return Number(data.a) * Number(data.b)
  },
  sum: (tmpl) => {
    let data = parser(tmpl, ['a', 'b']);
    return Number(data.a) + Number(data.b)
  },
  round: (tmpl) => {
    let data = parser(tmpl, ['val', 'decimals']);
    let n = Number(data.val);
    //todo: handle decimal place
    return Math.round(n) || ''
  },
  rounddown: (tmpl) => {
    let data = parser(tmpl, ['val', 'decimals']);
    let n = Number(data.val);
    //todo: handle decimal place
    return Math.floor(n) || ''
  },
  roundup: (tmpl) => {
    let data = parser(tmpl, ['val', 'decimals']);
    let n = Number(data.val);
    //todo: handle decimal place
    return Math.ceil(n) || ''
  },
  parity: (tmpl) => {
    let data = parser(tmpl, ['val', 'even', 'odd']);
    if (Number(data.val) % 2 === 0) {
      return data.even || 'even'
    }
    return data.odd || 'odd'
  },
  hexadecimal: (tmpl) => {
    let data = parser(tmpl, ['val']);
    let n = Number(data.val);
    if (!n) {
      return data.val
    }
    return n.toString(16).toUpperCase()
  },
  octal: (tmpl) => {
    let data = parser(tmpl, ['val']);
    let n = Number(data.val);
    if (!n) {
      return data.val
    }
    return n.toString(8).toUpperCase() + '₈'
  },
  decimal2base: (tmpl) => {
    let data = parser(tmpl, ['n', 'radix']);
    let n = Number(data.n);
    let radix = Number(data.radix);
    if (!n || !radix) {
      return data.n
    }
    return n.toString(radix).toUpperCase()
  },
  hex2dec: (tmpl) => {
    let data = parser(tmpl, ['val']);
    return parseInt(data.val, 16) || data.val
  },
  ifnotempty: (tmpl) => {
    let data = parser(tmpl, ['cond', 'a', 'b']);
    if (data.cond) {
      return data.a
    }
    return data.b
  },
  both: (tmpl) => {
    let data = parser(tmpl, ['a', 'b']);
    if (data.a && data.b) {
      return '1'
    }
    return ''
  },
  ifnumber: (tmpl) => {
    let data = parser(tmpl, ['n', 'yes', 'no']);
    if (!isNaN(Number(data.n))) {
      return data.yes || '1'
    }
    return data.no || ''
  },
  'order of magnitude': (tmpl) => {
    let data = parser(tmpl, ['val']);
    let num = parseInt(data.val, 10);
    //todo: support decimal forms
    if (num || num === 0) {
      return String(num).length - 1
    }
    return '0'
  },
  'percent and number': (tmpl) => {
    let data = parser(tmpl, ['number', 'total', 'decimals']);
    let n = Number(data.number) / Number(data.total);
    n *= 100;
    let dec = Number(data.decimals) || 0;
    return `${n.toFixed(dec)}% (${Number(data.number).toLocaleString()})`
  },
  music: (tmpl) => {
    let data = parser(tmpl, ['glyph']);
    // these have unicode working character subs
    let glyphs = {
      flat: '♭',
      b: '♭',
      sharp: '♯',
      '#': '♯',
      natural: '♮',
      n: '♮',
      doubleflat: '𝄫',
      bb: '𝄫',
      '##': '𝄪',
      doublesharp: '𝄪',
      quarternote: '♩',
      quarter: '♩',
      treble: '𝄞',
      trebleclef: '𝄞',
      bass: '𝄢',
      bassclef: '𝄢',
      altoclef: '𝄡',
      alto: '𝄡',
      tenor: '𝄡',
      tenorclef: '𝄡',
    };
    if (glyphs.hasOwnProperty(data.glyph)) {
      return glyphs[data.glyph]
    }
    return ''
  },
  simplenuclide: (tmpl) => {
    let data = parser(tmpl, ['name', 'mass']);
    return `[[${data.name}|${data.mass || ''}${data.name}]]`
  },
  'font color': (tmpl) => {
    let data = parser(tmpl, ['fg', 'bg', 'text']);
    if (data.bg && data.text) {
      return data.text
    }
    return data.bg
  },
  'colored link': (tmpl) => {
    let data = parser(tmpl, ['color', 'title', 'text']);
    return `[[${data.title}|${data.text || data.title}]]`
  },
  nftu: (tmpl) => {
    let data = parser(tmpl, ['age', 'team']);
    return `${data.team} U${data.age}`
  },
  tls: (tmpl) => {
    let data = parser(tmpl, ['name', 'one', 'two']);
    let out = `subst:${data.name}`;
    if (data.one) {
      out += '|' + data.one;
    }
    if (data.two) {
      out += '|' + data.two;
    }
    return `{{${out}}}`
  },
};

let shorthands = [
  // {{HWV|251d}} - handel, bach
  ['bwv', 'BWV'],
  ['hwv', 'HWV'],
  ['d.', 'D '], //Deutsch catalogue
  ['aka', 'a.k.a. '],

  // date abbreviations
  ['cf.', 'cf. '],
  ['fl.', 'fl. '],
  ['circa', 'c. '],
  ['born in', 'b. '],
  ['died-in', 'd. '],
  ['married-in', 'm. '],
];
// create a function for each one
let fns$1 = shorthands.reduce((h, a) => {
  let [name, out] = a;
  h[name] = (tmpl) => {
    let { first } = parser(tmpl, ['first']);
    if (first || first === 0) {
      return out + (first || '')
    }
    return out
  };
  return h
}, {});

// return only the name of the template
let justNames = [
  'they',
  'them',
  'their',
  'theirs',
  'themself',
  'they are',
  'they were',
  'they have',
  'they do',
  'he or she',
  'him or her',
  'his or her',
  'his or hers',
  'he/she',
  'him/her',
  'his/her',
];
justNames.forEach((str) => {
  fns$1[str] = str;
});

let templates$a = {};
let more = [
  'sr-latn-cyrl', //first parameter latin, second cyrillic
  'sr-cyrl-latn', //first parameter cyrillic, second latin
  'sr-latn', //one parameter latin
  'sr-cyrl', //one parameter cyrillic
  'sr-cyr',
  'sh-latn-cyrl', //for both Latin and Cyrillic in that order
  'sh-cyrl-latn', //for both Cyrillic and Latin in that order
  'sh-latn', //for Latin
  'sh-cyrl', //for Cyrillic
  'cel-1bd',
  'cel-x-proto',
  'en-emodeng',
  'de-at',
  'de-ch',
  'gem-x-proto',
  'gsw-fr',
  'nds-nl',
  'nl-be',
  'ku-arab',
  'ku-cyrl',
  'pt-br',
  'fra-frc',
  'fra-que',
  'roa-leo',
  'roa-nor',
  'ca-valencia',
  'ast-leo',
  'grc-gre',
  'grc-x-doric',
  'grc-x-proto',
  'grc-x-medieval',
  'cpg',
  'gmy',
  'grc',
  'grk-x-proto',
  'pnt',
  'mga',
  'owl',
  'pgl',
  'sga',
  'wlm',
  'xbm',
  'xcb',
  'xcg',
  'xpi',
  'aae',
  'aln',
  'sq-definite',
  'bs-cyrl',
  'hsb',
  'ltg',
  'orv',
  'prg',
  'rsk',
  'rue',
  'rus',
  'sgs',
  'sla',
  'szl',
  'wen',
  'aoa',
  'chn',
  'cri',
  'dlm',
  'egl',
  'fax',
  'frc',
  'frm',
  'fro',
  'fr-gallo',
  'oc-gascon',
  'gcf',
  'gcr',
  'ist',
  'la-x-medieval',
  'lij-mc',
  'lld',
  'lou',
  'mfe',
  'mol',
  'mwl',
  'mxi',
  'nrf',
  'osc',
  'osp',
  'pcd',
  'pln',
  'rcf',
  'rgn',
  'roa',
  'ruo',
  'rup',
  'ruq',
  'sdc',
  'sdn',
  'src',
  'sro',
  'xvo',
  'bzj',
  'cim',
  'dum',
  'enm',
  'frk',
  'frr',
  'frs',
  'gmh',
  'gml',
  'gmw',
  'goh',
  'gos',
  'gsw',
  'gyn',
  'icr',
  'jam',
  'kri',
  'lng',
  'nb',
  'non',
  'nrn',
  'odt',
  'ofs',
  'osx',
  'pey',
  'sli',
  'srm',
  'srn',
  'stq',
  'swg',
  'vmf',
  'wae',
  'wep',
  'wes',
  'zea',
  'hmd',
  'hoc',
  'kha',
  'mnw',
  'mtq',
  'vi-chunom',
  'vi-hantu',
  'mvi',
  'rys',
  'ryu',
  'yoi',
  'ace',
  'akl',
  'ami',
  'bew',
  'bik',
  'bjn',
  'bya',
  'cal',
  'cbk',
  'cjm',
  'coa',
  'cyo',
  'dev',
  'fil',
  'gad',
  'hil',
  'iba',
  'ibg',
  'ibl',
  'ilp',
  'itv',
  'ivv',
  'jax',
  'kne',
  'krj',
  'kxd',
  'ljp',
  'mad',
  'mak',
  'mdh',
  'mrv',
  'mrw',
  'ms-arab',
  'nia',
  'niu',
  'pau',
  'pwn',
  'rap',
  'rar',
  'sgd',
  'su-fonts',
  'szy',
  'tao',
  'tkl',
  'tsg',
  'tvl',
  'uli',
  'wls',
  'xsb',
  'yap',
  'yka',
  'ckt',
  'itl',
  'brh',
  'oty',
  'tcy',
  'abq',
  'ady',
  'ddo',
  'inh',
  'kbd',
  'lbe',
  'lez',
  'rut',
  'tab',
  'uby',
  'udi',
  'bai',
  'bin',
  'bsq',
  'dag',
  'dyu',
  'efi',
  'fan',
  'fmp',
  'fuc',
  'fuf',
  'gaa',
  'ibb',
  'kbp',
  'kcg',
  'kpo',
  'ktu',
  'lu',
  'lua',
  'lun',
  'mkw',
  'mos',
  'oaa',
  'sjo',
  'ude',
  'anm',
  'bft',
  'blk',
  'brx',
  'dng',
  'kjp',
  'kjz',
  'ksw',
  'lbj',
  'lus',
  'aae',
  'aaq',
  'abe',
  'abq',
  'aca',
  'ace',
  'acf',
  'acm',
  'acw',
  'ady',
  'ae',
  'aeb',
  'aec',
  'aer',
  'afb',
  'aht',
  'aii',
  'aij',
  'ain',
  'aiq',
  'akk',
  'akl',
  'akz',
  'ale',
  'aln',
  'alq',
  'alt',
  'ami',
  'anm',
  'aoa',
  'apj',
  'apm',
  'apw',
  'ayn',
  'arb',
  'arh',
  'ari',
  'arn',
  'arp',
  'arq',
  'ary',
  'arz',
  'asb',
  'ath',
  'ats',
  'awa',
  'axm',
  'azb',
  'azd',
  'azj',
  'bai',
  'bal',
  'ban',
  'bax',
  'bdz',
  'bea',
  'ber',
  'bew',
  'bft',
  'bgn',
  'bho',
  'bik',
  'bin',
  'bjn',
  'bla',
  'blc',
  'blk',
  'bqi',
  'brh',
  'brx',
  'bsk',
  'bsq',
  'bua',
  'bvb',
  'bya',
  'bzj',
  'cal',
  'cay',
  'cbk',
  'ccp',
  'chg',
  'chm',
  'chn',
  'chp',
  'cic',
  'cim',
  'ciw',
  'cjm',
  'cjs',
  'ckb',
  'ckt',
  'cku',
  'cld',
  'clm',
  'cmg',
  'cmn',
  'cms',
  'cnu',
  'coa',
  'coc',
  'coj',
  'com',
  'coo',
  'cop',
  'cpg',
  'crg',
  'crh',
  'cri',
  'crj',
  'crk',
  'crl',
  'crm',
  'cro',
  'csw',
  'csz',
  'ctg',
  'ctm',
  'cyo',
  'dag',
  'dak',
  'ddo',
  'deh',
  'del',
  'den',
  'dev',
  'din',
  'dlm',
  'dng',
  'dum',
  'dyu',
  'efi',
  'egl',
  'egy',
  'elx',
  'eml',
  'ems',
  'cmn',
  'och',
  'yue',
  'mjw',
  'mni',
  'my-name-mlcts',
  'nan',
  'nwc',
  'omp',
  'otb',
  'pwo',
  'sip',
  'xct',
  'xsr',
  '1ca',
  'alt',
  'az-arab',
  'azb',
  'azj',
  'chg',
  'cjs',
  'crh',
  'crh3',
  'kaa',
  'kjh',
  'krc',
  'kum',
  'nog',
  'ota',
  'otk',
  'sah',
  'slr',
  'sty',
  'tt-arab',
  'tt-cyrl',
  'tt-latn',
  'tyv',
  'uniturk',
  'chm',
  'est-sea',
  'fit',
  'fkv',
  'izh',
  'jmy',
  'koi',
  'krl',
  'liv',
  'mdf',
  'mhr',
  'mrj',
  'myv',
  'olo',
  'sia',
  'sjd',
  'sje',
  'sjk',
  'sjt',
  'sju',
  'sma',
  'smi',
  'smj',
  'smn',
  'sms',
  'vep',
  'vot',
  'vro',
  'yrk',
  'din',
  'luo',
  'srr',
  'sus',
  'swh',
  'umb',
  'yao',
];

// more languages
more.forEach((k) => {
  templates$a['lang-' + k] = 0;
});

//https://en.wikipedia.org/wiki/Category:Lang-x_templates
Object.keys(languages).forEach((k) => {
  templates$a['lang-' + k] = 0;
});

var flags = [
  ['🇦🇩', 'and', 'andorra'],
  ['🇦🇪', 'are', 'united arab emirates'],
  ['🇦🇫', 'afg', 'afghanistan'],
  ['🇦🇬', 'atg', 'antigua and barbuda'],
  ['🇦🇮', 'aia', 'anguilla'],
  ['🇦🇱', 'alb', 'albania'],
  ['🇦🇲', 'arm', 'armenia'],
  ['🇦🇴', 'ago', 'angola'],
  ['🇦🇶', 'ata', 'antarctica'],
  ['🇦🇷', 'arg', 'argentina'],
  ['🇦🇸', 'asm', 'american samoa'],
  ['🇦🇹', 'aut', 'austria'],
  ['🇦🇺', 'aus', 'australia'],
  ['🇦🇼', 'abw', 'aruba'],
  ['🇦🇽', 'ala', 'åland islands'],
  ['🇦🇿', 'aze', 'azerbaijan'],
  ['🇧🇦', 'bih', 'bosnia and herzegovina'],
  ['🇧🇧', 'brb', 'barbados'],
  ['🇧🇩', 'bgd', 'bangladesh'],
  ['🇧🇪', 'bel', 'belgium'],
  ['🇧🇫', 'bfa', 'burkina faso'],
  ['🇧🇬', 'bgr', 'bulgaria'],
  ['🇧🇬', 'bul', 'bulgaria'], //dupe
  ['🇧🇭', 'bhr', 'bahrain'],
  ['🇧🇮', 'bdi', 'burundi'],
  ['🇧🇯', 'ben', 'benin'],
  ['🇧🇱', 'blm', 'saint barthélemy'],
  ['🇧🇲', 'bmu', 'bermuda'],
  ['🇧🇳', 'brn', 'brunei darussalam'],
  ['🇧🇴', 'bol', 'bolivia'],
  ['🇧🇶', 'bes', 'bonaire, sint eustatius and saba'],
  ['🇧🇷', 'bra', 'brazil'],
  ['🇧🇸', 'bhs', 'bahamas'],
  ['🇧🇹', 'btn', 'bhutan'],
  ['🇧🇻', 'bvt', 'bouvet island'],
  ['🇧🇼', 'bwa', 'botswana'],
  ['🇧🇾', 'blr', 'belarus'],
  ['🇧🇿', 'blz', 'belize'],
  ['🇨🇦', 'can', 'canada'],
  ['🇨🇨', 'cck', 'cocos (keeling) islands'],
  ['🇨🇩', 'cod', 'congo'],
  ['🇨🇫', 'caf', 'central african republic'],
  ['🇨🇬', 'cog', 'congo'],
  ['🇨🇭', 'che', 'switzerland'],
  ['🇨🇮', 'civ', "côte d'ivoire"],
  ['🇨🇰', 'cok', 'cook islands'],
  ['🇨🇱', 'chl', 'chile'],
  ['🇨🇲', 'cmr', 'cameroon'],
  ['🇨🇳', 'chn', 'china'],
  ['🇨🇴', 'col', 'colombia'],
  ['🇨🇷', 'cri', 'costa rica'],
  ['🇨🇺', 'cub', 'cuba'],
  ['🇨🇻', 'cpv', 'cape verde'],
  ['🇨🇼', 'cuw', 'curaçao'],
  ['🇨🇽', 'cxr', 'christmas island'],
  ['🇨🇾', 'cyp', 'cyprus'],
  ['🇨🇿', 'cze', 'czech republic'],
  ['🇩🇪', 'deu', 'germany'],
  ['🇩🇪', 'ger', 'germany'], //alias
  ['🇩🇯', 'dji', 'djibouti'],
  ['🇩🇰', 'dnk', 'denmark'],
  ['🇩🇲', 'dma', 'dominica'],
  ['🇩🇴', 'dom', 'dominican republic'],
  ['🇩🇿', 'dza', 'algeria'],
  ['🇪🇨', 'ecu', 'ecuador'],
  ['🇪🇪', 'est', 'estonia'],
  ['🇪🇬', 'egy', 'egypt'],
  ['🇪🇭', 'esh', 'western sahara'],
  ['🇪🇷', 'eri', 'eritrea'],
  ['🇪🇸', 'esp', 'spain'],
  ['🇪🇹', 'eth', 'ethiopia'],
  ['🇫🇮', 'fin', 'finland'],
  ['🇫🇯', 'fji', 'fiji'],
  ['🇫🇰', 'flk', 'falkland islands (malvinas)'],
  ['🇫🇲', 'fsm', 'micronesia'],
  ['🇫🇴', 'fro', 'faroe islands'],
  ['🇫🇷', 'fra', 'france'],
  ['🇬🇦', 'gab', 'gabon'],
  ['🇬🇧', 'gbr', 'united kingdom'],
  ['🇬🇩', 'grd', 'grenada'],
  //['🇬🇪', 'geo', 'georgia'],
  ['🇬🇫', 'guf', 'french guiana'],
  ['🇬🇬', 'ggy', 'guernsey'],
  ['🇬🇭', 'gha', 'ghana'],
  ['🇬🇮', 'gib', 'gibraltar'],
  ['🇬🇱', 'grl', 'greenland'],
  ['🇬🇲', 'gmb', 'gambia'],
  ['🇬🇳', 'gin', 'guinea'],
  ['🇬🇵', 'glp', 'guadeloupe'],
  ['🇬🇶', 'gnq', 'equatorial guinea'],
  ['🇬🇷', 'grc', 'greece'],
  ['🇬🇸', 'sgs', 'south georgia'],
  ['🇬🇹', 'gtm', 'guatemala'],
  ['🇬🇺', 'gum', 'guam'],
  ['🇬🇼', 'gnb', 'guinea-bissau'],
  ['🇬🇾', 'guy', 'guyana'],
  ['🇭🇰', 'hkg', 'hong kong'],
  ['🇭🇲', 'hmd', 'heard island and mcdonald islands'],
  ['🇭🇳', 'hnd', 'honduras'],
  ['🇭🇷', 'hrv', 'croatia'],
  ['🇭🇹', 'hti', 'haiti'],
  ['🇭🇺', 'hun', 'hungary'],
  ['🇮🇩', 'idn', 'indonesia'],
  ['🇮🇪', 'irl', 'ireland'],
  ['🇮🇱', 'isr', 'israel'],
  ['🇮🇲', 'imn', 'isle of man'],
  ['🇮🇳', 'ind', 'india'],
  ['🇮🇴', 'iot', 'british indian ocean territory'],
  ['🇮🇶', 'irq', 'iraq'],
  ['🇮🇷', 'irn', 'iran'],
  ['🇮🇸', 'isl', 'iceland'],
  ['🇮🇹', 'ita', 'italy'],
  ['🇯🇪', 'jey', 'jersey'],
  ['🇯🇲', 'jam', 'jamaica'],
  ['🇯🇴', 'jor', 'jordan'],
  ['🇯🇵', 'jpn', 'japan'],
  ['🇰🇪', 'ken', 'kenya'],
  ['🇰🇬', 'kgz', 'kyrgyzstan'],
  ['🇰🇭', 'khm', 'cambodia'],
  ['🇰🇮', 'kir', 'kiribati'],
  ['🇰🇲', 'com', 'comoros'],
  ['🇰🇳', 'kna', 'saint kitts and nevis'],
  ['🇰🇵', 'prk', 'north korea'],
  ['🇰🇷', 'kor', 'south korea'],
  ['🇰🇼', 'kwt', 'kuwait'],
  ['🇰🇾', 'cym', 'cayman islands'],
  ['🇰🇿', 'kaz', 'kazakhstan'],
  ['🇱🇦', 'lao', "lao people's democratic republic"],
  ['🇱🇧', 'lbn', 'lebanon'],
  ['🇱🇨', 'lca', 'saint lucia'],
  ['🇱🇮', 'lie', 'liechtenstein'],
  ['🇱🇰', 'lka', 'sri lanka'],
  ['🇱🇷', 'lbr', 'liberia'],
  ['🇱🇸', 'lso', 'lesotho'],
  ['🇱🇹', 'ltu', 'lithuania'],
  ['🇱🇺', 'lux', 'luxembourg'],
  ['🇱🇻', 'lva', 'latvia'],
  ['🇱🇾', 'lby', 'libya'],
  ['🇲🇦', 'mar', 'morocco'],
  ['🇲🇨', 'mco', 'monaco'],
  ['🇲🇩', 'mda', 'moldova'],
  ['🇲🇪', 'mne', 'montenegro'],
  ['🇲🇫', 'maf', 'saint martin (french part)'],
  ['🇲🇬', 'mdg', 'madagascar'],
  ['🇲🇭', 'mhl', 'marshall islands'],
  ['🇲🇰', 'mkd', 'macedonia'],
  ['🇲🇱', 'mli', 'mali'],
  ['🇲🇲', 'mmr', 'myanmar'],
  ['🇲🇳', 'mng', 'mongolia'],
  ['🇲🇴', 'mac', 'macao'],
  ['🇲🇵', 'mnp', 'northern mariana islands'],
  ['🇲🇶', 'mtq', 'martinique'],
  ['🇲🇷', 'mrt', 'mauritania'],
  ['🇲🇸', 'msr', 'montserrat'],
  ['🇲🇹', 'mlt', 'malta'],
  ['🇲🇺', 'mus', 'mauritius'],
  ['🇲🇻', 'mdv', 'maldives'],
  ['🇲🇼', 'mwi', 'malawi'],
  ['🇲🇽', 'mex', 'mexico'],
  ['🇲🇾', 'mys', 'malaysia'],
  ['🇲🇿', 'moz', 'mozambique'],
  ['🇳🇦', 'nam', 'namibia'],
  ['🇳🇨', 'ncl', 'new caledonia'],
  ['🇳🇪', 'ner', 'niger'],
  ['🇳🇫', 'nfk', 'norfolk island'],
  ['🇳🇬', 'nga', 'nigeria'],
  ['🇳🇮', 'nic', 'nicaragua'],
  ['🇳🇱', 'nld', 'netherlands'],
  ['🇳🇴', 'nor', 'norway'],
  ['🇳🇵', 'npl', 'nepal'],
  ['🇳🇷', 'nru', 'nauru'],
  ['🇳🇺', 'niu', 'niue'],
  ['🇳🇿', 'nzl', 'new zealand'],
  ['🇴🇲', 'omn', 'oman'],
  ['🇵🇦', 'pan', 'panama'],
  ['🇵🇪', 'per', 'peru'],
  ['🇵🇫', 'pyf', 'french polynesia'],
  ['🇵🇬', 'png', 'papua new guinea'],
  ['🇵🇭', 'phl', 'philippines'],
  ['🇵🇰', 'pak', 'pakistan'],
  ['🇵🇱', 'pol', 'poland'],
  ['🇵🇲', 'spm', 'saint pierre and miquelon'],
  ['🇵🇳', 'pcn', 'pitcairn'],
  ['🇵🇷', 'pri', 'puerto rico'],
  ['🇵🇸', 'pse', 'palestinian territory'],
  ['🇵🇹', 'prt', 'portugal'],
  ['🇵🇼', 'plw', 'palau'],
  ['🇵🇾', 'pry', 'paraguay'],
  ['🇶🇦', 'qat', 'qatar'],
  ['🇷🇪', 'reu', 'réunion'],
  ['🇷🇴', 'rou', 'romania'],
  ['🇷🇸', 'srb', 'serbia'],
  ['🇷🇺', 'rus', 'russia'],
  ['🇷🇼', 'rwa', 'rwanda'],
  ['🇸🇦', 'sau', 'saudi arabia'],
  ['🇸🇧', 'slb', 'solomon islands'],
  ['🇸🇨', 'syc', 'seychelles'],
  ['🇸🇩', 'sdn', 'sudan'],
  ['🇸🇪', 'swe', 'sweden'],
  ['🇸🇬', 'sgp', 'singapore'],
  ['🇸🇭', 'shn', 'saint helena, ascension and tristan da cunha'],
  ['🇸🇮', 'svn', 'slovenia'],
  ['🇸🇯', 'sjm', 'svalbard and jan mayen'],
  ['🇸🇰', 'svk', 'slovakia'],
  ['🇸🇱', 'sle', 'sierra leone'],
  ['🇸🇲', 'smr', 'san marino'],
  ['🇸🇳', 'sen', 'senegal'],
  ['🇸🇴', 'som', 'somalia'],
  ['🇸🇷', 'sur', 'suriname'],
  ['🇸🇸', 'ssd', 'south sudan'],
  ['🇸🇹', 'stp', 'sao tome and principe'],
  ['🇸🇻', 'slv', 'el salvador'],
  ['🇸🇽', 'sxm', 'sint maarten (dutch part)'],
  ['🇸🇾', 'syr', 'syrian arab republic'],
  ['🇸🇿', 'swz', 'swaziland'],
  ['🇹🇨', 'tca', 'turks and caicos islands'],
  ['🇹🇩', 'tcd', 'chad'],
  ['🇹🇫', 'atf', 'french southern territories'],
  ['🇹🇬', 'tgo', 'togo'],
  ['🇹🇭', 'tha', 'thailand'],
  ['🇹🇯', 'tjk', 'tajikistan'],
  ['🇹🇰', 'tkl', 'tokelau'],
  // ['🇹🇱', 'tls', 'timor-leste'],
  ['🇹🇲', 'tkm', 'turkmenistan'],
  ['🇹🇳', 'tun', 'tunisia'],
  ['🇹🇴', 'ton', 'tonga'],
  ['🇹🇷', 'tur', 'turkey'],
  ['🇹🇹', 'tto', 'trinidad and tobago'],
  ['🇹🇻', 'tuv', 'tuvalu'],
  ['🇹🇼', 'twn', 'taiwan'],
  ['🇹🇿', 'tza', 'tanzania'],
  ['🇺🇦', 'ukr', 'ukraine'],
  ['🇺🇬', 'uga', 'uganda'],
  ['🇺🇲', 'umi', 'united states minor outlying islands'],
  ['🇺🇸', 'us', 'united states'], //alias
  ['🇺🇸', 'usa', 'united states'],
  ['🇺🇾', 'ury', 'uruguay'],
  ['🇺🇿', 'uzb', 'uzbekistan'],
  ['🇻🇦', 'vat', 'vatican city'],
  ['🇻🇨', 'vct', 'saint vincent and the grenadines'],
  ['🇻🇪', 'ven', 'venezuela'],
  ['🇻🇬', 'vgb', 'virgin islands, british'],
  ['🇻🇮', 'vir', 'virgin islands, u.s.'],
  ['🇻🇳', 'vnm', 'viet nam'],
  ['🇻🇺', 'vut', 'vanuatu'],
  ['🇼🇫', 'wlf', 'wallis and futuna'],
  ['🇼🇸', 'wsm', 'samoa'],
  ['🇾🇪', 'yem', 'yemen'],
  ['🇾🇹', 'myt', 'mayotte'],
  ['🇿🇦', 'zaf', 'south africa'],
  ['🇿🇲', 'zmb', 'zambia'],
  ['🇿🇼 ', 'zwe', 'zimbabwe'],
  //others (later unicode versions)
  ['🇺🇳', 'un', 'united nations'],
  ['🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'eng', 'england'],
  ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sct', 'scotland'],
  ['🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'wal', 'wales'],
  ['🇪🇺', 'eu', 'european union'],
];

const order = ['flag', 'variant'];
let templates$9 = {
  //https://en.wikipedia.org/wiki/Template:Flag
  // {{flag|USA}} →  USA
  flag: (tmpl) => {
    let obj = parser(tmpl, order);
    let name = obj.flag || '';
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || [];
    let flag = found[0] || '';
    return `${flag} [[${found[2]}|${name}]]`
  },
  // {{flagcountry|USA}} →  United States
  flagcountry: (tmpl) => {
    let obj = parser(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || [];
    let flag = found[0] || '';
    return `${flag} [[${found[2]}]]`
  },
  // (unlinked flag-country)
  flagcu: (tmpl) => {
    let obj = parser(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || [];
    let flag = found[0] || '';
    return `${flag} ${found[2]}`
  },
  //https://en.wikipedia.org/wiki/Template:Flagicon
  // {{flagicon|USA}} → United States
  flagicon: (tmpl) => {
    let obj = parser(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]);
    if (!found) {
      return ''
    }
    return `[[${found[2]}|${found[0]}]]`
  },
  //unlinked flagicon
  flagdeco: (tmpl) => {
    let obj = parser(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || [];
    return found[0] || ''
  },
  //same, but a soccer team
  fb: (tmpl) => {
    let obj = parser(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]);
    if (!found) {
      return ''
    }
    return `${found[0]} [[${found[2]} national football team|${found[2]}]]`
  },
  fbicon: (tmpl) => {
    let obj = parser(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]);
    if (!found) {
      return ''
    }
    return ` [[${found[2]} national football team|${found[0]}]]`
  },
  flagathlete: (tmpl) => {
    let obj = parser(tmpl, ['name', 'flag', 'variant']);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]);
    if (!found) {
      return `[[${obj.name || ''}]]`
    }
    return `${found[0]} [[${obj.name || ''}]] (${found[1].toUpperCase()})`
  },
};
//support {{can}}
flags.forEach((a) => {
  templates$9[a[1]] = () => {
    return a[0]
  };
});

//random misc for inline wikipedia templates

//https://en.wikipedia.org/wiki/Template:Yes
let templates$8 = {};
let cells = [
  'rh',
  'rh2',
  'yes',
  'no',
  'maybe',
  'eliminated',
  'lost',
  'safe',
  'active',
  'site active',
  'coming soon',
  'good',
  'won',
  'nom',
  'sho',
  'longlisted',
  'tba',
  'success',
  'operational',
  'failure',
  'partial',
  'regional',
  'maybecheck',
  'partial success',
  'partial failure',
  'okay',
  'yes-no',
  'some',
  'nonpartisan',
  'pending',
  'unofficial',
  'unofficial2',
  'usually',
  'rarely',
  'sometimes',
  'any',
  'varies',
  'black',
  'non-album single',
  'unreleased',
  'unknown',
  'perhaps',
  'depends',
  'included',
  'dropped',
  'terminated',
  'beta',
  'table-experimental',
  'free',
  'proprietary',
  'nonfree',
  'needs',
  'nightly',
  'release-candidate',
  'planned',
  'scheduled',
  'incorrect',
  'no result',
  'cmain',
  'calso starring',
  'crecurring',
  'cguest',
  'not yet',
  'optional',
];
cells.forEach((str) => {
  templates$8[str] = (tmpl) => {
    let data = parser(tmpl, ['text']);
    return data.text || titlecase(data.template)
  };
});

//these ones have a text result
let moreCells = [
  ['active fire', 'Active'],
  ['site active', 'Active'],
  ['site inactive', 'Inactive'],
  ['yes2', ''],
  ['no2', ''],
  ['ya', '✅'],
  ['na', '❌'],
  ['nom', 'Nominated'],
  ['sho', 'Shortlisted'],
  ['tba', 'TBA'],
  ['maybecheck', '✔️'],
  ['okay', 'Neutral'],
  ['n/a', 'N/A'],
  ['sdash', '—'],
  ['dunno', '?'],
  ['draw', ''],
  ['cnone', ''],
  ['nocontest', ''],
];
moreCells.forEach((a) => {
  templates$8[a[0]] = (tmpl) => {
    let data = parser(tmpl, ['text']);
    return data.text || a[1]
  };
});

var textTmpl = Object.assign({}, hardcoded, templates$c, templates$b, functions, templates$a, fns$1, templates$9, templates$8);

let templates$7 = {};
// these all have ['id', 'name']
let idName = [
  'goodreads author',
  'twitter',
  'facebook',
  'instagram',
  'tumblr',
  'pinterest',
  'espn nfl',
  'espn nhl',
  'espn fc',
  'hockeydb',
  'fifa player',
  'worldcat',
  'worldcat id',
  'nfl player',
  'ted speaker',
  'playmate',
];
idName.forEach((name) => {
  templates$7[name] = ['id', 'name'];
});

let templates$6 = {};
// these all have ['id', 'title', 'description', 'section']
let idTitle = [
  'imdb title', //https://en.wikipedia.org/wiki/Template:IMDb_title
  'imdb name',
  'imdb episode',
  'imdb event',
  'afi film',
  'allmovie title',
  'allgame',
  'tcmdb title',
  'discogs artist',
  'discogs label',
  'discogs release',
  'discogs master',
  'librivox author',
  'musicbrainz artist',
  'musicbrainz label',
  'musicbrainz recording',
  'musicbrainz release',
  'musicbrainz work',
  'youtube',
  'goodreads book',
  'dmoz', //https://en.wikipedia.org/wiki/Template:DMOZ
];
idTitle.forEach((name) => {
  templates$6[name] = ['id', 'title', 'description', 'section'];
});

// dummy templates that get parsed properly already,
// but present here for for aliases + template coverage tests
let templates$5 = {};
let dummies = ['citation needed'];
dummies.forEach((name) => {
  // just parse it and do nothing
  templates$5[name] = (tmpl, list) => {
    list.push(parser(tmpl));
    return ''
  };
});

var fns = {
  // https://en.wikipedia.org/wiki/Template:IPA
  ipa: (tmpl, list) => {
    let obj = parser(tmpl, ['transcription', 'lang', 'audio']);
    obj.lang = getLang(obj.template);
    obj.template = 'ipa';
    list.push(obj);
    return '' //obj.transcription
  },
  //https://en.wikipedia.org/wiki/Template:IPAc-en
  ipac: (tmpl, list) => {
    let obj = parser(tmpl);
    obj.transcription = (obj.list || []).join(',');
    delete obj.list;
    obj.lang = getLang(obj.template);
    obj.template = 'ipac';
    list.push(obj);
    return ''
  },

  quote: (tmpl, list) => {
    let obj = parser(tmpl, ['text', 'author']);
    list.push(obj);
    //create plaintext version
    if (obj.text) {
      let str = `"${obj.text}"`;
      if (obj.author) {
        str += '\n\n';
        str += `    - ${obj.author}`;
      }
      return str + '\n'
    }
    return ''
  },

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, list) => {
    let obj = parser(tmpl, ['id', 'name', 'type']);
    obj.type = 'gnis';
    obj.template = 'citation';
    list.push(obj);
    return ''
  },

  'spoken wikipedia': (tmpl, list) => {
    let obj = parser(tmpl, ['file', 'date']);
    obj.template = 'audio';
    list.push(obj);
    return ''
  },

  //yellow card
  yel: (tmpl, list) => {
    let obj = parser(tmpl, ['min']);
    list.push(obj);
    if (obj.min) {
      return `yellow: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  subon: (tmpl, list) => {
    let obj = parser(tmpl, ['min']);
    list.push(obj);
    if (obj.min) {
      return `sub on: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  suboff: (tmpl, list) => {
    let obj = parser(tmpl, ['min']);
    list.push(obj);
    if (obj.min) {
      return `sub off: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sfn
  sfn: (tmpl, list, parser$1, alias) => {
    let obj = parser(tmpl, ['author', 'year', 'location']);
    if (alias) {
      obj.name = obj.template;
      obj.teplate = alias;
    }
    list.push(obj);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: (tmpl, list) => {
    let data = parser(tmpl, ['redirect']);
    let lines = data.list || [];
    let links = [];
    for (let i = 0; i < lines.length; i += 2) {
      links.push({
        page: lines[i + 1],
        desc: lines[i],
      });
    }
    let obj = {
      template: 'redirect',
      redirect: data.redirect,
      links: links,
    };
    list.push(obj);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': (tmpl, list) => {
    let data = parser(tmpl);
    //rename 'wd' to 'wikidata'
    let links = {};
    Object.keys(sisterProjects).forEach((k) => {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k]; //.text();
      }
    });
    let obj = {
      template: 'sister project links',
      links: links,
    };
    list.push(obj);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Subject_bar
  'subject bar': (tmpl, list) => {
    let data = parser(tmpl);
    Object.keys(data).forEach((k) => {
      //rename 'voy' to 'wikivoyage'
      if (sisterProjects.hasOwnProperty(k)) {
        data[sisterProjects[k]] = data[k];
        delete data[k];
      }
    });
    let obj = {
      template: 'subject bar',
      links: data,
    };
    list.push(obj);
    return ''
  },

  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  gallery: (tmpl, list) => {
    let obj = parser(tmpl);
    let images = (obj.list || []).filter((line) => /^ *File ?:/.test(line));
    images = images.map((file) => {
      let img = {
        file: file,
      };
      // todo: add lang and domain information
      return new Image(img).json()
    });
    obj = {
      template: 'gallery',
      images: images,
    };
    list.push(obj);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sky
  sky: (tmpl, list) => {
    let obj = parser(tmpl, [
      'asc_hours',
      'asc_minutes',
      'asc_seconds',
      'dec_sign',
      'dec_degrees',
      'dec_minutes',
      'dec_seconds',
      'distance',
    ]);
    let template = {
      template: 'sky',
      ascension: {
        hours: obj.asc_hours,
        minutes: obj.asc_minutes,
        seconds: obj.asc_seconds,
      },
      declination: {
        sign: obj.dec_sign,
        degrees: obj.dec_degrees,
        minutes: obj.dec_minutes,
        seconds: obj.dec_seconds,
      },
      distance: obj.distance,
    };
    list.push(template);
    return ''
  },

  // Parse https://en.wikipedia.org/wiki/Template:Medical_cases_chart -- see
  // https://en.wikipedia.org/wiki/Module:Medical_cases_chart for the original
  // parsing code.
  'medical cases chart': (tmpl, list) => {
    let order = [
      'date',
      'deathsExpr',
      'recoveriesExpr',
      'casesExpr',
      '4thExpr',
      '5thExpr',
      'col1',
      'col1Change',
      'col2',
      'col2Change',
    ];

    let obj = parser(tmpl);
    obj.data = obj.data || '';
    let rows = obj.data.split('\n');

    // Mimic row parsing in _buildBars in the Lua source, from the following
    // line on:
    //
    //     for parameter in mw.text.gsplit(line, ';') do
    let dataArray = rows.map((row) => {
      let parameters = row.split(';');
      let rowObject = {
        options: new Map(),
      };
      let positionalIndex = 0;
      for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[i].trim();
        if (parameter.match(/^[a-z_]/i)) {
          // Named argument
          let [key, value] = parameter.split('=');
          // At this point, the Lua code evaluates alttot1 and alttot2 values as
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
      return rowObject
    });
    obj.data = dataArray;
    list.push(obj);
    return ''
  },

  graph: (tmpl, list) => {
    let data = parser(tmpl);
    if (data.x) {
      data.x = data.x.split(',').map((str) => str.trim());
    }
    if (data.y) {
      data.y = data.y.split(',').map((str) => str.trim());
    }
    let y = 1;
    while (data['y' + y]) {
      data['y' + y] = data['y' + y].split(',').map((str) => str.trim());
      y += 1;
    }
    list.push(data);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Historical_populations
  'historical populations': (tmpl, list) => {
    let data = parser(tmpl);
    data.list = data.list || [];
    let years = [];
    for (let i = 0; i < data.list.length; i += 2) {
      let num = data.list[i + 1];
      years.push({
        year: data.list[i],
        val: Number(num) || num,
      });
    }
    data.data = years;
    delete data.list;
    list.push(data);
    return ''
  },

  // this one is a handful!
  //https://en.wikipedia.org/wiki/Template:Weather_box
  'weather box': (tmpl, list) => {
    const hasMonth = /^jan /i;
    const isYear = /^year /i;
    let obj = parser(tmpl);
    const monthList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let byMonth = {};
    let properties = Object.keys(obj).filter((k) => hasMonth.test(k));
    properties = properties.map((k) => k.replace(hasMonth, ''));
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
    //add these to original
    obj.byMonth = byMonth;
    //collect year-based data
    let byYear = {};
    Object.keys(obj).forEach((k) => {
      if (isYear.test(k)) {
        let prop = k.replace(isYear, '');
        byYear[prop] = obj[k];
        delete obj[k];
      }
    });
    obj.byYear = byYear;
    list.push(obj);
    return ''
  },

  //The 36 parameters are: 12 monthly highs (C), 12 lows (total 24) plus an optional 12 monthly rain/precipitation
  //https://en.wikipedia.org/wiki/Template:Weather_box/concise_C
  'weather box/concise c': (tmpl, list) => {
    let obj = parser(tmpl);
    obj.list = obj.list.map((s) => toNumber(s));
    obj.byMonth = {
      'high c': obj.list.slice(0, 12),
      'low c': obj.list.slice(12, 24),
      'rain mm': obj.list.slice(24, 36),
    };
    delete obj.list;
    obj.template = 'weather box';
    list.push(obj);
    return ''
  },

  'weather box/concise f': (tmpl, list) => {
    let obj = parser(tmpl);
    obj.list = obj.list.map((s) => toNumber(s));
    obj.byMonth = {
      'high f': obj.list.slice(0, 12),
      'low f': obj.list.slice(12, 24),
      'rain inch': obj.list.slice(24, 36),
    };
    delete obj.list;
    obj.template = 'weather box';
    list.push(obj);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Climate_chart
  'climate chart': (tmpl, list) => {
    let lines = parser(tmpl).list || [];
    let title = lines[0];
    let source = lines[38];
    lines = lines.slice(1);
    //amazingly, they use '−' symbol here instead of negatives...
    lines = lines.map((str) => {
      if (str && str[0] === '−') {
        str = str.replace(/−/, '-');
      }
      return str
    });
    let months = [];
    //groups of three, for 12 months
    for (let i = 0; i < 36; i += 3) {
      months.push({
        low: toNumber(lines[i]),
        high: toNumber(lines[i + 1]),
        precip: toNumber(lines[i + 2]),
      });
    }
    let obj = {
      template: 'climate chart',
      data: {
        title: title,
        source: source,
        months: months,
      },
    };
    list.push(obj);
    return ''
  },
  //https://en.wikipedia.org/wiki/Template:MedalCount
  medalcount: (tmpl, list) => {
    let all = parser(tmpl).list || [];
    let lines = [];
    for (let i = 0; i < all.length; i += 4) {
      lines.push({
        name: all[i],
        '1st': Number(all[i + 1]),
        '2nd': Number(all[i + 2]),
        '3rd': Number(all[i + 3]),
      });
    }
    let obj = {
      template: 'medalcount',
      list: lines,
    };
    list.push(obj);
    return ''
  },

  r: (tmpl, list) => {
    let obj = parser(tmpl, ['name']);
    obj.template = 'citation';
    list.push(obj);
    return ''
  },
};

let templates$4 = {
  //https://en.wikipedia.org/wiki/Category:External_link_templates
  'find a grave': ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'],
  congbio: ['id', 'name', 'date'],
  'hollywood walk of fame': ['name'],
  'wide image': ['file', 'width', 'caption'],
  audio: ['file', 'text', 'type'],
  rp: ['page'],
  'short description': ['description'],
  'coord missing': ['region'],
  unreferenced: ['date'],
  'taxon info': ['taxon', 'item'], //https://en.wikipedia.org/wiki/Template:Taxon_info
  'portuguese name': ['first', 'second', 'suffix'], // https://en.wikipedia.org/wiki/Template:Portuguese_name
  geo: ['lat', 'lon', 'zoom'], //https://en.wikivoyage.org/wiki/Template:Geo
  hatnote: ['text'],
};

templates$4 = Object.assign(templates$4, templates$5, templates$7, templates$6, fns);

var dataTmpl = templates$4;

const mlbplayer = {
  props: ['number', 'name', 'il'],
  out: 'name',
};
const syntaxhighlight = {
  props: [],
  out: 'code',
};
const samp = {
  props: ['1'],
  out: '1',
};
const sub = {
  props: ['text'],
  out: 'text',
};
const sup = {
  props: ['text'],
  out: 'text',
};
const chem2 = {
  props: ['equation'],
  out: 'equation',
};
const ill = {
  props: ['text', 'lan1', 'text1', 'lan2', 'text2'],
  out: 'text',
};
const abbr = {
  props: ['abbr', 'meaning', 'ipa'],
  out: 'abbr',
};

var shorthand = {
  mlbplayer,
  syntaxhighlight,
  samp,
  sub,
  sup,
  chem2,
  ill,
  abbr,
};

let templates$3 = {
  // https://en.wikipedia.org/wiki/Template:Math
  math: (tmpl, list) => {
    let obj = parser(tmpl, ['formula']);
    list.push(obj);
    return '\n\n' + (obj.formula || '') + '\n\n'
  },

  //svg labels - https://en.m.wikipedia.org/wiki/Template:Legend
  legend: (tmpl, list) => {
    let obj = parser(tmpl, ['color', 'label']);
    list.push(obj);
    // return obj.label || ' '
    return tmpl // keep the wiki?
  },

  isbn: (tmpl, list) => {
    let obj = parser(tmpl, ['id', 'id2', 'id3']);
    list.push(obj);
    return 'ISBN ' + (obj.id || '')
  },

  //https://en.wikipedia.org/wiki/Template:Based_on
  'based on': (tmpl, list) => {
    let obj = parser(tmpl, ['title', 'author']);
    list.push(obj);
    return `${obj.title} by ${obj.author || ''}`
  },

  //barrels of oil https://en.wikipedia.org/wiki/Template:Bbl_to_t
  'bbl to t': (tmpl, list) => {
    let obj = parser(tmpl, ['barrels']);
    list.push(obj);
    if (obj.barrels === '0') {
      return obj.barrels + ' barrel'
    }
    return obj.barrels + ' barrels'
  },

  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: (tmpl, list) => {
    let obj = parser(tmpl, ['number', 'text']);
    list.push(obj);
    return `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text || obj.number}]`
  },

  pengoal: (_tmpl, list) => {
    list.push({
      template: 'pengoal',
    });
    return '✅'
  },

  penmiss: (_tmpl, list) => {
    list.push({
      template: 'penmiss',
    });
    return '❌'
  },

  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': (tmpl, list) => {
    let obj = parser(tmpl);
    list.push(obj);
    obj.list = obj.list || [];
    let lines = obj.list.map((str, i) => `${i + 1}. ${str}`);
    return lines.join('\n\n')
  },

  // https://en.wikipedia.org/wiki/Template:Title_year
  'title year': (tmpl, _list, _alias, _parse, doc) => {
    let obj = parser(tmpl, ['match', 'nomatch', 'page']);
    let title = obj.page || doc.title();
    if (title) {
      let m = title.match(/\b[0-9]{4}\b/); //parse the year out of the title's name
      if (m) {
        return m[0]
      }
    }
    return obj.nomatch || '' //use default response
  },

  // https://en.wikipedia.org/wiki/Template:Title_century
  'title century': (tmpl, _list, _alias, _parse, doc) => {
    let obj = parser(tmpl, ['match', 'nomatch', 'page']);
    let title = obj.page || doc.title();
    if (title) {
      let m = title.match(/\b([0-9]+)(st|nd|rd|th)\b/); //parse the century out of the title's name
      if (m) {
        return m[1] || ''
      }
    }
    return obj.nomatch || '' //use default response
  },

  // https://en.wikipedia.org/wiki/Template:Title_decade
  'title decade': (tmpl, _list, _alias, _parse, doc) => {
    let obj = parser(tmpl, ['match', 'nomatch', 'page']);
    let title = obj.page || doc.title();
    if (title) {
      let m = title.match(/\b([0-9]+)s\b/); //parse the decade out of the title's name
      if (m) {
        return m[1] || ''
      }
    }
    return obj.nomatch || '' //use default response
  },

  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: (tmpl, list) => {
    let obj = parser(tmpl, ['english', 'kanji', 'romaji', 'extra']);
    list.push(obj);
    let str = obj.english || obj.romaji || '';
    if (obj.kanji) {
      str += ` (${obj.kanji})`;
    }
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: (tmpl, list) => {
    let data = parser(tmpl, ['spouse', 'from', 'to', 'end']);
    list.push(data);
    let str = data.spouse || '';
    if (data.from) {
      if (data.to) {
        str += ` (m. ${data.from}-${data.to})`;
      } else {
        str += ` (m. ${data.from})`;
      }
    }
    return str
  },

  //'red' card - {{sent off|cards|min1|min2}}
  'sent off': (tmpl, list) => {
    let obj = parser(tmpl, ['cards']);
    let result = {
      template: 'sent off',
      cards: obj.cards,
      minutes: obj.list || [],
    };
    list.push(result);
    let mins = result.minutes.map((m) => m + "'").join(', ');
    return 'sent off: ' + mins
  },

  transl: (tmpl, list) => {
    let obj = parser(tmpl, ['lang', 'text', 'text2']);
    // support 3-param
    if (obj.text2) {
      obj.iso = obj.text;
      obj.text = obj.text2;
      delete obj.text2;
    }
    list.push(obj);
    return obj.text || ''
  },

  //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': (tmpl, list) => {
    let obj = parser(tmpl);
    list.push(obj);
    let str = '';
    if (obj.title) {
      str += `'''${obj.title}'''` + '\n\n';
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
    str += obj.list.join('\n\n');
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Columns-list
  'columns-list': (tmpl, list) => {
    let arr = parser(tmpl).list || [];
    let str = arr[0] || '';
    let lines = str.split(/\n/).filter((f) => f);
    lines = lines.map((s) => s.replace(/\*/, ''));
    list.push({
      template: 'columns-list',
      list: lines,
    });
    lines = lines.map((s) => '• ' + s);
    return lines.join('\n\n')
  },

  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl, list) => {
    let obj = parser(tmpl);
    list.push(obj);
    let result = [];
    let units = ['m', 'cm', 'ft', 'in']; //order matters
    units.forEach((unit) => {
      if (obj.hasOwnProperty(unit) === true) {
        result.push(obj[unit] + unit);
      }
    });
    return result.join(' ')
  },

  //https://en.wikipedia.org/wiki/Template:Sic
  sic: (tmpl, list) => {
    let obj = parser(tmpl, ['one', 'two', 'three']);
    let word = (obj.one || '') + (obj.two || '');
    //support '[sic?]'
    if (obj.one === '?') {
      word = (obj.two || '') + (obj.three || '');
    }
    list.push({
      template: 'sic',
      word: word,
    });
    if (obj.nolink === 'y') {
      return word
    }
    return `${word} [sic]`
  },

  //
  inrconvert: (tmpl, list) => {
    let o = parser(tmpl, ['rupee_value', 'currency_formatting']);
    list.push(o);
    const mults = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
      t: 1000000000000,
      l: 100000,
      c: 10000000,
      lc: 1000000000000,
    };
    if (o.currency_formatting) {
      let multiplier = mults[o.currency_formatting] || 1;
      o.rupee_value = o.rupee_value * multiplier;
    }
    return `inr ${o.rupee_value || ''}`
  },

  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  frac: (tmpl, list) => {
    let obj = parser(tmpl, ['a', 'b', 'c']);
    let data = {
      template: 'sfrac',
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
      return `${data.integer} ${data.numerator}⁄${data.denominator}`
    }
    return `${data.numerator}⁄${data.denominator}`
  },

  'winning percentage': (tmpl, list) => {
    let obj = parser(tmpl, ['wins', 'losses', 'ties']);
    list.push(obj);
    let wins = Number(obj.wins);
    let losses = Number(obj.losses);
    let ties = Number(obj.ties) || 0;
    let games = wins + losses + ties;
    if (obj.ignore_ties === 'y') {
      ties = 0;
    }
    if (ties) {
      wins += ties / 2;
    }
    let num = percentage({
      numerator: wins,
      denominator: games,
      decimals: 1,
    });
    if (num === null) {
      return ''
    }
    return `.${num * 10}`
  },

  winlosspct: (tmpl, list) => {
    let obj = parser(tmpl, ['wins', 'losses']);
    list.push(obj);
    let wins = Number(obj.wins);
    let losses = Number(obj.losses);
    let num = percentage({
      numerator: wins,
      denominator: wins + losses,
      decimals: 1,
    });
    if (num === null) {
      return ''
    }
    let out = `.${num * 10}`;
    return `${wins || 0} || ${losses || 0} || ${out || '-'}`
  },

  //https://en.wikipedia.org/wiki/Template:Video_game_release
  'video game release': (tmpl, list) => {
    let order = ['region', 'date', 'region2', 'date2', 'region3', 'date3', 'region4', 'date4'];
    let obj = parser(tmpl, order);
    let template = {
      template: 'video game release',
      releases: [],
    };
    for (let i = 0; i < order.length; i += 2) {
      if (obj[order[i]]) {
        template.releases.push({
          region: obj[order[i]],
          date: obj[order[i + 1]],
        });
      }
    }
    list.push(template);
    let str = template.releases.map((o) => `${o.region}: ${o.date || ''}`).join('\n\n');
    return '\n' + str + '\n'
  },
  // https://en.m.wikipedia.org/wiki/Template:USS
  uss: (tmpl, list) => {
    let obj = parser(tmpl, ['name', 'id']);
    list.push(obj);
    if (obj.id) {
      return `[[USS ${obj.name} (${obj.id})|USS ''${obj.name}'' (${obj.id})]]`
    }
    return `[[USS ${obj.name}|USS ''${obj.name}'']]`
  },
  // https://en.wikipedia.org/wiki/Template:Blockquote
  blockquote: (tmpl, list) => {
    let props = ['text', 'author', 'title', 'source', 'character'];
    let obj = parser(tmpl, props);
    list.push(obj);
    let txt = obj.text;
    // used first un-named param
    if (!txt) {
      obj.list = obj.list || [];
      txt = obj.list[0] || '';
    }
    // replace double quotes with singles and put the text inside double quotes
    let result = txt.replace(/"/g, "'");
    result = '"' + result + '"';
    return result
  },

  // https://de.m.wikipedia.org/wiki/Vorlage:ReptileDatabase
  ReptileDatabase: (tmpl, list) => {
    let obj = parser(tmpl, ['taxon', 'genus', 'species', 'abruf', 'pure_url']);
    list.push(obj);
    let str = '';
    if (obj.genus || obj.species) {
      str = `${obj.genus || ''} ${obj.species || ''} `;
    }
    return `${str}In: [[The Reptile Database]]`
  },
  //https://en.m.wikipedia.org/wiki/Template:GEOnet3
  GEOnet3: (tmpl, list) => {
    let obj = parser(tmpl, ['ufi', 'name']);
    list.push(obj);
    return `GEOnet3 can be found at [[GEOnet Names Server]], at [http://geonames.nga.mil/namesgaz/ this link]`
  },
  'poem quote': (tmpl, list) => {
    let obj = parser(tmpl, ['text', 'char', 'sign', 'source', 'title']);
    list.push(obj);
    let out = obj.text || '';
    if (obj.char || obj.sign || obj.source || obj.title) {
      out += '\n\n —';
      out += obj.char ? ' ' + obj.char : '';
      out += obj.sign ? ' ' + obj.sign : '';
      out += obj.source ? ' ' + obj.source : '';
      out += obj.title ? ' ' + obj.title : '';
    }
    return out
  },
  tweet: (tmpl, list) => {
    let obj = parser(tmpl);
    list.push(obj);
    let out = obj.text || '';
    out += obj.date ? ' ' + obj.date : '';
    return out
  },
};

const codes$1 = {
  '£': 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  '¥': '¥', // https://en.wikipedia.org/wiki/Template:JPY
  '৳': '৳', // https://en.wikipedia.org/wiki/Template:BDT
  '₩': '₩', // https://en.wikipedia.org/wiki/Template:SK_won
  '€': '€', // https://en.wikipedia.org/wiki/Template:€
  '₱': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  '₹': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  '₽': '₽', // https://en.wikipedia.org/wiki/Template:RUB
  'cn¥': 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  'gb£': 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  'india rs': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupee symbol': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupee': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupees': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'philippine peso': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  'russian ruble': '₽', // https://en.wikipedia.org/wiki/Template:Russian_ruble
  'SK won': '₩', // https://en.wikipedia.org/wiki/Template:SK_won
  'turkish lira': 'TRY', //https://en.wikipedia.org/wiki/Template:Turkish_lira
  a$: 'A$', // https://en.wikipedia.org/wiki/Template:AUD
  au$: 'A$', //https://en.wikipedia.org/wiki/Template:AUD
  aud: 'A$', //https://en.wikipedia.org/wiki/Template:AUD
  bdt: 'BDT', //https://en.wikipedia.org/wiki/Template:BDT
  brl: 'BRL', //https://en.wikipedia.org/wiki/Template:BRL
  ca$: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  cad: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  chf: 'CHF', // https://en.wikipedia.org/wiki/Template:CHF
  cny: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  czk: 'czk', // https://en.wikipedia.org/wiki/Template:CZK
  dkk: 'dkk', // https://en.wikipedia.org/wiki/Template:DKK
  dkk2: 'dkk', // https://en.wikipedia.org/wiki/Template:DKK
  euro: '€', // https://en.wikipedia.org/wiki/Template:€
  gbp: 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  hk$: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  hkd: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  ils: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  inr: '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  jpy: '¥', // https://en.wikipedia.org/wiki/Template:JPY
  myr: 'MYR', // https://en.wikipedia.org/wiki/Template:MYR
  nis: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  nok: 'NOK', //https://en.wikipedia.org/wiki/Template:NOK
  nok2: 'NOK', //https://en.wikipedia.org/wiki/Template:NOK
  nz$: 'NZ$', //https://en.wikipedia.org/wiki/Template:NZD
  nzd: 'NZ$', //https://en.wikipedia.org/wiki/Template:NZD
  peso: 'peso', //https://en.wikipedia.org/wiki/Template:Peso
  pkr: '₨', // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
  r$: 'BRL', //https://en.wikipedia.org/wiki/Template:BRL
  rmb: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  rub: '₽', // https://en.wikipedia.org/wiki/Template:RUB
  ruble: '₽', // https://en.wikipedia.org/wiki/Template:Ruble
  rupee: '₹', // https://en.wikipedia.org/wiki/Template:Rupee
  s$: 'sgd', // https://en.wikipedia.org/wiki/Template:SGD
  sek: 'SEK', // https://en.wikipedia.org/wiki/Template:SEK
  sek2: 'SEK', // https://en.wikipedia.org/wiki/Template:SEK
  sfr: 'CHF', // https://en.wikipedia.org/wiki/Template:CHF
  sgd: 'sgd', // https://en.wikipedia.org/wiki/Template:SGD
  shekel: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  sheqel: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  ttd: 'TTD', //https://en.wikipedia.org/wiki/Template:TTD
  us$: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  usd: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  yen: '¥', // https://en.wikipedia.org/wiki/Template:JPY
  zar: 'R', //https://en.wikipedia.org/wiki/Template:ZAR
};

const parseCurrency = (tmpl, list) => {
  let o = parser(tmpl, ['amount', 'code']);
  list.push(o);
  let code = o.template || '';
  if (code === 'currency') {
    code = o.code;
    if (!code) {
      o.code = code = 'usd'; //Special case when currency template has no code argument
    }
  } else if (code === '' || code === 'monnaie' || code === 'unité' || code === 'nombre' || code === 'nb') {
    code = o.code;
  }
  code = (code || '').toLowerCase();
  if (code === 'us') {
    o.code = code = 'usd';
  } else if (code === 'uk') {
    o.code = code = 'gbp';
  }
  let str = `${codes$1[code] || ''}${o.amount || ''}`;
  //support unknown currencies after the number - like '5 BTC'
  if (o.code && !codes$1[o.code.toLowerCase()]) {
    str += ' ' + o.code;
  }
  return str
};

let templates$2 = {
  currency: parseCurrency,
};
//and the others fit the same pattern
Object.keys(codes$1).forEach((k) => {
  templates$2[k] = parseCurrency;
});

//this is allowed to be rough
const day = 1000 * 60 * 60 * 24;
const month = day * 30;
const year = day * 365;

const getEpoch = function (obj) {
  return new Date(`${obj.year}-${obj.month || 0}-${obj.date || 1}`).getTime()
};

//very rough!
const delta = function (from, to) {
  from = getEpoch(from);
  to = getEpoch(to);
  let diff = to - from;
  let obj = {};
  //get years
  let years = Math.floor(diff / year);
  if (years > 0) {
    obj.years = years;
    diff -= obj.years * year;
  }
  //get months
  let monthCount = Math.floor(diff / month);
  if (monthCount > 0) {
    obj.months = monthCount;
    diff -= obj.months * month;
  }
  //get days
  let days = Math.floor(diff / day);
  if (days > 0) {
    obj.days = days;
    // diff -= (obj.days * day);
  }
  return obj
};

//not all too fancy - used in {{timesince}}
const timeSince = function (str) {
  let d = new Date(str);
  if (isNaN(d.getTime())) {
    return ''
  }
  let now = new Date();
  let delt = now.getTime() - d.getTime();
  let predicate = 'ago';
  if (delt < 0) {
    predicate = 'from now';
    delt = Math.abs(delt);
  }
  //figure out units
  let hours = delt / 1000 / 60 / 60;
  let days = hours / 24;
  if (days < 365) {
    return Number(days) + ' days ' + predicate
  }
  let years = days / 365;
  return Number(years) + ' years ' + predicate
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//assorted parsing methods for date/time templates
const months$1 = [
  undefined, //1-based months.. :/
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const monthName = months$1.reduce((h, str, i) => {
  if (i === 0) {
    return h
  }
  h[str.toLowerCase()] = i;
  h[str.substring(0, 3).toLowerCase()] = i;
  return h
}, {});

//parse year|month|date numbers
const ymd = function (arr) {
  let obj = {};
  let units = ['year', 'month', 'date', 'hour', 'minute', 'second'];
  //parse each unit in sequence..
  for (let i = 0; i < units.length; i += 1) {
    //skip it
    if (!arr[i] && arr[1] !== 0) {
      continue
    }
    let num = parseInt(arr[i], 10);
    if (isNaN(num) === false) {
      obj[units[i]] = num; //we good.
    } else if (units[i] === 'month') {
      let m = arr[i].toLowerCase().trim();
      //try for month-name, like 'january
      if (monthName.hasOwnProperty(m)) {
        let month = monthName[m];
        obj[units[i]] = month;
      }
    } else {
      //we dead. so skip this unit
      delete obj[units[i]];
    }
  }
  //try for timezone,too ftw
  let last = arr[arr.length - 1] || '';
  last = String(last);
  if (last.toLowerCase() === 'z') {
    obj.tz = 'UTC';
  } else if (/[+-][0-9]+:[0-9]/.test(last)) {
    obj.tz = arr[6];
  }
  return obj
};

//zero-pad a number
const pad = function (num) {
  if (num < 10) {
    return '0' + num
  }
  return String(num)
};

const toText = function (date) {
  //eg '1995'
  let str = String(date.year || '');
  if (date.month !== undefined && months$1.hasOwnProperty(date.month) === true) {
    if (date.date === undefined) {
      //January 1995
      str = `${months$1[date.month]} ${date.year}`;
    } else {
      //January 5, 1995
      str = `${months$1[date.month]} ${date.date}, ${date.year}`;
      //add times, if available
      if (date.hour !== undefined && date.minute !== undefined) {
        let time = `${pad(date.hour)}:${pad(date.minute)}`;
        if (date.second !== undefined) {
          time = time + ':' + pad(date.second);
        }
        str = time + ', ' + str;
        //add timezone, if there, at the end in brackets
      }
      if (date.tz) {
        str += ` (${date.tz})`;
      }
    }
  }
  return str
};

const toTextBritish = function (date) {
  //eg '1995'
  let str = String(date.year || '');
  if (date.month !== undefined && months$1.hasOwnProperty(date.month) === true) {
    if (date.date === undefined) {
      //January 1995
      str = `${months$1[date.month]} ${date.year}`;
    } else {
      //5 January 1995
      str = `${date.date} ${months$1[date.month]} ${date.year}`;
      //add times, if available
      if (date.hour !== undefined && date.minute !== undefined) {
        let time = `${pad(date.hour)}:${pad(date.minute)}`;
        if (date.second !== undefined) {
          time = time + ':' + pad(date.second);
        }
        str = time + ', ' + str;
        //add timezone, if there, at the end in brackets
      }
      if (date.tz) {
        str += ` (${date.tz})`;
      }
    }
  }
  return str
};

// console.log(toText(ymd([2018, 3, 28])));

//wrap it up as a template
const template = function (date) {
  return {
    template: 'date',
    data: date,
  }
};

const getBoth = function (tmpl) {
  tmpl = strip(tmpl);
  let arr = tmpl.split('|');
  let from = ymd(arr.slice(1, 4));
  let to = arr.slice(4, 7);
  //assume now, if 'to' is empty
  if (to.length === 0) {
    let d = new Date();
    to = [d.getFullYear(), d.getMonth(), d.getDate()];
  }
  to = ymd(to);
  return {
    from: from,
    to: to,
  }
};

const parsers = {
  //generic {{date|year|month|date}} template
  date: (tmpl, list) => {
    let order = ['year', 'month', 'date', 'hour', 'minute', 'second', 'timezone'];
    let obj = parser(tmpl, order);
    let data = ymd([obj.year, obj.month, obj.date || obj.day]);
    obj.text = toText(data); //make the replacement string
    if (obj.timezone) {
      if (obj.timezone === 'Z') {
        obj.timezone = 'UTC';
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
    return obj.text
  },

  //support parsing of 'February 10, 1992'
  natural_date: (tmpl, list) => {
    let obj = parser(tmpl, ['text']);
    let str = obj.text || '';
    // - just a year
    let date = {};
    if (/^[0-9]{4}$/.test(str)) {
      date.year = parseInt(str, 10);
    } else {
      //parse the date, using the js date object (for now?)
      let txt = str.replace(/[a-z]+\/[a-z]+/i, '');
      txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i, '');
      let d = new Date(txt);
      if (isNaN(d.getTime()) === false) {
        date.year = d.getFullYear();
        date.month = d.getMonth() + 1;
        date.date = d.getDate();
      }
    }
    list.push(template(date));
    return str.trim()
  },

  //just grab the first value, and assume it's a year
  one_year: (tmpl, list) => {
    let obj = parser(tmpl, ['year']);
    let year = Number(obj.year);
    list.push(
      template({
        year: year,
      })
    );
    return String(year)
  },

  //assume 'y|m|d' | 'y|m|d' // {{BirthDeathAge|B|1976|6|6|1990|8|8}}
  two_dates: (tmpl, list) => {
    let order = ['b', 'birth_year', 'birth_month', 'birth_date', 'death_year', 'death_month', 'death_date'];
    let obj = parser(tmpl, order);
    //'b' means show birth-date, otherwise show death-date
    if (obj.b && obj.b.toLowerCase() === 'b') {
      let date = ymd([obj.birth_year, obj.birth_month, obj.birth_date]);
      list.push(template(date));
      return toText(date)
    }
    let date = ymd([obj.death_year, obj.death_month, obj.death_date]);
    list.push(template(date));
    return toText(date)
  },

  age: (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    return diff.years || 0
  },

  'diff-y': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    if (diff.years === 1) {
      return diff.years + ' year'
    }
    return (diff.years || 0) + ' years'
  },

  'diff-ym': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
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
    return arr.join(', ')
  },

  'diff-ymd': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
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
    return arr.join(', ')
  },

  'diff-yd': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
    if (diff.years === 1) {
      arr.push(diff.years + ' year');
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years');
    }
    //ergh...
    diff.days += (diff.months || 0) * 30;
    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }
    return arr.join(', ')
  },

  'diff-d': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
    //ergh...
    diff.days += (diff.years || 0) * 365;
    diff.days += (diff.months || 0) * 30;
    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }
    return arr.join(', ')
  },
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

//date- templates we support
var dates = {
  currentday: () => {
    let d = new Date();
    return String(d.getDate())
  },
  currentdayname: () => {
    let d = new Date();
    return days[d.getDay()]
  },
  currentmonth: () => {
    let d = new Date();
    return months[d.getMonth()]
  },
  currentyear: () => {
    let d = new Date();
    return String(d.getFullYear())
  },
  monthyear: () => {
    let d = new Date();
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },
  'monthyear-1': () => {
    let d = new Date();
    d.setMonth(d.getMonth() - 1);
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },
  'monthyear+1': () => {
    let d = new Date();
    d.setMonth(d.getMonth() + 1);
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },

  year: (tmpl) => {
    let date = parser(tmpl, ['date']).date;
    let d = new Date(date);
    if (date && isNaN(d.getTime()) === false) {
      return String(d.getFullYear())
    }
    return ''
  },

  'time ago': (tmpl) => {
    let time = parser(tmpl, ['date', 'fmt']).date;
    return timeSince(time)
  },
  'birth date': (tmpl, list) => {
    let obj = parser(tmpl, ['year', 'month', 'date']);
    list.push(obj);
    obj = ymd([obj.year, obj.month, obj.day]);
    return toText(obj)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age
  'birth date and age': (tmpl, list) => {
    let obj = parser(tmpl, ['year', 'month', 'day']);
    //support 'one property' version
    if (obj.year && /[a-z]/i.test(obj.year)) {
      return parsers.natural_date(tmpl, list)
    }
    list.push(obj);
    obj = ymd([obj.year, obj.month, obj.day]);
    return toText(obj)
  },
  'birth year and age': (tmpl, list) => {
    let obj = parser(tmpl, ['birth_year', 'birth_month']);
    //support 'one property' version
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return parsers.natural_date(tmpl, list)
    }
    list.push(obj);
    let age = new Date().getFullYear() - parseInt(obj.birth_year, 10);
    obj = ymd([obj.birth_year, obj.birth_month]);
    let str = toText(obj);
    if (age) {
      str += ` (age ${age})`;
    }
    return str
  },
  'death year and age': (tmpl, list) => {
    let obj = parser(tmpl, ['death_year', 'birth_year', 'death_month']);
    //support 'one property' version
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return parsers.natural_date(tmpl, list)
    }
    list.push(obj);
    obj = ymd([obj.death_year, obj.death_month]);
    return toText(obj)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age2
  'birth date and age2': (tmpl, list) => {
    let order = ['at_year', 'at_month', 'at_day', 'birth_year', 'birth_month', 'birth_day'];
    let obj = parser(tmpl, order);
    list.push(obj);
    obj = ymd([obj.birth_year, obj.birth_month, obj.birth_day]);
    return toText(obj)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_based_on_age_as_of_date
  'birth based on age as of date': (tmpl, list) => {
    let obj = parser(tmpl, ['age', 'year', 'month', 'day']);
    list.push(obj);
    let age = parseInt(obj.age, 10);
    let year = parseInt(obj.year, 10);
    let born = year - age;
    if (born && age) {
      return `${born} (age ${obj.age})`
    }
    return `(age ${obj.age})`
  },
  //https://en.wikipedia.org/wiki/Template:Death_date_and_given_age
  'death date and given age': (tmpl, list) => {
    let obj = parser(tmpl, ['year', 'month', 'day', 'age']);
    list.push(obj);
    obj = ymd([obj.year, obj.month, obj.day]);
    let str = toText(obj);
    if (obj.age) {
      str += ` (age ${obj.age})`;
    }
    return str
  },
  //sortable dates -
  dts: (tmpl) => {
    //remove formatting stuff, ewww
    tmpl = tmpl.replace(/\|format=[ymd]+/i, '');
    tmpl = tmpl.replace(/\|abbr=(on|off)/i, '');
    let obj = parser(tmpl, ['year', 'month', 'date', 'bc']);
    if (obj.date && obj.month && obj.year) {
      //render 'june 5 2018'
      if (/[a-z]/.test(obj.month) === true) {
        return [obj.month, obj.date, obj.year].join(' ')
      }
      return [obj.year, obj.month, obj.date].join('-')
    }
    if (obj.month && obj.year) {
      return [obj.year, obj.month].join('-')
    }
    if (obj.year) {
      if (obj.year < 0) {
        obj.year = Math.abs(obj.year) + ' BC';
      }
      return obj.year
    }
    return ''
  },

  //we can't do timezones, so fake this one a little bit
  //https://en.wikipedia.org/wiki/Template:Time
  time: () => {
    let d = new Date();
    let obj = ymd([d.getFullYear(), d.getMonth(), d.getDate()]);
    return toText(obj)
  },

  // https://en.wikipedia.org/wiki/Template:MILLENNIUM
  millennium: (tmpl) => {
    let obj = parser(tmpl, ['year']);
    let year = parseInt(obj.year, 10);
    year = Math.floor(year / 1000) + 1;
    if (obj.abbr && obj.abbr === 'y') {
      if (year < 0) {
        return `${toOrdinal(Math.abs(year))} BC`
      }
      return `${toOrdinal(year)}`
    }
    return `${toOrdinal(year)} millennium`
  },
  //date/age/time templates
  start: parsers.date,
  'start-date': parsers.natural_date,
  birthdeathage: parsers.two_dates,
  age: parsers.age,
  'age nts': parsers.age,
  'age in years': parsers['diff-y'],
  'age in years and months': parsers['diff-ym'],
  'age in years, months and days': parsers['diff-ymd'],
  'age in years and days': parsers['diff-yd'],
  'age in days': parsers['diff-d'],
  // 'birth date and age2': date,
  // 'age in years, months, weeks and days': true,
  // 'age as of date': true,
  // https://en.wikipedia.org/wiki/Template:As_of
  'as of': (tmpl) => {
    let obj = parser(tmpl, ['year', 'month', 'day']);
    if (obj.alt) {
      return obj.alt
    }
    let out = 'As of ';
    if (obj.since) {
      out = 'Since ';
    }
    if (obj.lc) {
      out = out.toLowerCase();
    }
    if (obj.bare) {
      out = '';
    }
    if (obj.pre) {
      out += obj.pre + ' ';
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
    return out
  }
};

/**
 * converts DMS (decimal-minute-second) geo format to lat/lng format.
 * major thank you to https://github.com/gmaclennan/parse-dms and https://github.com/WSDOT-GIS/dms-js 👏
 **/
function parseDMS(arr) {
  let hemisphere = arr.pop();
  let degrees = Number(arr[0] || 0);
  let minutes = Number(arr[1] || 0);
  let seconds = Number(arr[2] || 0);
  if (typeof hemisphere !== 'string' || isNaN(degrees)) {
    return null
  }
  let sign = 1;
  if (/[SW]/i.test(hemisphere)) {
    sign = -1;
  }
  return sign * (degrees + minutes / 60 + seconds / 3600)
}

const round = function (num) {
  if (typeof num !== 'number') {
    return num
  }
  let places = 100000;
  return Math.round(num * places) / places
};

//these hemispheres mean negative decimals
const negative = {
  s: true,
  w: true,
};

const findLatLng = function (arr) {
  const types = arr.map((s) => typeof s).join('|');
  //support {{lat|lng}}
  if (arr.length === 2 && types === 'number|number') {
    return {
      lat: arr[0],
      lon: arr[1],
    }
  }
  //support {{dd|N/S|dd|E/W}}
  if (arr.length === 4 && types === 'number|string|number|string') {
    if (negative[arr[1].toLowerCase()]) {
      arr[0] *= -1;
    }
    if (arr[3].toLowerCase() === 'w') {
      arr[2] *= -1;
    }
    return {
      lat: arr[0],
      lon: arr[2],
    }
  }
  //support {{dd|mm|N/S|dd|mm|E/W}}
  if (arr.length === 6) {
    return {
      lat: parseDMS(arr.slice(0, 3)),
      lon: parseDMS(arr.slice(3)),
    }
  }
  //support {{dd|mm|ss|N/S|dd|mm|ss|E/W}}
  if (arr.length === 8) {
    return {
      lat: parseDMS(arr.slice(0, 4)),
      lon: parseDMS(arr.slice(4)),
    }
  }
  return {}
};

const parseParams = function (obj) {
  obj.list = obj.list || [];
  obj.list = obj.list.map((str) => {
    let num = Number(str);
    if (!isNaN(num)) {
      return num
    }
    //these are weird
    let split = str.split(/:/);
    if (split.length > 1) {
      obj.props = obj.props || {};
      obj.props[split[0]] = split.slice(1).join(':');
      return null
    }
    return str
  });
  obj.list = obj.list.filter((s) => s !== null);
  return obj
};

const parseCoor = function (tmpl) {
  let obj = parser(tmpl);
  obj = parseParams(obj);
  let tmp = findLatLng(obj.list);
  obj.lat = round(tmp.lat);
  obj.lon = round(tmp.lon);
  obj.template = 'coord';
  delete obj.list;
  return obj
};
// {{Coor title dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor title dec|latitude|longitude|template parameters}}
// {{Coor dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor dm|dd|mm|N/S|dd|mm|E/W|template parameters}}
// {{Coor dec|latitude|longitude|template parameters}}

// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

const templates$1 = {
  coord: (tmpl, list) => {
    let obj = parseCoor(tmpl);
    list.push(obj);
    //display inline, by default
    if (!obj.display || obj.display.indexOf('inline') !== -1) {
      return `${obj.lat || ''}°N, ${obj.lon || ''}°W`
    }
    return ''
  },
};

const generic = function (tmpl, list, _parser, alias) {
  let obj = parser(tmpl);
  if (alias) {
    obj.name = obj.template;
    obj.template = alias;
  }
  list.push(obj);
  return ''
};
// it may seem redundant,
// but we need these templates for our i18n mappings
const misc = {
  persondata: generic,
  taxobox: generic,
  citation: generic,
  portal: generic,
  reflist: generic,
  'cite book': generic,
  'cite journal': generic,
  'cite web': generic,
  'commons cat': generic,
  'election box candidate': generic,
  'election box begin': generic,
  main: generic,
};

const codes = {
  adx: 'adx', //https://en.wikipedia.org/wiki/Template:Abu_Dhabi_Securities_Exchange
  aim: 'aim', //https://en.wikipedia.org/wiki/Template:Alternative_Investment_Market
  amex: 'amex', //https://en.wikipedia.org/wiki/Template:NYSE_American
  asx: 'asx', //https://en.wikipedia.org/wiki/Template:Australian_Securities_Exchange
  athex: 'athex', //https://en.wikipedia.org/wiki/Template:Athens_Exchange
  b3: 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa (redirects to B3 (stock exchange))
  'B3 (stock exchange)': 'B3 (stock exchange)', //https://en.wikipedia.org/wiki/Template:B3_(stock_exchange)
  barbadosse: 'barbadosse', //https://en.wikipedia.org/wiki/Template:Barbados_Stock_Exchange
  bbv: 'bbv', //https://en.wikipedia.org/wiki/Template:La_Paz_Stock_Exchange
  bcba: 'bcba', //https://en.wikipedia.org/wiki/Template:Buenos_Aires_Stock_Exchange
  bcs: 'bcs', //https://en.wikipedia.org/wiki/Template:Santiago_Stock_Exchange
  bhse: 'bhse', //https://en.wikipedia.org/wiki/Template:Bahrain_Bourse
  bist: 'bist', //https://en.wikipedia.org/wiki/Template:Borsa_Istanbul
  bit: 'bit', //https://en.wikipedia.org/wiki/Template:Borsa_Italiana
  'bm&f bovespa': 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  'bm&f': 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  bmad: 'bmad', //https://en.wikipedia.org/wiki/Template:Bolsa_de_Madrid
  bmv: 'bmv', //https://en.wikipedia.org/wiki/Template:Mexican_Stock_Exchange
  'bombay stock exchange': 'bombay stock exchange', //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
  'botswana stock exchange': 'botswana stock exchange', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  bpse: 'bpse', //https://en.wikipedia.org/wiki/Template:Budapest_Stock_Exchange
  bse: 'bse', //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
  bsx: 'bsx', //https://en.wikipedia.org/wiki/Template:Bermuda_Stock_Exchange
  bvb: 'bvb', //https://en.wikipedia.org/wiki/Template:Bucharest_Stock_Exchange
  bvc: 'bvc', //https://en.wikipedia.org/wiki/Template:Colombian_Securities_Exchange
  bvl: 'bvl', //https://en.wikipedia.org/wiki/Template:Lima_Stock_Exchange
  bvpasa: 'bvpasa', //https://en.wikipedia.org/wiki/Template:BVPASA
  bwse: 'bwse', //https://en.wikipedia.org/wiki/Template:Botswana_Stock_Exchange
  'canadian securities exchange': 'canadian securities exchange', //https://en.wikipedia.org/wiki/Template:Canadian_Securities_Exchange
  cse: 'cse', //https://en.wikipedia.org/wiki/Template:Chittagong_Stock_Exchange
  darse: 'darse', //https://en.wikipedia.org/wiki/Template:Dar_es_Salaam_Stock_Exchange
  dfm: 'dfm', //https://en.wikipedia.org/wiki/Template:Dubai_Financial_Market
  dse: 'dse', //https://en.wikipedia.org/wiki/Template:Dhaka_Stock_Exchange
  euronext: 'euronext', //https://en.wikipedia.org/wiki/Template:Euronext
  euronextparis: 'euronextparis', //https://en.wikipedia.org/wiki/Template:EuronextParis
  fse: 'fse', //https://en.wikipedia.org/wiki/Template:Fukuoka_Stock_Exchange
  fwb: 'fwb', //https://en.wikipedia.org/wiki/Template:Frankfurt_Stock_Exchange
  gse: 'gse', //https://en.wikipedia.org/wiki/Template:Ghana_Stock_Exchange
  gtsm: 'gtsm', //https://en.wikipedia.org/wiki/Template:Gre_Tai_Securities_Market
  idx: 'idx', //https://en.wikipedia.org/wiki/Template:Indonesia_Stock_Exchange
  ise: 'ise', //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
  iseq: 'iseq', //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
  isin: 'isin', //https://en.wikipedia.org/wiki/Template:ISIN
  jasdaq: 'jasdaq', //https://en.wikipedia.org/wiki/Template:JASDAQ
  jse: 'jse', //https://en.wikipedia.org/wiki/Template:Johannesburg_Stock_Exchange
  kase: 'kase', //https://en.wikipedia.org/wiki/Template:Kazakhstan_Stock_Exchange
  kn: 'kn', //https://en.wikipedia.org/wiki/Template:Nairobi_Securities_Exchange
  krx: 'krx', //https://en.wikipedia.org/wiki/Template:Korea_Exchange
  lse: 'lse', //https://en.wikipedia.org/wiki/Template:London_Stock_Exchange
  luxse: 'luxse', //https://en.wikipedia.org/wiki/Template:Luxembourg_Stock_Exchange
  'malta stock exchange': 'malta stock exchange', //https://en.wikipedia.org/wiki/Template:Malta_Stock_Exchange
  mai: 'mai', //https://en.wikipedia.org/wiki/Template:Market_for_Alternative_Investment
  mcx: 'mcx', //https://en.wikipedia.org/wiki/Template:Moscow_Exchange
  mutf: 'mutf', //https://en.wikipedia.org/wiki/Template:Mutual_fund
  myx: 'myx', //https://en.wikipedia.org/wiki/Template:Bursa_Malaysia
  nag: 'nag', //https://en.wikipedia.org/wiki/Template:Nagoya_Stock_Exchange
  'nasdaq dubai': 'nasdaq dubai', //https://en.wikipedia.org/wiki/Template:NASDAQ_Dubai
  nasdaq: 'nasdaq', //https://en.wikipedia.org/wiki/Template:NASDAQ
  neeq: 'neeq', //https://en.wikipedia.org/wiki/Template:NEEQ
  nepse: 'nepse', //https://en.wikipedia.org/wiki/Template:Nepal_Stock_Exchange
  nex: 'nex', //https://en.wikipedia.org/wiki/Template:TSXV_NEX
  nse: 'nse', //https://en.wikipedia.org/wiki/Template:National_Stock_Exchange_of_India
  newconnect: 'newconnect', //https://en.wikipedia.org/wiki/Template:NewConnect
  'nyse arca': 'nyse arca', //https://en.wikipedia.org/wiki/Template:NYSE_Arca
  nyse: 'nyse', //https://en.wikipedia.org/wiki/Template:New_York_Stock_Exchange
  nzx: 'nzx', //https://en.wikipedia.org/wiki/Template:New_Zealand_Exchange
  'omx baltic': 'omx baltic', //https://en.wikipedia.org/wiki/Template:OMX_Baltic
  omx: 'omx', //https://en.wikipedia.org/wiki/Template:OMX
  ose: 'ose', //https://en.wikipedia.org/wiki/Template:Oslo_Stock_Exchange
  'otc expert': 'otc expert', //https://en.wikipedia.org/wiki/Template:OTC_Expert
  'otc grey': 'otc grey', //https://en.wikipedia.org/wiki/template:grey_market
  'otc pink': 'otc pink', //https://en.wikipedia.org/wiki/Template:OTC_Pink
  otcqb: 'otcqb', //https://en.wikipedia.org/wiki/Template:OTCQB
  otcqx: 'otcqx', //https://en.wikipedia.org/wiki/Template:OTCQX
  'pfts ukraine stock exchange': 'pfts ukraine stock exchange', //https://en.wikipedia.org/wiki/Template:PFTS_Ukraine_Stock_Exchange
  'philippine stock exchange': 'philippine stock exchange', //https://en.wikipedia.org/wiki/Template:Philippine_Stock_Exchange
  prse: 'prse', //https://en.wikipedia.org/wiki/Template:Prague_Stock_Exchange
  psx: 'psx', //https://en.wikipedia.org/wiki/Template:Pakistan_Stock_Exchange
  karse: 'karse', //https://en.wikipedia.org/w/index.php?title=Template:Karse&redirect=no (redirects to psx)
  qe: 'qe', //https://en.wikipedia.org/wiki/Template:Qatar_Stock_Exchange
  'saudi stock exchange': 'saudi stock exchange', //https://en.wikipedia.org/wiki/Template:Saudi_Stock_Exchange
  sehk: 'sehk', //https://en.wikipedia.org/wiki/Template:Hong_Kong_Stock_Exchange
  'Stock Exchange of Thailand': 'Stock Exchange of Thailand', //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand (alternative for SET)
  set: 'set', //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand
  sgx: 'sgx', //https://en.wikipedia.org/wiki/Template:Singapore_Exchange
  sse: 'sse', //https://en.wikipedia.org/wiki/Template:Shanghai_Stock_Exchange
  swx: 'swx', //https://en.wikipedia.org/wiki/Template:SIX_Swiss_Exchange
  szse: 'szse', //https://en.wikipedia.org/wiki/Template:Shenzhen_Stock_Exchange
  tase: 'tase', //https://en.wikipedia.org/wiki/Template:Tel_Aviv_Stock_Exchange
  'tsx-v': 'tsx-v', //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
  tsx: 'tsx', //https://en.wikipedia.org/wiki/Template:Toronto_Stock_Exchange
  tsxv: 'tsxv', //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
  ttse: 'ttse', //https://en.wikipedia.org/wiki/Template:Trinidad_and_Tobago_Stock_Exchange
  twse: 'twse', //https://en.wikipedia.org/wiki/Template:Taiwan_Stock_Exchange
  tyo: 'tyo', //https://en.wikipedia.org/wiki/Template:Tokyo_Stock_Exchange
  wbag: 'wbag', //https://en.wikipedia.org/wiki/Template:Wiener_B%C3%B6rse
  wse: 'wse', //https://en.wikipedia.org/wiki/Template:Warsaw_Stock_Exchange
  'zagreb stock exchange': 'zagreb stock exchange', //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
  'zimbabwe stock exchange': 'zimbabwe stock exchange', //https://en.wikipedia.org/wiki/Template:Zimbabwe_Stock_Exchange
  zse: 'zse', //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
};

const parseStockExchange = (tmpl, list) => {
  let o = parser(tmpl, ['ticketnumber', 'code']);
  list.push(o);
  let code = o.template || '';
  if (code === '') {
    code = o.code;
  }
  code = (code || '').toLowerCase();
  let str = codes[code] || '';
  if (o.ticketnumber) {
    str = `${str}: ${o.ticketnumber}`;
  }
  if (o.code && !codes[o.code.toLowerCase()]) {
    str += ' ' + o.code;
  }
  return str
};

const exchanges = {};
//the others fit the same pattern..
Object.keys(codes).forEach((k) => {
  exchanges[k] = parseStockExchange;
});

const zeroPad = function (num) {
  num = String(num);
  if (num.length === 1) {
    num = '0' + num;
  }
  return num
};

const parseTeam = function (obj, round, team) {
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
    score: score,
    seed: obj[`rd${round}-seed${team}`],
  }
};

// https://en.wikipedia.org/wiki/Category:Tournament_bracket_templates
//these are weird.
const playoffBracket = function (tmpl) {
  let rounds = [];
  let obj = parser(tmpl);
  //try some rounds
  for (let i = 1; i < 7; i += 1) {
    let round = [];
    for (let t = 1; t < 16; t += 2) {
      let key = `rd${i}-team`;
      if (obj[key + t] || obj[key + zeroPad(t)]) {
        let one = parseTeam(obj, i, t);
        let two = parseTeam(obj, i, t + 1);
        round.push([one, two]);
      } else {
        break
      }
    }
    if (round.length > 0) {
      rounds.push(round);
    }
  }
  return {
    template: 'playoffbracket',
    rounds: rounds,
  }
};

let sports = {
  //playoff brackets
  '4teambracket': function (tmpl, list) {
    let obj = playoffBracket(tmpl);
    list.push(obj);
    return ''
  },


  player: (tmpl, list) => {
    let res = parser(tmpl, ['number', 'country', 'name', 'dl']);
    list.push(res);
    let str = `[[${res.name}]]`;
    if (res.country) {
      let country = (res.country || '').toLowerCase();
      let flag = flags.find((a) => country === a[1] || country === a[2]) || [];
      if (flag && flag[0]) {
        str = flag[0] + '  ' + str;
      }
    }
    if (res.number) {
      str = res.number + ' ' + str;
    }
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Goal
  goal: (tmpl, list) => {
    let res = parser(tmpl);
    let obj = {
      template: 'goal',
      data: [],
    };
    let arr = res.list || [];
    for (let i = 0; i < arr.length; i += 2) {
      obj.data.push({
        min: arr[i],
        note: arr[i + 1] || '',
      });
    }
    list.push(obj);
    //generate a little text summary
    let summary = '⚽ ';
    summary += obj.data
      .map((o) => {
        let note = o.note;
        if (note) {
          note = ` (${note})`;
        }
        return o.min + "'" + note
      })
      .join(', ');
    return summary
  },

  //a transcluded sports module - https://en.m.wikipedia.org/w/index.php?title=Special:WhatLinksHere/Module:Sports_table
  // https://en.wikipedia.org/wiki/Template:2020–21_NHL_North_Division_standings
  'sports table': (tmpl, list) => {
    let obj = parser(tmpl);
    let byTeam = {};
    let teams = Object.keys(obj)
      .filter((k) => /^team[0-9]/.test(k))
      .map((k) => obj[k].toLowerCase());
    teams.forEach((team) => {
      byTeam[team] = {
        name: obj[`name_${team}`],
        win: Number(obj[`win_${team}`]) || 0,
        loss: Number(obj[`loss_${team}`]) || 0,
        tie: Number(obj[`tie_${team}`]) || 0,
        otloss: Number(obj[`otloss_${team}`]) || 0,
        goals_for: Number(obj[`gf_${team}`]) || 0,
        goals_against: Number(obj[`ga_${team}`]) || 0,
      };
    });
    let res = {
      date: obj.update,
      header: obj.table_header,
      teams: byTeam,
    };
    list.push(res);
  },

  // college baseketball rosters
  'cbb roster/header': function () {
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
    |-\n`
  },
  'cbb roster/player': function (tmpl, list) {
    let data = parser(tmpl);
    list.push(data);
    // first=|last=|dab=|num=|pos=|ft=|in=|lbs=|class=|rs=|home=
    return `|-
| ${data.pos || ''}
| ${data.num || ''}
| ${data.first || ''} ${data.last || ''}
| ${data.ft || ''}${data.in || ''}
| ${data.lbs || ''}
| ${data.class || ''}
| ${data.high_school || ''}
| ${data.home || ''}
`
  },
  'cbb roster/footer': function () {
    return `\n|}`
  },
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
  sports,
);

/* eslint-disable no-console */

let templates = Object.assign({}, textTmpl, dataTmpl, bothTmpl);

Object.keys(aliases).forEach((k) => {
  if (templates[aliases[k]] === undefined) {
    console.error(`Missing template: '${aliases[k]}'`);
  }
  templates[k] = templates[aliases[k]];
});

const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//this gets all the {{template}} objects and decides how to parse them
const parseTemplate = function (tmpl, doc) {
  let name = tmpl.name;
  // dont bother with some junk templates
  if (ignore.hasOwnProperty(name) === true) {
    return ['']
  }
  //{{infobox settlement...}}
  if (isInfobox(name) === true) {
    let obj = parser(tmpl.body, [], 'raw');
    // list.push(infobox.format(obj))
    return ['', fmtInfobox(obj)]
  }
  //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = parser(tmpl.body);
    obj.type = obj.template;
    obj.template = 'citation';
    // list.push(obj)
    return ['', obj]
  }
  // ok, here we go!
  //parse some known templates
  if (templates.hasOwnProperty(name) === true) {
    //handle number-syntax
    if (typeof templates[name] === 'number') {
      let obj = parser(tmpl.body, nums);
      let key = String(templates[name]);
      return [obj[key] || '']
    }
    //handle string-syntax
    if (typeof templates[name] === 'string') {
      return [templates[name]]
    }
    //handle array sytax
    if (isArray(templates[name]) === true) {
      let obj = parser(tmpl.body, templates[name]);
      // list.push(obj)
      return ['', obj]
    }
    //handle object sytax
    if (isObject(templates[name]) === true) {
      let obj = parser(tmpl.body, templates[name].props);
      // list.push(obj)
      return [obj[templates[name].out], obj]
    }
    //handle function syntax
    if (typeof templates[name] === 'function') {
      // let json = toJSON(tmpl.body)
      //(tmpl, list, alias, doc)
      let arr = [];
      let txt = templates[name](tmpl.body, arr, parser, null, doc);
      return [txt, arr[0]]
    }
  }
  //if set, try using the global template fallback parser
  if (doc && doc._templateFallbackFn) {
    let arr = [];
    let txt = doc._templateFallbackFn(tmpl.body, arr, parser, null, doc);
    if (txt !== null) {
      return [txt, arr[0]]
    }
  }
  //an unknown template with data, so just keep it.
  let json = parser(tmpl.body);
  if (Object.keys(json).length === 0) {
    // list.push(json)
    json = null;
  }
  //..then remove it
  return ['', json]
};

/**
 * turn an infobox into some nice json
 * 
 * @param {object} infobox 
 * @param {object} [options] 
 * @returns {object}
 */
const toJson = function (infobox, options) {
  let json = Object.keys(infobox.data).reduce((h, k) => {
    if (infobox.data[k]) {
      h[k] = infobox.data[k].json();
    }
    return h
  }, {});

  //support mongo-encoding keys
  if (options.encode === true) {
    json = encodeObj(json);
  }
  return json
};

const normalize = (str = '') => {
  str = str.toLowerCase();
  str = str.replace(/[-_]/g, ' ');
  return str.trim()
};

//a formal key-value data table about a topic
const Infobox = function (obj, wiki) {
  this._type = obj.type;
  this.domain = obj.domain;
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: obj.data,
  });
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki,
  });
};

const methods$2 = {
  type: function () {
    return this._type
  },
  links: function (n) {
    let arr = [];
    Object.keys(this.data).forEach((k) => {
      this.data[k].links().forEach((l) => arr.push(l));
    });
    if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find((o) => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return arr
  },
  image: function () {
    let s = this.data.image || this.data.image2 || this.data.logo || this.data.image_skyline || this.data.image_flag;
    if (!s) {
      return null
    }
    let obj = s.json();
    let file = obj.text;
    obj.file = file;
    obj.text = '';
    obj.caption = this.data.caption;
    obj.domain = this.domain; // add domain information for image
    return new Image(obj)
  },
  get: function (keys) {
    let allKeys = Object.keys(this.data);
    if (typeof keys === 'string') {
      let key = normalize(keys);
      for (let i = 0; i < allKeys.length; i += 1) {
        let tmp = normalize(allKeys[i]);
        if (key === tmp) {
          return this.data[allKeys[i]]
        }
      }
      return new Sentence()
    }
    if (isArray(keys)) {
      // support array-input
      keys = keys.map(normalize);
      return keys.map((k) => {
        for (let i = 0; i < allKeys.length; i += 1) {
          let tmp = normalize(allKeys[i]);
          if (k === tmp) {
            return this.data[allKeys[i]]
          }
        }
        return new Sentence()
      })
    }
    return new Sentence()
  },
  text: function () {
    return ''
  },
  json: function (options) {
    options = options || {};
    return toJson(this, options)
  },
  wikitext: function () {
    return this.wiki || ''
  },
  keyValue: function () {
    return Object.keys(this.data).reduce((h, k) => {
      if (this.data[k]) {
        h[k] = this.data[k].text();
      }
      return h
    }, {})
  },
};
//aliases
Object.keys(methods$2).forEach((k) => {
  Infobox.prototype[k] = methods$2[k];
});
Infobox.prototype.data = Infobox.prototype.keyValue;
Infobox.prototype.template = Infobox.prototype.type;
Infobox.prototype.images = Infobox.prototype.image;

//also called 'citations'
const Reference = function (data, wiki) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  });
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki,
  });
};

const methods$1 = {
  title: function () {
    let data = this.data;
    return data.title || data.encyclopedia || data.author || ''
  },
  links: function (n) {
    let arr = [];
    if (typeof n === 'number') {
      return arr[n]
    }
    //grab a specific link..
    if (typeof n === 'number') {
      return arr[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find((o) => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return arr || []
  },
  text: function () {
    return '' //nah, skip these.
  },
  wikitext: function () {
    return this.wiki || ''
  },
  json: function (options = {}) {
    let json = this.data || {};
    //encode them, for mongodb
    if (options.encode === true) {
      json = Object.assign({}, json);
      json = encodeObj(json);
    }
    return json
  },
};
Object.keys(methods$1).forEach((k) => {
  Reference.prototype[k] = methods$1[k];
});

const methods = {
  text: function () {
    let str = this._text || '';
    return fromText(str).text()
  },
  json: function () {
    return this.data || {}
  },
  wikitext: function () {
    return this.wiki || ''
  },
};

const Template = function (data, text = '', wiki = '') {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  });
  Object.defineProperty(this, '_text', {
    enumerable: false,
    value: text,
  });
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki,
  });
};

Object.keys(methods).forEach((k) => {
  Template.prototype[k] = methods[k];
});

const isCitation = /^(cite |citation)/i;

const referenceTypes = {
  citation: true,
  refn: true,
  harvnb: true,
  source: true, //wikinews
};

// split Infoboxes from templates and references
const sortOut = function (list, domain) {
  let res = {
    infoboxes: [],
    templates: [],
    references: [],
  };
  //remove references and infoboxes from our list
  list.forEach((obj) => {
    let json = obj.json;
    let kind = json.template || json.type || json.name;
    // is it a Reference?
    if (referenceTypes[kind] === true || isCitation.test(kind) === true) {
      res.references.push(new Reference(json, obj.wiki));
      return
    }
    // is it an Infobox?
    if (json.template === 'infobox' && json.subbox !== 'yes') {
      json.domain = domain; //infoboxes need this for images, i guess
      json.data = json.data || {}; //validate it a little
      res.infoboxes.push(new Infobox(json, obj.wiki));
      return
    }
    // otherwise, it's just a template
    res.templates.push(new Template(json, obj.text, obj.wiki));
  });
  return res
};

// return a flat list of all {{templates}}
const allTemplates = function (wiki, doc) {
  let list = [];
  //nested data-structure of templates
  let nested = findTemplates(wiki);
  //recursive template-parser
  const parseNested = function (obj, parent) {
    obj.parent = parent;
    //do tail-first recursion
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((ch) => parseNested(ch, obj));
    }
    //parse template into json, return replacement wikitext
    let [text, json] = parseTemplate(obj, doc);
    obj.wiki = text;
    if (json) {
      list.push({
        name: obj.name,
        wiki: obj.body,
        nested: Boolean(obj.parent),
        text: text,
        json: json,
      });
    }
    //remove the text from every parent
    const removeIt = function (node, body, out) {
      if (node.parent) {
        node.parent.body = node.parent.body.replace(body, out);
        removeIt(node.parent, body, out);
      }
    };
    removeIt(obj, obj.body, obj.wiki);
    wiki = wiki.replace(obj.body, obj.wiki);
  };
  //kick it off
  nested.forEach((node) => parseNested(node, null));
  //remove the templates from our wiki text
  nested.forEach((node) => {
    wiki = wiki.replace(node.body, node.wiki);
  });
  return { list: list, wiki: wiki }
};

//find + parse all templates in the section
const process = function (section, doc) {
  // find+parse them all
  let { list, wiki } = allTemplates(section._wiki, doc);
  // split-out references and infoboxes
  let domain = doc ? doc._domain : null;
  let { infoboxes, references, templates } = sortOut(list, domain);

  //sort-out the templates we decide to keep
  section._infoboxes = section._infoboxes || [];
  section._references = section._references || [];
  section._templates = section._templates || [];

  section._infoboxes = section._infoboxes.concat(infoboxes);
  section._references = section._references.concat(references);
  section._templates = section._templates.concat(templates);

  section._wiki = wiki;
};

//structured Cite templates - <ref>{{Cite..</ref>
const hasCitation = function (str) {
  return /^ *\{\{ *(cite|citation)/i.test(str) && /\}\} *$/.test(str) && /citation needed/i.test(str) === false
};

const parseCitation = function (tmpl) {
  let obj = parser(tmpl);
  obj.type = obj.template.replace(/cite /, '');
  obj.template = 'citation';
  return obj
};

//handle unstructured ones - <ref>some text</ref>
const parseInline = function (str) {
  let obj = fromText(str) || {};
  return {
    template: 'citation',
    type: 'inline',
    data: {},
    inline: obj,
  }
};

//parse <ref></ref> xml tags
const parseRefs = function (section) {
  let references = [];
  let wiki = section._wiki;

  wiki = wiki.replace(/ ?<ref>([\s\S]{0,1800}?)<\/ref> ?/gi, function (all, txt) {
    let found = false;
    // there could be more than 1 template inside a <ref><ref>
    let arr = findFlat(txt);
    arr.forEach((tmpl) => {
      if (hasCitation(tmpl)) {
        let obj = parseCitation(tmpl);
        if (obj) {
          references.push({ json: obj, wiki: all });
          found = true;
        }
        wiki = wiki.replace(tmpl, '');
      }
    });
    // parse as an inline reference
    if (!found) {
      references.push({ json: parseInline(txt), wiki: all });
    }
    return ' '
  });

  //<ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' ');

  //<ref name=""></ref> (a gross copy of above parsing)
  wiki = wiki.replace(/ ?<ref [^>]{0,200}>([\s\S]{0,1800}?)<\/ref> ?/gi, function (all, txt) {
    let found = false;
    // there could be more than 1 template inside a <ref><ref>
    let arr = findFlat(txt);
    arr.forEach((tmpl) => {
      if (hasCitation(tmpl)) {
        let obj = parseCitation(tmpl);
        if (obj) {
          references.push({ json: obj, wiki: all });
          found = true;
        }
        wiki = wiki.replace(tmpl, '');
      }
    });
    // parse as an inline reference
    if (!found) {
      references.push({ json: parseInline(txt), wiki: all });
    }
    return ' '
  });

  //now that we're done with xml, do a generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ /]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ /]?> ?/g, ' '); //<samp name="asd">
  section._references = references.map((obj) => new Reference(obj.json, obj.wiki));
  section._wiki = wiki;
};

//okay, <gallery> is a xml-tag, with newline-separated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
//- not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
/**
 *
 * @private
 * @param {object} catcher
 * @param {object} doc
 * @param {object} section
 */
const parseGallery = function (catcher, doc, section) {
  catcher.text = catcher.text.replace(/<gallery([^>]*)>([\s\S]+)<\/gallery>/g, (_, _attrs, inside) => {
    let images = inside.split(/\n/g);
    images = images.filter((str) => str && str.trim() !== '');

    //parse the line, which has an image and sometimes a caption
    images = images.map((str) => {
      let arr = str.split(/\|/);
      let obj = {
        file: arr[0].trim(),
        lang: doc.lang(),
        domain: doc.domain(),
      };
      let img = new Image(obj).json();
      let caption = arr.slice(1).join('|');
      if (caption !== '') {
        img.caption = fromText(caption);
      }
      return img
    });

    //add it to our templates list
    if (images.length > 0) {
      catcher.templates.push({
        template: 'gallery',
        images: images,
        pos: section.title,
      });
    }

    //return empty string to remove the template from the wiki text
    return ''
  });
};

/**
 * parses out the `Election_box` template from the wiki text
 *
 * this is a non-traditional template, for some reason
 * https://en.wikipedia.org/wiki/Template:Election_box
 *
 * @private
 * @param {object} catcher an object to provide and catch data
 * @param {Document} doc
 */
const parseElection = function (catcher, doc) {
  catcher.text = catcher.text.replace(/\{\{election box begin([\s\S]+?)\{\{election box end\}\}/gi, (tmpl) => {
    let data = {
      _wiki: tmpl,
      _templates: [],
    };

    //put it through our full template parser..
    process(data, doc);

    //okay, pull it apart into something sensible..
    let templates = data._templates.map((t) => t.json());

    let start = templates.find((t) => t.template === 'election box') || {};
    let candidates = templates.filter((t) => t.template === 'election box candidate');
    let summary = templates.find((t) => t.template === 'election box gain' || t.template === 'election box hold') || {};

    if (candidates.length > 0 || summary) {
      catcher.templates.push({
        template: 'election box',
        title: start.title,
        candidates: candidates,
        summary: summary.data,
      });
    }

    //return empty string to remove the template from the wiki text
    return ''
  });
};

const keys = {
  coach: ['team', 'year', 'g', 'w', 'l', 'w-l%', 'finish', 'pg', 'pw', 'pl', 'pw-l%'],
  player: ['year', 'team', 'gp', 'gs', 'mpg', 'fg%', '3p%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg'],
  roster: ['player', 'gp', 'gs', 'mpg', 'fg%', '3fg%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg'],
};

/**
 * https://en.wikipedia.org/wiki/Template:NBA_player_statistics_start
 *
 * @private
 * @param {object} catcher
 */
const parseNBA = function (catcher) {
  catcher.text = catcher.text.replace(
    /\{\{nba (coach|player|roster) statistics start([\s\S]+?)\{\{s-end\}\}/gi,
    (tmpl, name) => {
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
      tmpl = tmpl.replace(/\{\{s-end\}\}/, '');
      name = name.toLowerCase().trim();

      let headers = '! ' + keys[name].join(' !! ');
      let table = '{|\n' + headers + '\n' + tmpl + '\n|}';
      let rows = parseTable(table);
      rows = rows.map((row) => {
        Object.keys(row).forEach((k) => {
          row[k] = row[k].text();
        });
        return row
      });

      catcher.templates.push({
        template: 'NBA ' + name + ' statistics',
        data: rows,
      });

      //return empty string to remove the template from the wiki text
      return ''
    }
  );
};

//https://en.wikipedia.org/wiki/Template:MLB_game_log_section

//this is pretty nuts
const whichHeadings = function (tmpl) {
  let headings = ['#', 'date', 'opponent', 'score', 'win', 'loss', 'save', 'attendance', 'record'];
  if (/\|stadium=y/i.test(tmpl) === true) {
    headings.splice(7, 0, 'stadium'); //save, stadium, attendance
  }
  if (/\|time=y/i.test(tmpl) === true) {
    headings.splice(7, 0, 'time'); //save, time, stadium, attendance
  }
  if (/\|box=y/i.test(tmpl) === true) {
    headings.push('box'); //record, box
  }
  return headings
};
/**
 *
 * @private
 * @param {object} catcher
 */
const parseMlb = function (catcher) {
  catcher.text = catcher.text.replace(/\{\{mlb game log /gi, '{{game log ');
  catcher.text = catcher.text.replace(/\{\{game log (section|month)[\s\S]+?\{\{game log (section|month) end\}\}/gi, (tmpl) => {
    let headings = whichHeadings(tmpl);

    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
    tmpl = tmpl.replace(/\{\{game log (section|month) end\}\}/i, '');

    let headers = '! ' + headings.join(' !! ');
    let table = '{|\n' + headers + '\n' + tmpl + '\n|}';
    let rows = parseTable(table);
    rows = rows.map((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text();
      });
      return row
    });
    catcher.templates.push({
      template: 'mlb game log section',
      data: rows,
    });

    //return empty string to remove the template from the wiki text
    return ''
  }
  );
};

let headings = ['res', 'record', 'opponent', 'method', 'event', 'date', 'round', 'time', 'location', 'notes'];

/**
 *
 * https://en.wikipedia.org/wiki/Template:MMA_record_start
 *
 * @private
 * @param {object} catcher
 */
const parseMMA = function (catcher) {
  catcher.text = catcher.text.replace(/\{\{mma record start[\s\S]+?\{\{end\}\}/gi, (tmpl) => {
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
    tmpl = tmpl.replace(/\{\{end\}\}/i, '');

    let headers = '! ' + headings.join(' !! ');
    let table = '{|\n' + headers + '\n' + tmpl + '\n|}';
    let rows = parseTable(table);
    rows = rows.map((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text();
      });
      return row
    });

    catcher.templates.push({
      template: 'mma record start',
      data: rows,
    });

    //return empty string to remove the template from the wiki text
    return ''
  });
};

/**
 * try to parse out the math and chem templates
 *
 * xml <math>y=mx+b</math> support
 * https://en.wikipedia.org/wiki/Help:Displaying_a_formula
 *
 * @private
 * @param {object} catcher
 */
const parseMath = function (catcher) {
  catcher.text = catcher.text.replace(/<math([^>]*)>([\s\S]*?)<\/math>/g, (_, attrs, inside) => {
    //clean it up a little?
    let formula = fromText(inside).text();
    catcher.templates.push({
      template: 'math',
      formula: formula,
      raw: inside,
    });

    //should we at least try to render it in plaintext? :/
    if (formula && formula.length < 12) {
      return formula
    }

    //return empty string to remove the template from the wiki text
    return ''
  });

  //try chemistry version too
  catcher.text = catcher.text.replace(/<chem([^>]*)>([\s\S]*?)<\/chem>/g, (_, attrs, inside) => {
    catcher.templates.push({
      template: 'chem',
      data: inside,
    });

    //return empty string to remove the template from the wiki text
    return ''
  });
};

/**
 * parses out non standard templates
 *
 * Most templates are '{{template}}',
 * but then, some are '<template></template>' others are {{start}}...{{end}}
 * -> the templates here are of the second type.
 *
 * @private
 * @param {object} section
 * @param {object} doc
 * @returns {Object} wikitext
 */
const xmlTemplates = function (section, doc) {
  const res = {
    templates: [],
    text: section._wiki,
  };

  parseElection(res, doc);
  parseGallery(res, doc, section);
  parseMath(res);
  parseMlb(res);
  parseMMA(res);
  parseNBA(res);

  // turn them into Template objects
  res.templates = res.templates.map((obj) => new Template(obj));
  return res
};

const defaults$2 = {
  tables: true,
  references: true,
  paragraphs: true,
  templates: true,
  infoboxes: true,
};

/**
 * the Section class represents the different sections of the article.
 * we look for the == title == syntax and split and parse the sections from there
 *
 * @class
 */
class Section {
  /**
   * the stuff between headings - 'History' section for example
   *
   * @param {object} data the data already gathered about the section
   * @param {object} doc the document that this section belongs to
   */
  constructor(data, doc) {
    let props = {
      doc: doc,
      title: data.title || '',
      depth: data.depth,
      wiki: data.wiki || '',
      templates: [],
      tables: [],
      infoboxes: [],
      references: [],
      paragraphs: [],
    };
    Object.keys(props).forEach((k) => {
      Object.defineProperty(this, '_' + k, {
        enumerable: false,
        writable: true,
        value: props[k],
      });
    });

    //parse-out <template></template>' and {{start}}...{{end}} templates
    const startEndTemplates = xmlTemplates(this, doc);
    this._wiki = startEndTemplates.text;
    this._templates = this._templates.concat(startEndTemplates.templates);

    //parse-out the <ref></ref> tags
    parseRefs(this);
    //parse-out all {{templates}}
    process(this, doc);

    //parse the tables
    findTables(this);

    //now parse all double-newlines
    parseParagraphs(this, doc);
  }

  /**
   * returns the title of a section. if no title is available then it returns empty string
   *
   * @returns {string} the title of the section
   */
  title() {
    return this._title || ''
  }

  /**
   * returns the index of the current section in the document
   *
   * @returns {number | null} the index of the current section in the document
   */
  index() {
    if (!this._doc) {
      return null
    }
    let index = this._doc.sections().indexOf(this);
    if (index === -1) {
      return null
    }
    return index
  }

  /**
   * returns the depth (or indentation) of the section
   * aka how many levels deep is this section located
   *
   * @returns {number} the depth of the section
   */
  depth() {
    return this._depth
  }

  /**
   * returns the depth (or indentation) of the section
   * aka how many levels deep is this section located
   *
   * @returns {number} the depth of the section
   */
  indentation() {
    return this.depth()
  }

  /**
   * returns all sentences in the section
   * if an clue is provided then it returns the sentence at clue-th index
   *
   * @returns {object | object[]} all sentences in an array or the clue-th sentence
   */
  sentences() {
    return this.paragraphs().reduce((list, p) => {
      return list.concat(p.sentences())
    }, [])
  }

  /**
   * returns all paragraphs in the section
   * if an clue is provided then it returns the paragraph at clue-th index
   *
   * @returns {object | object[]} all paragraphs in an array or the clue-th paragraph
   */
  paragraphs() {
    return this._paragraphs || []
  }

  /**
   * returns all links in the section
   * if an clue is provided and it is a number then it returns the link at clue-th index
   * if an clue is provided and it is a string then it returns the link at the that content
   *
   * @param {number| string} [clue] the clue for selecting the link
   * @returns {object | object[]} all links in an array or the clue-th link or the link with the content of clue
   */
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

    arr = arr
      .reduce((acc, val) => acc.concat(val), []) //flatten the array
      .filter((val) => val !== undefined); //filter out all the undefined from the flattened empty arrays

    if (typeof clue === 'string') {
      let link = arr.find((o) => o.page().toLowerCase() === clue.toLowerCase());
      return link === undefined ? [] : [link]
    }

    return arr
  }

  /**
   * returns all tables in the section
   * if an clue is provided then it returns the table at clue-th index
   *
   * @returns {object | object[]} all tables in an array or the clue-th infobox
   */
  tables() {
    return this._tables || []
  }

  /**
   * returns all templates in the section
   * if an clue is provided and clue is a number then it returns the template at clue-th index
   * if an clue is provided and clue is a string then it returns all template with that name
   *
   * @param {number|string} [clue] the clue for selecting the template
   * @returns {object | object[]} all templates in an array or the clue-th template or all template name `clue`
   */
  templates(clue) {
    let arr = this._templates || [];
    // arr = arr.map((t) => t.json())
    if (typeof clue === 'string') {
      clue = clue.toLowerCase();
      return arr.filter((o) => o.data.template === clue || o.data.name === clue)
    }

    return arr
  }

  /**
   * returns all infoboxes in the section
   * if an clue is provided then it returns the infobox at clue-th index
   *
   * @param {number|string} [clue] the clue for selecting the infobox
   * @returns {object | object[]} all infoboxes in an array or the clue-th infobox
   */
  infoboxes(clue) {
    let arr = this._infoboxes || [];
    if (typeof clue === 'string') {
      clue = clue.replace(/^infobox /i, '');
      clue = clue.trim().toLowerCase();
      return arr.filter((info) => info._type === clue)
    }
    return arr
  }

  /**
   * returns all lists in the section
   * if an clue is provided then it returns the list at clue-th index
   *
   * @returns {object | object[]} all lists in an array or the clue-th list
   */
  coordinates() {
    let arr = [...this.templates('coord'), ...this.templates('coor')];
    return arr.map((tmpl) => tmpl.json())
  }

  /**
   * returns all lists in the section
   * if an clue is provided then it returns the list at clue-th index
   *
   * @returns {object | object[]} all lists in an array or the clue-th list
   */
  lists() {
    let arr = [];
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.lists());
    });
    return arr
  }

  /**
   * returns all interwiki links in the section
   * if an clue is provided then it returns the interwiki link at clue-th index
   *
   * @returns {object | object[]} all interwiki links in an array or the clue-th interwiki link
   */
  interwiki() {
    let arr = [];
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.interwiki());
    });
    return arr
  }

  /**
   * returns all images in the section
   * if an clue is provided then it returns the image at clue-th index
   *
   * @returns {object | object[]} all images in an array or the clue-th image
   */
  images() {
    let arr = [];
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.images());
    });
    return arr
  }

  /**
   * returns all references in the section
   * if an clue is provided then it returns the reference at clue-th index
   *
   * @returns {object | object[]} all references in an array or the clue-th reference
   */
  references() {
    return this._references || []
  }

  //transformations
  /**
   * Removes the section from the document
   *
   * @returns {null|object} the document without this section. or null if there is no document
   */
  remove() {
    if (!this._doc) {
      return null
    }

    let bads = {};
    bads[this.title()] = true;

    //remove children too
    this.children().forEach((sec) => (bads[sec.title()] = true));
    let sections = this._doc.sections();
    sections = sections.filter((sec) => bads.hasOwnProperty(sec.title()) !== true);
    sections = sections.filter((sec) => bads.hasOwnProperty(sec.title()) !== true);

    this._doc._sections = sections;
    return this._doc
  }

  //move-around sections like in jquery
  /**
   * returns the next sibling of this section
   * if it can find one then it returns null
   *
   * @returns {Section|null} the next sibling
   */
  nextSibling() {
    //if this section is not part of a document then we can go to the next part of the document
    if (!this._doc) {
      return null
    }

    //first we get the a list of sections and our own position in this list
    let sections = this._doc.sections();
    let index = this.index() || 0;

    //then we look trough the list looking for the next sibling
    //aka we look the next item at the same depth as us
    //so we start the loop at the next section in the list and go till the length of the list
    for (let i = index + 1; i < sections.length; i++) {
      //if the depth is smaller then the current depth then there is no next sibling
      //aka the depth of the section at position i a level higher then this section then this section is the last section at this depth
      if (sections[i].depth() < this.depth()) {
        return null
      }
      //if the section has the same depth as the current section then it is the next sibling
      if (sections[i].depth() === this.depth()) {
        return sections[i]
      }
    }
    //if the loop has no results then there is no next sibling and we are at the end of the file
    return null
  }

  /**
   * returns the next sibling of this section
   * if it can find one then it returns null
   *
   * @returns {Section|null} the next sibling
   */
  next() {
    return this.nextSibling()
  }

  /**
   * returns the previous section
   *
   * @returns {Section|null} the previous section
   */
  lastSibling() {
    if (!this._doc) {
      return null
    }
    let sections = this._doc.sections();
    let index = this.index() || 0;
    return sections[index - 1] || null
  }

  /**
   * returns the previous section
   *
   * @returns {Section|null} the previous section
   */
  last() {
    return this.lastSibling()
  }

  /**
   * returns the previous section
   *
   * @returns {Section|null} the previous section
   */
  previousSibling() {
    return this.lastSibling()
  }

  /**
   * returns the previous section
   *
   * @returns {Section|null} the previous section
   */
  previous() {
    return this.lastSibling()
  }

  /**
   * returns all the children of a section
   *
   * If the clue is a string then it will return the child with that exact title
   * Else if the clue is a number then it returns the child at that index
   * Else it returns all the children
   *
   * @param {number | string} [clue] A title of a section or a index of a wanted section
   * @returns {Section | Section[] | null} A section or a array of sections
   */
  children(clue) {
    if (!this._doc) {
      return null
    }

    let sections = this._doc.sections();
    let index = this.index() || 0;
    let children = [];

    //(immediately preceding sections with higher depth)
    if (sections[index + 1] && sections[index + 1].depth() > this.depth()) {
      for (let i = index + 1; i < sections.length; i += 1) {
        if (sections[i].depth() > this.depth()) {
          children.push(sections[i]);
        } else {
          break
        }
      }
    }
    if (typeof clue === 'string') {
      return children.find((s) => s.title().toLowerCase() === clue.toLowerCase())
    }
    return children
  }

  /**
   * returns all the children of a section
   *
   * If the clue is a string then it will return the child with that exact title
   * Else if the clue is a number then it returns the child at that index
   * Else it returns all the children
   *
   * @param {number | string} [clue] A title of a section or a index of a wanted section
   * @returns {Section | Section[] | null} A section or a array of sections
   */
  sections(clue) {
    return this.children(clue)
  }

  /**
   * returns all the parent of a section
   *
   * @returns {Section | null} A section that is the parent of a section
   */
  parent() {
    if (!this._doc) {
      return null
    }
    let sections = this._doc.sections();
    let index = this.index() || 0;

    for (let i = index; i >= 0; i -= 1) {
      if (sections[i] && sections[i].depth() < this.depth()) {
        return sections[i]
      }
    }

    return null
  }

  //outputs

  /**
   * returns a plaintext version of the section
   *
   * @param {object} options options for the text transformation
   * @returns {string} the section in text
   */
  text(options) {
    options = setDefaults(options, defaults$2);
    return this.paragraphs()
      .map((p) => p.text(options))
      .join('\n\n')
  }
  /**
   * returns original wiki markup
   *
   * @returns {string} the original markup
   */
  wikitext() {
    return this._wiki
  }

  /**
   * returns a json version of the section
   *
   * @param {object} options keys to include in the resulting json
   * @returns {object} the section in json
   */
  json(options) {
    options = setDefaults(options, defaults$2);
    return toJSON$1(this, options)
  }
}
Section.prototype.citations = Section.prototype.references;

// aliases
const singular$1 = {
  sentences: 'sentence',
  paragraphs: 'paragraph',
  links: 'link',
  tables: 'table',
  templates: 'template',
  infoboxes: 'infobox',
  coordinates: 'coordinate',
  lists: 'list',
  images: 'image',
  references: 'reference',
  citations: 'citation',
};
Object.keys(singular$1).forEach((k) => {
  let sing = singular$1[k];
  Section.prototype[sing] = function (clue) {
    let arr = this[k](clue);
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0] || null
  };
});

const heading_reg = /^(={1,6})(.{1,200}?)={1,6}$/; //eslint-disable-line
const hasTemplate = /\{\{.+?\}\}/;

const doInlineTemplates = function (wiki, doc) {
  let list = findTemplates(wiki);
  list.forEach((item) => {
    let [txt] = parseTemplate(item, doc);
    wiki = wiki.replace(item.body, txt);
  });
  return wiki
};

/**
 * @typedef fakeSection
 * @property {string} title
 * @property {null | number} depth
 * @property {string} wiki
 */

/**
 * estimates the depth of a section and parses the title to a normal format
 *
 * @private
 * @param {fakeSection} section
 * @param {string} str
 * @param {Document} doc
 * @returns {fakeSection} section the depth in a object
 */
const parseHeading = function (section, str, doc) {
  let m = str.match(heading_reg);
  if (!m) {
    section.title = '';
    section.depth = 0;
    return section
  }
  let title = m[2] || '';
  title = fromText(title).text();

  //amazingly, you can see inline {{templates}} in this text, too
  if (hasTemplate.test(title)) {
    title = doInlineTemplates(title, doc);
  }
  //same for references (i know..)
  let obj = { _wiki: title };
  parseRefs(obj);
  title = obj._wiki;

  //trim leading/trailing whitespace
  title = trim_whitespace(title);
  let depth = 0;
  if (m[1]) {
    depth = m[1].length - 2;
  }
  section.title = title;
  section.depth = depth;
  return section
};

const isReference = new RegExp('^(' + references.join('|') + '):?', 'i');
const section_reg = /(?:\n|^)(={2,6}.{1,200}?={2,6})/g;


/**
 * filters out the reference section and empty sections and
 *
 * @param {Section[]} sections
 * @returns {Section[]} all the section
 */
const removeReferenceSection = function (sections) {
  return sections.filter((s, i) => {
    if (isReference.test(s.title()) === true) {
      if (s.paragraphs().length > 0) {
        return true
      }

      //does it have some wacky templates?
      if (s.templates().length > 0) {
        return true
      }

      //what it has children? awkward
      if (sections[i + 1] && sections[i + 1].depth() > s.depth()) {
        sections[i + 1]._depth -= 1; //move it up a level?...
      }
      return false
    }
    return true
  })
};

/**
 * this function splits the wiki texts on '=' and puts every part in a Section Object
 * it also pre processes the section text for the Section object
 * then it filters out the reference section
 *
 * @private
 * @param {object} doc the document that contains the wiki text
 * @returns {Section[]} the sections that are parsed out
 */
const parseSections = function (doc) {
  let sections = [];
  let splits = doc._wiki.split(section_reg);

  for (let i = 0; i < splits.length; i += 2) {
    let heading = splits[i - 1] || '';
    let wiki = splits[i] || '';

    if (wiki === '' && heading === '') {
      //usually an empty 'intro' section
      continue
    }

    let data = {
      title: '',
      depth: null,
      wiki: wiki,
    };

    //figure-out title and depth
    parseHeading(data, heading, doc);

    sections.push(new Section(data, doc));
  }

  //remove empty references section
  return removeReferenceSection(sections)
};

const cat_reg = new RegExp('\\[\\[(' + _categories.join('|') + '):(.{2,178}?)]](w{0,10})', 'gi');
const cat_remove_reg = new RegExp('^\\[\\[:?(' + _categories.join('|') + '):', 'gi');

const parse_categories = function (wiki) {
  const categories = [];
  let tmp = wiki.match(cat_reg); //regular links
  if (tmp) {
    tmp.forEach(function (c) {
      c = c.replace(cat_remove_reg, '');
      c = c.replace(/\|?[ *]?\]\]$/, ''); //parse fancy ones..
      c = c.replace(/\|.*/, ''); //everything after the '|' is metadata
      if (c && !c.match(/[[\]]/)) {
        categories.push(c.trim());
      }
    });
  }
  const newWiki = wiki.replace(cat_reg, '');
  return [categories, newWiki]
};

/* eslint-disable no-console */

const defaults$1 = {
  tables: true,
  lists: true,
  paragraphs: true,
};

/**
 * The document class is the main entry point of wtf_wikipedia.
 * this class represents an article of wikipedia.
 * from here you can go to the infoboxes or paragraphs
 *
 * @class
 */
class Document {
  /**
   * The constructor for the document class
   * This function starts parsing the wiki text and sets the options in the class
   *
   * @param {string} [wiki] The wiki text
   * @param {object} [options] The options for the parser
   */
  constructor(wiki, options) {
    options = options || {};
    this._options = options;
    let userAgent = options.userAgent || options['User-Agent'] || options['Api-User-Agent'];
    userAgent = userAgent || 'User of the wtf_wikipedia library';
    let props = {
      title: options.title || null,
      type: 'page',
      userAgent,
      redirectTo: null,
      wiki: wiki || '',
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
      domain: options.domain || null,
    };

    Object.keys(props).forEach((k) => {
      Object.defineProperty(this, '_' + k, {
        enumerable: false,
        writable: true,
        value: props[k],
      });
    });

    //detect if page is just redirect, and return it
    if (isRedirect(this._wiki) === true) {
      this._type = 'redirect';
      this._redirectTo = parse(this._wiki);
      const [categories, newWiki] = parse_categories(this._wiki);
      this._categories = categories;
      this._wiki = newWiki;
      return
    }

    //give ourselves a little head-start
    this._wiki = preProcess(this._wiki);

    //pull-out [[category:whatevers]]
    const [categories, newWiki] = parse_categories(this._wiki);
    this._categories = categories;
    this._wiki = newWiki;

    //parse all the headings, and their texts/sentences
    this._sections = parseSections(this);
  }

  /**
   * Getter and setter for the tile.
   * If string is given then this function is a setter and sets the variable and returns the set value
   * If the string is not given then it will check if the title is available
   * If it is available it returns the title.
   * Else it will look if the first sentence contains a bolded phrase and assumes that's the title and returns it
   *
   * @param {string} [str] The title that will be set
   * @returns {null|string} The title found or given
   */
  title(str) {
    //use like a setter
    if (str !== undefined) {
      this._title = str;
      return str
    }
    //if we have it already
    if (this._title) {
      return this._title
    }
    //guess the title of this page from first sentence bolding
    let guess = null;
    let sen = this.sentences()[0];
    if (sen) {
      guess = sen.bold();
    }
    return guess
  }

  /**
   * If an pageID is given then it sets the pageID and returns the given pageID
   * Else if the pageID is already set it returns the pageID
   *
   * @param {number} [id] The pageID that will be set
   * @returns {number|null} The given or found pageID
   */
  pageID(id) {
    if (id !== undefined) {
      this._pageID = id;
    }
    return this._pageID || null
  }

  /**
   * If an WikidataID is given then it sets the WikidataID and returns the given WikidataID
   * Else if the WikidataID is already set it returns the WikidataID
   *
   * @param {string} [id] The WikidataID that will be set
   * @returns {string|null} The given or found WikidataID
   */
  wikidata(id) {
    if (id !== undefined) {
      this._wikidata = id;
    }
    return this._wikidata || null
  }

  /**
   * If an domain is given then it sets the domain and returns the given domain
   * Else if the domain is already set it returns the domain
   *
   * @param {string} [str] The domain that will be set
   * @returns {string|null} The given or found domain
   */
  domain(str) {
    if (str !== undefined) {
      this._domain = str;
    }
    return this._domain || null
  }

  /**
   * If an language is given then it sets the language and returns the given language
   * Else if the language is already set it returns the language
   *
   * @param {string} [lang] The language that will be set
   * @returns {string|null} The given or found language
   */
  language(lang) {
    if (lang !== undefined) {
      this._lang = lang;
    }
    return this._lang || null
  }

  /**
   * Gets the url of the page
   * If the language or domain is not available we substitute 'en' and 'wikipedia.org'
   * Then we use the template of `https://${lang}.${domain}/wiki/${title}` to make the url
   *
   * @returns {string|null} The url of the page
   */
  url() {
    let title = this.title();
    if (!title) {
      return null
    }
    let lang = this.language() || 'en';
    let domain = this.domain() || 'wikipedia.org';
    //replace blank to underscore
    title = title.replace(/ /g, '_');
    title = encodeURIComponent(title);
    return `https://${lang}.${domain}/wiki/${title}`
  }

  /**
   * If an namespace is given then it sets the namespace and returns the given namespace
   * Else if the namespace is already set it returns the namespace
   *
   * @param {string} [ns] The namespace that will be set
   * @returns {string|null} The given or found namespace
   */
  namespace(ns) {
    if (ns !== undefined) {
      this._namespace = ns;
    }
    return this._namespace || null
  }

  /**
   * Returns if the page is a redirect
   *
   * @returns {boolean} Is the page a redirect
   */
  isRedirect() {
    return this._type === 'redirect'
  }
  /**
   * Returns true if the page includes a stub template
   *
   * @returns {boolean} Is the page a stub
   */
  isStub() {
    return isStub(this)
  }

  /**
   * Returns information about the page this page redirects to
   *
   * @returns {null|object} The redirected page
   */
  redirectTo() {
    return this._redirectTo
  }

  /**
   * This function finds out if a page is a disambiguation page
   *
   * @returns {boolean} Whether the page is a disambiguation page
   */
  isDisambiguation() {
    return isDisambig(this)
  }

  /**
   * If a clue is available return the category at that index
   * Else return all categories
   *
   * @returns {string | string[]} The category at the provided index or all categories
   */
  categories(clue) {
    let arr = this._categories || [];
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  /**
   * returns the sections of the document
   *
   * If the clue is a string then it will return the section with that exact title
   * Else if the clue is a number then it returns the section at that index
   * Else it returns all the sections
   *
   * @param {number | string} [clue] A title of a section or a index of a wanted section
   * @returns {object | object[]} A section or a array of sections
   */
  sections(clue) {
    let arr = this._sections || [];
    arr.forEach((sec) => {
      // link-up parent and child
      sec._doc = this;
    });

    //grab a specific section, by its title
    if (typeof clue === 'string') {
      let str = clue.toLowerCase().trim();
      return arr.filter((s) => {
        return s.title().toLowerCase() === str
      })
    } else if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  /**
   * Returns the paragraphs in the document
   *
   * If the clue is a number then it returns the paragraph at that index
   * Else it returns all paragraphs in an array
   * @param {number | string} [clue] given index of a paragraph
   * @returns {object | object[]} the selected paragraph or an array of all paragraphs
   */
  paragraphs(clue) {
    let arr = [];
    this.sections().forEach((s) => {
      arr = arr.concat(s.paragraphs());
    });
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  /**
   * if no clue is provided, it compiles an array of sentences in the wiki text.
   * if the clue is provided it return the sentence at the provided index
   * @param {number | string} [clue] given index of a sentence
   * @returns {object[]|object} an array of sentences or a single sentence
   */
  sentences(clue) {
    let arr = [];
    this.sections().forEach((sec) => {
      arr = arr.concat(sec.sentences());
    });
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  /**
   * This function search the whole page, including the infobox and image gallery templates for images
   * and then returns them in an array if no clue is provided.
   * if an clue is profieded then it returns the image at the clue-th index
   *
   * @returns {Image[]|Image} a single image or an array of images
   */
  images(clue) {
    let arr = sectionMap(this, 'images', null);
    //grab image from infobox, first
    this.infoboxes().forEach((info) => {
      let img = info.image();
      if (img) {
        arr.unshift(img); //put it at the top
      }
    });
    //look for 'gallery' templates, too
    this.templates().forEach((obj) => {
      if (obj.data.template === 'gallery') {
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
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  /**
   * Return all links or if a clue is provided only the link at that index
   *
   * @param {number} [clue] the index of the wanted link
   * @returns {string[]|string} all the links or the selected link
   */
  links(clue) {
    return sectionMap(this, 'links', clue)
  }

  /**
   * Return all inter wiki links or if a clue is provided only the inter wiki link at that index
   *
   * @param {number} [clue] the index of the wanted inter wiki link
   * @returns {string[]|string} all the inter wiki links or the selected inter wiki link
   */
  interwiki(clue) {
    return sectionMap(this, 'interwiki', clue)
  }

  /**
   * If a clue is available return the list at that index
   * Else return all lists
   *
   * @param {number} [clue] The index of the wanted list
   * @returns {object | object[]} The list at the provided index or all lists
   */
  lists(clue) {
    return sectionMap(this, 'lists', clue)
  }

  /**
   * If a clue is available return the tables at that index
   * Else return all tables
   *
   * @param {number} [clue] The index of the wanted table
   * @returns {object | object[]} The table at the provided index or all tables
   */
  tables(clue) {
    return sectionMap(this, 'tables', clue)
  }

  /**
   * If a clue is available return the template at that index
   * Else return all templates
   *
   * @param {number} [clue] The index of the wanted template
   * @returns {object | object[]} The category at the provided index or all categories
   */
  templates(clue) {
    return sectionMap(this, 'templates', clue)
  }

  /**
   * If a clue is available return the references at that index
   * Else return all references
   *
   * @param {number} [clue] The index of the wanted references
   * @returns {object | object[]} The category at the provided index or all references
   */
  references(clue) {
    return sectionMap(this, 'references', clue)
  }

  /**
   * Returns the 0th or clue-th reference
   *
   * @param {number} [clue] The index of the wanted reference
   * @returns {object|string|number} The reference at the provided index
   */
  citations(clue) {
    return this.references(clue)
  }

  /**
   * finds and returns all coordinates
   * or if an clue is given, the coordinate at the index
   *
   * @param {number} [clue] the index of the coordinate returned
   * @returns {object[]|object|null} if a clue is given, the coordinate of null, else an array of coordinates
   */
  coordinates(clue) {
    return sectionMap(this, 'coordinates', clue)
  }

  /**
   * If clue is unidentified then it returns all infoboxes
   * If clue is a number then it returns the infobox at that index
   * It always sorts the infoboxes by size
   *
   * @param {number} [clue] the index of the infobox you want to select
   * @returns {object | object[]} the selected infobox or an array of infoboxes
   */
  infoboxes(clue) {
    let arr = sectionMap(this, 'infoboxes', clue);
    //sort them by biggest-first
    arr = arr.sort((a, b) => {
      if (Object.keys(a.data).length > Object.keys(b.data).length) {
        return -1
      }
      return 1
    });

    return arr
  }

  /**
   * return a plain text version of the wiki article
   *
   * @param {object} [options] the options for the parser
   * @returns {string} the plain text version of the article
   */
  text(options) {
    options = setDefaults(options, defaults$1);
    //nah, skip these.
    if (this.isRedirect() === true) {
      return ''
    }
    let arr = this.sections().map((sec) => sec.text(options));
    return arr.join('\n\n')
  }

  /**
   * return a json version of the Document class
   *
   * @param {object} [options] options for the rendering
   * @returns {object} this document as json
   */
  json(options) {
    options = setDefaults(options, defaults$1);
    return toJSON$2(this, options)
  }

  /**
   * return original wiki markup
   *
   * @returns {string} markup text
   */
  wikitext() {
    return this._wiki || ''
  }

  /**
   * prints the title of every section
   *
   * @returns {Document} the document itself
   */
  debug() {
    console.log('\n');
    this.sections().forEach((sec) => {
      let indent = ' - ';
      for (let i = 0; i < sec.depth(); i += 1) {
        indent = ' -' + indent;
      }
      console.log(indent + (sec.title() || '(Intro)'));
    });
    return this
  }

  /**
   * If a revisionID is given then it sets the revisionID and returns the given revisionID
   * Else if the revisionID is already set it returns the revisionID
   *
   * @param {number} [id] The revisionID that will be set
   * @returns {number|null} The given or found revisionID
   */
  revisionID(id) {
    if (id !== undefined) {
      this._revisionID = id;
    }
    return this._revisionID || null
  }
  timestamp(str) {
    if (str !== undefined) {
      this._timestamp = str;
    }
    return this._timestamp || null
  }
  description(str) {
    if (str !== undefined) {
      this._description = str;
    }
    return this._description || null
  }
  pageImage(str) {
    if (str !== undefined) {
      this._pageImage = str;
    }
    let file = this._pageImage || null;
    return new Image({ file })
  }

  options() {
    return this._options
  }
}

// aliases
const singular = {
  categories: 'category',
  sections: 'section',
  paragraphs: 'paragraph',
  sentences: 'sentence',
  images: 'image',
  links: 'link',
  // interwiki
  lists: 'list',
  tables: 'table',
  templates: 'template',
  references: 'reference',
  citations: 'citation',
  coordinates: 'coordinate',
  infoboxes: 'infobox',
};
Object.keys(singular).forEach((k) => {
  let sing = singular[k];
  Document.prototype[sing] = function (clue) {
    let arr = this[k](clue);
    return arr[0] || null
  };
});
Document.prototype.lang = Document.prototype.language;
Document.prototype.ns = Document.prototype.namespace;
Document.prototype.plaintext = Document.prototype.text;
Document.prototype.isDisambig = Document.prototype.isDisambiguation;
Document.prototype.citations = Document.prototype.references;
Document.prototype.redirectsTo = Document.prototype.redirectTo;
Document.prototype.redirect = Document.prototype.redirectTo;
Document.prototype.redirects = Document.prototype.redirectTo;

/**
 * this function puts all responses into proper Document objects
 *
 * @private
 * @param {Array} res
 * @param {string | number | Array<number> | Array<string>} title
 * @returns {null| Document | Document[]} null if there are no results or Document if there is one responses and Document array if there are multiple responses
 */
const parseDoc = function (res, title) {
  res = res || [];
  // filter out undefined
  res = res.filter((o) => o);

  // put all the responses into Document formats
  let docs = res.map((o) => {
    return new Document(o.wiki, o.meta)
  });

  // if the list is empty than there are no results
  if (docs.length === 0) {
    return null
  }

  // if there is only one response then we can get it out of the array
  if (!isArray(title) && docs.length === 1) {
    return docs[0]
  }

  return docs
};

/**
 * factory for header options
 *
 * @private
 * @param {object} options
 * @returns {object} the generated options
 */
const makeHeaders = function (options) {
  let agent =
    options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'User of the wtf_wikipedia library';

  let origin;
  if (options.noOrigin) {
    origin = '';
  } else {
    origin = options.origin || options.Origin || '*';
  }

  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': agent,
      'User-Agent': agent,
      Origin: origin,
      'Accept-Encoding': 'gzip',
    },
    redirect: 'follow',
  }
};

/* eslint-disable no-console */
const isUrl = /^https?:\/\//;

/**
 * @typedef fetchDefaults
 * @property {string | undefined} [path] the path to the wiki api. default: api.php
 * @property {string | undefined} [wiki]
 * @property {string | undefined} [domain] the domain of the wiki you want to query
 * @property {boolean | undefined} [follow_redirects] should the library follow redirects
 * @property {string | undefined} [lang] the language of the wiki
 * @property {string | number | Array<string> | Array<number> | undefined} [title]
 * @property {string | undefined} [Api-User-Agent] the user agent of the application
 * @property {string | undefined} [origin] the domain or the origin of the request
 */

/**
 * @type {fetchDefaults}
 */
const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: undefined,
  follow_redirects: true,
  path: 'api.php', //some 3rd party sites use a weird path
};

/**
 * @callback fetchCallback
 * @param {Object} error
 * @param {any} result
 */

/**
 *  fetches the page from the wiki and returns a Promise with the parsed wiki text
 *
 * if you supply it with a single pageID or title it will return a Document object.
 * if you supply a wiki URL then we will parse it and use the tile and provide a single Document object
 * if you supply it with an array with pageIDs or an array of titles it will return an array of document objects.
 *
 * there is another catch in the programming you need if you provide an array it needs to be eighter pageIDs or titles they can not be mixed.
 *
 * @param {string | number | Array<number> | Array<string>} title the title, PageID, URL or an array of all three of the page(s) you want to fetch
 * @param {fetchDefaults} [options] the options for the fetch or the language of the wiki for the article
 * @param {fetchCallback} [callback] the callback function for the call
 */
const fetch = function (title, options, callback) {
  // support lang as 2nd param
  if (typeof options === 'string') {
    options = { lang: options };
  }
  options = { ...defaults, ...options };
  options.title = title;

  //parse url input
  if (typeof title === 'string' && isUrl.test(title)) {
    options = { ...options, ...parseUrl(title) };
  }
  const url = makeUrl(options);
  const headers = makeHeaders(options);

  return unfetch(url, headers)
    .then((res) => res.json())
    .then((res) => {
      if (!res) {
        throw new Error(`No JSON Data Found For ${url}`)
      }
      let data = getResult(res, options);
      data = parseDoc(data, title);
      if (callback) {
        callback(null, data);
      }
      return data
    })
    .catch((e) => {
      console.error(e);
      if (callback) {
        callback(e, null);
      }
      return null
    })
};

var version = '10.4.0';

/* eslint-disable no-console */

/**
 * use the native client-side fetch function
 *
 * @private
 * @param {string} url the url that well be fetched
 * @param {Object} opts the options for fetch
 * @returns {Promise<any>} the response from fetch
 */
const request = function (url, opts) {
  return unfetch(url, opts).then(function (res) {
    return res.json()
  }).catch((e) => {
    console.error('\n\n=-=- http response error =-=-=-');
    console.error(url);
    console.error(e);
    return {}
  })
};

//the main 'factory' exported method
const wtf = function (wiki, options) {
  return new Document(wiki, options)
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
  wtf: wtf,
};

wtf.fetch = function (title, options, cb) {
  return fetch(title, options, cb)
};
wtf.extend = function (fn) {
  fn(models, templates, infoboxes);
  return this
};
wtf.plugin = wtf.extend;
wtf.version = version;

export { wtf as default };
