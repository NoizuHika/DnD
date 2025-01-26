import { FeatDto } from './featDto'

export interface PlayerSpeciesDto {
      id?: number;
      name: string;
      description?: : string;
      speed: number;
      size: string;
      mainSpecies?: string;
      feats?: FeatDto[];
}