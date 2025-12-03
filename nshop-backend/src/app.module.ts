import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { Category } from './categories/category.entity';
import { CategoriesModule } from './categories/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'enan',
      password: 'enan',
      database: 'nshop',
      entities: [Product, Category],
      synchronize: true,
      logging: false,
    }),
    ProductsModule,
    CategoriesModule,
  ],
})
export class AppModule {}