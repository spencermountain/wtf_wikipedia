'use strict';
var test = require('tape');
var wtf = require('./lib');

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
|}`;

  let doc = wtf(str);
  let rows = doc.tables(0).keyValue();
  t.equal(rows.length, 2, 'two rows');
  t.equal(rows[0].Team, 'Boston Bruins', 'got team');
  t.equal(rows[0].Arena, 'Boston Garden', 'got arena');
  t.equal(rows[1].Team, 'Boston Bruins', 'got team 2');
  t.equal(rows[1].Arena, 'Boston Arena', 'got arena 2');
  t.end();
});
