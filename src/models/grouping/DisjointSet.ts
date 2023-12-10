export class DisjointSet<T> {
    private parent: Map<T, T>;

    constructor();
    constructor(ls?: T[]) {
        this.parent = new Map();
        if (ls) {
            ls.forEach(element => this.parent.set(element, element));
        }
    }

    public setParent(ls: T[]): void {
        this.parent = new Map();
        if (ls) {
            ls.forEach(element => this.parent.set(element, element));
        }
    }

    public find(t: T): T {
        if (this.parent.get(t) !== t) {
            this.parent.set(t, this.find(this.parent.get(t) as T));
        }
        return this.parent.get(t) as T;
    }

    public union(node1: T, node2: T): void {
        const root1 = this.find(node1);
        const root2 = this.find(node2);
        if (root1 !== root2) {
            this.parent.set(root2, root1);
        }
    }
}