export enum UserAccessType {
    Customer = 1,  
    Employee = 2,
    Admin = 3
  }
  
  export interface UserDto {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    userAccessType: UserAccessType;
    lastModifyDate: string;  
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
    phoneNumber: string;
    userAccessType: UserAccessType;
    lastModifyDate: Date;
    isDeleted: boolean;
  }