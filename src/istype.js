/**
 * @theroyalwhee0/snowman:src/istype.js
 *
 * TODO: Move to @theroyalwhee0/istype
 */

/**
 * Is the type a BigInt.
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
