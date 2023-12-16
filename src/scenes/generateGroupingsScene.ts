import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { AlgorithmRunner } from '../models/AlgorithmRunner';

import { InvalidInputTypeError } from '../exceptions';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';

import { updateProjectInDb } from '../db/functions';
import { getProject, getResponse, handleError } from '../util/botContext';

const debug = createDebug('bot:generate_groupings_command');

const getNumGroups = async (ctx: BotContext) => {
    try {
        debug(`Entering getNumGroups scene.`);
        updateSessionDataBetweenScenes(ctx);
        await ctx.reply(
            `How many groups do you want to generate?`,
            Markup.removeKeyboard(),
        );
        return ctx.wizard.next();
    } catch (error) {
        handleError(ctx, error as Error, debug);
        return ctx.scene.reenter();
    }
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
    return ctx.scene.enter('mainMenu');
};

const generateGroupingsScene = new Scenes.WizardScene(
    'generateGroupings',
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
