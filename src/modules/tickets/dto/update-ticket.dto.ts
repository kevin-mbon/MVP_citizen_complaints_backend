import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create‐ticket.dto';
import { IsEnum } from 'class-validator';
import { TicketStatus } from '../schemas/ticket.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiPropertyOptional({
    enum: TicketStatus,
    example: TicketStatus.IN_PROGRESS,
    description: 'Updated status of the ticket',
  })
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}
