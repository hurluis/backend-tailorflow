import { Expose } from "class-transformer";

export class TaskResponseDto{
   
    @Expose()
    id_product: number;

    @Expose()
    id_area: number;
    
    @Expose()
    id_state: number;
    
    @Expose()
    sequence: number;
    
    @Expose()
    id_employee?: number;
    
    @Expose()
    start_date?: Date;

    @Expose()
    end_date?: Date;
}