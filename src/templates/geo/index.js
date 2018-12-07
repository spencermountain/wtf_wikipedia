const parseCoor = require('./coor');

const templates = {
  coord: (tmpl, r) => {
    let obj = parseCoor(tmpl);
    r.templates.push(obj);
    return '';
  }
};
// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}
templates['coor'] = templates.coord;
// these are from the nl wiki
templates['coor title dms'] = templates.coord;
templates['coor title dec'] = templates.coord;
templates['coor dms'] = templates.coord;
templates['coor dm'] = templates.coord;
templates['coor dec'] = templates.coord;
module.exports = templates;
