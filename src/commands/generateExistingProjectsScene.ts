import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { UnknownError, InvalidInputTypeError } from '../exceptions';

import { BotContext } from '../BotContext';

const debug = createDebug('bot:existing_projects_command');

const viewExistingProjects = async (ctx: BotContext) => {
    debug(`Entering viewExistingProjects scene.`);
    await ctx.reply(
        `Please choose an existing project that you want to view.`,
        Markup.keyboard([
            ['Project 1', 'Project 2', 'Project 3'], // Each array represents a row of buttons, to be retrieved from DB
        ]).resize(),
    );
    return ctx.wizard.next();
};

const handleExistingProjects = async (ctx: BotContext) => {
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
        const text = ctx.message.text;
        // search for existing projects based on project names in DB
        const userProjectList = ['Project 1', 'Project 2', 'Project 3'];
        if (userProjectList.includes(text)) {
            debug(`User selected to view ${text}`);
            await ctx.reply(
                `Viewing existing project.`,
                Markup.removeKeyboard(),
            );
            // Add logic to manipulate selected project here
            return ctx.scene.leave();
        } else {
            await ctx.reply(
                'Invalid option. Please select a valid option from the keyboard.',
            );
            return ctx.scene.reenter();
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const generateExistingProjectsScene = new Scenes.WizardScene<BotContext>(
    'existingProjects',
    viewExistingProjects,
    handleExistingProjects,
);

export { generateExistingProjectsScene };
