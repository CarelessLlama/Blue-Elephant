import createDebug from 'debug';
import { Scenes } from 'telegraf';

import { Project } from '../models/Project';
import { createProject } from '../db/functions';
import { BotContext } from '../BotContext';
import {
    getProject,
    getResponse,
    getUserId,
    handleError,
} from '../util/botContext';
import { parsePeopleListString } from '../util/userInput';

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
    try {
        const userId = getUserId(ctx);
        const text = getResponse(ctx);
        storeInSession(ctx, Project.createBlankProject(text, userId));
        await ctx.reply(`Please enter a short description for your project.`);
        return ctx.wizard.next();
    } catch (error) {
        handleError(ctx, error as Error, debug);
        return ctx.scene.reenter();
    }
};

const askForProjectDescription = async (ctx: BotContext) => {
    try {
        const text = getResponse(ctx);
        debug(`Project description: ${text}`);
        getProject(ctx).setDescription(text);
        await ctx.reply(
            `Please enter the project members' names, delimited by commas.`,
        );
        return ctx.wizard.next();
    } catch (error) {
        handleError(ctx, error as Error, debug);
        return ctx.scene.reenter();
    }
};

const askForProjectMembers = async (ctx: BotContext) => {
    try {
        const text = getResponse(ctx);
        debug(`Project members' inputs: ${text}`);
        const personArr = parsePeopleListString(text);
        const project = getProject(ctx);
        project.setPersons(personArr);
        createProject(project);
        await ctx.reply(`Project members saved. Exiting scene now.`);
        return ctx.scene.enter('mainMenu', ctx.scene.session);
    } catch (error) {
        handleError(ctx, error as Error, debug);
        return ctx.scene.reenter();
    }
};

const addProjectScene = new Scenes.WizardScene<BotContext>(
    'addProject',
    askForProjectName,
    handleProjectName,
    askForProjectDescription,
    askForProjectMembers,
);

export { addProjectScene };

function storeInSession(ctx: BotContext, project: Project): void {
    ctx.scene.session.project = project;
}
