
export enum MorphemeType {
  PF = 'PF', // Prefix
  RT = 'RT', // Root
  SF = 'SF'  // Suffix
}

export interface Morpheme {
  term: string;
  normalizedTerm: string;
  type: MorphemeType;
  definition: string;
  shortDefinition: string;
  alternatives?: string[];
  misspellings?: string[];
  whereFound?: string; // start, middle, end
  sourceInfo?: string; // exact DB entry trace
}

export interface UserProfile {
  ageGroup: string;
  occupation: 'high-school' | 'undergrad' | 'grad' | 'professional' | 'retired' | 'elderly';
  readingLevel: 'simple' | 'technical' | 'concise';
  theme: 'light' | 'dark';
  dyslexiaFont: boolean;
  goal: 'exam' | 'patient-ed' | 'curiosity' | 'clinical';
  useAnalogies: boolean;
}

export interface SimilarWord {
  word: string;
  status: 'real' | 'suggested';
  morphemes: string[];
  searchKeywords: string[];
}

export interface Confusable {
  term: string;
  meaning: string;
  difference: string;
}

export interface VisualBoard {
  originalTerm: string;
  morphemeBreakdown: Morpheme[];
  assembledDefinition: string;
  rephraseOptions: {
    elementary: string;
    highschool: string;
    professional: string;
  };
  pronunciation: {
    syllables: string[]; // ['ath', 'er', 'o', 'scle', 'ro', 'sis']
    stressedSyllableIndex: number;
    phonetic: string;
    isApproximate: boolean;
    commonMistakes?: string;
  };
  usage: {
    patientFriendly: string;
    textbook: string;
    chartNote: string;
  };
  similarWords: SimilarWord[];
  confusables: Confusable[];
  mnemonic?: string;
  mediaKeywords: string[];
  uncertaintyWarnings?: string;
  splitReasoning: string;
}
