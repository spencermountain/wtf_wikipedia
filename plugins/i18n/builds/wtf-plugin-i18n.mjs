/*! wtf-plugin-i18n 2.0.0 MIT */
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

// expand a core-style shorthand definition into a parser fn (mirrors core src/templates/_shortcuts.ts):
//   'гео': ['lat', 'lon', 'zoom']   → parse positional params into named data
//   'имя': 1                        → the text of that pipe
//   'флаг': '🏴'                     → static replacement text
//   'возраст': { props: [...], out: 'age' } → parse props, output one of them
const positions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const fromShortcut = (def) => {
  return (tmpl, parse) => {
    if (typeof def === 'number') {
      const data = parse(tmpl, positions);
      return { data: null, replacement: data[String(def)] || '' }
    }
    if (typeof def === 'string') {
      return { data: null, replacement: def }
    }
    if (Array.isArray(def)) {
      return { data: parse(tmpl, def), replacement: '' }
    }
    if (def && typeof def === 'object') {
      const data = parse(tmpl, def.props);
      return { data, replacement: data[def.out] || '' }
    }
    return { data: parse(tmpl), replacement: '' }
  }
};

// registers one language pack onto the core template registry.
// a pack is pure data (see langs/), every section optional:
//   lang, enLang — iso code + english name
//   category / redirect / stub / infobox / image / reference / disambig / disambigTitle
//             — that wiki's page-level words (data only, not yet wired in)
//   aliases   — localized name → the core template key it resolves to
//   templates — localized name → a definition:
//     { template: 'cite web', map: { 'titre': 'title' } } — rename params, parse as a core template
//     ['lat', 'lon'] / 1 / 'text' / { props, out }        — core-style shortcuts
//     (tmpl, parse, opts, templates) => { data, replacement } — a custom parser fn
//   gated     — same definitions, but only applied when a document's lang matches the pack;
//               for names too generic to claim globally, like fr's {{nb}}

const toParser = (def) => {
  if (typeof def === 'function') {
    return def
  }
  if (def && typeof def === 'object' && Array.isArray(def) === false && def.template) {
    return translate(def.template, def.map || {})
  }
  return fromShortcut(def)
};

// bridge a core-style parser fn to the plugin callback contract, keeping its metadata
const bridge = (fn, templates) => {
  const wrapped = function (tmpl, list, parse, _unused, opts) {
    const { data: found, replacement } = fn(tmpl, parse, opts, templates);
    if (found) {
      list.push(found);
    }
    return replacement
  };
  wrapped.kind = fn.kind;
  wrapped.template = fn.template;
  wrapped.map = fn.map;
  return wrapped
};

