# Amazon CloudWatch Metrics Reporter

This package will export Amazon CloudWatch metrics. There will
be 3 metrics:

| Metric Name | Description |
|-|-|
| PassedAssertions | Number of passed ChaiJS assertions in the Collection |
| FaildAssertions | Number of failed ChaiJS assertions in the Collection |
| ResponseTime | Overall response time for the Collection |

These will be reported on a per-collection-run basis.

You can specify arbitrary dimensions for your metrics using any number of
`--reporter-cloudwatch-metrics-dimension=MyDimension` params.

## Requirements

* AWS Credentials
* newman

## Rationale - Continuous Testing

Postman is great for quickly writing tests against API's. It lets us centralize
authentication logic, seamlessly handles cookies, has built-in testing, and
good support for externalizing Environment variables.

So good, in fact, that we sometimes want to just put our assertions on blast so that
we quickly know if they are failing, or if we have something misconfigured. We already
use CloudWatch Alarms to detect performance issues, so why not go one level higher
and start continuously testing?

We can use the Postman tests we are writing anyway to act as a rudimentary integration
test. Something between the unit tests and the functional tests written by QA.

## Usage

If newman is installed globally, you'll need to install the module globally.

```sh
npm -i -g @tmclnk/postman-report-cloudwatch-metrics newman
newman run examples/cloudwatch-example.postman_collection.json --reporters @tmclnk/cloudwatch-metrics
```

### Specifying Metric Dimensions

You can add arbitrary dimensions to the output using `--reporter-cloudwatch-metrics-dimension-<dimension-name>`.
Any dashes in the name will be removed an the exported metric name will be CamelCased.

```sh
newman run examples/cloudwatch-example.postman_collection.json \
  --reporters @tmclnk/cloudwatch-metrics \
  --reporter-cloudwatch-metrics-dimension-environment=dev \
  --reporter cloudwatch-metrics-dimension-pod=a
```

Think carefully when specifying dimensions! They will very quickly pollute your
CloudWatch Metrics namespace, and they can't be removed. Additionally, you will be billed
by AWS on a per-metric basis, so being very fine grained could increase your AWS costs.

### AWS Credentials

We are using the AWS Javascript SDK, so any form of credential recognized there will
be recognized from newman as well. I have successfully tested using `~/.aws/credentials`,
`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`, and ECS Task Roles.

## Related Links

* [newman-reporter-cloudwatch-metrics node module](https://www.npmjs.com/package/@tmclnk/newman-reporter-cloudwatch-metrics)
* [Postman](https://www.postman.com/)
* [newman](https://github.com/postmanlabs/newman)
* [newman-reporter-html](https://github.com/postmanlabs/newman-reporter-html)
* [Amazon CloudWatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)
* [semantic-release](https://github.com/semantic-release/semantic-release)
