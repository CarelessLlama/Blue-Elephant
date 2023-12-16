import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import {
    UnknownError,
    InvalidInputTypeError,
    InvalidTextError,
} from '../exceptions';

import { BotContext } from '../BotContext';
import { getResponse } from '../util/botContext';

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
    try {
        const text = getResponse(ctx);
        if (text === 'Create New Project') {
            debug('User selected "Create New Project"');
            return ctx.scene.enter('addProject', Markup.removeKeyboard());
        } else if (text === 'View Existing Project(s)') {
            debug('User selected "View Existing Project(s)"');
            return ctx.scene.enter('existingProjects', Markup.removeKeyboard());
        } else {
            await ctx.reply(
                'Invalid option. Please select a valid option from the keyboard.',
            );
            return ctx.wizard.back();
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const viewMainMenuScene = new Scenes.WizardScene<BotContext>(
    'mainMenu',
    askForMainMenuOption,
    handleMainMenuOption,
);

export { viewMainMenuScene };
