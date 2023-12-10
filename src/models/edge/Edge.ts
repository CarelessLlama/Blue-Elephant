export class Edge<T> {
    private node1: T;
    private node2: T;
    private weight: number;

    constructor(node1: T, node2: T, weight: number) {
        this.node1 = node1;
        this.node2 = node2;
        this.weight = weight;
    }

    public compareTo(edge: Edge<T>): number {
        return this.weight < edge.getWeight() ? -1 : this.weight > edge.getWeight() ? 1 : 0;
    }

    public getT1(): T {
        return this.node1;
    }

    public getT2(): T {
        return this.node2;
    }

    public getWeight(): number {
        return this.weight;
    }
}