import createDebug from 'debug';

import { Markup } from 'telegraf';

import { deleteProjectInDb } from '../db/functions';

import { InvalidTextError } from '../exceptions';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import { makeSceneWithErrorHandling } from '../util/scene';
import { getProject, getResponse } from '../util/botContext';

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
    const text = getResponse(ctx);
    if (text === 'Yes') {
        debug(`User selected to delete the project.`);
        const project = getProject(ctx);
        await deleteProjectInDb(project.getId());
        await ctx.reply(`Project deleted.`);
        return ctx.scene.enter('mainMenu');
    } else if (text === 'No') {
        debug(`User selected not to delete the project.`);
        await ctx.reply(`Project not deleted. Returning to the main menu.`);
        return ctx.scene.enter('mainMenu');
    } else {
        throw new InvalidTextError('Please select either Yes or No.');
    }
};

const deleteProjectScene = makeSceneWithErrorHandling(
    'deleteProject',
    debug,
    askForDeleteConfirmation,
    handleDeleteProject,
);

export { deleteProjectScene };
