// wikipedia special terms lifted and augmented from parsoid parser april 2015
// (not even close to being complete)
let i18n = {
  files: [
    'файл',
    'fitxer',
    'soubor',
    'datei',
    'file',
    'archivo',
    'پرونده',
    'tiedosto',
    'mynd',
    'su\'wret',
    'fichier',
    'bestand',
    'датотека',
    'dosya',
    'fil'
  ],
  images: ['image'],
  templates: [
    'шаблён',
    'plantilla',
    'šablona',
    'vorlage',
    'template',
    'الگو',
    'malline',
    'snið',
    'shablon',
    'modèle',
    'sjabloon',
    'шаблон',
    'şablon'
  ],
  categories: [
    'катэгорыя',
    'categoria',
    'kategorie',
    'category',
    'categoría',
    'رده',
    'luokka',
    'flokkur',
    'kategoriya',
    'catégorie',
    'categorie',
    'категорија',
    'kategori',
    'kategoria',
    'تصنيف'
  ],
  redirects: [
    'перанакіраваньне',
    'redirect',
    'přesměruj',
    'weiterleitung',
    'redirección',
    'redireccion',
    'تغییر_مسیر',
    'تغییرمسیر',
    'ohjaus',
    'uudelleenohjaus',
    'tilvísun',
    'aýdaw',
    'айдау',
    'redirection',
    'doorverwijzing',
    'преусмери',
    'преусмјери',
    'yönlendi̇rme',
    'yönlendi̇r',
    '重定向',
    'redirección',
    'redireccion',
    '重定向',
    'yönlendirm?e?',
    'تغییر_مسیر',
    'تغییرمسیر',
    'перанакіраваньне',
    'yönlendirme'
  ],
  specials: [
    'спэцыяльныя',
    'especial',
    'speciální',
    'spezial',
    'special',
    'ویژه',
    'toiminnot',
    'kerfissíða',
    'arnawlı',
    'spécial',
    'speciaal',
    'посебно',
    'özel'
  ],
  users: [
    'удзельнік',
    'usuari',
    'uživatel',
    'benutzer',
    'user',
    'usuario',
    'کاربر',
    'käyttäjä',
    'notandi',
    'paydalanıwshı',
    'utilisateur',
    'gebruiker',
    'корисник',
    'kullanıcı'
  ],
  disambigs: [
    'disambig', //en
    'disambiguation', //en
    'dab', //en
    'disamb', //en
    'begriffsklärung', //de
    'ujednoznacznienie', //pl
    'doorverwijspagina', //nl
    '消歧义', //zh
    'desambiguación', //es
    'dubbelsinnig', //af
    'disambigua', //it
    'desambiguação', //pt
    'homonymie', //fr
    'неоднозначность', //ru
    'anlam ayrımı' //tr
  ],
  infoboxes: [
    'infobox',
    'ficha',
    'канадский',
    'inligtingskas',
    'inligtingskas3', //af
    'لغة',
    'bilgi kutusu', //tr
    'yerleşim bilgi kutusu',
    'infoboks' //nn, no
  ],
  sources: [
    //blacklist these headings, as they're not plain-text
    'references',
    'see also',
    'external links',
    'further reading',
    'notes et références',
    'voir aussi',
    'liens externes'
  ]
};

let dictionary = {};
Object.keys(i18n).forEach(k => {
  i18n[k].forEach(w => {
    dictionary[w] = true;
  });
});
i18n.dictionary = dictionary;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = i18n;
}
