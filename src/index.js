/**
 * @theroyalwhee0/snowman:src/index.js
 *
 * Bits:
 * 00-00 (01) = Reserved.
 * 01-40 (40) = Timestamp (~34.8 years)
 * 41-51 (10) = Node (1024)
 * 52-64 (13) = Sequence (8192)
 */

/**
 * Imports.
 */
const { isInteger } = require('@theroyalwhee0/istype');
const { isBigInt } = require('./istype');
const {
  DEFAULT_OFFSET,
  OFFSET_RESERVED, OFFSET_TIMESTAMP, OFFSET_NODE, OFFSET_SEQUENCE,
  MASK_RESERVED, MASK_TIMESTAMP, MASK_NODE, MASK_SEQUENCE,
  MIN_ID, MIN_TIMESTAMP, MIN_NODE, MIN_SEQUENCE,
  MAX_ID, MAX_TIMESTAMP, MAX_NODE, MAX_SEQUENCE,
} = require('./constants');

/**
 * Default Options.
 */
const defaultOptions = {
  node: 0,
  offset: DEFAULT_OFFSET,
  getTimestamp: Date.now,
};

/**
 * ID Sequence generator.
 */
function* idSequence(options) {
  options = Object.assign({}, defaultOptions, options);
  const { node:nodeOpt, offset, getTimestamp } = options;
  let seq = 0n;
  let lastTimestamp;
  const node = BigInt(nodeOpt);
  if(node < MIN_NODE || node > MAX_NODE) {
    throw new Error(`Node "$(node)" is out of range.`);
  }
  while(1) {
    const now = getTimestamp();
    const timestamp = BigInt(now-offset);
    if(lastTimestamp !== timestamp) {
      seq = 0n;
      lastTimestamp = timestamp;
    }
    const id =
      ((timestamp << OFFSET_TIMESTAMP) & MASK_TIMESTAMP) |
      ((node << OFFSET_NODE) & MASK_NODE) |
      ((seq << OFFSET_SEQUENCE) & MASK_SEQUENCE)
    ;
    if(timestamp < MIN_TIMESTAMP || timestamp > MAX_TIMESTAMP) {
      throw new Error(`Timestamp "${timestamp}" out of range."`);
    } else if(seq < MIN_SEQUENCE || seq > MAX_SEQUENCE) {
      throw new Error(`Sequence number "$(seq)" is out of range.`);
    } else if(id < MIN_ID || id > MAX_ID) {
      throw new Error(`ID "$(id)" is out of range.`);
    }
    yield id;
    seq += 1n;
  }
}

/**
 * Explode an ID into parts and valid flag,
 */
function explodeId(id, options) {
  options = Object.assign({}, defaultOptions, options);
  const { offset } = options;
  if(isInteger(id)) {
    id = BigInt(id);
  }
  if(isBigInt(id)) {
    const reserved = Number((id & MASK_RESERVED) >> OFFSET_RESERVED);
    const timestamp = Number((id & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
    const node = Number((id & MASK_NODE) >> OFFSET_NODE);
    const sequence = Number((id & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
    const isValid = reserved === 0 &&
      (id >= MIN_ID && id <= MAX_ID) &&
      (timestamp >= MIN_TIMESTAMP && timestamp <= MAX_TIMESTAMP) &&
      (node >= MIN_NODE && node <= MAX_NODE) &&
      (sequence >= MIN_SEQUENCE && sequence <= MAX_SEQUENCE)
    ;
    const unixTimestamp = timestamp+offset;
    if(isValid) {
      return [ unixTimestamp, node, sequence, true ];
    }
  }
  return [ undefined, undefined, undefined, false ];
}

/**
 * Exports.
 */
module.exports = {
  idSequence,
  explodeId,
  explode: explodeId,
};
