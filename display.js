$(window).ready(function() {
  $('#version').html('(' + wtf.version + ')');

  var make_list = function(arr) {
    arr = arr || [];
    return arr.reduce(function(str, o) {
      return (str += '<div>' + o + '</div>');
    }, '');
  };
  var makeImg = function(arr) {
    arr = arr || [];
    return arr.reduce(function(str, o, i) {
      return (str += '<img style="width:200px;" data-description="image ' + i + ': ' + o.file + '" src="' + o.url + '"/>');
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
    arr = arr || [];
    return arr.reduce(function(str, o) {
      var title = o.title || ' <sub>(intro)</sub>';
      var lists = o.lists || [];
      var info = '<span style="color:offwhite; font-size:13px; font-weight:400;">';
      if (o.sentences.length) {
        info += '      ' + o.sentences.length + ' sentences ';
      }
      if (o.images) {
        info += '      ' + o.images.length + ' images ';
      }
      if (lists.length > 0) {
        info += '      ' + lists.length + ' lists ';
      }
      info += '</span>';
      // info += '<ul style="color:#DBADB4; font-size:14px;">' + links.slice(0, 12).join('      ') + '..</ul>';
      return (str += '<div><h4 style="color:#ed5367;">' + title + ':  ' + info + '</h4></div>');
    }, '');
  };
  var makeMap = function(coord) {
    if (!coord || coord.length === 0) {
      return '';
    }
    coord = coord[0].lat + ',' + coord[0].lon;
    var img = 'https://maps.googleapis.com/maps/api/staticmap?center=' + coord + '&zoom=7&scale=1&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C' + coord;
    return '<img src="' + img + '"/>';
  };
  var makeSentence = function(sections) {
    var sec = sections[0];
    if (!sec || !sec.sentences || sec.sentences.length === 0) {
      return '';
    }
    return '<div">' + sec.sentences[0].text + '</div>';
  };
  var makeCitations = function(arr) {
    var urls = {};
    arr.forEach(function(a) {
      if (!a.url) {
        return;
      }
      var el = document.createElement('a');
      el.href = a.url;
      var url = el.hostname.replace(/^www\./, '');
      urls[url] = urls[url] || 0;
      urls[url] += 1;
      return;
    });
    var list = Object.keys(urls).map((u) => '<div style="margin:10px;">' + u + '</div>').join('');
    return '<div><div style="font-size:35px; text-align:center;">' + arr.length + ' Citations</div><div style="color:steelblue; flex-direction:column; max-height:2000px; display:flex;flex-wrap:wrap;">' + list + '</div></div>';
  };
  var makeDisambig = function(arr) {
    var list = arr.map((u) => '<div style="margin:10px;">' + u + '</div>').join('');
    return '<div><div style="font-size:35px; text-align:center;">' + arr.length + ' Disambiguations:</div><div style="color:steelblue; display:flex; flex-direction:column; flex-wrap:wrap;">' + list + '</div></div>';
  };
  var parse = function() {
    var wikiscript = $('#wikiscript').val();
    var text = wtf.plaintext(wikiscript);
    $('#text').html(text);
    var obj = wtf.parse(wikiscript);
    console.log(obj);
    $('#map').html('<ul>' + makeMap(obj.coordinates || []) + '</ul>');
    $('#firstSentence').html('<ul>' + makeSentence(obj.sections || []) + '</ul>');
    $('#infobox').html('<ul>' + makeInfoboxes(obj.infoboxes || []) + '</ul>');
    $('#sections').html('<ul>' + makeSections(obj.sections) + '</ul>');
    $('#categories').html(make_list(obj.categories));
    $('#disambig').html('');
    $('#images').html(makeImg(obj.images));
    $('#citations').html(makeCitations(obj.citations || []));
    $('#infobox').html(JSON.stringify(obj.infobox, null, 2));
    if (obj.images && obj.images.length > 0) {
      $('#images').unitegallery({
        lightbox_slider_control_zoom: false,
        lightbox_slider_control_swipe: false,
        lightbox_show_textpanel: false,
      });
    }
    if (obj.type === 'disambiguation') {
      $('#disambig').html(makeDisambig(obj.pages));
    }
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
