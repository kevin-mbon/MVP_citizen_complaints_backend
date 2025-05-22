import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Hardware Issues' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Issues related to hardware malfunction or damage' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ example: 5, description: 'Number of complaints or feedbacks' })
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly complaintOrFeedbackCount?: number;
}