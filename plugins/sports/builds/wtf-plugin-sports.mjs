/*! wtf-plugin-sports 0.0.2 MIT */
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
const playerStats = function (doc) {
  let players = [];
  let s = doc.sections('player stats') || doc.sections('player statistics') || doc.sections('statistics');
  s = s[0];
  if (!s) {
    return players
  }

  players = s.children().flatMap((c) => c.tables().flatMap((t) => t.keyValue()));
  const res = {
    batters: [],
    pitchers: [],
  };
  players.forEach((p) => {
    const rbi = p.RBI || p.rbi;
    const hr = p.HR || p.hr;
    if (rbi !== undefined || hr !== undefined) {
      res.batters.push(p);
    } else {
      res.pitchers.push(p);
    }
  });
  return res
};

const dashSplit$2 = /(–|-|−|&ndash;)/; //eslint-disable-line

const parseTeam = function (txt) {
  if (!txt) {
    return {}
  }
  const away = /^ *@ */.test(txt);
  return {
    name: txt.replace(/^ +@ +/, ''),
    home: !away
  }
};

const parseRecord$1 = function (txt) {
  if (!txt) {
    return {}
  }
  const arr = txt.split(dashSplit$2);
  const obj = {
    wins: parseInt(arr[0], 10) || 0,
    losses: parseInt(arr[2], 10) || 0,
  };
  obj.games = obj.wins + obj.losses;
  const plusMinus = obj.wins / obj.games;
  obj.plusMinus = Number(plusMinus.toFixed(2));
  return obj
};

const parseScore$1 = function (txt) {
  if (!txt) {
    return {}
  }
  txt = txt.replace(/^[wl] /i, '');
  const arr = txt.split(dashSplit$2);
  const obj = {
    winner: parseInt(arr[0], 10),
    loser: parseInt(arr[2], 10),
  };
  if (isNaN(obj.winner) || isNaN(obj.loser)) {
    return {}
  }
  return obj
};

const parseAttendance = function (txt = '') {
  //support [[Rogers Center]] (23,987)
  if (txt.indexOf('(') !== -1) {
    const m = txt.match(/\(([0-9 ,]+)\)/);
    if (m && m[1]) {
      txt = m[1];
    }
  }
  txt = txt.replace(/,/g, '');
  return parseInt(txt, 10) || null
};

const parsePitchers = function (row) {
  let win = row.Win || row.win || '';
  win = win.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1').trim();
  let loss = row.Loss || row.loss || '';
  loss = loss.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1').trim();
  let save = row.Save || row.save || '';
  save = save.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1').trim();
  if (dashSplit$2.test(save) === true) {
    save = null;
  }
  return {
    win: win,
    loss: loss,
    save: save,
  }
};

const parseRow = function (row) {
  if (!row) {
    return null
  }
  const team = parseTeam(row.opponent || row.Opponent);
  const record = parseRecord$1(row.record || row.Record);
  const obj = {
    date: row.date || row.Date,
    team: team.name || team.Name,
    home: team.home || team.Home || false,
    pitchers: parsePitchers(row),
    result: parseScore$1(row.score || row.Score || row['box score'] || row['Box Score']),
    record: record,
    attendance: parseAttendance(row.attendance || row.Attendance || row['location (attendance)'] || row['Location (Attendance)'])
  };
  return obj
};

