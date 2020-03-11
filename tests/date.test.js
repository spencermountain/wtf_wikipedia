var test = require('tape')
var wtf = require('./lib')

test('structured date templates', t => {
  var arr = [
    ['{{Birth date|1993|2|24}}', 'February 24, 1993'],
    ['{{Birth date|1993|2|4|df=yes}}', 'February 4, 1993'],
    ['{{Birth date|1919|12|4|df=yes}}', 'December 4, 1919'],
    ['{{Death date|1993|2|4}}', 'February 4, 1993'],
    ['{{Death date|1919|12|4|df=yes}}', 'December 4, 1919'],
    ['{{Death date|1642|1|30|mf=yes}}', 'January 30, 1642'],

    ['{{dob|1997|3|14|df=yes}}', 'March 14, 1997'],
    ['{{Bda|1992|3|4|df=yes}}', 'March 4, 1992'],

    ['{{Birth date and age|1993|2|4|df=yes}}', 'February 4, 1993'],
    ['{{Birth date and age|1992|1|14|df=yes}}', 'January 14, 1992'],
    ['{{Birth date and age|1993|january|14|df=yes}}', 'January 14, 1993'],
    ['{{Birth date and age|1902|december|01|df=yes}}', 'December 1, 1902'],
    ['{{Death date and given age|1993|2|4|df=yes}}', 'February 4, 1993'],
    ['{{Birth date and age|1941}}', '1941'],

    // ['{{Birth year and age|1963}}', '1963 (age 55)'],
    // ['{{Birth year and age|1963|6}}', '1963 (age 55)'],
    ['{{Death year and age|2017|1967}}', '2017'],
    ['{{Death year and age|2017|1967}}', '2017'],
    // ['{{Birth year and age|1963|02}}', 'February 1963'],
    // ['{{Death year and age|2017|1967|02}}', 'February 2017'],

    //more!
    ['{{start date|1993}}', '1993'],
    ['{{start date|1993|02}}', 'February 1993'],
    ['{{start date|1993|02|24}}', 'February 24, 1993'],
    ['{{start date|1993|02|24|08|30}}', '08:30, February 24, 1993'],
    ['{{start date|1993|02|24|08|||+01:00}}', 'February 24, 1993 (+01:00)'],
    ['{{start date|1993|02|24|08|||-07:00}}', 'February 24, 1993 (-07:00)'],
    ['{{start date|1993|02|24|08|30|23}}', '08:30:23, February 24, 1993'],
    ['{{start date|1993|02|24|08|30|23|Z}}', '08:30:23, February 24, 1993 (UTC)'],
    ['{{start date|1993|02|24|08|30|23|+01:00}}', '08:30:23, February 24, 1993 (+01:00)'],
    ['{{start date|1993|02|24|08|30|23|-07:00}}', '08:30:23, February 24, 1993 (-07:00)'],
    ['{{End date|1993|2|24}}', 'February 24, 1993'],
    // ['{{End date|1993|2|24|08|30}}', '08:30, February 24, 1993'],
    ['{{start-date|7 December 1941}}', '7 December 1941'],
    ['{{birth-date|17 December 1901}}', '17 December 1901'],
    ['{{end-date|June 18 1886}}', 'June 18 1886'],
    ['{{Start date and age|1997|03|26}}', 'March 26, 1997'],
    ['{{Start date and age|1986|01|01|df=yes}}', 'January 1, 1986'],
    ['{{Start date and age|2019|03|08}}', 'March 8, 2019'],
    ['{{Start date and age|2010|02|29|df=yes}}', 'February 29, 2010']
  ]
  arr.forEach(a => {
    var str = wtf(a[0]).text()
    t.equal(str, a[1], a[0] + ' ' + str)
  })
  t.end()
})

