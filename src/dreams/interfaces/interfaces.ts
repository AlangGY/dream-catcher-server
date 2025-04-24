import { CreateDreamDto } from 'src/dreams/dto/request/create-dream.dto';
import { GetDreamsDto } from 'src/dreams/dto/request/get-dreams.dto';
import { UpdateDreamDto } from 'src/dreams/dto/request/update-dream.dto';

export interface CreateDreamWithUserId extends CreateDreamDto {
  userId: string;
}

export interface GetDreamsWithUserId extends GetDreamsDto {
  userId: string;
}

export interface UpdateDreamWithUserId extends UpdateDreamDto {
  userId: string;
}
