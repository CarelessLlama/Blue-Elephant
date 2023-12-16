import createDebug from 'debug';

import { Scenes } from 'telegraf';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';

const debug = createDebug('bot:view_project_details_command');

/**
 * Views a project from the database.
 * @returns A middleware function that handles the viewing of a project information.
 */
const viewProject = async (ctx: BotContext) => {
    updateSessionDataBetweenScenes(ctx);
    debug(`Entering viewProject scene.`);
    let out = `Project Details are as follows:\n`;
    out += `Project Name: ${ctx.scene.session.project.getName()}\n`;
    out += `Project Description: ${ctx.scene.session.project.getDescription()}\n`;
    out += `Project Members: ${ctx.scene.session.project.getPersons()}\n`;
    await ctx.reply(out);
    return ctx.scene.enter('manageProject', ctx.scene.session);
};

const viewProjectScene = new Scenes.WizardScene<BotContext>(
    'viewProject',
    viewProject,
);

export { viewProjectScene };
