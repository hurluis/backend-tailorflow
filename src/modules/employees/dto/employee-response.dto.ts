import { Expose } from "class-transformer";

export class EmployeeResponseDto{
    
    @Expose()
    cc: number;

    @Expose()
    name: string;

    @Expose()
    password: string;

    @Expose()
    role_name: string;

}