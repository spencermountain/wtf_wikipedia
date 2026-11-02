import test from 'tape'
import outcomeOf from '../src/engine/outcome.js'
import parseRecord from '../src/engine/record.js'
import resolveTeam from '../src/engine/teams.js'
import { seasonSlug } from '../src/nhl/index.js'
import nhlFranchises from '../src/nhl/franchises.js'
import mlbFranchises from '../src/mlb/franchises.js'
import nbaFranchises from '../src/nba/franchises.js'
import nflFranchises from '../src/nfl/franchises.js'
import mlsFranchises from '../src/mls/franchises.js'
import wnbaFranchises from '../src/wnba/franchises.js'
import nwslFranchises from '../src/nwsl/franchises.js'
import pwhlFranchises from '../src/pwhl/franchises.js'
import cflFranchises from '../src/cfl/franchises.js'
import ahlFranchises from '../src/ahl/franchises.js'
import eplFranchises from '../src/epl/franchises.js'

test('outcome from row attributes', (t) => {
  t.equal(outcomeOf('class="game-won"'), 'win', 'game-won template class')
  t.equal(outcomeOf('class="game-otl"'), 'otl', 'game-otl template class')
  t.equal(outcomeOf('class="game-tied"'), 'tie', 'game-tied template class')
  t.equal(outcomeOf('style="background:#bfb;"'), 'win', 'mlb green')
  t.equal(outcomeOf('style="background:#fbb;"'), 'loss', 'mlb red')
  t.equal(outcomeOf('style="background:#fcf;"'), 'loss', 'ahl playoff pink')
  t.equal(outcomeOf('style="background:#bbb;"'), 'postponed', 'mlb grey')
  t.equal(outcomeOf('style="background-color:#ffbbbb"'), 'loss', 'longhand color')
  t.equal(outcomeOf('bgcolor=#bfb'), 'win', 'bgcolor syntax')
  t.equal(outcomeOf('bgcolor="#cfc"'), 'win', 'quoted bgcolor')
  t.equal(outcomeOf('', 'Postponed due to rain'), 'postponed', 'postponed text')
  t.equal(outcomeOf('', 'W 31–7'), 'win', 'W score prefix')
  t.equal(outcomeOf('', 'L 2–9'), 'loss', 'L score prefix')
  t.equal(outcomeOf('', 'D 2–2'), 'tie', 'D score prefix')
  t.equal(outcomeOf('bgcolor="#ffffdd"'), 'otl', 'pale yellow is an ot-loss by default')
  t.equal(outcomeOf('bgcolor="#ffffdd"', '', true), 'tie', 'the same yellow is a draw in soccer')
  t.equal(outcomeOf('style="background:#d0ffe3;"'), 'win', '90s-soccer mint green')
  t.equal(outcomeOf('style="background:#ffd0e3;"'), 'loss', '90s-soccer pink')
  t.equal(outcomeOf('bgcolor="#f3f3f3"', '', true), 'tie', '90s-soccer grey draw')
  t.equal(outcomeOf('bgcolor="#f3f3f3"'), null, 'the grey means nothing elsewhere')
  t.equal(outcomeOf('', '6–5'), null, 'no signal')
  t.equal(outcomeOf('style="text-align:center"'), null, 'unrelated style')
  t.end()
})

test('record parsing', (t) => {
  t.deepEqual(
    parseRecord('49–26–7'),
    { wins: 49, losses: 26, otLosses: 7, games: 82, winPct: 0.598 },
    'modern nhl - third number is OTL'
  )
  t.deepEqual(
    parseRecord('44–28–7–3'),
    { wins: 44, losses: 28, ties: 7, otLosses: 3, games: 82, winPct: 0.537 },
    '1999-2005 nhl W–L–T–OTL'
  )
  t.deepEqual(
    parseRecord('30–20–5', { ties: true }),
    { wins: 30, losses: 20, ties: 5, games: 55, winPct: 0.545 },
    'pre-2005: third number is ties'
  )
  t.deepEqual(parseRecord('10-5'), { wins: 10, losses: 5, games: 15, winPct: 0.667 }, 'hyphen, two parts')
  t.equal(parseRecord('3−1−1').games, 5, 'minus sign')
  t.equal(parseRecord('94–68 (.580)').wins, 94, 'trailing percentage ignored')
  t.deepEqual(
    parseRecord('1st half: 16–42 (.276) 2nd half: 21–27 (.438) Overall: 37–69 (.349)'),
    { wins: 37, losses: 69, games: 106, winPct: 0.349 },
    '1981 split-season prefers the overall record'
  )
  t.equal(parseRecord('1st half: 16–42').wins, 16, 'ordinal prefix not read as a record')
  t.deepEqual(
    parseRecord('10–5–4–11', { otWins: true }),
    { wins: 15, otWins: 5, otLosses: 4, losses: 11, games: 30, winPct: 0.5 },
    'pwhl W–OTW–OTL–L counts ot wins as wins'
  )
  t.deepEqual(
    parseRecord('46–23–2–5', { soLosses: true }),
    { wins: 46, losses: 23, otLosses: 7, soLosses: 5, games: 76, winPct: 0.605 },
    'ahl W–L–OTL–SOL counts shootout losses in otLosses'
  )
  t.equal(parseRecord(''), null, 'empty')
  t.equal(parseRecord(), null, 'undefined')
  t.end()
})

