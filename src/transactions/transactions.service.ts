import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, createTransactionDto: CreateTransactionDto) {
        try {
            console.log('=== Transaction Create Debug ===');
            console.log('User ID:', userId);
            console.log('DTO:', JSON.stringify(createTransactionDto, null, 2));

            const { budgetId, categoryId } = createTransactionDto;

            // Verify budget ownership
            console.log('Checking budget:', budgetId);
            const budget = await this.prisma.budget.findUnique({
                where: { id: budgetId },
            });

            if (!budget) {
                throw new NotFoundException('Budget not found');
            }

            if (budget.userId !== userId) {
                throw new ForbiddenException('You do not have permission to add a transaction to this budget');
            }

            // Verify category belongs to budget
            console.log('Checking category:', categoryId);
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            if (category.budgetId !== budgetId) {
                throw new BadRequestException('Category does not belong to the specified budget');
            }

            console.log('Creating transaction with data:', createTransactionDto);

            // Convert date string to Date object if provided
            const transactionData: any = {
                type: createTransactionDto.type,
                amount: createTransactionDto.amount,
                description: createTransactionDto.description,
                budgetId: createTransactionDto.budgetId,
                categoryId: createTransactionDto.categoryId,
                userId,
            };

            if (createTransactionDto.date) {
                transactionData.date = new Date(createTransactionDto.date);
            }

            const result = await this.prisma.transaction.create({
                data: transactionData,
            });
            console.log('Transaction created successfully:', result.id);
            return result;
        } catch (error) {
            console.error('=== Transaction Create Error ===');
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Full error:', error);
            throw error;
        }
    }

    async findAll(userId: string) {
        const transactions = await this.prisma.transaction.findMany({
            where: { userId },
            include: {
                budget: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return {
            transactions,
            total: transactions.length,
            totalPages: 1,
            currentPage: 1,
        };
    }

    async findOne(id: string, userId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                budget: true,
                category: true,
            },
        });

        if (!transaction || transaction.userId !== userId) {
            throw new NotFoundException(`Transaction with ID ${id} not found`);
        }

        return transaction;
    }

    async update(id: string, userId: string, updateTransactionDto: UpdateTransactionDto) {
        await this.findOne(id, userId); // Ensure transaction exists and belongs to user

        // If budgetId or categoryId is being updated, validate them
        if (updateTransactionDto.budgetId || updateTransactionDto.categoryId) {
            const budgetId = updateTransactionDto.budgetId;
            const categoryId = updateTransactionDto.categoryId;

            if (budgetId) {
                // Verify budget ownership
                const budget = await this.prisma.budget.findUnique({
                    where: { id: budgetId },
                });

                if (!budget) {
                    throw new NotFoundException('Budget not found');
                }

                if (budget.userId !== userId) {
                    throw new ForbiddenException('You do not have permission to use this budget');
                }
            }

            if (categoryId) {
                // Verify category exists
                const category = await this.prisma.category.findUnique({
                    where: { id: categoryId },
                });

                if (!category) {
                    throw new NotFoundException('Category not found');
                }

                // If budgetId is being updated, verify category belongs to new budget
                // Otherwise verify it belongs to the transaction's current budget
                const targetBudgetId = budgetId || (await this.findOne(id, userId)).budgetId;
                if (category.budgetId !== targetBudgetId) {
                    throw new BadRequestException('Category does not belong to the specified budget');
                }
            }
        }

        // Convert date string to Date object if provided
        const updateData: any = { ...updateTransactionDto };
        if (updateTransactionDto.date) {
            updateData.date = new Date(updateTransactionDto.date);
        }

        return this.prisma.transaction.update({
            where: { id },
            data: updateData,
            include: {
                budget: true,
                category: true,
            },
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);

        return this.prisma.transaction.delete({
            where: { id },
        });
    }
}
