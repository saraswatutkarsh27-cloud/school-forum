import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async list() {
    const categories = await this.categoryService.listCategories();
    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
    }));
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(dto);
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
    };
  }
}

