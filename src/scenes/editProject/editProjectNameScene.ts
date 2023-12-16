import createDebug from 'debug';

import { Scenes } from 'telegraf';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { updateProjectInDb } from '../../db/functions';
import { getProject, getResponse, handleError } from '../../util/botContext';
import { isBackCommand } from '../../util/userInput';

const debug = createDebug('bot:edit_project_name_command');

const editProjectName = async (ctx: BotContext) => {
    debug('Entered editProjectName scene.');
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `Please enter your new project name. To cancel, type "Back".`,
    );
    return ctx.wizard.next();
};

const handleEditProjectName = async (ctx: BotContext) => {
    try {
        const text = getResponse(ctx);

        if (isBackCommand(text)) {
            debug('User selected "Back"');
            return ctx.scene.enter('editProject', ctx.scene.session);
        }
        const project = getProject(ctx);
        project.setName(text);
        updateProjectInDb(project);
        await ctx.reply(`Project name updated.`);
        return ctx.scene.enter('editProject', ctx.scene.session);
    } catch (error) {
        handleError(ctx, error as Error, debug);
        return ctx.scene.reenter();
    }
};

const editProjectNameScene = new Scenes.WizardScene(
    'editProjectName',
    editProjectName,
    handleEditProjectName,
);

export { editProjectNameScene };
