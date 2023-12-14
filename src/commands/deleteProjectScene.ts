import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { deleteProject } from '../db/functions';

import {
    UnknownError,
    InvalidTextError,
    InvalidInputTypeError,
} from '../exceptions';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';

const debug = createDebug('bot:delete_project_command');
/**
 * Deletes a project from the database.
 * @returns A middleware function that handles the deletion of a project.
 */
const askForDeleteConfirmation = async (ctx: BotContext) => {
    updateSessionDataBetweenScenes(ctx);
    debug(`Entering deleteProject scene.`);
    await ctx.reply(
        `You have selected to delete the project. Are you sure?`,
        Markup.keyboard(['Yes', 'No']).resize(),
    );
    return ctx.wizard.next();
};

const handleDeleteProject = async (ctx: BotContext) => {
    try {
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

        const text = ctx.message.text;
        if (text === 'Yes') {
            debug(`User selected to delete the project.`);
            const project = ctx.scene.session.project;
            await deleteProject(project.getId());
            await ctx.reply(`Project deleted.`);
            return ctx.scene.enter('mainMenu');
        } else if (text === 'No') {
            debug(`User selected not to delete the project.`);
            await ctx.reply(`Project not deleted. Returning to the main menu.`);
            return ctx.scene.enter('mainMenu');
        } else {
            throw new InvalidTextError(
                'Please enter a valid option. Please select either Yes or No.',
            );
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const deleteProjectScene = new Scenes.WizardScene<BotContext>(
    'deleteProject',
    askForDeleteConfirmation,
    handleDeleteProject,
);

export { deleteProjectScene };
