/*! wtf-plugin-i18n 2.0.0 MIT */
'use strict';

// shared helpers for the language packs

// move localized parameter names onto the english ones core reads; existing english keys win
const rename = (obj, map) => {
  Object.keys(map).forEach((from) => {
    if (obj[from] !== undefined && obj[map[from]] === undefined) {
      obj[map[from]] = obj[from];
      delete obj[from];
    }
  });
  return obj
};

// a core-style parser that renames localized params, then hands off to an existing core parser:
//   'lien web': translate('cite web', { titre: 'title', auteur: 'author' })
const translate = (key, map) => {
  const fn = (tmpl, parse, opts, templates) => {
    const localized = (t, order, format) => {
      const obj = parse(t, order, format);
      if (format === 'raw' || format === 'json' || format === 'block') {
        return obj
      }
      return rename(obj, map)
    };
    return templates[key](tmpl, localized, opts)
  };
  fn.kind = /^cite /.test(key) ? 'citation' : key;
  fn.template = key;
  fn.map = map; // 04-diff.js reads this to compare against live TemplateData
  return fn
};

// registers one language pack onto the core template registry. a pack's data is:
//   aliases   — localized name → the core template key it resolves to
//   infoboxes — names recognised as infoboxes, not parsed
//   parsers   — localized name → a core-style parser fn (see langs/_lib.js translate())

const register = (data, templates, infoboxes = {}) => {
  data.infoboxes.forEach((name) => {
    infoboxes[name] = true;
  });
  Object.keys(data.aliases).forEach((name) => {
    const key = data.aliases[name];
    const parser = templates[key];
    // fail at extend-time, not parse-time, if a core registry key moves
    if (typeof parser !== 'function') {
      throw new Error(`wtf-plugin-i18n: '${key}' is not a core template`)
    }
    // wikis share names — a plain alias never replaces an earlier i18n registration
    if (templates[name] && templates[name].i18n) {
      return
    }
    // Bridge the plugin callback to the built-in result contract.
    templates[name] = function (tmpl, list, parse, _unused, opts) {
      const { data: found, replacement } = parser(tmpl, parse, opts);
      if (found) {
        list.push(found);
      }
      return replacement
    };
    templates[name].kind = /^cite /.test(key) ? 'citation' : key;
    templates[name].i18n = 'alias';
  });
  Object.keys(data.parsers).forEach((name) => {
    let fn = data.parsers[name];
    if (fn.template && typeof templates[fn.template] !== 'function') {
      throw new Error(`wtf-plugin-i18n: '${fn.template}' is not a core template`)
    }
    // wikis share names: two translate() parsers onto the same template merge their maps,
    // the earlier registration winning per key — otherwise the first parser stands
    const prev = templates[name];
    if (prev && prev.i18n === 'parser') {
      if (prev.template && prev.template === fn.template && prev.map && fn.map) {
        fn = translate(fn.template, Object.assign({}, fn.map, prev.map));
      } else {
        return
      }
    }
    templates[name] = function (tmpl, list, parse, _unused, opts) {
      const { data: found, replacement } = fn(tmpl, parse, opts, templates);
      if (found) {
        list.push(found);
      }
      return replacement
    };
    templates[name].kind = fn.kind;
    templates[name].i18n = 'parser';
    templates[name].template = fn.template;
    templates[name].map = fn.map;
  });
};

var version = '2.0.0';

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// arabic template names → the core template they resolve to
const aliases$W = {
  'commons category': 'commons cat',
  'coords': 'coord',
  'country': 'flag',
  'flag data': 'flag',
  'flag icon': 'flagicon',
  'footnotes': 'reflist',
  'formatnumber': 'formatnum',
  'geolinks-start': 'coord',
  'harvnp': 'sfn',
  'harvref': 'sfn',
  'main articles': 'main',
  'mainarticle': 'main',
  'références': 'reflist',
  'sf': 'sfn',
  'startdate': 'start',
  'أصد': 'ipa',
  'أيقونة علم': 'flagicon',
  'إحداث': 'coord',
  'إحداثيات': 'coord',
  'إحداثيات 2': 'coord',
  'إحداثيات 2 نص': 'coord',
  'إحداثيات 3': 'coord',
  'إحداثيات 3 نص': 'coord',
  'إيقونة علم': 'flagicon',
  'العلم': 'flag',
  'المراجع': 'reflist',
  'ايقونة علم': 'flagicon',
  'بوابة': 'portal',
  'تاريخ البدء': 'start',
  'تاريخ بداية': 'start',
  'تصنيف كومنز': 'commons cat',
  'تصنيف كومونز': 'commons cat',
  'تك': 'commons cat',
  'ثبت المراجع': 'reflist',
  'ثبت المصادر': 'reflist',
  'رئيسي': 'main',
  'رئيسية': 'main',
  'ردمك': 'isbn',
  'رمز علم': 'flagicon',
  'صغ': 'small',
  'صغير': 'small',
  'صورة علم': 'flagicon',
  'صيغةعدد': 'formatnum',
  'علم': 'flag',
  'علم دولة': 'flagicon',
  'علم فقط': 'flagicon',
  'قائمة مصادر': 'reflist',
  'كوورد': 'coord',
  'مراجع': 'reflist',
  'مصادر': 'reflist',
  'مفصلة': 'main',
  'مقال تفصيلي': 'main',
  'مقال رئيسي': 'main',
  'مقالة تفصيلية': 'main',
  'مقالة رئيسية': 'main',
  'مقالة مفصلة': 'main',
  'مقالة منفصلة': 'main',
  'نيهونغو': 'nihongo',
};

// names recognised as infoboxes
const infoboxes$W = [
  'automatic taxobox',
  'speciesbox',
  'taxobox itis',
  'taxobox ncbi',
  'virusbox',
  'تصنيف',
  'تصنيف علمي',
  'تصنيف كائن',
  'صندوق صنف',
  'صندوق معلومات فيروس',
  'صندوق معلومات كائن',
  'معلومات فيروس',
  'معلومات كائن',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$G = translate('cite book', {
  'ردمك': 'isbn',
  'تاريخ-الوصول': 'access-date',
  'تاريخ الوصول': 'access-date',
  'تاريخ وصول': 'access-date',
  'accessdate': 'access-date',
  'الفصل': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'صفحات': 'pages',
  'الصفحات': 'pages',
  'pp': 'pages',
  'أرقام الصفحات': 'pages',
  'أرقم صفحات': 'pages',
  'اقتباس': 'quote',
  'quotation': 'quote',
  'محرر': 'editor',
  'محرر1': 'editor',
  'محرر-الأخير': 'editor',
  'محرر1-الأخير': 'editor',
  'محرر الأخير': 'editor',
  'محرر1 الأخير': 'editor',
  'محرر-الأخير1': 'editor',
  'محرر الأخير1': 'editor',
  'editor-last': 'editor',
  'editor-last1': 'editor',
  'editor1-last': 'editor',
  'editor-surname': 'editor',
  'editor-surname1': 'editor',
  'editor1-surname': 'editor',
  'editor1': 'editor',
  'المحرر': 'editor',
  'المحرر1': 'editor',
  'مؤلف': 'author',
  'مؤلف1': 'author',
  'الأخير': 'author',
  'الأخير1': 'author',
  'مؤلف-الأخير': 'author',
  'مؤلف1-الأخير': 'author',
  'مؤلف الأخير': 'author',
  'مؤلف1 الأخير': 'author',
  'author-last': 'author',
  'author-last1': 'author',
  'مؤلف-الأخير1': 'author',
  'author1-last': 'author',
  'surname': 'author',
  'surname1': 'author',
  'author-surname': 'author',
  'author-surname1': 'author',
  'author1-surname': 'author',
  'المؤلف': 'author',
  'المؤلف1': 'author',
  'أخير': 'author',
  'أخير1': 'author',
  'اخير': 'author',
  'اخير1': 'author',
  'مؤلف الأخير1': 'author',
  'subject': 'author',
  'subject1': 'author',
  'host': 'authors',
  'host1': 'author',
  'عنوان': 'title',
  'العنوان': 'title',
  'تاريخ-الأرشيف': 'archive-date',
  'تاريخ أرشيف': 'archive-date',
  'تاريخ الأرشيف': 'archive-date',
  'archivedate': 'archive-date',
  'تاريخ': 'date',
  'التاريخ': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'سنة': 'year',
  'السنة': 'year',
  'مسار-الأرشيف': 'archive-url',
  'مسار أرشيف': 'archive-url',
  'مسار الأرشيف': 'archive-url',
  'archiveurl': 'archive-url',
  'العدد': 'issue',
  'number': 'issue',
  'لغة': 'language',
  'اللغة': 'language',
  'lang': 'language',
  'ناشر': 'publisher',
  'الناشر': 'publisher',
  'institution': 'publisher',
  'مصدر': 'publisher',
  'الموزع': 'publisher',
  'المصدر': 'publisher',
  'المؤسسة': 'publisher',
  'صحيفة': 'website',
  'دورية محكمة': 'website',
  'مجلة': 'website',
  'اسم المجلة': 'website',
  'جريدة': 'website',
  'اسم الصحيفة': 'website',
  'دورية': 'website',
  'periodical': 'website',
  'موقع': 'website',
  'الموقع': 'website',
  'عمل': 'website',
  'العمل': 'website',
  'من عمل': 'website',
  'مكان': 'location',
  'place': 'location',
  'المكان': 'location',
  'مقر': 'location',
  'المقر': 'location',
  'صفحة': 'page',
  'p': 'page',
  'الصفحة': 'page',
  'رقم الصفحة': 'page',
  'رقم صفحة': 'page',
  'ص': 'page',
  'الأول': 'first',
  'الأول1': 'first',
  'مؤلف-الأول': 'first',
  'مؤلف1-الأول': 'first',
  'مؤلف الأول': 'first',
  'مؤلف1 الأول': 'first',
  'أول': 'first',
  'أول1': 'first',
  'اول': 'first',
  'اول1': 'first',
  'الاول': 'first',
  'الاول1': 'first',
  'author-first': 'first',
  'author-first1': 'first',
  'مؤلف الأول1': 'first',
  'author1-first': 'first',
  'given': 'first',
  'given1': 'first',
  'author-given': 'first',
  'author-given1': 'first',
  'مؤلف-الأول1': 'first',
  'author1-given': 'first',
  'دوي': 'doi',
  'المؤلفون': 'authors',
  'المؤلفين': 'authors',
  'people': 'authors',
  'credits': 'authors',
  'أشخاص': 'authors',
  'المجلد': 'volume',
  'الجزء': 'volume',
  'ج': 'volume',
  'عنوان مترجم': 'trans-title',
  'العنوان بالعربي': 'trans-title',
  'العنوان الأجنبي': 'trans-title',
  'عنوان أجنبي': 'trans-title',
  'العنوان المترجم': 'trans-title',
  'مسار': 'url',
  'المسار': 'url',
  'وصلة': 'url',
  'طبعة': 'edition',
  'الإصدار': 'edition',
  'الاصدار': 'edition',
  'إصدار': 'edition',
  'اصدار': 'edition',
  'الطبعة': 'edition',
  'رقم الطبعة': 'edition',
});
const citeJournal$u = translate('cite journal', {
  'ردمك': 'isbn',
  'تاريخ-الوصول': 'access-date',
  'تاريخ الوصول': 'access-date',
  'تاريخ وصول': 'access-date',
  'accessdate': 'access-date',
  'الفصل': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'صفحات': 'pages',
  'الصفحات': 'pages',
  'pp': 'pages',
  'أرقام الصفحات': 'pages',
  'أرقم صفحات': 'pages',
  'اقتباس': 'quote',
  'quotation': 'quote',
  'محرر': 'editor',
  'محرر1': 'editor',
  'محرر-الأخير': 'editor',
  'محرر1-الأخير': 'editor',
  'محرر الأخير': 'editor',
  'محرر1 الأخير': 'editor',
  'محرر-الأخير1': 'editor',
  'محرر الأخير1': 'editor',
  'editor-last': 'editor',
  'editor-last1': 'editor',
  'editor1-last': 'editor',
  'editor-surname': 'editor',
  'editor-surname1': 'editor',
  'editor1-surname': 'editor',
  'editor1': 'editor',
  'المحرر': 'editor',
  'المحرر1': 'editor',
  'مؤلف': 'author',
  'مؤلف1': 'author',
  'الأخير': 'author',
  'الأخير1': 'author',
  'مؤلف-الأخير': 'author',
  'مؤلف1-الأخير': 'author',
  'مؤلف الأخير': 'author',
  'مؤلف1 الأخير': 'author',
  'author-last': 'author',
  'author-last1': 'author',
  'مؤلف-الأخير1': 'author',
  'author1-last': 'author',
  'surname': 'author',
  'surname1': 'author',
  'author-surname': 'author',
  'author-surname1': 'author',
  'author1-surname': 'author',
  'المؤلف': 'author',
  'المؤلف1': 'author',
  'أخير': 'author',
  'أخير1': 'author',
  'اخير': 'author',
  'اخير1': 'author',
  'مؤلف الأخير1': 'author',
  'subject': 'author',
  'subject1': 'author',
  'host': 'authors',
  'host1': 'author',
  'عنوان': 'title',
  'العنوان': 'title',
  'تاريخ-الأرشيف': 'archive-date',
  'تاريخ أرشيف': 'archive-date',
  'تاريخ الأرشيف': 'archive-date',
  'archivedate': 'archive-date',
  'تاريخ': 'date',
  'التاريخ': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'سنة': 'year',
  'السنة': 'year',
  'مسار-الأرشيف': 'archive-url',
  'مسار أرشيف': 'archive-url',
  'مسار الأرشيف': 'archive-url',
  'archiveurl': 'archive-url',
  'العدد': 'issue',
  'number': 'issue',
  'لغة': 'language',
  'اللغة': 'language',
  'lang': 'language',
  'ناشر': 'publisher',
  'الناشر': 'publisher',
  'institution': 'publisher',
  'مصدر': 'publisher',
  'الموزع': 'publisher',
  'المصدر': 'publisher',
  'المؤسسة': 'publisher',
  'صحيفة': 'website',
  'دورية محكمة': 'website',
  'مجلة': 'website',
  'اسم المجلة': 'website',
  'جريدة': 'website',
  'اسم الصحيفة': 'website',
  'دورية': 'website',
  'periodical': 'website',
  'موقع': 'website',
  'الموقع': 'website',
  'عمل': 'website',
  'العمل': 'website',
  'من عمل': 'website',
  'مكان': 'location',
  'place': 'location',
  'المكان': 'location',
  'مقر': 'location',
  'المقر': 'location',
  'صفحة': 'page',
  'p': 'page',
  'الصفحة': 'page',
  'رقم الصفحة': 'page',
  'رقم صفحة': 'page',
  'ص': 'page',
  'الأول': 'first',
  'الأول1': 'first',
  'مؤلف-الأول': 'first',
  'مؤلف1-الأول': 'first',
  'مؤلف الأول': 'first',
  'مؤلف1 الأول': 'first',
  'أول': 'first',
  'أول1': 'first',
  'اول': 'first',
  'اول1': 'first',
  'الاول': 'first',
  'الاول1': 'first',
  'author-first': 'first',
  'author-first1': 'first',
  'مؤلف الأول1': 'first',
  'author1-first': 'first',
  'given': 'first',
  'given1': 'first',
  'author-given': 'first',
  'author-given1': 'first',
  'مؤلف-الأول1': 'first',
  'author1-given': 'first',
  'دوي': 'doi',
  'المؤلفون': 'authors',
  'المؤلفين': 'authors',
  'people': 'authors',
  'credits': 'authors',
  'أشخاص': 'authors',
  'المجلد': 'volume',
  'الجزء': 'volume',
  'ج': 'volume',
  'عنوان مترجم': 'trans-title',
  'العنوان بالعربي': 'trans-title',
  'العنوان الأجنبي': 'trans-title',
  'عنوان أجنبي': 'trans-title',
  'العنوان المترجم': 'trans-title',
  'مسار': 'url',
  'المسار': 'url',
  'وصلة': 'url',
  'طبعة': 'edition',
  'الإصدار': 'edition',
  'الاصدار': 'edition',
  'إصدار': 'edition',
  'اصدار': 'edition',
  'الطبعة': 'edition',
  'رقم الطبعة': 'edition',
});
const citeWeb$N = translate('cite web', {
  'تاريخ-الوصول': 'access-date',
  'تاريخ الوصول': 'access-date',
  'تاريخ وصول': 'access-date',
  'accessdate': 'access-date',
  'ردمك': 'isbn',
  'الفصل': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'صفحات': 'pages',
  'الصفحات': 'pages',
  'pp': 'pages',
  'أرقام الصفحات': 'pages',
  'أرقم صفحات': 'pages',
  'اقتباس': 'quote',
  'quotation': 'quote',
  'مؤلف': 'author',
  'مؤلف1': 'author',
  'الأخير': 'author',
  'الأخير1': 'author',
  'مؤلف-الأخير': 'author',
  'مؤلف1-الأخير': 'author',
  'مؤلف الأخير': 'author',
  'مؤلف1 الأخير': 'author',
  'author-last': 'author',
  'author-last1': 'author',
  'مؤلف-الأخير1': 'author',
  'author1-last': 'author',
  'surname': 'author',
  'surname1': 'author',
  'author-surname': 'author',
  'author-surname1': 'author',
  'author1-surname': 'author',
  'المؤلف': 'author',
  'المؤلف1': 'author',
  'أخير': 'author',
  'أخير1': 'author',
  'اخير': 'author',
  'اخير1': 'author',
  'مؤلف الأخير1': 'author',
  'subject': 'author',
  'subject1': 'author',
  'host': 'authors',
  'host1': 'author',
  'عنوان': 'title',
  'العنوان': 'title',
  'محرر': 'editor',
  'محرر1': 'editor',
  'محرر-الأخير': 'editor',
  'محرر1-الأخير': 'editor',
  'محرر الأخير': 'editor',
  'محرر1 الأخير': 'editor',
  'محرر-الأخير1': 'editor',
  'محرر الأخير1': 'editor',
  'editor-last': 'editor',
  'editor-last1': 'editor',
  'editor1-last': 'editor',
  'editor-surname': 'editor',
  'editor-surname1': 'editor',
  'editor1-surname': 'editor',
  'editor1': 'editor',
  'المحرر': 'editor',
  'المحرر1': 'editor',
  'تاريخ-الأرشيف': 'archive-date',
  'تاريخ أرشيف': 'archive-date',
  'تاريخ الأرشيف': 'archive-date',
  'archivedate': 'archive-date',
  'تاريخ': 'date',
  'التاريخ': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'سنة': 'year',
  'السنة': 'year',
  'مسار-الأرشيف': 'archive-url',
  'مسار أرشيف': 'archive-url',
  'مسار الأرشيف': 'archive-url',
  'archiveurl': 'archive-url',
  'لغة': 'language',
  'اللغة': 'language',
  'lang': 'language',
  'صحيفة': 'website',
  'دورية محكمة': 'website',
  'مجلة': 'website',
  'اسم المجلة': 'website',
  'جريدة': 'website',
  'اسم الصحيفة': 'website',
  'دورية': 'website',
  'periodical': 'website',
  'موقع': 'website',
  'الموقع': 'website',
  'عمل': 'website',
  'العمل': 'website',
  'من عمل': 'website',
  'ناشر': 'publisher',
  'الناشر': 'publisher',
  'institution': 'publisher',
  'مصدر': 'publisher',
  'الموزع': 'publisher',
  'المصدر': 'publisher',
  'المؤسسة': 'publisher',
  'مكان': 'location',
  'place': 'location',
  'المكان': 'location',
  'مقر': 'location',
  'المقر': 'location',
  'صفحة': 'page',
  'p': 'page',
  'الصفحة': 'page',
  'رقم الصفحة': 'page',
  'رقم صفحة': 'page',
  'ص': 'page',
  'دوي': 'doi',
  'المؤلفون': 'authors',
  'المؤلفين': 'authors',
  'people': 'authors',
  'credits': 'authors',
  'أشخاص': 'authors',
  'الأول': 'first',
  'الأول1': 'first',
  'مؤلف-الأول': 'first',
  'مؤلف1-الأول': 'first',
  'مؤلف الأول': 'first',
  'مؤلف1 الأول': 'first',
  'أول': 'first',
  'أول1': 'first',
  'اول': 'first',
  'اول1': 'first',
  'الاول': 'first',
  'الاول1': 'first',
  'author-first': 'first',
  'author-first1': 'first',
  'مؤلف الأول1': 'first',
  'author1-first': 'first',
  'given': 'first',
  'given1': 'first',
  'author-given': 'first',
  'author-given1': 'first',
  'مؤلف-الأول1': 'first',
  'author1-given': 'first',
  'عنوان مترجم': 'trans-title',
  'العنوان بالعربي': 'trans-title',
  'العنوان الأجنبي': 'trans-title',
  'عنوان أجنبي': 'trans-title',
  'العنوان المترجم': 'trans-title',
  'مسار': 'url',
  'المسار': 'url',
  'وصلة': 'url',
  'طبعة': 'edition',
  'الإصدار': 'edition',
  'الاصدار': 'edition',
  'إصدار': 'edition',
  'اصدار': 'edition',
  'الطبعة': 'edition',
  'رقم الطبعة': 'edition',
});
const internetquelle$o = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'تاريخ-الوصول': 'access-date',
  'تاريخ الوصول': 'access-date',
  'تاريخ وصول': 'access-date',
  'accessdate': 'access-date',
  'ردمك': 'isbn',
  'الفصل': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'صفحات': 'pages',
  'الصفحات': 'pages',
  'pp': 'pages',
  'أرقام الصفحات': 'pages',
  'أرقم صفحات': 'pages',
  'اقتباس': 'quote',
  'quotation': 'quote',
  'مؤلف': 'author',
  'مؤلف1': 'author',
  'الأخير': 'author',
  'الأخير1': 'author',
  'مؤلف-الأخير': 'author',
  'مؤلف1-الأخير': 'author',
  'مؤلف الأخير': 'author',
  'مؤلف1 الأخير': 'author',
  'author-last': 'author',
  'author-last1': 'author',
  'مؤلف-الأخير1': 'author',
  'author1-last': 'author',
  'surname': 'author',
  'surname1': 'author',
  'author-surname': 'author',
  'author-surname1': 'author',
  'author1-surname': 'author',
  'المؤلف': 'author',
  'المؤلف1': 'author',
  'أخير': 'author',
  'أخير1': 'author',
  'اخير': 'author',
  'اخير1': 'author',
  'مؤلف الأخير1': 'author',
  'subject': 'author',
  'subject1': 'author',
  'host': 'authors',
  'host1': 'author',
  'عنوان': 'title',
  'العنوان': 'title',
  'محرر': 'editor',
  'محرر1': 'editor',
  'محرر-الأخير': 'editor',
  'محرر1-الأخير': 'editor',
  'محرر الأخير': 'editor',
  'محرر1 الأخير': 'editor',
  'محرر-الأخير1': 'editor',
  'محرر الأخير1': 'editor',
  'editor-last': 'editor',
  'editor-last1': 'editor',
  'editor1-last': 'editor',
  'editor-surname': 'editor',
  'editor-surname1': 'editor',
  'editor1-surname': 'editor',
  'editor1': 'editor',
  'المحرر': 'editor',
  'المحرر1': 'editor',
  'تاريخ-الأرشيف': 'archive-date',
  'تاريخ أرشيف': 'archive-date',
  'تاريخ الأرشيف': 'archive-date',
  'archivedate': 'archive-date',
  'تاريخ': 'date',
  'التاريخ': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'سنة': 'year',
  'السنة': 'year',
  'مسار-الأرشيف': 'archive-url',
  'مسار أرشيف': 'archive-url',
  'مسار الأرشيف': 'archive-url',
  'archiveurl': 'archive-url',
  'لغة': 'language',
  'اللغة': 'language',
  'lang': 'language',
  'صحيفة': 'website',
  'دورية محكمة': 'website',
  'مجلة': 'website',
  'اسم المجلة': 'website',
  'جريدة': 'website',
  'اسم الصحيفة': 'website',
  'دورية': 'website',
  'periodical': 'website',
  'موقع': 'website',
  'الموقع': 'website',
  'عمل': 'website',
  'العمل': 'website',
  'من عمل': 'website',
  'ناشر': 'publisher',
  'الناشر': 'publisher',
  'institution': 'publisher',
  'مصدر': 'publisher',
  'الموزع': 'publisher',
  'المصدر': 'publisher',
  'المؤسسة': 'publisher',
  'مكان': 'location',
  'place': 'location',
  'المكان': 'location',
  'مقر': 'location',
  'المقر': 'location',
  'صفحة': 'page',
  'p': 'page',
  'الصفحة': 'page',
  'رقم الصفحة': 'page',
  'رقم صفحة': 'page',
  'ص': 'page',
  'دوي': 'doi',
  'المؤلفون': 'authors',
  'المؤلفين': 'authors',
  'people': 'authors',
  'credits': 'authors',
  'أشخاص': 'authors',
  'الأول': 'first',
  'الأول1': 'first',
  'مؤلف-الأول': 'first',
  'مؤلف1-الأول': 'first',
  'مؤلف الأول': 'first',
  'مؤلف1 الأول': 'first',
  'أول': 'first',
  'أول1': 'first',
  'اول': 'first',
  'اول1': 'first',
  'الاول': 'first',
  'الاول1': 'first',
  'author-first': 'first',
  'author-first1': 'first',
  'مؤلف الأول1': 'first',
  'author1-first': 'first',
  'given': 'first',
  'given1': 'first',
  'author-given': 'first',
  'author-given1': 'first',
  'مؤلف-الأول1': 'first',
  'author1-given': 'first',
  'عنوان مترجم': 'trans-title',
  'العنوان بالعربي': 'trans-title',
  'العنوان الأجنبي': 'trans-title',
  'عنوان أجنبي': 'trans-title',
  'العنوان المترجم': 'trans-title',
  'مسار': 'url',
  'المسار': 'url',
  'وصلة': 'url',
  'طبعة': 'edition',
  'الإصدار': 'edition',
  'الاصدار': 'edition',
  'إصدار': 'edition',
  'اصدار': 'edition',
  'الطبعة': 'edition',
  'رقم الطبعة': 'edition',
});
const citation$e = translate('citation', {
  'ردمك': 'isbn',
  'تاريخ-الوصول': 'access-date',
  'تاريخ الوصول': 'access-date',
  'تاريخ وصول': 'access-date',
  'accessdate': 'access-date',
  'الفصل': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'صفحات': 'pages',
  'الصفحات': 'pages',
  'pp': 'pages',
  'أرقام الصفحات': 'pages',
  'أرقم صفحات': 'pages',
  'اقتباس': 'quote',
  'quotation': 'quote',
  'محرر': 'editor',
  'محرر1': 'editor',
  'محرر-الأخير': 'editor',
  'محرر1-الأخير': 'editor',
  'محرر الأخير': 'editor',
  'محرر1 الأخير': 'editor',
  'محرر-الأخير1': 'editor',
  'محرر الأخير1': 'editor',
  'editor-last': 'editor',
  'editor-last1': 'editor',
  'editor1-last': 'editor',
  'editor-surname': 'editor',
  'editor-surname1': 'editor',
  'editor1-surname': 'editor',
  'editor1': 'editor',
  'المحرر': 'editor',
  'المحرر1': 'editor',
  'مؤلف': 'author',
  'مؤلف1': 'author',
  'الأخير': 'author',
  'الأخير1': 'author',
  'مؤلف-الأخير': 'author',
  'مؤلف1-الأخير': 'author',
  'مؤلف الأخير': 'author',
  'مؤلف1 الأخير': 'author',
  'author-last': 'author',
  'author-last1': 'author',
  'مؤلف-الأخير1': 'author',
  'author1-last': 'author',
  'surname': 'author',
  'surname1': 'author',
  'author-surname': 'author',
  'author-surname1': 'author',
  'author1-surname': 'author',
  'المؤلف': 'author',
  'المؤلف1': 'author',
  'أخير': 'author',
  'أخير1': 'author',
  'اخير': 'author',
  'اخير1': 'author',
  'مؤلف الأخير1': 'author',
  'subject': 'author',
  'subject1': 'author',
  'host': 'authors',
  'host1': 'author',
  'عنوان': 'title',
  'العنوان': 'title',
  'تاريخ-الأرشيف': 'archive-date',
  'تاريخ أرشيف': 'archive-date',
  'تاريخ الأرشيف': 'archive-date',
  'archivedate': 'archive-date',
  'تاريخ': 'date',
  'التاريخ': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'سنة': 'year',
  'السنة': 'year',
  'مسار-الأرشيف': 'archive-url',
  'مسار أرشيف': 'archive-url',
  'مسار الأرشيف': 'archive-url',
  'archiveurl': 'archive-url',
  'العدد': 'issue',
  'number': 'issue',
  'لغة': 'language',
  'اللغة': 'language',
  'lang': 'language',
  'ناشر': 'publisher',
  'الناشر': 'publisher',
  'institution': 'publisher',
  'مصدر': 'publisher',
  'الموزع': 'publisher',
  'المصدر': 'publisher',
  'المؤسسة': 'publisher',
  'صحيفة': 'website',
  'دورية محكمة': 'website',
  'مجلة': 'website',
  'اسم المجلة': 'website',
  'جريدة': 'website',
  'اسم الصحيفة': 'website',
  'دورية': 'website',
  'periodical': 'website',
  'موقع': 'website',
  'الموقع': 'website',
  'عمل': 'website',
  'العمل': 'website',
  'من عمل': 'website',
  'مكان': 'location',
  'place': 'location',
  'المكان': 'location',
  'مقر': 'location',
  'المقر': 'location',
  'صفحة': 'page',
  'p': 'page',
  'الصفحة': 'page',
  'رقم الصفحة': 'page',
  'رقم صفحة': 'page',
  'ص': 'page',
  'الأول': 'first',
  'الأول1': 'first',
  'مؤلف-الأول': 'first',
  'مؤلف1-الأول': 'first',
  'مؤلف الأول': 'first',
  'مؤلف1 الأول': 'first',
  'أول': 'first',
  'أول1': 'first',
  'اول': 'first',
  'اول1': 'first',
  'الاول': 'first',
  'الاول1': 'first',
  'author-first': 'first',
  'author-first1': 'first',
  'مؤلف الأول1': 'first',
  'author1-first': 'first',
  'given': 'first',
  'given1': 'first',
  'author-given': 'first',
  'author-given1': 'first',
  'مؤلف-الأول1': 'first',
  'author1-given': 'first',
  'دوي': 'doi',
  'المؤلفون': 'authors',
  'المؤلفين': 'authors',
  'people': 'authors',
  'credits': 'authors',
  'أشخاص': 'authors',
  'المجلد': 'volume',
  'الجزء': 'volume',
  'ج': 'volume',
  'عنوان مترجم': 'trans-title',
  'العنوان بالعربي': 'trans-title',
  'العنوان الأجنبي': 'trans-title',
  'عنوان أجنبي': 'trans-title',
  'العنوان المترجم': 'trans-title',
  'مسار': 'url',
  'المسار': 'url',
  'وصلة': 'url',
  'طبعة': 'edition',
  'الإصدار': 'edition',
  'الاصدار': 'edition',
  'إصدار': 'edition',
  'اصدار': 'edition',
  'الطبعة': 'edition',
  'رقم الطبعة': 'edition',
});
const birthDateAndAge = translate('birth date and age', {
  'العام': 'year',
  'السنة': 'year',
  'سنة': 'year',
});

