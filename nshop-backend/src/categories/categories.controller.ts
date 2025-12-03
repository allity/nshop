import { Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    findAll() {
        return this.categoriesService.findAll();
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