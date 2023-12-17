import createDebug from 'debug';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import {
    isBackCommand,
    getProjectMembersFromString,
} from '../../util/userInput';
import { getProject, getResponse } from '../../util/botContext';
import {
    askForProjectMembers,
    goNextStep,
    makeSceneWithErrorHandling,
    returnToPreviousMenuFactory,
    saveProject,
} from '../../util/scene';

const debug = createDebug('bot:delete_people_command');
const previousMenu = 'manageProject';

const deletePeople = async (ctx: BotContext, next: () => Promise<void>) => {
    debug('Entered deletePeople scene.');
    updateSessionDataBetweenScenes(ctx);
    return goNextStep(ctx, next);
};

const handleDeleteProjectMembers = async (
    ctx: BotContext,
    next: () => Promise<void>,
) => {
    const text = getResponse(ctx);
    if (isBackCommand(text)) {
        debug('User indicated to go back');
        return ctx.scene.enter(previousMenu, ctx.scene.session);
    }
    const personArr = getProjectMembersFromString(text);
    const project = getProject(ctx);
    debug(`Removing ${personArr.length} project members: ${personArr}`);
    project.removePersons(personArr);
    return goNextStep(ctx, next);
};

const deletePeopleScene = makeSceneWithErrorHandling(
    'deletePeople',
    debug,
    deletePeople,
    askForProjectMembers,
    handleDeleteProjectMembers,
    saveProject,
    returnToPreviousMenuFactory(previousMenu),
);

export { deletePeopleScene };
