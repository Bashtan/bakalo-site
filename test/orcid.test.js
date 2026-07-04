import { describe, test, expect } from 'vitest';
import { parseWorksCount } from '../functions/lib/orcid.js';

const FIXTURE = {
  'activities-summary': {
    works: {
      group: [
        { 'work-summary': [{ title: 'Paper A' }] },
        { 'work-summary': [{ title: 'Paper B' }] },
        { 'work-summary': [{ title: 'Paper C' }] }
      ]
    }
  }
};

describe('parseWorksCount', () => {
  test('counts groups in a valid ORCID works response', () => {
    expect(parseWorksCount(FIXTURE)).toBe(3);
  });

  test('returns 0 when group array is empty', () => {
    const empty = { 'activities-summary': { works: { group: [] } } };
    expect(parseWorksCount(empty)).toBe(0);
  });

  test('returns 0 when activities-summary is missing', () => {
    expect(parseWorksCount({})).toBe(0);
  });

  test('returns 0 on null input', () => {
    expect(parseWorksCount(null)).toBe(0);
  });

  test('returns 0 when works key is absent', () => {
    expect(parseWorksCount({ 'activities-summary': {} })).toBe(0);
  });
});
