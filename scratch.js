const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// wtf.fetch('London', 'en', function(err, doc) {
//   console.log(doc.sections(0).data);
// });


// console.log(readFile('washington-nationals').tables()[1]);

let str = `before
{| class="wikitable" style="width:100%;"
|-
! width="18%" | Station
! width="22%" | Location
! width="12%" | Lifeboat type(s)
! width="12%" | Launch method
! Name and Number
! width="100" | <!-- restrict images to 100px -->
|-
| {{Lbs|Hunstanton}}
| [[Hunstanton]], [[Norfolk]]
| {{Lbb|Atlantic 85}}<br>{{Lbc|H}}
| Carriage<br>Transporter
| ''Spirit of West Norfolk'' (B-848)<br>''The Hunstanton Flyer (Civil Service No 45)'' (H-003)
| [[File:Lifeboat Station, Old Hunstanton - geograph.org.uk - 203605.jpg|100px]]
|-
| {{Lbs|Wells-next-the-Sea}}
| [[Wells-next-the-Sea]], Norfolk
| {{Lbb|Mersey}}<br>{{Lbc|D|IB1}}
| Carriage<br>Carriage
| ''Doris M Mann of Ampthill'' (ON 1161)<br>''Jane Ann III'' (D-661)
| [[File:Wells Lifeboat Station - geograph.org.uk - 153912.jpg|100px]]
|}
`;
// str = 'hello {{Lbs|Hunstanton}}';
console.log(wtf(str).tables(0).json());
// console.log(wtf(str).text());

// console.log(wtf(str).lists(0).links());
// console.log(wtf(`he is good. i think "he is so." after`).sentences());
