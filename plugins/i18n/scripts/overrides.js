// hand-curated adjustments, used by 04-diff.js when comparing the fetched data against src
export default {
  // names kept per-family although the live fetch could not confirm them
  include: {
    citation: ['citat3', 'cito', 'viide'],
    coord: ['koördinate', 'koordinate text'],
    flag: ['al2', 'pantli2', 'zászló2', 'देश झन्डा', '旗'],
    flagicon: ['bandera4', 'bayroqikon', 'falgicon', 'далбаа', 'државнознаме', 'بایراقچه', 'جهنڊو عڪس', 'ਝੰਡਾ ਤਸਵੀਰ'],
    formatnum: ['try formatnum'],
    main: ['mien artikal', 'torra a', 'véddi ànche', 'керттера статья', 'հիմնական յոդված', 'ບົດຄວາມຫຼັກ'],
    portal: ['門'],
    reflist: ['referências', 'šaltėnē', 'хіужаби', 'سأرچئشمە', 'ਹਵਾਲੇ'],
    small: ['מוקטן', 'ਛੋਟਾ'],
    taxobox: ['bosca sonraí tacsanomaíochta', 'taxotaula infotaula', 'таксономія'],
    persondata: [
      'persoondata',
      'persoonsgegevens',
      'osebni podatki',
      'лични подаци',
      'ব্যক্তিতথ্য',
      'اطلاعات شخص',
      'פרטים ביוגרפיים',
      'व्यक्तिगत आँकड़े',
      'ข้อมูลบุคคล',
      'dữ liệu nhân vật',
      '인물데이터',
      '個人資訊',
    ],
    'birth date and age': ['data de nacemento e idade', 'roja bûyînê û temen', 'ulloq ukiuilu', 'ڄمڻ جي تاريخ ۽ عمر', 'د زیږون نیټه او عمر'],
    'cite book': ['bókaheimild', 'citiranje knjiga', 'hivatkozás/könyv', 'kjelde bok', 'кітап', 'ڪتابن مان حوالا', 'یادکرد'],
    'cite journal': ['chú thích tạp chí', 'dergi kaynağı', 'navedi revijo', 'revista', 'статья', 'بیرخستنەوەی گۆڤار'],
    'cite web': ['ligam web', 'lua idirlín', 'vefheimild', 'وب قایناقلاماسی'],
    'commons cat': ['վիքիպահեստ կատեգորիա', 'ਕਾਮਨਜ਼ ਸ਼੍ਰੇਣੀ', 'කොමන්ස්ප්‍රවර්ග'],
  },
  // names never registered — too generic or wrong to claim across every wiki
  exclude: [
    'b', // single letter, used for birth-date on one wiki
    'unicode', // not an ipa template on most wikis
  ],
  // names two wikis use for different families, pinned to one
  pin: {
    // flag renders '🇺🇸 USA', flagicon just '🇺🇸' — keep the historical split
    bandera: 'flagicon',
    bandiera: 'flagicon',
    fana: 'flagicon',
    'flag icon': 'flagicon',
    flagdeco: 'flagicon',
    // citation family splits
    ouvrage: 'cite book', // fr's book citation
    article: 'cite journal', // fr's journal citation
    cytuj: 'citation',
    'obra citada': 'citation',
    'cite aldizkari': 'cite journal',
    'kilde tidsskrift': 'cite journal',
    footnotes: 'reflist',
    // common english names the core registry does not cover
    'cite news': 'citation',
    'cite magazine': 'cite journal',
    'cite press release': 'cite web',
  },
  // hand-written param maps, for wikis whose TemplateData has no english aliases
  params: {
    internetquelle: {
      titel: 'title',
      autor: 'author',
      werk: 'work',
      hrsg: 'publisher',
      datum: 'date',
      seiten: 'pages',
      sprache: 'language',
      abruf: 'access-date',
      zugriff: 'access-date',
      'archiv-url': 'archive-url',
      'archiv-datum': 'archive-date',
    },
    literatur: {
      titel: 'title',
      autor: 'author',
      verlag: 'publisher',
      jahr: 'year',
      ort: 'location',
      seiten: 'pages',
      sammelwerk: 'journal',
      band: 'volume',
      nummer: 'issue',
      auflage: 'edition',
      hrsg: 'editor',
      sprache: 'language',
      datum: 'date',
      online: 'url',
    },
  },
}
