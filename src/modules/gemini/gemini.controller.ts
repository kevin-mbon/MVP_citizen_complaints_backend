import { Controller, Post, Body, Logger } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Public } from 'src/common/decorators/public.decorator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}

@Controller('gemini')
@Public()
export class GeminiController {
  private readonly logger = new Logger(GeminiController.name);

  constructor(private readonly geminiService: GeminiService) {
    this.logger.log('GeminiController initialized');
  }

  @Post()
  @ApiOperation({ summary: 'Chat with Gemini AI' })
  @ApiResponse({ status: 200, description: 'AI response' })
  async chat(@Body() body: ChatRequestDto) {
    try {
      this.logger.log(`Received chat request with prompt: ${body.prompt}`);
      return await this.geminiService.generateText({ prompt: body.prompt });
    } catch (error) {
      this.logger.error(`Error in chat endpoint: ${error.message}`);
      throw error;
    }
  }
}
