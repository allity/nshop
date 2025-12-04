import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { Category } from './categories/category.entity';
import { CategoriesModule } from './categories/category.module';
import { Member } from './members/member.entity';
import { MembersModule } from './members/members.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'enan',
      password: 'enan',
      database: 'nshop',
      entities: [Product, Category, Member],
      synchronize: true,
      logging: false,
    }),
    ProductsModule,
    CategoriesModule,
    MembersModule,
    AuthModule,
  ],
})
export class AppModule {}