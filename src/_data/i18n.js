// wikipedia special terms lifted and augmented from parsoid parser april 2015
// and then manually on March 2020
module.exports = {
  categories: require('./categories'),
  disambig: require('./disambig'),
  images: require('./images'),
  infoboxes: require('./infoboxes'),
  redirects: require('./redirects'),
  references: require('./references')

  // specials: [
  //   'спэцыяльныя',
  //   'especial',
  //   'speciální',
  //   'spezial',
  //   'special',
  //   'ویژه',
  //   'toiminnot',
  //   'kerfissíða',
  //   'arnawlı',
  //   'spécial',
  //   'speciaal',
  //   'посебно',
  //   'özel',
  //   '特別'
  // ],
  // users: [
  //   'удзельнік',
  //   'usuari',
  //   'uživatel',
  //   'benutzer',
  //   'user',
  //   'usuario',
  //   'کاربر',
  //   'käyttäjä',
  //   'notandi',
  //   'paydalanıwshı',
  //   'utilisateur',
  //   'gebruiker',
  //   'корисник',
  //   'kullanıcı',
  //   '利用者'
  // ],
  // sources: [
  //   //blacklist these headings, as they're not plain-text
  //   'references',
  //   'see also',
  //   'external links',
  //   'further reading',
  //   'notes et références',
  //   'voir aussi',
  //   'liens externes',
  //   '参考文献', //references (ja)
  //   '脚注', //citations (ja)
  //   '関連項目', //see also (ja)
  //   '外部リンク' //external links (ja)
  // ]
}
