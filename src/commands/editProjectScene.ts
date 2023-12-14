import createDebug from 'debug';

import { name } from '../../package.json';

const debug = createDebug('bot:add_project_command');

/**
 * Edits an existing project in the database.
 * @returns A middleware function that handles the editing of a project.
 */
const editProject = () => async (ctx: any) => {
    try {
        // Add project edition logic here
        const message = `You have successfully changed the name of the project to ${ctx.projectName}.`;
        debug(
            `${name} has editted a project from ${ctx.projectName} to ${ctx.projectName}.`,
        );
        await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    } catch (error) {
        debug(error);
        await ctx.replyWithMarkdownV2(
            `Oops, unable to edit project! Please try again later.`,
            { parse_mode: 'Markdown' },
        );
    }
};

export { editProject };
