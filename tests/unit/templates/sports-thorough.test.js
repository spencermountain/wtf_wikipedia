import test from 'tape'
import wtf from '../../lib/index.js'

const first = (str) => wtf(str).templates()[0]?.json() || {}

test('sports: goal template', (t) => {
  const arr = [
    ['{{goal|45}}', "⚽ 45'", [{ min: '45', note: '' }]],
    [
      '{{goal|23|pen.|90+2}}',
      "⚽ 23' (pen.), 90+2'",
      [
        { min: '23', note: 'pen.' },
        { min: '90+2', note: '' },
      ],
    ],
    [
      '{{goal|12||34||56}}',
      "⚽ 12', 34', 56'",
      [
        { min: '12', note: '' },
        { min: '34', note: '' },
        { min: '56', note: '' },
      ],
    ],
    ['{{goal|67|o.g.}}', "⚽ 67' (o.g.)", [{ min: '67', note: 'o.g.' }]],
  ]
  arr.forEach(([str, text, data]) => {
    t.equal(wtf(str).text(), text, `${str} text`)
    t.deepEqual(first(str).data.data, data, `${str} data`)
  })
  t.end()
})

test('sports: penalty shoot-out icons', (t) => {
  t.equal(wtf('{{pengoal}}').text(), '✅', 'pengoal icon')
  t.equal(wtf('{{penmiss}}').text(), '❌', 'penmiss icon')
  t.equal(first('{{pengoal}}').template, 'pengoal', 'pengoal template name')
  t.equal(first('{{penmiss}}').template, 'penmiss', 'penmiss template name')
  t.equal(wtf('Smith {{pengoal}} Jones {{penmiss}}').text(), 'Smith ✅ Jones ❌', 'icons inline in a sentence')
  t.end()
})

test('sports: match events (cards and substitutions)', (t) => {
  const arr = [
    ['{{subon|60}}', "sub on: 60'", '60'],
    ['{{suboff|60}}', "sub off: 60'", '60'],
    ['{{yel|30}}', "yellow: 30'", '30'],
    ['{{subon|90+1}}', "sub on: 90+1'", '90+1'],
  ]
  arr.forEach(([str, text, min]) => {
    t.equal(wtf(str).text(), text, `${str} text`)
    t.equal(first(str).data.min, min, `${str} minute`)
  })
  t.equal(wtf('{{subon}}').text(), '', 'subon without a minute renders nothing')
  t.equal(wtf('{{suboff}}').text(), '', 'suboff without a minute renders nothing')
  t.end()
})

test('sports: player template', (t) => {
  const doc = wtf('{{player|10|BRA|Pelé}}')
  t.equal(doc.text(), '10 🇧🇷 Pelé', 'number, flag and name')
  t.equal(doc.links()[0].page(), 'Pelé', 'player name is linked')
  const data = first('{{player|10|BRA|Pelé}}').data
  t.equal(data.number, '10', 'shirt number')
  t.equal(data.country, 'BRA', 'country code')
  t.equal(data.name, 'Pelé', 'player name')
  t.equal(wtf('{{player||CAN|Christine Sinclair}}').text(), '🇨🇦 Christine Sinclair', 'player without a number')
  t.end()
})

test('sports: winning percentage', (t) => {
  const arr = [
    ['{{winning percentage|10|5}}', '.667'],
    ['{{winning percentage|1|2}}', '.333'],
    ['{{winning percentage|3|1}}', '.750'],
    ['{{winning percentage|5|0}}', '1.000'],
    ['{{winning percentage|0|5}}', '.000'],
    ['{{winpct|10|5}}', '.667'],
    ['{{winperc|1|1}}', '.500'],
  ]
  arr.forEach(([str, text]) => t.equal(wtf(str).text(), text, str))
  const data = first('{{winpct|10|5}}').data
  t.equal(data.wins, '10', 'wins parsed')
  t.equal(data.losses, '5', 'losses parsed')
  t.end()
})

test('sports: winlosspct table row', (t) => {
  t.equal(wtf('{{winlosspct|3|1}}').text(), '3 || 1 || .750', 'even percentage')
  const data = first('{{winlosspct|10|5}}').data
  t.equal(data.wins, '10', 'wins parsed')
  t.equal(data.losses, '5', 'losses parsed')
  t.end()
})

