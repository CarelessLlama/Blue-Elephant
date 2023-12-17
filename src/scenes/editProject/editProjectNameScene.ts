import createDebug from 'debug';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import {
    askForProjectName,
    handleEditProjectNameFactory,
    makeSceneWithErrorHandling,
    returnToPreviousMenuFactory,
    saveProject,
} from '../../util/scene';

const debug = createDebug('bot:edit_project_name_command');
const previousMenu = 'editProject';

const editProjectName = async (ctx: BotContext) => {
    debug('Entered editProjectName scene.');
    updateSessionDataBetweenScenes(ctx);
    return ctx.wizard.next();
};

const editProjectNameScene = makeSceneWithErrorHandling(
    'editProjectName',
    debug,
    editProjectName,
    askForProjectName,
    handleEditProjectNameFactory(debug, previousMenu),
    saveProject,
    returnToPreviousMenuFactory(previousMenu),
);

export { editProjectNameScene };
