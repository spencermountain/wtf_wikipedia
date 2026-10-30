/*! wtf-plugin-sports 0.0.2 MIT */
'use strict';

var _version = '0.0.2';

// a section plus every subsection nested under it
const withChildren = function (doc, section) {
  const all = doc.sections();
  const start = section.index();
  const depth = section.depth();
  const res = [section];
  for (let i = start + 1; i < all.length; i += 1) {
    if (all[i].depth() <= depth) {
      break
    }
    res.push(all[i]);
  }
  return res
};

// first title wins - 'game log' should beat an earlier 'regular season' prose section
const findSection = function (doc, titles = []) {
  const sections = doc.sections();
  for (const title of titles) {
    const want = title.toLowerCase();
    const found = sections.find((s) => s.title().trim().toLowerCase() === want);
    if (found) {
      return found
    }
  }
  return null
};

// table rows use normalized keys ('box_score'), but callers may pass raw ones ('Box Score')
const soften = (k = '') =>
  String(k)
    .toLowerCase()
    .replace(/[^a-z0-9#+/−]/g, '');

const getCell = function (row = {}, names = []) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== '') {
      return row[name]
    }
  }
  const keys = Object.keys(row);
  for (const name of names) {
    const soft = soften(name);
    const key = keys.find((k) => soften(k) === soft);
    if (key && row[key] !== undefined && row[key] !== '') {
      return row[key]
    }
  }
  return ''
};

// 'Stolarz (0–1–0)' → 'Stolarz',  'Smith (1)‡' → 'Smith'
const stripNotes = function (str = '') {
  return String(str)
    .replace(/\(.*?\)/g, '')
    .replace(/[‡†*]/g, '')
    .trim()
};

// split '4–2' on any dash variant
const dashSplit = /[–\-−—]|&[nm]dash;/;

// one normalized row: {cells: {key: text}, links: {key: page}, attrs: 'style=..'}
const fromTable = function (table) {
  const jsonRows = table.json().rows || []; //keeps per-cell links
  const simpleRows = table.rows(); //keeps row _attrs
  return jsonRows.map((row, i) => {
    const cells = {};
    const links = {};
    Object.keys(row).forEach((k) => {
      cells[k] = row[k].text || '';
      const cellLinks = row[k].links;
      if (cellLinks && cellLinks[0] && cellLinks[0].page) {
        links[k] = cellLinks[0].page;
      }
    });
    return { cells, links, attrs: simpleRows[i]?._attrs || '' }
  })
};

const fromTemplate = function (tmpl) {
  const rows = tmpl.json().data?.rows || [];
  return rows.map((row) => {
    const { rowLinks, rowAttrs, ...cells } = row;
    return { cells, links: rowLinks || {}, attrs: rowAttrs || '' }
  })
};

// each table or game-log template in the section becomes one group of rows
const rowGroups = function (doc, section) {
  const groups = [];
  withChildren(doc, section).forEach((s) => {
    s.tables().forEach((t) => groups.push(fromTable(t)));
    s.templates('game log section').forEach((t) => groups.push(fromTemplate(t)));
  });
  return groups.filter((rows) => rows.length > 0)
};

// the win/loss signal lives in row markup: {{Game-won}} templates or background colors
const classes = {
  won: 'win',
  otw: 'win',
  lost: 'loss',
  otl: 'otl',
  tied: 'tie',
  drawn: 'tie',
};

// green=win, red=loss, yellow=overtime-loss, grey=postponed
const colors = {
  bfb: 'win',
  cfc: 'win',
  dfd: 'win',
  bbffbb: 'win',
  ccffcc: 'win',
  ddffdd: 'win',
  afa: 'win',
  '9f9': 'win',
  fbb: 'loss',
  fcc: 'loss',
  fdd: 'loss',
  ffbbbb: 'loss',
  ffcccc: 'loss',
  ffdddd: 'loss',
  faa: 'loss',
  f99: 'loss',
  ffb: 'otl',
  ffc: 'otl',
  ffe: 'otl',
  ffffbb: 'otl',
  ffffcc: 'otl',
  fff1c1: 'otl',
  ffeeaa: 'otl',
  bbb: 'postponed',
  bbbbbb: 'postponed',
  ccc: 'postponed',
  cccccc: 'postponed',
  '039': 'win', //mlb 'clinched playoff spot'
  '090': 'win', //mlb 'clinched division'
};

