const Bundler = require('parcel-bundler');
const Path = require('path');

// Entrypoint file location
const file = Path.join(__dirname, '../src/index.js');

// Bundler options
const options = {
  outDir: './builds', // The out directory to put the build files in, defaults to dist
  outFile: 'wtf_wikipedia', // The name of the outputFile
  watch: false, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
  target: 'node', // browser/node/electron, defaults to browser
  logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
  sourceMaps: false, // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
  detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
};

// Initialises a bundler using the entrypoint location and options provided
const bundler = new Bundler(file, options);
// Run the bundler, this returns the main bundle
// Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
bundler.bundle().then(() => {
  console.log('done!');
});
