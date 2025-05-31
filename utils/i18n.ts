export type Locale = 'en' | 'zh-TW';

export const locales = [
  { code: 'en', label: 'English' },
  { code: 'zh-TW', label: '繁體中文' }
];

export const siteTitle: Record<Locale, string> = {
  'en': 'Happy Animal Biscuit Quiz',
  'zh-TW': '愉快動物餅問答挑戰',
};

export const animalListTitle: Record<Locale, string> = {
  'en': 'Full List of Happy Animal Biscuits',
  'zh-TW': '愉快動物餅全名單',
};

export const quizDesc: Record<Locale, string> = {
  'en': "Let's challenge yourself with below quiz:",
  'zh-TW': '來挑戰下列愉快動物餅問答吧：',
};

export const quizBtn1: Record<Locale, string> = {
  'en': 'Animal Names Matching (JP vs. EN)',
  'zh-TW': '動物名稱配對 (日文/英文)',
};

export const quizBtn2: Record<Locale, string> = {
  'en': 'Guess what animal it is?',
  'zh-TW': '猜猜這是什麼動物？',
};

export const resultCompleted: Record<Locale, string> = {
  'en': 'Quiz Completed!',
  'zh-TW': '問答完成！',
};

export const resultScore: Record<Locale, (score: number, total: number) => string> = {
  'en': (score, total) => `Your score: ${score} / ${total}`,
  'zh-TW': (score, total) => `你的分數：${score} / ${total}`,
};

export const quizTitle: Record<Locale, string> = {
  'en': 'Animal Names Matching (JP vs. EN)',
  'zh-TW': '動物名稱配對 (日文/英文)',
};

export const quizScoreLabel: Record<Locale, string> = {
  'en': 'Score:',
  'zh-TW': '分數：',
};

export const quizPromptJP: Record<Locale, string> = {
  'en': 'What is the Japanese name for "{animal}"?',
  'zh-TW': '「{animal}」的日文名稱是什麼？',
};

export const quizPromptEN: Record<Locale, string> = {
  'en': 'What is the English name for "{animal}"?',
  'zh-TW': '「{animal}」的英文名稱是什麼？',
};

export const animalLabel: Record<Locale, string> = {
  'en': 'animal',
  'zh-TW': '動物',
};
