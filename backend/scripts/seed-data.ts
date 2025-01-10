import { dbService } from '../src/db/database';
import { Category, Word } from '../src/types/dictionary';

const categories: Category[] = [
  { id: 'food', name: 'Food', description: 'Edible items' },
  { id: 'transport', name: 'Transport', description: 'Modes of transportation' },
  { id: 'animals', name: 'Animals', description: 'Living creatures' }
];

const words: Word[] = [
  // Food category
  {
    id: 'moonberry',
    term: 'Moonberry',
    definition: 'A rare luminescent fruit that only ripens under a full moon, known for its silvery glow and sweet, ethereal taste.',
    category: 'food',
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'cloudcake',
    term: 'Cloudcake',
    definition: 'A dessert so light and fluffy that it appears to float on the plate, made with whipped sky-water collected from mountain peaks.',
    category: 'food',
    createdAt: new Date('2023-01-02')
  },
  {
    id: 'spicestorm',
    term: 'Spicestorm',
    definition: 'A legendary seasoning blend that creates a swirling pattern of flavors, each taste revealing a different spice from around the world.',
    category: 'food',
    createdAt: new Date('2023-01-03')
  },

  // Transport category
  {
    id: 'windwalker',
    term: 'Windwalker',
    definition: 'A revolutionary personal transport device that creates invisible air currents for effortless gliding above the ground.',
    category: 'transport',
    createdAt: new Date('2023-01-04')
  },
  {
    id: 'quantumcab',
    term: 'Quantumcab',
    definition: 'A taxi service that utilizes quantum tunneling to instantly transport passengers between fixed points in a city.',
    category: 'transport',
    createdAt: new Date('2023-01-05')
  },
  {
    id: 'nebulasail',
    term: 'Nebulasail',
    definition: 'A solar-powered vehicle with translucent wings that capture and convert starlight into propulsion energy.',
    category: 'transport',
    createdAt: new Date('2023-01-06')
  },

  // Animals category
  {
    id: 'prismacat',
    term: 'Prismacat',
    definition: 'A feline species whose fur changes color based on its mood and the time of day, creating beautiful rainbow patterns.',
    category: 'animals',
    createdAt: new Date('2023-01-07')
  },
  {
    id: 'melodog',
    term: 'Melodog',
    definition: 'A canine breed that communicates through musical tones, capable of harmonizing with other melodogs to create complex songs.',
    category: 'animals',
    createdAt: new Date('2023-01-08')
  },
  {
    id: 'chronobird',
    term: 'Chronobird',
    definition: 'A mysterious avian species that appears to age backwards and can briefly manipulate local time fields with its wings.',
    category: 'animals',
    createdAt: new Date('2023-01-09')
  }
];

async function seedData() {
  try {
    // Save categories first
    dbService.saveCategories(categories);
    console.log('Categories saved successfully');

    // Then save words
    for (const word of words) {
      await dbService.addWord(word);
    }
    console.log('Words saved successfully');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the seed function
seedData(); 