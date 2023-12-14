import { Project } from './Project';
import { SortedEdgeGenerator } from './SortedEdgeGenerator';

/**
 * Class that runs the algorithm to generate optimal groupings for a project
 */
class AlgorithmRunner {
    public constructor() {}

    /**
     * Run the algorithm
     * @param project - Project to run the algorithm on
     * @param numGroups - Number of groups to split the project into
     * @returns array of groups
     */
    public static run(project: Project, numGroups: number) {
        const adjMatrix = project.getAdjMatrix();
        const numPeople = adjMatrix.length;
        const groupSize = Math.floor(numPeople / numGroups);
        const sortedEdgeGenerator = new SortedEdgeGenerator(adjMatrix);
        let nodes = Array.from({ length: numPeople }, (_, i) => i);
        const tmp: number[] = [];
        while (tmp.length < numGroups) {
            const edge = sortedEdgeGenerator.next();
            const node1 = edge.node1;
            const node2 = edge.node2;
            if (!tmp.includes(node1)) {
                tmp.push(node1);
                nodes = nodes.filter((node) => node !== node1);
            }
            if (!tmp.includes(node2) && tmp.length < numGroups) {
                tmp.push(node2);
                nodes = nodes.filter((node) => node !== node2);
            }
        }
        const groupings = tmp.map((group) => [group]);
        nodes.forEach((node) => {
            const groupIndex = AlgorithmRunner.addToGroupToMinimizeCost(
                adjMatrix,
                groupings,
                node,
                groupSize,
            );
            groupings[groupIndex].push(node);
        });
        console.log(groupings);
        return groupings;
    }

    /**
     * Retrieve the index of the group that minimizes the cost of adding a node to it
     * @param adjMatrix - Adjacency matrix of the project
     * @param groupings - Groupings of the project
     * @param node - Node to add to a group
     * @param groupSize - Group size
     * @returns index of the group that minimizes the cost of adding a node to it
     */

    private static addToGroupToMinimizeCost(
        adjMatrix: number[][],
        groupings: number[][],
        node: number,
        groupSize: number,
    ): number {
        let minCost = Infinity;
        let minIndex = 0;
        for (let i = 0; i < groupings.length; i++) {
            const cost = AlgorithmRunner.getCost(adjMatrix, groupings[i], node);
            if (cost < minCost && groupings[i].length < groupSize) {
                minCost = cost;
                minIndex = i;
            }
        }
        if (minCost === Infinity) {
            for (let i = 0; i < groupings.length; i++) {
                const cost = AlgorithmRunner.getCost(
                    adjMatrix,
                    groupings[i],
                    node,
                );
                if (cost < minCost) {
                    minCost = cost;
                    minIndex = i;
                }
            }
        }
        return minIndex;
    }

    /**
     * Retrieve total cost of adding a node to a group
     * @param adjMatrix - adjacency matrix of the project
     * @param group - group to add node to
     * @param node - node to add to group
     * @returns cost of adding node to group
     */
    private static getCost(
        adjMatrix: number[][],
        group: number[],
        node: number,
    ): number {
        let cost = 0;
        group.forEach((groupNode) => {
            cost += adjMatrix[groupNode][node];
        });
        return cost;
    }
}

export { AlgorithmRunner };
