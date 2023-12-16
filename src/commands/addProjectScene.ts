import createDebug from 'debug';

import { Project } from '../models/Project';

import { Scenes } from 'telegraf';

import { createProject } from '../db/functions';

import {
    validateProjectDescription,
    validateProjectName,
    getProjectMembersFromString,
} from '../util/userInput';

import { getTextFromTextMessages } from '../util/userInput';

import { BotContext } from '../BotContext';

const debug = createDebug('bot:add_project_command');

const askForProjectName = async (ctx: BotContext) => {
    debug(`Entering addProject scene.`);
    await ctx.reply(
        `Please enter a name for your project. The project name should be at least 3 characters long and cannot start with /.`,
    );
    return ctx.wizard.next();
};

const handleProjectName = async (ctx: BotContext) => {
    debug(`Asking for project name.`);
    try {
        const text = getTextFromTextMessages(ctx);
        validateProjectName(text);

        ctx.scene.session.project = Project.createBlankProject(
            text,
            ctx.from?.id as number,
        );
        await ctx.reply(
            `Project name saved. Please enter a short description for your project.`,
        );
        return ctx.wizard.next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.wizard.selectStep(1);
    }
};

const askForProjectDescription = async (ctx: BotContext) => {
    debug(`Asking for project description.`);
    try {
        const text = getTextFromTextMessages(ctx);
        validateProjectDescription(text);
        ctx.scene.session.project.setDescription(text);
        await ctx.reply(
            `Project description saved. Please enter the project members' names, delimited by commas and no spaces.`,
        );
        return ctx.wizard.next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.wizard.selectStep(2);
    }
};

const askForProjectMembers = async (ctx: BotContext) => {
    debug("Asking for project members' names.");
    try {
        const text = getTextFromTextMessages(ctx);
        const project = ctx.scene.session.project;
        const personArr = getProjectMembersFromString(text);
        project.setPersons(personArr);
        createProject(project);
        await ctx.reply(`Project members saved. Exiting scene now.`);
        return ctx.scene.enter('mainMenu', ctx.scene.session);
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.wizard.selectStep(3);
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
