/*! spencermountain/wtf_wikipedia  MIT */
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
    str = str.trim();
    str = str.replace(/ {2,}/g, " ");
    str = str.replace(/\s, /g, ", ");
    return str;
  }
  return "";
}
function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}
const normalizeKey = function(key = "") {
  key = key.toLowerCase();
  key = key.replace(/[ -]/g, "_");
  key = key.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, "$1");
  key = key.trim();
  return key;
};
const cjk = "\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Bopomofo}\u3002\u3001\uFF0C\uFF01\uFF1F\uFF1A\uFF1B\u300C\u300D\u300E\u300F\uFF08\uFF09";
const cjkEnd = new RegExp(`[${cjk}]$`, "u");
const cjkStart = new RegExp(`^[${cjk}]`, "u");
const joinSentences = function(arr = []) {
  return arr.reduce((str, next, i) => {
    if (i === 0) {
      return next;
    }
    if (cjkEnd.test(str) && cjkStart.test(next)) {
      return str + next;
    }
    return str + " " + next;
  }, "");
};

const isInterWiki = /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/;
const defaults$2 = {
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
const makeUrl = function(options, parameters = defaults$2) {
  let params = { ...parameters };
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
  if (!data?.query?.pages) {
    return null;
  }
  let pages = Object.keys(data.query.pages);
  return pages.map((id) => {
    let page = data.query.pages[id] || {};
    if (Object.hasOwn(page, "missing") || Object.hasOwn(page, "invalid")) {
      return null;
    }
    let rev = page.revisions?.[0];
    if (!rev) {
      return null;
    }
    let text = rev["*"];
    if (!text && rev.slots) {
      text = rev.slots.main["*"];
    }
    let revisionID = rev.revid;
    let timestamp = rev.timestamp;
    page.pageprops ||= {};
    let domain = options.domain;
    if (!domain && options.wiki) {
      domain = `${options.wiki}.org`;
    }
    let meta = {
      ...options,
      title: page.title,
      pageId: page.pageid,
      namespace: page.ns,
      domain,
      revisionId: revisionID,
      timestamp,
      pageImage: page.pageprops["page_image_free"],
      wikidata: page.pageprops.wikibase_item,
      description: page.pageprops["wikibase-shortdesc"]
    };
    return { wiki: text, meta };
  });
};

const fmtName = function(name) {
  name = (name || "").trim();
  name = name.toLowerCase();
  name = name.replace(/_/g, " ");
  return name;
};

const wp = ".wikipedia.org/wiki/$1";
const wm = ".wikimedia.org/wiki/$1";
const w = "www.";
var interwikis = {
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
  mediazilla: "bugzilla.wikimedia.org/$1",
  memoryalpha: "memory-alpha.fandom.com/wiki/$1",
  mineralienatlas: w + "mineralienatlas.de/lexikon/index.php/$1",
  moinmoin: "moinmo.in/$1",
  monstropedia: w + "monstropedia.org/?title=$1",
  mosapedia: "mosapedia.de/wiki/index.php/$1",
  mozcom: "mozilla.wikia.com/wiki/$1",
  mozillawiki: "wiki.mozilla.org/$1",
  mozillazinekb: "kb.mozillazine.org/$1",
  musicbrainz: "musicbrainz.org/doc/$1",
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
  meta: "meta" + wm,
  mediawiki: w + "mediawiki.org/wiki/$1",
  wikifunctions: w + "wikifunctions.org/wiki/$1",
  sep11: "sep11" + wp,
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
  chapter: "en" + wm
};

const aliases$3 = {
  w: "wikipedia",
  wikt: "wiktionary",
  b: "wikibooks",
  n: "wikinews",
  q: "wikiquote",
  s: "wikisource",
  v: "wikiversity",
  voy: "wikivoyage",
  d: "wikidata",
  c: "commons",
  species: "wikispecies",
  f: "wikifunctions",
  mw: "mediawiki",
  mediawikiwiki: "mediawiki",
  m: "meta",
  metawiki: "meta",
  metawikimedia: "meta",
  metawikipedia: "meta",
  wmf: "foundation",
  wikimedia: "foundation",
  outreachwiki: "outreach"
};

const normalizeProject = (project) => {
  project = project.toLowerCase();
  return Object.hasOwn(aliases$3, project) ? aliases$3[project] : project;
};

class Link {
  #data;
  constructor(data) {
    this.#data = data;
  }
  text() {
    return this.#data.text;
  }
  json(format = "lg") {
    const json = structuredClone(this.#data);
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    return json;
  }
  wikitext() {
    let txt = this.#data.wiki || "";
    return txt;
  }
  page() {
    return this.#data.page || "";
  }
  anchor() {
    return this.#data.anchor || "";
  }
  // which wiki, for interwiki links
  wiki() {
    const { lang, project, prefix } = this.#data;
    return project || prefix || lang || "";
  }
  type() {
    return this.#data.type;
  }
  //create a url for any type of link
  href() {
    const { type, prefix, project, lang, site } = this.#data;
    if (type === "external") {
      return site || "";
    }
    let page = this.page();
    if (!prefix) {
      page = page.replace(/ /g, "_");
    }
    page = encodeURIComponent(page);
    let url = `./${page}`;
    if (type === "interwiki") {
      const wiki = normalizeProject(prefix || project || "wikipedia");
      if (!Object.hasOwn(interwikis, wiki)) {
        return "";
      }
      url = "http://" + interwikis[wiki];
      if (lang && !prefix) {
        url = url.replace("://en.", `://${lang}.`);
      }
      url = url.replace(/\$1/g, page);
    }
    if (this.anchor()) {
      url += "#" + encodeURIComponent(this.anchor().replace(/ /g, "_"));
    }
    return url;
  }
}

const wrappers = /* @__PURE__ */ new Map();
class WrapperArray extends Array {
  // map(), filter(), and slice() return ordinary arrays.
  static get [Symbol.species]() {
    return Array;
  }
}
const addMethods = (Collection, Item) => {
  for (let prototype = Item.prototype; prototype !== Object.prototype; prototype = Object.getPrototypeOf(prototype)) {
    Object.getOwnPropertyNames(prototype).forEach((name) => {
      const method = Object.getOwnPropertyDescriptor(prototype, name).value;
      if (name in Collection.prototype || typeof method !== "function") {
        return;
      }
      Object.defineProperty(Collection.prototype, name, {
        configurable: true,
        writable: true,
        value(...args) {
          return this.map((item) => item[name](...args));
        }
      });
    });
  }
};
const wrapMethods = (Collection, Item) => {
  wrappers.set(Collection, Item);
  addMethods(Collection, Item);
};
const refreshWrappers = () => {
  wrappers.forEach((Item, Collection) => {
    addMethods(Collection, Item);
  });
};

class Links extends WrapperArray {
  internal() {
    return this.filter((l) => l.type() === "internal");
  }
  external() {
    return this.filter((l) => l.type() === "external");
  }
  interwiki() {
    return this.filter((l) => l.type() === "interwiki");
  }
}
wrapMethods(Links, Link);

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
  #data;
  constructor(data, info = {}) {
    this.#data = data;
    if (info.domain && info.domain !== data.domain) {
      this.#data = { ...data, domain: info.domain };
    }
  }
  file() {
    return this.#data.file || "";
  }
  alt() {
    let str = this.#data.alt || this.#data.file || "";
    str = str.replace(/^(file|image):/i, "");
    str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, "");
    return str.replace(/_/g, " ");
  }
  caption() {
    if (this.#data.caption) {
      return this.#data.caption.text;
    }
    return "";
  }
  links() {
    const arr = this.#data.caption?.links || [];
    return Links.from(arr.map((l) => new Link(l)));
  }
  url() {
    let fileName = makeSrc(this.file());
    let domain = this.#data.domain || server;
    let path = `wiki/Special:Redirect/file`;
    return `https://${domain}/${path}/${fileName}`;
  }
  src() {
    return this.url();
  }
  thumbnail(size = 300) {
    return this.url() + "?width=" + size;
  }
  format() {
    let arr = this.file().split(".");
    if (arr.at(-1)) {
      return arr.at(-1).toLowerCase();
    }
    return null;
  }
  json(format = "lg") {
    const json = structuredClone(this.#data);
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    return json;
  }
  text() {
    return "";
  }
  wikitext() {
    return this.#data.wiki || "";
  }
}

class Images extends WrapperArray {
}
wrapMethods(Images, Image);

class Block {
  #data;
  constructor(data) {
    this.#data = data;
  }
  links() {
    const items = this.#data.links || [];
    return Links.from(items.map((item) => new Link(item)));
  }
  bolds() {
    return this.#data.bolds || [];
  }
  italics() {
    return this.#data.italics || [];
  }
  text() {
    return this.#data.text || "";
  }
  json(format = "lg") {
    const json = structuredClone(this.#data);
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    json.links?.forEach((link) => {
      delete link.wiki;
    });
    json.bolds?.forEach((span) => {
      delete span.wiki;
    });
    json.italics?.forEach((span) => {
      delete span.wiki;
    });
    return json;
  }
  wikitext() {
    return this.#data.wiki || "";
  }
}

class Blocks extends WrapperArray {
  links() {
    const links = this.flatMap((item) => item.links());
    return Links.from(links);
  }
}
wrapMethods(Blocks, Block);

var infoboxes$1 = {
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
  \u751F\u7269\u5206\u985E\u8868: true,
  //ja taxobox
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
  "th\u1EC3 lo\u1EA1i",
  //	vi
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
  "picha",
  //sw
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

var infoboxes = [
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

const i18nReg = new RegExp("^(subst.)?(" + infoboxes.join("|") + ")(?=:| |\n|$)", "i");
infoboxes.forEach((name) => {
  infoboxes$1[name] = true;
});
const startReg = /^infobox /i;
const endReg = / infobox$/i;
const yearIn = /^year in [A-Z]/i;
const isInfobox = function(name) {
  if (Object.hasOwn(infoboxes$1, name) === true) {
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
const infoboxType = (name) => {
  const normalized = fmtName(name);
  return normalized.replace(i18nReg, "").trim();
};

const defaults$1 = Object.freeze({
  lang: "en",
  project: "wikipedia",
  domain: "wikipedia.org"
});
const aliases$2 = {
  pageID: "pageId",
  id: "pageId",
  ns: "namespace",
  language: "lang",
  revisionID: "revisionId"
};
const withDefaults = (input = {}) => {
  const opts = { ...input };
  Object.entries(aliases$2).forEach(([alias, key]) => {
    if (opts[key] === void 0 && opts[alias] !== void 0) {
      opts[key] = opts[alias];
    }
    delete opts[alias];
  });
  const project = normalizeProject(opts.project ?? defaults$1.project);
  return {
    ...defaults$1,
    ...opts,
    project,
    lang: opts.lang ?? defaults$1.lang,
    domain: opts.domain ?? (project === defaults$1.project ? defaults$1.domain : `${project}.org`)
  };
};

const strip = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, "");
  tmpl = tmpl.replace(/\}\}$/, "");
  return tmpl;
};

function postprocess(line) {
  line = line.replace(/\([,;: ]*\)/g, "");
  line = line.replace(/\( *(; ?)+/g, "(");
  line = trim_whitespace(line);
  line = line.replace(/ \.$/, ".");
  if (!line.includes("&")) {
    return line;
  }
  line = line.replace(/&nbsp;/g, "\xA0");
  line = line.replace(/&ndash;/g, "\u2013");
  line = line.replace(/&mdash;/g, "\u2014");
  line = line.replace(/&amp;/g, "&");
  line = line.replace(/&quot;/g, '"');
  line = line.replace(/&apos;/g, "'");
  line = line.replace(/&copy;/g, "\xA9");
  line = line.replace(/&reg;/g, "\xAE");
  line = line.replace(/&trade;/g, "\u2122");
  line = line.replace(/&lt;/g, "<");
  line = line.replace(/&gt;/g, ">");
  line = line.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)));
  line = line.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)));
  return line;
}

const external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]| ]{4,1500})([| ].*?)?\]/g;
const external_links = function(wiki, _opts = defaults$1) {
  let links = [];
  wiki.replace(external_link, function(match, protocol, link, text) {
    text ||= "";
    const obj = {
      type: "external",
      site: protocol + link,
      text: text.trim(),
      wiki: match
    };
    links.push(obj);
    return text;
  });
  return links;
};

var languages$1 = {
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

Object.keys(languages$1).forEach((k) => {
  interwikis[k] = k + ".wikipedia.org/wiki/$1";
});
const parseInterwiki = function(obj, _opts = defaults$1) {
  let str = obj.page || "";
  const leadingColon = str.startsWith(":");
  if (leadingColon) {
    str = str.slice(1);
  }
  if (str.indexOf(":") !== -1) {
    let m = str.match(/^([^:]+):(.*)/);
    if (m === null) {
      return obj;
    }
    let site = m[1] || "";
    site = site.toLowerCase();
    const project = normalizeProject(site);
    if (Object.hasOwn(interwikis, project) === false) {
      return obj;
    }
    obj.page = m[2];
    if (Object.hasOwn(languages$1, site)) {
      obj.lang = site;
      obj.inline = leadingColon;
    } else if (project === "doi") {
      obj.prefix = project;
      obj.inline = true;
    } else {
      obj.project = project;
      obj.inline = true;
      const qualified = obj.page.match(/^([^:]+):(.*)/);
      if (qualified && Object.hasOwn(languages$1, qualified[1].toLowerCase())) {
        obj.lang = qualified[1].toLowerCase();
        obj.page = qualified[2];
      }
    }
  }
  if (obj.lang || obj.project || obj.prefix) {
    obj.type = "interwiki";
    obj.text = obj.inline ? str : "";
  }
  return obj;
};

const namespaces = [
  "Media",
  "Special",
  "Talk",
  "User",
  "User talk",
  "Wikipedia",
  "Wikipedia talk",
  "File",
  "File talk",
  "MediaWiki",
  "MediaWiki talk",
  "Template",
  "Template talk",
  "Help",
  "Help talk",
  "Category",
  "Category talk",
  "Portal",
  "Portal talk",
  "Module",
  "Module talk",
  "Draft",
  "Draft talk"
];
const namespaceNames = Object.fromEntries(namespaces.map((name) => [name.toLowerCase(), name]));

const capitalProjects = /* @__PURE__ */ new Set([
  "wikipedia",
  "wikibooks",
  "wikinews",
  "wikiquote",
  "wikisource",
  "wikiversity",
  "wikivoyage",
  "commons",
  "wikispecies",
  "wikidata",
  "mediawiki"
]);
const capitalize = (title) => title.replace(/^./u, (letter) => {
  const upper = letter.toUpperCase();
  return [...upper].length === 1 ? upper : letter;
});
const normalizePage = (link, opts = defaults$1) => {
  if (link.prefix) {
    return link.page;
  }
  let project = link.project || link.lang;
  if (link.type === "internal" || !link.project && Object.hasOwn(languages$1, link.lang)) {
    project = opts.project ?? defaults$1.project;
  }
  project = normalizeProject(project);
  const capitalizeTitle = capitalProjects.has(project);
  if (link.type !== "internal" && !capitalizeTitle && project !== "wiktionary") {
    return link.page;
  }
  let page = link.page.normalize("NFC").replace(/[_\s]+/gu, " ").trim();
  page = page.replace(/^:/, "");
  if (!capitalizeTitle) {
    return page;
  }
  const colon = page.indexOf(":");
  const prefix = page.slice(0, colon).toLowerCase();
  if (colon !== -1 && Object.hasOwn(namespaceNames, prefix)) {
    return `${namespaceNames[prefix]}:${capitalize(page.slice(colon + 1).trim())}`;
  }
  return capitalize(page);
};

const ignore_links = /^(category|catégorie|kategorie|categoría|categoria|categorie|kategoria|تصنيف|image|file|fichier|datei|media):/i;
const link_reg = /\[\[((?:\[[^[\]\r\n]*\]|[^[\]\r\n]){0,1600})\]\]([a-z]+)?/gi;
const internal_links = function(wiki, opts = defaults$1) {
  let links = [];
  wiki.replace(link_reg, function(match, s, suffix) {
    let text = null;
    let link = s;
    if (s.match(/\|/)) {
      s = s.replace(/\[\[(.{2,1000}?)\]\](\w{0,10})/g, "$1$2");
      link = s.replace(/(.{2,1000})\|.{0,2000}/, "$1");
      text = s.replace(/.{2,1000}?\|/, "");
      if (text === null && link.match(/\|$/)) {
        link = link.replace(/\|$/, "");
        text = link;
      }
    }
    if (link.match(ignore_links)) {
      return s;
    }
    let obj = {
      type: "internal",
      page: link,
      text: "",
      wiki: match
    };
    obj.page = obj.page.replace(/#(.*)/, (a, b) => {
      obj.anchor = b;
      return "";
    });
    obj.text = obj.page;
    obj = parseInterwiki(obj, opts);
    if (text !== null && obj.inline !== false) {
      obj.text = text;
    }
    if (suffix && obj.inline !== false) {
      obj.text += suffix.trim();
    }
    if (obj.text && obj.text.startsWith(":")) {
      obj.text = obj.text.replace(/^:/, "");
    }
    obj.page = normalizePage(obj, opts);
    links.push(obj);
    return s;
  });
  return links;
};

const parse_links = function(wiki, opts = defaults$1) {
  let links = [];
  links = external_links(wiki, opts);
  links = links.concat(internal_links(wiki, opts));
  if (links.length === 0) {
    return void 0;
  }
  let cursor = 0;
  const positions = links.map((link) => {
    const at = wiki.indexOf(link.wiki, cursor);
    if (at === -1) {
      return wiki.indexOf(link.wiki);
    }
    cursor = at + link.wiki.length;
    return at;
  });
  links = links.map((link, i) => ({ link, at: positions[i], i })).sort((a, b) => a.at - b.at || a.i - b.i).map((o) => o.link);
  for (const link of links) {
    if (typeof link.text === "string") {
      link.text = postprocess(link.text).replace(/'{2,}/g, "");
    }
  }
  return links;
};

const removeLinks = function(line) {
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+)\]\](\w{0,5})/g, "$1");
  return line;
};
const fromBlock = function(block, opts = defaults$1) {
  let wiki = block.text;
  let links = parse_links(wiki, opts) || [];
  if (links.length > 0) {
    block.links = links.map((link) => {
      wiki = wiki.replace(link.wiki, () => link.text);
      return link;
    });
    wiki = removeLinks(wiki);
    block.text = wiki;
  }
};

