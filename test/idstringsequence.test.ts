import { MASK_NODE, MASK_RESERVED, MASK_SEQUENCE, MASK_TIMESTAMP, MAX_NODE, MAX_SEQUENCE, MAX_TIMESTAMP, MIN_SEQUENCE, OFFSET_NODE, OFFSET_RESERVED, OFFSET_SEQUENCE, OFFSET_TIMESTAMP, RESERVED } from '../src/constants.js';
import { idStringSequence } from '../src/index';

const MAX_NODE_NUM = Number(MAX_NODE);

test('idStringSequence should be a function', () => {
  expect(idStringSequence).toBeInstanceOf(Function);
  expect(idStringSequence.length).toBe(1);
});

test('idStringSequence should create an iterator', () => {
  const it = idStringSequence();
  expect(it[Symbol.iterator]).toBeInstanceOf(Function);
  const results = it.next();
  expect(results).toBeLike('object');
});

test('idStringSequence should create generate an id', () => {
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const it = idStringSequence({
    node: 123,
    getTimestamp: () => (1577836800000 + SIX_HOURS),
  });
  const { value, done } = it.next();
  expect(value).toBeLike('string');
  expect(value).toMatch(/^[1-9][0-9]*$/);
  expect(done).toBe(false);
  if (typeof value === 'string') {
    const number = BigInt(value);
    const reserved = Number((number & MASK_RESERVED) >> OFFSET_RESERVED);
    expect(reserved).toBe(RESERVED);
    const ts = Number((number & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
    expect(ts).toBeGreaterThanOrEqual(0);
    expect(ts).toBeLessThanOrEqual(MAX_TIMESTAMP);
    expect(ts).toBe(SIX_HOURS);
    const node = Number((number & MASK_NODE) >> OFFSET_NODE);
    expect(node).toBeGreaterThanOrEqual(0);
    expect(node).toBeLessThanOrEqual(MAX_NODE_NUM);
    expect(node).toBe(123);
    const seq = Number((number & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
    expect(seq).toBeGreaterThanOrEqual(0);
    expect(seq).toBeLessThanOrEqual(MAX_SEQUENCE);
    expect(seq).toBe(0);
  } else {
    fail('"value" should be a string');
  }
});
