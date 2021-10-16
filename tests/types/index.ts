// a smoke-test for our typescript typings
// to run:
// npm install -g typescript
// npm run test:types

import wtf from '../../'

// general
wtf('==header==');
const version: string = wtf.version;

// fetch
wtf.fetch("usa", {
    follow_redirects: true
});

wtf.fetch("usa", {
    // @ts-expect-error
    follow_redirects: 1
});

wtf.fetch('On a Friday', { lang: 'en' })
    .then((doc) => {
        if (doc === null) {
            return null
        }

        if (Array.isArray(doc)) {
            return null
        }

        doc.infobox(0)?.get('current_members');

        return;
    })