const prefixes = { w: 'win', l: 'loss', t: 'tie' };

const outcomeOf = function (attrs = '', scoreText = '') {
  const str = String(attrs).toLowerCase();
  const cl = str.match(/game-([a-z]+)/);
  if (cl && classes[cl[1]]) {
    return classes[cl[1]]
  }
  const bg = str.match(/(?:background(?:-color)? *: *|bgcolor *= *"?)#?([0-9a-f]{3,6})/);
  if (bg && colors[bg[1]]) {
    return colors[bg[1]]
  }
  if (/postponed|cancell?ed|suspended/i.test(scoreText)) {
    return 'postponed'
  }
  // 'W 31–7' / 'L 2–9' score prefixes
  const pre = String(scoreText)
    .trim()
    .match(/^([WLT])\b/i);
  if (pre) {
    return prefixes[pre[1].toLowerCase()]
  }
  return null
};

// '49–26–7' → {wins, losses, otLosses, games}
// a third number means overtime-losses in the modern nhl, ties before 2005
const parseRecord = function (str = '', opts = {}) {
  str = String(str);
  // 1981-style split seasons list several records - prefer the overall one
  const overall = str.match(/overall:? *(.+)/i);
  if (overall) {
    str = overall[1];
  }
  // take the first record-shaped run, so '1st half: 16–42' isn't read as 1–16
  const shaped = str.match(/\d+(?: *[–\-−] *\d+)+/);
  if (!shaped) {
    return null
  }
  const nums = shaped[0]
    .split(dashSplit)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => isNaN(n) === false);
  if (nums.length < 2) {
    return null
  }
  const rec = { wins: nums[0], losses: nums[1] };
  if (nums.length === 3) {
    if (opts.ties === true) {
      rec.ties = nums[2];
    } else {
      rec.otLosses = nums[2];
    }
  }
  if (nums.length === 4) {
    //the 1999-2005 nhl format: W–L–T–OTL
    rec.ties = nums[2];
    rec.otLosses = nums[3];
  }
  rec.games = nums.reduce((a, b) => a + b, 0);
  rec.winPct = rec.games > 0 ? Number((rec.wins / rec.games).toFixed(3)) : 0;
  return rec
};

// '2024–25 Montreal Canadiens season' → 'Montreal Canadiens'
const fromSeasonPage = function (page = '') {
  const m = String(page).match(/^\d{4}(?:[–-]\d{2,4})? (.+?) season$/);
  return m ? m[1] : null
};

// a plain team link: 'Texas Rangers (baseball)' → 'Texas Rangers'
const fromTeamPage = function (page = '') {
  page = String(page);
  if (!page || / season$/.test(page)) {
    return null
  }
  return page.replace(/ \(.*?\)$/, '')
};

// '4–2', 'W 31–7', '2–1 (11)' → [4, 2]
const parseScore = function (txt = '') {
  txt = String(txt)
    .replace(/^ *[WLT]\b\.? */i, '')
    .replace(/\(.*?\)/g, '')
    .trim();
  const arr = txt.split(dashSplit).map((s) => parseInt(s.trim(), 10));
  if (arr.length < 2 || isNaN(arr[0]) || isNaN(arr[1])) {
    return null
  }
  return [arr[0], arr[1]]
};

// 'Rogers Centre (23,987)' or '19,108' → 19108
const parseAttendance = function (txt = '') {
  let str = String(txt);
  const m = str.match(/\(([0-9, ]+)\)/);
  if (m) {
    str = m[1];
  }
  return parseInt(str.replace(/[, ]/g, ''), 10) || null
};

// 'Toronto' matches 'Toronto Maple Leafs'
const sameTeam = function (cell = '', team = '') {
  cell = cell.trim().toLowerCase();
  team = team.trim().toLowerCase();
  if (!cell || !team) {
    return false
  }
  return team.includes(cell) || cell.includes(team)
};

// visitor/home columns carry the score orientation directly
const visitorHome = function (game, row, ctx, score) {
  const visitor = getCell(row.cells, ['visitor', 'away']);
  const home = getCell(row.cells, ['home']);
  if (!visitor || !home) {
    return false
  }
  let isHome = sameTeam(home, ctx.team);
  if (isHome === false && sameTeam(visitor, ctx.team) === false) {
    // neither side matched - our own team is usually the unlinked one
    isHome = row.links.home === undefined;
  }
  game.home = isHome;
  const opp = isHome ? visitor : home;
  const oppLink = isHome ? row.links.visitor : row.links.home;
  game.opponent = fromSeasonPage(oppLink) || ctx.fullName(opp.trim());
  if (score) {
    game.result = isHome ? { us: score[1], them: score[0] } : { us: score[0], them: score[1] };
  }
  return true
};

// an opponent column marks away-games with '@' or 'at'
const opponentCol = function (game, row, ctx, score) {
  let opp = getCell(row.cells, ['opponent', 'opp', 'team']);
  if (!opp) {
    return false
  }
  game.home = /^ *(@|at )/i.test(opp) === false;
  opp = opp.replace(/^ *(@|at ) */i, '').trim();
  opp = opp.replace(/ *\(\d{4}[^)]*\)$/, ''); //a '(2002–03)' season-link suffix
  const oppLink = row.links.opponent || row.links.opp || row.links.team;
  game.opponent = fromSeasonPage(oppLink) || fromTeamPage(oppLink) || ctx.fullName(opp);
  // scores here may be ours-first or winner-first - the outcome settles both
  if (score && game.outcome === 'win') {
    game.result = { us: Math.max(...score), them: Math.min(...score) };
  } else if (score && (game.outcome === 'loss' || game.outcome === 'otl')) {
    game.result = { us: Math.min(...score), them: Math.max(...score) };
  } else if (score) {
    game.result = { us: score[0], them: score[1] }; //oriented later, from the record
  }
  return true
};

