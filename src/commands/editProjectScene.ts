import createDebug from 'debug';

import { Scenes } from 'telegraf';

import { BotContext, updateSessionDataBetweenScenes } from './../BotContext';

const debug = createDebug('bot:add_project_command');

/**
 * Edits an existing project in the database.
 * @returns A middleware function that handles the editing of a project.
 */
const editProject = async (ctx: BotContext) => {
    debug('Entered editProject scene.');
    updateSessionDataBetweenScenes(ctx);
    // Add project edition logic here
};

const editProjectScene = new Scenes.WizardScene<BotContext>(
    'editProject',
    editProject,
);

export { editProjectScene };
