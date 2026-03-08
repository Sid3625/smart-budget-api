import { PartialType } from '@nestjs/swagger';
import { CreateGoalDto } from './create-goal.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGoalDto extends PartialType(CreateGoalDto) { }

export class DepositGoalDto {
    @ApiProperty({ example: 100 })
    @IsNumber()
    @Min(1)
    amount: number;
}
