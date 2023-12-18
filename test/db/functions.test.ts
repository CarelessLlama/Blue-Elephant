import mongoose from 'mongoose';

import { Project as DbProject } from '../../src/db/schema/Project';
import { Project } from '../../src/models/Project';
import { connectToDatabase, updateProjectInDb } from '../../src/db/functions';

const mockingoose = require('mockingoose'); // ES6 style is bugged

const VALID_PROJECT_ID = '65801fa288cd5362ab740b57';
const VALID_LOCAL_PROJECT = Project._Project(
    VALID_PROJECT_ID,
    0,
    'name',
    'description',
    [],
    [],
);
const VALID_DB_PROJECT = new DbProject({
    _id: VALID_PROJECT_ID,
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
        const dbProj = new DbProject(VALID_DB_PROJECT);
        const project = VALID_LOCAL_PROJECT;
        mockingoose(DbProject).toReturn(dbProj, 'findOne');
        mockingoose(DbProject).toReturn(null, 'save');
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
        const project = VALID_LOCAL_PROJECT;
        mockingoose(DbProject).toReturn(null, 'findOne');
        expect.assertions(1);
        updateProjectInDb(project).catch((err) =>
            expect(err).toEqual(Error('Project not found in database')),
        );
    });
});

describe('loadProjectFromDb()', () => {});

describe('createProjectInDb()', () => {});

describe('getProjectsFromDb()', () => {});

describe('deleteProjectInDb()', () => {});
