import createDebug from 'debug';
import { Markup, MiddlewareFn } from 'telegraf';

import { BotContext } from '../BotContext';
import {
    askAndHandleMenuFactory,
    goNextStep,
    makeSceneWithErrorHandling,
} from '../util/scene';

const debug = createDebug('bot:generate_existing_projects_command');

const mainMenu = async (ctx: BotContext, next: () => Promise<void>) => {
    debug(`Entering Main Menu scene.`);
    return goNextStep(ctx, next);
};

const question = `What do you want to do?`;
const map = new Map<string, MiddlewareFn<BotContext>>([
    [
        'Create New Project',
        async (ctx) => ctx.scene.enter('addProject', Markup.removeKeyboard()),
    ],
    [
        'View Existing Project(s)',
        async (ctx) =>
            ctx.scene.enter('existingProjects', Markup.removeKeyboard()),
    ],
]);

const [askForMenuChoice, handleMenuChoice] = askAndHandleMenuFactory(
    debug,
    undefined,
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
