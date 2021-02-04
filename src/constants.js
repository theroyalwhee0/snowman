/**
 * @file Snowman constants.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2021 Adam Mill
 * @license Apache-2.0
 */

/**
 * Constants.
 * @private
 */
const DEFAULT_OFFSET    = 1577836800000;              // 2020-01-01T00:00:00+00:00
const MASK_ID           = 0x7FFFFFFFFFFFFFFFn;
const MASK_RESERVED     = 0x8000000000000000n;        // 1 = 1
const MASK_TIMESTAMP    = 0x7FFFFFFFFF800000n;        // 7+8+8+8+8+1 = 40
const MASK_NODE         = 0x00000000007FE000n;        // 7+3 = 10
const MASK_SEQUENCE     = 0x0000000000001FFFn;        // 5+8 = 13
const OFFSET_RESERVED   = 39n;
const OFFSET_TIMESTAMP  = 23n;
const OFFSET_NODE       = 13n;
const OFFSET_SEQUENCE   = 0n;
const RESERVED          = 0;                          // Reserved may only be zero.
const MIN_TIMESTAMP     = 1;                          // 0 = offset time
const MIN_NODE          = 0n;
const MIN_ID            = 0;
const MIN_SEQUENCE      = 0n;
const MAX_TIMESTAMP     = 1099511627775;              // 2**40-1, ~34.8 years
const MAX_NODE          = 1023n;                      // 2**10-1
const MAX_SEQUENCE      = 8191;                       // 2**13-1
const MAX_ID            = 9223372036854775807n;       // 2n**63n-1n

/**
 * Exports.
 */
module.exports = {
  DEFAULT_OFFSET,
  OFFSET_RESERVED, OFFSET_TIMESTAMP, OFFSET_NODE, OFFSET_SEQUENCE,
  MASK_ID, MASK_RESERVED, MASK_TIMESTAMP, MASK_NODE, MASK_SEQUENCE,
  RESERVED,
  MIN_ID, MIN_TIMESTAMP, MIN_NODE, MIN_SEQUENCE,
  MAX_ID, MAX_TIMESTAMP, MAX_NODE, MAX_SEQUENCE,
};
