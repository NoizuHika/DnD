export interface SessionDto {
  id?: number;
  title: string;
  description?: string;
  campaign_id?: number;
  campaign_name?: string;
  logs?: string[];
  notes?: NoteDto[];
}