const parsers$W = {
  'cita libro': citeBook$G,
  'cita publicación': citeJournal$u,
  'cita web': citeWeb$N,
  'cite manual': citeBook$G,
  'citeweb': citeWeb$N,
  'cw': citeWeb$N,
  'internetquelle': internetquelle$o,
  'web cite': citeWeb$N,
  'web kaynağı': citeWeb$N,
  'استشهاد': citation$e,
  'استشهاد بدورية': citeJournal$u,
  'استشهاد بدورية أكاديمية': citeJournal$u,
  'استشهاد بدورية محكمة': citeJournal$u,
  'استشهاد بكتاب': citeBook$G,
  'استشهاد بموقع': citeWeb$N,
  'استشهاد بويب': citeWeb$N,
  'استشهاد بويب/إنجليزي': citeWeb$N,
  'استشهاد بويب/الألمانية': citeWeb$N,
  'استشهاد صحيفة': citeJournal$u,
  'استشهاد ويب': citeWeb$N,
  'استشهاد ويب/إنجليزي': citeWeb$N,
  'اقتباس ويب': citeWeb$N,
  'الميلاد والسن': birthDateAndAge,
  'الولادة والسن': birthDateAndAge,
  'تاريخ الميلاد و العمر': birthDateAndAge,
  'تاريخ الميلاد والسن': birthDateAndAge,
  'تاريخ الميلاد والعمر': birthDateAndAge,
  'تاريخ ميلاد والعمر': birthDateAndAge,
  'تاريخ ميلاد وعمر': birthDateAndAge,
  'مرجع كتاب': citeBook$G,
  'مرجع مجلة': citeJournal$u,
  'مرجع موقع': citeWeb$N,
  'مرجع هارفرد': citation$e,
  'مرجع وب': citeWeb$N,
  'مرجع وب/إنجليزي': citeWeb$N,
  'مرجع ويب': citeWeb$N,
  'مرجع ويب/إنجليزي': citeWeb$N,
  'يستشهد كتاب': citeBook$G,
  'يستشهد مجلة': citeJournal$u,
  'يستشهد ويب': citeWeb$N,
  'یادکرد وب': citeWeb$N,
};

const data$W = { aliases: aliases$W, infoboxes: infoboxes$W, parsers: parsers$W };

const plugin$X = (_models, templates, boxes) => register(data$W, templates, boxes);
plugin$X.lang = 'ar';
plugin$X.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// azerbaijani template names → the core template they resolve to
const aliases$V = {
  'bayraq': 'flagicon',
  'bayraq-ölkə': 'flagicon',
  'başlama tarixi': 'start',
  'başlanğıc tarixi': 'start',
  'cite paper': 'cite journal',
  'commons category': 'commons cat',
  'commons kat': 'commons cat',
  'commons kateqoriyası': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'commonskat': 'commons cat',
  'commonskateqoriyası': 'commons cat',
  'doğum tarixi və yaş': 'birth date and age',
  'doğum tarixi və yaşı': 'birth date and age',
  'dty': 'birth date and age',
  'flaq': 'flagicon',
  'ipa1': 'ipa',
  'i̇sbn': 'isbn',
  'i̇stinad siyahısı': 'reflist',
  'i̇stinadlar': 'reflist',
  'i̇stinadlar siyahısı': 'reflist',
  'kiçik': 'small',
  'nihonqo': 'nihongo',
  'ref list': 'reflist',
  'vikianbar kat': 'commons cat',
  'vikianbar kateqoriyası': 'commons cat',
  'əsas': 'main',
  'əsas məqalə': 'main',
  'əsas səhifə': 'main',
};

// names recognised as infoboxes
const infoboxes$V = [
  'taksoqutu',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$M = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
});

const parsers$V = {
  'antcat': citeWeb$M,
  'cite ebd': citeWeb$M,
  'cite odnb': citeWeb$M,
  'citeweb': citeWeb$M,
  'lien web': citeWeb$M,
  'sayt mənbə': citeWeb$M,
  'web kaynağı': citeWeb$M,
};

const data$V = { aliases: aliases$V, infoboxes: infoboxes$V, parsers: parsers$V };

const plugin$W = (_models, templates, boxes) => register(data$V, templates, boxes);
plugin$W.lang = 'az';
plugin$W.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// belarusian template names → the core template they resolve to
const aliases$U = {
  'catmain': 'main',
  'catmore': 'main',
  'cite paper': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coord/display': 'coord',
  'initial release': 'start',
  'ipa1': 'ipa',
  'main2': 'main',
  'maincat': 'main',
  'odn': 'sfn',
  'reflist+': 'reflist',
  'refs': 'reflist',
  'sfn-1': 'sfn',
  'sfnp': 'sfn',
  'асноўная': 'main',
  'асноўны': 'main',
  'асноўны артыкул': 'main',
  'асноўны артыкул катэгорыі': 'main',
  'асноўны артыкул па тэме катэгорыі': 'main',
  'асноўныя артыкулы': 'main',
  'болей': 'main',
  'вікісховішча': 'commons cat',
  'вікісховішча-кат': 'commons cat',
  'галоўная': 'main',
  'галоўны артыкул': 'main',
  'галоўны артыкул у катэгорыі': 'main',
  'глядзіце таксама': 'main',
  'дата нараджэння і ўзрост': 'birth date and age',
  'зноска': 'sfn',
  'каардынаты': 'coord',
  'крыніцы': 'reflist',
  'ніханго': 'nihongo',
  'партал': 'portal',
  'скарочаная зноска': 'sfn',
  'сцяг': 'flagicon',
};

// names recognised as infoboxes
const infoboxes$U = [
  'таксанамія',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$L = translate('cite web', {
  'datepublished': 'date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
});
const internetquelle$n = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'datepublished': 'date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
});

const parsers$U = {
  'cita web': citeWeb$L,
  'cite web 2': citeWeb$L,
  'citeweb': citeWeb$L,
  'cw': citeWeb$L,
  'internetquelle': internetquelle$n,
};

const data$U = { aliases: aliases$U, infoboxes: infoboxes$U, parsers: parsers$U };

const plugin$V = (_models, templates, boxes) => register(data$U, templates, boxes);
plugin$V.lang = 'be';
plugin$V.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// bulgarian template names → the core template they resolve to
const aliases$T = {
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'hrf': 'sfn',
  'дата на раждане и години': 'birth date and age',
  'дрг': 'birth date and age',
  'знаме': 'flag',
  'знамеикона': 'flagicon',
  'икона-флаг': 'flagicon',
  'мфа': 'ipa',
  'основна': 'main',
  'портал': 'portal',
};

// names recognised as infoboxes
const infoboxes$T = [
  'таксокутия',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$K = translate('cite web', {
  'уеб_адрес': 'url',
  'заглавие': 'title',
  'автор': 'author',
  'фамилно_име': 'last',
  'първо_име': 'first',
  'труд': 'work',
  'издател': 'publisher',
  'страници': 'pages',
  'цитат': 'quote',
});
const citeBook$F = translate('cite book', {
  'editor-last': 'editor',
});
const citeJournal$t = translate('cite journal', {
  'accessdate': 'access-date',
  'достъп_дата': 'access-date',
  'достъп_ден_месец': 'access-date',
  'archiveurl': 'archive-url',
  'архив_уеб_адрес': 'archive-url',
  'archivedate': 'archive-date',
  'архив_дата': 'archive-date',
});

const parsers$T = {
  'cita web': citeWeb$K,
  'citeweb': citeWeb$K,
  'цитат книга': citeBook$F,
  'цитат периодика': citeJournal$t,
  'цитат уеб': citeWeb$K,
};

const data$T = { aliases: aliases$T, infoboxes: infoboxes$T, parsers: parsers$T };

const plugin$U = (_models, templates, boxes) => register(data$T, templates, boxes);
plugin$U.lang = 'bg';
plugin$U.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// bengali template names → the core template they resolve to
const aliases$S = {
  'ap': 'main',
  'birthdate and age': 'birth date and age',
  'c cat': 'commons cat',
  'category commons': 'commons cat',
  'cc': 'commons cat',
  'ccat': 'commons cat',
  'commons categories': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'commonsimages cat': 'commons cat',
  'coor d': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'flag icon': 'flagicon',
  'footnote': 'reflist',
  'foundation date': 'start',
  'inline coordinates': 'coord',
  'kaynakça': 'reflist',
  'launch date': 'start',
  'portal box': 'portal',
  'portalpar': 'portal',
  'posa commons': 'commons cat',
  'refs': 'reflist',
  'références': 'reflist',
  'seemain': 'main',
  'shortened footnote template': 'sfn',
  'wikimedia commons cat': 'commons cat',
  'আইএসবিএন': 'isbn',
  'আইপিএ': 'ipa',
  'আধ্বব': 'ipa',
  'কমন্স বিষয়শ্রেণী': 'commons cat',
  'কমন্সক্যাট': 'commons cat',
  'ছোট': 'small',
  'জন্ম তারিখ এবং বয়স': 'birth date and age',
  'জন্ম তারিখ ও বয়স': 'birth date and age',
  'তথ্যছক-portals': 'portal',
  'দেশের উপাত্ত এরিত্রিয়া': 'flag',
  'পতাকা': 'flag',
  'পতাকা আইকন': 'flagicon',
  'পোর্টাল': 'portal',
  'প্রধান': 'main',
  'প্রবেশদ্বার': 'portal',
  'মুখ্য': 'main',
  'মূল': 'main',
  'মূল নিবন্ধ': 'main',
  'শুরুর তারিখ': 'start',
  'সূতা': 'reflist',
  'সূত্র তালিকা': 'reflist',
  'সূত্রতালিকা': 'reflist',
  'স্থানাংক': 'coord',
  'স্থানাঙ্ক': 'coord',
};

// names recognised as infoboxes
const infoboxes$S = [
  'তথ্যছক শ্রেণীবিন্যাস',
  'প্রজাতিছক',
  'শ্রেণিবিন্যাস ছক',
  'শ্রেণীবিন্যাস ছক',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$s = translate('cite journal', {
  'ইউআরএল': 'url',
  'শিরোনাম': 'title',
  'তারিখ': 'date',
  'শেষাংশ': 'last',
  'শেষাংশ১': 'last',
  'লেখক': 'last',
  'লেখক১': 'last',
  'প্রথমাংশ': 'first',
  'প্রথমাংশ১': 'first',
  'সংগ্রহের-তারিখ': 'access-date',
  'সংগ্রহেরতারিখ': 'access-date',
  'accessdate': 'access-date',
  'আর্কাইভের-ইউআরএল': 'archive-url',
  'আর্কাইভেরইউআরএল': 'archive-url',
  'archiveurl': 'archive-url',
  'আর্কাইভের-তারিখ': 'archive-date',
  'আর্কাইভেরতারিখ': 'archive-date',
  'archivedate': 'archive-date',
  'প্রকাশক': 'publisher',
  'পরিবেশক': 'publisher',
  'প্রতিষ্ঠান': 'publisher',
  'বছর': 'year',
  'আইএসবিএন': 'isbn',
  'ভাষা': 'language',
  'পাতা': 'page',
  'পৃষ্ঠা': 'page',
  'p': 'page',
  'পাতাসমূহ': 'pages',
  'পৃষ্ঠাসমূহ': 'pages',
  'pp': 'pages',
  'সংস্করণ': 'edition',
  'খণ্ড': 'volume',
  'অধ্যায়': 'chapter',
  'সাময়িকী': 'journal',
  'সংখ্যা নং': 'issue',
});
const citeBook$E = translate('cite book', {
  'ইউআরএল': 'url',
  'শিরোনাম': 'title',
  'তারিখ': 'date',
  'শেষাংশ': 'last',
  'শেষাংশ১': 'last',
  'লেখক': 'last',
  'লেখক১': 'last',
  'প্রথমাংশ': 'first',
  'প্রথমাংশ১': 'first',
  'সংগ্রহের-তারিখ': 'access-date',
  'সংগ্রহেরতারিখ': 'access-date',
  'accessdate': 'access-date',
  'আর্কাইভের-ইউআরএল': 'archive-url',
  'আর্কাইভেরইউআরএল': 'archive-url',
  'archiveurl': 'archive-url',
  'আর্কাইভের-তারিখ': 'archive-date',
  'আর্কাইভেরতারিখ': 'archive-date',
  'archivedate': 'archive-date',
  'প্রকাশক': 'publisher',
  'পরিবেশক': 'publisher',
  'প্রতিষ্ঠান': 'publisher',
  'বছর': 'year',
  'আইএসবিএন': 'isbn',
  'ভাষা': 'language',
  'পাতা': 'page',
  'পৃষ্ঠা': 'page',
  'p': 'page',
  'পাতাসমূহ': 'pages',
  'পৃষ্ঠাসমূহ': 'pages',
  'pp': 'pages',
  'সংস্করণ': 'edition',
  'অধ্যায়': 'chapter',
  'কর্ম': 'website',
  'সাময়িকী': 'website',
  'সংবাদপত্র': 'website',
  'ওয়েবসাইট': 'website',
  'বিশ্বকোষ': 'website',
});
const citeWeb$J = translate('cite web', {
  'ইউআরএল': 'url',
  'শিরোনাম': 'title',
  'তারিখ': 'date',
  'শেষাংশ': 'author',
  'শেষাংশ১': 'author',
  'লেখক': 'author',
  'লেখক১': 'author',
  'প্রথমাংশ': 'first',
  'প্রথমাংশ১': 'first',
  'সংগ্রহের-তারিখ': 'access-date',
  'সংগ্রহেরতারিখ': 'access-date',
  'accessdate': 'access-date',
  'আর্কাইভের-ইউআরএল': 'archive-url',
  'আর্কাইভেরইউআরএল': 'archive-url',
  'archiveurl': 'archive-url',
  'আর্কাইভের-তারিখ': 'archive-date',
  'আর্কাইভেরতারিখ': 'archive-date',
  'archivedate': 'archive-date',
  'প্রকাশক': 'publisher',
  'পরিবেশক': 'publisher',
  'প্রতিষ্ঠান': 'publisher',
  'বছর': 'year',
  'আইএসবিএন': 'isbn',
  'ভাষা': 'language',
  'উক্তি': 'quote',
  'পাতা': 'page',
  'পৃষ্ঠা': 'page',
  'p': 'page',
  'পাতাসমূহ': 'pages',
  'পৃষ্ঠাসমূহ': 'pages',
  'pp': 'pages',
  'সংস্করণ': 'edition',
  'লেখকগণ': 'authors',
  'ব্যক্তি': 'authors',
  'স্বাগতিক': 'authors',
  'কৃতিত্ব': 'authors',
  'people': 'authors',
  'host': 'authors',
  'ওয়েবসাইট': 'website',
  'কর্ম': 'website',
});
const citation$d = translate('citation', {
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'periodical': 'website',
  'number': 'issue',
  'place': 'location',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
});

const parsers$S = {
  'akademik dergi kaynağı': citeJournal$s,
  'book reference': citeBook$E,
  'cita web': citeWeb$J,
  'cite chapter': citeBook$E,
  'cite manual': citeBook$E,
  'cite study': citation$d,
  'cite website': citeWeb$J,
  'cite work': citeBook$E,
  'citebook': citeBook$E,
  'citeweb': citeWeb$J,
  'kaynak': citation$d,
  'kitap kaynağı': citeBook$E,
  'web kaynağı': citeWeb$J,
  'استشهاد ويب': citeWeb$J,
  'উদ্ধৃতি': citation$d,
  'ওয়েব উদ্ধৃতি': citeWeb$J,
  'ওয়েব উদ্বৃতি': citeWeb$J,
  'ওয়েব উৎস': citeWeb$J,
  'গ্রন্থ উদ্ধৃতি': citeBook$E,
  'বই উদ্ধৃতি': citeBook$E,
  'সাইট জার্নাল': citeJournal$s,
  'সাময়িকী উদ্ধৃতি': citeJournal$s,
};

const data$S = { aliases: aliases$S, infoboxes: infoboxes$S, parsers: parsers$S };

const plugin$T = (_models, templates, boxes) => register(data$S, templates, boxes);
plugin$T.lang = 'bn';
plugin$T.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// catalan template names → the core template they resolve to
const aliases$R = {
  'afi': 'ipa',
  'amaga': 'reflist',
  'amaga ref': 'reflist',
  'amaga ref2': 'reflist',
  'ap': 'main',
  'article detallat': 'main',
  'article principal': 'main',
  'birthdate and age': 'birth date and age',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor d': 'coord',
  'coordenades': 'coord',
  'coords': 'coord',
  'coorheader': 'coord',
  'data d\'inici': 'start',
  'data de naixement i edat': 'birth date and age',
  'data inici': 'start',
  'data naixement i edat': 'birth date and age',
  'harvnp': 'sfn',
  'initial release': 'start',
  'japonès': 'nihongo',
  'listaref': 'reflist',
  'obra citada': 'citation',
  'principal': 'main',
  'referencies': 'reflist',
  'referència': 'reflist',
  'referències': 'reflist',
  'referències2': 'reflist',
  'références': 'reflist',
  'societat catalana de matemàtiques': 'sfn',
};

// names recognised as infoboxes
const infoboxes$R = [
  'esser viu',
  'ficha de taxón',
  'fitxa de tàxon',
  'iev',
  'infotaula d\'ésser viu',
  'infotaula esser viu',
  'infotaula taxonòmica',
  'infotaula ésser viu',
  'speciesbox',
  'taxocaixa',
  'taxocaixa amfibi',
  'taxocaixa animal',
  'taxocaixa anèl·lid',
  'taxocaixa arqueobacteri',
  'taxocaixa artròpode',
  'taxocaixa avial',
  'taxocaixa cnidari',
  'taxocaixa dinosaure',
  'taxocaixa equinoderm',
  'taxocaixa eubacteri',
  'taxocaixa eucariota',
  'taxocaixa fong',
  'taxocaixa mamaliaforme',
  'taxocaixa mammaliaforme',
  'taxocaixa mamífer',
  'taxocaixa mol·lusc',
  'taxocaixa ocell',
  'taxocaixa peix',
  'taxocaixa planta',
  'taxocaixa platihelmint',
  'taxocaixa rèptil',
  'taxocaixa sinàpsid',
  'taxocaixa virus',
  'ésser viu',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$r = translate('cite journal', {
  'cognom': 'last',
  'apellidos': 'last',
  'cognom1': 'last',
  'nom1': 'last',
  'nom': 'first',
  'nombre': 'first',
  'prénom1': 'first',
  'autor': 'author',
  'auteur1': 'author',
  'publicació': 'journal',
  'publicación': 'journal',
  'périodique': 'journal',
  'obra': 'journal',
  'llengua': 'language',
  'idioma': 'language',
  'langue': 'language',
  'lien titre': 'url',
  'volum': 'volume',
  'volumen': 'volume',
  'exemplar': 'issue',
  'número': 'issue',
  'numéro': 'issue',
  'any': 'year',
  'año': 'year',
  'année': 'year',
  'data': 'date',
  'fecha': 'date',
  'editorial': 'editor',
  'éditeur': 'editor',
  'lloc': 'location',
  'place': 'location',
  'ubicación': 'location',
  'lugar': 'location',
  'lieu': 'location',
  'pàgines': 'pages',
  'pàgina': 'pages',
  'página': 'pages',
  'páginas': 'pages',
  'citació': 'quote',
  'cita': 'quote',
  'extrait': 'quote',
});
const citeBook$D = translate('cite book', {
  'cognom': 'last',
  'cognom1': 'last',
  'apellido': 'last',
  'nom': 'first',
  'nom1': 'first',
  'nombre': 'first',
  'autor': 'author',
  'autor1': 'author',
  'capítol': 'chapter',
  'capítulo': 'chapter',
  'títol': 'title',
  'título': 'title',
  'volum': 'volume',
  'volumen': 'volume',
  'edició': 'edition',
  'edición': 'edition',
  'any': 'year',
  'año': 'year',
  'data': 'date',
  'fecha': 'date',
  'editorial': 'publisher',
  'lloc': 'location',
  'lugar': 'location',
  'pàgines': 'pages',
  'pàgina': 'pages',
  'página': 'pages',
  'páginas': 'pages',
});
const citeWeb$I = translate('cite web', {
  'títol': 'title',
  'títoltraduït': 'trans-title',
  'consulta': 'access-date',
  'accessdate': 'access-date',
  'nom': 'first',
  'cognom': 'last',
  'obra': 'website',
  'sitioweb': 'website',
  'data': 'date',
  'arxiuurl': 'archive-url',
  'arxiudata': 'archive-date',
});

const parsers$R = {
  'article': citeJournal$r,
  'cita diccionari': citeBook$D,
  'cita llibre': citeBook$D,
  'cita publicació': citeJournal$r,
  'cita revista': citeJournal$r,
  'citar llibre': citeBook$D,
  'citar publicació': citeJournal$r,
  'citar web': citeWeb$I,
  'cite paper': citeJournal$r,
  'cite website': citeWeb$I,
  'cite work': citeBook$D,
  'ref llibre': citeBook$D,
  'ref publicació': citeJournal$r,
  'ref web': citeWeb$I,
  'ref-artículo': citeJournal$r,
  'ref-capítol': citeBook$D,
  'ref-llibre': citeBook$D,
  'ref-publicació': citeJournal$r,
  'ref-web': citeWeb$I,
};

const data$R = { aliases: aliases$R, infoboxes: infoboxes$R, parsers: parsers$R };

const plugin$S = (_models, templates, boxes) => register(data$R, templates, boxes);
plugin$S.lang = 'ca';
plugin$S.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// czech template names → the core template they resolve to
const aliases$Q = {
  'cite magazine': 'cite journal',
  'cite techreport': 'cite journal',
  'commonscat': 'commons cat',
  'datum narození a věk': 'birth date and age',
  'malé': 'small',
  'narození': 'birth date and age',
  'portály': 'portal',
  'references scrollable': 'reflist',
  'souřadnice': 'coord',
  'vlajka': 'flagicon',
};

// names recognised as infoboxes
const infoboxes$Q = [
  'taxonbox',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$H = translate('cite web', {
  'příjmení': 'last',
  'jméno': 'first',
  'autor': 'author',
  'titul': 'title',
  'vydavatel': 'publisher',
  'datum vydání': 'date',
  'datum_vydání': 'date',
});
const citeBook$C = translate('cite book', {
  'příjmení': 'last1',
  'příjmení1': 'last1',
  'jméno': 'first1',
  'jméno1': 'first1',
  'autor': 'author',
  'autor1': 'author',
  'titul': 'title',
  'vydání': 'edition',
  'vydavatel': 'publisher',
  'rok vydání': 'year',
  'rok': 'year',
});

const parsers$Q = {
  'citace databáze': citeWeb$H,
  'citace elektronické monografie': citeWeb$H,
  'citace elektronického zdroje': citeWeb$H,
  'citace knihy': citeBook$C,
  'citace monografie': citeBook$C,
  'citace webu': citeWeb$H,
};

const data$Q = { aliases: aliases$Q, infoboxes: infoboxes$Q, parsers: parsers$Q };

const plugin$R = (_models, templates, boxes) => register(data$Q, templates, boxes);
plugin$R.lang = 'cs';
plugin$R.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// welsh template names → the core template they resolve to
const aliases$P = {
  'bach': 'small',
  'comincat': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coordinates': 'coord',
  'cyfeiriadau': 'reflist',
  'dyddiad geni ac oedran': 'birth date and age',
  'eicon baner': 'flagicon',
  'eiconbaner': 'flagicon',
  'flag icon': 'flagicon',
  'location': 'coord',
  'prif': 'main',
};

// names recognised as infoboxes
const infoboxes$P = [
  'blwch tacson',
];

const parsers$P = {};

const data$P = { aliases: aliases$P, infoboxes: infoboxes$P, parsers: parsers$P };

const plugin$Q = (_models, templates, boxes) => register(data$P, templates, boxes);
plugin$Q.lang = 'cy';
plugin$Q.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// danish template names → the core template they resolve to
const aliases$O = {
  'commonskat': 'commons cat',
  'coor d': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'dato og alder': 'birth date and age',
  'doa': 'birth date and age',
  'drapeau': 'flagicon',
  'flag2': 'flag',
  'flagg': 'flag',
  'flagikon': 'flagicon',
  'flagikon2': 'flagicon',
  'flagkant': 'flagicon',
  'formattal': 'formatnum',
  'fødselsdato og alder': 'birth date and age',
  'geobox coor': 'coord',
  'koordinater': 'coord',
  'land flag': 'flag',
  'land flagikon': 'flagicon',
  'se også2': 'main',
  'shortened footnote template': 'sfn',
  'start dato': 'start',
  'uddybende': 'main',
  'uddybende artikel': 'main',
};

// names recognised as infoboxes
const infoboxes$O = [
  'skabeloner/taksonomi',
  'taksoboks',
  'taxobox2',
  'taxobox3',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$q = translate('cite journal', {
  'titel': 'title',
  'efternavn': 'author',
  'efternavn1': 'author',
  'forfatter': 'author',
  'forfatter1': 'author',
  'fornavn': 'first',
  'fornavn1': 'first',
  'dato': 'date',
  'tidsskrift': 'work',
  'værk': 'work',
  'år': 'year',
  'udgave': 'edition',
  'side': 'page',
  'sider': 'pages',
  'lang': 'language',
  'sprog': 'language',
});
const citeWeb$G = translate('cite web', {
  'accessdate': 'access-date',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editor1': 'editor',
  'editors': 'editor',
  'editor-surname': 'editor',
  'editor1-surname': 'editor',
});
const citation$c = translate('citation', {
  'efternavn': 'author',
  'surname': 'author',
  'surname1': 'author',
  'author-last': 'author',
  'author-last1': 'author',
  'author1-last': 'author',
  'subject': 'author',
  'subject1': 'author',
  'forfatter': 'author',
  'forfatter1': 'author',
  'efternavn1': 'author',
  'fornavn': 'first',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'fornavn1': 'first',
  'titel': 'title',
  'dato': 'date',
  'år': 'year',
  'besøgsdato': 'access-date',
  'hentningsdato': 'access-date',
  'hentet': 'access-date',
  'accessdate': 'access-date',
  'citat': 'quote',
  'quotation': 'quote',
  'arkivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arkivdato': 'archive-date',
  'archivedate': 'archive-date',
  'værk': 'website',
  'tidsskrift': 'website',
  'avis': 'website',
  'magasin': 'website',
  'hjemmeside': 'website',
  'periodical': 'website',
  'arbejde': 'website',
  'bind': 'volume',
  'nummer': 'issue',
  'number': 'issue',
  'sider': 'pages',
  'pp': 'pages',
  'ss': 'pages',
  'kapitel': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'bidrag': 'chapter',
  'udgave': 'edition',
  'sted': 'location',
  'place': 'location',
  'udgiver': 'publisher',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'forlag': 'publisher',
  'redaktør-efternavn': 'editor',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'redaktør': 'editor',
  'sprog': 'language',
  'in': 'language',
  'på': 'language',
});
const citeBook$B = translate('cite book', {
  'efternavn': 'author',
  'surname': 'author',
  'surname1': 'author',
  'author-last': 'author',
  'author-last1': 'author',
  'author1-last': 'author',
  'subject': 'author',
  'subject1': 'author',
  'forfatter': 'author',
  'forfatter1': 'author',
  'efternavn1': 'author',
  'fornavn': 'first',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'fornavn1': 'first',
  'titel': 'title',
  'dato': 'date',
  'år': 'year',
  'besøgsdato': 'access-date',
  'hentningsdato': 'access-date',
  'hentet': 'access-date',
  'accessdate': 'access-date',
  'citat': 'quote',
  'quotation': 'quote',
  'arkivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arkivdato': 'archive-date',
  'archivedate': 'archive-date',
  'værk': 'website',
  'tidsskrift': 'website',
  'avis': 'website',
  'magasin': 'website',
  'hjemmeside': 'website',
  'periodical': 'website',
  'arbejde': 'website',
  'bind': 'volume',
  'nummer': 'issue',
  'number': 'issue',
  'sider': 'pages',
  'pp': 'pages',
  'ss': 'pages',
  'kapitel': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'bidrag': 'chapter',
  'udgave': 'edition',
  'sted': 'location',
  'place': 'location',
  'udgiver': 'publisher',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'forlag': 'publisher',
  'redaktør-efternavn': 'editor',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'redaktør': 'editor',
  'sprog': 'language',
  'in': 'language',
  'på': 'language',
});

const parsers$O = {
  'cite magazine': citeJournal$q,
  'cite paper': citeJournal$q,
  'cite pmid': citeJournal$q,
  'cite tidsskrift': citeJournal$q,
  'cite website': citeWeb$G,
  'cite www': citeWeb$G,
  'citejournal': citeJournal$q,
  'citepaper': citeJournal$q,
  'citeweb': citeWeb$G,
  'kilde': citation$c,
  'kilde artikel': citeJournal$q,
  'kilde bog': citeBook$B,
  'kilde tidsskrift': citeJournal$q,
};

const data$O = { aliases: aliases$O, infoboxes: infoboxes$O, parsers: parsers$O };

const plugin$P = (_models, templates, boxes) => register(data$O, templates, boxes);
plugin$P.lang = 'da';
plugin$P.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// german template names → the core template they resolve to
const aliases$N = {
  'commonscat': 'commons cat',
  'flagge': 'flag',
  'hauptartikel': 'main',
  'hauptseite': 'main',
  'ipa-text': 'ipa',
  'kleinschrift': 'small',
  'koordinate': 'coord',
  'lagewunsch': 'coord',
  'personendaten': 'persondata',
};

const infoboxes$N = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const internetquelle$m = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
});
const citeWeb$F = translate('cite web', {
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
});
const literatur$4 = translate('cite book', {
  'titel': 'title',
  'autor': 'author',
  'verlag': 'publisher',
  'jahr': 'year',
  'ort': 'location',
  'seiten': 'pages',
  'sammelwerk': 'journal',
  'band': 'volume',
  'nummer': 'issue',
  'auflage': 'edition',
  'hrsg': 'editor',
  'sprache': 'language',
  'datum': 'date',
  'online': 'url',
});

const parsers$N = {
  'internetquelle': internetquelle$m,
  'iq': citeWeb$F,
  'literatur': literatur$4,
};

const data$N = { aliases: aliases$N, infoboxes: infoboxes$N, parsers: parsers$N };

const plugin$O = (_models, templates, boxes) => register(data$N, templates, boxes);
plugin$O.lang = 'de';
plugin$O.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// greek template names → the core template they resolve to
const aliases$M = {
  'ccat': 'commons cat',
  'cita boe': 'cite journal',
  'cite magazine': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'coords': 'coord',
  'country': 'flag',
  'country data': 'flag',
  'ipa link': 'ipa',
  'main page': 'main',
  'petit': 'small',
  'portal box': 'portal',
  'δφα': 'ipa',
  'ηγη': 'birth date and age',
  'ημερομηνία γέννησης και ηλικία': 'birth date and age',
  'ημερομηνία εκκίνησης': 'start',
  'κύριο': 'main',
  'κύριο άρθρο': 'main',
  'κύριο λήμμα': 'main',
  'παραπομπές': 'reflist',
  'πύλη': 'portal',
  'σημειώσεις': 'reflist',
  'στοιχεία προσώπου': 'persondata',
  'σύνδεσμος ipa': 'ipa',
};

// names recognised as infoboxes
const infoboxes$M = [
  'ταξινομοπλαίσιο',
  'ταξονομοπλαίσιο',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$A = translate('cite book', {
  'τίτλος': 'title',
  'επώνυμο': 'author',
  'συγγραφέας': 'author',
  'επώνυμο1': 'author',
  'συγγραφέας1': 'author',
  'όνομα': 'first',
  'όνομα1': 'first',
  'ημερομηνία': 'date',
  'εκδότης': 'publisher',
  'έτος': 'year',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'επώνυμο-επιμελητή': 'editor',
  'επώνυμο-επιμελητή1': 'editor',
  'επιμελητής': 'editor',
  'έκδοση': 'edition',
  'τόμος': 'volume',
  'place': 'location',
  'p': 'page',
  'σελίδα': 'page',
  'σ': 'page',
  'pp': 'pages',
  'σελίδες': 'pages',
  'σσ': 'pages',
  'κεφάλαιο': 'chapter',
  'μεταφρασμένος-τίτλος': 'trans-title',
  'γλώσσα': 'language',
  'in': 'language',
});
const citeWeb$E = translate('cite web', {
  'ημερομηνία': 'date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
});
const internetquelle$l = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'ημερομηνία': 'date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
});

const parsers$M = {
  'cita libro': citeBook$A,
  'cite manual': citeBook$A,
  'cite website': citeWeb$E,
  'citebook': citeBook$A,
  'citeweb': citeWeb$E,
  'internetquelle': internetquelle$l,
  'lien web': citeWeb$E,
  'ouvrage': citeBook$A,
};

const data$M = { aliases: aliases$M, infoboxes: infoboxes$M, parsers: parsers$M };

const plugin$N = (_models, templates, boxes) => register(data$M, templates, boxes);
plugin$N.lang = 'el';
plugin$N.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// esperanto template names → the core template they resolve to
const aliases$L = {
  'ceg': 'cite journal',
  'cer': 'cite web',
  'citado de libro': 'cite book',
  'citado de ĵurnalo': 'cite journal',
  'citajxo el gazeto': 'cite journal',
  'citajxo el libro': 'cite book',
  'citaĵo de libro': 'cite book',
  'citaĵo el gazeto': 'cite journal',
  'citaĵo el la reto': 'cite web',
  'citaĵo el libro': 'cite book',
  'citaĵo el retejo': 'cite web',
  'citaĵo el reto': 'cite web',
  'citgazeto': 'cite journal',
  'citlibro': 'cite book',
  'citreto': 'cite web',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'ekdato': 'start',
  'eta': 'small',
  'flago': 'flag',
  'ifa': 'ipa',
  'komuneja kategorio': 'commons cat',
  'koord': 'coord',
  'lupeo': 'main',
  'malgrande': 'small',
  'mallonga piednoto': 'sfn',
  'naskiĝdato kaj aĝo': 'birth date and age',
  'naskiĝtago kaj aĝo': 'birth date and age',
  'nombro': 'formatnum',
  'odn': 'sfn',
  'plu': 'main',
  'portalo': 'portal',
  'referencoj': 'reflist',
  'ĉefa': 'main',
  'ĉefa artikolo': 'main',
  'ĉefartikolo': 'main',
};

// names recognised as infoboxes
const infoboxes$L = [
  'taksonomio',
];

const parsers$L = {};

const data$L = { aliases: aliases$L, infoboxes: infoboxes$L, parsers: parsers$L };

const plugin$M = (_models, templates, boxes) => register(data$L, templates, boxes);
plugin$M.lang = 'eo';
plugin$M.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// spanish template names → the core template they resolve to
const aliases$K = {
  'afi': 'ipa',
  'ap': 'main',
  'article détaillé': 'main',
  'artículo principal': 'main',
  'categoría commons': 'commons cat',
  'catmain': 'main',
  'catmas': 'main',
  'catmore': 'main',
  'catmás': 'main',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor site': 'coord',
  'coor url': 'coord',
  'coordenadas': 'coord',
  'cp': 'main',
  'harvnp': 'sfn',
  'harvnphp': 'sfn',
  'harvref': 'sfn',
  'ipa link': 'ipa',
  'ipablink': 'ipa',
  'ipalink': 'ipa',
  'ipaslink': 'ipa',
  'listaref': 'reflist',
  'listref': 'reflist',
  'nihongo4': 'nihongo',
  'notelist': 'reflist',
  'notelist-ua': 'reflist',
  'pequeño': 'small',
  'portail': 'portal',
  'portal bar': 'portal',
  'portal box': 'portal',
  'portal2': 'portal',
  'portalpar': 'portal',
  'principal': 'main',
  'references': 'reflist',
  'referències': 'reflist',
  'références': 'reflist',
  'sfnb': 'sfn',
  'sfnp': 'sfn',
};

// names recognised as infoboxes
const infoboxes$K = [
  'automatic taxobox',
  'ficha de taxon',
  'ficha de taxón',
  'ficha de virus',
  'speciesbox',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$D = translate('cite web', {
  'título': 'title',
  'títulotrad': 'trans-title',
  'autor': 'author',
  'apellido': 'last',
  'apellidos': 'last',
  'teúltimo': 'last',
  'nombre': 'first',
  'primero': 'first',
  'fecha': 'date',
  'año': 'year',
  'idioma': 'language',
  'páginas': 'pages',
  'editorial': 'publisher',
  'ubicación': 'location',
  'fechaacceso': 'access-date',
  'accessdate': 'access-date',
  'cita': 'quote',
  'sitioweb': 'website',
  'obra': 'website',
  'urlarchivo': 'archive-url',
  'archiveurl': 'archive-url',
  'fechaarchivo': 'archive-date',
  'archivedate': 'archive-date',
});
const citation$b = translate('citation', {
  'apellidos': 'author',
  'autor': 'author',
  'autores': 'author',
  'surname': 'author',
  'surname1': 'author',
  'nombre': 'first',
  'given1': 'first',
  'given': 'first',
  'título': 'title',
  'fecha': 'date',
  'día': 'date',
  'day': 'date',
  'fecha-publicación': 'date',
  'publication-date': 'date',
  'lugar': 'location',
  'ubicación': 'location',
  'place': 'location',
  'lugar-publicación': 'location',
  'publication-place': 'location',
  'idioma': 'language',
  'in': 'language',
  'fechaacceso': 'access-date',
  'fecha-acceso': 'access-date',
  'accessdate': 'access-date',
  'editorial': 'publisher',
  'edición': 'edition',
  'capítulo': 'chapter',
  'contribution': 'chapter',
  'volumen': 'volume',
  'pub-periódica': 'work',
  'periódico': 'work',
  'revista': 'work',
  'periodical': 'work',
  'número': 'issue',
  'number': 'issue',
  'página': 'page',
  'páginas': 'pages',
  'apellidos-editor': 'editor',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'editor1': 'editor',
  'editors': 'editor',
  'cita': 'quote',
});
const citeBook$z = translate('cite book', {
  'apellidos': 'author',
  'autor': 'author',
  'autores': 'author',
  'apellido': 'author',
  'nombre': 'first',
  'nombres': 'first',
  'nombre1': 'first',
  'given1': 'first',
  'título': 'title',
  'año': 'year',
  'fecha': 'date',
  'editorial': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor1-last': 'editor',
  'ubicación': 'location',
  'lugar': 'location',
  'place': 'location',
  'edición': 'edition',
  'volumen': 'volume',
  'página': 'page',
  'páginas': 'pages',
  'idioma': 'language',
  'capítulo': 'chapter',
  'cita': 'quote',
});
const citeJournal$p = translate('cite journal', {
  'título': 'title',
  'artículo': 'title',
  'article': 'title',
  'apellidos': 'author',
  'autor': 'author',
  'autores': 'author',
  'vauthors': 'author',
  'apellido': 'author',
  'nombre': 'first',
  'nombres': 'first',
  'nombre1': 'first',
  'given1': 'first',
  'fecha': 'date',
  'publicación': 'journal',
  'editorial': 'publisher',
  'fechaacceso': 'access-date',
  'accessdate': 'access-date',
  'número': 'issue',
  'año': 'year',
  'apellidos-editor': 'editor',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor1-last': 'editor',
  'editora': 'editor',
  'editors': 'editor',
  'ubicación': 'location',
  'lugar': 'location',
  'place': 'location',
  'edición': 'edition',
  'volumen': 'volume',
  'página': 'page',
  'páginas': 'pages',
  'idioma': 'language',
  'urlarchivo': 'archive-url',
  'archiveurl': 'archive-url',
  'fechaarchivo': 'archive-date',
  'archivedate': 'archive-date',
  'cita': 'quote',
});
const internetquelle$k = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'título': 'title',
  'títulotrad': 'trans-title',
  'apellido': 'last',
  'apellidos': 'last',
  'teúltimo': 'last',
  'nombre': 'first',
  'primero': 'first',
  'fecha': 'date',
  'año': 'year',
  'idioma': 'language',
  'páginas': 'pages',
  'editorial': 'publisher',
  'ubicación': 'location',
  'fechaacceso': 'access-date',
  'accessdate': 'access-date',
  'cita': 'quote',
  'sitioweb': 'website',
  'obra': 'website',
  'urlarchivo': 'archive-url',
  'archiveurl': 'archive-url',
  'fechaarchivo': 'archive-date',
  'archivedate': 'archive-date',
});
const literatur$3 = translate('cite book', {
  'titel': 'title',
  'autor': 'author',
  'verlag': 'publisher',
  'jahr': 'year',
  'ort': 'location',
  'seiten': 'pages',
  'sammelwerk': 'journal',
  'band': 'volume',
  'nummer': 'issue',
  'auflage': 'edition',
  'hrsg': 'editor',
  'sprache': 'language',
  'datum': 'date',
  'online': 'url',
  'apellidos': 'author',
  'autores': 'author',
  'apellido': 'author',
  'nombre': 'first',
  'nombres': 'first',
  'nombre1': 'first',
  'given1': 'first',
  'título': 'title',
  'año': 'year',
  'fecha': 'date',
  'editorial': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor1-last': 'editor',
  'ubicación': 'location',
  'lugar': 'location',
  'place': 'location',
  'edición': 'edition',
  'volumen': 'volume',
  'página': 'page',
  'páginas': 'pages',
  'idioma': 'language',
  'capítulo': 'chapter',
  'cita': 'quote',
});

const parsers$K = {
  'c w': citeWeb$D,
  'cita informe': citation$b,
  'cita informe técnico': citation$b,
  'cita libro': citeBook$z,
  'cita publicación': citeJournal$p,
  'cita revista': citeJournal$p,
  'cita web': citeWeb$D,
  'cita website': citeWeb$D,
  'cita-web': citeWeb$D,
  'citado en web': citeWeb$D,
  'citalibro': citeBook$z,
  'citar jornal': citeJournal$p,
  'citar libro': citeBook$z,
  'citar patente': citation$b,
  'citar publicación': citeJournal$p,
  'citar web': citeWeb$D,
  'citaweb': citeWeb$D,
  'cite iucn': citeBook$z,
  'cite magazine': citeJournal$p,
  'cite new': citeWeb$D,
  'cite paper': citeJournal$p,
  'cite report': citation$b,
  'cite website': citeWeb$D,
  'cite-web': citeWeb$D,
  'citeweb': citeWeb$D,
  'cw': citeWeb$D,
  'internetquelle': internetquelle$k,
  'lien web': citeWeb$D,
  'literatur': literatur$3,
  'obra citada': citation$b,
  'ouvrage': citeBook$z,
  'ref libro': citeBook$z,
  'ref-libro': citeBook$z,
  'ref-publicació': citeJournal$p,
  'ref-web': citeWeb$D,
  'web cite': citeWeb$D,
  'книга': citeBook$z,
};

const data$K = { aliases: aliases$K, infoboxes: infoboxes$K, parsers: parsers$K };

const plugin$L = (_models, templates, boxes) => register(data$K, templates, boxes);
plugin$L.lang = 'es';
plugin$L.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// estonian template names → the core template they resolve to
const aliases$J = {
  'algusaeg': 'start',
  'asukoht': 'coord',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonsi kategooria': 'commons cat',
  'commonskat': 'commons cat',
  'geokoordinaadid': 'coord',
  'koord': 'coord',
  'koordinaadid': 'coord',
  'peamine artikkel': 'main',
  'pikemalt': 'main',
  'pikemalt artiklis': 'main',
  'pisilipp': 'flag',
  'portaal': 'portal',
  'riigi ikoon': 'flagicon',
  'riigi lipp': 'flagicon',
  'riigiikoon': 'flagicon',
  'sünniaeg ja vanus': 'birth date and age',
  'süv': 'birth date and age',
  'vaata': 'main',
  'viited': 'reflist',
};

// names recognised as infoboxes
const infoboxes$J = [
  'taksonitabel',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$C = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});

