import { Expose, Type } from "class-transformer";
import { RoleResponseDto } from "src/modules/roles/dto/role-response.dto";

export class EmployeeResponseDto{

    @Expose()
    id_employee: number;
    
    @Expose()
    cc: string;

    @Expose()
    name: string;

    @Expose()
    state: string; 

    @Expose()
    @Type(() => RoleResponseDto) 
    role: RoleResponseDto;

}