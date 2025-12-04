import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { MembersService } from '../members/members.service';
import { LoginDto } from './dto/login.dto';
import { Member } from '../members/member.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly membersService: MembersService,
        private readonly jwtService: JwtService,
    ) {}

    private async validateMember(email: string, password: string): Promise<Member> {
        const member = await this.membersService['membersRepo'].findOne({
            where : { email: email.trim().toLowerCase() },
            select: ['mid', 'email', 'passwordHash', 'name', 'status'],
        });

        if (!member || member.status !== 'ACTIVE') throw new UnauthorizedException('이메일을 확인해주세요.');

        const ok = await argon2.verify(member.passwordHash, password);
        if (!ok) throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');

        return member;
    }

    async login(dto: LoginDto) {
        const member = await this.validateMember(dto.email, dto.password);
        const payload = {
            sub: member.mid,
            email: member.email,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        await this.membersService.updateLastLogin(member.mid);

        return {
            accessToken,
            member: {
                mid: member.mid,
                email: member.email,
                name: member.name,
            },
        };
    }
}