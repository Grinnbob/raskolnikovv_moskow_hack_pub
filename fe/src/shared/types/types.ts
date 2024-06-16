import { IVacancy } from '../const/validations';

//
export type Children = {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  level: number;
  parentId: number | null;
  children: Children[] | [];
};

export interface ICategories {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  level: number;
  parentId: number | null;
  children: ICategories[];
  itemsCount: number;
}
//
export interface Image {
  id: number;
  url: string;
}

export interface Price {
  id: number;
  quantity: number;
  amount: number;
  type: string;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  pcsInStock: number;
  maxDurationMinutes: null | number;
  minDurationMinutes: null | number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  categoryId: number;
  userId: number;
  lng: number;
  lat: number;
  images: Image[];
  prices: Price[];
  isInFavourite?: boolean;
}

//

export interface CategoriesPropertyType {
  propertyType: PropertyType;
}

export interface PropertyType {
  id: string;
  type: string;
  name: string;
  view: string;
  stringValues: any[];
}

export interface ICategory {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  level: number;
  parentId: null;
  categoriesPropertyTypes: CategoriesPropertyType[];
}
//

export type CSRPageProps = {
  searchParams: {
    params: Array<string>;
  };
};

export type VacancyFormState = {
  currentStep: number;
  maxStep: number;
  form: IVacancy;
};

export type VacancyFormSlice = {
  states: Record<string, VacancyFormState>;
};
