### Good practice:
The wikipedia api is [pretty welcoming](https://www.mediawiki.org/wiki/API:Etiquette#Request_limit) though recommends three things -
* 1️⃣ pass a `Api-User-Agent` as something so they can use to easily throttle bad scripts
* 2️⃣ bundle multiple pages into one request as an array
* 3️⃣ run it serially, or at least, [slowly](https://www.npmjs.com/package/slow).
```js
wtf.fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
  'Api-User-Agent': 'spencermountain@gmail.com'
}).then((docList) => {
  let allLinks = docList.map(doc => doc.links());
  console.log(allLinks);
});
```
