export class Group<T> {
    private group: T[];

    constructor(ls: T[]) {
        this.group = ls;
    }
}