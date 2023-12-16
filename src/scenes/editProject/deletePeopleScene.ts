import createDebug from 'debug';

import { updateProjectInDb } from '../../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { isBackCommand, parsePeopleListString } from '../../util/userInput';
import { getProject, getResponse } from '../../util/botContext';
import { makeSceneWithErrorHandling } from '../../util/scene';

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
    const text = getResponse(ctx);
    if (isBackCommand(text)) {
        debug('User indicated to go back');
        return ctx.scene.enter('manageProject', ctx.scene.session);
    }
    const personArr = parsePeopleListString(text);
    const project = getProject(ctx);
    debug(`Removing ${personArr.length} project members: ${personArr}`);
    project.removePersons(personArr);
    updateProjectInDb(project);
    await ctx.reply(`Project members removed. Exiting scene now.`);
    return ctx.scene.enter('manageProject', ctx.scene.session);
};

const deletePeopleScene = makeSceneWithErrorHandling(
    'deletePeople',
    debug,
    deletePeople,
    askForProjectMembers,
);

export { deletePeopleScene };
