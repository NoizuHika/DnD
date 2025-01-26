export interface ItemDto {
  id?: number;
  name: string;
  description?: string;
  weight: string;
  value: string;
  ownerID?: number;
  type: string;
  rarity: string;
  requiresAttunement?: string;
  itemType: string[];
  armorClass?: string;
  dexBonus?: string;
  stealthDisadventage?: string;
  damageType?: string;
  diceNumber?: string;
  diceType?: string;
  specification?: string;
  properties?: string;
  source: string;
}