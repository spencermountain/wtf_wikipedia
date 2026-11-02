/*! wtf-plugin-sports 0.0.2 MIT */
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

// the key a column actually landed under, allowing combined headers like 'Opponent / Time'
const findKey = function (row = {}, names = []) {
  const keys = Object.keys(row);
  for (const name of names) {
    const soft = soften(name);
    const key = keys.find((k) => soften(k) === soft) || keys.find((k) => soften(k).startsWith(soft));
    if (key) {
      return key
    }
  }
  return null
};

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

// each table or game-log template in the section becomes one group: {title, rows}
// a `skip` regex drops matching subsections and everything nested under them
const rowGroups = function (doc, section, skip) {
  const groups = [];
  let skipBelow = null;
  withChildren(doc, section).forEach((s, i) => {
    if (i > 0 && skip) {
      if (skipBelow !== null && s.depth() > skipBelow) {
        return
      }
      skipBelow = null;
      if (skip.test(s.title())) {
        skipBelow = s.depth();
        return
      }
    }
    s.tables().forEach((t) => groups.push({ title: '', rows: fromTable(t) }));
    s.templates('game log section').forEach((t) => {
      const data = t.json().data || {};
      groups.push({ title: String(data.title || ''), rows: fromTemplate(t) });
    });
  });
  return groups.filter((g) => g.rows.length > 0)
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
  d0ffe3: 'win', //mint, with the pink below on 90s-00s soccer pages
  fbb: 'loss',
  fcc: 'loss',
  fcf: 'loss', //pink, on ahl playoff logs
  ffccff: 'loss',
  fdd: 'loss',
  ffbbbb: 'loss',
  ffcccc: 'loss',
  ffdddd: 'loss',
  faa: 'loss',
  f99: 'loss',
  ffd0e3: 'loss',
  ffb: 'otl',
  ffc: 'otl',
  ffd: 'otl',
  ffe: 'otl',
  ffffbb: 'otl',
  ffffcc: 'otl',
  ffffdd: 'otl',
  fff1c1: 'otl',
  ffeeaa: 'otl',
  bbb: 'postponed',
  bbbbbb: 'postponed',
  ccc: 'postponed',
  cccccc: 'postponed',
  '039': 'win', //mlb 'clinched playoff spot'
  '090': 'win', //mlb 'clinched division'
};

const prefixes = { w: 'win', l: 'loss', t: 'tie', d: 'tie' };

const rawOutcome = function (attrs = '', scoreText = '') {
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
  // 'W 31–7' / 'L 2–9' / 'D 2–2' score prefixes
  const pre = String(scoreText)
    .trim()
    .match(/^([WLTD])\b/i);
  if (pre) {
    return prefixes[pre[1].toLowerCase()]
  }
  return null
};

// soccer tables use the same yellow for a draw that hockey uses for an ot-loss,
// and some 90s pages shade draws a light grey that means nothing elsewhere
const outcomeOf = function (attrs = '', scoreText = '', draws = false) {
  const res = rawOutcome(attrs, scoreText);
  if (draws === true) {
    if (res === 'otl') {
      return 'tie'
    }
    if (res === null && /f3f3f3/i.test(String(attrs))) {
      return 'tie'
    }
  }
  return res
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
    if (opts.otWins === true) {
      //the pwhl format: W–OTW–OTL–L, with wins counting both
      rec.wins = nums[0] + nums[1];
      rec.otWins = nums[1];
      rec.otLosses = nums[2];
      rec.losses = nums[3];
    } else if (opts.soLosses === true) {
      //the ahl format: W–L–OTL–SOL - a shootout loss is an overtime loss, split out
      rec.otLosses = nums[2] + nums[3];
      rec.soLosses = nums[3];
    } else {
      //the 1999-2005 nhl format: W–L–T–OTL
      rec.ties = nums[2];
      rec.otLosses = nums[3];
    }
  }
  rec.games = nums.reduce((a, b) => a + b, 0);
  rec.winPct = rec.games > 0 ? Number((rec.wins / rec.games).toFixed(3)) : 0;
  return rec
};

// tally a record from the parsed games - soccer infoboxes rarely state one
const countRecord = function (games) {
  const rec = { wins: 0, losses: 0, ties: 0, games: games.length };
  games.forEach((g) => {
    if (g.outcome === 'win') {
      rec.wins += 1;
    } else if (g.outcome === 'loss') {
      rec.losses += 1;
    } else if (g.outcome === 'tie') {
      rec.ties += 1;
    }
  });
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
    .replace(/^ *[WLTD]\b\.? */i, '')
    .replace(/\(.*?\)/g, '')
    .trim();
  const arr = txt.split(dashSplit).map((s) => parseInt(s.trim(), 10));
  if (arr.length < 2 || isNaN(arr[0]) || isNaN(arr[1])) {
    return null
  }
  return [arr[0], arr[1]]
};

// 'Rogers Centre (23,987)', 'Bell Centre 21,900' or '19,108' → 19108
const parseAttendance = function (txt = '') {
  let str = String(txt);
  const m = str.match(/\(([0-9, ]+)\)/) || str.match(/([0-9][0-9,]{2,}) *$/);
  if (m && m[1]) {
    str = m[1];
  }
  return parseInt(str.replace(/[, ]/g, ''), 10) || null
};

