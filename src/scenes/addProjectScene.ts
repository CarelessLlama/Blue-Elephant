import createDebug from 'debug';

import { Project } from '../models/Project';
import { createProjectInDb } from '../db/functions';
import { BotContext } from '../BotContext';
import {
    getProject,
    getResponse,
    getUserId,
    storeProjectInSession,
} from '../util/botContext';
import { parsePeopleListString } from '../util/userInput';
import { makeSceneWithErrorHandling } from '../util/scene';

const debug = createDebug('bot:add_project_command');

/**
 * Creates a new project in the database.
 * @returns A scene with middleware functions that handles the creation of a project.
 */
const askForProjectName = async (ctx: BotContext) => {
    debug(`Entering addProject scene.`);
    await ctx.reply(
        `Please enter a name for your project. The project name should be at least 3 characters long and cannot start with /.`,
    );
    return ctx.wizard.next();
};

const handleProjectName = async (ctx: BotContext) => {
    const userId = getUserId(ctx);
    const text = getResponse(ctx);
    storeProjectInSession(ctx, Project.createBlankProject(text, userId));
    await ctx.reply(`Please enter a short description for your project.`);
    return ctx.wizard.next();
};

const askForProjectDescription = async (ctx: BotContext) => {
    const text = getResponse(ctx);
    debug(`Project description: ${text}`);
    getProject(ctx).setDescription(text);
    await ctx.reply(
        `Please enter the project members' names, delimited by commas.`,
    );
    return ctx.wizard.next();
};

const askForProjectMembers = async (ctx: BotContext) => {
    const text = getResponse(ctx);
    debug(`Project members' inputs: ${text}`);
    const personArr = parsePeopleListString(text);
    const project = getProject(ctx);
    project.setPersons(personArr);
    createProjectInDb(project);
    await ctx.reply(`Project members saved. Exiting scene now.`);
    return ctx.scene.enter('mainMenu', ctx.scene.session);
};

const addProjectScene = makeSceneWithErrorHandling(
    'addProject',
    debug,
    askForProjectName,
    handleProjectName,
    askForProjectDescription,
    askForProjectMembers,
);

export { addProjectScene };