const shift$1 = (offset, start, length) => {
  return offset - Math.min(length, Math.max(0, offset - start));
};
const remove = (block, start, length) => {
  if (block.bolds) {
    block.bolds.forEach((span) => {
      span.start = shift$1(span.start, start, length);
      span.end = shift$1(span.end, start, length);
    });
  }
  if (block.italics) {
    block.italics.forEach((span) => {
      span.start = shift$1(span.start, start, length);
      span.end = shift$1(span.end, start, length);
    });
  }
};
const parse$1 = (block, source, pattern, trim, groups) => {
  let removed = 0;
  const sources = [];
  source.text = source.text.replace(pattern, (match, _text, offset) => {
    sources.push(block.wiki.slice(offset, offset + match.length));
    return " ".repeat(trim) + match.slice(trim, -trim) + " ".repeat(trim);
  });
  let index = 0;
  block.text = block.text.replace(pattern, (match, _text, offset) => {
    const wiki = sources[index] || "";
    index += 1;
    const start = offset - removed;
    const text = match.slice(trim, -trim);
    remove(block, start + match.length - trim, trim);
    remove(block, start, trim);
    groups.forEach((group) => {
      block[group] = block[group] || [];
      block[group].push({ text, wiki, start, end: start + text.length });
    });
    removed += trim * 2;
    return text;
  });
};
const parseFormatting = (block) => {
  block.text = block.text || "";
  if (!block.text.includes("''")) {
    return block;
  }
  const source = { text: block.wiki || "" };
  block.links?.forEach((link) => {
    source.text = source.text.replace(link.wiki, " ".repeat(link.wiki.length));
  });
  parse$1(block, source, /'''''(.{0,2500}?)'''''/g, 5, ["bolds", "italics"]);
  parse$1(block, source, /''''(.{0,2500}?)''''/g, 3, ["bolds"]);
  parse$1(block, source, /'''(.{0,2500}?)'''/g, 3, ["bolds"]);
  parse$1(block, source, /''(.{0,2500}?)''/g, 2, ["italics"]);
  if (block.bolds) {
    block.bolds.forEach((span) => {
      span.text = block.text.slice(span.start, span.end);
    });
  }
  if (block.italics) {
    block.italics.forEach((span) => {
      span.text = block.text.slice(span.start, span.end);
    });
  }
  return block;
};

function fromText(str, opts = defaults$1) {
  let block = {
    text: str,
    wiki: str
    // links: [],
    // bolds: [],
    // italics: [],
  };
  fromBlock(block, opts);
  block.text = postprocess(block.text);
  block = parseFormatting(block);
  return block;
}

const pipeSplitter = function(tmpl) {
  let arr = tmpl.split(/\n?\|/);
  arr.forEach((a, i) => {
    if (a === null) {
      return;
    }
    if (i + 1 < arr.length && (a.slice(a.lastIndexOf("]") + 1, -1).includes("[[") || a.slice(a.lastIndexOf("}") + 1, -1).includes("{{") || a.split("{{").length !== a.split("}}").length || a.split("[[").length !== a.split("]]").length)) {
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
  if (Object.hasOwn(reserved, key)) {
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
      h.list ||= [];
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
const cleanup$1 = function(obj) {
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

const parseArguments$2 = (tmpl, order = [], opts = defaults$1) => {
  tmpl = strip(tmpl || "");
  let arr = pipeSplitter(tmpl);
  let name = arr.shift();
  let obj = keyMaker(arr, order);
  obj = cleanup$1(obj);
  if (obj["1"] && order[0] && Object.hasOwn(obj, order[0]) === false) {
    obj[order[0]] = obj["1"];
    delete obj["1"];
  }
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (key === "list") {
      const values = obj[key];
      for (let j = 0; j < values.length; j += 1) {
        values[j] = fromText(values[j], opts);
      }
    } else {
      obj[key] = fromText(obj[key], opts);
    }
  }
  if (name) {
    obj.template = fmtName(name);
  }
  return obj;
};

const namespace$1 = new RegExp(`^(?:${images.join("|")}):`, "i");
const normalizeFile = (file) => {
  file = file.trim();
  if (file.startsWith("[[")) {
    file = file.slice(2).replace(/^:/, "").split(/[|\]]/, 1)[0].trim();
  }
  file = file.replace(namespace$1, (prefix) => {
    if (/^(file|image):$/i.test(prefix)) {
      return prefix;
    }
    return "File:";
  });
  if (!file) {
    return "";
  }
  if (!/^(image|file):/i.test(file)) {
    file = `File:${file}`;
  }
  file = file.charAt(0).toUpperCase() + file.substring(1);
  return file.replace(/ /g, "_");
};

let fileNames = `(${images.join("|")})`;
const file_reg = new RegExp(fileNames + ":(.+?)[\\||\\]]", "iu");
const linkToFile = /^\[\[:/;
const imgLayouts = {
  thumb: true,
  thumbnail: true,
  frame: true,
  framed: true,
  frameless: true,
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
const parseImgString = function(wiki, opts = defaults$1) {
  const source = wiki;
  wiki = wiki.trim();
  if (!wiki.startsWith("[[")) {
    const file2 = normalizeFile(wiki);
    if (!file2) {
      return null;
    }
    wiki = `[[${file2}]]`;
  }
  let m = wiki.match(file_reg);
  if (m === null || !m[2]) {
    return null;
  }
  if (linkToFile.test(wiki)) {
    return null;
  }
  let file = `${m[1]}:${m[2] || ""}`;
  if (file) {
    file = normalizeFile(file);
    let img = {
      file,
      wiki: source,
      domain: opts.domain || defaults$1.domain
    };
    wiki = wiki.replace(/^\[\[/, "");
    wiki = wiki.replace(/\]\]$/, "");
    let parsed = parseArguments$2(wiki, [], opts);
    let arr = parsed.list || [];
    if (parsed.alt) {
      img.alt = parsed.alt.text;
    }
    arr = arr.filter((item) => {
      let text = item.text.trim();
      return !Object.hasOwn(imgLayouts, text) && !/^(?:\d+(?:x\d+)?|x\d+)px$/.test(text);
    });
    if (arr.at(-1)) {
      img.caption = arr.at(-1);
    }
    return img;
  }
  return null;
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

const readCoordinate = (box, prefix, directions, limit, separator) => {
  const field = (suffix) => box.get(prefix + separator + suffix)?.text().trim() || "";
  const degrees = field("d");
  if (!degrees) {
    return null;
  }
  const d = Number(degrees);
  const m = Number(field("m"));
  const s = Number(field("s"));
  const hemisphere = field(directions).toLowerCase();
  if (![d, m, s].every(Number.isFinite) || m < 0 || m >= 60 || s < 0 || s >= 60) {
    return null;
  }
  if (hemisphere && (hemisphere.length !== 1 || !directions.includes(hemisphere))) {
    return null;
  }
  const value = Math.abs(d) + m / 60 + s / 3600;
  if (value > limit) {
    return null;
  }
  const negative = hemisphere ? hemisphere === "s" || hemisphere === "w" : d < 0;
  return negative ? -value : value;
};
const dmsCoordinates = (box) => {
  const separators = ["", "_"];
  for (let i = 0; i < separators.length; i += 1) {
    const separator = separators[i];
    const lat = readCoordinate(box, "lat", "ns", 90, separator);
    const lon = readCoordinate(box, "long", "ew", 180, separator);
    if (lat !== null && lon !== null) {
      return { template: "infobox/lat-long", lat, lon };
    }
  }
  return null;
};

const imgProperties = [
  "image",
  "image2",
  "logo",
  "image_skyline",
  "image_map",
  //not tested
  "image_map2",
  //not tested
  "image_flag",
  "image_coat",
  "image_file",
  "\u753B\u50CF"
];
class Infobox {
  #data;
  #info;
  constructor(data, info = defaults$1) {
    this.#data = data;
    this.#info = info;
  }
  type() {
    return infoboxType(this.#data.template);
  }
  get kind() {
    return this.#data.kind;
  }
  links() {
    return Links.from(this.getAll(Object.keys(this.#data.data)).flatMap((block) => block.links()));
  }
  get(input) {
    return this.getAll([input])[0];
  }
  getFirst(choices) {
    for (let i = 0; i < choices.length; i += 1) {
      const block = this.get(choices[i]);
      if (block) {
        return block;
      }
    }
    return void 0;
  }
  getAll(choices) {
    const values = choices.flatMap((key) => {
      if (typeof key !== "string") {
        return [];
      }
      const value = this.#data.data[normalizeKey(key)];
      return value ?? [];
    });
    return Blocks.from(values.map((value) => new Block(value)));
  }
  images() {
    const properties = imgProperties.filter((key) => this.get(key));
    const images = properties.map((key) => {
      const item = this.get(key);
      const caption = this.get(key === "image2" ? "caption2" : "caption");
      const image = parseImgString(item?.wikitext() || "", this.#info);
      if (!image) {
        return null;
      }
      if (caption) {
        image.caption = caption.json("xl");
      }
      return new Image(image);
    }).filter(Boolean);
    return Images.from(images);
  }
  image() {
    return this.images()[0];
  }
  text() {
    return "";
  }
  json(format = "lg") {
    const json = structuredClone(this.#data);
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    return json;
  }
  wikitext() {
    return this.#data.wiki || "";
  }
  coordinates() {
    for (let i = 0; i < latLngs.length; i += 1) {
      let a = latLngs[i];
      const latText = this.get(a[0])?.text().trim();
      const lonText = this.get(a[1])?.text().trim();
      if (!latText || !lonText) {
        continue;
      }
      const lat = Number(latText);
      const lon = Number(lonText);
      if (typeof lat === "number" && typeof lon === "number" && Number.isFinite(lat) && Number.isFinite(lon)) {
        return { template: "infobox/lat-long", lat, lon, wiki: this.wikitext() };
      }
    }
    const coordinates = dmsCoordinates(this);
    return coordinates ? { ...coordinates, wiki: this.wikitext() } : null;
  }
}

class Infoboxes extends WrapperArray {
  getFirst(choices) {
    return this.find((infobox) => infobox.getFirst(choices));
  }
}
wrapMethods(Infoboxes, Infobox);

class List {
  #data;
  constructor(data) {
    this.#data = data;
  }
  lines() {
    return this.items();
  }
  items() {
    return Blocks.from(this.#data.items.map((item) => new Block(item)));
  }
  links() {
    return Links.from(this.items().flatMap((block) => block.links()));
  }
  json(format = "lg") {
    const json = structuredClone(this.#data);
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    return json;
  }
  text() {
    const items = this.#data.items;
    return items.map((s) => {
      let str = s.text;
      return " * " + str;
    }).join("\n");
  }
  wikitext() {
    return this.#data.wiki || "";
  }
}

class Lists extends WrapperArray {
}
wrapMethods(Lists, List);

class Reference {
  #data;
  constructor(data) {
    this.#data = data;
  }
  get kind() {
    return this.#data.kind;
  }
  links() {
    const items = this.#data.links || this.#data.data.inline?.links || [];
    return Links.from(items.map((item) => new Link(item)));
  }
  text() {
    return "";
  }
  title() {
    return this.#data.data.title || "";
  }
  wikitext() {
    return this.#data.wiki || "";
  }
  json(format = "lg") {
    const json = structuredClone(this.#data);
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    return json;
  }
  static empty() {
    return new Reference({ template: "", kind: "reference", wiki: "", text: "", data: {} });
  }
}

class References extends WrapperArray {
}
wrapMethods(References, Reference);

class Paragraph {
  #data;
  #info;
  constructor(data, info = {}) {
    this.#data = data;
    this.#info = info;
  }
  sentences() {
    const arr = this.#data.sentences || [];
    return Blocks.from(arr.map((s) => new Block(s)));
  }
  lists() {
    const arr = this.#data.lists || [];
    return Lists.from(arr.map((l) => new List(l)));
  }
  images() {
    const arr = this.#data.images || [];
    return Images.from(arr.map((i) => new Image(i, this.#info)));
  }
  links() {
    let links = [];
    this.images().forEach((i) => {
      links.push(...i.links());
    });
    this.lists().forEach((list) => {
      links.push(...list.links());
    });
    this.sentences().forEach((s) => {
      links.push(...s.links());
    });
    return Links.from(links);
  }
  text() {
    let str = joinSentences(this.sentences().map((s) => s.text()));
    this.lists().forEach((list) => {
      str += "\n" + list.text();
    });
    return str;
  }
  json(format = "lg") {
    const json = structuredClone({
      wiki: this.wikitext(),
      images: this.images().map((image) => image.json(format)),
      lists: this.lists().map((list) => list.json(format)),
      sentences: this.sentences().map((sentence) => sentence.json(format))
    });
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    return json;
  }
  wikitext() {
    return this.#data.wiki;
  }
}

class Table {
  #data;
  constructor(data) {
    this.#data = data;
  }
  cells() {
    let arr = [...this.#data.headers];
    this.#data.rows.forEach((row) => {
      Object.values(row).forEach((cell) => {
        arr.push(cell);
      });
    });
    return Blocks.from(arr.map((cell) => new Block(cell)));
  }
  links() {
    return Links.from(this.cells().flatMap((block) => block.links()));
  }
  cols() {
    const row = this.#data.rows[0];
    return Object.keys(row || {});
  }
  headers() {
    return Blocks.from(this.#data.headers.map((header) => new Block(header)));
  }
  rows() {
    return this.#data.rows.map((row) => {
      const result = {};
      Object.keys(row).forEach((key) => {
        result[key] = row[key].text || "";
      });
      const attrs = row._attrs;
      if (attrs) {
        Object.defineProperty(result, "_attrs", { value: attrs, enumerable: false });
      }
      return result;
    });
  }
  // return only the requested cols
  getRows(requested) {
    const rows = this.rows();
    if (!requested) {
      return rows;
    }
    if (Array.isArray(requested)) {
      const columns = requested.map((col) => normalizeKey(col));
      return rows.map((row) => columns.map((col) => row[col]));
    }
    if (typeof requested === "string") {
      return rows.map((row) => row[normalizeKey(requested)]);
    }
    if (typeof requested === "object") {
      return rows.map((row) => {
        let result = {};
        Object.entries(requested).forEach(([key, val]) => {
          if (val) {
            let clean = normalizeKey(key);
            result[clean] = row[clean];
          }
        });
        return result;
      });
    }
    return [];
  }
  json(format = "lg") {
    const json = structuredClone(this.#data);
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    return json;
  }
  text() {
    return "";
  }
  wikitext() {
    return this.#data.wiki || "";
  }
}

class Tables extends WrapperArray {
}
wrapMethods(Tables, Table);

class Template {
  #data;
  constructor(data) {
    this.#data = data;
  }
  get type() {
    return this.#data.kind || this.#data.template.toLowerCase().replace(/_/g, " ");
  }
  get kind() {
    return this.#data.kind;
  }
  text() {
    return this.#data.text;
  }
  links() {
    return Links.from((this.#data.links || []).map((link) => new Link(link)));
  }
  json(format = "lg") {
    const json = structuredClone(this.#data);
    if (format === "xl") {
      return json;
    }
    delete json.wiki;
    json.links?.forEach((link) => {
      delete link.wiki;
    });
    return json;
  }
  wikitext() {
    return this.#data.wiki;
  }
  static empty() {
    return new Template({ template: "", kind: null, wiki: "", text: "", data: {} });
  }
}

class Templates extends WrapperArray {
}
wrapMethods(Templates, Template);

class Section {
  #data;
  #info;
  constructor(data, info = {}) {
    this.#data = data;
    this.#info = info;
  }
  title() {
    return this.#data.title?.text || "";
  }
  index() {
    return this.#data.index ?? null;
  }
  depth() {
    return this.#data.depth || 0;
  }
  sentences() {
    return Blocks.from(this.paragraphs().flatMap((p) => p.sentences()));
  }
  paragraphs() {
    const arr = this.#data.paragraphs || [];
    return arr.map((p) => new Paragraph(p, this.#info));
  }
  wikitext() {
    return this.#data.wiki || "";
  }
  links() {
    let arr = [];
    if (this.#data.title?.links) {
      this.#data.title.links.forEach((l) => {
        arr.push(new Link(l));
      });
    }
    this.infoboxes().forEach((templ) => {
      arr.push(...templ.links());
    });
    this.references().forEach((s) => {
      arr.push(...s.links());
    });
    this.templates().forEach((template) => {
      arr.push(...template.links());
    });
    this.tables().forEach((t) => {
      arr.push(...t.links());
    });
    this.paragraphs().forEach((s) => {
      arr.push(...s.links());
    });
    arr = arr.flat().filter((val) => val !== void 0);
    return Links.from(arr);
  }
  tables() {
    const arr = this.#data.tables || [];
    return Tables.from(arr.map((t) => new Table(t)));
  }
  templates(clue) {
    let arr = this.#data.templates.map((t) => new Template(t));
    if (clue) {
      return Templates.from(arr.filter((t) => t.type === clue || fmtName(t.json().template) === fmtName(clue)));
    }
    return Templates.from(arr);
  }
  infoboxes() {
    const arr = this.#data.infoboxes || [];
    return Infoboxes.from(arr.map((t) => new Infobox(t, this.#info)));
  }
  coordinates() {
    let arr = this.templates("coord");
    let list = arr.map((tmpl) => ({ ...tmpl.json().data, wiki: tmpl.wikitext() }));
    let inf = this.infoboxes()[0];
    const coordinates = inf?.coordinates();
    if (coordinates) {
      list.push(coordinates);
    }
    return list;
  }
  lists() {
    let arr = this.paragraphs().flatMap((p) => p.lists());
    return Lists.from(arr);
  }
  images() {
    return Images.from(this.paragraphs().flatMap((p) => p.images()));
  }
  references() {
    const arr = this.#data.references || [];
    return References.from(arr.map((r) => new Reference(r)));
  }
  //outputs
  text() {
    return this.paragraphs().map((p) => p.text()).join("\n\n");
  }
  json(format = "lg") {
    if (format === "xl") {
      return structuredClone(this.#data);
    }
    const { wiki: _wiki, ...data } = this.#data;
    return structuredClone(data);
  }
  // aliases
  citations() {
    return this.references();
  }
  static empty() {
    return new Section({
      title: {},
      depth: 0,
      wiki: "",
      index: 0,
      templates: [],
      infoboxes: [],
      references: [],
      tables: [],
      paragraphs: []
    });
  }
}

let d = " disambiguation";
const templates$e = /* @__PURE__ */ new Set([
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
]);

const mayAlsoReg = /. may (also )?refer to\b/i;
const notDisambig = /* @__PURE__ */ new Set(["about", "for", "for multi", "other people", "other uses of", "distinguish"]);
const inTitle = new RegExp(". \\((" + disambig_titles.join("|") + ")\\)$", "i");
const i18n_templates = new Set(disambig_templates);
const isDisambig = function(doc) {
  const templates = doc.templates().map((tmpl) => tmpl.type);
  let found = templates.find((name) => {
    return templates$e.has(name) || i18n_templates.has(name);
  });
  if (found) {
    return true;
  }
  let title = doc.title;
  if (title && inTitle.test(title) === true) {
    return true;
  }
  const names = doc.templates().map((tmpl) => (tmpl.json().template || "").toLowerCase());
  let notDisamb = names.find((name) => notDisambig.has(name));
  if (notDisamb) {
    return false;
  }
  const str = doc.sentences()[0]?.text();
  if (str && mayAlsoReg.test(str) === true) {
    return true;
  }
  return false;
};

let allStubs = new Set(stubs);
const isStub = function(doc) {
  const templates = doc.templates();
  return templates.some((t) => {
    let name = t.type || "";
    if (allStubs.has(name)) {
      return true;
    }
    if (name === "stub" || name.endsWith("-stub")) {
      return true;
    }
    let words = name.split(/[- ]/);
    if (words.length > 1) {
      let word = words.at(-1);
      if (allStubs.has(word)) {
        return true;
      }
    }
    return false;
  });
};

const sectionMap = function(doc, fn, clue) {
  let arr = [];
  doc.sections().forEach((sec) => {
    let list = [];
    {
      list = sec[fn]();
    }
    list.forEach((t) => {
      arr.push(t);
    });
  });
  return arr;
};

class Document {
  #data;
  #info;
  constructor(data, info) {
    this.#data = data;
    this.#info = withDefaults(info);
  }
  get title() {
    if (this.#info.title) {
      return this.#info.title;
    }
    let guess = null;
    let sen = this.sentences()[0];
    if (sen) {
      guess = sen.bolds()[0]?.text || null;
    }
    return guess;
  }
  set title(str) {
    this.#info.title = str;
  }
  get pageID() {
    return this.#info.pageId || null;
  }
  set pageID(str) {
    this.#info.pageId = str;
  }
  get wikidata() {
    return this.#info.wikidata || null;
  }
  set wikidata(str) {
    this.#info.wikidata = str;
  }
  get domain() {
    return this.#info.domain || null;
  }
  set domain(str) {
    this.#info.domain = str;
  }
  get language() {
    return this.#info.lang || null;
  }
  set language(str) {
    this.#info.lang = str;
  }
  get namespace() {
    return this.#info.namespace ?? null;
  }
  set namespace(str) {
    this.#info.namespace = str;
  }
  get revisionID() {
    return this.#info.revisionId || null;
  }
  set revisionID(str) {
    this.#info.revisionId = str;
  }
  get timestamp() {
    return this.#info.timestamp || null;
  }
  set timestamp(str) {
    this.#info.timestamp = str;
  }
  get description() {
    return this.#info.description || null;
  }
  set description(str) {
    this.#info.description = str;
  }
  get pageImage() {
    return this.#info.pageImage || null;
  }
  set pageImage(str) {
    this.#info.pageImage = str;
  }
  // don'y allow setting thesese
  wikitext() {
    return this.#data.wiki || "";
  }
  options() {
    return { ...this.#info };
  }
  // falls back to 'en' and 'wikipedia.org' when language or domain are missing
  url() {
    let title = this.#info.title;
    if (!title) {
      return null;
    }
    let lang = this.#info.lang;
    let domain = this.#info.domain;
    title = title.replace(/ /g, "_");
    title = encodeURIComponent(title);
    return `https://${lang}.${domain}/wiki/${title}`;
  }
  isRedirect() {
    return Boolean(this.#data.isRedirect);
  }
  isStub() {
    return isStub(this);
  }
  redirectTo() {
    const link = this.#data.redirectTo;
    return link ?? null;
  }
  isDisambiguation() {
    return isDisambig(this);
  }
  categories() {
    return this.#data.categories || [];
  }
  comments() {
    return this.#data.comments || [];
  }
  sections() {
    let arr = this.#data.sections || [];
    return arr.map((section) => new Section(section, this.#info));
  }
  section(clue = 0) {
    const sections = this.sections();
    if (typeof clue === "number") {
      return sections[clue] ?? Section.empty();
    }
    const title = clue.trim().toLowerCase();
    const found = sections.find((section) => section.title().trim().toLowerCase() === title);
    return found ?? Section.empty();
  }
  paragraphs() {
    return this.sections().flatMap((section) => section.paragraphs());
  }
  sentences() {
    return Blocks.from(this.sections().flatMap((section) => section.sentences()));
  }
  // searches the whole page, including infobox and gallery templates, for images
  images() {
    let arr = [];
    if (this.#info.pageImage) {
      const data = parseImgString(this.#info.pageImage, this.#info);
      if (data) {
        arr.push(new Image({ ...data, wiki: "" }));
      }
    }
    this.infoboxes().forEach((info) => {
      let img = info.image();
      if (img) {
        arr.push(img);
      }
    });
    arr = arr.concat(sectionMap(this, "images"));
    this.templates("gallery").forEach((template) => {
      const data = template.json().data;
      const images = data.images || [];
      images.forEach((image) => {
        if (image) {
          arr.push(new Image(image, this.#info));
        }
      });
    });
    return Images.from(arr);
  }
  links(clue) {
    let arr = this.sections().flatMap((sec) => sec.links());
    if (clue) {
      arr = arr.filter((l) => l.page() === clue);
    }
    return Links.from(arr);
  }
  link(clue) {
    return this.links(clue)[0] ?? null;
  }
  lists() {
    return Lists.from(sectionMap(this, "lists"));
  }
  tables() {
    return Tables.from(sectionMap(this, "tables"));
  }
  templates(clue) {
    const items = this.sections().flatMap((sec) => sec.templates());
    if (clue) {
      return Templates.from(items.filter((t) => t.type === clue || fmtName(t.json().template) === fmtName(clue)));
    }
    return Templates.from(items);
  }
  template(clue) {
    return this.templates(clue)[0] ?? null;
  }
  references() {
    const items = this.sections().flatMap((sec) => sec.references());
    return References.from(items);
  }
  citations() {
    return this.references();
  }
  // TODO: Coordinates contain plain data, not models. Keep the existing array API for now.
  coordinates() {
    return sectionMap(this, "coordinates");
  }
  infoboxes() {
    let arr = this.sections().flatMap((sec) => sec.infoboxes());
    arr = arr.sort((a, b) => {
      if (Object.keys(a.json().data).length > Object.keys(b.json().data).length) {
        return -1;
      }
      return 1;
    });
    return Infoboxes.from(arr);
  }
  text() {
    if (this.isRedirect() === true) {
      return "";
    }
    let arr = this.sections().map((sec) => sec.text());
    return arr.join("\n\n");
  }
  json(format = "lg") {
    let data = {};
    data.title = this.title;
    data.pageID = this.pageID;
    data.categories = this.categories().slice();
    data.wikidata = this.wikidata;
    data.description = this.description;
    data.isStub = this.isStub();
    data.isDisambiguation = this.isDisambiguation();
    data.isRedirect = this.isRedirect();
    if (data.isRedirect === true) {
      data.redirectTo = this.redirectTo();
    }
    data.sections = this.sections().map((i) => i.json(format));
    const json = data;
    if (format === "xl") {
      json.wiki = this.wikitext();
    }
    return json;
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
  infobox() {
    return this.infoboxes()[0] ?? null;
  }
  // aliases
  isDisambig() {
    return this.isDisambiguation();
  }
  redirectsTo() {
    return this.redirectTo();
  }
  redirect() {
    return this.redirectTo();
  }
}

const REDIRECT_REGEX = new RegExp("^[ \n	]*?#(" + redirects.join("|") + ") *?(\\[\\[.{2,180}?\\]\\])", "i");
const isRedirect = function(wiki) {
  if (!wiki) {
    return false;
  }
  return REDIRECT_REGEX.test(wiki);
};
const parseRedirect = function(wiki, opts = defaults$1) {
  let m = wiki.match(REDIRECT_REGEX);
  if (m && m[2]) {
    let links = parse_links(m[2], opts) || [];
    return links[0];
  }
  return null;
};

const cat_reg = new RegExp("\\[\\[(" + _categories.join("|") + "):(.{2,178}?)]](w{0,10})", "gi");
const cat_remove_reg = new RegExp("^\\[\\[:?(" + _categories.join("|") + "):", "gi");
const parse_categories = function(page) {
  let wiki = page.remaining;
  const categories = [];
  const categoryDetails = [];
  let tmp = wiki.match(cat_reg);
  if (tmp) {
    tmp.forEach(function(c) {
      const source = c;
      c = c.replace(cat_remove_reg, "");
      c = c.replace(/\|?[ *]?\]\]$/, "");
      c = c.replace(/\|.*/, "");
      if (c && !c.match(/[[\]]/)) {
        categories.push(c.trim());
        categoryDetails.push({ text: c.trim(), wiki: source });
      }
    });
  }
  page.remaining = wiki.replace(cat_reg, "");
  page.categories = categories;
  return page;
};

const referenceKinds = /* @__PURE__ */ new Set(["citation", "refn", "sfn", "harvnb", "source"]);
const sortOut = (templates) => {
  const res = { infoboxes: [], references: [], others: [] };
  templates.forEach((obj) => {
    if (referenceKinds.has(obj.kind)) {
      res.references.push(obj);
    } else if (obj.kind === "infobox" && obj.data.subbox?.text !== "yes") {
      res.infoboxes.push(obj);
    } else {
      res.others.push(obj);
    }
  });
  return res;
};

const open = "{";
const close = "}";
const findFlat = (wiki) => {
  let depth = 0;
  const list = [];
  let start = -1;
  const len = wiki.length;
  for (let i = 0; i < len; i += 1) {
    if (depth === 0) {
      i = wiki.indexOf(open, i);
      if (i === -1) {
        break;
      }
      start = i;
    }
    const c = wiki[i];
    if (c === open) {
      depth += 1;
    }
    if (depth > 0) {
      if (c === close) {
        depth -= 1;
        if (depth === 0) {
          const tmpl = wiki.slice(start, i + 1);
          if (tmpl.includes("{{") && tmpl.includes("}}")) {
            list.push(tmpl);
          }
          continue;
        }
      }
      if (depth === 1 && c !== open && c !== close) {
        depth = 0;
        continue;
      }
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

const hasTemplate = /\{\{/;
const maxDepth = 40;
const createNode = (tmpl) => {
  return {
    wiki: tmpl,
    body: tmpl,
    parserName: getName(tmpl),
    children: []
  };
};
const findChildren = (obj, depth = 1) => {
  let wiki = obj.body.slice(2);
  wiki = wiki.replace(/\}\}$/, "");
  const list = findFlat(wiki);
  obj.children = list.map(createNode);
  if (obj.children.length === 0 || depth >= maxDepth) {
    return obj;
  }
  for (let i = 0; i < obj.children.length; i += 1) {
    const child = obj.children[i];
    const inside = child.body.slice(2);
    if (hasTemplate.test(inside)) {
      findChildren(child, depth + 1);
    }
  }
  return obj;
};
const findTemplates = (wiki) => {
  let list = findFlat(wiki);
  list = list.map(createNode);
  list = list.map(findChildren);
  return list;
};

let aliases$1 = {
  imdb: "imdb name",
  "imdb episodes": "imdb episode",
  localday: "currentday",
  localdayname: "currentdayname",
  localyear: "currentyear",
  "birth date based on age at death": "birth based on age as of date",
  "bare anchored list": "anchored list",
  cvt: "convert",
  cricon: "flagicon",
  sqrt: "radic",
  "unreferenced section": "unreferenced",
  redir: "redirect",
  sisterlinks: "sister project links",
  by: "baseball year",
  nbay: "nba year",
  n\u00E9e: "nee",
  n\u00E9: "nee",
  "interlanguage link": "ill",
  "interlanguage link multi": "ill",
  postnominals: "post-nominals",
  "post-nominal": "post-nominals",
  "post-nominals/gbr": "post-nominals",
  slink: "section link",
  "section links": "section link",
  crossref: "crossreference",
  xref: "crossreference",
  "cross reference": "crossreference",
  "cross-reference": "crossreference",
  nth: "ordinal",
  "number to word": "spell",
  numtext: "spell",
  "spell number": "spell",
  "comma separated list": "cslist",
  caps: "allcaps",
  "all caps": "allcaps",
  keypress: "key press",
  fontcolor: "font color",
  "font colour": "font color",
  "font-color": "font color",
  cns: "citation needed span",
  "cn span": "citation needed span",
  "citation-needed span": "citation needed span",
  "ko-hhrm": "korean",
  "nihongo krt": "nihongo",
  "script/arab": "script/arabic",
  harvp: "harv",
  harvcol: "harv",
  "harvard citation": "harv",
  harvcoltxt: "harvtxt",
  "harvard citation text": "harvtxt",
  "harvcolnb": "harvard citation no brackets",
  tlp: "tlx",
  // sports
  "nft-women": "fbw",
  "fb women": "fbw",
  "nfa-rt": "nfa",
  bkwomen: "bkw",
  "flagioc athlete": "flagiocathlete",
  "flag ioc": "flagioc",
  "world series year": "wsy",
  // external-link templates
  "ietf rfc": "rfc",
  uspatent: "us patent",
  "u.s. patent": "us patent",
  oeis2c: "oeis link",
  "official url": "official website",
  official: "official website",
  "plain link": "plainlink",
  plainlinks: "plainlink",
  "wayback machine": "wayback",
  webcite: "webarchive",
  bibleref: "bibleverse",
  bibleref2: "bibleverse",
  "bible verse": "bibleverse",
  wt: "wikt",
  "wiktionary-inline": "wikt",
  "wiktionary inline": "wikt",
  "commons-inline": "commons category-inline",
  "commonscat-inline": "commons category-inline",
  "commons cat-inline": "commons category-inline",
  "wikisource author-inline": "wikisource-inline",
  "imdb character": "imdb title",
  "imdb company": "imdb title",
  "rotten-tomatoes": "rotten tomatoes",
  rottentomatoes: "rotten tomatoes",
  "metacritic game": "metacritic film",
  "metacritic television": "metacritic film",
  bbref: "baseball-reference",
  baseballstats: "baseball-reference",
  pfr: "pro-football-reference",
  "x (social network)": "twitter",
  rom: "roman",
  "roman numeral": "roman",
  "subatomic particle": "subatomicparticle",
  particle: "subatomicparticle",
  "10": "10^",
  "str rightc": "str right",
  "str sub": "str mid",
  "str lower": "lc",
  "str upper": "uc",
  tlc: "tlx",
  tld: "tlx",
  "sort name": "sortname",
  floruit: "fl.",
  fl: "fl.",
  "ca.": "circa",
  ca: "circa",
  asof: "as of",
  "nhl year": "mhl year",
  nhly: "mhl year",
  mlby: "mlb year",
  nfly: "nfl year",
  aldsy: "alds year",
  nldsy: "nlds year",
  //not perfect..
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
  "pp.": "p.",
  "iss.": "vol.",
  h2d: "hex2dec",
  wdl: "win draw lose"
};
let multi = {
  citation: ["cite"],
  "no spam": ["email", "@", "no spam blue"],
  "angle bracket": ["angbr", "infix", "angbr ipa"],
  "lrt station": ["lrt", "lrts"],
  "mrt station": ["mrts"],
  flagcountry: ["cr", "cr-rt"],
  trunc: ["str left", "str crop"],
  percentage: ["pct"],
  rnd: ["rndfrac", "rndnear"],
  abbr: ["tooltip", "abbrv", "define"],
  sfn: ["sfnref", "harvid", "harvnb"],
  "birth date and age": ["death date and age", "bda", "b-da"],
  currentmonth: ["localmonth", "currentmonthname", "currentmonthabbrev"],
  coord: ["coor", "coor title dms", "coor title dec", "coor dms", "coor dm", "coor dec", "coordinate"],
  "columns-list": ["cmn", "col-list", "columnslist", "collist"],
  nihongo: ["nihongo2", "nihongo3", "nihongo-s", "nihongo foot"],
  plainlist: ["flatlist", "plain list"],
  "winning percentage": ["winpct", "winperc"],
  "win-loss record": ["win\u2013loss record", "win loss record", "wlr"],
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
    "mlix"
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
    "citaiton needed",
    "citation missing",
    "citation need",
    "citation requested",
    "citation required",
    "citation-needed",
    "citationeeded",
    "citationneeded",
    "citationrequired",
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
  "en dash": ["nsndns"],
  "spaced en dash": ["spnd", "sndash", "spndash"],
  "spaced en dash space": ["spndsp", "sndashs", "spndashsp"],
  "zero width joiner em dash zero width non joiner": ["nsmdns", "nsmdashns", "nsemdashns"],
  color: ["colour", "colored text", "fgcolor"]
};
Object.keys(languages$1).forEach((lang) => {
  aliases$1["ipa-" + lang] = "ipa";
  aliases$1["ipac-" + lang] = "ipac";
});
Object.keys(multi).forEach((k) => {
  multi[k].forEach((str) => {
    aliases$1[str] = k;
  });
});

const positions$1 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const parseShortcut = (handler, wiki, parse) => {
  if (typeof handler === "number") {
    const data = parse(wiki, positions$1);
    return { data: null, replacement: data[String(handler)] || "" };
  }
  if (typeof handler === "string") {
    return { data: null, replacement: handler };
  }
  if (Array.isArray(handler)) {
    return { data: parse(wiki, handler), replacement: "" };
  }
  if (handler && typeof handler === "object") {
    const data = parse(wiki, handler.props);
    return { data, replacement: data[handler.out] || "" };
  }
  return { data: parse(wiki), replacement: "" };
};

var hardcoded = {
  // table-row result markers from sports game-logs - they become row-attributes, like mediawiki does
  "game-won": 'class="game-won"',
  "game-lost": 'class="game-lost"',
  "game-tied": 'class="game-tied"',
  "game-drawn": 'class="game-drawn"',
  "game-otl": 'class="game-otl"',
  "game-otw": 'class="game-otw"',
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
  // numeric entities, so they aren't mistaken for list/table syntax (same trick as mediawiki)
  "number sign": "&#35;",
  "hash-tag": "&#35;",
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
  "\\": " / ",
  "`": "`",
  // bracket: '[',
  "[": "[",
  "*": "&#42;",
  asterisk: "&#42;",
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
  pipe: "&#124;",
  "non-breaking space": " ",
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
  lbm: "lbm",
  // --- symbols - https://en.wikipedia.org/wiki/Category:Character_templates
  bull: "\u2022",
  nbhyph: "\u2011",
  "non-breaking hyphen": "\u2011",
  hyphen: "-",
  endash: "\u2013",
  emdash: "\u2014",
  times: "\xD7",
  deg: "\xB0",
  degree: "\xB0",
  prime: "\u2032",
  dprime: "\u2033",
  minus: "\u2212",
  "\u2212": "\u2212",
  "\xB1": "\xB1",
  pm: "\xB1",
  "sup minus": "\u207B",
  divide: "\xF7",
  div: "\xF7",
  approx: "\u2248",
  "\u2248": "\u2248",
  infinity: "\u221E",
  infin: "\u221E",
  rarr: "\u2192",
  larr: "\u2190",
  harr: "\u2194",
  uarr: "\u2191",
  darr: "\u2193",
  rightarrow: "\u2192",
  leftarrow: "\u2190",
  "\u2192": "\u2192",
  "\u2190": "\u2190",
  "\u2194": "\u2194",
  checkmark: "\u2713",
  "'s": "'s",
  "'\"": `'"`,
  "\"'": `"'`,
  '-"': '"',
  "-'": "'"
};

const positions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const inline$1 = (position, wiki, _parse, opts) => {
  const args = parseArguments$2(wiki, positions, opts);
  return { data: null, replacement: args[String(position)]?.wiki || "" };
};

let templates$d = {
  p1: 0,
  p2: 1,
  p3: 2,
  lang: 1,
  "rtl-lang": 1,
  "line-height": 1,
  bgcolor: 1,
  // {{bgcolor|red|text}}
  script: 1,
  // {{script|Arab|text}}
  "hover title": 1,
  // {{hover title|tooltip|text}}
  l: 2,
  h: 1,
  //https://en.wikipedia.org/wiki/'Hover_title',
  sort: 1,
  //https://en.wikipedia.org/wiki/'Sort',
  color: 1,
  "background color": 1
};
let zeros = [
  "nastaliq",
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
  "taste",
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
  "pre",
  "var",
  "mvar",
  "pre2",
  "code",
  "char",
  "symb",
  "dabsearch",
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
  "subst:nfa",
  // --- inline formatting wrappers that keep their text
  "em",
  "strong",
  "sc",
  "smallcaps",
  "smallcaps all",
  "smallcaps2",
  "s",
  "strike",
  "del",
  "u",
  "ul",
  "tiny",
  "serif",
  "sans-serif",
  "avoid wrap",
  "wrap",
  "nowraplinks",
  "nobreak",
  "no wiki",
  "strip",
  "keyboard",
  "button",
  "varserif",
  "tqq",
  "tq2",
  "poem",
  "tqi",
  "tqb",
  "tq3",
  "noredlink",
  "script/arabic",
  "script/hebrew",
  "script/nastaliq",
  "script/cyrillic",
  "script/greek",
  "script/thai",
  "hanja",
  "hangul",
  "hebrew",
  "arabic",
  "cuneiform",
  // inline-cleanup spans wrap article prose
  "citation needed span",
  "clarify span",
  "dubious span",
  "copyedit span",
  "who span",
  "when span",
  // https://en.wikipedia.org/wiki/Template:Not_a_typo
  "typo",
  "not typo",
  "proper name",
  "as written",
  "intentionally",
  "visible anchor"
];
zeros.forEach((k) => {
  templates$d[k] = 0;
});
const plain = /* @__PURE__ */ new Set(["nowiki", "nowiki2", "unstrip", "unstripnowiki", "plain text", "make code", "killmarkers"]);
const handlers = Object.fromEntries(Object.entries(templates$d).map(([name, position]) => {
  if (plain.has(name)) {
    return [name, position];
  }
  return [name, inline$1.bind(null, position)];
}));

const simplifyArguments = (args) => {
  const result = {};
  const keys = Object.keys(args);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (key === "template") {
      result[key] = args[key];
    } else if (key === "list") {
      result[key] = args[key].map((block) => block.text);
    } else {
      result[key] = args[key].text;
    }
  }
  return result;
};

const parseTextArguments = (wiki, order = [], opts) => {
  return simplifyArguments(parseArguments$2(wiki, order, opts));
};

let templates$c = {};
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
  "usav"
];
arr.forEach((word) => {
  templates$c[word] = (tmpl, parse = parseTextArguments) => {
    let { name, id } = parse(tmpl, ["name", "id"]);
    return { data: null, replacement: id ? `[[${word.toUpperCase()} ${name} (${id})]]` : `[[${word.toUpperCase()} ${name}]]` };
  };
});
let links = ["no redirect", "tl-r", "template link no redirect", "redirect?", "auto link", "bl"];
links.forEach((word) => {
  templates$c[word] = (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["page", "text"]);
    if (data.text && data.text !== data.page) {
      return { data: null, replacement: `[[${data.page}|${data.text}]]` };
    }
    return { data: null, replacement: `[[${data.page}]]` };
  };
});

const shift = (value, places) => {
  const [digits, exponent = "0"] = String(value).split("e");
  return Number(`${digits}e${Number(exponent) + places}`);
};
const roundNumber = (value, decimals, round) => {
  const number = Number(value);
  const places = Number(decimals || 0);
  if (!Number.isFinite(number) || !Number.isInteger(places)) {
    return "";
  }
  const shifted = shift(number, places);
  if (!Number.isFinite(shifted)) {
    return String(number);
  }
  return String(shift(round(shifted), -places));
};

const percentage = function(obj) {
  if (!obj.numerator && !obj.denominator) {
    return null;
  }
  let perc = Number(obj.numerator) / Number(obj.denominator);
  perc *= 100;
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

const units = {
  // length
  km: { to: "mi", factor: 0.621371192 },
  mi: { to: "km", factor: 1.609344 },
  m: { to: "ft", factor: 3.2808399 },
  ft: { to: "m", factor: 0.3048 },
  cm: { to: "in", factor: 0.393700787 },
  mm: { to: "in", factor: 0.0393700787 },
  in: { to: "mm", factor: 25.4 },
  yd: { to: "m", factor: 0.9144 },
  nmi: { to: "km", factor: 1.852 },
  // area
  km2: { to: "sqmi", factor: 0.386102159 },
  sqmi: { to: "km2", factor: 2.58998811 },
  m2: { to: "sqft", factor: 10.7639104 },
  sqft: { to: "m2", factor: 0.09290304 },
  ha: { to: "acres", factor: 2.47105381 },
  acre: { to: "ha", factor: 0.404685642 },
  acres: { to: "ha", factor: 0.404685642 },
  // mass
  kg: { to: "lb", factor: 2.20462262 },
  lb: { to: "kg", factor: 0.45359237 },
  g: { to: "oz", factor: 0.0352739619 },
  oz: { to: "g", factor: 28.3495231 },
  t: { to: "LT", factor: 0.984206528 },
  // volume
  l: { to: "impgal", factor: 0.219969157 },
  ml: { to: "impoz", factor: 0.0351950652 },
  // speed
  "km/h": { to: "mph", factor: 0.621371192 },
  mph: { to: "km/h", factor: 1.609344 },
  "m/s": { to: "ft/s", factor: 3.2808399 },
  kn: { to: "km/h", factor: 1.852 }
};
const symbols = {
  km2: "km\xB2",
  m2: "m\xB2",
  sqmi: "sq mi",
  sqft: "sq ft",
  l: "L",
  impgal: "imp gal",
  impoz: "imp fl oz",
  LT: "long tons",
  C: "\xB0C",
  F: "\xB0F",
  K: "K",
  "C-change": "\xB0C",
  "F-change": "\xB0F"
};

const shortYear = (year, after) => {
  if (Math.floor(year / 100) === Math.floor(after / 100)) {
    return String(after).slice(-2);
  }
  return String(after);
};
const superscript$1 = (str = "") => {
  const sup = { "0": "\u2070", "1": "\xB9", "2": "\xB2", "3": "\xB3", "4": "\u2074", "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079", "-": "\u207B", "+": "\u207A" };
  return String(str).split("").map((c) => sup[c] || c).join("");
};
const unitSymbol = (unit = "") => symbols[unit] || unit;
const sigFigs = (str = "") => {
  let digits = str.replace(/[^0-9.]/g, "").replace(/^0+/, "");
  if (!digits.includes(".")) {
    while (digits.endsWith("0")) {
      digits = digits.slice(0, -1);
    }
  }
  return Math.max(2, digits.replace(".", "").length);
};
const fmtNumber$1 = (n, sig) => {
  if (!Number.isFinite(n)) {
    return "";
  }
  let str = n.toPrecision(sig);
  if (/e/.test(str)) {
    return Number(str).toLocaleString("en-US");
  }
  return str.replace(/\.$/, "");
};
const convertUnits = (value, from, to, opts = {}) => {
  let n = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(n)) {
    return null;
  }
  let sig = sigFigs(value);
  let format = (out) => fmtNumber$1(out, Number(opts.sigfig) || sig);
  if (opts.precision !== void 0 && /^-?\d+$/.test(opts.precision)) {
    let places = Number(opts.precision);
    format = (out) => {
      let rounded = Math.round(out / Math.pow(10, -places)) * Math.pow(10, -places);
      return places > 0 ? rounded.toFixed(places) : rounded.toLocaleString("en-US");
    };
  }
  const temps = { C: ["F", (x) => x * 9 / 5 + 32], F: ["C", (x) => (x - 32) * 5 / 9], K: ["C", (x) => x - 273.15] };
  if (Object.hasOwn(temps, from)) {
    let [def, fn] = temps[from];
    to ||= def;
    if (to === "C" && from === "C") {
      return null;
    }
    let out = fn(n);
    if (from === "C" && to === "K") {
      out = n + 273.15;
    } else if (to !== def) {
      return null;
    }
    return `${format(out)} ${unitSymbol(to)}`;
  }
  let unit = units[from] || units[from.toLowerCase()];
  if (!unit) {
    return null;
  }
  to ||= unit.to;
  let factor = unit.factor;
  if (to !== unit.to) {
    let other = units[to] || units[to.toLowerCase()];
    if (other && other.to === from) {
      factor = 1 / other.factor;
    } else {
      return null;
    }
  }
  return `${format(n * factor)} ${unitSymbol(to)}`;
};
var functions = {
  transliteration: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["1", "2", "3"]);
    return { data: null, replacement: obj["3"] ?? obj["2"] ?? "" };
  },
  //https://en.wikipedia.org/wiki/Template:Ra
  // {{RA|5|35|17.3}} → 5h 35m 17.3s
  ra: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["hours", "minutes", "seconds"]);
    let str = `${obj.hours || 0}h`;
    if (obj.minutes !== void 0) {
      str += ` ${obj.minutes}m`;
    }
    if (obj.seconds !== void 0) {
      str += ` ${obj.seconds}s`;
    }
    return { data: null, replacement: str };
  },
  //https://en.wikipedia.org/wiki/Template:Deg2HMS
  // {{Deg2HMS|83.82}} → 05h 35m 16.8s
  deg2hms: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["degrees", "sup"]);
    let deg = Number(obj.degrees);
    if (!Number.isFinite(deg)) {
      return { data: null, replacement: (obj.degrees || "") + "\xB0" };
    }
    let total = (deg % 360 + 360) % 360 / 15;
    let h = Math.floor(total);
    let m = Math.floor((total - h) * 60);
    let sec = ((total - h) * 60 - m) * 60;
    let str = `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${sec.toFixed(1).padStart(4, "0")}s`;
    return { data: null, replacement: str };
  },
  //https://en.wikipedia.org/wiki/Template:HMS2deg
  // {{HMS2deg|5|35|17.3}} → 83.822083
  hms2deg: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["hours", "minutes", "seconds", "precision"]);
    let h = Number(obj.hours) || 0;
    let m = Number(obj.minutes) || 0;
    let sec = Number(obj.seconds) || 0;
    let deg = (h + m / 60 + sec / 3600) * 15;
    let precision = Number(obj.precision);
    if (!Number.isFinite(precision)) {
      precision = 6;
    }
    return { data: null, replacement: String(Number(deg.toFixed(precision))) };
  },
  //https://en.wikipedia.org/wiki/Template:Decdeg
  // {{Decdeg|52|31|7|N}} → 52.518611
  decdeg: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["deg", "min", "sec", "hem", "rnd"]);
    let deg = Number(obj.deg ?? obj.degrees);
    if (!Number.isFinite(deg)) {
      return { data: null, replacement: (obj.deg || obj.degrees || "") + "\xB0" };
    }
    let sign = deg < 0 ? -1 : 1;
    let num = Math.abs(deg) + (Number(obj.min) || 0) / 60 + (Number(obj.sec) || 0) / 3600;
    num *= sign;
    if (/^[sw]$/i.test(obj.hem || "")) {
      num *= -1;
    }
    let rnd = Number(obj.rnd);
    if (!Number.isFinite(rnd)) {
      rnd = 6;
    }
    return { data: null, replacement: String(Number(num.toFixed(rnd))) };
  },
  //https://en.wikipedia.org/wiki/Template:Sortname
  sortname: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["first", "last", "target", "sort"]);
    let name = `${obj.first || ""} ${obj.last || ""}`;
    name = name.trim();
    if (obj.nolink) {
      return { data: null, replacement: obj.target || name };
    }
    if (obj.dab) {
      name += ` (${obj.dab})`;
      if (obj.target) {
        obj.target += ` (${obj.dab})`;
      }
    }
    if (obj.target) {
      return { data: null, replacement: `[[${obj.target}|${name}]]` };
    }
    return { data: null, replacement: `[[${name}]]` };
  },
  // https://en.wikipedia.org/wiki/Template:First_word
  "first word": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["text"]);
    let str = obj.text || "";
    if (obj.sep) {
      return { data: null, replacement: str.split(obj.sep)[0] };
    }
    return { data: null, replacement: str.split(" ")[0] };
  },
  trunc: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["str", "len"]);
    return { data: null, replacement: (obj.str || "").substr(0, obj.len) };
  },
  "str mid": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["str", "start", "end"]) || {};
    let start = parseInt(obj.start, 10) - 1;
    let end = parseInt(obj.end, 10);
    return { data: null, replacement: (obj.str || "").substr(start, end) };
  },
  // https://en.wikipedia.org/wiki/Template:Reign
  // {{reign|1901|1910}} → r. 1901–1910
  reign: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["start", "end"]);
    let start = obj.start || "";
    let end = obj.end || "";
    let dash = / /.test(start) || / /.test(end) ? " \u2013 " : "\u2013";
    return { data: null, replacement: `r. ${start}${dash}${end}`.trim() };
  },
  // https://en.wikipedia.org/wiki/Template:Circa
  // {{circa|1901}} → c. 1901, {{circa|1901|1910}} → c. 1901 – c. 1910
  circa: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["start", "end"]);
    if (!obj.start && obj.start !== 0) {
      return { data: null, replacement: "c. " };
    }
    let str = `c. ${obj.start}`;
    if (obj.end) {
      str += ` \u2013 c. ${obj.end}`;
    }
    return { data: null, replacement: str };
  },
  // https://en.wikipedia.org/wiki/Template:Key_press
  // {{key press|Ctrl|C}} → Ctrl+C
  "key press": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    let arr = (obj.list || []).filter((s) => s);
    return { data: null, replacement: arr.join(obj.chain || "+") };
  },
  // https://en.wikipedia.org/wiki/Template:Rnd
  // {{rnd|3.14159|2}} → 3.14
  rnd: (tmpl, parse = parseTextArguments) => {
    const data = parse(tmpl, ["val", "decimals"]);
    if (data.decimals === void 0) {
      return { data: null, replacement: data.val || "" };
    }
    return { data: null, replacement: roundNumber(data.val, data.decimals, Math.round) || data.val || "" };
  },
  // https://en.wikipedia.org/wiki/Template:Abs
  // {{abs|x}} → |x|
  abs: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    return { data: null, replacement: `&#124;${data.text || ""}&#124;` };
  },
  // https://en.wikipedia.org/wiki/Template:Decade_link
  "decade link": (tmpl, parse = parseTextArguments) => {
    let { year } = parse(tmpl, ["year"]);
    return { data: null, replacement: `${year}|${year}s` };
  },
  // https://en.wikipedia.org/wiki/Template:Decade
  decade: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["year"]);
    let year = Number(obj.year);
    year = Math.floor(year / 10) * 10;
    return { data: null, replacement: `${year}s` };
  },
  // https://en.wikipedia.org/wiki/Template:Century
  century: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["year"]);
    let year = parseInt(obj.year, 10);
    year = Math.floor(year / 100) + 1;
    return { data: null, replacement: `${year}` };
  },
  //https://en.wikipedia.org/wiki/Template:Radic
  radic: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["after", "before"]);
    return { data: null, replacement: `${obj.before || ""}\u221A${obj.after || ""}` };
  },
  "medical cases chart/row": (tmpl) => {
    return { data: null, replacement: tmpl };
  },
  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["date", "year"]);
    return { data: null, replacement: obj.year ? obj.date + " " + obj.year : obj.date };
  },
  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["text"]);
    let attrs = "";
    if (obj.list) {
      attrs = "|" + obj.list.join("|");
    }
    return { data: null, replacement: "{{" + (obj.text || "") + attrs + "}}" };
  },
  hlist: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    obj.list ||= [];
    return { data: null, replacement: obj.list.join(" \xB7 ") };
  },
  pagelist: (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    return { data: null, replacement: arr.join(", ") };
  },
  // not perfect - https://en.m.wikipedia.org/wiki/Template:Interlinear
  interlinear: (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    return { data: null, replacement: arr.join("\n\n") };
  },
  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  catlist: (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    return { data: null, replacement: arr.join(", ") };
  },
  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  "br separated entries": (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    return { data: null, replacement: arr.join("\n\n") };
  },
  "comma separated entries": (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    return { data: null, replacement: arr.join(", ") };
  },
  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  "anchored list": (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    arr = arr.map((str, i) => `${i + 1}. ${str}`);
    return { data: null, replacement: arr.join("\n\n") };
  },
  "bulleted list": (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    arr = arr.filter((f) => f);
    arr = arr.map((str) => "\u2022 " + str);
    return { data: null, replacement: arr.join("\n\n") };
  },
  //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: (tmpl) => {
    tmpl = strip(tmpl);
    let arr = tmpl.split("|").slice(1);
    arr = arr.join("|").split(/\n ?\* ?/);
    arr = arr.filter((s) => s);
    return { data: null, replacement: arr.join("\n\n") };
  },
  //https://en.wikipedia.org/wiki/Template:Term
  term: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["term"]);
    return { data: null, replacement: `${obj.term}:` };
  },
  linum: (tmpl, parse = parseTextArguments) => {
    let { num, text } = parse(tmpl, ["num", "text"]);
    return { data: null, replacement: `${num}. ${text}` };
  },
  "block indent": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    if (obj["1"]) {
      return { data: null, replacement: "\n" + obj["1"] + "\n" };
    }
    return { data: null, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["text"]);
    return { data: null, replacement: `[[${obj.text} Lifeboat Station|${obj.text}]]` };
  },
  //Foo-class
  lbc: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["text"]);
    return { data: null, replacement: `[[${obj.text}-class lifeboat|${obj.text}-class]]` };
  },
  lbb: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["text"]);
    return { data: null, replacement: `[[${obj.text}-class lifeboat|${obj.text}]]` };
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  "#dateformat": (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/:/, "|");
    let obj = parse(tmpl, ["date", "format"]);
    return { data: null, replacement: obj.date };
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  lc: (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/:/, "|");
    let obj = parse(tmpl, ["text"]);
    return { data: null, replacement: (obj.text || "").toLowerCase() };
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  uc: (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/:/, "|");
    let obj = parse(tmpl, ["text"]);
    return { data: null, replacement: (obj.text || "").toUpperCase() };
  },
  lcfirst: (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/:/, "|");
    let text = parse(tmpl, ["text"]).text;
    if (!text) {
      return { data: null, replacement: "" };
    }
    return { data: null, replacement: text[0].toLowerCase() + text.substr(1) };
  },
  ucfirst: (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/:/, "|");
    let text = parse(tmpl, ["text"]).text;
    if (!text) {
      return { data: null, replacement: "" };
    }
    return { data: null, replacement: text[0].toUpperCase() + text.substr(1) };
  },
  padleft: (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/:/, "|");
    let obj = parse(tmpl, ["text", "num", "str"]);
    let text = obj.text || "";
    return { data: null, replacement: text.padStart(Number(obj.num) || 0, obj.str || "0") };
  },
  padright: (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/:/, "|");
    let obj = parse(tmpl, ["text", "num", "str"]);
    let text = obj.text || "";
    return { data: null, replacement: text.padEnd(Number(obj.num) || 0, obj.str || "0") };
  },
  //https://en.wikipedia.org/wiki/Template:Abbrlink
  abbrlink: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["abbr", "page"]);
    if (obj.page) {
      return { data: null, replacement: `[[${obj.page}|${obj.abbr}]]` };
    }
    return { data: null, replacement: `[[${obj.abbr}]]` };
  },
  // https://en.wikipedia.org/wiki/Template:Own
  own: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["author"]);
    let str = "Own work";
    if (obj.author) {
      str += " by " + obj.author;
    }
    return { data: null, replacement: str };
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  formatnum: (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/:/, "|");
    let obj = parse(tmpl, ["number"]);
    let str = obj.number || "";
    str = str.replace(/,/g, "");
    let num = Number(str);
    return { data: null, replacement: num.toLocaleString() || "" };
  },
  //https://en.wikipedia.org/wiki/Template:Frac
  fraction: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["a", "b", "c"]);
    if (obj.c) {
      return { data: null, replacement: `${obj.a} ${obj.b}/${obj.c}` };
    }
    if (obj.b) {
      return { data: null, replacement: `${obj.a}/${obj.b}` };
    }
    return { data: null, replacement: `1/${obj.a}` };
  },
  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["num", "two", "three", "four"]);
    if (obj.two === "-" || obj.two === "to" || obj.two === "and") {
      if (obj.four) {
        return { data: null, replacement: `${obj.num} ${obj.two} ${obj.three} ${unitSymbol(obj.four)}` };
      }
      return { data: null, replacement: `${obj.num} ${obj.two} ${unitSymbol(obj.three)}` };
    }
    if (obj.three && /^[0-9.]+$/.test(obj.three) && obj.four && /^[a-z]+$/i.test(obj.four)) {
      return { data: null, replacement: `${obj.num} ${unitSymbol(obj.two)} ${obj.three} ${unitSymbol(obj.four)}` };
    }
    let str = `${obj.num} ${unitSymbol(obj.two)}`;
    let converted = convertUnits(obj.num || "", obj.two || "", obj.three, { precision: obj.four, sigfig: obj.sigfig });
    if (converted && obj.disp !== "output only" && obj.disp !== "number") {
      str += ` (${converted})`;
    } else if (converted && obj.disp === "output only") {
      str = converted;
    }
    return { data: null, replacement: str };
  },
  // Large number of aliases - https://en.wikipedia.org/wiki/Template:Tl
  tl: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["first", "second"]);
    return { data: null, replacement: obj.second || obj.first };
  },
  //this one's a little different
  won: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    return { data: null, replacement: data.place || data.text || titlecase(data.template) };
  },
  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["tag", "open"]);
    const ignore = {
      span: true,
      div: true,
      p: true
    };
    if (!obj.open || obj.open === "pair") {
      if (ignore[obj.tag]) {
        return { data: null, replacement: obj.content || "" };
      }
      return { data: null, replacement: `<${obj.tag} ${obj.attribs || ""}>${obj.content || ""}</${obj.tag}>` };
    }
    return { data: null, replacement: "" };
  },
  //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
  plural: (tmpl, parse = parseTextArguments) => {
    if (/^\{\{\s*plural\s*:/i.test(tmpl)) {
      tmpl = tmpl.replace(/plural\s*:/i, "plural|");
      let obj2 = parse(tmpl, ["num", "singular", "plural"]);
      let n = Number(String(obj2.num || "").replace(/,/g, ""));
      if (Math.abs(n) === 1) {
        return { data: null, replacement: obj2.singular || "" };
      }
      return { data: null, replacement: obj2.plural ?? obj2.singular ?? "" };
    }
    let obj = parse(tmpl, ["num", "word"]);
    let num = Number(obj.num);
    let word = obj.word;
    if (num !== 1) {
      if (/.y$/.test(word)) {
        word = word.replace(/y$/, "ies");
      } else {
        word += "s";
      }
    }
    return { data: null, replacement: num + " " + word };
  },
  //https://en.wikipedia.org/wiki/Template:DEC
  dec: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["degrees", "minutes", "seconds"]);
    let str = (obj.degrees || 0) + "\xB0";
    if (obj.minutes) {
      str += obj.minutes + `\u2032`;
    }
    if (obj.seconds) {
      str += obj.seconds + "\u2033";
    }
    return { data: null, replacement: str };
  },
  //https://en.wikipedia.org/wiki/Template:Val
  val: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["number", "uncertainty"]);
    let num = obj.number;
    if (num && Number(num)) {
      num = Number(num).toLocaleString();
    }
    let str = num || "";
    if (obj.uncertainty) {
      str += `\xB1${obj.uncertainty}`;
    }
    if (obj.e) {
      str += `\xD710${superscript$1(obj.e)}`;
    }
    if (obj.p) {
      str = obj.p + str;
    }
    if (obj.s) {
      str = obj.s + str;
    }
    if (obj.u || obj.ul || obj.upl) {
      str = str + " " + (obj.u || obj.ul || obj.upl);
    }
    return { data: null, replacement: str };
  },
  //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
  percentage: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["numerator", "denominator", "decimals"]);
    let num = Number(obj.numerator) / Number(obj.denominator);
    num *= 100;
    if (isNaN(num)) {
      return { data: null, replacement: "" };
    }
    let dec = Number(obj.decimals) || 0;
    return { data: null, replacement: `${num.toFixed(dec)}%` };
  },
  // this one is re-used by i18n
  small: (tmpl, _parse = parseTextArguments, opts) => {
    let obj = parseArguments$2(tmpl, [], opts);
    if (obj.list && obj.list[0]) {
      return { data: null, replacement: obj.list[0].wiki };
    }
    return { data: null, replacement: "" };
  },
  // {{Percent-done|done=N|total=N|digits=N}}
  "percent-done": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["done", "total", "digits"]);
    let num = percentage({
      numerator: obj.done,
      denominator: obj.total,
      decimals: obj.digits
    });
    if (num === null) {
      return { data: null, replacement: "" };
    }
    return { data: null, replacement: `${obj.done} (${num}%) done` };
  },
  loop: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["times", "text"]);
    let n = Number(data.times) || 0;
    let out = "";
    for (let i = 0; i < n; i += 1) {
      out += data.text || "";
    }
    return { data: null, replacement: out };
  },
  "str len": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    return { data: null, replacement: String((data.text || "").trim().length) };
  },
  digits: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    return { data: null, replacement: (data.text || "").replace(/[^0-9]/g, "") };
  },
  resize: (tmpl, _parse = parseTextArguments, opts) => {
    const { n, text } = parseArguments$2(tmpl, ["n", "text"], opts);
    return { data: null, replacement: text?.wiki || n?.wiki || "" };
  },
  "last word": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    let arr = (data.text || "").split(/ /g);
    return { data: null, replacement: arr.at(-1) || "" };
  },
  // https://en.wikipedia.org/wiki/Template:Replace - replaces every occurrence
  replace: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text", "from", "to"]);
    if (!data.from) {
      return { data: null, replacement: data.text || "" };
    }
    let to = data.to || (/\|\s+\}\}$/.test(tmpl) ? " " : "");
    return { data: null, replacement: (data.text || "").split(data.from).join(to) };
  },
  // https://en.wikipedia.org/wiki/Template:Str_rep - replaces only the first occurrence
  "str rep": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text", "from", "to"]);
    if (!data.from) {
      return { data: null, replacement: data.text || "" };
    }
    return { data: null, replacement: (data.text || "").replace(data.from, data.to || "") };
  },
  // https://en.wikipedia.org/wiki/Template:Delink - [[a|b]] → b
  delink: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    let str = data.text || "";
    str = str.replace(/\[\[([^\][]*)\]\]/g, (_m, inner) => inner.split("|").pop());
    return { data: null, replacement: str };
  },
  "title case": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    let txt = data.text || "";
    return {
      data: null,
      replacement: txt.split(/ /).map((w, i) => {
        if (i > 0 && w === "the" || w === "of") {
          return w;
        }
        return titlecase(w);
      }).join(" ")
    };
  },
  "no spam": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["account", "domain"]);
    return { data: null, replacement: `${data.account || ""}@${data.domain}` };
  },
  "baseball year": (tmpl, parse = parseTextArguments) => {
    let year = parse(tmpl, ["year"]).year || "";
    return { data: null, replacement: `[[${year} in baseball|${year}]]` };
  },
  "mlb year": (tmpl, parse = parseTextArguments) => {
    let year = parse(tmpl, ["year"]).year || "";
    return { data: null, replacement: `[[${year} Major League Baseball season|${year}]]` };
  },
  "nlds year": (tmpl, parse = parseTextArguments) => {
    let { year } = parse(tmpl, ["year"]);
    return { data: null, replacement: `[[${year || ""} National League Division Series|${year}]]` };
  },
  "alds year": (tmpl, parse = parseTextArguments) => {
    let { year } = parse(tmpl, ["year"]);
    return { data: null, replacement: `[[${year || ""} American League Division Series|${year}]]` };
  },
  "nfl year": (tmpl, parse = parseTextArguments) => {
    let { year, other } = parse(tmpl, ["year", "other"]);
    if (other && year) {
      return { data: null, replacement: `[[${year} NFL season|${year}]]\u2013[[${other} NFL season|${other}]]` };
    }
    return { data: null, replacement: `[[${year || ""} NFL season|${year}]]` };
  },
  "nfl playoff year": (tmpl, parse = parseTextArguments) => {
    let { year } = parse(tmpl, ["year"]);
    year = Number(year);
    let after = year + 1;
    return { data: null, replacement: `[[${year}\u2013${after} NFL playoffs|${year}]]` };
  },
  // {{nba year|2001}} → 2001–02
  "nba year": (tmpl, parse = parseTextArguments) => {
    let { year } = parse(tmpl, ["year"]);
    year = Number(year);
    let after = year + 1;
    return { data: null, replacement: `[[${year}\u2013${after} NBA season|${year}\u2013${shortYear(year, after)}]]` };
  },
  "mhl year": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["year"]);
    let year = Number(data.year);
    let after = year + 1;
    return { data: null, replacement: `[[${year}\u2013${after} NHL season|${year}\u2013${shortYear(year, after)}]]` };
  },
  // some math
  min: (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    let min = Number(arr[0]) || 0;
    arr.forEach((str) => {
      let n = Number(str);
      if (!isNaN(n) && n < min) {
        min = n;
      }
    });
    return { data: null, replacement: String(min) };
  },
  max: (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    let max = Number(arr[0]) || 0;
    arr.forEach((str) => {
      let n = Number(str);
      if (!isNaN(n) && n > max) {
        max = n;
      }
    });
    return { data: null, replacement: String(max) };
  },
  // US-politics
  uspolabbr: (tmpl, parse = parseTextArguments) => {
    let { party, state, house } = parse(tmpl, ["party", "state", "house", "link"]);
    if (!party || !state) {
      return { data: null, replacement: "" };
    }
    let out = `${party}\u2011${state}`;
    if (house) {
      out += ` ${toOrdinal(house)}`;
    }
    return { data: null, replacement: out };
  },
  // https://en.wikipedia.org/wiki/Template:Ushr
  ushr: (tmpl, parse = parseTextArguments) => {
    let { state, num, type } = parse(tmpl, ["state", "num", "type"]);
    let link = "";
    if (num === "AL") {
      link = `${state}'s at-large congressional district`;
    } else {
      num = toOrdinal(Number(num));
      return { data: null, replacement: `${state}'s ${num} congressional district` };
    }
    if (type) {
      type = type.toLowerCase();
      num = num === "AL" ? "At-large" : num;
      if (type === "e") {
        return { data: null, replacement: `[[${link}|${num}]]` };
      }
      if (type === "u") {
        return { data: null, replacement: `[[${link}|${state}]]` };
      }
      if (type === "b" || type === "x") {
        return { data: null, replacement: `[[${link}|${state} ${num}]]` };
      }
    }
    return { data: null, replacement: `[[${link}]]` };
  },
  // transit station links
  metro: (tmpl, parse = parseTextArguments) => {
    let { name, dab } = parse(tmpl, ["name", "dab"]);
    if (dab) {
      return { data: null, replacement: `[[${name} station (${dab})|${name}]]` };
    }
    return { data: null, replacement: `[[${name} station|${name}]]` };
  },
  station: (tmpl, parse = parseTextArguments) => {
    let { name, dab } = parse(tmpl, ["name", "x", "dab"]);
    if (dab) {
      return { data: null, replacement: `[[${name} station (${dab})|${name}]]` };
    }
    return { data: null, replacement: `[[${name} station|${name}]]` };
  },
  bssrws: (tmpl, parse = parseTextArguments) => {
    let { one, two } = parse(tmpl, ["one", "two"]);
    let name = one;
    if (two) {
      name += " " + two;
    }
    return { data: null, replacement: `[[${name} railway station|${name}]]` };
  },
  stnlnk: (tmpl, parse = parseTextArguments) => {
    let { name, dab } = parse(tmpl, ["name", "dab"]);
    if (dab) {
      return { data: null, replacement: `[[${name} railway station (${dab})|${name}]]` };
    }
    return { data: null, replacement: `[[${name} railway station|${name}]]` };
  },
  // https://en.wikipedia.org/wiki/Template:Station_link
  "station link": (tmpl, parse = parseTextArguments) => {
    let { station, system } = parse(tmpl, ["system", "station"]);
    return { data: null, replacement: station || system };
  },
  "line link": (tmpl, parse = parseTextArguments) => {
    let { station, system } = parse(tmpl, ["system", "station"]);
    return { data: null, replacement: station || system };
  },
  subway: (tmpl, parse = parseTextArguments) => {
    let { name } = parse(tmpl, ["name"]);
    return { data: null, replacement: `[[${name} subway station|${name}]]` };
  },
  "lrt station": (tmpl, parse = parseTextArguments) => {
    let { name } = parse(tmpl, ["name"]);
    return { data: null, replacement: `[[${name} LRT station|${name}]]` };
  },
  "mrt station": (tmpl, parse = parseTextArguments) => {
    let { name } = parse(tmpl, ["name"]);
    return { data: null, replacement: `[[${name} MRT station|${name}]]` };
  },
  rht: (tmpl, parse = parseTextArguments) => {
    let { name } = parse(tmpl, ["name"]);
    return { data: null, replacement: `[[${name} railway halt|${name}]]` };
  },
  ferry: (tmpl, parse = parseTextArguments) => {
    let { name } = parse(tmpl, ["name"]);
    return { data: null, replacement: `[[${name} ferry wharf|${name}]]` };
  },
  tram: (tmpl, parse = parseTextArguments) => {
    let { name, dab } = parse(tmpl, ["name", "dab"]);
    if (dab) {
      return { data: null, replacement: `[[${name} tram stop (${dab})|${name}]]` };
    }
    return { data: null, replacement: `[[${name} tram stop|${name}]]` };
  },
  tstop: (tmpl, parse = parseTextArguments) => {
    let { name, dab } = parse(tmpl, ["name", "dab"]);
    if (dab) {
      return { data: null, replacement: `[[${name} ${dab} stop|${name}]]` };
    }
    return { data: null, replacement: `[[${name} stop|${name}]]` };
  },
  // boats
  ship: (tmpl, parse = parseTextArguments) => {
    let { prefix, name, id } = parse(tmpl, ["prefix", "name", "id"]);
    prefix ||= "";
    return {
      data: null,
      replacement: id ? `[[${prefix.toUpperCase()} ${name}]]` : `[[${prefix.toUpperCase()} ${name}]]`
    };
  },
  sclass: (tmpl, parse = parseTextArguments) => {
    let { cl, type } = parse(tmpl, ["cl", "type", "fmt"]);
    return { data: null, replacement: `[[${cl}-class ${type} |''${cl}''-class]] [[${type}]]` };
  },
  "center block": (tmpl, _parse = parseTextArguments, opts) => {
    const { text } = parseArguments$2(tmpl, ["text"], opts);
    return { data: null, replacement: text?.wiki || "" };
  },
  align: (tmpl, _parse = parseTextArguments, opts) => {
    const { text } = parseArguments$2(tmpl, ["dir", "text"], opts);
    return { data: null, replacement: text?.wiki || "" };
  },
  font: (tmpl, _parse = parseTextArguments, opts) => {
    const { text } = parseArguments$2(tmpl, ["text"], opts);
    return { data: null, replacement: text?.wiki || "" };
  },
  float: (tmpl, _parse = parseTextArguments, opts) => {
    const { text, dir } = parseArguments$2(tmpl, ["dir", "text"], opts);
    return { data: null, replacement: text?.wiki || dir?.wiki || "" };
  },
  lower: (tmpl, _parse = parseTextArguments, opts) => {
    const { text, n } = parseArguments$2(tmpl, ["n", "text"], opts);
    return { data: null, replacement: text?.wiki || n?.wiki || "" };
  },
  splitspan: (tmpl, parse = parseTextArguments) => {
    let list = parse(tmpl).list || [];
    return { data: null, replacement: (list[0] || "") + " " + (list[1] || "") };
  },
  bracket: (tmpl, parse = parseTextArguments) => {
    let { text } = parse(tmpl, ["text"]);
    if (text) {
      return { data: null, replacement: `[${text}]` };
    }
    return { data: null, replacement: "[" };
  },
  // https://en.wikipedia.org/wiki/Template:In_title
  "in title": (tmpl, parse = parseTextArguments) => {
    let { title, text } = parse(tmpl, ["title", "text"]);
    if (text) {
      return { data: null, replacement: text };
    }
    if (title) {
      return { data: null, replacement: `All pages with titles containing ${title}` };
    }
    return { data: null, replacement: "" };
  },
  "look from": (tmpl, parse = parseTextArguments) => {
    let { title, text } = parse(tmpl, ["title", "text"]);
    if (text) {
      return { data: null, replacement: text };
    }
    if (title) {
      return { data: null, replacement: `All pages with titles beginning with ${title}` };
    }
    return { data: null, replacement: "" };
  },
  "literal translation": (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    arr = arr.map((str) => `'${str}'`);
    return { data: null, replacement: "lit. " + arr.join(" or ") };
  },
  overset: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["over", "base"]);
    return { data: null, replacement: [data.over || "", data.base || ""].join(" ") };
  },
  underset: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["under", "base"]);
    return { data: null, replacement: [data.base || "", data.under || ""].join(" ") };
  },
  ceil: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["txt"]);
    return { data: null, replacement: `\u2308${data.txt}\u2309` };
  },
  floor: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["txt"]);
    return { data: null, replacement: `\u230A${data.txt}\u230B` };
  },
  "vol.": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["n"]);
    return { data: null, replacement: `vol. ${data.n}` };
  },
  gaps: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl);
    return { data: null, replacement: (data.list || []).join("  ") };
  },
  bra: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["a"]);
    return { data: null, replacement: `\u27E8${data.a || ""}|` };
  },
  ket: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["a"]);
    return { data: null, replacement: `&#124;${data.a || ""}\u27E9` };
  },
  "angle bracket": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["txt"]);
    return { data: null, replacement: `\u27E8${data.txt || ""}\u27E9` };
  },
  "bra-ket": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["a", "b"]);
    return { data: null, replacement: `\u27E8${data.a || ""}|${data.b || ""}\u27E9` };
  },
  braket: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["sym", "a", "b"]);
    if (data.sym === "bra") {
      return { data: null, replacement: `\u27E8${data.a}|` };
    } else if (data.sym === "ket") {
      return { data: null, replacement: `&#124;${data.a || ""}\u27E9` };
    } else {
      return { data: null, replacement: `\u27E8${data.a || ""}|${data.b || ""}\u27E9` };
    }
  },
  pars: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text", "s"]);
    return { data: null, replacement: `(${data.text || ""})` };
  },
  circumfix: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    return { data: null, replacement: `\u27E9${data.text || ""}\u27E8` };
  },
  fluc: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["val", "type"]);
    let n = Number(data.val);
    if (data["custom label"]) {
      return { data: null, replacement: data["custom label"] };
    }
    if (n > 0) {
      return { data: null, replacement: ` +${n}` };
    } else if (n < 0) {
      return { data: null, replacement: ` ${n}` };
    } else if (n === 0) {
      return { data: null, replacement: ` no change ` };
    }
    return { data: null, replacement: data.val || "" };
  },
  "p.": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["a", "b"]);
    if (data.b) {
      if (parseInt(data.b, 10)) {
        return { data: null, replacement: `pp. ${data.a}\u2013${data.b}` };
      } else {
        return { data: null, replacement: `pp. ${data.a}${data.b}` };
      }
    }
    return { data: null, replacement: `p. ${data.a || ""}` };
  },
  subsup: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["symbol", "subscript", "superscript"]);
    return { data: null, replacement: `${data.symbol || ""} ${data.subscript || ""} ${data.superscript || ""}` };
  },
  su: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["p", "b"]);
    return { data: null, replacement: `${data.p || ""} ${data.b || ""}` };
  },
  precision: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["num"]);
    let num = data.num || "";
    if (!num.includes(".") && num !== "0") {
      let end = num.length;
      while (end > 0 && num[end - 1] === "0") {
        end -= 1;
      }
      return { data: null, replacement: (num.length - end) * -1 };
    }
    let dec = num.split(/\./)[1] || "";
    return { data: null, replacement: dec.length };
  },
  intmath: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["sign", "subscript", "superscript"]);
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
    return { data: null, replacement: `${signs[data.sign] || ""} ${data.superscript || ""} ${data.subscript || ""} ` };
  },
  ldelim: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["a", "b", "sub", "sup"]);
    let after = `${data.sub || ""}${data.sup || ""}`;
    if (data.a === "square") {
      return { data: null, replacement: `[${data.b || ""}]${after}` };
    } else if (data.a === "round") {
      return { data: null, replacement: `(${data.b || ""})${after}` };
    } else if (data.a === "vert") {
      return { data: null, replacement: `|${data.b || ""}|${after}` };
    } else if (data.a === "doublevert") {
      return { data: null, replacement: `||${data.b || ""}||${after}` };
    }
    return { data: null, replacement: `${data.b || ""} ${after}` };
  },
  multiply: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["a", "b"]);
    return { data: null, replacement: Number(data.a) * Number(data.b) };
  },
  sum: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["a", "b"]);
    return { data: null, replacement: Number(data.a) + Number(data.b) };
  },
  round: (tmpl, parse = parseTextArguments) => {
    const data = parse(tmpl, ["val", "decimals"]);
    return { data: null, replacement: roundNumber(data.val, data.decimals, Math.round) };
  },
  rounddown: (tmpl, parse = parseTextArguments) => {
    const data = parse(tmpl, ["val", "decimals"]);
    return { data: null, replacement: roundNumber(data.val, data.decimals, Math.floor) };
  },
  roundup: (tmpl, parse = parseTextArguments) => {
    const data = parse(tmpl, ["val", "decimals"]);
    return { data: null, replacement: roundNumber(data.val, data.decimals, Math.ceil) };
  },
  parity: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["val", "even", "odd"]);
    if (Number(data.val) % 2 === 0) {
      return { data: null, replacement: data.even || "even" };
    }
    return { data: null, replacement: data.odd || "odd" };
  },
  hexadecimal: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["val"]);
    let n = Number(data.val);
    if (!n) {
      return { data: null, replacement: data.val };
    }
    return { data: null, replacement: n.toString(16).toUpperCase() };
  },
  octal: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["val"]);
    let n = Number(data.val);
    if (!n) {
      return { data: null, replacement: data.val };
    }
    return { data: null, replacement: n.toString(8).toUpperCase() + "\u2088" };
  },
  decimal2base: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["n", "radix"]);
    let n = Number(data.n);
    let radix = Number(data.radix);
    if (!n || !radix) {
      return { data: null, replacement: data.n };
    }
    return { data: null, replacement: n.toString(radix).toUpperCase() };
  },
  hex2dec: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["val"]);
    return { data: null, replacement: parseInt(data.val, 16) || data.val };
  },
  ifnotempty: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["cond", "a", "b"]);
    if (data.cond) {
      return { data: null, replacement: data.a };
    }
    return { data: null, replacement: data.b };
  },
  both: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["a", "b"]);
    if (data.a && data.b) {
      return { data: null, replacement: "1" };
    }
    return { data: null, replacement: "" };
  },
  ifnumber: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["n", "yes", "no"]);
    if (!isNaN(Number(data.n))) {
      return { data: null, replacement: data.yes || "1" };
    }
    return { data: null, replacement: data.no || "" };
  },
  "order of magnitude": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["val"]);
    const num = Math.abs(Number(data.val));
    if (!Number.isFinite(num) || num === 0) {
      return { data: null, replacement: "0" };
    }
    return { data: null, replacement: String(Math.floor(Math.log10(num))) };
  },
  "percent and number": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["number", "total", "decimals"]);
    let n = Number(data.number) / Number(data.total);
    n *= 100;
    let dec = Number(data.decimals) || 0;
    return { data: null, replacement: `${n.toFixed(dec)}% (${Number(data.number).toLocaleString()})` };
  },
  music: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["glyph"]);
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
    if (Object.hasOwn(glyphs, data.glyph)) {
      return { data: null, replacement: glyphs[data.glyph] };
    }
    return { data: null, replacement: "" };
  },
  simplenuclide: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["name", "mass"]);
    return { data: null, replacement: `[[${data.name}|${data.mass || ""}${data.name}]]` };
  },
  "font color": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["fg", "bg", "text"]);
    if (data.bg && data.text) {
      return { data: null, replacement: data.text };
    }
    return { data: null, replacement: data.bg };
  },
  "colored link": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["color", "title", "text"]);
    return { data: null, replacement: `[[${data.title}|${data.text || data.title}]]` };
  },
  nftu: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["age", "team"]);
    return { data: null, replacement: `${data.team} U${data.age}` };
  },
  tls: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["name", "one", "two"]);
    let out = `subst:${data.name}`;
    if (data.one) {
      out += "|" + data.one;
    }
    if (data.two) {
      out += "|" + data.two;
    }
    return { data: null, replacement: `{{${out}}}` };
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
  ["born in", "b. "],
  ["died-in", "d. "],
  ["married-in", "m. "]
];
let fns = shorthands.reduce((h, a) => {
  let [name, out] = a;
  h[name] = (tmpl, parse = parseTextArguments) => {
    let { first } = parse(tmpl, ["first"]);
    if (first || first === 0) {
      return { data: null, replacement: out + (first || "") };
    }
    return { data: null, replacement: out };
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
  fns[str] = str;
});

let templates$b = {};
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
  "yao",
  // ISO codes missing from _data/languages
  "fa",
  // Persian
  "sux",
  // Sumerian
  "hbo",
  // Biblical Hebrew
  "syc",
  // Classical Syriac
  "xcl",
  // Classical Armenian
  "pal",
  // Middle Persian
  "peo",
  // Old Persian
  "ave",
  // Avestan
  "pli",
  // Pali
  "wuu",
  // Wu Chinese
  "pnb",
  // Western Punjabi
  "hif",
  // Fiji Hindi
  "mai",
  // Maithili
  "sat"
  // Santali
];
more.forEach((k) => {
  templates$b["lang-" + k] = 0;
});
Object.keys(languages$1).forEach((k) => {
  templates$b["lang-" + k] = 0;
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

const aliases = {
  alg: "dza",
  // Algeria
  ang: "ago",
  // Angola
  ant: "atg",
  // Antigua and Barbuda
  aru: "abw",
  // Aruba
  bah: "bhs",
  // Bahamas
  ban: "bgd",
  // Bangladesh
  bar: "brb",
  // Barbados
  ber: "bmu",
  // Bermuda
  bhu: "btn",
  // Bhutan
  bot: "bwa",
  // Botswana
  bru: "brn",
  // Brunei
  bul: "bgr",
  // Bulgaria
  bur: "bfa",
  // Burkina Faso
  cam: "khm",
  // Cambodia
  cay: "cym",
  // Cayman Islands
  cgo: "cog",
  // Congo
  cha: "tcd",
  // Chad
  chi: "chl",
  // Chile
  crc: "cri",
  // Costa Rica
  cro: "hrv",
  // Croatia
  den: "dnk",
  // Denmark
  esa: "slv",
  // El Salvador
  fij: "fji",
  // Fiji
  gam: "gmb",
  // Gambia
  gbs: "gnb",
  // Guinea-Bissau
  geq: "gnq",
  // Equatorial Guinea
  ger: "deu",
  // Germany
  gre: "grc",
  // Greece
  gua: "gtm",
  // Guatemala
  gui: "gin",
  // Guinea
  hai: "hti",
  // Haiti
  hon: "hnd",
  // Honduras
  ina: "idn",
  // Indonesia
  iri: "irn",
  // Iran
  isv: "vir",
  // US Virgin Islands
  ivb: "vgb",
  // British Virgin Islands
  ksa: "sau",
  // Saudi Arabia
  kuw: "kwt",
  // Kuwait
  lat: "lva",
  // Latvia
  lba: "lby",
  // Libya
  les: "lso",
  // Lesotho
  lib: "lbn",
  // Lebanon
  mad: "mdg",
  // Madagascar
  mas: "mys",
  // Malaysia
  maw: "mwi",
  // Malawi
  mgl: "mng",
  // Mongolia
  mon: "mco",
  // Monaco
  mri: "mus",
  // Mauritius
  mtn: "mrt",
  // Mauritania
  mya: "mmr",
  // Myanmar
  ned: "nld",
  // Netherlands
  nep: "npl",
  // Nepal
  nca: "nic",
  // Nicaragua
  ngr: "nga",
  // Nigeria
  nig: "ner",
  // Niger
  oma: "omn",
  // Oman
  par: "pry",
  // Paraguay
  phi: "phl",
  // Philippines
  ple: "pse",
  // Palestine
  por: "prt",
  // Portugal
  pur: "pri",
  // Puerto Rico
  rsa: "zaf",
  // South Africa
  sam: "wsm",
  // Samoa
  sey: "syc",
  // Seychelles
  sin: "sgp",
  // Singapore
  sle: "sle",
  // Sierra Leone
  slo: "svn",
  // Slovenia
  sol: "slb",
  // Solomon Islands
  sri: "lka",
  // Sri Lanka
  sud: "sdn",
  // Sudan
  sui: "che",
  // Switzerland
  tan: "tza",
  // Tanzania
  tga: "ton",
  // Tonga
  tog: "tgo",
  // Togo
  tpe: "twn",
  // Chinese Taipei
  tri: "tto",
  // Trinidad and Tobago
  uae: "are",
  // United Arab Emirates
  uru: "ury",
  // Uruguay
  van: "vut",
  // Vanuatu
  vie: "vnm",
  // Vietnam
  vin: "vct",
  // Saint Vincent and the Grenadines
  zam: "zmb",
  // Zambia
  zim: "zwe",
  // Zimbabwe
  sco: "sct",
  // Scotland
  // countries that no longer exist, mapped to their successors' flags
  urs: "rus",
  // Soviet Union
  tch: "cze",
  // Czechoslovakia
  frg: "deu",
  // West Germany
  gdr: "deu",
  // East Germany
  yug: "srb"
  // Yugoslavia
};

const order = ["flag", "variant"];
const titleCase = (str = "") => str.replace(/(^|[\s\-(])(\p{L})/gu, (m, pre, ch) => pre + ch.toUpperCase());
const findFlag = (code = "") => {
  code = code.toLowerCase().trim();
  code = aliases[code] || code;
  return flags.find((a) => code === a[1] || code === a[2]);
};
let templates$a = {
  //https://en.wikipedia.org/wiki/Template:Flag
  // {{flag|USA}} →  USA
  flag: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, order);
    let name = obj.flag || "";
    let found = findFlag(obj.flag) || [];
    let flag = found[0] || "";
    return { data: null, replacement: `${flag} [[${found[2]}|${name}]]` };
  },
  // {{flagcountry|USA}} →  United States
  flagcountry: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, order);
    let found = findFlag(obj.flag);
    if (!found) {
      return { data: null, replacement: obj.flag || "" };
    }
    return { data: null, replacement: `${found[0]} [[${titleCase(found[2])}]]` };
  },
  // (unlinked flag-country)
  flagcu: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, order);
    let found = findFlag(obj.flag);
    if (!found) {
      return { data: null, replacement: obj.flag || "" };
    }
    return { data: null, replacement: `${found[0]} ${titleCase(found[2])}` };
  },
  //https://en.wikipedia.org/wiki/Template:Flagicon
  // {{flagicon|USA}} → United States
  flagicon: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, order);
    let found = findFlag(obj.flag);
    if (!found) {
      return { data: null, replacement: "" };
    }
    return { data: null, replacement: `[[${found[2]}|${found[0]}]]` };
  },
  //unlinked flagicon
  flagdeco: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, order);
    let found = findFlag(obj.flag) || [];
    return { data: null, replacement: found[0] || "" };
  },
  //same, but a soccer team
  fb: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, order);
    let found = findFlag(obj.flag);
    if (!found) {
      return { data: null, replacement: "" };
    }
    return {
      data: null,
      replacement: `${found[0]} [[${titleCase(found[2])} national football team|${titleCase(found[2])}]]`
    };
  },
  fbicon: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, order);
    let found = findFlag(obj.flag);
    if (!found) {
      return { data: null, replacement: "" };
    }
    return { data: null, replacement: ` [[${found[2]} national football team|${found[0]}]]` };
  },
  flagathlete: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["name", "flag", "variant"]);
    let found = findFlag(obj.flag);
    if (!found) {
      return { data: null, replacement: `[[${obj.name || ""}]]` };
    }
    return { data: null, replacement: `${found[0]} [[${obj.name || ""}]] (${found[1].toUpperCase()})` };
  }
};
flags.forEach((a) => {
  if (Object.hasOwn(templates$a, a[1])) {
    return;
  }
  templates$a[a[1]] = () => {
    return { data: null, replacement: a[0] };
  };
});

