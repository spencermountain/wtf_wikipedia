Pull requests are always welcome and respected. Cosmetic code things are not blockers.

Please open an issue to ask questions before making a big PR, that changes behaviour or adds new features.

### To make a PR
* login with your GitHub account or [create an account](https://help.github.com/articles/signing-up-for-a-new-github-account/) for you
* [fork](https://help.github.com/articles/fork-a-repo/) the current `wtf_wikipedia` repository
```bash
npm install
npm test
```
* make your changes in `./src` (optionally, work on them with `npm run watch` and ./scratch.js)
* make sure the tests still pass `npm test`
* for bonus points - add a few tests in `./tests` (doesn't matter where) for the new behaviour
* create a [Pull Request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) for the maintainers to integrate the work into the dev or master branches

don't worry about incrementing package numbers, or kicking-off builds. Releases will be handled by spencer, or other maintainers.

Lastly, thank you! Understanding the information in wikipedia is serious and important project. It's done collaboratively or not at all!
