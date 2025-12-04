import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterMemberDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    password: string;

    @IsString()
    @MaxLength(50)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;
}