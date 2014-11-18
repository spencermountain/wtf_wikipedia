//originally instaview
//https://github.com/cscott/instaview
//hacked by @spencermountain

/*
 * InstaView - a Mediawiki to HTML converter in JavaScript
 * Version 0.6.1
 * Copyright (C) Pedro Fayolle 2005-2006
 * http://en.wikipedia.org/wiki/User:Pilaf
 * Distributed under the BSD license

 */


(function(){

var hex_md5= require("./md5")

var InstaView = {}

// options
InstaView.conf =
{
	user: {},

	wiki: {
		lang: 'en',
		interwiki: 'ab|aa|af|ak|sq|als|am|ang|ar|an|arc|hy|roa-rup|as|ast|av|ay|az|bm|ba|eu|be|bn|bh|bi|bs|br|bg|my|ca|ch|ce|chr|chy|ny|zh|zh-tw|zh-cn|cho|cv|kw|co|cr|hr|cs|da|dv|nl|dz|en|eo|et|ee|fo|fj|fi|fr|fy|ff|gl|ka|de|got|el|kl|gn|gu|ht|ha|haw|he|hz|hi|ho|hu|is|io|ig|id|ia|ie|iu|ik|ga|it|ja|jv|kn|kr|csb|ks|kk|km|ki|rw|rn|tlh|kv|kg|ko|kj|ku|ky|lo|la|lv|li|ln|lt|jbo|nds|lg|lb|mk|mg|ms|ml|mt|gv|mi|minnan|mr|mh|zh-min-nan|mo|mn|mus|nah|na|nv|ne|se|no|nn|oc|or|om|pi|fa|pl|pt|pa|ps|qu|ro|rm|ru|sm|sg|sa|sc|gd|sr|sh|st|tn|sn|scn|simple|sd|si|sk|sl|so|st|es|su|sw|ss|sv|tl|ty|tg|ta|tt|te|th|bo|ti|tpi|to|tokipona|ts|tum|tr|tk|tw|uk|ur|ug|uz|ve|vi|vo|wa|cy|wo|xh|ii|yi|yo|za|zu',
		default_thumb_width: 180
	},

	paths: {
		base_href: '/',
		articles: '',
		math: '',
		images: '',
		images_fallback: 'http://upload.wikimedia.org/wikipedia/commons/',
		magnify_icon: ''
	},

	locale: {
		user: 'User',
		image: 'Image',
		category: 'Category',
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
	}
};

// options with default values or backreferences
(function(conf) {
    var locale = conf.locale,
        paths = conf.paths, wiki = conf.wiki;
    if (typeof location === 'object') { path.base_href = location; }
    paths.images = 'http://upload.wikimedia.org/wikipedia/' + wiki.lang + '/'
    // generate list of interwiki link prefixes from keys in namespace_langs
    // var langs = [], l;
    // for (l in namespace_langs) {
    //     if (Object.prototype.hasOwnProperty.call(namespace_langs, l)) {
    //         langs.push(l);
    //     }
    // }
    wiki.interwiki = 'en'//langs.join('|');
})(InstaView.conf);

// define constants
InstaView.BLOCK_IMAGE = new RegExp('^\\[\\['+InstaView.conf.locale.image+':.*?\\|.*?(?:frame|thumbnail|thumb|none|right|left|center)', 'i');


InstaView.convert = function(wiki)
{
  var categories=[]
  var links=[]

	var 	ll = (typeof wiki == 'string')? wiki.replace(/\r/g,'').split(/\n/): wiki, // lines of wikicode
		o='',	// output
		p=0,	// para flag
		$r	// result of passing a regexp to $()

	// some shorthands
	function remain() { return ll.length }
	function sh() { return ll.shift() } // shift
	function ps(s) { o+=s } // push

	function f() // similar to C's printf, uses ? as placeholders, ?? to escape question marks
	{
		var i=1,a=arguments,f=a[0],o='',c,p
		for (;i<a.length; i++) if ((p=f.indexOf('?'))+1) {
			// allow character escaping
			i -= c=f.charAt(p+1)=='?'?1:0
			o += f.substring(0,p)+(c?'?':a[i])
			f=f.substr(p+1+c)
		} else break;
		return o+f
	}

	function html_entities(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") }

	function max(a,b) { return (a>b)?a:b }
	function min(a,b) { return (a<b)?a:b }

	// return the first non matching character position between two strings
	function str_imatch(a, b)
	{
		for (var i=0, l=min(a.length, b.length); i<l; i++) if (a.charAt(i)!=b.charAt(i)) break
		return i
	}

	// compare current line against a string or regexp
	// if passed a string it will compare only the first string.length characters
	// if passed a regexp the result is stored in $r
	function $(c) { return (typeof c == 'string') ? (ll[0].substr(0,c.length)==c) : ($r = ll[0].match(c)) }

	function $$(c) { return ll[0]==c } // compare current line against a string
	function _(p) { return ll[0].charAt(p) } // return char at pos p

	function endl(s) { ps(s); sh() }

	function parse_list()
	{
		var prev='';

		while (remain() && $(/^([*#:;]+)(.*)$/)) {

			var l_match = $r

			sh()

			var ipos = str_imatch(prev, l_match[1])

			// close uncontinued lists
			for (var i=prev.length-1; i >= ipos; i--) {

				var pi = prev.charAt(i)

				if (pi=='*') ps('</ul>')
				else if (pi=='#') ps('</ol>')
				// close a dl only if the new item is not a dl item (:, ; or empty)
				else switch (l_match[1].charAt(i)) { case'':case'*':case'#': ps('</dl>') }
			}

			// open new lists
			for (var i=ipos; i<l_match[1].length; i++) {

				var li = l_match[1].charAt(i)

				if (li=='*') ps('<ul>')
				else if (li=='#') ps('<ol>')
				// open a new dl only if the prev item is not a dl item (:, ; or empty)
				else switch(prev.charAt(i)) { case'':case'*':case'#': ps('<dl>') }
			}

			switch (l_match[1].charAt(l_match[1].length-1)) {

				case '*': case '#':
					ps('<li>' + parse_inline_nowiki(l_match[2])); break

				case ';':
					ps('<dt>')

					var dt_match

					// handle ;dt :dd format
					if (dt_match = l_match[2].match(/(.*?) (:.*?)$/)) {

						ps(parse_inline_nowiki(dt_match[1]))
						ll.unshift(dt_match[2])

					} else ps(parse_inline_nowiki(l_match[2]))

					break

				case ':':
					ps('<dd>' + parse_inline_nowiki(l_match[2]))
			}

			prev=l_match[1]
		}

		// close remaining lists
		for (var i=prev.length-1; i>=0; i--)
			ps(f('</?>', (prev.charAt(i)=='*')? 'ul': ((prev.charAt(i)=='#')? 'ol': 'dl')))
	}

	function parse_table()
	{
		endl(f('<table?>', $(/^\{\|( .*)$/)? $r[1]: ''))

		for (;remain();) if ($('|')) switch (_(1)) {
			case '}': endl('</table>'); return
			case '-': endl(f('<tr ?>', $(/\|-*(.*)/)[1])); break
			default: parse_table_data()
		}
		else if ($('!')) parse_table_data()
		else sh()
	}

	function parse_table_data()
	{
		var td_line, match_i

		// 1: "|+", '|' or '+'
		// 2: ??
		// 3: attributes ??
		// TODO: finish commenting this regexp
		var td_match = sh().match(/^(\|\+|\||!)((?:([^[|]*?)\|(?!\|))?(.*))$/)

		if (td_match[1] == '|+') ps('<caption');
		else ps('<t' + ((td_match[1]=='|')?'d':'h'))

		if (typeof td_match[3] != 'undefined') {

			ps(' ' + td_match[3])
			match_i = 4

		} else match_i = 2

		ps('>')

		if (td_match[1] != '|+') {

			// use || or !! as a cell separator depending on context
			// NOTE: when split() is passed a regexp make sure to use non-capturing brackets
			td_line = td_match[match_i].split((td_match[1] == '|')? '||': /(?:\|\||!!)/)

			ps(parse_inline_nowiki(td_line.shift()))

			while (td_line.length) ll.unshift(td_match[1] + td_line.pop())

		} else ps(td_match[match_i])

		var tc = 0, td = []

		for (;remain(); td.push(sh()))
		if ($('|')) {
			if (!tc) break // we're at the outer-most level (no nested tables), skip to td parse
			else if (_(1)=='}') tc--
		}
		else if (!tc && $('!')) break
		else if ($('{|')) tc++

		if (td.length) ps(InstaView.convert(td))
	}

	function parse_pre()
	{
		ps('<pre>')
		do endl(parse_inline_nowiki(ll[0].substring(1)) + "\n"); while (remain() && $(' '))
		ps('</pre>')
	}

	function parse_block_image()
	{
		ps(parse_image(sh()))
	}

	function parse_image(str)
	{
		// get what's in between "[[Image:" and "]]"
		var tag = str.substring(InstaView.conf.locale.image.length + 3, str.length - 2);

		var width;
		var attr = [], filename, caption = '';
		var thumb=0, frame=0, center=0;
		var align='';

		if (tag.match(/\|/)) {
			// manage nested links
			var nesting = 0;
			var last_attr;
			for (var i = tag.length-1; i > 0; i--) {
				if (tag.charAt(i) == '|' && !nesting) {
					last_attr = tag.substr(i+1);
					tag = tag.substring(0, i);
					break;
				} else switch (tag.substr(i-1, 2)) {
					case ']]':
						nesting++;
						i--;
						break;
					case '[[':
						nesting--;
						i--;
				}
			}

			attr = tag.split(/\s*\|\s*/);
			attr.push(last_attr);
			filename = attr.shift();

			var w_match;

			for (;attr.length; attr.shift())
			if (w_match = attr[0].match(/^(\d*)px$/)) width = w_match[1]
			else switch(attr[0]) {
				case 'thumb':
				case 'thumbnail':
					thumb=true;
				case 'frame':
					frame=true;
					break;
				case 'none':
				case 'right':
				case 'left':
					center=false;
					align=attr[0];
					break;
				case 'center':
					center=true;
					align='none';
					break;
				default:
					if (attr.length == 1) caption = attr[0];
			}

		} else filename = tag;


		var o='';

		if (frame) {

			if (align=='') align = 'right';

			o += f("<div class='thumb t?'>", align);

			if (thumb) {
				if (!width) width = InstaView.conf.wiki.default_thumb_width;

				o += f("<div style='width:?px;'>?", 2+width*1, make_image(filename, caption, width)) +
					f("<div class='thumbcaption'><div class='magnify' style='float:right'><a href='?' class='internal' title='Enlarge'><img src='?'></a></div>?</div>",
						InstaView.conf.paths.articles + InstaView.conf.locale.image + ':' + filename,
						InstaView.conf.paths.magnify_icon,
						parse_inline_nowiki(caption)
					)
			} else {
				o += '<div>' + make_image(filename, caption) + f("<div class='thumbcaption'>?</div>", parse_inline_nowiki(caption))
			}

			o += '</div></div>';

		} else if (align != '') {
			o += f("<div class='float?'><span>?</span></div>", align, make_image(filename, caption, width));
		} else {
			return make_image(filename, caption, width);
		}

		return center? f("<div class='center'>?</div>", o): o;
	}

	function parse_inline_nowiki(str)
	{
		var start, lastend=0
		var substart=0, nestlev=0, open, close, subloop;
		var html='';

		while (-1 != (start = str.indexOf('<nowiki>', substart))) {
			html += parse_inline_wiki(str.substring(lastend, start));
			start += 8;
			substart = start;
			subloop = true;
			do {
				open = str.indexOf('<nowiki>', substart);
				close = str.indexOf('</nowiki>', substart);
				if (close<=open || open==-1) {
					if (close==-1) {
						return html + html_entities(str.substr(start));
					}
					substart = close+9;
					if (nestlev) {
						nestlev--;
					} else {
						lastend = substart;
						html += html_entities(str.substring(start, lastend-9));
						subloop = false;
					}
				} else {
					substart = open+8;
					nestlev++;
				}
			} while (subloop)
		}

		return html + parse_inline_wiki(str.substr(lastend));
	}

	function make_image(filename, caption, width)
	{
		// uppercase first letter in file name
		filename = filename.charAt(0).toUpperCase() + filename.substr(1);
		// replace spaces with underscores
		filename = filename.replace(/ /g, '_');

		caption = strip_inline_wiki(caption);

		var md5 = hex_md5(filename);

		var source = md5.charAt(0) + '/' + md5.substr(0,2) + '/' + filename;

		if (width) width = "width='" + width + "px'";

		var img = f("<img onerror=\"this.onerror=null;this.src='?'\" src='?' ? ?>", InstaView.conf.paths.images_fallback + source, InstaView.conf.paths.images + source, (caption!='')? "alt='" + caption + "'" : '', width);

		return f("<a class='image' ? href='?'>?</a>", (caption!='')? "title='" + caption + "'" : '', InstaView.conf.paths.articles + InstaView.conf.locale.image + ':' + filename, img);
	}

	function parse_inline_images(str)
	{
		var start, substart=0, nestlev=0;
		var loop, close, open, wiki, html;

		while (-1 != (start=str.indexOf('[[', substart))) {
			if(str.substr(start+2).match(RegExp('^' + InstaView.conf.locale.image + ':','i'))) {
				loop=true;
				substart=start;
				do {
					substart+=2;
					close=str.indexOf(']]',substart);
					open=str.indexOf('[[',substart);
					if (close<=open||open==-1) {
						if (close==-1) return str;
						substart=close;
						if (nestlev) {
							nestlev--;
						} else {
							wiki=str.substring(start,close+2);
							html=parse_image(wiki);
							str=str.replace(wiki,html);
							substart=start+html.length;
							loop=false;
						}
					} else {
						substart=open;
						nestlev++;
					}
				} while (loop)

			} else break;
		}

		return str;
	}

	// the output of this function doesn't respect the FILO structure of HTML
	// but since most browsers can handle it I'll save myself the hassle
	function parse_inline_formatting(str)
	{
		var em,st,i,li,o='';
		while ((i=str.indexOf("''",li))+1) {
			o += str.substring(li,i);
			li=i+2;
			if (str.charAt(i+2)=="'") {
				li++;
				st=!st;
				o+=st?'':'';
			} else {
				em=!em;
				o+=em?'':'';
			}
		}
		return o+str.substr(li);
	}

	function parse_inline_wiki(str)
	{
		var aux_match;

		str = parse_inline_images(str);
		str = parse_inline_formatting(str);

		// kill math
		while (aux_match = str.match(/<(?:)math>(.*?)<\/math>/i)) {
			var math_md5 = hex_md5(aux_match[1]);
			str = str.replace(aux_match[0], '');
		}

    //fetch links
      var tmp=str.match(/\[\[(.*?)\]\](\w*)/g)//regular links
	    if(tmp){
	    	tmp.forEach(function(s){
	    		s=s.replace(/\[\[(.*?)\]\](\w*)/g,"$1")
	    		s=s.replace(/(.*)\|.*/,"$1")//replaced links
	    		if(s.match(/^category:/i)){
	    			categories.push(s)
	    			return
	    		}
	    		if(s.match(/^image:/i)){
	    			return
	    		}
	    		links.push(s)
	    	})
	    }

     //  var tmp=str.match(/\[\[(.*?)\|([^\]]+?)\]\](\w*)/g)//replaced links
	    // if(tmp){
	    // 	tmp.forEach(function(s){
	    // 		links.push(s.replace(/\[\[(.*?)\|([^\]]+?)\]\](\w*)/g,"$1"))
	    // 	})
	    // }


		// text formatting
		return str.

			replace(/< ?ref .*?<\/ref>/g, " ").

			// [[:Category:...]], [[:Image:...]], etc...
			replace(RegExp('\\[\\[:((?:'+InstaView.conf.locale.category+'|'+InstaView.conf.locale.image+'|'+InstaView.conf.wiki.interwiki+'):.*?)\\]\\]','gi'), "").
			replace(RegExp('\\[\\[(?:'+InstaView.conf.locale.category+'|'+InstaView.conf.wiki.interwiki+'):.*?\\]\\]','gi'),'').

			// [[/Relative links]]
			replace(/\[\[(\/[^|]*?)\]\]/g, f("$1", InstaView.conf.paths.base_href)).

			// [[/Replaced|Relative links]]
			replace(/\[\[(\/.*?)\|(.+?)\]\]/g, f("$2", InstaView.conf.paths.base_href)).

			// [[Common links]]
			replace(/\[\[([^|]*?)\]\](\w*)/g, f("$1$2", InstaView.conf.paths.articles)).

			// [[Replaced|Links]]
			replace(/\[\[(.*?)\|([^\]]+?)\]\](\w*)/g, f("$2$3", InstaView.conf.paths.articles)).

			// [[Stripped:Namespace|Namespace]]
			replace(/\[\[([^\]]*?:)?(.*?)( *\(.*?\))?\|\]\]/g, f("$2", InstaView.conf.paths.articles)).

			// External links
			replace(/\[(https?|news|ftp|mailto|gopher|irc):(\/*)([^\]]*?) (.*?)\]/g, "$4").
			replace(/\[http:\/\/(.*?)\]/g, "").
			replace(/\[(news|ftp|mailto|gopher|irc):(\/*)(.*?)\]/g, "").
			replace(/(^| )(https?|news|ftp|mailto|gopher|irc):(\/*)([^ $]*)/g, "$1").

			replace('__NOTOC__','').
			replace('__NOEDITSECTION__','');
	}

	function strip_inline_wiki(str)
	{
		return str
			.replace(/\[\[[^\]]*\|(.*?)\]\]/g,'$1')
			.replace(/\[\[(.*?)\]\]/g,'$1')
			.replace(/''(.*?)''/g,'$1');
	}

	// begin parsing
	for (;remain();) if ($(/^(={1,6})(.*)\1(.*)$/)) {
		p=0
		endl(f('<h?>?</h?>?', $r[1].length, parse_inline_nowiki($r[2]), $r[1].length, $r[3]))

	} else if ($(/^[*#:;]/)) {
		p=0
		parse_list()

	} else if ($(' ')) {
		p=0
		parse_pre()

	} else if ($('{|')) {
		p=0
		parse_table()

	} else if ($(/^----+$/)) {
		p=0
		endl('<hr>')

	} else if ($(InstaView.BLOCK_IMAGE)) {
		p=0
		parse_block_image()

	} else {

		// handle paragraphs
		if ($$('')) {
			if (p = (remain()>1 && ll[1]==(''))) endl('<p><br>')
		} else {
			if(!p) {
				ps('<p>')
				p=1
			}
			ps(parse_inline_nowiki(ll[0]) + ' ')
		}

		sh();
	}

	return {
		txt:o,
		links:links,
		categories:categories,
	}
}

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstaView;
  }


return InstaView;
})()

var s='Miss Ray Levinsky.<ref name="theroyal">{{cite web|title=About - theroyal.to|url=http://www.theroyal.to/about/}}</ref> <p>When it was built in 1939,'
console.log(module.exports.convert(s))