const parsers$J = {
  'cite mailing list': citeWeb$C,
  'cite press release': citeWeb$C,
  'cite url': citeWeb$C,
  'citeweb': citeWeb$C,
};

const data$J = { aliases: aliases$J, infoboxes: infoboxes$J, parsers: parsers$J };

const plugin$K = (_models, templates, boxes) => register(data$J, templates, boxes);
plugin$K.lang = 'et';
plugin$K.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// basque template names → the core template they resolve to
const aliases$I = {
  'atari': 'portal',
  'banderaikur': 'flagicon',
  'cite aldizkari': 'cite journal',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'data': 'start',
  'erref zer': 'reflist',
  'erreferentzia zerrenda': 'reflist',
  'harvnp': 'sfn',
  'jaiotza data eta adina': 'birth date and age',
  'jp': 'nihongo',
  'koord': 'coord',
  'nagusia': 'main',
  'txikipedia-banderaikur': 'flagicon',
  'txikipedia-commonskat': 'commons cat',
  'txikipedia-data': 'start',
  'txikipedia-erreferentzia zerrenda': 'reflist',
};

// names recognised as infoboxes
const infoboxes$I = [
  'taxotaula',
  'taxotaula automatikoa',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citation$a = translate('citation', {
  'izenburua': 'title',
  'urtea': 'year',
  'abizena': 'last',
  'author1-last': 'last',
  'author-last': 'last',
  'surname1': 'last',
  'author-last1': 'last',
  'subject1': 'last',
  'surname': 'last',
  'subject': 'last',
  'abizena1': 'last1',
  'egilea1': 'author1',
  'egilea': 'author',
  'izena1': 'first1',
  'izena': 'first',
  'data': 'date',
  'kazeta': 'journal',
  'aldizkakoa': 'journal',
  'egunkaria': 'newspaper',
  'aldizkaria': 'journal',
  'lana': 'work',
  'liburukia': 'volume',
  'alea': 'issue',
  'orrialdeak': 'pages',
  'orrialdea': 'page',
  'atala': 'chapter',
  'edizioa': 'edition',
  'argitaratze-lekua': 'location',
  'argitaletxea': 'publisher',
});

const parsers$I = {
  'albiste erref': citation$a,
  'cite news': citation$a,
  'erreferentzia': citation$a,
  'liburu erref': citation$a,
  'txikipedia-erreferentzia': citation$a,
  'web erref': citation$a,
};

const data$I = { aliases: aliases$I, infoboxes: infoboxes$I, parsers: parsers$I };

const plugin$J = (_models, templates, boxes) => register(data$I, templates, boxes);
plugin$J.lang = 'eu';
plugin$J.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// persian template names → the core template they resolve to
const aliases$H = {
  'ap': 'main',
  'birthdate and age': 'birth date and age',
  'birthdateandage': 'birth date and age',
  'book cite': 'cite book',
  'book reference': 'cite book',
  'book reference 2': 'cite book',
  'book reference url': 'cite book',
  'c book': 'cite book',
  'c web': 'cite web',
  'cc': 'commons cat',
  'chú thích web': 'cite web',
  'cit book': 'cite book',
  'cit web': 'cite web',
  'cita libro': 'cite book',
  'citace elektronické monografie': 'cite web',
  'citace monografie': 'cite book',
  'citar livro': 'cite book',
  'citat web': 'cite web',
  'citaweb': 'cite web',
  'cite blog': 'cite web',
  'cite book/archive 1': 'cite book',
  'cite book/archive 2': 'cite book',
  'cite book/archive 3': 'cite book',
  'cite book/archive 4': 'cite book',
  'cite book/archive 6': 'cite book',
  'cite book/archive 7': 'cite book',
  'cite book/archive 8': 'cite book',
  'cite book/archive index': 'cite book',
  'cite book/lua': 'cite book',
  'cite books': 'cite book',
  'cite chapter': 'cite book',
  'cite ebook': 'cite book',
  'cite page': 'cite book',
  'cite score': 'cite book',
  'cite url': 'cite web',
  'cite w': 'cite web',
  'cite wb': 'cite web',
  'cite we': 'cite web',
  'cite web.': 'cite web',
  'cite web/german': 'cite web',
  'cite web/lua': 'cite web',
  'cite webpage': 'cite web',
  'cite website': 'cite web',
  'cite website article': 'cite web',
  'cite work': 'cite book',
  'cite-book': 'cite book',
  'cite-web': 'cite web',
  'citebook': 'cite book',
  'citeer boek': 'cite book',
  'citeweb': 'cite web',
  'citweb': 'cite web',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor title d': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'cw': 'cite web',
  'date of birth and age': 'birth date and age',
  'flag icon': 'flagicon',
  'flags': 'flagicon',
  'footnote': 'reflist',
  'foundation date': 'start',
  'hf': 'sfn',
  'initial release': 'start',
  'listaref': 'reflist',
  'location': 'coord',
  'mainarticle': 'main',
  'mokhtasat': 'coord',
  'navedi splet': 'cite web',
  'odn': 'sfn',
  'ouvrage': 'cite book',
  'portal box': 'portal',
  'portalbox': 'portal',
  'portalpar': 'portal',
  'ref-llibre': 'cite book',
  'références': 'reflist',
  'sf': 'sfn',
  'shortened footnote': 'sfn',
  'shortened footnote template': 'sfn',
  'snf': 'sfn',
  'startdate': 'start',
  'web citation': 'cite web',
  'web cite': 'cite web',
  'web kaynağı': 'cite web',
  'web link': 'cite web',
  'web reference': 'cite web',
  'web-reference': 'cite web',
  'weblink': 'cite web',
  'آوا': 'ipa',
  'آیکون پرچم': 'flagicon',
  'آی‌پی‌ای': 'ipa',
  'ارجاع کتاب': 'cite book',
  'اصلی': 'main',
  'انبار رده': 'commons cat',
  'انبار-رده': 'commons cat',
  'تاریخ آغاز': 'start',
  'تاریخ تولد و سن': 'birth date and age',
  'تاریخ شروع': 'start',
  'تولد و سن': 'birth date and age',
  'جعبه درگاه': 'portal',
  'جعبه کاربر/جدید/مختصات‌دهی': 'coord',
  'درگاه': 'portal',
  'رده انبار': 'commons cat',
  'رده-انبار': 'commons cat',
  'ریزه میزه': 'small',
  'شابک': 'isbn',
  'شابک2': 'isbn',
  'شابک۲': 'isbn',
  'طول جغرافیایی': 'coord',
  'عرض جغرافیایی': 'coord',
  'لوکیشن': 'coord',
  'مختصات': 'coord',
  'مختصات‌دهی': 'coord',
  'مراجع': 'reflist',
  'مرجع ویب': 'cite web',
  'مقاله اصلی': 'main',
  'منابع': 'reflist',
  'نوشتار اصلی': 'main',
  'نیهونگو': 'nihongo',
  'ویکی انبار-رده': 'commons cat',
  'ویکی‌انبار رده': 'commons cat',
  'ویکی‌انبار-رده': 'commons cat',
  'پانویس': 'reflist',
  'پانویس ۲': 'reflist',
  'پانویس۲': 'reflist',
  'پانویس‌ها': 'reflist',
  'پرچم': 'flag',
  'پرچمک': 'flagicon',
  'پرچم‌ها': 'flagicon',
  'پورتال': 'portal',
  'پی‌نوشت': 'reflist',
  'کاربر جدید/مختصات‌دهی': 'coord',
  '서적 인용': 'cite book',
  '웹 인용': 'cite web',
};

// names recognised as infoboxes
const infoboxes$H = [
  'جعبه آرایه زیستی',
  'جعبه اطلاعات آرایه زیستی',
  'جعبه زیست',
  'زیسترده',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$o = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const internetquelle$j = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
});

const parsers$H = {
  'cita publicación': citeJournal$o,
  'citation journal': citeJournal$o,
  'cite magazine article': citeJournal$o,
  'cite paper': citeJournal$o,
  'citejournal': citeJournal$o,
  'citepaper': citeJournal$o,
  'internetquelle': internetquelle$j,
};

const data$H = { aliases: aliases$H, infoboxes: infoboxes$H, parsers: parsers$H };

const plugin$I = (_models, templates, boxes) => register(data$H, templates, boxes);
plugin$I.lang = 'fa';
plugin$I.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// finnish template names → the core template they resolve to
const aliases$G = {
  'aloituspäivämäärä': 'start',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor d': 'coord',
  'japonais': 'nihongo',
  'koordinaatit': 'coord',
  'lippu': 'flag',
  'lippukuva': 'flagicon',
  'muotoilenro': 'formatnum',
  'pääartikkeli': 'main',
  'pääartikkelit': 'main',
  'refs': 'reflist',
  'syntymäaika ja ikä': 'birth date and age',
  'teemasivu': 'portal',
  'viitteet': 'reflist',
};

