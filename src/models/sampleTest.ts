import { AlgorithmRunner } from './AlgorithmRunner';
import { AlgorithmTester } from './TestAlgorithmUtil';

const project = AlgorithmTester.generateProject(27);
console.log(project.getAdjMatrix());
const logic = new AlgorithmRunner(project, 10); // 3 is the number of groups desired
console.log(logic.prettyPrintGroupings());
