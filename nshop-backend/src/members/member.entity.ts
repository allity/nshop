import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    mid: number;

    @Index('UQ_member_email', { unique: true })
    @Column({ length: 255 })
    email: string;

    @Column({ length: 255, select: false })
    passwordHash: string;

    @Column({ length: 50 })
    name : string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string | null;

    @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
    status: MemberStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date | null;

    @Column({ type: 'varchar', nullable: true })
    provider?: string | null;

    @Column({ type: 'varchar', nullable: true })
    providerId?: string | null;
}