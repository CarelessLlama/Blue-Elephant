export function isBackCommand(text: string): boolean {
    return text.toLowerCase() === 'back';
}

export function isExitCommand(text: string): boolean {
    return text.toLowerCase() === '/exit';
}

export function isAboutCommand(text: string): boolean {
    return text.toLowerCase() === '/about';
}

export function isStartCommand(text: string): boolean {
    return text.toLowerCase() === '/start';
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
