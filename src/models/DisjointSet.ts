export class DisjointSet {
    parent: number[];

    constructor(n: number) {
        this.parent = Array.from({length: n}, (_, i) => i);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x: number, y: number): void {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX !== rootY) {
            this.parent[rootY] = rootX;
        }
    }
}

class Edge {
    node1: number;
    node2: number;
    weight: number;

    constructor(node1: number, node2: number, weight: number) {
        this.node1 = node1;
        this.node2 = node2;
        this.weight = weight;
    }
}

function splitGraph(edges: Edge[], n: number, k: number): Edge[] {
    edges.sort((a, b) => b.weight - a.weight);
    const ds = new DisjointSet(n);
    let components = n;
    for (const edge of edges) {
        if (ds.find(edge.node1) !== ds.find(edge.node2)) {
            if (components === k) {
                return edges;
            }
            ds.union(edge.node1, edge.node2);
            components--;
        }
    }
    return edges;
}