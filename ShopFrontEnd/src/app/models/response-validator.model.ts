// models/response-validator.model.ts
export interface ResponseValidator<T> {
    isSuccess: boolean;
    result: T;
    errorMessage: string | null;
  }