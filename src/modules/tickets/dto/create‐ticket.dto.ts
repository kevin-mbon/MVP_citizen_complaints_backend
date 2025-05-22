import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export class CreateTicketDto {
  @ApiProperty({ example: 'Printer Issue on 2nd Floor' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Printer in Room 204 is not working properly and needs maintenance.' })
  @IsString()
  readonly description: string;

  @ApiProperty({ example: '663dcd1226c9fa30b8a1b456' })
  @IsString()
  readonly category?: string;

  @ApiProperty({ example: '663dcd1226c9fa30b8a1b123' })
  @IsString()
  readonly institution?: string;

  @ApiProperty({
    enum: TicketStatus,
    example: TicketStatus.OPEN,
    description: 'Initial status of the ticket',
  })
  @IsEnum(TicketStatus)
  readonly status: TicketStatus;

  @ApiProperty({ example: '663dcd1226c9fa30b8a1b999' })
  @IsString()
  readonly userId: string;
}
