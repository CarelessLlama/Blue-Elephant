import createDebug from 'debug';
import { Markup } from 'telegraf';

import { getProjectsFromDb } from '../db/functions';
import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import { getUserId, storeMapInSession } from '../util/botContext';
import {
    goNextStep,
    handleProjectChoiceFactory,
    makeSceneWithErrorHandling,
    waitForUserResponse,
} from '../util/scene';

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
    return waitForUserResponse(ctx);
};

const handleProjectChoice = handleProjectChoiceFactory(debug, previousMenu);

const generateExistingProjectsScene = makeSceneWithErrorHandling(
    'existingProjects',
    debug,
    generateExistingProjects,
    askForProject,
    handleProjectChoice,
);

export { generateExistingProjectsScene };

function makeProjectList(userProjectMap: Map<string, string>): string[] {
    const userProjectList = [...userProjectMap.keys()];
    return userProjectList;
}
