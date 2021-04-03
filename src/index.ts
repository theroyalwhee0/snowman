/**
 * @file Snowman ID Generator
 * @version v0.0.8
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2021 Adam Mill
 * @license Apache-2.0
 */

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
import { isBigInt, isInteger, isString } from '@theroyalwhee0/istype';
import {
  DEFAULT_OFFSET,
  OFFSET_RESERVED, OFFSET_TIMESTAMP, OFFSET_NODE, OFFSET_SEQUENCE,
  MASK_RESERVED, MASK_TIMESTAMP, MASK_NODE, MASK_SEQUENCE,
  RESERVED,
  MIN_ID, MIN_TIMESTAMP, MIN_NODE, MIN_SEQUENCE,
  MAX_ID, MAX_TIMESTAMP, MAX_NODE, MAX_SEQUENCE,
} from './constants.js';

/**
 * Default Options.
 * @private
 */
const defaultOptions = {
  node: 0,
  offset: DEFAULT_OFFSET,
  getTimestamp: Date.now,
};

/**
 * Types.
 * @deprecated
 */
export enum CastAs {
  string = 'string',
  bigint = 'bigint'
}
export type SequenceOptions = {
  node?: number,
  offset?: number,
  as?: CastAs;
  getTimestamp?: () => number,
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
 export function* idSequence(options?: SequenceOptions): Generator<bigint|string, bigint|string, void> {
  options = Object.assign({}, defaultOptions, options);
  const { as, node: nodeOpt, offset, getTimestamp, singleNode } = options;
  let seq = MIN_SEQUENCE;
  let lastTimestamp;
  // NOTE: singleNode instances start at MAX_NODE and count down.
  let node = singleNode === true ? MAX_NODE : BigInt(nodeOpt);
  while (1) {
    const now = getTimestamp();
    const timestamp = BigInt(now - offset);
    if (lastTimestamp !== timestamp) {
      seq = MIN_SEQUENCE;
      lastTimestamp = timestamp;
      if (singleNode) {
        node = MAX_NODE;
      }
    }
    const id = 0n +
      ((timestamp << OFFSET_TIMESTAMP) & MASK_TIMESTAMP) |
      ((node << OFFSET_NODE) & MASK_NODE) |
      ((seq << OFFSET_SEQUENCE) & MASK_SEQUENCE)
      ;
    if (timestamp < MIN_TIMESTAMP || timestamp > MAX_TIMESTAMP) {
      throw new Error(`Timestamp "${timestamp}" out of range."`);
    } else if (node < MIN_NODE || node > MAX_NODE) {
      throw new Error(`Node "${node}" is out of range.`);
    } else if (seq < MIN_SEQUENCE || seq > MAX_SEQUENCE) {
      throw new Error(`Sequence number "${seq}" is out of range.`);
    } else if (id < MIN_ID || id > MAX_ID) {
      throw new Error(`ID "${id}" is out of range.`);
    }
    if (as === CastAs.string) {
      yield ''+id;
    } else {
      yield id;
    }
    seq += 1n;
    if (singleNode && seq > MAX_SEQUENCE) {
      node -= 1n;
      seq = MIN_SEQUENCE;
    }
  }
  return;
}

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
export function* idStringSequence(options?: SequenceOptions): Generator<string, string, void> {
  options = options || {};
  const sequence = idSequence(options);
  while(1) {
    const { value } = sequence.next();
    yield ''+value;
  }
  return;
}

/**
 * Explode an ID into parts and valid flag,
 * @param {bigint|number|string} id An ID to explode and validate.
 * @param {object} options Options, optional.
 * @param {number} options.offset The timestamp offset to use as zero time.
 * @returns {array} Tuple of unix timestamp, node ID,
 * sequence ID, and valid. If invalid the numbers will be undefined.
 */
export function explodeId(id: bigint | number | string, options?:SequenceOptions): [number, number, number, boolean] {
  options = Object.assign({}, defaultOptions, options);
  const { offset } = options;
  if(isString(id) && /^[1-9][0-9]*$/.test(id)) {
    id = BigInt(id);
  }
  if (isInteger(id)) {
    id = BigInt(id);
  }
  if (isBigInt(id)) {
    const reserved = Number((id & MASK_RESERVED) >> OFFSET_RESERVED);
    const timestamp = Number((id & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
    const node = Number((id & MASK_NODE) >> OFFSET_NODE);
    const sequence = Number((id & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
    const isValid = reserved === RESERVED &&
      (id >= MIN_ID && id <= MAX_ID) &&
      (timestamp >= MIN_TIMESTAMP && timestamp <= MAX_TIMESTAMP) &&
      (node >= MIN_NODE && node <= MAX_NODE) &&
      (sequence >= MIN_SEQUENCE && sequence <= MAX_SEQUENCE)
      ;
    const unixTimestamp = timestamp + offset;
    if (isValid) {
      return [unixTimestamp, node, sequence, true];
    }
  }
  return [undefined, undefined, undefined, false];
}

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
export const explode = explodeId;
