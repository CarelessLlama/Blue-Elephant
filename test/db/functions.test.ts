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
        expect.assertions(1);
        connectToDatabase().catch((err) =>
            expect(err.toString()).toEqual(
                'Error: Please define the MONGODB_URI environment variable',
            ),
        );
    });
    it('should throw an error with invalid URI', async () => {
        expect.assertions(1);
        process.env.MONGODB_URI = 'invalidUri';
        const spy = jest.spyOn(mongoose, 'connect');
        spy.mockImplementationOnce((_) => {
            throw new Error('Invalid URI.');
        });
        connectToDatabase().catch((err) =>
            expect(err.toString()).toEqual('Error: Invalid URI.'),
        );
        spy.mockRestore();
    });
});
