import createDebug from 'debug';

import { MiddlewareFn } from 'telegraf';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import {
    askAndHandleMenuFactory,
    goNextStep,
    goToScene,
    makeSceneWithErrorHandling,
} from '../../util/scene';

const debug = createDebug('bot:edit_project_command');
const previousMenu = 'manageProject';

/**
 * Edits an existing project in the database.
 * @returns A middleware function that handles the editing of a project.
 */
const editProject = async (ctx: BotContext, next: () => Promise<void>) => {
    debug('Entered editProject scene.');
    updateSessionDataBetweenScenes(ctx);
    return goNextStep(ctx, next);
};

const question = 'What do you want to edit?';
const mapOptionToScene = new Map<string, MiddlewareFn<BotContext>>([
    ['Add People', async (ctx) => goToScene('addPeople', ctx)],
    ['Delete People', async (ctx) => goToScene('deletePeople', ctx)],
    ['Edit Project Name', async (ctx) => goToScene('editProjectName', ctx)],
    [
        'Edit Project Description',
        async (ctx) => goToScene('editProjectDescription', ctx),
    ],
]);

const [askForMenuChoice, handleMenuChoice] = askAndHandleMenuFactory(
    debug,
    previousMenu,
    question,
    mapOptionToScene,
);

const editProjectScene = makeSceneWithErrorHandling(
    'editProject',
    debug,
    editProject,
    askForMenuChoice,
    handleMenuChoice,
);

export { editProjectScene };
