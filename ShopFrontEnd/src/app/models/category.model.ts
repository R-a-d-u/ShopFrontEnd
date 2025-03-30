// category.model.ts
export interface CategoryDto {
    id: number;
    name: string;
    lastModifiedDate: string;
  }
  
  export interface CategoryDetailDto {
    id: number;
    name: string;
    products: ProductDto[];
  }
  
  export interface ProductDto {
    id: number;
    productType: number;
    name: string;
    image: string;
    additionalValue: number;
    goldWeightInGrams: number;
    sellingPrice: number;
    categoryId: number;
    description: string;
    stockQuantity: number;
    productState: number;
    lastModifiedDate: string;
  }