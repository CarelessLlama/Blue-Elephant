import createDebug from 'debug';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import { getProject } from '../util/botContext';
import { makeSceneWithErrorHandling } from '../util/scene';

const debug = createDebug('bot:view_project_details_command');

/**
 * Views a project from the database.
 * @returns A middleware function that handles the viewing of a project information.
 */
const viewProject = async (ctx: BotContext) => {
    updateSessionDataBetweenScenes(ctx);
    debug(`Entering viewProject scene.`);
    const project = getProject(ctx);
    await ctx.reply(project.toString());
    return ctx.scene.enter('manageProject', ctx.scene.session);
};

const viewProjectScene = makeSceneWithErrorHandling(
    'viewProject',
    debug,
    viewProject,
);

export { viewProjectScene };
