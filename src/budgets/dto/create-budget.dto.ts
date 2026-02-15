import { IsNotEmpty, IsString, IsNumber, Min, IsInt, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(1)
    @Max(12)
    @Type(() => Number)
    month: number;

    @IsInt()
    @Min(2000)
    @Type(() => Number)
    year: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    totalAllocation: number;
}
