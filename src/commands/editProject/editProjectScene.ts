import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { UnknownError, InvalidInputTypeError } from '../../exceptions';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';

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
            ['Add Person', 'Delete Person'],
            ['Edit Project Name', 'Edit Project Description'],
            ['Back'],
        ]).resize(),
    );
    return ctx.wizard.next();
};

const handleEditProjectOption = async (ctx: BotContext) => {
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
        if (ctx.message?.text === 'Add Person') {
            debug('User selected "Add Person"');
            // TODO: add person scene
            // return ctx.scene.enter('addPerson', ctx.scene.session);
            await ctx.reply('This feature is not yet implemented.');
            return ctx.scene.enter('mainMenu');
        } else if (ctx.message?.text === 'Delete Person') {
            debug('User selected "Delete Person"');
            // TODO: delete person scene
            // return ctx.scene.enter('deletePerson', ctx.scene.session);
            await ctx.reply('This feature is not yet implemented.');
            return ctx.scene.enter('mainMenu');
        } else if (ctx.message?.text === 'Edit Project Name') {
            debug('User selected "Edit Project Name"');
            return ctx.scene.enter('editProjectName', ctx.scene.session);
        } else if (ctx.message?.text === 'Edit Project Description') {
            debug('User selected "Edit Project Description"');
            return ctx.scene.enter('editProjectDescription', ctx.scene.session);
        } else if (ctx.message?.text === 'Back') {
            debug('User selected "Back"');
            return ctx.scene.enter('manageProject', ctx.scene.session);
        } else {
            await ctx.reply(
                'Invalid option. Please select a valid option from the keyboard.',
            );
            return ctx.wizard.back();
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const editProjectScene = new Scenes.WizardScene<BotContext>(
    'editProject',
    editProject,
    handleEditProjectOption,
);

export { editProjectScene };
