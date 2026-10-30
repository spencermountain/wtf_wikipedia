import test from 'tape'
import wtf from '../../lib/index.js'

const check = (t, cases) => {
  cases.forEach(([input, want]) => {
    t.equal(wtf(input).text(), want, input)
  })
}

test('#expr arithmetic', (t) => {
  check(t, [
    ['{{#expr:1+1}}', '2'],
    ['{{#expr: 10 * 2 }}', '20'],
    ['{{#expr: (2 + 3) * 4 ^ 2 / 8 }}', '10'],
    ['{{#expr: 7 mod 3}}', '1'],
    ['{{#expr: 7 / 2}}', '3.5'],
    ['{{#expr: 10 / 3 round 2}}', '3.33'],
    ['{{#expr: 1.5e3 + 1}}', '1501'],
    ['{{#expr: -3 + abs(-2)}}', '-1'],
    ['{{#expr: floor 3.7 + ceil 3.2}}', '7'],
    ['{{#expr: sqrt 16}}', '4'],
    ['{{#expr: pi round 3}}', '3.142'],
    ['{{#expr: 0.1 + 0.2}}', '0.3'],
    ['{{#expr: 2 < 3 and 3 < 4}}', '1'],
    ['{{#expr: 2 > 3 or 3 > 4}}', '0'],
    ['{{#expr: not 0}}', '1'],
    ['{{#expr: 3 = 3}}', '1'],
    ['{{#expr: 3 != 3}}', '0'],
    ['{{#expr: 2 * (3 + 4)}}', '14'],
    // errors render nothing
    ['{{#expr: 1/0}}', ''],
    ['{{#expr: foo}}', ''],
    ['{{#expr: (1 + 2}}', ''],
  ])
  t.end()
})

test('#if, #ifeq, #ifexpr, #iferror', (t) => {
  check(t, [
    ['{{#if:x|yes|no}}', 'yes'],
    ['{{#if: | yes | no}}', 'no'],
    ['{{#if:x|yes}}', 'yes'],
    ['{{#if:|yes}}', ''],
    ['{{#if:{{nowrap|x}}|[[Foo|bar]] here|no}}', 'bar here'],
    ['{{#ifeq:a|a|yes|no}}', 'yes'],
    ['{{#ifeq:a|b|yes|no}}', 'no'],
    ['{{#ifeq: 1.0 | 1 | same | diff}}', 'same'],
    ['{{#ifeq: 01 | 1 | same | diff}}', 'same'],
    ['{{#ifeq: a | A | same | diff}}', 'diff'],
    ['{{#ifexpr: 1 > 0 |yes|no}}', 'yes'],
    ['{{#ifexpr: 2 = 3 |yes|no}}', 'no'],
    ['{{#ifexpr: |yes|no}}', 'no'],
    ['{{#iferror:{{#expr:1/0}}|err|ok}}', 'err'],
    ['{{#iferror:{{#expr:1+1}}|err|ok}}', 'ok'],
    ['{{#iferror:{{#expr:1+1}}|err}}', '2'],
  ])
  t.end()
})

test('#switch', (t) => {
  check(t, [
    ['{{#switch:a|a=1|b=2}}', '1'],
    ['{{#switch:b|a=1|b=2}}', '2'],
    ['{{#switch: b | a | b | c = 2 | #default = 3}}', '2'],
    ['{{#switch: z | a = 1 | #default = 3}}', '3'],
    ['{{#switch: z | a = 1 | other}}', 'other'],
    ['{{#switch: z | a = 1 | b = 2}}', ''],
    ['{{#switch: 2 | 2.0 = two }}', 'two'],
    ['{{#switch: fr | en = English | fr = French }}', 'French'],
  ])
  t.end()
})

