import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity'
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepo: Repository<Product>,
    ) {}

    findAll(): Promise<Product[]> {
        return this.productsRepo.find();
    }

    findOne(pid: number): Promise<Product | null> {
        return this.productsRepo.findOne({ where: { pid }});
    }

    async create(dto: CreateProductDto): Promise<Product> {
        const product= this.productsRepo.create(dto);
        return this.productsRepo.save(product);
    }

    async update(pid: number, dto: UpdateProductDto): Promise<Product> {
        const product = await this.productsRepo.findOne({ where: { pid } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const updated = { ...product, ...dto };
        return this.productsRepo.save(updated);
    }

    async remove(pid: number): Promise<void> {
        const result = await this.productsRepo.delete(pid);
        if (result.affected === 0) {
            throw new NotFoundException('Product not found');
        }
    }
}
