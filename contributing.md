
* login with your GitHub account or [create an account](https://help.github.com/articles/signing-up-for-a-new-github-account/) for you
* [fork](https://help.github.com/articles/fork-a-repo/) the current `wtf_wikipedia` repository and add e.g. a new export format in `/src/output/`,
* Build and test the generated library with `npm run build`
* If you update the `README.md` with a new export format run `doctoc README.md` to update the table of contents.
* create a [Pull Request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) for the maintainer Spencer Kelly to integrate the new export format the original `wtf_wikipedia` respository.


```bash
npm install
npm test
npm run build #to package-up client-side
```
