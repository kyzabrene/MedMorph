
import { RAW_MORPHEME_DB } from '../constants';
import { Morpheme, MorphemeType } from '../types';

/**
 * Normalizes a term by removing leading/trailing hyphens.
 */
export const normalize = (term: string) => term.replace(/^-|-$/g, '').toLowerCase();

/**
 * Finds the best morpheme matches for a segmented string.
 * Uses longest match strategy and normalization.
 */
export const findMorphemeMatch = (segment: string): Morpheme | null => {
  const normSeg = normalize(segment);
  
  // Strategy: 
  // 1. Exact match normalized
  // 2. Exact match raw
  // 3. Prefer longest match if there are multiple (though here segments are already split)
  const matches = RAW_MORPHEME_DB.filter(m => 
    m.normalizedTerm === normSeg || 
    normalize(m.term) === normSeg
  );

  if (matches.length === 0) return null;

  // If multiple matches, prioritize RT (Root) over others as core meaning
  const rootMatch = matches.find(m => m.type === MorphemeType.RT);
  return rootMatch || matches[0];
};

/**
 * Brute force longest-match segmentation (Greedy).
 * While morphseg is preferred, a JS fallback is useful.
 */
export const greedySegment = (word: string): string[] => {
  const normalizedWord = word.toLowerCase();
  const segments: string[] = [];
  let remaining = normalizedWord;

  // This is a simplified version of the logic
  // For production, we'd use a more robust trie or the Gemini API as a secondary check
  while (remaining.length > 0) {
    let matchFound = false;
    for (let len = remaining.length; len >= 2; len--) {
      const sub = remaining.substring(0, len);
      if (findMorphemeMatch(sub)) {
        segments.push(sub);
        remaining = remaining.substring(len);
        matchFound = true;
        break;
      }
    }
    if (!matchFound) {
      segments.push(remaining[0]);
      remaining = remaining.substring(1);
    }
  }
  return segments;
};
