import { connectToDatabase } from '../../src/db/functions';
import mongoose from 'mongoose';

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
    it('should throw an error with invalid URI', async () => {
        expect.assertions(1);
        process.env.MONGODB_URI = 'invalidUri';
        connectToDatabase().catch((err) =>
            expect(err.toString()).toEqual(
                'MongoParseError: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"',
            ),
        );
    });
});

describe('updateProjectInDb()', () => {});

describe('loadProjectFromDb()', () => {});

describe('createProjectInDb()', () => {});

describe('getProjectsFromDb()', () => {});

describe('deleteProjectInDb()', () => {});
