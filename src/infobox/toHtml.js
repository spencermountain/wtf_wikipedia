const dontDo = require('./_skip-keys');
const setDefaults = require('../_lib/setDefaults');
const defaults = {
  images: true,
};

//
const infobox = function(obj, options) {
  options = setDefaults(options, defaults);
  let html = '<table class="infobox">\n';
  html += '  <thead>\n';
  html += '  </thead>\n';
  html += '  <tbody>\n';
  //put image and caption on the top
  if (options.images === true && obj.data.image) {
    html += '    <tr>\n';
    html += '       <td colspan="2" style="text-align:center">\n';
    html += '       ' + obj.image().html() + '\n';
    html += '       </td>\n';
    if (obj.data.caption || obj.data.alt) {
      let caption = obj.data.caption ? obj.data.caption.html(options) : obj.data.alt.html(options);
      html += '       <td colspan="2" style="text-align:center">\n';
      html += '         ' + caption + '\n';
      html += '       </td>\n';
    }
    html += '    </tr>\n';
  }
  Object.keys(obj.data).forEach((k) => {
    if (dontDo[k] === true) {
      return;
    }
    let s = obj.data[k];
    let key = k.replace(/_/g, ' ');
    key = key.charAt(0).toUpperCase() + key.substring(1); //titlecase it
    let val = s.html(options);
    html += '    <tr>\n';
    html += '      <td>' + key + '</td>\n';
    html += '      <td>' + val + '</td>\n';
    html += '    </tr>\n';
  });
  html += '  </tbody>\n';
  html += '</table>\n';
  return html;
};
module.exports = infobox;
