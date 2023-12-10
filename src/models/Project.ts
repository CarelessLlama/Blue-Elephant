import { Person } from './person/Person';
import { PersonManager } from './person/PersonManager';
import { GroupManager } from './grouping/GroupManager';
import { EdgeManager } from './edge/EdgeManager';
import { Edge } from './edge/Edge';

export class Project {
    private name: string;
    private description: string;
    private personManager: PersonManager = new PersonManager();
    private GroupManager: GroupManager<Person> = new GroupManager<Person>();
    private EdgeManager: EdgeManager<Person> = new EdgeManager<Person>();

    constructor(name: string, description: string);
    constructor(name: string, description: string, personManager?: PersonManager, edgeManager?: EdgeManager<Person>) {
        this.name = name;
        this.description = description;
        if (personManager) {
            this.personManager = personManager;
        }
        if (edgeManager) {
            this.EdgeManager = edgeManager;
        }
    }

    public addPerson(person: Person): void {
        this.personManager.getPersons().forEach((p) => {
            this.EdgeManager.addEdge(new Edge<Person>(person, p, 0));
            this.EdgeManager.addEdge(new Edge<Person>(p, person, 0));
        });
        this.personManager.addPerson(person);
        
    }

    public removePerson(person: Person): void {
        this.personManager.removePerson(person);
        this.EdgeManager.removeEdgesWith(person);
    }

    public getGroupings(numGroups: number): void {
        this.GroupManager.setParent(this.personManager.getPersons());
        this.EdgeManager.setExistingEdges(this.personManager.getPersons());
        const groupSize = Math.round(this.personManager.getSize() / numGroups);
        // CONTINUE HERE
        // How to check if group has already reached group size limit?
        // How to check if number of groups is already reached?

    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getPersons(): PersonManager {
        return this.personManager;
    }

}