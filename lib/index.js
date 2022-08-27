/**
 * Accumulates metrics for each iteration and pushes to an Amazon Cloudwatch Metrics
 * namespace called PostmanCanaries.
 * 
 * The data will have 3 metrics: [PassedAssertions, FailedAssertions, ResponseTime].
 * Note that these are the cumulative times for the entire iteration, not the
 * times for the requests themselves.
 *
 * Dimensions can be specified with "--cloudwatch-metrics-dimension-myDim", which
 * will then appear as "MyDim" in the metric output.
 */
const { CloudWatchClient, PutMetricDataCommand } = require("@aws-sdk/client-cloudwatch")
let cloudwatch = new CloudWatchClient({ region: "us-east-1" })

let item // "item" in the PostMan sense
let iterationData = []

module.exports = function (newman, options) {
    // get dimensions from "--cloudwatch-metrics-dimension" parameters
    let dimensions = []
    for(key in options){
        if (key.startsWith("cloudwatchMetricsDimension")) {
            dimensions.push( {
                Name: key.replaceAll("cloudwatchMetricsDimension",""),
                Value: options[key]
            })
        }
    }

    newman.on("beforeItem", (err) => {
        if (err) return
        item = {}
    })

    newman.on("beforeIteration", (err) => {
        if (err) return
        iterationData = []
    })

    newman.on("beforeRequest", (err, e) => {
        if (err || !e.item.name) return
        const { cursor, item, request } = e

        // set up fields
        Object.assign(item, {
            collectionName: newman.summary.collection.name,
            iteration: cursor.iteration + 1,
            requestName: item.name,
            method: request.method,
            url: request.url.toString()
        })
    })

    newman.on("request", (err, e) => {
        if (err || !e.item.name) return
        const { status, code, responseTime, responseSize } = e.response
        Object.assign(item, { status, code, responseTime, responseSize })
    })

    newman.on("assertion", (err, e) => {
        const { assertion } = e
        const key = err ? "failed" : e.skipped ? "skipped" : "executed"

        item[key] = item[key] || []
        item[key].push(assertion)
    })

    newman.on("item", (err) => {
        if (err) return
        iterationData.push(item)
    })
    
    newman.on("iteration", (err) => {
        if (err) return
    
        const metric = {
            MetricData: [
                {
                    MetricName: "ResponseTime",
                    Dimensions: dimensions,
                    Timestamp: new Date(),
                    Unit: "Milliseconds",
                    Value: iterationData.reduce((acc, postmanResult) => acc + postmanResult.responseTime || 0, 0)
                },
                {
                    MetricName: "FailedAssertions",
                    Dimensions: dimensions,
                    Timestamp: new Date(),
                    Unit: "Count",
                    Value: iterationData.reduce((acc, postmanResult) => acc + (postmanResult?.failed?.length || 0), 0)
                },
                {
                    MetricName: "PassedAssertions",
                    Dimensions: dimensions,
                    Timestamp: new Date(),
                    Unit: "Count",
                    Value: iterationData.reduce((acc, postmanResult) => acc + (postmanResult?.executed?.length || 0), 0)
                }
            ],
            Namespace: "PostmanCanaries"
        }
        
        console.log(JSON.stringify(metric))
    
        // cloudwatch.send(new PutMetricDataCommand(metric), (err) => {
        //     if (err) {
        //         console.error(err, err.stack);
        //         process.exitCode = 10
        //     } else {
        //         // successful response
        //     }
        // })
    })

    newman.on('done', function() {
        var run = this.summary.run;

        console.log(run.stats);
    })
}
