import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, createCategoryDto: CreateCategoryDto) {
        const budget = await this.prisma.budget.findUnique({
            where: { id: createCategoryDto.budgetId },
        });

        if (!budget) {
            throw new NotFoundException('Budget not found');
        }

        if (budget.userId !== userId) {
            throw new ForbiddenException('You do not have permission to add a category to this budget');
        }

        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.category.findMany({
            where: {
                budget: {
                    userId: userId,
                },
            },
            include: {
                budget: true,
            }
        });
    }

    async findOne(id: string, userId: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                budget: true,
            },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        if (category.budget.userId !== userId) {
            throw new ForbiddenException('You do not have access to this category');
        }

        return category;
    }

    async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
        await this.findOne(id, userId);

        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
