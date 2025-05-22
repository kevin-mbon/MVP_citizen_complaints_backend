import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institution, InstitutionDocument } from './schemas/institution.schema';
import { CreateInstitutionDto } from './dto/create‑institution.dto';
import { UpdateInstitutionDto } from './dto/update‑institution.dto';


@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution.name)
    private instaModel: Model<InstitutionDocument>,
  ) {}

  create(dto: CreateInstitutionDto) {
    return this.instaModel.create(dto);
  }

  findAll() {
    return this.instaModel.find().exec();
  }

  async findOne(id: string) {
    const inst = await this.instaModel.findById(id).exec();
    if (!inst) throw new NotFoundException('Institution not found');
    return inst;
  }

  async update(id: string, dto: UpdateInstitutionDto) {
    const updated = await this.instaModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Institution not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.instaModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Institution not found');
    return { deleted: true };
  }
}