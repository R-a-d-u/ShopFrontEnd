// models/order.model.ts
export interface OrderDto {
    id: string;
    userId: number;
    orderCreatedDate: string;
    orderCompletedDate: string | null;
    totalSum: number;
    shippingFee: number;
    address: string;
    paymentMethod: number;
    orderStatus: number;
    orderItems: OrderItemDto[];
  }
  
  export interface OrderItemDto {
    id: number;
    orderId: string;
    productId: number;
    quantity: number;
    price: number;
    product: ProductDto;
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