test('team resolution across renames', (t) => {
  t.equal(resolveTeam(mlbFranchises, 'Cleveland Indians', 2023), 'Cleveland Guardians', 'follows a rename forward')
  t.equal(resolveTeam(mlbFranchises, 'Cleveland Guardians', 2015), 'Cleveland Indians', 'follows a rename back')
  t.equal(resolveTeam(mlbFranchises, 'blue jays', 2018), 'Toronto Blue Jays', 'case-insensitive partial')
  t.equal(resolveTeam(mlbFranchises, 'Athletics', 2010), 'Oakland Athletics', 'athletics in oakland')
  t.equal(resolveTeam(mlbFranchises, 'Athletics', 2025), 'Athletics', 'athletics in sacramento')
  t.equal(resolveTeam(mlbFranchises, 'Tampa Bay Rays', 2004), 'Tampa Bay Devil Rays', 'devil rays era')
  t.equal(resolveTeam(nhlFranchises, 'Winnipeg Jets', 2018), 'Winnipeg Jets', 'new jets stay jets')
  t.equal(resolveTeam(nhlFranchises, 'Arizona Coyotes', 2026), 'Utah Mammoth', 'coyotes became mammoth')
  t.equal(resolveTeam(nhlFranchises, 'Seattle Kraken', 2023), 'Seattle Kraken', 'expansion team')
  t.equal(resolveTeam(nhlFranchises, 'NY Rangers', 2020), 'New York Rangers', 'ny abbreviation')
  t.equal(resolveTeam(nhlFranchises, 'Some Beer League', 2020), 'Some Beer League', 'unknown passes through')
  // nba
  t.equal(resolveTeam(nbaFranchises, 'Oklahoma City Thunder', 1995), 'Seattle SuperSonics', 'thunder were the sonics')
  t.equal(resolveTeam(nbaFranchises, 'Washington Wizards', 1985), 'Washington Bullets', 'wizards were the bullets')
  t.equal(resolveTeam(nbaFranchises, 'Charlotte Hornets', 1995), 'Charlotte Hornets', 'original hornets')
  t.equal(resolveTeam(nbaFranchises, 'Charlotte Hornets', 2010), 'Charlotte Bobcats', 'bobcats era')
  t.equal(resolveTeam(nbaFranchises, 'New Orleans Pelicans', 2005), 'New Orleans/Oklahoma City Hornets', 'katrina years')
  t.equal(resolveTeam(nbaFranchises, 'Brooklyn Nets', 2000), 'New Jersey Nets', 'nets in jersey')
  // nfl
  t.equal(resolveTeam(nflFranchises, 'Tennessee Titans', 1985), 'Houston Oilers', 'titans were the oilers')
  t.equal(resolveTeam(nflFranchises, 'Las Vegas Raiders', 1985), 'Los Angeles Raiders', 'raiders in la')
  t.equal(resolveTeam(nflFranchises, 'Las Vegas Raiders', 1998), 'Oakland Raiders', 'raiders back in oakland')
  t.equal(resolveTeam(nflFranchises, 'Washington Commanders', 2020), 'Washington Football Team', 'the interim name')
  t.equal(resolveTeam(nflFranchises, 'Indianapolis Colts', 1980), 'Baltimore Colts', 'colts in baltimore')
  // mls
  t.equal(resolveTeam(mlsFranchises, 'Sporting Kansas City', 1999), 'Kansas City Wizards', 'wizards era')
  t.equal(resolveTeam(mlsFranchises, 'San Jose Earthquakes', 1997), 'San Jose Clash', 'clash era')
  t.equal(resolveTeam(mlsFranchises, 'LA Galaxy', 2005), 'Los Angeles Galaxy', 'full galaxy name')
  t.equal(resolveTeam(mlsFranchises, 'CF Montréal', 2015), 'Montreal Impact', 'impact era')
  // wnba
  t.equal(resolveTeam(wnbaFranchises, 'Las Vegas Aces', 1999), 'Utah Starzz', 'aces were the starzz')
  t.equal(resolveTeam(wnbaFranchises, 'Las Vegas Aces', 2015), 'San Antonio Stars', 'san antonio era')
  t.equal(resolveTeam(wnbaFranchises, 'Dallas Wings', 2012), 'Tulsa Shock', 'tulsa era')
  t.equal(resolveTeam(wnbaFranchises, 'Dallas Wings', 2005), 'Detroit Shock', 'detroit era')
  t.equal(resolveTeam(wnbaFranchises, 'Connecticut Sun', 2000), 'Orlando Miracle', 'miracle era')
  t.equal(resolveTeam(wnbaFranchises, 'Portland Fire', 2001), 'Portland Fire', 'the folded fire')
  // nwsl
  t.equal(resolveTeam(nwslFranchises, 'NJ/NY Gotham FC', 2015), 'Sky Blue FC', 'sky blue era')
  t.equal(resolveTeam(nwslFranchises, 'Seattle Reign FC', 2021), 'OL Reign', 'ol reign era')
  t.equal(resolveTeam(nwslFranchises, 'Seattle Reign FC', 2015), 'Seattle Reign FC', 'original reign')
  t.equal(resolveTeam(nwslFranchises, 'North Carolina Courage', 2014), 'Western New York Flash', 'flash era')
  t.equal(resolveTeam(nwslFranchises, 'Chicago Stars FC', 2020), 'Chicago Red Stars', 'red stars era')
  // pwhl
  t.equal(resolveTeam(pwhlFranchises, 'Minnesota Frost', 2023), 'PWHL Minnesota', 'inaugural placeholder name')
  t.equal(resolveTeam(pwhlFranchises, 'PWHL Toronto', 2025), 'Toronto Sceptres', 'placeholder resolves forward')
  // cfl
  t.equal(resolveTeam(cflFranchises, 'Edmonton Elks', 2015), 'Edmonton Eskimos', 'eskimos era')
  t.equal(resolveTeam(cflFranchises, 'Ottawa Redblacks', 2003), 'Ottawa Renegades', 'renegades era')
  t.equal(resolveTeam(cflFranchises, 'Ottawa Redblacks', 1990), 'Ottawa Rough Riders', 'rough riders era')
  t.equal(resolveTeam(cflFranchises, 'Montreal Alouettes', 1984), 'Montreal Concordes', 'concordes era')
  // ahl
  t.equal(resolveTeam(ahlFranchises, 'Cleveland Monsters', 2010), 'Lake Erie Monsters', 'lake erie era')
  t.equal(resolveTeam(ahlFranchises, 'Calgary Wranglers', 2016), 'Stockton Heat', 'stockton era')
  t.equal(resolveTeam(ahlFranchises, 'Lehigh Valley Phantoms', 2012), 'Adirondack Phantoms', 'adirondack era')
  t.equal(resolveTeam(ahlFranchises, 'Hartford Wolf Pack', 2011), 'Connecticut Whale', 'whale interlude')
  t.equal(resolveTeam(ahlFranchises, 'Laval Rocket', 2015), "St. John's IceCaps", 'icecaps era')
  t.equal(resolveTeam(ahlFranchises, 'Manitoba Moose', 2024), 'Manitoba Moose', 'moose back home')
  // epl - no renames, but 51 clubs with promotion/relegation stints
  t.equal(resolveTeam(eplFranchises, 'Arsenal', 2005), 'Arsenal F.C.', 'short club name resolves')
  t.equal(resolveTeam(eplFranchises, 'Leicester', 2015), 'Leicester City F.C.', 'leicester title season')
  t.equal(resolveTeam(eplFranchises, 'Bournemouth', 2022), 'AFC Bournemouth', 'afc-prefix club')
  t.equal(resolveTeam(eplFranchises, 'Brighton', 2023), 'Brighton & Hove Albion F.C.', 'ampersand club')
  t.end()
})

test('nhl season slugs', (t) => {
  t.equal(seasonSlug(2018), '2018–19', 'simple')
  t.equal(seasonSlug(2009), '2009–10', 'zero-padded')
  t.equal(seasonSlug(1999), '1999–2000', 'century rollover')
  t.equal(seasonSlug(2000), '2000–01', 'post-century')
  t.end()
})