// names recognised as infoboxes
const infoboxes$G = [
  'taksonomia',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$n = translate('cite journal', {
  'tekijä': 'author',
  'vauthors': 'author',
  'sukunimi': 'last',
  'etunimi': 'first',
  'otsikko': 'title',
  'nimeke': 'title',
  'nimike': 'title',
  'julkaisu': 'journal',
  'ajankohta': 'year',
  'vuosi': 'year',
  'vuosikerta': 'volume',
  'numero': 'issue',
  'sivut': 'pages',
  'julkaisupaikka': 'location',
  'julkaisija': 'publisher',
  'agency': 'publisher',
  'www': 'url',
  'osoite': 'url',
  'arkisto': 'archive-url',
  'archiveurl': 'archive-url',
  'arkistoitu': 'archive-date',
  'archivedate': 'archive-date',
  'kieli': 'language',
});
const citeWeb$B = translate('cite web', {
  'osoite': 'url',
  'nimeke': 'title',
  'nimike': 'title',
  'otsikko': 'title',
  'julkaisu': 'work',
  'sivusto': 'work',
  'site': 'work',
  'julkaisija': 'publisher',
  'viitattu': 'access-date',
  'luettu': 'access-date',
  'accessdate': 'access-date',
  'tekijä': 'author',
  'ajankohta': 'date',
  'vuosi': 'date',
  'kieli': 'language',
  'lainaus': 'quote',
  'arkisto': 'archive-url',
  'archiveurl': 'archive-url',
  'arkistoitu': 'archive-date',
  'archivedate': 'archive-date',
});
const citeBook$y = translate('cite book', {
  'tekijä': 'author',
  'vauthors': 'author',
  'sukunimi': 'last',
  'etunimi': 'first',
  'luku': 'chapter',
  'kappale': 'chapter',
  'nimeke': 'title',
  'nimike': 'title',
  'sivut': 'pages',
  'sivu': 'page',
  'julkaisupaikka': 'location',
  'julkaisija': 'publisher',
  'vuosi': 'date',
  'publication-date': 'date',
  'osa': 'volume',
  'painos': 'edition',
  'www': 'url',
  'kieli': 'language',
});

const parsers$G = {
  'cite magazine': citeJournal$n,
  'citeweb': citeWeb$B,
  'kirjaviite': citeBook$y,
  'lehtiviite': citeJournal$n,
  'verkkoviite': citeWeb$B,
};

const data$G = { aliases: aliases$G, infoboxes: infoboxes$G, parsers: parsers$G };

const plugin$H = (_models, templates, boxes) => register(data$G, templates, boxes);
plugin$H.lang = 'fi';
plugin$H.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// french template names → the core template they resolve to
const aliases$F = {
  'affiche nombre': 'formatnum',
  'api': 'ipa',
  'article détaillé': 'main',
  'bandera': 'flagicon',
  'bandiera': 'flagicon',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coord2': 'coord',
  'date de naissance': 'birth date and age',
  'date de naissance-': 'birth date and age',
  'date début': 'start',
  'date naissance': 'birth date and age',
  'drapeau': 'flagicon',
  'détail': 'main',
  'détails': 'main',
  'japonais': 'nihongo',
  'loupe': 'main',
  'pays': 'flag',
  'petit': 'small',
  'phon': 'ipa',
  'phonétique': 'ipa',
  'portail': 'portal',
  'references': 'reflist',
  'références': 'reflist',
  'voir': 'main',
};

const infoboxes$F = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$m = translate('cite journal', {
  'langue': 'language',
  'lang': 'language',
  'lien langue': 'language',
  'auteur1': 'author',
  'auteur': 'author',
  'prénom1': 'first',
  'prénom': 'first',
  'nom1': 'last',
  'nom': 'last',
  'titre': 'title',
  'périodique': 'journal',
  'revue': 'journal',
  'vol': 'volume',
  'tome': 'volume',
  'numéro': 'issue',
  'no': 'issue',
  'lieu': 'location',
  'lieu édition': 'location',
  'éditeur': 'publisher',
  'année': 'year',
  'isbn1': 'isbn',
  'issn1': 'issn',
  'lire en ligne': 'url',
  'url texte': 'url',
  'texte': 'url',
  'consulté le': 'access-date',
  'accessdate': 'access-date',
  'p.': 'pages',
  'pp.': 'pages',
  'passage': 'pages',
  'extrait': 'quote',
  'citation': 'quote',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeWeb$A = translate('cite web', {
  'langue': 'language',
  'lang': 'language',
  'lien langue': 'language',
  'en ligne le': 'date',
  'en ligne': 'date',
  'nom': 'last',
  'nom1': 'last',
  'prénom': 'first',
  'prénom1': 'first',
  'auteur': 'author',
  'auteurs': 'author',
  'auteur1': 'author',
  'titre': 'title',
  'url texte': 'url',
  'lire en ligne': 'url',
  'lien': 'url',
  'série': 'work',
  'site': 'website',
  'lieu': 'location',
  'lieu édition': 'location',
  'éditeur': 'publisher',
  'editeur': 'publisher',
  'année': 'year',
  'consulté le': 'access-date',
  'accessdate': 'access-date',
  'consulté': 'access-date',
  'consultée le': 'access-date',
  'extrait': 'quote',
  'citation': 'quote',
  'passage': 'pages',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeBook$x = translate('cite book', {
  'langue': 'language',
  'lang': 'language',
  'lien langue': 'language',
  'prénom1': 'first',
  'prénom': 'first',
  'nom1': 'last',
  'nom': 'last',
  'auteurs': 'last',
  'auteur1': 'author',
  'auteur': 'author',
  'titre': 'title',
  'vol': 'volume',
  'passage': 'page',
  'lieu': 'location',
  'éditeur': 'publisher',
  'editeur': 'publisher',
  'édition': 'publisher',
  'numéro dans collection': 'issue',
  'numéro dans la collection': 'issue',
  'année': 'year',
  'pages totales': 'pages',
  'isbn1': 'isbn',
  'issn1': 'issn',
  'lire en ligne': 'url',
  'url texte': 'url',
  'texte': 'url',
  'consulté le': 'access-date',
  'accessdate': 'access-date',
  'consulté': 'access-date',
  'consultée le': 'access-date',
  'titre chapitre': 'chapter',
  'chapitre': 'chapter',
  'chap': 'chapter',
  'titrechap': 'chapter',
  'extrait': 'quote',
  'citation': 'quote',
});
const literatur$2 = translate('cite book', {
  'titel': 'title',
  'autor': 'author',
  'verlag': 'publisher',
  'jahr': 'year',
  'ort': 'location',
  'seiten': 'pages',
  'sammelwerk': 'journal',
  'band': 'volume',
  'nummer': 'issue',
  'auflage': 'edition',
  'hrsg': 'editor',
  'sprache': 'language',
  'datum': 'date',
  'online': 'url',
  'langue': 'language',
  'lang': 'language',
  'lien langue': 'language',
  'prénom1': 'first',
  'prénom': 'first',
  'nom1': 'last',
  'nom': 'last',
  'auteurs': 'last',
  'auteur1': 'author',
  'auteur': 'author',
  'titre': 'title',
  'vol': 'volume',
  'passage': 'page',
  'lieu': 'location',
  'éditeur': 'publisher',
  'editeur': 'publisher',
  'édition': 'publisher',
  'numéro dans collection': 'issue',
  'numéro dans la collection': 'issue',
  'année': 'year',
  'pages totales': 'pages',
  'isbn1': 'isbn',
  'issn1': 'issn',
  'lire en ligne': 'url',
  'url texte': 'url',
  'texte': 'url',
  'consulté le': 'access-date',
  'accessdate': 'access-date',
  'consulté': 'access-date',
  'consultée le': 'access-date',
  'titre chapitre': 'chapter',
  'chapitre': 'chapter',
  'chap': 'chapter',
  'titrechap': 'chapter',
  'extrait': 'quote',
  'citation': 'quote',
});

const parsers$F = {
  'article': citeJournal$m,
  'cita noticia': citeJournal$m,
  'cita web': citeWeb$A,
  'citar web': citeWeb$A,
  'cite iucn': citeBook$x,
  'cite magazine': citeJournal$m,
  'cite pr': citeWeb$A,
  'cite press release': citeWeb$A,
  'citeweb': citeWeb$A,
  'cytuj stronę': citeWeb$A,
  'lien news': citeJournal$m,
  'lien web': citeWeb$A,
  'lienweb': citeWeb$A,
  'literatur': literatur$2,
  'ouvrage': citeBook$x,
  'périodique': citeJournal$m,
  'référence web': citeWeb$A,
  'site web': citeWeb$A,
};

const data$F = { aliases: aliases$F, infoboxes: infoboxes$F, parsers: parsers$F };

const plugin$G = (_models, templates, boxes) => register(data$F, templates, boxes);
plugin$G.lang = 'fr';
plugin$G.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// galician template names → the core template they resolve to
const aliases$E = {
  'afi': 'ipa',
  'ap': 'main',
  'artigo principal': 'main',
  'bandeira': 'flag',
  'bandeira2': 'flag',
  'cita publicación': 'cite journal',
  'cita publicación periódica': 'cite journal',
  'cita revista': 'cite journal',
  'cite magazine': 'cite journal',
  'commonscat': 'commons cat',
  'commonscategoría': 'commons cat',
  'coordenadas': 'coord',
  'harvnp': 'sfn',
  'listaref': 'reflist',
  'nota curta': 'sfn',
  'obra citada': 'citation',
  'pequeno': 'small',
  'principal': 'main',
  'referencias': 'reflist',
  'ver artigo principal': 'main',
};

const infoboxes$E = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$w = translate('cite book', {
  'apelidos-editor': 'editor',
  'apelidos-editor1': 'editor',
  'volumen': 'volume',
  'páxina': 'page',
  'p': 'page',
  'página': 'page',
});
const citeWeb$z = translate('cite web', {
  'apelidos-editor': 'editor',
  'apelidos-editor1': 'editor',
});
const internetquelle$i = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'apelidos-editor': 'editor',
  'apelidos-editor1': 'editor',
});

const parsers$E = {
  'cita libro': citeBook$w,
  'cita web': citeWeb$z,
  'citar libro': citeBook$w,
  'citar web': citeWeb$z,
  'citaweb': citeWeb$z,
  'internetquelle': internetquelle$i,
  'lien web': citeWeb$z,
};

const data$E = { aliases: aliases$E, infoboxes: infoboxes$E, parsers: parsers$E };

const plugin$F = (_models, templates, boxes) => register(data$E, templates, boxes);
plugin$F.lang = 'gl';
plugin$F.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// hebrew template names → the core template they resolve to
const aliases$D = {
  'cite magazine': 'cite journal',
  'cite paper': 'cite journal',
  'commonscat': 'commons cat',
  'דגל': 'flag',
  'הערות שוליים': 'reflist',
  'הפניה לערך מורחב': 'main',
  'יפא': 'ipa',
  'מסת"ב': 'isbn',
  'סימוכין': 'reflist',
  'ערך מורחב': 'main',
  'ערכים מורחבים': 'main',
  'קישורי פורטל': 'portal',
  'תאריך התחלה': 'start',
};

// names recognised as infoboxes
const infoboxes$D = [
  'מיון',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$y = translate('cite web', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'people': 'authors',
  'host': 'authors',
});

const parsers$D = {
  'citeweb': citeWeb$y,
};

const data$D = { aliases: aliases$D, infoboxes: infoboxes$D, parsers: parsers$D };

const plugin$E = (_models, templates, boxes) => register(data$D, templates, boxes);
plugin$E.lang = 'he';
plugin$E.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// hindi template names → the core template they resolve to
const aliases$C = {
  'birthdate and age': 'birth date and age',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'coor at d': 'coord',
  'coor at dm': 'coord',
  'coor at dms': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'coords': 'coord',
  'flag icon': 'flagicon',
  'initial release': 'start',
  'initial-release': 'start',
  'location': 'coord',
  'location dec': 'coord',
  'mainarticle': 'main',
  'portal/doc': 'portal',
  'see main': 'main',
  'seemain': 'main',
  'sf': 'sfn',
  'startdate': 'start',
  'अ-ध्व-लि': 'ipa',
  'कॉमन्स': 'commons cat',
  'कॉमन्स श्रेणी': 'commons cat',
  'छोटा': 'small',
  'जन्म तिथि एवं आयु': 'birth date and age',
  'टिप्पणी सूची': 'reflist',
  'टिप्पणीसूची': 'reflist',
  'टिसू': 'reflist',
  'देश पताका': 'flagicon',
  'देशपताका': 'flagicon',
  'निर्देशांक': 'coord',
  'पताका': 'flag',
  'पताकाचिन्ह': 'flagicon',
  'प्रवॆशद्वार': 'portal',
  'प्रवेशद्वार': 'portal',
  'प्रारंभ तिथि': 'start',
  'मुख्य': 'main',
  'रेफलिस्ट': 'reflist',
  'रेफ़्लिस्ट': 'reflist',
  'संसूची': 'reflist',
  'सन्दर्भ': 'reflist',
  'सूत्र सूची': 'reflist',
};

// names recognised as infoboxes
const infoboxes$C = [
  'टैक्सोबॉक्स',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$x = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const citeJournal$l = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citation$9 = translate('citation', {
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'number': 'issue',
  'place': 'location',
  'accessdate': 'access-date',
  'archivedate': 'archive-date',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'editors': 'editor',
});
const citeBook$v = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});

const parsers$C = {
  'cite blog': citeWeb$x,
  'cite website': citeWeb$x,
  'cite-web': citeWeb$x,
  'citejournal': citeJournal$l,
  'web cite': citeWeb$x,
  'web kaynağı': citeWeb$x,
  'उद्धरण': citation$9,
  'उद्धृत अंतर्जाल': citeWeb$x,
  'जर्नल सन्दर्भ': citeJournal$l,
  'पुस्तक सन्दर्भ': citeBook$v,
  'वेब संदर्भ': citeWeb$x,
  'वेब सन्दर्भ': citeWeb$x,
  'संदर्भ': citation$9,
};

const data$C = { aliases: aliases$C, infoboxes: infoboxes$C, parsers: parsers$C };

const plugin$D = (_models, templates, boxes) => register(data$C, templates, boxes);
plugin$D.lang = 'hi';
plugin$D.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// croatian template names → the core template they resolve to
const aliases$B = {
  'citiranje': 'citation',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'datum rođenja i godine': 'birth date and age',
  'dz': 'flagicon',
  'dz+x': 'flag',
  'glavni': 'main',
  'izvori': 'reflist',
  'koordinate': 'coord',
  'malo': 'small',
  'z+x': 'flag',
  'zd': 'flagicon',
  'zd+x': 'flag',
  'zd+x/a': 'flag',
  'zd+x/b': 'flag',
  'zd+x/c': 'flag',
  'zd+x/d': 'flag',
  'zd+x/e': 'flag',
  'zd+x/f': 'flag',
  'zd+x/g': 'flag',
  'zd+x/h': 'flag',
  'zd+x/hž': 'flag',
  'zd+x/i': 'flag',
  'zd+x/j': 'flag',
  'zd+x/k': 'flag',
  'zd+x/l': 'flag',
  'zd+x/m': 'flag',
  'zd+x/n': 'flag',
  'zd+x/o': 'flag',
  'zd+x/p': 'flag',
  'zd+x/q': 'flag',
  'zd+x/r': 'flag',
  'zd+x/s': 'flag',
  'zd+x/t': 'flag',
  'zd+x/u': 'flag',
  'zd+x/v': 'flag',
  'zd+x/w': 'flag',
  'zd+x/y': 'flag',
  'zd+x/z': 'flag',
  'zd+x/č': 'flag',
  'zd+x/đ': 'flag',
  'zd+x/š': 'flag',
  'zd+x/ž': 'flag',
};

// names recognised as infoboxes
const infoboxes$B = [
  'taksokvir',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$u = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'autor': 'author',
  'autor1': 'author',
  'autor1-prezime': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'autor1-ime': 'first',
  'dan': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'časopis': 'website',
  'novine': 'website',
  'web_stranica': 'website',
  'rad': 'website',
  'institution': 'publisher',
  'godina': 'year',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'urednik': 'editor',
  'urednik1': 'editor',
  'urednik1-prezime': 'editor',
  'izdanje': 'edition',
  'svezak': 'volume',
  'tom': 'volume',
  'place': 'location',
  'mjesto': 'location',
  'lokacija': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'poglavlje': 'chapter',
  'članak': 'chapter',
  'cjelina': 'chapter',
  'odjeljak': 'chapter',
  'quotation': 'quote',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'sveščić': 'issue',
  'broj': 'issue',
  'people': 'authors',
  'host': 'authors',
});
const citeWeb$w = translate('cite web', {
  'naslov': 'title',
  'dan': 'date',
  'datum': 'date',
  'accessdate': 'access-date',
  'preuzeto': 'access-date',
  'pristupljeno': 'access-date',
  'datum-pristupanja': 'access-date',
  'rad': 'website',
  'izdavač': 'publisher',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'autor': 'author',
  'autor1': 'author',
  'autor1-prezime': 'author',
  'autor-prezime': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'autor1-ime': 'first',
  'autor-ime': 'first',
  'godina': 'year',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'urednik': 'editor',
  'urednik1-prezime': 'editor',
  'place': 'location',
  'mjesto': 'location',
  'lokacija': 'location',
  'stranica': 'page',
  'stranice': 'pages',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'datum-arhiviranja': 'archive-date',
  'izdanje': 'edition',
  'people': 'authors',
  'host': 'authors',
  'autori': 'authors',
});
const citeJournal$k = translate('cite journal', {
  'naslov': 'title',
  'prezime': 'author',
  'prezime1': 'author',
  'ime': 'first',
  'ime1': 'first',
  'datum': 'date',
  'časopis': 'journal',
  'nakladnik': 'publisher',
  'izdavač': 'publisher',
  'izdanje': 'edition',
  'godina': 'year',
  'godište': 'year',
  'mjesto': 'location',
  'mjesto-objave': 'location',
  'svezak': 'volume',
  'tom': 'volume',
  'str': 'page',
  'stranica': 'page',
  'jezik': 'language',
  'citat': 'quote',
  'poglavlje': 'chapter',
  'glava': 'chapter',
});

const parsers$B = {
  'bokref': citeBook$u,
  'cite manual': citeBook$u,
  'citebook': citeBook$u,
  'citiraj knjigu': citeBook$u,
  'citiranje knjige': citeBook$u,
  'citiranje knjige/1': citeBook$u,
  'citiranje weba': citeWeb$w,
  'citiranje weba/1': citeWeb$w,
  'citiranje www': citeWeb$w,
  'citiranje časopisa': citeJournal$k,
  'citiranje časopisa/1': citeJournal$k,
  'tidskriftsref': citeJournal$k,
  'webbref': citeWeb$w,
};

const data$B = { aliases: aliases$B, infoboxes: infoboxes$B, parsers: parsers$B };

const plugin$C = (_models, templates, boxes) => register(data$B, templates, boxes);
plugin$C.lang = 'hr';
plugin$C.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// hungarian template names → the core template they resolve to
const aliases$A = {
  'bővebben': 'main',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'coor d': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'fő': 'main',
  'főcikk': 'main',
  'főszócikk': 'main',
  'kategóriaszócikk': 'main',
  'katsz': 'main',
  'koord': 'coord',
  'közvagyonkat': 'commons cat',
  'portál': 'portal',
  'refs': 'reflist',
  'szám': 'formatnum',
  'zászló': 'flag',
  'zászlóikon': 'flagicon',
  'életkor-élő-dátummal': 'birth date and age',
};

// names recognised as infoboxes
const infoboxes$A = [
  'taxobox szerkesztése',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$t = translate('cite book', {
  'pp': 'pages',
});
const citeJournal$j = translate('cite journal', {
  'pp': 'pages',
});
const citeWeb$v = translate('cite web', {
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const internetquelle$h = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$A = {
  'cite chapter': citeBook$t,
  'cite paper': citeJournal$j,
  'cite-web': citeWeb$v,
  'citeweb': citeWeb$v,
  'internetquelle': internetquelle$h,
  'web cite': citeWeb$v,
  'weblap hivatkozás': citeWeb$v,
};

const data$A = { aliases: aliases$A, infoboxes: infoboxes$A, parsers: parsers$A };

const plugin$B = (_models, templates, boxes) => register(data$A, templates, boxes);
plugin$B.lang = 'hu';
plugin$B.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// armenian template names → the core template they resolve to
const aliases$z = {
  'coord-nocat': 'coord',
  'cytuj pismo': 'cite journal',
  'ipa1': 'ipa',
  'portal bar': 'portal',
  'refs': 'reflist',
  'примечания': 'reflist',
  'աղբյուր': 'reflist',
  'աղբյուրներ': 'reflist',
  'գլխավորը': 'main',
  'դրոշ': 'flag',
  'ծանոթագրություններ': 'reflist',
  'ծանցանկ': 'reflist',
  'ծատ': 'birth date and age',
  'ծննդյան ամսաթիվ և տարիք': 'birth date and age',
  'կոորդ': 'coord',
  'կոորդինատներ': 'coord',
  'հիմնական': 'main',
  'հիմնական հոդված': 'main',
  'հիմնական հոդված2': 'main',
  'նիհոնգո': 'nihongo',
  'պորտալ': 'portal',
  'փոքր': 'small',
};

// names recognised as infoboxes
const infoboxes$z = [
  'տաքսոտուփ',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$u = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeBook$s = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
});
const internetquelle$g = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$z = {
  'cita web': citeWeb$u,
  'citar web': citeWeb$u,
  'citeweb': citeWeb$u,
  'cw': citeWeb$u,
  'cytuj książkę': citeBook$s,
  'cytuj stronę': citeWeb$u,
  'internetquelle': internetquelle$g,
  'lien web': citeWeb$u,
  'ouvrage': citeBook$s,
  '웹 인용': citeWeb$u,
};

const data$z = { aliases: aliases$z, infoboxes: infoboxes$z, parsers: parsers$z };

const plugin$A = (_models, templates, boxes) => register(data$z, templates, boxes);
plugin$A.lang = 'hy';
plugin$A.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// indonesian template names → the core template they resolve to
const aliases$y = {
  'artikel': 'main',
  'bandera': 'flagicon',
  'bandiera': 'flagicon',
  'bendera': 'flag',
  'birthdate and age': 'birth date and age',
  'birthdateandage': 'birth date and age',
  'cc': 'commons cat',
  'cite study': 'citation',
  'commons category': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'coor at d': 'coord',
  'coor at dm': 'coord',
  'coor at dms': 'coord',
  'coor d': 'coord',
  'coor dm id': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'coord-small': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'coorheader': 'coord',
  'daftar referensi': 'reflist',
  'daftarref': 'reflist',
  'date of birth': 'birth date and age',
  'flag icon': 'flagicon',
  'flag2': 'flag',
  'footnotes': 'reflist',
  'geobox coor': 'coord',
  'initial release': 'start',
  'initial-release': 'start',
  'kategori commons': 'commons cat',
  'kecil': 'small',
  'launch date': 'start',
  'listaref': 'reflist',
  'main articles': 'main',
  'main page': 'main',
  'nl-vlag': 'flag',
  'portal box': 'portal',
  'portalbox': 'portal',
  'portalpar': 'portal',
  'ref-list': 'reflist',
  'reference list': 'reflist',
  'references': 'reflist',
  'refs': 'reflist',
  'rflist': 'reflist',
  'sf': 'sfn',
  'snf': 'sfn',
  'start year': 'start',
  'startdate': 'start',
  'tanggal lahir dan umur': 'birth date and age',
  'tanggal mulai': 'start',
  'utama': 'main',
  'wikiportal': 'portal',
};

// names recognised as infoboxes
const infoboxes$y = [
  'kotaktaksonomi',
  'kotaktaksonomi bagian binomial',
  'kotaktaksonomi phylum entry',
  'kotaktaksonomi subclassis entry',
  'kotaktaksonomi subfamilia entry',
  'kotaktaksonomi subordo entry',
  'taxobox begin',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$r = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const citeWeb$t = translate('cite web', {
  'accessdate': 'access-date',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeJournal$i = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const internetquelle$f = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$y = {
  'book reference': citeBook$r,
  'buku kutipan': citeBook$r,
  'chú thích web': citeWeb$t,
  'cita web': citeWeb$t,
  'citar livro': citeBook$r,
  'citar web': citeWeb$t,
  'citation journal': citeJournal$i,
  'cite blog': citeWeb$t,
  'cite buku': citeBook$r,
  'cite magazine article': citeJournal$i,
  'cite url': citeWeb$t,
  'cite web.': citeWeb$t,
  'cite webpage': citeWeb$t,
  'cite website': citeWeb$t,
  'cite work': citeBook$r,
  'cite-web': citeWeb$t,
  'citebook': citeBook$r,
  'citejournal': citeJournal$i,
  'citeweb': citeWeb$t,
  'internetquelle': internetquelle$f,
  'kutip buku': citeBook$r,
  'kutip web': citeWeb$t,
  'kutipan buku': citeBook$r,
  'kutipan web': citeWeb$t,
  'memetik web': citeWeb$t,
  'mengutip web': citeWeb$t,
  'referensi buku': citeBook$r,
  'referensi web': citeWeb$t,
  'tidskriftsref': citeJournal$i,
  'web': citeWeb$t,
  'web cite': citeWeb$t,
  'web reference': citeWeb$t,
};

const data$y = { aliases: aliases$y, infoboxes: infoboxes$y, parsers: parsers$y };

const plugin$z = (_models, templates, boxes) => register(data$y, templates, boxes);
plugin$z.lang = 'id';
plugin$z.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// italian template names → the core template they resolve to
const aliases$x = {
  'bandiera': 'flagicon',
  'calcola età': 'birth date and age',
  'commons cat left': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat left': 'commons cat',
  'piccolo': 'small',
  'portale': 'portal',
  'portali': 'portal',
  'references': 'reflist',
  'release date': 'start',
};

// names recognised as infoboxes
const infoboxes$x = [
  'tassobox',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$q = translate('cite book', {
  'nome': 'first1',
  'first name': 'first1',
  'nome1': 'first1',
  'cognome': 'last1',
  'last name': 'last1',
  'cognome1': 'last1',
  'titolo': 'title',
  'edizione': 'edition',
  'data': 'date',
  'anno': 'year',
  'editore': 'publisher',
  'lingua': 'language',
  'p': 'page',
  'pagina': 'page',
  'pp': 'pages',
  'pagine': 'pages',
});
const citeJournal$h = translate('cite journal', {
  'autore': 'author',
  'data': 'date',
  'anno': 'year',
  'titolo': 'title',
  'rivista': 'journal',
  'editore': 'publisher',
  'p': 'page',
  'pp': 'pages',
  'lingua': 'language',
});
const citeWeb$s = translate('cite web', {
  'autore': 'author',
  'titolo': 'title',
  'p': 'page',
  'data': 'date',
});
const citation$8 = translate('citation', {
  'vol': 'volume',
});

const parsers$x = {
  'cita libro': citeBook$q,
  'cita periodico': citeJournal$h,
  'cita pubblicazione': citeJournal$h,
  'cita rivista': citeJournal$h,
  'cita sito': citeWeb$s,
  'cita testo': citation$8,
  'cita web': citeWeb$s,
  'cw': citeWeb$s,
  'lien web': citeWeb$s,
};

const data$x = { aliases: aliases$x, infoboxes: infoboxes$x, parsers: parsers$x };

const plugin$y = (_models, templates, boxes) => register(data$x, templates, boxes);
plugin$y.lang = 'it';
plugin$y.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// japanese template names → the core template they resolve to
const aliases$w = {
  'alter': 'birth date and age',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor d': 'coord',
  'coord2': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country flagcountry': 'flagicon',
  'country flagicon2': 'flagicon',
  'flag icon': 'flagicon',
  'flag2': 'flag',
  'initial release': 'start',
  'isbn2': 'isbn',
  'location': 'coord',
  'location dec': 'coord',
  'mainarticle': 'main',
  'more': 'main',
  'personendaten': 'persondata',
  'portalbox': 'portal',
  'portalpar': 'portal',
  'refls': 'reflist',
  'refs': 'reflist',
  'sma': 'small',
  'startdate': 'start',
  'wikiportal': 'portal',
  'ウィキポータルリンク': 'portal',
  'ウィキ座標1段度分秒': 'coord',
  'ウィキ座標2段度分秒': 'coord',
  'ウィキ座標世界': 'coord',
  'ウィキ座標度': 'coord',
  'ウィキ座標度分': 'coord',
  'ウィキ座標度分秒': 'coord',
  'コモンズカテゴリ': 'commons cat',
  '位置情報度分秒': 'coord',
  '旗': 'flag',
  '本文': 'main',
  '生年月日と年齢': 'birth date and age',
  '脚注リスト': 'reflist',
  '詳細記事': 'main',
};

// names recognised as infoboxes
const infoboxes$w = [
  '生物分類表',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$r = translate('cite web', {
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeBook$p = translate('cite book', {
  'surname': 'last',
  'surname1': 'last',
  'given': 'first',
  'given1': 'first',
  'editors': 'editor',
  'editor1': 'editor',
  'at': 'page',
  'contribution': 'chapter',
  'number': 'issue',
  'place': 'location',
  'publication-place': 'location',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeJournal$g = translate('cite journal', {
  'surname': 'last',
  'surname1': 'last',
  'given': 'first',
  'given1': 'first',
  'editor1': 'editor',
  'editors': 'editor',
  'number': 'issue',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citation$7 = translate('citation', {
  'surname': 'last',
  'surname1': 'last',
  'given': 'first',
  'given1': 'first',
  'editor1': 'editor',
  'contribution': 'chapter',
  'periodical': 'work',
  'place': 'location',
  'publication-place': 'location',
  'number': 'issue',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const internetquelle$e = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$w = {
  'cite blog': citeWeb$r,
  'cite book/draft/cite book': citeBook$p,
  'cite magazine': citeJournal$g,
  'cite manual': citeBook$p,
  'cite paper': citeJournal$g,
  'cite study': citation$7,
  'cite url': citeWeb$r,
  'cite web/german': citeWeb$r,
  'cite web/和書': citeWeb$r,
  'cite website': citeWeb$r,
  'cite work': citeBook$p,
  'cite-web': citeWeb$r,
  'citebook': citeBook$p,
  'citejournal': citeJournal$g,
  'citeweb': citeWeb$r,
  'cw': citeWeb$r,
  'internetquelle': internetquelle$e,
  'ref web': citeWeb$r,
  'web cite': citeWeb$r,
};

const data$w = { aliases: aliases$w, infoboxes: infoboxes$w, parsers: parsers$w };

const plugin$x = (_models, templates, boxes) => register(data$w, templates, boxes);
plugin$x.lang = 'ja';
plugin$x.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// georgian template names → the core template they resolve to
const aliases$v = {
  'cite magazine': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'flag icon': 'flagicon',
  'ipa-text': 'ipa',
  'დაბადების თარიღი და ასაკი': 'birth date and age',
  'დაიწყე თარიღი': 'start',
  'დეტალები': 'main',
  'დროშა': 'flag',
  'დროშანიშანი': 'flagicon',
  'კოორდ': 'coord',
  'კოორდინატი': 'coord',
  'მთავარი': 'main',
  'მთავარი სტატია': 'main',
  'ნიჰონგი': 'nihongo',
  'ნიჰონგო': 'nihongo',
  'პორტალი': 'portal',
  'სქოლიო': 'reflist',
  'სქოლიოს სია': 'reflist',
  'სქოლიოს სია გრძელი': 'reflist',
};

// names recognised as infoboxes
const infoboxes$v = [
  'ტაქსოდაფა',
  'ტაქსოდაფა *',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$q = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const internetquelle$d = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$v = {
  'citeweb': citeWeb$q,
  'internetquelle': internetquelle$d,
};

const data$v = { aliases: aliases$v, infoboxes: infoboxes$v, parsers: parsers$v };

const plugin$w = (_models, templates, boxes) => register(data$v, templates, boxes);
plugin$w.lang = 'ka';
plugin$w.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// kazakh template names → the core template they resolve to
const aliases$u = {
  'commons category': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'coor d/new': 'coord',
  'coor/new': 'coord',
  'coord/conversion': 'coord',
  'ipa1': 'ipa',
  'mainarticle': 'main',
  'references': 'reflist',
  'дереккөздер': 'reflist',
  'негізгі мақала': 'main',
  'нихонго': 'nihongo',
  'портал': 'portal',
  'портал 2': 'portal',
  'толық мақала': 'main',
  'ту': 'flagicon',
};

const infoboxes$u = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$f = translate('cite journal', {
  'жыл': 'year',
});
const citeWeb$p = translate('cite web', {
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
});

const parsers$u = {
  'cite magazine': citeJournal$f,
  'citeweb': citeWeb$p,
  'cw': citeWeb$p,
  'веб сайт': citeWeb$p,
  'веб-сайт': citeWeb$p,
};

const data$u = { aliases: aliases$u, infoboxes: infoboxes$u, parsers: parsers$u };

const plugin$v = (_models, templates, boxes) => register(data$u, templates, boxes);
plugin$v.lang = 'kk';
plugin$v.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// korean template names → the core template they resolve to
const aliases$t = {
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor d': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'fbaicon': 'flagicon',
  'flag icon': 'flagicon',
  'isbn2': 'isbn',
  'main articles': 'main',
  'main2': 'main',
  'portal box': 'portal',
  'portalpar': 'portal',
  'refs': 'reflist',
  'release date': 'start',
  'sf': 'sfn',
  'snf': 'sfn',
  'startdate': 'start',
  'vedi anche': 'main',
  '각주': 'reflist',
  '공용 분류': 'commons cat',
  '공용분류': 'commons cat',
  '국가': 'flag',
  '국기': 'flag',
  '국기 그림': 'flagicon',
  '국기그림': 'flagicon',
  '들머리': 'portal',
  '본문': 'main',
  '생성일': 'start',
  '시작 날짜': 'start',
  '원문': 'main',
  '위키공용분류': 'commons cat',
  '인용': 'citation',
  '좌표': 'coord',
  '좌표1': 'coord',
  '좌표2': 'coord',
  '좌표3': 'coord',
  '좌표도': 'coord',
  '좌표도분': 'coord',
  '좌표도분초': 'coord',
  '좌표도분초/상단': 'coord',
  '주석': 'reflist',
  '참고주': 'reflist',
  '출생일과 나이': 'birth date and age',
  '출생일과 만나이': 'birth date and age',
  '포털': 'portal',
  '형식 숫자': 'formatnum',
};

// names recognised as infoboxes
const infoboxes$t = [
  '새 정보',
  '생물 분류',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$o = translate('cite book', {
  '제목': 'title',
  '날짜': 'date',
  '성': 'author',
  '성1': 'author',
  '저자': 'author',
  '저자1': 'author',
  '이름': 'first',
  '연도': 'year',
  '확인날짜': 'access-date',
  'accessdate': 'access-date',
  '출판사': 'publisher',
  '편집자-성': 'editor',
  '편집자성': 'editor',
  '편집자': 'editor',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  '위치': 'location',
  'place': 'location',
  '쪽': 'pages',
  '언어': 'language',
  '번역제목': 'trans-title',
  '보존url': 'archive-url',
  'archiveurl': 'archive-url',
  '보존날짜': 'archive-date',
  'archivedate': 'archive-date',
  '인용문': 'quote',
  '인용': 'quote',
  '판': 'edition',
  '권': 'volume',
  '장': 'chapter',
});
const citeWeb$o = translate('cite web', {
  '제목': 'title',
  '날짜': 'date',
  '성': 'author',
  '성1': 'author',
  '저자': 'author',
  '저자1': 'author',
  '이름': 'first',
  '연도': 'year',
  '확인날짜': 'access-date',
  'accessdate': 'access-date',
  '웹사이트': 'website',
  '작품': 'website',
  '출판사': 'publisher',
  '편집자-성': 'editor',
  '편집자성': 'editor',
  '편집자': 'editor',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  '위치': 'location',
  'place': 'location',
  '쪽': 'pages',
  '언어': 'language',
  '번역제목': 'trans-title',
  '보존url': 'archive-url',
  'archiveurl': 'archive-url',
  '보존날짜': 'archive-date',
  'archivedate': 'archive-date',
  '인용문': 'quote',
  '인용': 'quote',
});
const citeJournal$e = translate('cite journal', {
  '제목': 'title',
  '날짜': 'date',
  '성': 'author',
  '성1': 'author',
  '저자': 'author',
  '저자1': 'author',
  '이름': 'first',
  '연도': 'year',
  '확인날짜': 'access-date',
  'accessdate': 'access-date',
  '출판사': 'publisher',
  '편집자-성': 'editor',
  '편집자성': 'editor',
  '편집자': 'editor',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  '위치': 'location',
  'place': 'location',
  '쪽': 'pages',
  '언어': 'language',
  '번역제목': 'trans-title',
  '보존url': 'archive-url',
  'archiveurl': 'archive-url',
  '보존날짜': 'archive-date',
  'archivedate': 'archive-date',
  '인용문': 'quote',
  '인용': 'quote',
  '판': 'edition',
  '권': 'volume',
  '장': 'chapter',
  '저널': 'work',
  '작품': 'work',
  '호': 'issue',
});
const internetquelle$c = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  '제목': 'title',
  '날짜': 'date',
  '성': 'author',
  '성1': 'author',
  '저자': 'author',
  '저자1': 'author',
  '이름': 'first',
  '연도': 'year',
  '확인날짜': 'access-date',
  'accessdate': 'access-date',
  '웹사이트': 'website',
  '작품': 'website',
  '출판사': 'publisher',
  '편집자-성': 'editor',
  '편집자성': 'editor',
  '편집자': 'editor',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  '위치': 'location',
  'place': 'location',
  '쪽': 'pages',
  '언어': 'language',
  '번역제목': 'trans-title',
  '보존url': 'archive-url',
  'archiveurl': 'archive-url',
  '보존날짜': 'archive-date',
  'archivedate': 'archive-date',
  '인용문': 'quote',
  '인용': 'quote',
});

const parsers$t = {
  'cita libro': citeBook$o,
  'cita web': citeWeb$o,
  'cite blog': citeWeb$o,
  'cite manual': citeBook$o,
  'cite paper': citeJournal$e,
  'cite website': citeWeb$o,
  'cite work': citeBook$o,
  'cite-web': citeWeb$o,
  'citebook': citeBook$o,
  'citeweb': citeWeb$o,
  'internetquelle': internetquelle$c,
  '도서 인용': citeBook$o,
  '문서 인용': citeJournal$e,
  '서적 인용': citeBook$o,
  '서적인용': citeBook$o,
  '웹 인용': citeWeb$o,
  '웹인용': citeWeb$o,
  '저널 인용': citeJournal$e,
  '저널인용': citeJournal$e,
  '책 인용': citeBook$o,
  '학술지 인용': citeJournal$e,
};

const data$t = { aliases: aliases$t, infoboxes: infoboxes$t, parsers: parsers$t };

const plugin$u = (_models, templates, boxes) => register(data$t, templates, boxes);
plugin$u.lang = 'ko';
plugin$u.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// lithuanian template names → the core template they resolve to
const aliases$s = {
  'bandera': 'flagicon',
  'bandiera': 'flagicon',
  'book': 'cite book',
  'citavimas': 'citation',
  'cite paper': 'cite journal',
  'citeweb': 'cite web',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor at dms': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'fbaicon': 'flagicon',
  'flag icon': 'flagicon',
  'išn': 'reflist',
  'išnašos': 'reflist',
  'mažas': 'small',
  'pagr': 'main',
  'pradžios data': 'start',
  'ref': 'reflist',
  'vikisritis': 'portal',
  'vlv': 'flagicon',
};

const infoboxes$s = [];

const parsers$s = {};

const data$s = { aliases: aliases$s, infoboxes: infoboxes$s, parsers: parsers$s };

const plugin$t = (_models, templates, boxes) => register(data$s, templates, boxes);
plugin$t.lang = 'lt';
plugin$t.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// latvian template names → the core template they resolve to
const aliases$r = {
  'atsauce': 'citation',
  'atsauces': 'reflist',
  'atsauces2': 'reflist',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coordinates': 'coord',
  'datdv': 'birth date and age',
  'ddv': 'birth date and age',
  'dzim diena un vecums': 'birth date and age',
  'dzimšanas datums un vecums': 'birth date and age',
  'flaga': 'flagicon',
  'galvenais': 'main',
  'ipaslink': 'ipa',
  'karoga ikona': 'flagicon',
  'karogs': 'flag',
  'pamatraksts': 'main',
  'portal2': 'portal',
  'portāls': 'portal',
  'portāls2': 'portal',
  'viited': 'reflist',
  'vikikrātuves kategorija': 'commons cat',
};

// names recognised as infoboxes
const infoboxes$r = [
  'bioloģiskās taksonomijas infokaste',
  'biotakso',
  'biotakso infokaste',
  'biotaksonomijas infokaste',
  'dzīvnieki infobox',
  'info biotakso',
  'info taxo',
  'taksonomijas infokaste',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$d = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeWeb$n = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
});
const citeBook$n = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'place': 'location',
  'air-date': 'date',
  'airdate': 'date',
  'p': 'page',
  'pp': 'pages',
  'quotation': 'quote',
});

const parsers$r = {
  'cite magazine': citeJournal$d,
  'cite paper': citeJournal$d,
  'citeweb': citeWeb$n,
  'dokumenta atsauce': citeJournal$d,
  'grāmatas atsauce': citeBook$n,
  'laikraksta atsauce': citeJournal$d,
  'publikācijas atsauce': citeJournal$d,
  'tīmekļa atsauce': citeWeb$n,
  'tīmekļa vietne': citeWeb$n,
  'web cite': citeWeb$n,
  'žurnāla atsauce': citeJournal$d,
};

const data$r = { aliases: aliases$r, infoboxes: infoboxes$r, parsers: parsers$r };

const plugin$s = (_models, templates, boxes) => register(data$r, templates, boxes);
plugin$s.lang = 'lv';
plugin$s.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// macedonian template names → the core template they resolve to
const aliases$q = {
  'ap': 'main',
  'commons category': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'coor at dms': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'foundation date': 'start',
  'geolinks-us-hoodscale': 'coord',
  'initial release': 'start',
  'portalpar': 'portal',
  'refs': 'reflist',
  'snf': 'sfn',
  'главна': 'main',
  'главна статија': 'main',
  'главно': 'main',
  'дата на раѓање и возраст': 'birth date and age',
  'дата на раѓање и години': 'birth date and age',
  'датум на раѓање и возраст': 'birth date and age',
  'знаме': 'flag',
  'знамеикона': 'flagicon',
  'ифа': 'ipa',
  'мали': 'small',
  'мфа': 'ipa',
  'наведување': 'citation',
  'наводи': 'reflist',
  'нихонго': 'nihongo',
  'портал': 'portal',
  'почетен датум': 'start',
  'почеток-датум': 'start',
  'р-в': 'commons cat',
  'рв': 'commons cat',
  'референци': 'reflist',
  'ризница-врска': 'commons cat',
  'рнв': 'birth date and age',
  'рнив': 'birth date and age',
  'роден на и возраст': 'birth date and age',
  'родена на и возраст': 'birth date and age',
  'цитирање': 'citation',
  'јапонски': 'nihongo',
};

// names recognised as infoboxes
const infoboxes$q = [
  'таксономија',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$m = translate('cite web', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const citeJournal$c = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeBook$m = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});

const parsers$q = {
  'cite website': citeWeb$m,
  'cite дневник': citeJournal$c,
  'citebook': citeBook$m,
  'citeweb': citeWeb$m,
  'cw': citeWeb$m,
  'lien web': citeWeb$m,
  'web cite': citeWeb$m,
  'книга': citeBook$m,
  'наведен документ': citeJournal$c,
  'наведена книга': citeBook$m,
  'наведена мрежна страница': citeWeb$m,
  'наведено мрежно место': citeWeb$m,
  'наведено списание': citeJournal$c,
  'нмс': citeWeb$m,
};

const data$q = { aliases: aliases$q, infoboxes: infoboxes$q, parsers: parsers$q };

const plugin$r = (_models, templates, boxes) => register(data$q, templates, boxes);
plugin$r.lang = 'mk';
plugin$r.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// malayalam template names → the core template they resolve to
const aliases$p = {
  'ap': 'main',
  'birthdate and age': 'birth date and age',
  'birthdateandage': 'birth date and age',
  'c cat': 'commons cat',
  'cc': 'commons cat',
  'ccat': 'commons cat',
  'cite paper': 'cite journal',
  'citejournal': 'cite journal',
  'cms-catlist-up': 'commons cat',
  'commons category': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'coor d': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'date of birth and age': 'birth date and age',
  'flag icon': 'flagicon',
  'geolinks-us-cityscale': 'coord',
  'location': 'coord',
  'mainarticle': 'main',
  'portalpar': 'portal',
  'realist': 'reflist',
  'ref list': 'reflist',
  'reference': 'reflist',
  'refs': 'reflist',
  'snf': 'sfn',
  'അവലംബങ്ങൾ': 'reflist',
  'കവാടം': 'portal',
  'ചെറിയ': 'small',
  'ജന്മദിനം, വയസ്സ്': 'birth date and age',
  'പ്രധാന ലേഖനം': 'main',
  'പ്രധാനലേഖനം': 'main',
  'പ്രലേ': 'main',
};

const infoboxes$p = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$l = translate('cite web', {
  'accessdate': 'access-date',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeBook$l = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
});

const parsers$p = {
  'cita web': citeWeb$l,
  'cite blog': citeWeb$l,
  'cite manual': citeBook$l,
  'cite website': citeWeb$l,
  'cite work': citeBook$l,
  'cite-book': citeBook$l,
  'cite-web': citeWeb$l,
  'citebook': citeBook$l,
  'citeweb': citeWeb$l,
  'web cite': citeWeb$l,
};

const data$p = { aliases: aliases$p, infoboxes: infoboxes$p, parsers: parsers$p };

const plugin$q = (_models, templates, boxes) => register(data$p, templates, boxes);
plugin$q.lang = 'ml';
plugin$q.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// malay template names → the core template they resolve to
const aliases$o = {
  'afa': 'ipa',
  'bendera': 'flag',
  'bendera-ikon': 'flagicon',
  'birth date & age': 'birth date and age',
  'birthdate and age': 'birth date and age',
  'cc': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'coor title dm': 'coord',
  'coor title/at d/dm/dms': 'coord',
  'coorheader': 'coord',
  'country': 'flag',
  'disebut': 'ipa',
  'flag icon': 'flagicon',
  'footnotes': 'reflist',
  'footnotessmall': 'reflist',
  'ikonbendera': 'flagicon',
  'initial release': 'start',
  'kategori commons': 'commons cat',
  'kecil': 'small',
  'koord': 'coord',
  'kutipan': 'citation',
  'listaref': 'reflist',
  'mainarticle': 'main',
  'portalpar': 'portal',
  'pron': 'ipa',
  'pronounced': 'ipa',
  'refs': 'reflist',
  'release date': 'start',
  'senarai rujukan': 'reflist',
  'senarairujuk': 'reflist',
  'startdate': 'start',
  'tarikh lahir dan umur': 'birth date and age',
  'tarikh mula': 'start',
  'utama': 'main',
};

// names recognised as infoboxes
const infoboxes$o = [
  'kotak info taksonomi',
  'kotak taksonomi',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$k = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const citeWeb$k = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const citeJournal$b = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const internetquelle$b = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});

const parsers$o = {
  'book reference': citeBook$k,
  'cita web': citeWeb$k,
  'cite paper': citeJournal$b,
  'cite url': citeWeb$k,
  'cite website': citeWeb$k,
  'cite work': citeBook$k,
  'cite-web': citeWeb$k,
  'citebook': citeBook$k,
  'citeweb': citeWeb$k,
  'internetquelle': internetquelle$b,
  'kutip buku': citeBook$k,
  'kutip jurnal': citeJournal$b,
  'kutip web': citeWeb$k,
  'petik buku': citeBook$k,
  'petik jurnal': citeJournal$b,
  'petik web': citeWeb$k,
  'web cite': citeWeb$k,
};

const data$o = { aliases: aliases$o, infoboxes: infoboxes$o, parsers: parsers$o };

const plugin$p = (_models, templates, boxes) => register(data$o, templates, boxes);
plugin$p.lang = 'ms';
plugin$p.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// dutch template names → the core template they resolve to
const aliases$n = {
  'commonscat': 'commons cat',
  'coordinaten': 'coord',
  'coördinaten': 'coord',
  'geboortedatum en leeftijd': 'birth date and age',
  'hoofdartikel': 'main',
  'link portaal': 'portal',
  'references': 'reflist',
  'referenties': 'reflist',
  'refs': 'reflist',
  'vlagland': 'flagicon',
  'zie hoofdartikel': 'main',
};

const infoboxes$n = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$j = translate('cite book', {
  'taal': 'language',
  'lang': 'language',
  'voornaam': 'first',
  'achternaam': 'author',
  'auteur': 'author',
  'titel': 'title',
  'uitgever': 'publisher',
  'plaats': 'location',
  'place': 'location',
  'locatie': 'location',
  'datum': 'date',
  'bezochtdatum': 'access-date',
  'accessdate': 'access-date',
  'citaat': 'quote',
  'archiefurl': 'archive-url',
  'archiveurl': 'archive-url',
  'pagina': 'pages',
  'pagina\'s': 'pages',
  'paginas': 'pages',
  'editie': 'edition',
  'hoofdstuk': 'chapter',
  'archiefdatum': 'archive-date',
  'archivedate': 'archive-date',
  'jaar': 'year',
});
const citeJournal$a = translate('cite journal', {
  'tijdschrift': 'journal',
  'archiefurl': 'archive-url',
  'archiveurl': 'archive-url',
  'citaat': 'quote',
  'uitgever': 'publisher',
  'datum': 'date',
  'jaar': 'year',
  'taal': 'language',
  'lang': 'language',
  'locatie': 'location',
  'plaats': 'location',
  'titel': 'title',
  'bezochtdatum': 'access-date',
  'accessdate': 'access-date',
  'achternaam': 'author',
  'auteur': 'author',
  'voornaam': 'first',
  'archiefdatum': 'archive-date',
  'archivedate': 'archive-date',
  'pagina\'s': 'pages',
  'paginas': 'pages',
});
const citeWeb$j = translate('cite web', {
  'titel': 'title',
  'bezochtdatum': 'access-date',
  'accessdate': 'access-date',
  'datumbezocht': 'access-date',
  'datumgeraadpleegd': 'access-date',
  'raadpleegdatum': 'access-date',
  'achternaam': 'author',
  'voornaam': 'first',
  'datum': 'date',
  'werk': 'website',
  'uitgever': 'publisher',
  'taal': 'language',
  'lang': 'language',
  'archiefurl': 'archive-url',
  'archiveurl': 'archive-url',
  'archief-url': 'archive-url',
  'archiefdatum': 'archive-date',
  'archivedate': 'archive-date',
  'archief-datum': 'archive-date',
  'citaat': 'quote',
  'pagina\'s': 'pages',
  'paginas': 'pages',
  'jaar': 'year',
});

const parsers$n = {
  'citeer boek': citeBook$j,
  'citeer journal': citeJournal$a,
  'citeer web': citeWeb$j,
  'citeweb': citeWeb$j,
  'jayden54~nlwiki/voetnoot web': citeWeb$j,
  'voetnoot web': citeWeb$j,
};

const data$n = { aliases: aliases$n, infoboxes: infoboxes$n, parsers: parsers$n };

const plugin$o = (_models, templates, boxes) => register(data$n, templates, boxes);
plugin$o.lang = 'nl';
plugin$o.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// norwegian nynorsk template names → the core template they resolve to
const aliases$m = {
  'cite report': 'citation',
  'citenews': 'citation',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'coor title': 'coord',
  'coor title dm': 'coord',
  'flagg': 'flag',
  'flaggbild': 'flagicon',
  'flaggikon': 'flagicon',
  'fotnoteliste': 'reflist',
  'fødselsdato og alder': 'birth date and age',
  'hovedartikkel': 'main',
  'hovud': 'main',
  'hovudartikkel': 'main',
  'kjelde film': 'citation',
  'kjeldeliste': 'reflist',
  'koor': 'coord',
  'koord': 'coord',
  'koordinatar': 'coord',
  'litaskrift': 'small',
  'litenskrift': 'small',
  'notelist': 'reflist',
  'sf': 'sfn',
  'utdjupande artikkel': 'main',
};

// names recognised as infoboxes
const infoboxes$m = [
  'prosjekt taksonomi/bruk av taksoboksen',
  'prosjekt taksonomi/lag ein taksoboks',
  'taksoboks',
  'taksoboks2',
  'taksobox',
  'taksonomiboks',
  'taksonomibox',
  'taxoboks',
  'taxonomiboks',
  'taxonomibox',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$i = translate('cite book', {
  'tittel': 'title',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'utgivelsesår': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'institution': 'publisher',
  'forlag': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'redaktør': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
});
const citeWeb$i = translate('cite web', {
  'link': 'url',
  'tittel': 'title',
  'forfattar': 'author',
  'etternamn': 'last',
  'førenamn': 'first',
  'år': 'year',
  'redaktør': 'editor',
  'språk': 'language',
  'verk': 'work',
  'sider': 'pages',
  'utgjevar': 'publisher',
  'vitja': 'access-date',
  'accessdate': 'access-date',
  'besøksdato': 'access-date',
  'sitat': 'quote',
  'nettstad': 'website',
  'nettside': 'website',
  'nettsted': 'website',
});

const parsers$m = {
  'cite book-en': citeBook$i,
  'cite book/en': citeBook$i,
  'cite website': citeWeb$i,
  'cite work': citeBook$i,
  'cite-web': citeWeb$i,
  'citebook': citeBook$i,
  'citeweb': citeWeb$i,
  'kjelde av-medium': citeWeb$i,
  'kjelde www': citeWeb$i,
};

const data$m = { aliases: aliases$m, infoboxes: infoboxes$m, parsers: parsers$m };

const plugin$n = (_models, templates, boxes) => register(data$m, templates, boxes);
plugin$n.lang = 'nn';
plugin$n.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// norwegian template names → the core template they resolve to
const aliases$l = {
  'catmore': 'main',
  'comcat': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat2': 'commons cat',
  'commonskat': 'commons cat',
  'fda': 'birth date and age',
  'flagg': 'flag',
  'flaggikon': 'flagicon',
  'fltest': 'flag',
  'fødselsdato og alder': 'birth date and age',
  'geobox coor': 'coord',
  'hoved': 'main',
  'hovedartikkel': 'main',
  'koord': 'coord',
  'lippukuvake': 'flagicon',
  'mer informasjon': 'main',
  'nærmere informasjon': 'main',
  'referanser': 'reflist',
  'startdato': 'start',
  'utdypende': 'main',
  'utdypende artikkel': 'main',
  'utfyllende': 'main',
  'videre': 'main',
  'videre informasjon': 'main',
};

// names recognised as infoboxes
const infoboxes$l = [
  'infoboks taksoboks',
  'taksoboks',
  'taksoboks fugl',
  'taksoboks krepsdyr',
  'taksoboks-kunstig-gruppe',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$h = translate('cite book', {
  'lenke': 'url',
  'link': 'url',
  'tittel': 'title',
  'etternavn': 'author',
  'forfatter': 'author',
  'forfatter1': 'author',
  'forfattere': 'author',
  'etternavn1': 'author',
  'fornavn': 'first',
  'fornavn1': 'first',
  'dato': 'date',
  'verk': 'work',
  'utgiver': 'publisher',
  'forlag': 'publisher',
  'redaktør-etternavn': 'editor',
  'redaktør': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'utgave': 'edition',
  'utgåve': 'edition',
  'bind': 'volume',
  'volum': 'volume',
  'årgang': 'volume',
  'utgivelsessted': 'location',
  'place': 'location',
  'sted': 'location',
  'stad': 'location',
  'side': 'page',
  'språk': 'language',
  'kapittel': 'chapter',
  'artikkel': 'chapter',
  'sitat': 'quote',
});
const citeJournal$9 = translate('cite journal', {
  'sitat': 'quote',
});
const citeWeb$h = translate('cite web', {
  'link': 'url',
  'tittel': 'title',
  'besøksdato': 'access-date',
  'fornavn': 'first',
  'fornavn1': 'first',
  'etternavn': 'last',
  'etternavn1': 'last',
  'forfatter': 'last',
  'forfatter1': 'last',
  'utgave': 'edition',
  'forlag': 'publisher',
  'utgiver': 'publisher',
  'institusjon': 'publisher',
  'skole': 'publisher',
});

const parsers$l = {
  'bok': citeBook$h,
  'kilde artikkel': citeJournal$9,
  'kilde bok': citeBook$h,
  'kilde web': citeWeb$h,
  'kilde www': citeWeb$h,
  'tidsskriftsref': citeJournal$9,
};

const data$l = { aliases: aliases$l, infoboxes: infoboxes$l, parsers: parsers$l };

const plugin$m = (_models, templates, boxes) => register(data$l, templates, boxes);
plugin$m.lang = 'no';
plugin$m.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// polish template names → the core template they resolve to
const aliases$k = {
  'commonscat': 'commons cat',
  'flaga': 'flagicon',
  'koordynaty': 'coord',
  'lokalizacja': 'coord',
  'odn': 'sfn',
  'osobna strona': 'main',
  'osobny artykuł': 'main',
  'państwo': 'flag',
  'przypisy': 'reflist',
  'współrzędne': 'coord',
};

// names recognised as infoboxes
const infoboxes$k = [
  'takson infobox',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citation$6 = translate('citation', {
  'autor': 'author',
  'vauthors': 'author',
  'tytuł': 'title',
  'czasopismo': 'journal',
  'periodical': 'journal',
  'data': 'date',
  'data dostępu': 'access-date',
  'rozdział': 'chapter',
  'wydanie': 'issue',
  'wolumin': 'volume',
  'miejsce': 'location',
  'publication-place': 'location',
  'place': 'location',
  'wydawca': 'publisher',
  's': 'pages',
  'praca': 'work',
  'opublikowany': 'website',
  'archiwum': 'archive-url',
  'zarchiwizowano': 'archive-date',
  'cytat': 'quote',
  'język': 'language',
});
const citeJournal$8 = translate('cite journal', {
  'nazwisko': 'last1',
  'imię': 'first1',
  'tytuł': 'title',
  'archiwum': 'archive-url',
  'czasopismo': 'journal',
  'wolumin': 'volume',
  'wydanie': 'issue',
  'strony': 'pages',
  'data': 'date',
  'rok': 'year',
  'wydawca': 'publisher',
  'cytat': 'quote',
  'język': 'language',
});
const citeBook$g = translate('cite book', {
  'nazwisko': 'last',
  'imię': 'first',
  'tytuł': 'title',
  'wydanie': 'edition',
  'data': 'date',
  'rok': 'year',
  'wydawca': 'publisher',
  'miejsce': 'location',
  'strony': 'pages',
  'rozdział': 'chapter',
  'tytuł tomu': 'volume',
});
const citeWeb$g = translate('cite web', {
  'tytuł': 'title',
  'nazwisko': 'last',
  'imię': 'first',
  'data': 'date',
  'rok': 'year',
  'data dostępu': 'access-date',
  'opublikowany': 'website',
  'strony': 'pages',
  'język': 'language',
  'lang': 'language',
  'archiwum': 'archive-url',
  'zarchiwizowano': 'archive-date',
  'cytat': 'quote',
});

const parsers$k = {
  'cytuj': citation$6,
  'cytuj czasopismo': citeJournal$8,
  'cytuj książkę': citeBook$g,
  'cytuj pismo': citeJournal$8,
  'cytuj stronę': citeWeb$g,
};

const data$k = { aliases: aliases$k, infoboxes: infoboxes$k, parsers: parsers$k };

const plugin$l = (_models, templates, boxes) => register(data$k, templates, boxes);
plugin$l.lang = 'pl';
plugin$l.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// portuguese template names → the core template they resolve to
const aliases$j = {
  'afi': 'ipa',
  'ani': 'birth date and age',
  'ap': 'main',
  'aps': 'main',
  'artigo principal': 'main',
  'artigoprincipal': 'main',
  'artigos principais': 'main',
  'bandera': 'flagicon',
  'bandiera': 'flagicon',
  'categoria no commons': 'commons cat',
  'commons category': 'commons cat',
  'commons-cat': 'commons cat',
  'commonscat': 'commons cat',
  'country flagicon': 'flagicon',
  'data de início': 'start',
  'data de nascimento e idade': 'birth date and age',
  'detalhes': 'main',
  'flag icon': 'flagicon',
  'flagicon1': 'flagicon',
  'japonês': 'nihongo',
  'pequeno': 'small',
  'principais': 'main',
  'principal': 'main',
  'ref-list': 'reflist',
  'refs': 'reflist',
  'ver artigo': 'main',
  'ver artigo principal': 'main',
  'ver artigos principais': 'main',
  'ver também artigo principal': 'main',
  'ícone bandeira': 'flagicon',
  'íconebandeira': 'flagicon',
};

// names recognised as infoboxes
const infoboxes$j = [
  'ficha de taxón',
  'info/taxonomia',
  'takson infobox',
  'taxoboxe',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$7 = translate('cite journal', {
  'título': 'title',
  'titulo': 'title',
  'último': 'author',
  'sobrenome': 'author',
  'cognome': 'author',
  'apelido': 'author',
  'autor': 'author',
  'ultimo': 'author',
  'primeiro': 'first',
  'primeiro1': 'first',
  'nome': 'first',
  'data': 'date',
  'periódico': 'website',
  'jornal': 'website',
  'publicação': 'website',
  'editora': 'publisher',
  'publicado': 'publisher',
  'número': 'issue',
  'numero': 'issue',
  'ano': 'year',
  'local': 'location',
  'edição': 'edition',
  'edicao': 'edition',
  'página': 'page',
  'pagina': 'page',
  'páginas': 'pages',
  'paginas': 'pages',
  'língua': 'language',
  'lingua': 'language',
  'idioma': 'language',
  'lang': 'language',
  'capítulo': 'chapter',
  'capitulo': 'chapter',
  'titulotrad': 'trans-title',
  'títulotrad': 'trans-title',
  'título-trad': 'trans-title',
  'acessodata': 'access-date',
  'acessadoem': 'access-date',
  'arquivourl': 'archive-url',
  'arquivodata': 'archive-date',
});
const citeBook$f = translate('cite book', {
  'ultimo': 'author',
  'ultimo1': 'author',
  'autor': 'author',
  'autor1': 'author',
  'último': 'author',
  'sobrenome': 'author',
  'apelido': 'author',
  'apellido': 'author',
  'apellidos': 'author',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'primeiro': 'first',
  'primeiro1': 'first',
  'nome': 'first',
  'name': 'first',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'data': 'date',
  'editora': 'publisher',
  'publicado': 'publisher',
  'publicadopor': 'publisher',
  'editor-sobrenome': 'editor',
  'editor-sobrenome1': 'editor',
  'editor-last1': 'editor',
  'local': 'location',
  'lugar': 'location',
  'place': 'location',
  'página': 'page',
  'pagina': 'page',
  'páginas': 'pages',
  'paginas': 'pages',
  'lingua': 'language',
  'língua': 'language',
  'idioma': 'language',
  'titulotrad': 'trans-title',
  'capitulo': 'chapter',
  'citacao': 'quote',
  'citação': 'quote',
  'cita': 'quote',
  'acessodata': 'access-date',
  'acessadoem': 'access-date',
  'arquivourl': 'archive-url',
  'urlarquivo': 'archive-url',
  'arquivodata': 'archive-date',
  'dataarquivo': 'archive-date',
  'título': 'title',
  'titulo': 'title',
});
const citeWeb$f = translate('cite web', {
  'titulo': 'title',
  'título': 'title',
  'data': 'date',
  'fecha': 'date',
  'acessodata': 'access-date',
  'acessadoem': 'access-date',
  'accessdate': 'access-date',
  'fechaacceso': 'access-date',
  'jornal': 'website',
  'periodico': 'website',
  'periódico': 'website',
  'enciclopedia': 'website',
  'enciclopédia': 'website',
  'dicionario': 'website',
  'dicionário': 'website',
  'publicacao': 'website',
  'publicação': 'website',
  'obra': 'website',
  'publicado': 'publisher',
  'produtora': 'publisher',
  'editora': 'publisher',
  'instituição': 'publisher',
  'universidade': 'publisher',
  'ultimo': 'last',
  'último': 'last',
  'sobrenome': 'last',
  'apelido': 'last',
  'apellido': 'last',
  'apellidos': 'last',
  'primeiro': 'first',
  'nome': 'first',
  'nombre': 'first',
  'autor': 'author',
  'ano': 'year',
  'editor-sobrenome': 'editor',
  'editor-sobrenome1': 'editor',
  'editores': 'editor',
  'editor-last': 'editor',
  'local': 'location',
  'pagina': 'page',
  'página': 'page',
  'paginas': 'pages',
  'páginas': 'pages',
  'língua': 'language',
  'lingua': 'language',
  'idioma': 'language',
  'lang': 'language',
  'titulotrad': 'trans-title',
  'títulotrad': 'trans-title',
  'título-trad': 'trans-title',
  'arquivourl': 'archive-url',
  'urlarquivo': 'archive-url',
  'archiveurl': 'archive-url',
  'arquivodata': 'archive-date',
  'dataarquivo': 'archive-date',
  'archivedate': 'archive-date',
  'autores': 'authors',
  'pessoas': 'authors',
  'credits': 'authors',
});
const internetquelle$a = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'titulo': 'title',
  'título': 'title',
  'data': 'date',
  'fecha': 'date',
  'acessodata': 'access-date',
  'acessadoem': 'access-date',
  'accessdate': 'access-date',
  'fechaacceso': 'access-date',
  'jornal': 'website',
  'periodico': 'website',
  'periódico': 'website',
  'enciclopedia': 'website',
  'enciclopédia': 'website',
  'dicionario': 'website',
  'dicionário': 'website',
  'publicacao': 'website',
  'publicação': 'website',
  'obra': 'website',
  'publicado': 'publisher',
  'produtora': 'publisher',
  'editora': 'publisher',
  'instituição': 'publisher',
  'universidade': 'publisher',
  'ultimo': 'last',
  'último': 'last',
  'sobrenome': 'last',
  'apelido': 'last',
  'apellido': 'last',
  'apellidos': 'last',
  'primeiro': 'first',
  'nome': 'first',
  'nombre': 'first',
  'ano': 'year',
  'editor-sobrenome': 'editor',
  'editor-sobrenome1': 'editor',
  'editores': 'editor',
  'editor-last': 'editor',
  'local': 'location',
  'pagina': 'page',
  'página': 'page',
  'paginas': 'pages',
  'páginas': 'pages',
  'língua': 'language',
  'lingua': 'language',
  'idioma': 'language',
  'lang': 'language',
  'titulotrad': 'trans-title',
  'títulotrad': 'trans-title',
  'título-trad': 'trans-title',
  'arquivourl': 'archive-url',
  'urlarquivo': 'archive-url',
  'archiveurl': 'archive-url',
  'arquivodata': 'archive-date',
  'dataarquivo': 'archive-date',
  'archivedate': 'archive-date',
  'autores': 'authors',
  'pessoas': 'authors',
  'credits': 'authors',
});
const literatur$1 = translate('cite book', {
  'titel': 'title',
  'autor': 'author',
  'verlag': 'publisher',
  'jahr': 'year',
  'ort': 'location',
  'seiten': 'pages',
  'sammelwerk': 'journal',
  'band': 'volume',
  'nummer': 'issue',
  'auflage': 'edition',
  'hrsg': 'editor',
  'sprache': 'language',
  'datum': 'date',
  'online': 'url',
  'ultimo': 'author',
  'ultimo1': 'author',
  'autor1': 'author',
  'último': 'author',
  'sobrenome': 'author',
  'apelido': 'author',
  'apellido': 'author',
  'apellidos': 'author',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'primeiro': 'first',
  'primeiro1': 'first',
  'nome': 'first',
  'name': 'first',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'data': 'date',
  'editora': 'publisher',
  'publicado': 'publisher',
  'publicadopor': 'publisher',
  'editor-sobrenome': 'editor',
  'editor-sobrenome1': 'editor',
  'editor-last1': 'editor',
  'local': 'location',
  'lugar': 'location',
  'place': 'location',
  'página': 'page',
  'pagina': 'page',
  'páginas': 'pages',
  'paginas': 'pages',
  'lingua': 'language',
  'língua': 'language',
  'idioma': 'language',
  'titulotrad': 'trans-title',
  'capitulo': 'chapter',
  'citacao': 'quote',
  'citação': 'quote',
  'cita': 'quote',
  'acessodata': 'access-date',
  'acessadoem': 'access-date',
  'arquivourl': 'archive-url',
  'urlarquivo': 'archive-url',
  'arquivodata': 'archive-date',
  'dataarquivo': 'archive-date',
  'título': 'title',
  'titulo': 'title',
});

const parsers$j = {
  'article': citeJournal$7,
  'cita libro': citeBook$f,
  'cita publicación periódica': citeJournal$7,
  'cita web': citeWeb$f,
  'citar livro': citeBook$f,
  'citar manual': citeBook$f,
  'citar periodico': citeJournal$7,
  'citar periódico': citeJournal$7,
  'citar página': citeWeb$f,
  'citar web': citeWeb$f,
  'citarlivro': citeBook$f,
  'cite chapter': citeBook$f,
  'cite manual': citeBook$f,
  'cite paper': citeJournal$7,
  'citeer web': citeWeb$f,
  'citeweb': citeWeb$f,
  'internetquelle': internetquelle$a,
  'lien web': citeWeb$f,
  'literatur': literatur$1,
  'ouvrage': citeBook$f,
  'ref-livro': citeBook$f,
  'ref-web': citeWeb$f,
  'referência a livro': citeBook$f,
  'webbref': citeWeb$f,
};

const data$j = { aliases: aliases$j, infoboxes: infoboxes$j, parsers: parsers$j };

const plugin$k = (_models, templates, boxes) => register(data$j, templates, boxes);
plugin$k.lang = 'pt';
plugin$k.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// romanian template names → the core template they resolve to
const aliases$i = {
  'afi': 'ipa',
  'ap': 'main',
  'arp': 'main',
  'articol principal': 'main',
  'articolprincipal': 'main',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'country': 'flag',
  'data naşterii şi vârsta': 'birth date and age',
  'data nașterii și vârsta': 'birth date and age',
  'dnv': 'birth date and age',
  'drapel': 'flag',
  'flag icon': 'flagicon',
  'harvnp': 'sfn',
  'initial release': 'start',
  'launch date': 'start',
  'lista note': 'reflist',
  'listanote': 'reflist',
  'listaref': 'reflist',
  'listareferinte': 'reflist',
  'listă note': 'reflist',
  'listănote': 'reflist',
  'location': 'coord',
  'mainarticle': 'main',
  'principal': 'main',
  'references': 'reflist',
  'release date': 'start',
  'runionflag': 'flag',
  'références': 'reflist',
  'startdate': 'start',
  'steag': 'flag',
  'zi de naştere şi vârstă': 'birth date and age',
  'zi de naștere și vârstă': 'birth date and age',
};

// names recognised as infoboxes
const infoboxes$i = [
  'casetă taxonomie',
  'cutietaxonomie',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$e = translate('cite book', {
  'nume': 'last',
  'surname': 'last',
  'nume1': 'last',
  'surname1': 'last',
  'autor': 'author',
  'autor1': 'author',
  'prenume': 'first',
  'given': 'first',
  'prenume1': 'first',
  'given1': 'first',
  'an': 'year',
  'dată': 'date',
  'titlu': 'title',
  'volum': 'volume',
  'număr': 'issue',
  'number': 'issue',
  'jurnal': 'journal',
  'periodic': 'journal',
  'periodical': 'journal',
  'ziar': 'journal',
  'pagină': 'page',
  'pagini': 'pages',
  'capitol': 'chapter',
  'contribuție': 'chapter',
  'contribution': 'chapter',
  'ediție': 'edition',
  'locul-publicării': 'location',
  'publication-place': 'location',
  'loc': 'location',
  'locație': 'location',
  'place': 'location',
  'editură': 'publisher',
  'nume-editor': 'editor',
  'nume-editor1': 'editor',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'editor1': 'editor',
  'editori': 'editor',
  'editors': 'editor',
  'limbă': 'language',
  'în': 'language',
  'in': 'language',
  'data-accesării': 'access-date',
  'accessdate': 'access-date',
  'citat': 'quote',
});
const citeWeb$e = translate('cite web', {
  'nume': 'last',
  'editură': 'publisher',
  'dată': 'date',
  'autor': 'authors',
  'coauthors': 'authors',
  'lucrare': 'work',
  'pagină': 'page',
  'pagini': 'pages',
  'limbă': 'language',
  'titlu': 'title',
});
const citeJournal$6 = translate('cite journal', {
  'nume': 'author',
  'name': 'author',
  'surname': 'author',
  'autor': 'author',
  'nume1': 'author',
  'surname1': 'author',
  'autor1': 'author',
  'prenume': 'first',
  'given': 'first',
  'prenume1': 'first',
  'given1': 'first',
  'an': 'year',
  'dată': 'date',
  'titlu': 'title',
  'volum': 'volume',
  'număr': 'issue',
  'number': 'issue',
  'pagini': 'pages',
  'pagină': 'page',
  'capitol': 'chapter',
  'ediție': 'edition',
  'limbă': 'language',
  'accessdate': 'access-date',
  'data-accesării': 'access-date',
  'citat': 'quote',
  'archivedate': 'archive-date',
});
const citation$5 = translate('citation', {
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'number': 'issue',
  'place': 'location',
  'accessdate': 'access-date',
  'archivedate': 'archive-date',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'editors': 'editor',
});
const literatur = translate('cite book', {
  'titel': 'title',
  'autor': 'author',
  'verlag': 'publisher',
  'jahr': 'year',
  'ort': 'location',
  'seiten': 'pages',
  'sammelwerk': 'journal',
  'band': 'volume',
  'nummer': 'issue',
  'auflage': 'edition',
  'hrsg': 'editor',
  'sprache': 'language',
  'datum': 'date',
  'online': 'url',
  'nume': 'last',
  'surname': 'last',
  'nume1': 'last',
  'surname1': 'last',
  'autor1': 'author',
  'prenume': 'first',
  'given': 'first',
  'prenume1': 'first',
  'given1': 'first',
  'an': 'year',
  'dată': 'date',
  'titlu': 'title',
  'volum': 'volume',
  'număr': 'issue',
  'number': 'issue',
  'jurnal': 'journal',
  'periodic': 'journal',
  'periodical': 'journal',
  'ziar': 'journal',
  'pagină': 'page',
  'pagini': 'pages',
  'capitol': 'chapter',
  'contribuție': 'chapter',
  'contribution': 'chapter',
  'ediție': 'edition',
  'locul-publicării': 'location',
  'publication-place': 'location',
  'loc': 'location',
  'locație': 'location',
  'place': 'location',
  'editură': 'publisher',
  'nume-editor': 'editor',
  'nume-editor1': 'editor',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'editor1': 'editor',
  'editori': 'editor',
  'editors': 'editor',
  'limbă': 'language',
  'în': 'language',
  'in': 'language',
  'data-accesării': 'access-date',
  'accessdate': 'access-date',
  'citat': 'quote',
});

const parsers$i = {
  'cita libro': citeBook$e,
  'cita news': citeWeb$e,
  'cita publicación': citeJournal$6,
  'cita web': citeWeb$e,
  'citace monografie': citeBook$e,
  'citar web': citeWeb$e,
  'citare': citation$5,
  'citat carte': citeBook$e,
  'citat carte-lua': citeBook$e,
  'citat revistă': citeJournal$6,
  'citat web': citeWeb$e,
  'citat web-lua': citeWeb$e,
  'citat website': citeWeb$e,
  'citați jurnalul': citeJournal$6,
  'citați web': citeWeb$e,
  'cite paper': citeJournal$6,
  'cite revistă': citeJournal$6,
  'cite web2': citeWeb$e,
  'cite website': citeWeb$e,
  'citează cartea': citeBook$e,
  'citează web': citeWeb$e,
  'citeweb': citeWeb$e,
  'cîte web': citeWeb$e,
  'link web': citeWeb$e,
  'literatur': literatur,
  'web cite': citeWeb$e,
};

const data$i = { aliases: aliases$i, infoboxes: infoboxes$i, parsers: parsers$i };

const plugin$j = (_models, templates, boxes) => register(data$i, templates, boxes);
plugin$j.lang = 'ro';
plugin$j.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// russian template names → the core template they resolve to
const aliases$h = {
  'bandiera': 'flagicon',
  'catmain': 'main',
  'cc': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coord-simple': 'coord',
  'coord/display': 'coord',
  'coord/link': 'coord',
  'coord/linkprint': 'coord',
  'coord/печать': 'coord',
  'fbaicon': 'flagicon',
  'flag icon': 'flagicon',
  'harvnp': 'sfn',
  'ipa1': 'ipa',
  'location': 'coord',
  'main articles': 'main',
  'mainarticle': 'main',
  'maincat': 'main',
  'odn': 'sfn',
  'portail': 'portal',
  'portal-inline': 'portal',
  'portale': 'portal',
  'portalpar': 'portal',
  'see main': 'main',
  'sfb': 'sfn',
  'sfn-1': 'sfn',
  'sfnb': 'sfn',
  'sfnp': 'sfn',
  'викисклад-кат': 'commons cat',
  'главная': 'main',
  'главная статья': 'main',
  'главное': 'main',
  'координаты': 'coord',
  'координаты объекта': 'coord',
  'мфа': 'ipa',
  'нихонго': 'nihongo',
  'общая тема категории': 'main',
  'основная': 'main',
  'основная статья': 'main',
  'основная статья категории': 'main',
  'основная статья по теме категории': 'main',
  'основная статья раздела': 'main',
  'основные статьи': 'main',
  'портал': 'portal',
  'портал 2': 'portal',
  'портал2': 'portal',
  'примечания': 'reflist',
  'родилась': 'birth date and age',
  'родился': 'birth date and age',
  'список примечаний': 'reflist',
  'флаг': 'flagicon',
  'ыат': 'sfn',
};

const infoboxes$h = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$d = translate('cite book', {
  'год': 'year',
  'автор': 'author',
  'ответственный': 'editor',
  'editor1': 'editor',
  'часть': 'chapter',
  'заглавие': 'title',
  'ссылка': 'url',
  'издание': 'edition',
  'место': 'location',
  'издательство': 'publisher',
  'id': 'isbn',
  'lang': 'language',
});
const citeJournal$5 = translate('cite journal', {
  'год': 'year',
  'lang': 'language',
});
const citeWeb$d = translate('cite web', {
  'datepublished': 'date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
});
const internetquelle$9 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'datepublished': 'date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
});

const parsers$h = {
  'cita libro': citeBook$d,
  'cita publicación': citeJournal$5,
  'cita web': citeWeb$d,
  'cite mag': citeJournal$5,
  'cite magazine': citeJournal$5,
  'cite paper': citeJournal$5,
  'cite periodical': citeJournal$5,
  'cite work': citeBook$d,
  'citejournal': citeJournal$5,
  'citeweb': citeWeb$d,
  'cw': citeWeb$d,
  'cytuj książkę': citeBook$d,
  'internetquelle': internetquelle$9,
  'веб-сайт': citeWeb$d,
};

const data$h = { aliases: aliases$h, infoboxes: infoboxes$h, parsers: parsers$h };

const plugin$i = (_models, templates, boxes) => register(data$h, templates, boxes);
plugin$i.lang = 'ru';
plugin$i.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// serbo-croatian template names → the core template they resolve to
const aliases$g = {
  'category commons': 'commons cat',
  'cite journal2': 'cite journal',
  'citiranje časopisa': 'cite journal',
  'commons category': 'commons cat',
  'commons category-lat': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat-lat': 'commons cat',
  'commonscategory': 'commons cat',
  'datum rođenja i godine': 'birth date and age',
  'flag icon': 'flagicon',
  'glavni': 'main',
  'glavni članak': 'main',
  'glavni-lat': 'main',
  'ikonazastave': 'flagicon',
  'izvori': 'reflist',
  'kategorija na ostavi': 'commons cat',
  'main article-lat': 'main',
  'main-lat': 'main',
  'mainarticle': 'main',
  'malo': 'small',
  'mfa': 'ipa',
  'ostava': 'commons cat',
  'portal-lat': 'portal',
  'poseban članak': 'main',
  'ref-list': 'reflist',
  'reference': 'reflist',
  'reflista': 'reflist',
  'refs': 'reflist',
  'refspisak': 'reflist',
  'spisref': 'reflist',
  'spremnik': 'commons cat',
  'startdate': 'start',
  'zas': 'flagicon',
  'zastava': 'flag',
  'zd': 'flagicon',
  'zid': 'flag',
  'зд': 'flagicon',
  'извори': 'reflist',
  'ипа': 'ipa',
  'координате': 'coord',
  'маин': 'main',
  'мфа': 'ipa',
  'рефлист': 'reflist',
};

// names recognised as infoboxes
const infoboxes$g = [
  'infokutija takson',
  'infokutija taksonomija',
  'infokvir takson',
  'infokvir taksonomija',
  'infookvir takson',
  'infookvir taksonomija',
  'taksokvir',
  'taksonomska infokutija',
  'taksonomska kutija',
  'taksonomski infokvir',
  'taksonomski infookvir',
  'taksonomski okvir',
  'taxobox-lat',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$c = translate('cite book', {
  'author-last': 'author',
  'surname': 'author',
  'subject': 'author',
  'author1-last': 'author',
  'author-last1': 'author',
  'surname1': 'author',
  'subject1': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
});
const citeWeb$c = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$g = {
  'book reference': citeBook$c,
  'cite web-lat': citeWeb$c,
  'citebook': citeBook$c,
  'citeweb': citeWeb$c,
  'citiranje knjige': citeBook$c,
  'citiranje weba': citeWeb$c,
  'knjiga': citeBook$c,
  'knjiga (sr)': citeBook$c,
  'web cite': citeWeb$c,
  'web reference': citeWeb$c,
};

const data$g = { aliases: aliases$g, infoboxes: infoboxes$g, parsers: parsers$g };

const plugin$h = (_models, templates, boxes) => register(data$g, templates, boxes);
plugin$h.lang = 'sh';
plugin$h.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// simple-english template names → the core template they resolve to
const aliases$f = {
  'bibisbn': 'cite journal',
  'birthdate and age': 'birth date and age',
  'birthdateandage': 'birth date and age',
  'c cat': 'commons cat',
  'category commons': 'commons cat',
  'ccat': 'commons cat',
  'citejournal': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat2': 'commons cat',
  'commonscategory': 'commons cat',
  'commonsimages cat': 'commons cat',
  'coor at dms': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'flag country': 'flag',
  'flag icon': 'flagicon',
  'flagiconb': 'flagicon',
  'footnotes': 'reflist',
  'hurricane main': 'main',
  'jp': 'nihongo',
  'location': 'coord',
  'main articles': 'main',
  'mainarticle': 'main',
  'nihongo4': 'nihongo',
  'portal box': 'portal',
  'ref list': 'reflist',
  'reference': 'reflist',
  'reference list': 'reflist',
  'refs': 'reflist',
  'release date': 'start',
  'rflist': 'reflist',
  'snf': 'sfn',
  'start year': 'start',
  'startdate': 'start',
  'wikimedia commons cat': 'commons cat',
};

// names recognised as infoboxes
const infoboxes$f = [
  'tx',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$b = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const citeWeb$b = translate('cite web', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'people': 'authors',
  'host': 'authors',
});
const citation$4 = translate('citation', {
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'periodical': 'website',
  'number': 'issue',
  'place': 'location',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'editors': 'editor',
});
const internetquelle$8 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'people': 'authors',
  'host': 'authors',
});

const parsers$f = {
  'book source': citeBook$b,
  'cita web': citeWeb$b,
  'cite manual': citeBook$b,
  'cite study': citation$4,
  'cite web/german': citeWeb$b,
  'cite website': citeWeb$b,
  'cite work': citeBook$b,
  'citebook': citeBook$b,
  'citebooks': citeBook$b,
  'citeweb': citeWeb$b,
  'internetquelle': internetquelle$8,
  'web link': citeWeb$b,
  'web-cite': citeWeb$b,
};

const data$f = { aliases: aliases$f, infoboxes: infoboxes$f, parsers: parsers$f };

const plugin$g = (_models, templates, boxes) => register(data$f, templates, boxes);
plugin$g.lang = 'simple';
plugin$g.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// slovak template names → the core template they resolve to
const aliases$e = {
  'citácia elektronického dokumentu': 'cite web',
  'citácia harvard': 'citation',
  'citácia knihy': 'cite book',
  'citácia periodika': 'cite journal',
  'commonscat': 'commons cat',
  'dnv': 'birth date and age',
  'dátum narodenia a vek': 'birth date and age',
  'hlavný článok': 'main',
  'malé': 'small',
  'minivlajka': 'flagicon',
  'portál': 'portal',
  'referencie': 'reflist',
  'súradnice': 'coord',
};

const infoboxes$e = [];

const parsers$e = {};

const data$e = { aliases: aliases$e, infoboxes: infoboxes$e, parsers: parsers$e };

const plugin$f = (_models, templates, boxes) => register(data$e, templates, boxes);
plugin$f.lang = 'sk';
plugin$f.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// slovenian template names → the core template they resolve to
const aliases$d = {
  'cite newspaper': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coords': 'coord',
  'country': 'flag',
  'datum rojstva in starost': 'birth date and age',
  'flag icon': 'flagicon',
  'geopolje koor/peskovnik': 'coord',
  'glavni': 'main',
  'glavno': 'main',
  'ikona zastave': 'flagicon',
  'ikonazastave': 'flagicon',
  'kategorija v zbirki': 'commons cat',
  'katzbirke': 'commons cat',
  'koord': 'coord',
  'koord novi': 'coord',
  'main articles': 'main',
  'navedi časopis': 'cite journal',
  'portal box': 'portal',
  'portalpar': 'portal',
  'refsez': 'reflist',
  'seznam referenc': 'reflist',
  'shortened footnote template': 'sfn',
  'sklici': 'reflist',
  'zastava': 'flag',
  'začetni datum': 'start',
};

// names recognised as infoboxes
const infoboxes$d = [
  'taksonomka',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citation$3 = translate('citation', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'host': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'periodical': 'website',
  'number': 'issue',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'place': 'location',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
});
const citeWeb$a = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const internetquelle$7 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeBook$a = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
});

const parsers$d = {
  'citat': citation$3,
  'citat/new': citation$3,
  'citation/new': citation$3,
  'cite sports-reference': citeWeb$a,
  'cite website': citeWeb$a,
  'citeweb': citeWeb$a,
  'internetquelle': internetquelle$7,
  'navedi citat': citation$3,
  'navedi knjigo': citeBook$a,
  'navedi knjigo/lua': citeBook$a,
  'navedi splet': citeWeb$a,
  'navedi splet/lua': citeWeb$a,
  'navedi splet/old': citeWeb$a,
  'test-cite web': citeWeb$a,
};

const data$d = { aliases: aliases$d, infoboxes: infoboxes$d, parsers: parsers$d };

const plugin$e = (_models, templates, boxes) => register(data$d, templates, boxes);
plugin$e.lang = 'sl';
plugin$e.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// albanian template names → the core template they resolve to
const aliases$c = {
  'artikulli kryesor': 'main',
  'birth date and age/femër': 'birth date and age',
  'birth date and age/mashkull': 'birth date and age',
  'cito revistë shk': 'cite journal',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'coordinates': 'coord',
  'date of birth and age': 'birth date and age',
  'ditëlindja dhe mosha': 'birth date and age',
  'ditëlindja dhe mosha/femër': 'birth date and age',
  'ditëlindja dhe mosha/mashkull': 'birth date and age',
  'dlm': 'birth date and age',
  'dm': 'birth date and age',
  'kryesor': 'main',
  'kryesore': 'main',
  'referencat': 'reflist',
  'referime': 'reflist',
  'sapi': 'ipa',
};

const infoboxes$c = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citation$2 = translate('citation', {
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'periodical': 'website',
  'number': 'issue',
  'place': 'location',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
});
const citeWeb$9 = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'gjuha': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
});
const internetquelle$6 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'gjuha': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
});

const parsers$c = {
  'citim': citation$2,
  'cito uebin': citeWeb$9,
  'cito web': citeWeb$9,
  'internetquelle': internetquelle$6,
};

const data$c = { aliases: aliases$c, infoboxes: infoboxes$c, parsers: parsers$c };

const plugin$d = (_models, templates, boxes) => register(data$c, templates, boxes);
plugin$d.lang = 'sq';
plugin$d.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// serbian template names → the core template they resolve to
const aliases$b = {
  'ccat': 'commons cat',
  'ccat-lat': 'commons cat',
  'citation/lua': 'citation',
  'cite paper': 'cite journal',
  'citiranje časopisa': 'cite journal',
  'commons category': 'commons cat',
  'commons category-lat': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat-lat': 'commons cat',
  'comprehensive': 'main',
  'coor at dm': 'coord',
  'coor d': 'coord',
  'coor dm2': 'coord',
  'coor title dm': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'coorheader': 'coord',
  'country': 'flag',
  'cytuj': 'citation',
  'flag icon': 'flagicon',
  'full article': 'main',
  'kategorija na ostavi-lat': 'commons cat',
  'koord': 'coord',
  'launch date': 'start',
  'location': 'coord',
  'main articles': 'main',
  'main page': 'main',
  'mainarticle': 'main',
  'portal box': 'portal',
  'readmain': 'main',
  'reflista': 'reflist',
  'release date': 'start',
  'see main': 'main',
  'seemain': 'main',
  'zid': 'flag',
  'главни': 'main',
  'главни чланак': 'main',
  'главни чланци': 'main',
  'главничланак': 'main',
  'датум почетка': 'start',
  'датум рођења': 'birth date and age',
  'зас': 'flagicon',
  'застава': 'flag',
  'извор': 'sfn',
  'извори': 'reflist',
  'категорија на остави': 'commons cat',
  'коор наслов': 'coord',
  'координате': 'coord',
  'координате горе': 'coord',
  'мало': 'small',
  'мфа': 'ipa',
  'наводи': 'reflist',
  'портал': 'portal',
  'портал2': 'portal',
  'посебан чланак': 'main',
  'почетни датум': 'start',
  'референца': 'sfn',
  'референце': 'reflist',
  'списреф': 'reflist',
  'умањено': 'small',
  'умањи': 'small',
};

const infoboxes$b = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$8 = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const citeBook$9 = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const internetquelle$5 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});

const parsers$b = {
  'cita web': citeWeb$8,
  'cite chapter': citeBook$9,
  'cite manual': citeBook$9,
  'cite website': citeWeb$8,
  'cite work': citeBook$9,
  'citebook': citeBook$9,
  'citeweb': citeWeb$8,
  'citiranje weba': citeWeb$8,
  'internetquelle': internetquelle$5,
  'web cite': citeWeb$8,
  'web kaynağı': citeWeb$8,
  'цитат веба': citeWeb$8,
  'ците веб': citeWeb$8,
  'цитирање књиге': citeBook$9,
};

const data$b = { aliases: aliases$b, infoboxes: infoboxes$b, parsers: parsers$b };

const plugin$c = (_models, templates, boxes) => register(data$b, templates, boxes);
plugin$c.lang = 'sr';
plugin$c.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// swedish template names → the core template they resolve to
const aliases$a = {
  '+portal': 'portal',
  'catmore': 'main',
  'cite letter': 'citation',
  'citebook': 'cite book',
  'citejournal': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat-rad': 'commons cat',
  'commonskat': 'commons cat',
  'commonskategori': 'commons cat',
  'coor d': 'coord',
  'coor title dm': 'coord',
  'flag icon': 'flagicon',
  'flagg': 'flag',
  'flagga': 'flag',
  'flaggbild': 'flagicon',
  'flaggikon': 'flagicon',
  'födelsedatumochålder': 'birth date and age',
  'huvud': 'main',
  'huvudartikel': 'main',
  'huvudartikel saknas': 'main',
  'huvudartikeln': 'main',
  'huvudartiklar': 'main',
  'huvudartiklel': 'main',
  'huvudsida': 'main',
  'huvudsidor': 'main',
  'katmer': 'main',
  'koor': 'coord',
  'koor d': 'coord',
  'koord': 'coord',
  'koordinat': 'coord',
  'koordinat2': 'coord',
  'källa www': 'cite web',
  'location': 'coord',
  'portal länk': 'portal',
  'portalbox': 'portal',
  'sammanfattning': 'main',
  'startdatum': 'start',
  'ursprunglig artikel': 'main',
  'vidare information': 'main',
  'ålder': 'birth date and age',
};

const infoboxes$a = [];

const parsers$a = {};

const data$a = { aliases: aliases$a, infoboxes: infoboxes$a, parsers: parsers$a };

const plugin$b = (_models, templates, boxes) => register(data$a, templates, boxes);
plugin$b.lang = 'sv';
plugin$b.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// tamil template names → the core template they resolve to
const aliases$9 = {
  'birthdate and age': 'birth date and age',
  'ccat': 'commons cat',
  'cite gazette': 'citation',
  'commoncat': 'commons cat',
  'commons category': 'commons cat',
  'commons+cat': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'coor at d': 'coord',
  'coor at dm': 'coord',
  'coor at dms': 'coord',
  'coor d': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'flag icon': 'flagicon',
  'main articles': 'main',
  'mainarticle': 'main',
  'portalpar': 'portal',
  'ref list': 'reflist',
  'refs': 'reflist',
  'seemain': 'main',
  'snf': 'sfn',
  'startdate': 'start',
  'கொடி': 'flag',
  'சான்று': 'reflist',
  'பிறப்பும் அகவையும்': 'birth date and age',
  'புவியியல் அமைவு': 'coord',
  'முதன்மை': 'main',
  'முதன்மைக் கட்டுரை': 'main',
  'மேற்கோள்பட்டியல்': 'reflist',
  'வலைவாசல்': 'portal',
};

const infoboxes$9 = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$8 = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
});
const citeJournal$4 = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$9 = {
  'cite books': citeBook$8,
  'cite paper': citeJournal$4,
  'citebook': citeBook$8,
  'citejournal': citeJournal$4,
};

const data$9 = { aliases: aliases$9, infoboxes: infoboxes$9, parsers: parsers$9 };

const plugin$a = (_models, templates, boxes) => register(data$9, templates, boxes);
plugin$a.lang = 'ta';
plugin$a.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// telugu template names → the core template they resolve to
const aliases$8 = {
  'ccat': 'commons cat',
  'cite paper': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor at d': 'coord',
  'coor at dm': 'coord',
  'coor at dms': 'coord',
  'coor title d': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'flag icon': 'flagicon',
  'launch date': 'start',
  'main2': 'main',
  'mainarticle': 'main',
  'refs': 'reflist',
  'release date': 'start',
  'seemain': 'main',
  'shortened footnote template': 'sfn',
  'చిన్న': 'small',
  'పతాకం': 'flag',
  'మూలాల జాబితా': 'reflist',
  'మూలాలజాబితా': 'reflist',
  'మూలాలు': 'reflist',
};

const infoboxes$8 = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$7 = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
});
const citeWeb$7 = translate('cite web', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'people': 'authors',
  'host': 'authors',
});

