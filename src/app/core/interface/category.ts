import { Task } from "./task";
import { ObjectId } from "mongoose";

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
