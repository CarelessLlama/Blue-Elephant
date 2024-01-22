import { AlgorithmRunner } from './AlgorithmRunner';
import { AlgorithmTester } from './TestAlgorithmUtil';

// Random project with 27 nodes and 10 groups and random weights
const project = AlgorithmTester.generateProjectWithRandomWeights(27);
const logic = new AlgorithmRunner(project, 10); // 3 is the number of groups desired
console.log(logic.prettyPrintGroupings());
