# @theroyalwhee0/snowman

A distributed unique 64 bit ID generator. Inspired by Sony's Sonyflake and Twitter's Snowflake.


## Documentation
There is no documentation at the moment. The idSequence function creates a iterable sequence of IDs.


## Usage
```
const { idSequence, explode } = require('@theroyalwhee0/snowman');
const accountIds = idSequence();
const { value } = accountIds.next();
const [ timestamp, node, sequence, isValid ] = explode(value);
console.log("ID: ", value);
console.log("Parts: ", { timestamp, node, sequence, isValid });
console.log("Timestamp Date: ", new Date(timestamp));
```


## Tests
```npm run test```


## Bit Layout
- 00-00 (01) = Reserved.
- 01-40 (40) = Timestamp (~34.8 years)
- 41-51 (10) = Node (1024)
- 52-64 (13) = Sequence (8192)


## References
- https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake.html
- https://github.com/sony/sonyflake


## Change Log
- 2021-01-03 v0.0.1 - Initial release.
