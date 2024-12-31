import { Category, Word } from '../types/dictionary';

export const initialCategories: Category[] = [
  {
    id: 'tech',
    name: 'Technology',
    description: 'Tech-related terminology',
    icon: 'Monitor',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Scientific concepts',
    icon: 'FlaskConical',
  },
  {
    id: 'art',
    name: 'Art',
    description: 'Art and design terms',
    icon: 'Palette',
  },
];

export const initialWords: Word[] = [
  {
    id: '1',
    term: 'Pixelate',
    definition: 'The process of creating art using small digital squares',
    category: 'art',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '2',
    term: 'Cloudify',
    definition: 'To transform traditional software into cloud-based solutions',
    category: 'tech',
    createdAt: new Date('2024-03-11'),
  },
  {
    id: '3',
    term: 'Quantumize',
    definition: 'To apply quantum mechanics principles to everyday phenomena',
    category: 'science',
    createdAt: new Date('2024-03-12'),
  },
];