import { EntityDto } from './entityDto';
import { PlayerCharacterDto } from './playerCharacterDto';

export interface EncounterDto {
  id?: number;
  title: string;
  entities?: EntityDto[];
  players?: playerCharacterDto[];
  campaignID: number;
  ownerID?: number;
}