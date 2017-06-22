'use strict';
const Hashes = require('jshashes');
//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F

const make_image = function(file) {
  let title = file.replace(/^(image|file?)\:/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');

  let hash = new Hashes.MD5().hex(title);
  let path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/';
  title = encodeURIComponent(title);
  path += title;
  let server = 'https://upload.wikimedia.org/wikipedia/commons/';
  let thumb = '/300px-' + title;
  return {
    url: server + path,
    file: file,
    thumb: server + 'thumb/' + path + thumb
  };
};

module.exports = make_image;

// console.log(make_image('Spelterini_Blüemlisalp.jpg'));
// console.log(make_image('Charlatans.jpg'));
// make_image('File:Abingdonschool.jpg');
//1e44ecfe85c6446438da2a01a2bf9e4c
