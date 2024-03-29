# @theroyalwhee0/snowman

## Description
A distributed unique 64 bit ID generator. Inspired by Sony's Sonyflake and Twitter's Snowflake.


## Installation
`npm install @theroyalwhee0/snowman`

*or*

`yarn add @theroyalwhee0/snowman`


## Documentation
The idSequence() function creates a iterable sequence of IDs. The explodeId() function breaks the ID into it's parts and validates it.

[API Documentation](https://theroyalwhee0.github.io/snowman/)


## Usage
```
const { idSequence, explodeId } = require('@theroyalwhee0/snowman');
const accountIds = idSequence();
const { value } = accountIds.next();
const [ timestamp, node, sequence, isValid ] = explodeId(value);
console.log("ID: ", value);
console.log("Parts: ", { timestamp, node, sequence, isValid });
console.log("Timestamp Date: ", new Date(timestamp));
```


## Testing.
Running ```npm run test``` will run the test suite under Mocha. Running ```npm run test-watch``` will run the test suite in watch mode.


## Bit Layout
- 00-00 (01) = Reserved.
- 01-40 (40) = MS Timestamp (~34.8 years)
- 41-51 (10) = Node (1024)
- 52-64 (13) = Sequence (8192)


## References
- https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake.html
- https://github.com/sony/sonyflake


## Links
- GitHub: https://github.com/theroyalwhee0/snowman
- NPM: https://www.npmjs.com/package/@theroyalwhee0/snowman


## History
- v1.0.0 - 2022-06-02
  - Bump depends for security.
- v0.0.8 - 2021-04-02
  - Port to TypeScript.
  - Deprecate options.as, use idStringSequence instead.
  - Add string support to explodeId.
  - Improve tests.
- v0.0.7 - 2021-02-20
  - Add support for automatic casting as string.
- v0.0.6 - 2021-02-14
  - Remove date from documentation.
  - Bump istype version.
- v0.0.5 - 2021-02-06
  - Upgrade istype and remove package specific isBigInt.
- v0.0.4 - 2021-02-04
  - Add documentation.
  - Remove unused dev depends.
- v0.0.3 - 2021-01-29
  - Fix error messaging.
  - Add support for singleNode generators.
  - Improve comments.
- v0.0.2 - 2021-01-07
  - Change explode to explodeId, alias to explode.
- v0.0.1 - 2021-01-03
  - Initial release.


## Legal & License
Copyright 2020-2021 Adam Mill

This library is released under Apache 2 license. See [LICENSE](https://github.com/theroyalwhee0/snowman/blob/master/LICENSE) for more details.
