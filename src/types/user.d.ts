import { ObjectID } from 'mongodb';
import { Document } from 'mongoose';

export interface IUserBase {
  email: string;
  password: string;
  role: string;
  restaurants?: {
    restaurantId: ObjectID;
    permissions: 'read' | 'all';
  }[];
  owner: ObjectID;
}

export type IUser = IUserBase &
  Document & {
    _id: ObjectID;
    createdAt: Date;
    updatedAt: Date;
  };
