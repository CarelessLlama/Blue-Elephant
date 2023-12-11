import { Person } from './Person';

export class Project {
    private id: number;
    private userid: number;
    private name: string;
    private description: string;
    private personArr: string[];
    private adjMatrix: number[][];

    constructor(
        id: number,
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

    public getGroupings(numGroups: number): void {}

    public getId(): number {
        return this.id;
    }

    public getUserid(): number {
        return this.userid;
    }

    public setUserId(userid: number): void {
        this.userid = userid;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getPersons(): string[] {
        return this.personArr;
    }

    public setPersons(personArrString: string): void {
        this.personArr = personArrString.split(',');
    }

    public getAdjMatrix(): number[][] {
        return this.adjMatrix;
    }
}
