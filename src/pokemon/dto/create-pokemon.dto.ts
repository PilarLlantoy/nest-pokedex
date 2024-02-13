import { IsInt, IsPositive, IsString, Min, MinLength, minDate } from "class-validator";

export class CreatePokemonDto {
//recordar correr: yarn add class-validator class-transformer y agregar la seccion en main

    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    @IsString()
    @MinLength(1)
    name: string
}