const monthNames = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

// some 1980s logs name the date column after the month, with day-of-month cells
const findDate = function (cells) {
  const date = getCell(cells, ['date']);
  if (date) {
    return date
  }
  const key = Object.keys(cells).find((k) => monthNames.includes(k));
  if (key && cells[key] && /^\d{1,2}$/.test(String(cells[key]).trim())) {
    return `${key.charAt(0).toUpperCase()}${key.slice(1)} ${String(cells[key]).trim()}`
  }
  return ''
};

// one normalized row → one game, or null for legend/filler rows
const buildGame = function (row, ctx) {
  const { cells, attrs } = row;
  const date = findDate(cells);
  if (!date) {
    return null
  }
  const scoreText = getCell(cells, ['score', 'result', 'box score']);
  const score = parseScore(scoreText);
  const game = {
    date: ctx.dateYear ? ctx.dateYear(date, ctx.year) : date,
    opponent: '',
    home: null,
    outcome: outcomeOf(attrs, scoreText),
    result: null,
  };
  const num = parseInt(getCell(cells, ['#', 'game', 'week']), 10);
  if (isNaN(num) === false) {
    game.game = num;
  }
  const found = visitorHome(game, row, ctx, score) || opponentCol(game, row, ctx, score);
  if (found === false) {
    return null
  }
  // the ot/so flag is its own column, or tacked onto the score: '2–2 OT'
  const ot = getCell(cells, ['ot', 'overtime']) || String(scoreText).replace(/\(.*?\)/g, '');
  game.overtime = /\b([0-9]?ot|so)\b/i.test(ot);
  if (/\bso\b/i.test(ot)) {
    game.shootout = true;
  }
  game.record = parseRecord(getCell(cells, ['record', 'series']), ctx.record);
  game.attendance = parseAttendance(getCell(cells, ['attendance', 'location (attendance)']));
  if (ctx.extras) {
    ctx.extras(game, row);
  }
  return game
};

