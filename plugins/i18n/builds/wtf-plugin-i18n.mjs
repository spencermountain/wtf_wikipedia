/* wtf-plugin-i18n 0.0.1  MIT */
function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

var list = ['birth_date_and_age', 'citation', 'cite_book', 'cite_journal', 'cite_web', 'commons_cat', 'coord', 'flag', 'flagicon', 'formatnum', 'ipa', 'isbn', 'main', 'portal', 'reflist', 'sfn', 'small', 'start_date', 'taxobox'];
var mapping = list.reduce(function (h, str) {
  h[str] = commonjsRequire();
  return h;
}, {});

var plugin = function plugin(models, templates) {
  Object.keys(mapping).forEach(function (k) {
    mapping[k].forEach(function (name) {
      templates[name] = templates[k];
    });
  });
};

var src = plugin;

export default src;
