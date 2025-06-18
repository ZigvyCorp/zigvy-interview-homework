import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from '../utils/response.dto';

@Injectable()
export class AiService {
  private readonly gemini: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is not configured',
      );
    }

    this.gemini = new GoogleGenAI({ apiKey });
  }

  async genTask(message: string): Promise<ResponseDto<any>> {
    try {
      const prompt = `
        You are a productivity assistant.

        • Read the USER INPUT between <<< and >>>.
        • Suggest actionable tasks.
        • Return **ONLY** a list of lines in the exact format:

        - <Title> - <Description>

        No numbering, no extra text, no code fences.

        <<<
        ${message}
        >>>
        `;
      const response = await this.gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });
      const text = response.text ?? '';

      const suggestions = text
        .split('\n')
        .filter(
          (line) => line.trim().startsWith('-') || /^\d+\./.test(line.trim()),
        )
        .map((line) => line.replace(/^[-\d.]+\s*/, '').trim());

      return new ResponseDto(
        { suggestions },
        200,
        'AI task suggestions generated successfully',
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Failed to generate tasks from Gemini',
      );
    }
  }
}
