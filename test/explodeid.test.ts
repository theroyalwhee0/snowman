import { DEFAULT_OFFSET, MAX_NODE, MAX_SEQUENCE, MAX_TIMESTAMP } from '../src/constants.js';
import { explodeId, explode } from '../src/index.js';

const MAX_NODE_NUM = Number(MAX_NODE);

test('explodeId should be a function', () => {
  expect(explodeId).toBeLike('function');
  expect(explodeId.length).toBe(2);
  expect(explodeId.name).toBe('explodeId');
});

test('explodeId should be aliased to explode', () => {
  expect(explode).toBe(explodeId);
});

test('explodeId should handle valid values like id "266746406522281985n"', () => {
  const results = explodeId(266746406522281985n);
  expect(results).toBeLike('array');
  expect(results.length).toBe(4);
  expect(results).toEqual([1609635449611, 763, 1, true]);
});

test('explodeId should handle valid values like id "181193933807616"', () => {
  const results = explodeId(181193933807616n);
  expect(results).toBeLike('array');
  expect(results.length).toBe(4);
  expect(results).toEqual([1577858400000, 123, 0, true]);
});

test('explodeId should handle valid values like id "181193933808615n"', () => {
  const results = explodeId(181193933808615n);
  expect(results).toEqual([1577858400000, 123, 999, true]);
});

test('explodeId should handle values with maximum value', () => {
  const id = BigInt(0x7FFFFFFFFFFFFFFFn); // NOTE: This matches MASK_ID.
  const results = explodeId(id);
  expect(results).toEqual([
    MAX_TIMESTAMP + DEFAULT_OFFSET,
    MAX_NODE_NUM,
    MAX_SEQUENCE,
    true,
  ]);
});

test('explodeId should handle values that are valid numbers', () => {
  const results = explodeId(181193933807616); // Note: This is not a bigint.
  expect(results).toBeLike('array');
  expect(results.length).toBe(4);
  expect(results).toEqual([1577858400000, 123, 0, true]);
});

test('explodeId should handle values that are valid string', () => {
  const results = explodeId("181193933807616"); // Note: This is not a bigint.
  expect(results).toBeLike('array');
  expect(results.length).toBe(4);
  expect(results).toEqual([1577858400000, 123, 0, true]);
});


test('explodeId should handle invalid values like id "0"', () => {
  // NOTE: ID 0 is never valid because it's timestamp would be zero which is not valid.
  const results = explodeId(0);
  expect(results).toBeLike('array');
  expect(results.length).toBe(4);
  expect(results).toEqual([undefined, undefined, undefined, false]);
});

test('explodeId should handle invalid values like id "-1000"', () => {
  // Negative values are invalid.
  const results = explodeId(-1000);
  expect(results).toBeLike('array');
  expect(results.length).toBe(4);
  expect(results).toEqual([undefined, undefined, undefined, false]);
});

test('explodeId should handle invalid values like id "invalid"', () => {
  // This is an invalid string.
  const results = explodeId('invalid');
  expect(results).toBeLike('array');
  expect(results.length).toBe(4);
  expect(results).toEqual([undefined, undefined, undefined, false]);
});

test('explodeId should handle invalid values like id "true"', () => {
  // Other types are invalid.
  const results = explodeId(<bigint><unknown>true);
  expect(results).toBeLike('array');
  expect(results.length).toBe(4);
  expect(results).toEqual([undefined, undefined, undefined, false]);
});
