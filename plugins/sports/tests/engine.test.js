import test from 'tape'
import outcomeOf from '../src/engine/outcome.js'
import parseRecord from '../src/engine/record.js'
import resolveTeam from '../src/engine/teams.js'
import { seasonSlug } from '../src/nhl/index.js'
import nhlFranchises from '../src/nhl/franchises.js'
import mlbFranchises from '../src/mlb/franchises.js'

test('outcome from row attributes', (t) => {
  t.equal(outcomeOf('class="game-won"'), 'win', 'game-won template class')
  t.equal(outcomeOf('class="game-otl"'), 'otl', 'game-otl template class')
  t.equal(outcomeOf('class="game-tied"'), 'tie', 'game-tied template class')
  t.equal(outcomeOf('style="background:#bfb;"'), 'win', 'mlb green')
  t.equal(outcomeOf('style="background:#fbb;"'), 'loss', 'mlb red')
  t.equal(outcomeOf('style="background:#bbb;"'), 'postponed', 'mlb grey')
  t.equal(outcomeOf('style="background-color:#ffbbbb"'), 'loss', 'longhand color')
  t.equal(outcomeOf('bgcolor=#bfb'), 'win', 'bgcolor syntax')
  t.equal(outcomeOf('bgcolor="#cfc"'), 'win', 'quoted bgcolor')
  t.equal(outcomeOf('', 'Postponed due to rain'), 'postponed', 'postponed text')
  t.equal(outcomeOf('', 'W 31–7'), 'win', 'W score prefix')
  t.equal(outcomeOf('', 'L 2–9'), 'loss', 'L score prefix')
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
  t.end()
})

test('nhl season slugs', (t) => {
  t.equal(seasonSlug(2018), '2018–19', 'simple')
  t.equal(seasonSlug(2009), '2009–10', 'zero-padded')
  t.equal(seasonSlug(1999), '1999–2000', 'century rollover')
  t.equal(seasonSlug(2000), '2000–01', 'post-century')
  t.end()
})
