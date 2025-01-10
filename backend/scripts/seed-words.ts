import { dbService } from '../src/db/database';
import { Word } from '../src/types/dictionary';

const words: Word[] = [
  // Finance
  {
    id: 'roi',
    term: 'ROI',
    definition: 'Return on Investment - A performance measure used to evaluate the efficiency of an investment',
    category: 'finance',
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'apr',
    term: 'APR',
    definition: 'Annual Percentage Rate - The yearly interest rate charged for borrowing or earned through investing',
    category: 'finance',
    createdAt: new Date('2023-01-02')
  },
  {
    id: 'liquidity',
    term: 'Liquidity',
    definition: 'The degree to which an asset can be quickly bought or sold without affecting its price',
    category: 'finance',
    createdAt: new Date('2023-01-03')
  },
  {
    id: 'hedge',
    term: 'Hedge',
    definition: 'An investment made to reduce the risk of adverse price movements',
    category: 'finance',
    createdAt: new Date('2023-01-04')
  },

  // Accounting
  {
    id: 'gaap',
    term: 'GAAP',
    definition: 'Generally Accepted Accounting Principles - Standard guidelines for financial accounting and reporting',
    category: 'accounting',
    createdAt: new Date('2023-01-05')
  },
  {
    id: 'depreciation',
    term: 'Depreciation',
    definition: 'The systematic allocation of an asset\'s cost over its useful life',
    category: 'accounting',
    createdAt: new Date('2023-01-06')
  },
  {
    id: 'accounts-payable',
    term: 'Accounts Payable',
    definition: 'Money owed by a business to its suppliers or vendors',
    category: 'accounting',
    createdAt: new Date('2023-01-07')
  },

  // Marketing
  {
    id: 'cta',
    term: 'CTA',
    definition: 'Call to Action - A prompt encouraging an immediate response or action',
    category: 'marketing',
    createdAt: new Date('2023-01-08')
  },
  {
    id: 'usp',
    term: 'USP',
    definition: 'Unique Selling Proposition - A factor that differentiates a product from its competitors',
    category: 'marketing',
    createdAt: new Date('2023-01-09')
  },
  {
    id: 'brand-equity',
    term: 'Brand Equity',
    definition: 'The commercial value derived from consumer perception of a brand name',
    category: 'marketing',
    createdAt: new Date('2023-01-10')
  },

  // Digital Marketing
  {
    id: 'seo',
    term: 'SEO',
    definition: 'Search Engine Optimization - The process of improving website visibility in search results',
    category: 'digital-marketing',
    createdAt: new Date('2023-01-11')
  },
  {
    id: 'ppc',
    term: 'PPC',
    definition: 'Pay Per Click - An advertising model where payment is based on click-throughs',
    category: 'digital-marketing',
    createdAt: new Date('2023-01-12')
  },
  {
    id: 'ctr',
    term: 'CTR',
    definition: 'Click Through Rate - The ratio of users who click on a link to the total users who view it',
    category: 'digital-marketing',
    createdAt: new Date('2023-01-13')
  },

  // HR
  {
    id: 'onboarding',
    term: 'Onboarding',
    definition: 'The process of integrating new employees into an organization',
    category: 'hr',
    createdAt: new Date('2023-01-14')
  },
  {
    id: 'kpi',
    term: 'KPI',
    definition: 'Key Performance Indicator - Measurable values that demonstrate effectiveness',
    category: 'hr',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'retention',
    term: 'Retention',
    definition: 'The ability of an organization to retain its employees',
    category: 'hr',
    createdAt: new Date('2023-01-16')
  },

  // Legal
  {
    id: 'nda',
    term: 'NDA',
    definition: 'Non-Disclosure Agreement - A contract creating a confidential relationship',
    category: 'legal',
    createdAt: new Date('2023-01-17')
  },
  {
    id: 'liability',
    term: 'Liability',
    definition: 'Legal responsibility for one\'s acts or omissions',
    category: 'legal',
    createdAt: new Date('2023-01-18')
  },
  {
    id: 'compliance',
    term: 'Compliance',
    definition: 'The act of conforming to rules, regulations, and standards',
    category: 'legal',
    createdAt: new Date('2023-01-19')
  },

  // Technology
  {
    id: 'api',
    term: 'API',
    definition: 'Application Programming Interface - A set of rules for building software applications',
    category: 'tech',
    createdAt: new Date('2023-01-20')
  },
  {
    id: 'saas',
    term: 'SaaS',
    definition: 'Software as a Service - A software licensing and delivery model',
    category: 'tech',
    createdAt: new Date('2023-01-21')
  },
  {
    id: 'cloud',
    term: 'Cloud Computing',
    definition: 'The delivery of computing services over the internet',
    category: 'tech',
    createdAt: new Date('2023-01-22')
  },

  // Project Management
  {
    id: 'agile',
    term: 'Agile',
    definition: 'An iterative approach to project management and software development',
    category: 'project-management',
    createdAt: new Date('2023-01-23')
  },
  {
    id: 'sprint',
    term: 'Sprint',
    definition: 'A fixed time period during which specific work has to be completed',
    category: 'project-management',
    createdAt: new Date('2023-01-24')
  },
  {
    id: 'milestone',
    term: 'Milestone',
    definition: 'A significant point or event in a project timeline',
    category: 'project-management',
    createdAt: new Date('2023-01-25')
  },

  // Operations
  {
    id: 'lean',
    term: 'Lean',
    definition: 'A systematic method for waste minimization within manufacturing',
    category: 'operations',
    createdAt: new Date('2023-01-26')
  },
  {
    id: 'six-sigma',
    term: 'Six Sigma',
    definition: 'A set of techniques for process improvement',
    category: 'operations',
    createdAt: new Date('2023-01-27')
  },
  {
    id: 'supply-chain',
    term: 'Supply Chain',
    definition: 'The network between a company and its suppliers to produce and distribute products',
    category: 'operations',
    createdAt: new Date('2023-01-28')
  },

  // Strategy
  {
    id: 'swot',
    term: 'SWOT',
    definition: 'Strengths, Weaknesses, Opportunities, Threats - A strategic planning technique',
    category: 'strategy',
    createdAt: new Date('2023-01-29')
  },
  {
    id: 'competitive-advantage',
    term: 'Competitive Advantage',
    definition: 'An attribute that allows an organization to outperform its competitors',
    category: 'strategy',
    createdAt: new Date('2023-01-30')
  },
  {
    id: 'market-share',
    term: 'Market Share',
    definition: 'The portion of a market controlled by a particular company or product',
    category: 'strategy',
    createdAt: new Date('2023-01-31')
  },

  // More Finance Terms
  {
    id: 'leverage',
    term: 'Leverage',
    definition: 'The use of borrowed capital to increase potential return on investment',
    category: 'finance',
    createdAt: new Date('2023-02-01')
  },
  {
    id: 'arbitrage',
    term: 'Arbitrage',
    definition: 'The practice of taking advantage of price differences between markets',
    category: 'finance',
    createdAt: new Date('2023-02-02')
  },
  {
    id: 'derivatives',
    term: 'Derivatives',
    definition: 'Financial instruments whose value is derived from underlying assets',
    category: 'finance',
    createdAt: new Date('2023-02-03')
  },

  // More Accounting Terms
  {
    id: 'accrual',
    term: 'Accrual',
    definition: 'Recognition of revenue when earned or expenses when incurred',
    category: 'accounting',
    createdAt: new Date('2023-02-04')
  },
  {
    id: 'amortization',
    term: 'Amortization',
    definition: 'Spreading payments over multiple periods for accounting purposes',
    category: 'accounting',
    createdAt: new Date('2023-02-05')
  },
  {
    id: 'reconciliation',
    term: 'Reconciliation',
    definition: 'Process of matching and comparing financial records',
    category: 'accounting',
    createdAt: new Date('2023-02-06')
  },

  // More Marketing Terms
  {
    id: 'guerrilla-marketing',
    term: 'Guerrilla Marketing',
    definition: 'Unconventional marketing tactics aimed at maximum exposure with minimal resources',
    category: 'marketing',
    createdAt: new Date('2023-02-07')
  },
  {
    id: 'market-penetration',
    term: 'Market Penetration',
    definition: 'Strategy to increase market share of existing products in current markets',
    category: 'marketing',
    createdAt: new Date('2023-02-08')
  },
  {
    id: 'positioning',
    term: 'Positioning',
    definition: 'How a brand is perceived in the minds of target customers',
    category: 'marketing',
    createdAt: new Date('2023-02-09')
  },

  // More Digital Marketing Terms
  {
    id: 'serp',
    term: 'SERP',
    definition: 'Search Engine Results Page - The page displayed by search engines in response to a query',
    category: 'digital-marketing',
    createdAt: new Date('2023-02-10')
  },
  {
    id: 'remarketing',
    term: 'Remarketing',
    definition: 'Targeting ads to users who have previously visited your website',
    category: 'digital-marketing',
    createdAt: new Date('2023-02-11')
  },
  {
    id: 'attribution',
    term: 'Attribution',
    definition: 'Identifying which marketing channels contribute to conversions',
    category: 'digital-marketing',
    createdAt: new Date('2023-02-12')
  },

  // More HR Terms
  {
    id: 'talent-acquisition',
    term: 'Talent Acquisition',
    definition: 'Process of finding and acquiring skilled human labor for organizational needs',
    category: 'hr',
    createdAt: new Date('2023-02-13')
  },
  {
    id: 'succession-planning',
    term: 'Succession Planning',
    definition: 'Process of identifying and developing future leaders for key positions',
    category: 'hr',
    createdAt: new Date('2023-02-14')
  },
  {
    id: 'compensation',
    term: 'Compensation',
    definition: 'Total package of wages, salaries, benefits provided to employees',
    category: 'hr',
    createdAt: new Date('2023-02-15')
  },

  // More Legal Terms
  {
    id: 'tort',
    term: 'Tort',
    definition: 'Civil wrong that causes harm or injury, leading to legal liability',
    category: 'legal',
    createdAt: new Date('2023-02-16')
  },
  {
    id: 'indemnification',
    term: 'Indemnification',
    definition: 'Agreement to compensate for losses or damages incurred',
    category: 'legal',
    createdAt: new Date('2023-02-17')
  },
  {
    id: 'force-majeure',
    term: 'Force Majeure',
    definition: 'Unforeseeable circumstances preventing contract fulfillment',
    category: 'legal',
    createdAt: new Date('2023-02-18')
  },

  // More Technology Terms
  {
    id: 'blockchain',
    term: 'Blockchain',
    definition: 'Decentralized, distributed ledger technology',
    category: 'tech',
    createdAt: new Date('2023-02-19')
  },
  {
    id: 'microservices',
    term: 'Microservices',
    definition: 'Software architecture style where applications are collections of loosely coupled services',
    category: 'tech',
    createdAt: new Date('2023-02-20')
  },
  {
    id: 'devops',
    term: 'DevOps',
    definition: 'Combination of software development and IT operations practices',
    category: 'tech',
    createdAt: new Date('2023-02-21')
  },

  // More Project Management Terms
  {
    id: 'kanban',
    term: 'Kanban',
    definition: 'Visual system for managing work as it moves through a process',
    category: 'project-management',
    createdAt: new Date('2023-02-22')
  },
  {
    id: 'critical-path',
    term: 'Critical Path',
    definition: 'Sequence of dependent tasks determining minimum project duration',
    category: 'project-management',
    createdAt: new Date('2023-02-23')
  },
  {
    id: 'scope-creep',
    term: 'Scope Creep',
    definition: 'Uncontrolled changes or growth in project scope',
    category: 'project-management',
    createdAt: new Date('2023-02-24')
  },

  // More Operations Terms
  {
    id: 'kaizen',
    term: 'Kaizen',
    definition: 'Japanese business philosophy of continuous improvement',
    category: 'operations',
    createdAt: new Date('2023-02-25')
  },
  {
    id: 'bottleneck',
    term: 'Bottleneck',
    definition: 'Point of congestion in a production system',
    category: 'operations',
    createdAt: new Date('2023-02-26')
  },
  {
    id: 'just-in-time',
    term: 'Just-in-Time',
    definition: 'Production strategy to reduce inventory costs',
    category: 'operations',
    createdAt: new Date('2023-02-27')
  },

  // More Strategy Terms
  {
    id: 'blue-ocean',
    term: 'Blue Ocean Strategy',
    definition: 'Creating new, uncontested market space',
    category: 'strategy',
    createdAt: new Date('2023-02-28')
  },
  {
    id: 'vertical-integration',
    term: 'Vertical Integration',
    definition: 'Control of multiple stages of production/distribution',
    category: 'strategy',
    createdAt: new Date('2023-03-01')
  },
  {
    id: 'diversification',
    term: 'Diversification',
    definition: 'Strategy of entering new markets with new products',
    category: 'strategy',
    createdAt: new Date('2023-03-02')
  },

  // Even More Finance Terms
  {
    id: 'forex',
    term: 'Forex',
    definition: 'Foreign Exchange Market - Global market for trading international currencies',
    category: 'finance',
    createdAt: new Date('2023-03-03')
  },
  {
    id: 'bull-market',
    term: 'Bull Market',
    definition: 'Market condition where prices are rising or expected to rise',
    category: 'finance',
    createdAt: new Date('2023-03-04')
  },
  {
    id: 'portfolio',
    term: 'Portfolio',
    definition: 'Collection of financial investments like stocks, bonds, commodities',
    category: 'finance',
    createdAt: new Date('2023-03-05')
  },

  // Even More Accounting Terms
  {
    id: 'balance-sheet',
    term: 'Balance Sheet',
    definition: 'Financial statement showing assets, liabilities, and equity',
    category: 'accounting',
    createdAt: new Date('2023-03-06')
  },
  {
    id: 'cash-flow',
    term: 'Cash Flow',
    definition: 'Net amount of cash moving into and out of a business',
    category: 'accounting',
    createdAt: new Date('2023-03-07')
  },
  {
    id: 'overhead',
    term: 'Overhead',
    definition: 'Ongoing business expenses not directly related to products or services',
    category: 'accounting',
    createdAt: new Date('2023-03-08')
  },

  // Even More Marketing Terms
  {
    id: 'market-segmentation',
    term: 'Market Segmentation',
    definition: 'Dividing a market into distinct groups with similar characteristics',
    category: 'marketing',
    createdAt: new Date('2023-03-09')
  },
  {
    id: 'viral-marketing',
    term: 'Viral Marketing',
    definition: 'Marketing technique where information spreads like a virus',
    category: 'marketing',
    createdAt: new Date('2023-03-10')
  },
  {
    id: 'brand-awareness',
    term: 'Brand Awareness',
    definition: 'Extent to which consumers recognize a brand',
    category: 'marketing',
    createdAt: new Date('2023-03-11')
  },

  // Even More Digital Marketing Terms
  {
    id: 'conversion-rate',
    term: 'Conversion Rate',
    definition: 'Percentage of visitors who take desired action on website',
    category: 'digital-marketing',
    createdAt: new Date('2023-03-12')
  },
  {
    id: 'bounce-rate',
    term: 'Bounce Rate',
    definition: 'Percentage of visitors who leave site after viewing only one page',
    category: 'digital-marketing',
    createdAt: new Date('2023-03-13')
  },
  {
    id: 'ab-testing',
    term: 'A/B Testing',
    definition: 'Comparing two versions of content to see which performs better',
    category: 'digital-marketing',
    createdAt: new Date('2023-03-14')
  },

  // Even More HR Terms
  {
    id: 'employee-engagement',
    term: 'Employee Engagement',
    definition: 'Emotional commitment employees have to organization and goals',
    category: 'hr',
    createdAt: new Date('2023-03-15')
  },
  {
    id: 'performance-review',
    term: 'Performance Review',
    definition: 'Formal assessment of employee\'s work performance',
    category: 'hr',
    createdAt: new Date('2023-03-16')
  },
  {
    id: 'workplace-culture',
    term: 'Workplace Culture',
    definition: 'Values, beliefs, and behaviors that characterize an organization',
    category: 'hr',
    createdAt: new Date('2023-03-17')
  },

  // Even More Legal Terms
  {
    id: 'intellectual-property',
    term: 'Intellectual Property',
    definition: 'Creations of mind that have commercial value',
    category: 'legal',
    createdAt: new Date('2023-03-18')
  },
  {
    id: 'arbitration',
    term: 'Arbitration',
    definition: 'Process of resolving disputes outside the court system',
    category: 'legal',
    createdAt: new Date('2023-03-19')
  },
  {
    id: 'due-diligence',
    term: 'Due Diligence',
    definition: 'Investigation or audit of potential investment or product',
    category: 'legal',
    createdAt: new Date('2023-03-20')
  },

  // Even More Technology Terms
  {
    id: 'machine-learning',
    term: 'Machine Learning',
    definition: 'AI systems that can learn and improve from experience',
    category: 'tech',
    createdAt: new Date('2023-03-21')
  },
  {
    id: 'cybersecurity',
    term: 'Cybersecurity',
    definition: 'Practice of protecting systems and networks from digital attacks',
    category: 'tech',
    createdAt: new Date('2023-03-22')
  },
  {
    id: 'big-data',
    term: 'Big Data',
    definition: 'Extremely large data sets analyzed to reveal patterns and trends',
    category: 'tech',
    createdAt: new Date('2023-03-23')
  },

  // Even More Project Management Terms
  {
    id: 'waterfall',
    term: 'Waterfall',
    definition: 'Linear project management approach where each phase depends on previous',
    category: 'project-management',
    createdAt: new Date('2023-03-24')
  },
  {
    id: 'stakeholder',
    term: 'Stakeholder',
    definition: 'Person or group with interest in project outcome',
    category: 'project-management',
    createdAt: new Date('2023-03-25')
  },
  {
    id: 'risk-management',
    term: 'Risk Management',
    definition: 'Process of identifying and mitigating potential project risks',
    category: 'project-management',
    createdAt: new Date('2023-03-26')
  },

  // Even More Operations Terms
  {
    id: 'quality-control',
    term: 'Quality Control',
    definition: 'System for maintaining standards in manufacturing',
    category: 'operations',
    createdAt: new Date('2023-03-27')
  },
  {
    id: 'inventory-management',
    term: 'Inventory Management',
    definition: 'Supervision of non-capitalized assets and stock items',
    category: 'operations',
    createdAt: new Date('2023-03-28')
  },
  {
    id: 'logistics',
    term: 'Logistics',
    definition: 'Detailed coordination of complex operations',
    category: 'operations',
    createdAt: new Date('2023-03-29')
  },

  // Even More Strategy Terms
  {
    id: 'core-competency',
    term: 'Core Competency',
    definition: 'Unique capability that provides competitive advantage',
    category: 'strategy',
    createdAt: new Date('2023-03-30')
  },
  {
    id: 'benchmarking',
    term: 'Benchmarking',
    definition: 'Comparing business processes against industry best practices',
    category: 'strategy',
    createdAt: new Date('2023-03-31')
  },
  {
    id: 'strategic-alliance',
    term: 'Strategic Alliance',
    definition: 'Agreement between firms to work together toward common objectives',
    category: 'strategy',
    createdAt: new Date('2023-04-01')
  }
];

async function seedWords() {
  console.log('Starting to seed words...');
  try {
    for (const word of words) {
      await dbService.addWord(word);
      console.log(`Added word: ${word.term}`);
    }
    console.log('Successfully seeded all words!');
  } catch (error) {
    console.error('Error seeding words:', error);
  }
}

// Run the seed function
seedWords(); 