import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { access_token, user } = await this.authService.register(
      dto.email,
      dto.password,
      dto.name,
    );
    return {
      user,
      accessToken: access_token,
    };
  }

  @Throttle({
    default: { limit: 3, ttl: 900000 },
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { access_token, user } = await this.authService.login(
      dto.email,
      dto.password,
    );
    return {
      user,
      accessToken: access_token,
    };
  }

  @Post('verify')
  verify(@Body() body: { token: string }) {
    try {
      return this.authService.verifyToken(body.token);
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    // In a JWT-based system, logout is typically handled client-side by removing the token
    // This endpoint can be used for logging purposes or future token blacklisting
    console.log(`User ${req.user.id} logged out`);
    return {
      message: 'Logged out successfully',
      success: true,
    };
  }
}
