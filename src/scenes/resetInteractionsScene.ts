import createDebug from 'debug';
import { Markup, MiddlewareFn } from 'telegraf';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import { updateProjectInDb } from '../db/functions';
import {
    askAndHandleMenuFactory,
    goNextStep,
    goToScene,
    makeSceneWithErrorHandling,
} from '../util/scene';
import { getProject } from '../util/botContext';

const debug = createDebug('bot:reset_interactions_command');
const previousMenu = 'manageProject';

const resetInteractions = async (
    ctx: BotContext,
    next: () => Promise<void>,
) => {
    debug(`Entering resetInteractions scene.`);
    updateSessionDataBetweenScenes(ctx);
    return goNextStep(ctx, next);
};

const question = `Are you sure you want to reset the groupings?`;
const map = new Map<string, MiddlewareFn<BotContext>>([
    [
        'Yes',
        async (ctx) => {
            const project = getProject(ctx);
            project.resetInteractions();
            updateProjectInDb(project);
            await ctx.reply('Interactions have been reset.');
            return goToScene(previousMenu, ctx);
        },
    ],
    ['No', async (ctx) => goToScene(previousMenu, ctx)],
]);

const [askForMenuChoice, handleMenuChoice] = askAndHandleMenuFactory(
    debug,
    undefined,
    question,
    map,
);

const resetInteractionsScene = makeSceneWithErrorHandling(
    'resetInteractions',
    debug,
    resetInteractions,
    askForMenuChoice,
    handleMenuChoice,
);

export { resetInteractionsScene };
