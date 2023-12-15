import { ObjectId } from 'mongodb';
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
        Project.validateId(id);
        Project.validateUserId(userid);
        Project.validateName(name);
        Project.validateDescription(description);
        Project.validatePeople(stringPersonArr);
        this.id = id;
        this.userid = userid;
        this.name = name;
        this.description = description;
        this.personArr = stringPersonArr;
        this.validateAdjMatrix(adjMatrix);
        this.adjMatrix = adjMatrix;
    }

    public addPerson(personName: string): void {
        Project.validatePerson(personName);
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
        Project.validateUserId(userid);
        this.userid = userid;
    }

    public setName(name: string): void {
        Project.validateName(name);
        this.name = name;
    }

    public setDescription(description: string): void {
        Project.validateDescription(description);
        this.description = description;
    }

    public setPersons(personArrString: string): void {
        const personArr = personArrString.split(',');
        Project.validatePeople(personArr);
        this.personArr = personArr;
        const n = this.personArr.length;
        this.setAdjMatrix(
            Array(n)
                .fill(null)
                .map(() => Array(n).fill(0)),
        );
    }

    public setAdjMatrix(adjMatrix: number[][]): void {
        this.validateAdjMatrix(adjMatrix);
        this.adjMatrix = adjMatrix;
    }
    public static isValidId(id: string): boolean {
        return ObjectId.isValid(id);
    }
    public static validateId(id: string): void {
        if (!Project.isValidId(id)) {
            throw new Error('Invalid project id.');
        }
    }
    public static isValidUserId(userid: number): boolean {
        return userid >= 0;
    }
    public static validateUserId(userid: number): void {
        if (!Project.isValidUserId(userid)) {
            throw new Error('Invalid user id.');
        }
    }
    public static isValidName(name: string): boolean {
        return name.length >= 3 && !name.startsWith('/');
    }
    public static validateName(name: string): void {
        if (!Project.isValidName(name)) {
            throw new Error(
                'Invalid project name. A project name needs to be at least 3 characters long and cannot start with /.',
            );
        }
    }
    public static isValidDescription(description: string): boolean {
        return description.length >= 3;
    }
    public static validateDescription(description: string): void {
        if (!Project.isValidDescription(description)) {
            throw new Error(
                'Invalid project description. A project description needs to be at least 3 characters long.',
            );
        }
    }
    public static isValidPerson(person: string): boolean {
        return person.length >= 3;
    }
    public static validatePerson(person: string): void {
        if (!Project.isValidPerson(person)) {
            throw new Error(
                'Invalid person name. A person name needs to be at least 3 characters long.',
            );
        }
    }
    public static validatePeople(persons: string[]): void {
        persons.forEach((person) => Project.validatePerson(person));
    }
    private validateAdjMatrix(adjMatrix: number[][]): void {
        if (adjMatrix.length !== this.personArr.length) {
            throw new Error(
                'Invalid adjacency matrix. The number of rows in the adjacency matrix must be equal to the number of people in the project.',
            );
        }
        adjMatrix.forEach((row) => {
            if (row.length !== this.personArr.length) {
                throw new Error(
                    'Invalid adjacency matrix. The number of columns in the adjacency matrix must be equal to the number of people in the project.',
                );
            }
        });
    }
}
