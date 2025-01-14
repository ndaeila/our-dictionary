export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  icon?: string;
}

export interface Word {
  id: string;
  term: string;
  definition: string;
  category: string;
  createdAt: Date;
  customFields?: CustomField[];
}

export interface CustomField {
  name: string;
  value: string;
}

export interface Definition {
  id: string;
  categoryId: string;
  term: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
} 