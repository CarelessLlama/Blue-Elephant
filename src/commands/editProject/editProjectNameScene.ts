import createDebug from 'debug';

import { Scenes } from 'telegraf';

import {
    UnknownError,
    InvalidInputTypeError,
    InvalidTextError,
} from '../../exceptions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { saveProject } from '../../db/functions';

const debug = createDebug('bot:edit_project_name_command');

// This function is repeated from addProjectScene, can potentially be moved to a utils file in the future
const invalidTextName = (text: string) =>
    text.length < 3 || text.startsWith('/');

// const removeMarkupKeyboardAndEnterScene = async (ctx: BotContext) => {
//     if (ctx.callbackQuery) {
//         await ctx.telegram.editMessageReplyMarkup(
//             ctx.chat?.id,
//             ctx.callbackQuery?.message?.message_id,
//             undefined,
//             { inline_keyboard: [] },
//         );
//     }
//     return ctx.wizard.next();
// };

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

        if (invalidTextName(ctx.message.text)) {
            throw new InvalidTextError(
                'Please enter a valid project name. A project name needs to be at least 3 characters long and cannot start with /.',
            );
        }

        if (ctx.message?.text === 'Back') {
            debug('User selected "Back"');
            return ctx.scene.enter('editProject', ctx.scene.session);
        }

        ctx.scene.session.project.setName(ctx.message.text);
        saveProject(ctx.scene.session.project);
        await ctx.reply(`Project name updated. Returning to menu.`);
        return ctx.scene.enter('mainMenu', ctx.scene.session);
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const editProjectNameScene = new Scenes.WizardScene(
    'editProjectName',
    editProjectName,
    handleEditProjectName,
);

export { editProjectNameScene };
