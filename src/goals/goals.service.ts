import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto, DepositGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createGoalDto: CreateGoalDto) {
        return this.prisma.goal.create({
            data: {
                ...createGoalDto,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.goal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const goal = await this.prisma.goal.findFirst({
            where: { id, userId },
        });
        if (!goal) throw new NotFoundException('Goal not found');
        return goal;
    }

    async update(id: string, userId: string, updateGoalDto: UpdateGoalDto) {
        await this.findOne(id, userId);
        return this.prisma.goal.update({
            where: { id },
            data: updateGoalDto,
        });
    }

    async deposit(id: string, userId: string, depositGoalDto: DepositGoalDto) {
        const goal = await this.findOne(id, userId);
        return this.prisma.goal.update({
            where: { id },
            data: {
                currentAmount: Number(goal.currentAmount) + depositGoalDto.amount,
            },
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);
        return this.prisma.goal.delete({
            where: { id },
        });
    }
}
