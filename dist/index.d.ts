/**
 * @file Snowman ID Generator
 * @version v0.0.8
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2021 Adam Mill
 * @license Apache-2.0
 */
/**
 * Types.
 * @deprecated
 */
export declare enum CastAs {
    string = "string",
    bigint = "bigint"
}
export declare type SequenceOptions = {
    node?: number;
    offset?: number;
    as?: CastAs;
    getTimestamp?: () => number;
    singleNode?: boolean;
};
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
export declare function idSequence(options?: SequenceOptions): Generator<bigint | string, bigint | string, void>;
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
export declare function idStringSequence(options?: SequenceOptions): Generator<string, string, void>;
/**
 * Explode an ID into parts and valid flag,
 * @param {bigint|number|string} id An ID to explode and validate.
 * @param {object} options Options, optional.
 * @param {number} options.offset The timestamp offset to use as zero time.
 * @returns {array} Tuple of unix timestamp, node ID,
 * sequence ID, and valid. If invalid the numbers will be undefined.
 */
export declare function explodeId(id: bigint | number | string, options?: SequenceOptions): [number, number, number, boolean];
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
export declare const explode: typeof explodeId;
