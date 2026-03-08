import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto, DepositGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Post()
    create(@Request() req, @Body() createGoalDto: CreateGoalDto) {
        return this.goalsService.create(req.user.id, createGoalDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.goalsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.goalsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateGoalDto: UpdateGoalDto,
    ) {
        return this.goalsService.update(id, req.user.id, updateGoalDto);
    }

    @Patch(':id/deposit')
    deposit(
        @Request() req,
        @Param('id') id: string,
        @Body() depositGoalDto: DepositGoalDto,
    ) {
        return this.goalsService.deposit(id, req.user.id, depositGoalDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.goalsService.remove(id, req.user.id);
    }
}
