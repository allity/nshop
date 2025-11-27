import { IsIn, isInt, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsInt()
    @Min(0)
    price: number;

    @IsInt()
    @Min(0)
    stock: number;

    @IsOptional()
    @IsString()
    @IsUrl()
    thumbnailUrl?: string;
}