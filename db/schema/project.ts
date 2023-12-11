import mongoose, { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface Project {
  name: string;
  description: string;
  members: Array<string>;
}

// 2. Create a Schema corresponding to the document interface.
const projectSchema = new Schema<Project>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  members: {type: [String], required: true}
});

// 3. Create a Model.
export const Project = model<Project>('Project', projectSchema);
