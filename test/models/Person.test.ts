import { Person } from '../../src/models/Person';

describe('Person', () => {
    it('should initialize correctly', () => {
        const person = new Person('name', 1);
        expect(person.getId()).toEqual(1);
        expect(person.toString()).toEqual('name');
    });
});
