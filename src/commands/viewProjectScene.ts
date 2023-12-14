import createDebug from 'debug';

import { author, name, version } from '../../package.json';

const debug = createDebug('bot:add_project_command');

/**
 * Views a project from the database.
 * @returns A middleware function that handles the viewing of a project information.
 */
const viewProject = () => async (ctx: any) => {
    try {
        // Add project viewing logic here
        let message = `Here are the information regarding the project ${ctx.projectName}:\n\n*Project Name:* ${ctx.projectName}\n*Project Description:* ${ctx.projectDescription}\nThe members are as follows:\n`;
        for (const name in ctx.projectMembers) {
            message += `*Project Member:* ${name}\n`;
        }
        debug(
            `${name} has requested information about a project named ${ctx.projectName}.`,
        );
        await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    } catch (error) {
        debug(error);
        await ctx.replyWithMarkdownV2(
            `Oops, unable to view project information! Please try again later.`,
            { parse_mode: 'Markdown' },
        );
    }
};

export { viewProject };