test('hyphenated language-date templates', t => {
  var arr = [
    ['{{start-date|December 7, 1942}}', 'December 7, 1942'],
    ['{{birth-date|7 December 1941}}', '7 December 1941'],
    ['{{end-date|7 December 1941}}', '7 December 1941'],
    ['{{start-date|5:43PM HST, December 7th, 1941|tz=y}}', '5:43PM HST, December 7th, 1941'],
    ['{{start-date|December 8, 1941 12:50PM Australia/Adelaide|tz=y}}', 'December 8, 1941 12:50PM Australia/Adelaide'],
    // ['{{Birth-date and age|1941-04-12|Twelfth of April, 1941}}', 'Twelfth of April, 1941'],
    ['{{Birth-date and age|April 12, 1941}}', 'April 12, 1941'],
    ['{{Birth-date and age|12 April 1941}}', '12 April 1941'],
    ['{{Birth-date and age|1941}}', '1941'],
    ['{{start-date|7 March 2011}}', '7 March 2011'],
    ['{{end-date|December 8 2000}}', 'December 8 2000'],
    ['{{start-date| December 8, 1941 12:30PM Asia/Manila }}', 'December 8, 1941 12:30PM Asia/Manila'],
    ['born on {{birth-date|17 June 1941}}', 'born on 17 June 1941'],
    [
      'around {{start-date|5:43PM HST, December 7th, 1941|tz=y}} this century',
      'around 5:43PM HST, December 7th, 1941 this century'
    ],
    // ['{{Death-date and given age|2018|2|5|df=yes}}', 'February 5, 2018'],
    // ['{{birth date and age2 |1988|6|10 |1961|7|4 |df=y}}', '4 July 1961'],
    ['{{BirthDeathAge|B|1976}}', '1976'],
    ['{{BirthDeathAge|B|1976|6|6|1990|8|8}}', 'June 6, 1976'],
    ['{{BirthDeathAge| |1976| | |1990| |}}', '1990'],
    ['{{BirthDeathAge| |1976| | |1990|8|8}}', 'August 8, 1990'],
    ['{{BirthDeathAge|{{^}}|1976|{{^}}|{{^}}|2007|1|1}}', 'January 1, 2007']
    // ['{{Birth date based on age at death |age |1986|03|28}}', 'March 28, 1986'],
    // ['{{birth based on age as of date | 50 | 2017 | 02 | 16}}', '1966/1967']
  ]
  arr.forEach(a => {
    var str = wtf(a[0]).text()
    t.equal(str, a[1], a[0])
  })
  t.end()
})

// test('date-data', t => {
//   var obj = wtf('hello {{start date|1993|02|24|08|30}} world').sentences(0);
//   var date = obj.dates(0);
//   t.equal(date.year, 1993, 'got-year');
//   t.equal(date.month, 2, 'got-month');
//   t.equal(date.date, 24, 'got-date');
//   t.equal(date.hour, 8, 'got-hour');
//   t.equal(date.minute, 30, 'got-minute');
//   t.equal(date.text, '08:30, February 24, 1993', 'got-text');
//   t.end();
// });

test('age templates', t => {
  var arr = [
    ['{{Age|1989|7|23|2003|7|14}}', '13'],
    ['{{Age|1989|7|23|2018|2|28}}', '28'],
    // ['{{Age|1989|7|23}}', '28'], //working but untestable
    //     ['{{Age in years, months, weeks and days |month1 = 1 |day1 = 1 |year1 = 1 }}', '2017 years, 1 month, 2 weeks and 1 day'],
    //     ['{{Age in years, months and days|year=2001|month=1|day=15}}', '17 years, 1 month and 1 day'],
    // ['{{Age in years, months and days|2001|01|15|2008|09|05}}', '7 years, 7 months and 21 days'],
    // ['{{Age in years, months and days|2016|8|4|2016|9|5}}', '1 month and 1 day'],
    ['{{age in years and months |1989|7|23 |2003|7|14}}', '13 years, 11 months'],
    // ['{{age in years and months |1989|7|23 |1989|8|22}}', '0 months'],
    ['{{age in years and months |1989|7|23 |1989|8|23}}', '1 month'],
    ['{{age in years and months |1989|7|23 |1990|7|23}}', '1 year'],
    // ['{{age in years and months |1989|7|23 |2018|2|23}}', '28 years, 6 months'],
    // ['{{age in years and months |1990|7|23 |1989|7|23}}', '−1 year'],
    // ['{{age in years and months |1990|9|23 |1989|7|23}}', '−1 year, 2 months'],
    // ['{{age in years and days|15 May 2010}}', '7 years, 264 days'],
    // ['{{age in years and days|12 Aug 2003|24 Sep 2011}}', '8 years, 43 days'],
    // ['{{age in years and days|1989|7|23}}', '28 years, 195 days'],
    // ['{{age in years and days|1989|7|23|2003|7|24}}', '14 years, 1 day'],
    // ['{{age in years and days|2007|03|02|2008|03|02}}', '1 year, 0 days'],
    // ['{{age in days|19 Aug 2008|4 Sep 2010}}', '746'],
    // ['{{age in days|27 May 2002}}', '5,744'],
    ['{{Age nts|1989|7|23|2003|7|14}}', '13']
    // ['{{Age nts|1989|7|23}}', '28'],
    //
    //     ['{{Age as of date|50|2016|1|1}}', '52–53'],
    //     ['{{Age as of date|50|2016|12|31}}', '51–52'],
    //     ['{{Age as of date|50|2016|02|16}}', '52'],
    //     ['{{Age as of date|50|2016|Feb|16}}', '52'],
    //     ['{{Age as of date|50|2016|February|16}}', '52'],
  ]
  arr.forEach(a => {
    var str = wtf(a[0]).text()
    t.equal(str, a[1], a[0])
  })
  t.end()
})