let templates$9 = {};
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
  "optional",
  "bad",
  "always",
  "never",
  "inactive",
  "withdrawn",
  "in progress",
  "on hold",
  "complete",
  "incomplete",
  "nominated",
  "postponed",
  "cancelled",
  "canceled",
  "ongoing",
  "suspended",
  "retired",
  "defunct"
];
cells.forEach((str) => {
  templates$9[str] = (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    return { data: null, replacement: data.text || titlecase(data.template) };
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
  ["table-yes", "Yes"],
  ["table-no", "No"],
  ["table-maybe", "Maybe"],
  ["sho", "Shortlisted"],
  ["tba", "TBA"],
  ["tbd", "TBD"],
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
  templates$9[a[0]] = (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["text"]);
    return { data: null, replacement: data.text || a[1] };
  };
});

const harvParts = (tmpl, parse) => {
  let obj = parse(tmpl);
  let arr = (obj.list || []).filter((s) => s);
  let year = "";
  if (arr.length > 1 && /^[0-9]{4}[a-z]?$|^n\.d\.$/i.test(arr.at(-1))) {
    year = arr.pop();
  } else if (arr.length > 4) {
    year = arr.pop();
  }
  let authors = "";
  if (arr.length === 1) {
    authors = arr[0];
  } else if (arr.length === 2) {
    authors = `${arr[0]} & ${arr[1]}`;
  } else if (arr.length === 3) {
    authors = `${arr[0]}, ${arr[1]} & ${arr[2]}`;
  } else if (arr.length >= 4) {
    authors = `${arr[0]} et al.`;
  }
  let loc = "";
  if (obj.p) {
    loc = `p. ${obj.p}`;
  } else if (obj.pp) {
    loc = `pp. ${obj.pp}`;
  } else if (obj.loc) {
    loc = obj.loc;
  }
  return { authors, year, loc };
};
const harv = (tmpl, parse = parseTextArguments) => {
  let { authors, year, loc } = harvParts(tmpl, parse);
  let str = [authors, year].filter((s) => s).join(" ");
  if (loc) {
    str += `, ${loc}`;
  }
  return { data: null, replacement: `(${str})` };
};
const harvtxt = (tmpl, parse = parseTextArguments) => {
  let { authors, year, loc } = harvParts(tmpl, parse);
  let inside = [year, loc].filter((s) => s).join(", ");
  let str = authors;
  if (inside) {
    str += ` (${inside})`;
  }
  return { data: null, replacement: str.trim() };
};
const harvnb = (tmpl, parse = parseTextArguments) => {
  let { authors, year, loc } = harvParts(tmpl, parse);
  let str = [authors, year].filter((s) => s).join(" ");
  if (loc) {
    str += `, ${loc}`;
  }
  return { data: null, replacement: str };
};
const sectionLink = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl);
  let arr = obj.list || [];
  let page = (arr[0] || "").trim();
  let sections = arr.slice(1).filter((s) => s);
  if (sections.length === 0) {
    return { data: null, replacement: page };
  }
  let secs = sections.map((s) => `\xA7 ${s}`);
  let str = secs.length > 1 ? secs.slice(0, -1).join(", ") + " and " + secs.at(-1) : secs[0];
  if (page) {
    if (obj.nopage === "y" || obj.nopage === "yes") {
      return { data: null, replacement: str };
    }
    return { data: null, replacement: `[[${page}#${sections[0]}|${page} ${str}]]` };
  }
  return { data: null, replacement: str };
};
const crossreference = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text"]);
  let text = (obj.text || obj.printworthy || "").trim();
  if (!text || /^\(.*\)$/.test(text)) {
    return { data: null, replacement: text };
  }
  return { data: null, replacement: `(${text})` };
};
const nee = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["name"]);
  let word = /^n[ée]$/.test(obj.template || "") ? "n\xE9" : "n\xE9e";
  if (obj.name) {
    return { data: null, replacement: `${word} ${obj.name}` };
  }
  return { data: null, replacement: word };
};
const quotes = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text"]);
  if (obj.text) {
    return { data: null, replacement: `"${obj.text}"` };
  }
  return { data: null, replacement: '"' };
};
const ordinal = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["num"]);
  let n = Number(obj.num);
  if (!Number.isFinite(n)) {
    return { data: null, replacement: obj.num || "" };
  }
  return { data: null, replacement: toOrdinal(n) };
};
const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const spellOut = (n) => {
  if (n < 20) {
    return ones[n];
  }
  if (n < 100) {
    return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "");
  }
  if (n < 1e3) {
    return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + spellOut(n % 100) : "");
  }
  if (n < 1e6) {
    return spellOut(Math.floor(n / 1e3)) + " thousand" + (n % 1e3 ? " " + spellOut(n % 1e3) : "");
  }
  return String(n);
};
const spell = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["num"]);
  let n = Number(obj.num);
  if (!Number.isInteger(n) || n < 0 || n >= 1e6) {
    return { data: null, replacement: obj.num || "" };
  }
  return { data: null, replacement: spellOut(n) };
};
const arrows = { right: "\u2192", left: "\u2190", up: "\u2191", down: "\u2193", "left-right": "\u2194", "up-down": "\u2195", ne: "\u2197", nw: "\u2196", se: "\u2198", sw: "\u2199", r: "\u2192", l: "\u2190", u: "\u2191", d: "\u2193" };
const arrow = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["dir"]);
  return { data: null, replacement: arrows[(obj.dir || "right").toLowerCase()] || "\u2192" };
};
const cslist = (tmpl, parse = parseTextArguments) => {
  let arr = (parse(tmpl).list || []).filter((s) => s);
  return { data: null, replacement: arr.join(", ") };
};
const allcaps = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text"]);
  return { data: null, replacement: (obj.text || "").toUpperCase() };
};
const sentenceCase = (tmpl, parse = parseTextArguments) => {
  let text = (parse(tmpl, ["text"]).text || "").toLowerCase();
  return { data: null, replacement: text.charAt(0).toUpperCase() + text.substring(1) };
};
const trim = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text"]);
  return { data: null, replacement: (obj.text || "").trim() };
};
const nbsp = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["n"]);
  let n = Number(obj.n) || 1;
  return { data: null, replacement: " ".repeat(Math.min(n, 100)) };
};
const wiktLang = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["code", "text", "display"]);
  return { data: null, replacement: obj.display || obj.text || "" };
};
const linktext = (tmpl, parse = parseTextArguments) => {
  let arr = (parse(tmpl).list || []).filter((s) => s);
  return { data: null, replacement: arr.join("") };
};
const tlx = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["name"]);
  return { data: null, replacement: obj.name || "" };
};
var inline = {
  tlx,
  harv,
  harvtxt,
  "harvard citation no brackets": harvnb,
  "section link": sectionLink,
  crossreference,
  nee,
  '"': quotes,
  ordinal,
  spell,
  arrow,
  cslist,
  allcaps,
  "sentence case": sentenceCase,
  trim,
  nbsp,
  "wikt-lang": wiktLang,
  linktext
};

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
      if (Object.hasOwn(monthName, m)) {
        let month = monthName[m];
        obj[units[i]] = month;
      }
    } else {
      delete obj[units[i]];
    }
  }
  let last = arr.at(-1) || "";
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
const toText$1 = function(date) {
  let str = String(date.year || "");
  if (date.month !== void 0 && Object.hasOwn(months$1, date.month) === true) {
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
  if (date.month !== void 0 && Object.hasOwn(months$1, date.month) === true) {
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
const isYes = (val) => /^(y|yes)$/i.test(String(val || "").trim());
const fmt = function(date, obj = {}) {
  if (isYes(obj.df) && !isYes(obj.mf)) {
    return toTextBritish(date);
  }
  return toText$1(date);
};

const rawArgs = (tmpl) => {
  tmpl = strip(tmpl).replace(/^[^:|]*:/, "");
  return pipeSplitter(tmpl);
};
const fns1 = {
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  trunc: Math.trunc,
  ln: Math.log,
  exp: Math.exp,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  not: (n) => n ? 0 : 1
};
const consts = { pi: Math.PI, e: Math.E };
const binary$1 = {
  or: [1, (a, b) => a || b ? 1 : 0],
  and: [2, (a, b) => a && b ? 1 : 0],
  "=": [3, (a, b) => a === b ? 1 : 0],
  "!=": [3, (a, b) => a !== b ? 1 : 0],
  "<>": [3, (a, b) => a !== b ? 1 : 0],
  "<": [3, (a, b) => a < b ? 1 : 0],
  ">": [3, (a, b) => a > b ? 1 : 0],
  "<=": [3, (a, b) => a <= b ? 1 : 0],
  ">=": [3, (a, b) => a >= b ? 1 : 0],
  round: [4, (a, b) => Number(a.toFixed(Math.max(0, Math.min(b, 20))))],
  "+": [5, (a, b) => a + b],
  "-": [5, (a, b) => a - b],
  "*": [6, (a, b) => a * b],
  "/": [6, (a, b) => a / b],
  div: [6, (a, b) => a / b],
  mod: [6, (a, b) => a % b],
  fmod: [6, (a, b) => a % b],
  "^": [7, (a, b) => Math.pow(a, b)],
  e: [8, (a, b) => a * Math.pow(10, b)]
};
const tokenize = (str) => {
  let tokens = [];
  let re = /\s*(\d+\.?\d*|\.\d+|[a-z]+|<>|!=|<=|>=|[-+*/^()=<>])/giy;
  let m;
  let pos = 0;
  while (pos < str.length) {
    re.lastIndex = pos;
    m = re.exec(str);
    if (!m) {
      if (/^\s*$/.test(str.slice(pos))) {
        break;
      }
      throw new Error("bad token");
    }
    tokens.push(m[1].toLowerCase());
    pos = re.lastIndex;
  }
  return tokens;
};
const evaluate = (str) => {
  const tokens = tokenize(str);
  let i = 0;
  const peek = () => tokens[i];
  const next = () => tokens[i++];
  function primary() {
    let tok = next();
    if (tok === void 0) {
      throw new Error("missing operand");
    }
    if (tok === "(") {
      let val2 = expression(0);
      if (next() !== ")") {
        throw new Error("unclosed parenthesis");
      }
      return val2;
    }
    if (tok === "-") {
      return -primary();
    }
    if (tok === "+") {
      return primary();
    }
    if (Object.hasOwn(fns1, tok)) {
      return fns1[tok](expression(7));
    }
    if (Object.hasOwn(consts, tok) && peek() !== void 0 && !Object.hasOwn(binary$1, peek()) && tok === "e") {
      throw new Error("bad e");
    }
    if (Object.hasOwn(consts, tok)) {
      return consts[tok];
    }
    if (/^[0-9.]+$/.test(tok)) {
      return Number(tok);
    }
    throw new Error("unexpected " + tok);
  }
  function expression(minPrec) {
    let left = primary();
    while (true) {
      let op = peek();
      if (op === void 0 || !Object.hasOwn(binary$1, op) || binary$1[op][0] < minPrec) {
        break;
      }
      next();
      let right = expression(binary$1[op][0] + 1);
      left = binary$1[op][1](left, right);
    }
    return left;
  }
  let val = expression(0);
  if (i < tokens.length) {
    throw new Error("trailing tokens");
  }
  return val;
};
const fmtNumber = (n) => {
  if (!Number.isFinite(n)) {
    return null;
  }
  n = Number(n.toPrecision(14));
  return String(n);
};
const expr = (str) => {
  try {
    return fmtNumber(evaluate(str));
  } catch {
    return null;
  }
};
const isNumeric = (str = "") => {
  str = str.trim();
  return /\d/.test(str) && /^[-+]?[\d.]+(e[-+]?\d+)?$/i.test(str) && str.split(".").length <= 2;
};
const templates$8 = {
  // {{#expr: 1 + 2 }} → 3
  "#expr": (tmpl) => {
    let [str = ""] = rawArgs(tmpl);
    return { data: null, replacement: expr(str) ?? "" };
  },
  // {{#if: test | then | else }}
  "#if": (tmpl) => {
    let [test = "", then = "", other = ""] = rawArgs(tmpl);
    return { data: null, replacement: test.trim() ? then : other };
  },
  // {{#ifeq: a | b | then | else }}
  "#ifeq": (tmpl) => {
    let [a = "", b = "", then = "", other = ""] = rawArgs(tmpl);
    let same = a.trim() === b.trim();
    if (isNumeric(a) && isNumeric(b)) {
      same = Number(a) === Number(b);
    }
    return { data: null, replacement: same ? then : other };
  },
  // {{#ifexpr: 1 > 0 | then | else }}
  "#ifexpr": (tmpl) => {
    let [test = "", then = "", other = ""] = rawArgs(tmpl);
    let val = test.trim() === "" ? 0 : Number(expr(test));
    if (Number.isNaN(val)) {
      return { data: null, replacement: "" };
    }
    return { data: null, replacement: val ? then : other };
  },
  // {{#iferror: {{#expr:1/0}} | error | ok }} - we can't see the error html, so test the expression
  "#iferror": (tmpl) => {
    let [test = "", error, ok] = rawArgs(tmpl);
    let isError = test.trim() === "" || /class="error"|<strong class="error|Expression error/i.test(test);
    if (isError) {
      return { data: null, replacement: error ?? "" };
    }
    return { data: null, replacement: ok ?? test };
  },
  // {{#switch: val | a = 1 | b | c = 2 | #default = 3 }}
  "#switch": (tmpl) => {
    let [val = "", ...cases] = rawArgs(tmpl);
    val = val.trim();
    let fallthrough = false;
    let fallback = null;
    for (let i = 0; i < cases.length; i += 1) {
      let c = cases[i];
      let eq = c.indexOf("=");
      if (eq === -1) {
        if (i === cases.length - 1) {
          if (fallthrough) {
            return { data: null, replacement: c };
          }
          fallback = c;
        } else if (c.trim() === val) {
          fallthrough = true;
        }
        continue;
      }
      let key = c.slice(0, eq).trim();
      let out = c.slice(eq + 1).trim();
      if (fallthrough || key === val || isNumeric(key) && isNumeric(val) && Number(key) === Number(val)) {
        return { data: null, replacement: out };
      }
      if (key === "#default") {
        fallback = out;
      }
    }
    return { data: null, replacement: fallback ?? "" };
  },
  // {{#language: fr }} → français (we return the native name, like mediawiki)
  "#language": (tmpl) => {
    let [code = ""] = rawArgs(tmpl);
    code = code.trim().toLowerCase();
    return { data: null, replacement: languages$1[code] || code };
  },
  // {{#titleparts: Talk:Foo/Bar/Baz | 1 | 2 }} → Bar
  "#titleparts": (tmpl) => {
    let [title = "", count = "", first = ""] = rawArgs(tmpl);
    let parts = title.trim().split("/");
    let n = parseInt(count, 10) || 0;
    let start = parseInt(first, 10) || 1;
    if (start < 0) {
      start = parts.length + start + 1;
    }
    let arr = parts.slice(start - 1);
    if (n > 0) {
      arr = arr.slice(0, n);
    } else if (n < 0) {
      arr = arr.slice(0, n);
    }
    return { data: null, replacement: arr.join("/") };
  },
  // {{#time: j F Y | 2001-05-03 }} - a few common php date formats
  "#time": (tmpl) => {
    let [format = "", date = ""] = rawArgs(tmpl);
    format = format.trim();
    let m = date.trim().match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/);
    let d = m ? ymd([m[1], m[2], m[3] || "1"]) : null;
    if (!d) {
      let now = /* @__PURE__ */ new Date();
      d = ymd([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
    }
    const pad = (n) => String(n).padStart(2, "0");
    const months = toText$1({ year: 2e3, month: d.month, date: 1 }).replace(/ 1, 2000$/, "");
    const known = {
      "Y-m-d": `${d.year}-${pad(d.month)}-${pad(d.date)}`,
      "j F Y": toTextBritish(d),
      "F j, Y": toText$1(d),
      "d F Y": `${pad(d.date)} ${months} ${d.year}`,
      "F Y": `${months} ${d.year}`,
      Y: String(d.year),
      F: months,
      j: String(d.date),
      "d/m/Y": `${pad(d.date)}/${pad(d.month)}/${d.year}`,
      "m/d/Y": `${pad(d.month)}/${pad(d.date)}/${d.year}`
    };
    if (Object.hasOwn(known, format)) {
      return { data: null, replacement: known[format] };
    }
    return { data: null, replacement: date.trim() };
  }
};

const superscript = (str = "") => {
  const sup = { 0: "\u2070", 1: "\xB9", 2: "\xB2", 3: "\xB3", 4: "\u2074", 5: "\u2075", 6: "\u2076", 7: "\u2077", 8: "\u2078", 9: "\u2079", "-": "\u207B", "+": "\u207A", "\u2212": "\u207B" };
  return String(str).split("").map((c) => sup[c] || c).join("");
};
const subscript = (str = "") => {
  const sub = { 0: "\u2080", 1: "\u2081", 2: "\u2082", 3: "\u2083", 4: "\u2084", 5: "\u2085", 6: "\u2086", 7: "\u2087", 8: "\u2088", 9: "\u2089", "-": "\u208B", "+": "\u208A" };
  return String(str).split("").map((c) => sub[c] || c).join("");
};
const romanNumerals = [
  [1e3, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"]
];
const roman = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["num"]);
  let n = parseInt(obj.num, 10);
  if (!Number.isFinite(n) || n <= 0 || n >= 5e3) {
    return { data: null, replacement: obj.num || "" };
  }
  let str = "";
  romanNumerals.forEach(([val, sym]) => {
    while (n >= val) {
      str += sym;
      n -= val;
    }
  });
  return { data: null, replacement: str };
};
const binary = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["num", "digits"]);
  let n = parseInt(obj.num, 10);
  if (!Number.isFinite(n) || n < 0) {
    return { data: null, replacement: obj.num || "" };
  }
  let str = n.toString(2);
  if (obj.digits) {
    str = str.padStart(Number(obj.digits) || 0, "0");
  }
  return { data: null, replacement: str };
};
const nts = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["num"]);
  let str = String(obj.num || "").replace(/,/g, "");
  if (!/^[-−+]?\d+(\.\d+)?$/.test(str)) {
    return { data: null, replacement: `${obj.prefix || ""}${obj.num || ""}${obj.suffix || ""}` };
  }
  let [int, dec] = str.replace("\u2212", "-").split(".");
  int = Number(int).toLocaleString("en-US");
  let out = dec !== void 0 ? `${int}.${dec}` : int;
  return { data: null, replacement: `${obj.prefix || ""}${out}${obj.suffix || ""}` };
};
const percent = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["num", "denom", "decimals"]);
  let n = Number(obj.num) / Number(obj.denom);
  if (!Number.isFinite(n)) {
    return { data: null, replacement: "" };
  }
  n *= 100;
  let dec = Number.isInteger(n) ? 0 : 1;
  if (obj.decimals !== void 0) {
    dec = Number(obj.decimals);
  }
  return { data: null, replacement: `${n.toFixed(dec)}%` };
};
const e = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["exp"]);
  return { data: null, replacement: `\xD710${superscript(obj.exp || "")}` };
};
const tenPow = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["exp"]);
  return { data: null, replacement: `10${superscript(obj.exp || "")}` };
};
const sci = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["mantissa", "exp"]);
  if (obj.exp === void 0) {
    return { data: null, replacement: obj.mantissa || "" };
  }
  return { data: null, replacement: `${obj.mantissa || ""}\xD710${superscript(obj.exp)}` };
};
const mabs = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text"]);
  return { data: null, replacement: `&#124;${obj.text || ""}&#124;` };
};
const constants = {
  c: ["299792458", "m/s"],
  g: ["6.67430\xD710\u207B\xB9\xB9", "m\xB3\u22C5kg\u207B\xB9\u22C5s\u207B\xB2"],
  h: ["6.62607015\xD710\u207B\xB3\u2074", "J\u22C5s"],
  hbar: ["1.054571817\xD710\u207B\xB3\u2074", "J\u22C5s"],
  e: ["1.602176634\xD710\u207B\xB9\u2079", "C"],
  k: ["1.380649\xD710\u207B\xB2\xB3", "J/K"],
  na: ["6.02214076\xD710\xB2\xB3", "mol\u207B\xB9"],
  r: ["8.314462618", "J\u22C5mol\u207B\xB9\u22C5K\u207B\xB9"],
  me: ["9.1093837015\xD710\u207B\xB3\xB9", "kg"],
  mp: ["1.67262192369\xD710\u207B\xB2\u2077", "kg"],
  gn: ["9.80665", "m/s\xB2"],
  alpha: ["0.0072973525693", ""],
  eps0: ["8.8541878128\xD710\u207B\xB9\xB2", "F/m"],
  mu0: ["1.25663706212\xD710\u207B\u2076", "N/A\xB2"],
  sigma: ["5.670374419\xD710\u207B\u2078", "W\u22C5m\u207B\xB2\u22C5K\u207B\u2074"]
};
const physconst = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["name"]);
  let found = constants[(obj.name || "").toLowerCase()];
  if (!found) {
    return { data: null, replacement: "" };
  }
  let [val, unit] = found;
  if (obj.round !== void 0) {
    let n = Number(obj.round);
    let m = val.match(/^[0-9.]+/);
    if (m && Number.isInteger(n)) {
      val = Number(m[0]).toFixed(n) + val.slice(m[0].length);
    }
  }
  if (obj.unit === "no" || !unit) {
    return { data: null, replacement: val };
  }
  return { data: null, replacement: `${val} ${unit}` };
};
const ago = (word, abbr) => (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["num", "num2"]);
  let str = obj.num || "";
  if (obj.num2) {
    str += `\u2013${obj.num2}`;
  }
  if (!str) {
    return { data: null, replacement: "" };
  }
  if (obj.template === abbr.toLowerCase()) {
    return { data: null, replacement: `${str} ${abbr}` };
  }
  return { data: null, replacement: `${str} ${word} years ago` };
};
const chem = (tmpl, parse = parseTextArguments) => {
  let arr = parse(tmpl).list || [];
  let str = arr.map((s, i) => {
    if (/^[0-9]*[+\-−]$/.test(s)) {
      return superscript(s);
    }
    if (i % 2 === 1) {
      return subscript(s);
    }
    return s;
  }).join("");
  return { data: { formula: str }, replacement: str };
};
const elements = {
  hydrogen: "H",
  helium: "He",
  lithium: "Li",
  beryllium: "Be",
  boron: "B",
  carbon: "C",
  nitrogen: "N",
  oxygen: "O",
  fluorine: "F",
  neon: "Ne",
  sodium: "Na",
  magnesium: "Mg",
  aluminium: "Al",
  aluminum: "Al",
  silicon: "Si",
  phosphorus: "P",
  sulfur: "S",
  sulphur: "S",
  chlorine: "Cl",
  argon: "Ar",
  potassium: "K",
  calcium: "Ca",
  iron: "Fe",
  cobalt: "Co",
  nickel: "Ni",
  copper: "Cu",
  zinc: "Zn",
  strontium: "Sr",
  technetium: "Tc",
  iodine: "I",
  xenon: "Xe",
  caesium: "Cs",
  cesium: "Cs",
  barium: "Ba",
  lead: "Pb",
  bismuth: "Bi",
  polonium: "Po",
  radon: "Rn",
  radium: "Ra",
  thorium: "Th",
  uranium: "U",
  neptunium: "Np",
  plutonium: "Pu",
  americium: "Am",
  curium: "Cm"
};
const nuclide = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["element", "mass", "extra"]);
  let name = (obj.element || "").toLowerCase();
  let sym = elements[name] || obj.element || "";
  let mass = obj.mass ? superscript(obj.mass) : "";
  if (/^m\d*$/.test(obj.extra || "")) {
    mass += obj.extra;
  }
  let str = `${mass}${sym}`;
  if (obj.charge) {
    str += superscript(obj.charge);
  }
  return { data: null, replacement: str };
};
const particles = {
  electron: "e\u207B",
  positron: "e\u207A",
  proton: "p\u207A",
  antiproton: "p\u0304",
  neutron: "n\u2070",
  antineutron: "n\u0304",
  photon: "\u03B3",
  "electron neutrino": "\u03BD\u2091",
  neutrino: "\u03BD",
  muon: "\u03BC\u207B",
  antimuon: "\u03BC\u207A",
  tau: "\u03C4\u207B",
  "alpha particle": "\u03B1",
  alpha: "\u03B1",
  "beta particle": "\u03B2",
  "beta-": "\u03B2\u207B",
  "beta+": "\u03B2\u207A",
  gluon: "g",
  "higgs boson": "H\u2070",
  "w boson+": "W\u207A",
  "w boson-": "W\u207B",
  "z boson": "Z\u2070",
  "pion+": "\u03C0\u207A",
  "pion-": "\u03C0\u207B",
  pion0: "\u03C0\u2070",
  "kaon+": "K\u207A",
  kaon0: "K\u2070",
  "up quark": "u",
  "down quark": "d",
  "strange quark": "s",
  "charm quark": "c",
  "top quark": "t",
  "bottom quark": "b",
  deuteron: "d",
  triton: "t"
};
const subatomicParticle = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["name"]);
  let name = (obj.name || "").toLowerCase();
  return { data: null, replacement: particles[name] || obj.name || "" };
};
const strRight = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text", "n"]);
  let n = parseInt(obj.n, 10) || 0;
  let text = obj.text || "";
  return { data: null, replacement: n > 0 ? text.slice(-n) : "" };
};
const strIndex = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text", "n"]);
  let n = parseInt(obj.n, 10) || 0;
  return { data: null, replacement: (obj.text || "").charAt(n - 1) };
};
const strFind = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text", "search"]);
  if (!obj.search) {
    return { data: null, replacement: "1" };
  }
  return { data: null, replacement: String((obj.text || "").indexOf(obj.search) + 1 || -1) };
};
const strEndswith = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text", "search", "yes", "no"]);
  let ok = (obj.text || "").endsWith(obj.search || "");
  return { data: null, replacement: ok ? obj.yes ?? "yes" : obj.no ?? "" };
};
const strStartswith = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text", "search", "yes", "no"]);
  let ok = (obj.text || "").startsWith(obj.search || "");
  return { data: null, replacement: ok ? obj.yes ?? "yes" : obj.no ?? "" };
};
const strNumber = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text"]);
  return { data: null, replacement: (obj.text || "").replace(/[^0-9.]/g, "") };
};
const removeFirstWord = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text"]);
  let arr = (obj.text || "").trim().split(/\s+/);
  return { data: null, replacement: arr.slice(1).join(" ") };
};
var numbers = {
  roman,
  binary,
  nts,
  percent,
  e,
  "10^": tenPow,
  sci,
  mabs,
  physconst,
  mya: ago("million", "Ma"),
  ma: ago("million", "Ma"),
  bya: ago("billion", "Ga"),
  ga: ago("billion", "Ga"),
  kya: ago("thousand", "ka"),
  ka: ago("thousand", "ka"),
  chem,
  nuclide,
  subatomicparticle: subatomicParticle,
  "str right": strRight,
  "str index": strIndex,
  "str find": strFind,
  "str endswith": strEndswith,
  "str startswith": strStartswith,
  "str number": strNumber,
  "remove first word": removeFirstWord
};

