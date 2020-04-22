/* wtf-plugin-i18n 0.1.0  MIT */
var birth_date_and_age = ['ålder', 'ani', 'b', // 'birth date',
// 'birth date and age',
// 'birth year and age',
'calcola età', 'dáta breithe agus aois', 'data de nacemento e idade', 'data de naissença e atge', 'dâta de nèssence', 'data naixement i edat', 'data nașterii și vârsta', 'data tat-twelid u età', 'date de naissance', 'dato og alder', 'dátum narodenia a vek', 'datum narození a věk', 'datum rođenja i godine', 'datum rojstva in starost', 'doğum tarihi ve yaşı', 'doğum tarixi və yaşı', 'dyddiad geni ac oedran', 'dzimšanas datums un vecums', 'életkor-élő-dátummal', 'fødselsdato og alder', 'geboortedatum en ouderdom', 'jaiotza data eta adina', 'narodniny a staroba', 'narodniny a starstwo', 'naskiĝdato kaj aĝo', 'ngày sinh và tuổi', 'petsa ti pannakaipasngay ken tawen', 'roja bûyînê û temen', 'sünniaeg ja vanus', 'syntymäaika ja ikä', 'tanggal embas lan yusa', 'tanggal lahir dan umur', 'tarikh lahir dan umur', 'ulloq ukiuilu', 'дата з віком', 'дата на раждане и години', 'дата нараджэння і ўзрост', 'датум рођења', 'нарадзіўся', 'райгуырд', 'роден на и возраст', 'родился', 'таърихи таваллуд ва син', 'төрсөн огноо, нас', 'шочмокече', 'დაბადების თარიღი და ასაკი', 'ծննդյան ամսաթիվ և տարիք', 'تاريخ الميلاد و العمر', 'تاريخ الميلاد والعمر', 'تاریخ پیدائش اور عمر', 'تاریخ تولد و سن', 'ڄمڻ جي تاريخ ۽ عمر', 'د زیږون نیټه او عمر', 'دوغوم تاریخی ایله یاش', 'ڕۆژی لەدایکبوون و تەمەن', 'जन्म तिथि एवं आयु', 'जन्म दिनांक आणि वय', 'জন্ম তারিখ ও বয়স', 'பிறப்பும் அகவையும்', 'උපන් දින සහ වයස', '출생일과 나이', '出世日同歲數', '生年月日と年齢', '生日搭年纪'];

var citation = ['atsauce', 'chú thích', 'cit', 'cita testo', 'citácia harvard', 'citat', 'citat3', // 'citation',
'cite', 'citim', 'cito', 'cytuj', 'erreferentzia', 'iomradh', 'kaynak', 'kilde', 'obra citada', 'tzita testu', 'viide', 'наведување', 'উদ্ধৃতি', 'ကိုးကားခြင်း', '인용'];

var cite_book = ['bókaheimild', 'book reference', 'chú thích sách', 'ċita ktieb', 'cita libro', 'cita libru', 'cita llibru', 'citace monografie', 'citácia knihy', 'citaĵo el libro', 'citar lhibro', 'citar libro', 'citar livro', 'citat carte', 'citaziuni di testu', // 'cite book',
'cite book.', 'cité un lìber', 'citeer boek', 'citiranje knjiga', 'cytuj książkę', 'cytuj ksiōnżkã', 'enmyslioar', 'girjegáldu', 'grāmatas atsauce', 'hivatkozás/könyv', 'iomradh leabhar', 'kilde bog', 'kilde bok', 'kirjaviite', 'kitap kaynağı', 'kjelde bok', 'lidɐraduur', 'literatur', 'literatura', 'navedi knjigo', 'ouvrage', 'ôvra', 'ref-llibre', 'tzita libru', 'кітап', 'наведена книга', 'צייגט בוך', 'استشهاد بكتاب', 'حوالہ کتاب', 'کیتاب قایناقلاماسی', 'ڪتابن مان حوالا', 'یادکرد', 'स्रोत पुस्तक', 'বই উদ্ধৃতি', '서적 인용', '引書'];

