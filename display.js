$(window).ready(function() {
  $('#version').html('(' + wtf.version + ')');

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
      var values = Object.keys(o.data)
        .map(k => {
          return (
            '<div style="color:lightgrey;">' +
            k +
            ' : &nbsp; <span style="color:lightsteelblue;">' +
            o.data[k].text +
            '</span></div>'
          );
        })
        .join('');
      str += '<div><div style="color:#DBADB4;">' + o.template + ':</div><ul>' + values + '</ul></div>';
      return str;
    }, '');
  };
  var makeSections = function(arr) {
    return arr.reduce(function(str, o) {
      var title = o.title || ' <sub>(intro)</sub>';
      var lists = o.lists || [];
      var links = [];
      o.sentences.forEach(function(s) {
        if (s.links) {
          s.links.forEach(l => links.push('[' + l.page + ']'));
        }
      });
      lists.forEach(list => {
        list.forEach(row => {
          (row.links || []).forEach(l => links.push('[' + l.page + ']'));
        });
      });
      var info = '<div style="color:steelblue;">';
      if (o.sentences.length) {
        info += '      ' + o.sentences.length + ' sentences ';
      }
      if (o.images) {
        info += '      ' + o.images.length + ' images ';
      }
      if (links.length > 0) {
        info += '      ' + links.length + ' links ';
      }
      if (lists.length > 0) {
        info += '      ' + lists.length + ' lists ';
      }
      info += '</div>';
      info += '<ul style="color:#DBADB4; font-size:14px;">' + links.slice(0, 12).join('      ') + '..</ul>';
      return (str += '<div><h4 style="color:grey;">' + title + ':</h4><ul>' + info + '</ul></div>');
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
  pages = '<span style="color:grey;">Examples: </span>' + pages;
  $('#pages').html(pages);

  $('.page').click(function(e) {
    var str = e.target.text;
    el.value = window.demo_pages[str];
    parse();
  });

  $('#fetch').on('click', function() {
    var title = $('#title').val();
    var lang = $('#lang').val();
    console.log('fetching ' + title + ' - in ' + lang);
    wtf.from_api(title, lang, function(wiki) {
      $('#wikiscript').val(wiki);
      parse();
    });
    return false;
  });

  el.addEventListener('input', parse, false);
  // $('.page:first').click();
  $('#fetch').click();
});