const teams = {
  nft: { team: "national football team" },
  "nft-rt": { team: "national football team", rt: true },
  fbw: { team: "women's national football team" },
  "fb-rt": { team: "national football team", rt: true },
  "fbw-rt": { team: "women's national football team", rt: true },
  fbu: { team: "national under-{age} football team", under: true },
  fbwu: { team: "women's national under-{age} football team", under: true },
  nfa: { team: "Football Association", nolink: false },
  bk: { team: "national basketball team" },
  bkw: { team: "women's national basketball team" },
  "bk-rt": { team: "national basketball team", rt: true },
  hb: { team: "national handball team" },
  hbw: { team: "women's national handball team" },
  ih: { team: "men's national ice hockey team" },
  ihw: { team: "women's national ice hockey team" },
  "ih-rt": { team: "men's national ice hockey team", rt: true },
  ru: { team: "national rugby union team" },
  ruw: { team: "women's national rugby union team" },
  "ru-rt": { team: "national rugby union team", rt: true },
  rl: { team: "national rugby league team" },
  rlw: { team: "women's national rugby league team" },
  crw: { team: "women's national cricket team" },
  vb: { team: "men's national volleyball team" },
  vbw: { team: "women's national volleyball team" },
  fh: { team: "men's national field hockey team" },
  fhw: { team: "women's national field hockey team" },
  wp: { team: "men's national water polo team" },
  wpw: { team: "women's national water polo team" },
  bs: { team: "national baseball team" },
  bsw: { team: "women's national baseball team" },
  fs: { team: "national futsal team" },
  bh: { team: "national beach handball team" },
  bv: { team: "national beach volleyball team" },
  bsk: { team: "national beach soccer team" }
};
const makeTeam = (name, info) => {
  return (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, info.under ? ["age", "flag", "variant"] : ["flag", "variant"]);
    let found = findFlag(obj.flag);
    if (!found) {
      return { data: null, replacement: obj.flag || "" };
    }
    let country = titleCase(found[2]);
    let label = obj.name || country;
    let team = info.team.replace("{age}", obj.age || "");
    if (info.under) {
      label += ` U${obj.age || ""}`;
    }
    let link = `[[${country} ${team}|${label}]]`;
    if (info.rt) {
      return { data: null, replacement: `${link} ${found[0]}` };
    }
    return { data: null, replacement: `${found[0]} ${link}` };
  };
};
let templates$7 = {};
Object.keys(teams).forEach((name) => {
  templates$7[name] = makeTeam(name, teams[name]);
});
const games = (obj) => {
  let str = (obj.games || "").trim();
  if (!str) {
    return "";
  }
  return / Olympics$/i.test(str) ? str : `${str} Olympics`;
};
const flagIOC = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["flag", "games"]);
  let found = findFlag(obj.flag);
  if (!found) {
    return { data: null, replacement: obj.flag || "" };
  }
  let country = titleCase(found[2]);
  let at = games(obj);
  let link = at ? `[[${country} at the ${at}|${country}]]` : `[[${country}]]`;
  return { data: null, replacement: `${found[0]} ${link}` };
};
const flagIOCathlete = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["name", "flag", "games"]);
  let found = findFlag(obj.flag);
  let name = obj.name ? `[[${obj.name}]]` : "";
  if (!found) {
    return { data: null, replacement: name };
  }
  let code = (obj.flag || "").toUpperCase();
  let at = games(obj);
  let country = titleCase(found[2]);
  let link = at ? `[[${country} at the ${at}|${code}]]` : code;
  return { data: null, replacement: `${found[0]} ${name} (${link})` };
};
const flagu = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["flag", "variant"]);
  let found = findFlag(obj.flag);
  if (!found) {
    return { data: null, replacement: obj.flag || "" };
  }
  return { data: null, replacement: `${found[0]} ${titleCase(found[2])}` };
};
const noflag = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["name"]);
  return { data: null, replacement: obj.name || "" };
};
Object.assign(templates$7, {
  flagioc: flagIOC,
  flagioc2: flagIOC,
  flagiocteam: flagIOC,
  flagiocathlete: flagIOCathlete,
  flagiocmedalist: flagIOCathlete,
  flagteam: flagIOC,
  flagu,
  noflag
});
const seasonLink = (series) => (tmpl, parse = parseTextArguments) => {
  let { year } = parse(tmpl, ["year"]);
  return { data: null, replacement: year ? `[[${year} ${series}|${year}]]` : "" };
};
Object.assign(templates$7, {
  wsy: seasonLink("World Series"),
  alcsy: seasonLink("American League Championship Series"),
  nlcsy: seasonLink("National League Championship Series"),
  sby: seasonLink("Super Bowl")
});

