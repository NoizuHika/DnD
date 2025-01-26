export interface SpellDto {
  id?: number;
  name: string;
  description?: string;
  level: string;
  castingTime: string;
  duration: string;
  components: string[];
  atHigherLevels?: string;
  school: string;
  ownerID?: number;
  source: string;
  range: string;
  classes?: string[];
}