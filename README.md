# Newman JSON Stats Reporter

Dumps detailed statistics as json.

## Requirements

* npm
* newman

## Usage

If newman is installed globally, you'll need to install the module globally.

```sh
npm i -g newman
npm i -g @tmclnk/newman-reporter-json-stats
newman run https://raw.githubusercontent.com/tmclnk/newman-reporter-json-stats/master/examples/cloudwatch-example.postman_collection.json \
  --reporters cli,@tmclnk/json-stats
```

## Rationale - Continuous Testing

Postman is great for quickly writing tests against API's. It lets us centralize
authentication logic, seamlessly handles cookies, has built-in testing, and
good support for externalizing Environment variables.

So good, in fact, that we sometimes want to just put our assertions on blast so that
we quickly know if they are failing, or if we have something misconfigured.

We can use the Postman tests we are writing anyway to act as a rudimentary integration
test. Something between the unit tests and the functional tests written by QA.

## Related Links

* [newman-reporter-json-stats node module](https://www.npmjs.com/package/@tmclnk/newman-reporter-json-stats)
* [Postman](https://www.postman.com/)
* [newman](https://github.com/postmanlabs/newman)
* [newman-reporter-html](https://github.com/postmanlabs/newman-reporter-html)
* [semantic-release](https://github.com/semantic-release/semantic-release)
