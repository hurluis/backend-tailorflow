import { Expose } from "class-transformer";

export class Role{
    @Expose()
    name: string;
}