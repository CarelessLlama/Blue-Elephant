import { Edge } from "./Edge";
import { Interactable } from "./../person/Interactable";

export class EdgeManager<T extends Interactable> {
    private edges: Edge<T>[] = [];
    private static comparator: (a: Edge<Interactable>, b: Edge<Interactable>) => number = (a, b) => a.compareTo(b);

    constructor();
    constructor(edges?: Edge<T>[]) {
        if (edges) {
            this.edges = edges;
            this.edges.sort(EdgeManager.comparator);
        }
    }

    public addEdge(edge: Edge<T>): void {
        this.edges.push(edge);
    }

    public removeEdge(edge: Edge<T>): void {
        this.edges = this.edges.filter((e) => e !== edge);
    }

    public removeEdgesWith(t: T): void {
        this.edges = this.edges.filter((e) => e.getT1() !== t && e.getT2() !== t);
    }

    public getEdges(): Edge<T>[] {
        return this.edges;
    }

    public empty(): void {
        this.edges = [];
    }

    public setExistingEdges(ls: T[]): void {
        this.empty();
        for (let i = 0; i < ls.length; i++) {
            for (let j = i + 1; j < ls.length; j++) {
                const weight = ls[i].getInteraction(ls[j]);
                const edge = new Edge<T>(ls[i], ls[j], weight);
            }
        }
        this.edges.sort(EdgeManager.comparator);
    }

    public setEdges(ls: Edge<T>[]): void {
        this.edges = ls;
        this.edges.sort(EdgeManager.comparator);
    }
}