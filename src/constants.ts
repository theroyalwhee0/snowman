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
export const DEFAULT_OFFSET    = 1577836800000;              // 2020-01-01T00:00:00+00:00
export const MASK_ID           = 0x7FFFFFFFFFFFFFFFn;
export const MASK_RESERVED     = 0x8000000000000000n;        // 1 = 1
export const MASK_TIMESTAMP    = 0x7FFFFFFFFF800000n;        // 7+8+8+8+8+1 = 40
export const MASK_NODE         = 0x00000000007FE000n;        // 7+3 = 10
export const MASK_SEQUENCE     = 0x0000000000001FFFn;        // 5+8 = 13
export const OFFSET_RESERVED   = 39n;
export const OFFSET_TIMESTAMP  = 23n;
export const OFFSET_NODE       = 13n;
export const OFFSET_SEQUENCE   = 0n;
export const RESERVED          = 0;                          // Reserved may only be zero.
export const MIN_TIMESTAMP     = 1;                          // 0 = offset time
export const MIN_NODE          = 0n;
export const MIN_ID            = 0;
export const MIN_SEQUENCE      = 0n;
export const MAX_TIMESTAMP     = 1099511627775;              // 2**40-1, ~34.8 years
export const MAX_NODE          = 1023n;                      // 2**10-1
export const MAX_SEQUENCE      = 8191;                       // 2**13-1
export const MAX_ID            = 9223372036854775807n;       // 2n**63n-1n
