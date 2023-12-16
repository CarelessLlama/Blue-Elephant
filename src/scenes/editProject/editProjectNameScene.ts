import createDebug from 'debug';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { updateProjectInDb } from '../../db/functions';
import { getProject, getResponse } from '../../util/botContext';
import { isBackCommand } from '../../util/userInput';
import { makeSceneWithErrorHandling } from '../../util/scene';

const editProjectName = async (ctx: BotContext) => {
    debug('Entered editProjectName scene.');
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `Please enter your new project name. To cancel, type "Back".`,
    );
    return ctx.wizard.next();
};

const handleEditProjectName = async (ctx: BotContext) => {
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
};

const debug = createDebug('bot:edit_project_name_command');

const editProjectNameScene = makeSceneWithErrorHandling(
    'editProjectName',
    debug,
    editProjectName,
    handleEditProjectName,
);

export { editProjectNameScene };
