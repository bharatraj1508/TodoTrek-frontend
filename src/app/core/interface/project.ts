import { Category } from "./category";
import { Task } from "./task";
import { ObjectId } from "mongoose";

export interface Project {
  _id: ObjectId;
  name: string;
  color: string;
  favourites?: boolean;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  categories?: Category[];
  tasks?: Task[];
  createdAt?: string;
  updatedAt?: string;
}
