/**
 * Demonstrates how to use newman as a library.
 * For this to work, you need to have newman and @tmclnk/newman-reporter-json-stats
 * as "dependencies" in your project.
 *
 * @link https://github.com/postmanlabs/newman#using-newman-as-a-library
 * @link https://github.com/postmanlabs/newman#api-reference
 */
const newman = require("newman");

newman.run(
  {
    collection: require("./postman_collection.json"),
    reporters: "@tmclnk/json-stats",
    verbose: true, // required to get newman to generate add'l statistics
    silent: true, // don't let the reporter write to stdout
  },
  /**
   *
   * @param err
   * @param summary
   * @param summary.statistics {Array} array of statistics, matching what gets printed when you run @tmclnk/json-stats
   * from the command line.
   */
  function (err, summary) {
    // TODO you can access summary.statistics here
    console.log(summary.statistics);
    if (err) {
      throw err;
    }
  }
);
