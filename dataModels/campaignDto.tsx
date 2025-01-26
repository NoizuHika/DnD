import { EncounterDto } from './encounterDto';
import { SessionDto } from './sessionDto';
import { PlayerCharacterDto } from './playerCharacterDto';

export interface CampaignDto {
  id?: number;
  title: string;
  description?: string;
  sessions?: SessionDto[];
  characters?: PlayerCharacterDto[];
  code?: string;
  ownerID?: number;
  encounters?: EncounterDto[];
}