import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    try {
      return await this.prisma.budget.create({
        data: {
          name: createBudgetDto.name,
          month: createBudgetDto.month,
          year: createBudgetDto.year,
          totalAllocation: createBudgetDto.totalAllocation,
          userId,
          categories: {
            create: {
              name: 'Default',
              limitAmount: createBudgetDto.totalAllocation,
            },
          },
        },
        include: {
          categories: true,
        },
      });
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  async findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: {
        transactions: true,
        categories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
      include: {
        transactions: true,
        categories: true,
      },
    });

    if (!budget || budget.userId !== userId) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    return budget;
  }

  async update(id: string, userId: string, updateBudgetDto: UpdateBudgetDto) {
    await this.findOne(id, userId); // Ensure existence and ownership

    return this.prisma.budget.update({
      where: { id },
      data: updateBudgetDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Ensure existence and ownership

    return this.prisma.budget.delete({
      where: { id },
    });
  }
}
