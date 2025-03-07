export enum UserAccessType {
    Customer = 1,  // Update these values to match your backend enum
    Employee = 2,
    Admin = 3
  }
  
  export interface UserDto {
    id: number;
    name: string;
    email: string;
    userAccessType: UserAccessType;
    lastModifyDate: string;  // Using string for date from API
    isDeleted: boolean;
  }
  
  export interface UserDtoConnect {
    email: string;
    password: string;
  }
  
  export interface UserDtoAdd {
    name: string;
    email: string;
    password: string;
    userAccessType: UserAccessType;
    lastModifyDate: Date;
    isDeleted: boolean;
  }