var textTmpl = {
  ...templates$a,
  ...templates$b,
  ...hardcoded,
  ...handlers,
  ...templates$c,
  ...functions,
  ...fns,
  ...templates$9,
  ...inline,
  ...templates$8,
  ...numbers,
  ...templates$7
};

const keys$1 = {
  // stress and separators
  "'": "\u02C8",
  ",": "\u02CC",
  ".": ".",
  "-": ".",
  _: " ",
  // consonants
  b: "b",
  ch: "t\u0283",
  d: "d",
  dh: "\xF0",
  f: "f",
  g: "\u0261",
  h: "h",
  hw: "hw",
  j: "d\u0292",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  ng: "\u014B",
  p: "p",
  r: "r",
  s: "s",
  sh: "\u0283",
  t: "t",
  th: "\u03B8",
  v: "v",
  w: "w",
  x: "x",
  y: "j",
  z: "z",
  zh: "\u0292",
  // syllabic consonants
  \u0259l: "\u0259l",
  \u0259m: "\u0259m",
  \u0259n: "\u0259n",
  // vowels
  a: "\xE6",
  ah: "\u0251\u02D0",
  ar: "\u0251\u02D0r",
  aw: "\u0254\u02D0",
  ay: "e\u026A",
  air: "\u025B\u0259r",
  e: "\u025B",
  ee: "i\u02D0",
  eer: "\u026A\u0259r",
  err: "\u025Br",
  ew: "ju\u02D0",
  eye: "a\u026A",
  i: "\u026A",
  ire: "a\u026A\u0259r",
  o: "\u0252",
  oh: "o\u028A",
  oo: "u\u02D0",
  oor: "\u028A\u0259r",
  or: "\u0254\u02D0r",
  our: "a\u028A\u0259r",
  ow: "a\u028A",
  oy: "\u0254\u026A",
  oir: "\u0254\u026A\u0259r",
  u: "\u028C",
  ur: "\u025C\u02D0r",
  ure: "j\u028A\u0259r",
  uu: "\u028A",
  \u0259: "\u0259",
  \u0259r: "\u0259r",
  \u026A: "\u026A",
  \u028A: "\u028A"
};
const labels = /* @__PURE__ */ new Set(["pron", "lang", "local", "uk", "us", "ukus", "usuk", "also", "alt", "ipa", "wasm", "pronunciation", "english"]);

