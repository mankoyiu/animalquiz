import React, { useState, useContext, useEffect } from 'react';
import { Card, Button, Typography, Box, LinearProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Animal, getAnimals } from '../utils/animalData';
import { LocaleContext } from '../pages/_app';
import { quizBtn2, quizScoreLabel, resultCompleted, resultScore } from '../utils/i18n';

const Title = Typography;
const Text = Typography;

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

function buildQuestions(animals: Animal[]) {
  // Filter out animals without images
  const animalsWithImages = animals.filter(animal => animal.image);
  
  return Array.from({ length: 10 }, () => {
    // Get a random animal for the answer
    const answerIndex = Math.floor(Math.random() * animalsWithImages.length);
    const answer = animalsWithImages[answerIndex];
    
    // Generate 3 wrong options
    const wrongOptions: Animal[] = [];
    while (wrongOptions.length < 3) {
      const wrongIndex = Math.floor(Math.random() * animalsWithImages.length);
      const wrong = animalsWithImages[wrongIndex];
      if (wrong.id !== answer.id && !wrongOptions.some(w => w.id === wrong.id)) {
        wrongOptions.push(wrong);
      }
    }
    
    // Shuffle all options together
    const options = [answer, ...wrongOptions];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return {
      image: `/images/concealed/${answer.image}.png`,
      answer,
      options,
    };
  });
}

function getRandomOptions(correct: Animal, all: Animal[]): Animal[] {
  const options = [correct];
  while (options.length < 4) {
    const random = all[Math.floor(Math.random() * all.length)];
    if (!options.find(a => a.id === random.id)) options.push(random);
  }
  return shuffle(options);
}

type Question = {
  image: string;
  answer: Animal;
  options: Animal[];
};

