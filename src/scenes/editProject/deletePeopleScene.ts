import createDebug from 'debug';

import { Scenes } from 'telegraf';

import {
    UnknownError,
    InvalidInputTypeError,
    InvalidTextError,
} from '../../exceptions';

import { updateProject } from '../../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { parsePeopleListString } from '../../util/userInput';

const debug = createDebug('bot:edit_project_description_command');

const deletePeople = async (ctx: BotContext) => {
    debug('Entered deletePeople scene.');
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `Please enter the project members' names, delimited by commas. To cancel, type "Back".`,
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
                'Please enter a valid string representing group members, delimited by commas.',
            );
        }
        if (ctx.message?.text === 'Back') {
            debug('User selected "Back"');
            return ctx.scene.enter('manageProject', ctx.scene.session);
        }
        debug(`Project members' inputs: ${text}`);
        const project = ctx.scene.session.project;
        const personArr = parsePeopleListString(text);
        debug(`Removing ${personArr.length} project members: ${personArr}`);
        project.removePersons(personArr);
        updateProject(project);
        await ctx.reply(`Project members removed. Exiting scene now.`);
        return ctx.scene.enter('manageProject', ctx.scene.session);
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const deletePeopleScene = new Scenes.WizardScene(
    'deletePeople',
    deletePeople,
    askForProjectMembers,
);

export { deletePeopleScene };