// candidate sections in title-priority order - pages can have
// a prose 'Regular season' section besides the real schedule one
const findSections = function (doc, titles) {
  const all = doc.sections();
  const found = [];
  titles.forEach((title) => {
    const want = title.toLowerCase();
    all.forEach((s) => {
      if (s.title().trim().toLowerCase() === want) {
        found.push(s);
      }
    });
  });
  return found
};

// without row styling, a changing record column still reveals each outcome
const inferFromRecord = function (games) {
  let prev = { wins: 0, losses: 0, ties: 0, otLosses: 0 }; //seasons and series start 0–0
  games.forEach((g) => {
    const rec = g.record;
    if (g.outcome === null && rec) {
      if (rec.wins > prev.wins) {
        g.outcome = 'win';
      } else if (rec.otLosses !== undefined && rec.otLosses > (prev.otLosses || 0)) {
        g.outcome = 'otl';
      } else if (rec.ties !== undefined && rec.ties > (prev.ties || 0)) {
        g.outcome = 'tie';
      } else if (rec.losses > prev.losses) {
        g.outcome = 'loss';
      }
    }
    prev = rec || prev;
  });
  return games
};

// once the outcome is known, un-oriented scores can be fixed-up
const orientScores = function (games) {
  games.forEach((g) => {
    if (g.result && g.outcome) {
      const { us, them } = g.result;
      if (g.outcome === 'win' && us < them) {
        g.result = { us: them, them: us };
      }
      if ((g.outcome === 'loss' || g.outcome === 'otl') && us > them) {
        g.result = { us: them, them: us };
      }
    }
    if (g.outcome === null || g.outcome === 'postponed') {
      g.win = null;
    } else {
      g.win = g.outcome === 'win';
    }
  });
  return games
};

const buildGroup = function (rows, ctx) {
  const games = rows.map((row) => buildGame(row, ctx));
  return games.filter((g) => g !== null)
};

// infer missing outcomes over a whole run of games, so records carry across tables
const finish = (games) => orientScores(inferFromRecord(games));

// all games under the best matching section, in one flat list
const findGames = function (doc, ctx, titles) {
  for (const section of findSections(doc, titles)) {
    const games = rowGroups(doc, section).flatMap((rows) => buildGroup(rows, ctx));
    if (games.length > 0) {
      return finish(games)
    }
  }
  return []
};

// keep each table/template separate - a group per playoff series
const findSeries = function (doc, ctx, titles) {
  for (const section of findSections(doc, titles)) {
    const series = rowGroups(doc, section)
      .map((rows) => finish(buildGroup(rows, ctx)))
      .filter((games) => games.length > 0);
    if (series.length > 0) {
      return series
    }
  }
  return []
};

const ordinal = /^([0-9]+)(?:st|nd|rd|th)$/i;

// '3rd' → 3,  '2,006' → 2006,  text stays text
const clean = function (str = '') {
  str = String(str).trim();
  const m = str.match(ordinal);
  if (m) {
    return Number(m[1])
  }
  if (/^[0-9][0-9,]*$/.test(str)) {
    return Number(str.replace(/,/g, ''))
  }
  return str
};

// flatten a team-season infobox into {key: value}, with the record parsed
const parseInfobox = function (doc, names = [], recordOpts = {}) {
  let info = null;
  for (const name of names) {
    info = doc.infobox(name);
    if (info) {
      break
    }
  }
  if (!info) {
    return {}
  }
  const data = {};
  Object.entries(info.json().data).forEach(([key, block]) => {
    data[key] = clean(block.text || '');
  });
  // 'record', 'homerecord', 'roadrecord' all parse as win-loss records
  Object.keys(data).forEach((key) => {
    if (/record$/.test(key)) {
      data[key] = parseRecord(String(data[key]), recordOpts) || data[key];
    }
  });
  return data
};

