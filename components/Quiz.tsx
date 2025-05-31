import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Box, LinearProgress, Alert, CircularProgress } from '@mui/material';
import { getAnimals } from '../utils/animalData';
import { useContext } from 'react';
import { LocaleContext } from '../pages/_app';
import { quizTitle, quizScoreLabel, quizPromptJP, quizPromptEN, animalLabel } from '../utils/i18n';

// Define the Question type
type Question = {
  type: 'jp' | 'en';
  animal: string;
  question: string;
  image: string;
  answer: string;
  options: string[];
  display: string;
  correct: string;
  correctEN?: string;
  correctJP?: string;
};

type Animal = ReturnType<typeof getAnimals>[number];

const Title = Typography;
const Text = Typography;

// Fuwafuwa theme colors
const FUWA_BG = '#fff8f0';
const FUWA_CARD = '#fffaf7';
const FUWA_ACCENT = '#ffd6e0';
const FUWA_CORRECT = '#a7e9af';
const FUWA_WRONG = '#ffb3b3';
const FUWA_FONT = '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif';

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function getRandomOptions(correct: string, all: string[]): string[] {
  const options = [correct];
  while (options.length < 4) {
    const random = all[Math.floor(Math.random() * all.length)];
    if (!options.includes(random)) options.push(random);
  }
  return shuffle(options);
}

// Build a mixed question bank (EN->JP or JP->EN)
function buildQuestions(animals: Animal[], locale: 'en' | 'zh-TW'): Question[] {
  const shuffled = shuffle(animals).slice(0, 10);
  return shuffled.map((animal) => {
    const askJap = Math.random() < 0.5 && animal.jname;
    if (askJap) {
      return {
        type: 'jp' as const,
        animal: animal.name,
        question: quizPromptJP[locale].replace('{animal}', animal.name),
        image: animal.image,
        answer: animal.jname || '',  // Ensure non-null
        options: getRandomOptions(animal.jname || '', animals.map((a) => a.jname || '').filter(Boolean)),
        display: animal.name + ' (EN)',
        correct: animal.jname || '',
        correctEN: animal.name,
      };
    } else {
      return {
        type: 'en' as const,
        animal: animal.jname || '',
        question: quizPromptEN[locale].replace('{animal}', animal.jname || ''),
        image: animal.image,
        answer: animal.name,
        options: getRandomOptions(animal.name, animals.map((a) => a.name)),
        display: (animal.jname || '') + ' (JP)',
        correct: animal.name,
        correctJP: animal.jname,
      };
    }
  });
}

