import { Person } from "./Person";

export class PersonManager {
    private persons: Person[] = [];

    constructor();
    constructor(persons?: Person[]) {
        if (persons) {
            this.persons = persons;
        }
        this.sortPersons();
    }

    private sortPersons(): void {
        this.persons.sort((a, b) => a.compareTo(b));
    }

    public addPerson(person: Person): void {
        person.setPersonMap(this.getPersons());
        this.persons.forEach((p) => p.addPerson(person));
        this.persons.push(person);
    }

    public removePerson(person: Person): void {
        this.persons.forEach((p) => p.removePerson(person));
        this.persons = this.persons.filter((p) => p !== person);
    }

    public getPersons(): Person[] {
        return this.persons;
    }

    public getInteractions(person1: Person, person2: Person) {
        return person1.getInteraction(person2)?? person2.getInteraction(person1);
    }

    public getSize(): number {
        return this.persons.length;
    }
    
    
}