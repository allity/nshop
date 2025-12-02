import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'enan',
      password: 'enan',
      database: 'nshop',
      entities: [Product],
      synchronize: true,
      logging: false,
    }),
    ProductsModule,
  ],
})
export class AppModule {}