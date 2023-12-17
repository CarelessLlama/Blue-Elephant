export function isBackCommand(text: string): boolean {
    return text.toLowerCase() === 'back';
}

/**
 * Checks if a string is a valid project members' list.
 * @param text - The text to check
 * @returns An array of people
 */
export function getProjectMembersFromString(text: string): string[] {
    const memberArr = text.split(',').map((person) => person.trim());
    return memberArr;
}
