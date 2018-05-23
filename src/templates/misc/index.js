// const parseCitation = require('./citation');
// const parseGeo = require('../geo');
const keyValue = require('../parsers/key-value');
const getInside = require('../parsers/inside');
const pipeSplit = require('../parsers/pipeSplit');
const pipeList = require('../parsers/pipeList');
const sisterProjects = require('./sisters');

const parsers = {
  main: (tmpl) => {
    let obj = getInside(tmpl);
    return {
      template: 'main',
      page: obj.data
    };
  },
  wide_image: (tmpl) => {
    let obj = getInside(tmpl);
    return {
      template: 'wide_image',
      image: obj.data
    };
  },

  //https://en.wikipedia.org/wiki/Template:IMDb_title
  imdb: (tmpl) => {
    let order = ['id', 'title', 'description', 'section'];
    return pipeSplit(tmpl, order);
  },
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': (tmpl) => {
    let order = ['taxon', 'item'];
    return pipeSplit(tmpl, order);
  },

  //same in every language.
  citation: (tmpl) => {
    let data = keyValue(tmpl);
    return {
      template: 'citation',
      data: data
    };
  },
  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl) => {
    let order = ['id', 'name', 'type'];
    let obj = pipeSplit(tmpl, order);
    obj.template = 'citation';
    obj.type = 'gnis';
    return obj;
  },
  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': (tmpl) => {
    let data = keyValue(tmpl);
    let links = {};
    Object.keys(sisterProjects).forEach((k) => {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k].text();
      }
    });
    return {
      template: 'sister project links',
      links: links
    };
  },

  //https://en.wikipedia.org/wiki/Template:Subject_bar
  'subject bar': (tmpl) => {
    let data = keyValue(tmpl);
    Object.keys(data).forEach((k) => {
      data[k] = data[k].text();
      if (sisterProjects.hasOwnProperty(k)) {
        data[sisterProjects[k]] = data[k];
        delete data[k];
      }
    });
    return {
      template: 'subject bar',
      links: data
    };
  },
  'book bar': pipeList,

};
//aliases
parsers['cite'] = parsers.citation;

module.exports = parsers;
