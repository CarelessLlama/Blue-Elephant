import createDebug from 'debug';
import { Markup } from 'telegraf';

import { getProjectsFromDb, loadProjectFromDb } from '../db/functions';
import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import {
    getResponse,
    getUserId,
    storeProjectInSession,
} from '../util/botContext';
import { isBackCommand } from '../util/userInput';
import { goNextStep, makeSceneWithErrorHandling } from '../util/scene';
import { InvalidTextError } from '../exceptions';

const debug = createDebug('bot:existing_projects_command');
const previousMenu = 'mainMenu';

const generateExistingProjects = async (
    ctx: BotContext,
    next: () => Promise<void>,
) => {
    updateSessionDataBetweenScenes(ctx);
    debug(`Entering viewExistingProjects scene.`);
    return goNextStep(ctx, next);
};

const askForProject = async (ctx: BotContext) => {
    const userId = getUserId(ctx);
    const userProjectMap = await getProjectsFromDb(userId);
    storeMapInSession(ctx, userProjectMap);
    const userProjectList = makeProjectList(userProjectMap);
    await ctx.reply(
        `Please choose an existing project that you want to view.`,
        Markup.keyboard([...userProjectList, 'Back']).resize(),
    );
    return ctx.wizard.next();
};

const handleProjectChoice = async (ctx: BotContext) => {
    const text = getResponse(ctx);
    if (isBackCommand(text)) {
        return ctx.scene.enter(previousMenu);
    }
    const projectMap = getMapFromSession(ctx);
    const projectId = projectMap.get(text);
    if (projectId) {
        debug(`User selected to view ${text}`);
        const proj = await loadProjectFromDb(projectId);
        storeProjectInSession(ctx, proj);
        await ctx.reply(`Loading existing project.`, Markup.removeKeyboard());
        return ctx.scene.enter('manageProject', ctx.scene.session);
    } else {
        throw new InvalidTextError(
            'Invalid option. Please select a valid option from the keyboard.',
        );
    }
};

const generateExistingProjectsScene = makeSceneWithErrorHandling(
    'existingProjects',
    debug,
    generateExistingProjects,
    askForProject,
    handleProjectChoice,
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