const parsers$8 = {
  'book reference': citeBook$7,
  'cite blog': citeWeb$7,
  'citebook': citeBook$7,
  'citeweb': citeWeb$7,
  'web reference': citeWeb$7,
  'వెబ్ మూలము': citeWeb$7,
};

const data$8 = { aliases: aliases$8, infoboxes: infoboxes$8, parsers: parsers$8 };

const plugin$9 = (_models, templates, boxes) => register(data$8, templates, boxes);
plugin$9.lang = 'te';
plugin$9.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// thai template names → the core template they resolve to
const aliases$7 = {
  'cc': 'commons cat',
  'cite paper': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coordinates': 'coord',
  'coords': 'coord',
  'date of birth and age': 'birth date and age',
  'flag icon': 'flagicon',
  'geobox coor': 'coord',
  'lang-jpn': 'nihongo',
  'location dec': 'coord',
  'mainarticle': 'main',
  'nhg': 'nihongo',
  'nhg1': 'nihongo',
  'portal box': 'portal',
  'refist': 'reflist',
  'release date': 'start',
  'snf': 'sfn',
  'คอมมอนส์-หมวดหมู่': 'commons cat',
  'คอมมอนส์หมวดหมู่': 'commons cat',
  'ญป': 'nihongo',
  'ญี่ปุ่น': 'nihongo',
  'ดูบทความหลัก': 'main',
  'ธง': 'flagicon',
  'ธง-ประเทศ': 'flag',
  'บทความหลัก': 'main',
  'บทความหลัก2': 'main',
  'รายการอ้างอิง': 'reflist',
  'สถานีย่อย': 'portal',
  'สถานีย่อย2': 'portal',
  'หมวดหมู่คอมมอนส์': 'commons cat',
  'หลัก': 'main',
  'เล็ก': 'small',
  '生年月日と年齢': 'birth date and age',
};

