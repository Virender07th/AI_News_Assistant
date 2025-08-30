export const voiceEngines = [
  {
    label: 'Clear Voice (Professional Narration)',
    value: 'coqui',
    supportedTones: ['calm', 'neutral', 'formal', 'fast', 'slow', 'deep'],
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it']
  },
  {
    label: 'Simple Voice (Quick & Robotic)',
    value: 'gtts',
    supportedTones: ['neutral'],
    supportedLanguages: ['en', 'hi', 'ta', 'fr', 'es', 'de', 'it', 'bn', 'pt']
  }
];

export const toneOptions = {
  calm: 'Calm – Relaxed and steady',
  dramatic: 'Dramatic – Serious and emotional',
  excited: 'Excited – Upbeat and energetic',
  narrator: 'Narrator – Smooth storytelling',
  angry: 'Angry – Harsh and intense',
  sad: 'Sad – Soft and emotional',
  cheerful: 'Cheerful – Happy and friendly',
  neutral: 'Neutral – Plain, no emotion',
  formal: 'Formal – Polished and serious',
  fast: 'Fast – Quick delivery',
  slow: 'Slow – Deliberate and paced',
  deep: 'Deep – Bold and low voice'
};

export const languageNames = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  hi: 'Hindi',
  it: 'Italian',
  ja: 'Japanese',
  ta: 'Tamil',
  bn: 'Bengali',
  pt: 'Portuguese'
};