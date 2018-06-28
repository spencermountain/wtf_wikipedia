const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// var str = `{{tag|ref|content=haha}}`;
// var str = `{{Sfn|Tattersall|1982|pp=43–46}}`;
// var str = `{{MSW3 | id = 13801049 | pages = 391–393 | heading = Genus ''Nycteris'' | author = Simmons, N. B.}}`;
// var str = `{{Buddhist crisis|state=collapsed}}`;
// var str = `{{Lacking ISBN|date=January 2017}}`;
// var str = `The ring-tailed lemur is known locally in Malagasy as ''{{lang|mg|maky}}'' (pronounced {{IPA-mg|ˈmakʲi̥|}}), `;
// var str = `{{s-ttl | title = Member of the [[List of United States Representatives from Massachusetts|House of Representatives]] <br /> from [[Massachusetts's 11th congressional district]] | years = 1947–1953 }}`;
// var str = `{{CongBio|K000107}}`;
// var str = `{{Gutenberg author | id=James,+Henry+(1843-1916) |name=Henry James}}`;
// var str = `{{Internet Archive author |sname=Gyula Krúdy|birth=1878|death=1933}}`;
// var str = `{{Goodreads author|1599723.Michael_Grant|Michael Grant}}`;
// var str = `{{IMDb title | 0426883 | Alpha Dog }}`;
// var str = `{{Goodreads book|140397|Wings of the Falcon}}`;
// var str = `{{Goodreads book|id=140397|title=Wings of the Falcon}}`;
// var str = `{{Internet Archive author |sname=John Fitzgerald [[Kennedy]] |sopt=t}}`;
// var str = `{{Librivox asdf |id=2572}}`;
// var str = `{{Librivox book |stitle=The Federalist Papers |dtitle=''The Federalist'' papers}}`;
// var str = `{{discogs artist|artist=John F. Kennedy|date=june 9}}`;
// str = `{{Discogs artist|artist=소녀시대|name=소녀시대}}`;
// str = `{{Discogs artist|소녀시대|소녀시대}}`;
// var str = `{{Find a Grave|574|accessdate=November 17, 2013}}`;
// var str = `{{Dmoz|Society/History/By_Region/North_America/United_States/Presidents/Kennedy%2C_John_Fitzgerald/}}`;
// var str = `{{iMDb name|0448123}}`;
// var str = `{{Twitter | AcadiaU | Acadia University }}`;
// var str = `{{Facebook|zuck|Mark Zuckerberg}}`;
// var str = `{{ESPN NFL | 10536 | Trent Edwards }}`;
// var str = `asdf is cool. lkajsdf`;
// var doc = wtf(str);
// console.log(doc.title());
// console.log(doc.templates(0));

// var doc = readFile('toronto');

// console.log(wtf('that cat is [[aasdf]] cool dude').html());
// wtf.fetch('Dusseldorf', 'en').then(doc => {
wtf.fetch('The Beast of Alice Cooper', 'fr').then(doc => {
  // console.log(doc.plaintext());
  console.log(JSON.stringify(doc.json(), null, 2));
// // console.log(doc.templates().filter(t => t.template !== 'citation'));
});
