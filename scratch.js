const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

//images in tables...

// wtf.fetch('London', 'en', function(err, doc) {
//   console.log(doc.sections(0).data);
// });


// console.log(readFile('washington-nationals').tables(0));

let str = `before

{| class="toccolours"  style="width:82%; clear:both; margin:1.5em auto; text-align:center;"
|-
{| class="wikitable"
|-
! style="background:#ddf; width:0;"| #
! style="background:#ddf; width:11%;"| Date
! style="background:#ddf; width:14%;"| Opponent
! style="background:#ddf; width:9%;"| Score
! style="background:#ddf; width:18%;"| Win
! style="background:#ddf; width:18%;"| Loss
! style="background:#ddf; width:16%;"| Save
! style="background:#ddf; width:0;"| Attendance
! style="background:#ddf; width:0;"| Record
|- align="center" bgcolor="bbffbb"
| 1 || April 3 || [[2017 Miami Marlins season|Marlins]] || 4–2 || '''[[Stephen Strasburg|Strasburg]]''' (1–0) || [[David Phelps (baseball)|Phelps]] (0–1) || '''[[Blake Treinen|Treinen]]''' (1) || 42,744 || 1–0
|- align="center" bgcolor="bbffbb"
| 2 || April 5 || [[2017 Miami Marlins season|Marlins]] || 6–4 || '''[[Tanner Roark|Roark]]''' (1–0) || [[Dan Straily|Straily]] (0–1) || '''[[Blake Treinen|Treinen]]''' (2) || 22,715 || 2–0
|- align="center" bgcolor="ffbbbb"
| 3 || April 6 || [[2017 Miami Marlins season|Marlins]] || 3–4 <small>(10)</small> || [[David Phelps (baseball)|Phelps]] (1–1) || '''[[Joe Blanton|Blanton]]''' (0–1) || [[A. J. Ramos|Ramos]] (1) || 19,418 || 2–1
|- align="center" bgcolor="bbffbb"
|}
|}
`;


str = ` {|
| one
| two
| three
|-
{|
| inside! one b
| inside! two b
| inside! three b
|}
|Statue of Liberty
|New York City
|Chicago
|}
`;

console.log(wtf(str).tables(0).json());