// names recognised as infoboxes
const infoboxes$7 = [
  'ตารางจำแนกพันธุ์',
  'พฤกษศาสตร์',
  'สัตววิทยา',
  'อนุกรมภิธาน',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$6 = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeBook$6 = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
});
const internetquelle$4 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$7 = {
  'cita web': citeWeb$6,
  'citar web': citeWeb$6,
  'cite blog': citeWeb$6,
  'cite manual': citeBook$6,
  'cite web/german': citeWeb$6,
  'cite webpage': citeWeb$6,
  'cite website': citeWeb$6,
  'cite work': citeBook$6,
  'cite หนังสือ': citeBook$6,
  'cite-web': citeWeb$6,
  'citebook': citeBook$6,
  'citeweb': citeWeb$6,
  'cw': citeWeb$6,
  'internetquelle': internetquelle$4,
};

const data$7 = { aliases: aliases$7, infoboxes: infoboxes$7, parsers: parsers$7 };

const plugin$8 = (_models, templates, boxes) => register(data$7, templates, boxes);
plugin$8.lang = 'th';
plugin$8.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// turkish template names → the core template they resolve to
const aliases$6 = {
  'ana': 'main',
  'ana madde': 'main',
  'anamadde': 'main',
  'bayrak': 'flag',
  'bayraksimge': 'flagicon',
  'başlama tarihi': 'start',
  'başlangıç tarihi': 'start',
  'category main article': 'main',
  'catmain': 'main',
  'commons category': 'commons cat',
  'commons kategori': 'commons cat',
  'commons kategorisi': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'commonskat': 'commons cat',
  'coor title dm': 'coord',
  'coords': 'coord',
  'doğum tarihi ve yaşı': 'birth date and age',
  'doğum-tarihi ve yaşı': 'birth date and age',
  'flag icon': 'flagicon',
  'geobox coor': 'coord',
  'i̇pa': 'ipa',
  'i̇sbn': 'isbn',
  'kat': 'main',
  'kategori ana maddesi': 'main',
  'kategori açıklaması': 'main',
  'kaynak listesi': 'reflist',
  'kaynakca': 'reflist',
  'kaynakça': 'reflist',
  'kdn': 'sfn',
  'kdş': 'sfn',
  'koor başlık dm': 'coord',
  'koor dms': 'coord',
  'koordinat': 'coord',
  'koordinatlar': 'coord',
  'kuruluş tarihi': 'start',
  'küçük': 'small',
  'referanslar': 'reflist',
  'reference': 'reflist',
  'references': 'reflist',
  'refs': 'reflist',
  'snf': 'sfn',
};

