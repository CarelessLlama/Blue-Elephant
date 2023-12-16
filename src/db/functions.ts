import mongoose from 'mongoose';
import { Project as DbProject } from './schema/project';
import { Project } from '../models/Project';
import { ObjectId } from 'mongodb';
import {} from 'dotenv/config';

/**
 * Creates an ObjectId from a string according to the MongoDB documentation.
 *
 * @param id - id to be converted to ObjectId
 * @returns ObjectId
 */
function makeObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid project id: ' + id);
    }
    return new ObjectId(id);
}

/**
 * Connects the app to the database server.
 */
export async function connectToDatabase() {
    const dbUri = process.env.MONGODB_URI;
    if (dbUri == undefined) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }
    await mongoose.connect(dbUri);
    console.log('Connected to database');
}

/**
 * Updates the entry in the database with the project given by its id.
 *
 * @param proj - project to save to database
 */
export async function updateProject(proj: Project) {
    if (!proj.presentInDatabase()) {
        throw new Error('Project not present in database');
    }
    const id = makeObjectId(proj.getId());
    const userId = proj.getUserId();
    const project = await DbProject.findOne({ _id: id, userId: userId });

    if (project) {
        project.name = proj.getName();
        project.description = proj.getDescription();
        project.members = proj.getPersons();
        project.relationGraph = proj.getAdjMatrix();
        await project.save();
    }
}

/**
 * Retrieves a project from the database by its id.
 *
 * @param projectId - id of the project to retrieve
 * @returns Project object
 */
export async function loadProject(projectId: string): Promise<Project> {
    const id = makeObjectId(projectId);
    const project = await DbProject.findById(id).exec();
    if (project == null) {
        throw new Error('Project cannot be found. Project Id: ' + projectId);
    }
    return Promise.resolve(
        Project.createProject(
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
 * @param project - project to be created
 * @returns Project id as a string
 */
export async function createProject(project: Project): Promise<string> {
    const dbProject = await DbProject.create({
        userId: project.getUserId(),
        name: project.getName(),
        description: project.getDescription(),
        members: project.getPersons(),
        relationGraph: project.getAdjMatrix(),
    });
    return Promise.resolve(dbProject._id.toString());
}

/**
 * Creates a map of project names to their ids from the database.
 *
 * @param userId - Queries the database using this id
 * @returns Map containing project name - project id pairs.
 */
export async function getProjects(
    userId: number,
): Promise<Map<string, number>> {
    Project.validateUserId(userId);
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
 * @param projectId - id of the project to be deleted
 */
export async function deleteProject(projectId: string) {
    const id = makeObjectId(projectId);
    await DbProject.deleteOne({ _id: id }).exec();
}
