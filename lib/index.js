var _ = require("lodash"),
  sdk = require("postman-collection"),
  util = require("./util");
(CACHED_TIMING_PHASE = "(cache)"),
  (TIMING_TABLE_HEADERS = {
    prepare: "prepare",
    wait: "wait",
    dns: "dns-lookup",
    tcp: "tcp-handshake",
    secureHandshake: "ssl-handshake",
    firstByte: "transfer-start",
    download: "download",
    process: "process",
    total: "total",
  }),
  (BODY_CLIP_SIZE = 2048);

/**
 * Reporter that simply dumps the summary object to file (default: newman-run-report.json).
 *
 * @param {Object} emitter - The collection run object, with event hooks for reporting run details.
 * @param {Object} reporterOptions - A set of collection run options.
 * @param {String} reporterOptions.export - The path to which the summary object must be written.
 * @returns {*}
 */

// emitter is an event emitter that triggers the following events: https://github.com/postmanlabs/newman#newmanrunevents
// reporterOptions is an object of the reporter specific options. See usage examples below for more details.
// collectionRunOptions is an object of all the collection run options: https://github.com/postmanlabs/newman#newmanrunoptions-object--callback-function--run-eventemitter
module.exports = function (emitter, reporterOptions, collectionRunOptions) {
  var collectionTimings = [];

  emitter.on("beforeDone", function (err, o) {
    if (err) {
      return;
    }

    emitter.exports.push({
      name: "json-reporter",
      default: "newman-run-report.json",
      path: reporterOptions.export,
      content: JSON.stringify(_.omit(o.summary, "exports"), 0, 2),
    });
  });

  emitter.on("request", function (err, o) {
    let req = o.request,
      res = o.response,
      // set values here with abundance of caution to avoid erroring out
      code = res.code,
      timings = _.last(_.get(o, "history.execution.data")),
      reqText = reporterOptions.verbose && req.body ? req.body.toString() : "",
      resText = reporterOptions.verbose ? res.text() : "",
      reqBodyMode = _.get(req, "body.mode", "");

    // print timing info of the request
    timings = timings && timings.timings; // if there are redirects, get timings for the last request sent

    // console.log(timings)
    if (timings) {
      let timingPhases = sdk.Response.timingPhases(timings);

      var data = {
        url: req.url.toString(),
        method: req.method,
        requestSize: req.size().total,
        responseSize: res.size().total,
        statusCode: code,
        timing: timings,
        timingPhases: timingPhases,
      };

      collectionTimings.push(data);
    }
  });

  emitter.on("done", function (err, o) {
    console.log(JSON.stringify(collectionTimings, 0, 2));
  });
};
