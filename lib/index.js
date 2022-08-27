var _ = require('lodash'),
util = require('./util'),
    cliUtils = require('./cli-utils'),
    colors = require('colors/safe')
;

var     LF = '\n',
    SPC = ' ',
    DOT = '.',
    E = '';

/**
 * Reporter that simply dumps the summary object to file (default: newman-run-report.json).
 *
 * @param {Object} emitter - The collection run object, with event hooks for reporting run details.
 * @param {Object} reporterOptions - A set of collection run options.
 * @param {String} reporterOptions.export - The path to which the summary object must be written.
 * @returns {*}
 */
module.exports = function (emitter, reporterOptions, options) {
    var currentGroup = options.collection,
        inspect = cliUtils.inspector(options),
        wrap = cliUtils.wrapper(),
        symbols = cliUtils.symbols(options.disableUnicode);

    emitter.on('beforeDone', function (err, o) {
        if (err) { return; }

        emitter.exports.push({
            name: 'json-reporter',
            default: 'newman-run-report.json',
            path: reporterOptions.export,
            content: JSON.stringify(_.omit(o.summary, 'exports'), 0, 2)
        });
    });

    emitter.on('request', function(err, o){
        let req = o.request,
            res = o.response,

            // set values here with abundance of caution to avoid erroring out
            reqSize = util.filesize(req.size().total),
            resSize = util.filesize(res.size().total),
            code = res.code,
            reason = res.reason(),
            mime = res.contentInfo() || {},
            timings = _.last(_.get(o, 'history.execution.data')),

            reqHeadersLen = _.get(req, 'headers.members.length'),
            resHeadersLen = _.get(res, 'headers.members.length'),

            resTime = util.prettyms(res.responseTime || 0),

            reqText = (reporterOptions.verbose && req.body) ? req.body.toString() : E,
            reqTextLen = req.size().body || Buffer.byteLength(reqText),

            resText = reporterOptions.verbose ? res.text() : E,
            resTextLen = res.size().body || Buffer.byteLength(resText),

            reqBodyMode = _.get(req, 'body.mode', ''),
            resSummary = [
                `${mime.contentType}`,
                `${mime.mimeType}`,
                `${mime.mimeFormat}`,
                `${mime.charset}`
            ].join(` ${colors.gray(symbols.star)} `);
        console.log("hello")
    });
};