// '🏴 Chelsea' and 'Chelsea F.C.' both reduce to 'chelsea'
const bareName = function (str = '') {
  return String(str)
    .toLowerCase()
    .replace(/[^\p{L}\p{N} .&'-]/gu, '')
    .replace(/ (a\.?f\.?c\.?|f\.?c\.?)$/, '')
    .trim()
};

// 'Toronto' matches 'Toronto Maple Leafs'
const sameTeam = function (cell = '', team = '') {
  cell = bareName(cell);
  team = bareName(team);
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

// an opponent column marks away-games with '@' or 'at', home-games sometimes with 'vs.'
const opponentCol = function (game, row, ctx, score) {
  // combined headers like 'Opponent / Time' still count as the opponent column
  const key = findKey(row.cells, ['opponent', 'opp', 'team']);
  let opp = key ? row.cells[key] : '';
  if (!opp) {
    return false
  }
  game.home = /^ *(@|at )/i.test(opp) === false;
  opp = opp.replace(/^ *(@|at |vs\.? ) */i, '').trim();
  opp = opp.replace(/ *\(\d{4}[^)]*\)$/, ''); //a '(2002–03)' season-link suffix
  opp = opp.replace(/ \d{1,2}:\d{2} ?[ap]\.?m.*$/i, ''); //a '6:05pm (ESPN)' suffix
  const oppLink = row.links[key];
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

const months = {
  jan: 'January',
  feb: 'February',
  mar: 'March',
  apr: 'April',
  may: 'May',
  jun: 'June',
  jul: 'July',
  aug: 'August',
  sep: 'September',
  sept: 'September',
  oct: 'October',
  nov: 'November',
  dec: 'December',
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',
};

// some logs name the date column after the month, with day-of-month cells like '14' or '1*'
const findDate = function (cells) {
  // prefix-match, for combined headings like 'Date / Time (ET)'
  const key = findKey(cells, ['date']);
  if (key && cells[key]) {
    return cells[key]
  }
  const month = Object.keys(cells).find((k) => months[k] !== undefined);
  if (month && cells[month]) {
    const day = String(cells[month])
      .trim()
      .match(/^(\d{1,2})\*?$/);
    if (day) {
      return `${months[month]} ${day[1]}`
    }
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
  // bye-weeks have a week number, but no game
  if (/\bbye\b/i.test(date)) {
    return null
  }
  // 'result f-a' is the soccer for–against column, always our-score-first
  const scoreText = getCell(cells, ['score', 'result', 'box score', 'result f-a', 'score f-a']);
  const score = parseScore(scoreText);
  const game = {
    date: ctx.dateYear ? ctx.dateYear(date, ctx.year) : date,
    opponent: '',
    home: null,
    outcome: outcomeOf(attrs, scoreText, ctx.draws === true),
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
  // an 'H/A' or venue letter-column beats the opponent-prefix guess
  const ha = String(getCell(cells, ['h/a', 'home/away', 'venue', 'ground'])).trim();
  if (/^h$/i.test(ha)) {
    game.home = true;
  } else if (/^a$/i.test(ha)) {
    game.home = false;
  } else if (/^n$/i.test(ha)) {
    game.home = null; //neutral ground
  }
  // a bare W/L/D letter-column beside a separate score column
  if (game.outcome === null) {
    game.outcome = outcomeOf('', getCell(cells, ['result', 'outcome']), ctx.draws === true);
  }
  // the ot/so flag is its own column, or tacked onto the score: '2–2 OT', '109–113 (OT)'
  const ot = getCell(cells, ['ot', 'overtime']) || String(scoreText);
  game.overtime = /\b([0-9]?ot|so)\b/i.test(ot);
  if (/\bso\b/i.test(ot)) {
    game.shootout = true;
  }
  game.record = parseRecord(getCell(cells, ['record', 'series']), ctx.record);
  game.attendance = parseAttendance(getCell(cells, ['attendance', 'location (attendance)', 'location attendance']));
  if (ctx.extras) {
    ctx.extras(game, row);
  }
  // all-star breaks and broadcast notes have a date, but nothing else
  if (game.game === undefined && !score && !game.record && game.outcome === null) {
    return null
  }
  return game
};

// titles of the sections this one is nested under
const ancestorTitles = function (all, i) {
  const titles = [];
  let depth = all[i].depth();
  for (let j = i - 1; j >= 0 && depth > 0; j -= 1) {
    if (all[j].depth() < depth) {
      titles.push(all[j].title().trim().toLowerCase());
      depth = all[j].depth();
    }
  }
  return titles
};

// candidate sections in title-priority order - pages can have
// a prose 'Regular season' section besides the real schedule one
const findSections = function (doc, titles, exclude) {
  const all = doc.sections();
  const found = [];
  const seen = new Set();
  const addMatches = function (want, loose) {
    all.forEach((s, i) => {
      const title = s.title().trim().toLowerCase();
      const hit = loose ? title.includes(want) : title === want;
      if (hit && seen.has(s.index()) === false) {
        if (exclude && exclude.test(title)) {
          return
        }
        // a 'Game log' nested under 'Playoffs' is not the regular-season log
        if (exclude && ancestorTitles(all, i).some((t) => exclude.test(t))) {
          return
        }
        seen.add(s.index());
        found.push(s);
      }
    });
  };
  titles.forEach((title) => addMatches(title.toLowerCase(), false));
  // a looser pass - 'Game log and schedule' still counts as 'game log'
  titles.forEach((title) => addMatches(title.toLowerCase(), true));
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

// subsections or log-titles that are not regular-season games
const postseasonish = /postseason|playoff|world series|championship|division series|wild card/i;
const notRegularSeason =
  /postseason|playoff|world series|championship|division series|wild card|preseason|pre-season|exhibition|detailed record|composite box|month.by.month/i;

// all games under the best matching section, in one flat list
const findGames = function (doc, ctx, titles) {
  for (const section of findSections(doc, titles, notRegularSeason)) {
    const groups = rowGroups(doc, section, notRegularSeason).filter((g) => notRegularSeason.test(g.title) === false);
    const games = groups.flatMap((g) => buildGroup(g.rows, ctx));
    if (games.length > 0) {
      return finish(games)
    }
  }
  return []
};

// keep each table/template separate - a group per playoff series
const findSeries = function (doc, ctx, titles, gameTitles) {
  for (const section of findSections(doc, titles)) {
    const series = rowGroups(doc, section)
      .map((g) => finish(buildGroup(g.rows, ctx)))
      .filter((games) => games.length > 0);
    if (series.length > 0) {
      return series
    }
  }
  // some pages keep the postseason logs inside the main game-log section
  for (const section of findSections(doc, gameTitles || [])) {
    const groups = rowGroups(doc, section).filter((g) => postseasonish.test(g.title));
    const series = groups.map((g) => finish(buildGroup(g.rows, ctx))).filter((games) => games.length > 0);
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
var franchises$a = [
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
const parseRoster$4 = function (doc, year) {
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
const parsePlayerStats$1 = function (doc) {
  const res = { batters: [], pitchers: [] };
  const seen = new Set();
  const sections = [];
  const addTree = function (section) {
    withChildren(doc, section).forEach((c) => {
      if (seen.has(c.index()) === false) {
        seen.add(c.index());
        sections.push(c);
      }
    });
  };
  let main = findSection(doc, ['statistics', 'player stats', 'player statistics']);
  // looser fallback - 'Final Regular Season Statistics' and friends
  main = main || doc.sections().find((s) => /\b(statistics|stats)\b/i.test(s.title())) || null;
  if (main) {
    addTree(main);
  }
  // 'Batting' and 'Pitching' sometimes stand alone, outside any stats section
  doc.sections().forEach((s) => {
    if (/^(batting|pitching)$/i.test(s.title().trim()) && seen.has(s.index()) === false) {
      addTree(s);
    }
  });
  sections.forEach((c) => {
    // the section title usually says which kind of table this is -
    // pitching tables also have hr/rbi columns, so titles beat the key-check
    let kind = null;
    if (/pitch/i.test(c.title())) {
      kind = 'pitchers';
    } else if (/bat|hit/i.test(c.title())) {
      kind = 'batters';
    }
    const rows = c.tables().flatMap((t) => t.rows());
    rows.forEach((p) => {
      if (kind) {
        res[kind].push(p);
      } else if (p.rbi !== undefined || p.hr !== undefined || p.RBI !== undefined || p.HR !== undefined) {
        res.batters.push(p);
      } else {
        res.pitchers.push(p);
      }
    });
  });
  return res
};

// '2025 Toronto Blue Jays season' → {year: 2025, team: 'Toronto Blue Jays'}
const parseTitle = function (title = '') {
  const m = String(title).match(/^(\d{4}) (.+?) season$/);
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/);
  return { year: year ? Number(year[0]) : null, team: '' }
};

// before opening-day in april, "this season" usually means last year's
const defaultYear$a = function () {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
};

const noSave = /^[–\-−—]*$/;
const gameTitles$a = ['game log', 'season game log', 'schedule and results', 'schedule', 'regular season'];

// per-game extras: the pitchers of record, and games-back
const extras$7 = function (game, row) {
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

const standings$7 = function (season) {
  return {
    record: season.record || null,
    league: getCell(season, ['league']) || '',
    division: getCell(season, ['division']) || '',
    divisionPlace: getCell(season, ['divisional_place', 'division_place', 'divisionrank']) || null,
    manager: getCell(season, ['manager', 'managers']) || '',
    ballpark: getCell(season, ['ballpark', 'stadium']) || '',
  }
};

const parse$a = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: {},
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises$a, name, meta.year || new Date().getFullYear()),
    extras: extras$7,
  };
  const season = parseInfobox(doc, ['baseball team season', 'mlb yearly'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings$7(season),
    games: findGames(doc, ctx, gameTitles$a),
    postseason: findSeries(doc, ctx, ['postseason game log', 'postseason', 'playoffs'], gameTitles$a),
    roster: parseRoster$4(doc, meta.year),
    draftPicks: parseDraftPicks(doc),
    playerStats: parsePlayerStats$1(doc),
  }
};

const makeTitle$a = function (team, year) {
  return `${year} ${team} season`.replace(/ /g, '_')
};

const addMethod$a = function (models) {
  models.wtf.mlbSeason = async function (team, year, options) {
    year ||= defaultYear$a();
    team = resolveTeam(franchises$a, team, year);
    const doc = await models.wtf.fetch(makeTitle$a(team, year), options);
    return parse$a(doc)
  };
  models.Doc.prototype.mlbSeason = function () {
    return parse$a(this)
  };
};

// nhl + nba seasons span two years: '2024–25', with '1999–2000' at the century
const seasonSlug = function (year) {
  const next = year + 1;
  let suffix = String(next % 100).padStart(2, '0');
  if (suffix === '00') {
    suffix = String(next);
  }
  return `${year}–${suffix}`
};

// '2024–25 Toronto Raptors season', as a page-title
const twoYearTitle = function (team, year) {
  return `${seasonSlug(year)} ${team} season`.replace(/ /g, '_')
};

// and back again → {year: 2024, team: 'Toronto Raptors'}
const parseTwoYearTitle = function (title = '') {
  const m = String(title).match(/^(\d{4})(?:[–-]\d{2,4})? (.+?) season$/);
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/);
  return { year: year ? Number(year[0]) : null, team: '' }
};

// '2024 Buffalo Bills season' - for leagues played within one calendar year
const oneYearTitle = function (team, year) {
  return `${year} ${team} season`.replace(/ /g, '_')
};

// and back again → {year: 2024, team: 'Buffalo Bills'}
const parseOneYearTitle = function (title = '') {
  const m = String(title).match(/^(\d{4}) (.+?) season$/);
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/);
  return { year: year ? Number(year[0]) : null, team: '' }
};

// current nhl franchises - renamed ones list each name, newest-first
var franchises$9 = [
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

const asNum$1 = (val) => Number(String(val).replace(/[−–]/, '-')) || 0;

const playerName = function (row) {
  let name = getCell(row, ['player', 'name']);
  return stripNotes(name)
};

const notTotal$1 = (p) => p.name && /^totals?$/i.test(p.name) === false;

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
      games: asNum$1(getCell(row, ['gp'])),
      goals: asNum$1(getCell(row, ['g', 'goals'])),
      assists: asNum$1(getCell(row, ['a', 'assists'])),
      points: asNum$1(getCell(row, ['pts', 'points'])),
      plusMinus: asNum$1(getCell(row, ['+/−', '+/-'])),
    }
  });
  return players.filter(notTotal$1)
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
      games: asNum$1(getCell(row, ['gp', 'games'])),
      wins: asNum$1(getCell(row, ['w', 'wins'])),
      losses: asNum$1(getCell(row, ['l', 'losses'])),
      otLosses: asNum$1(getCell(row, ['ot', 'otl', 'sol'])),
      goalsAgainstAvg: asNum$1(getCell(row, ['gaa'])),
      savePct: asNum$1(getCell(row, ['sv%', 'sv', 'save %'])),
      shutouts: asNum$1(getCell(row, ['so'])),
    }
  });
  return players.filter(notTotal$1)
};

const makeTitle$9 = twoYearTitle;

const gameTitles$9 = ['regular season', 'schedule and results', 'game log', 'schedule'];

// nhl seasons start in october - before august, "this season" began last year
const defaultYear$9 = function () {
  const now = new Date();
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
};

