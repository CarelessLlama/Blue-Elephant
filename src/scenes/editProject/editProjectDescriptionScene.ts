import createDebug from 'debug';

import { Scenes } from 'telegraf';

import { UnknownError, InvalidInputTypeError } from '../../exceptions';

import { updateProjectInDb } from '../../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { getProject, getResponse, handleError } from '../../util/botContext';
import { isBackCommand } from '../../util/userInput';

const debug = createDebug('bot:edit_project_description_command');

const editProjectDescription = async (ctx: BotContext) => {
    debug('Entered editProjectDescription scene.');
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `Please enter your new project description. To cancel, type "Back".`,
    );
    return ctx.wizard.next();
};

const handleEditProjectDescription = async (ctx: BotContext) => {
    try {
        const text = getResponse(ctx);
        if (isBackCommand(text)) {
            debug('User selected "Back"');
            return ctx.scene.enter('editProject', ctx.scene.session);
        }
        const project = getProject(ctx);
        project.setDescription(text);
        updateProjectInDb(project);
        await ctx.reply(`Project description updated.`);
        return ctx.scene.enter('editProject', ctx.scene.session);
    } catch (error) {
        handleError(ctx, error as Error, debug);
        return ctx.scene.reenter();
    }
};

const editProjectDescriptionScene = new Scenes.WizardScene(
    'editProjectDescription',
    editProjectDescription,
    handleEditProjectDescription,
);

export { editProjectDescriptionScene };