var dataFns = {
  // just parse it and do nothing
  "citation needed": (tmpl, parse = parseTextArguments) => {
    const payload = parse(tmpl);
    return { data: payload, replacement: "" };
  },
  // https://en.wikipedia.org/wiki/Template:IPA
  ipa: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["transcription", "lang", "audio"]);
    obj.lang = getLang(obj.template);
    obj.template = "ipa";
    return { data: obj, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:IPAc-en
  // {{IPAc-en|ˈ|s|ʌ|m}} → /ˈsʌm/  (pronunciations are kept as data, not text)
  ipac: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    let lang = getLang(obj.template);
    let arr = (obj.list || []).map((s) => s.trim());
    if (lang === "en") {
      arr = arr.filter((s) => !labels.has(s.toLowerCase()));
      let str = arr.map((s) => keys$1[s] ?? keys$1[s.toLowerCase()] ?? s).join("");
      obj.transcription = `/${str}/`;
    } else {
      obj.transcription = arr.join(",");
    }
    delete obj.list;
    obj.lang = lang;
    obj.template = "ipac";
    return { data: obj, replacement: "" };
  },
  quote: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["text", "author"]);
    if (obj.text) {
      let str = `"${obj.text}"`;
      if (obj.author) {
        str += "\n\n";
        str += `    - ${obj.author}`;
      }
      return { data: obj, replacement: str + "\n" };
    }
    return { data: obj, replacement: "" };
  },
  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  "cite gnis": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["id", "name", "type"]);
    obj.type = "gnis";
    obj.template = "citation";
    return { data: obj, replacement: "" };
  },
  "spoken wikipedia": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["file", "date"]);
    obj.template = "audio";
    return { data: obj, replacement: "" };
  },
  //yellow card
  yel: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["min"]);
    if (obj.min) {
      return { data: obj, replacement: `yellow: ${obj.min || ""}'` };
    }
    return { data: obj, replacement: "" };
  },
  subon: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["min"]);
    if (obj.min) {
      return { data: obj, replacement: `sub on: ${obj.min || ""}'` };
    }
    return { data: obj, replacement: "" };
  },
  suboff: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["min"]);
    if (obj.min) {
      return { data: obj, replacement: `sub off: ${obj.min || ""}'` };
    }
    return { data: obj, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:Sfn
  sfn: (tmpl, parser = parseTextArguments) => {
    let obj = parser(tmpl, ["author", "year", "location"]);
    return { data: obj, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["redirect"]);
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
    return { data: obj, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  "sister project links": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl);
    let links = {};
    Object.keys(sisterProjects).forEach((k) => {
      if (Object.hasOwn(data, k) === true) {
        links[sisterProjects[k]] = data[k];
      }
    });
    let obj = {
      template: "sister project links",
      links
    };
    return { data: obj, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:Subject_bar
  "subject bar": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl);
    Object.keys(data).forEach((k) => {
      if (Object.hasOwn(sisterProjects, k)) {
        data[sisterProjects[k]] = data[k];
        delete data[k];
      }
    });
    let obj = {
      template: "subject bar",
      links: data
    };
    return { data: obj, replacement: "" };
  },
  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  gallery: (tmpl, _parse = parseTextArguments, opts) => {
    const args = parseArguments$2(tmpl, [], opts);
    const items = args.list || [];
    const images = [];
    for (let i = 0; i < items.length; i += 2) {
      const file = items[i].wiki.trim();
      const caption = items[i + 1]?.wiki || "";
      const image = parseImgString(`[[${file}|${caption}]]`, opts);
      if (image) {
        const alt = args[`alt${i / 2 + 1}`];
        if (alt) {
          image.alt = alt.text;
        }
        images.push(image);
      }
    }
    return { data: { images }, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:Sky
  sky: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, [
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
    return { data: template, replacement: "" };
  },
  // Parse https://en.wikipedia.org/wiki/Template:Medical_cases_chart -- see
  // https://en.wikipedia.org/wiki/Module:Medical_cases_chart for the original
  // parsing code.
  "medical cases chart": (tmpl, parse = parseTextArguments) => {
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
    let obj = parse(tmpl);
    obj.data ||= "";
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
    return { data: obj, replacement: "" };
  },
  graph: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl);
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
    return { data, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:Historical_populations
  "historical populations": (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl);
    data.list ||= [];
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
    return { data, replacement: "" };
  },
  // this one is a handful!
  //https://en.wikipedia.org/wiki/Template:Weather_box
  "weather box": (tmpl, parse = parseTextArguments) => {
    const hasMonth = /^jan /i;
    const isYear = /^year /i;
    let obj = parse(tmpl);
    const monthList = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    let byMonth = {};
    let properties = Object.keys(obj).filter((k) => hasMonth.test(k));
    properties = properties.map((k) => k.replace(hasMonth, ""));
    properties.forEach((prop) => {
      byMonth[prop] = [];
      monthList.forEach((m) => {
        let key = `${m} ${prop}`;
        if (Object.hasOwn(obj, key)) {
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
    return { data: obj, replacement: "" };
  },
  //The 36 parameters are: 12 monthly highs (C), 12 lows (total 24) plus an optional 12 monthly rain/precipitation
  //https://en.wikipedia.org/wiki/Template:Weather_box/concise_C
  "weather box/concise c": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    obj.list = (obj.list || []).map((s) => toNumber(s));
    obj.byMonth = {
      "high c": obj.list.slice(0, 12),
      "low c": obj.list.slice(12, 24),
      "rain mm": obj.list.slice(24, 36)
    };
    delete obj.list;
    obj.template = "weather box";
    return { data: obj, replacement: "" };
  },
  "weather box/concise f": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    obj.list = (obj.list || []).map((s) => toNumber(s));
    obj.byMonth = {
      "high f": obj.list.slice(0, 12),
      "low f": obj.list.slice(12, 24),
      "rain inch": obj.list.slice(24, 36)
    };
    delete obj.list;
    obj.template = "weather box";
    return { data: obj, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:Climate_chart
  "climate chart": (tmpl, parse = parseTextArguments) => {
    let lines = parse(tmpl).list || [];
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
      title,
      source,
      months
    };
    return { data: obj, replacement: "" };
  },
  //https://en.wikipedia.org/wiki/Template:MedalCount
  medalcount: (tmpl, parse = parseTextArguments) => {
    let all = parse(tmpl).list || [];
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
    return { data: obj, replacement: "" };
  },
  r: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["name"]);
    obj.template = "citation";
    return { data: obj, replacement: "" };
  }
};

const pageList = ["main", "main article", "see also", "seealso", "further", "further information", "details", "broader", "main list", "see", "excerpt", "category see also", "cat main", "main category", "wikipedia books"];
const aboutList = ["about", "for", "other uses", "other uses of", "other people", "other places", "other ships", "redirect-distinguish", "distinguish", "self reference", "selfref"];
let templates$6 = {};
pageList.forEach((name) => {
  templates$6[name] = (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    let pages = (obj.list || []).filter((s) => s);
    let data = { type: name, pages, list: pages };
    Object.keys(obj).forEach((k) => {
      if (/^l\d+$/.test(k)) {
        data.labels ||= {};
        data.labels[k] = obj[k];
      }
    });
    return { data, replacement: "" };
  };
  templates$6[name].kind = "hatnote";
});
aboutList.forEach((name) => {
  templates$6[name] = (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    let list = (obj.list || []).filter((s) => s);
    let data = { type: name, list };
    if (name === "about") {
      data.pages = list.filter((s, i) => i > 0 && i % 2 === 0);
    } else if (name === "for") {
      data.pages = list.slice(1);
    } else {
      data.pages = list;
    }
    return { data, replacement: "" };
  };
  templates$6[name].kind = "hatnote";
});
templates$6.hatnote = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text"]);
  return { data: { type: "hatnote", text: obj.text || "" }, replacement: "" };
};
templates$6.hatnote.kind = "hatnote";

let templates$5 = {
  //https://en.wikipedia.org/wiki/Category:External_link_templates
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
  geo: ["lat", "lon", "zoom"]
  //https://en.wikivoyage.org/wiki/Template:Geo
};
templates$5 = Object.assign(templates$5, templates$6, dataFns);
var dataTmpl = templates$5;

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

let templates$4 = {
  // https://en.wikipedia.org/wiki/Template:Math
  math: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["formula"]);
    return { data: obj, replacement: obj.formula || "" };
  },
  //svg labels - https://en.m.wikipedia.org/wiki/Template:Legend
  legend: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["color", "label"]);
    return { data: obj, replacement: tmpl };
  },
  isbn: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["id", "id2", "id3"]);
    return { data: obj, replacement: "ISBN " + (obj.id || "") };
  },
  //https://en.wikipedia.org/wiki/Template:Based_on
  "based on": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["title", "author"]);
    return { data: obj, replacement: `${obj.title} by ${obj.author || ""}` };
  },
  //barrels of oil https://en.wikipedia.org/wiki/Template:Bbl_to_t
  "bbl to t": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["barrels"]);
    if (obj.barrels === "0") {
      return { data: obj, replacement: obj.barrels + " barrel" };
    }
    return { data: obj, replacement: obj.barrels + " barrels" };
  },
  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["number", "text"]);
    return {
      data: obj,
      replacement: `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text || obj.number}]`
    };
  },
  pengoal: (_tmpl) => {
    const payload = {
      template: "pengoal"
    };
    return { data: payload, replacement: "\u2705" };
  },
  penmiss: (_tmpl) => {
    const payload = {
      template: "penmiss"
    };
    return { data: payload, replacement: "\u274C" };
  },
  // https://en.wikipedia.org/wiki/Template:Ordered_list
  "ordered list": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    obj.list ||= [];
    let lines = obj.list.map((str, i) => `${i + 1}. ${str}`);
    return { data: obj, replacement: lines.join("\n\n") };
  },
  // https://en.wikipedia.org/wiki/Template:Title_year
  "title year": (tmpl, parse = parseTextArguments, info) => {
    let obj = parse(tmpl, ["match", "nomatch", "page"]);
    let title = obj.page || info?.title;
    if (title) {
      let m = title.match(/\b[0-9]{4}\b/);
      if (m) {
        return { data: null, replacement: m[0] };
      }
    }
    return { data: null, replacement: obj.nomatch || "" };
  },
  // https://en.wikipedia.org/wiki/Template:Title_century
  "title century": (tmpl, parse = parseTextArguments, info) => {
    let obj = parse(tmpl, ["match", "nomatch", "page"]);
    let title = obj.page || info?.title;
    if (title) {
      let m = title.match(/\b([0-9]+)(st|nd|rd|th)\b/);
      if (m) {
        return { data: null, replacement: m[1] || "" };
      }
    }
    return { data: null, replacement: obj.nomatch || "" };
  },
  // https://en.wikipedia.org/wiki/Template:Title_decade
  "title decade": (tmpl, parse = parseTextArguments, info) => {
    let obj = parse(tmpl, ["match", "nomatch", "page"]);
    let title = obj.page || info?.title;
    if (title) {
      let m = title.match(/\b([0-9]+)s\b/);
      if (m) {
        return { data: null, replacement: m[1] || "" };
      }
    }
    return { data: null, replacement: obj.nomatch || "" };
  },
  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["english", "kanji", "romaji", "extra", "extra2"]);
    if (obj.template === "nihongo foot") {
      return { data: obj, replacement: obj.english || obj.romaji || "" };
    }
    let str = obj.english || obj.romaji || "";
    let details = [obj.kanji, obj.romaji];
    if (obj.template === "nihongo3") {
      str = obj.romaji || obj.english || "";
      details = [obj.kanji, obj.english];
    }
    details = details.filter((s) => s && s !== str);
    if (obj.extra) {
      details.push(obj.extra);
    }
    if (details.length > 0) {
      str += ` (${details.join(", ")})`;
    }
    if (obj.extra2) {
      str += " " + obj.extra2;
    }
    return { data: obj, replacement: str };
  },
  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: (tmpl, parse = parseTextArguments) => {
    let data = parse(tmpl, ["spouse", "from", "to", "end"]);
    let str = data.spouse || "";
    if (data.from) {
      if (data.to) {
        const reasons = {
          died: "died",
          "d.": "died",
          dead: "died",
          widowed: "died",
          div: "div.",
          "div.": "div.",
          divorced: "div.",
          ann: "ann.",
          "ann.": "ann.",
          annulled: "ann.",
          sep: "sep.",
          "sep.": "sep.",
          separated: "sep."
        };
        let reason = reasons[(data.end || "").toLowerCase()];
        if (reason) {
          str += ` (m. ${data.from}; ${reason} ${data.to})`;
        } else {
          str += ` (m. ${data.from}\u2013${data.to})`;
        }
      } else {
        str += ` (m. ${data.from})`;
      }
    }
    return { data, replacement: str };
  },
  //'red' card - {{sent off|cards|min1|min2}}
  "sent off": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["cards"]);
    let result = {
      template: "sent off",
      cards: obj.cards,
      minutes: obj.list || []
    };
    let mins = result.minutes.map((m) => m + "'").join(", ");
    return { data: result, replacement: "sent off: " + mins };
  },
  transl: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["lang", "text", "text2"]);
    if (obj.text2) {
      obj.iso = obj.text;
      obj.text = obj.text2;
      delete obj.text2;
    }
    return { data: obj, replacement: obj.text || "" };
  },
  //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
  "collapsible list": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
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
    return { data: obj, replacement: str };
  },
  //https://en.wikipedia.org/wiki/Template:Columns-list
  "columns-list": (tmpl, parse = parseTextArguments) => {
    let arr = parse(tmpl).list || [];
    let str = arr[0] || "";
    let lines = str.split(/\n/).filter((f) => f);
    lines = lines.map((s) => s.replace(/\*/, ""));
    const payload = {
      template: "columns-list",
      list: lines
    };
    lines = lines.map((s) => "\u2022 " + s);
    return { data: payload, replacement: lines.join("\n\n") };
  },
  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    let result = [];
    let units = ["m", "cm", "ft", "in"];
    units.forEach((unit) => {
      if (Object.hasOwn(obj, unit) === true) {
        result.push(obj[unit] + " " + unit);
      }
    });
    return { data: obj, replacement: result.join(" ") };
  },
  //https://en.wikipedia.org/wiki/Template:Sic
  sic: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["one", "two", "three"]);
    let parts = [obj.one, obj.two, obj.three];
    let question = parts.includes("?") || obj["?"] === "y";
    let word = parts.filter((s) => s && s !== "?").join("");
    const payload = {
      template: "sic",
      word
    };
    if (obj.hide === "y" || obj.hide === "yes") {
      return { data: payload, replacement: word };
    }
    return { data: payload, replacement: `${word} [sic${question ? "?" : ""}]` };
  },
  //
  inrconvert: (tmpl, parse = parseTextArguments) => {
    let o = parse(tmpl, ["rupee_value", "currency_formatting"]);
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
    return { data: o, replacement: `inr ${o.rupee_value || ""}` };
  },
  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  sfrac: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["a", "b", "c"]);
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
    if (data.integer) {
      return { data, replacement: `${data.integer} ${data.numerator}\u2044${data.denominator}` };
    }
    return { data, replacement: `${data.numerator}\u2044${data.denominator}` };
  },
  "winning percentage": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["wins", "losses", "ties"]);
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
    if (!Number.isFinite(wins) || !Number.isFinite(games) || games <= 0) {
      return { data: obj, replacement: "" };
    }
    let result = (wins / games).toFixed(3);
    if (obj.leading_zero !== "y") {
      result = result.replace(/^0\./, ".");
    }
    if (obj.record === "y") {
      const rec = [obj.wins, obj.losses];
      if (obj.ties) {
        rec.push(obj.ties);
      }
      return { data: obj, replacement: `${rec.join("\u2013")} (${result})` };
    }
    return { data: obj, replacement: result };
  },
  // https://en.wikipedia.org/wiki/Template:Winlosspct
  // {{winlosspct|10|5}} → 10 || 5 || .667
  winlosspct: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["wins", "losses"]);
    let wins = Number(obj.wins) || 0;
    let losses = Number(obj.losses) || 0;
    let games = wins + losses;
    let out = "-";
    if (games > 0) {
      out = (wins / games).toFixed(3).replace(/^0\./, ".");
    }
    return { data: obj, replacement: `${wins} || ${losses} || ${out}` };
  },
  //https://en.wikipedia.org/wiki/Template:Video_game_release
  "video game release": (tmpl, parse = parseTextArguments) => {
    let order = ["region", "date", "region2", "date2", "region3", "date3", "region4", "date4"];
    let obj = parse(tmpl, order);
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
    let str = template.releases.map((o) => `${o.region}: ${o.date || ""}`).join("\n\n");
    return { data: template, replacement: "\n" + str + "\n" };
  },
  // https://en.m.wikipedia.org/wiki/Template:USS
  uss: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["name", "id"]);
    if (obj.id) {
      return { data: obj, replacement: `[[USS ${obj.name} (${obj.id})|USS ''${obj.name}'' (${obj.id})]]` };
    }
    return { data: obj, replacement: `[[USS ${obj.name}|USS ''${obj.name}'']]` };
  },
  // https://en.wikipedia.org/wiki/Template:Blockquote
  blockquote: (tmpl, parse = parseTextArguments) => {
    let props = ["text", "author", "title", "source", "character"];
    let obj = parse(tmpl, props);
    let txt = obj.text;
    if (!txt) {
      obj.list ||= [];
      txt = obj.list[0] || "";
    }
    let result = txt.replace(/"/g, "'");
    result = '"' + result + '"';
    return { data: obj, replacement: result };
  },
  // https://de.m.wikipedia.org/wiki/Vorlage:ReptileDatabase
  // {{ReptileDatabase|Blanus|cinereus}} → Blanus cinereus In: The Reptile Database
  reptiledatabase: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["genus", "species", "abruf", "pure_url"]);
    let str = "";
    if (obj.genus || obj.species) {
      str = `${obj.genus || ""} ${obj.species || ""} `;
    }
    return { data: obj, replacement: `${str}In: [[The Reptile Database]]` };
  },
  //https://en.m.wikipedia.org/wiki/Template:GEOnet3
  geonet3: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["ufi", "name"]);
    return {
      data: obj,
      replacement: `GEOnet3 can be found at [[GEOnet Names Server]], at [http://geonames.nga.mil/namesgaz/ this link]`
    };
  },
  "poem quote": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["text", "char", "sign", "source", "title"]);
    let out = obj.text || "";
    if (obj.char || obj.sign || obj.source || obj.title) {
      out += "\n\n \u2014";
      out += obj.char ? " " + obj.char : "";
      out += obj.sign ? " " + obj.sign : "";
      out += obj.source ? " " + obj.source : "";
      out += obj.title ? " " + obj.title : "";
    }
    return { data: obj, replacement: out };
  },
  tweet: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
    let out = obj.text || "";
    out += obj.date ? " " + obj.date : "";
    return { data: obj, replacement: out };
  }
};

const codes$1 = {
  "\xA3": "\xA3",
  // https://en.wikipedia.org/wiki/Template:GBP
  "\u20AC": "\u20AC",
  // https://en.wikipedia.org/wiki/Template:€
  "\u20A9": "\u20A9",
  // https://en.wikipedia.org/wiki/Template:KRW
  eur: "\u20AC",
  // https://en.wikipedia.org/wiki/Template:EUR
  krw: "\u20A9",
  // https://en.wikipedia.org/wiki/Template:KRW
  "south korean won": "\u20A9",
  // https://en.wikipedia.org/wiki/Template:KRW
  "\xA5": "\xA5",
  // https://en.wikipedia.org/wiki/Template:JPY
  "\u09F3": "\u09F3",
  // https://en.wikipedia.org/wiki/Template:BDT
  "\u20B1": "\u20B1",
  // https://en.wikipedia.org/wiki/Template:Philippine_peso
  "\u20B9": "\u20B9",
  // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  "\u20BD": "\u20BD",
  // https://en.wikipedia.org/wiki/Template:RUB
  "cn\xA5": "CN\xA5",
  // https://en.wikipedia.org/wiki/Template:CNY
  "gb\xA3": "\xA3",
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
  brl: "R$",
  //https://en.wikipedia.org/wiki/Template:BRL
  ca$: "C$",
  // https://en.wikipedia.org/wiki/Template:CAD
  cad: "C$",
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
  gbp: "\xA3",
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
  r$: "R$",
  //https://en.wikipedia.org/wiki/Template:BRL
  rmb: "CN\xA5",
  // https://en.wikipedia.org/wiki/Template:CNY
  rub: "\u20BD",
  // https://en.wikipedia.org/wiki/Template:RUB
  ruble: "\u20BD",
  // https://en.wikipedia.org/wiki/Template:Ruble
  rupee: "\u20B9",
  // https://en.wikipedia.org/wiki/Template:Rupee
  s$: "S$",
  // https://en.wikipedia.org/wiki/Template:SGD
  sek: "SEK",
  // https://en.wikipedia.org/wiki/Template:SEK
  sek2: "SEK",
  // https://en.wikipedia.org/wiki/Template:SEK
  sfr: "CHF",
  // https://en.wikipedia.org/wiki/Template:CHF
  sgd: "S$",
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
const parseCurrency = (tmpl, parse = parseTextArguments) => {
  let o = parse(tmpl, ["amount", "code"]);
  let code = o.template || "";
  if (code === "currency") {
    code = o.code;
    if (!code) {
      code = "usd";
      o.code = code;
    }
  } else if (code === "" || code === "monnaie" || code === "unit\xE9" || code === "nombre" || code === "nb") {
    code = o.code;
  }
  code = (code || "").toLowerCase();
  if (o.code && /^[0-9]{4}$/.test(o.code) && o.template !== "currency") {
    o.year = o.code;
    delete o.code;
  }
  if (code === "us") {
    code = "usd";
    o.code = code;
  } else if (code === "uk") {
    code = "gbp";
    o.code = code;
  }
  let str = `${codes$1[code] || ""}${o.amount || ""}`;
  if (o.code && !codes$1[o.code.toLowerCase()]) {
    str += " " + o.code;
  }
  return { data: o, replacement: str };
};
let templates$3 = {
  currency: parseCurrency
};
Object.keys(codes$1).forEach((k) => {
  templates$3[k] = parseCurrency;
});

const toDate = (obj) => new Date(Date.UTC(obj.year || 0, (obj.month || 1) - 1, obj.date || 1));
const delta = function(from, to) {
  let a = toDate(from);
  let b = toDate(to);
  if (a > b) {
    [a, b] = [b, a];
  }
  let years = b.getUTCFullYear() - a.getUTCFullYear();
  let months = b.getUTCMonth() - a.getUTCMonth();
  let days2 = b.getUTCDate() - a.getUTCDate();
  let borrow = 0;
  while (days2 < 0) {
    months -= 1;
    borrow += 1;
    days2 += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth() - borrow + 1, 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.round((b.getTime() - a.getTime()) / (1e3 * 60 * 60 * 24));
  const anniversary = new Date(Date.UTC(a.getUTCFullYear() + years, a.getUTCMonth(), a.getUTCDate()));
  const yearDays = Math.round((b.getTime() - anniversary.getTime()) / (1e3 * 60 * 60 * 24));
  let obj = { totalDays, yearDays };
  if (years > 0) {
    obj.years = years;
  }
  if (months > 0) {
    obj.months = months;
  }
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
  let num = 0;
  let unit = "day";
  if (days2 >= 365) {
    num = Math.floor(days2 / 365.25);
    unit = "year";
  } else if (days2 >= 30) {
    num = Math.floor(days2 / 30.4375);
    unit = "month";
  } else if (days2 >= 7) {
    num = Math.floor(days2 / 7);
    unit = "week";
  } else {
    num = Math.floor(days2);
  }
  if (num !== 1) {
    unit += "s";
  }
  return `${num} ${unit} ${predicate}`;
};
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const template = (date) => {
  return { ...date, template: "date" };
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
const unit = (num, word) => num === 1 ? `1 ${word}` : `${num} ${word}s`;
const parsers = {
  //generic {{date|year|month|date}} template
  date: (tmpl, parse = parseTextArguments) => {
    let payload = null;
    let order = ["year", "month", "date", "hour", "minute", "second", "timezone"];
    let obj = parse(tmpl, order);
    let data = ymd([obj.year, obj.month, obj.date || obj.day]);
    obj.text = fmt(data, obj);
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
      payload = template(obj);
    }
    return { data: payload, replacement: obj.text };
  },
  //support parsing of 'February 10, 1992'
  natural_date: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["text"]);
    let str = obj.text || "";
    let date = {};
    if (/^[0-9]{4}$/.test(str)) {
      date.year = parseInt(str, 10);
    } else {
      let txt = str.replace(/(?<![a-z])[a-z]+\/[a-z]+/i, "");
      txt = txt.replace(/(?<![0-9])[0-9]+:[0-9]+(am|pm)?/i, "");
      let d = new Date(txt);
      if (isNaN(d.getTime()) === false) {
        date.year = d.getFullYear();
        date.month = d.getMonth() + 1;
        date.date = d.getDate();
      }
    }
    const payload = template(date);
    return { data: payload, replacement: str.trim() };
  },
  //just grab the first value, and assume it's a year
  one_year: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["year"]);
    let year = Number(obj.year);
    const payload = template({ year });
    return { data: payload, replacement: String(year) };
  },
  //assume 'y|m|d' | 'y|m|d' // {{BirthDeathAge|B|1976|6|6|1990|8|8}}
  two_dates: (tmpl, parse = parseTextArguments) => {
    let order = ["b", "birth_year", "birth_month", "birth_date", "death_year", "death_month", "death_date"];
    let obj = parse(tmpl, order);
    if (obj.b && obj.b.toLowerCase() === "b") {
      let date2 = ymd([obj.birth_year, obj.birth_month, obj.birth_date]);
      return { data: template(date2), replacement: toText$1(date2) };
    }
    let date = ymd([obj.death_year, obj.death_month, obj.death_date]);
    return { data: template(date), replacement: toText$1(date) };
  },
  age: (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    return { data: null, replacement: diff.years || 0 };
  },
  "diff-y": (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    if (diff.years === 1) {
      return { data: null, replacement: diff.years + " year" };
    }
    return { data: null, replacement: (diff.years || 0) + " years" };
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
    return { data: null, replacement: arr.join(", ") };
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
    return { data: null, replacement: arr.join(", ") };
  },
  "diff-yd": (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
    if (diff.years) {
      arr.push(unit(diff.years, "year"));
    }
    if (diff.yearDays) {
      arr.push(unit(diff.yearDays, "day"));
    }
    return { data: null, replacement: arr.join(", ") };
  },
  "diff-d": (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    return { data: null, replacement: unit(diff.totalDays, "day") };
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
  monthname: (tmpl, parse = parseTextArguments) => {
    const obj = parse(tmpl, ["month"]);
    return { data: null, replacement: months[Number(obj.month) - 1] || "" };
  },
  currentday: () => {
    let d = /* @__PURE__ */ new Date();
    return { data: null, replacement: String(d.getDate()) };
  },
  currentdayname: () => {
    let d = /* @__PURE__ */ new Date();
    return { data: null, replacement: days[d.getDay()] };
  },
  currentmonth: () => {
    let d = /* @__PURE__ */ new Date();
    return { data: null, replacement: months[d.getMonth()] };
  },
  currentyear: () => {
    let d = /* @__PURE__ */ new Date();
    return { data: null, replacement: String(d.getFullYear()) };
  },
  monthyear: () => {
    let d = /* @__PURE__ */ new Date();
    return { data: null, replacement: months[d.getMonth()] + " " + d.getFullYear() };
  },
  "monthyear-1": () => {
    let d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() - 1);
    return { data: null, replacement: months[d.getMonth()] + " " + d.getFullYear() };
  },
  "monthyear+1": () => {
    let d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() + 1);
    return { data: null, replacement: months[d.getMonth()] + " " + d.getFullYear() };
  },
  year: (tmpl, parse = parseTextArguments) => {
    let date = parse(tmpl, ["date"]).date;
    let d = new Date(date);
    if (date && isNaN(d.getTime()) === false) {
      return { data: null, replacement: String(d.getFullYear()) };
    }
    return { data: null, replacement: "" };
  },
  "time ago": (tmpl, parse = parseTextArguments) => {
    let time = parse(tmpl, ["date", "fmt"]).date;
    return { data: null, replacement: timeSince(time) };
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age
  // {{birth date and age|2001|5|3}} → May 3, 2001 (age 25)
  // {{death date and age|2020|5|3|2001|5|3}} → May 3, 2020 (aged 19)
  "birth date and age": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["year", "month", "day", "birth_year", "birth_month", "birth_day"]);
    if (obj.year && /[a-z]/i.test(obj.year)) {
      return parsers.natural_date(tmpl, parse);
    }
    const payload = obj;
    let date = ymd([obj.year, obj.month, obj.day]);
    let str = fmt(date, payload);
    const isDeath = /^death/.test(obj.template || "");
    let from = isDeath ? ymd([obj.birth_year, obj.birth_month, obj.birth_day]) : date;
    let to = date;
    if (!isDeath) {
      let now = /* @__PURE__ */ new Date();
      to = ymd([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
    }
    if (from.year && to.year && date.month) {
      let age = delta(from, to).years || 0;
      str += isDeath ? ` (aged ${age})` : ` (age ${age})`;
    }
    return { data: payload, replacement: str };
  },
  "birth year and age": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["birth_year", "birth_month"]);
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return parsers.natural_date(tmpl, parse);
    }
    const payload = obj;
    let age = (/* @__PURE__ */ new Date()).getFullYear() - parseInt(obj.birth_year, 10);
    obj = ymd([obj.birth_year, obj.birth_month]);
    let str = toText$1(obj);
    if (age) {
      str += ` (age ${age})`;
    }
    return { data: payload, replacement: str };
  },
  "death year and age": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["death_year", "birth_year", "death_month"]);
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return parsers.natural_date(tmpl, parse);
    }
    const payload = obj;
    obj = ymd([obj.death_year, obj.death_month]);
    return { data: payload, replacement: toText$1(obj) };
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age2
  "birth date and age2": (tmpl, parse = parseTextArguments) => {
    let order = ["at_year", "at_month", "at_day", "birth_year", "birth_month", "birth_day"];
    let obj = parse(tmpl, order);
    const payload = obj;
    obj = ymd([obj.birth_year, obj.birth_month, obj.birth_day]);
    return { data: payload, replacement: fmt(obj, payload) };
  },
  //https://en.wikipedia.org/wiki/Template:Birth_based_on_age_as_of_date
  "birth based on age as of date": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["age", "year", "month", "day"]);
    let age = parseInt(obj.age, 10);
    let year = parseInt(obj.year, 10);
    let born = year - age;
    if (born && age) {
      return { data: obj, replacement: `${born} (age ${obj.age})` };
    }
    return { data: obj, replacement: `(age ${obj.age})` };
  },
  //https://en.wikipedia.org/wiki/Template:Death_date_and_given_age
  "death date and given age": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["year", "month", "day", "age"]);
    const payload = obj;
    obj = ymd([obj.year, obj.month, obj.day]);
    let str = fmt(obj, payload);
    if (payload.age) {
      str += ` (aged ${payload.age})`;
    }
    return { data: payload, replacement: str };
  },
  //sortable dates - https://en.wikipedia.org/wiki/Template:Dts
  dts: (tmpl, parse = parseTextArguments) => {
    tmpl = tmpl.replace(/\|format=[ymd]+/i, "");
    tmpl = tmpl.replace(/\|abbr=(on|off)/i, "");
    let obj = parse(tmpl, ["year", "month", "date", "bc"]);
    if (obj.year && obj.month) {
      let date = ymd([obj.year, obj.month, obj.date]);
      let str = toText$1(date);
      if (/^[a-z]{3}$/i.test(obj.month) && obj.date) {
        str = [obj.month, obj.date, obj.year].join(" ");
      }
      if (str) {
        return { data: null, replacement: str };
      }
    }
    if (obj.year) {
      let year = String(obj.year).trim();
      if (/^-\d+$/.test(year)) {
        year = year.replace(/^-/, "") + " BC";
      }
      return { data: null, replacement: year };
    }
    return { data: null, replacement: "" };
  },
  //we can't do timezones, so fake this one a little bit
  //https://en.wikipedia.org/wiki/Template:Time
  time: () => {
    let d = /* @__PURE__ */ new Date();
    let obj = ymd([d.getFullYear(), d.getMonth() + 1, d.getDate()]);
    return { data: null, replacement: toText$1(obj) };
  },
  // https://en.wikipedia.org/wiki/Template:MILLENNIUM
  millennium: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["year"]);
    let year = parseInt(obj.year, 10);
    year = year > 0 ? Math.ceil(year / 1e3) : Math.floor(year / 1e3);
    const era = year < 0 ? " BC" : "";
    const ordinal = toOrdinal(Math.abs(year));
    if (obj.abbr && obj.abbr === "y") {
      return { data: null, replacement: `${ordinal}${era}` };
    }
    return { data: null, replacement: `${ordinal} millennium${era}` };
  },
  // https://en.wikipedia.org/wiki/Template:Date
  date: (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["date", "format"]);
    let str = (obj.date || "").trim();
    let format = (obj.format || "dmy").trim().toLowerCase();
    let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!m || format === "iso" || format === "none") {
      return { data: null, replacement: str };
    }
    let date = { year: Number(m[1]), month: Number(m[2]), date: Number(m[3]) };
    if (format === "y") {
      return { data: null, replacement: String(date.year) };
    }
    if (format === "mdy") {
      return { data: null, replacement: toText$1(date) };
    }
    return { data: null, replacement: toTextBritish(date) };
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
  "as of": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl, ["year", "month", "day"]);
    if (obj.alt) {
      return { data: null, replacement: obj.alt };
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
      format = toText$1;
    }
    let dateObj = ymd([obj.year, obj.month, obj.day]);
    out += format(dateObj);
    if (obj.post) {
      out += obj.post;
    }
    return { data: null, replacement: out };
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
const parseNamedDMS = (value, directions, limit) => {
  if (typeof value !== "string") {
    return null;
  }
  let parts = value.split("/").map((part) => part.trim());
  let hemisphere = parts.at(-1).toLowerCase();
  if (parts.length < 2 || parts.length > 4 || !directions.includes(hemisphere) || hemisphere.length !== 1) {
    return null;
  }
  let numbers = parts.slice(0, -1).map(Number);
  if (!parts[0] || !numbers.every(Number.isFinite) || numbers.some((num) => num < 0)) {
    return null;
  }
  if (numbers.slice(1).some((num) => num >= 60)) {
    return null;
  }
  let result = parseDMS([...numbers, hemisphere]);
  return Math.abs(result) <= limit ? result : null;
};
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
  obj.list ||= [];
  obj.list = obj.list.map((str) => {
    let num = Number(str);
    if (!isNaN(num)) {
      return num;
    }
    let split = str.split(/:/);
    if (split.length > 1) {
      obj.props ||= {};
      obj.props[split[0]] = split.slice(1).join(":");
      return null;
    }
    return str;
  });
  obj.list = obj.list.filter((s) => s !== null);
  return obj;
};
const parseCoor = function(tmpl, parse = parseTextArguments) {
  let obj = parse(tmpl);
  obj = parseParams(obj);
  let tmp = findLatLng(obj.list);
  if (obj.list.length === 0 && (obj.ns !== void 0 || obj.ew !== void 0)) {
    tmp = {
      lat: parseNamedDMS(obj.ns, "ns", 90),
      lon: parseNamedDMS(obj.ew, "ew", 180)
    };
  }
  if (typeof tmp.lat === "number" && !isNaN(tmp.lat)) {
    obj.lat = round(tmp.lat);
  }
  if (typeof tmp.lon === "number" && !isNaN(tmp.lon)) {
    obj.lon = round(tmp.lon);
  }
  obj.template = "coord";
  delete obj.list;
  return obj;
};

const toText = function(obj) {
  if (typeof obj.lat !== "number" || typeof obj.lon !== "number") {
    return "";
  }
  let ns = obj.lat < 0 ? "S" : "N";
  let ew = obj.lon < 0 ? "W" : "E";
  return `${Math.abs(obj.lat)}\xB0${ns} ${Math.abs(obj.lon)}\xB0${ew}`;
};
const templates$2 = {
  coord: (tmpl, parser) => {
    let obj = parseCoor(tmpl, parser);
    if (!obj.display || obj.display.indexOf("inline") !== -1) {
      return { data: obj, replacement: toText(obj) };
    }
    return { data: obj, replacement: "" };
  }
};

const generic = function(tmpl, _parser = parseTextArguments) {
  let obj = _parser(tmpl);
  return { data: obj, replacement: "" };
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
  "election box begin": generic
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
const parseStockExchange = (tmpl, parse = parseTextArguments) => {
  let o = parse(tmpl, ["ticketnumber", "code"]);
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
  return { data: o, replacement: str };
};
const exchanges = {};
Object.keys(codes).forEach((k) => {
  exchanges[k] = parseStockExchange;
});

const langx = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["code", "text", "translit", "lit"]);
  let translit = obj.translit || obj.transliteration || "";
  let lit = obj.lit || obj.translation || "";
  let parts = [obj.text || "", translit];
  if (lit) {
    parts.push(`lit. '${lit}'`);
  }
  parts = parts.filter((s) => s);
  const payload = { template: "langx", lang: obj.code, text: obj.text || "" };
  if (translit) {
    payload.translit = translit;
  }
  if (lit) {
    payload.lit = lit;
  }
  return { data: payload, replacement: parts.join(", ") };
};
const zhOrder = [
  ["c", "Chinese"],
  ["t", "traditional Chinese"],
  ["s", "simplified Chinese"],
  ["p", "pinyin"],
  ["tp", "Tongyong Pinyin"],
  ["w", "Wade\u2013Giles"],
  ["j", "Jyutping"],
  ["cy", "Cantonese Yale"],
  ["poj", "Pe\u030Dh-\u014De-j\u012B"],
  ["l", "lit."]
];
const zh = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl);
  let order = zhOrder;
  if (obj.first === "s") {
    order = zhOrder.filter((a) => a[0] !== "t" && a[0] !== "s");
    order.splice(1, 0, ["s", "simplified Chinese"], ["t", "traditional Chinese"]);
  }
  const noLabels = obj.labels === "no";
  let parts = [];
  order.forEach(([key, label]) => {
    if (!obj[key]) {
      return;
    }
    if (key === "l") {
      parts.push(noLabels ? `'${obj[key]}'` : `lit. '${obj[key]}'`);
      return;
    }
    parts.push(noLabels ? obj[key] : `${label}: ${obj[key]}`);
  });
  return { data: obj, replacement: parts.join("; ") };
};
const koOrder = [
  ["hangul", "Korean"],
  ["hanja", "Hanja"],
  ["rr", "RR"],
  ["mr", "MR"],
  ["yale", "Yale"],
  ["lit", "lit."]
];
const korean = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["hangul", "hanja", "rr", "mr"]);
  const noLabels = obj.labels === "no";
  let parts = [];
  koOrder.forEach(([key, label]) => {
    if (!obj[key]) {
      return;
    }
    if (key === "lit") {
      parts.push(noLabels ? `'${obj[key]}'` : `lit. '${obj[key]}'`);
      return;
    }
    parts.push(noLabels ? obj[key] : `${label}: ${obj[key]}`);
  });
  return { data: obj, replacement: parts.join("; ") };
};
const ruby = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl, ["text", "ruby"]);
  if (obj.ruby) {
    return { data: obj, replacement: `${obj.text || ""} (${obj.ruby})` };
  }
  return { data: obj, replacement: obj.text || "" };
};
const respell = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl);
  let arr = (obj.list || []).map((s) => s === "_" ? " " : s);
  let str = arr.join("-").replace(/-? -?/g, " ");
  return { data: { template: "respell", transcription: str }, replacement: "" };
};
const postNominals = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl);
  let arr = (obj.list || []).filter((s) => s);
  if (obj.post && obj.post !== void 0) {
    arr = obj.post.split(/[, ]+/).filter((s) => s);
  }
  return { data: { template: "post-nominals", list: arr, country: obj.country }, replacement: arr.join(obj.sep || " ") };
};
var languages = {
  langx,
  zh,
  korean,
  ruby,
  respell,
  "post-nominals": postNominals
};

