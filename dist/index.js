"use strict";
/**
 * @file Snowman ID Generator
 * @version v0.0.8
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2021 Adam Mill
 * @license Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.explode = exports.explodeId = exports.idStringSequence = exports.idSequence = exports.CastAs = void 0;
/**
 * Bits:
 * 00-00 (01) = Reserved.
 * 01-40 (40) = MS Timestamp (~34.8 years)
 * 41-51 (10) = Node (1024)
 * 52-64 (13) = Sequence (8192)
 */
/**
 * Imports.
 * @private
 */
const istype_1 = require("@theroyalwhee0/istype");
const constants_js_1 = require("./constants.js");
/**
 * Default Options.
 * @private
 */
const defaultOptions = {
    node: 0,
    offset: constants_js_1.DEFAULT_OFFSET,
    getTimestamp: Date.now,
};
/**
 * Types.
 * @deprecated
 */
var CastAs;
(function (CastAs) {
    CastAs["string"] = "string";
    CastAs["bigint"] = "bigint";
})(CastAs = exports.CastAs || (exports.CastAs = {}));
/**
 * ID Sequence generator.
 * @generator
 * @param {object} options Options, optional.
 * @param {number} options.node The numeric ID of the node (0-1023).
 * @param {number} options.offset The timestamp offset to use as zero time.
 * @param {'string'|'bigint'} options.as Deprecated: Cast generated ID. Defaults to bigint.
 * @param {function} options.getTimestamp A function that returns the current MS timestamp.
 * @param {boolean} options.singleNode Turn into a single node instance automatically populating node as sequence wraps.
 * @yields {bigint} The resulting ID.
 */
function* idSequence(options) {
    options = Object.assign({}, defaultOptions, options);
    const { as, node: nodeOpt, offset, getTimestamp, singleNode } = options;
    let seq = constants_js_1.MIN_SEQUENCE;
    let lastTimestamp;
    // NOTE: singleNode instances start at MAX_NODE and count down.
    let node = singleNode === true ? constants_js_1.MAX_NODE : BigInt(nodeOpt);
    while (1) {
        const now = getTimestamp();
        const timestamp = BigInt(now - offset);
        if (lastTimestamp !== timestamp) {
            seq = constants_js_1.MIN_SEQUENCE;
            lastTimestamp = timestamp;
            if (singleNode) {
                node = constants_js_1.MAX_NODE;
            }
        }
        const id = 0n +
            ((timestamp << constants_js_1.OFFSET_TIMESTAMP) & constants_js_1.MASK_TIMESTAMP) |
            ((node << constants_js_1.OFFSET_NODE) & constants_js_1.MASK_NODE) |
            ((seq << constants_js_1.OFFSET_SEQUENCE) & constants_js_1.MASK_SEQUENCE);
        if (timestamp < constants_js_1.MIN_TIMESTAMP || timestamp > constants_js_1.MAX_TIMESTAMP) {
            throw new Error(`Timestamp "${timestamp}" out of range."`);
        }
        else if (node < constants_js_1.MIN_NODE || node > constants_js_1.MAX_NODE) {
            throw new Error(`Node "${node}" is out of range.`);
        }
        else if (seq < constants_js_1.MIN_SEQUENCE || seq > constants_js_1.MAX_SEQUENCE) {
            throw new Error(`Sequence number "${seq}" is out of range.`);
        }
        else if (id < constants_js_1.MIN_ID || id > constants_js_1.MAX_ID) {
            throw new Error(`ID "${id}" is out of range.`);
        }
        if (as === CastAs.string) {
            yield '' + id;
        }
        else {
            yield id;
        }
        seq += 1n;
        if (singleNode && seq > constants_js_1.MAX_SEQUENCE) {
            node -= 1n;
            seq = constants_js_1.MIN_SEQUENCE;
        }
    }
    return;
}
exports.idSequence = idSequence;
/**
 * ID Sequence generator yielding strings instead of bigints.
 * @generator
 * @param {object} options Options, optional.
 * @param {number} options.node The numeric ID of the node (0-1023).
 * @param {number} options.offset The timestamp offset to use as zero time.
 * @param {function} options.getTimestamp A function that returns the current MS timestamp.
 * @param {boolean} options.singleNode Turn into a single node instance automatically populating node as sequence wraps.
 * @yields {string} The resulting ID as a string.
 */
function* idStringSequence(options) {
    options = options || {};
    const sequence = idSequence(options);
    while (1) {
        const { value } = sequence.next();
        yield '' + value;
    }
    return;
}
exports.idStringSequence = idStringSequence;
/**
 * Explode an ID into parts and valid flag,
 * @param {bigint|number|string} id An ID to explode and validate.
 * @param {object} options Options, optional.
 * @param {number} options.offset The timestamp offset to use as zero time.
 * @returns {array} Tuple of unix timestamp, node ID,
 * sequence ID, and valid. If invalid the numbers will be undefined.
 */
function explodeId(id, options) {
    options = Object.assign({}, defaultOptions, options);
    const { offset } = options;
    if (istype_1.isString(id) && /^[1-9][0-9]*$/.test(id)) {
        id = BigInt(id);
    }
    if (istype_1.isInteger(id)) {
        id = BigInt(id);
    }
    if (istype_1.isBigInt(id)) {
        const reserved = Number((id & constants_js_1.MASK_RESERVED) >> constants_js_1.OFFSET_RESERVED);
        const timestamp = Number((id & constants_js_1.MASK_TIMESTAMP) >> constants_js_1.OFFSET_TIMESTAMP);
        const node = Number((id & constants_js_1.MASK_NODE) >> constants_js_1.OFFSET_NODE);
        const sequence = Number((id & constants_js_1.MASK_SEQUENCE) >> constants_js_1.OFFSET_SEQUENCE);
        const isValid = reserved === constants_js_1.RESERVED &&
            (id >= constants_js_1.MIN_ID && id <= constants_js_1.MAX_ID) &&
            (timestamp >= constants_js_1.MIN_TIMESTAMP && timestamp <= constants_js_1.MAX_TIMESTAMP) &&
            (node >= constants_js_1.MIN_NODE && node <= constants_js_1.MAX_NODE) &&
            (sequence >= constants_js_1.MIN_SEQUENCE && sequence <= constants_js_1.MAX_SEQUENCE);
        const unixTimestamp = timestamp + offset;
        if (isValid) {
            return [unixTimestamp, node, sequence, true];
        }
    }
    return [undefined, undefined, undefined, false];
}
exports.explodeId = explodeId;
/**
 * Explode an ID into parts and valid flag,
 * @deprecated Use explodeId function instead.
 * @function explode
 * @param {any} id An ID to explode and validate.
 * @param {object} options Options, optional.
 * @param {number} options.offset The timestamp offset to use as zero time.
 * @returns {array} Tuple of unix timestamp, node ID,
 * sequence ID, and valid. If invalid the numbers will be undefined.
 */
exports.explode = explodeId;
//# sourceMappingURL=index.js.map