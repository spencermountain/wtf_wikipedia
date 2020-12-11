const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

// const plugin = (models, templates) => {
//   // add templates
//   templates.tag = (text, data, c, d) => {
//     console.log(d)
//     return
//   }
// }

// wtf.extend(plugin)

// wtf.fetch('https://wiki.openstreetmap.org/wiki/Tag:highway%3Dmotorway', { path: '/w/api.php' }).then((doc) => {
//   // console.log(doc.templates('ValueDescription'))
// })

let doc = wtf(`
{{Graph:Chart
  |width=700
  |type=line
  |linewidth=1
  |colors=#A50026,#FF4500
  |xType=date
  |xAxisTitle=Date
  |xAxisAngle=-40
  |yGrid= |xGrid=
  |x=Jan 25,Jan 26,Jan 27,Jan 28,Jan 29,Jan 30,Jan 31,Feb 1,Feb 2,Feb 3,Feb 4,Feb 5,Feb 6,Feb 7,Feb 8,Feb 9,Feb 10,Feb 11,Feb 12,Feb 13,Feb 14,Feb 15,Feb 16,Feb 17,Feb 18,Feb 19,Feb 20,Feb 21,Feb 22,Feb 23,Feb 24,Feb 25,Feb 26,Feb 27,Feb 28,Feb 29,Mar 1,Mar 2,Mar 3,Mar 4,Mar 5,Mar 6,Mar 7,Mar 8,Mar 9,Mar 10,Mar 11,Mar 12,Mar 13,Mar 14,Mar 15,Mar 16,Mar 17,Mar 18,Mar 19,Mar 20,Mar 21,Mar 22,Mar 23,Mar 24,Mar 25,Mar 26,Mar 27,Mar 28,Mar 29,Mar 30,Mar 31,Apr 1,Apr 2,Apr 3,Apr 4,Apr 5,Apr 6,Apr 7,Apr 8,Apr 9,Apr 10,Apr 11,Apr 12,Apr 13,Apr 14,Apr 15,Apr 16,Apr 17,Apr 18,Apr 19,Apr 20,Apr 21,Apr 22,Apr 23,Apr 24,Apr 25,Apr 26,Apr 27,Apr 28,Apr 29,Apr 30,May 1,May 2,May 3,May 4,May 5,May 6,May 7,May 8,May 9,May 10,May 11,May 12,May 13,May 14,May 15,May 16,May 17,May 18,May 19,May 20,May 21,May 22,May 23,May 24,May 25,May 26,May 27,May 28,May 29,May 30,May 31,Jun 1,Jun 2,Jun 3,Jun 4,Jun 5,Jun 6,Jun 7,Jun 8,Jun 9,Jun 10,Jun 11,Jun 12,Jun 13,Jun 14,Jun 15,Jun 16,Jun 17,Jun 18,Jun 19,Jun 20,Jun 21,Jun 22,Jun 23,Jun 24,Jun 25,Jun 26,Jun 27,June 28,June 29,June 30,July 1,July 2,July 3,July 4,July 5,July 6,July 7,July 8,July 9,July 10,July 11,July 12,July 13,July 14,July 15,July 16,July 17,July 18,July 19,July 20,July 21,July 22,July 23,July 24,July 25,July 26,July 27,July 28,July 29,July 30,July 31,Aug 1,Aug 2,Aug 3,Aug 4,Aug 5,Aug 6,Aug 7,Aug 8,Aug 9,Aug 10,Aug 11,Aug 12,Aug 13,Aug 14,Aug 15, Aug 16,Aug 17,Aug 18,Aug 19,Aug 20,Aug 21,Aug 22,Aug 23,Aug 24,Aug 25,Aug 26,Aug 27,Aug 28,Aug 29,Aug 30,Aug 31,Sep 1,Sep 2,Sep 3,Sep 4,Sep 5,Sep 6,Sep 7,Sep 8,Sep 9,Sep 10,Sep 11,Sep 12,Sep 13,Sep 14,Sep 15,Sep 16,Sep 17,Sep 18,Sep 19,Sep 20,Sep 21,Sep 22,Sep 23,Sep 24,Sep 25,Sep 26,Sep 27,Sep 28,Sep 29,Sep 30,Oct 1,Oct 2,Oct 3,Oct 4,Oct 5,Oct 6,Oct 7,Oct 8,Oct 9,Oct 10,Oct 11,Oct 12,Oct 13,Oct 14,Oct 15,Oct 16,Oct 17,Oct 18,Oct 19,Oct 20,Oct 21,Oct 22,Oct 23,Oct 24,Oct 25,Oct 26,Oct 27,Oct 28,Oct 29,Oct 30,Oct 31,Nov 1,Nov 2,Nov 3,Nov 4,Nov 5,Nov 6,Nov 7,Nov 8,Nov 9,Nov 10,Nov 11,Nov 12,Nov 13,Nov 14,Nov 15,Nov 16,Nov 17,Nov 18,Nov 19,Nov 20,Nov 21,Nov 22,Nov 23,Nov 24,Nov 25,Nov 26
  |yAxisTitle=No. of deaths
  |y1Title=New deaths per day
  |y1=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,3,4,1,3,0,7,1,4,3,8,4,16,6,5,23,12,10,27,49,46,47,43,58,54,74,60,84,64,63,123,107,186,114,160,117,103,144,140,173,155,163,95,147,152,137,188,207,175,116,172,189,189,176,161,124,178,122,176,135,168,90,117,103,60,70,119,121,98,105,69,121,94,126,112,102,94,222,31,69,103,139,66,70,27,35,62,63,34,55,58,39,29,38,41,46,46,64,20,6,18,30,20,11,25,12,14,25,28,23,21,11,10,9,18,26,12,10,14,10,7,8,12,17,12,9,4,6,4,8,4,7,4,5,11,11,7,10,6,6,4,2,11,4,4,4,6,5,6,4,15,9,5,4,2,6,13,4,5,10,7,2,10,7,4,7,7,5,4,9,6,3,4,2,2,2,1,7,2,8,0,7,1,8,9,5,7,5,6,6,11,6,9,6,6,7,6,10,13,6,22,90,51,20,23,26,11,16,28,23,5,14,27,10,35,23,24,14,18,16,35,33,26,34,24,27,28,31,42,36,26,43,29,71,57,45,54,48,39,42,68,53,83,60,63,62,74,59,100,79,69,72,49,66,97,92,89
  |y2Title=7-day average of new deaths per day
  |y2=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.4,1,1.1,1.6,1.6,2.6,2.7,2.9,2.7,3.7,3.9,6.1,6,6.6,9.3,10.6,10.9,14.1,18.9,24.6,30.6,33.4,40,46.3,53,54.6,60,62.4,65.3,74.6,82.1,98.1,105.9,116.7,124.3,130,133,137.7,135.9,141.7,142.1,139,145.3,146.4,146,148.1,155.6,157.3,160.3,163.9,169.1,176.6,174.9,168.3,161,169.9,162.7,160.9,152.9,152,141.9,140.9,130.1,121.3,106.1,104.1,97.1,98.3,96.6,91.7,100.4,103.9,104.9,103.6,104.1,102.6,124.4,111.6,108,104.7,108.6,103.4,100,72.1,72.7,71.7,66,51,49.4,47.7,49.4,48.6,45.1,42,43.7,42.4,43.3,40.6,37.3,34.4,32.9,29.1,23.1,15.1,13.1,18.6,19.6,19.3,19.7,22.1,22.6,23.1,20.4,17.1,16.9,15.3,13.7,14.3,14.3,11.6,12.4,10.4,11.1,11.4,10.6,9.7,9.7,9.1,8.6,6.7,6,5.3,5.4,6.1,7.1,6.7,7.9,7.7,8,7.9,6.6,6.6,6.4,5.3,5,5,5.1,5.7,4.7,6.3,7,7.1,6.9,6.4,6.4,7.3,6.1,5.6,6.3,6.7,6.7,7.1,6.9,6.4,6.9,6.3,6,6.3,6.3,6,5.9,5.6,4.7,4.3,4,2.9,3,2.9,3.1,3.1,3.9,3.7,4.7,5,5.4,5.3,6,5.9,6.6,7,6.6,7.1,7,7.3,7.3,7.3,7.1,8.1,7.7,10,21.9,28.4,30.4,32.3,34.1,34.9,34,25.1,21,18.9,17.6,17.7,17.6,20.3,19.6,19.7,21,21.6,20,23.6,23.3,23.7,25.1,26.6,27.9,29.6,29,30.3,31.7,30.6,33.3,33.6,39.7,43.4,43.9,46.4,49.6,49,50.9,50.4,49.9,55.3,56.1,58.3,61.6,66.1,64.9,71.6,71,72.3,73.6,71.7,70.6,76,74.9,76.3
  }}`)
console.log(doc.template('graph:chart'))
// console.log(doc._missing_templates)
