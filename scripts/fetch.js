'use strict';
var wtf = require('../tests/lib');
wtf.fetch('Normen,_Metriken,_Topologie', 'dewikiversity', {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}, function(err, doc) {
  if (err) {
    t.throw(err);
  }
  //console.log("doc.latex()-Call:\n"+doc.latex());
  console.log("doc.html()-Call:\n"+doc.html());
});