// names recognised as infoboxes
const infoboxes$6 = [
  'takso kutu',
  'takso kutusu',
  'taksokutu',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$3 = translate('cite journal', {
  'katkı-url': 'url',
  'başlık': 'title',
  'erişimtarihi': 'access-date',
  'accessdate': 'access-date',
  'erişim-tarihi': 'access-date',
  'erişim tarihi': 'access-date',
  'arşivtarihi': 'archive-date',
  'archivedate': 'archive-date',
  'arşiv-tarihi': 'archive-date',
  'yazarlar': 'authors',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
  'yazars': 'authors',
  'katkıdabulunanlar': 'authors',
  'muhataplar': 'authors',
  'kişiler': 'authors',
  'arşivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arşiv-url': 'archive-url',
  'kısım': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'makale': 'chapter',
  'madde': 'chapter',
  'tarih': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'sayı': 'issue',
  'number': 'issue',
  'dil': 'language',
  'in': 'language',
  'sayfa': 'page',
  'p': 'page',
  's': 'page',
  'sayfalar': 'pages',
  'pp': 'pages',
  'ss': 'pages',
  'yer': 'location',
  'place': 'location',
  'konum': 'location',
  'sürüm': 'edition',
  'basım': 'edition',
  'baskı': 'edition',
  'yayıncı': 'publisher',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'yayımcı': 'publisher',
  'çağrıişareti': 'publisher',
  'habergrubu': 'publisher',
  'alıntı': 'quote',
  'quotation': 'quote',
  'çeviribaşlık': 'trans-title',
  'trans_title': 'trans-title',
  'çeviri-başlık': 'trans-title',
  'çeviri_başlık': 'trans-title',
  'yıl': 'year',
  'sene': 'year',
  'cilt': 'volume',
  'ad': 'first',
  'given': 'first',
  'adı': 'first',
  'author-first#': 'first',
  'author#-first': 'first',
  'yazarlistesi-ad#': 'first',
  'ilk#': 'first',
  'muhatapadı#': 'first',
  'soyadı': 'author',
  'surname': 'author',
  'author-last#': 'author',
  'author#-last': 'author',
  'subject#': 'author',
  'son#': 'author',
  'yazarlistesi-soyadı#': 'author',
  'yazar#': 'author',
  'yazar': 'author',
  'muhatap#': 'author',
  'muhatapsoyadı#': 'author',
  'özne#': 'author',
  'süje#': 'author',
  'konu#': 'author',
  'çalışma': 'website',
  'periyodik': 'website',
  'periodical': 'website',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'dergi': 'website',
  'gazete': 'website',
  'eser': 'website',
  'iş': 'website',
  'websitesi': 'website',
  'süreliyayın': 'website',
  'sözlük': 'website',
  'ad1': 'first1',
  'soyadı1': 'last1',
});
const citeWeb$5 = translate('cite web', {
  'katkı-url': 'url',
  'başlık': 'title',
  'erişimtarihi': 'access-date',
  'accessdate': 'access-date',
  'erişim-tarihi': 'access-date',
  'erişim tarihi': 'access-date',
  'arşivtarihi': 'archive-date',
  'archivedate': 'archive-date',
  'arşiv-tarihi': 'archive-date',
  'yazarlar': 'authors',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
  'yazars': 'authors',
  'katkıdabulunanlar': 'authors',
  'muhataplar': 'authors',
  'kişiler': 'authors',
  'arşivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arşiv-url': 'archive-url',
  'kısım': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'makale': 'chapter',
  'madde': 'chapter',
  'tarih': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'sayı': 'issue',
  'number': 'issue',
  'dil': 'language',
  'in': 'language',
  'sayfa': 'page',
  'p': 'page',
  's': 'page',
  'sayfalar': 'pages',
  'pp': 'pages',
  'ss': 'pages',
  'yer': 'location',
  'place': 'location',
  'konum': 'location',
  'yayıncı': 'publisher',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'yayımcı': 'publisher',
  'çağrıişareti': 'publisher',
  'habergrubu': 'publisher',
  'alıntı': 'quote',
  'quotation': 'quote',
  'seri': 'edition',
  'series': 'edition',
  'version': 'edition',
  'versiyon': 'edition',
  'sürüm': 'edition',
  'çeviribaşlık': 'trans-title',
  'trans_title': 'trans-title',
  'çeviri-başlık': 'trans-title',
  'çeviri_başlık': 'trans-title',
  'yıl': 'year',
  'sene': 'year',
  'cilt': 'volume',
  'ad': 'first',
  'given': 'first',
  'author-first#': 'first',
  'author#-first': 'first',
  'yazarlistesi-ad#': 'first',
  'ilk#': 'first',
  'muhatapadı#': 'first',
  'soyadı': 'author',
  'surname': 'author',
  'author-last#': 'author',
  'author#-last': 'author',
  'subject#': 'author',
  'son#': 'author',
  'yazarlistesi-soyadı#': 'author',
  'yazar#': 'author',
  'yazar': 'author',
  'muhatap#': 'author',
  'muhatapsoyadı#': 'author',
  'özne#': 'author',
  'süje#': 'author',
  'konu#': 'author',
  'çalışma': 'website',
  'periyodik': 'website',
  'periodical': 'website',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'dergi': 'website',
  'gazete': 'website',
  'eser': 'website',
  'iş': 'website',
  'websitesi': 'website',
  'süreliyayın': 'website',
  'sözlük': 'website',
  'ad1': 'first1',
  'soyadı1': 'last1',
});
const internetquelle$3 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'katkı-url': 'url',
  'başlık': 'title',
  'erişimtarihi': 'access-date',
  'accessdate': 'access-date',
  'erişim-tarihi': 'access-date',
  'erişim tarihi': 'access-date',
  'arşivtarihi': 'archive-date',
  'archivedate': 'archive-date',
  'arşiv-tarihi': 'archive-date',
  'yazarlar': 'authors',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
  'yazars': 'authors',
  'katkıdabulunanlar': 'authors',
  'muhataplar': 'authors',
  'kişiler': 'authors',
  'arşivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arşiv-url': 'archive-url',
  'kısım': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'makale': 'chapter',
  'madde': 'chapter',
  'tarih': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'sayı': 'issue',
  'number': 'issue',
  'dil': 'language',
  'in': 'language',
  'sayfa': 'page',
  'p': 'page',
  's': 'page',
  'sayfalar': 'pages',
  'pp': 'pages',
  'ss': 'pages',
  'yer': 'location',
  'place': 'location',
  'konum': 'location',
  'yayıncı': 'publisher',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'yayımcı': 'publisher',
  'çağrıişareti': 'publisher',
  'habergrubu': 'publisher',
  'alıntı': 'quote',
  'quotation': 'quote',
  'seri': 'edition',
  'series': 'edition',
  'version': 'edition',
  'versiyon': 'edition',
  'sürüm': 'edition',
  'çeviribaşlık': 'trans-title',
  'trans_title': 'trans-title',
  'çeviri-başlık': 'trans-title',
  'çeviri_başlık': 'trans-title',
  'yıl': 'year',
  'sene': 'year',
  'cilt': 'volume',
  'ad': 'first',
  'given': 'first',
  'author-first#': 'first',
  'author#-first': 'first',
  'yazarlistesi-ad#': 'first',
  'ilk#': 'first',
  'muhatapadı#': 'first',
  'soyadı': 'author',
  'surname': 'author',
  'author-last#': 'author',
  'author#-last': 'author',
  'subject#': 'author',
  'son#': 'author',
  'yazarlistesi-soyadı#': 'author',
  'yazar#': 'author',
  'yazar': 'author',
  'muhatap#': 'author',
  'muhatapsoyadı#': 'author',
  'özne#': 'author',
  'süje#': 'author',
  'konu#': 'author',
  'çalışma': 'website',
  'periyodik': 'website',
  'periodical': 'website',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'dergi': 'website',
  'gazete': 'website',
  'eser': 'website',
  'iş': 'website',
  'websitesi': 'website',
  'süreliyayın': 'website',
  'sözlük': 'website',
  'ad1': 'first1',
  'soyadı1': 'last1',
});
const citation$1 = translate('citation', {
  'katkı-url': 'url',
  'başlık': 'title',
  'erişimtarihi': 'access-date',
  'accessdate': 'access-date',
  'erişim-tarihi': 'access-date',
  'erişim tarihi': 'access-date',
  'arşivtarihi': 'archive-date',
  'archivedate': 'archive-date',
  'arşiv-tarihi': 'archive-date',
  'yazarlar': 'authors',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
  'yazars': 'authors',
  'katkıdabulunanlar': 'authors',
  'muhataplar': 'authors',
  'kişiler': 'authors',
  'arşivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arşiv-url': 'archive-url',
  'tarih': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'sayı': 'issue',
  'number': 'issue',
  'dil': 'language',
  'in': 'language',
  'sayfa': 'page',
  'p': 'page',
  's': 'page',
  'sayfalar': 'pages',
  'pp': 'pages',
  'ss': 'pages',
  'yer': 'location',
  'place': 'location',
  'konum': 'location',
  'sürüm': 'edition',
  'basım': 'edition',
  'baskı': 'edition',
  'yayıncı': 'publisher',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'yayımcı': 'publisher',
  'çağrıişareti': 'publisher',
  'habergrubu': 'publisher',
  'alıntı': 'quote',
  'quotation': 'quote',
  'çeviribaşlık': 'trans-title',
  'trans_title': 'trans-title',
  'çeviri-başlık': 'trans-title',
  'çeviri_başlık': 'trans-title',
  'yıl': 'year',
  'sene': 'year',
  'cilt': 'volume',
  'çalışma': 'website',
  'periyodik': 'website',
  'periodical': 'website',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'dergi': 'website',
  'gazete': 'website',
  'eser': 'website',
  'iş': 'website',
  'websitesi': 'website',
  'süreliyayın': 'website',
  'sözlük': 'website',
  'ad': 'first',
  'given': 'first',
  'author-first#': 'first',
  'author#-first': 'first',
  'yazarlistesi-ad#': 'first',
  'ilk#': 'first',
  'muhatapadı#': 'first',
  'soyadı': 'author',
  'surname': 'author',
  'author-last#': 'author',
  'author#-last': 'author',
  'subject#': 'author',
  'son#': 'author',
  'yazarlistesi-soyadı#': 'author',
  'yazar#': 'author',
  'yazar': 'author',
  'muhatap#': 'author',
  'muhatapsoyadı#': 'author',
  'özne#': 'author',
  'süje#': 'author',
  'konu#': 'author',
  'bölüm': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'makale': 'chapter',
  'madde': 'chapter',
  'kısım': 'chapter',
  'episode': 'chapter',
  'ad1': 'first1',
  'soyadı1': 'last1',
});
const citeBook$5 = translate('cite book', {
  'katkı-url': 'url',
  'başlık': 'title',
  'erişimtarihi': 'access-date',
  'accessdate': 'access-date',
  'erişim-tarihi': 'access-date',
  'erişim tarihi': 'access-date',
  'arşivtarihi': 'archive-date',
  'archivedate': 'archive-date',
  'arşiv-tarihi': 'archive-date',
  'yazarlar': 'authors',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
  'yazars': 'authors',
  'katkıdabulunanlar': 'authors',
  'muhataplar': 'authors',
  'kişiler': 'authors',
  'arşivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arşiv-url': 'archive-url',
  'kısım': 'chapter',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'makale': 'chapter',
  'madde': 'chapter',
  'tarih': 'date',
  'air-date': 'date',
  'airdate': 'date',
  'sayı': 'issue',
  'number': 'issue',
  'dil': 'language',
  'in': 'language',
  'sayfa': 'page',
  'p': 'page',
  's': 'page',
  'sayfalar': 'pages',
  'pp': 'pages',
  'ss': 'pages',
  'yer': 'location',
  'place': 'location',
  'konum': 'location',
  'yayıncı': 'publisher',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'yayımcı': 'publisher',
  'çağrıişareti': 'publisher',
  'habergrubu': 'publisher',
  'alıntı': 'quote',
  'quotation': 'quote',
  'seri': 'edition',
  'series': 'edition',
  'version': 'edition',
  'versiyon': 'edition',
  'sürüm': 'edition',
  'çeviribaşlık': 'trans-title',
  'trans_title': 'trans-title',
  'çeviri-başlık': 'trans-title',
  'çeviri_başlık': 'trans-title',
  'yıl': 'year',
  'sene': 'year',
  'cilt': 'volume',
  'ad': 'first',
  'given': 'first',
  'author-first#': 'first',
  'author#-first': 'first',
  'yazarlistesi-ad#': 'first',
  'ilk#': 'first',
  'muhatapadı#': 'first',
  'soyadı': 'author',
  'surname': 'author',
  'author-last#': 'author',
  'author#-last': 'author',
  'subject#': 'author',
  'son#': 'author',
  'yazarlistesi-soyadı#': 'author',
  'yazar#': 'author',
  'muhatap#': 'author',
  'muhatapsoyadı#': 'author',
  'özne#': 'author',
  'süje#': 'author',
  'konu#': 'author',
  'çalışma': 'website',
  'periyodik': 'website',
  'periodical': 'website',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'dergi': 'website',
  'gazete': 'website',
  'eser': 'website',
  'iş': 'website',
  'websitesi': 'website',
  'süreliyayın': 'website',
  'sözlük': 'website',
  'ad1': 'first1',
  'soyadı1': 'last1',
});

const parsers$6 = {
  'akademik dergi kaynağı': citeJournal$3,
  'cite science': citeJournal$3,
  'citeweb': citeWeb$5,
  'internetquelle': internetquelle$3,
  'i̇nternet kaynağı': citeWeb$5,
  'kaynak': citation$1,
  'kaynak kitap': citeBook$5,
  'kaynaklar': citation$1,
  'kitap kaynağı': citeBook$5,
  'kitapkaynağı': citeBook$5,
  'web cite': citeWeb$5,
  'web kaynağı': citeWeb$5,
  'webbref': citeWeb$5,
  'webkaynağı': citeWeb$5,
};

const data$6 = { aliases: aliases$6, infoboxes: infoboxes$6, parsers: parsers$6 };

const plugin$7 = (_models, templates, boxes) => register(data$6, templates, boxes);
plugin$7.lang = 'tr';
plugin$7.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// ukrainian template names → the core template they resolve to
const aliases$5 = {
  'citazione': 'citation',
  'cite citation': 'citation',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coord dm': 'coord',
  'coord2': 'coord',
  'coords': 'coord',
  'flag icon': 'flagicon',
  'geobox coor': 'coord',
  'geocoordenadas': 'coord',
  'initial release': 'start',
  'location': 'coord',
  'location dec': 'coord',
  'object location dec': 'coord',
  'odn': 'sfn',
  'petit': 'small',
  'portal box': 'portal',
  'pron': 'ipa',
  'pronounced': 'ipa',
  'przypisy': 'reflist',
  'ref-list': 'reflist',
  'references': 'reflist',
  'wikidatacoord': 'coord',
  'виноски': 'reflist',
  'главная': 'main',
  'головна': 'main',
  'головна стаття': 'main',
  'дата з віком': 'birth date and age',
  'дата рождения': 'birth date and age',
  'зноски': 'reflist',
  'координати': 'coord',
  'координати гм': 'coord',
  'координати гмс': 'coord',
  'мфа': 'ipa',
  'ніхонга': 'nihongo',
  'ніхонго': 'nihongo',
  'ніхонґо': 'nihongo',
  'основна стаття': 'main',
  'портал': 'portal',
  'прапор': 'flagicon',
  'прапорець': 'flagicon',
  'прапорець країни': 'flagicon',
  'прапорець20': 'flagicon',
  'примечания': 'reflist',
  'примітки': 'reflist',
  'флаг': 'flagicon',
};

// names recognised as infoboxes
const infoboxes$5 = [
  'організм',
  'таксобокс',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal$2 = translate('cite journal', {
  'назва': 'title',
  'дата': 'date',
  'журнал': 'journal',
  'рік': 'year',
  'trans_title': 'trans-title',
  'переклад-назви': 'trans-title',
  'цитата': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'розділ': 'chapter',
});
const citeWeb$4 = translate('cite web', {
  'назва': 'title',
  'прізвище1': 'author',
  'прізвище': 'author',
  'автор': 'author',
  'автор1': 'author',
  'ім\'я1': 'first',
  'ім\'я': 'first',
  'автори': 'authors',
  'дата': 'date',
  'рік': 'year',
  'editor-last': 'editor',
  'редактор-прізвище': 'editor',
  'редактор': 'editor',
  'editor1-last': 'editor',
  'редактор1-прізвище': 'editor',
  'веб-сайт': 'website',
  'вебсайт': 'website',
  'видавець': 'publisher',
  'видавництво': 'publisher',
  'розміщення': 'location',
  'сторінка': 'page',
  'сторінки': 'pages',
  'lang': 'language',
  'мовою': 'language',
  'мова': 'language',
  'цитата': 'quote',
  'дата-архіву': 'archive-date',
  'archivedate': 'archive-date',
  'url-архіву': 'archive-url',
  'archiveurl': 'archive-url',
  'дата-доступу': 'access-date',
  'accessdate': 'access-date',
  'переклад-назви': 'trans-title',
  'trans_title': 'trans-title',
});
const citeBook$4 = translate('cite book', {
  'назва': 'title',
  'переклад-назви': 'trans-title',
  'trans_title': 'trans-title',
  'прізвище1': 'author',
  'прізвище': 'author',
  'surname': 'author',
  'surname1': 'author',
  'author-last': 'author',
  'author1-last': 'author',
  'author-last1': 'author',
  'author-surname': 'author',
  'author1-surname': 'author',
  'author-surname1': 'author',
  'автор-прізвище': 'author',
  'автор1-прізвище': 'author',
  'автор-прізвище1': 'author',
  'ім\'я1': 'first',
  'ім\'я': 'first',
  'given': 'first',
  'given1': 'first',
  'author-given': 'first',
  'author1-given': 'first',
  'author-given1': 'first',
  'author-first': 'first',
  'author1-first': 'first',
  'author-first1': 'first',
  'автор-ім\'я': 'first',
  'автор1-ім\'я': 'first',
  'автор-ім\'я1': 'first',
  'дата': 'date',
  'рік': 'year',
  'editor-last': 'editor',
  'редактор-прізвище': 'editor',
  'редактор': 'editor',
  'редактори': 'editor',
  'editors': 'editor',
  'editor1-last': 'editor',
  'редактор1-прізвище': 'editor',
  'видавець': 'publisher',
  'видавництво': 'publisher',
  'розміщення': 'location',
  'сторінка': 'page',
  'сторінки': 'pages',
  'мовою': 'language',
  'цитата': 'quote',
  'розділ': 'chapter',
  'видання': 'edition',
  'том': 'volume',
  'url-архіву': 'archive-url',
  'archiveurl': 'archive-url',
  'дата-архіву': 'archive-date',
  'archivedate': 'archive-date',
  'дата-доступу': 'access-date',
  'accessdate': 'access-date',
});
const internetquelle$2 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'назва': 'title',
  'прізвище1': 'author',
  'прізвище': 'author',
  'автор': 'author',
  'автор1': 'author',
  'ім\'я1': 'first',
  'ім\'я': 'first',
  'автори': 'authors',
  'дата': 'date',
  'рік': 'year',
  'editor-last': 'editor',
  'редактор-прізвище': 'editor',
  'редактор': 'editor',
  'editor1-last': 'editor',
  'редактор1-прізвище': 'editor',
  'веб-сайт': 'website',
  'вебсайт': 'website',
  'видавець': 'publisher',
  'видавництво': 'publisher',
  'розміщення': 'location',
  'сторінка': 'page',
  'сторінки': 'pages',
  'lang': 'language',
  'мовою': 'language',
  'мова': 'language',
  'цитата': 'quote',
  'дата-архіву': 'archive-date',
  'archivedate': 'archive-date',
  'url-архіву': 'archive-url',
  'archiveurl': 'archive-url',
  'дата-доступу': 'access-date',
  'accessdate': 'access-date',
  'переклад-назви': 'trans-title',
  'trans_title': 'trans-title',
});

const parsers$5 = {
  'article': citeJournal$2,
  'citace elektronické monografie': citeWeb$4,
  'citar web': citeWeb$4,
  'citat web': citeWeb$4,
  'cite blog': citeWeb$4,
  'cite manual': citeBook$4,
  'cite url': citeWeb$4,
  'cite web/de': citeWeb$4,
  'cite web/uk': citeWeb$4,
  'cite work': citeBook$4,
  'cite книга': citeBook$4,
  'cite-web': citeWeb$4,
  'cited journal': citeJournal$2,
  'cited web': citeWeb$4,
  'citeer web': citeWeb$4,
  'citejournal': citeJournal$2,
  'citeweb': citeWeb$4,
  'cw': citeWeb$4,
  'internetquelle': internetquelle$2,
  'lien web': citeWeb$4,
  'ref-publicació': citeJournal$2,
  'ref-web': citeWeb$4,
  'site web': citeWeb$4,
  'tīmekļa atsauce': citeWeb$4,
  'vcite2 journal': citeJournal$2,
  'web citation': citeWeb$4,
  'web cite': citeWeb$4,
  'книгаапа': citeBook$4,
  'привести сайту': citeWeb$4,
  'цитувати журнал': citeJournal$2,
};

const data$5 = { aliases: aliases$5, infoboxes: infoboxes$5, parsers: parsers$5 };

const plugin$6 = (_models, templates, boxes) => register(data$5, templates, boxes);
plugin$6.lang = 'uk';
plugin$6.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// urdu template names → the core template they resolve to
const aliases$4 = {
  'ap': 'main',
  'article détaillé': 'main',
  'birth date ad age': 'birth date and age',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coord/conversion': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'date start': 'start',
  'flag icon': 'flagicon',
  'footnote': 'reflist',
  'footnotes': 'reflist',
  'footnotessmall': 'reflist',
  'foundation date': 'start',
  'initial release': 'start',
  'launch date': 'start',
  'listaref': 'reflist',
  'portal box': 'portal',
  'portal-2': 'portal',
  'portalbox': 'portal',
  'portalpar': 'portal',
  'ports': 'portal',
  're': 'reflist',
  'ref list': 'reflist',
  'ref-list': 'reflist',
  'reference': 'reflist',
  'reference list': 'reflist',
  'referencias': 'reflist',
  'refs': 'reflist',
  'release date': 'start',
  'références': 'reflist',
  'sf': 'sfn',
  'sfn-en': 'sfn',
  'sfnnb': 'sfn',
  'shortened footnote template': 'sfn',
  'startdate': 'start',
  'starting date': 'start',
  'آئی ایس بی این': 'isbn',
  'إحداثيات': 'coord',
  'اس': 'main',
  'اصل': 'main',
  'اصل مضمون': 'main',
  'اصل مقالہ': 'main',
  'العلم': 'flag',
  'ام': 'main',
  'انبار-رده': 'commons cat',
  'باب': 'portal',
  'باب 2': 'portal',
  'تاريخ الميلاد والعمر': 'birth date and age',
  'تاریخ آغاز': 'start',
  'تاریخ پیدائش اور عمر': 'birth date and age',
  'تاریخ-پیدائش اور عمر': 'birth date and age',
  'تفصیلی مضمون': 'main',
  'حوالا جات': 'reflist',
  'حوالہ جات': 'reflist',
  'حوالے': 'reflist',
  'زمرہ العام': 'commons cat',
  'زمرہ ویکی ذخائر': 'commons cat',
  'زمرہ کومنز': 'commons cat',
  'صغير': 'small',
  'صغیر': 'small',
  'متناسقاتی مقام': 'coord',
  'مراجع': 'reflist',
  'مرکزی مضمون': 'main',
  'مکمل مضمون': 'main',
  'مین': 'main',
  'ویکی ذخائر کا زمرہ': 'commons cat',
  'ویکی کومنز-زمرہ': 'commons cat',
  'پانویس': 'reflist',
  'پرچم': 'flag',
  'پرچم تصویر': 'flagicon',
  'چھوٹا': 'small',
  'کومنز زمرہ': 'commons cat',
  'আইএসবিএন': 'isbn',
};

// names recognised as infoboxes
const infoboxes$4 = [
  'تصنيف كائن',
  'خاعت',
  'خانہ معلومات پھل',
  'صندوق معلومات كائن',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$3 = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeJournal$1 = translate('cite journal', {
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeBook$3 = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
});

const parsers$4 = {
  'chú thích web': citeWeb$3,
  'cite blog': citeWeb$3,
  'cite paper': citeJournal$1,
  'cite website': citeWeb$3,
  'cite کتاب': citeBook$3,
  'citebook': citeBook$3,
  'citeweb': citeWeb$3,
  'kitap kaynağı': citeBook$3,
  'lien web': citeWeb$3,
  'web kaynağı': citeWeb$3,
  'استشهاد بدورية أكاديمية': citeJournal$1,
  'استشهاد بدورية محكمة': citeJournal$1,
  'استشهاد بكتاب': citeBook$3,
  'استشهاد بويب': citeWeb$3,
  'استشهاد ويب': citeWeb$3,
  'حوالہ جالبین': citeWeb$3,
  'حوالہ رسالہ': citeJournal$1,
  'حوالہ ویب': citeWeb$3,
  'حوالہ کتاب': citeBook$3,
  'حوالہ-جال': citeWeb$3,
  'حوالہ-کتاب': citeBook$3,
  'مرجع كتاب': citeBook$3,
  'یادکرد وب': citeWeb$3,
  'یادکرد کتاب': citeBook$3,
};

const data$4 = { aliases: aliases$4, infoboxes: infoboxes$4, parsers: parsers$4 };

const plugin$5 = (_models, templates, boxes) => register(data$4, templates, boxes);
plugin$5.lang = 'ur';
plugin$5.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// uzbek template names → the core template they resolve to
const aliases$3 = {
  'asosiy': 'main',
  'asosiy maqola': 'main',
  'bayroq': 'flag',
  'commons category': 'commons cat',
  'commons turkum': 'commons cat',
  'commonscat': 'commons cat',
  'country': 'flag',
  'ipa1': 'ipa',
  'isbn2': 'isbn',
  'koord': 'coord',
  'koordinata': 'coord',
  'manbalar': 'reflist',
  'nixonga': 'nihongo',
  'nixongo': 'nihongo',
  'tavallud sanasi va yoshi': 'birth date and age',
  'tugilgan sanasi va yoshi': 'birth date and age',
  'tugʻilgan sanasi va yoshi': 'birth date and age',
};

const infoboxes$3 = [];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb$2 = translate('cite web', {
  'sarlavha': 'title',
  'arxivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arxivsana': 'archive-date',
  'archivedate': 'archive-date',
  'muallif': 'author',
  'familiya': 'last',
  'ism': 'first',
  'sana': 'date',
  'yil': 'year',
  'muharrir': 'editor',
  'til': 'language',
  'ish': 'work',
  'sahifalar': 'pages',
  'nashriyot': 'publisher',
  'qaralgan sana': 'access-date',
  'accessdate': 'access-date',
  'iqtibos': 'quote',
});
const citeBook$2 = translate('cite book', {
  'accessdate': 'access-date',
});

const parsers$3 = {
  'citeweb': citeWeb$2,
  'kitob manbasi': citeBook$2,
  'veb manbasi': citeWeb$2,
  'web cite': citeWeb$2,
  'web manba': citeWeb$2,
  'web manbasi': citeWeb$2,
};

const data$3 = { aliases: aliases$3, infoboxes: infoboxes$3, parsers: parsers$3 };

const plugin$4 = (_models, templates, boxes) => register(data$3, templates, boxes);
plugin$4.lang = 'uz';
plugin$4.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// vietnamese template names → the core template they resolve to
const aliases$2 = {
  'ap': 'main',
  'birthdate and age': 'birth date and age',
  'birthdateandage': 'birth date and age',
  'biểu tượng lá cờ': 'flagicon',
  'bài chi tiết': 'main',
  'bài chính': 'main',
  'chính': 'main',
  'chú thích journal': 'cite journal',
  'chú thích tập san': 'cite journal',
  'chú thích tập san học thuật': 'cite journal',
  'chủ đề': 'portal',
  'common cats': 'commons cat',
  'commons category': 'commons cat',
  'commons thể loại': 'commons cat',
  'commons-cat': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'coor at d': 'coord',
  'coor at dm': 'coord',
  'coor at dms': 'coord',
  'coor d': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'coordinates': 'coord',
  'coordnoglobe': 'coord',
  'coords': 'coord',
  'coorheader': 'coord',
  'country': 'flag',
  'css1date': 'start',
  'cssdate': 'start',
  'cổng thông tin': 'portal',
  'danh sách tham khảo': 'reflist',
  'date of birth and age': 'birth date and age',
  'date start': 'start',
  'flag icon': 'flagicon',
  'foundation date': 'start',
  'geocoord': 'coord',
  'geocoordinate': 'coord',
  'hf': 'sfn',
  'initial release': 'start',
  'ipa char': 'ipa',
  'japonais': 'nihongo',
  'launch date': 'start',
  'location': 'coord',
  'location dec': 'coord',
  'lá cờ': 'flag',
  'lá cờ icon': 'flagicon',
  'main articles': 'main',
  'mainarticle': 'main',
  'nguồn tham khảo': 'reflist',
  'ngày sinh và tuổi': 'birth date and age',
  'nhỏ': 'small',
  'nihongo4': 'nihongo',
  'portal box': 'portal',
  'portalbox': 'portal',
  'portalpar': 'portal',
  'reference': 'reflist',
  'refs': 'reflist',
  'release date': 'start',
  'see main': 'main',
  'sf': 'sfn',
  'shortened footnote': 'sfn',
  'shortened footnote template': 'sfn',
  'snf': 'sfn',
  'startdate': 'start',
  'starting date': 'start',
  'tham khảo': 'reflist',
  'thể loại commons': 'commons cat',
  'thời điểm bắt đầu': 'start',
  'toạ độ': 'coord',
  'tọa độ': 'coord',
  'флаг канады': 'flag',
};

// names recognised as infoboxes
const infoboxes$2 = [
  'bảng phân loại',
  'phân loại khoa học',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook$1 = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
});
const citation = translate('citation', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'host': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'periodical': 'website',
  'number': 'issue',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'place': 'location',
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
});
const citeWeb$1 = translate('cite web', {
  'địa chỉ': 'url',
  'tiêu đề': 'title',
  'tên bài': 'title',
  'tựa đề': 'title',
  'ngày': 'date',
  'ngày tháng': 'date',
  'accessdate': 'access-date',
  'ngày truy cập': 'access-date',
  'ngày truy nhập': 'access-date',
  'nhà xuất bản': 'publisher',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'tác giả': 'author',
  'tác giả 1': 'author',
  'họ': 'author',
  'họ 1': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'tên': 'first',
  'tên 1': 'first',
  'năm': 'year',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'họ biên tập': 'editor',
  'trang': 'page',
  'các trang': 'pages',
  'lang': 'language',
  'ngôn ngữ': 'language',
  'dịch tiêu đề': 'trans-title',
  'dịch tên bài': 'trans-title',
  'dịch tựa đề': 'trans-title',
  'archiveurl': 'archive-url',
  'url lưu trữ': 'archive-url',
  'archivedate': 'archive-date',
  'ngày lưu trữ': 'archive-date',
  'trích dẫn': 'quote',
  'ấn bản': 'edition',
  'bản thứ': 'edition',
  'lần in': 'edition',
});
const internetquelle$1 = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'địa chỉ': 'url',
  'tiêu đề': 'title',
  'tên bài': 'title',
  'tựa đề': 'title',
  'ngày': 'date',
  'ngày tháng': 'date',
  'accessdate': 'access-date',
  'ngày truy cập': 'access-date',
  'ngày truy nhập': 'access-date',
  'nhà xuất bản': 'publisher',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'tác giả': 'author',
  'tác giả 1': 'author',
  'họ': 'author',
  'họ 1': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'tên': 'first',
  'tên 1': 'first',
  'năm': 'year',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'họ biên tập': 'editor',
  'trang': 'page',
  'các trang': 'pages',
  'lang': 'language',
  'ngôn ngữ': 'language',
  'dịch tiêu đề': 'trans-title',
  'dịch tên bài': 'trans-title',
  'dịch tựa đề': 'trans-title',
  'archiveurl': 'archive-url',
  'url lưu trữ': 'archive-url',
  'archivedate': 'archive-date',
  'ngày lưu trữ': 'archive-date',
  'trích dẫn': 'quote',
  'ấn bản': 'edition',
  'bản thứ': 'edition',
  'lần in': 'edition',
});

const parsers$2 = {
  'book reference': citeBook$1,
  'chú thích': citation,
  'chú thích sách': citeBook$1,
  'chú thích sách zh': citeBook$1,
  'chú thích web': citeWeb$1,
  'chú thích web web': citeWeb$1,
  'chú thích web/german': citeWeb$1,
  'chú thích website': citeWeb$1,
  'citar web': citeWeb$1,
  'cite book zh': citeBook$1,
  'cite books': citeBook$1,
  'cite chapter': citeBook$1,
  'cite manual': citeBook$1,
  'cite url': citeWeb$1,
  'cite web/german': citeWeb$1,
  'cite website': citeWeb$1,
  'cite work': citeBook$1,
  'cite-web': citeWeb$1,
  'citebook': citeBook$1,
  'citeweb': citeWeb$1,
  'internetquelle': internetquelle$1,
  'lien web': citeWeb$1,
  'ouvrage': citeBook$1,
  'trích dẫn cuốn sách': citeBook$1,
  'trích dẫn sách': citeBook$1,
  'trích dẫn web': citeWeb$1,
  'web cite': citeWeb$1,
  'web reference': citeWeb$1,
  'web reference simple': citeWeb$1,
  'webbref': citeWeb$1,
};

const data$2 = { aliases: aliases$2, infoboxes: infoboxes$2, parsers: parsers$2 };

const plugin$3 = (_models, templates, boxes) => register(data$2, templates, boxes);
plugin$3.lang = 'vi';
plugin$3.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// chinese template names → the core template they resolve to
const aliases$1 = {
  'ap': 'main',
  'birthdate and age': 'birth date and age',
  'birthdateandage': 'birth date and age',
  'cc': 'commons cat',
  'ccat': 'commons cat',
  'cite study': 'citation',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'coord title dms': 'coord',
  'coordinates': 'coord',
  'coordonnées': 'coord',
  'coords': 'coord',
  'coorheader': 'coord',
  'cytuj': 'citation',
  'date start': 'start',
  'flag icon': 'flagicon',
  'footnotessmall': 'reflist',
  'foundation date': 'start',
  'hurricane main': 'main',
  'launch date': 'start',
  'main articles': 'main',
  'portal box': 'portal',
  'portalbox': 'portal',
  'portalpar': 'portal',
  'references': 'reflist',
  'refs': 'reflist',
  'release date': 'start',
  'releasedate': 'start',
  'shortened footnote template': 'sfn',
  'startdate': 'start',
  'starting date': 'start',
  '主': 'main',
  '主条目': 'main',
  '主條目': 'main',
  '主頁': 'main',
  '主頁面': 'main',
  '主題': 'portal',
  '主題目': 'main',
  '主題首頁': 'portal',
  '入口': 'portal',
  '共享資源分類': 'commons cat',
  '共享资源分类': 'commons cat',
  '参考列表': 'reflist',
  '参考文献': 'reflist',
  '參考資料': 'reflist',
  '国际音标': 'ipa',
  '圖書': 'isbn',
  '地理座標': 'coord',
  '坐標': 'coord',
  '小': 'small',
  '座標': 'coord',
  '引证': 'citation',
  '指南': 'portal',
  '旗幟': 'flag',
  '旗幟圖示': 'flagicon',
  '旗幟標誌': 'flagicon',
  '条目': 'main',
  '注脚': 'reflist',
  '生年月日と年齢': 'birth date and age',
  '生日和年齡': 'birth date and age',
  '經緯': 'coord',
  '经纬': 'coord',
  '经纬度': 'coord',
  '脚注': 'reflist',
  '註腳': 'reflist',
  '門戶': 'portal',
  '頁面': 'main',
};

