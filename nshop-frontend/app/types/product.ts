import { Category } from './category';

export type Product = {
    pid: number;
    name: string;
    price: number;
    stock: number;
    thumbnailUrl: string | null;
    description: string;
    cid: number | null;
    category?: Category | null;
};