// franchises are lists of {name, from}, newest-first
const matches = (name, want) => name.toLowerCase().includes(want);
const validFor = (names, year) => names.find((o) => o.from <= year) || null;

// resolve('cleveland', 2015) → 'Cleveland Indians'
const resolveTeam = function (franchises, input, year) {
  const want = String(input)
    .toLowerCase()
    .trim()
    .replace(/^ny /, 'new york ')
    .replace(/^la /, 'los angeles ');
  // prefer the franchise actually using this name in this year
  // so 'Winnipeg Jets' 2018 is not routed through the Coyotes franchise
  for (const names of franchises) {
    const valid = validFor(names, year);
    if (valid && matches(valid.name, want)) {
      return valid.name
    }
  }
  // then follow any name across a rename - 'cleveland indians' 2023 → Guardians
  for (const names of franchises) {
    if (names.some((o) => matches(o.name, want))) {
      const valid = validFor(names, year);
      if (valid) {
        return valid.name
      }
    }
  }
  return input
};

// current mlb franchises - renamed ones list each name, newest-first
var franchises$1 = [
  [{ name: 'Arizona Diamondbacks', from: 1998 }],
  [
    { name: 'Athletics', from: 2025 },
    { name: 'Oakland Athletics', from: 1968 },
    { name: 'Kansas City Athletics', from: 1955 },
    { name: 'Philadelphia Athletics', from: 1901 },
  ],
  [{ name: 'Atlanta Braves', from: 1966 }, { name: 'Milwaukee Braves', from: 1953 }],
  [{ name: 'Baltimore Orioles', from: 1954 }],
  [{ name: 'Boston Red Sox', from: 1908 }],
  [{ name: 'Chicago Cubs', from: 1903 }],
  [{ name: 'Chicago White Sox', from: 1901 }],
  [{ name: 'Cincinnati Reds', from: 1890 }],
  [{ name: 'Cleveland Guardians', from: 2022 }, { name: 'Cleveland Indians', from: 1915 }],
  [{ name: 'Colorado Rockies', from: 1993 }],
  [{ name: 'Detroit Tigers', from: 1901 }],
  [{ name: 'Houston Astros', from: 1965 }],
  [{ name: 'Kansas City Royals', from: 1969 }],
  [
    { name: 'Los Angeles Angels', from: 2016 },
    { name: 'Los Angeles Angels of Anaheim', from: 2005 },
    { name: 'Anaheim Angels', from: 1997 },
    { name: 'California Angels', from: 1966 },
    { name: 'Los Angeles Angels', from: 1961 },
  ],
  [{ name: 'Los Angeles Dodgers', from: 1958 }, { name: 'Brooklyn Dodgers', from: 1932 }],
  [{ name: 'Miami Marlins', from: 2012 }, { name: 'Florida Marlins', from: 1993 }],
  [{ name: 'Milwaukee Brewers', from: 1970 }],
  [{ name: 'Minnesota Twins', from: 1961 }],
  [{ name: 'New York Mets', from: 1962 }],
  [{ name: 'New York Yankees', from: 1913 }],
  [{ name: 'Philadelphia Phillies', from: 1890 }],
  [{ name: 'Pittsburgh Pirates', from: 1891 }],
  [{ name: 'San Diego Padres', from: 1969 }],
  [{ name: 'San Francisco Giants', from: 1958 }],
  [{ name: 'Seattle Mariners', from: 1977 }],
  [{ name: 'St. Louis Cardinals', from: 1900 }],
  [{ name: 'Tampa Bay Rays', from: 2008 }, { name: 'Tampa Bay Devil Rays', from: 1998 }],
  [{ name: 'Texas Rangers', from: 1972 }],
  [{ name: 'Toronto Blue Jays', from: 1977 }],
  [{ name: 'Washington Nationals', from: 2005 }, { name: 'Montreal Expos', from: 1969 }],
];

