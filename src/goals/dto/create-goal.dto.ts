import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
    @ApiProperty({ example: 'New Phone' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1000 })
    @IsNumber()
    @Min(0)
    targetAmount: number;

    @ApiProperty({ example: 0, required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    currentAmount?: number;
}
