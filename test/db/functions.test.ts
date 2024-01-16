import mongoose from 'mongoose';

import { Project as DbProject } from '../../src/db/schema/Project';
import { Project } from '../../src/models/Project';
import {
    connectToDatabase,
    createProjectInDb,
    deleteProjectInDb,
    getProjectsFromDb,
    loadProjectFromDb,
    updateProjectInDb,
} from '../../src/db/functions';
import { ObjectId } from 'mongodb';

const mockingoose = require('mockingoose'); // ES6 style is bugged

const VALID_PROJECT_ID_1 = '65801fa288cd5362ab740b57';
const VALID_LOCAL_PROJECT_1 = Project._Project(
    VALID_PROJECT_ID_1,
    0,
    'name',
    'description',
    [],
    [],
);
const VALID_DB_PROJECT_1 = new DbProject({
    _id: new ObjectId(VALID_PROJECT_ID_1),
    userId: 0,
    name: 'name',
    description: 'description',
    members: [],
    relationGraph: [],
});

const INVALID_LOCAL_PROJECT_NO_ID = Project._Project(
    Project.NOT_SET,
    0,
    'name',
    'description',
    [],
    [],
);

describe('connectToDatabase()', () => {
    const OLD_ENV = process.env;

    beforeEach(
        () =>
            (process.env = {
                ...OLD_ENV,
            }),
    );

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    it('should succeed with a valid URI', async () => {
        expect.assertions(1);
        process.env.MONGODB_URI = 'validUri';
        const spy = jest.spyOn(mongoose, 'connect');
        spy.mockImplementationOnce((_) => Promise.resolve(mongoose));
        connectToDatabase().then((_) => expect(true).toEqual(true));
        spy.mockRestore();
    });
    it('should throw an error with missing URI', async () => {
        expect.assertions(2);
        const spy = jest.spyOn(mongoose, 'connect');
        connectToDatabase().catch((err) =>
            expect(err.toString()).toEqual(
                'Error: Please define the MONGODB_URI environment variable',
            ),
        );
        expect(spy).toHaveBeenCalledTimes(0);
    });
});

describe('updateProjectInDb()', () => {
    it('should succeed with a valid project', async () => {
        const dbProj = new DbProject(VALID_DB_PROJECT_1);
        const project = VALID_LOCAL_PROJECT_1;
        mockingoose(DbProject)
            .toReturn(dbProj, 'findOne')
            .toReturn(VALID_DB_PROJECT_1, 'save');
        expect.assertions(1);
        await updateProjectInDb(project).then((_) =>
            expect(true).toEqual(true),
        );
    });
    it('should throw an error if project does not have a valid ID', async () => {
        const project = INVALID_LOCAL_PROJECT_NO_ID;
        mockingoose(DbProject).toReturn(null, 'findOne');
        expect.assertions(1);
        updateProjectInDb(project).catch((err) =>
            expect(err).toEqual(
                Error('Project has not been saved to database yet'),
            ),
        );
    });
    it('should throw an error if project does not exist in database', async () => {
        const project = VALID_LOCAL_PROJECT_1;
        mockingoose(DbProject).toReturn(null, 'findOne');
        expect.assertions(1);
        updateProjectInDb(project).catch((err) =>
            expect(err).toEqual(Error('Project not found in database')),
        );
    });
});

describe('loadProjectFromDb()', () => {
    it('should succeed with a valid project id and project is in database', async () => {
        const dbProj = new DbProject(VALID_DB_PROJECT_1);
        mockingoose(DbProject).toReturn(dbProj, 'findOne'); // findOne is alias for findById
        expect.assertions(1);
        const idString = VALID_DB_PROJECT_1._id.toString();
        await loadProjectFromDb(idString).then((proj) =>
            expect(proj).toEqual(VALID_LOCAL_PROJECT_1),
        );
    });
    it('should throw an error if given id is not proper', async () => {
        expect.assertions(1);
        const invalidId = 'invalidId';
        loadProjectFromDb(invalidId).catch((err) =>
            expect(err).toEqual(Error('Invalid project id: ' + invalidId)),
        );
    });
    it('should throw an error if project does not exist in database', async () => {
        mockingoose(DbProject).toReturn(null, 'findOne'); // findOne is alias for findById
        expect.assertions(1);
        const idString = VALID_DB_PROJECT_1._id.toString();
        loadProjectFromDb(idString).catch((err) =>
            expect(err).toEqual(
                Error('Project cannot be found. Project Id: ' + idString),
            ),
        );
    });
});

describe('createProjectInDb()', () => {
    it('should succeed with a valid project', async () => {
        mockingoose(DbProject).toReturn(VALID_DB_PROJECT_1, 'save'); // prevent actual function from being called
        expect.assertions(1);
        await createProjectInDb(INVALID_LOCAL_PROJECT_NO_ID).then(
            (id) => expect(ObjectId.isValid(id)).toBeTruthy(), // we can't check the actual id because it's randomly generated
        );
    });
    it('should throw an error if project already has an ID', async () => {
        const project = VALID_LOCAL_PROJECT_1;
        expect.assertions(1);
        createProjectInDb(project).catch((err) =>
            expect(err).toEqual(
                Error(
                    'Project has already been saved to database. Use the update function instead.',
                ),
            ),
        );
    });
});

describe('getProjectsFromDb()', () => {
    it('should succeed with a valid user id', async () => {
        const userId = VALID_LOCAL_PROJECT_1.getUserId();
        const dbProj = new DbProject(VALID_DB_PROJECT_1);
        const dbId = dbProj._id.toString();
        const dbName = dbProj.name;
        const map = new Map<string, string>([[dbName, dbId]]);
        mockingoose(DbProject).toReturn([VALID_DB_PROJECT_1], 'find');
        expect.assertions(1);
        await getProjectsFromDb(userId).then((output) =>
            expect(output).toEqual(map),
        );
    });
    it('should throw an error with an invalid user id', async () => {
        const invalidUserId = -1;
        expect.assertions(1);
        await getProjectsFromDb(invalidUserId).catch((err) =>
            expect(err).toEqual(new Error('Invalid user id.')),
        );
    });
});

describe('deleteProjectInDb()', () => {
    it('should succeed with a valid project id', async () => {
        const dbProj = new DbProject(VALID_DB_PROJECT_1);
        const idString = dbProj._id.toString();
        mockingoose(DbProject).toReturn(dbProj, 'findOneAndDelete');
        expect.assertions(1);
        await deleteProjectInDb(idString).then((_) =>
            expect(true).toEqual(true),
        );
    });
    it('should throw an error with an invalid project id', async () => {
        const invalidId = 'invalidId';
        expect.assertions(1);
        await deleteProjectInDb(invalidId).catch((err) =>
            expect(err).toEqual(new Error('Invalid project id: ' + invalidId)),
        );
    });
    it('should not throw an error if project does not exist in database', async () => {
        const idString = VALID_DB_PROJECT_1._id.toString();
        mockingoose(DbProject).toReturn(null, 'findOneAndDelete');
        expect.assertions(1);
        await deleteProjectInDb(idString).then((_) =>
            expect(true).toEqual(true),
        );
    });
});
