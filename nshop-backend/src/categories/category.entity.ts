import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    cid: number;

    @Column({ length: 50 })
    name: string;

    @Column('int', { default: 0 })
    sortOrder: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}