test('#language, #titleparts, #time', (t) => {
  check(t, [
    ['{{#language:fr}}', 'Français'],
    ['{{#language:de}}', 'Deutsch'],
    ['{{#titleparts:A/B/C|1}}', 'A'],
    ['{{#titleparts:A/B/C|1|2}}', 'B'],
    ['{{#titleparts: Talk:Foo/Bar/Baz | 0 | 2 }}', 'Bar/Baz'],
    ['{{#titleparts: Talk:Foo/Bar/Baz | -1 }}', 'Talk:Foo/Bar'],
    ['{{#time:Y-m-d|2001-05-03}}', '2001-05-03'],
    ['{{#time:j F Y|2001-05-03}}', '3 May 2001'],
    ['{{#time:F j, Y|2001-05-03}}', 'May 3, 2001'],
    ['{{#time:F Y|2001-05}}', 'May 2001'],
    ['{{#time:Y|2001-05-03}}', '2001'],
  ])
  t.end()
})

test('number templates', (t) => {
  check(t, [
    ['{{Roman|12}} {{roman|1994}} {{rom|4}}', 'XII MCMXCIV IV'],
    ['{{binary|5}} {{binary|5|8}}', '101 00000101'],
    ['{{nts|1234}} {{nts|1234567.5}} {{nts|-5}} {{nts|12|prefix=~}}', '1,234 1,234,567.5 -5 ~12'],
    ['{{nts|abc}}', 'abc'],
    ['{{percent|10|100}} {{percent|1|3}} {{percent|1|3|2}}', '10% 33.3% 33.33%'],
    ['1.5{{e|5}} and {{10^|5}} and {{10|-3}} and {{sci|1.5|5}}', '1.5×10⁵ and 10⁵ and 10⁻³ and 1.5×10⁵'],
    ['x {{mabs|y}} z', 'x |y| z'],
  ])
  t.end()
})

test('science templates', (t) => {
  check(t, [
    ['{{physconst|c}}', '299792458 m/s'],
    ['{{physconst|c|unit=no}}', '299792458'],
    ['{{physconst|G}}', '6.67430×10⁻¹¹ m³⋅kg⁻¹⋅s⁻²'],
    ['{{physconst|gn|round=2}}', '9.81 m/s²'],
    ['{{physconst|nope}}', ''],
    ['{{mya|65}} {{ma|65}} {{bya|4.5}} {{ka|10}} {{kya|10}}', '65 million years ago 65 Ma 4.5 billion years ago 10 ka 10 thousand years ago'],
    ['{{mya|65|70}}', '65–70 million years ago'],
    ['{{chem|H|2|O}} {{chem|C|6|H|12|O|6}}', 'H₂O C₆H₁₂O₆'],
    ['{{chem|SO|4|2-}} {{chem|Na|+}}', 'SO₄²⁻ Na⁺'],
    ['{{nuclide|carbon|14}} {{nuclide|uranium|235}} {{nuclide|C|14}}', '¹⁴C ²³⁵U ¹⁴C'],
    ['{{nuclide|technetium|99|m}}', '⁹⁹mTc'],
    ['{{SubatomicParticle|electron}} {{subatomic particle|proton}} {{SubatomicParticle|neutrino}}', 'e⁻ p⁺ ν'],
  ])
  t.end()
})

test('string functions', (t) => {
  check(t, [
    ['{{str right|hello|2}}', 'lo'],
    ['{{str index|hello|2}}', 'e'],
    ['{{str find|hello|l}} {{str find|hello|z}}', '3 -1'],
    ['{{str endswith|hello|lo}}', 'yes'],
    ['{{str endswith|hello|x|y|n}}', 'n'],
    ['{{str startswith|hello|he}}', 'yes'],
    ['{{str number|a1b2}}', '12'],
    ['{{remove first word|hello big world}}', 'big world'],
    ['{{str sub|hello|2|3}}', 'ell'],
    ['{{str upper|abc}} {{str lower|ABC}}', 'ABC abc'],
  ])
  t.end()
})
