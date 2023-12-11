/**
 * Edge class for to represent an edge in adjacency matrix
 */
class Edge {
    constructor(
        public node1: number,
        public node2: number,
        public weight: number,
    ) {
        this.node1 = node1;
        this.node2 = node2;
        this.weight = weight;
    }

    /**
     * Compare this edge to another edge
     * @param other Edge to compare to
     * @returns a negative number if this edge is less than the other edge, 0 if they are equal, and a positive number if this edge is greater than the other edge
     */
    public compareTo(other: Edge): number {
        return this.weight - other.weight;
    }

    public toString(): string {
        return `Node 1: ${this.node1}, Node 2:${this.node2}, Weight: ${this.weight}`;
    }
}

/**
 * Generator for sorted edges
 */
class SortedEdgeGenerator {
    private edges: Edge[];
    private index: number;

    constructor(adjMatrix: number[][]) {
        this.edges = [];
        for (let i = 0; i < adjMatrix.length; i++) {
            for (let j = i + 1; j < adjMatrix.length; j++) {
                this.edges.push(new Edge(i, j, adjMatrix[i][j]));
            }
        }
        this.index = 0;
        this.edges.sort((a, b) => a.compareTo(b));
    }

    /**
     * Check if there is another edge
     * @returns true if there is another edge, false otherwise
     */
    public hasNext(): boolean {
        return this.index < this.edges.length;
    }

    /**
     * Get the next edge
     * @returns the next edge
     */
    public next(): Edge {
        return this.edges[this.index++];
    }
}

export { SortedEdgeGenerator, Edge };
