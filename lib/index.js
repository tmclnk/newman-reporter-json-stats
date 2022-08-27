var _ = require("lodash"),
  sdk = require("postman-collection"),
  util = require("./util"),
  cliUtils = require("./cli-utils"),
  colors = require("colors/safe");
var LF = "\n",
  SPC = " ",
  DOT = ".",
  E = "";
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
  var currentGroup = collectionRunOptions.collection,
    inspect = cliUtils.inspector(collectionRunOptions),
    wrap = cliUtils.wrapper(),
    symbols = cliUtils.symbols(collectionRunOptions.disableUnicode);

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
      reqSize = util.filesize(req.size().total),
      resSize = util.filesize(res.size().total),
      code = res.code,
      reason = res.reason(),
      mime = res.contentInfo() || {},
      timings = _.last(_.get(o, "history.execution.data")),
      reqHeadersLen = _.get(req, "headers.members.length"),
      resHeadersLen = _.get(res, "headers.members.length"),
      resTime = util.prettyms(res.responseTime || 0),
      reqText = reporterOptions.verbose && req.body ? req.body.toString() : E,
      reqTextLen = req.size().body || Buffer.byteLength(reqText),
      resText = reporterOptions.verbose ? res.text() : E,
      resTextLen = res.size().body || Buffer.byteLength(resText),
      reqBodyMode = _.get(req, "body.mode", ""),
      resSummary = [
        `${mime.contentType}`,
        `${mime.mimeType}`,
        `${mime.mimeFormat}`,
        `${mime.charset}`,
      ].join(` ${colors.gray(symbols.star)} `);

    // print timing info of the request
    timings = timings && timings.timings; // if there are redirects, get timings for the last request sent

    // console.log(timings)
    if (timings) {
      // adds nice units to all time data in the object
      // let timingPhases = util.beautifyTime(sdk.Response.timingPhases(timings)),
      //     timingTable = new Table({
      //         chars: _.defaults({ mid: '', middle: '' }, cliUtils.cliTableTemplate_Blank),
      //         colAligns: _.fill(Array(_.size(timingPhases)), 'left'),
      //         style: { 'padding-left': 2 }
      //     });
      //
      // timingPhases = _.transform(TIMING_TABLE_HEADERS, (result, header, key) => {
      //     if (_.has(timingPhases, key)) {
      //         result.headers.push(colors.white(header));
      //         result.values.push(colors.log(timingPhases[key] || CACHED_TIMING_PHASE));
      //     }
      // }, { headers: [], values: [] });
      let timingPhases = sdk.Response.timingPhases(timings);
      console.log(timingPhases);

      collectionTimings.push(timingPhases);

      var data = {
        responseSize: res.responseSize,
        statusCode: code,
      };

      collectionTimings.push({ ...data, ...timingPhases });

      // timingTable.push(timingPhases.headers); // add name of phases in the table
      // timingTable.push(timingPhases.values); // add time of phases in the table

      // print(LF + timingTable + LF + LF);
    }
    console.log("hello");
  });

  // emitter.on('done',
  //
  //     emitter.on('request', function(err, o){
};
