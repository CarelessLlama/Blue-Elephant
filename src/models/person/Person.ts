import { Interactable } from "./Interactable";

export class Person implements Interactable {
    private name: string;
    private personMap: Map<Person, number> = new Map<Person, number>();

    constructor(name: string) {
        this.name = name;
    }
    
    public setPersonMap(persons: Person[]): void {
        persons.forEach((person) => this.personMap.set(person, 0));
    }

    public addPerson(person: Person): void {
        this.personMap.set(person, 0);
    }

    public removePerson(person: Person): void {
        this.personMap.delete(person);
    }

    public interactWith(person: Person): void {
        if (!this.personMap.has(person)) {
            this.addPerson(person);
        }
        this.personMap.set(person, (this.personMap.get(person) ?? 0) + 1);
    }

    public getInteraction(person: Person): number {
        return this.personMap.get(person) ?? 0;
    }

    public getName(): string {
        return this.name;
    }
    
    public compareTo(person: Person): number {
        return this.name < person.getName() ? -1 : this.name > person.getName() ? 1 : 0;
    }
}
