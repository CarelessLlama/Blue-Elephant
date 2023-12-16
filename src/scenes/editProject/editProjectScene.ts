import createDebug from 'debug';

import { Markup } from 'telegraf';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import { makeSceneWithErrorHandling } from '../../util/scene';
import { getResponse } from '../../util/botContext';
import { isBackCommand } from '../../util/userInput';

const debug = createDebug('bot:edit_project_command');

/**
 * Edits an existing project in the database.
 * @returns A middleware function that handles the editing of a project.
 */
const editProject = async (ctx: BotContext) => {
    debug('Entered editProject scene.');
    updateSessionDataBetweenScenes(ctx);
    // Add project edition logic here
    await ctx.reply(
        `What do you want to edit?`,
        Markup.keyboard([
            ['Add People', 'Delete People'],
            ['Edit Project Name', 'Edit Project Description'],
            ['Back'],
        ]).resize(),
    );
    return ctx.wizard.next();
};

const handleEditProjectOption = async (ctx: BotContext) => {
    const text = getResponse(ctx);
    if (isBackCommand(text)) {
        debug('User selected "Back"');
        return ctx.scene.enter('manageProject', ctx.scene.session);
    }
    switch (text) {
        case 'Add People': {
            debug('User selected "Add People"');
            return ctx.scene.enter('addPeople', ctx.scene.session);
        }
        case 'Delete People': {
            debug('User selected "Delete People"');
            return ctx.scene.enter('deletePeople', ctx.scene.session);
        }
        case 'Edit Project Name': {
            debug('User selected "Edit Project Name"');
            return ctx.scene.enter('editProjectName', ctx.scene.session);
        }
        case 'Edit Project Description': {
            debug('User selected "Edit Project Description"');
            return ctx.scene.enter('editProjectDescription', ctx.scene.session);
        }
        default: {
            await ctx.reply(
                'Invalid option. Please select a valid option from the keyboard.',
            );
            return ctx.wizard.back();
        }
    }
};

const editProjectScene = makeSceneWithErrorHandling(
    'editProject',
    debug,
    editProject,
    handleEditProjectOption,
);

export { editProjectScene };
