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
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bills')
export class BillsController {
    constructor(private readonly billsService: BillsService) { }

    @Post()
    create(@Request() req, @Body() createBillDto: CreateBillDto) {
        return this.billsService.create(req.user.id, createBillDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.billsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.billsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateBillDto: UpdateBillDto,
    ) {
        return this.billsService.update(id, req.user.id, updateBillDto);
    }

    @Patch(':id/pay')
    togglePaid(@Request() req, @Param('id') id: string) {
        return this.billsService.togglePaid(id, req.user.id);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.billsService.remove(id, req.user.id);
    }
}
