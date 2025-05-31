import React from 'react';
import Link from 'next/link';
import { Animal, getAnimals } from '../utils/animalData';
import styles from '../styles/AnimalList.module.css';

interface AnimalListProps {
  title?: string;
}

export function AnimalList({ title }: AnimalListProps) {
  // Responsive CSS for grid columns
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .animal-grid-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
      @media (max-width: 1000px) {
        .animal-grid-list {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 600px) {
        .animal-grid-list {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const animals = getAnimals();
  return (
    <div className={styles.container} style={{ maxWidth: 1100, margin: '0 auto' }}>
      {title && (
        <h2 style={{ fontFamily: 'Comic Sans MS, cursive', color: '#222', textAlign: 'center', marginBottom: 20, fontSize: 26, fontWeight: 700 }}>{title}</h2>
      )}
      <ul className={styles.list} style={{ padding: 0, listStyle: 'none', margin: 0 }}>
        {animals.map((animal) => (
          <li key={animal.id} className={styles.listItem} style={{
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 4px 18px #ffd6e055',
            padding: 32,
            minWidth: 200,
            maxWidth: 240,
            minHeight: 220,
            textAlign: 'center',
            fontFamily: 'Comic Sans MS, cursive',
            fontWeight: 700,
            color: '#444',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transition: 'transform 0.15s',
          }}>
            <Link href={`/animal/${animal.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <img src={`/images/${animal.image}.jpeg`} alt={animal.name} style={{ width: 120, height: 90, objectFit: 'contain', marginBottom: 14, borderRadius: 12, background: '#fff8f0', boxShadow: '0 2px 10px #ffd6e033' }} />
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{animal.name}</div>
              <div style={{ color: '#888', fontSize: 18, fontWeight: 500 }}>{animal.jname}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
