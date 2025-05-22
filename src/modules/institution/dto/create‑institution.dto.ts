import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
export class CreateInstitutionDto {
  @ApiProperty({ example: 'RDB' })
  @IsString()
  readonly name: string;
  
  @IsString()
  @ApiProperty({ example: 'Kigali, Gishushu' })
  readonly address: string;
}
