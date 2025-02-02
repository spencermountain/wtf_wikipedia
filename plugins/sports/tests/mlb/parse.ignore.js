/* eslint-disable no-console */
import test from 'tape'
import wtf from '../_lib.js'

test('rain-out', (t) => {
  let str = ` 
===Game log===
{{Game log start|style={{Baseball primary style|Toronto Blue Jays}}|title= 2022 Game Log: 92–70 (Home: 47–34; Road: 45–36)}}
{{Game log section start|hide=y|style={{Baseball secondary style|Toronto Blue Jays}}|title=October: 4–1 (Home: 2–0; Road: 2–1)| #| Date| Opponent| Score| Win| Loss| Save| Attendance| Record| GB}}
|- style="background:#bfb;" 
| 158 || October 1 || [[2022 Boston Red Sox season|Red Sox]] || 10–0 || '''[[Ross Stripling|Stripling]]''' (10–4) || [[Brayan Bello|Bello]] (2–8) || — || 44,612 || 89–69 || 8½
|- style="background:#bfb;" 
| 159 || October 2 || Red Sox || 6–3 || '''[[Zach Pop|Pop]]''' (4–0) || [[Michael Wacha|Wacha]] (11–2) || '''[[Jordan Romano|Romano]]''' (36) || 43,877 || 90–69 || 7½
|- style="background:#bfb;" 
| 160 || October 3 || @ [[2022 Baltimore Orioles season|Orioles]] || 5–1 {{small|(8)}} || '''[[José Berríos|Berríos]]''' (12–7) || [[Dean Kremer|Kremer]] (8–7) || '''[[Tim Mayza|Mayza]]''' (2) || 10,642 || 91–69 || 7½
|- style="background:#bbb;" 
| — || October 4 || @ Orioles || colspan=7| ''Postponed (rain); Makeup: October 5''
|- style="background:#fbb;" 
| 161 || October 5 {{small|(1)}} || @ Orioles || 4–5 || [[DL Hall|Hall]] (1–1) || '''[[Mitch White (baseball)|White]]''' (1–7) || [[Bryan Baker (baseball)|Baker]] (1) || {{small|see 2nd game}} || 91–70 || 8
|- style="background:#bfb;"
| 162 || October 5 {{small|(2)}} || @ Orioles || 5–1 || '''[[Yusei Kikuchi|Kikuchi]]''' (6–7) || [[Yennier Canó|Canó]] (1–1) || — || 17,248 || 92–70 || 7
|-
{{Game log section end}}
{{Game log end}}
`

  let doc = wtf(str)
  console.log(doc.mlbSeason().games)
  t.end()
})