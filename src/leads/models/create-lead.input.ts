import { InputType, OmitType } from '@nestjs/graphql';
import { Lead } from './lead.entity';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

/**
 * Input type for creating a new lead.
 */
@InputType()
export class CreateLeadInput extends OmitType(
  Lead,
  ['id', 'createdAt', 'updatedAt', 'serviceTypes'] as const,
  InputType,
) {
  /**
   * The names of the service types the lead is interested in.
   */
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  serviceTypeNames: string[];
}
