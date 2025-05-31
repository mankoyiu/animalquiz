import { AnimalDetail } from '../../components/AnimalDetail';
import { GetServerSideProps } from 'next';
import { Animal, getAnimals } from '../../utils/animalData';

interface Props {
  animal: Animal | null;
}

export default function AnimalDetailPage({ animal }: Props) {
  if (!animal) return <div>Animal not found</div>;
  return <AnimalDetail animal={animal} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const animals = getAnimals();
  const animal = animals.find((a) => a.id === id);
  return {
    props: { animal: animal || null },
  };
};
