import createDebug from 'debug';
import { MiddlewareFn } from 'telegraf';

import { BotContext } from '../BotContext';
import {
    askAndHandleMenuFactory,
    goNextStep,
    goToScene,
    makeSceneWithErrorHandling,
} from '../util/scene';

const debug = createDebug('bot:generate_existing_projects_command');

const mainMenu = async (ctx: BotContext, next: () => Promise<void>) => {
    debug(`Entering Main Menu scene.`);
    return goNextStep(ctx, next);
};

const question = `What do you want to do?`;
const map = new Map<string, MiddlewareFn<BotContext>>([
    ['Create New Project', async (ctx) => goToScene('addProject', ctx)],
    [
        'View Existing Project(s)',
        async (ctx) => goToScene('existingProjects', ctx),
    ],
]);

const [askForMenuChoice, handleMenuChoice] = askAndHandleMenuFactory(
    debug,
    '',
    question,
    map,
);

const viewMainMenuScene = makeSceneWithErrorHandling(
    'mainMenu',
    debug,
    mainMenu,
    askForMenuChoice,
    handleMenuChoice,
);

export { viewMainMenuScene };
