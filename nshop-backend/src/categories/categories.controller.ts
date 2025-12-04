import { Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':cid')
    findOne(@Param('cid', ParseIntPipe) cid: number): Promise<Category | null> {
        return this.categoriesService.findOne(cid);
    }

    @Post()
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Put(':cid')
    update(
        @Param('cid', ParseIntPipe) cid: number,
        @Body() dto: UpdateCategoryDto,
    ) {
        return this.categoriesService.update(cid, dto);
    }

    @Delete(':cid')
    remove(@Param('cid', ParseIntPipe) cid: number) {
        return this.categoriesService.remove(cid);
    }
}