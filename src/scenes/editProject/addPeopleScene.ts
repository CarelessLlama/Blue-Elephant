import createDebug from 'debug';

import { updateProjectInDb } from '../../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { isBackCommand, parsePeopleListString } from '../../util/userInput';
import { getResponse, getProject } from '../../util/botContext';
import { makeSceneWithErrorHandling } from '../../util/scene';

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
    const text = getResponse(ctx);
    if (isBackCommand(text)) {
        debug('User indicated to go back');
        return ctx.scene.enter('manageProject', ctx.scene.session);
    }
    const personArr = parsePeopleListString(text);
    debug(`Project members' inputs: ${text}`);
    const project = getProject(ctx);
    project.addPeople(personArr);
    updateProjectInDb(project);
    await ctx.reply(`Project members saved. Exiting scene now.`);
    return ctx.scene.enter('manageProject', ctx.scene.session);
};

const addPeopleScene = makeSceneWithErrorHandling(
    'addPeople',
    debug,
    addPeople,
    askForProjectMembers,
);

export { addPeopleScene };
