import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}