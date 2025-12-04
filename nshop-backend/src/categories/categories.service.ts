import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity'
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepo: Repository<Category>,
    ) { }

    findAll(): Promise<Category[]> {
        return this.categoriesRepo.find({
            order: { sortOrder: 'ASC', cid: 'ASC' },
        });
    }

    findOne(cid: number): Promise<Category | null> {
        console.log(cid);
        return this.categoriesRepo.findOne({ where: { cid } });
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        const cat = this.categoriesRepo.create(dto);
        return this.categoriesRepo.save(cat);
    }

    async update(cid: number, dto: UpdateCategoryDto): Promise<Category> {
        const cat = await this.categoriesRepo.findOne({ where: { cid } });
        if (!cat) throw new NotFoundException('Category not found');

        const updated = { ...cat, ...dto };
        return this.categoriesRepo.save(updated);
    }

    async remove(cid: number): Promise<void> {
        const result = await this.categoriesRepo.delete(cid);
        if (result.affected === 0) {
            throw new NotFoundException('Category not found');
        }
    }
}