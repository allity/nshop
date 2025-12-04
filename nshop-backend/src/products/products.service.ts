import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity'
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductDto } from './dto/find-product.dto';

type FindAllParams = {
    name?: string;
    startDate?: string;
    endDate?: string;
    cid?: number;
}

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepo: Repository<Product>,
    ) {}

    async findAll(
        params: FindProductDto,
    ): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }> {
        const {
            name,
            startDate,
            endDate,
            sort = 'pid',
            order = 'DESC',
            page = 1,
            limit = 20,
            cid,
        } = params;

        const qb = this.productsRepo.createQueryBuilder('product');

        if (name && name.trim() !== '') {
            qb.andWhere('product.name LIKE :name', { name: `%${name.trim()}%` });
        }

        if (startDate) {
            qb.andWhere('DATE(product.createdAt) >= :startDate', { startDate });
        }

        if (endDate) {
            qb.andWhere('DATE(product.createdAt) <= :endDate', { endDate });
        }

        if (cid) {
            qb.andWhere('product.cid = :cid', { cid });
        }

        let sortField: string;
        switch (sort) {
            case 'name':
                sortField = 'product.name';
                break;
            case 'createdAt':
                sortField = 'product.createdAt';
                break;
            case 'pid':
            default:
                sortField = 'product.pid';
                break;
        }
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'DESC';
        qb.orderBy(sortField, sortOrder);

        const safeLimit = Math.min(Math.max(limit, 1), 100);
        const safePage = Math.max(page, 1);
        qb.skip((safePage - 1) * safeLimit).take(safeLimit);

        const [items, total] = await qb.getManyAndCount();

        return {
            items,
            total,
            page: safePage,
            limit: safeLimit,
        }
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
