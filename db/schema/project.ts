import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface Project {
    userId: number;
    name: string;
    description: string;
    members: string[];
    relationGraph: number[][];
}

// 2. Create a Schema corresponding to the document interface.
const projectSchema = new Schema<Project>({
    userId: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: { type: [String], required: true },
    relationGraph: { type: [[Number]], required: true },
});

// 3. Create a Model.
export const Project = model<Project>('Project', projectSchema);
