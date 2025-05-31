import animalData from '../public/data.json';

export interface Animal {
  id: string;
  name: string;
  jname?: string;
  image: string;
}

export function getAnimals(): Animal[] {
  return animalData;
}
