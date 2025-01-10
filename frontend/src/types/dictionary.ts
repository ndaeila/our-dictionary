export interface CustomField {
  name: string;
  value: string;
}

export interface Word {
  id: string;
  term: string;
  definition: string;
  category: string;
  createdAt: Date;
  customFields?: CustomField[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  icon?: string;
  customIcon?: string;
  path?: string[];
}

export interface Definition {
  id: string;
  categoryId: string;
  term: string;
  meaning: string;
  examples?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}