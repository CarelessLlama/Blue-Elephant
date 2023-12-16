function parsePeopleListString(peopleList: string): string[] {
    const peopleArr = peopleList.split(',').map((person) => person.trim());
    return peopleArr;
}

function isBackCommand(text: string): boolean {
    return text.toLowerCase() === 'back';
}

export { parsePeopleListString, isBackCommand };
