/*
 * Demonstrates how to use newman as a library.
 * For this to work, you need to have newman and @tmclnk/newman-reporter-json-stats
 * as "dependencies" in your project.
 *
 * See https://github.com/postmanlabs/newman#using-newman-as-a-library
 * See https://github.com/postmanlabs/newman#api-reference
 */
const newman = require("newman");

newman.run(
  {
    collection: require("./postman_collection.json"),
    reporters: "@tmclnk/json-stats",
    verbose: true,
  },
  function (err) {
    if (err) {
      throw err;
    }
  }
);
