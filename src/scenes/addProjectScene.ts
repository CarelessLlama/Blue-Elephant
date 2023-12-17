import createDebug from 'debug';

import { Project } from '../models/Project';
import { BotContext } from '../BotContext';
import {
    getProject,
    getUserId,
    storeProjectInSession,
} from '../util/botContext';
import {
    askForProjectDescription,
    askForProjectMembers,
    askForProjectName,
    goNextStep,
    handleAddProjectMembersFactory,
    handleEditProjectDescriptionFactory,
    handleEditProjectNameFactory,
    makeSceneWithErrorHandling,
    returnToPreviousMenuFactory,
} from '../util/scene';
import { createProjectInDb } from '../db/functions';

const debug = createDebug('bot:add_project_command');
const previousMenu = 'mainMenu';

/**
 * Creates a new project in the database.
 * @returns A scene with middleware functions that handles the creation of a project.
 */
const addProject = async (ctx: BotContext, next: () => Promise<void>) => {
    debug(`Entering addProject scene.`);
    return goNextStep(ctx, next);
};

const createNewProject = async (ctx: BotContext, next: () => Promise<void>) => {
    const userId = getUserId(ctx);
    storeProjectInSession(ctx, Project.createBlankProject(userId));
    return goNextStep(ctx, next);
};

export const saveNewProject = async (
    ctx: BotContext,
    step: () => Promise<void>,
) => {
    const project = getProject(ctx);
    createProjectInDb(project);
    await ctx.reply(`Project saved.`);
    return goNextStep(ctx, step);
};

const addProjectScene = makeSceneWithErrorHandling(
    'addProject',
    debug,
    addProject,
    createNewProject,
    askForProjectName,
    handleEditProjectNameFactory(previousMenu),
    askForProjectDescription,
    handleEditProjectDescriptionFactory(debug, previousMenu),
    askForProjectMembers,
    handleAddProjectMembersFactory(debug, previousMenu),
    saveNewProject,
    returnToPreviousMenuFactory(previousMenu),
);

export { addProjectScene };
