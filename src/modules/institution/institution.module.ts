import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { Institution, InstitutionSchema } from './schemas/institution.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Institution.name, schema: InstitutionSchema }]),
  ],
  controllers: [InstitutionController],
  providers: [InstitutionService],
})
export class InstitutionModule {}
