import { ImgData } from '../types/image';

export type User = {
  id?: string;
  userName: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: ImgData;
};

export type LoginData = {
  userName: string;
  password: string;
  email: string;
};
