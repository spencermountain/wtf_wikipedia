const external = require('./external-links');
const geo = require('./geo');
const wikipedia = require('./wikipedia-cruft');
const pronounce = require('./pronounce');
const misc = require('./misc');

module.exports = Object.assign({}, geo, misc, pronounce, wikipedia, external);