test('sports: win draw lose (wdl)', (t) => {
  const tmpl = first('{{wdl|10|6|2|2}}')
  t.equal(tmpl.template, 'wdl', 'template name')
  t.deepEqual(tmpl.data.list, ['10', '6', '2', '2'], 'played, won, drawn, lost')
  t.match(wtf('{{wdl|10|6|2|2}}').text(), /60\.0%/, 'win percentage of 60.0%')
  t.match(wtf('{{win draw lose|4|1|2|1}}').text(), /25\.0%/, 'win percentage of 25.0%')
  t.end()
})

test('sports: win-loss record data', (t) => {
  const data = first('{{win-loss record|w=5|l=3|t=1}}').data
  t.equal(data.w, '5', 'wins')
  t.equal(data.l, '3', 'losses')
  t.equal(data.t, '1', 'ties')
  t.end()
})

test('sports: sports table module', (t) => {
  const str = `{{sports table|update=May 1, 2021|table_header=Division|team1=TOR|team2=MTL
|name_TOR=Toronto|win_TOR=35|loss_TOR=14|otloss_TOR=7|gf_TOR=187|ga_TOR=148
|name_MTL=Montreal|win_MTL=24|loss_MTL=21|tie_MTL=2|otloss_MTL=11}}`
  const doc = wtf(str)
  t.equal(doc.text(), '', 'renders no text')
  const data = first(str).data
  t.equal(data.date, 'May 1, 2021', 'update date')
  t.equal(data.header, 'Division', 'table header')
  t.deepEqual(Object.keys(data.teams), ['tor', 'mtl'], 'teams in order')
  t.equal(data.teams.tor.name, 'Toronto', 'team name')
  t.equal(data.teams.tor.win, 35, 'wins as number')
  t.equal(data.teams.tor.loss, 14, 'losses as number')
  t.equal(data.teams.tor.otloss, 7, 'overtime losses')
  t.equal(data.teams.tor.goals_for, 187, 'goals for')
  t.equal(data.teams.tor.goals_against, 148, 'goals against')
  t.equal(data.teams.mtl.tie, 2, 'ties')
  t.equal(data.teams.mtl.goals_for, 0, 'missing goals default to 0')
  t.end()
})

test('sports: playoff bracket', (t) => {
  const str = '{{4TeamBracket|RD1-seed1=1|RD1-team1=Boston|RD1-score1=4|RD1-seed2=4|RD1-team2=Toronto|RD1-score2=3}}'
  const tmpl = first(str)
  t.equal(wtf(str).text(), '', 'bracket renders no text')
  const game = tmpl.data.rounds[0][0]
  t.equal(game[0].team, 'Boston', 'home team')
  t.equal(game[0].score, 4, 'home score')
  t.equal(game[0].seed, '1', 'home seed')
  t.equal(game[1].team, 'Toronto', 'away team')
  t.equal(game[1].score, 3, 'away score')
  t.end()
})

test('sports: medal count', (t) => {
  const tmpl = first('{{medalcount|USA|10|5|3|CHN|8|7|6}}')
  t.equal(tmpl.template, 'medalcount', 'template name')
  t.deepEqual(
    tmpl.data.list,
    [
      { name: 'USA', '1st': 10, '2nd': 5, '3rd': 3 },
      { name: 'CHN', '1st': 8, '2nd': 7, '3rd': 6 },
    ],
    'medal rows'
  )
  t.equal(wtf('{{medalcount|USA|10|5|3}}').text(), '', 'renders no text')
  t.end()
})

test('sports: win-loss record and winlosspct', (t) => {
  // Template:Win–loss record renders W–L–T with en dashes
  t.equal(wtf('{{win-loss record|w=10|l=5}}').text(), '10–5', 'win-loss record uses an en dash')
  t.equal(wtf('{{win-loss record|w=5|l=3|t=1}}').text(), '5–3–1', 'ties come last: W–L–T')
  // the canonical page name uses an en dash
  t.equal(wtf('{{Win–loss record|w=10|l=5}}').text(), '10–5', 'en-dash template name is recognised')
  // winlosspct should agree with {{winning percentage}}
  t.equal(wtf('{{winlosspct|10|5}}').text(), '10 || 5 || .667', 'winlosspct rounds 10-5 to .667')
  t.equal(wtf('{{winlosspct|1|2}}').text(), '1 || 2 || .333', 'winlosspct rounds 1-2 to .333')
  t.equal(wtf('{{winlosspct|5|0}}').text(), '5 || 0 || 1.000', 'undefeated is 1.000')
  t.equal(wtf('{{winlosspct|0|5}}').text(), '0 || 5 || .000', 'winless is .000')
  t.end()
})
