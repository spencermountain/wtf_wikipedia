const geo = require('./geo');
const misc = require('./misc');
const pronounce = require('./pronounce');
const external = require('./external');

module.exports = Object.assign({}, geo, pronounce, misc, external);
