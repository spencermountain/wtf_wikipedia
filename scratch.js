import wtf from './src/index.js'
import plg from './plugins/api/src/index.js'
wtf.plugin(plg)
// let doc = await wtf.fetch('Toronto Raptors')
// let coach = doc.infobox().get('coach')
// coach.text() //'Nick Nurse'

const str = `hello world
{{MLB game log section|style={{Baseball secondary style|New York Yankees}}|stadium=y}}
|- bgcolor=#fbb
| [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_05/gid_2018_10_05_nyamlb_bosmlb_1/boxscore_col.html 1] || October 5 || @ [[2018 Boston Red Sox season|Red Sox]] || 4−5 || [[Chris Sale|Sale]] (1–0) || '''[[J.A. Happ|Happ]]''' (0–1) || [[Craig Kimbrel|Kimbrel]] (1) || [[Fenway Park]] || 39,059 || 0–1
|- bgcolor=#bfb
| [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_06/gid_2018_10_06_nyamlb_bosmlb_1/boxscore_col.html 2] || October 6 || @ [[2018 Boston Red Sox season|Red Sox]] || 6−2 || '''[[Masahiro Tanaka|Tanaka]]''' (1–0) || [[David Price (baseball)|Price]] (0–1) || — || [[Fenway Park]] || 39,151 || 1−1
{{MLB game log section end}}`
const doc = wtf(str)
console.log(doc.text())
// let doc = wtf(str)
// console.log(doc.templates('sustantivo masculino').map(t => t.json().template))
// console.log(doc.section('sustantivo masculino'))
// console.log(doc.json().sections)
// let f = doc.templates('sustantivo femenino')
// let m = doc.templates('sustantivo masculino')
// console.log(doc.text())