var cite_journal = ['article', 'chú thích tạp chí', 'cita pubblicazione', 'ċita pubblikazzjoni', 'cita publicación', 'cita publicación periódica', 'cita publicasion', 'citácia periodika', 'citaĵo el gazeto', 'citar periódico', 'citat revistă', 'cite aldizkari', // 'cite journal',
"cité n'arvista", 'cite paper', 'citeer journal', 'citiranje časopisa', 'cytuj news', 'cytuj pismo', 'dergi kaynağı', 'iomradh iris', 'lehtiviite', 'luaigh foilseachán', 'navedi revijo', 'publikācijas atsauce', 'ref-publicació', 'revista', 'tzita publicatzione', 'макъала', 'наведено списание', 'статья', 'ыстатыйа', 'استشهاد بدورية أكاديمية', 'بیرخستنەوەی گۆڤار', 'حوالہ رسالہ', 'जर्नल स्रोत', 'সাময়িকী উদ্ধৃতি', '저널 인용'];

var cite_web = ['chú thích web', 'cita web', 'ċita web', 'citace elektronické monografie', 'citácia elektronického dokumentu', 'citaĵo el la reto', 'citar web', 'citat web', 'cité la ragnà', // 'cite web',
'cite web öömrang', 'citeer web', 'citeweb', 'citiranje weba', 'cito web', 'cytuj strōnã', 'cytuj stronę', 'iomradh lìon', 'kilde www', 'lien web', 'ligam web', 'lim vouèbe', 'lua idirlín', 'navedi splet', 'neahttagáldu', 'ref-web', 'tīmekļa atsauce', 'tzita web', 'vefheimild', 'verkkoviite', 'web kaynağı', 'наведена мрежна страница', 'спасылка', 'цитат уеб', 'צייגט וועב', 'بیرخستنەوەی وێب', 'حوالہ ویب', 'حوالو ويب', 'مرجع ويب', 'وب قایناقلاماسی', 'संकेतस्थळ स्रोत', 'ওয়েব উদ্ধৃতি', 'వెబ్ మూలము', 'උපන්‍යාස වෙබ්', '웹 인용', '引網'];

var commons_cat = ['catcómhaoin', 'categorìa ëd commons', 'comincat', 'commons', // 'commons cat',
'commons categories', 'commons category', 'commons kategori', 'commons kategoriýa', 'commons-kategorie', 'commonscat', // 'commonscat ',
'commonsi kategooria', // 'commonskat',
'communiacat', 'katégori commons', 'kategori commons', 'kategorija v zbirki', 'thể loại commons', 'vikianbar kateqoriyası', 'vikikrātuves kategorija', 'викианбор-гурӯҳ', 'категорија на остави', 'ризница-врска', 'վիքիպահեստ կատեգորիա', 'קאמאנסקאט', 'آمبار بؤلمه', 'پۆلی کۆمنز', 'تصنيف كومنز', 'تصنيف كومونز', 'رده انبار', 'زمرہ کومنز', 'ڪومنز زمرو', 'कमन्सश्रेणी', 'कॉमन्स वर्ग', 'कॉमन्स श्रेणी', 'कॉमंस श्रेणी', 'কমন্স থাক', 'কমন্স বিষয়শ্রেণী', 'ਕਾਮਨਜ਼ ਸ਼੍ਰੇਣੀ', 'කොමන්ස්ප්‍රවර්ග', 'คอมมอนส์-หมวดหมู่', '위키공용분류', '同享類'];

