import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
      ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = new this.categoryModel(createCategoryDto);
        return category.save();
      }
    
      async findAll(): Promise<Category[]> {
        return this.categoryModel.find().exec();
      }
    
      async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
          throw new NotFoundException('Category not found');
        }
        return category;
      }
    
      async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const updated = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
        if (!updated) {
          throw new NotFoundException('Category not found');
        }
        return updated;
      }
    
      async remove(id: string): Promise<{ deleted: boolean }> {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
          throw new NotFoundException('Category not found');
        }
        return { deleted: true };
      }
}
