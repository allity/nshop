import { 
    Controller,
    Get,
    Param, 
    ParseIntPipe,
    Post,
    Body,
    Put,
    Delete,
    Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductDto } from './dto/find-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    getAll(
        @Query() query: FindProductDto,
    ): Promise<{
        items: Product[],
        total: number;
        page: number;
        limit: number;
    }> {
        return this.productsService.findAll(query);
    }

    @Get(':pid')
    getOne(@Param('pid', ParseIntPipe) pid: number): Promise<Product | null> {
        return this.productsService.findOne(pid);
    }

    @Post()
    create(@Body() dto: CreateProductDto): Promise<Product> {
        return this.productsService.create(dto);
    }

    @Put(':pid')
    update(
        @Param('pid', ParseIntPipe) pid: number,
        @Body() dto: UpdateProductDto,
    ): Promise<Product> {
        return this.productsService.update(pid, dto);
    }

    @Delete(':pid')
    remove(
        @Param('pid', ParseIntPipe) pid: number,
    ): Promise<void> {
        return this.productsService.remove(pid);
    }
}
