<!--
#### [unreleased]
- **[fix]** -
-->

#### [unreleased]

- **[update]** - wtf_wikipedia@11 support
- **[new]** - `.names()`, `.occupation()`, `.spouses()`, `.children()` and `.age()` methods
- **[new]** - infobox param aliases - `birthdate`, `born`, `died`, `birthplace`, ...
- **[new]** - first-sentence dates after a pronunciation, like `(/ˈɡrɛtski/; born January 26, 1961)`
- **[new]** - tight lifespan ranges, like `(1625–1696)`
- **[new]** - `nationality()` falls back to the `citizenship` field, then the first-sentence demonym
- **[new]** - `birthPlace()` falls back to 'born in ...' sentences, then 'People from ...' categories
- **[fix]** - `parseDate()` returned a date object for garbage input in non-UTC timezones
- **[change]** - year-only dates return `{year}` alone, instead of a fabricated january 1st
- **[change]** - underscored infobox types, like `Infobox prime_minister`, now match
- **[change]** - `isAlive()` is typed `boolean | null`
- **[update]** - removed unused `compromise` dependency

#### 1.0.0 [Sep 2026]

- **[update]** - dependencies
