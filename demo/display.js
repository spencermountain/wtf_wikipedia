$(window).ready(function() {
  $('#version').html(wtf.version);

  var make_list = function(arr) {
    arr = arr || [];
    return arr.reduce(function(str, o) {
      return (str += '<li>' + o + '</li>');
    }, '');
  };
  var makeImg = function(arr) {
    arr = arr || [];
    return arr.reduce(function(str, o) {
      return (str += '<img style="width:100px;" src="' + o.url + '"/>');
    }, '');
  };
  var makeInfoboxes = function(arr) {
    arr = arr || [];
    return arr.reduce(function(str, o) {
      let values = Object.keys(o.data)
        .map(k => {
          return '<div>' + k + ' : &nbsp; <span style="color:lightsteelblue;">' + o.data[k].text + '</span></div>';
        })
        .join('');
      str += '<div><div style="color:#DE6169;">' + o.template + ':</div><ul>' + values + '</ul></div>';
      return str;
    }, '');
  };
  var makeSections = function(arr) {
    return arr.reduce(function(str, o) {
      let title = o.title || ' <sub>(intro)</sub>';
      let lists = o.lists || [];
      let tables = o.lists || [];
      let info =
        '<div style="color:steelblue;">' +
        o.sentences.length +
        ' sentences - - ' +
        tables.length +
        ' tables - - ' +
        lists.length +
        ' lists </div>';
      return (str += '<div><h4 style="color:#DE6169;">' + title + ':</h4><ul>' + info + '</ul></div>');
    }, '');
  };
  var parse = function() {
    var wikiscript = $('#wikiscript').val();
    var text = wtf.plaintext(wikiscript);
    $('#text').html(text);
    var obj = wtf.parse(wikiscript);
    console.log(obj);
    $('#infobox').html('<ul>' + makeInfoboxes(obj.infoboxes || []) + '</ul>');
    $('#sections').html('<ul>' + makeSections(obj.sections) + '</ul>');
    $('#categories').html('<ul>' + make_list(obj.categories) + '</ul>');
    $('#images').html('<ul>' + makeImg(obj.images) + '</ul>');
    $('#infobox').html(JSON.stringify(obj.infobox, null, 2));
  };

  var el = document.getElementById('wikiscript');
  parse();

  var pages = Object.keys(window.demo_pages).reduce(function(str, p) {
    return str + '<a href="#" class="page">' + p + '</a>';
  }, '');
  $('#pages').html(pages);

  $('.page').click(function(e) {
    console.log(e.target.text);
    var str = e.target.text;
    el.value = window.demo_pages[str];
    parse();
  });

  $('#fetch').on('click', function() {
    var title = $('#title').val();
    console.log('fetching ' + title);
    wtf.from_api(title, function(wiki) {
      $('#wikiscript').val(wiki);
      parse();
    });
  });

  el.addEventListener('input', parse, false);
  // $('.page:first').click();
  $('#fetch').click();
});
