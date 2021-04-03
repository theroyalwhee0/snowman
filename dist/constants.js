"use strict";
/**
 * @file Snowman constants.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2021 Adam Mill
 * @license Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_ID = exports.MAX_SEQUENCE = exports.MAX_NODE = exports.MAX_TIMESTAMP = exports.MIN_SEQUENCE = exports.MIN_ID = exports.MIN_NODE = exports.MIN_TIMESTAMP = exports.RESERVED = exports.OFFSET_SEQUENCE = exports.OFFSET_NODE = exports.OFFSET_TIMESTAMP = exports.OFFSET_RESERVED = exports.MASK_SEQUENCE = exports.MASK_NODE = exports.MASK_TIMESTAMP = exports.MASK_RESERVED = exports.MASK_ID = exports.DEFAULT_OFFSET = void 0;
/**
 * Constants.
 * @private
 */
exports.DEFAULT_OFFSET = 1577836800000; // 2020-01-01T00:00:00+00:00
exports.MASK_ID = 0x7fffffffffffffffn;
exports.MASK_RESERVED = 0x8000000000000000n; // 1 = 1
exports.MASK_TIMESTAMP = 0x7fffffffff800000n; // 7+8+8+8+8+1 = 40
exports.MASK_NODE = 0x00000000007fe000n; // 7+3 = 10
exports.MASK_SEQUENCE = 0x0000000000001fffn; // 5+8 = 13
exports.OFFSET_RESERVED = 39n;
exports.OFFSET_TIMESTAMP = 23n;
exports.OFFSET_NODE = 13n;
exports.OFFSET_SEQUENCE = 0n;
exports.RESERVED = 0; // Reserved may only be zero.
exports.MIN_TIMESTAMP = 1; // 0 = offset time
exports.MIN_NODE = 0n;
exports.MIN_ID = 0;
exports.MIN_SEQUENCE = 0n;
exports.MAX_TIMESTAMP = 1099511627775; // 2**40-1, ~34.8 years
exports.MAX_NODE = 1023n; // 2**10-1
exports.MAX_SEQUENCE = 8191; // 2**13-1
exports.MAX_ID = 9223372036854775807n; // 2n**63n-1n
//# sourceMappingURL=constants.js.map