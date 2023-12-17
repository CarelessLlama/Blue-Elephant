import createDebug from 'debug';
import { Markup } from 'telegraf';

import { AlgorithmRunner } from '../models/AlgorithmRunner';
import { InvalidInputTypeError } from '../exceptions';
import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import { updateProjectInDb } from '../db/functions';
import { getProject, getResponse } from '../util/botContext';
import {
    goToScene,
    makeSceneWithErrorHandling,
    waitForUserResponse,
} from '../util/scene';

const debug = createDebug('bot:generate_groupings_command');
const previousMenu = 'manageProject';

const getNumGroups = async (ctx: BotContext) => {
    debug(`Entering getNumGroups scene.`);
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `How many groups do you want to generate?`,
        Markup.removeKeyboard(),
    );
    return waitForUserResponse(ctx);
};

const handleNumGroups = async (ctx: BotContext) => {
    debug('User entered number of groups.');
    const text = getResponse(ctx);
    const numGroups = getNumberOfGroups(text);

    const project = getProject(ctx);
    const logic = new AlgorithmRunner(project, numGroups);

    const groupings = logic.prettyPrintGroupings();
    logic.updateInteractionsBasedOnGeneratedGroupings();

    updateProjectInDb(project);
    const out = `Here are the groupings:\n${groupings}.
    Do not delete this message as you will need it to view the groupings again.`;
    await ctx.reply(out);
    return goToScene(previousMenu, ctx);
};

const generateGroupingsScene = makeSceneWithErrorHandling(
    'generateGroupings',
    debug,
    getNumGroups,
    handleNumGroups,
);

export { generateGroupingsScene };

function getNumberOfGroups(text: string): number {
    const numGroups = parseInt(text);
    if (isNaN(numGroups)) {
        throw new InvalidInputTypeError(
            'Invalid input. Please enter a number.',
        );
    }
    return numGroups;
}
