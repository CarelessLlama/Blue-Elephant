import createDebug from 'debug';
import { Markup } from 'telegraf';

import { InvalidTextError } from '../exceptions';
import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import { updateProjectInDb } from '../db/functions';
import { makeSceneWithErrorHandling } from '../util/scene';
import { getProject, getResponse } from '../util/botContext';

const debug = createDebug('bot:reset_interactions_command');

const resetInteractions = async (ctx: BotContext) => {
    debug(`Entering resetInteractions scene.`);
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `Are you sure you want to reset the groupings?`,
        Markup.keyboard([['Yes', 'No']]).resize(),
    );
    return ctx.wizard.next();
};

const handleResetInteractions = async (ctx: BotContext) => {
    debug('User entered reset interactions option.');
    const text = getResponse(ctx);

    if (text === 'Yes') {
        const project = getProject(ctx);
        project.resetInteractions();
        updateProjectInDb(project);
        await ctx.reply('Interactions have been reset.');
    } else if (text === 'No') {
        await ctx.reply('Interactions have not been reset.');
    } else {
        throw new InvalidTextError('Please select either Yes or No.');
    }
    return ctx.scene.enter('mainMenu');
};

const resetInteractionsScene = makeSceneWithErrorHandling(
    'resetInteractions',
    debug,
    resetInteractions,
    handleResetInteractions,
);

export { resetInteractionsScene };
