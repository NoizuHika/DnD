import { BestiaryDto } from './bestiaryDto';

export interface EntityDto {
  actualHP: number;
  effects?: string;
  base: BestiaryDto;
}
