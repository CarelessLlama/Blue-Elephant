import createDebug from 'debug';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import {
    askForProjectName,
    goNextStep,
    handleEditProjectNameFactory,
    makeSceneWithErrorHandling,
    returnToPreviousMenuFactory,
    saveProject,
} from '../../util/scene';

const debug = createDebug('bot:edit_project_name_command');
const previousMenu = 'editProject';

const editProjectName = async (ctx: BotContext, next: () => Promise<void>) => {
    debug('Entered editProjectName scene.');
    updateSessionDataBetweenScenes(ctx);
    return goNextStep(ctx, next);
};

const editProjectNameScene = makeSceneWithErrorHandling(
    'editProjectName',
    debug,
    editProjectName,
    askForProjectName,
    handleEditProjectNameFactory(previousMenu),
    saveProject,
    returnToPreviousMenuFactory(previousMenu),
);

export { editProjectNameScene };