var coord = [// 'coor',
'coor dd', // 'coor dm',
// 'coor dms',
// 'coord',
'coordenadas', 'coordinate', 'coördinaten', 'cord', 'hnit', 'koord', 'koordinat', 'koördinate', 'kòòrdinatë', 'koordinate', 'koordinate text', 'koördinaten', 'koordinaten', 'koordynaty', 'souřadnice', 'súradnice', 'tọa độ', 'współrzędne', 'каардынаты', 'محل وقوع', 'স্থানাঙ্ক', '좌표'];

var flag = ['al2', 'bandeira', // 'bandera',
'bandera2', // 'bandiera',
'bayrak', 'bendera', 'bratach', 'chórgoj', 'chorhoj', 'drapel', // 'fana',
'fáni', // 'flag',
'flag2', 'flagg', 'flagga', // 'flagicon',
'flago', 'flaq', 'karogs', 'lá cờ', 'lippu', 'państwo', 'pantli2', 'payis', 'pays', 'pisilipp', 'stän', 'vexillum', 'vlag', 'wagayway', 'zastava', 'zászló2', 'zid', 'застава', 'знаме', 'парчам', 'сьцяг', 'ялав', 'დროშა', 'դրոշ', 'դրօշ', 'דגל', 'بایراق', 'پرچم', 'جهنڊو', 'جھنڈا', 'علم', 'देश झन्डा', 'पताका', 'পতাকা', 'கொடி', 'ධජය', 'ທຸງຊາດ', 'အလံ', '국기', '旗'];

var flagicon = [// 'Al',
'bandera', 'bandera4', 'bandiera', 'bandièra', 'bandiere', 'bannera', 'bayraksimge', 'bayraq', 'bayroqikon', 'bendera-ikon', 'drapeau', 'drapél', 'eicon baner', 'falgicon', 'fana', 'flag icon', 'flag-ikon', 'flaga', 'flaggbild', // 'flagicon',
'flagikon', 'íconebandeira', 'ikonazastave', 'leavga', 'lippukuva', 'minivlajka', 'riigi ikoon', 'vexillum icon', 'vlagikoon', 'vlagland', 'wagaywayikono', 'zászlóikon', 'zd', 'абираҟ', 'байрак1', 'байракх', 'далбаа', 'државнознаме', 'желек', 'зас', 'икона-флаг', 'прапорець', 'сцяг', 'тук', 'тырыса', 'флаг', 'بایراقچه', 'پرچم تصویر', 'پرچمک', 'جهنڊو عڪس', 'رمز علم', 'ھێمای ئاڵا', 'ध्वजचिन्ह', 'পতাকা আইকন', 'ਝੰਡਾ ਤਸਵੀਰ', '국기그림'];

var formatnum = [// 'formatnum',
'formattal', 'puntudecimal', 'szám', 'try formatnum', '형식 숫자'];

var ipa = ['afa', // 'afi',
// 'api',
'ase', 'ifa', // 'ipa',
'ipa-text', 'ipa1', 'ipa2', 'lbf', 'lfe', 'prononciation api', 'unicode', 'δφα', 'мфа', 'יפא', 'آوا', 'أصد', 'بول', 'نغا', 'अ-ध्व-लि', 'আধ্বব'];

var isbn = [// 'isbn',
'isbn2', 'آئی ایس بی این', 'ردمك', 'شابک۲', 'আইএসবিএন'];

