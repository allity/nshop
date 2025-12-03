import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    pid: number;

    @Column({ length: 100 })
    name: string;

    @Column('text')
    description: string;

    @Column('int')
    price: number;

    @Column({ default: 0 })
    stock: number;

    @Column({ nullable: true })
    thumbnailUrl: string;

    @ManyToOne(() => Category, (category) => category.products, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'cid' })
    category: Category;

    @Column({ nullable: true })
    cid: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}