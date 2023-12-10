// const DisjointSet = require('./../../src/models/DisjointSet');
import { DisjointSet } from './../../src/models/DisjointSet';

describe('DisjointSet', () => {
  it('should initialize correctly', () => {
    const disjointSet = new DisjointSet(5);
    expect(disjointSet.parent).toEqual([0, 1, 2, 3, 4]);
  });

  it('should find the parent of a node correctly', () => {
    const disjointSet = new DisjointSet(5);
    expect(disjointSet.find(3)).toEqual(3);
  });

  it('should unite two nodes correctly', () => {
    const disjointSet = new DisjointSet(5);
    disjointSet.union(1, 3);
    expect(disjointSet.find(1)).toEqual(disjointSet.find(3));
  });

  it('should not unite two nodes that are already united', () => {
    const disjointSet = new DisjointSet(5);
    disjointSet.union(1, 3);
    const oldParent = disjointSet.find(1);
    disjointSet.union(1, 3);
    expect(disjointSet.find(1)).toEqual(oldParent);
  });
});