// the roster is {{MLBplayer}} templates in a 'Roster' section
const parseRoster = function (doc, year) {
  const s = findSection(doc, ['roster', 'players', `${year} roster`]);
  if (!s) {
    return []
  }
  const players = withChildren(doc, s).flatMap((c) => c.templates('mlbplayer'));
  return players.map((tmpl) => ({ ...tmpl.json().data }))
};

// a table in a '2008 draft picks' section
const parseDraftPicks = function (doc) {
  const s = doc.sections().find((sec) => /\bdraft\b/i.test(sec.title()));
  if (!s) {
    return []
  }
  const table = s.tables()[0];
  if (!table) {
    return []
  }
  return table.json()
};

// batting + pitching tables, split by their columns
const parsePlayerStats = function (doc) {
  const res = { batters: [], pitchers: [] };
  const s = findSection(doc, ['statistics', 'player stats', 'player statistics']);
  if (!s) {
    return res
  }
  const rows = withChildren(doc, s).flatMap((c) => c.tables().flatMap((t) => t.rows()));
  rows.forEach((p) => {
    if (p.rbi !== undefined || p.hr !== undefined || p.RBI !== undefined || p.HR !== undefined) {
      res.batters.push(p);
    } else {
      res.pitchers.push(p);
    }
  });
  return res
};

// '2025 Toronto Blue Jays season' → {year: 2025, team: 'Toronto Blue Jays'}
const parseTitle$1 = function (title = '') {
  const m = String(title).match(/^(\d{4}) (.+?) season$/);
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/);
  return { year: year ? Number(year[0]) : null, team: '' }
};

// before opening-day in april, "this season" usually means last year's
const defaultYear$1 = function () {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
};

const noSave = /^[–\-−—]*$/;

// per-game extras: the pitchers of record, and games-back
const extras$1 = function (game, row) {
  const win = stripNotes(getCell(row.cells, ['win']));
  const loss = stripNotes(getCell(row.cells, ['loss']));
  let save = stripNotes(getCell(row.cells, ['save']));
  if (noSave.test(save)) {
    save = null;
  }
  game.pitchers = { win, loss, save };
  const gb = getCell(row.cells, ['gb', 'games back']);
  if (gb) {
    game.gamesBack = gb;
  }
};

const standings$1 = function (season) {
  return {
    record: season.record || null,
    league: getCell(season, ['league']) || '',
    division: getCell(season, ['division']) || '',
    divisionPlace: getCell(season, ['divisional_place', 'division_place', 'divisionrank']) || null,
    manager: getCell(season, ['manager', 'managers']) || '',
    ballpark: getCell(season, ['ballpark', 'stadium']) || '',
  }
};

const parse$1 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTitle$1(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: {},
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises$1, name, meta.year || new Date().getFullYear()),
    extras: extras$1,
  };
  const season = parseInfobox(doc, ['baseball team season', 'mlb yearly'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings$1(season),
    games: findGames(doc, ctx, ['game log', 'season game log', 'schedule and results', 'schedule', 'regular season']),
    postseason: findSeries(doc, ctx, ['postseason game log', 'postseason', 'playoffs']),
    roster: parseRoster(doc, meta.year),
    draftPicks: parseDraftPicks(doc),
    playerStats: parsePlayerStats(doc),
  }
};

const addMethod$1 = function (models) {
  models.wtf.mlbSeason = async function (team, year, options) {
    year ||= defaultYear$1();
    team = resolveTeam(franchises$1, team, year);
    const page = `${year} ${team} season`.replace(/ /g, '_');
    const doc = await models.wtf.fetch(page, options);
    return parse$1(doc)
  };
  models.Doc.prototype.mlbSeason = function () {
    return parse$1(this)
  };
};

