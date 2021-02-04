/**
 * @file Is-Type utilities.
 * @author Adam Mill <hismajesty@theroyalwhee.com>
 * @copyright Copyright 2021 Adam MillS
 * @license Apache-2.0
 */

// TODO: Move to @theroyalwhee0/istype

/**
 * Is the type a BigInt.
 * @param {any} value The value to check type of.
 * @returns {boolean} Is value a bigint?
 * @private
 */
function isBigInt(value) {
  return typeof value === 'bigint';
}

/**
 * Exports.
 */
module.exports = {
  isBigInt,
};
