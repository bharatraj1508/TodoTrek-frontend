import { ObjectId } from "mongoose";
import { Task } from "./task";
export interface Category {
  category: {
    _id: ObjectId;
    name: string;
    tasks?: Task[];
    project?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}
