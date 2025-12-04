import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Member } from './member.entity';
import { RegisterMemberDto } from './dto/register-member.dto';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member)
        private readonly membersRepo: Repository<Member>,
    ) {}

    async findByEmail(email: string): Promise<Member | null> {
        return this.membersRepo.findOne({ where: { email } });
    }

    async create(dto: RegisterMemberDto): Promise<Member> {
        const existing = await this.membersRepo.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('이미 사용 중인 이메일입니다.');

        const passwordHash = await argon2.hash(dto.password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });

        const member = this.membersRepo.create({
            email: dto.email.trim().toLowerCase(),
            passwordHash,
            name: dto.name,
            phone: dto.phone ?? null,
            status: 'ACTIVE',
        });

        return this.membersRepo.save(member);
    }

    async updateLastLogin(mid: number): Promise<void> {
        await this.membersRepo.update(mid, { lastLoginAt: new Date() });
    }

    async getProfile(mid: number): Promise<Member> {
        const member = await this.membersRepo.findOne({ where: { mid }});
        if (!member) throw new NotFoundException('회원 정보를 찾을 수 없습니다.');

        return member;
    }
}