//amazingly, it's not clear who won the game, without the css styling.
//try to pull-it out based on the team's record
const addWinner$1 = function (games) {
  let wins = 0;
  games.forEach((g) => {
    if (g.record.wins > wins) {
      g.win = true;
      wins = g.record.wins;
    } else {
      g.win = false;
    }
    //improve the result format, now that we know who won..
    const res = g.result;
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
};

/* eslint-disable no-console */

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

const doTable = function (rows = []) {
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
};

const doSection$1 = function (section) {
  // Include the section's own tables and all subsections.
  let tables = [section, ...section.children()].flatMap((s) => s.tables());
  //try to find a game log template
  if (tables.length === 0) {
    tables = section.templates('mlb game log section') || section.templates('mlb game log month') || section.templates('game log section');
    tables = tables.map((m) => m.data); //make it look like a table
  } else {
    tables = tables.map((t) => t.keyValue());
  }
  return tables
};

//get games of regular season
const gameLog = function (doc) {
  let games = [];
  // grab the generated section called 'Game Log'
  const section = doc.section('game log') || doc.section('game log and schedule') || doc.section('regular season') || doc.section('season') || doc.section('schedule') || doc.section('schedule and results');
  if (!section) {
    console.warn('no game log section for: \'' + doc.title() + '\'');
    return games
  }
  const tables = doSection$1(section);
  games = tables.flatMap((table) => doTable(table.data));
  games = addWinner$1(games);
  return games
};

const postSeason = function (doc) {
  const series = [];
  //ok, try postseason, too
  const section = doc.section('postseason game log') || doc.section('postseason') || doc.section('playoffs') || doc.section('playoff');
  if (!section) {
    return series
  }
  const tables = doSection$1(section);
  tables.forEach((table) => {
    const arr = doTable(table);
    series.push(arr);
  });
  //tag them as postseason
  // games.forEach((g) => g.postSeason = true)
  series.forEach((games) => addWinner$1(games));
  return series
};
const season = gameLog;
const postseason = postSeason;

//who knows!

const parseTitle$1 = function (season = '') {
  const num = season.match(/[0-9]+/) || [];
  const year = Number(num[0]) || season;
  const team = season.replace(/[0-9–]+/, '').replace(/_/g, ' ').replace(' season', '');
  return {
    year: year,
    season: season,
    team: team.trim()
  }
};

//this is just a table in a 'roster' section
const parseRoster$1 = function (doc, res) {
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
};

//this is just a table in a '2008 draft picks' section
const draftPicks = function (doc) {
  const want = /\bdraft\b/i;
  const s = doc.sections().find(sec => want.test(sec.title()));
  if (!s) {
    return []
  }
  const table = s.tables()[0];
  if (!table) {
    return []
  }
  return table.json()
};

//grab game-data from a MLB team's wikipedia page:
const parsePage = function (doc) {
  if (!doc) {
    return {}
  }
  const res = parseTitle$1(doc.title() || '');
  res.games = season(doc);
  res.postseason = postseason(doc);
  //grab the roster/draft data
  res.roster = parseRoster$1(doc, res);
  res.draftPicks = draftPicks(doc);
  //get the per-player statistics
  res.playerStats = playerStats(doc);
  return res
};

/* eslint-disable no-console */

const addMethod$1 = function (models) {
  models.wtf.mlbSeason = function (team, year) {
    //soften-up the team-input
    team = teams$1.find((t) => {
      return t === team || t.toLowerCase().includes(team.toLowerCase())
    }) || team;
    team = team.replace(/ /g, '_');
    year ||= new Date().getFullYear();
    // let nextYear = year % 100
    const page = `${year}_${team}_season`;
    return models.wtf.fetch(page).catch(console.log).then(parsePage)
  };
  models.Doc.prototype.mlbSeason = function () {
    return parsePage(this)
  };
};

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
const addWinner = function (games) {
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
    const res = g.result;
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
};

const dashSplit$1 = /([–\-−]|&ndash;)/;

const parseRecord = function (record = '') {
  const arr = record.split(dashSplit$1);
  const result = {
    wins: Number(arr[0]) || 0,
    losses: Number(arr[2]) || 0,
    ties: Number(arr[4]) || 0
  };
  result.games = result.wins + result.losses + result.ties;
  return result
};

const dashSplit = /([–\-−]|&ndash;)/;

const parseScore = function (score = '') {
  const arr = score.split(dashSplit);
  if (!arr[0] && !arr[2]) {
    return {}
  }
  return {
    win: Number(arr[0]),
    loss: Number(arr[2]),
  }
};



const parseDate = function (row, title) {
  const year = title.year;
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
};

const doSection = function (section) {
  // Include the section's own tables and all subsections.
  let tables = [section, ...section.children()].flatMap((s) => s.tables());
  //try to find a game log template
  if (tables.length === 0) {
    const templates = section.templates('game log section') || section.templates('game log month');
    return templates.flatMap((m) => m.data.data)
  } else {
    return tables.flatMap((t) => t.keyValue())
  }
};

const parseGame = function (row, meta) {
  let attendance = row.attendance || row.Attendance || '';
  attendance = Number(attendance.replace(/,/, '')) || null;
  const res = {
    game: Number(row['#'] || row.Game),
    date: parseDate(row, meta),
    opponent: row.Opponent || row.opponent,
    result: parseScore(row.score || row.Score),
    overtime: (row.ot || row.OT || '').toLowerCase() === 'ot',
    // goalie: row.decision,
    record: parseRecord(row.record || row.Record),
    attendance: attendance,
    points: Number(row.pts || row.points || row.Pts || row.Points) || 0,
  };
  res.location = row.Location || row.location;
  res.home = row.home || row.Home;
  res.visitor = row.visitor || row.Visitor;
  if (!res.opponent) {
    res.opponent = meta.team.includes(res.home) ? res.visitors : res.home;
  }
  res.opponent ||= '';
  res.opponent = res.opponent.replace(/@ /, '');
  res.opponent = res.opponent.trim();
  return res
};

//
const parseGames = function (doc, meta) {
  let games = [];
  let s = doc.section('schedule and results') || doc.section('schedule') || doc.section('regular season');
  if (!s) {
    return games
  }
  // support nested headers
  const nested = s.children('regular season');
  if (nested) {
    s = nested;
  }
  //do all subsections, too
  const rows = doSection(s);
  rows.forEach((row) => {
    games.push(parseGame(row, meta));
  });
  games = games.filter((g) => g && g.date);
  games = addWinner(games);
  // games = isFuture(games)
  return games
};

const ordinal = /([0-9])(st|nd|rd|th)$/i;

const toCardinal = function (str = '') {
  str = str.trim();
  if (ordinal.test(str)) {
    str = str.replace(ordinal, '$1');
    return Number(str)
  }
  if (/^[0-9]+$/.test(str)) {
    return Number(str)
  }
  return str
};

//
const parseInfobox = function (doc) {
  const info = doc.infobox('ice hockey team season') || doc.infobox('NHLTeamSeason');
  if (!info) {
    return {}
  }
  const data = info.keyValue();
  Object.keys(data).forEach((k) => {
    data[k] = toCardinal(data[k]);
  });
  if (data.record) {
    data.record = parseRecord(data.record);
  }
  return data
};

const parseTitle = function (season = '') {
  const num = season.match(/[0-9]+/) || [];
  const year = Number(num[0]) || season;
  const team = season
    .replace(/[0-9\-–]+/, '')
    .replace(/_/g, ' ')
    .replace(' season', '');
  return {
    year: year,
    season: season,
    team: team.trim(),
  }
};

const parseRoster = function (doc) {
  const s = doc.section('skaters') || doc.section('roster') || doc.section('player statistics');
  let players = [];
  if (!s) {
    return players
  }
  //do all subsections, too
  let tables = [s, ...s.children()].flatMap((c) => c.tables());
  if (!tables[0]) {
    return players
  }
  players = tables[0].keyValue().map((o) => {
    let name = o.Player || '';
    name = name.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1');
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
};

//
const parse = function (doc) {
  const meta = parseTitle(doc.title());
  const res = {
    team: meta.team,
    year: meta.year,
    page: meta.season,
    roster: parseRoster(doc),
    season: parseInfobox(doc),
  };
  res.games = parseGames(doc, meta);
  return res
};

/* eslint-disable no-console */

const makePage = function (team, year) {
  team = team.replace(/ /g, '_');
  year ||= new Date().getFullYear();
  const nextYear = Number(String(year).substr(2, 4)) + 1;
  const page = `${year}–${nextYear}_${team}_season`; //2018–19_Toronto_Maple_Leafs_season
  return page
};

const addMethod = function (models) {
  models.wtf.nhlSeason = function (team, year) {
    //soften-up the team-input
    team = teams.find((t) => {
      return t === team || t.toLowerCase().includes(team.toLowerCase())
    }) || team;
    const page = makePage(team, year);
    return models.wtf.fetch(page).catch(console.log).then(parse)
  };
  // add it here too
  models.Doc.nhlSeason = parse;
};

export { addMethod$1 as mlb, addMethod as nhl };
