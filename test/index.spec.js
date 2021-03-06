/**
 * @theroyalwhee0/snowman:test/index.spec.js
 */

/**
 * Imports.
 */
const { describe, it, expect } = require('./testing');
const { idSequence, explodeId, explode } = require('../src/index');
const {
  DEFAULT_OFFSET,
  OFFSET_RESERVED, OFFSET_TIMESTAMP, OFFSET_NODE, OFFSET_SEQUENCE,
  MASK_RESERVED, MASK_TIMESTAMP, MASK_NODE, MASK_SEQUENCE,
  MAX_TIMESTAMP, MAX_NODE, MAX_SEQUENCE,
  RESERVED,
  MIN_SEQUENCE,
} = require('../src/constants');

/**
 * Numeric version of bigint value for strict equality and test checks.
 */
const MAX_NODE_NUM = Number(MAX_NODE);
const MIN_SEQUENCE_NUM = Number(MIN_SEQUENCE);

/**
 * Tests.
 */
describe('@theroyalwhee0/snowman', () => {
  describe('idSequence', () => {
    it('should be a function', () => {
      expect(idSequence).to.be.a('function');
      expect(idSequence.length).to.equal(1);
    });
    it('should create an iterator', () => {
      const it = idSequence();
      expect(it[Symbol.iterator]).to.be.an('function');
      const results = it.next();
      expect(results).to.be.an('object');
    });
    it('should create generate an id', () => {
      const SIX_HOURS = 6*60*60*1000;
      const it = idSequence({
        node: 123,
        getTimestamp: () => (1577836800000 + SIX_HOURS),
      });
      const { value, done } = it.next();
      expect(value).to.be.a('bigint');
      expect(done).to.equal(false);
      const reserved = Number((value & MASK_RESERVED) >> OFFSET_RESERVED);
      expect(reserved).to.equal(RESERVED);
      const ts = Number((value & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
      expect(ts).to.be.gte(0).and.lte(MAX_TIMESTAMP);
      expect(ts).to.equal(SIX_HOURS);
      const node = Number((value & MASK_NODE) >> OFFSET_NODE);
      expect(node).to.be.gte(0).and.lte(MAX_NODE_NUM);
      expect(node).to.equal(123);
      const seq = Number((value & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
      expect(seq).to.be.gte(0).and.lte(MAX_SEQUENCE);
      expect(seq).to.equal(0);
    });
    it('should generate a sequence of valid ids over time', async () => {
      const last = {
        value: undefined,
        timestamp: 0,
        node: undefined,
        sequence: 0,
      };
      const generated = new Set();
      const it = idSequence();
      // Loop for more than max sequence.
      for(let idx=0; idx < MAX_SEQUENCE+1000; idx++) {
        const { value, done } = it.next();
        expect(value).to.be.a('bigint');
        expect(done).to.equal(false);
        const reserved = Number((value & MASK_RESERVED) >> OFFSET_RESERVED);
        expect(reserved).to.equal(RESERVED);
        const timestamp = Number((value & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
        expect(timestamp).to.be.gte(0).and.lte(MAX_TIMESTAMP);
        // Timestamp should rise over time.
        expect(timestamp).to.be.gte(last.timestamp);
        const node = Number((value & MASK_NODE) >> OFFSET_NODE);
        expect(node).to.equal(0);
        const sequence = Number((value & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
        expect(sequence).to.be.gte(0).and.lte(MAX_SEQUENCE);
        if(timestamp === last.timestamp) {
          // Sequence should rise within each moment.
          expect(sequence).to.be.gt(last.sequence);
        }
        // Should not repeat values.
        expect(generated.has(value)).to.be.false;
        generated.add(value);
        Object.assign(last, {
          value, ts: timestamp, node, sequence,
        });
        if(idx % 500 === 0) {
          // Rest every once and a while.
          await new Promise(setImmediate);
        }
      }
    });
    it('should support casting IDs to string', () => {
      const it = idSequence({ as: 'string' });
      const { value, done } = it.next();
      expect(value).to.be.a('string');
      expect(done).to.equal(false);
      expect(value).to.match(/^[1-9][0-9]*$/);
    });
    it('should support single-node instances', () => {
      const TWELVE_HOURS = 12*60*60*1000;
      const it = idSequence({
        singleNode: true,
        getTimestamp: () => (1577836800000 + TWELVE_HOURS),
      });
      const { value, done } = it.next();
      expect(value).to.be.a('bigint');
      expect(done).to.equal(false);
      const reserved = Number((value & MASK_RESERVED) >> OFFSET_RESERVED);
      expect(reserved).to.equal(RESERVED);
      const ts = Number((value & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
      expect(ts).to.be.gte(0).and.lte(MAX_TIMESTAMP);
      expect(ts).to.equal(TWELVE_HOURS);
      const node = Number((value & MASK_NODE) >> OFFSET_NODE);
      expect(node).to.be.gte(0).and.lte(MAX_NODE_NUM);
      expect(node).to.equal(MAX_NODE_NUM);
      const seq = Number((value & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
      expect(seq).to.be.gte(0).and.lte(MAX_SEQUENCE);
      expect(seq).to.equal(0);
    });
    it('should generate sequence in single-node mode', async () => {
      const last = {
        value: undefined,
        timestamp: 0,
        node: undefined,
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
        expect(value).to.be.a('bigint');
        expect(done).to.equal(false);
        const reserved = Number((value & MASK_RESERVED) >> OFFSET_RESERVED);
        expect(reserved).to.equal(RESERVED);
        const timestamp = Number((value & MASK_TIMESTAMP) >> OFFSET_TIMESTAMP);
        expect(timestamp).to.equal(SEVEN_HOURS);
        const node = Number((value & MASK_NODE) >> OFFSET_NODE);
        expect(node).to.be.gte(0).and.lte(MAX_NODE_NUM);
        expect(node).to.equal(MAX_NODE_NUM - (shouldHaveWrapped ? 1 : 0));
        const sequence = Number((value & MASK_SEQUENCE) >> OFFSET_SEQUENCE);
        expect(sequence).to.be.gte(0).and.lte(MAX_SEQUENCE);
        if(last.sequence === MAX_SEQUENCE) {
          expect(shouldHaveWrapped).to.be.true;
          expect(sequence).to.equal(MIN_SEQUENCE_NUM);
        } else {
          expect(sequence).to.be.gte(last.sequence);
        }
        // Should not repeat values.
        expect(generated.has(value)).to.be.false;
        generated.add(value);
        Object.assign(last, {
          value, node, sequence,
        });
      }
    });
  });
  describe('explodeId', () => {
    it('should be a function', () => {
      expect(explodeId).to.be.a('function');
      expect(explodeId.length).to.equal(2);
      expect(explodeId.name).to.equal('explodeId');
    });
    it('should be aliased to explode', () => {
      expect(explode).to.equal(explodeId);
    });
    describe('should handle valid values', () => {
      it('like id "266746406522281985n"', () => {
        const results = explodeId(266746406522281985n);
        expect(results).to.be.an('array').and.to.have.a.lengthOf(4);
        expect(results).to.eql([ 1609635449611, 763, 1, true ]);
      });
      it('like id "181193933807616"', () => {
        const results = explodeId(181193933807616n);
        expect(results).to.be.an('array').and.to.have.a.lengthOf(4);
        expect(results).to.eql([ 1577858400000, 123, 0, true ]);
      });
      it('like id "181193933808615n"', () => {
        const results = explodeId(181193933808615n);
        expect(results).to.eql([ 1577858400000, 123, 999, true ]);
      });
      it('with maximum value', () => {
        const id = BigInt(0x7FFFFFFFFFFFFFFFn); // NOTE: This matches MASK_ID.
        const results = explodeId(id);
        expect(results).to.eql([
          MAX_TIMESTAMP+DEFAULT_OFFSET,
          MAX_NODE_NUM,
          MAX_SEQUENCE,
          true,
        ]);
      });
      it('that are valid non-bigints', () => {
        const results = explodeId(181193933807616); // Note: This is not a bigint.
        expect(results).to.be.an('array').and.to.have.a.lengthOf(4);
        expect(results).to.eql([ 1577858400000, 123, 0, true ]);
      });
    });
    describe('should handle invalid values', () => {
      it('like id "0"', () => {
        // NOTE: ID 0 is never valid because it's timestamp would be zero which is not valid.
        const results = explodeId(0);
        expect(results).to.be.an('array').and.to.have.a.lengthOf(4);
        expect(results).to.eql([ undefined, undefined, undefined, false ]);
      });
      it('like id "-1000"', () => {
        // Negative values are invalid.
        const results = explodeId(-1000);
        expect(results).to.eql([ undefined, undefined, undefined, false ]);
      });
      it('like id "invalid"', () => {
        // Other types are invalid.
        const results = explodeId('invalid');
        expect(results).to.eql([ undefined, undefined, undefined, false ]);
      });
    });
  });
});
