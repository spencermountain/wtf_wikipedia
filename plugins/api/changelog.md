<!--
#### [unreleased]
- **[fix]** -
-->

#### [unreleased]

- **[new]** - image methods, moved-in from wtf-plugin-image: `doc.mainImage()`, `img.commonsURL()`, `img.exists()`, `img.license()`
- **[new]** - `.getHtml()` and `.getWikiscript()` - server-rendered html and raw markup, from the parse api
- **[new]** - `.getExtract({ sections: 'wiki' })` - official plaintext, from the TextExtracts api
- **[new]** - `{silent: true}` option suppresses console warnings
- **[change]** - uses its own native fetch, instead of the removed `models.http`
- **[fix]** - doc methods like `doc.getRedirects()` build correct urls on fetched documents

#### 2.0.1 [Jul 2024]

- **[fix]** - i18n recursive category fetching

#### 2.0.0 [Mar 2023]

- **[new]** - recursive category fetching in plugin-api (thanks @tstibbs !)
- **[change]** - allow custom user-agent properties
