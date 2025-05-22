import { PartialType } from '@nestjs/mapped-types';
import { CreateInstitutionDto } from './create‑institution.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInstitutionDto extends PartialType(CreateInstitutionDto) {
  @ApiPropertyOptional({ example: 'Updated name' })
  name?: string;

  @ApiPropertyOptional({ example: 'Updated address' })
  address?: string;
}
