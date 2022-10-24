/*! wtf-plugin-sports 0.0.2  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.wtfSports = {}));
})(this, (function (exports) { 'use strict';

  var teams$1 = [
    "Arizona Diamondbacks",
    "Atlanta Braves",
    "Baltimore Orioles",
    "Boston Red Sox",
    "Chicago Cubs",
    "Chicago White Sox",
    "Cincinnati Reds",
    "Cleveland Indians",
    "Colorado Rockies",
    "Detroit Tigers",
    "Houston Astros",
    "Kansas City Royals",
    "Los Angeles Angels",
    "Los Angeles Dodgers",
    "Miami Marlins",
    "Milwaukee Brewers",
    "Minnesota Twins",
    "New York Mets",
    "New York Yankees",
    "Oakland Athletics",
    "Philadelphia Phillies",
    "Pittsburgh Pirates",
    "San Diego Padres",
    "San Francisco Giants",
    "Seattle Mariners",
    "St. Louis Cardinals",
    "Tampa Bay Rays",
    "Texas Rangers",
    "Toronto Blue Jays",
    "Washington Nationals",

    //former teams
    "Montreal Expos",
    "Washington Senators",
    "Seattle Pilots",
    "Kansas City Athletics",
    "Milwaukee Braves",
    "Washington Senators",
    "Brooklyn Dodgers"
  ];

  //
  function playerStats (doc) {
    let players = [];
    let s = doc.sections('player stats') || doc.sections('player statistics') || doc.sections('statistics');
    s = s[0];
    if (!s) {
      return players
    }

    s.children().forEach((c) => {
      c.tables().forEach((t) => {
        players = players.concat(t.keyValue());
      });
    });
    let res = {
      batters: [],
      pitchers: [],
    };
    players.forEach((p) => {
      let rbi = p.RBI || p.rbi;
      let hr = p.HR || p.hr;
      if (rbi !== undefined || hr !== undefined) {
        res.batters.push(p);
      } else {
        res.pitchers.push(p);
      }
    });
    return res
  }

  const dashSplit$2 = /(–|-|−|&ndash;)/; // eslint-disable-line

  function parseTeam (txt) {
    if (!txt) {
      return {}
    }
    let away = /^ *@ */.test(txt);
    return {
      name: txt.replace(/^ +@ +/, ''),
      home: !away
    }
  }

  function parseRecord$1 (txt) {
    if (!txt) {
      return {}
    }
    let arr = txt.split(dashSplit$2);
    let obj = {
      wins: parseInt(arr[0], 10) || 0,
      losses: parseInt(arr[2], 10) || 0,
    };
    obj.games = obj.wins + obj.losses;
    let plusMinus = obj.wins / obj.games;
    obj.plusMinus = Number(plusMinus.toFixed(2));
    return obj
  }

  function parseScore$1 (txt) {
    if (!txt) {
      return {}
    }
    txt = txt.replace(/^[wl] /i, '');
    let arr = txt.split(dashSplit$2);
    let obj = {
      winner: parseInt(arr[0], 10),
      loser: parseInt(arr[2], 10),
    };
    if (isNaN(obj.winner) || isNaN(obj.loser)) {
      return {}
    }
    return obj
  }

  function parseAttendance (txt = '') {
    //support [[Rogers Center]] (23,987)
    if (txt.indexOf('(') !== -1) {
      let m = txt.match(/\(([0-9 ,]+)\)/);
      if (m && m[1]) {
        txt = m[1];
      }
    }
    txt = txt.replace(/,/g, '');
    return parseInt(txt, 10) || null
  }

  function parsePitchers (row) {
    let win = row.Win || row.win || '';
    win = win.replace(/\(.*?\)/, '').trim();
    let loss = row.Loss || row.loss || '';
    loss = loss.replace(/\(.*?\)/, '').trim();
    let save = row.Save || row.save || '';
    save = save.replace(/\(.*?\)/, '').trim();
    if (dashSplit$2.test(save) === true) {
      save = null;
    }
    return {
      win: win,
      loss: loss,
      save: save,
    }
  }

  function parseRow (row) {
    if (!row) {
      return null
    }
    let team = parseTeam(row.opponent || row.Opponent);
    let record = parseRecord$1(row.record || row.Record);
    let obj = {
      date: row.date || row.Date,
      team: team.name || team.Name,
      home: team.home || team.Home || false,
      pitchers: parsePitchers(row),
      result: parseScore$1(row.score || row.Score || row['box score'] || row['Box Score']),
      record: record,
      attendance: parseAttendance(row.attendance || row.Attendance || row['location (attendance)'] || row['Location (Attendance)'])
    };
    return obj
  }

  //amazingly, it's not clear who won the game, without the css styling.
  //try to pull-it out based on the team's record
  function addWinner$1 (games) {
    let wins = 0;
    games.forEach((g) => {
      if (g.record.wins > wins) {
        g.win = true;
        wins = g.record.wins;
      } else {
        g.win = false;
      }
      //improve the result format, now that we know who won..
      let res = g.result;
      if (g.win) {
        g.result = {
          us: res.winner,
          them: res.loser
        };
      } else {
        g.result = {
          us: res.loser,
          them: res.winner
        };
      }
    });
    return games
  }

  function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }

  function doTable (rows = []) {
    let games = [];
    //is it a legend/junk table?
    if (rows[1] && rows[1].Legend || !isArray(rows)) {
      return games
    }
    rows.forEach(row => {
      games.push(parseRow(row));
    });
    //remove empty weird ones
    games = games.filter((g) => g.team && g.date); //&& g.result.winner !== undefined
    return games
  }

  function doSection (section) {
    let tables = section.tables();
    //do all subsection, too
    section.children().forEach(s => {
      tables = tables.concat(s.tables());
    });
    //try to find a game log template
    if (tables.length === 0) {
      tables = section.templates('mlb game log section') || section.templates('mlb game log month');
      tables = tables.map((m) => m.data); //make it look like a table
    } else {
      tables = tables.map((t) => t.keyValue());
    }
    return tables
  }

  //get games of regular season
  function gameLog (doc) {
    let games = [];
    // grab the generated section called 'Game Log'
    let section = doc.section('game log') || doc.section('game log and schedule') || doc.section('regular season') || doc.section('season') || doc.section('schedule') || doc.section('schedule and results');
    if (!section) {
      console.warn('no game log section for: \'' + doc.title() + '\'');
      return games
    }
    let tables = doSection(section);
    tables.forEach((table) => {
      let arr = doTable(table.data);
      games = games.concat(arr);
    });
    games = addWinner$1(games);
    return games
  }

  function postSeason (doc) {
    let series = [];
    //ok, try postseason, too
    let section = doc.section('postseason game log') || doc.section('postseason') || doc.section('playoffs') || doc.section('playoff');
    if (!section) {
      return series
    }
    let tables = doSection(section);
    tables.forEach((table) => {
      let arr = doTable(table);
      series.push(arr);
    });
    //tag them as postseason
    // games.forEach((g) => g.postSeason = true)
    series.forEach((games) => addWinner$1(games));
    return series
  }
  const season = gameLog;
  const postseason = postSeason;

  //who knows!

  function parseTitle$1 (season = '') {
    let num = season.match(/[0-9]+/) || [];
    let year = Number(num[0]) || season;
    let team = season.replace(/[0-9–]+/, '').replace(/_/g, ' ').replace(' season', '');
    return {
      year: year,
      season: season,
      team: team.trim()
    }
  }

  //this is just a table in a 'roster' section
  function parseRoster$1 (doc, res) {
    let s = doc.sections('roster') || doc.sections('players') || doc.sections(res.year + ' roster');
    s = s[0];
    if (!s) {
      return {}
    }
    let players = s.templates('mlbplayer') || [];
    players = players.map(o => {
      delete o.template;
      return o
    });
    return players
  }

  //this is just a table in a '2008 draft picks' section
  function draftPicks (doc) {
    let want = /\bdraft\b/i;
    let s = doc.sections().find(sec => want.test(sec.title()));
    if (!s) {
      return []
    }
    let table = s.tables()[0];
    if (!table) {
      return []
    }
    return table.json()
  }

  //grab game-data from a MLB team's wikipedia page:
  function parsePage (doc) {
    if (!doc) {
      return {}
    }
    let res = parseTitle$1(doc.title() || '');
    res.games = season(doc);
    res.postseason = postseason(doc);
    //grab the roster/draft data
    res.roster = parseRoster$1(doc, res);
    res.draftPicks = draftPicks(doc);
    //get the per-player statistics
    res.playerStats = playerStats(doc);
    return res
  }

  function addMethod$1 (models) {
    models.wtf.mlbSeason = function (team, year) {
      //soften-up the team-input
      team = teams$1.find((t) => {
        return t === team || t.toLowerCase().includes(team.toLowerCase())
      }) || team;
      team = team.replace(/ /g, '_');
      year = year || new Date().getFullYear();
      // let nextYear = year % 100
      let page = `${year}_${team}_season`;
      return models.wtf.fetch(page).catch(console.log).then(parsePage)
    };
    models.Doc.prototype.mlbSeason = function () {
      return parsePage(this)
    };
  }

  var teams = [
    'Boston Bruins',
    'Buffalo Sabres',
    'Detroit Red Wings',
    'Florida Panthers',
    'Montreal Canadiens',
    'Ottawa Senators',
    'Tampa Bay Lightning',
    'Toronto Maple Leafs',
    'Carolina Hurricanes',
    'Columbus Blue Jackets',
    'New Jersey Devils',
    'New York Islanders',
    'New York Rangers',
    'Philadelphia Flyers',
    'Pittsburgh Penguins',
    'Washington Capitals',
    'Chicago Blackhawks',
    'Colorado Avalanche',
    'Dallas Stars',
    'Minnesota Wild',
    'Nashville Predators',
    'St. Louis Blues',
    'Winnipeg Jets',
    'Anaheim Ducks',
    'Arizona Coyotes',
    'Calgary Flames',
    'Edmonton Oilers',
    'Los Angeles Kings',
    'San Jose Sharks',
    'Vancouver Canucks',
    'Vegas Golden Knights'
  ];

  //amazingly, it's not clear who won the game, without the css styling.
  //try to pull-it out based on the team's record
  function addWinner (games) {
    let wins = 0;
    games.forEach((g) => {
      if (g.record.wins > wins) {
        g.win = true;
        wins = g.record.wins;
      } else if (g.record.wins === wins) {
        g.win = null;
      } else {
        g.win = false;
      }
      //improve the result format, now that we know who won..
      let res = g.result;
      if (g.win) {
        g.result = {
          us: res.win,
          them: res.loss
        };
      } else {
        g.result = {
          us: res.loss,
          them: res.win
        };
      }
    });
    return games
  }

  const dashSplit$1 = /([–\-−]|&ndash;)/;

  function parseRecord (record = '') {
    let arr = record.split(dashSplit$1);
    let result = {
      wins: Number(arr[0]) || 0,
      losses: Number(arr[2]) || 0,
      ties: Number(arr[4]) || 0
    };
    result.games = result.wins + result.losses + result.ties;
    return result
  }

  const dashSplit = /([–\-−]|&ndash;)/;

  function parseScore (score = '') {
    let arr = score.split(dashSplit);
    if (!arr[0] && !arr[2]) {
      return {}
    }
    return {
      win: Number(arr[0]),
      loss: Number(arr[2]),
    }
  }

  function isFuture (games) {
    games.forEach((g) => {
      if (!g.attendance && !g.points) {
        if (!g.record.wins && !g.record.lossess && !g.record.ties) {
          g.inFuture = true;
          g.win = null;
        }
      }
    });
    return games
  }

  function parseDate (row, title) {
    let year = title.year;
    let date = row.date || row.Date;
    if (!date) {
      return ''
    }
    //the next year, add one to the year
    if (/^(jan|feb|mar|apr)/i.test(date)) {
      date += ' ' + (year + 1);
    } else {
      date += ' ' + year;
    }
    return date
  }

  function parseGame (row, meta) {
    let attendance = row.attendance || row.Attendance || '';
    attendance = Number(attendance.replace(/,/, '')) || null;
    let res = {
      game: Number(row['#'] || row.Game),
      date: parseDate(row, meta),
      opponent: row.Opponent,
      result: parseScore(row.score || row.Score),
      overtime: (row.ot || row.OT || '').toLowerCase() === 'ot',
      // goalie: row.decision,
      record: parseRecord(row.record || row.Record),
      attendance: attendance,
      points: Number(row.pts || row.points || row.Pts || row.Points) || 0,
    };
    res.location = row.Location;
    res.home = row.home || row.Home;
    res.visitor = row.visitor || row.Visitor;
    if (!res.opponent) {
      res.opponent = meta.team.includes(res.home) ? res.visitors : res.home;
    }
    res.opponent = res.opponent || '';
    res.opponent = res.opponent.replace(/@ /, '');
    res.opponent = res.opponent.trim();
    return res
  }

  //
  function parseGames (doc, meta) {
    let games = [];
    let s = doc.section('schedule and results') || doc.section('schedule') || doc.section('regular season');
    if (!s) {
      return games
    }
    // support nested headers
    let nested = s.children('regular season');
    if (nested) {
      s = nested;
    }
    //do all subsections, too
    let tables = s.tables();
    s.children().forEach((c) => {
      tables = tables.concat(c.tables());
    });
    if (!tables[0]) {
      return games
    }
    tables.forEach((table) => {
      let rows = table.keyValue();
      rows.forEach((row) => {
        games.push(parseGame(row, meta));
      });
    });
    games = games.filter((g) => g && g.date);
    games = addWinner(games);
    games = isFuture(games);
    return games
  }

  const ordinal = /([0-9])(st|nd|rd|th)$/i;

  function toCardinal (str = '') {
    str = str.trim();
    if (ordinal.test(str)) {
      str = str.replace(ordinal, '$1');
      return Number(str)
    }
    if (/^[0-9]+$/.test(str)) {
      return Number(str)
    }
    return str
  }

  //
  function parseInfobox (doc) {
    let info = doc.infobox('ice hockey team season') || doc.infobox('NHLTeamSeason');
    if (!info) {
      return {}
    }
    let data = info.keyValue();
    Object.keys(data).forEach((k) => {
      data[k] = toCardinal(data[k]);
    });
    if (data.record) {
      data.record = parseRecord(data.record);
    }
    return data
  }

  function parseTitle (season = '') {
    let num = season.match(/[0-9]+/) || [];
    let year = Number(num[0]) || season;
    let team = season
      .replace(/[0-9\-–]+/, '')
      .replace(/_/g, ' ')
      .replace(' season', '');
    return {
      year: year,
      season: season,
      team: team.trim(),
    }
  }

  function parseRoster (doc) {
    let s = doc.section('skaters') || doc.section('roster') || doc.section('player statistics');
    let players = [];
    if (!s) {
      return players
    }
    //do all subsections, too
    let tables = s.tables();
    s.children().forEach((c) => {
      tables = tables.concat(c.tables());
    });
    if (!tables[0]) {
      return players
    }
    players = tables[0].keyValue().map((o) => {
      let name = o.Player || '';
      name = name.replace(/\(.*?\)/, '');
      name = name.replace(/[‡†]/, '');
      name = name.trim();
      return {
        name: name,
        games: Number(o.GP || 0),
        goals: Number(o.G || 0),
        assists: Number(o.A || 0),
        points: Number(o.Pts || o.PTS || o.Points) || 0,
        plusMinus: Number(o['+/−']) || 0,
      }
    });
    players = players.filter((o) => o && o.name && o.name !== 'Total');
    return players
  }

  //
  function parse (doc) {
    let meta = parseTitle(doc.title());
    let res = {
      team: meta.team,
      year: meta.year,
      page: meta.season,
      roster: parseRoster(doc),
      season: parseInfobox(doc),
    };
    res.games = parseGames(doc, meta);
    return res
  }

  function makePage (team, year) {
    team = team.replace(/ /g, '_');
    year = year || new Date().getFullYear();
    let nextYear = Number(String(year).substr(2, 4)) + 1;
    let page = `${year}–${nextYear}_${team}_season`; //2018–19_Toronto_Maple_Leafs_season
    return page
  }

  function addMethod (models) {
    models.wtf.nhlSeason = function (team, year) {
      //soften-up the team-input
      team = teams.find((t) => {
        return t === team || t.toLowerCase().includes(team.toLowerCase())
      }) || team;
      let page = makePage(team, year);
      return models.wtf.fetch(page).catch(console.log).then(parse)
    };
    // add it here too
    models.Doc.nhlSeason = parse;
  }

  exports.mlb = addMethod$1;
  exports.nhl = addMethod;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
