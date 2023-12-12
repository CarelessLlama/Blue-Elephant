import createDebug from 'debug';

import { author, name, version } from '../../package.json';

const debug = createDebug('bot:add_project_command');

/**
 * Deletes a project from the database.
 * @returns A middleware function that handles the deletion of a project.
 */
const deleteProject = () => async (ctx: any) => {
    try {
        // Add project deletion logic here
        let message = `Successfully deleted the project ${ctx.projectName}!`;
        debug(`${name} has deleted a project named ${ctx.projectName}.`);
        await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    } catch (error) {
        debug(error);
        await ctx.replyWithMarkdownV2(
            `Oops, unable to view project information! Please try again later.`,
            { parse_mode: 'Markdown' },
        );
    }
};

export { deleteProject };
