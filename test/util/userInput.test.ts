import {
    isBackCommand,
    isExitCommand,
    isAboutCommand,
    isStartCommand,
    getProjectMembersFromString,
} from '../../src/util/userInput';

describe('userInput', () => {
    it('should correctly identify a back command', () => {
        expect(isBackCommand('back')).toBe(true);
        expect(isBackCommand('Back')).toBe(true);
        expect(isBackCommand('not back')).toBe(false);
    });

    it('should correctly identify an exit command', () => {
        expect(isExitCommand('/exit')).toBe(true);
        expect(isExitCommand('/Exit')).toBe(true);
        expect(isExitCommand('not exit')).toBe(false);
    });

    it('should correctly identify an about command', () => {
        expect(isAboutCommand('/about')).toBe(true);
        expect(isAboutCommand('/About')).toBe(true);
        expect(isAboutCommand('not about')).toBe(false);
    });

    it('should correctly identify a start command', () => {
        expect(isStartCommand('/start')).toBe(true);
        expect(isStartCommand('/Start')).toBe(true);
        expect(isStartCommand('not start')).toBe(false);
    });

    it('should correctly parse project members from a string', () => {
        const text = 'Alice, Bob, Charlie';
        const expectedMembers = ['Alice', 'Bob', 'Charlie'];
        expect(getProjectMembersFromString(text)).toEqual(expectedMembers);
    });
});
