import createDebug from 'debug';
import { MiddlewareFn } from 'telegraf';

import { BotContext, updateSessionDataBetweenScenes } from '../BotContext';
import {
    askAndHandleMenuFactory,
    goNextStep,
    goToScene,
    makeSceneWithErrorHandling,
} from '../util/scene';

const debug = createDebug('bot:manage_projects_command');
const previousMenu = 'existingProjects';

const manageProject = async (ctx: BotContext, next: () => Promise<void>) => {
    debug(`Entering manageProject scene.`);
    updateSessionDataBetweenScenes(ctx);
    return goNextStep(ctx, next);
};

const question = `What do you want to do?`;
const mapOptionToScene = new Map<string, MiddlewareFn<BotContext>>([
    ['View Project Details', async (ctx) => goToScene('viewProject', ctx)],
    ['Generate Groupings', async (ctx) => goToScene('generateGroupings', ctx)],
    ['Reset Interactions', async (ctx) => goToScene('resetInteractions', ctx)],
    ['Edit Project', async (ctx) => goToScene('editProject', ctx)],
    ['Delete Project', async (ctx) => goToScene('deleteProject', ctx)],
]);

const [askForMenuChoice, handleMenuChoice] = askAndHandleMenuFactory(
    debug,
    previousMenu,
    question,
    mapOptionToScene,
);

const manageProjectScene = makeSceneWithErrorHandling(
    'manageProject',
    debug,
    manageProject,
    askForMenuChoice,
    handleMenuChoice,
);

export { manageProjectScene };
