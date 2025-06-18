import { Module } from '@nestjs/common';
import { AiSuggestionController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  controllers: [AiSuggestionController],
  providers: [AiService],
})
export class AiModule {}
