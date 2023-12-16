import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { UnknownError, InvalidInputTypeError } from '../exceptions';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';

import { updateProjectInDb } from '../db/functions';

const debug = createDebug('bot:reset_interactions_command');

const resetInteractions = async (ctx: BotContext) => {
    updateSessionDataBetweenScenes(ctx);
    try {
        debug(`Entering resetInteractions scene.`);
        updateSessionDataBetweenScenes(ctx);
        await ctx.reply(
            `Are you sure you want to reset the groupings?`,
            Markup.keyboard([['Yes', 'No']]).resize(),
        );
        return ctx.wizard.next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const handleResetInteractions = async (ctx: BotContext) => {
    debug('User entered reset interactions option.');
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

    if (ctx.message?.text === 'Yes') {
        ctx.scene.session.project.resetInteractions();
        updateProjectInDb(ctx.scene.session.project);
        await ctx.reply('Interactions have been reset.');
    } else if (ctx.message?.text === 'No') {
        await ctx.reply('Interactions have not been reset.');
    }
    return ctx.scene.enter('mainMenu');
};

const resetInteractionsScene = new Scenes.WizardScene(
    'resetInteractions',
    resetInteractions,
    handleResetInteractions,
);

export { resetInteractionsScene };
