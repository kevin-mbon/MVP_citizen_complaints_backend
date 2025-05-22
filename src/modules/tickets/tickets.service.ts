import {
    Injectable,
    NotFoundException,
    ForbiddenException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, Types } from 'mongoose';
  import { Ticket, TicketDocument } from './schemas/ticket.schema';
  import { CreateTicketDto } from './dto/create‐ticket.dto';
  import { UpdateTicketDto } from './dto/update-ticket.dto';
  
  @Injectable()
  export class TicketsService {
    constructor(
      @InjectModel(Ticket.name)
      private ticketModel: Model<TicketDocument>,
    ) {}
  
    create(dto: CreateTicketDto, userId: string) {
      return this.ticketModel.create({
        ...dto,
        user: new Types.ObjectId(userId),
      });
    }
  
    findAll(user: any) {
      if (user.role === 'admin') return this.ticketModel.find().exec();
      return this.ticketModel.find({ user: user._id }).exec();
    }

    async findTicketWithUser(ticketId: string) {
      const ticket = await this.ticketModel.findById(ticketId).populate('userId', '-password -__v').exec();
      if (!ticket) throw new NotFoundException('Ticket not found');
  
      return ticket;
    }
  
    async findOne(id: string, user: any) {
      const t = await this.ticketModel.findById(id).exec();
      if (!t) throw new NotFoundException('Ticket not found');
      if (user.role !== 'admin' && t.user.toString() !== user._id)
        throw new ForbiddenException();
      return t;
    }
  
    async update(id: string, dto: UpdateTicketDto, user: any) {
      await this.findOne(id, user);
      return this.ticketModel
        .findByIdAndUpdate(id, dto, { new: true })
        .exec();
    }
  
    async remove(id: string, user: any) {
      await this.findOne(id, user);
      await this.ticketModel.findByIdAndDelete(id).exec();
      return { deleted: true };
    }

    async findByUserId(userId: string) {
      return this.ticketModel.find({ user: new Types.ObjectId(userId) }).exec();
    }
  }
  