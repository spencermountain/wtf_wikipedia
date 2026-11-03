// wikipedia language codes → [native name, english name]
// sorted by article-count, so the long-tail can be commented-out
// (counts via wikistats.wmcloud.org, nov 2026)
const languages: Record<string, [string, string]> = {
  en: ['English', 'English'], //7,258,481
  ceb: ['Cebuano', 'Cebuano'], //6,116,168
  de: ['Deutsch', 'German'], //3,163,134
  fr: ['Français', 'French'], //2,787,822
  sv: ['Svenska', 'Swedish'], //2,629,703
  nl: ['Nederlands', 'Dutch'], //2,230,991
  es: ['Español', 'Spanish'], //2,147,473
  ru: ['Русский', 'Russian'], //2,126,383
  it: ['Italiano', 'Italian'], //1,993,801
  pl: ['Polski', 'Polish'], //1,713,356
  arz: ['مصرى', 'Egyptian Arabic'], //1,634,014
  zh: ['中文', 'Chinese'], //1,564,117
  ja: ['日本語', 'Japanese'], //1,525,752
  uk: ['Українська', 'Ukrainian'], //1,440,177
  ar: ['العربية', 'Arabic'], //1,338,897
  vi: ['Tiếng Việt', 'Vietnamese'], //1,305,558
  war: ['Winaray', 'Waray-Waray'], //1,267,055
  pt: ['Português', 'Portuguese'], //1,187,215
  fa: ['فارسی', 'Persian'], //1,100,803
  ce: ['Нохчийн', 'Chechen'], //871,389
  ca: ['Català', 'Catalan'], //807,343
  id: ['Bahasa Indonesia', 'Indonesian'], //803,239
  ko: ['한국어', 'Korean'], //770,190
  sr: ['српски / srpski', 'Serbian'], //710,504
  tr: ['Türkçe', 'Turkish'], //709,828
  tt: ['татарча / tatarça', 'Tatar'], //709,290
  ur: ['اردو', 'Urdu'], //707,266
  no: ['Norsk', 'Norwegian'], //694,216
  fi: ['Suomi', 'Finnish'], //627,755
  cs: ['čeština', 'Czech'], //600,997
  hu: ['Magyar', 'Hungarian'], //575,880
  ro: ['Română', 'Romanian'], //550,339
  eu: ['Euskara', 'Basque'], //499,833
  sh: ['srpskohrvatski / српскохрватски', 'Serbo-Croatian'], //461,986
  ms: ['Bahasa Melayu', 'Malay'], //445,221
  nan: ['閩南語 / Bân-lâm-gí', 'Min Nan'], //434,698
  he: ['עברית', 'Hebrew'], //407,991
  eo: ['Esperanto', 'Esperanto'], //390,357
  uz: ['oʻzbekcha / ўзбекча', 'Uzbek'], //371,458
  hy: ['Հայերեն', 'Armenian'], //333,028
  da: ['Dansk', 'Danish'], //316,556
  bg: ['Български', 'Bulgarian'], //312,856
  simple: ['Simple English', 'Simple English'], //286,149
  cy: ['Cymraeg', 'Welsh'], //284,837
  el: ['Ελληνικά', 'Greek'], //275,010
  be: ['Беларуская', 'Belarusian'], //270,004
  et: ['Eesti', 'Estonian'], //262,728
  sk: ['Slovenčina', 'Slovak'], //262,073
  gl: ['Galego', 'Galician'], //247,517
  kk: ['Қазақша', 'Kazakh'], //245,895
  azb: ['تۆرکجه', 'South Azerbaijani'], //244,936
  hr: ['Hrvatski', 'Croatian'], //236,268
  min: ['Minangkabau', 'Minangkabau'], //230,000
  lt: ['Lietuvių', 'Lithuanian'], //227,179
  az: ['Azərbaycanca', 'Azerbaijani'], //218,890
  ka: ['ქართული', 'Georgian'], //201,021
  sl: ['Slovenščina', 'Slovene'], //199,465
  bn: ['বাংলা', 'Bengali'], //192,377
  ta: ['தமிழ்', 'Tamil'], //191,754
  th: ['ไทย', 'Thai'], //189,430
  lld: ['Ladin', 'Ladin'], //183,228
  nn: ['norsk nynorsk', 'Norwegian Nynorsk'], //181,275
  hi: ['हिन्दी', 'Hindi'], //172,229
  mk: ['Македонски', 'Macedonian'], //165,935
  yue: ['粵語', 'Cantonese'], //154,465
  lv: ['Latviešu', 'Latvian'], //146,815
  af: ['Afrikaans', 'Afrikaans'], //142,988
  la: ['Latina', 'Latin'], //142,637
  ast: ['Asturianu', 'Asturian'], //141,718
  sw: ['Kiswahili', 'Swahili'], //132,434
  te: ['తెలుగు', 'Telugu'], //130,263
  ha: ['Hausa', 'Hausa'], //121,582
  tg: ['Тоҷикӣ', 'Tajik'], //119,500
  my: ['မြန်မာဘာသာ', 'Burmese'], //113,332
  sq: ['Shqip', 'Albanian'], //106,386
  mg: ['Malagasy', 'Malagasy'], //104,258
  mr: ['मराठी', 'Marathi'], //103,935
  bs: ['Bosanski', 'Bosnian'], //98,990
  ku: ['Kurdî', 'Kurdish'], //92,204
  br: ['Brezhoneg', 'Breton'], //91,927
  'be-tarask': ['беларуская (тарашкевіца)', 'Belarusian (Taraškievica)'], //91,520
  oc: ['Occitan', 'Occitan'], //91,010
  ml: ['മലയാളം', 'Malayalam'], //89,311
  an: ['Aragonés', 'Aragonese'], //88,179
  nds: ['Plattdüütsch', 'Low German'], //85,979
  ckb: ['کوردی', 'Sorani'], //85,191
  lmo: ['lombard', 'Lombard'], //80,357
  ky: ['кыргызча', 'Kyrgyz'], //76,658
  mzn: ['مازِرونی', 'Mazandarani'], //76,200
  pnb: ['پنجابی', 'Western Panjabi'], //75,796
  jv: ['Jawa', 'Javanese'], //75,600
  new: ['नेपाल भाषा', 'Newar'], //75,049
  ht: ['Kreyòl ayisyen', 'Haitian Creole'], //72,133
  pms: ['Piemontèis', 'Piedmontese'], //71,567
  vec: ['Vèneto', 'Venetian'], //69,633
  lb: ['Lëtzebuergesch', 'Luxembourgish'], //68,143
  io: ['Ido', 'Ido'], //65,194
  ga: ['Gaeilge', 'Irish'], //64,569
  ba: ['башҡортса', 'Bashkir'], //64,314
  su: ['Sunda', 'Sundanese'], //63,006
  szl: ['ślůnski', 'Silesian'], //61,654
  fy: ['Frysk', 'Western Frisian'], //61,155
  is: ['Íslenska', 'Icelandic'], //60,600
  pa: ['ਪੰਜਾਬੀ', 'Punjabi'], //59,766
  cv: ['чӑвашла', 'Chuvash'], //59,270
  vo: ['Volapük', 'Volapük'], //57,463
  tl: ['Tagalog', 'Tagalog'], //50,762
  ig: ['Igbo', 'Igbo'], //49,274
  wuu: ['吴语', 'Wu'], //48,494
  glk: ['گیلکی', 'Gilaki'], //48,310
  shn: ['တႆး', 'Shan'], //46,151
  diq: ['Zazaki', 'Dimli'], //44,456
  yo: ['Yorùbá', 'Yoruba'], //41,394
  ban: ['Basa Bali', 'Balinese'], //39,490
  kn: ['ಕನ್ನಡ', 'Kannada'], //34,889
  sco: ['Scots', 'Scots'], //34,220
  kaa: ['Qaraqalpaqsha', 'Karakalpak'], //33,712
  gsw: ['Alemannisch', 'Swiss German'], //31,849
  gu: ['ગુજરાતી', 'Gujarati'], //30,940
  ia: ['Interlingua', 'Interlingua'], //30,441
  ne: ['नेपाली', 'Nepali'], //30,070
  avk: ['Kotava', 'Kotava'], //29,905
  crh: ['qırımtatarca', 'Crimean Tatar'], //29,772
  mn: ['Монгол', 'Mongolian'], //28,639
  bar: ['Boarisch', 'Bavarian'], //27,234
  scn: ['Sicilianu', 'Sicilian'], //26,361
  as: ['অসমীয়া', 'Assamese'], //26,040
  si: ['සිංහල', 'Sinhala'], //25,824
  skr: ['سرائیکی', 'Saraiki'], //25,165
  bpy: ['বিষ্ণুপ্রিয়া মণিপুরী', 'Bishnupriya Manipuri'], //25,097
  qu: ['Runa Simi', 'Quechua'], //24,665
  sd: ['سنڌي', 'Sindhi'], //23,257
  ff: ['Fulfulde', 'Fula'], //22,699
  nv: ['Diné bizaad', 'Navajo'], //22,668
  bcl: ['Bikol Central', 'Bikol'], //22,657
  xmf: ['მარგალური', 'Mingrelian'], //22,505
  os: ['ирон', 'Ossetian'], //21,761
  frr: ['Nordfriisk', 'North Frisian'], //21,628
  ps: ['پښتو', 'Pashto'], //21,360
  or: ['ଓଡ଼ିଆ', 'Odia'], //21,181
  ary: ['الدارجة', 'Moroccan Arabic'], //20,520
  tum: ['chiTumbuka', 'Tumbuka'], //18,920
  sah: ['саха тыла', 'Sakha'], //18,288
  sgs: ['žemaitėška', 'Samogitian'], //17,276
  cdo: ['閩東語 / Mìng-dĕ̤ng-ngṳ̄', 'Min Dong Chinese'], //16,773
  sat: ['ᱥᱟᱱᱛᱟᱲᱤ', 'Santali'], //16,108
  gd: ['Gàidhlig', 'Scottish Gaelic'], //16,044
  bug: ['Basa Ugi', 'Buginese'], //15,976
  yi: ['ייִדיש', 'Yiddish'], //15,822
  am: ['አማርኛ', 'Amharic'], //15,735
  ilo: ['Ilokano', 'Ilokano'], //15,527
  li: ['Limburgs', 'Limburgian'], //15,222
  gor: ['Bahasa Hulontalo', 'Gorontalo'], //15,150
  hyw: ['Արեւմտահայերէն', 'Western Armenian'], //15,110
  nap: ['Napulitano', 'Neapolitan'], //15,024
  lzh: ['文言', 'Classical Chinese'], //14,799
  dag: ['dagbanli', 'Dagbani'], //14,547
  mai: ['मैथिली', 'Maithili'], //14,372
  eml: ['emiliàn e rumagnòl', 'Emilian-Romagnol'], //14,347
  hsb: ['hornjoserbsce', 'Upper Sorbian'], //14,298
  fo: ['Føroyskt', 'Faroese'], //14,219
  so: ['Soomaaliga', 'Somali'], //14,175
  'map-bms': ['Basa Banyumasan', 'Banyumasan'], //13,981
  ie: ['Interlingue', 'Interlingue'], //13,831
  ace: ['Acèh', 'Acehnese'], //13,083
  wa: ['Walon', 'Walloon'], //13,042
  zu: ['isiZulu', 'Zulu'], //13,006
  km: ['ភាសាខ្មែរ', 'Khmer'], //12,935
  sa: ['संस्कृतम्', 'Sanskrit'], //12,587
  hif: ['Fiji Hindi', 'Fiji Hindi'], //12,507
  bjn: ['Banjar', 'Banjar'], //12,482
  zgh: ['ⵜⴰⵎⴰⵣⵉⵖⵜ ⵜⴰⵏⴰⵡⴰⵢⵜ', 'Moroccan Amazigh'], //12,301
  ks: ['کٲشُر', 'Kashmiri'], //11,915
  sn: ['chiShona', 'Shona'], //11,857
  lij: ['Ligure', 'Ligurian'], //11,642
  mhr: ['олык марий', 'Meadow Mari'], //11,328
  shi: ['Taclḥit', 'Tachelhit'], //10,894
  rw: ['Ikinyarwanda', 'Kinyarwanda'], //10,679
  mni: ['ꯃꯤꯇꯩ ꯂꯣꯟ', 'Meitei'], //10,531
  hak: ['客家語 / Hak-kâ-ngî', 'Hakka'], //10,511
  mrj: ['кырык мары', 'Hill Mari'], //10,437
  tly: ['tolışi', 'Talysh'], //10,251
  pam: ['Kapampangan', 'Kapampangan'], //10,221
  ug: ['ئۇيغۇرچە / Uyghurche', 'Uyghur'], //9,765
  co: ['Corsu', 'Corsican'], //9,591
  'roa-tara': ['tarandíne', 'Tarantino'], //9,508
  bh: ['भोजपुरी', 'Bihari'], //9,376
  nso: ['Sesotho sa Leboa', 'Northern Sotho'], //9,137
  vls: ['West-Vlams', 'West Flemish'], //8,381
  bo: ['བོད་ཡིག', 'Tibetan'], //8,114
  'nds-nl': ['Nedersaksies', 'Dutch Low Saxon'], //8,110
  mt: ['Malti', 'Maltese'], //8,073
  mi: ['Māori', 'Māori'], //8,068
  se: ['Davvisámegiella', 'Northern Sami'], //7,919
  myv: ['эрзянь', 'Erzya'], //7,876
  sc: ['Sardu', 'Sardinian'], //7,858
  mdf: ['мокшень', 'Moksha'], //7,630
  rue: ['русиньскый', 'Rusyn'], //7,536
  zea: ['Zeêuws', 'Zeelandic'], //7,456
  tk: ['Türkmençe', 'Turkmen'], //7,352
  kw: ['kernowek', 'Cornish'], //7,285
  kab: ['Taqbaylit', 'Kabyle'], //7,204
  gv: ['Gaelg', 'Manx'], //7,142
  vep: ['vepsän kel’', 'Vepsian'], //7,111
  vro: ['võro', 'Võro'], //6,929
  gan: ['贛語', 'Gan Chinese'], //6,823
  smn: ['anarâškielâ', 'Inari Sami'], //6,753
  ab: ['аԥсшәа', 'Abkhazian'], //6,750
  pcd: ['Picard', 'Picard'], //6,160
  tn: ['Setswana', 'Tswana'], //6,118
  fur: ['Furlan', 'Friulian'], //6,071
  gn: ["Avañe'ẽ", 'Guarani'], //6,036
  udm: ['Удмурт', 'Udmurt'], //5,918
  csb: ['Kaszëbsczi', 'Kashubian'], //5,891
  lg: ['Luganda', 'Ganda'], //5,883
  frp: ['arpetan', 'Arpitan'], //5,840
  kv: ['Коми', 'Komi'], //5,831
  pap: ['Papiamentu', 'Papiamentu'], //5,820
  gpe: ['Ghanaian Pidgin', 'Ghanaian Pidgin'], //5,795
  lo: ['ລາວ', 'Lao'], //5,649
  mad: ['Madhurâ', 'Madurese'], //5,612
  fon: ['fɔ̀ngbè', 'Fon'], //5,608
  ang: ['Ænglisc', 'Old English'], //5,319
  ay: ['Aymar aru', 'Aymara'], //5,296
  ln: ['Lingála', 'Lingala'], //5,263
  olo: ['livvinkarjala', 'Livvi-Karelian'], //5,179
  nrm: ['Nouormand', 'Norman'], //5,059
  mnw: ['ဘာသာမန်', 'Mon'], //4,944
  tok: ['toki pona', 'Toki Pona'], //4,850
  tw: ['Twi', 'Twi'], //4,744
  lfn: ['Lingua Franca Nova', 'Lingua Franca Nova 2'], //4,689
  lez: ['лезги', 'Lezgian'], //4,498
  mwl: ['Mirandés', 'Mirandese'], //4,354
  ext: ['Estremeñu', 'Extremaduran'], //4,298
  stq: ['Seeltersk', 'Saterland Frisian'], //4,198
  tyv: ['тыва дыл', 'Tuvan'], //4,126
  lad: ['Ladino', 'Ladino'], //4,098
  av: ['Авар', 'Avaric'], //4,017
  tcy: ['ತುಳು', 'Tulu'], //4,011
  rm: ['Rumantsch', 'Romansh'], //3,897
  mag: ['मगही', 'Magahi'], //3,825
  dty: ['डोटेली', 'Doteli'], //3,815
  gom: ['गोंयची कोंकणी / Gõychi Konknni', 'Goan Konkani'], //3,644
  dga: ['Dagaare', 'Dagaare'], //3,478
  koi: ['перем коми', 'Komi-Permyak'], //3,471
  dsb: ['Dolnoserbski', 'Lower Sorbian'], //3,458
  bew: ['Betawi', 'Betawi'], //3,349
  dv: ['ދިވެހިބަސް', 'Divehi'], //3,235
  blk: ['ပအိုဝ်ႏဘာႏသာႏ', "Pa'O"], //3,155
  krc: ['къарачай-малкъар', 'Karachay-Balkar'], //3,120
  ksh: ['Ripoarisch', 'Ripuarian'], //3,038
  za: ['Vahcuengh', 'Zhuang'], //3,026
  awa: ['अवधी', 'Awadhi'], //3,022
  gag: ['Gagauz', 'Gagauz'], //3,009
  bxr: ['Буряад', 'Buriat'], //2,919
  ki: ['Gĩkũyũ', 'Kikuyu'], //2,918
  kge: ['Kumoring', 'Komering'], //2,910
  haw: ['Hawaiʻi', 'Hawaiian'], //2,900
  'cbk-zam': ['Chavacano de Zamboanga', 'Zamboanga Chavacano'], //2,877
  pfl: ['Pälzisch', 'Palatinate German'], //2,866
  szy: ['Sakizaya', 'Sakizaya'], //2,760
  pag: ['Pangasinan', 'Pangasinan'], //2,654
  iba: ['Jaku Iban', 'Iban'], //2,615
  xh: ['isiXhosa', 'Xhosa'], //2,604
  tay: ['Tayal', 'Atayal'], //2,587
  inh: ['гӀалгӀай', 'Ingush'], //2,561
  st: ['Sesotho', 'Sotho'], //2,250
  kcg: ['Tyap', 'Tyap'], //2,177
  knc: ['Yerwa Kanuri', 'Central Kanuri'], //2,149
  pdc: ['Deitsch', 'Pennsylvania German'], //2,132
  atj: ['Atikamekw', 'Atikamekw'], //2,083
  nov: ['Novial', 'Novial'], //2,068
  kai: ['Karai-karai', 'Karai-Karai'], //2,066
  kg: ['Kongo', 'Kongo'], //2,052
  dtp: ['Kadazandusun', 'Central Dusun'], //2,048
  to: ['lea faka-Tonga', 'Tongan'], //2,047
  rki: ['ရခိုင်', 'Rakhine'], //2,008
  tet: ['Tetun', 'Tetum'], //2,008
  om: ['Oromoo', 'Oromo'], //1,971
  arc: ['ܐܪܡܝܐ', 'Aramaic'], //1,920
  igl: ['Igala', 'Igala'], //1,850
  nia: ['Li Niha', 'Nias'], //1,826
  fat: ['mfantse', 'Fante'], //1,802
  isv: ['medžuslovjansky', 'Interslavic'], //1,789
  wo: ['Wolof', 'Wolof'], //1,742
  fj: ['Na Vosa Vakaviti', 'Fijian'], //1,729
  jam: ['Patois', 'Jamaican'], //1,721
  pcm: ['Naijá', 'Nigerian Pidgin'], //1,721
  kbp: ['Kabɩyɛ', 'Kabiye'], //1,716
  guw: ['gungbe', 'Gun'], //1,702
  anp: ['अंगिका', 'Angika'], //1,697
  kbd: ['адыгэбзэ', 'Kabardian Circassian'], //1,675
  rsk: ['руски', 'Pannonian Rusyn'], //1,644
  nqo: ['ߒߞߏ', "N'Ko"], //1,622
  xal: ['Хальмг', 'Kalmyk'], //1,578
  bi: ['Bislama', 'Bislama'], //1,515
  cu: ['словѣньскъ / ⰔⰎⰑⰂⰡⰐⰠⰔⰍⰟ', 'Church Slavonic'], //1,514
  bbc: ['Batak Toba', 'Toba Batak'], //1,505
  nah: ['Nāhuatl', 'Nahuatl'], //1,427
  ee: ['eʋegbe', 'Ewe'], //1,421
  tpi: ['Tok Pisin', 'Tok Pisin'], //1,417
  rup: ['armãneashti', 'Aromanian'], //1,390
  gur: ['farefare', 'Gurenɛ'], //1,385
  kus: ['Kʋsaal', 'Kusaal'], //1,381
  jbo: ['la .lojban.', 'Lojban'], //1,367
  ts: ['Xitsonga', 'Tsonga'], //1,329
  mos: ['moore', 'Mooré'], //1,326
  ty: ['reo tahiti', 'Tahitian'], //1,251
  syl: ['ꠍꠤꠟꠐꠤ', 'Sylheti'], //1,238
  btm: ['Batak Mandailing', 'Mandailing'], //1,237
  nup: ['Nupe', 'Nupe'], //1,233
  sm: ['Gagana Samoa', 'Samoan'], //1,208
  trv: ['Seediq', 'Seediq'], //1,201
  ss: ['SiSwati', 'Swati'], //1,195
  ltg: ['latgaļu', 'Latgalian'], //1,163
  ny: ['Chi-Chewa', 'Chichewa'], //1,160
  ami: ['Pangcah', 'Amis'], //1,143
  srn: ['Sranantongo', 'Sranan'], //1,135
  alt: ['алтай тил', 'Altai'], //1,116
  gcr: ['kriyòl gwiyannen', 'Guianan Creole'], //1,077
  lbe: ['лакку', 'Lak'], //1,054
  got: ['𐌲𐌿𐍄𐌹𐍃𐌺', 'Gothic'], //1,038
  chr: ['ᏣᎳᎩ', 'Cherokee'], //999
  bm: ['Bamanankan', 'Bambara'], //930
  ve: ['Tshivenda', 'Venda'], //929
  rmy: ['romani čhib', 'Romani'], //758
  rn: ['ikirundi', 'Kirundi'], //729
  chy: ['Tsetsêhestâhese', 'Cheyenne'], //719
  guc: ['wayuunaiki', 'Wayuu'], //718
  pnt: ['Ποντιακά', 'Pontic'], //681
  ady: ['адыгабзэ', 'Adyghe'], //649
  ik: ['Iñupiatun', 'Inupiak'], //599
  ch: ['Chamoru', 'Chamorro'], //582
  bol: ['bòo pìkkà', 'Bole'], //498
  tdd: ['ᥖᥭᥰ ᥖᥬᥲ ᥑᥨᥒᥰ', 'Tai Nüa'], //462
  ann: ['Obolo', 'Obolo'], //437
  iu: ['ᐃᓄᒃᑎᑐᑦ / inuktitut', 'Inuktitut'], //424
  dz: ['ཇོང་ཁ', 'Dzongkha'], //386
  pwn: ['pinayuanan', 'Paiwan'], //377
  sg: ['Sängö', 'Sango'], //376
  ti: ['ትግርኛ', 'Tigrinya'], //374
  din: ['Thuɔŋjäŋ', 'Dinka'], //339
  nr: ['isiNdebele seSewula', 'South Ndebele'], //338
  kaj: ['Jju', 'Jju'], //304
  pi: ['पालि', 'Pali'], //302
  bdr: ['Bajau Sama', 'West Coast Bajau'], //298
  ppl: ['Nawat', 'Pipil'], //265
  tig: ['ትግሬ', 'Tigre'], //120
  ng: ['Oshiwambo', 'Ndonga'], //8
  cho: ['Chahta anumpa', 'Choctaw'], //6
  mh: ['Ebon', 'Marshallese'], //4
  kj: ['Kwanyama', 'Kuanyama'], //4
  ii: ['ꆇꉙ', 'Sichuan Yi'], //3
  ho: ['Hiri Motu', 'Hiri Motu'], //3
  lrc: ['لۊری شومالی', 'Northern Luri'], //1
  mus: ['Mvskoke', 'Creek'], //1
  na: ['Dorerin Naoero', 'Nauruan'], //0
  ak: ['Akan', 'Akan'], //0
  kl: ['Kalaallisut', 'Greenlandic'], //0
  cr: ['Nēhiyawēwin / ᓀᐦᐃᔭᐍᐏᐣ', 'Cree'], //0
  pih: ['Norfuk / Pitkern', 'Norfolk'], //0
  aa: ['Qafár af', 'Afar'], //0
  hz: ['Otsiherero', 'Herero'], //0
  kr: ['Kanuri', 'Kanuri'], //0
  // - closed wikis, legacy interwiki aliases, and names used by {{in lang}} -
  als: ['Alemannisch', 'Alemannic'],
  'az-arab': ['', 'South Azerbaijani'],
  'bat-smg': ['Žemaitėška', 'Samogitian'],
  'be-x-old': ['Беларуская (тарашкевіца)', 'Belarusian (Taraškievica)'],
  'ca-valencia': ['', 'Valencian'],
  'de-at': ['Österreichisches Deutsch', 'Austrian German'],
  'de-ch': ['Schweizer Hochdeutsch', 'Swiss Standard German'],
  egy: ['', 'Egyptian'],
  'en-emodeng': ['', 'Early Modern English'],
  enm: ['', 'Middle English'],
  fil: ['', 'Filipino'],
  'fiu-vro': ['Võro', 'Võro'],
  'fra-que': ['', 'Quebec French'],
  fro: ['', 'Old French'],
  gil: ['Taetae ni Kiribati', 'Gilbertese'],
  grc: ['Ἀρχαία ἑλληνικὴ', 'Ancient Greek'],
  'grc-gre': ['', 'Ancient Greek'],
  'grc-x-doric': ['', 'Doric Greek'],
  'grc-x-medieval': ['', 'Medieval Greek'],
  khw: ['کھوار', 'Khowar'],
  'kk-arab': ['قازاقشا (تٴوتە)', 'Kazakh Arabic'],
  'ku-arab': ['کوردی (عەرەبی)', 'Kurdish'],
  'ku-cyrl': ['', 'Kurdish Cyrillic'],
  'la-x-medieval': ['', 'Medieval Latin'],
  mo: ['молдовеняскэ', 'Moldovan'],
  'ms-arab': ['بهاس ملايو', 'Malay Jawi'],
  nb: ['norsk bokmål', 'Norwegian Bokmål'],
  nd: ['isiNdebele', 'North Ndebele'],
  'nl-be': ['', 'Belgian Dutch'],
  non: ['', 'Old Norse'],
  'pa-arab': ['', 'Punjabi Shahmukhi'],
  'pt-br': ['português do Brasil', 'Brazilian Portuguese'],
  'roa-rup': ['armãneashti', 'Aromanian'],
  'sh-cyrl': ['српскохрватски (ћирилица)', 'Serbo-Croatian Cyrillic'],
  'sh-latn': ['srpskohrvatski (latinica)', 'Serbo-Croatian Latin'],
  'sr-cyr': ['', 'Serbian Cyrillic'],
  'sr-cyrl': ['', 'Serbian Cyrillic'],
  'sr-latn': ['', 'Serbian Latin'],
  syc: ['', 'Classical Syriac'],
  tlh: ['tlhIngan-Hol', 'Klingon'],
  'tt-cyrl': ['татарча', 'Tatar Cyrillic'],
  'tt-latn': ['tatarça', 'Tatar Latin'],
  'uz-cyrl': ['ўзбекча', 'Uzbek Cyrillic'],
  'zh-classical': ['文言', 'Classical Chinese'],
  'zh-hans': ['中文（简体）', 'Simplified Chinese'],
  'zh-hant': ['中文（繁體）', 'Traditional Chinese'],
  'zh-min-nan': ['Bân-lâm-gú', 'Minnan'],
  'zh-tw': ['中文（臺灣）', 'Taiwanese Mandarin'],
  'zh-yue': ['粵語', 'Cantonese'],
}
export default languages
