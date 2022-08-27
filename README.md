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
  --reporters @tmclnk/json-stats --verbose
```

Note that the `--verbose` flag is REQUIRED.

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
      "start": 1661614275544,
      "requestStart": 1661614275554,
      "offset": {
        "request": 10.167584002017975,
        "socket": 13.681499987840652,
        "lookup": 15.907375007867813,
        "connect": 37.22204199433327,
        "secureConnect": 73.76374998688698,
        "response": 134.60854199528694,
        "end": 142.72445899248123,
        "done": 147.13712498545647
      },
      "phases": {
        "prepare": 10.167584002017975,
        "wait": 3.5139159858226776,
        "dns": 2.2258750200271606,
        "tcp": 21.314666986465454,
        "firstByte": 60.84479200839996,
        "download": 8.11591699719429,
        "process": 4.412665992975235,
        "total": 147.13712498545647,
        "secureHandshake": 36.54170799255371
      }
    }
  }
]
```

Units are milliseconds, bytes, or epoch milliseconds.

- `timing.offset` is milliseconds from the start of the request
- `timing.phases` is milliseconds of each phase

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
