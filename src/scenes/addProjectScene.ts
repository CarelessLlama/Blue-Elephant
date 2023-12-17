import createDebug from 'debug';

import { Project } from '../models/Project';
import { BotContext } from '../BotContext';
import { getUserId, storeProjectInSession } from '../util/botContext';
import {
    askForProjectDescription,
    askForProjectMembers,
    askForProjectName,
    goNextStep,
    handleAddProjectMembersFactory,
    handleEditProjectDescriptionFactory,
    handleEditProjectNameFactory,
    makeSceneWithErrorHandling,
    saveProject,
} from '../util/scene';

const debug = createDebug('bot:add_project_command');
const previousLocation = 'mainMenu';

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

const addProjectScene = makeSceneWithErrorHandling(
    'addProject',
    debug,
    addProject,
    createNewProject,
    askForProjectName,
    handleEditProjectNameFactory(debug, previousLocation),
    askForProjectDescription,
    handleEditProjectDescriptionFactory(debug, previousLocation),
    askForProjectMembers,
    handleAddProjectMembersFactory(debug, previousLocation),
    saveProject,
);

export { addProjectScene };