// per-game extras: cumulative points, and the goalie of record
const extras$6 = function (game, row) {
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
const standings$6 = function (season) {
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

const parse$9 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTwoYearTitle(doc.title || '');
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
    fullName: (name) => resolveTeam(franchises$9, name, meta.year || new Date().getFullYear()),
    extras: extras$6,
  };
  const season = parseInfobox(doc, ['ice hockey team season', 'nhl team season'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings$6(season),
    games: findGames(doc, ctx, gameTitles$9),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason'], gameTitles$9),
    skaters: parseSkaters(doc),
    goalies: parseGoalies(doc),
  }
};

const addMethod$9 = function (models) {
  models.wtf.nhlSeason = async function (team, year, options) {
    year ||= defaultYear$9();
    team = resolveTeam(franchises$9, team, year);
    const doc = await models.wtf.fetch(makeTitle$9(team, year), options);
    return parse$9(doc)
  };
  models.Doc.prototype.nhlSeason = function () {
    return parse$9(this)
  };
};

// current nba franchises - renamed ones list each name, newest-first
var franchises$8 = [
  [{ name: 'Atlanta Hawks', from: 1968 }],
  [{ name: 'Boston Celtics', from: 1946 }],
  [
    { name: 'Brooklyn Nets', from: 2012 },
    { name: 'New Jersey Nets', from: 1977 },
    { name: 'New York Nets', from: 1968 },
  ],
  [{ name: 'Charlotte Hornets', from: 2014 }, { name: 'Charlotte Bobcats', from: 2004 }],
  [{ name: 'Chicago Bulls', from: 1966 }],
  [{ name: 'Cleveland Cavaliers', from: 1970 }],
  [{ name: 'Dallas Mavericks', from: 1980 }],
  [{ name: 'Denver Nuggets', from: 1974 }],
  [{ name: 'Detroit Pistons', from: 1957 }],
  [{ name: 'Golden State Warriors', from: 1971 }],
  [{ name: 'Houston Rockets', from: 1971 }],
  [{ name: 'Indiana Pacers', from: 1976 }],
  [
    { name: 'Los Angeles Clippers', from: 1984 },
    { name: 'San Diego Clippers', from: 1978 },
    { name: 'Buffalo Braves', from: 1970 },
  ],
  [{ name: 'Los Angeles Lakers', from: 1960 }],
  [{ name: 'Memphis Grizzlies', from: 2001 }, { name: 'Vancouver Grizzlies', from: 1995 }],
  [{ name: 'Miami Heat', from: 1988 }],
  [{ name: 'Milwaukee Bucks', from: 1968 }],
  [{ name: 'Minnesota Timberwolves', from: 1989 }],
  [
    { name: 'New Orleans Pelicans', from: 2013 },
    { name: 'New Orleans Hornets', from: 2007 },
    { name: 'New Orleans/Oklahoma City Hornets', from: 2005 },
    { name: 'New Orleans Hornets', from: 2002 },
    { name: 'Charlotte Hornets', from: 1988 },
  ],
  [{ name: 'New York Knicks', from: 1946 }],
  [{ name: 'Oklahoma City Thunder', from: 2008 }, { name: 'Seattle SuperSonics', from: 1967 }],
  [{ name: 'Orlando Magic', from: 1989 }],
  [{ name: 'Philadelphia 76ers', from: 1963 }],
  [{ name: 'Phoenix Suns', from: 1968 }],
  [{ name: 'Portland Trail Blazers', from: 1970 }],
  [{ name: 'Sacramento Kings', from: 1985 }, { name: 'Kansas City Kings', from: 1975 }],
  [{ name: 'San Antonio Spurs', from: 1976 }],
  [{ name: 'Toronto Raptors', from: 1995 }],
  [{ name: 'Utah Jazz', from: 1979 }, { name: 'New Orleans Jazz', from: 1974 }],
  [{ name: 'Washington Wizards', from: 1997 }, { name: 'Washington Bullets', from: 1974 }],
];

const asNum = (val) => Number(String(val).replace(/[*†‡]/g, '')) || 0;

const notTotal = (p) => p.name && /^totals?$/i.test(p.name) === false;

// the roster is {{player2}} templates in a 'Roster' section
const parseRoster$3 = function (doc) {
  const s = findSection(doc, ['roster', 'current roster']);
  if (!s) {
    return []
  }
  const players = withChildren(doc, s).flatMap((c) => c.templates('player2'));
  return players.map((tmpl) => ({ ...tmpl.json().data }))
};

// per-player averages from the 'Player statistics' tables
const statRow = function (row) {
  return {
    name: stripNotes(getCell(row, ['player', 'name'])),
    games: asNum(getCell(row, ['gp', 'g', 'games'])),
    gamesStarted: asNum(getCell(row, ['gs'])),
    minutesPerGame: asNum(getCell(row, ['mpg', 'mp'])),
    reboundsPerGame: asNum(getCell(row, ['rpg', 'reb'])),
    assistsPerGame: asNum(getCell(row, ['apg', 'ast'])),
    stealsPerGame: asNum(getCell(row, ['spg', 'stl'])),
    blocksPerGame: asNum(getCell(row, ['bpg', 'blk'])),
    pointsPerGame: asNum(getCell(row, ['ppg', 'pts'])),
  }
};

const parsePlayerStats = function (doc) {
  const res = { season: [], playoffs: [] };
  const s = findSection(doc, ['player statistics', 'player stats', 'statistics']);
  if (!s) {
    return res
  }
  withChildren(doc, s).forEach((c) => {
    const kind = /playoff|postseason/i.test(c.title()) ? 'playoffs' : 'season';
    c.tables().forEach((t) => {
      t.rows().forEach((row) => {
        const p = statRow(row);
        if (notTotal(p)) {
          res[kind].push(p);
        }
      });
    });
  });
  return res
};

const makeTitle$8 = twoYearTitle;

const gameTitles$8 = ['regular season', 'game log', 'schedule', 'schedule and results'];

// nba seasons start in october - before august, "this season" began last year
const defaultYear$8 = function () {
  const now = new Date();
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
};

// per-game extras: statistical leaders, and the arena
const extras$5 = function (game, row) {
  const points = getCell(row.cells, ['high points']);
  const rebounds = getCell(row.cells, ['high rebounds']);
  const assists = getCell(row.cells, ['high assists']);
  if (points || rebounds || assists) {
    game.leaders = { points, rebounds, assists };
  }
  const loc = getCell(row.cells, ['location attendance', 'location', 'arena']);
  if (loc) {
    game.location = loc.replace(/[0-9][0-9,]* *$/, '').trim();
  }
};

// the nba infobox keeps wins and losses as separate fields
const standings$5 = function (season) {
  let record = season.record || null;
  const wins = getCell(season, ['wins']);
  const losses = getCell(season, ['losses']);
  if (!record && wins !== '' && losses !== '') {
    record = parseRecord(`${wins}–${losses}`);
  }
  return {
    record,
    division: getCell(season, ['division']) || '',
    divisionPlace: getCell(season, ['division_place', 'divisionrank']) || null,
    conference: getCell(season, ['conference']) || '',
    conferencePlace: getCell(season, ['conf_place', 'conference_place']) || null,
    coach: getCell(season, ['coach', 'coaches']) || '',
    arena: getCell(season, ['arena']) || '',
  }
};

const parse$8 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTwoYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: {},
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // the season wraps into the next calendar-year
      return /^(jan|feb|mar|apr|may|jun)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises$8, name, meta.year || new Date().getFullYear()),
    extras: extras$5,
  };
  const season = parseInfobox(doc, ['nba season'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings$5(season),
    games: findGames(doc, ctx, gameTitles$8),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason'], gameTitles$8),
    roster: parseRoster$3(doc),
    playerStats: parsePlayerStats(doc),
  }
};

const addMethod$8 = function (models) {
  models.wtf.nbaSeason = async function (team, year, options) {
    year ||= defaultYear$8();
    team = resolveTeam(franchises$8, team, year);
    const doc = await models.wtf.fetch(makeTitle$8(team, year), options);
    return parse$8(doc)
  };
  models.Doc.prototype.nbaSeason = function () {
    return parse$8(this)
  };
};

// current nfl franchises - renamed ones list each name, newest-first
var franchises$7 = [
  [
    { name: 'Arizona Cardinals', from: 1994 },
    { name: 'Phoenix Cardinals', from: 1988 },
    { name: 'St. Louis Cardinals', from: 1960 },
  ],
  [{ name: 'Atlanta Falcons', from: 1966 }],
  [{ name: 'Baltimore Ravens', from: 1996 }],
  [{ name: 'Buffalo Bills', from: 1960 }],
  [{ name: 'Carolina Panthers', from: 1995 }],
  [{ name: 'Chicago Bears', from: 1922 }],
  [{ name: 'Cincinnati Bengals', from: 1968 }],
  [{ name: 'Cleveland Browns', from: 1946 }],
  [{ name: 'Dallas Cowboys', from: 1960 }],
  [{ name: 'Denver Broncos', from: 1960 }],
  [{ name: 'Detroit Lions', from: 1934 }],
  [{ name: 'Green Bay Packers', from: 1921 }],
  [{ name: 'Houston Texans', from: 2002 }],
  [{ name: 'Indianapolis Colts', from: 1984 }, { name: 'Baltimore Colts', from: 1953 }],
  [{ name: 'Jacksonville Jaguars', from: 1995 }],
  [{ name: 'Kansas City Chiefs', from: 1963 }],
  [
    { name: 'Las Vegas Raiders', from: 2020 },
    { name: 'Oakland Raiders', from: 1995 },
    { name: 'Los Angeles Raiders', from: 1982 },
    { name: 'Oakland Raiders', from: 1960 },
  ],
  [{ name: 'Los Angeles Chargers', from: 2017 }, { name: 'San Diego Chargers', from: 1961 }],
  [
    { name: 'Los Angeles Rams', from: 2016 },
    { name: 'St. Louis Rams', from: 1995 },
    { name: 'Los Angeles Rams', from: 1946 },
  ],
  [{ name: 'Miami Dolphins', from: 1966 }],
  [{ name: 'Minnesota Vikings', from: 1961 }],
  [{ name: 'New England Patriots', from: 1971 }],
  [{ name: 'New Orleans Saints', from: 1967 }],
  [{ name: 'New York Giants', from: 1925 }],
  [{ name: 'New York Jets', from: 1963 }],
  [{ name: 'Philadelphia Eagles', from: 1933 }],
  [{ name: 'Pittsburgh Steelers', from: 1945 }],
  [{ name: 'San Francisco 49ers', from: 1946 }],
  [{ name: 'Seattle Seahawks', from: 1976 }],
  [{ name: 'Tampa Bay Buccaneers', from: 1976 }],
  [
    { name: 'Tennessee Titans', from: 1999 },
    { name: 'Tennessee Oilers', from: 1997 },
    { name: 'Houston Oilers', from: 1960 },
  ],
  [
    { name: 'Washington Commanders', from: 2022 },
    { name: 'Washington Football Team', from: 2020 },
    { name: 'Washington Redskins', from: 1937 },
  ],
];

