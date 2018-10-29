'use strict';
var test = require('tape');
var wtf = require('./lib');

test('infobox', function(t) {
  var str = `
  {{Infobox settlement
  | name = New York City
  | official_name                   = City of New York
  | settlement_type                 = [[City]]
  | named_for                       = [[James II of England|James, Duke of York]]
  | coordinates                     = {{coord|40.7127|N|74.0059|W|region:US-NY|format=dms|display=inline,title}}
  }}

  The '''City of New York''', often called '''New York City'''
  `;
  var arr = wtf(str).infoboxes();
  t.equal(arr.length, 1, 'have one infobox');
  t.end();
});
