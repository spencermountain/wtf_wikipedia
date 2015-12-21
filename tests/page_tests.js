var path = require('path');
var fs = require("fs");
var should = require("should");
var parser = require("../src/index").parse;

//read cached file
var fetch = function(file) {
  return fs.readFileSync(path.join(__dirname, "cache", file + ".txt"), 'utf-8');
};


describe('full page tests', function() {

  it('royal_cinema', function(done) {
    var data = parser(fetch("royal_cinema"));
    data.infobox.opened.text.should.equal(1939);
    data.infobox_template.should.equal('venue');
    data.text.Intro.length.should.equal(10);
    data.categories.length.should.equal(4);
    done();
  });

  it('toronto_star', function(done) {
    var data = parser(fetch("toronto_star"));
    data.infobox.publisher.text.should.equal('John D. Cruickshank');
    data.infobox_template.should.equal('newspaper');
    data.text.History.length.should.equal(21);
    data.categories.length.should.equal(6);
    done();
  })

  it('jodie_emery', function(done) {
    var data = parser(fetch("jodie_emery"));
    data.infobox.nationality.text.should.equal('Canadian');
    data.infobox_template.should.equal('person');
    (data.text.Intro.length >= 1).should.be.true;
    (data.text['Political career'].length >= 5).should.be.true;
    data.categories.length.should.equal(8);
    data.images.length.should.equal(1);
    done();
  })

  it('redirect', function(done) {
    var data = parser(fetch("redirect"));
    data.type.should.equal('redirect');
    data.redirect.should.equal('Toronto');
    (data.infobox === null).should.be.true;
    (data.infobox_template === null).should.be.true;
    done();
  })

  it('statoil', function(done) {
    var data = parser(fetch("statoil"));
    data.infobox.namn.text.should.equal('Statoil ASA');
    data.infobox_template.should.equal('verksemd');
    (data.text.Intro.length >= 1).should.be.true;
    data.categories.length.should.equal(4);
    data.images.length.should.equal(1);
    data.images[0].should.equal('Fil:Statoil-Estonia.jpg');
    done();
  })

})