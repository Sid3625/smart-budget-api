import { IsNotEmpty, IsString, IsNumber, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  limitAmount: number;

  @ApiProperty()
  @IsUUID()
  budgetId: string;
}
