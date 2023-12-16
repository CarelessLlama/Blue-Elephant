import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { UnknownError, InvalidInputTypeError } from '../exceptions';

import { BotContext } from '../BotContext';

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
        if (!ctx.message) {
            throw new UnknownError(
                'An unknown error occurred. Please try again later.',
            );
        }

        if (!('text' in ctx.message)) {
            throw new InvalidInputTypeError(
                'Invalid input type. Please enter a text message.',
            );
        }
        // const text = ctx.message.text;
        if (ctx.message?.text === 'Create New Project') {
            debug('User selected "Create New Project"');
            // Handle 'Create New Project' option
            // ...
            return ctx.scene.enter('addProject', Markup.removeKeyboard());
        } else if (ctx.message?.text === 'View Existing Project(s)') {
            debug('User selected "View Existing Project(s)"');
            // Handle 'View Existing Project(s)' option
            // ...
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
