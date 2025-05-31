import { AnimalList } from '../components/AnimalList';
import Link from 'next/link';
import { useContext } from 'react';
import { LocaleContext } from './_app';
import { siteTitle, quizDesc, quizBtn1, quizBtn2, animalListTitle } from '../utils/i18n';

const buttonStyle = {
  display: 'inline-block',
  padding: '12px 20px',
  borderRadius: '12px',
  fontFamily: 'Comic Sans MS, cursive',
  background: '#ffd6e0',
  border: 'none',
  color: '#222',
  fontWeight: 700,
  fontSize: '16px',
  cursor: 'pointer',
  margin: '10px 0',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textDecoration: 'none'
};

export default function Home() {
  const { locale } = useContext(LocaleContext);
  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Comic Sans MS, cursive', color: '#333', textAlign: 'center', marginBottom: 28 }}>{siteTitle[locale]}</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        marginBottom: 40,
        justifyContent: 'center',
        flexWrap: 'nowrap',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '100%',
      }}>
        {/* Responsive: stack vertically on mobile */}
        <style>{`
          @media (max-width: 700px) {
            .main-cards {
              flex-direction: column !important;
              gap: 20px !important;
            }
          }
        `}</style>
        {/* Animal Names Matching Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff7fa 70%, #ffd6e0 100%)',
            borderRadius: 26,
            boxShadow: '0 8px 32px #ffd6e099',
            minWidth: 320,
            maxWidth: 380,
            flex: '1 1 320px',
            padding: '36px 28px 28px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0 8px',
            transition: 'transform 0.18s, box-shadow 0.18s',
            cursor: 'pointer',
            border: '2px solid #ffd6e0',
            position: 'relative',
          }}
          tabIndex={0}
          role="link"
          onClick={() => window.location.href = '/quiz'}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = '/quiz'; }}
          onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'none')}
        >
          <span style={{ fontSize: 54, marginBottom: 18, display: 'block' }}>🔤</span>
          <span style={{ fontWeight: 800, fontSize: 26, color: '#d72660', fontFamily: 'Comic Sans MS, cursive', marginBottom: 8, textAlign: 'center' }}>{quizBtn1[locale]}</span>
          <span style={{ fontSize: 17, color: '#444', marginBottom: 24, textAlign: 'center', display: 'block', fontFamily: 'Comic Sans MS, cursive' }}>{locale === 'zh-TW' ? '配對動物的英文和日文名稱，挑戰你的記憶力！' : 'Match animal names in English and Japanese. Test your memory!'}</span>
          <button
            style={{
              marginTop: 'auto',
              padding: '12px 34px',
              borderRadius: 14,
              background: '#ffd6e0',
              border: 'none',
              color: '#222',
              fontWeight: 700,
              fontSize: 18,
              fontFamily: 'Comic Sans MS, cursive',
              boxShadow: '0 2px 12px #ffd6e055',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onClick={e => { e.stopPropagation(); window.location.href = '/quiz'; }}
            tabIndex={-1}
          >{locale === 'zh-TW' ? '開始配對' : 'Start Matching'}</button>
        </div>
        {/* Guess Animal Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f5faff 70%, #b3e0ff 100%)',
            borderRadius: 26,
            boxShadow: '0 8px 32px #b3e0ff66',
            minWidth: 320,
            maxWidth: 380,
            flex: '1 1 320px',
            padding: '36px 28px 28px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0 8px',
            transition: 'transform 0.18s, box-shadow 0.18s',
            cursor: 'pointer',
            border: '2px solid #b3e0ff',
            position: 'relative',
          }}
          tabIndex={0}
          role="link"
          onClick={() => window.location.href = '/guess-animal'}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = '/guess-animal'; }}
          onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'none')}
        >
          <span style={{ fontSize: 54, marginBottom: 18, display: 'block' }}>🦁</span>
          <span style={{ fontWeight: 800, fontSize: 26, color: '#1e88e5', fontFamily: 'Comic Sans MS, cursive', marginBottom: 8, textAlign: 'center' }}>{quizBtn2[locale]}</span>
          <span style={{ fontSize: 17, color: '#444', marginBottom: 24, textAlign: 'center', display: 'block', fontFamily: 'Comic Sans MS, cursive' }}>{locale === 'zh-TW' ? '根據圖片猜猜是哪一種動物，看看你能認出幾個！' : 'Guess the animal from its picture. How many can you recognize?'}</span>
          <button
            style={{
              marginTop: 'auto',
              padding: '12px 34px',
              borderRadius: 14,
              background: '#b3e0ff',
              border: 'none',
              color: '#222',
              fontWeight: 700,
              fontSize: 18,
              fontFamily: 'Comic Sans MS, cursive',
              boxShadow: '0 2px 12px #b3e0ff55',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onClick={e => { e.stopPropagation(); window.location.href = '/guess-animal'; }}
            tabIndex={-1}
          >{locale === 'zh-TW' ? '開始猜動物' : 'Start Guessing'}</button>
        </div>
      </div>
      <AnimalList title={animalListTitle[locale]} />
    </div>
  );
}
