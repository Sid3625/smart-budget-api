import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillDto {
    @ApiProperty({ example: 'Netflix' })
    @IsString()
    name: string;

    @ApiProperty({ example: 15.99 })
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({ example: '2026-03-31T00:00:00.000Z' })
    @IsDateString()
    dueDate: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isPaid?: boolean;
}
