import { NoteDto } from './noteDto'
import { SpellDto } from './spellDto'
import { PlayerOwnedClassDto} from './playerOwnedClassDto'
import { FeatDto } from './featDto'
import { ItemDto } from './itemDto'
import { BackgroundDto } from './backgroundDto'
import { PlayerSpeciesDto } from './playerSpeciesDto'


export interface PlayerCharacterDto {
  id:?: number;
  name: string;
  description?: string;
  actualHP: number;
  armorClass: number;
  strScore: number;
  dexScore: number;
  intScore: number;
  wisScore: number;
  chaScore: number;
  conScore: number;
  alignment: string;
  spellbook? SpellDto[];
  playerClasses?: PlayerOwnedClassDto[];
  feats?: FeatDto[];
  campaign?: string;
  items?: ItemDto[];
  background?: BackgroundDto;
  money: number;
  playerSpecies?: PlayerSpeciesDto[];
  imageID?: number;
  image?:  string;
  ownerID?: number;
  owner?: string;
  shared_notes?: NoteDto[];
}