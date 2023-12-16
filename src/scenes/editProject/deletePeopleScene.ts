import createDebug from 'debug';

import { Scenes } from 'telegraf';

import { InvalidTextError } from '../../exceptions';

import { updateProjectInDb } from '../../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { isBackCommand, parsePeopleListString } from '../../util/userInput';
import { getProject, getResponse, handleError } from '../../util/botContext';

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
        const project = getProject(ctx);
        debug(`Removing ${personArr.length} project members: ${personArr}`);
        project.removePersons(personArr);
        updateProjectInDb(project);
        await ctx.reply(`Project members removed. Exiting scene now.`);
        return ctx.scene.enter('manageProject', ctx.scene.session);
    } catch (error) {
        await handleError(ctx, error as Error, debug);
        return ctx.scene.reenter();
    }
};

const deletePeopleScene = new Scenes.WizardScene(
    'deletePeople',
    deletePeople,
    askForProjectMembers,
);

export { deletePeopleScene };