var main = ['aðalgrein', 'ana madde', 'antsipirihany', 'ap', 'article détaillé', 'article principal', 'articllo dètalyê', 'articlo principal', 'articol principal', 'articulo prencepale', 'artigo percipal', 'artigo principal', 'artiklu prinċipali', 'artitgel principal', 'bővebben', 'ĉefartikolo', 'chính', 'əsas', 'glavni', 'głowny nastawk', 'gotara bingehîn', 'hauptartikel', 'hlavný článok', 'hłowny nastawk', 'hoofartikel', 'høvuðsgrein', 'huvudartikel', 'ki', 'kryesor', // 'main',
// 'main article',
'mien artikal', 'nagusia', 'nangruna', 'osobny artykuł', 'pääartikkeli', 'pagr', 'pamatraksts', 'pangunahin', 'prif', 'prinsipal', 'qq', 'torra a', 'utama', 'utdypende artikkel', 'vaata', 'váldoartihkal', 'véddi ànche', 'vedi anche', 'xóotal', 'zie hoofdartikel', 'κύριο', 'аслияб макъала', 'асноўны артыкул', 'главна', 'главьнъ', 'керттера статья', 'кол чүүл', 'основна', 'основная статья', 'үндсэн өгүүлэл', 'მთავარი', 'հիմնական հոդված', 'հիմնական յոդված', 'אנווייז צום הויפט ארטיקל', 'הפניה לערך מורחב', 'اساس', 'اصل مضمون', 'اصلی', 'بشپړه ليکنه', 'تفصيلي مضمون', 'سەرەکی', 'مفصلة', 'मुख्य', 'मुख्यः', 'মূল নিবন্ধ', 'പ്രധാനലേഖനം', 'หลัก', 'ບົດຄວາມຫຼັກ', 'ដើមចំបង', '본문', '內文'];

var portal = [// 'atari',
'awwur', 'chủ đề', 'lango', 'link portaal', 'porched', 'portaal', 'portada', 'portail', // 'portal',
'pòrtal', 'portál', 'portal box', 'portale', 'portałe', 'portalo', 'portalpar', 'portāls', 'portály', 'portaol', 'teemasivu', 'vikisritis', 'wikiportal', 'πύλη', 'ков', 'партал', 'портал', 'პორტალი', 'պորտալ', 'קישורי פורטל', 'باب', 'بوابة', 'بوابه', 'پوْرتال', 'تانبه', 'درگاه', 'دەروازە', 'दालन', 'প্রবেশদ্বার', 'കവാടം', 'สถานีย่อย2', 'ផតថល', '포털', 'ウィキポータルリンク', '門'];

var reflist = ['atsauces', 'çavkanî', 'çeşmeler', 'cyfeiriadau', 'daveoù', 'dustuniow', 'erreferentzia zerrenda', 'fotnoteliste', 'gáldut', 'išnašos', 'i̇stinad siyahısı', 'izvori', 'kaynakça', 'listănote', 'listaref', 'llistaref', 'manbalar', 'nūruodis', 'przëpisë', 'przipisy', 'przypisy', 'referans', 'referanser', 'rèferences', 'références', 'references', 'referéncias', 'referências', 'referencie', 'referències', 'referencoj', 'referency', 'referenzen', 'referenzi', // 'reflist ',
'refréncias', 'refspisak', 'šaltėnē', 'sklici', 'tham khảo', 'verwysings', 'viited', 'viitteet', 'παραπομπές', 'асăрхавсем', 'баянар', 'белгалдаккхар', 'билгалдахарш', 'быһаарыылар', 'валэктонъёс', 'дереккөздер', 'заалтс', 'зүүлтэ', 'извори', 'иҫкәрмәләр', 'кладѧꙃи', 'крыніцы', 'наводи', 'примечания', 'фиппаинæгтæ', 'хіужаби', 'эзоҳ', 'სქოლიოს სია', 'სქოლიოშ ერკებული', 'ծանցանկ', 'הערות שוליים', 'רעפליסטע', 'پانویس', 'حوالہ جات', 'حوالو', 'حوالے', 'سأرچئشمە', 'قایناق', 'لړسرچينې', 'مراجع', 'مصادر', 'संदर्भयादी', 'সূত্র তালিকা', 'ਹਵਾਲੇ', 'ଆଧାର', 'ආශ්‍රලැයිස්තුව', 'รายการอ้างอิง', 'បញ្ជីឯកសារយោង', '각주'];

var sfn = ['harvnp', 'harvref', 'kdş', 'mallonga piednoto', 'odn', //'sfn',
'зноска'];