export function Quiz() {
  const { locale } = useContext(LocaleContext);
  const animals = getAnimals();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<{ [k: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Move randomization to useEffect to avoid hydration mismatch
  useEffect(() => {
    // Only run on client-side to prevent hydration mismatch
    if (typeof window !== 'undefined') { // Ensure we're on client side
      const generatedQuestions = buildQuestions(animals, locale as 'en' | 'zh-TW');
      setQuestions(generatedQuestions);
      setIsLoading(false);
    }
  }, [animals, locale]);
  
  // Reset quiz when locale changes
  useEffect(() => {
    if (!isLoading) {
      setAnswered({});
      setScore(0);
      setCurrent(0);
      setShowResult(false);
    }
  }, [locale, isLoading]);
  
  // Only proceed if we have questions and are not loading
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Safe to access questions now that we've checked isLoading
  const q = questions[current];
  const answeredThis = answered[current];
  const isCorrect = answeredThis ? answeredThis === q.answer : false;

  function handleAnswer(option: string) {
    if (answeredThis) return;
    setAnswered((prev) => ({ ...prev, [current]: option }));
    if (option === q.answer) setScore((s) => s + 1);
    // Optionally auto-advance after a delay
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent((c) => c + 1);
      else setShowResult(true);
    }, 1200);
  }

  function restart() {
    setAnswered({});
    setScore(0);
    setCurrent(0);
    setShowResult(false);
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor={FUWA_BG}>
      <Box width={{ xs: '100%', sm: 420, md: 700, lg: 800 }} mx="auto">
        {showResult ? (
          <Card
            style={{ background: FUWA_BG, borderRadius: 24, fontFamily: FUWA_FONT, textAlign: 'center', padding: 32, maxWidth: 800, width: '100%', margin: '0 auto' }}
            elevation={3}
          >
            <Box mb={2}>
              <span style={{ fontSize: 64, color: FUWA_ACCENT }}>🎉</span>
            </Box>
            <Typography variant="h4" style={{ fontFamily: FUWA_FONT, color: FUWA_ACCENT, marginBottom: 8 }}>
              {quizTitle[locale as 'en' | 'zh-TW']}
            </Typography>
            <Typography variant="h6" style={{ fontSize: 22, color: FUWA_ACCENT, marginBottom: 24 }}>
              {quizScoreLabel[locale as 'en' | 'zh-TW']} {score} / {questions.length}
            </Typography>
            
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: FUWA_FONT, fontWeight: 'bold', mb: 2 }}>
                Question Summary:
              </Typography>
              {questions.map((question, index) => {
                const userAnswer = answered[index];
                const isCorrectAnswer = userAnswer === question.answer;
                
                return (
                  <Card 
                    key={index} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      bgcolor: isCorrectAnswer ? 'rgba(167, 233, 175, 0.2)' : 'rgba(255, 179, 179, 0.2)',
                      borderLeft: `4px solid ${isCorrectAnswer ? FUWA_CORRECT : FUWA_WRONG}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontWeight: 'bold', mr: 1 }}>{index + 1}.</Typography>
                      <Typography>{question.question}</Typography>
                    </Box>
                    
                    <Box sx={{ ml: 4 }}>
                      <Typography>
                        <strong>Your answer:</strong> {userAnswer || 'Not answered'} 
                        {isCorrectAnswer ? ' ✅' : ' ❌'}
                      </Typography>
                      
                      {!isCorrectAnswer && (
                        <Typography sx={{ color: 'success.main', fontWeight: 'medium' }}>
                          <strong>Correct answer:</strong> {question.answer}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                );
              })}
            </Box>
            
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                key="retry"
                size="large"
                variant="contained"
                onClick={restart}
                sx={{ borderRadius: 2, background: FUWA_ACCENT, color: '#333', fontWeight: 600, fontFamily: FUWA_FONT, mr: 2 }}
              >
                Retry
              </Button>
              <Button
                key="home"
                size="large"
                variant="outlined"
                href="/"
                sx={{ borderRadius: 2, background: '#fff', color: '#333', fontWeight: 600, fontFamily: FUWA_FONT }}
                startIcon={<span role="img" aria-label="home">🏠</span>}
              >
                Home
              </Button>
            </Box>
          </Card>
        ) : (
           <Card
            sx={{ background: FUWA_CARD, borderRadius: 2.5, boxShadow: '0 4px 24px #ffe0ef88', minWidth: 330, maxWidth: 390, fontFamily: FUWA_FONT, p: 2 }}
            elevation={3}
          >
            {/* Back to Home button at the top */}
            <Box display="flex" justifyContent="flex-end" mb={1}>
              <Button
                key="home-top"
                size="small"
                variant="outlined"
                href="/"
                sx={{ borderRadius: 2, background: '#fff', color: '#333', fontWeight: 600, fontFamily: FUWA_FONT, minWidth: 0, px: 1.5 }}
                startIcon={<span role="img" aria-label="home">🏠</span>}
              >
                Home
              </Button>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((current + 1) / questions.length) * 100}
              sx={{ height: 10, borderRadius: 5, margin: '10px 0 18px 0', background: '#ffe0ef44', '& .MuiLinearProgress-bar': { backgroundColor: FUWA_ACCENT } }}
            />
            <Typography variant="h5" sx={{ color: '#222', fontFamily: FUWA_FONT, m: 0, fontWeight: 700 }}>
              {quizTitle[locale as 'en' | 'zh-TW']}
            </Typography>
            <Typography sx={{ fontSize: 18, color: '#222', fontFamily: FUWA_FONT, fontWeight: 700 }}>
              {quizScoreLabel[locale as 'en' | 'zh-TW']} {score} / {questions.length}
            </Typography>
            <Box my={3} textAlign="center">
              <img
                src={`/images/concealed/${q.image}.png`}
                alt="animal"
                style={{ width: 180, height: 120, borderRadius: 16, boxShadow: '0 2px 12px #ffd6e0' }}
              />
            </Box>
            <Text variant="h6" sx={{ mb: 2 }}>
              {q.question}
            </Text>
            <Text sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              {animalLabel[locale as 'en' | 'zh-TW']}: {q.display}
            </Text>
            <Box display="flex" flexDirection="column" gap={1.5} width="100%">
              {q.options.map((option: string) => {
                let status: 'default' | 'correct' | 'wrong' = 'default';
                if (answeredThis) {
                  if (option === q.answer) status = 'correct';
                  else if (option === answeredThis && option !== q.answer) status = 'wrong';
                }
                return (
                  <Button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={!!answeredThis}
                    fullWidth
                    sx={{
                      borderRadius: 1.5,
                      background:
                        status === 'correct' ? FUWA_CORRECT : status === 'wrong' ? FUWA_WRONG : '#fff',
                      border: '2px solid',
                      borderColor:
                        status === 'correct' ? FUWA_CORRECT : status === 'wrong' ? FUWA_WRONG : FUWA_ACCENT,
                      color: '#222',
                      fontWeight: 600,
                      fontFamily: FUWA_FONT,
                      fontSize: 18,
                      mb: 0.5,
                      boxShadow: status === 'correct' ? '0 2px 8px #a7e9af44' : undefined,
                      justifyContent: 'center',
                      textTransform: 'none',
                    }}
                    startIcon={
                      answeredThis
                        ? status === 'correct'
                          ? <span role="img" aria-label="correct">✅</span>
                          : status === 'wrong'
                          ? <span role="img" aria-label="wrong">❌</span>
                          : undefined
                        : undefined
                    }
                  >
                    {option}
                  </Button>
                );
              })}
            </Box>
            {answeredThis && (
              <Box mt={2} fontFamily={FUWA_FONT}>
                {isCorrect ? (
                  <Typography variant="body1" sx={{ color: FUWA_CORRECT, fontWeight: 700 }}>
                    🎉 Correct!
                  </Typography>
                ) : (
                  <Typography variant="body1" sx={{ color: FUWA_WRONG, fontWeight: 700 }}>
                    😔 Incorrect!<br />
                    Correct answer: <span style={{ color: FUWA_CORRECT }}>{q.answer}</span>
                  </Typography>
                )}
              </Box>
            )}
          </Card>
        )}
      </Box>
    </Box>
  );
}
