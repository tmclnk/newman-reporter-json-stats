# Newman JSON Stats Reporter

Dumps detailed statistics as json.

## Requirements

* [npm](https://docs.npmjs.com/cli/v8/configuring-npm/install)

## Usage

Install newman and the reporter module.

```shell
npm i -g newman
npm i -g @tmclnk/newman-reporter-json-stats
```

Once installed, you can use `@tmclnk/json-stats` like any other reporter, e.g.

```shell
newman run https://raw.githubusercontent.com/tmclnk/newman-reporter-json-stats/main/examples/postman_collection.json \
  --reporters @tmclnk/json-stats
```

## Output

```json
[
  {
    "url": "https://www.devobsessed.com/",
    "method": "GET",
    "requestSize": 231,
    "responseSize": 19548,
    "statusCode": 200,
    "timing": {
      "start": 1661583902671,
      "requestStart": 1661583902682,
      "offset": {
        "request": 10.838917002081871,
        "socket": 11.538708999752998,
        "lookup": 20.740125000476837,
        "connect": 40.270417004823685,
        "secureConnect": 77.32091699540615,
        "response": 198.68083399534225,
        "end": 204.9380419999361,
        "done": 206.72300000488758
      }
    },
    "timingPhases": {
      "prepare": 10.838917002081871,
      "wait": 0.6997919976711273,
      "dns": 9.201416000723839,
      "tcp": 19.530292004346848,
      "firstByte": 121.3599169999361,
      "download": 6.257208004593849,
      "process": 1.784958004951477,
      "total": 206.72300000488758,
      "secureHandshake": 37.050499990582466
    }
  }
]
```

Units are milliseconds, bytes, or epoch milliseconds.

- `offset` is milliseconds from the start of the request
- `timingPhases` is milliseconds of each phase

## Rationale - Continuous Testing

Postman is great for quickly writing tests against API's. It lets us centralize
authentication logic, seamlessly handles cookies, has built-in testing, and
good support for externalizing Environment variables.

So good, in fact, that we sometimes want to just put our assertions on blast so that
we quickly know if they are failing, or if we have something misconfigured.

We can use the Postman tests we are writing anyway to act as a rudimentary integration
test. Something between the unit tests and the functional tests written by QA.

## Troubleshooting

```sh
newman: could not find "@tmclnk/json-stats" reporter
ensure that the reporter is installed in the same directory as newman
please install reporter using npm
```

If you get the above error, and you installed newman using a package
manager (brew, apt, yum, chocolatey), you may need to uninstall newman and re-install
using npm.

```shell
npm i -g newman
```

## Related Links

* [@tmclnk/json-stats](https://www.npmjs.com/package/@tmclnk/newman-reporter-json-stats)
* [postman](https://www.postman.com/)
* [newman](https://github.com/postmanlabs/newman)
