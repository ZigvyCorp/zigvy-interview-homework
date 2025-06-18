import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('AI Suggestion')
@Controller('ai')
export class AiSuggestionController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest-tasks')
  @ApiOperation({ summary: 'Get task suggestions based on a user query' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          example: 'I want to improve my productivity this week',
        },
      },
    },
  })
  async suggestTasks(@Body('query') query: string) {
    return this.aiService.genTask(query);
  }
}
