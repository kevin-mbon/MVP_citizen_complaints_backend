import { Module, Global } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { PasswordGeneratorService } from './services/password-generator.service';

@Global()
@Module({
  providers: [EmailService, PasswordGeneratorService],
  exports: [EmailService, PasswordGeneratorService],
})
export class CommonModule {}