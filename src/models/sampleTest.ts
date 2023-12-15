import { AlgorithmRunner } from './AlgorithmRunner';
import { AlgorithmTester } from './TestAlgorithmUtil';

const project = AlgorithmTester.generateProject(9);
const logic = new AlgorithmRunner(project, 3); // 3 is the number of groups desired
console.log(logic.prettyPrintGroupings());