// names recognised as infoboxes
const infoboxes$1 = [
  '分类框',
];

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
  'surname': 'last',
  'surname1': 'last',
  'author-last': 'last',
  'author-last1': 'last',
  'author1-last': 'last',
  'subject': 'last',
  'subject1': 'last',
  'given': 'first',
  'given1': 'first',
  'author-first': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor1': 'editor',
  'place': 'location',
  'publication-place': 'location',
  'in': 'language',
  'contribution': 'chapter',
  'accessdate': 'access-date',
  'archivedate': 'archive-date',
  'archiveurl': 'archive-url',
});
const citeJournal = translate('cite journal', {
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const citeWeb = translate('cite web', {
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});
const internetquelle = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
});

const parsers$1 = {
  'book reference': citeBook,
  'book reference 3': citeBook,
  'c-j': citeJournal,
  'cita web': citeWeb,
  'cite blog': citeWeb,
  'cite book en': citeBook,
  'cite book zh': citeBook,
  'cite book/en': citeBook,
  'cite chapter': citeBook,
  'cite journal en': citeJournal,
  'cite journal zh': citeJournal,
  'cite manual': citeBook,
  'cite paper': citeJournal,
  'cite url': citeWeb,
  'cite web 2': citeWeb,
  'cite web en': citeWeb,
  'cite web ja': citeWeb,
  'cite web site': citeWeb,
  'cite web url': citeWeb,
  'cite web/en': citeWeb,
  'cite web2': citeWeb,
  'cite website': citeWeb,
  'cite work': citeBook,
  'cite-web': citeWeb,
  'citebook': citeBook,
  'citejournal': citeJournal,
  'citeweb': citeWeb,
  'cytuj książkę': citeBook,
  'internetquelle': internetquelle,
  'journal reference': citeJournal,
  'web cite': citeWeb,
  'web reference': citeWeb,
  '引用书籍': citeBook,
  '引用网页': citeWeb,
  '引網': citeWeb,
};

const data$1 = { aliases: aliases$1, infoboxes: infoboxes$1, parsers: parsers$1 };

const plugin$2 = (_models, templates, boxes) => register(data$1, templates, boxes);
plugin$2.lang = 'zh';
plugin$2.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia

// other template names → the core template they resolve to
const aliases = {
  'acnyal': 'flag', // shi
  'aif': 'ipa', // ga
  'al2': 'flag', // kept by hand
  'antsipirihany': 'main', // mg
  'apartny artikel': 'main', // csb
  'articllo': 'cite journal', // frp
  'articllo dètalyê': 'main', // frp
  'articlo principal': 'main', // an
  'articulo prencepale': 'main', // nap
  'artigo percipal': 'main', // mwl
  'artiklu prinċipali': 'main', // mt
  'artitgel principal': 'main', // rm
  'ase': 'ipa', // gv
  'atik': 'cite journal', // ht
  'atik detaye': 'main', // ht
  'awwur': 'portal', // kab
  'aðalgrein': 'main', // is
  'bandera2': 'flag', // ast
  'bandera4': 'flagicon', // kept by hand
  'bandiere': 'flagicon', // fur
  'bandièra': 'flagicon', // oc
  'bandêa': 'flagicon', // lij
  'bannera': 'flagicon', // nap scn
  'batang': 'main', // iba
  'bayroqikon': 'flagicon', // kept by hand
  'bdr adlis': 'cite book', // shi
  'bdr awib': 'cite web', // shi
  'bdr aɣmis': 'cite journal', // shi
  'birth date and age wd': 'birth date and age', // vec
  'biçûk': 'small', // ku
  'bratach': 'flag', // ga
  'bókaheimild': 'cite book', // kept by hand
  'catcómhaoin': 'commons cat', // ga
  'categorìa ëd commons': 'commons cat', // pms
  'chefartiklo': 'main', // io
  'chorhoj': 'flag', // hsb
  'chórgoj': 'flag', // dsb
  'chú thích tạp chí': 'cite journal', // kept by hand
  'cita ghjurnale': 'cite journal', // co
  'cita libru': 'cite book', // co
  'cita llibru': 'cite book', // ast
  'cita publicasion': 'cite journal', // vec
  'citar lhibro': 'cite book', // mwl
  'citat3': 'citation', // kept by hand
  'citaziuni di testu': 'cite book', // scn
  'cite book.': 'cite book', // haw
  'cite web öömrang': 'cite web', // frr
  'cite web-en': 'cite web', // ga
  'cite web/duits': 'cite web', // af
  'citiranje knjiga': 'cite book', // kept by hand
  'cito': 'citation', // kept by hand
  'cituro': 'citation', // io
  'cité la ragnà': 'cite web', // pms
  'cité n\'arvista': 'cite journal', // pms
  'cité un lìber': 'cite book', // pms
  'commons': 'commons cat', // nrm olo
  'commons kaarangay': 'commons cat', // war
  'commons kategoriya': 'commons cat', // kaa
  'commons kategoriýa': 'commons cat', // tk
  'commons категория': 'commons cat', // ky
  'commons-kategorie': 'commons cat', // af
  'communiacat': 'commons cat', // la
  'coor dd': 'coord', // an
  'cord': 'coord', // mwl
  'cytuj knéżkã': 'cite book', // csb
  'cytuj ksiōnżkã': 'cite book', // szl
  'cytuj news': 'cite journal', // szl
  'cytuj starnã': 'cite web', // csb
  'cytuj strōnã': 'cite web', // szl
  'càstia fintzas': 'main', // sc
  'data de nacemento e idade': 'birth date and age', // kept by hand
  'data de naissença e atge': 'birth date and age', // oc
  'data tat-twelid u età': 'birth date and age', // mt
  'date toshee': 'start', // gv
  'daveoù': 'reflist', // br
  'derekler': 'reflist', // kaa
  'dergi kaynağı': 'cite journal', // kept by hand
  'destpêka dem': 'start', // ku
  'drapo': 'flagicon', // ht
  'drapél': 'flagicon', // frp
  'dustuniow': 'reflist', // kw
  'dáta breithe agus aois': 'birth date and age', // ga
  'dâta de nèssence': 'birth date and age', // frp
  'dữ liệu nhân vật': 'persondata', // kept by hand
  'enmyslioar': 'cite book', // gv
  'falgicon': 'flagicon', // kept by hand
  'fana': 'flagicon', // ang szl
  'fecha': 'start', // ast
  'flag-ikon': 'flagicon', // nov
  'formatdata': 'start', // oc
  'fu\'a': 'flag', // sm
  'fáni': 'flag', // is
  'fæðingardagur og aldur': 'birth date and age', // is
  'ganghaan': 'portal', // ceb
  'geboortedatum en ouderdom': 'birth date and age', // af
  'girjegáldu': 'cite book', // se
  'gotara bingehîn': 'main', // ku
  'gáldut': 'reflist', // se
  'głowny nastawk': 'main', // dsb
  'haaptartikel': 'main', // lb
  'hari bulan pengada enggau umur': 'birth date and age', // iba
  'heafodgewrit': 'main', // ang
  'hivatkozás/könyv': 'cite book', // kept by hand
  'hnit': 'coord', // is
  'hoofartikel': 'main', // li
  'høvuðsgrein': 'main', // fo
  'hłowny nastawk': 'main', // hsb
  'indaneddkwäll': 'cite web', // pfl
  'internetowe žrědło': 'cite web', // dsb
  'internetowe žórło': 'cite web', // hsb
  'internetquelle fering': 'cite web', // frr
  'iomradh': 'citation', // gd
  'iomradh iris': 'cite journal', // gd
  'iomradh leabhar': 'cite book', // gd
  'iomradh lìon': 'cite web', // gd
  'ipa2': 'ipa', // olo
  'japonés': 'nihongo', // oc
  'jidayikbûn': 'birth date and age', // ku
  'jêder': 'citation', // ku
  'jêder-kitêb': 'cite book', // ku
  'jêder-kovar': 'cite journal', // ku
  'jêder-malper': 'cite web', // ku
  'kategoria ti commons': 'commons cat', // ilo
  'kategoriya commonsê': 'commons cat', // ku
  'katégori commons': 'commons cat', // ban
  'ki': 'main', // ss
  'kirjekäldee': 'cite book', // smn
  'kjelde bok': 'cite book', // kept by hand
  'koordinate text': 'coord', // kept by hand
  'koordinaten': 'coord', // nds
  'koördinate': 'coord', // kept by hand
  'koördinaten': 'coord', // fy
  'käldeeh': 'reflist', // smn
  'kòòrdinatë': 'coord', // csb
  'lango': 'portal', // sw
  'leavga': 'flagicon', // se
  'lfe': 'ipa', // br
  'lidɐraduur': 'cite book', // pfl
  'ligam web': 'cite web', // kept by hand
  'lim vouèbe': 'cite web', // frp
  'lippukove': 'flagicon', // smn
  'lipu suli': 'main', // tok
  'literatura': 'cite book', // dsb hsb
  'llistaref': 'reflist', // ast
  'lostâkäldee': 'cite journal', // smn
  'lua idirlín': 'cite web', // kept by hand
  'luaigh foilseachán': 'cite journal', // ga
  'majiranukta': 'coord', // sw
  'mga kasarigan': 'reflist', // war
  'mien artikal': 'main', // kept by hand
  'nangruna': 'main', // ilo
  'narodniny a staroba': 'birth date and age', // hsb
  'narodniny a starstwo': 'birth date and age', // dsb
  'navedi revijo': 'cite journal', // kept by hand
  'neahttagáldu': 'cite web', // se
  'nettikäldee': 'cite web', // smn
  'notae': 'reflist', // la
  'nūruodis': 'reflist', // ltg
  'opus': 'citation', // la
  'osebni podatki': 'persondata', // kept by hand
  'pagina principalis': 'main', // la
  'pangunahin': 'main', // tl
  'pantli2': 'flag', // kept by hand
  'payis': 'flag', // frp
  'persoondata': 'persondata', // kept by hand
  'persoonsgegevens': 'persondata', // kept by hand
  'petiôt': 'small', // frp
  'petsa ti pannakaipasngay ken tawen': 'birth date and age', // ilo
  'pitl': 'small', // lld
  'porched': 'portal', // br
  'portada': 'portal', // tl
  'portaol': 'portal', // nds-nl
  'portałe': 'portal', // vec
  'portâl': 'portal', // frp
  'početni datum': 'start', // bs
  'prinsipal': 'main', // pms
  'prinzipel': 'main', // lld
  'prononciation api': 'ipa', // ln mg
  'przipisy': 'reflist', // szl
  'przëpisë': 'reflist', // csb
  'príomhalt': 'main', // ga
  'puntudecimal': 'formatnum', // ast
  'pwononsyasyon api': 'ipa', // ht
  'pòrtal': 'portal', // csb
  'qq': 'main', // qu
  'quaere citationem': 'sfn', // la
  'ref-citacion': 'citation', // oc
  'ref-libre': 'cite book', // oc
  'ref-publicacion': 'cite journal', // oc
  'referans': 'reflist', // ht
  'referency': 'reflist', // dsb hsb
  'referenzen': 'reflist', // lb
  'referenzi': 'reflist', // mt
  'referéncias': 'reflist', // oc
  'referências': 'reflist', // kept by hand
  'refréncias': 'reflist', // mwl
  'rejea jarida': 'cite journal', // sw
  'rejea kitabu': 'cite book', // sw
  'rejea tovuti': 'cite web', // sw
  'revista': 'cite journal', // kept by hand
  'riferimenti': 'reflist', // co
  'roja bûyînê û temen': 'birth date and age', // kept by hand
  'rèferences': 'reflist', // frp
  'sembola alayê': 'flagicon', // ku
  'sitearje web': 'cite web', // fy
  'sjoch haadartikel': 'main', // fy
  'sona pi tan sona': 'reflist', // tok
  'stän': 'flag', // vo
  'səvonon sijohi': 'reflist', // tly
  'taba eka sehlohlolong': 'main', // st
  'tan sona': 'citation', // tok
  'tanggal embas lan yusa': 'birth date and age', // ban
  'tanggal lahir rik umur': 'birth date and age', // kge
  'tanggal lair lan umur': 'birth date and age', // jv
  'tisaɣulin': 'reflist', // shi
  'torra a': 'main', // kept by hand
  'try formatnum': 'formatnum', // kept by hand
  'tunggul': 'main', // bbc
  'tzita libru': 'cite book', // sc
  'tzita publicatzione': 'cite journal', // sc
  'tzita testu': 'citation', // sc
  'tzita web': 'cite web', // sc
  'uhlu lwemithombo': 'reflist', // zu
  'ulloq ukiuilu': 'birth date and age', // kept by hand
  'upphafsdagur': 'start', // is
  'varda anca': 'main', // vec
  'vefheimild': 'cite web', // kept by hand
  'verwys boek': 'cite book', // af
  'verwys vaktydskrif': 'cite journal', // af
  'verwys web': 'cite web', // af
  'verwysing': 'citation', // af
  'verwysings': 'reflist', // af
  'vexillum': 'flag', // la
  'vexillum icon': 'flagicon', // la
  'viide': 'citation', // kept by hand
  'vlag': 'flag', // af
  'vlagikoon': 'flagicon', // af
  'váldoartihkal': 'main', // se
  'válduartikkâl': 'main', // smn
  'véddi ascì': 'main', // lij
  'véddi ànche': 'main', // kept by hand
  'wagayway': 'flag', // ilo
  'wagaywayikono': 'flagicon', // ilo
  'web deregi': 'cite web', // kaa
  'wikikori': 'portal', // ban
  'xóotal': 'main', // wo
  'z32053': 'cite web', // wikifunctions
  'zászló2': 'flag', // kept by hand
  'çavkanî': 'reflist', // ku
  'çeşmeler': 'reflist', // tk
  'çitta lìbbro': 'cite book', // lij
  'çitta publicaçión': 'cite journal', // lij
  'çitta web': 'cite web', // lij
  'ôvra': 'cite book', // frp
  'ċita ktieb': 'cite book', // mt
  'ċita pubblikazzjoni': 'cite journal', // mt
  'ċita web': 'cite web', // mt
  'šaltenē': 'reflist', // bat-smg
  'šaltėnē': 'reflist', // kept by hand
  'šoddâmäigi já ahe': 'birth date and age', // smn
  'абираҟ': 'flagicon', // ab
  'асăрхавсем': 'reflist', // cv
  'аслияб макъала': 'main', // av
  'асосӣ': 'main', // tg
  'ашәҟәы': 'cite book', // ab
  'ајарулар': 'reflist', // alt
  'байрак1': 'flagicon', // tt
  'байракх': 'flagicon', // ce
  'баянар': 'reflist', // lez
  'белгалдаккхар': 'reflist', // inh
  'билгалдахарш': 'reflist', // ce
  'бувчӏин баву': 'reflist', // lbe
  'булактар': 'reflist', // ky
  'быһаарыылар': 'reflist', // sah
  'валэктонъёс': 'reflist', // udm
  'викианбор-гурӯҳ': 'commons cat', // tg
  'гитче': 'small', // krc
  'главьнъ': 'main', // cu
  'далбаа': 'flagicon', // kept by hand
  'далбаа дүрс': 'flagicon', // mn
  'државнознаме': 'flagicon', // kept by hand
  'дробны шрыфт': 'small', // be-x-old
  'желек': 'flagicon', // ky
  'заалтс': 'reflist', // xal
  'зэпыщэхэр': 'reflist', // ady
  'зүүлтэ': 'reflist', // bxr
  'интернэт эх сурвалж': 'cite web', // mn
  'искәрмәләр': 'reflist', // tt
  'иҫкәрмәләр': 'reflist', // ba
  'керттера лустам': 'main', // inh
  'керттера статья': 'main', // kept by hand
  'кладѧꙃи': 'reflist', // cu
  'ков': 'portal', // ce
  'кол чүүл': 'main', // tyv
  'котфоц': 'flagicon', // mdf
  'коцт': 'flagicon', // myv
  'коьрта агӏо': 'main', // ce
  'кхоьллина': 'birth date and age', // ce
  'кітап': 'cite book', // kept by hand
  'лични подаци': 'persondata', // kept by hand
  'лятфтамат': 'reflist', // mdf
  'макъала': 'cite journal', // lez
  'мугъчӏваял': 'reflist', // av
  'нарадзіўся': 'birth date and age', // be-x-old
  'негизги макала': 'main', // ky
  'парчам': 'flag', // tg
  'райгуырд': 'birth date and age', // os
  'спасылка': 'cite web', // be-x-old
  'статья': 'cite journal', // kept by hand
  'сьцяг': 'flag', // be-x-old
  'таърихи таваллуд ва син': 'birth date and age', // tg
  'тисте': 'flagicon', // mhr
  'тук': 'flagicon', // tyv
  'тырыса': 'flagicon', // os
  'төрсөн огноо, нас': 'birth date and age', // mn
  'фиппаинæгтæ': 'reflist', // os
  'хіужаби': 'reflist', // kept by hand
  'шочмокече': 'birth date and age', // mhr
  'ыстатыйа': 'cite journal', // sah
  'эзоҳ': 'reflist', // tg
  'ялав': 'flag', // cv
  'япон үг': 'nihongo', // mn
  'үндсэн өгүүлэл': 'main', // mn
  'դրօշ': 'flag', // hyw
  'հիմնական յոդված': 'main', // kept by hand
  'հիմնական յօդուած': 'main', // hyw
  'վիքիպահեստ կատեգորիա': 'commons cat', // kept by hand
  'քոորտինադներ': 'coord', // hyw
  'אנווייז צום הויפט ארטיקל': 'main', // yi
  'מוקטן': 'small', // kept by hand
  'פרטים ביוגרפיים': 'persondata', // kept by hand
  'צייגט בוך': 'cite book', // yi
  'צייגט וועב': 'cite web', // yi
  'קאמאנסקאט': 'commons cat', // yi
  'קליין': 'small', // yi
  'רעפליסטע': 'reflist', // yi
  'آمبار بؤلمه': 'commons cat', // azb
  'إحداتيات': 'coord', // ary
  'إيكون د راية': 'flagicon', // ary
  'اساس': 'main', // azb
  'استشهاد بدوريه محكمه': 'cite journal', // arz
  'استشهد بموقع الويب': 'cite web', // arz
  'اصل ورقہ': 'main', // skr
  'اطلاعات شخص': 'persondata', // kept by hand
  'بایراق': 'flag', // azb
  'بایراقچا': 'flagicon', // azb
  'بایراقچه': 'flagicon', // kept by hand
  'بشپړه ليکنه': 'main', // ps
  'بن‌بنویشت': 'reflist', // mzn
  'بوابه': 'portal', // arz
  'بول': 'ipa', // sd
  'بيدۊقان': 'flagicon', // glk
  'بيرغ': 'flag', // ps
  'بيرغ نښه': 'flagicon', // ps
  'بچووک': 'small', // ckb
  'بیرخستنەوەی وێب': 'cite web', // ckb
  'بیرخستنەوەی ژوورناڵ': 'cite journal', // ckb
  'بیرخستنەوەی گۆڤار': 'cite journal', // kept by hand
  'تانبه': 'portal', // ps
  'تفصيلي مضمون': 'main', // sd
  'تلمبار-رج': 'commons cat', // mzn
  'جهنڊو': 'flag', // sd
  'جهنڊو عڪس': 'flagicon', // kept by hand
  'جھنڈا': 'flag', // pnb
  'حوالو': 'reflist', // sd
  'حوالو ويب': 'cite web', // sd
  'حَوالہٕ': 'reflist', // ks
  'د زیږون نیټه او عمر': 'birth date and age', // kept by hand
  'دوغوم تاریخی ایله یاش': 'birth date and age', // azb
  'دەروازە': 'portal', // ckb
  'راية': 'flag', // ary
  'زېږون نېټه او عمر': 'birth date and age', // ps
  'سأرچئشمە': 'reflist', // kept by hand
  'سرچينه': 'citation', // ps
  'سەرچاوەکان': 'reflist', // ckb
  'سەرەکی': 'main', // ckb
  'عيون': 'reflist', // ary
  'قایناق': 'reflist', // azb
  'ليکنه واړه کول': 'small', // ps
  'لړسرچينې': 'reflist', // ps
  'محل وقوع': 'coord', // pnb
  'مرجع جورنال': 'cite journal', // ary
  'مقالة متعمقة': 'main', // ary
  'نغا': 'ipa', // ps
  'ننڍو': 'small', // sd
  'وب قایناقلاماسی': 'cite web', // kept by hand
  'ویب حَوالہٕ': 'cite web', // ks
  'وېشنيزه انبار': 'commons cat', // ps
  'پرچم‌ئون': 'flagicon', // mzn
  'پوْرتال': 'portal', // azb
  'پيل نېټه': 'start', // ps
  'پۆلی کۆمنز': 'commons cat', // ckb
  'ڄمڻ جي تاريخ ۽ عمر': 'birth date and age', // kept by hand
  'ڕۆژی لەدایکبوون و تەمەن': 'birth date and age', // ckb
  'ڕێکەوتی سەرەتا': 'start', // ckb
  'کتاب حوالہ': 'cite book', // skr
  'کتابي سرچينه': 'cite book', // ps
  'کِتاب حَوالہٕ': 'cite book', // ks
  'کیتاب قایناقلاماسی': 'cite book', // azb
  'ڪتابن مان حوالا': 'cite book', // kept by hand
  'ڪومنز زمرو': 'commons cat', // sd
  'گٹھ کامنز': 'commons cat', // pnb
  'ھێمای ئاڵا': 'flagicon', // ckb
  'یادکرد': 'cite book', // kept by hand
  'ܣܝܩܘܡ ܫܘܪܝܐ': 'start', // arc
  'कमन्सश्रेणी': 'commons cat', // ne
  'कॉमंस श्रेणी': 'commons cat', // bh
  'कॉमन्स वर्ग': 'commons cat', // mr
  'कोमन्स श्रेणी': 'commons cat', // mag
  'जन्म दिनांक आणि वय': 'birth date and age', // mr
  'जर्नल स्रोत': 'cite journal', // mr
  'झण्डा': 'flag', // mag
  'दालन': 'portal', // mr
  'दिनांक': 'start', // mr
  'देश झन्डा': 'flag', // kept by hand
  'ध्वज': 'flag', // mr
  'ध्वजचिन्ह': 'flagicon', // mr
  'निहोंगो': 'nihongo', // mr
  'मुख्य लेख': 'main', // ne
  'मुख्यः': 'main', // sa
  'व्यक्तिगत आँकड़े': 'persondata', // kept by hand
  'संकेतस्थळ स्रोत': 'cite web', // mr
  'संदर्भयादी': 'reflist', // mr
  'सानो': 'small', // ne
  'स्रोत पुस्तक': 'cite book', // mr
  'কমন্স থাক': 'commons cat', // bpy
  'পাসিতা তালিকা': 'reflist', // bpy
  'ব্যক্তিতথ্য': 'persondata', // kept by hand
  'ਕਾਮਨਜ਼ ਸ਼੍ਰੇਣੀ': 'commons cat', // kept by hand
  'ਛੋਟਾ': 'small', // kept by hand
  'ਝੰਡਾ ਤਸਵੀਰ': 'flagicon', // kept by hand
  'ਨਿਹੋਂਗੋ': 'nihongo', // pa
  'ਹਵਾਲੇ': 'reflist', // kept by hand
  'કોમન્સ શ્રેણી': 'commons cat', // gu
  'મુખ્ય': 'main', // gu
  'ଆଧାର': 'reflist', // or
  'ಉಲ್ಲೇಖ ಪುಸ್ತಕ': 'cite book', // kn
  'ಉಲ್ಲೇಖಗಳು': 'reflist', // kn
  'ಹುಟ್ಟಿದ ದಿನಾಂಕ ಮತ್ತು ವಯಸ್ಸು': 'birth date and age', // kn
  'ආරම්භක දිනය': 'start', // si
  'ආශ්‍රලැයිස්තුව': 'reflist', // si
  'උපන් දින සහ වයස': 'birth date and age', // si
  'උපන්‍යාස පොත': 'cite book', // si
  'උපන්‍යාස වෙබ්': 'cite web', // si
  'කොමන්ස් ප්‍රවර්ගය': 'commons cat', // si
  'කොමන්ස්ප්‍රවර්ග': 'commons cat', // kept by hand
  'ධජය': 'flag', // si
  'ප්‍රධාන ලිපිය': 'main', // si
  'ข้อมูลบุคคล': 'persondata', // kept by hand
  'ຍີ່ປຸ່ນ': 'nihongo', // lo
  'ທຸງຊາດ': 'flag', // lo
  'ບົດຄວາມຫຼັກ': 'main', // kept by hand
  'ລາຍການອ້າງອີງ': 'reflist', // lo
  'ຫຼັກ': 'main', // lo
  'ကိုးကားခြင်း': 'citation', // my
  'အလံ': 'flag', // my
  'ၸွမ်ပိဝ်': 'flag', // shn
  'სქოლიოშ ერკებული': 'reflist', // xmf
  'ሰንደቅ ዓላማ ምስል': 'flagicon', // am
  'ដើមចំបង': 'main', // km
  'បញ្ជីឯកសារយោង': 'reflist', // km
  'ផតថល': 'portal', // km
  'ᱢᱩᱬ': 'main', // sat
  'ᱥᱟᱹᱠᱷᱭᱟᱹᱛ': 'reflist', // sat
  'ᱵᱚᱞᱚᱱᱫᱩᱣᱟᱹᱨ': 'portal', // sat
  'ⴰⵙⴰⴽⵓⴷ ⵏ ⵜⵍⴰⵍⵉⵜ ⴷ ⵓⵡⵜⴰⵢ': 'birth date and age', // zgh
  'ⴰⵙⵎⵉⵍ ⵏ ⴽⵓⵎⵏⵣ': 'commons cat', // zgh
  'ⴰⵡⵡⵓⵔ': 'portal', // zgh
  'ⴱⴷⵔ ⴰⴷⵍⵉⵙ': 'cite book', // zgh
  'ⴱⴷⵔ ⴰⵖⵎⵉⵙ': 'cite journal', // zgh
  'ⴱⴷⵔ ⴰⵡⵉⴱ': 'cite web', // zgh
  'ⵉⵙⴰⵖⵓⵍⵏ': 'reflist', // zgh
  'ⵉⵙⴽⴽⵉⵍⵏ ⵏ ⵜⵎⵙⵍⵉⵡⵜ': 'ipa', // zgh
  '個人資訊': 'persondata', // kept by hand
  '內文': 'main', // zh-yue
  '出世日同歲數': 'birth date and age', // zh-yue
  '同享類': 'commons cat', // zh-yue
  '引書': 'cite book', // zh-yue
  '日本話': 'nihongo', // zh-yue
  '生日搭年纪': 'birth date and age', // wuu
  '維基共享': 'commons cat', // zh-classical
  '門': 'portal', // zh-classical
  '인물데이터': 'persondata', // kept by hand
};

// names recognised as infoboxes
const infoboxes = [
  'boaty ny taksônômia', // mg
  'boks klassans', // kw
  'bosca sonraí tacsanomaíochta', // kept by hand
  'capsa taxinomica', // la
  'dora tewran', // diq
  'kishtey fys baagh', // gv
  'poki sona pi ijo wile', // tok
  'puha fakafaʻahinga', // to
  'taksonomiija', // se
  'taksonomiýa', // tk
  'taksōn infobox', // szl
  'tassonomìa', // pms
  'taxobox öömrang', // frr
  'taxonomio', // io
  'taxotaula infotaula', // kept by hand
  'wd bosca sonraí ainmhí bheo', // ga
  'таксанамічная інфармацыя', // be-x-old
  'таксаҥа', // mhr
  'таксон', // bxr lez
  'таксономиясь', // myv
  'таксономія', // kept by hand
  'زيبيل/جاندار', // glk
  'صندخ/موجود', // mzn
  'जीवचौकट', // mr
  'වර්ගීකරණකොටුව', // si
  'ຕາລາງຈຳແໜກພັນ', // lo
  '物種明細模', // zh-yue
];

const parsers = {};

const data = { aliases, infoboxes, parsers };

const plugin$1 = (_models, templates, boxes) => register(data, templates, boxes);
plugin$1.lang = 'other';
plugin$1.version = version;

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// every language pack, applied one by one — 'other' carries the wikis without a pack of their own

const plugin = (models, templates, infoboxes) => {
  plugin$X(models, templates, infoboxes);
  plugin$W(models, templates, infoboxes);
  plugin$V(models, templates, infoboxes);
  plugin$U(models, templates, infoboxes);
  plugin$T(models, templates, infoboxes);
  plugin$S(models, templates, infoboxes);
  plugin$R(models, templates, infoboxes);
  plugin$Q(models, templates, infoboxes);
  plugin$P(models, templates, infoboxes);
  plugin$O(models, templates, infoboxes);
  plugin$N(models, templates, infoboxes);
  plugin$M(models, templates, infoboxes);
  plugin$L(models, templates, infoboxes);
  plugin$K(models, templates, infoboxes);
  plugin$J(models, templates, infoboxes);
  plugin$I(models, templates, infoboxes);
  plugin$H(models, templates, infoboxes);
  plugin$G(models, templates, infoboxes);
  plugin$F(models, templates, infoboxes);
  plugin$E(models, templates, infoboxes);
  plugin$D(models, templates, infoboxes);
  plugin$C(models, templates, infoboxes);
  plugin$B(models, templates, infoboxes);
  plugin$A(models, templates, infoboxes);
  plugin$z(models, templates, infoboxes);
  plugin$y(models, templates, infoboxes);
  plugin$x(models, templates, infoboxes);
  plugin$w(models, templates, infoboxes);
  plugin$v(models, templates, infoboxes);
  plugin$u(models, templates, infoboxes);
  plugin$t(models, templates, infoboxes);
  plugin$s(models, templates, infoboxes);
  plugin$r(models, templates, infoboxes);
  plugin$q(models, templates, infoboxes);
  plugin$p(models, templates, infoboxes);
  plugin$o(models, templates, infoboxes);
  plugin$n(models, templates, infoboxes);
  plugin$m(models, templates, infoboxes);
  plugin$l(models, templates, infoboxes);
  plugin$k(models, templates, infoboxes);
  plugin$j(models, templates, infoboxes);
  plugin$i(models, templates, infoboxes);
  plugin$h(models, templates, infoboxes);
  plugin$g(models, templates, infoboxes);
  plugin$f(models, templates, infoboxes);
  plugin$e(models, templates, infoboxes);
  plugin$d(models, templates, infoboxes);
  plugin$c(models, templates, infoboxes);
  plugin$b(models, templates, infoboxes);
  plugin$a(models, templates, infoboxes);
  plugin$9(models, templates, infoboxes);
  plugin$8(models, templates, infoboxes);
  plugin$7(models, templates, infoboxes);
  plugin$6(models, templates, infoboxes);
  plugin$5(models, templates, infoboxes);
  plugin$4(models, templates, infoboxes);
  plugin$3(models, templates, infoboxes);
  plugin$2(models, templates, infoboxes);
  plugin$1(models, templates, infoboxes);
};
plugin.version = version;

module.exports = plugin;
