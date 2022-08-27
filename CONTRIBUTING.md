# Contributing

## Development

```shell
# install dependencies
npm i

# link the module into newman's node_modules
npm run local-dev

# call a test collection
npm test
```

If you update dependencies, you must re-run `npm run local-dev`.

## Commit Messages

Use https://www.conventionalcommits.org/en/v1.0.0/.

The commit contains the following structural elements, to communicate intent to the consumers of your library:

* `fix:` a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
* `feat:` a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
* BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.


## Release

The [semantic-release] plugin will make a new github release and upload the package to npm.

You'll need to be logged into npm and have a github token.

```shell
# interactive npm login
npm login
```

```shell
export GH_TOKEN=YOUR_GITHUB_TOKEN
```

```
npx semantic-release --no-ci
```

## Troubleshooting

If the release plugin fails to upload to the npm registry, 
make sure two-factor auth is `auth-only`. You can check this with `npm profile get`.

## Related Links

* [newman-reporter-json-stats node module](https://www.npmjs.com/package/@tmclnk/newman-reporter-json-stats)
* [newman](https://github.com/postmanlabs/newman)
* [newman-reporter-html](https://github.com/postmanlabs/newman-reporter-html)
* [semantic-release](https://github.com/semantic-release/semantic-release)

[semantic-release]: https://github.com/semantic-release/semantic-release