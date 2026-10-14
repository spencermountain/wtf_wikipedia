This project maintains a large number of tests in order to ensure that this difficult syntax parsing does not regress when it changes.

Wikipedia examples in different languages are found in the `tests/_examples` folder

Tests that are not passing, but are worth looking at are kept in the `tests/_hmm` folder and run seperately with `pnpm test:hmm`

Tests that require a live network are found in the `tests/fetch` folder and run seperately with `pnpm test:fetch`

pnpm scripts:

- `test:unit` - end-to-end parser tests
- `test:types` - typescript setup
- `test:fetch` - tests that require network
- `test:plugins` - all tests in ./plugins projects
- `test:all` - run unit && types && plugins
- `test:hmm` - tests that aren't passing but should
