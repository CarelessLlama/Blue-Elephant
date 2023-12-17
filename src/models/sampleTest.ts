import { AlgorithmRunner } from './AlgorithmRunner';
import { AlgorithmTester } from './TestAlgorithmUtil';
import { Project } from './Project';

// Random project with 27 nodes and 10 groups and random weights
const project = AlgorithmTester.generateProjectWithRandomWeights(27);
const logic = new AlgorithmRunner(project, 10); // 3 is the number of groups desired
console.log(logic.prettyPrintGroupings());

// Project with 27 nodes and 10 groups and 0 weights
const project2 = Project.createBlankProject('proj name', 27);
const logic2 = new AlgorithmRunner(project2, 10); // 3 is the number of groups desired
console.log(logic2.prettyPrintGroupings());
