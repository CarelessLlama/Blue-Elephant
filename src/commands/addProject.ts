import createDebug from 'debug';

import { author, name, version } from '../../package.json';


const debug = createDebug('bot:add_project_command');

/**
 * Creates a new project in the database.
 * @returns A middleware function that handles the creation of a project.
 */
const addProject = () => async (ctx: any) => {
    try {
        // Add project creation logic here
        const message = `You have successfully created a project named ${ctx.projectName}.`;
        debug(`${name} has created a project named ${ctx.projectName}.`);
        await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    } catch (error) {
        debug(error);
        await ctx.replyWithMarkdownV2(`Oops, unable to create project! Please try again later.`, { parse_mode: 'Markdown' });
    }
};

export { addProject };
