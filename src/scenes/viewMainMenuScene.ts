import createDebug from 'debug';
import { Markup } from 'telegraf';

import { BotContext } from '../BotContext';
import { getResponse } from '../util/botContext';
import { makeSceneWithErrorHandling } from '../util/scene';
import { InvalidTextError } from '../exceptions';

const debug = createDebug('bot:generate_existing_projects_command');

const askForMainMenuOption = async (ctx: BotContext) => {
    debug(`Entering Main Menu scene.`);
    await ctx.reply(
        `Please select what you want to do.`,
        Markup.keyboard([
            ['Create New Project', 'View Existing Project(s)'], // Each array represents a row of buttons
        ]).resize(),
    );
    return ctx.wizard.next();
};

const handleMainMenuOption = async (ctx: BotContext) => {
    const text = getResponse(ctx);
    if (text === 'Create New Project') {
        debug('User selected "Create New Project"');
        return ctx.scene.enter('addProject', Markup.removeKeyboard());
    } else if (text === 'View Existing Project(s)') {
        debug('User selected "View Existing Project(s)"');
        return ctx.scene.enter('existingProjects', Markup.removeKeyboard());
    } else {
        throw new InvalidTextError(
            'Invalid option. Please select a valid option from the keyboard.',
        );
    }
};

const viewMainMenuScene = makeSceneWithErrorHandling(
    'mainMenu',
    debug,
    askForMainMenuOption,
    handleMainMenuOption,
);

export { viewMainMenuScene };
