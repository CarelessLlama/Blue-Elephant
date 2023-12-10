import { Group } from "./Group";
import { DisjointSet } from "./DisjointSet";
import { Edge } from "./../edge/Edge";

export class GroupManager<T> {
    private disjointSet: DisjointSet<T> = new DisjointSet<T>();

    constructor();
    constructor(disjointSet?: DisjointSet<T>) {
        if (disjointSet) {
            this.disjointSet = disjointSet;
        }
    }

    public setParent(ls: T[]): void {
        this.disjointSet.setParent(ls);
    }
    
    

    public takeEdge(edge: Edge<T>): void {
        this.disjointSet.union(edge.getT1(), edge.getT2());
    }
}