import { Project } from './Project';

/**
 * Utility class for testing the algorithm
 */
class AlgorithmTester {
    public constructor() {}

    /**
     * Generate a symmetrical matrix
     * @param size - Size of the matrix
     * @returns a symmetrical matrix
     */
    public static generateSymmetricalMatrix(size: number): number[][] {
        const matrix = Array(size)
            .fill(null)
            .map(() => Array(size).fill(0));
        for (let i = 0; i < size; i++) {
            for (let j = i; j < size; j++) {
                const randomValue = Math.floor(Math.random() * 5) + 1;
                matrix[i][j] = randomValue;
                matrix[j][i] = randomValue;
            }
        }
        return matrix;
    }

    /**
     * Generate a project with random weights
     * @param n - Size of the project
     * @returns a project with random weights
     */
    public static generateProjectWithRandomWeights(n: number): Project {
        return Project.createProject(
            'projid1',
            1,
            'projname',
            'projdesc',
            this.generateSymmetricalMatrix(n),
            Array(n)
                .fill(null)
                .map((_, i) => 'name ' + i.toString()),
        );
    }
}

export { AlgorithmTester };
