import { ObjectID } from 'mongodb';
import { Document } from 'mongoose';

export interface IRestaurantBase {
  name: string;
  internalName: string;
  phone: string;
  address: IAddress;
  emails: {
    global: string;
    noreply: string;
  };
  colors: {
    mainColor: string;
  };
  integrations: IIntegration[];
  settings: ISettings;
  zone?: ObjectID;
  owner: ObjectID;
}

export type IRestaurant = IRestaurantBase &
  Document & {
    _id: ObjectID;
    createdAt: Date;
    updatedAt: Date;
    removed: boolean;
  };

export interface IAddress {
  street: string;
  city: string;
  zipcode: string;
  country: string;
}

export interface IIntegration {
  name: string;
  key: string;
}

export interface ISettings {
  survey: {
    send: boolean;
    key?: string;
  };
  tracking: boolean;
  automaticPartner: boolean;
}