// current nhl franchises - renamed ones list each name, newest-first
var franchises = [
  [{ name: 'Anaheim Ducks', from: 2006 }, { name: 'Mighty Ducks of Anaheim', from: 1993 }],
  [{ name: 'Boston Bruins', from: 1924 }],
  [{ name: 'Buffalo Sabres', from: 1970 }],
  [{ name: 'Calgary Flames', from: 1980 }],
  [{ name: 'Carolina Hurricanes', from: 1997 }, { name: 'Hartford Whalers', from: 1979 }],
  [{ name: 'Chicago Blackhawks', from: 1986 }, { name: 'Chicago Black Hawks', from: 1926 }],
  [{ name: 'Colorado Avalanche', from: 1995 }, { name: 'Quebec Nordiques', from: 1979 }],
  [{ name: 'Columbus Blue Jackets', from: 2000 }],
  [{ name: 'Dallas Stars', from: 1993 }, { name: 'Minnesota North Stars', from: 1967 }],
  [{ name: 'Detroit Red Wings', from: 1932 }],
  [{ name: 'Edmonton Oilers', from: 1979 }],
  [{ name: 'Florida Panthers', from: 1993 }],
  [{ name: 'Los Angeles Kings', from: 1967 }],
  [{ name: 'Minnesota Wild', from: 2000 }],
  [{ name: 'Montreal Canadiens', from: 1917 }],
  [{ name: 'Nashville Predators', from: 1998 }],
  [{ name: 'New Jersey Devils', from: 1982 }, { name: 'Colorado Rockies', from: 1976 }],
  [{ name: 'New York Islanders', from: 1972 }],
  [{ name: 'New York Rangers', from: 1926 }],
  [{ name: 'Ottawa Senators', from: 1992 }],
  [{ name: 'Philadelphia Flyers', from: 1967 }],
  [{ name: 'Pittsburgh Penguins', from: 1967 }],
  [{ name: 'San Jose Sharks', from: 1991 }],
  [{ name: 'Seattle Kraken', from: 2021 }],
  [{ name: 'St. Louis Blues', from: 1967 }],
  [{ name: 'Tampa Bay Lightning', from: 1992 }],
  [{ name: 'Toronto Maple Leafs', from: 1927 }],
  [
    { name: 'Utah Mammoth', from: 2025 },
    { name: 'Utah Hockey Club', from: 2024 },
    { name: 'Arizona Coyotes', from: 2014 },
    { name: 'Phoenix Coyotes', from: 1996 },
    { name: 'Winnipeg Jets', from: 1979 },
  ],
  [{ name: 'Vancouver Canucks', from: 1970 }],
  [{ name: 'Vegas Golden Knights', from: 2017 }],
  [{ name: 'Washington Capitals', from: 1974 }],
  [{ name: 'Winnipeg Jets', from: 2011 }, { name: 'Atlanta Thrashers', from: 1999 }],
];

const asNum = (val) => Number(String(val).replace(/[−–]/, '-')) || 0;

const playerName = function (row) {
  let name = getCell(row, ['player', 'name']);
  return stripNotes(name)
};

const notTotal = (p) => p.name && /^totals?$/i.test(p.name) === false;

// the 'Skaters' table - games, goals, assists, points
const parseSkaters = function (doc) {
  const s = findSection(doc, ['skaters', 'roster', 'player statistics', 'player stats']);
  if (!s) {
    return []
  }
  const tables = withChildren(doc, s).flatMap((c) => c.tables());
  if (!tables[0]) {
    return []
  }
  const players = tables[0].rows().map((row) => {
    return {
      name: playerName(row),
      games: asNum(getCell(row, ['gp'])),
      goals: asNum(getCell(row, ['g', 'goals'])),
      assists: asNum(getCell(row, ['a', 'assists'])),
      points: asNum(getCell(row, ['pts', 'points'])),
      plusMinus: asNum(getCell(row, ['+/−', '+/-'])),
    }
  });
  return players.filter(notTotal)
};

