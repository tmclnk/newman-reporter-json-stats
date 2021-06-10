/**
 * Accumulates metrics for each iteration and pushes to an Amazon Cloudwatch Metrics
 * namespace called PostmanCanaries.
 * 
 * The data will have 3 metrics: [PassedAssertions, FailedAssertions, ResponseTime].
 * Note that these are the cumulative times for the entire iteration, not the
 * times for the requests themselves.
 * 
 * The data will have 2 dimensions: [Env,Pod].
 */
const { CloudWatchClient, PutMetricDataCommand } = require("@aws-sdk/client-cloudwatch")
let cloudwatch = new CloudWatchClient({ region: "us-east-1" })

let item // "item" in the PostMan sense
let iterationData = []

module.exports = function (newman){
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
    // get dimension data

    // something like dev-a or dev-a-mercy, where we just want to
    // pull the env and podd info
    const myEnv = process.env.CLUSTER || process.env.POSTMAN_ENVIRONMENT

    if(! myEnv){
      console.error("CLUSTER not set")
      console.error("POSTMAN_ENVIRONMENT not set")
      return
    }

    const env = myEnv.split("-")[0]
    const pod = myEnv.split("-")[1]
    const dims = [
      {
        Name: "Env",
        Value: env
      }, {
        Name: "Pod",
        Value: pod
      }
    ];

    const metric = {
      MetricData: [
        {
          MetricName: "ResponseTime",
          Dimensions: dims,
          Timestamp: new Date(),
          Unit: "Milliseconds",
          Value: iterationData.reduce((acc, postmanResult) => acc + postmanResult.responseTime || 0, 0)
        },
        {
          MetricName: "FailedAssertions",
          Dimensions: dims,
          Timestamp: new Date(),
          Unit: "Count",
          Value: iterationData.reduce((acc, postmanResult) => acc + (postmanResult?.failed?.length || 0), 0)
        },
        {
          MetricName: "PassedAssertions",
          Dimensions: dims,
          Timestamp: new Date(),
          Unit: "Count",
          Value: iterationData.reduce((acc, postmanResult) => acc + (postmanResult?.executed?.length || 0), 0)
        }
      ],
      Namespace: "PostmanCanaries"
    }
    console.log(JSON.stringify(metric))

    cloudwatch.send(new PutMetricDataCommand(metric), (err) => {
      if (err) {
        console.error(err, err.stack);
        process.exitCode = 10
      } else {
        // successful response
      }
    })
  })
}
