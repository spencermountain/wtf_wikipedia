/*! wtf-plugin-nsfw 1.0.1 MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtfNsfw = factory());
})(this, (function () { 'use strict';

  var version = '1.0.1';

  var patterns$2 = {
    Sexuality: [/\bsex\b/i],
    Weapons: [/semi-automatic/i],
    Violence: [/terrorist attacks/i, /terrorism/i]
  };

  var mapping$2 = {
    // https://en.wikipedia.org/wiki/Category:Sex_and_sexuality_templates
    // (March 2020)
    'animal sexual behavior': 'Sexuality',
    bdsm: 'Sexuality',
    'birth control methods': 'Sexuality',
    'sexual ethics': 'Sexuality',
    'gender and sexual identities': 'Sexuality',
    'gender studies': 'Sexuality',
    'hormonal contraceptives': 'Sexuality',
    'human sexuality': 'Sexuality',
    'human sexuality/sandbox': 'Sexuality',
    'in defensum castitatis': 'Sexuality',
    incest: 'Sexuality',
    intersex: 'Sexuality',
    'intersex sidebar': 'Sexuality',
    'sex and the law': 'Sexuality',
    'sex manuals': 'Sexuality',
    masturbation: 'Sexuality',
    mindgeek: 'Sexuality',
    nudity: 'Sexuality',
    'sexual orientation': 'Sexuality',
    paraphilias: 'Sexuality',
    pedophilia: 'Sexuality',
    'sex positions': 'Sexuality',
    'post-orgasmic diseases': 'Sexuality',
    prostitution: 'Sexuality',
    'prostitution in canada': 'Sexuality',
    'prostitution in china': 'Sexuality',
    'prostitution in france': 'Sexuality',
    'prostitution in germany': 'Sexuality',
    'prostitution in india': 'Sexuality',
    'prostitution in japan': 'Sexuality',
    'prostitution in new zealand': 'Sexuality',
    'prostitution in sweden': 'Sexuality',
    'prostitution in thailand': 'Sexuality',
    'prostitution in the netherlands': 'Sexuality',
    "prostitution in the people's republic of china": 'Sexuality',
    'prostitution in the united kingdom': 'Sexuality',
    'prostitution in the united states': 'Sexuality',
    rape: 'Sexuality',
    'rape in india': 'Sexuality',
    'rape in the united states': 'Sexuality',
    rapefooter: 'Sexuality',
    sex: 'Sexuality',
    'sex (biology)': 'Sexuality',
    'sex (biology)/sandbox': 'Sexuality',
    'sex sidebar': 'Sexuality',
    'sex/sandbox': 'Sexuality',
    'sexual abuse': 'Sexuality',
    'sexual fetishism': 'Sexuality',
    'sexual revolution': 'Sexuality',
    'sidebar prostitution in france': 'Sexuality',
    'sidebar prostitution in the united kingdom': 'Sexuality',
    'adolescent sexuality by country': 'Sexuality',
    'sexual slang': 'Sexuality',
    'sexuality by country': 'Sexuality',
    'sexual urban legends': 'Sexuality',
    'wikipedia talk:wikiproject sexology and sexuality/talkheader': 'Sexuality',
    zoophilia: 'Sexuality',

    //
    'hentai-stub': 'Sexuality',
    'lgbt-sex-book-stub': 'Sexuality',
    'porn-book-stub': 'Sexuality',
    'porn-stub': 'Sexuality',
    'sex-book-stub': 'Sexuality',
    'sex-crime-stub': 'Sexuality',
    'sex-documentary-film-stub': 'Sexuality',
    'sex-stub': 'Sexuality',
    'sexuality-journal-stub': 'Sexuality',
    //
    '1890s-lgbt-novel-stub': 'Sexuality',
    '1900s-lgbt-novel-stub': 'Sexuality',
    '1920s-lgbt-novel-stub': 'Sexuality',
    '1930s-lgbt-novel-stub': 'Sexuality',
    '1940s-lgbt-novel-stub': 'Sexuality',
    '1950s-lgbt-novel-stub': 'Sexuality',
    '1960s-lgbt-novel-stub': 'Sexuality',
    '1970s-lgbt-novel-stub': 'Sexuality',
    '1980s-lgbt-novel-stub': 'Sexuality',
    '1990s-lgbt-novel-stub': 'Sexuality',
    '2000s-lgbt-novel-stub': 'Sexuality',
    '2010s-lgbt-novel-stub': 'Sexuality',
    'lgbt-activist-stub': 'Sexuality',
    'lgbt-bio-stub': 'Sexuality',
    'lgbt-book-stub': 'Sexuality',
    'lgbt-documentary-film-stub': 'Sexuality',
    'lgbt-drama-film-stub': 'Sexuality',
    'lgbt-film-stub': 'Sexuality',
    'lgbt-law-stub': 'Sexuality',
    'lgbt-mag-stub': 'Sexuality',
    'lgbt-newspaper-stub': 'Sexuality',
    'lgbt-novel-stub': 'Sexuality',
    'lgbt-org-stub': 'Sexuality',
    //
    'assisted reproductive technology': 'Sexuality',
    condoms: 'Sexuality',
    'female diseases of the pelvis and genitals': 'Sexuality',
    'human reproductive health': 'Sexuality',
    'human reproductive physiology': 'Sexuality',
    'male diseases of the pelvis and genitals': 'Sexuality',
    pregnancy: 'Sexuality',
    'std and sti': 'Sexuality',
    "women's health": 'Sexuality',

    'armalite ar-10 derivatives': 'Weapons',
    '4mmcaliber': 'Weapons',
    '7.62×39derivatives': 'Weapons',
    '30-30': 'Weapons',
    '30remington': 'Weapons',
    '32wslderivatives': 'Weapons',
    '.38 caliber': 'Weapons',
    '38scderivatives': 'Weapons',
    '222remderivatives': 'Weapons',
    '250-3000': 'Weapons',
    '284winchester': 'Weapons',
    '765borderivatives': 'Weapons',
    'advanced combat rifle prototypes': 'Weapons',
    aietc: 'Weapons',
    'antique firearms': 'Weapons',
    'api blowback firearms': 'Weapons',
    'armalite ar-16 derivatives': 'Weapons',
    'barrett firearms': 'Weapons',
    'beretta firearms': 'Weapons',
    'blow forward firearms': 'Weapons',
    'browning m1917 derivatives': 'Weapons',
    'bullpup firearms': 'Weapons',
    'caseless firearms': 'Weapons',
    'česká zbrojovka uherský brod': 'Weapons',
    "colt's manufacturing company": 'Weapons',
    'delayed blowback firearms': 'Weapons',
    'early firearms': 'Weapons',
    famae: 'Weapons',
    'fb firearms': 'Weapons',
    'firearm accessories mounting standards': 'Weapons',
    'fn herstal firearms': 'Weapons',
    'general purpose machine guns': 'Weapons',
    handloading: 'Weapons',
    'hk firearms': 'Weapons',
    imbel: 'Weapons',
    'imi iwi smallarms': 'Weapons',
    'improvised firearms': 'Weapons',
    'john browning': 'Weapons',
    'kalashnikov rifle': 'Weapons',
    'kel-tec firearms': 'Weapons',
    'komodo armament weapons': 'Weapons',
    'mauser firearms': 'Weapons',
    milkor: 'Weapons',
    'modern gatling guns': 'Weapons',
    'mossberg firearms': 'Weapons',
    'multiple barrel firearms': 'Weapons',
    'norwegian service rifles': 'Weapons',
    'personal defense weapons': 'Weapons',
    pindad: 'Weapons',
    'remington firearms': 'Weapons',
    'rpc fort weapons': 'Weapons',
    'ruger firearms': 'Weapons',
    savagefirearms: 'Weapons',
    'sig sauer firearms': 'Weapons',
    'smith & wesson': 'Weapons',
    'springfield armory firearms': 'Weapons',
    'sterling armaments company ltd': 'Weapons',
    'steyr mannlicher': 'Weapons',
    'swiss arms': 'Weapons',
    taurus: 'Weapons',
    'tbilisi aircraft manufacturing': 'Weapons',
    'walther firearms': 'Weapons',
    'weatherby cartridges firearms': 'Weapons',
    'winchester cartridges firearms': 'Weapons',
    'zastava firearms': 'Weapons',
    'ancient mechanical artillery and hand-held missile weapons': 'Weapons',
    'anti-tank rifles': 'Weapons',
    'artillery of the middle ages': 'Weapons',
    'bct subsystems': 'Weapons',
    britishempireweapons: 'Weapons',
    cannons: 'Weapons',
    'current french infantry weapons': 'Weapons',
    'current indian infantry weapons': 'Weapons',
    'usn early guided weapons': 'Weapons',
    'fcs subsystems': 'Weapons',
    'filipino weapons': 'Weapons',
    'history of the tank': 'Weapons',
    'indonesian weapons': 'Weapons',
    'japanese (samurai) weapons, armour and equipment': 'Weapons',
    'japanese swords': 'Weapons',
    'malaysian weapons': 'Weapons',
    'weapons of mass destruction': 'Weapons',
    'medieval armor components': 'Weapons',
    'medieval mechanical artillery and hand-held missile weapons': 'Weapons',
    'modern us infantry weapons': 'Weapons',
    modernausinfweaponsnav: 'Weapons',
    modernfininfweaponsnav: 'Weapons',
    modernukinfweaponsnav: 'Weapons',
    'notable swords': 'Weapons',
    'nuclear weapons tests of the united states': 'Weapons',
    'pole weapons': 'Weapons',
    'project kingfisher': 'Weapons',
    'royal navy torpedoes': 'Weapons',
    scud: 'Weapons',
    'station ix devices': 'Weapons',
    stryker: 'Weapons',
    'swords by region': 'Weapons',
    'us navy torpedoes': 'Weapons',
    'turkish army aircraft': 'Weapons',
    'turkish army infantry weapons': 'Weapons',
    'turkish army vehicles': 'Weapons',
    'types of armour': 'Weapons',
    'us military research rockets': 'Weapons',
    'us military rockets': 'Weapons',
    'usaf space vehicles': 'Weapons',
    valmetfirearmsnav: 'Weapons',
    'victorian era british naval weapons': 'Weapons',
    victorianerabritishweapons: 'Weapons',
    weapons: 'Weapons',
    'wwi tanks': 'Weapons',
    'missile navboxes': 'Weapons',
    'missile types': 'Weapons',
    'standard family of missiles': 'Weapons',
    'chinese missiles': 'Weapons',
    'dprk missiles': 'Weapons',
    'french nuclear missiles': 'Weapons',
    'gorgon missiles': 'Weapons',
    'indian missiles': 'Weapons',
    'indonesian missiles': 'Weapons',
    'iran missiles': 'Weapons',
    'missiles of pakistan': 'Weapons',
    'russian and soviet military designation sequences': 'Weapons',
    'russian and soviet missiles': 'Weapons',
    'russian and soviet surface-to-surface missiles': 'Weapons',
    'uk missiles': 'Weapons',
    'us army missiles': 'Weapons',
    'us missiles': 'Weapons',
    'usaf early missiles': 'Weapons',
    'usaf missiles': 'Weapons',
    'usn missiles': 'Weapons',
    'usn research missiles': 'Weapons',
    'v-weapons': 'Weapons',
    wwiiprototypeafvs: 'Weapons',
    'wwii us ships': 'Weapons',
    wwiiamericanafvs: 'Weapons',
    wwiiusguns: 'Weapons',
    wwiiusinfweaponsnav: 'Weapons',
    wwiiusnavalweapons: 'Weapons',
    'wwii australian ships': 'Weapons',
    'equipment of the belgian army in world war ii': 'Weapons',
    'ww1and2 british grenades': 'Weapons',
    'ww2 brit comm infantry guns': 'Weapons',
    'wwii british ships': 'Weapons',
    wwiibritishafvs: 'Weapons',
    wwiibritishaircraftweapons: 'Weapons',
    wwiibritishcommguns: 'Weapons',
    wwiibritishcommnavalweapons: 'Weapons',
    wwiibritishsoftveh: 'Weapons',
    wwiichineseheavyweapons: 'Weapons',
    wwiichineseinfantryweapons: 'Weapons',
    modernusinfweaponsnav: 'Weapons',
    'wwii danish ships': 'Weapons',
    'wwii dutch ships': 'Weapons',
    'wwii finnish ships': 'Weapons',
    wwiifininfweaponsnav: 'Weapons',
    wwiifrenchguns: 'Weapons',
    coldwarfrenchafvs: 'Weapons',
    'wwii french ships': 'Weapons',
    wwiifrenchafvs: 'Weapons',
    wwiifrenchinfweapons: 'Weapons',
    wwiifrenchsoftveh: 'Weapons',
    wwiifrenchnavalweapons: 'Weapons',
    'german artillery of world war ii': 'Weapons',
    'mines of nazi germany during world war ii': 'Weapons',
    'ww2 german aerial weapons': 'Weapons',
    'wwii german ships': 'Weapons',
    wwiigermanafvs: 'Weapons',
    wwiigermaninfweapons: 'Weapons',
    'wwii greek ships': 'Weapons',
    'wwii italian ships': 'Weapons',
    wwiiitalianafvs: 'Weapons',
    wwiiitalianinfweapons: 'Weapons',
    wwiiitalianguns: 'Weapons',
    'imperial japanese army artillery': 'Weapons',
    'wwii japanese auxiliary ships': 'Weapons',
    'wwii japanese ships': 'Weapons',
    wwiijapanesenavalweapons: 'Weapons',
    'japanese wwii infantry weapons': 'Weapons',
    wwiijapaneseafvs: 'Weapons',
    wwiipolishafvs: 'Weapons',
    wwiipolishinfweapons: 'Weapons',
    'wwii polish ships': 'Weapons',
    'wwii romanian ships': 'Weapons',
    wwiiromanianafvs: 'Weapons',
    sovartygpw: 'Weapons',
    'soviet infantry weapons of world war ii': 'Weapons',
    'wwii soviet ships': 'Weapons',
    wwiisovaerosani: 'Weapons',
    wwiisovarttractors: 'Weapons',
    wwiisovexperimental: 'Weapons',
    wwiisovietafvs: 'Weapons',
    wwiisovietarmouredcars: 'Weapons',
    wwiisovietselfproparty: 'Weapons',
    wwiisovtanks: 'Weapons',
    'wwii swedish ships': 'Weapons',
    coldwarswedishafvs: 'Weapons',
    'weapons made in sweden 1914–1945': 'Weapons',
    'weapons of czechoslovakia': 'Weapons',
    'weapons of hungary': 'Weapons',
    wwiihungarianafvs: 'Weapons',
    wwiiswedishafvs: 'Weapons',
    'wwii yugoslav ships': 'Weapons',
    'austro-hungarian artillery of world war i': 'Weapons',
    'wwiaus-huninfweaponsequipment': 'Weapons',
    'austro-hungarian navy classes': 'Weapons',
    greatwarbritishnavalweapons: 'Weapons',
    'wwi british afvs': 'Weapons',
    'wwi british empire guns': 'Weapons',
    'wwi british empire small arms': 'Weapons',
    'wwi british ships': 'Weapons',
    wwifrenchguns: 'Weapons',
    wwifrenchinfweaponsnav: 'Weapons',
    'wwi french afvs': 'Weapons',
    'amphitrite-class submarine': 'Weapons',
    'bellone-class submarine': 'Weapons',
    'circé-class submarine (1907)': 'Weapons',
    'clorinde-class submarine': 'Weapons',
    'diane-class submarine (1916)': 'Weapons',
    'émeraude-class submarine (1906)': 'Weapons',
    'gustave zédé-class submarine': 'Weapons',
    'wwi french ships': 'Weapons',
    'wwi german ships': 'Weapons',
    wwigermanartillery: 'Weapons',
    wwigermaninfweaponsnav: 'Weapons',
    'wwi greek ships': 'Weapons',
    wwiitalianinfweapons: 'Weapons',
    'wwi italian ships': 'Weapons',
    wwiitalianguns: 'Weapons',
    'wwi japanese ships': 'Weapons',
    'wwi ottoman ships': 'Weapons',
    wwiottomaninfweaponsnav: 'Weapons',
    wwirussianarms: 'Weapons',
    'wwi russian ships': 'Weapons',
    'us wwi vehicles': 'Weapons',
    'wwi us ships': 'Weapons',
    wwiusguns: 'Weapons',
    wwiusinfweaponsnav: 'Weapons',
    'world war i aircraft of the central powers': 'Weapons',
    wwiusnavalweapons: 'Weapons',

    'list of terrorist incidents': 'Violence',
    massacres: 'Violence',

    //
    'drug use': 'Drug-use',
    euphoriants: 'Drug-use',
    stimulants: 'Drug-use'
  };

  const byPattern = function (str, patterns) {
    const types = Object.keys(patterns);
    for (let i = 0; i < types.length; i++) {
      const key = types[i];
      for (let o = 0; o < patterns[key].length; o++) {
        const reg = patterns[key][o];
        if (reg.test(str) === true) {
          return key
        }
      }
    }
    return null
  };

  const byTemplate = function (doc) {
    const templates = doc.templates();
    const found = [];
    for (let i = 0; i < templates.length; i++) {
      const tmpl = templates[i];
      // wtf_wikipedia v10 returns Template objects; v8 returned plain json
      const data = typeof tmpl.json === 'function' ? tmpl.json() : tmpl;
      const title = (data.template || '').trim().toLowerCase();
      // try our 1-to-1 mapping, then the regex-list
      let type = null;
      if (mapping$2.hasOwnProperty(title)) {
        type = mapping$2[title];
      } else {
        type = byPattern(title, patterns$2);
      }
      if (type) {
        found.push({ reason: type, name: title, data: data });
      }
    }
    return found
  };

  var patterns$1 = {
    Profanity: [/(profanity|obscenity)/, /propaganda films/],
    Weapons: [
      /semi-automatic/,
      /rifles/,
      /firearms/,
      /pistols/,
      /shotguns/,
      /grenades/,
      /knives/,
      /weapons and ammunition/,
      / weapons$/,
      /chemical weapon/,
      /explosives/,
      /flamethrowers/
    ],
    Violence: [
      /suicide methods/,
      /\bbombing/,
      /\bbombers/,
      /. tactics/,
      /serial killers/,
      /murder in ./,
      /necrophiles/,
      /terrorist incidents/,
      /cannibals/,
      /mass shootings/,
      /stabbing attacks/,
      /arson attacks/,
      /lynching/,
      /drone strikes/,
      /assassinations/,
      /hostage taking/
    ],
    Sexuality: [
      /bdsm/,
      /fetish/,
      /incest/,
      /breast/,
      /nipple/,
      /penis/,
      /scrotum/,
      /nude sculptures/,
      /naturis[mt]/,
      /genital/,
      /masturbation/,
      /ejaculation/,
      /orgasm/,
      /erotica/,
      /strip clubs/,
      /camming/,
      /\bsex toys/,
      /pornographic/,
      /pornography/,
      /erotic/,
      /human reproduction/,
      /\bsexuality\b/,
      /\brape in ./,
      /sexual abuse/,
      /dominatrices/,
      /brothels/,
      /red-light districts/,
      /courtesans/,
      /\brapists\b/,
      /prostitutes/,
      /prostitution/,
      /sex workers/,
      /nudity/,
      /erotic dancers/
    ]
  };

  var mapping$1 = {
    'bdsm in films': 'Sexuality',
    sexuality: 'Sexuality',
    'sexual slang': 'Profanity',
    'english profanity': 'Profanity',
    'off-color humor': 'Profanity',
    euphemisms: 'Profanity',
    'shock sites': 'Profanity',
    'adult humour titles': 'Profanity',
    'hokum blues songs': 'Profanity',
    'holocaust terminology': 'Profanity',
    'cultural depictions of muhammad': 'Profanity',
    'nazi terminology': 'Profanity',
    'nazi propaganda': 'Profanity',
    'nazi propaganda organizations': 'Profanity',
    'nazi symbolism': 'Profanity',
    'fascist symbols': 'Profanity',
    'symbols of nazi germany': 'Profanity',

    // https://en.wikipedia.org/wiki/Category:Sexuality
    'sexuality by culture': 'Sexuality',
    'human sexuality': 'Sexuality',
    'animal sexuality': 'Sexuality',
    'plant sexuality': 'Sexuality',
    'historians of sexuality': 'Sexuality',
    mating: 'Sexuality',
    promiscuity: 'Sexuality',
    'sexual reproduction': 'Sexuality',
    'sexual acts': 'Sexuality',
    'sexuality by region': 'Sexuality',
    'sexuality stubs': 'Sexuality',
    'casual sex': 'Sexuality',
    'group sex': 'Sexuality',
    prostitution: 'Sexuality',
    'casual sex in fiction': 'Sexuality',
    'free sex': 'Sexuality',
    'gay bathhouses': 'Sexuality',
    'sex positivism': 'Sexuality',
    'sexual addiction': 'Sexuality',
    'sexual revolution': 'Sexuality',
    'songs about casual sex': 'Sexuality',
    'swinging (sexual practice)': 'Sexuality',
    'free sex activists': 'Sexuality',
    bukkake: 'Sexuality',
    'sex gangs': 'Sexuality',
    'child prostitution': 'Sexuality',
    'corrective rape': 'Sexuality',
    'forced prostitution': 'Sexuality',
    'sexual slavery': 'Sexuality',
    'wartime sexual violence': 'Sexuality',
    'wartime sexual violence in world war ii': 'Sexuality',
    'abu ghraib torture and prisoner abuse': 'Sexuality',
    '1980 murders of u.s. missionaries in el salvador': 'Sexuality',
    'genocidal rape': 'Sexuality',
    'comfort gays': 'Sexuality',
    'comfort women': 'Sexuality',
    'nanjing massacre': 'Sexuality',
    'forced prostitution in the united states': 'Sexuality',
    'victims of forced prostitution': 'Sexuality',
    brothels: 'Sexuality',
    'magdalene asylums': 'Sexuality',
    pimps: 'Sexuality',
    prostitutes: 'Sexuality',
    'prostitution by gender': 'Sexuality',
    'red-light districts': 'Sexuality',
    'sex industry researchers': 'Sexuality',
    "sex workers' rights": 'Sexuality',
    'works about prostitution': 'Sexuality',
    'american pimps': 'Sexuality',
    'argentine pimps': 'Sexuality',
    'british pimps': 'Sexuality',
    'cuban pimps': 'Sexuality',
    'french pimps': 'Sexuality',
    'german pimps': 'Sexuality',
    'mexican pimps': 'Sexuality',
    'south african pimps': 'Sexuality',
    'spanish pimps': 'Sexuality',
    'swedish pimps': 'Sexuality',
    'brothel owners and madams': 'Sexuality',
    'prostitutes by nationality': 'Sexuality',
    'prostitutes by type': 'Sexuality',
    'cultural depictions of prostitutes': 'Sexuality',
    'fictional prostitutes': 'Sexuality',
    'prostitutes by gender': 'Sexuality',
    'songs about prostitutes': 'Sexuality',
    'female prostitutes by nationality': 'Sexuality',
    'male prostitutes by nationality': 'Sexuality',
    'dominatrices by nationality': 'Sexuality',
    'erotic dancers by nationality': 'Sexuality',
    'pornographic film actors by nationality': 'Sexuality',
    'bdsm terminology': 'Sexuality',
    'sexual roleplay': 'Sexuality',
    'sexual roles': 'Sexuality',
    'sexual fantasies': 'Sexuality',
    gynaecology: 'Sexuality',
    'gynaecologic disorders': 'Sexuality',
    'sexual anatomy': 'Sexuality',
    'sex organs': 'Sexuality',
    clitoris: 'Sexuality',
    penis: 'Sexuality',
    ejaculation: 'Sexuality',
    'animal penises': 'Sexuality',
    'penis disorders': 'Sexuality',
    'penile erection': 'Sexuality',
    'mammal penis': 'Sexuality',
    'human male reproductive system': 'Sexuality',
    'human penis': 'Sexuality',
    'human penis anatomy': 'Sexuality',
    'human female reproductive system': 'Sexuality',
    vagina: 'Sexuality',
    hymen: 'Sexuality',
    'vagina and vulva in art': 'Sexuality',
    circumcision: 'Sexuality',
    fellatio: 'Sexuality',
    'clothing-optional events': 'Sexuality',
    'naked cycling events': 'Sexuality',
    nudity: 'Sexuality',
    'nude art': 'Sexuality',
    'nude recreation': 'Sexuality',
    'nudity in film': 'Sexuality',
    'nudity in television': 'Sexuality',
    streaking: 'Sexuality',
    'erotic dance': 'Sexuality',
    'erotic events': 'Sexuality',
    'erotic parties': 'Sexuality',
    vibrators: 'Sexuality',
    masturbation: 'Sexuality',
    seduction: 'Sexuality',
    'seduction community': 'Sexuality',
    'intimate relationships': 'Sexuality',
    'free love': 'Sexuality',
    'sex industry': 'Sexuality',
    'sexuality and age': 'Sexuality',
    'sex festivals': 'Sexuality',
    'sex scandals': 'Sexuality',
    'sex abuse': 'Sexuality',
    'sex ethics': 'Sexuality',
    'webcam models': 'Sexuality',
    'sex robots': 'Sexuality',
    'machine sex': 'Sexuality',
    'bdsm equipment': 'Sexuality',
    'pornographic works': 'Sexuality',
    sexting: 'Sexuality',
    teledildonics: 'Sexuality',

    //
    axes: 'Weapons',
    bayonets: 'Weapons',
    daggers: 'Weapons',
    'deaths by blade weapons': 'Weapons',
    guillotine: 'Weapons',
    knives: 'Weapons',
    'medieval blade weapons': 'Weapons',
    'military knives': 'Weapons',
    'single-edged swords': 'Weapons',
    spears: 'Weapons',
    swords: 'Weapons',
    'lists of swords': 'Weapons',
    'swords by region': 'Weapons',
    'coats of arms with swords': 'Weapons',
    'fictional swords': 'Weapons',
    'mythological swords': 'Weapons',
    'sword swallowers': 'Weapons',
    'swords by period': 'Weapons',
    swordsmanship: 'Weapons',
    bombs: 'Weapons',
    grenades: 'Weapons',
    missiles: 'Weapons',

    'car bombs': 'Violence',
    'nuclear explosives': 'Violence',
    'explosives projectives': 'Violence',
    'improvised explosive devices': 'Violence',
    'terrorist incidents involving knife attacks': 'Violence',
    'knife attacks': 'Violence',
    'execution methods': 'Violence',
    infanticide: 'Violence',
    execution: 'Violence',
    'child murder': 'Violence',
    'spree shootings': 'Violence',
    'school shootings': 'Violence',
    'targeted killing': 'Violence',

    alcohol: 'Drug-use',
    amphetamine: 'Drug-use',
    ayahuasca: 'Drug-use',
    cannabis: 'Drug-use',
    coca: 'Drug-use',
    cocaine: 'Drug-use',
    ghb: 'Drug-use',
    heroin: 'Drug-use',
    iboga: 'Drug-use',
    'lysergic acid diethylamide': 'Drug-use',
    methamphetamine: 'Drug-use',
    methylphenidate: 'Drug-use',
    morphine: 'Drug-use',
    opium: 'Drug-use',
    tobacco: 'Drug-use',
    'psychedelics, dissociatives and deliriants': 'Drug-use',
    'works about drugs': 'Drug-use',
    'biological sources of psychoactive drugs': 'Drug-use',
    'chemical classes of psychoactive drugs': 'Drug-use',
    'combinations of psychoactive drugs': 'Drug-use',
    'designer drugs': 'Drug-use',
    'drug classes defined by psychological effects': 'Drug-use',
    'drugs and the military': 'Drug-use',
    'drugs by psychological effects': 'Drug-use',
    'effects of psychoactive drugs': 'Drug-use',
    'individual psychoactive drugs': 'Drug-use',
    inhalants: 'Drug-use',
    'psychoactive drugs by mechanism of action': 'Drug-use',
    'psychedelic drug research': 'Drug-use',
    'social aspects of psychoactive drugs': 'Drug-use',
    'psychoactive drug stubs': 'Drug-use'
  };

  var okay = {
    'sexual revolution': true,
    'explosives engineers': true,
    'bisexual writers': true,
    'bisexual people': true,
    'bisexual men': true,
    'bisexual women': true,
    'mythological rapists': true,
    'obscenity controversies in literature': true,
    'obscenity controversies in television': true,
    'obscenity controversies in music': true,
    'breast cancer survivors': true,
    'deaths from breast cancer': true,
    'people prosecuted under anti-homosexuality laws': true,
    'philosophers of sexuality': true,
    'anti-pornography activists': true,
    'songs about nuclear war and weapons': true
  };

  const byCategory = function (doc) {
    const found = [];
    let cats = doc.categories();
    // clean them up a bit
    cats = cats.map((cat) => {
      cat = cat.toLowerCase();
      cat = cat.replace(/^(category|categorie|kategori): ?/i, '');
      cat = cat.replace(/_/g, ' ');
      return cat.trim()
    });
    // loop through each
    for (let i = 0; i < cats.length; i++) {
      const cat = cats[i];
      // these false-flags are fine
      if (okay.hasOwnProperty(cat)) {
        continue
      }
      // try our 1-to-1 mapping
      if (mapping$1.hasOwnProperty(cat)) {
        found.push({ reason: mapping$1[cat], name: cat });
        continue
      }
      // loop through our patterns
      const match = byPattern(cat, patterns$1);
      if (match) {
        found.push({ reason: match, name: cat });
      }
    }
    return found
  };

  var mapping = {
    sexuality: 'Sexuality',
    pimp: 'Sexuality',
    'sexual act': 'Sexuality',
    'sexual slang': 'Sexuality',
    'sex position': 'Sexuality',
    pornography: 'Sexuality'
  };

  var patterns = {
    // 'foo (sex position)', but not 'Colchester (Essex)'
    Sexuality: [/ \(.*?\bsex.*?\)$/i]
  };

  const paren = /\((.*)\)$/;

  const byTitle = function (doc) {
    const title = doc.title;
    if (!title) {
      return []
    }
    //look at parentheses like 'Tornado (film)'
    const m = title.match(paren);
    if (!m) {
      return []
    }
    let inside = m[1] || '';
    inside = inside.toLowerCase();
    inside = inside.replace(/_/g, ' ');
    inside = inside.trim();

    //look at known parentheses
    if (mapping.hasOwnProperty(inside)) {
      return [{ reason: mapping[inside], name: inside }]
    }

    // look at regex
    const match = byPattern(title, patterns);
    if (match) {
      return [{ reason: match, name: title }]
    }
    return []
  };

  // 32-bit hashes of normalized filenames from Wikipedia MediaWiki:Bad_image_list
  var hashes = 'nh18i1 f8t0e5 it6tui 16qt5kc fj1mlq 1qxfhdr qu3gc2 1ba730w 11um9n4 g86nuj jleq40 jzpdje ibjq6r 14p9ums 10ze4kj 1f94gui s135t1 17tfwd8 qkwi8w yn5jy3 177pvu 5eia03 15caj79 4cidfx 1x6amft 1d512ew 1m1z00c 1u4pddb rikdod 8qnvyx 17ba7ze 1hnrxdp 1f9lxlv 1ov5c5x 113wud2 1orq0qe 1m0nmxj 73ejy1 o8c571 1glsojn 5klgut wemjz 1itkce6 mg4qg8 12501zy z1h8lc 1ij298q 12nzni5 1y8o33h 1i1uk23 19mmysd 16ohb8i tdlh6s 1cdz2e9 mglkgl 1e4689d k9cl4n zri9py 108z6cz bfessv 3gwv2q 3hgno3 3i0g9g 1fl0evd 15wurd9 oxqzrr 1sp8i1m 1hwzbe 1uk4qtr xn6k0h 172guoj 1kx3o45 ib4rh2 vijoku 1rmlk3i 1g613rk 1h2gyrv 1wng5hb 8g1i6g 12o5ntr 1ormt1w 1qj1qbr 1fgjxzi 1pcp1oy j65tr1 1tfm14y 2y1pyn w2cvo3 1uydtgm 4fm8l0 xjufae 1v7596p 1v7p1s2 j86kkb 1gcb646 12hslvf 8j9czb sk6ksm 1lsknye 2g1oeo axqvue f4ikse 62ny9l jxt6zz 1pm4hd9 13l92b0 1bbvp0g g0zhre 1bn93rx xx20uy 1tfabfa ybr8sn eo78sh f1eb15 qnzxem tentpe 2auxc 1hxacwy wskqr5 l45ttq l460n5 8twocv hfmhff 2dbdz4 hqlpvw 1yhzhyd 1kj4fux pmq0g0 1b6we2f 1qc2ofv sql0od ebusd3 ecekyg ecydjt edi656 ee1yqj eelrbw ef5jx9 efpcim eg953z egsxpc eswera yp1e3t 1s56gs8 ludb2 1goa2yu 1f6pqgt amhvau gkk0l6 1v8dub5 v1ezys 1nc2485 n92kdt 1ljwclp p9kkzi u1r5xr 1nts8ps 1cz550a 8y1qrk aejbm7 1wey5we 1tey38e 1n2jizf 1t8jxt3 c3s6kj mxsbbw 1t4l25 1hhthe7 17cuk0e 16km6bq 1bhfbk7 1ui4s6w 123rvsx 1fm95zk li45kb 1269ctx 9cpab2 s1tpy9 1018las gtjhki o94hty 2a6l3x 170r696 1ix1edu 1t0b4bt 1s03jcy 1qkcva8 nq076j 1z1348c 1acgfbc yz8h78 kpu7rh 9ks97i 15kks01 1lhho54 um9wlw 1en8sqy 9bdzu4 vgckb1 9xugvc qunsu2 11m7s6g 11mrkrt xd8hm f8b8ll a13ksa atrtuu gi78zh 1tti8pg wjscqi 2fon4w 1oo6z4r 1x1y3bn r5ucap ftzqlx 163cabz 1ata9qn notb3t 1o5qg6u cqtbf 1ekkmga w63ds9 opitxx 1tt8w7o 1j7jx3j wxdihj uucbpa 1oz0sbv koi03c 18su3uw 1d2l6dq 1xoo8za 1mlm586 1fy5id6 5xncy3 korn6x 15tqb98 yphkh0 1na5r61 1tg6dif 1c8mo0p 1cix1ke 1bi1v5o i2z4k4 xu15hv qljonf xtu8we fymu39 bgnakh u7kbsi u7kg6y 17sjedf lo81jx gw7r6v vkg25f 11qmjbk 1h9gjt1 7i410c 7421rp 1g8igxt kvmhbt 47pf0u veawvs 1exsz9d l4jj75 w3y0w 1dvg5tt 5mxpva 1cqjro3 yj2hw1 5atp6g 7xuiuu a1lozu a1lshk a1lshz 1x2fz9x aa0krg 1njxurc etvja2 etvjah 12fqlq8 143tuo1 qwp5y0 qxsr4q 1oenz7u 1qf9wdj zbxity 12yte1y 1qtln4n 1i63rk7 tn46an 1nq8sio gec251 dpzo3n dpzqim 11invl c7qczs jbr3jn 1lldwui 63xdzo 13layxt wi85yl 175yu51 1jvzr4g ru7sfc nm4kj7 adxx5n 2q5yju hwdmxn sfxrxv bxro0h czpgye yf30xm 2lkfj9 r9qznk def3u3 1pzw7rj q0ej1s mqafkc 1kh0jq1 141xawn m228ry ty157a 3ofupr aadti1 5pcauy 3mnp3f f8gi05 btpx87 1yb9q15 xjfz6b 1bf2nfg 1bfmg0t 1bg68m6 350kay 1kt4ok3 1510aev zvtpcz 1kdhntc 1ke1gep 1kel902 5gz0ic 1ogbspu 1l0a7zc 1l5ky9m qju5b4 1c1dh2n ps5c9f wz1fhr 1abuqoh 22vkiq 13o57yg 92bjh3 1lfo1lb jb2pon 1bx52ke 9f4ba5 1vvawn4 14lj1br 1el11lw 793tpq crtssr 101zk4d meo1pb 1f7n1b9 pn57o9 tkebbg 1vztzo4 6igz70 zmqxs5 vfhk2r 1i4hixl cy0ktu pbgsig tncuop 1m7h5jr w9glso m4ah5e tazo2d qlmuqk 9fvwp9 130jdjr 4tg29e 158d5kd 11yhuyb u7edcr 7aderm 18qikg1 10ld5sc dbswj3 1ikp98e 1t9ealf 6ayi6k uvkw81 3u02rv evsgf2 1nty3qo nxc53w 4fkofk p4g9cz 167oueu 14cjn31 319o0g 1mw2ltv vvqodd 11vhehh 1yjc8g0 1e18of2 1m3iyfs 1vya6aa 1glwbzl 1vce3jl 14uhdm0 mvdb20 9h66tu 7obaae 609q8s 1024gdr 13cde6w ixhven jpusw5 jy3psk 1jzvjpv 67hjd3 1o7yj93 12fkhc7 1lfwl89 zce1m8 10dq46c 109n76w 1exlzh0 15f81wt r1rrr9 1wdvy7a 16vezbb 1mqo4we vb1ws3 t11kkl 39hac ctrtfi ul49dd in6a04 1m3mj5v 1xiz912 s6nf5g 1qvut9y l6nboe ue02mq 97metm naol39 1ng9gcn 12nj3i8 1sbadkj 1py83bj 2fxhmx os7ycl 2o24ll cxe81o b3mah5 tjfmmb d64dzz 1f979fh q9wnvf 7o3o5c ooydo8 7ongqp 9mgkq6 9p7joz a5pdht blxtv4 ddpyp0 fslgg2 p6002f hxg572 t1dnuh 1bujmjj 1bv3f4w 1clhjm8 q5qmmw ql4v90 17n0z3p 17oocvs tvwff0 twg80d w1ff2x 1yuoneo 1tiz9dk 1ujth4r w3mlgd q0gfv wbvics 7toscs 1juutsl 1jqqs3y 1u0w0s2 tqlqkk 1jfo35n v2f0je 1j5ezj0 svov7p 1hflaj htuq9l 81z1d2 1i98pj0 k3uzy0 144yz4h 5skjbe oohly7 1d49kmt dq9jie 1aqaz7c 3xmj2i 1qsbexl 1wnxc04 57ha2x 18wor1d 38eei2 15tt8lr ycplev 11ruxn9 mg40ki 1o73ozf 1dooo7m 1dqc1zp 1drfn6f 1drzfrs 83oizg 10881m8 jdnjmy p5imvu 1aaapff 141b89e bgx8ns 14smsfj 1mnbare 1mbtw8v 1qtsw08 dhbv1q pbdxrp 4o9hy3 1gv01f5 dvp5ea 1tmxm6y sezanc 1i6ypb7 31vhdn cfqmer cu19u5 p5r8ok r1xq9c 1fti7ig 1qc509r tp1ids 1e53mgi 1ncka61 94w1if rkfhdj 1l4dkv c73ko8 ts03rg 6pxgi6 155mla5 15zipz 1iyysio 14zps6q 9ww239 19d0mdq 1nl2pd5 aqiw8j jtp2va vggric kstxmx ef54yv 1hyur62 4hxbs3 4anxwc 1o86hde egy6xk 11zlg9p h5ka9q 1ptxhs2 nf33hz 1d3v8x5 qtau3r j8sdeq 1xn1xmo 24267n 1ist5s1 5zfk1o 1xq22xv kl6ik 1iodq5h 5u7for 156ocq7 1i505ct 1mi2cgc 1awnd1n 1x96rzd nkwx5n 13qaf13 173tcr5 63ry3s 1jz58t0 1cbzgna 1ktyijp 1thbm6s 16y7jk9 es09g5 5l0waw 1c3xbbe 1efk7la pw9ld5 8kvjcu 1p74lum 1bweht7 8z5qlv 17vgr76 1hrlp3c eu02i6 v6iebm 1b70boh 1k8v25k 8fjvxt 1fb26fw 1v29tyf 1nappsg ou9mbp wl2jg1 15jr57v 1wrri89 1g5mamz fjwqcn 1y3i03a 4jy0co 1c95b2w 60uita qudp88 w6b70a 1817mua 1ub2sgc 3t4gv8 1c3hfba 1c3hfbp l2xrvb 1ivr9ty z2es9 17oxfhp 13r3ddu yntlce tj2k3j 1r7yni 3tavxq 107mkof 1gl0s9c sws178 1w2z05w 1h0qs4e g60ddb g6k5yo g73yk1 g7nr5e g87jqr 17mhduk 18px9ox 2vzs36 1n765dw zr4qb6 g25bgn j9xvqo j49w8v 1odtnl7 xw5s93 8jio3p 1ke0vgd 1keko1q 1z05dr6 1pvsdnt 343uri jwnc9w 1cvs34j 15u4pq7 1cnprlj itg8a4 r5j27v r62ut8 r6mnel 7a4sw1 1iquemg 1753lp1 1gt5h79 hizc1q 1e3okqi vb3ggz 1tglo99 vti6dp tp3x82 1oglfsg 19p8epq mxr0zd 1jgls2h 1xmey30 1loz8xz aurh7j 1gmmgu0 1exp9mx 11spm4m j8i7br 1qtypht 1xo4p10 1orw5uc 1tn2uga 1cusbl3 1mgwfrd 14x4u4q 5gbzrh 1a13ay8 1reot4q r1o11l ocyrwb r16x7v r1qpt8 zgjdzj 13qvkrr 14jzjtt 97xc1b 1leb9vp ss2js2 10g0f3z 1d4dpte 16z2jgy 5gywp7 1tigs5c 1hkybid 1wuazrw u5huik l99kh2 1lbnazs gw8qbj 578je2 4r1ryi 1ww6dre 1gmrjre 1g3vpre mm0u4w 1vfr58s zlqlbr 4n7zqn y7fl2r xyo1dc xemib0 1wii9sh rvwh6j 1qy3yzt 13e0t5x 1rredmh 17wcss5 17pxvoh 13fcnn0 mz24pj 9mpy2w 12mty8v 1q6rl69 1l97oc8 fgr45y fiehy1 zlt80v 1qduhbb 17sqks9 abkmhd hx7rtm xeymg3 byjugf 6dat53 67py8s 1g3ga1m 1r79ilb 9o7ach e9i713 5gk6km 16812ok 1bnui7z er60go 3alaro 1edd8gt 104e41s 1sisldz 4b91x4 1sohwe5 11iqqwk hbkkr3 dd72p6 1b9g7uh 125eecs 1u095r 6fafnw 13n81gn 1x11i01 1xuq09s 5w27yw akwm74 1uuat6b 1bcvzg1 12tprqo 1trv3xc abrqgb 1bxo19a kp11yw yevu27 1pmdqgb 182c3q5 gdr8i9 327s07 16ih506 1v70v3m jttmgn u0lum0 1loy6f2 y6g4es 4qlq9h 1bp0hux 15qjqg9 17yi2dp 1e40sqg 1pugcao wum1kv nd1kjr 14t4yrg 14torct 14u8jy6 pyjbuc 1fmtkvv 13lnt8f 13f1dcm 1o6gnfg y16om0 vbjd8v 15kgnv2 iur3j3 1ebncf1 11lfzx8 n6epmv 1c7bhee bc471a 1pjyvij 19kdnon ybacv5 my3wc1 qh26wk 7ule3e 7ulkwt 6i8led twg4rg 1xnp8e7 1htdpa3 8l3fi onxq8z 1s9clzl 1ytd5dc 1w47p2o 1bygwn5 47c10t 1lrm0ju dyj3rm 1mn0vx5 15a92re ej0j6m 6kwnxi 1ehslr1 1nalbmh 1n14acj jgvert 1rp75ma 5m8rq9 uywn9l n36mtu 1ter1d0 1ogzjjk kov482 1y9s5jp z52lh0 t7vjrr t8z4yh s0jox1 1tei83b 1tf20oo 1tflta1 1th9724 vvgx68 xrdkwu 1x38i1p aurq1k 1ntcr9o 1atckeh 1uwjvhj sxnvgs 1xiq7yj 10j2qh6 sgi3v gc6otj gcqhew 1nz9nsa 19q9574 1vpgvgm 1nqlxpz 1ftjlw5 2fw2km w0ojaw 1hpzrqx zmfxr q3zz2z 118e956 14e5wx2 fdewx5 2lpsl5 1e52dee 13d9c90 1riun6d smnf9e 1n8fiba 1aukzzu wl7bzp ybs6di 18rnkmk 150j85a oksgv2 p2dvum 4de4lq 1h63kx4 6260ez sr3vpk 1dzxo2p nwmdwc 1c1cd6f 122xbi1 kgvtzn dwnof6 1mynocu 1p3ock6 1cz66w1 109gt1y s5rmcf 8buty3 153657k lhqcqy 1nen5rs 103vlf9 km626i 8d8fk7 12qgz65 1pu5xgo 36kqsa rfvtfq 194xpnb 3y3aq6 x6fl70 x7j6dq x82yz3 x96k5t ahjp8z 6t2vx6 k29tz4 1o37f8b 1tqa3av dhbq0m m2f0qk 1e54cvp iq8ish 1hflanw goe7yp uzkr8n 119jhrl 1ynqpve 1ttq9it 1qgggbq 1r0sued myc40q xnzija 1xdkxf 1hsd4ut joautj 1g716r0 1mlaupr 1xovhl6 1xpfa6j vye4na 2l24yv fuyos8 1yfqlqo 7ilvlf gdd6mi 1mb4m39 1jxr7dj 1uo4jg4 1440aq4 yqzxel bstwca 1728q54 mslzkw 1jcs36h hh92ex i57l82 6h23e9 1f32bt lae7bw laxzx9 lbhsim lc1l3z lcldpc 9mxc3n sg4hov kdjyx0 1bgdvx2 donxz9 154k954 g8w7n0 87jsju lujuzi 1kduva2 t9qffi aabbos gt2rhn 1yiq8jp 14k71zn 14k74em peka5l 1grx0g6 hr2v8m y53jd0 y53lrz 17e0seo 17e0utn 24ti8i 1w43y2f 1uz3s7w 5wpd34 76oqv2 1njs69q nwjrh5 eslkzt 19qydak 12mjot0 e7d8rc 1ex6xjf 15o0jqf eiglzk hwhv1z 1hyonw1 4yqgqb u5a1f7 kzqqz1 16gumqn 1flm8ij s2pvqd 10d0oyx 18hgtet d7lcqu 1tdcryp jxjif4 v415ca qyeoxs rjavhi 15iq3lv 1nrsntr 1w5jd5v 1fvkb6i x9q0x3 1r7zv5o 4pyx35 10ixddn vz5b0e 1hjclxt 11h1nbt jkblkx 1bdo4pz 1hpglhf 1v6zyt4 8rzn57';

  /* eslint-disable no-bitwise */
  // the list uses spaces, but wtf_wikipedia returns file names with underscores
  const normalize = (str) => str.toLowerCase().replace(/_/g, ' ').trim();

  // small synchronous hash for browser support and compact storage
  const hash = (str) => {
    let value = 0;
    for (let i = 0; i < str.length; i++) {
      value = (value * 31 + str.charCodeAt(i)) | 0;
    }
    return (value >>> 0).toString(36)
  };

  const bad = new Set(hashes.split(' '));

  // look for any known obscene images from wikipedia's
  // https://en.wikipedia.org/wiki/MediaWiki:Bad_image_list
  const byImage = function (doc) {
    const images = doc.images();
    const found = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      let file = img.file();
      file = normalize(file.replace(/^[^:]*:/, ''));
      if (bad.has(hash(file))) {
        found.push({ reason: 'Obscenity', name: file, data: img.json() });
      }
    }
    return found
  };

  // each detector returns rows like {reason:'Sexuality', name:'brothels', data:{..}}
  const detectors = [
    ['title', byTitle],
    ['image', byImage],
    ['template', byTemplate],
    ['category', byCategory]
  ];

  const plugin = function (models) {
    // add a new method to main class
    models.Doc.prototype.nsfw = function () {
      const doc = this;
      // group every match by its content-warning type
      const byType = {};
      detectors.forEach((arr) => {
        const source = arr[0];
        const rows = arr[1](doc);
        rows.forEach((row) => {
          const type = row.reason.toLowerCase();
          const found = { source: source, name: row.name };
          if (row.data !== undefined) {
            found.data = row.data;
          }
          byType[type] = byType[type] || [];
          byType[type].push(found);
        });
      });
      // empty array means nothing was found
      const warnings = Object.keys(byType).map((type) => {
        return { type: type, evidence: byType[type] }
      });
      // most evidence first
      warnings.sort((a, b) => b.evidence.length - a.evidence.length);
      return warnings
    };
  };
  plugin.version = version;

  return plugin;

}));
