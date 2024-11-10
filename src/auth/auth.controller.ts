import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signUp(@Body() signUpDto: SignUpAuthDto): Promise<{ message: string }> {
    return this.authService.signUp(signUpDto)
  }

  @Post('signin')
  signIn(@Body() signInDto: SignInAuthDto): Promise<{ token: string }> {
    return this.authService.signIn(signInDto);
  }
}
