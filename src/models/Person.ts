export class Person {
    constructor(
        private name: string,
        private id: number,
    ) {
        this.name = name;
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public toString(): string {
        return this.name;
    }
}
