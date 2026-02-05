
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, VisualBoard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getVisualBoardData = async (
  term: string, 
  profile: UserProfile, 
  matchedMorphemes: any[]
): Promise<VisualBoard> => {
  const prompt = `
    You are MedMorph, a world-class senior medical linguist.
    Analyze the term: "${term}".
    
    User Goal: ${profile.goal}
    User Background: ${profile.occupation}
    Use Analogies: ${profile.useAnalogies}
    
    Matched Morphemes from Database:
    ${JSON.stringify(matchedMorphemes, null, 2)}

    Task:
    1. Validate the morpheme split. Provide "splitReasoning" explaining why this segmentation was chosen.
    2. For each morpheme: include full definition, 1-2 alternatives/synonyms, common misspellings, and where it usually appears (start/middle/end).
    3. Create "rephraseOptions" for Elementary, Highschool, and Professional levels.
    4. Provide "usage" examples for: Patient-friendly, Textbook style, and Chart note style.
    5. Find "confusables": Look-alike morphemes (e.g. hyper vs hypo) relevant to this word.
    6. "pronunciation": Return an array of syllables, the index of the stressed syllable (0-indexed), IPA phonetic, and a "commonMistakes" warning.
    7. Generate a "mnemonic" memory hook.
    8. Suggest "similarWords" with shared roots to form a branching word web.

    Constraint: NO MEDICAL ADVICE. Linguistic and educational focus only.
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
    console.error("Gemini Parse Error:", error);
    throw new Error("Decoding failed. Our penguin assistant is taking a breather.");
  }
};
