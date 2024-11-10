import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async signUp(SignUpDto: SignUpAuthDto): Promise<{ message: string }> {
    const { username, email, password } = SignUpDto

    const existingUser = await this.userModel.findOne({ email })
    if (existingUser)
      throw new BadRequestException('User already exists')

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword
    })

    return { message: 'User registered successfully' }
  }

  async signIn(signInDto: SignInAuthDto): Promise<{ token: string,username: string }> {
    const { email, password } = signInDto

    const user = await this.userModel.findOne({ email })
        
    if (!user)
      throw new UnauthorizedException('Invalid email or password')

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid email or password')

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT configuration error');
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      username: user.username
    })

    return { token, username: user.username }
  }
}
