export interface PlayerClassDto {
  id?: number;
  name: string;
  hpDice?: string;
  hpDiceAt1?: string;
  hpPerLevel?: string;
  savingThrowProficiencies?: string;
  skillProficiencies?: string;
  weaponProficiencies?: string;
  armorTraining?: string;
  startingEquipment?: string;
  multiclassingAbilityScoreMinimum?: string;
  multiclassWeaponProficiencies?: string;
  multiclassArmorTraining?: string;
  ownerID?: number;
  source: string;
  spellThrowBonus: string;
}