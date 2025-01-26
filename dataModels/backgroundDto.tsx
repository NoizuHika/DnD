import { FeatureDto } from './featureDto'

export interface BackgroundDto {
  id?: number;
  name: string;
  skillProficiencies?: string[];
  toolProficiencies?: string[];
  equipment?: string[];
  languages?: string[];
  features?: FeatureDto[];
  ownerID?: number;
  source: string;
}