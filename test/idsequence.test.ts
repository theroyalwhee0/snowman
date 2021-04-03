import { MASK_NODE, MASK_RESERVED, MASK_SEQUENCE, MASK_TIMESTAMP, MAX_NODE, MAX_SEQUENCE, MAX_TIMESTAMP, MIN_SEQUENCE, OFFSET_NODE, OFFSET_RESERVED, OFFSET_SEQUENCE, OFFSET_TIMESTAMP, RESERVED } from '../src/constants.js';
import { CastAs, idSequence } from '../src/index';

const MAX_NODE_NUM = Number(MAX_NODE);
const MIN_SEQUENCE_NUM = Number(MIN_SEQUENCE);

test('idSequence should be a function', () => {
  expect(idSequence).toBeInstanceOf(Function);
  expect(idSequence.length).toBe(1);
});

test('idSequence should create an iterator', () => {
  const it = idSequence();
  expect(it[Symbol.iterator]).toBeInstanceOf(Function);
  const results = it.next();
  expect(results).toBeLike('object');
});

test('idSequence should create generate an id', () => {
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const it = idSequence({
    node: 123,
    getTimestamp: () => (1577836800000 + SIX_HOURS),
  });
  const { value, done } = it.next();
  expect(value).toBeLike('bigint');
  expect(done).toBe(false);
  if (typeof value === 'bigint') {
    const reserved = Number((value & MASK_RESERVED) >> OFFSET_RESERVED);
    expect(reserved).toBe(RESERVED);
    const ts = Number((value & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
    expect(ts).toBeGreaterThanOrEqual(0);
    expect(ts).toBeLessThanOrEqual(MAX_TIMESTAMP);
    expect(ts).toBe(SIX_HOURS);
    const node = Number((value & MASK_NODE) >> OFFSET_NODE);
    expect(node).toBeGreaterThanOrEqual(0);
    expect(node).toBeLessThanOrEqual(MAX_NODE_NUM);
    expect(node).toBe(123);
    const seq = Number((value & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
    expect(seq).toBeGreaterThanOrEqual(0);
    expect(seq).toBeLessThanOrEqual(MAX_SEQUENCE);
    expect(seq).toBe(0);
  } else {
    fail('"value" should be a bigint');
  }
});

it('idSequence should generate a sequence of valid ids over time', async () => {
  type Last = {
    value?: bigint,
    node?: number;
    timestamp: number,
    sequence: number,
  };
  const last: Last = {
    value: undefined,
    node: undefined,
    timestamp: 0,
    sequence: 0,
  };
  const generated = new Set();
  const it = idSequence();
  // Loop for more than max sequence.
  for (let idx = 0; idx < MAX_SEQUENCE + 1000; idx++) {
    const { value, done } = it.next();
    if(typeof value !== 'bigint') {
      fail('"value" should be a bigint');
    }
    expect(value).toBeLike('bigint');
    expect(done).toBe(false);
    const reserved = Number((value & MASK_RESERVED) >> OFFSET_RESERVED);
    expect(reserved).toBe(RESERVED);
    const timestamp = Number((value & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
    expect(timestamp).toBeGreaterThanOrEqual(0);
    expect(timestamp).toBeLessThanOrEqual(MAX_TIMESTAMP);
    // Timestamp should rise over time.
    expect(timestamp).toBeGreaterThanOrEqual(last.timestamp);
    const node = Number((value & MASK_NODE) >> OFFSET_NODE);
    expect(node).toBe(0);
    const sequence = Number((value & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
    expect(sequence).toBeGreaterThanOrEqual(0);
    expect(sequence).toBeLessThanOrEqual(MAX_SEQUENCE);
    if (timestamp === last.timestamp) {
      // Sequence should rise within each moment.
      expect(sequence).toBeGreaterThanOrEqual(last.sequence);
    }
    // Should not repeat values.
    expect(generated.has(value)).toBe(false);
    generated.add(value);
    Object.assign(last, {
      value, ts: timestamp, node, sequence,
    });
    if (idx % 500 === 0) {
      // Rest every once and a while.
      await new Promise((resolve) => setImmediate(resolve));
    }
  }
});

test('idSequence should support casting IDs to string', () => {
  // NOTE: This is depricated and will be removed in future versions.
  // Use idStringSequence instead.
  const it = idSequence({ as: CastAs.string });
  const { value, done } = it.next();
  expect(value).toBeLike('string');
  expect(done).toBe(false);
  expect(value).toMatch(/^[1-9][0-9]*$/);
});

test('idSequence should support single-node instances', () => {
  const TWELVE_HOURS = 12*60*60*1000;
  const it = idSequence({
    singleNode: true,
    getTimestamp: () => (1577836800000 + TWELVE_HOURS),
  });
  const { value, done } = it.next();
  expect(value).toBeLike('bigint');
  if(typeof value !== 'bigint') {
    fail('"value" should be a bigint');
  }
  expect(done).toBe(false);
  const reserved = Number((value & MASK_RESERVED) >> OFFSET_RESERVED);
  expect(reserved).toBe(RESERVED);
  const ts = Number((value & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
  expect(ts).toBeGreaterThanOrEqual(0);
  expect(ts).toBeLessThanOrEqual(MAX_TIMESTAMP);
  expect(ts).toBe(TWELVE_HOURS);
  const node = Number((value & MASK_NODE) >> OFFSET_NODE);
  expect(node).toBeGreaterThanOrEqual(0);
  expect(node).toBeLessThanOrEqual(MAX_NODE_NUM);
  expect(node).toBe(MAX_NODE_NUM);
  const seq = Number((value & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
  expect(seq).toBeGreaterThanOrEqual(0);
  expect(seq).toBeLessThanOrEqual(MAX_SEQUENCE);
  expect(seq).toBe(0);
});

test('idSequence should generate sequence in single-node mode', async () => {
  type Last = {
    value?: bigint,
    node?: number;
    timestamp: number,
    sequence: number,
  };
  const last: Last = {
    value: undefined,
    node: undefined,
    timestamp: 0,
    sequence: 0,
  };
  const generated = new Set();
  const SEVEN_HOURS = 7*60*60*1000;
  const it = idSequence({
    singleNode: true,
    getTimestamp: () => (1577836800000 + SEVEN_HOURS),
  });
  // Loop for more than max sequence.
  for(let idx=0; idx < MAX_SEQUENCE+1000; idx++) {
    const shouldHaveWrapped = idx <= MAX_SEQUENCE ? false : true;
    const { value, done } = it.next();
    expect(value).toBeLike('bigint');
    if(typeof value !== 'bigint') {
      fail('"value" should be a bigint');
    }
    expect(done).toBe(false);
    const reserved = Number((value & MASK_RESERVED) >> OFFSET_RESERVED);
    expect(reserved).toBe(RESERVED);
    const timestamp = Number((value & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
    expect(timestamp).toBe(SEVEN_HOURS);
    const node = Number((value & MASK_NODE) >> OFFSET_NODE);
    expect(node).toBeGreaterThanOrEqual(0);
    expect(node).toBeLessThanOrEqual(MAX_NODE_NUM);
    expect(node).toBe(MAX_NODE_NUM - (shouldHaveWrapped ? 1 : 0));
    const sequence = Number((value & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
    expect(sequence).toBeGreaterThanOrEqual(0);
    expect(sequence).toBeLessThanOrEqual(MAX_SEQUENCE);
    if(last.sequence === MAX_SEQUENCE) {
      expect(shouldHaveWrapped).toBe(true);
      expect(sequence).toBe(MIN_SEQUENCE_NUM);
    } else {
      expect(sequence).toBeGreaterThanOrEqual(last.sequence);
    }
    // Should not repeat values.
    expect(generated.has(value)).toBe(false);
    generated.add(value);
    Object.assign(last, {
      value, node, sequence,
    });
  }
});

