import createDebug from 'debug';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import {
    askForProjectMembers,
    goNextStep,
    handleAddProjectMembersFactory,
    makeSceneWithErrorHandling,
    returnToPreviousMenuFactory,
    saveProject,
} from '../../util/scene';

const debug = createDebug('bot:add_people_command');
const previousMenu = 'manageProject';

const addPeople = async (ctx: BotContext, next: () => Promise<void>) => {
    debug('Entered addPeople scene.');
    updateSessionDataBetweenScenes(ctx);
    return goNextStep(ctx, next);
};

const addPeopleScene = makeSceneWithErrorHandling(
    'addPeople',
    debug,
    addPeople,
    askForProjectMembers,
    handleAddProjectMembersFactory(debug, previousMenu),
    saveProject,
    returnToPreviousMenuFactory(previousMenu),
);

export { addPeopleScene };
