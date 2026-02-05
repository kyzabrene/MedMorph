
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, VisualBoard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getVisualBoardData = async (
  term: string, 
  profile: UserProfile, 
  matchedMorphemes: any[]
): Promise<VisualBoard> => {
  const prompt = `
    You are the 'MedMorph Intelligence Engine'. Your task is to perform a deep linguistic and clinical analysis of the medical term: "${term}".
    
    User Goal: ${profile.goal}
    User Background: ${profile.occupation}
    Preferred Explanation Style: ${profile.useAnalogies ? 'Analogous and friendly' : 'Technical and precise'}
    
    Matched Morphemes from Database:
    ${JSON.stringify(matchedMorphemes, null, 2)}

    MANDATORY: Do not include the word "Gemini" or any AI brand names in your response or analysis.

    Task:
    1. Validate the morpheme split. Provide "splitReasoning" explaining the linguistic logic (e.g., 'Exact match on root "cardio"').
    2. For each morpheme: include full definition, 2 alternatives/synonyms, 2 common misspellings, and "whereFound" (start/middle/end).
    3. Create "rephraseOptions" for: Elementary (simple metaphors), Highschool (basic science), and Professional (clinical precision).
    4. Provide "usage" examples for: Patient-friendly (conversation), Textbook (definitions), and Chart note (shorthand clinical).
    5. Find "confusables": 2-3 look-alike morphemes relevant to this word.
    6. "pronunciation": Syllables array, index of primary stress, IPA, and common mistakes (e.g., 'don't pronounce the p in pneumonia').
    7. Generate a "mnemonic" memory hook.
    8. Suggest 6 "similarWords" with shared roots to form a complex word web.
    9. Suggest 4 "mediaKeywords" for public domain image searches (e.g., 'Wikimedia Commons heart anatomy').

    Return ONLY JSON matching this schema:
    {
      "originalTerm": "string",
      "morphemeBreakdown": [{ "term": "string", "type": "PF|RT|SF", "definition": "string", "shortDefinition": "string", "alternatives": ["string"], "misspellings": ["string"], "whereFound": "string", "sourceInfo": "string" }],
      "assembledDefinition": "string",
      "rephraseOptions": { "elementary": "string", "highschool": "string", "professional": "string" },
      "pronunciation": { "syllables": ["string"], "stressedSyllableIndex": number, "phonetic": "string", "isApproximate": boolean, "commonMistakes": "string" },
      "usage": { "patientFriendly": "string", "textbook": "string", "chartNote": "string" },
      "similarWords": [{ "word": "string", "status": "real|suggested", "morphemes": ["string"], "searchKeywords": ["string"] }],
      "confusables": [{ "term": "string", "meaning": "string", "difference": "string" }],
      "mnemonic": "string",
      "mediaKeywords": ["string"],
      "uncertaintyWarnings": "string",
      "splitReasoning": "string"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as VisualBoard;
  } catch (error) {
    console.error("Engine Parse Error:", error);
    throw new Error("Decoding failed. The intelligence engine is currently recalibrating.");
  }
};
