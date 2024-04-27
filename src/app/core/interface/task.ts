import { ObjectId } from "mongoose";
import { Project } from "./project";
import { Category } from "./category";

export interface Task {
  task: {
    _id: ObjectId;
    body: string;
    dueDate?: Date;
    priority?: 1 | 2 | 3;
    isCompleted: boolean;
    projectId?: Project;
    categoryId?: Category;
    owner: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  };
}
