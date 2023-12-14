import createDebug from 'debug';

import { Scenes } from 'telegraf';

import { UnknownError, InvalidInputTypeError } from '../../exceptions';

import { saveProject } from '../../db/functions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';

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
        if (!ctx.message || !ctx.from) {
            throw new UnknownError(
                'An unknown error occurred. Please try again later.',
            );
        }

        if (!('text' in ctx.message)) {
            throw new InvalidInputTypeError(
                'Invalid input type. Please enter a text message.',
            );
        }

        if (ctx.message?.text === 'Back') {
            debug('User selected "Back"');
            return ctx.scene.enter('editProject', ctx.scene.session);
        }

        ctx.scene.session.project.setDescription(ctx.message.text);
        saveProject(ctx.scene.session.project);
        await ctx.reply(`Project description updated. Returning to menu.`);
        return ctx.scene.enter('mainMenu', ctx.scene.session);
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const editProjectDescriptionScene = new Scenes.WizardScene(
    'editProjectDescription',
    editProjectDescription,
    handleEditProjectDescription,
);

export { editProjectDescriptionScene };