const enc = (str = "") => encodeURIComponent(str).replace(/%2F/g, "/").replace(/%3A/g, ":");
const first = (str = "") => str.charAt(0).toLowerCase();
const displayUrl = (url = "") => url.replace(/^[a-z]+:\/\//i, "").replace(/\/$/, "");
const withScheme = (url = "") => /^[a-z]+:\/\//i.test(url) ? url : `https://${url}`;
const underscore = (str = "") => enc(str.replace(/ /g, "_"));
const idTitle = ["id", "title", "description", "section"];
const idName = ["id", "name"];
const idLabel = (prefix) => (d) => `${prefix}${d.id}`;
const entries = {
  // --- identifiers ---
  doi: { order: ["id"], url: (d) => `https://doi.org/${enc(d.id)}`, label: idLabel("doi:") },
  issn: { order: ["id"], url: (d) => `https://www.worldcat.org/issn/${enc(d.id)}`, label: idLabel("ISSN ") },
  oclc: { order: ["id"], url: (d) => `https://www.worldcat.org/oclc/${enc(d.id)}`, label: idLabel("OCLC ") },
  pmid: { order: ["id"], url: (d) => `https://pubmed.ncbi.nlm.nih.gov/${enc(d.id)}`, label: idLabel("PMID ") },
  pmc: { order: ["id"], url: (d) => `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${enc(d.id)}`, label: idLabel("PMC ") },
  arxiv: { order: ["id"], url: (d) => `https://arxiv.org/abs/${enc(d.id)}`, label: idLabel("arXiv:") },
  bibcode: { order: ["id"], url: (d) => `https://ui.adsabs.harvard.edu/abs/${enc(d.id)}`, label: idLabel("Bibcode:") },
  jstor: { order: ["id"], url: (d) => `https://www.jstor.org/stable/${enc(d.id)}`, label: idLabel("JSTOR ") },
  lccn: { order: ["id"], url: (d) => `https://lccn.loc.gov/${enc(d.id)}`, label: idLabel("LCCN ") },
  mr: { order: ["id"], url: (d) => `https://mathscinet.ams.org/mathscinet-getitem?mr=${enc(d.id)}`, label: idLabel("MR ") },
  zbl: { order: ["id"], url: (d) => `https://zbmath.org/?format=complete&q=an:${enc(d.id)}`, label: idLabel("Zbl ") },
  hdl: { order: ["id"], url: (d) => `https://hdl.handle.net/${enc(d.id)}`, label: idLabel("hdl:") },
  ssrn: { order: ["id"], url: (d) => `https://ssrn.com/abstract=${enc(d.id)}`, label: idLabel("SSRN ") },
  s2cid: { order: ["id"], url: (d) => `https://api.semanticscholar.org/CorpusID:${enc(d.id)}`, label: idLabel("S2CID ") },
  asin: { order: ["id"], url: (d) => `https://www.amazon.com/dp/${enc(d.id)}`, label: idLabel("ASIN ") },
  ol: { order: ["id"], url: (d) => `https://openlibrary.org/books/OL${enc(d.id)}`, label: idLabel("OL ") },
  rfc: { order: ["id"], url: (d) => `https://www.rfc-editor.org/rfc/rfc${enc(d.id)}`, label: idLabel("RFC ") },
  "us patent": {
    order: ["id"],
    url: (d) => `https://patents.google.com/patent/US${enc((d.id || "").replace(/,/g, ""))}`,
    label: idLabel("U.S. patent ")
  },
  oeis: { order: ["id"], url: (d) => `https://oeis.org/${enc(d.id)}`, label: idLabel("OEIS ") },
  "oeis link": { order: ["id"], url: (d) => `https://oeis.org/${enc(d.id)}`, label: (d) => d.id },
  gnis: { order: idName, url: (d) => `https://edits.nationalmap.gov/apps/gaz-domestic/public/summary/${enc(d.id)}`, site: "GNIS" },
  "wikidata entity link": { order: ["id"], url: (d) => `https://www.wikidata.org/wiki/${enc(d.id)}`, label: (d) => d.id },
  // --- film & tv ---
  "imdb title": { order: idTitle, url: (d) => `https://www.imdb.com/title/tt${enc(d.id)}/`, site: "IMDb" },
  "imdb name": { order: idTitle, url: (d) => `https://www.imdb.com/name/nm${enc(d.id)}/`, site: "IMDb" },
  "imdb episode": { order: idTitle, url: (d) => `https://www.imdb.com/title/tt${enc(d.id)}/`, site: "IMDb" },
  "imdb event": { order: idTitle, url: (d) => `https://www.imdb.com/event/ev${enc(d.id)}/`, site: "IMDb" },
  "afi film": { order: idTitle, url: (d) => `https://catalog.afi.com/Catalog/moviedetails/${enc(d.id)}`, site: "the AFI Catalog of Feature Films" },
  "allmovie title": { order: idTitle, url: (d) => `https://www.allmovie.com/movie/v${enc(d.id)}`, site: "AllMovie" },
  "tcmdb title": { order: idTitle, url: (d) => `https://www.tcm.com/tcmdb/title/${enc(d.id)}/`, site: "the TCM Movie Database" },
  "rotten tomatoes": {
    order: ["id", "title"],
    url: (d) => `https://www.rottentomatoes.com/${d.type === "tv" ? "tv" : "m"}/${enc(d.id)}`,
    site: "Rotten Tomatoes"
  },
  "metacritic film": { order: ["id", "title"], url: (d) => `https://www.metacritic.com/movie/${enc(d.id)}`, site: "Metacritic" },
  "mojo title": { order: ["id", "title"], url: (d) => `https://www.boxofficemojo.com/title/${enc(d.id)}/`, site: "Box Office Mojo" },
  allgame: { order: idTitle, url: () => null, site: "AllGame" },
  // --- music ---
  "discogs artist": { order: idTitle, url: (d) => `https://www.discogs.com/artist/${enc(d.id)}`, site: "Discogs" },
  "discogs label": { order: idTitle, url: (d) => `https://www.discogs.com/label/${enc(d.id)}`, site: "Discogs" },
  "discogs release": { order: idTitle, url: (d) => `https://www.discogs.com/release/${enc(d.id)}`, site: "Discogs" },
  "discogs master": { order: idTitle, url: (d) => `https://www.discogs.com/master/${enc(d.id)}`, site: "Discogs" },
  "musicbrainz artist": { order: idTitle, url: (d) => `https://musicbrainz.org/artist/${enc(d.id || d.mbid)}`, site: "MusicBrainz" },
  "musicbrainz label": { order: idTitle, url: (d) => `https://musicbrainz.org/label/${enc(d.id || d.mbid)}`, site: "MusicBrainz" },
  "musicbrainz recording": { order: idTitle, url: (d) => `https://musicbrainz.org/recording/${enc(d.id || d.mbid)}`, site: "MusicBrainz" },
  "musicbrainz release": { order: idTitle, url: (d) => `https://musicbrainz.org/release/${enc(d.id || d.mbid)}`, site: "MusicBrainz" },
  "musicbrainz work": { order: idTitle, url: (d) => `https://musicbrainz.org/work/${enc(d.id || d.mbid)}`, site: "MusicBrainz" },
  allmusic: {
    order: ["id", "label"],
    url: (d) => `https://www.allmusic.com/${enc(d.class || "artist")}/${enc(d.id)}`,
    label: (d, title) => d.label || d.title || title || d.id,
    site: "AllMusic"
  },
  // --- books & reference ---
  "goodreads book": { order: idTitle, url: (d) => `https://www.goodreads.com/book/show/${enc(d.id)}`, site: "Goodreads" },
  "goodreads author": { order: idName, url: (d) => `https://www.goodreads.com/author/show/${enc(d.id)}`, site: "Goodreads" },
  "librivox author": { order: idTitle, url: (d) => `https://librivox.org/author/${enc(d.id)}`, site: "LibriVox" },
  gutenberg: {
    order: ["no", "name"],
    url: (d) => d.no ? `https://www.gutenberg.org/ebooks/${enc(d.no)}` : null,
    label: (d, title) => d.name || title || d.no || "",
    site: "Project Gutenberg"
  },
  "gutenberg author": { order: idName, url: (d) => `https://www.gutenberg.org/ebooks/author/${enc(d.id)}`, site: "Project Gutenberg" },
  worldcat: { order: idName, url: (d) => `https://www.worldcat.org/identities/${enc(d.id)}`, site: "WorldCat" },
  "worldcat id": { order: idName, url: (d) => `https://www.worldcat.org/identities/${enc(d.id)}`, site: "WorldCat" },
  britannica: { order: ["id", "title"], url: (d) => `https://www.britannica.com/${d.id || ""}`, site: "Encyclop\xE6dia Britannica" },
  dmoz: {
    order: idTitle,
    url: (d) => `https://curlie.org/${d.id || ""}`,
    // 'Society/Politics/Anarchism/' → 'Anarchism'
    label: (d, title) => d.title || title || (d.id || "").replace(/\/$/, "").split("/").pop() || "",
    site: "Curlie"
  },
  mathworld: { order: ["id", "title"], url: (d) => `https://mathworld.wolfram.com/${enc(d.id || d.urlname)}.html`, site: "MathWorld" },
  springereom: { order: ["id", "title"], url: (d) => `https://encyclopediaofmath.org/wiki/${enc(d.id)}`, site: "the Encyclopedia of Mathematics" },
  mactutor: {
    order: ["id", "title"],
    url: (d) => `https://mathshistory.st-andrews.ac.uk/Biographies/${enc(d.id)}/`,
    site: "the MacTutor History of Mathematics Archive"
  },
  planetmath: { order: ["urlname", "title"], url: (d) => `https://planetmath.org/${enc(d.urlname)}`, site: "PlanetMath" },
  // --- people ---
  "find a grave": {
    order: ["id", "name", "work", "last", "first", "date", "accessdate"],
    url: (d) => `https://www.findagrave.com/memorial/${enc(d.id)}`,
    site: "Find a Grave"
  },
  congbio: {
    order: ["id", "name", "date"],
    url: (d) => `https://bioguide.congress.gov/search/bio/${enc(d.id)}`,
    site: "the Biographical Directory of the United States Congress"
  },
  "c-span": { order: idName, url: (d) => `https://www.c-span.org/person/?${enc(d.id)}`, site: "C-SPAN" },
  "ted speaker": { order: idName, url: (d) => `https://www.ted.com/speakers/${enc(d.id)}`, site: "TED" },
  playmate: { order: idName, url: () => null },
  // --- social ---
  twitter: { order: idName, url: (d) => `https://twitter.com/${enc(d.id)}`, site: "Twitter", joiner: "on" },
  facebook: { order: idName, url: (d) => `https://www.facebook.com/${enc(d.id)}`, site: "Facebook", joiner: "on" },
  instagram: { order: idName, url: (d) => `https://www.instagram.com/${enc(d.id)}/`, site: "Instagram", joiner: "on" },
  tumblr: { order: idName, url: (d) => `https://${enc(d.id)}.tumblr.com`, site: "Tumblr", joiner: "on" },
  pinterest: { order: idName, url: (d) => `https://www.pinterest.com/${enc(d.id)}/`, site: "Pinterest", joiner: "on" },
  youtube: {
    order: idTitle,
    url: (d) => {
      if (d.u || d.user) {
        return `https://www.youtube.com/user/${enc(d.u || d.user)}`;
      }
      if (d.c || d.channel) {
        return `https://www.youtube.com/channel/${enc(d.c || d.channel)}`;
      }
      if (d.id) {
        return `https://www.youtube.com/watch?v=${enc(d.id)}`;
      }
      return null;
    },
    label: (d, title) => {
      if (d.u || d.user || d.c || d.channel) {
        return d.title || d.name || d.id || title || "";
      }
      return d.title || d.name || title || d.id || "";
    },
    site: "YouTube",
    joiner: "on"
  },
  // --- sports ---
  "espn nfl": { order: idName, url: (d) => `https://www.espn.com/nfl/player/_/id/${enc(d.id)}`, site: "ESPN" },
  "espn nhl": { order: idName, url: (d) => `https://www.espn.com/nhl/player/_/id/${enc(d.id)}`, site: "ESPN" },
  "espn fc": { order: idName, url: (d) => `https://www.espn.com/soccer/player/_/id/${enc(d.id)}`, site: "ESPN" },
  hockeydb: { order: idName, url: (d) => `https://www.hockeydb.com/ihdb/stats/pdisplay.php?pid=${enc(d.id)}`, site: "the Internet Hockey Database" },
  "nfl player": { order: idName, url: (d) => `https://www.nfl.com/players/${enc(d.id)}/`, site: "NFL.com" },
  "fifa player": { order: idName, url: () => null, site: "FIFA" },
  "baseball-reference": {
    order: idName,
    url: (d) => `https://www.baseball-reference.com/players/${first(d.id)}/${enc(d.id)}.shtml`,
    site: "Baseball-Reference.com"
  },
  "basketball-reference": {
    order: idName,
    url: (d) => `https://www.basketball-reference.com/players/${first(d.id)}/${enc(d.id)}.html`,
    site: "Basketball-Reference.com"
  },
  "pro-football-reference": {
    order: idName,
    url: (d) => `https://www.pro-football-reference.com/players/${first(d.id).toUpperCase()}/${enc(d.id)}.htm`,
    site: "Pro-Football-Reference.com"
  },
  "hockey-reference": {
    order: idName,
    url: (d) => `https://www.hockey-reference.com/players/${first(d.id)}/${enc(d.id)}.html`,
    site: "Hockey-Reference.com"
  },
  soccerbase: { order: idName, url: (d) => `https://www.soccerbase.com/players/player.sd?player_id=${enc(d.id)}`, site: "Soccerbase" },
  soccerway: { order: idName, url: (d) => `https://int.soccerway.com/players/${enc(d.id)}/`, site: "Soccerway" },
  olympedia: { order: idName, url: (d) => `https://www.olympedia.org/athletes/${enc(d.id)}`, site: "Olympedia" },
  // --- link wrappers ---
  // {{URL|http://www.example.com|Example}} - https://en.wikipedia.org/wiki/Template:URL
  url: {
    order: ["url", "text"],
    url: (d) => d.url ? withScheme(d.url.trim()) : null,
    label: (d) => d.text || displayUrl(d.url || "")
  },
  "official website": {
    order: ["url", "name"],
    url: (d) => d.url ? withScheme(d.url.trim()) : null,
    label: (d) => d.name || "Official website"
  },
  plainlink: {
    order: ["url", "text"],
    url: (d) => d.url ? withScheme(d.url.trim()) : null,
    label: (d) => d.text || d.name || displayUrl(d.url || "")
  },
  // {{webarchive|url=https://web.archive.org/web/2020/http://x.com|date=2020-01-01}}
  webarchive: { order: ["url", "date", "title"], url: (d) => d.url || null, label: () => "Archived" },
  // {{wayback|url=http://x.com|date=20200101}}
  wayback: {
    order: ["url", "title", "date"],
    url: (d) => d.url ? `https://web.archive.org/web/${d.date || ""}/${d.url}` : null,
    label: () => "Archived"
  },
  // --- sister projects, as external links ---
  "wikisource-inline": {
    order: ["title", "text"],
    url: (d, title) => `https://en.wikisource.org/wiki/${underscore(d.title || title)}`,
    label: (d, title) => d.text || d.title || title,
    site: "Wikisource"
  },
  wikt: {
    order: ["word", "text"],
    url: (d) => `https://en.wiktionary.org/wiki/${enc(d.word || "")}`,
    label: (d) => d.text || d.word || ""
  },
  "commons category-inline": {
    order: ["category", "text"],
    url: (d, title) => `https://commons.wikimedia.org/wiki/Category:${underscore(d.category || title)}`,
    label: (d, title) => d.text || d.category || title,
    site: "Wikimedia Commons"
  },
  "wikiquote-inline": {
    order: ["title", "text"],
    url: (d, title) => `https://en.wikiquote.org/wiki/${underscore(d.title || title)}`,
    label: (d, title) => d.text || d.title || title,
    site: "Wikiquote"
  }
};

const fmtDate = (str = "") => str.replace(/^(\d{4})(\d{2})(\d{2}).*$/, "$1-$2-$3");
const archiveSite = (url = "") => {
  if (/archive\.(today|is|ph|li|fo|md|vn)/.test(url)) {
    return "archive.today";
  }
  if (/webcitation\.org/.test(url)) {
    return "WebCite";
  }
  return "the Wayback Machine";
};
const bibleverse = (tmpl, parse = parseTextArguments) => {
  let obj = parse(tmpl);
  let arr = (obj.list || []).map((s) => s.trim());
  let num = "";
  if (/^[123]?$/.test(arr[0] || "")) {
    num = arr.shift() || "";
  }
  let [book = "", verse = "", version = ""] = arr;
  let ref = `${num} ${book} ${verse}`.trim().replace(/\s+/g, " ");
  if (!book) {
    return { data: obj, replacement: "" };
  }
  let url = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}`;
  if (version) {
    url += `&version=${encodeURIComponent(version)}`;
  }
  return { data: { book: `${num} ${book}`.trim(), verse, version, ref }, replacement: `[${url} ${ref}]` };
};
const makeHandler = (name, entry) => {
  return (tmpl, parse = parseTextArguments, opts = {}) => {
    let obj = parse(tmpl, entry.order);
    let d = { ...obj };
    if (!d.id && d.mbid) {
      d.id = d.mbid;
    }
    let title = opts.title || "";
    let label = entry.label ? entry.label(d, title) : d.name || d.title || title || d.id || "";
    let url = null;
    try {
      url = d.id || !entry.order.includes("id") ? entry.url(d, title) : null;
      if (!url && (d.u || d.user || d.c || d.channel)) {
        url = entry.url(d, title);
      }
    } catch {
      url = null;
    }
    let str = label;
    if (url && label) {
      str = `[${url} ${label}]`;
    }
    if (name === "webarchive" || name === "wayback") {
      let date = fmtDate(d.date || "");
      str = [str, date, `at ${archiveSite(d.url || "")}`].filter((s) => s).join(" ");
      if (d.title && name === "webarchive") {
        str = `${d.title} ${str}`;
      }
    } else if (entry.site && label) {
      str += ` ${entry.joiner || "at"} ${entry.site}`;
    }
    return { data: obj, replacement: str };
  };
};
let templates$1 = { bibleverse };
Object.keys(entries).forEach((name) => {
  templates$1[name] = makeHandler(name, entries[name]);
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
const playoffBracket = function(tmpl, parse = parseTextArguments) {
  let rounds = [];
  let obj = parse(tmpl);
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
  "4teambracket": function(tmpl, parser) {
    let obj = playoffBracket(tmpl, parser);
    return { data: obj, replacement: "" };
  },
  "win draw lose": function(tmpl, parse = parseTextArguments) {
    let obj = parse(tmpl);
    let arr = obj.list || [];
    let draw = parseInt(arr[2], 10) || 0;
    let lose = parseInt(arr[3], 10) || 0;
    let win = parseInt(arr[1], 10) || 0;
    let total = win + draw + lose;
    let winPercentage = "";
    if (total > 0) {
      winPercentage = (win / total * 100).toFixed(1);
    }
    return { data: obj, replacement: "\n| " + arr.join("\n| ") + "\n| " + winPercentage + "%" };
  },
  // https://en.wikipedia.org/wiki/Template:Win–loss_record
  // {{win-loss record|w=5|l=3|t=1}} → 5–3–1
  "win-loss record": function(tmpl, parse = parseTextArguments) {
    let obj = parse(tmpl, ["w", "l", "t"]);
    let arr = [obj.w || 0, obj.l || 0];
    if (obj.t || obj.d) {
      arr.push(obj.t || obj.d);
    }
    return { data: obj, replacement: arr.join("\u2013") };
  },
  player: (tmpl, parse = parseTextArguments) => {
    let res = parse(tmpl, ["number", "country", "name", "dl"]);
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
    return { data: res, replacement: str };
  },
  //https://en.wikipedia.org/wiki/Template:Goal
  goal: (tmpl, parse = parseTextArguments) => {
    let res = parse(tmpl);
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
    let summary = "\u26BD ";
    summary += obj.data.map((o) => {
      let note = o.note;
      if (note) {
        note = ` (${note})`;
      }
      return o.min + "'" + note;
    }).join(", ");
    return { data: obj, replacement: summary };
  },
  //a transcluded sports module - https://en.m.wikipedia.org/w/index.php?title=Special:WhatLinksHere/Module:Sports_table
  // https://en.wikipedia.org/wiki/Template:2020–21_NHL_North_Division_standings
  "sports table": (tmpl, parse = parseTextArguments) => {
    let obj = parse(tmpl);
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
    return { data: res, replacement: "" };
  },
  // college baseketball rosters
  "cbb roster/header": function() {
    return {
      data: null,
      replacement: `{| class="wikitable"
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
`
    };
  },
  "cbb roster/player": function(tmpl, parse = parseTextArguments) {
    let data = parse(tmpl);
    return {
      data,
      replacement: `|-
| ${data.pos || ""}
| ${data.num || ""}
| ${data.first || ""} ${data.last || ""}
| ${data.ft || ""}${data.in || ""}
| ${data.lbs || ""}
| ${data.class || ""}
| ${data.high_school || ""}
| ${data.home || ""}
`
    };
  },
  "cbb roster/footer": function() {
    return { data: null, replacement: `
|}` };
  }
};

var bothTmpl = {
  ...shorthand,
  ...templates$4,
  ...templates$3,
  ...dates,
  ...templates$2,
  ...misc,
  ...exchanges,
  ...languages,
  ...templates$1,
  ...playoffBracket,
  ...sports
};

const as = (handler, kind) => {
  const fn = (...args) => handler(...args);
  fn.kind = kind;
  return fn;
};
const byLang = {
  fr: {
    monnaie: as(templates$3.currency, "currency"),
    unit\u00E9: as(templates$3.currency, "currency"),
    nombre: as(templates$3.currency, "currency"),
    nb: as(templates$3.currency, "currency"),
    iso4217: as(templates$3.currency, "currency")
  },
  es: {
    "cita requerida": as(dataFns["citation needed"], "citation needed")
  },
  it: {
    "citazione necessaria": as(dataFns["citation needed"], "citation needed")
  },
  pt: {
    pbpe: 0
    // https://pt.wikipedia.org/wiki/Predefinição:PBPE - português brasileiro/europeu
  },
  eu: {
    egiptekas: "{|-\n"
  }
};
const byProject = {
  wikinews: {
    byline: as(parsers.date, "date"),
    dateline: as(parsers.date, "date"),
    source: as(misc.citation, "citation"),
    "source-pr": as(misc.citation, "citation"),
    "source-science": as(misc.citation, "citation")
  }
};
var i18n = { byLang, byProject };

let templates = { ...textTmpl, ...dataTmpl, ...bothTmpl };
Object.keys(templates).forEach((key) => {
  if (typeof templates[key] !== "function") {
    templates[key] = parseShortcut.bind(null, templates[key]);
  }
});
const builtins = new Set(Object.values(templates));
[...Object.values(byLang), ...Object.values(byProject)].forEach((overlay) => {
  Object.values(overlay).forEach((handler) => {
    if (typeof handler === "function") {
      builtins.add(handler);
    }
  });
});
Object.keys(aliases$1).forEach((k) => {
  if (templates[aliases$1[k]] === void 0) {
    console.error(`Missing template: '${aliases$1[k]}'`);
  }
});
const resolve = (name, opts = {}) => {
  const overlays = [byProject[opts.project], byLang[opts.lang]];
  for (const overlay of overlays) {
    if (overlay && Object.hasOwn(overlay, name)) {
      return { handler: overlay[name], name };
    }
  }
  if (Object.hasOwn(templates, name)) {
    return { handler: templates[name], name };
  }
  const target = aliases$1[name];
  if (target !== void 0 && Object.hasOwn(templates, target)) {
    return { handler: templates[target], name: target };
  }
  return null;
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
const ignore$1 = new Set(list);

const parseArguments$1 = (opts, text, order = [], format) => {
  const args = parseArguments$2(text, order, opts);
  if (format === "block" || format === "raw" || format === "json") {
    return args;
  }
  return simplifyArguments(args);
};
const runCustomParser = (handler, wiki, opts) => {
  const parse = parseArguments$1.bind(null, opts);
  if (typeof handler !== "function") {
    return parseShortcut(handler, wiki, parse);
  }
  const results = [];
  const replacement = handler(wiki, results, parse, null, opts);
  return { data: results[0] || null, replacement: replacement ?? "" };
};

const parseArguments = (opts, wiki, order = []) => parseTextArguments(wiki, order, opts);
const runParser = (handler, wiki, opts) => {
  let result;
  if (builtins.has(handler)) {
    result = handler(wiki, parseArguments.bind(null, opts), opts);
  } else {
    result = runCustomParser(handler, wiki, opts);
  }
  return { data: result.data ?? null, replacement: String(result.replacement ?? "") };
};

const rawName = (wiki) => {
  wiki = wiki.trim();
  const tag = wiki.match(/^<([a-z]+)/i);
  if (tag) {
    return tag[1].toLowerCase();
  }
  return wiki.replace(/^\{\{/, "").split(/[|}\n]/, 1)[0].trim();
};
const makeResult = (wiki, kind, data, replacement = "", opts) => {
  const result = {
    template: rawName(wiki),
    kind,
    wiki,
    text: fromText(String(replacement), opts).text,
    data
  };
  let remaining = wiki;
  const renderedLinks = parse_links(String(replacement), opts) || [];
  renderedLinks.forEach((link) => {
    remaining = remaining.replace(link.wiki, "");
  });
  const links = parse_links(remaining, opts);
  if (links?.length) {
    result.links = links;
  }
  return result;
};

const finish = (wiki, kind, payload, opts, replacement = "") => {
  if (!payload) {
    return { replacement, result: null };
  }
  const { template: _template, ...data } = payload;
  return { replacement, result: makeResult(wiki, kind, data, replacement, opts) };
};
const parseTemplate = (wiki, name, opts = defaults$1) => {
  if (isInfobox(name)) {
    const payload2 = parseArguments$2(wiki, [], opts);
    const normalized = Object.fromEntries(Object.entries(payload2).map(([key, value]) => [normalizeKey(key), value]));
    return finish(wiki, "infobox", normalized, opts);
  }
  if (ignore$1.has(name)) {
    return { replacement: "", result: null };
  }
  if (/^cite [a-z]/.test(name)) {
    const cite = resolve(name, opts);
    const payload2 = cite?.handler != null ? runParser(cite.handler, wiki, opts).data : parseTextArguments(wiki, [], opts);
    return finish(wiki, "citation", payload2, opts);
  }
  const found = resolve(name, opts);
  if (!found || found.handler === null || found.handler === void 0) {
    const payload2 = parseTextArguments(wiki, [], opts);
    return finish(wiki, null, Object.keys(payload2).length > 0 ? payload2 : null, opts);
  }
  const handler = found.handler;
  const { replacement, data: payload } = runParser(handler, wiki, opts);
  let kind = handler.kind || found.name;
  if (payload?.template && payload.template !== name) {
    kind = fmtName(payload.template);
  }
  return finish(wiki, kind, payload, opts, replacement);
};

const replaceInAncestors = (node, body, replacement) => {
  if (node.parent) {
    node.parent.body = node.parent.body.replace(body, () => replacement);
    replaceInAncestors(node.parent, body, replacement);
  }
};
const evaluateNode = (node, parent, state, opts) => {
  node.parent = parent;
  const children = node.children;
  for (let i = 0; i < children.length; i += 1) {
    evaluateNode(children[i], node, state, opts);
  }
  const { replacement, result } = parseTemplate(node.body, node.parserName, opts);
  if (result) {
    result.wiki = node.wiki;
    state.templates.push(result);
  }
  const argumentValue = String(replacement).replace(/=/g, "&#61;");
  replaceInAncestors(node, node.body, argumentValue);
  const output = parent ? argumentValue : replacement;
  state.remaining = state.remaining.replace(node.body, () => output);
};

const allTemplates = (wiki, opts) => {
  const roots = findTemplates(wiki);
  const state = { templates: [], remaining: wiki };
  for (let i = 0; i < roots.length; i += 1) {
    evaluateNode(roots[i], null, state, opts);
  }
  return state;
};

const process = (wiki, opts = defaults$1) => {
  const { templates, remaining } = allTemplates(wiki, opts);
  const { infoboxes, references, others } = sortOut(templates);
  return {
    infoboxes,
    references,
    templates: others,
    remaining
  };
};

const referencePattern = / ?<ref>(.{0,4000}?)<\/ref> ?| ?<ref\b[^>]{0,200}?\/> ?| ?<ref [^>]{0,200}>(.{0,1800}?)<\/ref> ?/gis;
const namePattern = /\bname\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s/>]+))/i;
const groupPattern = /\bgroup\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s/>]+))/i;
const attribute = (tag, pattern) => {
  const match = tag.match(pattern);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? "";
};
const nameReg = /^ *\{\{ *([^|}\n]+)/;
const isCitationName = (str) => {
  const name = str.match(nameReg)?.[1].trim().toLowerCase() || "";
  return /^(cite|citation)/.test(name) || templates[name]?.kind === "citation";
};
const hasCitation = (str) => {
  return isCitationName(str) && /\}\} *$/.test(str) && /citation needed/i.test(str) === false;
};
const parseBody = (text, wiki, opts = defaults$1) => {
  let prose = text;
  const references = findFlat(text).filter(hasCitation).map((template) => {
    prose = prose.replace(template, "");
    const name = template.match(nameReg)?.[1].trim().toLowerCase() || "";
    const payload = Object.hasOwn(templates, name) ? runParser(templates[name], template, opts).data : parseTextArguments(template, [], opts);
    const { template: _template, ...data } = payload || {};
    const result = makeResult(template, "citation", data, "", opts);
    result.wiki = wiki;
    return result;
  });
  if (references.length === 0) {
    references.push(makeResult(wiki, "reference", { inline: fromText(text, opts) }, "", opts));
  } else {
    const links = parse_links(prose, opts) || [];
    if (links.length) {
      references[0].links = [...references[0].links || [], ...links];
    }
  }
  return references;
};
const extractReferences = (source, opts = defaults$1) => {
  const citations = [];
  const named = /* @__PURE__ */ new Map();
  const wiki = source.replace(referencePattern, (tag, plain, attributed) => {
    const opening = tag.slice(0, tag.indexOf(">") + 1);
    const name = attribute(opening, namePattern);
    const group = attribute(opening, groupPattern);
    const key = JSON.stringify([group, name]);
    const body = plain ?? attributed;
    const reuse = body === void 0;
    const references = reuse ? [] : parseBody(body, tag, opts);
    references.forEach((ref) => {
      if (name) {
        ref.name = name;
      }
      if (group) {
        ref.group = group;
      }
    });
    if (name && !reuse) {
      named.set(key, references);
    }
    citations.push({ references, key, name, reuse, plain: plain !== void 0 });
    return " ";
  });
  citations.forEach((citation) => {
    if (citation.name && citation.reuse) {
      citation.references = named.get(citation.key) || [];
    }
  });
  return { wiki, citations };
};

const heading_reg = /^(=+)(.{1,200}?)(=+)$/;
const parseHeading = function(heading, opts = defaults$1) {
  let [_, prefix, title, suffix] = heading.match(heading_reg) || [];
  if (!prefix || !title) {
    return { block: fromText("", opts), depth: 0, references: [] };
  }
  const level = Math.min(prefix.length, suffix.length, 6);
  title = "=".repeat(prefix.length - level) + title + "=".repeat(suffix.length - level);
  let depth = Math.max(level - 2, 0);
  const { wiki, citations } = extractReferences(title.trim(), opts);
  const references = citations.filter((c) => !c.reuse).flatMap((c) => c.references);
  const { remaining } = process(wiki.trim(), opts);
  const block = fromText(remaining.trim(), opts);
  block.wiki = heading;
  return { block, depth, references };
};

const section_reg = /(?:\n|^)(={1,6}.{1,200}?={1,6})[ \t]*(?=\n|$)/g;
const parseSections = function(pageWiki, opts = defaults$1) {
  let sections = [];
  let index = 0;
  let splits = pageWiki.split(section_reg);
  for (let i = 0; i < splits.length; i += 2) {
    let heading = splits[i - 1] || "";
    let wiki = splits[i] || "";
    if (wiki === "" && heading === "") {
      continue;
    }
    let { block, depth, references } = parseHeading(heading, opts);
    let section = {
      title: block,
      depth,
      wiki,
      index,
      remaining: wiki,
      templates: [],
      tables: [],
      infoboxes: [],
      references,
      paragraphs: []
    };
    sections.push(section);
    index += 1;
  }
  return sections;
};

const parseComments = (page) => {
  let wiki = page.remaining;
  wiki = wiki.replace(/<!--.{0,3000}?-->/gs, (match) => {
    page.comments = page.comments || [];
    page.comments.push(match);
    return "";
  });
  page.remaining = wiki;
  return page;
};

const parsePage = function(wiki, opts = defaults$1) {
  let page = { wiki, remaining: wiki, sections: [], comments: [], categories: [] };
  if (isRedirect(wiki)) {
    page.isRedirect = true;
    page.redirectTo = parseRedirect(wiki, opts);
    page = parse_categories(page);
    return page;
  }
  page = parseComments(page);
  page = parse_categories(page);
  page.sections = parseSections(page.remaining, opts);
  return page;
};

const parseElection = function(section, opts = defaults$1) {
  section.remaining = section.remaining.replace(/\{\{election box begin(.+?)\{\{election box end\}\}/gis, (tmpl) => {
    const { templates } = process(tmpl, opts);
    const start = templates.find((t) => t.kind === "election box begin");
    let candidates = templates.filter((t) => t.kind === "election box candidate");
    const summary = templates.find((t) => t.kind === "election box gain" || t.kind === "election box hold");
    if (candidates.length > 0 || summary) {
      const data = { title: start?.data.title, candidates, summary: summary?.data };
      section.templates.push(makeResult(tmpl, "election box", data, "", opts));
    }
    return "";
  });
  return section;
};

const namespace = new RegExp(`^(?:${images.join("|")}):`, "i");
const parseGallery = function(section, opts = defaults$1) {
  section.remaining = section.remaining.replace(/<gallery([^>]*)>(.*?)<\/gallery>/gs, (wiki, _attrs, inside) => {
    let lines = inside.split(/\n/g);
    lines = lines.filter((str) => str && str.trim() !== "");
    lines = lines.map((str) => {
      str = str.trim();
      if (!namespace.test(str)) {
        str = `File:${str}`;
      }
      return parseImgString(`[[${str}]]`, opts);
    }).filter(Boolean);
    if (lines.length > 0) {
      section.templates.push(makeResult(wiki, "gallery", { pos: section.title, images: lines }, "", opts));
    }
    return "";
  });
  return section;
};

const parseMath = function(section, opts = defaults$1) {
  section.remaining = section.remaining.replace(/<math([^>]*)>(.*?)<\/math>/gs, (wiki, attrs, inside) => {
    let formula = fromText(inside, opts).text;
    const replacement = formula && formula.length < 12 ? formula : "";
    section.templates.push(makeResult(wiki, "math", { formula }, replacement, opts));
    if (formula && formula.length < 12) {
      return formula;
    }
    return "";
  });
  section.remaining = section.remaining.replace(/<chem([^>]*)>(.*?)<\/chem>/gs, (wiki, attrs, inside) => {
    section.templates.push(makeResult(wiki, "chem", { formula: inside }, "", opts));
    return "";
  });
  return section;
};

const splitLines = (wiki) => {
  return wiki.replace(/\r/g, "").replace(/\n\s*/g, (space, offset, text) => {
    const next = text[offset + space.length];
    return next && !"|!{".includes(next) ? " " + space.slice(1) : space;
  }).split(/\n/).map((l) => l.trim());
};

const cleanup = function(lines) {
  lines = lines.filter((line) => {
    return line && /^\|\+/.test(line) !== true;
  });
  if (/^\{\|/.test(lines[0]) === true) {
    lines.shift();
  }
  if (/^\|\}/.test(lines.at(-1)) === true) {
    lines.pop();
  }
  return lines;
};
const findRows = function(lines) {
  let rows = [];
  let row = [];
  lines = cleanup(lines);
  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    if (/^\|-/.test(line) === true) {
      if (row.length > 0) {
        rows.push(row);
        row = [];
      }
      let attrs = line.replace(/^\|-+/, "").trim();
      if (attrs) {
        row.attrs = attrs;
      }
    } else {
      let startChar = line.charAt(0);
      if (startChar !== "|" && startChar !== "!" && row.length > 0) {
        row[row.length - 1] = `${row[row.length - 1]} ${line.trim()}`.trim();
        continue;
      }
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

const isHeading = /^!/;
const removeMidSpans = function(rows) {
  if (rows.every((row) => row.length === 1)) {
    return rows;
  }
  rows = rows.filter((row) => {
    if (row.length === 1 && row[0] && isHeading.test(row[0]) && /rowspan/i.test(row[0]) === false) {
      return false;
    }
    return true;
  });
  return rows;
};

const getRowSpan = /^.*rowspan *= *["']?([0-9]+)["']?[ |]*/m;
const getColSpan = /^.*colspan *= *["']?([0-9]+)["']?[ |]*/m;
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

const cleanText = function(str) {
  const pipe = str.indexOf("|");
  const bracket = str.indexOf("[");
  if (pipe !== -1 && (bracket === -1 || pipe < bracket)) {
    str = str.replace(/^.*?\| ?/m, "");
  }
  str = str.replace(/style=['"].*?["']/, "");
  str = str.replace(/^!/, "");
  str = str.trim();
  return str;
};

const skipSpanRow = function(row) {
  row ||= [];
  let len = row.length;
  let hasTxt = row.filter((str) => str).length;
  if (len - hasTxt > 3) {
    return true;
  }
  return false;
};

const findHeaders = function(rows = [], opts) {
  let headers = [];
  if (skipSpanRow(rows[0])) {
    rows.shift();
  }
  let first = rows[0];
  if (first?.length && first.some((cell) => /^!/.test(cell))) {
    headers = first.map((h) => {
      h = h.replace(/^! */, "");
      h = cleanText(h);
      return fromText(h, opts);
    });
    rows.shift();
  }
  first = rows[0];
  if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
    first.forEach((h, i) => {
      h = h.replace(/^! */, "");
      h = cleanText(h);
      if (Boolean(h) === true) {
        headers[i] = fromText(h, opts);
      }
    });
    rows.shift();
  }
  return headers;
};

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
const firstRowHeader = function(rows, opts) {
  if (rows.length <= 3) {
    return [];
  }
  let headers = rows[0].slice(0);
  headers = headers.map((h) => {
    h = h.replace(/^! */, "");
    h = cleanText(h);
    return fromText(h, opts);
  });
  for (let i = 0; i < headers.length; i += 1) {
    if (Object.hasOwn(headings$1, headers[i].text.toLowerCase())) {
      rows.shift();
      return headers;
    }
  }
  return [];
};

const extractHeaders = (rows, opts) => {
  let headers = findHeaders(rows, opts);
  if (!headers || headers.length === 0) {
    headers = firstRowHeader(rows, opts);
    let want = rows.at(-1) || [];
    if (headers.length <= 1 && want.length > 2) {
      headers = firstRowHeader(rows.slice(1), opts);
      if (headers.length > 0) {
        rows = rows.slice(2);
      }
    }
  }
  return { headers, rows };
};

const parseRow = function(arr, headers, opts) {
  let row = {};
  arr.forEach((str, i) => {
    let h = headers[i]?.text || "col" + (i + 1);
    h = normalizeKey(h);
    let s = fromText(str, opts);
    s.text = cleanText(s.text);
    row[h] = s;
  });
  if (arr.attrs) {
    Object.defineProperty(row, "_attrs", { value: arr.attrs, enumerable: false });
  }
  return row;
};

const parseTable = (wiki, opts) => {
  const lines = splitLines(wiki);
  let rows = findRows(lines).filter((row) => row);
  if (rows.length === 0) {
    return {};
  }
  rows = removeMidSpans(rows);
  rows = handleSpans(rows);
  const table = extractHeaders(rows, opts);
  return {
    headers: table.headers,
    rows: table.rows.map((row) => parseRow(row, table.headers, opts))
  };
};

const keys = {
  coach: ["team", "year", "g", "w", "l", "w-l%", "finish", "pg", "pw", "pl", "pw-l%"],
  player: ["year", "team", "gp", "gs", "mpg", "fg%", "3p%", "ft%", "rpg", "apg", "spg", "bpg", "ppg"],
  roster: ["player", "gp", "gs", "mpg", "fg%", "3fg%", "ft%", "rpg", "apg", "spg", "bpg", "ppg"]
};
const parseNBA = function(section, opts = defaults$1) {
  section.remaining = section.remaining.replace(
    /\{\{nba (coach|player|roster) statistics start(.+?)\{\{s-end\}\}/gis,
    (tmpl, name) => {
      const wiki = tmpl;
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, "");
      tmpl = tmpl.replace(/\{\{s-end\}\}/, "");
      name = name.toLowerCase().trim();
      let headers = "! " + keys[name].join(" !! ");
      let table = "{|\n" + headers + "\n" + tmpl + "\n|}";
      let rows = parseTable(table, opts).rows || [];
      rows = rows.map((row) => {
        Object.keys(row).forEach((k) => {
          row[k] = row[k].text;
        });
        return row;
      });
      section.templates.push(makeResult(wiki, "nba " + name + " statistics", { rows }, "", opts));
      return "";
    }
  );
  return section;
};

let headings = ["res", "record", "opponent", "method", "event", "date", "round", "time", "location", "notes"];
const parseMMA = function(section, opts = defaults$1) {
  section.remaining = section.remaining.replace(/\{\{mma record start.+?\{\{end\}\}/gis, (tmpl) => {
    const wiki = tmpl;
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, "");
    tmpl = tmpl.replace(/\{\{end\}\}/i, "");
    let headers = "! " + headings.join(" !! ");
    let table = "{|\n" + headers + "\n" + tmpl + "\n|}";
    let rows = parseTable(table, opts).rows || [];
    rows = rows.map((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text;
      });
      return row;
    });
    section.templates.push(makeResult(wiki, "mma record start", { rows }, "", opts));
    return "";
  });
  return section;
};

const openReg$1 = /\{\{ *(?:mlb +)?game log (?:section|month)(?: start)? *[|}]/i;
const closeReg$1 = /\{\{ *(?:mlb +)?game log (?:section|month) end *\}\}/i;
const templateEnd = function(str, start) {
  let depth = 0;
  for (let i = start; i < str.length - 1; i += 1) {
    if (str[i] === "{" && str[i + 1] === "{") {
      depth += 1;
      i += 1;
    } else if (str[i] === "}" && str[i + 1] === "}") {
      depth -= 1;
      i += 1;
      if (depth === 0) {
        return i + 1;
      }
    }
  }
  return -1;
};
const splitParams = function(str) {
  const params = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < str.length; i += 1) {
    const c = str[i];
    if (c === "{" || c === "[") {
      depth += 1;
    } else if (c === "}" || c === "]") {
      depth -= 1;
    }
    if (c === "|" && depth === 0) {
      params.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  params.push(current);
  return params;
};
const legacyHeadings = function(named) {
  const headings = ["#", "date", "opponent", "score", "win", "loss", "save", "attendance", "record"];
  if (named.stadium === "y") {
    headings.splice(7, 0, "stadium");
  }
  if (named.time === "y") {
    headings.splice(7, 0, "time");
  }
  if (named.box === "y") {
    headings.push("box");
  }
  return headings;
};
const parseOpener = function(inner) {
  const named = {};
  const positional = [];
  splitParams(inner).slice(1).forEach((p) => {
    const m = p.match(/^ *([a-z][\w-]*) *=([\s\S]*)/i);
    if (m) {
      named[m[1].toLowerCase()] = m[2].trim();
    } else if (p.trim()) {
      positional.push(p.trim());
    }
  });
  return { named, positional };
};
const simplifyRows = function(rows) {
  return rows.map((row) => {
    const out = {};
    let links = null;
    Object.keys(row).forEach((k) => {
      out[k] = row[k].text || "";
      const cellLinks = row[k].links;
      if (cellLinks && cellLinks[0] && cellLinks[0].page) {
        links = links || {};
        links[k] = cellLinks[0].page;
      }
    });
    if (links) {
      out.rowLinks = links;
    }
    if (row._attrs) {
      out.rowAttrs = row._attrs;
    }
    return out;
  });
};
const parseLog = function(wiki, section, opts) {
  const open = wiki.match(openReg$1);
  const inner = wiki.slice(open.index + 2, templateEnd(wiki, open.index) - 2);
  const { named, positional } = parseOpener(inner);
  const headings = positional.length > 1 ? positional : legacyHeadings(named);
  let rowText = wiki.slice(templateEnd(wiki, open.index)).replace(closeReg$1, "");
  rowText = rowText.replace(/<\/?(?:span|small|big|sup|sub|center|[biu])[^>]*>/gi, "");
  const parsed = process(rowText, opts);
  section.templates.push(...parsed.templates);
  section.references.push(...parsed.references);
  rowText = parsed.remaining;
  const table = "{|\n! " + headings.join(" !! ") + "\n" + rowText + "\n|}";
  const rows = simplifyRows(parseTable(table, opts).rows || []);
  const data = { rows };
  if (named.title || named.month) {
    data.title = named.title || named.month;
  }
  return data;
};
const parseGameLogs = function(section, opts = defaults$1) {
  let text = section.remaining;
  let out = "";
  let open = text.match(openReg$1);
  while (open) {
    const close = text.match(closeReg$1);
    if (!close || close.index < open.index) {
      break;
    }
    const end = close.index + close[0].length;
    const wiki = text.slice(open.index, end);
    section.templates.push(makeResult(wiki, "game log section", parseLog(wiki, section, opts), "", opts));
    out += text.slice(0, open.index);
    text = text.slice(end);
    open = text.match(openReg$1);
  }
  section.remaining = out + text;
  return section;
};

const xmlTemplates = function(section, opts = defaults$1) {
  section = parseElection(section, opts);
  section = parseGallery(section, opts);
  section = parseMath(section, opts);
  section = parseGameLogs(section, opts);
  section = parseMMA(section, opts);
  section = parseNBA(section, opts);
  return section;
};

const ignore = [
  "table",
  "code",
  "score",
  "data",
  "categorytree",
  "charinsert",
  "hiero",
  "imagemap",
  "inputbox",
  "source",
  "syntaxhighlight",
  "timeline",
  "maplink"
];
const openTag = `< ?(${ignore.join("|")}) ?[^>]{0,200}>`;
const closeTag = `< ?/ ?(${ignore.join("|")}) ?>`;
const anyChar = "\\s\\S";
const noThanks = new RegExp(`${openTag}[${anyChar}]{1,40000}?${closeTag}`, "gi");
const parseHtml = function(section, _opts) {
  let wiki = section.remaining;
  const toTemplate = function(match, replace, kind = "html") {
    if (match) {
      section.templates.push({ template: "html", kind, text: "", data: null, wiki: match });
    }
    return replace;
  };
  wiki = wiki.replace(/<nowiki\s*\/>|<nowiki\s*>([\s\S]*?)<\/nowiki\s*>/gi, (match, inner = "") => {
    const replacement = inner.replace(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/g, (m) => `&#${m.charCodeAt(0)};`);
    return toTemplate(match, replacement);
  });
  wiki = wiki.replace(noThanks, (m) => toTemplate(m, " "));
  wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=%.\-#:;'" ]{2,100}\/? ?> ?/g, (m) => toTemplate(m, " "));
  wiki = wiki.replace(/<i>(.*?)<\/i>/g, (m, inner) => toTemplate(m, `''${inner}''`));
  wiki = wiki.replace(/<b>(.*?)<\/b>/g, (m, inner) => toTemplate(m, `'''${inner}'''`));
  wiki = wiki.replace(/<sub>(.*?)<\/sub>/g, `{{sub|$1}}`);
  wiki = wiki.replace(/<sup>(.*?)<\/sup>/g, `{{sup|$1}}`);
  wiki = wiki.replace(/<blockquote>(.*?)<\/blockquote>/g, `{{blockquote|text=$1}}`);
  wiki = wiki.replace(
    / ?<[ /]?(p|sub|sup|span|div|table|br|tr|td|th|pre|pre2|hr|u)[ /]?> ?/g,
    (m) => toTemplate(m, " ")
  );
  wiki = wiki.replace(
    / ?<[ /]?(abbr|bdi|bdo|cite|del|dfn|em|ins|kbd|mark|q|s|small)[ /]?> ?/g,
    (m) => toTemplate(m, " ")
  );
  wiki = wiki.replace(/ ?<[ /]?h[0-9][ /]?> ?/g, (m) => toTemplate(m, " "));
  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, (m) => toTemplate(m, "\n"));
  section.remaining = wiki.trim();
  return section;
};

