import { PlayerClassDto } from './playerClassDto'

export interface playerOwnedClassDto {
  id?: number;
  playerClass: PlayerClassDto;
  maxHP: number;
  level: number;
  playerID: number;
}