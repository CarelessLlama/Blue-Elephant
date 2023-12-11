import mongoose, { Types } from 'mongoose';
import { Project as DbProject } from '../db/schema/Project';
import { Project } from '../src/models/Project';
import { ObjectId } from 'mongodb';
require('dotenv').config();

/**
 * Connects the app to the database server.
 */
export async function connectToDatabase() {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }
    await mongoose.connect(dbUri);
    console.log('Connected to database.');
}

/**
 * Updates the entry in the database with the project given by its id.
 *
 * @param proj project to save to database
 */
export async function saveProject(proj: Project) {
    const id = new ObjectId(proj.getId());
    await DbProject.replaceOne(id, proj);
}

/**
 * Retrieves a project from the database by its id.
 *
 * @param projectId id of the project to retrieve
 * @returns Project object
 */
export async function loadProject(projectId: string): Promise<Project> {
    const project = await DbProject.findById(new ObjectId(projectId)).exec();
    if (project == null) {
        throw new Error('Project cannot be found. Project Id: ' + projectId);
    }
    return Promise.resolve(
        new Project(
            project._id.toString(),
            project.userId,
            project.name,
            project.description,
            project.relationGraph,
            project.members,
        ),
    );
}

/**
 * Creates a project in the database and returns the project id.
 *
 * @param userId Project owner id
 * @param name Name of project
 * @param description Description of project
 * @param members Member list
 * @param relationGraph Graph of relations between members
 * @returns Project id as a string
 */
export async function createProject(
    userId: number,
    name: string,
    description: string,
    members: [string],
    relationGraph: [[number]],
): Promise<String> {
    const project = await DbProject.create({
        userId: userId,
        name: name,
        description: description,
        members: members,
        relationGraph: relationGraph,
    });
    return Promise.resolve(project._id.toString());
}

/**
 * Creates a map of project names to their ids from the database.
 *
 * @param userId Queries the database using this id
 * @returns Map containing project name - project id pairs.
 */
export async function getProjects(
    userId: number,
): Promise<Map<String, Number>> {
    const projects = await DbProject.find({ userId: userId }).exec();
    const map = new Map();
    for (const proj of projects) {
        map.set(proj.name, proj._id);
    }
    return map;
}

/**
 * Deletes a project from the database by its id.
 *
 * @param projectId id of the project to be deleted
 */
export async function deleteProject(projectId: string) {
    await DbProject.deleteOne({ _id: new ObjectId(projectId) });
}