const makeTitle$7 = oneYearTitle;

const gameTitles$7 = ['regular season', 'schedule', 'game log', 'schedule and results'];

// nfl seasons are named by their september start - before august, use last year's
const defaultYear$7 = function () {
  const now = new Date();
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
};

// per-game extras: the stadium
const extras$4 = function (game, row) {
  const venue = getCell(row.cells, ['venue', 'game site', 'stadium', 'location']);
  if (venue) {
    game.venue = venue;
  }
};

// '1st AFC East' → {divisionPlace: 1, division: 'AFC East'}
const standings$4 = function (season) {
  const out = {
    record: season.record || null,
    division: '',
    divisionPlace: null,
    coach: getCell(season, ['coach', 'coaches']) || '',
    stadium: getCell(season, ['stadium']) || '',
  };
  const place = String(getCell(season, ['division_place', 'division place']) || '');
  const m = place.match(/^(\d+)(?:st|nd|rd|th)\b *(.*)/);
  if (m) {
    out.divisionPlace = Number(m[1]);
    out.division = m[2].trim();
  } else if (place) {
    out.division = place;
  }
  return out
};

const parse$7 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseOneYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: { ties: true }, //nfl records are W–L–T
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // playoff games run into january
      return /^(jan|feb)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises$7, name, meta.year || new Date().getFullYear()),
    extras: extras$4,
  };
  const season = parseInfobox(doc, ['nfl team season', 'nfl season'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings$4(season),
    games: findGames(doc, ctx, gameTitles$7),
    // nfl playoffs are single games, not series - keep them flat
    playoffs: findSeries(doc, ctx, ['postseason schedule', 'postseason', 'playoffs'], gameTitles$7).flat(),
  }
};

const addMethod$7 = function (models) {
  models.wtf.nflSeason = async function (team, year, options) {
    year ||= defaultYear$7();
    team = resolveTeam(franchises$7, team, year);
    const doc = await models.wtf.fetch(makeTitle$7(team, year), options);
    return parse$7(doc)
  };
  models.Doc.prototype.nflSeason = function () {
    return parse$7(this)
  };
};

// soccer seasons record each match as a {{football box}} template, not a table row
const boxNames = ['football box collapsible', 'footballbox collapsible', 'football box', 'footballbox'];

// every match-box under a section, with a `skip` regex dropping matching subtrees
const collectBoxes = function (doc, section, skip) {
  const boxes = [];
  let skipBelow = null;
  withChildren(doc, section).forEach((s, i) => {
    if (i > 0 && skip) {
      if (skipBelow !== null && s.depth() > skipBelow) {
        return
      }
      skipBelow = null;
      if (skip.test(s.title())) {
        skipBelow = s.depth();
        return
      }
    }
    boxNames.forEach((name) => {
      s.templates(name).forEach((t) => boxes.push(t.json().data || {}));
    });
  });
  return boxes
};

const outcomes = { w: 'win', l: 'loss', d: 'tie', t: 'tie' };

// flag icons ride along on european opponents - '🇪🇸 Barcelona' → 'Barcelona'
const cleanName = function (str = '') {
  return String(str)
    .replace(/[^\p{L}\p{N} .&'()-]/gu, '')
    .replace(/ {2,}/g, ' ')
    .trim()
};

// one {{football box}} → one game
const buildMatch = function (data, ctx) {
  if (!data.team1 && !data.team2) {
    return null
  }
  const game = {
    date: ctx.dateYear ? ctx.dateYear(data.date || '', ctx.year) : data.date || '',
    opponent: '',
    home: null,
    outcome: outcomes[String(data.result || '').trim().toLowerCase()] || null,
    result: null,
  };
  // team1 is the home side
  if (sameTeam(data.team1, ctx.team)) {
    game.home = true;
  } else if (sameTeam(data.team2, ctx.team)) {
    game.home = false;
  }
  const opp = cleanName(game.home === false ? data.team1 : data.team2);
  game.opponent = ctx.fullName ? ctx.fullName(opp) : opp;
  const score = parseScore(data.score);
  if (score && game.home !== null) {
    game.result = game.home ? { us: score[0], them: score[1] } : { us: score[1], them: score[0] };
    // an unequal score settles it - `result` letters are sometimes written from
    // the home side's perspective. a drawn score keeps the letter (penalty shootouts)
    if (score[0] !== score[1]) {
      game.outcome = game.result.us > game.result.them ? 'win' : 'loss';
    } else if (game.outcome === null) {
      game.outcome = 'tie';
    }
  }
  game.win = game.outcome === null ? null : game.outcome === 'win';
  if (data.round) {
    game.round = data.round;
  }
  if (data.stadium) {
    game.stadium = data.stadium;
  }
  if (data.location) {
    game.location = data.location;
  }
  game.attendance = parseAttendance(data.attendance || '');
  return game
};

// every match-box on the page, with `skip` dropping matching subtrees
const collectAll = function (doc, skip) {
  const boxes = [];
  let skipBelow = null;
  doc.sections().forEach((s) => {
    if (skip) {
      if (skipBelow !== null && s.depth() > skipBelow) {
        return
      }
      skipBelow = null;
      if (skip.test(s.title())) {
        skipBelow = s.depth();
        return
      }
    }
    boxNames.forEach((name) => {
      s.templates(name).forEach((t) => boxes.push(t.json().data || {}));
    });
  });
  return boxes
};

const build = (boxes, ctx) => boxes.map((data) => buildMatch(data, ctx)).filter((g) => g !== null);

// all matches under the best matching section -
// or anywhere on the page, when sections don't nest the way they read
const findMatches = function (doc, ctx, titles, skip) {
  const all = doc.sections();
  // exact titles first, then a looser pass - 'Postseason playoff' still counts as 'postseason'
  for (const loose of [false, true]) {
    for (const title of titles) {
      const want = title.toLowerCase();
      const sections = all.filter((s) => {
        const t = s.title().trim().toLowerCase();
        // 'league' must not loose-match a 'League Cup' section
        if (skip && skip.test(t)) {
          return false
        }
        return loose ? t.includes(want) : t === want
      });
      for (const section of sections) {
        const games = build(collectBoxes(doc, section, skip), ctx);
        if (games.length > 0) {
          return games
        }
      }
    }
  }
  if (skip) {
    return build(collectAll(doc, skip), ctx)
  }
  return []
};

// every cup and continental run on the page, each under its own section title
const findCompetitions = function (doc, ctx, include, skip) {
  const res = {};
  let below = null;
  doc.sections().forEach((s) => {
    // a 'Final' inside an already-collected cup is not its own competition
    if (below !== null && s.depth() > below) {
      return
    }
    below = null;
    const title = s.title().trim();
    if (include.test(title) === false || (skip && skip.test(title))) {
      return
    }
    below = s.depth();
    let games = build(collectBoxes(doc, s, skip), ctx);
    if (games.length === 0) {
      // older pages table their cup runs instead
      const rows = rowGroups(doc, s).flatMap((g) => g.rows);
      games = finish(rows.map((row) => buildGame(row, ctx)).filter((g) => g !== null));
    }
    if (games.length > 0) {
      res[title] = games;
    }
  });
  return res
};

// current mls clubs - renamed ones list each name, newest-first
// includes folded clubs, so their old seasons still resolve -
// a `to` year marks the fold, so year-sweeps skip the dead seasons
var franchises$6 = [
  [{ name: 'Atlanta United FC', from: 2017 }],
  [{ name: 'Austin FC', from: 2021 }],
  [{ name: 'Charlotte FC', from: 2022 }],
  [{ name: 'Chicago Fire FC', from: 2020 }, { name: 'Chicago Fire', from: 1998 }],
  [{ name: 'FC Cincinnati', from: 2019 }],
  [{ name: 'Colorado Rapids', from: 1996 }],
  [
    { name: 'Columbus Crew', from: 2021 },
    { name: 'Columbus Crew SC', from: 2015 },
    { name: 'Columbus Crew', from: 1996 },
  ],
  [{ name: 'D.C. United', from: 1996 }],
  [{ name: 'FC Dallas', from: 2005 }, { name: 'Dallas Burn', from: 1996 }],
  [{ name: 'Houston Dynamo FC', from: 2021 }, { name: 'Houston Dynamo', from: 2006 }],
  [
    { name: 'Sporting Kansas City', from: 2011 },
    { name: 'Kansas City Wizards', from: 1997 },
    { name: 'Kansas City Wiz', from: 1996 },
  ],
  [{ name: 'LA Galaxy', from: 2011 }, { name: 'Los Angeles Galaxy', from: 1996 }],
  [{ name: 'Los Angeles FC', from: 2018 }],
  [{ name: 'Inter Miami CF', from: 2020 }],
  [{ name: 'Minnesota United FC', from: 2017 }],
  [{ name: 'CF Montréal', from: 2021 }, { name: 'Montreal Impact', from: 2012 }],
  [{ name: 'Nashville SC', from: 2020 }],
  [{ name: 'New England Revolution', from: 1996 }],
  [{ name: 'New York City FC', from: 2015 }],
  [
    { name: 'New York Red Bulls', from: 2006 },
    { name: 'MetroStars', from: 1998 },
    { name: 'New York/New Jersey MetroStars', from: 1996 },
  ],
  [{ name: 'Orlando City SC', from: 2015 }],
  [{ name: 'Philadelphia Union', from: 2010 }],
  [{ name: 'Portland Timbers', from: 2011 }],
  [{ name: 'Real Salt Lake', from: 2005 }],
  [{ name: 'San Diego FC', from: 2025 }],
  [{ name: 'San Jose Earthquakes', from: 2000 }, { name: 'San Jose Clash', from: 1996 }],
  [{ name: 'Seattle Sounders FC', from: 2009 }],
  [{ name: 'St. Louis City SC', from: 2023 }],
  [{ name: 'Toronto FC', from: 2007 }],
  [{ name: 'Vancouver Whitecaps FC', from: 2011 }],
  // folded clubs
  [{ name: 'Chivas USA', from: 2005, to: 2014 }],
  [{ name: 'Tampa Bay Mutiny', from: 1996, to: 2001 }],
  [{ name: 'Miami Fusion', from: 1998, to: 2001 }],
];

const makeTitle$6 = oneYearTitle;

const gameTitles$6 = ['regular season', 'match results', 'matches', 'major league soccer', 'results'];

// league matches only - cups, friendlies and the playoffs parse separately
const notLeague$2 = /playoff|cup|friendl|preseason|pre-season|invitational|champions|exhibition|all-star/i;

// the mls season runs within one calendar year, from late february
const defaultYear$6 = function () {
  const now = new Date();
  return now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1
};

const parse$6 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseOneYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises$6, name, meta.year || new Date().getFullYear()),
  };
  const season = parseInfobox(doc, ['soccer club season', 'football club season'], {});
  const games = findMatches(doc, ctx, gameTitles$6, notLeague$2);
  const playoffs = findMatches(doc, ctx, ['mls cup playoffs', 'playoffs', 'postseason'], null);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: {
      record: countRecord(games),
      league: getCell(season, ['league']) || '',
      position: getCell(season, ['position', 'league_result', 'league result']) || null,
      manager: getCell(season, ['manager', 'mgrtitle', 'head coach']) || '',
      stadium: getCell(season, ['stadium', 'stdtitle']) || '',
    },
    games,
    playoffs,
  }
};

