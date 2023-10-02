import { ImgData } from '../types/image';
import { User } from './user';

export type Travel = {
  id?: string;
  country: string;
  city: string;
  totalDays: number;
  travellers: number;
  budget: number;
  mainPhoto: ImgData;
  traveler: User;
  days: DayTravel[];
};

export type DayTravel = {
  dayNumber: number;
  activities: Activity[];
};

export type Activity = {
  title: string;
  description: string;
  assessment: Assessment[];
  photos: ImgData[];
};

export type Assessment = {
  position: number;
  state: boolean;
};