var small = ['biçûk', 'küçük', 'litaskrift', 'malé', 'malgrande', 'malo', 'nhỏ', 'pequeno', 'petit', 'piccolo', // 'small',
'дробны шрыфт', 'мали', 'мало', 'փոքր', 'מוקטן', 'קליין', 'بچووک', 'صغير', 'صغیر', 'ছোট', 'ਛੋਟਾ'];

var start_date = ['algusaeg', 'aloituspäivämäärä', 'başlangıç tarihi', 'data', 'data de início', 'data inici', 'date début', 'destpêka dem', 'fecha', 'initial release', 'početni datum', 'pradžios data', // 'start date',
// 'start-date',
'start dato', 'startdato', 'startdatum', 'tanggal mulai', 'tarikh mula', 'začetni datum', 'ημερομηνία εκκίνησης', 'датум почетка', 'почетен датум', 'დაიწყე თარიღი', 'تاريخ بداية', 'تاریخ آغاز', 'ڕێکەوتی سەرەتا', 'ܣܝܩܘܡ ܫܘܪܝܐ', 'दिनांक', 'শুরুর তারিখ', 'ආරම්භක දිනය', '시작 날짜'];

var persondata = ['persoondata', //af
'ব্যক্তিতথ্য', //as
'personendaten', //de
// 'persondata', //en
'اطلاعات شخص', //fa
'פרטים ביוגרפיים', //he
'व्यक्तिगत आँकड़े', //hi
'인물데이터', //ko
'persoonsgegevens', //nl
'osebni podatki', //sl
'лични подаци', //sr
'ข้อมูลบุคคล', //th
'dữ liệu nhân vật', //vi
'個人資訊' //zh
];

var taxobox = ['bảng phân loại', 'biotakso infokaste', 'blwch tacson', 'boks klassans', 'bosca sonraí tacsanomaíochta', 'capsa taxinomica', 'dora tewran', 'ficha de taxón', 'info/taxonomia', "infotaula d'ésser viu", 'kishtey fys baagh', 'kotak info taksonomi', 'puha fakafaʻahinga', 'takso kutusu', 'taksoboks', 'taksokvir', 'takson infobox', 'taksonitabel', 'taksonomia', 'taksonomiija', 'taksonomio', 'taksonomiýa', 'taksonomka', 'taksoqutu', 'tassobox', 'tassonomìa', // 'taxobox',
'taxobox öömrang', 'taxobox2', 'taxoboxe', 'taxocaixa', 'taxonomio', 'taxotaula infotaula', 'ταξινομοπλαίσιο', 'таксанамічная інфармацыя', 'таксанамія', 'таксаҥа', 'таксобокс', 'таксон', 'таксономија', 'таксономиясь', 'таксономія', 'ტაქსოდაფა', 'տաքսոտուփ', 'מיון', 'جعبه اطلاعات آرایه زیستی', 'صندوق معلومات كائن', 'जीवचौकट', 'වර්ගීකරණකොටුව', 'ตารางจำแนกพันธุ์', 'ຕາລາງຈຳແໜກພັນ', '생물 분류', '物種明細模', '生物分類表'];

var mapping = {
  'birth date and age': birth_date_and_age,
  citation: citation,
  'cite book': cite_book,
  'cite journal': cite_journal,
  'cite web': cite_web,
  'commons cat': commons_cat,
  coord: coord,
  flag: flag,
  flagicon: flagicon,
  formatnum: formatnum,
  ipa: ipa,
  isbn: isbn,
  main: main,
  portal: portal,
  reflist: reflist,
  sfn: sfn,
  small: small,
  'start date': start_date,
  persondata: persondata,
  taxobox: taxobox
};

var plugin = function plugin(models, templates) {
  Object.keys(mapping).forEach(function (k) {
    mapping[k].forEach(function (name) {
      // create template parser with alias
      templates[name] = function (tmpl, list) {
        return templates[k](tmpl, list, k);
      };
    });
  });
};

var src = plugin;

export default src;
