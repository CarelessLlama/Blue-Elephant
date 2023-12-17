import createDebug from 'debug';

import { MiddlewareFn } from 'telegraf';

import { deleteProjectInDb } from '../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import {
    askAndHandleMenuFactory,
    goNextStep,
    goToScene,
    makeSceneWithErrorHandling,
    returnToPreviousMenuFactory,
} from '../util/scene';
import { getProject } from '../util/botContext';

const debug = createDebug('bot:delete_project_command');
const previousMenu = 'manageProject';

/**
 * Deletes a project from the database.
 * @returns A middleware function that handles the deletion of a project.
 */
const deleteProject = async (ctx: BotContext, next: () => Promise<void>) => {
    updateSessionDataBetweenScenes(ctx);
    debug(`Entering deleteProject scene.`);
    return goNextStep(ctx, next);
};

const question = `Are you sure you want to delete the project?`;
const map = new Map<string, MiddlewareFn<BotContext>>([
    [
        'Yes',
        async (ctx) => {
            const project = getProject(ctx);
            await deleteProjectInDb(project.getId());
            await ctx.reply(`Project deleted.`);
            return goToScene('mainMenu', ctx);
        },
    ],
    ['No', returnToPreviousMenuFactory(previousMenu)],
]);

const [askForMenuChoice, handleMenuChoice] = askAndHandleMenuFactory(
    debug,
    undefined,
    question,
    map,
);

const deleteProjectScene = makeSceneWithErrorHandling(
    'deleteProject',
    debug,
    deleteProject,
    askForMenuChoice,
    handleMenuChoice,
);

export { deleteProjectScene };
