export type BottleType = 'text';

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface IBottle {
  content: string;
  type: BottleType;
  createdAt: Date;
  pickedCount: number;
  lastPickedAt?: Date;
  isActive: boolean;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address?: string;
  tags?: string[];
}

export interface CreateBottleDto {
  content: string;
  type: BottleType;
  location?: {
    longitude: number;
    latitude: number;
  };
  address?: string;
  tags?: string[];
}

export interface PickBottleDto {
  address?: string;
  maxDistance?: number;
  tags?: string[];
}