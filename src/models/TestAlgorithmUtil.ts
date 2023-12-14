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
     * Generate a project
     * @param n - Size of the project
     * @returns a project
     */
    public static generateProject(n: number): Project {
        return new Project(
            '1',
            1,
            'test',
            'test',
            this.generateSymmetricalMatrix(n),
            ['test1', 'test2'],
        );
    }
}

export { AlgorithmTester };
