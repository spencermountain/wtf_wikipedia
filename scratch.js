const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// const doc = await wtf.fetch('Berlin', 'de');
// console.log(doc.sentences(0).plaintext());
// })();

let str = `{|class="wikitable"
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
|-align="center" bgcolor="bbffbb"
| 2 || April 2 || @ [[2014 New York Mets season|Mets]] || 5–1 || '''[[Gio González|González]]''' (1–0) || [[Bartolo Colón|Colón]] (0–1) ||  || 29,146 || 2–0
|-align="center" bgcolor="bbffbb"
| 3 || April 3 || @ [[2014 New York Mets season|Mets]] || 8–2 || '''[[Tanner Roark|Roark]]''' (1–0) || [[Zack Wheeler|Wheeler]] (0–1) || || 20,561 || 3–0
|-align="center" bgcolor="ffbbbb"
| 4 || April 4 || [[2014 Atlanta Braves season|Braves]] || 2–1 || [[Luis Avilán|Avilán]] (1–0) || '''[[Tyler Clippard|Clippard]]''' (0–1) || [[Craig Kimbrel|Kimbrel]] (3) || 42,834 || 3–1
|-align="center" bgcolor="ffbbbb"
| 5 || April 5 || [[2014 Atlanta Braves season|Braves]] || 6–2 || [[Julio Teherán|Teherán]] (1–1) || '''[[Stephen Strasburg|Strasburg]]''' (0–1) || || 37,841 || 3–2
|-align="center" bgcolor="bbffbb"
|}
Actual first sentence  is here`;
console.log(wtf(str).tables(0).data[0]);
