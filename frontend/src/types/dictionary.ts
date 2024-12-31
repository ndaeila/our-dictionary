export interface CustomField {
  id: string;
  name: string;
  value: string;
}

export interface Word {
  id: string;
  term: string;
  definition: string;
  category: string;
  createdAt: Date;
  customFields: CustomField[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  customIcon?: string;
}