const register = (data, templates, infoboxes = {}, overlay) => {
(data.infoboxes || []).forEach((name) => {
    infoboxes[name] = true;
  });
  Object.keys(data.aliases || {}).forEach((name) => {
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
  Object.keys(data.templates || {}).forEach((name) => {
    let fn = toParser(data.templates[name]);
    if (fn.template && typeof templates[fn.template] !== 'function') {
      throw new Error(`wtf-plugin-i18n: '${fn.template}' is not a core template`)
    }
    // wikis share names: two param-map defs onto the same template merge their maps,
    // the earlier registration winning per key — otherwise the first definition stands
    const prev = templates[name];
    if (prev && prev.i18n === 'parser') {
      if (prev.template && prev.template === fn.template && prev.map && fn.map) {
        fn = translate(fn.template, Object.assign({}, fn.map, prev.map));
      } else {
        return
      }
    }
    templates[name] = bridge(fn, templates);
    templates[name].i18n = 'parser';
  });
  // gated names go into core's byLang overlay, resolved only when opts.lang matches
  if (overlay && overlay.byLang && data.lang) {
    overlay.byLang[data.lang] = overlay.byLang[data.lang] || {};
    const slot = overlay.byLang[data.lang];
    Object.keys(data.gated || {}).forEach((name) => {
      if (Object.hasOwn(slot, name)) {
        return
      }
      const fn = toParser(data.gated[name]);
      if (fn.template && typeof templates[fn.template] !== 'function') {
        throw new Error(`wtf-plugin-i18n: '${fn.template}' is not a core template`)
      }
      slot[name] = bridge(fn, templates);
    });
  }
};

var version = '2.0.0';

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// arabic template names → the core template they resolve to
const aliases$A = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$u = {
  template: 'cite book',
  map: {
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
  },
};
const citeJournal$p = {
  template: 'cite journal',
  map: {
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
  },
};
const citeWeb$w = {
  template: 'cite web',
  map: {
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
  },
};
const internetquelle$i = {
  template: 'cite web',
  map: {
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
  },
};
const citation$b = {
  template: 'citation',
  map: {
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
  },
};

const citations$x = {
  'cita libro': citeBook$u,
  'cita publicación': citeJournal$p,
  'cita web': citeWeb$w,
  'cite manual': citeBook$u,
  'citeweb': citeWeb$w,
  'cw': citeWeb$w,
  'internetquelle': internetquelle$i,
  'web cite': citeWeb$w,
  'web kaynağı': citeWeb$w,
  'استشهاد': citation$b,
  'استشهاد بدورية': citeJournal$p,
  'استشهاد بدورية أكاديمية': citeJournal$p,
  'استشهاد بدورية محكمة': citeJournal$p,
  'استشهاد بكتاب': citeBook$u,
  'استشهاد بموقع': citeWeb$w,
  'استشهاد بويب': citeWeb$w,
  'استشهاد بويب/إنجليزي': citeWeb$w,
  'استشهاد بويب/الألمانية': citeWeb$w,
  'استشهاد صحيفة': citeJournal$p,
  'استشهاد ويب': citeWeb$w,
  'استشهاد ويب/إنجليزي': citeWeb$w,
  'اقتباس ويب': citeWeb$w,
  'مرجع كتاب': citeBook$u,
  'مرجع مجلة': citeJournal$p,
  'مرجع موقع': citeWeb$w,
  'مرجع هارفرد': citation$b,
  'مرجع وب': citeWeb$w,
  'مرجع وب/إنجليزي': citeWeb$w,
  'مرجع ويب': citeWeb$w,
  'مرجع ويب/إنجليزي': citeWeb$w,
  'يستشهد كتاب': citeBook$u,
  'يستشهد مجلة': citeJournal$p,
  'يستشهد ويب': citeWeb$w,
  'یادکرد وب': citeWeb$w,
};

const infoboxes$A = [
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

const birthDateAndAge = {
  template: 'birth date and age',
  map: {
    العام: 'year',
    السنة: 'year',
    سنة: 'year',
  },
};

var ar = {
  lang: 'ar',
  enLang: 'arabic',
  category: ['تصنيف'],
  redirect: ['تحويل'],
  stub: ['بذرة'],
  infobox: ['بطاقة'],
  image: ['صورة', 'ملف'],
  reference: [],
  disambig: ['توضيح'],
  disambigTitle: ['توضيح'],
  aliases: aliases$A,
  infoboxes: infoboxes$A,
  templates: {
    ...citations$x,
    'الميلاد والسن': birthDateAndAge,
    'الولادة والسن': birthDateAndAge,
    'تاريخ الميلاد و العمر': birthDateAndAge,
    'تاريخ الميلاد والسن': birthDateAndAge,
    'تاريخ الميلاد والعمر': birthDateAndAge,
    'تاريخ ميلاد والعمر': birthDateAndAge,
    'تاريخ ميلاد وعمر': birthDateAndAge,
  },
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// bulgarian template names → the core template they resolve to
const aliases$z = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb$v = {
  template: 'cite web',
  map: {
    'уеб_адрес': 'url',
    'заглавие': 'title',
    'автор': 'author',
    'фамилно_име': 'last',
    'първо_име': 'first',
    'труд': 'work',
    'издател': 'publisher',
    'страници': 'pages',
    'цитат': 'quote',
  },
};
const citeBook$t = {
  template: 'cite book',
  map: {
    'editor-last': 'editor',
  },
};
const citeJournal$o = {
  template: 'cite journal',
  map: {
    'accessdate': 'access-date',
    'достъп_дата': 'access-date',
    'достъп_ден_месец': 'access-date',
    'archiveurl': 'archive-url',
    'архив_уеб_адрес': 'archive-url',
    'archivedate': 'archive-date',
    'архив_дата': 'archive-date',
  },
};

const citations$w = {
  'cita web': citeWeb$v,
  'citeweb': citeWeb$v,
  'цитат книга': citeBook$t,
  'цитат периодика': citeJournal$o,
  'цитат уеб': citeWeb$v,
};

const infoboxes$z = ['таксокутия'];

var bg = {
  lang: 'bg',
  enLang: 'bulgarian',
  category: ['категория'],
  redirect: ['виж', 'пренасочване'],
  stub: ['мъниче'],
  infobox: ['инфокутия'],
  image: ['картинка', 'файл'],
  reference: [],
  disambig: ['пояснение'],
  disambigTitle: [],
  aliases: aliases$z,
  infoboxes: infoboxes$z,
  templates: citations$w,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// bengali template names → the core template they resolve to
const aliases$y = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$n = {
  template: 'cite journal',
  map: {
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
  },
};
const citeBook$s = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$u = {
  template: 'cite web',
  map: {
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
  },
};
const citation$a = {
  template: 'citation',
  map: {
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
  },
};

const citations$v = {
  'akademik dergi kaynağı': citeJournal$n,
  'book reference': citeBook$s,
  'cita web': citeWeb$u,
  'cite chapter': citeBook$s,
  'cite manual': citeBook$s,
  'cite study': citation$a,
  'cite website': citeWeb$u,
  'cite work': citeBook$s,
  'citebook': citeBook$s,
  'citeweb': citeWeb$u,
  'kaynak': citation$a,
  'kitap kaynağı': citeBook$s,
  'web kaynağı': citeWeb$u,
  'استشهاد ويب': citeWeb$u,
  'উদ্ধৃতি': citation$a,
  'ওয়েব উদ্ধৃতি': citeWeb$u,
  'ওয়েব উদ্বৃতি': citeWeb$u,
  'ওয়েব উৎস': citeWeb$u,
  'গ্রন্থ উদ্ধৃতি': citeBook$s,
  'বই উদ্ধৃতি': citeBook$s,
  'সাইট জার্নাল': citeJournal$n,
  'সাময়িকী উদ্ধৃতি': citeJournal$n,
};

const infoboxes$y = ['তথ্যছক শ্রেণীবিন্যাস', 'প্রজাতিছক', 'শ্রেণিবিন্যাস ছক', 'শ্রেণীবিন্যাস ছক'];

var bn = {
  lang: 'bn',
  enLang: 'bengali',
  category: ['বিষয়শ্রেণী'],
  redirect: ['পুনঃনির্দেশ', 'পুনঃর্নির্দেশ', 'পুননির্দেশ', 'পুনর্নির্দেশ'],
  stub: ['অসম্পূর্ণ'],
  infobox: ['তথ্যছক'],
  image: ['চিত্র'],
  reference: [],
  disambig: ['দ্ব্যর্থতা নিরসন'],
  disambigTitle: [],
  aliases: aliases$y,
  infoboxes: infoboxes$y,
  templates: citations$v,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// catalan template names → the core template they resolve to
const aliases$x = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$m = {
  template: 'cite journal',
  map: {
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
  },
};
const citeBook$r = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$t = {
  template: 'cite web',
  map: {
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
  },
};

const citations$u = {
  'article': citeJournal$m,
  'cita diccionari': citeBook$r,
  'cita llibre': citeBook$r,
  'cita publicació': citeJournal$m,
  'cita revista': citeJournal$m,
  'citar llibre': citeBook$r,
  'citar publicació': citeJournal$m,
  'citar web': citeWeb$t,
  'cite paper': citeJournal$m,
  'cite website': citeWeb$t,
  'cite work': citeBook$r,
  'ref llibre': citeBook$r,
  'ref publicació': citeJournal$m,
  'ref web': citeWeb$t,
  'ref-artículo': citeJournal$m,
  'ref-capítol': citeBook$r,
  'ref-llibre': citeBook$r,
  'ref-publicació': citeJournal$m,
  'ref-web': citeWeb$t,
};

const infoboxes$x = [
  'esser viu',
  'ficha de taxón',
  'fitxa de tàxon',
  'iev',
  "infotaula d'ésser viu",
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

var ca = {
  lang: 'ca',
  enLang: 'catalan',
  category: ['categoria'],
  redirect: ['redireccio', 'redireccion', 'redirecció'],
  stub: ['esborrany'],
  infobox: [],
  image: ['fitxer', 'imatge'],
  reference: [],
  disambig: ['desambiguació'],
  disambigTitle: [],
  aliases: aliases$x,
  infoboxes: infoboxes$x,
  templates: citations$u,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// czech template names → the core template they resolve to
const aliases$w = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb$s = {
  template: 'cite web',
  map: {
    'příjmení': 'last',
    'jméno': 'first',
    'autor': 'author',
    'titul': 'title',
    'vydavatel': 'publisher',
    'datum vydání': 'date',
    'datum_vydání': 'date',
  },
};
const citeBook$q = {
  template: 'cite book',
  map: {
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
  },
};

const citations$t = {
  'citace databáze': citeWeb$s,
  'citace elektronické monografie': citeWeb$s,
  'citace elektronického zdroje': citeWeb$s,
  'citace knihy': citeBook$q,
  'citace monografie': citeBook$q,
  'citace webu': citeWeb$s,
};

const infoboxes$w = ['taxonbox'];

var cs = {
  lang: 'cs',
  enLang: 'czech',
  category: ['kat', 'kategorie'],
  redirect: ['presmeruj', 'přesměruj'],
  stub: ['pahýl'],
  infobox: [],
  image: ['obrázok', 'soubor'],
  reference: [],
  disambig: ['rozcestník'],
  disambigTitle: [],
  aliases: aliases$w,
  infoboxes: infoboxes$w,
  templates: citations$t,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// danish template names → the core template they resolve to
const aliases$v = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$l = {
  template: 'cite journal',
  map: {
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
  },
};
const citeWeb$r = {
  template: 'cite web',
  map: {
    'accessdate': 'access-date',
    'editor-last': 'editor',
    'editor1-last': 'editor',
    'editor1': 'editor',
    'editors': 'editor',
    'editor-surname': 'editor',
    'editor1-surname': 'editor',
  },
};
const citation$9 = {
  template: 'citation',
  map: {
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
  },
};
const citeBook$p = {
  template: 'cite book',
  map: {
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
  },
};

const citations$s = {
  'cite magazine': citeJournal$l,
  'cite paper': citeJournal$l,
  'cite pmid': citeJournal$l,
  'cite tidsskrift': citeJournal$l,
  'cite website': citeWeb$r,
  'cite www': citeWeb$r,
  'citejournal': citeJournal$l,
  'citepaper': citeJournal$l,
  'citeweb': citeWeb$r,
  'kilde': citation$9,
  'kilde artikel': citeJournal$l,
  'kilde bog': citeBook$p,
  'kilde tidsskrift': citeJournal$l,
};

const infoboxes$v = ['skabeloner/taksonomi', 'taksoboks', 'taxobox2', 'taxobox3'];

var da = {
  lang: 'da',
  enLang: 'danish',
  category: ['kategori'],
  redirect: [],
  stub: [],
  infobox: ['infoboks'],
  image: ['billede', 'fil'],
  reference: [],
  disambig: ['flertydig'],
  disambigTitle: [],
  aliases: aliases$v,
  infoboxes: infoboxes$v,
  templates: citations$s,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// german template names → the core template they resolve to
const aliases$u = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const internetquelle$h = {
  template: 'cite web',
  map: {
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
  },
};
const citeWeb$q = {
  template: 'cite web',
  map: {
    'lang': 'language',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'accessdate': 'access-date',
  },
};
const literatur$4 = {
  template: 'cite book',
  map: {
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
  },
};

const citations$r = {
  'internetquelle': internetquelle$h,
  'iq': citeWeb$q,
  'literatur': literatur$4,
};

const infoboxes$u = [];

var de = {
  lang: 'de',
  enLang: 'german',
  category: ['kategorie'],
  redirect: ['weiterleitung'],
  stub: [],
  infobox: [],
  image: ['bild', 'datei'],
  reference: ['einzelnachweise'],
  disambig: ['begriffsklärung'],
  disambigTitle: ['begriffsklärung'],
  aliases: aliases$u,
  infoboxes: infoboxes$u,
  templates: citations$r,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// greek template names → the core template they resolve to
const aliases$t = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$o = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$p = {
  template: 'cite web',
  map: {
    'ημερομηνία': 'date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'editor-last': 'editor',
    'editor1-last': 'editor',
    'editors': 'editor',
  },
};
const internetquelle$g = {
  template: 'cite web',
  map: {
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
  },
};

const citations$q = {
  'cita libro': citeBook$o,
  'cite manual': citeBook$o,
  'cite website': citeWeb$p,
  'citebook': citeBook$o,
  'citeweb': citeWeb$p,
  'internetquelle': internetquelle$g,
  'lien web': citeWeb$p,
  'ouvrage': citeBook$o,
};

const infoboxes$t = ['ταξινομοπλαίσιο', 'ταξονομοπλαίσιο'];

var el = {
  lang: 'el',
  enLang: 'greek',
  category: ['κατηγορία'],
  redirect: ['ανακατευθυνση'],
  stub: ['επέκταση'],
  infobox: ['πλαίσιο', 'πλαίσιο πληροφοριών'],
  image: ['αρχείο', 'εικόνα'],
  reference: [],
  disambig: ['αποσαφήνιση'],
  disambigTitle: [],
  aliases: aliases$t,
  infoboxes: infoboxes$t,
  templates: citations$q,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// spanish template names → the core template they resolve to
const aliases$s = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb$o = {
  template: 'cite web',
  map: {
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
  },
};
const citation$8 = {
  template: 'citation',
  map: {
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
  },
};
const citeBook$n = {
  template: 'cite book',
  map: {
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
  },
};
const citeJournal$k = {
  template: 'cite journal',
  map: {
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
  },
};
const internetquelle$f = {
  template: 'cite web',
  map: {
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
  },
};
const literatur$3 = {
  template: 'cite book',
  map: {
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
  },
};

const citations$p = {
  'c w': citeWeb$o,
  'cita informe': citation$8,
  'cita informe técnico': citation$8,
  'cita libro': citeBook$n,
  'cita publicación': citeJournal$k,
  'cita revista': citeJournal$k,
  'cita web': citeWeb$o,
  'cita website': citeWeb$o,
  'cita-web': citeWeb$o,
  'citado en web': citeWeb$o,
  'citalibro': citeBook$n,
  'citar jornal': citeJournal$k,
  'citar libro': citeBook$n,
  'citar patente': citation$8,
  'citar publicación': citeJournal$k,
  'citar web': citeWeb$o,
  'citaweb': citeWeb$o,
  'cite iucn': citeBook$n,
  'cite magazine': citeJournal$k,
  'cite new': citeWeb$o,
  'cite paper': citeJournal$k,
  'cite report': citation$8,
  'cite website': citeWeb$o,
  'cite-web': citeWeb$o,
  'citeweb': citeWeb$o,
  'cw': citeWeb$o,
  'internetquelle': internetquelle$f,
  'lien web': citeWeb$o,
  'literatur': literatur$3,
  'obra citada': citation$8,
  'ouvrage': citeBook$n,
  'ref libro': citeBook$n,
  'ref-libro': citeBook$n,
  'ref-publicació': citeJournal$k,
  'ref-web': citeWeb$o,
  'web cite': citeWeb$o,
  'книга': citeBook$n,
};

const infoboxes$s = ['automatic taxobox', 'ficha de taxon', 'ficha de taxón', 'ficha de virus', 'speciesbox'];

var es = {
  lang: 'es',
  enLang: 'spanish',
  category: ['cat', 'categoría'],
  redirect: ['redireccion', 'redirección'],
  stub: ['esbozo'],
  infobox: ['ficha'],
  image: ['archivo', 'imagen'],
  reference: ['referencias'],
  disambig: ['desambiguación'],
  disambigTitle: [],
  aliases: aliases$s,
  infoboxes: infoboxes$s,
  templates: citations$p,
  gated: {
    'cita requerida': { template: 'citation needed' },
  },
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// persian template names → the core template they resolve to
const aliases$r = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$j = {
  template: 'cite journal',
  map: {
    'trans_title': 'trans-title',
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const internetquelle$e = {
  template: 'cite web',
  map: {
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
  },
};

const citations$o = {
  'cita publicación': citeJournal$j,
  'citation journal': citeJournal$j,
  'cite magazine article': citeJournal$j,
  'cite paper': citeJournal$j,
  'citejournal': citeJournal$j,
  'citepaper': citeJournal$j,
  'internetquelle': internetquelle$e,
};

const infoboxes$r = ['جعبه آرایه زیستی', 'جعبه اطلاعات آرایه زیستی', 'جعبه زیست', 'زیسترده'];

var fa = {
  lang: 'fa',
  enLang: 'persian',
  category: ['رده'],
  redirect: ['تغییر_مسیر', 'تغییرمسیر'],
  stub: ['خرد'],
  infobox: [],
  image: ['تصویر', 'پرونده'],
  reference: [],
  disambig: ['ابهام‌زدایی'],
  disambigTitle: ['ابهام‌زدایی'],
  aliases: aliases$r,
  infoboxes: infoboxes$r,
  templates: citations$o,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// finnish template names → the core template they resolve to
const aliases$q = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$i = {
  template: 'cite journal',
  map: {
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
  },
};
const citeWeb$n = {
  template: 'cite web',
  map: {
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
  },
};
const citeBook$m = {
  template: 'cite book',
  map: {
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
  },
};

const citations$n = {
  'cite magazine': citeJournal$i,
  'citeweb': citeWeb$n,
  'kirjaviite': citeBook$m,
  'lehtiviite': citeJournal$i,
  'verkkoviite': citeWeb$n,
};

const infoboxes$q = ['taksonomia'];

var fi = {
  lang: 'fi',
  enLang: 'finnish',
  category: ['luokka'],
  redirect: ['ohjaus', 'uudelleenohjaus'],
  stub: ['tynkä'],
  infobox: ['tietolaatikko'],
  image: ['kuva', 'tiedosto'],
  reference: [],
  disambig: ['täsmennyssivu'],
  disambigTitle: [],
  aliases: aliases$q,
  infoboxes: infoboxes$q,
  templates: citations$n,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// french template names → the core template they resolve to
const aliases$p = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$h = {
  template: 'cite journal',
  map: {
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
  },
};
const citeWeb$m = {
  template: 'cite web',
  map: {
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
  },
};
const citeBook$l = {
  template: 'cite book',
  map: {
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
  },
};
const literatur$2 = {
  template: 'cite book',
  map: {
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
  },
};

const citations$m = {
  'article': citeJournal$h,
  'cita noticia': citeJournal$h,
  'cita web': citeWeb$m,
  'citar web': citeWeb$m,
  'cite iucn': citeBook$l,
  'cite magazine': citeJournal$h,
  'cite pr': citeWeb$m,
  'cite press release': citeWeb$m,
  'citeweb': citeWeb$m,
  'cytuj stronę': citeWeb$m,
  'lien news': citeJournal$h,
  'lien web': citeWeb$m,
  'lienweb': citeWeb$m,
  'literatur': literatur$2,
  'ouvrage': citeBook$l,
  'périodique': citeJournal$h,
  'référence web': citeWeb$m,
  'site web': citeWeb$m,
};

const infoboxes$p = [];

var fr = {
  lang: 'fr',
  enLang: 'french',
  category: ['catégorie'],
  redirect: ['redirection'],
  stub: ['ébauche'],
  infobox: [],
  image: ['fichier'],
  reference: ['notes et références', 'références'],
  disambig: ['homonymie'],
  disambigTitle: ['homonymie'],
  aliases: aliases$p,
  infoboxes: infoboxes$p,
  templates: citations$m,
  // too generic to claim globally — applied only when a document's lang is 'fr'
  gated: {
    'monnaie': { template: 'currency' },
    'unité': { template: 'currency' },
    'nombre': { template: 'currency' },
    'nb': { template: 'currency' },
    'iso4217': { template: 'currency' },
  },
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// hebrew template names → the core template they resolve to
const aliases$o = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb$l = {
  template: 'cite web',
  map: {
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
  },
};

const citations$l = {
  'citeweb': citeWeb$l,
};

const infoboxes$o = ['מיון'];

var he = {
  lang: 'he',
  enLang: 'hebrew',
  category: ['קט', 'קטגוריה'],
  redirect: ['הפניה'],
  stub: ['קצרמר'],
  infobox: ['תבנית', 'תבנית מידע'],
  image: ['קו', 'קובץ', 'תמונה'],
  reference: [],
  disambig: ['פירושונים'],
  disambigTitle: [],
  aliases: aliases$o,
  infoboxes: infoboxes$o,
  templates: citations$l,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// hindi template names → the core template they resolve to
const aliases$n = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb$k = {
  template: 'cite web',
  map: {
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
  },
};
const citeJournal$g = {
  template: 'cite journal',
  map: {
    'trans_title': 'trans-title',
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const citation$7 = {
  template: 'citation',
  map: {
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
  },
};
const citeBook$k = {
  template: 'cite book',
  map: {
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
  },
};

const citations$k = {
  'cite blog': citeWeb$k,
  'cite website': citeWeb$k,
  'cite-web': citeWeb$k,
  'citejournal': citeJournal$g,
  'web cite': citeWeb$k,
  'web kaynağı': citeWeb$k,
  'उद्धरण': citation$7,
  'उद्धृत अंतर्जाल': citeWeb$k,
  'जर्नल सन्दर्भ': citeJournal$g,
  'पुस्तक सन्दर्भ': citeBook$k,
  'वेब संदर्भ': citeWeb$k,
  'वेब सन्दर्भ': citeWeb$k,
  'संदर्भ': citation$7,
};

const infoboxes$n = ['टैक्सोबॉक्स'];

var hi = {
  lang: 'hi',
  enLang: 'hindi',
  category: ['श्र', 'श्रेणी'],
  redirect: ['अनुप्रेषित', 'पुनर्निर्देशन', 'पुनर्प्रेषित'],
  stub: ['आधार'],
  infobox: ['ज्ञानसन्दूक'],
  image: ['चित्र'],
  reference: [],
  disambig: ['बहुविकल्पी शब्द'],
  disambigTitle: [],
  aliases: aliases$n,
  infoboxes: infoboxes$n,
  templates: citations$k,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// croatian template names → the core template they resolve to
const aliases$m = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$j = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$j = {
  template: 'cite web',
  map: {
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
  },
};
const citeJournal$f = {
  template: 'cite journal',
  map: {
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
  },
};

const citations$j = {
  'bokref': citeBook$j,
  'cite manual': citeBook$j,
  'citebook': citeBook$j,
  'citiraj knjigu': citeBook$j,
  'citiranje knjige': citeBook$j,
  'citiranje knjige/1': citeBook$j,
  'citiranje weba': citeWeb$j,
  'citiranje weba/1': citeWeb$j,
  'citiranje www': citeWeb$j,
  'citiranje časopisa': citeJournal$f,
  'citiranje časopisa/1': citeJournal$f,
  'tidskriftsref': citeJournal$f,
  'webbref': citeWeb$j,
};

const infoboxes$m = ['taksokvir'];

var hr = {
  lang: 'hr',
  enLang: 'croatian',
  category: ['ct', 'kategorija', 'kt'],
  redirect: ['preusmjeri'],
  stub: ['mrva'],
  infobox: ['generalni', 'infookvir'],
  image: ['datoteka', 'dt', 'slika'],
  reference: [],
  disambig: ['razdvojba'],
  disambigTitle: [],
  aliases: aliases$m,
  infoboxes: infoboxes$m,
  templates: citations$j,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// hungarian template names → the core template they resolve to
const aliases$l = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$i = {
  template: 'cite book',
  map: {
    'pp': 'pages',
  },
};
const citeJournal$e = {
  template: 'cite journal',
  map: {
    'pp': 'pages',
  },
};
const citeWeb$i = {
  template: 'cite web',
  map: {
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const internetquelle$d = {
  template: 'cite web',
  map: {
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
  },
};

const citations$i = {
  'cite chapter': citeBook$i,
  'cite paper': citeJournal$e,
  'cite-web': citeWeb$i,
  'citeweb': citeWeb$i,
  'internetquelle': internetquelle$d,
  'web cite': citeWeb$i,
  'weblap hivatkozás': citeWeb$i,
};

const infoboxes$l = ['taxobox szerkesztése'];

var hu = {
  lang: 'hu',
  enLang: 'hungarian',
  category: ['kategória'],
  redirect: ['átirányítás'],
  stub: ['csonk'],
  infobox: [],
  image: ['fájl', 'kép'],
  reference: [],
  disambig: ['egyért'],
  disambigTitle: [],
  aliases: aliases$l,
  infoboxes: infoboxes$l,
  templates: citations$i,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// indonesian template names → the core template they resolve to
const aliases$k = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$h = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$h = {
  template: 'cite web',
  map: {
    'accessdate': 'access-date',
    'editor-last': 'editor',
    'editor1-last': 'editor',
    'editors': 'editor',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const citeJournal$d = {
  template: 'cite journal',
  map: {
    'trans_title': 'trans-title',
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const internetquelle$c = {
  template: 'cite web',
  map: {
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
  },
};

const citations$h = {
  'book reference': citeBook$h,
  'buku kutipan': citeBook$h,
  'chú thích web': citeWeb$h,
  'cita web': citeWeb$h,
  'citar livro': citeBook$h,
  'citar web': citeWeb$h,
  'citation journal': citeJournal$d,
  'cite blog': citeWeb$h,
  'cite buku': citeBook$h,
  'cite magazine article': citeJournal$d,
  'cite url': citeWeb$h,
  'cite web.': citeWeb$h,
  'cite webpage': citeWeb$h,
  'cite website': citeWeb$h,
  'cite work': citeBook$h,
  'cite-web': citeWeb$h,
  'citebook': citeBook$h,
  'citejournal': citeJournal$d,
  'citeweb': citeWeb$h,
  'internetquelle': internetquelle$c,
  'kutip buku': citeBook$h,
  'kutip web': citeWeb$h,
  'kutipan buku': citeBook$h,
  'kutipan web': citeWeb$h,
  'memetik web': citeWeb$h,
  'mengutip web': citeWeb$h,
  'referensi buku': citeBook$h,
  'referensi web': citeWeb$h,
  'tidskriftsref': citeJournal$d,
  'web': citeWeb$h,
  'web cite': citeWeb$h,
  'web reference': citeWeb$h,
};

const infoboxes$k = [
  'kotaktaksonomi',
  'kotaktaksonomi bagian binomial',
  'kotaktaksonomi phylum entry',
  'kotaktaksonomi subclassis entry',
  'kotaktaksonomi subfamilia entry',
  'kotaktaksonomi subordo entry',
  'taxobox begin',
];

var id = {
  lang: 'id',
  enLang: 'indonesian',
  category: ['kategori'],
  redirect: ['alih'],
  stub: [],
  infobox: [],
  image: ['berkas', 'gambar'],
  reference: [],
  disambig: ['disambiguasi'],
  disambigTitle: [],
  aliases: aliases$k,
  infoboxes: infoboxes$k,
  templates: citations$h,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// italian template names → the core template they resolve to
const aliases$j = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$g = {
  template: 'cite book',
  map: {
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
  },
};
const citeJournal$c = {
  template: 'cite journal',
  map: {
    'autore': 'author',
    'data': 'date',
    'anno': 'year',
    'titolo': 'title',
    'rivista': 'journal',
    'editore': 'publisher',
    'p': 'page',
    'pp': 'pages',
    'lingua': 'language',
  },
};
const citeWeb$g = {
  template: 'cite web',
  map: {
    'autore': 'author',
    'titolo': 'title',
    'p': 'page',
    'data': 'date',
  },
};
const citation$6 = {
  template: 'citation',
  map: {
    'vol': 'volume',
  },
};

const citations$g = {
  'cita libro': citeBook$g,
  'cita periodico': citeJournal$c,
  'cita pubblicazione': citeJournal$c,
  'cita rivista': citeJournal$c,
  'cita sito': citeWeb$g,
  'cita testo': citation$6,
  'cita web': citeWeb$g,
  'cw': citeWeb$g,
  'lien web': citeWeb$g,
};

const infoboxes$j = ['tassobox'];

var it = {
  lang: 'it',
  enLang: 'italian',
  category: ['cat', 'categoria'],
  redirect: ['rimando', 'rinvia', 'rinvio'],
  stub: ['s'],
  infobox: [],
  image: ['immagine'],
  reference: [],
  disambig: ['disambigua'],
  disambigTitle: ['disambigua'],
  aliases: aliases$j,
  infoboxes: infoboxes$j,
  templates: citations$g,
  gated: {
    'citazione necessaria': { template: 'citation needed' },
  },
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// japanese template names → the core template they resolve to
const aliases$i = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb$f = {
  template: 'cite web',
  map: {
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const citeBook$f = {
  template: 'cite book',
  map: {
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
  },
};
const citeJournal$b = {
  template: 'cite journal',
  map: {
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
  },
};
const citation$5 = {
  template: 'citation',
  map: {
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
  },
};
const internetquelle$b = {
  template: 'cite web',
  map: {
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
  },
};

const citations$f = {
  'cite blog': citeWeb$f,
  'cite book/draft/cite book': citeBook$f,
  'cite magazine': citeJournal$b,
  'cite manual': citeBook$f,
  'cite paper': citeJournal$b,
  'cite study': citation$5,
  'cite url': citeWeb$f,
  'cite web/german': citeWeb$f,
  'cite web/和書': citeWeb$f,
  'cite website': citeWeb$f,
  'cite work': citeBook$f,
  'cite-web': citeWeb$f,
  'citebook': citeBook$f,
  'citejournal': citeJournal$b,
  'citeweb': citeWeb$f,
  'cw': citeWeb$f,
  'internetquelle': internetquelle$b,
  'ref web': citeWeb$f,
  'web cite': citeWeb$f,
};

const infoboxes$i = ['生物分類表'];

var ja = {
  lang: 'ja',
  enLang: 'japanese',
  category: ['カテゴリ'],
  redirect: ['リダイレクト', '転送', '＃リダイレクト', '＃転送'],
  stub: [],
  infobox: [],
  image: ['ファイル', '画像'],
  reference: ['脚注'],
  disambig: ['aimai', '曖昧さ回避'],
  disambigTitle: ['曖昧さ回避'],
  aliases: aliases$i,
  infoboxes: infoboxes$i,
  templates: citations$f,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// korean template names → the core template they resolve to
const aliases$h = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$e = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$e = {
  template: 'cite web',
  map: {
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
  },
};
const citeJournal$a = {
  template: 'cite journal',
  map: {
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
  },
};
const internetquelle$a = {
  template: 'cite web',
  map: {
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
  },
};

const citations$e = {
  'cita libro': citeBook$e,
  'cita web': citeWeb$e,
  'cite blog': citeWeb$e,
  'cite manual': citeBook$e,
  'cite paper': citeJournal$a,
  'cite website': citeWeb$e,
  'cite work': citeBook$e,
  'cite-web': citeWeb$e,
  'citebook': citeBook$e,
  'citeweb': citeWeb$e,
  'internetquelle': internetquelle$a,
  '도서 인용': citeBook$e,
  '문서 인용': citeJournal$a,
  '서적 인용': citeBook$e,
  '서적인용': citeBook$e,
  '웹 인용': citeWeb$e,
  '웹인용': citeWeb$e,
  '저널 인용': citeJournal$a,
  '저널인용': citeJournal$a,
  '책 인용': citeBook$e,
  '학술지 인용': citeJournal$a,
};

const infoboxes$h = ['새 정보', '생물 분류'];

var ko = {
  lang: 'ko',
  enLang: 'korean',
  category: ['분류'],
  redirect: ['넘겨주기'],
  stub: ['토막글'],
  infobox: ['정보상자'],
  image: ['그림', '파일'],
  reference: [],
  disambig: ['동음이의'],
  disambigTitle: ['동음이의'],
  aliases: aliases$h,
  infoboxes: infoboxes$h,
  templates: citations$e,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// malay template names → the core template they resolve to
const aliases$g = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$d = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$d = {
  template: 'cite web',
  map: {
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
  },
};
const citeJournal$9 = {
  template: 'cite journal',
  map: {
    'trans_title': 'trans-title',
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const internetquelle$9 = {
  template: 'cite web',
  map: {
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
  },
};

const citations$d = {
  'book reference': citeBook$d,
  'cita web': citeWeb$d,
  'cite paper': citeJournal$9,
  'cite url': citeWeb$d,
  'cite website': citeWeb$d,
  'cite work': citeBook$d,
  'cite-web': citeWeb$d,
  'citebook': citeBook$d,
  'citeweb': citeWeb$d,
  'internetquelle': internetquelle$9,
  'kutip buku': citeBook$d,
  'kutip jurnal': citeJournal$9,
  'kutip web': citeWeb$d,
  'petik buku': citeBook$d,
  'petik jurnal': citeJournal$9,
  'petik web': citeWeb$d,
  'web cite': citeWeb$d,
};

const infoboxes$g = ['kotak info taksonomi', 'kotak taksonomi'];

var ms = {
  lang: 'ms',
  enLang: 'malay',
  category: ['kategori'],
  redirect: ['lencong'],
  stub: ['tunas'],
  infobox: [],
  image: ['fail', 'imej'],
  reference: [],
  disambig: ['nyahkekaburan'],
  disambigTitle: [],
  aliases: aliases$g,
  infoboxes: infoboxes$g,
  templates: citations$d,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// dutch template names → the core template they resolve to
const aliases$f = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$c = {
  template: 'cite book',
  map: {
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
  },
};
const citeJournal$8 = {
  template: 'cite journal',
  map: {
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
  },
};
const citeWeb$c = {
  template: 'cite web',
  map: {
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
  },
};

const citations$c = {
  'citeer boek': citeBook$c,
  'citeer journal': citeJournal$8,
  'citeer web': citeWeb$c,
  'citeweb': citeWeb$c,
  'jayden54~nlwiki/voetnoot web': citeWeb$c,
  'voetnoot web': citeWeb$c,
};

const infoboxes$f = [];

var nl = {
  lang: 'nl',
  enLang: 'dutch',
  category: ['categorie'],
  redirect: ['doorverwijzing'],
  stub: ['beginnetje'],
  infobox: ['infobox generiek'],
  image: ['afbeelding', 'bestand'],
  reference: ['bronnen'],
  disambig: ['doorverwijspagina', 'dp'],
  disambigTitle: [],
  aliases: aliases$f,
  infoboxes: infoboxes$f,
  templates: citations$c,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// norwegian template names → the core template they resolve to
const aliases$e = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$b = {
  template: 'cite book',
  map: {
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
  },
};
const citeJournal$7 = {
  template: 'cite journal',
  map: {
    'sitat': 'quote',
  },
};
const citeWeb$b = {
  template: 'cite web',
  map: {
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
  },
};

const citations$b = {
  'bok': citeBook$b,
  'kilde artikkel': citeJournal$7,
  'kilde bok': citeBook$b,
  'kilde web': citeWeb$b,
  'kilde www': citeWeb$b,
  'tidsskriftsref': citeJournal$7,
};

const infoboxes$e = [
  'infoboks taksoboks',
  'taksoboks',
  'taksoboks fugl',
  'taksoboks krepsdyr',
  'taksoboks-kunstig-gruppe',
];

var no = {
  lang: 'no',
  enLang: 'norwegian',
  category: ['kategori'],
  redirect: ['omdiriger', 'omdirigering'],
  stub: ['spire'],
  infobox: ['infoboks'],
  image: ['bilde', 'fil'],
  reference: [],
  disambig: ['peker'],
  disambigTitle: [],
  aliases: aliases$e,
  infoboxes: infoboxes$e,
  templates: citations$b,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// polish template names → the core template they resolve to
const aliases$d = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citation$4 = {
  template: 'citation',
  map: {
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
  },
};
const citeJournal$6 = {
  template: 'cite journal',
  map: {
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
  },
};
const citeBook$a = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$a = {
  template: 'cite web',
  map: {
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
  },
};

const citations$a = {
  'cytuj': citation$4,
  'cytuj czasopismo': citeJournal$6,
  'cytuj książkę': citeBook$a,
  'cytuj pismo': citeJournal$6,
  'cytuj stronę': citeWeb$a,
};

const infoboxes$d = ['takson infobox'];

var pl = {
  lang: 'pl',
  enLang: 'polish',
  category: ['kategoria'],
  redirect: ['patrz', 'przekieruj', 'tam'],
  stub: [],
  infobox: [],
  image: ['grafika', 'plik'],
  reference: [],
  disambig: ['ujednoznacznienie'],
  disambigTitle: ['ujednoznacznienie'],
  aliases: aliases$d,
  infoboxes: infoboxes$d,
  templates: citations$a,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// portuguese template names → the core template they resolve to
const aliases$c = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$5 = {
  template: 'cite journal',
  map: {
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
  },
};
const citeBook$9 = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$9 = {
  template: 'cite web',
  map: {
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
  },
};
const internetquelle$8 = {
  template: 'cite web',
  map: {
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
  },
};
const literatur$1 = {
  template: 'cite book',
  map: {
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
  },
};

const citations$9 = {
  'article': citeJournal$5,
  'cita libro': citeBook$9,
  'cita publicación periódica': citeJournal$5,
  'cita web': citeWeb$9,
  'citar livro': citeBook$9,
  'citar manual': citeBook$9,
  'citar periodico': citeJournal$5,
  'citar periódico': citeJournal$5,
  'citar página': citeWeb$9,
  'citar web': citeWeb$9,
  'citarlivro': citeBook$9,
  'cite chapter': citeBook$9,
  'cite manual': citeBook$9,
  'cite paper': citeJournal$5,
  'citeer web': citeWeb$9,
  'citeweb': citeWeb$9,
  'internetquelle': internetquelle$8,
  'lien web': citeWeb$9,
  'literatur': literatur$1,
  'ouvrage': citeBook$9,
  'ref-livro': citeBook$9,
  'ref-web': citeWeb$9,
  'referência a livro': citeBook$9,
  'webbref': citeWeb$9,
};

const infoboxes$c = ['ficha de taxón', 'info/taxonomia', 'takson infobox', 'taxoboxe'];

var pt = {
  lang: 'pt',
  enLang: 'portuguese',
  category: ['cat', 'categoria'],
  redirect: ['redirecionamento'],
  stub: ['esboço'],
  infobox: ['info', 'infocaixa'],
  image: ['arquivo', 'ficheiro', 'imagem'],
  reference: [],
  disambig: ['desambiguação'],
  disambigTitle: ['desambiguação'],
  aliases: aliases$c,
  infoboxes: infoboxes$c,
  templates: citations$9,
  gated: {
    'pbpe': 0, // português brasileiro/europeu — keeps the first form
  },
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// romanian template names → the core template they resolve to
const aliases$b = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$8 = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$8 = {
  template: 'cite web',
  map: {
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
  },
};
const citeJournal$4 = {
  template: 'cite journal',
  map: {
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
  },
};
const citation$3 = {
  template: 'citation',
  map: {
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
  },
};
const literatur = {
  template: 'cite book',
  map: {
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
  },
};

const citations$8 = {
  'cita libro': citeBook$8,
  'cita news': citeWeb$8,
  'cita publicación': citeJournal$4,
  'cita web': citeWeb$8,
  'citace monografie': citeBook$8,
  'citar web': citeWeb$8,
  'citare': citation$3,
  'citat carte': citeBook$8,
  'citat carte-lua': citeBook$8,
  'citat revistă': citeJournal$4,
  'citat web': citeWeb$8,
  'citat web-lua': citeWeb$8,
  'citat website': citeWeb$8,
  'citați jurnalul': citeJournal$4,
  'citați web': citeWeb$8,
  'cite paper': citeJournal$4,
  'cite revistă': citeJournal$4,
  'cite web2': citeWeb$8,
  'cite website': citeWeb$8,
  'citează cartea': citeBook$8,
  'citează web': citeWeb$8,
  'citeweb': citeWeb$8,
  'cîte web': citeWeb$8,
  'link web': citeWeb$8,
  'literatur': literatur,
  'web cite': citeWeb$8,
};

const infoboxes$b = ['casetă taxonomie', 'cutietaxonomie'];

var ro = {
  lang: 'ro',
  enLang: 'romanian',
  category: ['categorie'],
  redirect: ['redirecteaza'],
  stub: ['ciot'],
  infobox: ['infocasetă'],
  image: ['fişier', 'fișier', 'imagine'],
  reference: [],
  disambig: ['dezambiguizare'],
  disambigTitle: [],
  aliases: aliases$b,
  infoboxes: infoboxes$b,
  templates: citations$8,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// russian template names → the core template they resolve to
const aliases$a = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$7 = {
  template: 'cite book',
  map: {
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
  },
};
const citeJournal$3 = {
  template: 'cite journal',
  map: {
    'год': 'year',
    'lang': 'language',
  },
};
const citeWeb$7 = {
  template: 'cite web',
  map: {
    'datepublished': 'date',
    'lang': 'language',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'accessdate': 'access-date',
  },
};
const internetquelle$7 = {
  template: 'cite web',
  map: {
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
  },
};

const citations$7 = {
  'cita libro': citeBook$7,
  'cita publicación': citeJournal$3,
  'cita web': citeWeb$7,
  'cite mag': citeJournal$3,
  'cite magazine': citeJournal$3,
  'cite paper': citeJournal$3,
  'cite periodical': citeJournal$3,
  'cite work': citeBook$7,
  'citejournal': citeJournal$3,
  'citeweb': citeWeb$7,
  'cw': citeWeb$7,
  'cytuj książkę': citeBook$7,
  'internetquelle': internetquelle$7,
  'веб-сайт': citeWeb$7,
};

const infoboxes$a = [];

var ru = {
  lang: 'ru',
  enLang: 'russian',
  category: ['к', 'категория'],
  redirect: ['перенапр', 'перенаправление'],
  stub: ['заготовка'],
  infobox: ['карточка'],
  image: ['изображение', 'файл'],
  reference: ['примечания'],
  disambig: ['неоднозначность'],
  disambigTitle: ['значения'],
  aliases: aliases$a,
  infoboxes: infoboxes$a,
  templates: citations$7,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// simple-english template names → the core template they resolve to
const aliases$9 = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$6 = {
  template: 'cite book',
  map: {
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
  },
};
const citeWeb$6 = {
  template: 'cite web',
  map: {
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
  },
};
const citation$2 = {
  template: 'citation',
  map: {
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
  },
};
const internetquelle$6 = {
  template: 'cite web',
  map: {
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
  },
};

const citations$6 = {
  'book source': citeBook$6,
  'cita web': citeWeb$6,
  'cite manual': citeBook$6,
  'cite study': citation$2,
  'cite web/german': citeWeb$6,
  'cite website': citeWeb$6,
  'cite work': citeBook$6,
  'citebook': citeBook$6,
  'citebooks': citeBook$6,
  'citeweb': citeWeb$6,
  'internetquelle': internetquelle$6,
  'web link': citeWeb$6,
  'web-cite': citeWeb$6,
};

const infoboxes$9 = ['tx'];

var simple = {
  lang: 'simple',
  enLang: 'simple-english',
  category: [],
  redirect: [],
  stub: [],
  infobox: [],
  image: [],
  reference: [],
  disambig: [],
  disambigTitle: [],
  aliases: aliases$9,
  infoboxes: infoboxes$9,
  templates: citations$6,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// slovak template names → the core template they resolve to
const aliases$8 = {
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

const infoboxes$8 = [];

var sk = {
  lang: 'sk',
  enLang: 'slovak',
  category: ['kategória'],
  redirect: ['presmeruj', 'přesměruj'],
  stub: ['výhonok'],
  infobox: [],
  image: ['obrázok', 'súbor'],
  reference: [],
  disambig: ['rozlišovacia stránka'],
  disambigTitle: [],
  aliases: aliases$8,
  infoboxes: infoboxes$8,
  templates: {},
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// serbian template names → the core template they resolve to
const aliases$7 = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb$5 = {
  template: 'cite web',
  map: {
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
  },
};
const citeBook$5 = {
  template: 'cite book',
  map: {
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
  },
};
const internetquelle$5 = {
  template: 'cite web',
  map: {
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
  },
};

const citations$5 = {
  'cita web': citeWeb$5,
  'cite chapter': citeBook$5,
  'cite manual': citeBook$5,
  'cite website': citeWeb$5,
  'cite work': citeBook$5,
  'citebook': citeBook$5,
  'citeweb': citeWeb$5,
  'citiranje weba': citeWeb$5,
  'internetquelle': internetquelle$5,
  'web cite': citeWeb$5,
  'web kaynağı': citeWeb$5,
  'цитат веба': citeWeb$5,
  'ците веб': citeWeb$5,
  'цитирање књиге': citeBook$5,
};

const infoboxes$7 = [];

var sr = {
  lang: 'sr',
  enLang: 'serbian',
  category: ['kategorija', 'категорија'],
  redirect: ['preusmeri', 'preusmjeri', 'преусмери', 'преусмјери'],
  stub: ['клица'],
  infobox: ['инфокутија'],
  image: ['datoteka', 'fotografija', 'slika', 'датотека', 'слика', 'фотографија'],
  reference: [],
  disambig: ['вишезначна одредница'],
  disambigTitle: [],
  aliases: aliases$7,
  infoboxes: infoboxes$7,
  templates: citations$5,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// swedish template names → the core template they resolve to
const aliases$6 = {
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

const infoboxes$6 = [];

var sv = {
  lang: 'sv',
  enLang: 'swedish',
  category: ['kategori'],
  redirect: ['omdirigering'],
  stub: [],
  infobox: ['faktamall'],
  image: ['bild', 'fil'],
  reference: ['referenser'],
  disambig: ['förgrening'],
  disambigTitle: [],
  aliases: aliases$6,
  infoboxes: infoboxes$6,
  templates: {},
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// thai template names → the core template they resolve to
const aliases$5 = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb$4 = {
  template: 'cite web',
  map: {
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
  },
};
const citeBook$4 = {
  template: 'cite book',
  map: {
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
  },
};
const internetquelle$4 = {
  template: 'cite web',
  map: {
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
  },
};

const citations$4 = {
  'cita web': citeWeb$4,
  'citar web': citeWeb$4,
  'cite blog': citeWeb$4,
  'cite manual': citeBook$4,
  'cite web/german': citeWeb$4,
  'cite webpage': citeWeb$4,
  'cite website': citeWeb$4,
  'cite work': citeBook$4,
  'cite หนังสือ': citeBook$4,
  'cite-web': citeWeb$4,
  'citebook': citeBook$4,
  'citeweb': citeWeb$4,
  'cw': citeWeb$4,
  'internetquelle': internetquelle$4,
};

const infoboxes$5 = ['ตารางจำแนกพันธุ์', 'พฤกษศาสตร์', 'สัตววิทยา', 'อนุกรมภิธาน'];

var th = {
  lang: 'th',
  enLang: 'thai',
  category: ['หมวดหมู่'],
  redirect: ['เปลี่ยนทาง'],
  stub: ['โครง'],
  infobox: ['กล่องข้อมูล'],
  image: ['ภาพ', 'ไฟล์'],
  reference: [],
  disambig: ['แก้ความกำกวม'],
  disambigTitle: [],
  aliases: aliases$5,
  infoboxes: infoboxes$5,
  templates: citations$4,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// turkish template names → the core template they resolve to
const aliases$4 = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$2 = {
  template: 'cite journal',
  map: {
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
  },
};
const citeWeb$3 = {
  template: 'cite web',
  map: {
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
  },
};
const internetquelle$3 = {
  template: 'cite web',
  map: {
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
  },
};
const citation$1 = {
  template: 'citation',
  map: {
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
  },
};
const citeBook$3 = {
  template: 'cite book',
  map: {
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
  },
};

const citations$3 = {
  'akademik dergi kaynağı': citeJournal$2,
  'cite science': citeJournal$2,
  'citeweb': citeWeb$3,
  'internetquelle': internetquelle$3,
  'i̇nternet kaynağı': citeWeb$3,
  'kaynak': citation$1,
  'kaynak kitap': citeBook$3,
  'kaynaklar': citation$1,
  'kitap kaynağı': citeBook$3,
  'kitapkaynağı': citeBook$3,
  'web cite': citeWeb$3,
  'web kaynağı': citeWeb$3,
  'webbref': citeWeb$3,
  'webkaynağı': citeWeb$3,
};

const infoboxes$4 = ['takso kutu', 'takso kutusu', 'taksokutu'];

var tr = {
  lang: 'tr',
  enLang: 'turkish',
  category: ['kat', 'kategori'],
  redirect: ['yönlendir', 'yönlendirme', 'yönlendi̇r', 'yönlendi̇rme'],
  stub: ['taslak'],
  infobox: ['bilgi', 'bilgi kutusu'],
  image: ['dosya', 'resim'],
  reference: [],
  disambig: ['anlam ayrımı'],
  disambigTitle: [],
  aliases: aliases$4,
  infoboxes: infoboxes$4,
  templates: citations$3,
};

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// ukrainian template names → the core template they resolve to
const aliases$3 = {
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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal$1 = {
  template: 'cite journal',
  map: {
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
  },
};
const citeWeb$2 = {
  template: 'cite web',
  map: {
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
  },
};
const citeBook$2 = {
  template: 'cite book',
  map: {
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
  },
};
const internetquelle$2 = {
  template: 'cite web',
  map: {
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
  },
};

const citations$2 = {
  'article': citeJournal$1,
  'citace elektronické monografie': citeWeb$2,
  'citar web': citeWeb$2,
  'citat web': citeWeb$2,
  'cite blog': citeWeb$2,
  'cite manual': citeBook$2,
  'cite url': citeWeb$2,
  'cite web/de': citeWeb$2,
  'cite web/uk': citeWeb$2,
  'cite work': citeBook$2,
  'cite книга': citeBook$2,
  'cite-web': citeWeb$2,
  'cited journal': citeJournal$1,
  'cited web': citeWeb$2,
  'citeer web': citeWeb$2,
  'citejournal': citeJournal$1,
  'citeweb': citeWeb$2,
  'cw': citeWeb$2,
  'internetquelle': internetquelle$2,
  'lien web': citeWeb$2,
  'ref-publicació': citeJournal$1,
  'ref-web': citeWeb$2,
  'site web': citeWeb$2,
  'tīmekļa atsauce': citeWeb$2,
  'vcite2 journal': citeJournal$1,
  'web citation': citeWeb$2,
  'web cite': citeWeb$2,
  'книгаапа': citeBook$2,
  'привести сайту': citeWeb$2,
  'цитувати журнал': citeJournal$1,
};

const infoboxes$3 = ['організм', 'таксобокс'];

var uk = {
  lang: 'uk',
  enLang: 'ukrainian',
  category: ['категория', 'категорія'],
  redirect: ['перенапр', 'перенаправление', 'перенаправлення'],
  stub: ['заготовка'],
  infobox: ['картка'],
  image: ['зображення', 'изображение', 'файл'],
  reference: [],
  disambig: [],
  disambigTitle: [],
  aliases: aliases$3,
  infoboxes: infoboxes$3,
  templates: citations$2,
};

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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook$1 = {
  template: 'cite book',
  map: {
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
  },
};
const citation = {
  template: 'citation',
  map: {
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
  },
};
const citeWeb$1 = {
  template: 'cite web',
  map: {
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
  },
};
const internetquelle$1 = {
  template: 'cite web',
  map: {
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
  },
};

const citations$1 = {
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

const infoboxes$2 = ['bảng phân loại', 'phân loại khoa học'];

var vi = {
  lang: 'vi',
  enLang: 'vietnamese',
  category: ['thể loại'],
  redirect: ['đổi'],
  stub: ['sơ khai'],
  infobox: ['hộp thông tin'],
  image: ['hình', 'tập tin'],
  reference: [],
  disambig: ['trang định hướng'],
  disambigTitle: [],
  aliases: aliases$2,
  infoboxes: infoboxes$2,
  templates: citations$1,
};

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

// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook = {
  template: 'cite book',
  map: {
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
  },
};
const citeJournal = {
  template: 'cite journal',
  map: {
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const citeWeb = {
  template: 'cite web',
  map: {
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
};
const internetquelle = {
  template: 'cite web',
  map: {
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
  },
};

const citations = {
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

const infoboxes$1 = ['分类框'];

var zh = {
  lang: 'zh',
  enLang: 'chinese',
  category: ['cat', '分类', '分類'],
  redirect: ['重定向', '重新導向'],
  stub: [],
  infobox: [],
  image: ['图像', '图片', '圖像', '圖片', '文件', '档案', '檔案'],
  reference: [],
  disambig: ['消歧义'],
  disambigTitle: ['消歧義'],
  aliases: aliases$1,
  infoboxes: infoboxes$1,
  templates: citations,
};

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

var other = {
  lang: 'other',
  enLang: 'other',
  category: [
    'abdeeling', // pdc
    'bólkur', // fo
    'catagóir', // ga
    'categorîa', // lij
    'categorìa', // pms
    'catègorie', // frp
    'categuria', // lmo
    'catigurìa', // scn
    'class', // kw
    'ẹ̀ka', // yo
    'flocc',
    'flokkur',
    'grup', // tpi
    'jamii', // sw
    'kaarangay', // war
    'kateggoría', // lad
    'kategorî', // ku
    'kategoriija', // se
    'kategoriýa', // tk
    'kategoriye', // diq
    'kategory', // fy
    'kategorya', // tl
    'katiguriya', // qu
    'klad', // vo
    'ñemohenda', // gn
    'roinn', // gd
    'ronney', // gv
    'rummad', // br
    'setensele', // nso
    'sokajy', // mg
    'sumut', // kl
    'төркем', // tt
    'تۈر', // ug
  ],
  redirect: [
    'aanstuur', // af
    'aastiurey',
    'adkas', // br
    'alidirekto',
    'aýdaw',
    'baw-ing',
    'beralîkirin', // ku
    'đổi hướng đến đây',
    'header',
    'i̇stiqamətləndirmə',
    'ohjaa tänne',
    'pāradresācija',
    'přesměrování',
    'preusmjerava',
    'preusmjerenje',
    'przekierowanie',
    'redir',
    'redirect3',
    'redirige aquí',
    'redirige',
    'redirixe equí',
    'rindirizz',
    'stivre deike',
    'suunamine',
    'tilvísun',
    'trimite',
    'weiterleitungshinweis',
    'багыттама',
    'буссинаби',
    'дӏасахьажорг',
    'от пренасочване',
    'перанакіраванне',
    'перанакіраваньне',
    'перанакіроўваецца сюды',
    'перенаправлено',
    'преусмерава',
    'равонакунӣ',
    'ווייטערפירן', // yi
    'යළියොමුව',
    'ប្តូរទីតាំងទៅ', // km
    '다른 뜻 넘어옴',
    '跳轉',
  ],
  stub: [
    'aboç',
    'ahurhire',
    'amud',
    'avixo de spigaso',
    'bibarilo',
    'borrador',
    'buáng-nàng-hâ',
    'bun',
    'buntato',
    'c-supranu',
    'cahrot',
    'choutchette',
    'danvez pennad',
    'djermon',
    'ébeuche',
    'ebòch',
    'édéntạ',
    'ẹ̀kúnrẹ́rẹ́',
    'entamu',
    'esbòs',
    'gumud',
    'ʻōmuku',
    'junj',
    'klado',
    'maramara',
    'mayele',
    'mbegu',
    'na mulno',
    'nadabeigts rakstīņs',
    'nalta',
    'narcce',
    'pecietta',
    'phí',
    'pondok',
    'por mejoral',
    'potuʻi',
    'pungol',
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
    'stipula',
    'stob',
    'stobbe',
    'stompje',
    'stubben',
    'stubbi',
    'stubbur',
    'stump',
    'stumpen',
    'stycce',
    'suli',
    'taslaq',
    'turók',
    'vangovango',
    'vernuşte',
    'xinnoo',
    'zarodk',
    'әҙерләмә',
    'керф',
    'кечдар',
    'къæртт',
    'кьурхь',
    'мәкалә төпчеге',
    'накід',
    'нєꙁаврьшєнъ члѣнъ',
    'омоон',
    'стыржень',
    'хурд',
    'хӏадурунжо',
    'መዋቅር',
    'መዋቕር',
    'अपूर्णलेखः',
    'ठुटो',
    'धाक्टें पान',
    'विस्तार',
    'পোখালি',
    'સ્ટબ',
    'ଅଧାଗଢ଼ା',
    'ಎಲ್ಯ',
    'ಚುಟುಕು',
    'අංකුරය',
    'ཆ་མི་ཚང་བ',
    'អត្ថបទខ្លីមិនពេញលេញ',
    '楔',
    '芻文',
  ],
  infobox: [
    'amatl',
    'anfo', // mwl
    'anuāmapa', // haw
    'boaty fampahalalana',
    'boaty', // mg
    'boestkelaouiñ', // br
    'bosca', // ga
    'capsa', // la
    'diehtokássa', // se
    'infoboesse 2',
    'infobokis', // tpi
    'infobox deleted',
    'infobox generic',
    'infochascha', // rm
    'infokašćik', // dsb
    'infoschede',
    'infoskreine', // ltg
    'inligtingskas',
    'inligtingskas3', // af
    'inligtingskas4', // af
    'kishtey fys',
    'kotak info',
    'kotak', // su
    'simple box',
    'tertcita tanxe',
    'tertcita', // jbo
    'tiätuloová',
    'wd bosca sonraí',
    'yerleşim bilgi kutusu',
    'ynfoboks generyk',
    'ynfoboks', // fy
    'акарточка', // ab
    'аҥа', // mhr
    'інфобокс', // rue
    'канадский',
    'карточка2', // mdf
    'карточкарус', // ba
    'картуш', // koi
    'қуттӣ', // tg
    'ڄاڻخانو', // sd
    'لغة',
    'معلوٗمات ڈَبہٕ',
    'ਜਾਣਕਾਰੀਡੱਬਾ', // pa
    'තොරතුරුකොටුව', // si
    'ກ່ອງຂໍ້ມູນ',
    'ប្រអប់ព័ត៌មាន', // km
    '明細',
  ],
  image: [
    'fasciculus', // la
    'larawan', // tl
    'lêer', // af
    'picha', // sw
    'restr', // br
    'wêne', // ku
    'wobraz', // dsb
    'دوتنه', // ps
    'وێنە', // ckb
  ],
  reference: [
  ],
  disambig: [
    'dab', // en
    'disamb', // en
    'aðgreining',
    'airport disambiguation',
    'ałtsʼáʼáztiin', // nv
    'begriepskloorenge', // stq
    'begriffsklearung', // bar
    'biology disambiguation',
    'bisongidila', // kg
    'bkl', // pfl
    'bokokani', // ln
    'caddayn', // so
    'call sign disambiguation',
    'caselaw disambiguation',
    'chinese title disambiguation',
    'clerheans', // kw
    'cudakirin', // ku
    'čvor', // bs
    'db', // vls
    'desambig', // nov
    'desambigación', // an
    'desambiguáncia', // ext
    'desambiguasion', // lad
    'desambiguassiù', // lmo
    'desambigui', // lfn
    'dezanbìgua',
    'disamb-term',
    'disamb-terms',
    'disamb2',
    'disamb3',
    'disamb4',
    'disambìgua', // sc
    'disambiguation cleanup',
    'disambiguation lead name',
    'disambiguation lead',
    'disambiguation name',
    'disambiguazion',
    'disambigue',
    'discretiva',
    'disheñvelout', // br
    'disingkek', // min
    'dixanbigua', // vec
    'dixebra', // ast
    'diżambigwazzjoni', // mt
    'dmbox',
    'dubbelsinnig',
    'dudalipen', // rmy
    'dv',
    'faaleaogaina',
    'fleiri týdningar', // fo
    'genus disambiguation',
    'gì-ngiê', // cdo
    'giklaro', // ceb
    'homonimo', // io
    'hospital disambiguation',
    'huaʻōlelo puana like',
    'human name disambiguation cleanup',
    'human name disambiguation',
    'idirdhealú', // ga
    'khu-pia̍t',
    'kujekesa', // sn
    'letter-number combination disambiguation',
    'letter-numbercombdisambig',
    'maana', // sw
    'maneo bin', // diq
    'mathematical disambiguation',
    'mehrdüdig begreep', // nds
    'menm non', // ht
    'military unit disambiguation',
    'muardüüdag artiikel', // frr
    'music disambiguation',
    'myesakãrã',
    'neibetsjuttings', // fy
    'number disambiguation',
    'omonimeye', // wa
    'omonimi',
    'omonimia', // oc
    'opus number disambiguation',
    'page dé frouque', // nrm
    'paglilinaw', // tl
    'panangilawlawag', // ilo
    'pansayod', // war
    'pejy mitovy anarana', // mg
    'phonetics disambiguation',
    'place name disambiguation',
    'portal disambiguation',
    'reddaghey', // gv
    'road disambiguation',
    'school disambiguation',
    'sclerir noziun', // rm
    'selvendyssivu', // olo
    'soilleireachadh', // gd
    'species latin name abbreviation disambiguation',
    'species latin name disambiguation',
    'station disambiguation',
    'suzmunski', // jbo
    'synagogue disambiguation',
    'taxonomic authority disambiguation',
    'taxonomy disambiguation',
    'telplänov', // vo
    'template disambiguation',
    'tlahtolmelahuacatlaliztli', // nah
    'verdudeliking', // li
    'wěcejwóznamowosć', // dsb
    'wjacezmyslnosć', // hsb
    'z',
    'zambiguaçon', // mwl
    'zeimeibu škiršona', // ltg
    'аҵакырацәа', // ab
    'бир аайы јок',
    'ибҳомзудоӣ', // tg
    'кёб магъаналы', // krc
    'күп мәгънәләр', // tt
    'күп мәғәнәлелек', // ba
    'массехк маӏан хилар',
    'мъногосъмꙑслиѥ', // cu
    'неадназначнасьць',
    'олон удхатай', // bxr
    'са шумуд манавал', // lez
    'салаа утгатай', // mn
    'суолталар', // sah
    'текмаанисиздик', // ky
    'цо магіна гуреб', // av
    'чеперушка', // rue
    'чолхалла', // ce
    'шуко ончыктымаш-влак', // mhr
    'բազմիմաստութիւն', // hyw
    'באדייטן', // yi
    'دقیقلشدیرمه', // azb
    'ڕوونکردنەوە', // ckb
    'سلجهائپ', // sd
    'گجگجی بیری', // mzn
    'نامبهمېدنه', // ps
    'መንታ', // am
    'अस्पष्टता', // ne
    'बहुअर्थी', // bh
    'ਗੁੰਝਲ-ਖੋਲ੍ਹ', // pa
    'સંદિગ્ધ શીર્ષક', // gu
    'ದ್ವಂದ್ವ ನಿವಾರಣೆ', // kn
    'වක්‍රෝත්ති', // si
    'သံတူကြောင်းကွဲ', // my
    'သဵင်မိူၼ် တူၼ်ႈထႅဝ်ပႅၵ်ႇ',
    'ណែនាំ', // km
    'អសង្ស័យកម្ម',
    '扤清楚', // gan
    '搞清楚',
    '釋義',
  ],
  disambigTitle: [
    '搞清楚', // zh-yue
    'dubbelsinnig', // af
  ],
  aliases,
  infoboxes,
  templates: {},
};

// registers every language pack, applied one by one — 'other' carries the wikis without a pack of their own.
// the shipped list + metadata lives in src/languages.json; imports stay static so rollup can bundle them

// one pack per languages.json entry, 'other' last so packs win shared names
const packs = [
  ar, bg, bn, ca, cs, da, de, el, es, fa, fi, fr, he, hi, hr, hu, id, it, ja, ko, ms, nl,
  no, pl, pt, ro, ru, simple, sk, sr, sv, th, tr, uk, vi, zh, other,
];

const plugin = (_models, templates, infoboxes, i18n) => {
  packs.forEach((pack) => {
    register(pack, templates, infoboxes, i18n);
  });
};
plugin.version = version;

export { plugin as default };
