import createDebug from 'debug';
import { Markup } from 'telegraf';

import { getProjectsFromDb, loadProjectFromDb } from '../db/functions';
import { BotContext } from '../BotContext';
import {
    getResponse,
    getUserId,
    storeProjectInSession,
} from '../util/botContext';
import { isBackCommand } from '../util/userInput';
import { makeSceneWithErrorHandling } from '../util/scene';
import { InvalidTextError } from '../exceptions';

const debug = createDebug('bot:existing_projects_command');

const viewExistingProjectNames = async (ctx: BotContext) => {
    const userId = getUserId(ctx);
    debug(`Entering viewExistingProjects scene.`);
    const userProjectMap = await getProjectsFromDb(userId);
    storeMapInSession(ctx, userProjectMap);
    const userProjectList = makeProjectList(userProjectMap);
    await ctx.reply(
        `Please choose an existing project that you want to view.`,
        Markup.keyboard([...userProjectList, 'Back']).resize(),
    );
    return ctx.wizard.next();
};

const handleExistingProjects = async (ctx: BotContext) => {
    const text = getResponse(ctx);
    // search for existing projects based on project names in DB
    const projectMap = getMapFromSession(ctx);
    if (projectMap.has(text)) {
        debug(`User selected to view ${text}`);
        const projectId = projectMap.get(text) as string; // guaranteed to be in map
        const proj = await loadProjectFromDb(projectId);
        storeProjectInSession(ctx, proj);
        await ctx.reply(`Loading existing project.`, Markup.removeKeyboard());
        return ctx.scene.enter('manageProject', ctx.scene.session);
    } else if (isBackCommand(text)) {
        return ctx.scene.enter('mainMenu');
    } else {
        throw new InvalidTextError(
            'Invalid option. Please select a valid option from the keyboard.',
        );
    }
};

const generateExistingProjectsScene = makeSceneWithErrorHandling(
    'existingProjects',
    debug,
    viewExistingProjectNames,
    handleExistingProjects,
);

export { generateExistingProjectsScene };

function storeMapInSession(
    ctx: BotContext,
    userProjectMap: Map<string, string>,
): void {
    ctx.scene.session.projectMap = userProjectMap;
}

function getMapFromSession(ctx: BotContext): Map<string, string> {
    return ctx.scene.session.projectMap;
}

function makeProjectList(userProjectMap: Map<string, string>): string[] {
    const userProjectList = [...userProjectMap.keys()];
    return userProjectList;
}
