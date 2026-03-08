import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createBillDto: CreateBillDto) {
        return this.prisma.recurringBill.create({
            data: {
                ...createBillDto,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.recurringBill.findMany({
            where: { userId },
            orderBy: { dueDate: 'asc' },
        });
    }

    async findOne(id: string, userId: string) {
        const bill = await this.prisma.recurringBill.findFirst({
            where: { id, userId },
        });
        if (!bill) throw new NotFoundException('Bill not found');
        return bill;
    }

    async update(id: string, userId: string, updateBillDto: UpdateBillDto) {
        await this.findOne(id, userId);
        return this.prisma.recurringBill.update({
            where: { id },
            data: updateBillDto,
        });
    }

    async togglePaid(id: string, userId: string) {
        const bill = await this.findOne(id, userId);
        return this.prisma.recurringBill.update({
            where: { id },
            data: { isPaid: !bill.isPaid },
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);
        return this.prisma.recurringBill.delete({
            where: { id },
        });
    }
}