const addMethod$6 = function (models) {
  models.wtf.mlsSeason = async function (team, year, options) {
    year ||= defaultYear$6();
    team = resolveTeam(franchises$6, team, year);
    const doc = await models.wtf.fetch(makeTitle$6(team, year), options);
    return parse$6(doc)
  };
  models.Doc.prototype.mlsSeason = function () {
    return parse$6(this)
  };
};

// wnba franchises - renamed ones list each name, newest-first
// a `to` year marks a folded team, so year-sweeps skip its dead seasons
var franchises$5 = [
  [{ name: 'Atlanta Dream', from: 2008 }],
  [{ name: 'Chicago Sky', from: 2006 }],
  [
    { name: 'Connecticut Sun', from: 2003 },
    { name: 'Orlando Miracle', from: 1999 },
  ],
  [
    { name: 'Dallas Wings', from: 2016 },
    { name: 'Tulsa Shock', from: 2010 },
    { name: 'Detroit Shock', from: 1998 },
  ],
  [{ name: 'Golden State Valkyries', from: 2025 }],
  [{ name: 'Indiana Fever', from: 2000 }],
  [
    { name: 'Las Vegas Aces', from: 2018 },
    { name: 'San Antonio Stars', from: 2014 },
    { name: 'San Antonio Silver Stars', from: 2003 },
    { name: 'Utah Starzz', from: 1997 },
  ],
  [{ name: 'Los Angeles Sparks', from: 1997 }],
  [{ name: 'Minnesota Lynx', from: 1999 }],
  [{ name: 'New York Liberty', from: 1997 }],
  [{ name: 'Phoenix Mercury', from: 1997 }],
  [{ name: 'Portland Fire', from: 2026 }], //2026 expansion revives the name
  [{ name: 'Seattle Storm', from: 2000 }],
  [{ name: 'Toronto Tempo', from: 2026 }],
  [{ name: 'Washington Mystics', from: 1998 }],
  // folded teams
  [{ name: 'Charlotte Sting', from: 1997, to: 2006 }],
  [{ name: 'Cleveland Rockers', from: 1997, to: 2003 }],
  [{ name: 'Houston Comets', from: 1997, to: 2008 }],
  [{ name: 'Miami Sol', from: 2000, to: 2002 }],
  [{ name: 'Portland Fire', from: 2000, to: 2002 }],
  [{ name: 'Sacramento Monarchs', from: 1997, to: 2009 }],
];

// the roster is one {{sports roster}} holding {{sports roster/entry}} rows
const parseRoster$2 = function (doc) {
  const s = findSection(doc, ['roster', 'current roster']);
  if (!s) {
    return []
  }
  const entries = withChildren(doc, s).flatMap((c) => c.templates('sports roster/entry'));
  return entries
    .map((tmpl) => ({ ...tmpl.json().data }))
    .filter((p) => p.num !== undefined) //coach + trainer entries have no number
};

const makeTitle$5 = oneYearTitle;

const gameTitles$5 = ['regular season', 'game log', 'schedule', 'schedule and results'];

// the wnba season runs may-october, within one calendar year
const defaultYear$5 = function () {
  const now = new Date();
  return now.getMonth() >= 4 ? now.getFullYear() : now.getFullYear() - 1
};

// per-game extras: statistical leaders, and the arena
const extras$3 = function (game, row) {
  const points = getCell(row.cells, ['high points']);
  const rebounds = getCell(row.cells, ['high rebounds']);
  const assists = getCell(row.cells, ['high assists']);
  if (points || rebounds || assists) {
    game.leaders = { points, rebounds, assists };
  }
  const loc = getCell(row.cells, ['location attendance', 'location', 'arena']);
  if (loc) {
    game.location = loc.replace(/[0-9][0-9,]* *$/, '').trim();
  }
};

// the wnba infobox keeps wins and losses as separate fields
const standings$3 = function (season) {
  let record = season.record || null;
  const wins = getCell(season, ['wins']);
  const losses = getCell(season, ['losses']);
  if (!record && wins !== '' && losses !== '') {
    record = parseRecord(`${wins}–${losses}`);
  }
  return {
    record,
    conference: getCell(season, ['conf', 'conference']) || '',
    conferencePlace: getCell(season, ['conf_place', 'conference_place']) || null,
    coach: getCell(season, ['coach', 'coaches']) || '',
    arena: getCell(season, ['arena']) || '',
  }
};

const parse$5 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseOneYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: {},
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises$5, name, meta.year || new Date().getFullYear()),
    extras: extras$3,
  };
  const season = parseInfobox(doc, ['wnba team season'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings$3(season),
    games: findGames(doc, ctx, gameTitles$5),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason'], gameTitles$5),
    roster: parseRoster$2(doc),
    playerStats: parsePlayerStats(doc),
  }
};

const addMethod$5 = function (models) {
  models.wtf.wnbaSeason = async function (team, year, options) {
    year ||= defaultYear$5();
    team = resolveTeam(franchises$5, team, year);
    const doc = await models.wtf.fetch(makeTitle$5(team, year), options);
    return parse$5(doc)
  };
  models.Doc.prototype.wnbaSeason = function () {
    return parse$5(this)
  };
};

// nwsl clubs - renamed ones list each name, newest-first
// a `to` year marks a folded club or a dormant stretch, so year-sweeps skip it
var franchises$4 = [
  [{ name: 'Angel City FC', from: 2022 }],
  [{ name: 'Bay FC', from: 2024 }],
  [{ name: 'Boston Legacy FC', from: 2026 }],
  [
    { name: 'Chicago Stars FC', from: 2025 },
    { name: 'Chicago Red Stars', from: 2013 },
  ],
  [{ name: 'Denver Summit FC', from: 2026 }],
  [{ name: 'Houston Dash', from: 2014 }],
  [{ name: 'Kansas City Current', from: 2021 }],
  [
    { name: 'NJ/NY Gotham FC', from: 2021 },
    { name: 'Sky Blue FC', from: 2013 },
  ],
  [
    { name: 'North Carolina Courage', from: 2017 },
    { name: 'Western New York Flash', from: 2013 },
  ],
  [{ name: 'Orlando Pride', from: 2016 }],
  [{ name: 'Portland Thorns FC', from: 2013 }],
  [{ name: 'Racing Louisville FC', from: 2021 }],
  [{ name: 'San Diego Wave FC', from: 2022 }],
  [
    { name: 'Seattle Reign FC', from: 2024 },
    { name: 'OL Reign', from: 2020 },
    { name: 'Reign FC', from: 2019 },
    { name: 'Seattle Reign FC', from: 2013 },
  ],
  [
    { name: 'Utah Royals', from: 2024 },
    { name: 'Utah Royals FC', from: 2018, to: 2020 },
  ],
  [{ name: 'Washington Spirit', from: 2013 }],
  // folded clubs
  [{ name: 'Boston Breakers', from: 2013, to: 2017 }],
  [{ name: 'FC Kansas City', from: 2013, to: 2017 }],
];

const makeTitle$4 = oneYearTitle;

const gameTitles$4 = ['regular season', 'match results', 'matches', 'results'];

// league matches only - cups, friendlies and the playoffs parse separately
const notLeague$1 = /playoff|cup|friendl|preseason|pre-season|invitational|champions|exhibition|all-star|international|fall series/i;

// the nwsl season runs within one calendar year, from march
const defaultYear$4 = function () {
  const now = new Date();
  return now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1
};