export function GuessAnimalQuiz() {
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
    if (typeof window !== 'undefined') {
      setQuestions(buildQuestions(animals));
      setIsLoading(false);
    }
  }, [animals]);
  
  // Only proceed if we have questions and are not loading
  if (isLoading || questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  
  const q = questions[current];
  const answeredThis = answered[current];
  const isCorrect = answeredThis && answeredThis === q.answer.id;

  function handleAnswer(optionId: string) {
    if (answeredThis) return;
    setAnswered((prev) => ({ ...prev, [current]: optionId }));
    if (optionId === q.answer.id) setScore((s) => s + 1);
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

  if (showResult) {
    return (
      <Card
        style={{ background: FUWA_BG, borderRadius: 24, fontFamily: FUWA_FONT, textAlign: 'center', padding: 32 }}
        elevation={3}
      >
        <Box mb={2}>
          <span style={{ fontSize: 64, color: FUWA_ACCENT }}>🎉</span>
        </Box>
        <Typography variant="h4" style={{ fontFamily: FUWA_FONT, color: '#222', marginBottom: 8 }}>
          {resultCompleted[locale as 'en' | 'zh-TW']}
        </Typography>
        <Typography variant="h6" style={{ fontSize: 22, color: '#222', marginBottom: 24 }}>
          {resultScore[locale as 'en' | 'zh-TW'](score, questions.length)}
        </Typography>
        
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: FUWA_FONT, fontWeight: 'bold', mb: 2 }}>
            Question Summary:
          </Typography>
          {questions.map((question, index) => {
            const userAnswer = answered[index];
            const isCorrectAnswer = userAnswer === question.answer.id;
            const selectedAnimal = question.options.find(opt => opt.id === userAnswer);
            
            return (
              <Card 
                key={index} 
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  bgcolor: isCorrectAnswer ? 'rgba(167, 233, 175, 0.2)' : 'rgba(255, 179, 179, 0.2)',
                  borderLeft: `4px solid ${isCorrectAnswer ? FUWA_CORRECT : FUWA_WRONG}`,
                  textAlign: 'left'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', mr: 1 }}>{index + 1}.</Typography>
                  <img 
                    src={`/images/concealed/${question.answer.image}.png`} 
                    alt="animal" 
                    style={{ width: 60, height: 40, borderRadius: 8, marginRight: 8 }} 
                  />
                </Box>
                
                <Box sx={{ ml: 4 }}>
                  <Typography>
                    <strong>Your answer:</strong> {selectedAnimal ? `${selectedAnimal.name} / ${selectedAnimal.jname || '?'}` : 'Not answered'} 
                    {isCorrectAnswer ? ' ✅' : ' ❌'}
                  </Typography>
                  
                  {!isCorrectAnswer && (
                    <Typography sx={{ color: 'success.main', fontWeight: 'medium' }}>
                      <strong>Correct answer:</strong> {question.answer.name} / {question.answer.jname || '?'}
                    </Typography>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
        
        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <Button
            key="retry"
            size="large"
            variant="contained"
            onClick={restart}
            sx={{ borderRadius: 2, background: FUWA_ACCENT, color: '#333', fontWeight: 600, fontFamily: FUWA_FONT, mr: 2 }}
          >
            {quizBtn2[locale as 'en' | 'zh-TW']}
          </Button>
          <Button
            key="home"
            size="large"
            variant="outlined"
            href="/"
            sx={{ borderRadius: 2, background: '#fff', color: '#222', fontWeight: 600, fontFamily: FUWA_FONT }}
            startIcon={<span role="img" aria-label="home">🏠</span>}
          >
            Home
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor={FUWA_BG}>
      <Box width={{ xs: '100%', sm: 420, md: 600, lg: 700 }} mx="auto">
        <Card
          sx={{ background: FUWA_CARD, borderRadius: 2.5, boxShadow: '0 4px 24px #ffe0ef88', minWidth: 330, maxWidth: { xs: 390, md: 600, lg: 700 }, fontFamily: FUWA_FONT, p: 3, position: 'relative', width: '100%' }}
          elevation={3}
        >
          {/* Layout with space for Home button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
            {/* Back to Home Button */}
            <Button
              href="/"
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, fontFamily: FUWA_FONT, fontWeight: 600, ml: 2, color: '#222', background: '#fff' }}
              startIcon={<span role="img" aria-label="home">🏠</span>}
            >
              Home
            </Button>
            {/* Score Counter */}
            <Typography variant="subtitle1" sx={{ fontFamily: FUWA_FONT, fontWeight: 700, color: '#222', mr: 2 }}>
              {quizScoreLabel[locale as 'en' | 'zh-TW']} {score} / {questions.length}
            </Typography>
          </Box>
          <Box textAlign="center">
            
            <LinearProgress
              variant="determinate"
              value={((current + 1) / questions.length) * 100}
              sx={{ height: 10, borderRadius: 5, margin: '10px 0 18px 0', background: '#ffe0ef44', '& .MuiLinearProgress-bar': { backgroundColor: FUWA_ACCENT } }}
            />
            
            <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: FUWA_FONT }}>
              {`Question ${current + 1} of ${questions.length}`}
            </Typography>
            
            <Box sx={{ mb: 3, mt: 2 }}>
              <img
                src={q.image}
                alt="animal"
                style={{ width: 180, height: 120, objectFit: 'contain', borderRadius: 16, background: '#fff', boxShadow: '0 2px 12px #ffd6e0' }}
              />
            </Box>
            
            <Typography variant="h6" sx={{ mb: 2, fontFamily: FUWA_FONT }}>
              {locale === 'en' ? 'What animal is this?' : '這是什麼動物？'}
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={1.5} width="100%">
              {q.options.map((opt) => {
                const isCorrect = answeredThis && opt.id === q.answer.id;
                const isWrong = answeredThis && opt.id === answeredThis && answeredThis !== q.answer.id;
                return (
                  <Button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    disabled={!!answeredThis}
                    fullWidth
                    sx={{
                      borderRadius: 1.5,
                      background: answeredThis
                        ? isCorrect
                          ? FUWA_CORRECT
                          : isWrong
                          ? FUWA_WRONG
                          : '#fff'
                        : '#fff',
                      border: '2px solid',
                      borderColor: answeredThis
                        ? isCorrect
                          ? FUWA_CORRECT
                          : isWrong
                          ? FUWA_WRONG
                          : FUWA_ACCENT
                        : FUWA_ACCENT,
                      color: '#222',
                      fontWeight: 600,
                      fontFamily: FUWA_FONT,
                      fontSize: 16,
                      py: 1.5,
                      mb: 0.5,
                      boxShadow: answeredThis && isCorrect ? '0 2px 8px #a7e9af44' : undefined,
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      textAlign: 'left',
                      pl: 3
                    }}
                    startIcon={
                      answeredThis
                        ? isCorrect
                          ? <span role="img" aria-label="correct">✅</span>
                          : isWrong
                          ? <span role="img" aria-label="wrong">❌</span>
                          : undefined
                        : undefined
                    }
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography sx={{ fontWeight: 'bold' }}>{opt.name}</Typography>
                      <Typography sx={{ fontSize: '0.85rem', opacity: 0.9 }}>{opt.jname || '???'}</Typography>
                    </Box>
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