// the 'Goaltenders' table - wins, losses, save-percentage
const parseGoalies = function (doc) {
  const s = findSection(doc, ['goaltenders', 'goalies', 'goaltending']);
  if (!s) {
    return []
  }
  const table = s.tables()[0];
  if (!table) {
    return []
  }
  const players = table.rows().map((row) => {
    return {
      name: playerName(row),
      games: asNum(getCell(row, ['gp', 'games'])),
      wins: asNum(getCell(row, ['w', 'wins'])),
      losses: asNum(getCell(row, ['l', 'losses'])),
      otLosses: asNum(getCell(row, ['ot', 'otl'])),
      goalsAgainstAvg: asNum(getCell(row, ['gaa'])),
      savePct: asNum(getCell(row, ['sv%', 'sv', 'save %'])),
      shutouts: asNum(getCell(row, ['so'])),
    }
  });
  return players.filter(notTotal)
};

// '2024–25 Toronto Maple Leafs season' → {year: 2024, team: 'Toronto Maple Leafs'}
const parseTitle = function (title = '') {
  const m = String(title).match(/^(\d{4})(?:[–-]\d{2,4})? (.+?) season$/);
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/);
  return { year: year ? Number(year[0]) : null, team: '' }
};

// nhl seasons span two years: '2024–25', with '1999–2000' at the century
const seasonSlug = function (year) {
  const next = year + 1;
  let suffix = String(next % 100).padStart(2, '0');
  if (suffix === '00') {
    suffix = String(next);
  }
  return `${year}–${suffix}`
};

const makeTitle = function (team, year) {
  return `${seasonSlug(year)} ${team} season`.replace(/ /g, '_')
};

// nhl seasons start in october - before august, "this season" began last year
const defaultYear = function () {
  const now = new Date();
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
};

// per-game extras: cumulative points, and the goalie of record
const extras = function (game, row) {
  const pts = parseInt(getCell(row.cells, ['pts', 'points']), 10);
  if (isNaN(pts) === false) {
    game.points = pts;
  }
  const goalie = stripNotes(getCell(row.cells, ['decision', 'goalie']));
  if (goalie) {
    game.decision = goalie;
  }
};

// absorb infobox key drift: 'division_place' is now 'DivisionRank'
const standings = function (season) {
  return {
    record: season.record || null,
    division: getCell(season, ['division']) || '',
    divisionPlace: getCell(season, ['divisionrank', 'division_place', 'divisionplace']) || null,
    conference: getCell(season, ['conference']) || '',
    conferencePlace: getCell(season, ['conferencerank', 'conference_place']) || null,
    goalsFor: getCell(season, ['goalsfor', 'goals_for']) || null,
    goalsAgainst: getCell(season, ['goalsagainst', 'goals_against']) || null,
  }
};

const parse = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: { ties: Boolean(meta.year && meta.year < 2005) }, //third number is OTL from 2005-06 on
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // the season wraps into the next calendar-year
      return /^(jan|feb|mar|apr|may|jun)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
    extras,
  };
  const season = parseInfobox(doc, ['ice hockey team season', 'nhl team season'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings(season),
    games: findGames(doc, ctx, ['regular season', 'schedule and results', 'game log', 'schedule']),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason']),
    skaters: parseSkaters(doc),
    goalies: parseGoalies(doc),
  }
};

const addMethod = function (models) {
  models.wtf.nhlSeason = async function (team, year, options) {
    year ||= defaultYear();
    team = resolveTeam(franchises, team, year);
    const doc = await models.wtf.fetch(makeTitle(team, year), options);
    return parse(doc)
  };
  models.Doc.prototype.nhlSeason = function () {
    return parse(this)
  };
};

exports.mlb = addMethod$1;
exports.nhl = addMethod;
exports.version = _version;
