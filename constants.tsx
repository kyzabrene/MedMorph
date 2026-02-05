
import { MorphemeType, Morpheme } from './types';

// Extracting sample data from the provided PDF OCR
export const RAW_MORPHEME_DB: Morpheme[] = [
  { term: "athero-", normalizedTerm: "athero", type: MorphemeType.RT, definition: "fatty deposit, soft gruel-like deposit, plaque", shortDefinition: "fatty deposit" },
  { term: "-sclerosis", normalizedTerm: "sclerosis", type: MorphemeType.SF, definition: "hardening", shortDefinition: "hardening" },
  { term: "cardio-", normalizedTerm: "cardio", type: MorphemeType.RT, definition: "of or pertaining to the heart", shortDefinition: "of or pertaining to the heart" },
  { term: "abdomino-", normalizedTerm: "abdomino", type: MorphemeType.RT, definition: "of or relating to the abdomen", shortDefinition: "of or relating to the abdomen" },
  { term: "-itis", normalizedTerm: "itis", type: MorphemeType.SF, definition: "inflammation", shortDefinition: "inflammation" },
  { term: "angio-", normalizedTerm: "angio", type: MorphemeType.RT, definition: "blood vessel", shortDefinition: "blood vessel" },
  { term: "brady-", normalizedTerm: "brady", type: MorphemeType.PF, definition: "slow", shortDefinition: "slow" },
  { term: "tachy-", normalizedTerm: "tachy", type: MorphemeType.PF, definition: "fast, rapid", shortDefinition: "fast" },
  { term: "-ectomy", normalizedTerm: "ectomy", type: MorphemeType.SF, definition: "surgical removal, excision", shortDefinition: "surgical removal" },
  { term: "nephro-", normalizedTerm: "nephro", type: MorphemeType.RT, definition: "of or pertaining to the kidney", shortDefinition: "kidney" },
  { term: "neuro-", normalizedTerm: "neuro", type: MorphemeType.RT, definition: "of or pertaining to nerves and the nervous system", shortDefinition: "nerve" },
  { term: "osteo-", normalizedTerm: "osteo", type: MorphemeType.RT, definition: "bone", shortDefinition: "bone" },
  { term: "myo-", normalizedTerm: "myo", type: MorphemeType.RT, definition: "of or relating to muscle", shortDefinition: "muscle" },
  { term: "hepato-", normalizedTerm: "hepato", type: MorphemeType.RT, definition: "of or pertaining to the liver", shortDefinition: "liver" },
  { term: "hyper-", normalizedTerm: "hyper", type: MorphemeType.PF, definition: "extreme or beyond normal, excessive", shortDefinition: "excessive" },
  { term: "hypo-", normalizedTerm: "hypo", type: MorphemeType.PF, definition: "below, deficient, under", shortDefinition: "below" },
  { term: "gastro-", normalizedTerm: "gastro", type: MorphemeType.RT, definition: "of or pertaining to the stomach", shortDefinition: "stomach" },
  { term: "pneumo-", normalizedTerm: "pneumo", type: MorphemeType.RT, definition: "air, breath, lung", shortDefinition: "lung" },
  { term: "dermato-", normalizedTerm: "dermato", type: MorphemeType.RT, definition: "of or pertaining to the skin", shortDefinition: "skin" },
  { term: "arthro-", normalizedTerm: "arthro", type: MorphemeType.RT, definition: "of or pertaining to the joints, limbs", shortDefinition: "joint" },
  { term: "cephalo-", normalizedTerm: "cephalo", type: MorphemeType.RT, definition: "of or pertaining to the head (as a whole)", shortDefinition: "head" },
];

export const APP_DISCLAIMER = "MedMorph is a language-learning tool for medical terminology. It does not provide medical advice, diagnosis, or treatment. Always consult a healthcare professional for medical concerns.";
