var test = require('tape')
var wtf = require('./lib')

test('arenas table', t => {
  let str = `{|class="wikitable" cellpadding="0" cellspacing="0" style="font-size: 85%; text-align: center;"
|-
! style="width:14%; background: #FFCCCC;" | Team
! style="width:25%; background: #FFCCCC;" | Arena
! style="width:10%;background: #FFCCCC;" | Years used
! style="width:5%; background: #FFCCCC;" | Capacity
! style="width:3%;background: #FFCCCC;" | Opened
! style="width:15%; background: #FFCCCC;" | Location
! style="width:3%;background: #FFCCCC;" | Reference
|-
! style="background: #ececec;" rowspan=3 | [[Boston Bruins]]
|-
| [[Boston Garden]]
| 1928–1995
| 14,448
| 1928
| rowspan=2 | [[Boston, Massachusetts]]
| <ref>{{cite web |url=http://hockey.ballparks.com/NHL/BostonBruins/oldindex.htm|title=Boston Garden|publisher=Ballparks.com|accessdate=May 16, 2007}}</ref>
|-
| [[Boston Arena]]
| 1924–1928
| 5,900
| 1910
| <ref>{{cite web|first=Allan|last=Muir|title=Seven Wonders of the Hockey World: Places a fan must visit|url=https://www.si.com/nhl/2015/08/21/seven-wonders-hockey-world-places|website=SI.com|date=August 21, 2015|accessdate=August 7, 2018}}</ref>
|-
|}`
  let doc = wtf(str)
  let rows = doc.tables(0).keyValue()
  rows = rows.filter(r => r.Arena)
  t.equal(rows.length, 2, 'two rows')
  t.equal(rows[0].Team, 'Boston Bruins', 'got team')
  t.equal(rows[0].Arena, 'Boston Garden', 'got arena')
  t.equal(rows[1].Team, 'Boston Bruins', 'got team 2')
  t.equal(rows[1].Arena, 'Boston Arena', 'got arena 2')
  t.end()
})

test('double-header baseball game', t => {
  let str = `{|border="1" cellpadding="2" cellspacing="0" class="wikitable" style="text-align:center; width:100%;"
|-style="background:#ddf"
!width="4%"|#
!width="11%"|Date
!width="11%"|Opponent
!width="8%"|Score
!width="14%"|Win
!width="14%"|Loss
!width="14%"|Save
!width="8%"|Attendance
!width="5%"|Record
!width="5%"|Streak
|-style=background:#cfc
|144||September 12 <small>(1)</small>||@ [[2018 New York Mets season|Mets]] || 0–13 || [[Zack Wheeler|Wheeler]] (11–7) || '''[[Trevor Richards (baseball)|Richards]]''' (3–9) || — || 20,423 || 57–87 ||L1
|-style=background:#bbb
|145||September 13 <small>(1)</small>||@ [[2018 New York Mets season|Mets]] || 3–4 || [[Jerry Blevins|Blevins]] (3–2) || '''[[Kyle Barraclough|Barraclough]]''' (0–6) || — || rowspan=2|22,640 || 57–88 || L2
|-style=background:#fcc
|146||September 13 <small>(2)</small>||@ [[2018 New York Mets season|Mets]] || 2–5 || [[Jason Vargas|Vargas]] (6–9) || '''[[Jeff Brigham|Brigham]]''' (0–2) || [[Robert Gsellman|Gsellman]] (11) || 57–89 || L3
|-style=background:#fcc
|147||September 14||@ [[2018 Philadelphia Phillies season|Phillies]] || 2–14 || [[Zach Eflin|Eflin]] (10–7) || '''[[Wei-Yin Chen|Chen]]''' (6–11) || — || 21,671 || 57–90 || L4
|}`
  let doc = wtf(str)
  let rows = doc.tables(0).keyValue()
  t.equal(rows.length, 4, 'all rows')
  t.equal(rows[0].Attendance, '20,423', '1')
  t.equal(rows[1].Attendance, '22,640', '2')
  t.equal(rows[2].Attendance, '22,640', '3')
  t.equal(rows[3].Attendance, '21,671', '4')
  t.end()
})
