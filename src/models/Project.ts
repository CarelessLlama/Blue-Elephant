import { Person } from './Person';

export class Project {
    private id: string;
    private userid: number;
    private name: string;
    private description: string;
    private personArr: string[];
    private adjMatrix: number[][];

    constructor(
        id: string,
        userid: number,
        name: string,
        description: string,
        adjMatrix: number[][],
        stringPersonArr: string[],
    ) {
        this.id = id;
        this.userid = userid;
        this.name = name;
        this.description = description;
        this.adjMatrix = adjMatrix;
        this.personArr = stringPersonArr;
    }

    public addPerson(personName: string): void {
        const num_members = this.personArr.length;
        this.personArr.push(personName);
        this.adjMatrix.forEach((row) => row.push(0));
        this.adjMatrix.push(new Array(num_members + 1).fill(0));
    }

    public removePerson(person: Person): void {
        const personIndex = this.personArr.indexOf(person.toString());
        this.personArr.splice(personIndex, 1);
        this.adjMatrix.splice(personIndex, 1);
        this.adjMatrix.forEach((row) => row.splice(personIndex, 1));
    }

    // public getGroupings(numGroups: number): void {}

    public getId(): string {
        return this.id;
    }

    public getUserid(): number {
        return this.userid;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getPersons(): string[] {
        return this.personArr;
    }

    public getAdjMatrix(): number[][] {
        return this.adjMatrix;
    }

    public setUserId(userid: number): void {
        this.userid = userid;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setPersons(personArrString: string): void {
        this.personArr = personArrString.split(',');
        const n = this.personArr.length;
        this.setAdjMatrix(
            Array(n)
                .fill(null)
                .map(() => Array(n).fill(0)),
        );
    }

    public setAdjMatrix(adjMatrix: number[][]): void {
        this.adjMatrix = adjMatrix;
    }

    public incrementInteractions(person1: number, person2: number): void {
        this.adjMatrix[person1][person2]++;
        this.adjMatrix[person2][person1]++;
    }

    public resetInteractions(): void {
        const n = this.personArr.length;
        this.adjMatrix = Array(n)
            .fill(null)
            .map(() => Array(n).fill(0));
    }
}
