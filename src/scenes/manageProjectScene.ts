import createDebug from 'debug';
import { Markup } from 'telegraf';

import { InvalidTextError } from '../exceptions';
import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import { makeSceneWithErrorHandling } from '../util/scene';
import { getResponse } from '../util/botContext';
import { isBackCommand } from '../util/userInput';

const debug = createDebug('bot:generate_existing_projects_command');

const manageProject = async (ctx: BotContext) => {
    debug(`Entering manageProject scene.`);
    updateSessionDataBetweenScenes(ctx);
    await ctx.reply(
        `Project retrieved. What do you want to do?`,
        Markup.keyboard([
            ['View Project Details'],
            ['Generate Groupings'],
            ['Reset Interactions'],
            ['Edit Project', 'Delete Project', 'Back'],
        ]).resize(),
    );
    return ctx.wizard.next();
};

const handleManageProjectOption = async (ctx: BotContext) => {
    const text = getResponse(ctx);
    if (isBackCommand(text)) {
        debug('User selected "Back"');
        return ctx.scene.enter('existingProjects', ctx.scene.session);
    }
    switch (text) {
        case 'View Project Details': {
            return ctx.scene.enter('viewProject', ctx.scene.session);
        }
        case 'Generate Groupings': {
            debug('User selected "Generate Groupings"');
            return ctx.scene.enter('generateGroupings', ctx.scene.session);
        }
        case 'Reset Interactions': {
            debug('User selected "Reset Interactions"');
            return ctx.scene.enter('resetInteractions', ctx.scene.session);
        }
        case 'Edit Project': {
            debug('User selected "Edit Project"');
            return ctx.scene.enter('editProject', ctx.scene.session);
        }
        case 'Delete Project': {
            debug('User selected "Delete Project"');
            return ctx.scene.enter('deleteProject', ctx.scene.session);
        }
        default: {
            throw new InvalidTextError(
                'Invalid option. Please select a valid option from the keyboard.',
            );
        }
    }
};

const manageProjectScene = makeSceneWithErrorHandling(
    'manageProject',
    debug,
    manageProject,
    handleManageProjectOption,
);

export { manageProjectScene };
