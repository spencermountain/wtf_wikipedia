const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

//325480
// wtf.fetch('Anders_Zorn', 'en', function(err, doc) {
//   console.log(doc.sections());
// });




// let str = `
// {{Infobox scientist
// | name        = Albert Einstein
// | image       = Einstein 1921 by F Schmutzer - restoration.jpg
// | spouse      = {{nowrap| {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}} }}
// | residence   = Germany, Italy, Switzerland, Austria (present-day Czech Republic), Belgium, United States
// | signature = Albert Einstein signature 1934.svg
// }}
// `;
// console.log(wtf(str).infoboxes(0).json());
let str = `
==Paintings==
While his early works were often brilliant, luminous [[watercolor]]s, by 1887 he had switched firmly to oils. Zorn was a prolific artist. He became an international success as one of the most acclaimed portrait painters of his era. His sitters included three American Presidents, nobility, the Swedish king and queen and numerous members of high society. Zorn also painted portraits of family members, friends, and self-portraits. Zorn is also famous for his nude paintings.<ref name="safran-arts.com"/> His fondness of painting full-figured women gave rise to the terms Zorn's ''kulla'' or ''dalakulla'', an unmarried woman or girl from [[Dalecarlia]], as the women were called in the local [[dialect]] of the region Zorn lived.

<gallery widths="200px" heights="200px" caption="Nudes">
File:Freya (1901) by Anders Zorn.jpg|''[[Freyja|Freya]]'', 1901
File:ZORN på sandhamn.jpg|Woman bathing at Sandhamn, 1906
File:Anders Zorn I werners eka-1917.jpg|Woman in a boat, 1917
File:Anders Zorn - I Sängkammaren.jpg|''In the bedroom'', 1918
File:Anders Zorn - Ateljéidyll.jpg|G''Studio Idyll'', 1918
</gallery>

The paintings have the freedom and energy of  sketches, using warm and cool light and shade areas<ref name="safran-arts.com"/> with contrasting areas of warm and cool tones, and an understanding of colour contrasts and reflected lights. Zorn's accomplished use of the brush allows the forms and the texture of the painted subject to reflect and transmit light. In addition to portraits and nudes, Zorn excelled in realistic depictions of water, as well as scenes depicting rustic life and customs.
`;
console.log(wtf(str).sections());
// console.log(wtf(str).images());
