import createDebug from 'debug';

import { Scenes } from 'telegraf';

import { InvalidTextError } from '../../exceptions';

import { updateProject } from '../../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { isBackCommand, parsePeopleListString } from '../../util/userInput';
import { getResponse, getProject, handleError } from '../../util/botContext';

const debug = createDebug('bot:edit_project_description_command');

const addPeople = async (ctx: BotContext) => {
    debug('Entered addPeople scene.');
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `Please enter the project members' names, delimited by commas. To cancel, type "Back".`,
    );
    return ctx.wizard.next();
};

const askForProjectMembers = async (ctx: BotContext) => {
    try {
        const text = getResponse(
            ctx,
            new InvalidTextError(
                'Please enter a valid string representing group members, delimited by commas.',
            ),
        );
        if (isBackCommand(text)) {
            debug('User indicated to go back');
            return ctx.scene.enter('manageProject', ctx.scene.session);
        }
        const personArr = parsePeopleListString(text);
        debug(`Project members' inputs: ${text}`);
        const project = getProject(ctx);
        project.addPeople(personArr);
        updateProject(project);
        await ctx.reply(`Project members saved. Exiting scene now.`);
        return ctx.scene.enter('manageProject', ctx.scene.session);
    } catch (error) {
        await handleError(ctx, error as Error, debug);
        return ctx.scene.reenter();
    }
};

const addPeopleScene = new Scenes.WizardScene(
    'addPeople',
    addPeople,
    askForProjectMembers,
);

export { addPeopleScene };