const parseRefs = (section, opts = defaults$1) => {
  let { wiki, citations } = extractReferences(section.remaining, opts);
  const seen = /* @__PURE__ */ new Set();
  const definitions = citations.filter((citation) => {
    if (citation.reuse) {
      return false;
    }
    if (citation.name) {
      if (seen.has(citation.key)) {
        return false;
      }
      seen.add(citation.key);
    }
    return true;
  });
  definitions.sort((a, b) => Number(b.plain) - Number(a.plain));
  section.references = [...section.references, ...definitions.flatMap((citation) => citation.references)];
  wiki = wiki.replace(/<\/?references\b[^>]*>/gi, "");
  wiki = wiki.replace(/ ?<[ /]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ /]?> ?/g, (found) => {
    section.templates.push({ template: "html", kind: "html", text: " ", data: null, wiki: found });
    return " ";
  });
  section.remaining = wiki;
  return section;
};

const parseLiterals = (section) => {
  let wiki = section.remaining;
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, function(match) {
    section.templates.push({ template: match, kind: "literal", text: "", data: null, wiki: match });
    return "";
  });
  wiki = wiki.replace(/~{2,3}/g, function(match) {
    section.templates.push({ template: "signature", kind: "literal", text: "", data: null, wiki: match });
    return "";
  });
  wiki = wiki.replaceAll("----", function(match) {
    section.templates.push({ template: "horizontal-rule", kind: "literal", text: "", data: null, wiki: match });
    return "";
  });
  section.remaining = wiki;
  return section;
};

const sectionTemplates = (section, opts = defaults$1) => {
  section = parseLiterals(section);
  const { infoboxes, references, templates, remaining } = process(section.remaining, opts);
  section.infoboxes = infoboxes;
  section.references.push(...references);
  section.templates.push(...templates);
  section.remaining = remaining;
  return section;
};

const openReg = /^\s*\{\|/;
const closeReg = /^\s*\|\}/;
const findTables = function(section, opts) {
  let list = [];
  let wiki = section.remaining;
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
      const { headers, rows } = parseTable(str, opts);
      if (rows && rows.length > 0) {
        const table = {
          wiki: str,
          rows,
          headers
        };
        tables.push(table);
      }
    }
  });
  if (tables.length > 0) {
    section.tables = tables;
  }
  section.remaining = wiki;
  return section;
};

const list_reg = /^[#*:;|]+/;
const bullet_reg = /^\*+[^:,|]{4}/;
const number_reg = /^ ?#+[^:,|#*;]/;
const isList = function(line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line);
};
const cleanList = function(lines, opts = defaults$1) {
  let numbers = [];
  const list = [];
  lines = lines.filter((l) => l);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.match(number_reg)) {
      const depth = line.match(/^ ?(#+)/)[1].length - 1;
      numbers = numbers.slice(0, depth + 1);
      numbers[depth] = (numbers[depth] || 0) + 1;
      line = line.replace(/^ ?#+/, numbers[depth] + ") ");
      line = line + "\n";
    } else if (line.match(list_reg)) {
      if (!line.startsWith("#")) {
        numbers = [];
      }
      line = line.replace(list_reg, "");
    }
    const item = fromText(line, opts);
    item.wiki = lines[i];
    list.push(item);
  }
  return list;
};
const grabList = function(lines, i, opts = defaults$1) {
  let subset = [];
  for (let o = i; o < lines.length; o++) {
    if (isList(lines[o])) {
      subset.push(lines[o]);
    } else {
      break;
    }
  }
  return cleanList(subset, opts);
};

const findLists = function(paragraph, opts) {
  let wiki = paragraph.remaining;
  let lines = wiki.split(/\n/g);
  let lists = [];
  let theRest = [];
  for (let i = 0; i < lines.length; i++) {
    if (isList(lines[i])) {
      let sub = grabList(lines, i, opts);
      if (sub.length > 0) {
        const source = lines.slice(i, i + sub.length).join("\n");
        i += sub.length - 1;
        sub = sub.filter((s) => s.text !== "");
        lists.push({ items: sub, wiki: source });
      }
    } else {
      theRest.push(lines[i]);
    }
  }
  paragraph.lists = lists;
  paragraph.remaining = theRest.join("\n");
  return paragraph;
};

const opener = "[";
const closer = "]";
function nested_find(text) {
  const out = [];
  let open = 0;
  let start = -1;
  let openCount = 0;
  let closeCount = 0;
  const len = text.length;
  for (let i = 0; i < len; i++) {
    if (start === -1) {
      i = text.indexOf(opener, i);
      if (i === -1) {
        break;
      }
    }
    const c = text[i];
    if (c === opener) {
      if (start === -1) {
        start = i;
        openCount = 0;
        closeCount = 0;
      }
      open += 1;
      openCount += 1;
    } else if (c === closer) {
      open -= 1;
      if (open < 0) {
        open = 0;
      }
      closeCount += 1;
    }
    if (open === 0 && start !== -1) {
      let found = text.slice(start, i + 1);
      if (openCount > closeCount) {
        found += closer;
      }
      out.push(found);
      start = -1;
    }
  }
  return out;
}

const isFile = new RegExp("(" + images.join("|") + "):", "i");
const findImages = function(paragraph, opts = defaults$1) {
  let wiki = paragraph.remaining;
  let matches = nested_find(wiki);
  matches.forEach(function(s) {
    if (isFile.test(s) === true) {
      paragraph.images ||= [];
      let img = parseImgString(s, opts);
      if (img) {
        paragraph.images.push(img);
        wiki = wiki.replace(s, "");
      }
    }
  });
  paragraph.remaining = wiki;
  return paragraph;
};

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
const elipses_reg = /(?:^|[^.])\.{3,} +$/;
const circa_reg = / c\.\s$/;
const hasWord = /\p{Letter}/iu;
const hasEnding = /[.!?。？！]["'’)」』]*\s*$/;
const colonEnding = /[:;][^\S\n]*\n\s*$/;
const splitPunctuation = function(text) {
  const sentence = /(\S.+?(?:[.!?]["'’)]*(?=\s|$)|[。？！]["'’)」』]*))/y;
  let splits = [];
  let end = 0;
  for (const line of text.matchAll(/[^\r\n\u2028\u2029]+/g)) {
    let offset = 0;
    while (offset < line[0].length) {
      const leading = line[0].slice(offset).search(/\S/);
      if (leading === -1) {
        break;
      }
      const start = offset + leading;
      sentence.lastIndex = start;
      const match = sentence.exec(line[0]);
      if (!match) {
        break;
      }
      splits.push(text.slice(end, line.index + start), match[1]);
      offset = sentence.lastIndex;
      end = line.index + offset;
    }
  }
  splits.push(text.slice(end));
  return splits;
};
const naiive_split = function(text) {
  let splits = text.split(/(\n+)/);
  splits = splits.filter((s) => s);
  return splits.flatMap(splitPunctuation);
};
const isBalanced = function(str) {
  str ||= "";
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
const sentence_parser = function(text, _opts = defaults$1) {
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
    if (hasEnding.test(hmm) === false && colonEnding.test(hmm) === false) {
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
    sentences = [text];
  }
  return sentences.map((str) => str.replace(/\n\s*/g, " ").replace(/ {2,}/g, " "));
};

const findSentences = function(paragraph, opts = defaults$1) {
  let sentences = sentence_parser(paragraph.remaining, opts);
  sentences = sentences.map((text) => fromText(text, opts));
  if (sentences[0] && sentences[0].text && sentences[0].text[0] === ":") {
    sentences = sentences.slice(1);
  }
  paragraph.sentences = sentences;
  return paragraph;
};

const twoNewLines = /\r?\n[ \t]*\r?\n/;
const splitAfterLists = function(str) {
  const lines = str.split(/\n/);
  const chunks = [[]];
  for (let i = 0; i < lines.length; i++) {
    const prev = lines[i - 1];
    if (i > 0 && isList(prev) && !isList(lines[i]) && lines[i].trim() !== "") {
      chunks.push([]);
    }
    chunks[chunks.length - 1].push(lines[i]);
  }
  return chunks.map((c) => c.join("\n"));
};
const parseParagraphs = function(section, opts = defaults$1) {
  let wiki = section.remaining;
  let paragraphs = wiki.split(twoNewLines).flatMap(splitAfterLists);
  paragraphs = paragraphs.filter((p) => p && p.trim().length > 0);
  section.paragraphs = paragraphs.map((str) => {
    let paragraph = {
      wiki: str,
      remaining: str,
      lists: [],
      sentences: [],
      images: []
    };
    paragraph = findLists(paragraph, opts);
    paragraph = findImages(paragraph, opts);
    paragraph = findSentences(paragraph, opts);
    return paragraph;
  });
  section.remaining = wiki;
  return section;
};

const parseSection = (section, opts = defaults$1) => {
  section = xmlTemplates(section, opts);
  section = parseHtml(section);
  section = parseRefs(section, opts);
  section = sectionTemplates(section, opts);
  section = findTables(section, opts);
  section = parseParagraphs(section, opts);
  return section;
};

const parse = function(input, opts = {}) {
  opts = withDefaults(opts);
  let data = parsePage(input, opts);
  data.sections = data.sections.map((section) => parseSection(section, opts));
  delete data.remaining;
  data.sections.forEach((section) => {
    delete section.remaining;
    section.paragraphs.forEach((paragraph) => {
      delete paragraph.remaining;
    });
  });
  return data;
};

const parseDoc = function(res, title) {
  const results = (res ?? []).filter((o) => o != null).map((o) => {
    const data = parse(o.wiki ?? "", o.meta);
    return new Document(data, o.meta);
  });
  return isArray(title) ? results : results[0] ?? null;
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
  lang: defaults$1.lang,
  wiki: defaults$1.project,
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
  const project = normalizeProject(options?.project ?? options?.wiki ?? defaults$1.project);
  options = { ...defaults, ...options, wiki: project, project };
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
    const found = results.flat();
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

const wtf = function(wiki, info) {
  const data = parse(wiki, info);
  return new Document(data, info);
};
const models = {
  Doc: Document,
  Section,
  Paragraph,
  Image,
  Infobox,
  Link,
  List,
  Reference,
  Table,
  Template,
  Block,
  http: request,
  wtf
};
wtf.fetch = function(title, options, cb) {
  return fetchPage(title, options, cb);
};
wtf.extend = function(fn) {
  fn(models, templates, infoboxes$1, i18n);
  refreshWrappers();
  return this;
};
wtf.plugin = wtf.extend;
wtf.version = version;

export { wtf as default };
