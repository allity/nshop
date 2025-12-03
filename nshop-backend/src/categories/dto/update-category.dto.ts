import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsString()
    @IsOptional()
    name?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    sortOrder?: number;
}