import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @Req() req,
    @Body() body: { name?: string; email?: string },
  ) {
    return this.usersService.update(req.user.id, body);
  }
}
