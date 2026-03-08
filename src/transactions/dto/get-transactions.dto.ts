import { IsOptional, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class GetTransactionsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsString()
    category?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}
