import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterTaskDto {
  @ApiPropertyOptional({
    example: 'report',
    description: 'Filter tasks by title (partial match, case-insensitive)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: '2025-06-01',
    description:
      'Filter tasks with due dates starting from this date (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    example: '2025-06-30',
    description: 'Filter tasks with due dates up to this date (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}
