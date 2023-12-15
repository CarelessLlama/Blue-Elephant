import createDebug from 'debug';

import { Scenes } from 'telegraf';

import {
    UnknownError,
    InvalidInputTypeError,
    InvalidTextError,
} from '../../exceptions';

import { saveProject } from '../../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';

const debug = createDebug('bot:edit_project_description_command');

const addPeople = async (ctx: BotContext) => {
    debug('Entered addPeople scene.');
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `Please enter the project members' names, delimited by commas and no spaces. To cancel, type "Back".`,
    );
    return ctx.wizard.next();
};

const askForProjectMembers = async (ctx: BotContext) => {
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
        if (!text) {
            throw new InvalidTextError(
                'Please enter a valid string representing group members, delimited by commas and no spaces.',
            );
        }
        debug(`Project members' inputs: ${text}`);
        const project = ctx.scene.session.project;
        const personArr = text.split(',');
        project.setPersons(personArr);
        saveProject(project);
        await ctx.reply(`Project members saved. Exiting scene now.`);
        return ctx.scene.enter('manageProject', ctx.scene.session);
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const addPeopleScene = new Scenes.WizardScene(
    'addPeople',
    addPeople,
    askForProjectMembers,
);

export { addPeopleScene };