const parse$4 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseOneYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises$4, name, meta.year || new Date().getFullYear()),
  };
  const season = parseInfobox(doc, ['football club season', 'soccer club season'], {});
  const games = findMatches(doc, ctx, gameTitles$4, notLeague$1);
  const playoffs = findMatches(doc, ctx, ['playoffs', 'postseason'], null);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: {
      record: countRecord(games),
      league: getCell(season, ['league']) || '',
      position: getCell(season, ['position', 'league_result', 'league result']) || null,
      manager: getCell(season, ['manager', 'mgrtitle', 'head coach']) || '',
      stadium: getCell(season, ['stadium', 'stdtitle']) || '',
    },
    games,
    playoffs,
  }
};

const addMethod$4 = function (models) {
  models.wtf.nwslSeason = async function (team, year, options) {
    year ||= defaultYear$4();
    team = resolveTeam(franchises$4, team, year);
    const doc = await models.wtf.fetch(makeTitle$4(team, year), options);
    return parse$4(doc)
  };
  models.Doc.prototype.nwslSeason = function () {
    return parse$4(this)
  };
};

// pwhl teams - the six originals played 2023-24 under placeholder names
var franchises$3 = [
  [
    { name: 'Boston Fleet', from: 2024 },
    { name: 'PWHL Boston', from: 2023 },
  ],
  [
    { name: 'Minnesota Frost', from: 2024 },
    { name: 'PWHL Minnesota', from: 2023 },
  ],
  [
    { name: 'Montreal Victoire', from: 2024 },
    { name: 'PWHL Montreal', from: 2023 },
  ],
  [
    { name: 'New York Sirens', from: 2024 },
    { name: 'PWHL New York', from: 2023 },
  ],
  [
    { name: 'Ottawa Charge', from: 2024 },
    { name: 'PWHL Ottawa', from: 2023 },
  ],
  [
    { name: 'Toronto Sceptres', from: 2024 },
    { name: 'PWHL Toronto', from: 2023 },
  ],
  // 2025 expansion
  [{ name: 'Seattle Torrent', from: 2025 }],
  [{ name: 'Vancouver Goldeneyes', from: 2025 }],
];

const makeTitle$3 = twoYearTitle;

const gameTitles$3 = ['regular season', 'schedule and results', 'game log', 'schedule'];

// pwhl seasons start in late november
const defaultYear$3 = function () {
  const now = new Date();
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
};

// per-game extras: cumulative points, and the goalie of record
const extras$2 = function (game, row) {
  const pts = parseInt(getCell(row.cells, ['pts', 'points']), 10);
  if (isNaN(pts) === false) {
    game.points = pts;
  }
  const goalie = stripNotes(getCell(row.cells, ['decision', 'goalie']));
  if (goalie) {
    game.decision = goalie;
  }
};

// the pwhl is one table - no divisions or conferences
const standings$2 = function (season) {
  return {
    record: season.record || null,
    place: getCell(season, ['leaguerank', 'league_place', 'leagueplace']) || null,
    goalsFor: getCell(season, ['goalsfor', 'goals_for']) || null,
    goalsAgainst: getCell(season, ['goalsagainst', 'goals_against']) || null,
    coach: getCell(season, ['coach', 'coaches']) || '',
    arena: getCell(season, ['arena']) || '',
  }
};

const parse$3 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTwoYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: { otWins: true }, //pwhl records are W–OTW–OTL–L
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // the season wraps into the next calendar-year
      return /^(jan|feb|mar|apr|may|jun)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises$3, name, meta.year || new Date().getFullYear()),
    extras: extras$2,
  };
  const season = parseInfobox(doc, ['ice hockey team season'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings$2(season),
    games: findGames(doc, ctx, gameTitles$3),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason'], gameTitles$3),
    skaters: parseSkaters(doc),
    goalies: parseGoalies(doc),
  }
};

const addMethod$3 = function (models) {
  models.wtf.pwhlSeason = async function (team, year, options) {
    year ||= defaultYear$3();
    team = resolveTeam(franchises$3, team, year);
    const doc = await models.wtf.fetch(makeTitle$3(team, year), options);
    return parse$3(doc)
  };
  models.Doc.prototype.pwhlSeason = function () {
    return parse$3(this)
  };
};

// older cfl pages record each playoff game as a two-row quarter-score box:
//   ! Team !! Q1 !! Q2 !! Q3 !! Q4 !! Total
const buildQuarterGame = function (rows, ctx, round) {
  if (rows.length !== 2) {
    return null
  }
  const names = rows.map((r) => String(getCell(r.cells, ['team', 'teams'])).trim());
  const totals = rows.map((r) => parseInt(String(getCell(r.cells, ['total', 'final'])).replace(/[^0-9]/g, ''), 10));
  if (!names[0] || !names[1] || isNaN(totals[0]) || isNaN(totals[1])) {
    return null
  }
  const us = rows.findIndex((r, i) => sameTeam(names[i], ctx.team));
  if (us === -1) {
    return null
  }
  const them = us === 0 ? 1 : 0;
  const game = {
    date: '', //quarter boxes carry no date
    opponent: ctx.fullName ? ctx.fullName(names[them]) : names[them],
    home: null,
    outcome: totals[us] > totals[them] ? 'win' : 'loss',
    result: { us: totals[us], them: totals[them] },
    overtime: false,
  };
  if (totals[us] === totals[them]) {
    game.outcome = 'tie';
  }
  game.win = game.outcome === 'win';
  if (round) {
    game.round = round;
  }
  return game
};

// one game per quarter-box under the section, titled by its subsection
const findQuarterGames = function (doc, ctx, titles) {
  for (const section of findSections(doc, titles)) {
    const games = [];
    withChildren(doc, section).forEach((s) => {
      const round = s.index() === section.index() ? '' : s.title();
      s.tables().forEach((t) => {
        const game = buildQuarterGame(fromTable(t), ctx, round);
        if (game !== null) {
          games.push(game);
        }
      });
    });
    if (games.length > 0) {
      return games
    }
  }
  return []
};

// cfl teams - renamed ones list each name, newest-first
// a `to` year marks a fold or a dormant stretch, so year-sweeps skip it
var franchises$2 = [
  [{ name: 'BC Lions', from: 1954 }],
  [{ name: 'Calgary Stampeders', from: 1945 }],
  [
    { name: 'Edmonton Elks', from: 2021 },
    { name: 'Edmonton Eskimos', from: 1949 },
  ],
  [{ name: 'Hamilton Tiger-Cats', from: 1950 }],
  [
    { name: 'Montreal Alouettes', from: 1996 },
    { name: 'Montreal Alouettes', from: 1986, to: 1986 },
    { name: 'Montreal Concordes', from: 1982, to: 1985 },
    { name: 'Montreal Alouettes', from: 1946, to: 1981 },
  ],
  [
    { name: 'Ottawa Redblacks', from: 2014 },
    { name: 'Ottawa Renegades', from: 2002, to: 2005 },
    { name: 'Ottawa Rough Riders', from: 1946, to: 1996 },
  ],
  [{ name: 'Saskatchewan Roughriders', from: 1946 }],
  [{ name: 'Toronto Argonauts', from: 1946 }],
  [{ name: 'Winnipeg Blue Bombers', from: 1946 }],
];

// the roster is a list of {{CFL player|21|N|[[Daniel Adeboboye]]}} templates
const parseRoster$1 = function (doc) {
  const s = findSection(doc, ['roster', 'current roster']);
  if (!s) {
    return []
  }
  const entries = withChildren(doc, s).flatMap((c) => c.templates('cfl player'));
  return entries.map((tmpl) => {
    const list = tmpl.json().data?.list || [];
    return {
      number: parseInt(String(list[0]).replace(/[^0-9]/g, ''), 10) || null,
      status: String(list[1] || '').trim(), //N=national, I=international, G=global
      name: String(list[2] || '').trim(),
    }
  })
};

const makeTitle$2 = oneYearTitle;

const gameTitles$2 = ['regular season', 'season schedule', 'schedule', 'game log'];

// the cfl season runs june-november, within one calendar year
const defaultYear$2 = function () {
  const now = new Date();
  return now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1
};

// per-game extras: the stadium
const extras$1 = function (game, row) {
  const venue = getCell(row.cells, ['venue', 'game site', 'stadium', 'location']);
  if (venue) {
    game.venue = venue;
  }
};

// '2nd, East' → {divisionPlace: 2, division: 'East'}
const standings$1 = function (season) {
  const out = {
    record: season.record || null,
    division: '',
    divisionPlace: null,
    coach: getCell(season, ['coach', 'coaches']) || '',
    stadium: getCell(season, ['stadium']) || '',
  };
  const place = String(getCell(season, ['division_place', 'division place']) || '');
  const m = place.match(/^(\d+)(?:st|nd|rd|th)\b[, ]*(.*)/);
  if (m) {
    out.divisionPlace = Number(m[1]);
    out.division = m[2].trim();
  } else if (place) {
    out.division = place;
  }
  return out
};

const playoffTitles = ['post-season', 'postseason', 'playoffs'];

const parse$2 = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseOneYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: { ties: true }, //cfl records are W–L–T
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises$2, name, meta.year || new Date().getFullYear()),
    extras: extras$1,
  };
  const season = parseInfobox(doc, ['nfl team season', 'nfl season'], ctx.record);
  // cfl playoffs are single games, not series - keep them flat,
  // falling back to the older two-row quarter-score boxes
  let playoffs = findSeries(doc, ctx, playoffTitles, gameTitles$2).flat();
  if (playoffs.length === 0) {
    playoffs = findQuarterGames(doc, ctx, playoffTitles);
  }
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings$1(season),
    games: findGames(doc, ctx, gameTitles$2),
    playoffs,
    roster: parseRoster$1(doc),
  }
};

