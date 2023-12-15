export function parsePeopleListString(peopleList: string): string[] {
    const peopleArr = peopleList.split(',').map((person) => person.trim());
    return peopleArr;
}
