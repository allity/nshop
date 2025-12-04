import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MembersService } from '../members/members.service';
import { RegisterMemberDto } from '../members/dto/register-member.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly membersService: MembersService,
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterMemberDto) {
        const member = await this.membersService.create(dto);
        return {
            mid: member.mid,
            email: member.email,
            name: member.name,
            phone: member.phone,
            createdAt: member.createdAt,
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}