const addMethod$2 = function (models) {
  models.wtf.cflSeason = async function (team, year, options) {
    year ||= defaultYear$2();
    team = resolveTeam(franchises$2, team, year);
    const doc = await models.wtf.fetch(makeTitle$2(team, year), options);
    return parse$2(doc)
  };
  models.Doc.prototype.cflSeason = function () {
    return parse$2(this)
  };
};

// current ahl franchises - renamed/relocated ones list each name, newest-first
// page coverage is patchy before 2012, so chains stop around 2010
var franchises$1 = [
  // atlantic
  [{ name: 'Bridgeport Islanders', from: 2021 }, { name: 'Bridgeport Sound Tigers', from: 2001 }],
  [{ name: 'Charlotte Checkers', from: 2010 }, { name: 'Albany River Rats', from: 1993 }],
  [
    { name: 'Hartford Wolf Pack', from: 2013 },
    { name: 'Connecticut Whale', from: 2010 },
    { name: 'Hartford Wolf Pack', from: 1997 },
  ],
  [{ name: 'Hershey Bears', from: 1938 }],
  [
    { name: 'Lehigh Valley Phantoms', from: 2014 },
    { name: 'Adirondack Phantoms', from: 2009 },
    { name: 'Philadelphia Phantoms', from: 1996 },
  ],
  [{ name: 'Providence Bruins', from: 1992 }],
  [{ name: 'Springfield Thunderbirds', from: 2016 }, { name: 'Portland Pirates', from: 1993 }],
  [{ name: 'Wilkes-Barre/Scranton Penguins', from: 1999 }],
  // north
  [{ name: 'Belleville Senators', from: 2017 }, { name: 'Binghamton Senators', from: 2002 }],
  [{ name: 'Cleveland Monsters', from: 2016 }, { name: 'Lake Erie Monsters', from: 2007 }],
  [
    { name: 'Laval Rocket', from: 2017 },
    { name: "St. John's IceCaps", from: 2015, to: 2016 },
    { name: 'Hamilton Bulldogs', from: 1996 },
  ],
  [{ name: 'Rochester Americans', from: 1956 }],
  [{ name: 'Syracuse Crunch', from: 1994 }],
  [{ name: 'Toronto Marlies', from: 2005 }, { name: "St. John's Maple Leafs", from: 1991 }],
  // the comets page-history is continuous across the 2021 franchise swap
  [{ name: 'Utica Comets', from: 2013 }, { name: 'Peoria Rivermen', from: 2005 }],
  // central
  [{ name: 'Chicago Wolves', from: 2001 }],
  [{ name: 'Grand Rapids Griffins', from: 2001 }],
  [{ name: 'Iowa Wild', from: 2013 }, { name: 'Houston Aeros', from: 2001 }],
  [
    { name: 'Manitoba Moose', from: 2015 },
    { name: "St. John's IceCaps", from: 2011 },
    { name: 'Manitoba Moose', from: 2001 },
  ],
  [{ name: 'Milwaukee Admirals', from: 2001 }],
  [{ name: 'Rockford IceHogs', from: 2007 }],
  [{ name: 'Texas Stars', from: 2009 }],
  // pacific
  [{ name: 'Abbotsford Canucks', from: 2021 }],
  [{ name: 'Bakersfield Condors', from: 2015 }, { name: 'Oklahoma City Barons', from: 2010 }],
  [
    { name: 'Calgary Wranglers', from: 2022 },
    { name: 'Stockton Heat', from: 2015 },
    { name: 'Adirondack Flames', from: 2014 },
    { name: 'Abbotsford Heat', from: 2009 },
  ],
  [{ name: 'Coachella Valley Firebirds', from: 2022 }],
  [{ name: 'Colorado Eagles', from: 2018 }],
  [{ name: 'Henderson Silver Knights', from: 2020 }, { name: 'San Antonio Rampage', from: 2002 }],
  [{ name: 'Ontario Reign', from: 2015 }, { name: 'Manchester Monarchs', from: 2001 }],
  [{ name: 'San Diego Gulls', from: 2015 }, { name: 'Norfolk Admirals', from: 2000 }],
  [{ name: 'San Jose Barracuda', from: 2015 }, { name: 'Worcester Sharks', from: 2006 }],
  [{ name: 'Tucson Roadrunners', from: 2016 }, { name: 'Springfield Falcons', from: 1994 }],
  // the devils' franchise, renamed utica comets in 2021 - that name lives above
  [{ name: 'Binghamton Devils', from: 2017, to: 2020 }, { name: 'Albany Devils', from: 2010 }],
];

// the {{Ice hockey team player}} roster rows - many ahl pages have no stat tables
const parseRoster = function (doc) {
  const players = doc.templates('ice hockey team player').map((t) => {
    const data = t.json().data || {};
    return {
      number: parseInt(data.num, 10) || null,
      name: [data.first, data.last].filter(Boolean).join(' '),
      position: data.pos || '',
    }
  });
  return players.filter((p) => p.name)
};

const makeTitle$1 = twoYearTitle;

const gameTitles$1 = ['regular season', 'schedule and results', 'game log', 'schedule'];

// ahl seasons start in october - before august, "this season" began last year
const defaultYear$1 = function () {
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

const parse$1 = function (doc) {
  if (!doc) {
    return null
  }
  // missing team-seasons often redirect to the league page - don't parse those.
  // some old team pages have no infobox at all, and still parse fine
  const kinds = doc.infoboxes().map((inf) => inf.type());
  if (kinds.length > 0 && kinds.includes('ice hockey team season') === false) {
    return null
  }
  const meta = parseTwoYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    // W–L–T–OTL until the 2004-05 shootout era, W–L–OTL–SOL after
    record: meta.year && meta.year < 2004 ? { ties: true } : { soLosses: true },
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // the season wraps into the next calendar-year
      return /^(jan|feb|mar|apr|may|jun)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises$1, name, meta.year || new Date().getFullYear()),
    extras,
  };
  const season = parseInfobox(doc, ['ice hockey team season'], ctx.record);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings(season),
    games: findGames(doc, ctx, gameTitles$1),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason'], gameTitles$1),
    skaters: parseSkaters(doc),
    goalies: parseGoalies(doc),
    roster: parseRoster(doc),
  }
};

const addMethod$1 = function (models) {
  models.wtf.ahlSeason = async function (team, year, options) {
    year ||= defaultYear$1();
    team = resolveTeam(franchises$1, team, year);
    const doc = await models.wtf.fetch(makeTitle$1(team, year), options);
    return parse$1(doc)
  };
  models.Doc.prototype.ahlSeason = function () {
    return parse$1(this)
  };
};

