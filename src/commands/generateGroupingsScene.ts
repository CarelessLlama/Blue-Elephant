import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { AlgorithmRunner } from '../models/AlgorithmRunner';

import { UnknownError, InvalidInputTypeError } from '../exceptions';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';

import { saveProject } from '../db/functions';

const debug = createDebug('bot:generate_groupings_command');

const getNumGroups = async (ctx: BotContext) => {
    updateSessionDataBetweenScenes(ctx);
    try {
        debug(`Entering getNumGroups scene.`);
        updateSessionDataBetweenScenes(ctx);
        await ctx.reply(
            `How many groups do you want to generate?`,
            Markup.removeKeyboard(),
        );
        return ctx.wizard.next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const handleNumGroups = async (ctx: BotContext) => {
    debug('User entered number of groups.');
    if (!ctx.message || !ctx.from) {
        throw new UnknownError(
            'An unknown error occurred. Please try again later.',
        );
    }

    if (!('text' in ctx.message)) {
        throw new InvalidInputTypeError(
            'Invalid input type. Please enter a text message.',
        );
    }

    const numGroups = parseInt(ctx.message.text);

    if (isNaN(numGroups)) {
        throw new InvalidInputTypeError(
            'Invalid input. Please enter a number.',
        );
    }

    const logic = new AlgorithmRunner(ctx.scene.session.project, numGroups);
    const groupings = logic.prettyPrintGroupings();
    logic.updateInteractionsBasedOnGeneratedGroupings();
    saveProject(ctx.scene.session.project);
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
