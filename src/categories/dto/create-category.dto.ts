import { IsNotEmpty, IsString, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0)
    limitAmount: number;

    @IsUUID()
    budgetId: string;
}
