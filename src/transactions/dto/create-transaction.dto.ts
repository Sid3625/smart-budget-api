import { IsNotEmpty, IsNumber, Min, IsUUID, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
    @IsEnum(TransactionType)
    @IsNotEmpty()
    type: TransactionType;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    amount: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    date?: string;

    @IsUUID()
    budgetId: string;

    @IsUUID()
    categoryId: string;
}
