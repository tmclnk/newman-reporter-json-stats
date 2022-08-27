/* Copyright 2022 Tom McLaughlin
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _ = require("lodash"),
  sdk = require("postman-collection");

// noinspection JSUnusedLocalSymbols
/**
 * Reporter that simply dumps the summary object to file (default: newman-run-report.json).
 *
 * @param {Object} emitter - The collection run object, with event hooks for reporting run details.
 * @param {Object} reporterOptions - A set of collection run options.
 * @param {String} reporterOptions.export - The path to which the summary object must be written.
 * @param collectionRunOptions {Object} is an object of all the collection run options: https://github.com/postmanlabs/newman#newmanrunoptions-object--callback-function--run-eventemitter
 * @returns {*}
 */
module.exports = function (emitter, reporterOptions, collectionRunOptions) {
  let collectionTimings = [];

  emitter.on("beforeDone", function (err, o) {
    if (err) {
      return;
    }
  });

  emitter.on("request", function (err, o) {
    let req = o.request,
      res = o.response,
      code = res.code,
      timings = _.last(_.get(o, "history.execution.data"));

    // print timing info of the request
    timings = timings && timings.timings; // if there are redirects, get timings for the last request sent

    if (timings) {
      let timingPhases = sdk.Response.timingPhases(timings);

      // keep all timing data under "timing"
      timings.phases = timingPhases;

      const data = {
        url: req.url.toString(),
        method: req.method,
        requestSize: req.size().total,
        responseSize: res.size().total,
        statusCode: code,
        timing: timings,
      };

      collectionTimings.push(data);
    }
  });

  emitter.on("done", function (err, o) {
    console.log(JSON.stringify(collectionTimings, 0, 2));
  });
};
