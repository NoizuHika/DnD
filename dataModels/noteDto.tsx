import { ImageDto } from './imageDto'


export interface NoteDto {
  id?: number;
  title: string;
  description?: string;
  session_id?: number;
  images?: ImageDto[];
  ownerID?: number;
}