// premier-league membership by season, derived from each league-season page.
// `from`/`to` are season start-years, inclusive - relegation and promotion
// give many clubs several separate stints. no `to` means a current member.
const franchises = [
  [{ name: 'AFC Bournemouth', from: 2022 }, { name: 'AFC Bournemouth', from: 2015, to: 2019 }],
  [{ name: 'Arsenal F.C.', from: 1992 }],
  [{ name: 'Aston Villa F.C.', from: 2019 }, { name: 'Aston Villa F.C.', from: 1992, to: 2015 }],
  [{ name: 'Barnsley F.C.', from: 1997, to: 1997 }],
  [{ name: 'Birmingham City F.C.', from: 2009, to: 2010 }, { name: 'Birmingham City F.C.', from: 2007, to: 2007 }, { name: 'Birmingham City F.C.', from: 2002, to: 2005 }],
  [{ name: 'Blackburn Rovers F.C.', from: 2001, to: 2011 }, { name: 'Blackburn Rovers F.C.', from: 1992, to: 1998 }],
  [{ name: 'Blackpool F.C.', from: 2010, to: 2010 }],
  [{ name: 'Bolton Wanderers F.C.', from: 2001, to: 2011 }, { name: 'Bolton Wanderers F.C.', from: 1997, to: 1997 }, { name: 'Bolton Wanderers F.C.', from: 1995, to: 1995 }],
  [{ name: 'Bradford City A.F.C.', from: 1999, to: 2000 }],
  [{ name: 'Brentford F.C.', from: 2021 }],
  [{ name: 'Brighton & Hove Albion F.C.', from: 2017 }],
  [{ name: 'Burnley F.C.', from: 2025 }, { name: 'Burnley F.C.', from: 2023, to: 2023 }, { name: 'Burnley F.C.', from: 2016, to: 2021 }, { name: 'Burnley F.C.', from: 2014, to: 2014 }, { name: 'Burnley F.C.', from: 2009, to: 2009 }],
  [{ name: 'Cardiff City F.C.', from: 2018, to: 2018 }, { name: 'Cardiff City F.C.', from: 2013, to: 2013 }],
  [{ name: 'Charlton Athletic F.C.', from: 2000, to: 2006 }, { name: 'Charlton Athletic F.C.', from: 1998, to: 1998 }],
  [{ name: 'Chelsea F.C.', from: 1992 }],
  [{ name: 'Coventry City F.C.', from: 1992, to: 2000 }],
  [{ name: 'Crystal Palace F.C.', from: 2013 }, { name: 'Crystal Palace F.C.', from: 2004, to: 2004 }, { name: 'Crystal Palace F.C.', from: 1997, to: 1997 }, { name: 'Crystal Palace F.C.', from: 1994, to: 1994 }, { name: 'Crystal Palace F.C.', from: 1992, to: 1992 }],
  [{ name: 'Derby County F.C.', from: 2007, to: 2007 }, { name: 'Derby County F.C.', from: 1996, to: 2001 }],
  [{ name: 'Everton F.C.', from: 1992 }],
  [{ name: 'Fulham F.C.', from: 2022 }, { name: 'Fulham F.C.', from: 2020, to: 2020 }, { name: 'Fulham F.C.', from: 2018, to: 2018 }, { name: 'Fulham F.C.', from: 2001, to: 2013 }],
  [{ name: 'Huddersfield Town A.F.C.', from: 2017, to: 2018 }],
  [{ name: 'Hull City A.F.C.', from: 2016, to: 2016 }, { name: 'Hull City A.F.C.', from: 2013, to: 2014 }, { name: 'Hull City A.F.C.', from: 2008, to: 2009 }],
  [{ name: 'Ipswich Town F.C.', from: 2024, to: 2024 }, { name: 'Ipswich Town F.C.', from: 2000, to: 2001 }, { name: 'Ipswich Town F.C.', from: 1992, to: 1994 }],
  //wikipedia keeps leeds' pre-2018 season pages under the club's old A.F.C. name
  [{ name: 'Leeds United F.C.', from: 2025 }, { name: 'Leeds United F.C.', from: 2020, to: 2022 }, { name: 'Leeds United A.F.C.', from: 1992, to: 2003 }],
  [{ name: 'Leicester City F.C.', from: 2024, to: 2024 }, { name: 'Leicester City F.C.', from: 2014, to: 2022 }, { name: 'Leicester City F.C.', from: 2003, to: 2003 }, { name: 'Leicester City F.C.', from: 1996, to: 2001 }, { name: 'Leicester City F.C.', from: 1994, to: 1994 }],
  [{ name: 'Liverpool F.C.', from: 1992 }],
  [{ name: 'Luton Town F.C.', from: 2023, to: 2023 }],
  [{ name: 'Manchester City F.C.', from: 2002 }, { name: 'Manchester City F.C.', from: 2000, to: 2000 }, { name: 'Manchester City F.C.', from: 1992, to: 1995 }],
  [{ name: 'Manchester United F.C.', from: 1992 }],
  [{ name: 'Middlesbrough F.C.', from: 2016, to: 2016 }, { name: 'Middlesbrough F.C.', from: 1998, to: 2008 }, { name: 'Middlesbrough F.C.', from: 1995, to: 1996 }, { name: 'Middlesbrough F.C.', from: 1992, to: 1992 }],
  [{ name: 'Newcastle United F.C.', from: 2017 }, { name: 'Newcastle United F.C.', from: 2010, to: 2015 }, { name: 'Newcastle United F.C.', from: 1993, to: 2008 }],
  [{ name: 'Norwich City F.C.', from: 2021, to: 2021 }, { name: 'Norwich City F.C.', from: 2019, to: 2019 }, { name: 'Norwich City F.C.', from: 2015, to: 2015 }, { name: 'Norwich City F.C.', from: 2011, to: 2013 }, { name: 'Norwich City F.C.', from: 2004, to: 2004 }, { name: 'Norwich City F.C.', from: 1992, to: 1994 }],
  [{ name: 'Nottingham Forest F.C.', from: 2022 }, { name: 'Nottingham Forest F.C.', from: 1998, to: 1998 }, { name: 'Nottingham Forest F.C.', from: 1994, to: 1996 }, { name: 'Nottingham Forest F.C.', from: 1992, to: 1992 }],
  [{ name: 'Oldham Athletic A.F.C.', from: 1992, to: 1993 }],
  [{ name: 'Portsmouth F.C.', from: 2003, to: 2009 }],
  [{ name: 'Queens Park Rangers F.C.', from: 2014, to: 2014 }, { name: 'Queens Park Rangers F.C.', from: 2011, to: 2012 }, { name: 'Queens Park Rangers F.C.', from: 1992, to: 1995 }],
  [{ name: 'Reading F.C.', from: 2012, to: 2012 }, { name: 'Reading F.C.', from: 2006, to: 2007 }],
  [{ name: 'Sheffield United F.C.', from: 2023, to: 2023 }, { name: 'Sheffield United F.C.', from: 2019, to: 2020 }, { name: 'Sheffield United F.C.', from: 2006, to: 2006 }, { name: 'Sheffield United F.C.', from: 1992, to: 1993 }],
  [{ name: 'Sheffield Wednesday F.C.', from: 1992, to: 1999 }],
  [{ name: 'Southampton F.C.', from: 2024, to: 2024 }, { name: 'Southampton F.C.', from: 2012, to: 2022 }, { name: 'Southampton F.C.', from: 1992, to: 2004 }],
  [{ name: 'Stoke City F.C.', from: 2008, to: 2017 }],
  [{ name: 'Sunderland A.F.C.', from: 2025 }, { name: 'Sunderland A.F.C.', from: 2007, to: 2016 }, { name: 'Sunderland A.F.C.', from: 2005, to: 2005 }, { name: 'Sunderland A.F.C.', from: 1999, to: 2002 }, { name: 'Sunderland A.F.C.', from: 1996, to: 1996 }],
  [{ name: 'Swansea City A.F.C.', from: 2011, to: 2017 }],
  [{ name: 'Swindon Town F.C.', from: 1993, to: 1993 }],
  [{ name: 'Tottenham Hotspur F.C.', from: 1992 }],
  [{ name: 'Watford F.C.', from: 2021, to: 2021 }, { name: 'Watford F.C.', from: 2015, to: 2019 }, { name: 'Watford F.C.', from: 2006, to: 2006 }, { name: 'Watford F.C.', from: 1999, to: 1999 }],
  [{ name: 'West Bromwich Albion F.C.', from: 2020, to: 2020 }, { name: 'West Bromwich Albion F.C.', from: 2010, to: 2017 }, { name: 'West Bromwich Albion F.C.', from: 2008, to: 2008 }, { name: 'West Bromwich Albion F.C.', from: 2004, to: 2005 }, { name: 'West Bromwich Albion F.C.', from: 2002, to: 2002 }],
  [{ name: 'West Ham United F.C.', from: 2012 }, { name: 'West Ham United F.C.', from: 2005, to: 2010 }, { name: 'West Ham United F.C.', from: 1993, to: 2002 }],
  [{ name: 'Wigan Athletic F.C.', from: 2005, to: 2012 }],
  [{ name: 'Wimbledon F.C.', from: 1992, to: 1999 }],
  [{ name: 'Wolverhampton Wanderers F.C.', from: 2018 }, { name: 'Wolverhampton Wanderers F.C.', from: 2009, to: 2011 }, { name: 'Wolverhampton Wanderers F.C.', from: 2003, to: 2003 }],
];

// the {{Fs player}} / {{Efs player}} squad rows - most club pages list a first-team squad
const rowNames = ['efs player', 'fs player', 'extended football squad player', 'football squad player'];

const parseSquad = function (doc) {
  const players = rowNames
    .flatMap((name) => doc.templates(name))
    .map((t) => {
      const data = t.json().data || {};
      return {
        number: parseInt(data.no, 10) || null,
        name: data.name || '',
        position: data.pos || '',
        nation: data.nat || '',
      }
    });
  return players.filter((p) => p.name)
};

const makeTitle = twoYearTitle;

// the league phase hides under different names across three decades
const gameTitles = ['premier league', 'fa premier league', 'matches', 'results', 'league'];

// league matches only - cups, friendlies and europe parse separately
const notLeague =
  /\bcup\b|friendl|preseason|pre-season|champions league|europa|uefa|shield|trophy|testimonial|exhibition|abandoned|play-?off|asia|anglo-italian/i;

// one club season spans several competitions - each cup run keeps its own list
const cupish = /\bcup\b|shield|champions league|europa|uefa|trophy|play-?offs\b/i;
const friendly = /friendl|pre-?season|testimonial|emirates cup|asia trophy/i;

// the english season runs august to may
const defaultYear = function () {
  const now = new Date();
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
};

const parse = function (doc) {
  if (!doc) {
    return null
  }
  // missing season-titles redirect to the club page - don't parse those
  const kinds = doc.infoboxes().map((inf) => inf.type());
  if (kinds.length > 0 && kinds.includes('football club season') === false) {
    return null
  }
  const meta = parseTwoYearTitle(doc.title || '');
  const ctx = {
    team: meta.team,
    year: meta.year,
    draws: true, //yellow rows are draws here, not overtime losses
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // the season wraps into the next calendar-year
      return /\b(jan|feb|mar|apr|may|jun)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
  };
  const season = parseInfobox(doc, ['football club season', 'soccer club season'], {});
  // modern pages box every match - early-90s pages table them instead
  let games = findMatches(doc, ctx, gameTitles, notLeague);
  if (games.length === 0) {
    games = findGames(doc, ctx, gameTitles);
  }
  const rec = countRecord(games);
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: {
      record: rec,
      points: rec.wins * 3 + rec.ties, //three points for a win, since 1981
      league: getCell(season, ['league']) || '',
      position: getCell(season, ['position', 'league_result', 'league result']) || null,
      manager: getCell(season, ['manager', 'mgrtitle', 'head coach']) || '',
      stadium: getCell(season, ['stadium', 'stdtitle']) || '',
    },
    games,
    cups: findCompetitions(doc, ctx, cupish, friendly),
    squad: parseSquad(doc),
  }
};

const addMethod = function (models) {
  models.wtf.eplSeason = async function (team, year, options) {
    year ||= defaultYear();
    team = resolveTeam(franchises, team, year);
    const doc = await models.wtf.fetch(makeTitle(team, year), options);
    return parse(doc)
  };
  models.Doc.prototype.eplSeason = function () {
    return parse(this)
  };
};

export { addMethod$1 as ahl, addMethod$2 as cfl, addMethod as epl, addMethod$a as mlb, addMethod$6 as mls, addMethod$8 as nba, addMethod$7 as nfl, addMethod$9 as nhl, addMethod$4 as nwsl, addMethod$3 as pwhl, _version as version, addMethod$5 as wnba };
