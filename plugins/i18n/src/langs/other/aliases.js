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
}

export default aliases
