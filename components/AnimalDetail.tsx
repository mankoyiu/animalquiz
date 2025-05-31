import React from 'react';
import styles from '../styles/AnimalDetail.module.css';
import { Animal } from '../utils/animalData';

export function AnimalDetail({ animal }: { animal: Animal }) {
  return (
    <div className={styles.container}>
      <img src={`/images/${animal.image}.jpeg`} alt={animal.name} className={styles.image} />
      <h2>{animal.name} <span style={{ color: '#888', fontSize: '1.2em' }}>{animal.jname}</span></h2>
      <p>ID: {animal.id}</p>
    </div>
  );
}
